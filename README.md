# SecurityMatch

SecurityMatch is a Dutch marketplace where clients find independent security professionals, manage assignments, communicate, complete reviews, and handle test-mode payments.

## What Works

- Role-based accounts for clients, security professionals, and administrators
- Assignment creation, publishing, applications, selection, and planning
- Private conversations, reviews, availability, and document verification
- Responsive role-specific dashboards and navigation
- Stripe Connect Express onboarding in test mode
- Stripe Checkout for selected professionals with a configurable platform commission
- Webhook signature verification, payment and payout registration, and PDF invoices
- Client billing overview, professional payout overview, and admin commission settings

## Requirements

- Node.js 24 or newer
- npm 11 or newer
- PostgreSQL 15 or newer
- A Stripe test account for payment testing

## Local Setup

1. Install dependencies:

	```bash
	npm install
	```

2. Copy `.env.example` to `.env.local` and set `DATABASE_URL`, `AUTH_SECRET`, and the Stripe test values.

3. Create or synchronise the local schema:

	```bash
	npx prisma db push
	npx prisma generate
	```

4. Start the app:

	```bash
	npm run dev
	```

	Open [http://localhost:3000](http://localhost:3000).

## Stripe Test Mode

Only Stripe test mode is supported. The application rejects `sk_live_` keys.

Set these values in `.env.local`:

```dotenv
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Forward test events locally with the Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Use the webhook secret emitted by that command as `STRIPE_WEBHOOK_SECRET`. Complete Checkout with a Stripe test card, then verify the payment, payout, and PDF invoice in the dashboards.

The default platform commission is 10%. An administrator can change it at `/dashboard/admin/settings`.

## Legal Setup Before Launch

SecurityMatch contains legal pages for platform terms, privacy, cookies, complaints, cancellation, verification, safety/moderation and accessibility. Before a public launch, set all `NEXT_PUBLIC_LEGAL_*` values in `.env.local` with the real legal entity, address, KvK number and contact information.

The registration flow records acceptance of the platform terms and their version. Users can submit platform reports at `/melden`; administrators handle them at `/dashboard/admin/reports`.

The included legal texts are an operational template, not a substitute for legal advice. Have a Dutch legal professional review them, the exact business model, Wpbr position, tax/VAT treatment, consumer scope and Stripe flow before launching commercially.

## Core User Flow

1. A client creates and publishes an assignment.
2. A security professional applies and the client accepts the application.
3. The client opens **Betalingen** and starts Stripe Checkout.
4. Stripe confirms the payment through the signed webhook.
5. The client and professional can download the generated PDF invoice; the professional sees the payout status.

## Scripts

```bash
npm run dev              # Start the development server
npm run lint             # Run ESLint
npm run build            # Create a production build
npm run start            # Start the production build
npx prisma studio        # Inspect the local database
```

## Production Notes

This repository is ready for local and Stripe test-mode use. Before handling real commercial payments, configure production-grade email delivery, secure object storage for documents, backups, monitoring, legal documents, VAT rules, Stripe live-mode review, and an operational support process.
