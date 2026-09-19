package com.parrot669.backend

import cats.effect._
import cats.effect.kernel.Clock
import cats.syntax.all._
import com.comcast.ip4s._
import io.circe.generic.auto._
import io.circe.syntax._
import org.http4s._
import org.http4s.circe.CirceEntityCodec._
import org.http4s.dsl.Http4sDsl
import org.http4s.ember.server.EmberServerBuilder

import java.net.URI
import java.time.{Instant, LocalDate, ZoneOffset}
import java.time.temporal.ChronoUnit
import java.util.UUID
import scala.util.Try

final case class Profile(
    id: String,
    parrotId: String,
    displayName: String,
    contact: String,
    createdAt: String
)

final case class ExternalListing(
    id: String,
    profileId: String,
    platform: String,
    url: String,
    createdAt: String
)

final case class Verification(
    id: String,
    profileId: String,
    listingId: Option[String],
    claim: String,
    method: String,
    verifiedAt: String,
    expiresAt: Option[String],
    challengeId: Option[String]
)

final case class VerificationChallenge(
    id: String,
    listingId: String,
    kind: String,
    blockDates: List[String],
    leaveAvailable: List[String],
    createdAt: String,
    expiresAt: String,
    status: String
)

final case class PublicProfile(
    profile: Profile,
    listings: List[ExternalListing],
    verifications: List[Verification]
)

final case class CreateProfileRequest(displayName: String, contact: String)
final case class AddListingRequest(platform: String, url: String)

final case class State(
    profiles: Map[String, Profile],
    profileByParrotId: Map[String, String],
    listings: Map[String, ExternalListing],
    challenges: Map[String, VerificationChallenge],
    verifications: Map[String, Verification]
)

object State {
  val empty: State = State(Map.empty, Map.empty, Map.empty, Map.empty, Map.empty)
}

sealed trait ApiError {
  def message: String
}
object ApiError {
  final case class Invalid(message: String) extends ApiError
  final case class NotFound(message: String) extends ApiError
  final case class Conflict(message: String) extends ApiError
}

final class ParrotService[F[_]: Async](state: Ref[F, State]) {

  private def now: F[Instant] =
    Clock[F].realTimeInstant

  private def newId: F[String] =
    Async[F].delay(UUID.randomUUID().toString)

  private def newParrotId: F[String] =
    Async[F].delay {
      val suffix = UUID.randomUUID().toString.replace("-", "").take(6).toUpperCase
      s"P669-$suffix"
    }

  private def normalized(value: String): String =
    Option(value).fold("")(_.trim)

  private def validateProfile(req: CreateProfileRequest): Either[ApiError, Unit] = {
    val name = normalized(req.displayName)
    val contact = normalized(req.contact)

    if (name.isEmpty) Left(ApiError.Invalid("displayName is required"))
    else if (name.length > 120) Left(ApiError.Invalid("displayName is too long"))
    else if (contact.isEmpty) Left(ApiError.Invalid("contact is required"))
    else if (contact.length > 200) Left(ApiError.Invalid("contact is too long"))
    else Right(())
  }

  private def isAirbnbUrl(raw: String): Boolean =
    Try(new URI(raw)).toOption.exists { uri =>
      val host = Option(uri.getHost).fold("")(_.toLowerCase)
      uri.getScheme == "https" &&
      host.matches("(^|.*\\.)airbnb\\.[a-z.]+$")
    }

  private def validateListing(req: AddListingRequest): Either[ApiError, Unit] = {
    val platform = normalized(req.platform).toLowerCase
    val url = normalized(req.url)

    if (platform != "airbnb") Left(ApiError.Invalid("only airbnb is supported in v0"))
    else if (!isAirbnbUrl(url)) Left(ApiError.Invalid("url must be an https Airbnb listing URL"))
    else Right(())
  }

  def createProfile(req: CreateProfileRequest): F[Either[ApiError, Profile]] =
    validateProfile(req) match {
      case Left(error) => error.asLeft[Profile].pure[F]
      case Right(_) =>
        for {
          id <- newId
          parrotId <- newParrotId
          createdAt <- now
          profile = Profile(
            id = id,
            parrotId = parrotId,
            displayName = normalized(req.displayName),
            contact = normalized(req.contact),
            createdAt = createdAt.toString
          )
          result <- state.modify { current =>
            if (current.profileByParrotId.contains(parrotId))
              current -> ApiError.Conflict("PARROT ID collision, retry").asLeft[Profile]
            else {
              val next = current.copy(
                profiles = current.profiles.updated(id, profile),
                profileByParrotId = current.profileByParrotId.updated(parrotId, id)
              )
              next -> profile.asRight[ApiError]
            }
          }
        } yield result
    }

  def addListing(profileId: String, req: AddListingRequest): F[Either[ApiError, ExternalListing]] =
    validateListing(req) match {
      case Left(error) => error.asLeft[ExternalListing].pure[F]
      case Right(_) =>
        for {
          id <- newId
          createdAt <- now
          listing = ExternalListing(
            id = id,
            profileId = profileId,
            platform = "airbnb",
            url = normalized(req.url),
            createdAt = createdAt.toString
          )
          result <- state.modify { current =>
            if (!current.profiles.contains(profileId))
              current -> ApiError.NotFound("profile not found").asLeft[ExternalListing]
            else if (current.listings.values.exists(_.url == listing.url))
              current -> ApiError.Conflict("listing already registered").asLeft[ExternalListing]
            else
              current.copy(listings = current.listings.updated(id, listing)) ->
                listing.asRight[ApiError]
          }
        } yield result
    }

  def createCalendarChallenge(listingId: String): F[Either[ApiError, VerificationChallenge]] =
    for {
      id <- newId
      createdAt <- now
      challenge <- Async[F].delay {
        val seed = math.abs(id.hashCode % 40)
        val first = LocalDate.now(ZoneOffset.UTC).plusDays(30L + seed.toLong)
        VerificationChallenge(
          id = id,
          listingId = listingId,
          kind = "calendar_block",
          blockDates = List(first.toString, first.plusDays(2).toString),
          leaveAvailable = List(first.plusDays(1).toString),
          createdAt = createdAt.toString,
          expiresAt = createdAt.plus(2, ChronoUnit.HOURS).toString,
          status = "pending"
        )
      }
      result <- state.modify { current =>
        if (!current.listings.contains(listingId))
          current -> ApiError.NotFound("listing not found").asLeft[VerificationChallenge]
        else {
          val active = current.challenges.values.exists(c =>
            c.listingId == listingId && c.status == "pending" && Instant.parse(c.expiresAt).isAfter(createdAt)
          )
          if (active)
            current -> ApiError.Conflict("listing already has an active challenge").asLeft[VerificationChallenge]
          else
            current.copy(challenges = current.challenges.updated(id, challenge)) ->
              challenge.asRight[ApiError]
        }
      }
    } yield result

  def markChallengePassed(challengeId: String): F[Either[ApiError, Verification]] =
    for {
      verifiedAt <- now
      verificationId <- newId
      result <- state.modify { current =>
        current.challenges.get(challengeId) match {
          case None =>
            current -> ApiError.NotFound("challenge not found").asLeft[Verification]

          case Some(challenge) if challenge.status == "passed" =>
            current.verifications.values.find(_.challengeId.contains(challengeId)) match {
              case Some(existing) => current -> existing.asRight[ApiError]
              case None => current -> ApiError.Conflict("challenge already passed").asLeft[Verification]
            }

          case Some(challenge) if Instant.parse(challenge.expiresAt).isBefore(verifiedAt) =>
            current -> ApiError.Conflict("challenge expired").asLeft[Verification]

          case Some(challenge) =>
            current.listings.get(challenge.listingId) match {
              case None =>
                current -> ApiError.NotFound("listing not found").asLeft[Verification]

              case Some(listing) =>
                val verification = Verification(
                  id = verificationId,
                  profileId = listing.profileId,
                  listingId = Some(listing.id),
                  claim = "controls_listing",
                  method = "calendar_challenge",
                  verifiedAt = verifiedAt.toString,
                  expiresAt = Some(verifiedAt.plus(30, ChronoUnit.DAYS).toString),
                  challengeId = Some(challengeId)
                )
                val passed = challenge.copy(status = "passed")
                val next = current.copy(
                  challenges = current.challenges.updated(challengeId, passed),
                  verifications = current.verifications.updated(verificationId, verification)
                )
                next -> verification.asRight[ApiError]
            }
        }
      }
    } yield result

  def publicProfile(parrotId: String): F[Either[ApiError, PublicProfile]] =
    state.get.map { current =>
      current.profileByParrotId
        .get(parrotId.toUpperCase)
        .flatMap(current.profiles.get)
        .toRight(ApiError.NotFound("profile not found"): ApiError)
        .map { profile =>
          val listings =
            current.listings.values.filter(_.profileId == profile.id).toList.sortBy(_.createdAt)
          val verifications =
            current.verifications.values.filter(_.profileId == profile.id).toList.sortBy(_.verifiedAt)
          PublicProfile(profile, listings, verifications)
        }
    }
}

final class ApiRoutes[F[_]: Async](service: ParrotService[F], adminToken: String)
    extends Http4sDsl[F] {

  private def renderError(error: ApiError): F[Response[F]] =
    error match {
      case ApiError.Invalid(message) =>
        BadRequest(Map("ok" -> false.asJson, "error" -> message.asJson).asJson)
      case ApiError.NotFound(message) =>
        NotFound(Map("ok" -> false.asJson, "error" -> message.asJson).asJson)
      case ApiError.Conflict(message) =>
        Conflict(Map("ok" -> false.asJson, "error" -> message.asJson).asJson)
    }

  private def render[A: io.circe.Encoder](result: Either[ApiError, A], created: Boolean = false): F[Response[F]] =
    result match {
      case Right(value) if created => Created(value)
      case Right(value) => Ok(value)
      case Left(error) => renderError(error)
    }

  private def adminAuthorized(req: Request[F]): Boolean =
    req.headers.headers
      .find(_.name.toString.equalsIgnoreCase("X-Parrot-Admin"))
      .exists(_.value == adminToken)

  val routes: HttpRoutes[F] = HttpRoutes.of[F] {
    case GET -> Root / "health" =>
      Ok(Map("ok" -> true).asJson)

    case req @ POST -> Root / "api" / "profiles" =>
      req.as[CreateProfileRequest].attempt.flatMap {
        case Left(_) => BadRequest(Map("ok" -> false.asJson, "error" -> "invalid json".asJson).asJson)
        case Right(body) => service.createProfile(body).flatMap(render(_, created = true))
      }

    case req @ POST -> Root / "api" / "profiles" / profileId / "listings" =>
      req.as[AddListingRequest].attempt.flatMap {
        case Left(_) => BadRequest(Map("ok" -> false.asJson, "error" -> "invalid json".asJson).asJson)
        case Right(body) => service.addListing(profileId, body).flatMap(render(_, created = true))
      }

    case POST -> Root / "api" / "listings" / listingId / "challenges" =>
      service.createCalendarChallenge(listingId).flatMap(render(_, created = true))

    case req @ POST -> Root / "api" / "challenges" / challengeId / "verify" =>
      if (!adminAuthorized(req))
        Forbidden(Map("ok" -> false.asJson, "error" -> "admin token required".asJson).asJson)
      else
        service.markChallengePassed(challengeId).flatMap(render(_))

    case GET -> Root / "api" / "p" / parrotId =>
      service.publicProfile(parrotId).flatMap(render(_))
  }
}

object Main extends IOApp.Simple {
  override def run: IO[Unit] =
    for {
      state <- Ref.of[IO, State](State.empty)
      service = new ParrotService[IO](state)
      adminToken = sys.env.getOrElse("PARROT_ADMIN_TOKEN", "dev-only-change-me")
      routes = new ApiRoutes[IO](service, adminToken).routes
      _ <- EmberServerBuilder
        .default[IO]
        .withHost(ipv4"0.0.0.0")
        .withPort(port"8080")
        .withHttpApp(routes.orNotFound)
        .build
        .useForever
    } yield ()
}
