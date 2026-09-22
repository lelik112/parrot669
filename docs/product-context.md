# PARROT 669 product context

This file is the handoff/source-of-truth for continuing product work if chat context is lost.

## Current product

PARROT 669 is evolving from a Barcelona property verification/local-service site into a neutral housing availability + trust layer.

Current MVP principle:

- PARROT shows host-reported physical availability.
- A host may connect an Airbnb iCal export. PARROT imports Airbnb events but only `SUMMARY:Reserved` events reduce physical availability. `Airbnb (Not available)` is stored as platform-specific unavailability and does not block PARROT physical availability.
- PARROT does not book, take payment, copy listing descriptions/photos/prices, or define the legal rental term.
- Rental terms live with the host / external platform.
- Airbnb is currently the first external transaction/listing endpoint.

## Current user flows

### Guest
1. Open `/search.html`.
2. Search Barcelona by dates, bedrooms, sleeping places.
3. Results show:
   - host nickname,
   - bedrooms,
   - sleeping places,
   - host minimum stay,
   - host-reported PARROT availability,
   - optional indicative price when every requested night has a nightly price,
   - external Airbnb link.
4. Minimum stay is enforced by backend search.
4a. Guest can choose all results or only results with complete nightly pricing. If any requested night lacks a price, no price estimate is shown and the property is excluded from priced-only search.
4b. Optional cleaning fee belongs to the external listing and is included in the displayed estimate when known.
5. Property title shown to guests is the same title entered by the owner; Barcelona is not used as the result title.
6. Date ranges use hotel-style [check-in, checkout) semantics: checkout day is not occupied and same-day check-in/check-out is invalid.

### Host
1. Open `/host.html`.
2. Create host profile.
3. Create a Barcelona property.
4. Supply Airbnb listing ID (the number after `/rooms/`), not a full URL.
5. PARROT generates the canonical Airbnb URL.
6. Add/update/delete PARROT availability periods; each period may optionally carry a nightly price in EUR.
6a. New/updated availability periods may not overlap. Adjacent periods are allowed and can have different prices.
6b. Search stitches adjacent periods together by requested night, so a stay may span multiple adjacent rows as long as every night is covered.
7. Delete external listing or whole property.
8. Edit token is currently kept in browser localStorage; backend stores only token hash.
9. On every host-page load, property/listing/availability/calendar-sync state is fetched from the backend owner dashboard. localStorage stores credentials only and is not the source of truth for listings or availability.
10. After adding an Airbnb listing, the host can paste Airbnb's private iCal export URL. The listing id embedded in the iCal URL must match the Airbnb listing id already attached to the property.
11. Calendar sync runs immediately on connect, manually via "Sync now", and automatically about once per hour. The raw iCal URL is never returned by the API or rendered back to the browser after connection.
12. Calendar connection errors, including a listing-id mismatch, are shown directly under the calendar form as well as in the page status.

## Barcelona scope

MVP is intentionally Barcelona-only.

Backend persists an internal city code:
- `city_code = barcelona`
- display name: `Barcelona`

Do not accept arbitrary city strings into the product yet. There is no universal standard city ID worth coupling to now. Later options include GeoNames IDs or another geocoding provider, while preserving PARROT's internal stable city code.

## Navigation

Main site exposes one product entry: Housing / Жильё.

Search and host pages have two shared tabs:
- Find availability
- For hosts

## Backend

Repository: `lelik112/parrot669-backend`

Stack:
- Scala 2.13
- Cats Effect
- http4s / Ember
- Doobie / Hikari
- PostgreSQL
- Flyway
- Docker

Production:
- Railway project: `parrot669`
- backend custom domain: `https://api.parrot669.com`
- PostgreSQL on Railway
- healthcheck: `/health`

Important migrations:
- V1 initial profiles/properties/listings/verification
- V2 availability search + bedrooms
- V3 sleeping places + minimum stay + Airbnb external listing ID
- V4 Barcelona-only internal city code
- V5 exclusive checkout semantics and owner-dashboard support; existing inclusive availability end dates are shifted +1 day to preserve their meaning
- V6 optional nightly pricing + external-listing cleaning fee; search stitches adjacent availability periods and supports priced-only filtering
- V7 external calendars + imported event snapshots; Airbnb Reserved events block search, Airbnb (Not available) events are retained but ignored for physical availability

Current important endpoints:
- `POST /api/profiles`
- `GET /api/profiles/:profileId/dashboard` (owner-only, token required)
- `POST /api/profiles/:profileId/properties`
- `DELETE /api/properties/:propertyId`
- `POST /api/properties/:propertyId/listings`
- `DELETE /api/listings/:listingId`
- `GET|POST /api/properties/:propertyId/availability`
- `PUT|DELETE /api/availability/:availabilityId`
- `PUT /api/listings/:listingId` updates optional cleaning fee
- `GET /api/search?city=Barcelona&from=...&to=...&bedrooms=...&sleeps=...&pricedOnly=true|false`
- `POST /api/properties/:propertyId/calendars` connects/upserts an Airbnb iCal source and immediately syncs it
- `POST /api/calendars/:calendarId/sync` manually refreshes the source
- `DELETE /api/calendars/:calendarId` disconnects it

CI runs compile + PostgreSQL end-to-end smoke test + Docker image build.

## Frontend

Repository: `lelik112/parrot669`

Hosted on Cloudflare Workers/static assets.

Worker proxies:
- public `/api/search` to Railway
- restricted host CRUD routes under `/api/host/*`

Languages:
- EN
- ES
- CA
- RU

## Airbnb iCal semantics

Airbnb iCal is connected as an external signal, not as PARROT's authoritative calendar.

Observed Airbnb export distinguishes:
- `SUMMARY:Reserved`: treated as a real reservation and subtracted from PARROT physical availability.
- `SUMMARY:Airbnb (Not available)`: treated as platform-specific unavailability and stored for visibility, but not subtracted from PARROT physical availability.
- any unknown summary: stored as `unknown` and not used to block physical availability until explicitly understood.

PARROT intentionally discards DESCRIPTION and other reservation metadata; it stores only UID, date range, classified kind and observation time.

Search logic is therefore:
`host offer covers every requested night AND no imported reservation covers any requested night`.

The iCal URL is a secret capability link. It is stored server-side because it must be fetched, but never returned in dashboard/public APIs. TODO before serious scale: encrypt calendar URLs at rest with an application-managed key.

Calendar connection validation is deliberately strict: the listing id must match the property's Airbnb listing id exactly and the path must be `/calendar/ical/<listingId>.ics`. HTTPS links on `airbnb.com` and localized Airbnb hosts such as `airbnb.ru`, `airbnb.es` or `airbnb.co.uk` are accepted; localized hosts are normalized to `www.airbnb.com` before the server fetch, so redirects stay disabled and no user-controlled host is fetched. Lookalike hosts remain rejected. If reconnecting or replacing a calendar URL fails, PARROT keeps the last successful event snapshot, so known reservations continue to block search until a later successful sync replaces them.

## Auth / contact direction

Current edit-token-in-localStorage auth is MVP only.

Before exposing owner contact or messaging broadly, implement real authentication and profile/privacy controls.

Desired future owner contact options:
- PARROT message/contact relay;
- public contact if host explicitly opts in;
- both;
- neither.

Search may show host nickname now, but should not expose raw contact by default.

## Verification direction

Longer-term trust claims should stay explicit, e.g.:
- controls_listing
- identity_verified
- property_address_verified
- right_to_rent_verified
- ownership_verified
- on_site_verification

Each claim should have method, verifiedAt, expiresAt. Avoid one vague green "verified" badge.

## Immediate TODO

- Before opening availability writes to meaningful concurrent traffic: clean up any legacy overlapping periods and add a PostgreSQL exclusion constraint on `daterange(date_from, date_to, '[)')` per property. API-level overlap checks remain useful for friendly errors, but are not sufficient against concurrent inserts/updates.
- Improve visual design of housing/search/host UI.
- Replace localStorage edit-token auth with real auth/recovery.
- Add owner messaging/privacy preferences.
- Upgrade Flyway or align Postgres version (Railway currently warns PostgreSQL 18 is newer than tested Flyway support).
