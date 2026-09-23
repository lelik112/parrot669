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
2. Choose a required country and city, then search by dates, bedrooms and sleeping places. Search locations come only from PARROT's own database: countries are derived from stored properties, and cities are derived from stored properties for the selected country. Guest search never calls the external address provider. Accommodation type is a result filter alongside pricing filters and defaults to any. Search criteria and filter state are persisted in browser localStorage; returning from the host screen restores them and re-runs the last performed search. Result filters are applied from their current UI values on every request, so changing any filter after a search immediately re-runs the same base search with the new filter.
3. Results use a product-card hierarchy:
   - property name and city,
   - compact accommodation type / bedrooms / sleeping-place facts,
   - optional indicative price when every requested night has a nightly price,
   - host nickname in a quieter footer,
   - external Airbnb action when the host has attached and published one; otherwise a subdued note says that no external link is available yet.
   - **Write to host** when the owner accepts PARROT messages, independent of external listings. It opens `/messages.html` with the property and requested checkout dates; login/registration is available there.
4. Minimum stay is enforced by backend search but is not displayed as a separate field in guest results.
4a. Guest can choose all results or only results with complete nightly pricing, and may filter by minimum/maximum estimated total price for the requested stay. Results with a known price are sorted cheapest first; results without a complete price come last. If any requested night lacks a price, no price estimate is shown and the property is excluded from priced-only and price-range search.
4b. Optional cleaning fee belongs to the PARROT property, not to the external listing, and is included in the displayed estimate when known. An external listing has an independent `showInSearch` flag: it may remain connected for calendar sync while its outbound URL is hidden from guest search results.
5. Property title shown to guests is the same property name entered by the owner; it is not an internal-only label. Barcelona is not used as the result title.
6. Guest search uses hotel-style [check-in, checkout) semantics: checkout day is not occupied and same-day check-in/check-out is invalid. Owner forms instead select an inclusive range of nights (see below).

### Host
1. Open `/host.html`.
2. Register or log in with email/password. Authentication uses a server-side session in an HttpOnly cookie; host credentials are not stored in frontend JavaScript/localStorage.
3. Choose a country, select a city and street from LocationIQ suggestions, then enter the house number. Create the property and choose whether it is an entire place or a private room. New properties start with a 1-day minimum stay. Owners can edit the address in property characteristics; the exact address and coordinates are private to the owner.
3a. Accommodation type, bedrooms and sleeping places are editable property characteristics. Minimum stay and optional cleaning fee are editable alongside PARROT availability/pricing controls. Property cards are collapsed by default to a compact summary and can be expanded for editing.
4. Supply Airbnb listing ID (the number after `/rooms/`), not a full URL. Calendar sync is available only while this external listing exists. Removing the listing also removes its connected Airbnb calendar.
5. PARROT generates the canonical Airbnb URL. The host may hide that URL from guest search without disconnecting the listing or calendar.
6. Add/update/delete PARROT availability periods; each period may optionally carry a nightly price in EUR. Existing periods show a Save action only after their dates or nightly price have actually changed.
6a. New/updated availability periods may not overlap. Adjacent periods are allowed and can have different prices.
6b. Owner availability and manual unavailability forms include both selected dates. The last date is the last covered night, not checkout. Selecting the same date twice covers one night. For example, September 10–15 at €100/night covers six nights and allows checkout September 16.
6c. API, persisted state and database ranges remain [from, to). Only the host form boundary converts: display API end minus one calendar day; submit selected last night plus one calendar day. Existing coverage and prices are preserved, including repeated edits. Imported iCal ranges and guest search dates are unchanged.
6d. Manual unavailability is a separate section with no price. These blocks override availability in search without deleting or splitting the priced periods; removing a block restores the original coverage. Both endpoints use the same inclusive owner-form convention.
6b. Search stitches adjacent periods together by requested night, so a stay may span multiple adjacent rows as long as every night is covered.
6c. Overlapping availability periods for the same property are rejected twice: application-level checks provide friendly 409 responses, while PostgreSQL V13 enforces the invariant so concurrent writes cannot race past the check.
7. Delete external listing or whole property.
8. On every host-page load, the frontend calls `GET /api/auth/me` and then fetches the owner dashboard through the authenticated session.
9. Owner authentication is account/session-only. The pre-account edit-token migration path has been removed.
10. After adding an Airbnb listing, the host can paste Airbnb's private iCal export URL. The listing id embedded in the iCal URL must match the Airbnb listing id already attached to the property.
11. Calendar sync runs immediately on connect, manually via "Sync now", and automatically about once per hour while the calendar is enabled. A disabled calendar keeps its imported snapshot for later re-enable but does not block search and is skipped by automatic sync. Re-enabling triggers an immediate refresh. The raw iCal URL is never returned by the API or rendered back to the browser after connection.
12. Calendar connection errors, including a listing-id mismatch, are shown directly under the calendar form as well as in the page status.
13. A separate account-level **Guest messages** control enables new enquiries across all owned properties (off by default). The Messages tab opens the same inbox used by guests, with an unread badge.

## Location model

Guest search is no longer architecturally Barcelona-only.

Properties carry normalized `country_code`, `country` and `city`. Guest location selectors are derived from the properties already stored in PostgreSQL:
- `GET /api/locations/countries` returns distinct countries present in properties.
- `GET /api/locations/cities?country=ES` returns distinct cities for that required country.
- Guest search requires both `country` and `city`.
- There is no separate `cities` table and no internal city id at this stage.
- Guest search does not call LocationIQ or another external geocoder.

Host address autocomplete is connected through the authenticated backend/Worker proxy. The selected normalized country/city/address/coordinates/provider place ID are validated and saved on the property. New UI creates require an address selection; existing properties retain their previous location until edited. The external provider is used only for owner input; PARROT's database remains the source for guest discovery. No map is included.

The provider is LocationIQ (`LOCATIONIQ_API_KEY` on the backend). City suggestions
include geographic bounds; street requests pass those bounds, country, city ID and
city name. The backend searches `<city>, <fragment>` with `layers=road`, rejects
neighbors and deduplicates segments. One uncached street lookup uses one provider
call; 15-minute caches and backend pacing protect the quota. Manual house numbers
do not imply provider-verified building coordinates. Existing addresses need no migration.

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
- V11 adds accounts, server-side sessions, profile ownership by account and the reserved password-reset-token model
- V12 removes pre-account edit-token authentication, deletes any remaining unowned legacy profiles, makes `profiles.account_id` mandatory and drops `access_token_hash`
- V13 enforces non-overlapping property availability in PostgreSQL with a GiST exclusion constraint over `[date_from, date_to)`
- V17 adds normalized property `country_code` / `country`, backfills existing properties to `ES / Spain`, and indexes `(country_code, city)` for location discovery
- V21 adds opt-in messaging settings, private property conversations and messages; no changes to property/address/availability tables
- V22 adds directional participant blocks, enforced across all property conversations between the pair

Current important endpoints:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/dashboard` (owner-only, session required)
- `POST /api/properties` (owner-only, session required)
- `PUT /api/properties/:propertyId` updates accommodation type, bedrooms, sleeping places, minimum stay and optional property cleaning fee
- `DELETE /api/properties/:propertyId`
- `POST /api/properties/:propertyId/listings`
- `DELETE /api/listings/:listingId`
- `GET|POST /api/properties/:propertyId/availability`
- `PUT|DELETE /api/availability/:availabilityId`
- `PUT /api/listings/:listingId` updates whether the external link is shown in guest search; the listing can remain connected for calendar sync while hidden
- `GET /api/locations/countries`
- `GET /api/locations/cities?country=ES`; `country` is required
- `GET /api/search?country=ES&city=Barcelona&from=...&to=...&bedrooms=...&sleeps=...&accommodationType=any|entire_place|private_room&pricedOnly=true|false&minPriceCents=...&maxPriceCents=...`; both `country` and `city` are required, and results are sorted by final estimated stay price ascending, with unknown prices last
- `POST /api/properties/:propertyId/calendars` connects/upserts an Airbnb iCal source and immediately syncs it
- `POST /api/calendars/:calendarId/sync` manually refreshes an enabled source
- `PUT /api/calendars/:calendarId` enables/disables the source
- `DELETE /api/calendars/:calendarId` disconnects it

CI runs compile + PostgreSQL end-to-end smoke test + Docker image build.

## Frontend

Repository: `lelik112/parrot669`

Hosted on Cloudflare Workers/static assets.

Frontend release path:
- intended CI/CD is Cloudflare Workers Builds Git integration from `lelik112/parrot669`
- production branch must be `main`
- deploy command is `npx wrangler deploy`
- there is currently no GitHub Actions workflow for frontend deployment
- do not treat a GitHub push as proof of production deployment; verify the matching Cloudflare Workers Build/deployment
- if recent pushes produce no Cloudflare build/check signal, inspect Worker `parrot669` → Settings → Builds and reconnect/repair the Git integration before debugging browser cache

Worker proxies:
- public `/api/search` to Railway
- public `/api/locations/countries` and `/api/locations/cities` to Railway
- restricted browser auth/host routes under `/api/host/*`; the Worker strips the `/api/host` prefix and forwards them to Railway backend `/api/*`. Example: browser `PUT /api/host/calendars/:id` becomes backend `PUT /api/calendars/:id`.
- Host proxy forwards only the `parrot_session` Cookie upstream and Set-Cookie back to the browser, and rejects cross-origin state-changing browser requests when an Origin header is present.

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
- Email verification uses the backend Resend provider. Password recovery is not exposed yet; V11 reserves a hashed, expiring `password_reset_tokens` model for a later request/confirm flow.
- The pre-account `editToken`/`access_token_hash` mechanism and its compatibility routes have been removed.

Messaging backend privacy controls are implemented; UI and broader contact publishing are still pending.

Desired future owner contact options:
- PARROT message/contact relay;
- public contact if host explicitly opts in;
- both;
- neither.

Search may show host nickname now, but should not expose raw contact by default.

### Internal messaging — connected guest/host flow

- Backend package `com.parrot669.messaging` contains its own routes, service, repository and models. `Main` composes these routes with the existing API; the large legacy route file and geocoding are unchanged.
- Reuses the verified account/session cookie. An account can initiate enquiries and own properties without separate roles.
- A host explicitly enables `acceptingNewConversations` for their profile; default is false. It applies to all their properties. Disabling it prevents new threads while existing participants can continue replying.
- One private conversation per property and enquiring profile, independent of external listings. The server resolves the owner; only the two participants can access the conversation. Other users get 404.
- Messages contain plain text and optional `[check-in, checkout)` dates. They never book, block availability, set prices or expose account email/raw contact/exact address.
- Client-generated `clientMessageId` makes retries idempotent. Transactional per-thread sequences and explicit read acknowledgements prevent concurrent sends from being lost or marked read accidentally.
- Inbox/history pagination and unread counts are available. Limits: 4000 characters, 16 KiB JSON, 30 new messages/minute and 10 new conversations/hour per profile, enforced in PostgreSQL across instances.
- Deleting a property preserves its private conversation history and saved title but disables new replies. Account/profile deletion cascades conversations.
- Either participant can block the other. Blocks prevent sends in both directions and new enquiries across **all properties** between the pair. Existing history remains readable; each participant removes only their own block. Sends and block changes share a PostgreSQL advisory transaction lock per pair.
- API namespace: `/api/messaging`. Public `GET /contact-options/:propertyId` includes public property/host labels; authenticated `GET|PUT /settings`, `GET|POST /conversations`, `GET /conversations/for-property/:propertyId`, `GET /conversations/:id`, `GET|POST /conversations/:id/messages`, `PUT /conversations/:id/read`, `PUT /conversations/:id/block`, `GET /unread`. Paths here are relative to the namespace.
- API/lifecycle details and examples: [backend messaging contract](https://github.com/lelik112/parrot669-backend/blob/main/docs/messaging.md).
- `/messages.html` provides login/registration, inbox/history pagination, sending with optional stay dates, explicit read acknowledgements and block/unblock. Desktop shows list and thread together; mobile shows one panel at a time. UI is translated into EN/ES/CA/RU and renders message/preview text safely with `textContent`.
- The Worker proxies only the allowed messaging paths/methods, forwards only the existing session cookie, checks Origin on mutations and preserves API errors with `no-store`. No auth token is exposed to JavaScript.
- Visible inbox/history refresh every 15 seconds; unread badges every 30 seconds. Read acknowledgement requires the history to be visible, focused and scrolled to the latest fetched message. Sending never advances the polling cursor past an unseen concurrent reply.
- Drafts and uncertain-send idempotency keys live only in per-account sessionStorage with 24-hour expiry. They are restored for the same account, never treated as the message source of truth. Explicit logout from Messages clears its drafts. LocalStorage holds only language and a short-lived return URL after email verification, not message content or credentials.
- Email verification from a Messages registration returns to the enquiry in the same browser. Message email notifications and abuse reporting/moderation remain follow-up work. Public contact opt-in, attachments and realtime sockets are separate future decisions.

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

- Address autocomplete and storage are connected; map UI and any guest address-visibility policy remain separate future work.
- Improve visual design of housing/search/host UI.
- Add password-reset request/confirm endpoints using the reserved reset-token model and existing backend email provider.
- Add message email notifications and abuse reporting/moderation. Inbox, Worker proxy, host opt-in and participant blocking are connected.
- Upgrade Flyway or align Postgres version (Railway currently warns PostgreSQL 18 is newer than tested Flyway support).
