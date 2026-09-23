# PARROT 669 changelog

## 2026-09-23 — Geolocation QA: guest search state and accessible labels

- GEO-001: changing country, city, dates or capacity clears the previous results and asks the guest to search again. Late responses and filter changes cannot bring back results for the old parameters.
- Keep unsubmitted search drafts across navigation without automatically running them; confirmed searches still restore normally. Pending requests cannot unlock controls belonging to a newer request.
- GEO-002: country and city controls inherit their translated native labels, removing the fixed English accessible names in RU/ES/CA.
- Add seven guest-search regression tests covering changed parameters, delayed responses, filters, state restoration and all four interface languages. Backend, LocationIQ and owner data are unchanged.

## 2026-09-23 — Unread-message email notifications

- Notify verified hosts and guests about new unread messages through the existing backend Resend configuration. Wait two minutes, combine pending messages and cap frequency at one email per recipient/conversation per 15 minutes.
- Add a Messages-page notification toggle and EN/ES/CA/RU email-language selector, backed by authenticated settings endpoints. Host contact opt-in stays independent.
- Keep message content and participant contact details out of emails; link directly to the authenticated conversation. Suppress pending mail for read messages, opt-outs, blocks, unverified accounts and deleted properties.
- Flyway V23 adds preferences and a transactional PostgreSQL outbox. Leases, frozen payloads, stable provider idempotency keys and bounded retries survive restarts without tying chat writes to email availability.
- Add PostgreSQL/HTTP and UI regression tests for coalescing, cooldown, suppression, retry/restart races, settings isolation and failure recovery. No geocoding configuration or implementation changes.
- Bounce/delivery webhooks and abuse reporting remain follow-up work.

## 2026-09-23 — LocationIQ owner address lookup

- Replace Geoapify with LocationIQ for country → city → street entry. Keep the selected city's geographic bounds and search only road records, with the city included in each query.
- Remove the Catalan-prefix fallback. Deduplicate road segments and reject neighboring-city/POI results; each uncached street lookup uses one provider request.
- Preserve caches, mobile selection, manual house numbers, existing saved addresses and PostgreSQL-only guest search.
- Add backend request pacing, clear quota errors and visible LocationIQ attribution. No database migration.

## 2026-09-23 — Guest/host inbox and participant blocking

- Connect search's **Write to host**, a Messages tab with unread counts and the owner's account-level opt-in control. No external listing is required to communicate.
- Add `/messages.html`: login/registration, paginated conversations/history, optional stay dates, plain-text messages and block/unblock, in EN/ES/CA/RU. Mobile uses separate list and thread panels.
- Preserve enquiry context through login and same-browser email verification. Keep drafts and uncertain-send keys scoped to the account; retries do not duplicate messages and polling does not skip concurrent replies.
- Acknowledge read only for visible, focused history at its latest messages. API errors remain visible next to the relevant controls.
- Add a strict Worker messaging proxy with session-cookie forwarding, Origin protection and no-store responses.
- Backend V22 adds profile-pair blocks across all properties, public contact labels and an authenticated existing-enquiry lookup; PostgreSQL tests cover blocking races and bypass attempts.
- Add frontend CI and regression coverage for auth/context, failed sends, account isolation, read acknowledgements, opt-in and proxy protections. Geolocation implementation is unchanged.
- Message email notifications and abuse reporting remain follow-up work.

## 2026-09-23 — Private guest/host messaging backend

- Added isolated backend `messaging` routes, service and repository plus Flyway V21.
- Reuse verified account sessions for property conversations, text messages with optional stay dates, paginated inbox/history, unread counts and explicit read acknowledgements.
- Host opts into new conversations (off by default); existing conversations continue after opt-out. No external listing is required. Messaging never changes physical availability or creates bookings.
- Participant-only access keeps emails, raw contacts and exact addresses private. Deleting a property retains read-only history.
- Database locks and idempotency keys protect retries, message ordering and unread state; per-profile database-backed limits constrain spam.
- PostgreSQL integration tests cover authorization, privacy, dates, concurrency, pagination, retries, limits and deletion. Backend API contract is in `parrot669-backend/docs/messaging.md`.
- Backend only: frontend screens, Worker proxy, block/report UI and message email notifications remain to be connected. Existing frontend/geolocation flows are unchanged.

## 2026-09-23 — Host address autocomplete and persistence

- Replace the Barcelona city selector with a labeled address field in create/edit forms.
- Fetch suggestions through the authenticated Worker proxy; debounce, cancel stale queries,
  support keyboard/touch selection and show retry/error states without losing the text.
- Fill country/city from selection and save the complete address with the property.
- Clear stale coordinates when text changes; keep exact addresses private to the owner.
- Backend V19 preserves existing records and lets normalized properties use other locations;
  guest discovery continues to read our own database.

## 2026-09-23 — Compact responsive period layout

- Desktop period controls share one row: dates, labeled nightly price and actions.
- Mobile keeps both dates side by side, with labeled price and actions below.
- Keep card grouping and date hints; reduce nested mobile padding to leave room for date values.

## 2026-09-23 — Clear owner period cards on mobile

- Saved availability and manual blocks are separate cards with labeled fields and a dedicated action row.
- Price per night keeps its visible label and EUR unit even when filled.
- Empty owner date controls show a localized hint and calendar icon without relying on native date placeholders.
- Native date pickers and inclusive-night semantics are preserved.

## 2026-09-23 — Inclusive owner date ranges

- Owner availability and manual blocks now include the selected last night, with explicit labels and guidance in all four languages.
- A single-night period can use the same date in both fields.
- Convert dates only at the host UI boundary; API/database ranges and guest checkout remain exclusive.
- Existing periods retain their covered nights and prices. Display, edit, save and deletion confirmation use consistent inclusive dates.
- Regression tests cover single nights, repeated saves, month/year/leap-day boundaries and date changes around daylight saving time.

## 2026-09-23 — Country and city search

- Guest search now requires both country and city.
- Country options come from distinct property countries in PostgreSQL; city options come from distinct property cities for the selected country.
- Guest search no longer depends on an external geocoder and cannot select locations that PARROT does not currently have in its database.
- Removed the remaining Barcelona-only filter from backend availability search; backend now filters by normalized country code plus city.
- Cloudflare Worker proxies the public location endpoints used by the search UI.
- Existing saved Barcelona searches are migrated client-side when Spain is the only available country.
- Search stays disabled until both required location fields are loaded and selected.

## 2026-09-22 — Remove duplicated dates from result cards

- Removed the availability date window from every result card because the requested stay period is already visible in the search controls above the results.
- Cards now focus on the information that actually differs between properties: identity, accommodation/capacity facts, price, host and outbound action.

## 2026-09-22 — Product-style housing result cards

- Reworked guest search results into a clearer product-card hierarchy instead of a flat stack of equally weighted metadata.
- Cards now lead with property name and city, group accommodation type/bedrooms/sleeping places into compact facts, and give the available date window its own visual block.
- Result dates are rendered in the current UI locale rather than raw ISO form.
- Price is a stronger secondary focus, while host identity is intentionally quieter in the footer.
- Published Airbnb links render as the card CTA; properties without a published external link show a subdued informational state instead of a button-like affordance.

## 2026-09-22 — Database-enforced availability integrity

- Added Flyway V13 with a PostgreSQL GiST exclusion constraint preventing overlapping `[date_from, date_to)` availability periods for the same property.
- Migration aborts with a clear error if legacy overlapping rows already exist instead of silently deleting user data.
- Existing application overlap checks remain for friendly validation, while PostgreSQL now closes the concurrent check-then-insert/update race.
- PostgreSQL exclusion violations are mapped back to HTTP 409 Conflict instead of surfacing as 500 errors.

## 2026-09-22 — Live housing filters and dirty period saves

- Accommodation type now behaves as a true result filter: repeat searches always use its current selected value instead of the value captured in the previous base-search snapshot.
- Existing host availability periods no longer show a redundant Save action while unchanged. Save appears only after dates or nightly price are edited.

## 2026-09-22 — Remove legacy auth and simplify host account UI

- Removed the pre-account edit-token migration path, legacy claim endpoint and compatibility owner routes.
- V12 deletes any remaining unowned legacy profiles, makes `profiles.account_id` mandatory and drops `access_token_hash`.
- Host authentication moved out of the large numbered content panel into compact top-bar Log in / Create account actions.
- After authentication, only the account email and Log out action remain in the top bar; PARROT ID is no longer shown in the host console.
- Cloudflare Worker now proxies only the `parrot_session` cookie for owner API calls.

## 2026-09-22 — Editable property characteristics and stay settings

- Bedrooms and sleeping places can now be edited after property creation alongside accommodation type.
- Property characteristics are grouped separately from stay conditions: minimum stay and cleaning fee now sit with availability and nightly pricing controls.
- Renamed the property creation label from an internal/private label to a property name, matching the fact that it is shown in guest search.
- Guest search no longer displays minimum stay as a separate result line; backend minimum-stay enforcement is unchanged.

## 2026-09-22 — Owner accounts and server-side sessions

- Replaced frontend `profileId + editToken` authentication with email/password accounts and opaque server-side sessions.
- Passwords are hashed with Argon2id; raw passwords and raw session tokens are never stored in PostgreSQL.
- Host sessions use HttpOnly, SameSite=Lax cookies; production cookies are Secure and expire after 30 days. Logout invalidates the server-side session.
- Owner mutations authorize the authenticated profile and no longer accept `X-Parrot-Token` as a security credential.
- Added register, login, logout, `/me` and authenticated dashboard flows plus login failure rate limiting.
- Added a one-time legacy profile claim path for existing edit-token hosts. Successful claim clears the legacy token hash.
- Host UI now shows login/sign-up states, persists authentication across reloads via the cookie, clears host state on logout, and offers legacy migration when old credentials are found in localStorage.
- V11 adds accounts, sessions, profile/account ownership and a reserved hashed password-reset-token table. Password reset email is intentionally not exposed until backend email delivery is connected.
- Guest availability search remains public.

## 2026-09-22 — Search copy and city selector cleanup

- Removed the claim that host properties do not contain prices; PARROT can now store optional pricing.
- Results without a price now say to ask the host and no longer show the indicative-price disclaimer.
- Removed unconditional wording that assumed an external listing exists; general rental terms are attributed to the host, while external links are shown only when actually attached and published.
- Removed minimum-stay text from the compact host property summary because the value is already visible in property settings.
- Aligned the `Only with a price` checkbox with the other result-filter controls.
- Added a real city selector to guest search and property creation. Barcelona is currently the only available city.

## 2026-09-22 — External listing lifecycle and filter cleanup

- Calendar sync is now shown only when an external Airbnb listing exists.
- Deleting the external listing also deletes its Airbnb calendar atomically; migration V10 removes any already orphaned calendars.
- Added a host checkbox to keep an Airbnb listing connected for sync while hiding its outbound link from guest search results.
- Replaced the property Expand/Collapse text button with a compact up/down chevron control.
- Moved accommodation type from the primary search form into the result-filter group. After an initial search, changing it immediately re-runs the search like the other filters.

## 2026-09-22 — Persistent search, price ordering and compact host cards

- Availability search now persists criteria and result filters in localStorage. Returning from the host screen restores the previous search state and automatically re-runs the last performed search.
- Search results are sorted by final estimated stay price ascending; properties without a complete price are placed last.
- Added estimated total price filters from/to in EUR. Changing a result filter after a search immediately re-runs it.
- Calendar connected status is localized; Russian now shows `Подключён` instead of `Connected`.
- Calendar destructive action is labelled Delete/Удалить rather than Disconnect/Отключить.
- Enable/disable controls are visually grouped separately from calendar deletion.
- Host property cards are collapsed by default to their main summary and expose Expand/Collapse controls; expanded state survives internal rerenders.

## 2026-09-22 — Editable accommodation type and result filters

- Accommodation type can now be changed from each property's settings together with minimum stay and cleaning fee.
- Moved `Only with a price` out of the primary search form into a separate result-filter area, leaving room for future filters.
- After an initial search, changing `Only with a price` immediately re-runs the same search with the new filter state.
- Documented the host API proxy contract: browser `/api/host/*` requests are intentionally forwarded to backend `/api/*`; the different visible paths are not separate APIs.

## 2026-09-22 — Editable property settings and calendar toggles

- Minimum stay is no longer requested while creating a property; new properties default to one day and the value is editable from each property card.
- Cleaning fee moved from the external Airbnb listing to the PARROT property, so it can be set, changed or cleared even when no external listing exists. Existing listing fees are migrated to their property.
- External calendars can now be disabled and re-enabled without deleting the connection. Disabled calendars keep their snapshot but do not block search or run automatic sync; re-enabling refreshes immediately.
- Calendar controls remain visible after the external Airbnb listing is removed, so an existing calendar can still be disabled, re-enabled or disconnected.
- Host property cards are more strongly separated visually and highlight each property title.
- Added backend smoke coverage for property settings plus calendar disable/re-enable search semantics.

## 2026-09-22 — Search without external links and accommodation type

- Properties remain in availability search after their external Airbnb listing is removed; search results return `links: []` and the guest UI explains that no external link has been added yet.
- Added `accommodationType` with the values `entire_place` and `private_room` across property creation, owner dashboard, public profile and search results.
- Existing properties migrate to `entire_place`.
- Host creation uses a compact two-option select; guest search uses `Any type / Entire place / Private room`, and result cards show the selected type.
- Added backend smoke coverage for type filtering, invalid type rejection and search after deleting an external listing.

## 2026-09-22 — Localized Airbnb calendar links and visible errors

- Airbnb iCal export links on localized hosts such as `airbnb.ru`, `airbnb.es` and `airbnb.co.uk` are accepted and normalized to `www.airbnb.com` before fetch; redirects stay disabled and lookalike hosts remain rejected.
- Calendar connection failures, including an iCal listing-id mismatch, are now rendered directly below the calendar form instead of only in the page-level status above the property list.

## 2026-09-22 — Harden Airbnb iCal connection

- Added regression coverage confirming that a calendar listing ID must exactly match the attached Airbnb listing ID; mismatches are rejected before fetch.
- Calendar fetches accept only `airbnb.com` and its subdomains with the exact `/calendar/ical/<listingId>.ics` path, closing lookalike-host SSRF bypasses.
- A failed calendar reconnect keeps the last successful event snapshot and last-success timestamp, so known reservations remain blocked.
- End-to-end smoke coverage now protects URL validation, exact listing matching and failed-reconnect behavior.

## 2026-09-21 — Airbnb iCal synchronization

- Hosts can connect an Airbnb iCal export URL after attaching the matching Airbnb listing.
- The backend validates that the listing id inside the iCal URL matches the property's Airbnb listing id.
- Sync happens immediately on connect, manually on demand, and automatically about once per hour.
- Imported iCal data is normalized to event kind + date range + UID; reservation descriptions/phone fragments are not stored.
- `Reserved` events block PARROT search for overlapping nights.
- `Airbnb (Not available)` events are retained for host visibility but do not block PARROT physical availability.
- Unknown summaries are retained as unknown and do not silently block availability.
- Calendar URLs remain server-side and are never returned by dashboard/public APIs.

## 2026-09-21 — optional pricing and interval stitching

- Availability periods can carry an optional nightly price in EUR cents.
- External listings can carry an optional cleaning fee.
- Guest search can show all results or only results with complete pricing.
- If any requested night has no price, the result has no price estimate; priced-only mode excludes it.
- Price is explicitly indicative; final terms and other charges remain with the host/external listing.
- New and edited availability periods cannot overlap.
- Adjacent half-open periods are allowed and search now stitches them across boundaries by night.
- Kept interval rows rather than one database row per day; requested nights are expanded only inside the search query.
- Main-site Housing entry is visually separated from ordinary service/navigation links.

## 2026-09-21 — owner state and date semantics

- Host page now reloads properties, external listing and PARROT availability from an authenticated backend dashboard endpoint on every page load.
- localStorage is credentials-only; it is no longer authoritative for property/listing/calendar state.
- Search results use the owner-entered property title instead of the city name.
- Date ranges now use hotel semantics: `[check-in, checkout)`.
- Same-day check-in/check-out is rejected as a zero-night stay.
- Host availability periods also require `to > from`.
- Existing production availability rows are migrated by adding one day to the old inclusive end date, preserving their previous meaning.
- Worker proxy allows the new owner dashboard route.

## 2026-09-21 — Barcelona scope and deletion

- Added property deletion and external-listing deletion with owner-token authorization.
- MVP restricted to Barcelona with internal `city_code = barcelona`.
- Search includes owner nickname but does not expose raw contact details.
- Main navigation groups guest search and host tools under the Housing product area.

## 2026-09-21 — capacity, minimum stay and Airbnb IDs

- Added sleeping-place capacity and minimum stay.
- Search enforces both.
- Hosts enter an Airbnb listing ID; PARROT generates the external URL.
- Search moved from the homepage to `/search.html`.
