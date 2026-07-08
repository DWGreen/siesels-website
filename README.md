This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Contact Page And Form

A new Contact page is available at `/contact` and is already linked from the footer.

Form submissions post to `POST /api/contact`, then the API forwards requests based on environment configuration so behavior can be changed without editing code.

### Submission Modes

Set `CONTACT_SUBMISSION_MODE` to one of:

- `disabled` - accepts requests and logs them server-side (safe fallback)
- `ninja-forms` - forwards to Ninja Forms submission endpoint in WordPress
- `wordpress-rest` - forwards raw JSON payload to a custom WordPress REST endpoint
- `webhook` - forwards raw JSON payload to any external webhook/email automation endpoint

### Environment Variables

General options:

- `CONTACT_SUBMISSION_MODE`
- `CONTACT_SUCCESS_MESSAGE`
- `CONTACT_ERROR_MESSAGE`
- `CONTACT_SUBMISSION_TIMEOUT_MS` (default: 10000)
- `CONTACT_SUBMISSION_AUTH_HEADER_NAME` (default: Authorization)
- `CONTACT_SUBMISSION_AUTH_TOKEN`
- `CONTACT_SUBMISSION_EXTRA_HEADERS_JSON` (JSON object of extra headers)

Ninja Forms mode:

- `CONTACT_NINJA_FORMS_FORM_ID` (required)
- `CONTACT_NINJA_FORMS_ENDPOINT` (optional override)
- `CONTACT_NINJA_FORMS_FIELD_MAP_JSON` (optional JSON field map)
- If endpoint is not set, it defaults to `WP_API_URL` or `NEXT_PUBLIC_WP_URL` + `/wp-json/ninja-forms-submissions/v1/submit`

WordPress REST mode:

- `CONTACT_WORDPRESS_ENDPOINT` (required)

Webhook mode:

- `CONTACT_WEBHOOK_ENDPOINT` (required)

### Posted Payload Shape

The contact API receives and validates this payload:

- `firstName` (required)
- `lastName` (required)
- `email` (required)
- `phone` (optional)
- `subject` (optional)
- `preferredLocation` (optional)
- `message` (required, min length 10)
- `newsletterOptIn` (boolean)

There is also a hidden honeypot field named `website` for simple bot filtering.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
