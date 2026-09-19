# PARROT 669 backend — Cats Effect spike

First vertical slice of the PARROT profile/verification backend.

This deliberately does **not** try to be the whole marketplace. It supports one flow:

1. create a profile;
2. receive a human-readable PARROT ID;
3. attach an Airbnb listing;
4. create a calendar challenge;
5. mark the challenge as passed manually;
6. expose the verified `controls_listing` claim in the public profile.

## Stack

- Scala 2.13.18
- Cats Effect 3.7.1
- http4s + Ember
- Circe

The repository is currently **in-memory** via `Ref[F, State]`. That is intentional for the domain/API spike. Restarting the process loses data.

### Important deployment note

The current public site runs as a Cloudflare Worker and D1 would be the cheapest persistence option. A normal JVM/Cats Effect service does not run inside that Worker runtime or get direct D1 bindings.

So this folder is the typed backend/domain spike. Before production persistence we have two sane choices:

- keep the public backend on Cloudflare Worker + D1 and port this domain/API shape to the Worker; or
- deploy this JVM service somewhere and give it a real database (most naturally PostgreSQL).

Do not choose the second option just because Scala is prettier. The business is allowed to have users before acquiring infrastructure opinions.

## Run

From `backend/`:

```bash
export PARROT_ADMIN_TOKEN='change-me'
sbt run
```

Server: `http://localhost:8080`

## API

### Create profile

```bash
curl -s localhost:8080/api/profiles \
  -H 'content-type: application/json' \
  -d '{"displayName":"Alex","contact":"alex@example.com"}'
```

Returns a profile with a PARROT ID such as `P669-A1B2C3`.

### Add Airbnb listing

```bash
curl -s localhost:8080/api/profiles/<profile-id>/listings \
  -H 'content-type: application/json' \
  -d '{"platform":"airbnb","url":"https://www.airbnb.com/rooms/123456"}'
```

### Create calendar-control challenge

```bash
curl -s -X POST localhost:8080/api/listings/<listing-id>/challenges
```

Example shape:

```json
{
  "kind": "calendar_block",
  "blockDates": ["2026-11-03", "2026-11-05"],
  "leaveAvailable": ["2026-11-04"],
  "status": "pending"
}
```

The host changes the real listing calendar to match that pattern.

### Mark challenge passed

For v0 the observation is manual and admin-only:

```bash
curl -s -X POST localhost:8080/api/challenges/<challenge-id>/verify \
  -H 'X-Parrot-Admin: change-me'
```

This creates the claim:

```text
controls_listing
method = calendar_challenge
expires = 30 days
```

It does **not** claim ownership.

### Public profile

```bash
curl -s localhost:8080/api/p/P669-A1B2C3
```

The response contains the profile, external listings and independently named verification claims.

## Claims philosophy

Never expose a generic eternal `verified=true`.

A verification proves one specific claim by one method for a bounded period:

```text
subject: profile
claim: controls_listing
object: Airbnb listing
method: calendar_challenge
verifiedAt: ...
expiresAt: ...
```

Later claims can include:

- `identity`
- `property_address`
- `right_to_rent`
- `ownership`
- `on_site_visit`

Those are deliberately separate because "can edit an Airbnb calendar" and "owns the apartment" are very different statements, despite the internet's heroic efforts to collapse nuance into one green tick.

## Not in v0

- accounts/passwords/OAuth;
- catalogue/search;
- bookings;
- payments;
- messaging;
- automatic Airbnb scraping;
- reviews;
- ownership verification;
- persistent storage.
