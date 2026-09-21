# PARROT 669 changelog

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
