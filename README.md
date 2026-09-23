# PARROT 669 v2

Static site + Cloudflare Worker API proxy/contact endpoint.

## LocationIQ address input — 2026-09-23

- Country list is local to our backend; city searches are scoped to country, street
  searches to the chosen city's bounds. LocationIQ receives the selected city and
  typed street fragment with a roads-only filter. House number is entered separately.
- Autocomplete waits 700ms and uses 15-minute browser/server caches. Focus alone never
  calls the provider; up to 10 geographically scoped suggestions are displayed.
- Backend pacing and localized 429 errors preserve input when the provider limit is
  reached. The form displays Search by LocationIQ.com attribution. No Catalan-prefix fallback.
- Parent field changes clear dependent selections. Existing locations remain editable
  without re-geocoding unless the owner chooses Change address.
- Regression coverage includes mobile taps, city/street filtering, credit-saving
  behavior, late responses, saved drafts, disabled dependent fields and persistence.

## Address validation fix — 2026-09-23 (superseded for suggestions)

- Host suggestions require a street, house number and building/amenity result type.
- Empty results explain which address components to enter in all four languages.
- Unchanged historical addresses are omitted from settings updates, preserving old objects.
- Regression tests cover broad suggestions, stale selections and legacy address editing.
- Mobile taps keep suggestions mounted through Safari's input blur; outside taps and
  keyboard navigation dismiss the list, while scrolling never selects an address.

## What changed
- The public form now POSTs to `/api/contact`.
- The Worker sends contact requests through Resend.
- The private Gmail address is NOT stored in the repository.
- `hello@parrot669.com` is the default Resend sender.
- Basic validation + honeypot spam trap are included.

## Required Worker secrets
In the `parrot669` Worker, configure:

- `NOTIFY_TO` — destination email address.
- `RESEND_API_KEY` — Resend API key.
- `RESEND_FROM` — optional sender override; defaults to `PARROT 669 website <hello@parrot669.com>`.

Keep addresses and API keys in Worker secrets/variables, not in the repository.

## Git deployment
Production is intended to deploy through **Cloudflare Workers Builds** from the GitHub repository `lelik112/parrot669`.

Required Cloudflare Worker settings:
- Worker: `parrot669` (must match `name` in `wrangler.jsonc`)
- Git repository: `lelik112/parrot669`
- Production branch: `main`
- Root directory: repository root
- Deploy command: `npx wrangler deploy` (Cloudflare's default is fine)
- Build command: none required for this vanilla JS/static-assets project

A Git push is **not** considered a verified production release by itself. After each frontend release, verify the Workers Build/deployment for the same commit in Cloudflare. If Git integration is healthy, pushes to `main` should trigger the build automatically.

If pushes stop deploying:
1. Cloudflare → Workers & Pages → `parrot669` → Settings → Builds.
2. Confirm the Git repository is connected and the production branch is `main`.
3. If the repository is missing or stale, reconnect GitHub access and select `lelik112/parrot669`.
4. Check Build History for the expected commit before treating the release as live.

The project includes `wrangler.jsonc`, so the static site in `public/` and the Worker in `src/` are deployed together.

## Test after deploy
1. Open the site.
2. Send a test request through the form.
3. Confirm it arrives at the verified Gmail destination.
4. Check Worker logs if the form reports an error.

## If email sending fails
Verify `parrot669.com` in Resend, confirm `RESEND_API_KEY` is configured, and make sure the sender address belongs to the verified domain.
