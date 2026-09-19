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
Replace the repository contents with this project and push to the connected production branch.

Cloudflare Workers Builds normally deploys with:
`npx wrangler deploy`

The project includes `wrangler.jsonc`, so the static site in `public/` and the Worker in `src/` are deployed together.

## Test after deploy
1. Open the site.
2. Send a test request through the form.
3. Confirm it arrives at the verified Gmail destination.
4. Check Worker logs if the form reports an error.

## If email sending fails
The sender must be on a domain with Email Routing enabled, and the destination must be verified in the same Cloudflare account.
