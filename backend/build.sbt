ThisBuild / scalaVersion := "2.13.18"
ThisBuild / organization := "com.parrot669"
ThisBuild / version := "0.1.0-SNAPSHOT"

lazy val root = (project in file("."))
  .settings(
    name := "parrot669-backend",
    libraryDependencies ++= Seq(
      "org.typelevel" %% "cats-effect" % "3.7.1",
      "org.http4s" %% "http4s-ember-server" % "0.23.30",
      "org.http4s" %% "http4s-dsl" % "0.23.30",
      "org.http4s" %% "http4s-circe" % "0.23.30",
      "io.circe" %% "circe-generic" % "0.14.10"
    )
  )
