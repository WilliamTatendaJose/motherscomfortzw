# Mother's Comfort

Website for [Mother's Comfort](https://motherscomfort.co.zw), a Zimbabwean charity supporting
underprivileged expectant mothers with antenatal care, counselling, baby essentials and skills
training.

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Sanity · Paynow

---

## Running locally

```bash
npm install
npm run dev          # http://localhost:3000
```

**The site runs with no configuration at all.** Without a Sanity project it renders the migrated
content in `src/content`, and the online donation form returns a clear "not set up yet" message
instead of failing. Fill in `.env.local` (copy from `.env.example`) as each service is connected.

```bash
npm run build        # production build + type check
npm test             # unit tests
npm run typecheck
npm run seed         # import migrated content into a fresh Sanity dataset
```

---

## Setup

### 1. Sanity

```bash
npx sanity login
npx sanity projects create "Mother's Comfort"
npx sanity dataset create production
npx sanity dataset create donations --visibility private
```

Put the project id in `.env.local` as `NEXT_PUBLIC_SANITY_PROJECT_ID`, then create two tokens at
[sanity.io/manage](https://sanity.io/manage) → API → Tokens:

| Token | Permission | Variable |
|---|---|---|
| Read | Viewer | `SANITY_API_READ_TOKEN` |
| Write | Editor | `SANITY_WRITE_TOKEN` |

Then seed the migrated content and open the Studio at `/studio`:

```bash
npm run seed
```

The seed imports **text only** — photographs need uploading in the Studio. It uses
`createOrReplace`, so re-running overwrites; do not run it again once staff have started editing.

Two datasets are used deliberately. `production` holds content that editors browse; `donations`
holds donation records and form submissions, so donor and enquirer personal data is not sitting in
the content dataset. The Studio exposes them as two workspaces — `/studio/content` for editing and
`/studio/records` (read-only) for donations and enquiries. `/studio` shows the workspace picker.

Before a project exists, `/studio` renders setup instructions rather than erroring, and the site
serves the migrated fallback content.

**Cache revalidation.** In Sanity Manage → API → Webhooks, add a webhook pointing at
`https://<site>/api/revalidate`, triggering on create/update/delete, with the projection
`{_type}` and the secret from `SANITY_REVALIDATE_SECRET`.

### 2. Paynow

Get the integration ID and key from the [Paynow](https://www.paynow.co.zw) merchant portal
(Integrations) and set `PAYNOW_INTEGRATION_ID` / `PAYNOW_INTEGRATION_KEY`.

Two things to know:

- **Express Checkout** (the in-page EcoCash / OneMoney / InnBucks options) must be enabled on the
  account separately. Without it only the hosted redirect flow works; the redirect flow still lets
  donors pay by any method, so the site is fully functional either way.
- **Currency.** Paynow issues a separate ID/key pair per currency. The site prices in USD. Adding
  ZWG means a second pair and a currency selector.

Paynow has **no recurring billing**, so there is no monthly-giving option — presenting one would
be misleading. Regular donors are pointed at a bank standing order instead.

#### Testing the payment flow

The result URL is called **server to server**, so `localhost` will never receive it. Expose the app:

```bash
cloudflared tunnel --url http://localhost:3000
# then set, in .env.local:
#   PAYNOW_RESULT_URL=https://<tunnel-host>/api/paynow/result
#   NEXT_PUBLIC_SITE_URL=https://<tunnel-host>
```

Paynow's test mode is keyed to the merchant account's own email address — use it as the donor
email and no real money moves.

### 3. Email

Create an API key at [resend.com](https://resend.com), verify the `motherscomfort.co.zw` domain,
and set `RESEND_API_KEY`, `EMAIL_FROM` and `CONTACT_NOTIFY_EMAIL`. Submissions are written to
Sanity *before* the email is sent, so a delivery failure never loses a visitor's message.

### 4. Deploy

Import the repo on Vercel, add every variable from `.env.example`, and point
`motherscomfort.co.zw` at it. The previous Azure Static Web Apps workflow has been removed —
keep the Azure app running until the new site is verified.

---

## How it fits together

```
src/
  app/(site)/          public pages
  app/studio/          embedded Sanity Studio
  app/api/             donate/initiate · paynow/result · donate/status
                       forms/[type] · revalidate · draft
  components/          UI, grouped by area
  content/             migrated content — seed data AND runtime fallback
  lib/
    content/           getters that read Sanity, falling back to src/content
    paynow/            hashing, client, types
    sanity/            read client, write client, image helpers
sanity/
  schemaTypes/         schemas (content + records)
  structure.ts         desk layout, singletons
  seed/import.ts       content import script
```

Three conventions worth knowing before changing things:

**Content getters never throw.** Every function in `src/lib/content` returns the migrated fallback
if Sanity is unconfigured or a query fails. A CMS blip degrades the page, it does not 500 it.

**Anonymity lives in one place.** `src/lib/content/story.ts` decides whether a mother's name and
portrait are shown. Never read `motherName` or `portrait` directly in a template — a story can
carry a portrait uploaded before she asked to be anonymous, so suppression cannot depend on the
field being empty.

**The donation amount is never taken from the browser.** `resolveAmount` in `src/lib/donations.ts`
re-derives the charge from the tier definition, or clamps a custom amount. Likewise
`/api/paynow/result` verifies the inbound SHA-512 hash before believing a `Paid` callback — that
endpoint is public by necessity, and the hash is the only thing that makes it trustworthy.

### Colour and contrast

`#EC008C` measures 4.27:1 on white — fine for large text and icons, **not** for body copy or
white-on-pink button labels. Hence the two-step ramp: `brand-pink` for large/decorative,
`brand-pink-deep` (`#C10074`) for buttons and anything small. Same reasoning applies to
`brand-teal-deep`, which is darker than the flyer's teal for exactly this reason.

Do not override button colours through `className` — Tailwind classes collide and the cascade,
not the attribute order, decides the winner. Add a variant in `src/components/ui/Button.tsx`.

The site passes axe-core with no WCAG 2.1 A/AA violations. Please keep it that way.

---

## Outstanding items for the client

| | |
|---|---|
| Postal address | The old site published **three** different addresses. `src/content/site.ts` uses 34 Anderson Avenue, Cotswold Hills — confirm and correct in Site settings. |
| WhatsApp number | The flyer shows `07 18439626`; read as a Zimbabwean mobile that is `+263 71 843 9626`. Confirm before launch. |
| Story consent | Five stories were migrated from the old public site. Confirm written consent covers republication — the schema requires ticking `consentConfirmed`. |
| Photographs | Only three genuine photographs existed; the rest was template stock and was removed rather than re-captioned as this charity's work. In particular the founder's story has **no portrait** — the old site used a stock photo of schoolchildren there. |
| Logo | `public/logo.png` is a 500×500 PNG extracted from the old `header-logo.svg`, which was a PNG wrapped in an `<svg>` tag. A true vector would be sharper. |
| Bank details | The donate page has a bank transfer panel that stays hidden until details are entered in the Studio. |
| Team & events | The old team page was fabricated template content and all events were from 2023. Both sections stay hidden until real entries exist. |

## Known advisories

`npm audit` reports issues in transitive **build-time** dependencies (Sanity's CLI tooling,
eslint's YAML loader, Next's pinned postcss). None is reachable from the deployed runtime, and the
suggested `npm audit fix --force` downgrades Sanity by a major version. Reassess when Sanity
updates its CLI.
