# PARROT 669 v2

Static site + Cloudflare Worker contact endpoint.

## What changed
- The public form now POSTs to `/api/contact`.
- The Worker sends the request to a verified Cloudflare Email Routing destination.
- The private Gmail address is NOT stored in the repository.
- `hello@parrot669.com` is used as the sender.
- Basic validation + honeypot spam trap are included.

## One required Cloudflare setting
In the `parrot669` Worker:

**Settings → Variables & Secrets → Add**

- Name: `NOTIFY_TO`
- Value: your verified destination Gmail address
- Type: Secret

Do not put the Gmail address in the repository.

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
The sender must be on a domain with Email Routing enabled, and the destination must be verified in the same Cloudflare account.
