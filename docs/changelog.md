# PARROT 669 changelog

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
