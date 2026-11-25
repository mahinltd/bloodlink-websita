# BloodLink Public Website

Public website for BloodLink (`bloodlink.tech`).

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a local environment file from `.env.example` and set values:

   ```bash
   cp .env.example .env.local
   ```

   Required environment variables:

   - `NEXT_PUBLIC_API_URL`: Backend public API base URL including `/api/v1` (example: `https://api.bloodlink.tech/api/v1`).
   - `NEXT_PUBLIC_SITE_URL`: Public website URL used for metadata, sitemap, and robots (example: `https://bloodlink.tech`).
   - `NEXT_PUBLIC_GOOGLE_VERIFICATION`: Optional Google Search Console verification token.

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
npm run start
```

## Backend Alignment

The website consumes public backend endpoints documented in `docs/`:

- `GET /config/stats`
- `GET /hospitals`
- `GET /blood-banks`
- `GET /app-version`

Ensure `NEXT_PUBLIC_API_URL` points to the same backend environment whose API contract matches these docs.
