# PARROT 669 product context

This file is the handoff/source-of-truth for continuing product work if chat context is lost.

## Current product

PARROT 669 is evolving from a Barcelona property verification/local-service site into a neutral housing availability + trust layer.

Current MVP principle:

- PARROT shows host-reported physical availability.
- A host may connect an Airbnb iCal export. PARROT imports Airbnb events but only `SUMMARY:Reserved` events reduce physical availability. `Airbnb (Not available)` is stored as platform-specific unavailability and does not block PARROT physical availability.
- PARROT does not book, take payment, copy listing descriptions/photos/prices, or define the legal rental term.
- Rental terms live with the host / external platform.
- Airbnb is currently the first external transaction/listing endpoint. An external listing is optional: a property with host-reported availability remains searchable when no outbound link is attached.

## Current user flows

### Guest
1. Open `/search.html`.
2. Choose a city (currently only Barcelona), then search by dates, bedrooms and sleeping places. Accommodation type is a result filter alongside pricing filters and defaults to any. Search criteria and filter state are persisted in browser localStorage; returning from the host screen restores them and re-runs the last performed search. Changing any result filter after a search re-runs that search immediately.
3. Results show:
   - host nickname,
   - bedrooms,
   - sleeping places,
   - host minimum stay,
   - host-reported PARROT availability,
   - optional indicative price when every requested night has a nightly price,
   - external Airbnb link when the host has attached one; otherwise the result explicitly says that no external link is available yet.
4. Minimum stay is enforced by backend search.
4a. Guest can choose all results or only results with complete nightly pricing, and may filter by minimum/maximum estimated total price for the requested stay. Results with a known price are sorted cheapest first; results without a complete price come last. If any requested night lacks a price, no price estimate is shown and the property is excluded from priced-only and price-range search.
4b. Optional cleaning fee belongs to the PARROT property, not to the external listing, and is included in the displayed estimate when known. An external listing has an independent `showInSearch` flag: it may remain connected for calendar sync while its outbound URL is hidden from guest search results.
5. Property title shown to guests is the same title entered by the owner; Barcelona is not used as the result title.
6. Date ranges use hotel-style [check-in, checkout) semantics: checkout day is not occupied and same-day check-in/check-out is invalid.

### Host
1. Open `/host.html`.
2. Register or log in with email/password. Authentication uses a server-side session in an HttpOnly cookie; host credentials are not stored in frontend JavaScript/localStorage.
3. Choose a city (currently only Barcelona), create a property and choose whether it is an entire place or a private room. New properties start with a 1-day minimum stay.
3a. Accommodation type, minimum stay and optional cleaning fee are visible property settings and can be edited after creation, independently of any external listing. Property cards are collapsed by default to a compact summary and can be expanded for editing.
4. Supply Airbnb listing ID (the number after `/rooms/`), not a full URL. Calendar sync is available only while this external listing exists. Removing the listing also removes its connected Airbnb calendar.
5. PARROT generates the canonical Airbnb URL. The host may hide that URL from guest search without disconnecting the listing or calendar.
6. Add/update/delete PARROT availability periods; each period may optionally carry a nightly price in EUR.
6a. New/updated availability periods may not overlap. Adjacent periods are allowed and can have different prices.
6b. Search stitches adjacent periods together by requested night, so a stay may span multiple adjacent rows as long as every night is covered.
7. Delete external listing or whole property.
8. On every host-page load, the frontend calls `GET /api/auth/me` and then fetches the owner dashboard through the authenticated session.
9. Legacy profiles created before account auth remain claimable with their old `profileId + editToken` exactly once. Successful claim attaches the legacy profile to the current account, deletes the newly-created empty profile, clears the legacy token hash, and frontend removes the old localStorage credentials. The edit token is not accepted by normal owner endpoints.
10. After adding an Airbnb listing, the host can paste Airbnb's private iCal export URL. The listing id embedded in the iCal URL must match the Airbnb listing id already attached to the property.
11. Calendar sync runs immediately on connect, manually via "Sync now", and automatically about once per hour while the calendar is enabled. A disabled calendar keeps its imported snapshot for later re-enable but does not block search and is skipped by automatic sync. Re-enabling triggers an immediate refresh. The raw iCal URL is never returned by the API or rendered back to the browser after connection.
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
- V8 property accommodation type (`entire_place` or `private_room`); existing properties are migrated to `entire_place`
- V9 moves cleaning fee to the property and adds enabled/disabled state for external calendars
- V10 adds per-listing search-link visibility and removes orphan external calendars
- V11 adds accounts, server-side sessions, optional profile ownership by account, nullable legacy edit-token hashes, and the reserved password-reset-token model

Current important endpoints:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/auth/claim-legacy` is the temporary authenticated migration path for old edit-token profiles
- `GET /api/dashboard` (owner-only, session required)
- `POST /api/properties` (owner-only, session required)
- `GET /api/profiles/:profileId/dashboard` and `POST /api/profiles/:profileId/properties` remain authenticated compatibility aliases; the profile id is checked against the session identity and is not a credential
- `PUT /api/properties/:propertyId` updates minimum stay and optional property cleaning fee
- `DELETE /api/properties/:propertyId`
- `POST /api/properties/:propertyId/listings`
- `DELETE /api/listings/:listingId`
- `GET|POST /api/properties/:propertyId/availability`
- `PUT|DELETE /api/availability/:availabilityId`
- `PUT /api/listings/:listingId` updates whether the external link is shown in guest search; the listing can remain connected for calendar sync while hidden
- `GET /api/search?city=Barcelona&from=...&to=...&bedrooms=...&sleeps=...&accommodationType=any|entire_place|private_room&pricedOnly=true|false&minPriceCents=...&maxPriceCents=...`; results are sorted by final estimated stay price ascending, with unknown prices last
- `POST /api/properties/:propertyId/calendars` connects/upserts an Airbnb iCal source and immediately syncs it
- `POST /api/calendars/:calendarId/sync` manually refreshes an enabled source
- `PUT /api/calendars/:calendarId` enables/disables the source
- `DELETE /api/calendars/:calendarId` disconnects it

CI runs compile + PostgreSQL end-to-end smoke test + Docker image build.

## Frontend

Repository: `lelik112/parrot669`

Hosted on Cloudflare Workers/static assets.

Worker proxies:
- public `/api/search` to Railway
- restricted browser auth/host routes under `/api/host/*`; the Worker strips the `/api/host` prefix and forwards them to Railway backend `/api/*`. Example: browser `PUT /api/host/calendars/:id` becomes backend `PUT /api/calendars/:id`.
- Host proxy forwards the session Cookie upstream and Set-Cookie back to the browser, does not forward the old `X-Parrot-Token`, and rejects cross-origin state-changing browser requests when an Origin header is present.

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
`host offer covers every requested night AND no imported reservation from an enabled calendar covers any requested night`.

The iCal URL is a secret capability link. It is stored server-side because it must be fetched, but never returned in dashboard/public APIs. TODO before serious scale: encrypt calendar URLs at rest with an application-managed key.

Calendar connection validation is deliberately strict: the listing id must match the property's Airbnb listing id exactly and the path must be `/calendar/ical/<listingId>.ics`. HTTPS links on `airbnb.com` and localized Airbnb hosts such as `airbnb.ru`, `airbnb.es` or `airbnb.co.uk` are accepted; localized hosts are normalized to `www.airbnb.com` before the server fetch, so redirects stay disabled and no user-controlled host is fetched. Lookalike hosts remain rejected. If reconnecting or replacing a calendar URL fails, PARROT keeps the last successful event snapshot, so known reservations continue to block search until a later successful sync replaces them.

## Auth / contact direction

Owner authentication is account/session based:

- `accounts` is the login identity and stores normalized unique email plus an Argon2id password hash.
- `profiles` remains the domain identity shown to guests and owns properties. For the MVP one account owns one host profile through `profiles.account_id`.
- Host authorization is ownership-based, not role-based: an authenticated account can mutate only resources belonging to its profile. "Host" is not an RBAC role.
- Sessions are opaque 256-bit random tokens. The browser receives the raw token only as a `HttpOnly; SameSite=Lax` cookie; production also sets `Secure`. The database stores only SHA-256 session-token hashes.
- Sessions expire after 30 days, multiple active sessions are allowed, login creates a fresh session, and logout deletes the server-side session.
- Login errors do not distinguish unknown email from wrong password. A simple per-instance limiter caps repeated failures per normalized email; a distributed limiter can replace it if traffic or horizontal scaling justifies it.
- Password recovery is not exposed yet because the backend has no mail provider. V11 reserves a hashed, expiring `password_reset_tokens` model so request/confirm endpoints can be added together with real email delivery rather than a fake reset flow.
- Legacy `access_token_hash` is migration-only. Normal owner routes ignore `X-Parrot-Token`; successful legacy claim nulls the old hash.

Before exposing owner contact or messaging broadly, add profile/privacy controls.

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
- Connect a backend email provider and add real password-reset request/confirm endpoints using the reserved reset-token model.
- Add owner messaging/privacy preferences.
- Upgrade Flyway or align Postgres version (Railway currently warns PostgreSQL 18 is newer than tested Flyway support).
