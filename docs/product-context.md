# PARROT 669 product context

This file is the handoff/source-of-truth for continuing product work if chat context is lost.

## Current product

PARROT 669 is evolving from a Barcelona property verification/local-service site into a neutral housing availability + trust layer.

Current MVP principle:

- PARROT shows host-reported physical availability.
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
9. On every host-page load, property/listing/availability state is fetched from the backend owner dashboard. localStorage stores credentials only and is not the source of truth for listings or availability.

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

## Known product issue: PARROT availability vs Airbnb availability

PARROT availability is currently independent host-reported data.

Therefore it is possible that:
- PARROT says a period is physically free;
- Airbnb itself shows no availability for those dates.

This is not currently a synchronization bug; it is a data-source mismatch. The UI should call this "PARROT availability" / "host-reported availability".

Likely next step:
- import Airbnb iCal as a second availability source;
- keep provenance/freshness, e.g. source=host or source=airbnb_ical, observedAt;
- decide conflict policy instead of silently pretending sources agree.

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
- Investigate Airbnb iCal import and source reconciliation.
- Replace localStorage edit-token auth with real auth/recovery.
- Add owner messaging/privacy preferences.
- Upgrade Flyway or align Postgres version (Railway currently warns PostgreSQL 18 is newer than tested Flyway support).
