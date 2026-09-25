# PARROT 669 product context

This file is the handoff/source-of-truth for continuing product work if chat context is lost.

## Product direction and team coordination

PARROT helps guests find housing that is available for their dates and reach its owner. The MVP must establish that owners add useful availability, guests find suitable housing, and contact takes place. Feature count is not evidence of those outcomes.

Use existing external data and reputation where helpful. Trust labels must describe a specific observed fact; calendar verification does not verify identity, legal ownership or the right to rent. PARROT remains an availability/search/contact product, without booking or payment processing.

The shared product workspace for **both repositories** is `lelik112/parrot669/docs`:

- [Team and change identification](team.md): names, roles, scope and attribution conventions.
- [AI-team workflow](ai-team.md): task requirements and model/reasoning recommendation policy.
- [Team chat](team-chat.md): informal discussion and direct questions between agents, including process and leadership criticism; actionable outcomes are linked back to tasks/decisions.
- [Roadmap and feature registry](roadmap.md): priorities and scope.
- [Tasks and team workflow](tasks/README.md): claim ownership, ask questions, record handoffs and acceptance evidence.
- [Status](status.md): current delivery/QA state and blockers.
- [Decision log](decisions/README.md): accepted decisions and clearly marked proposals.
- [Changelog](changelog.md): dated history; decisions, implementation and verification are separate events.

Before starting or resuming work, read the product context, AI-team workflow, changelog, team agreement, current status, relevant task and new addressed team-chat messages. State **Agent, Role, Scope** and record a claim before implementation; do not start a duplicate task already claimed by another agent. Every commit message, PR description, task-status update and changelog entry identifies **Agent, Role, Change, Related task**, even when the technical GitHub account is shared. Repository updates are asynchronous records, not a mechanism that automatically starts another agent. The workflow is in [tasks/README.md](tasks/README.md); the canonical team roster and formats are in [team.md](team.md).

Mark / Марк is PM and edits product documentation only. Alex / Алекс is Strategy / Product Advisor. On 2026-09-24 he posted a signed strategy proposal to team-chat through the repository; access to that file does not make his proposed product changes accepted or give him a developer role. Denis / Денис and Igor / Игорь are Developers; Boris / Борис is QA and does not fix application code. Igor confirmed his name in team-chat on 2026-09-24; his earlier handoff remains under the identity he used at that time. Naming a participant does not claim a task or confirm that paused work has resumed. Model recommendations and the executor's pre-work check follow [ai-team.md](ai-team.md).

After significant work, PM updates product-context, changelog and the decision log so the record explains who changed what, why and under which decision. The author of the implementation and the person recording it are distinguished. Historical authorship is not guessed or rewritten. This convention is accepted in [D004](decisions/D004-team-identity.md).

On 2026-09-24 the owner assigned [PM-001](tasks/PM-001-calendar-control-dates.md) to Denis after Igor completed the backend refactor and documented a handoff. Denis claimed PM-001 and merged the backend implementation with V25 in [backend PR #21](https://github.com/lelik112/parrot669-backend/pull/21) (`1da6c64`); its Railway deployment is SUCCESS. The frontend implementation merged in [frontend PR #14](https://github.com/lelik112/parrot669/pull/14) (`d75bffb`). Denis recorded production evidence for the backend and matched hashes for the published frontend files in the PM-001 task. Boris's production desktop QA with a connected Airbnb iCal later confirmed selected dates, unrelated/partial changes failing, complete closing succeeding, reload and disable/enable status persistence. A P2 waiting-state instruction defect is tracked as [PM-013](tasks/PM-013-calendar-waiting-instruction.md); the positive open cycle, source/error cases and mobile/touch remain unaccepted. PM-004/005 are released and remain in independent review. Read new addressed team-chat messages when starting/resuming work and before handoff; the file does not wake agents. This extends [D001](decisions/D001-repository-coordination.md) and implements the scope of D002 subject to independent acceptance.

## Host cabinet backlog, 2026-09-24

By Aleksey's request, the host cabinet proposal from Alex is split into [PM-019](tasks/PM-019-host-cabinet-ia.md) (product IA contract), [PM-020](tasks/PM-020-host-cabinet-navigation.md) (navigation of current functions), [PM-021](tasks/PM-021-private-host-profile.md) (separate private profile), and [PM-022](tasks/PM-022-public-host-profile.md) (consent-limited public view). [D008](decisions/D008-cabinet-sequencing.md) accepts only this staging. PM-019's IA is accepted in [D009](decisions/D009-host-cabinet-ia.md). PM-020 is the navigation implementation; PM-021 private host profile is the next cabinet stage and is not blocked by pilot data; PM-022 public host profile follows PM-021 with its own privacy/publication contract. Backend already has a restricted public-profile JSON, but no new public-page or disclosure rule has been accepted. Account remains authentication and access; owner profile remains a separate domain identity. External link visibility follows accepted D010/PM-002: a valid owner-published Airbnb link may be opened regardless of calendar verification; verification is a separate trust signal. Do not advertise photo, About, Instagram or new contact fields as shipped, or delay the existing search/contact flow for them.

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
   - external Airbnb action when the host has attached and published one; otherwise a subdued neutral note says there is no public external link. Search cannot distinguish a missing listing from a host who chose not to publish its link (BUG-017).
   - **Write to host** for every property returned in search, independent of the old host-wide messages switch, Airbnb listing or calendar verification (D011/PM-024). It opens `/messages.html` with the property and requested stay dates; login/registration and verified email are required before sending.
   - A signed-out guest can draft the message and adjust checkout dates on that page. Send validates the draft and then reveals login/registration; only a verified session can post. A direct Messages visit without a property explains why login is needed and points back to search. No inbox/history is visible to guests.
4. Minimum stay is enforced by backend search but is not displayed as a separate field in guest results.
4a. Guest can choose all results or only results with complete nightly pricing, and may filter by minimum/maximum estimated total price for the requested stay. Results with a known price are sorted cheapest first; results without a complete price come last. If any requested night lacks a price, no price estimate is shown and the property is excluded from priced-only and price-range search.
4c. Price controls explicitly describe the total for the requested stay, including known cleaning fees. Negative, invalid-precision and reversed budgets produce visible errors instead of silently dropping a filter. Switching language rerenders already loaded cards/statuses without another search request; Russian capacity counts use proper plural forms. Housing input values use 16 px text.
4b. Optional cleaning fee belongs to the PARROT property, not to the external listing, and is included in the displayed estimate when known. An external listing has an independent `showInSearch` flag: it may remain connected for calendar sync while its outbound URL is hidden from guest search results.
5. Property title shown to guests is the same property name entered by the owner; it is not an internal-only label. Barcelona is not used as the result title.
6. Guest search uses hotel-style [check-in, checkout) semantics: checkout day is not occupied and same-day check-in/check-out is invalid. Owner forms instead select an inclusive range of nights (see below).

### Host
1. Open `/host.html`.
2. Register or log in with email/password. Both host and Messages login screens link to `/recover.html` for password recovery; an unverified-login error explains email confirmation in the current language. Authentication uses a server-side session in an HttpOnly cookie; host credentials are not stored in frontend JavaScript/localStorage.
3. Choose a country, select a city and street from LocationIQ suggestions, then enter the house number. Create the property and choose whether it is an entire place or a private room. New properties start with a 1-day minimum stay. Owners can edit the address in property characteristics; the exact address and coordinates are private to the owner.
3a. Property name, accommodation type, bedrooms and sleeping places are editable property characteristics. Names are trimmed and limited to 160 characters; renaming preserves address, periods and integrations. Minimum stay and optional cleaning fee are editable alongside PARROT availability/pricing controls. Property cards are collapsed by default to a compact summary and can be expanded for editing.
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
13. The host-wide **Guest messages** opt-in is removed by [PM-024](tasks/PM-024-contact-from-every-search-result.md). Email notification preferences remain separate. The Messages tab opens the same inbox used by guests, with an unread badge.

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

Search, host and messaging pages share three tabs:
- Find availability
- For hosts
- Messages

## PM-029: isolated QA origin (implementation in progress)

The QA alias is the existing production Worker URL `https://parrot669.cheltsov112.workers.dev`, alongside `https://parrot669.com` on the **same Worker**, backend and production database. Cloudflare's Worker Domains panel confirms both URLs already exist; adding `qa.parrot669.com` as a new custom domain failed in the dashboard, so it is only a future optional alias. Browser cookies have no `Domain` attribute, so each hostname maintains its own session. The Worker recognizes only these exact QA hostnames and sends a server-only attestation on proxied API requests; the backend rejects invalid attestations, requires an authenticated account for every QA API except login, and checks the account's immutable ID against the QA allowlist seeded from already verified `qa`/`lelik` accounts. QA login applies that ID check after password validation and before session issuance. Registration, email verification and password recovery through the QA alias are closed. Main-origin authorization remains unchanged. Backend PR #28 merged as `3e35c46`; both PR/main CI passed and Railway deployment `f9ebe8cf` is SUCCESS with Flyway V26. Valid Worker attestation with no/expired session now yields 401; invalid attestation and non-allowlisted accounts yield 403. On September 25 the live QA Worker briefly forwarded requests (403 on the old backend), but subsequently returned its own `QA site unavailable` 503 without reaching Railway; its active production `QA_WORKER_SECRET` binding must be restored/verified before the live 401 and two-session QA checks. Main `parrot669.com` remains available. See [PM-029](tasks/PM-029-two-origin-qa-sessions.md).

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
- V23 adds email notification preferences and a durable, coalescing messaging outbox

Current important endpoints:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/password-reset/request` accepts `{email, language?}` and gives the same generic 202 response for known/unknown accounts
- `POST /api/auth/password-reset/confirm` accepts `{token, password, language?}` and revokes old sessions on success
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/dashboard` (owner-only, session required)
- `POST /api/properties` (owner-only, session required)
- `PUT /api/properties/:propertyId` updates optional property title, accommodation type, bedrooms, sleeping places, minimum stay and optional property cleaning fee
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

Backend refactoring proceeds in separately tested steps. The shared `ServiceError` ADT now lives in its own `service/ServiceError.scala` file with the same package and definitions; auth, messaging and calendar verification keep their existing error contracts.

Guest availability search and PostgreSQL location discovery now live in `com.parrot669.search` (`SearchRoutes`, `SearchService`, `SearchRepository` / `DoobieSearchRepository`, and search models). `Main` wires this module independently of `ParrotService` and the iCal fetcher. `LocationCountry` remains shared with geocoding; the existing and search routes share the unchanged `http.HttpResponses` mapping. Public endpoints, JSON fields, SQL, validation order, pricing, sorting and listing visibility are preserved. The existing per-result listing/cleaning-fee queries are intentionally unchanged; batching is a separate follow-up. Messaging, calendar-control verification, provider geocoding and database migrations were not reorganized in this step.

These initial steps were released independently on 2026-09-23: calendar integrity `bcebaa4`, shared errors `d370575`, search extraction `1e00ef5`. Each passed PR/main CI, Railway deployment and live API smoke. Final [main CI 35873996970](https://github.com/lelik112/parrot669-backend/actions/runs/35873996970) passed 75 tests plus PostgreSQL HTTP smoke and Docker build. Railway deployment `6d68b808-d625-461c-ba74-c26afa862873` succeeded on `1e00ef59804216b417d264bd1f7ee1be9b7cb348`, with Flyway still at V24. Ten read-only production checks passed across the direct backend and Cloudflare Worker (health, location/search routing, invalid-budget errors and unauthorized dashboard access). Calendar failure/recovery and nonempty search scenarios were exercised in isolated CI, not against real host calendar data.

### 2026-09-24 housing and profile extraction

Three further extractions are merged and released. Each stage passed PR and main CI with PostgreSQL tests, full HTTP smoke and Docker build; production now runs the final combined commit below.

| Responsibility | Backend module | Preserved contract |
| --- | --- | --- |
| Availability and manual unavailability | `com.parrot669.housing`: `AvailabilityRoutes`, `AvailabilityService`, `AvailabilityRepository` / `DoobieAvailabilityRepository` | Existing owner endpoints, half-open API dates, optional nightly prices, ownership/validation order and named PostgreSQL overlap constraints |
| Properties and external listings | `com.parrot669.housing`: `PropertyRoutes`, `PropertyService`, `PropertyRepository` | Property/address/title updates, canonical Airbnb links and visibility; listing/calendar deletion remains atomic, and property deletion retains private messaging history |
| Owner dashboard and public profiles | `com.parrot669.profiles`: `ProfileRoutes`, `ProfileService`, `ProfileRepository` / `DoobieProfileRepository` | Session-derived dashboard identity, owner-only addresses and calendar details, anonymous public-profile JSON and legacy verification expiry semantics |

`Main` composes the extracted routes with search and the remaining API. Shared DTOs remain in `domain`; each module owns its repository queries without depending on another feature's service. SQL statements and transaction boundaries are retained. `http.OwnerRequests` shares the existing session-cookie extraction, authentication delegation, UUID parsing and JSON decoding between the remaining legacy routes and these modules. `HttpResponses` continues to supply the existing response/error mapping. This moves request plumbing without moving or changing authentication policy.

The legacy `ParrotService` is reduced from 890 to 294 lines, `Routes` from 363 to 173, and `ParrotRepository` from 545 to 299. All 52 route handlers retain their existing bodies and each is composed once.

### 2026-09-24 auth route extraction (PM-010)

`http.AuthRoutes` now owns only `register`, `verify-email`, `login`, `logout` and `me` plus their existing session-cookie response headers. `Main` composes it once alongside the remaining `http.Routes`, which kept external calendars until their separate PM-011 extraction below. Both route classes continue to use the same `OwnerRequests` and `HttpResponses` helpers. Endpoint paths, JSON, authentication order, session policy and cookies are unchanged; `AuthService`, `AuthRepository`, schema and frontend code were not modified. [Backend PR #22](https://github.com/lelik112/parrot669-backend/pull/22) merged as `e41d3224c65340725f3ba5b49bdb1a530b98c50d`; PR CI [35990938243](https://github.com/lelik112/parrot669-backend/actions/runs/35990938243) and main CI [35991305724](https://github.com/lelik112/parrot669-backend/actions/runs/35991305724) passed. Railway production deployment `e9e2333c-721e-4bd0-8184-ec07130ebd35` is SUCCESS on the same SHA. Existing PostgreSQL HTTP smoke exercises all five endpoints; additional route tests cover malformed JSON, missing sessions and exact logout cookie flags. Independent QA remains open in [PM-010](tasks/PM-010-auth-routes-extraction.md).

### 2026-09-24 external calendar lifecycle extraction (PM-011)

`com.parrot669.externalcalendar` now owns `CalendarRoutes`, `CalendarService` and `CalendarRepository`: connect, manual sync, enable/disable, delete, snapshot replacement/error handling and the hourly enabled-calendar sync loop. `Main` composes the four original route handlers once; their authorization order, HTTP response bodies and statuses, service branches, SQL and transaction boundaries were copied without changes. The iCal fetcher, URL validation/secret handling, parser, event classification and reservation semantics are unchanged. Legacy challenges remain in `http.Routes` / `ParrotService` / `ParrotRepository`; PM-001 `calendarverification` and V25 are untouched. Frontend code and API paths are unchanged.

[Backend PR #23](https://github.com/lelik112/parrot669-backend/pull/23) merged as `59c046ff61989f6f9ac2903cdf448a93dbcb45dd`; [PR CI 36004130654](https://github.com/lelik112/parrot669-backend/actions/runs/36004130654) and [main CI 36004571053](https://github.com/lelik112/parrot669-backend/actions/runs/36004571053) passed compile/tests, PostgreSQL HTTP smoke and Docker build. Route characterization asserts authentication precedes UUID/body validation; HTTP smoke covers localized Airbnb URL validation, connect, disabled/re-enabled sync, malformed/empty feeds, saved snapshot, delete and restored search. Railway production deployment `b302e2f4-2021-469b-a773-87bcddc1b50b` is SUCCESS on that exact main SHA. Startup validated schema V25 with no new migration; direct `/health` returned 200 and unauthenticated `/api/auth/me` returned 401. The full connected-calendar mutation flow was exercised in CI, not against a real production host account. Independent QA remains open in [PM-011](tasks/PM-011-calendar-sync-extraction.md).

Frontend API paths, Worker forwarding, JSON fields, status codes and date conversion stay the same; no frontend migration is required. Public profiles still omit exact addresses, raw contact, periods and calendars, while the authenticated dashboard retains owner data. Public-profile listing visibility keeps its existing behavior and is separate from the guest-search `showInSearch` filter. The messaging/outbox and `calendarverification` packages, calendar synchronization, provider geocoding and database migrations are unchanged by this batch.

Twenty-one focused backend tests were added: nine availability route/service tests, six property/listing tests (four route tests and two PostgreSQL repository/service tests), and six profile tests. They cover authentication/validation order, exact errors and response shapes, overlap-constraint handling, omitted updates, atomic deletion rollback, retained messaging history, public privacy and verification expiry. The existing full-application PostgreSQL smoke and Docker build passed for each stage. Test HTTP helpers explicitly send raw JSON bytes to avoid encoding the request object as a JSON string.

Release evidence (2026-09-24):

| Stage | Main commit | Main CI | Railway deployment |
| --- | --- | --- | --- |
| Availability / manual blocks, [PR #18](https://github.com/lelik112/parrot669-backend/pull/18) | `50ef837bfc5aec408debf1b1cf5f72d6a1d8afc5` | [35963891979](https://github.com/lelik112/parrot669-backend/actions/runs/35963891979): success, 84 tests + full smoke + Docker | `a7bee003-5c57-4456-a40f-17c4298b6396`, superseded |
| Properties / listings, [PR #19](https://github.com/lelik112/parrot669-backend/pull/19) | `b5ac2a2a266fa81bb840086928b6234d9d575f33` | [35964196912](https://github.com/lelik112/parrot669-backend/actions/runs/35964196912): success, 90 tests + full smoke + Docker | `14a6eaea-96e1-4ea9-972c-90aaa203a7bf`, superseded |
| Dashboard / public profile, [PR #20](https://github.com/lelik112/parrot669-backend/pull/20) | `f9d8ae7ab0b2d16a260a2ac64eeea3b9582f6696` | [35964554278](https://github.com/lelik112/parrot669-backend/actions/runs/35964554278): success, 96 tests + full smoke + Docker | `73c5cb1a-2657-49c5-bfd3-b2e9b172bdcd`: SUCCESS |

The final production commit's tree matches the CI-tested implementation. Railway startup validated all 24 migrations and remained at V24 without a schema change. Eight read-only checks passed against the final direct backend: health, country/city discovery, search, invalid-budget error, unauthenticated dashboard/availability and missing public-profile 404. Private dashboard, calendar and mutation scenarios ran in isolated CI; no real host data was changed for live verification. Cloudflare returned HTTP 403 / code 1010 to this environment when checking the frontend proxy, so this batch does not claim a fresh successful live Worker check. Worker code was unchanged.

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
`host offer covers every requested night AND no manual PARROT block covers any requested night AND no imported reservation from an enabled calendar covers any requested night`.

This expression summarizes date coverage; the other search filters and minimum-stay rules still apply. Mentioning manual blocks here corrects an omission in this summary, not the implemented behavior.

The iCal URL is a secret capability link. It is stored server-side because it must be fetched, but never returned in dashboard/public APIs. TODO before serious scale: encrypt calendar URLs at rest with an application-managed key.

Calendar connection validation is deliberately strict: the listing id must match the property's Airbnb listing id exactly and the path must be `/calendar/ical/<listingId>.ics`. HTTPS links on `airbnb.com` and localized Airbnb hosts such as `airbnb.ru`, `airbnb.es` or `airbnb.co.uk` are accepted; localized hosts are normalized to `www.airbnb.com` before the server fetch, so redirects stay disabled and no user-controlled host is fetched. Lookalike hosts remain rejected. If reconnecting or replacing a calendar URL fails, PARROT keeps the last successful event snapshot, so known reservations continue to block search until a later successful sync replaces them.

Calendar imports require a complete iCalendar document with balanced event boundaries. A truncated or malformed response is a sync error even when HTTP returned 200: the last successful snapshot and `lastSuccessAt` remain unchanged, so known reservations keep blocking search. A complete calendar with no events is valid and intentionally clears the previous snapshot. This validation does not change event classification or calendar-control verification policy.

## Auth / contact direction

Owner authentication is account/session based:

- `accounts` is the login identity and stores normalized unique email plus an Argon2id password hash.
- `profiles` remains the domain identity shown to guests and owns properties. For the MVP one account owns one host profile through `profiles.account_id`.
- Host authorization is ownership-based, not role-based: an authenticated account can mutate only resources belonging to its profile. "Host" is not an RBAC role.
- Sessions are opaque 256-bit random tokens. The browser receives the raw token only as a `HttpOnly; SameSite=Lax` cookie; production also sets `Secure`. The database stores only SHA-256 session-token hashes.
- Sessions expire after 30 days, multiple active sessions are allowed, login creates a fresh session, and logout deletes the server-side session.
- Login errors do not distinguish unknown email from wrong password. A simple per-instance limiter caps repeated failures per normalized email; a distributed limiter can replace it if traffic or horizontal scaling justifies it.
- Email verification and password recovery use the existing backend Resend configuration. Recovery supports EN/ES/CA/RU, 32-byte random tokens, SHA-256 token hashes and a 30-minute single-use expiry in the existing V11 table. Database limits allow one link per account per 90 seconds and at most three per hour; requesting again does not invalidate a previous valid link.
- Reset atomically replaces the Argon2id password, confirms email possession, revokes all sessions and invalidates other recovery/verification tokens. Account/profile/property identity is retained. Login and email verification serialize session creation with reset; an old credential in flight cannot recreate a valid session afterwards. Reset does not auto-login.
- Recovery request acceptance is asynchronous and does not disclose whether an email exists. Its process-local queue is bounded to 64 jobs; restart/provider failure may require another request. This queue is intentionally separate from the durable messaging outbox. The page tells users to check spam and retry; password-change notices are best effort.
- Recovery links carry secrets in a fragment, removed from the visible URL on load. The page uses no-referrer and stores neither reset tokens nor passwords in browser storage. Recovery APIs cap JSON at 16 KiB and return no-store responses.
- The nine confirmed general findings in `docs/qa/2026-09-23/PARROT669-QA-2026-09-23.md` were fixed and released on 2026-09-23 (backend `39f3f92`, frontend `be9db76`). CI, production deployment and focused desktop checks passed; real-mailbox recovery and mobile/touch coverage remain explicitly unverified in that report.
- The pre-account `editToken`/`access_token_hash` mechanism and its compatibility routes have been removed.

PARROT private messaging is implemented. Under D011/PM-024, every property kept in search offers this private message path; the legacy host-wide opt-in gate has no effect. Publishing direct phone/email remains a separate future decision.

Desired future owner contact options:
- PARROT private messaging, available from every searchable property under D011;
- direct public phone/email only if the host explicitly opts in, subject to a separate decision;
- both PARROT messaging and consent-based direct contact.

Search may show host nickname now, but should not expose raw contact by default.

### Internal messaging — connected guest/host flow

- Backend package `com.parrot669.messaging` contains its own routes, service, repository and models. `Main` composes these routes with the existing API; the large legacy route file and geocoding are unchanged.
- Reuses the verified account/session cookie. An account can initiate enquiries and own properties without separate roles.
- PARROT messaging is available for each property kept in search under D011. PM-024 removes the host switch; the old `acceptingNewConversations` API field always returns true for compatibility and stored false values are ignored. Existing participants can continue replying.
- One private conversation per property and enquiring profile, independent of external listings. The server resolves the owner; only the two participants can access the conversation. Other users get 404.
- Messages contain plain text and optional `[check-in, checkout)` dates. They never book, block availability, set prices or expose account email/raw contact/exact address.
- Client-generated `clientMessageId` makes retries idempotent. Transactional per-thread sequences and explicit read acknowledgements prevent concurrent sends from being lost or marked read accidentally.
- Inbox/history pagination and unread counts are available. Limits: 4000 characters, 16 KiB JSON, 30 new messages/minute and 10 new conversations/hour per profile, enforced in PostgreSQL across instances.
- Deleting a property preserves its private conversation history and saved title but disables new replies. Account/profile deletion cascades conversations.
- Either participant can block the other. Blocks prevent sends in both directions and new enquiries across **all properties** between the pair. Existing history remains readable; each participant removes only their own block. Sends and block changes share a PostgreSQL advisory transaction lock per pair.
- API namespace: `/api/messaging`. Public `GET /contact-options/:propertyId` includes public property/host labels; authenticated `GET|PUT /settings` is compatibility only and always returns enabled; `GET|POST /conversations`, `GET /conversations/for-property/:propertyId`, `GET /conversations/:id`, `GET|POST /conversations/:id/messages`, `PUT /conversations/:id/read`, `PUT /conversations/:id/block`, `GET /unread`. Paths here are relative to the namespace.
- API/lifecycle details and examples: [backend messaging contract](https://github.com/lelik112/parrot669-backend/blob/main/docs/messaging.md).
- `/messages.html` provides login/registration, inbox/history pagination, sending with optional stay dates, explicit read acknowledgements and block/unblock. Desktop shows list and thread together; mobile shows one panel at a time. UI is translated into EN/ES/CA/RU and renders message/preview text safely with `textContent`.
- The owner of a conversation's still existing property sees an **Open property** action in the thread header. It links to `/host.html` with the conversation's exact property ID and return conversation ID. The Host page uses the authenticated owner dashboard to open that card and shows a neutral unavailable state if it no longer belongs to the current account; no other property is substituted. The return action opens the original private thread. Guests never receive the owner action or Host fields, and the URL alone never grants dashboard access (PM-027).
- The Worker proxies only the allowed messaging paths/methods, forwards only the existing session cookie, checks Origin on mutations and preserves API errors with `no-store`. No auth token is exposed to JavaScript.
- Visible inbox/history refresh every 15 seconds; unread badges every 30 seconds. Read acknowledgement requires the history to be visible, focused and scrolled to the latest fetched message. Sending never advances the polling cursor past an unseen concurrent reply.
- Authenticated drafts and uncertain-send idempotency keys live in per-account sessionStorage with 24-hour expiry. An anonymous enquiry draft uses a separate property-scoped sessionStorage key until explicit login or email confirmation for the registered username; only then is it moved to that account's draft. On successful registration, a separate 24-hour temporary copy of that draft in localStorage permits confirmation in another tab of the same browser; it is scoped to the registering username/property and removed after successful continuation. A per-tab registration nonce prevents another tab from updating that copy. The login or verification flow never sends a message automatically. No inbox/history loads before auth; explicit logout from Messages clears account drafts. LocalStorage holds language, a short-lived return URL and this temporary registration handoff, but no credentials.
- Email verification from a Messages registration returns to the enquiry in the same browser. Consent for publishing direct contact, abuse reporting/moderation, attachments and realtime sockets are separate future decisions.

### Message email notifications

- Verified participants receive emails about new unread messages by default. `/messages.html` has a separate **Email notifications** setting and email language selector (EN/ES/CA/RU, default EN). This setting does not affect contact availability.
- Authenticated `GET|PUT /api/messaging/notification-settings` reads/sets `{enabled, language}` for the current profile only. The Worker proxies it with the existing cookie and Origin protections.
- The first email waits roughly two minutes so an actively read conversation does not generate unnecessary mail. Pending messages are grouped, with at least 15 minutes between accepted emails for the same recipient/conversation. Replies notify guests as well as hosts.
- Notifications use the existing backend Resend configuration and contain only a short notice plus a link to the authenticated conversation. Message content, names, dates, addresses and the other participant's email are not copied into mail.
- Queue work is committed atomically with each new message, without backfilling older messages. PostgreSQL coordinates multiple workers, persists frozen payloads/idempotency keys and retries temporary provider failures across restarts. Chat writes do not wait for the email provider.
- Unread status, notification preference, verification, blocks and property existence are checked before sending. Already in-flight mail may arrive after a read/block/opt-out. Retries are capped at eight attempts and 23 hours; terminal delivery errors are retained as sanitized codes for diagnosis.
- Delivery acceptance is logged without sensitive data; bounce/delivery webhooks are not connected yet. Frozen email/payload data is cleared when a delivery ends.

## Calendar control verification — v1 history and PM-001 implementation

The owner-assisted iPhone Safari `open` test completed for 17–18 February 2027 and the original Airbnb block was restored. [BUG-018](tasks/BUG-018-calendar-end-date-mobile-safari.md) covers the observed native date-picker problem: changing the first night left the last-night picker on its previous date/month. The owner form now assigns the new first night to the last-night input and its minimum on `input`/`change`; both dates are inclusive as before. Production iPhone Safari retest and remaining independent PM-001 QA are open. This affects only the browser form, not the saved challenge or iCal semantics.

Before PM-001, v1 started from a fresh iCal baseline and accepted any observed change in future unavailable ranges. PARROT did not store a user-selected challenge range in v1. A new or cancelled reservation on unrelated dates could therefore pass the check. Previously issued v1 statuses must not be treated as evidence that a specific user completed a specific date challenge.

The owner's clarification on **2026-09-24** supersedes that behavior as the target requirement:

1. The owner selects control nights **in PARROT** before changing Airbnb.
2. PARROT saves the selected dates and expected action, and obtains the initial calendar state before telling the owner to act.
3. The owner changes those dates in Airbnb and returns to check.
4. Success requires the saved action on the saved dates. A change only on other dates, an already-existing target state, incomplete action or a fetch error must not pass.
5. Dates, action and instructions survive waiting, navigation and reload.

The implementation merged in both main branches on 2026-09-24; the backend Railway deployment succeeded. Denis verified the published frontend files against the release hashes and recorded the evidence in [PM-001](tasks/PM-001-calendar-control-dates.md). The [change record](changes/PM-001-calendar-control-dates.md) reports a persisted selected range and action, a complete baseline snapshot, and rejection of unrelated/partial changes and a different source. Boris's controlled production desktop QA confirmed A/B negative cases and full closing of A, and found a misleading waiting-state instruction ([PM-013](tasks/PM-013-calendar-waiting-instruction.md)); full QA, including positive open and mobile/touch, remains open. See [decision D002](decisions/D002-calendar-control-dates.md) and [task PM-001 / BUG-015](tasks/PM-001-calendar-control-dates.md). The existing synchronization, event classification and calendar lifecycle remain separate. A date challenge is a limited signal of calendar control, not proof of identity or legal ownership.

External-link visibility is independent of calendar verification under [D010](decisions/D010-external-link-independent-verification.md), which supersedes the unaccepted D003 proposal. A valid owner-published Airbnb URL remains usable even when calendar control is not verified. The shared backend public-link projection used by search and public-profile JSON validates the canonical Airbnb room URL, its numeric listing ID and the connected calendar's listing ID when one exists. It exposes `calendarControlStatus` (`unverified`, `pending`, `verified`, `recheck_required`) without exposing the private iCal URL. `verified` requires a D002 selected-date challenge on the current calendar ID and exact current source hash; legacy v1 never confers this status. Expired pending, failed, blocked, rejected, removed or replaced verified sources request recheck. Disabling sync alone leaves D002 verification unchanged. Invalid, mismatched or unpublished links are absent from both public projections; property search itself does not require a link. Search displays the status alongside a clickable valid Airbnb link. Under D011/PM-024, the PARROT contact action and applicable calendar-verification request are available for a searchable property independently of the old host-wide opt-in; the request opens an unsent draft. This is calendar control only, not identity, ownership or permission to rent.

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

- Independently retest the released P2 waiting-state instruction fix [PM-013](tasks/PM-013-calendar-waiting-instruction.md) and complete remaining QA of the saved-date calendar challenge ([PM-001](tasks/PM-001-calendar-control-dates.md)); implement [PM-002](tasks/PM-002-link-publication.md) under accepted D010: keep the external link usable, show honest verification status and add the messaging nudge where available.
- Complete independent search → enquiry → reply verification ([PM-003](tasks/PM-003-contact-acceptance.md)). Prioritize evidence for the core MVP path over adding unrelated features.
- Independently retest the two released host UI fixes and complete focused email/mobile acceptance. The ordered backlog and pilot proposal live in [roadmap.md](roadmap.md); do not infer an active assignment from this TODO list.
- The isolated auth route extraction [PM-010](tasks/PM-010-auth-routes-extraction.md) is released and awaits independent QA. External calendar lifecycle [PM-011](tasks/PM-011-calendar-sync-extraction.md) is released and awaits independent QA; legacy challenges [PM-012](tasks/PM-012-legacy-challenges-extraction.md) remain LATER. Original sequence is in [D006](decisions/D006-backend-refactor-backlog.md); activation and boundaries are in [D007](decisions/D007-activate-auth-routes-extraction.md).
- Separate backend fixes identified in the source review: align accepted 254-character emails with `profiles.contact VARCHAR(200)`; bound verification-email transport waits; bound/expire login limiter state and make concurrent admission explicit.
- Batch search enrichment separately and handle a property deleted between candidate selection and fee lookup; the current per-result `.unique` fee read can fail the entire search. Make legacy challenge creation and verification-token replacement atomic; map duplicate listing constraints to a deliberate API response.
- Address autocomplete and storage are connected; map UI and any guest address-visibility policy remain separate future work.
- Improve visual design of housing/search/host UI.
- Add abuse reporting/moderation and email bounce/delivery webhooks. Inbox, notifications, Worker proxy and participant blocking are connected.
- Upgrade Flyway or align Postgres version (Railway currently warns PostgreSQL 18 is newer than tested Flyway support).
