# PARROT 669 — first static website

This is a no-backend first version of parrot669.com.

## What's included
- Responsive one-page website
- EN / ES / CA / RU language switcher
- Services, process, vision and contact sections
- No analytics, cookies or third-party tracking
- Contact form currently prepares/copies a request instead of sending it

## Local preview
Just open `index.html` in a browser.

For a more realistic local preview:
```bash
python3 -m http.server 8000
```
Then open http://localhost:8000

## Cloudflare Pages deployment

### Easiest route: Direct Upload
1. Sign in to Cloudflare.
2. Go to **Workers & Pages**.
3. Click **Create application**.
4. Choose **Pages**.
5. Choose **Upload assets / Direct Upload**.
6. Name the project, for example `parrot669`.
7. Upload the contents of this folder.
8. Deploy.

Cloudflare will give you a temporary `*.pages.dev` address.

### Connect parrot669.com
1. Open the Pages project in Cloudflare.
2. Go to **Custom domains**.
3. Click **Set up a custom domain**.
4. Enter `parrot669.com`.
5. Because the domain is already on Cloudflare, DNS setup should be straightforward.
6. Also add `www.parrot669.com` if you want it, and redirect one version to the other.

## Before public launch
- Ask your gestor/lawyer which exact services PARROT 669 S.L. can advertise/provide.
- Replace any service wording that falls outside the approved scope.
- Add legal notice / privacy policy.
- Connect the form to an actual inbox or form service.
- Add a real business contact email / WhatsApp.
- Consider adding business registration details where legally required.

## Form options later
- Formspree
- Cloudflare Pages Functions
- Email/CRM integration

Do not add analytics/cookies until you actually need them. It keeps the first legal/privacy setup much simpler.
