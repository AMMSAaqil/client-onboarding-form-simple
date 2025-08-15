# Client Onboarding Form (Next.js + RHF + Zod)

A minimal, accessible client onboarding form built with **Next.js (App Router)**, **React Hook Form**, and **Zod**. Submits validated JSON to an **external endpoint** (no local API routes).

## Tech
- Next.js (App Router)
- React Hook Form
- Zod + @hookform/resolvers/zod
- Styling: plain CSS (globals.css)

## Environment
Create `.env.local`:

```
NEXT_PUBLIC_ONBOARD_URL=https://example.com/api/onboard
```

> Replace with your real endpoint when integrating. Must be absolute URL. The app posts using `fetch` with `Content-Type: application/json` and the validated body.

## Run
```
npm install
npm run dev
```
Visit http://localhost:3000/onboard

## Validation Rules
- Full name: required; 2–80 chars; letters/spaces/'/- only
- Email: required; valid email
- Company name: required; 2–100 chars
- Services: required; choose ≥1 from UI/UX, Branding, Web Dev, Mobile App
- Budget (USD): optional; integer 100–1,000,000
- Project start date: required; today or later
- Accept terms: required; must be checked

## UX
- Submit button disabled while submitting
- Values persist on validation errors (RHF default)
- Inline error messages
- Top-level error alert on non-2xx / network error
- Success alert with submitted summary on 2xx
- Keyboard navigable, visible focus states

## Bonus Implemented
- Pre-fill services from query params:
  - `?service=UI%2FUX`
  - `?services=UI%2FUX&services=Web%20Dev`
- Unit tests for Zod schema (`npm test`)

## Assumptions
- External endpoint accepts the exact JSON shape produced by the schema.
- No file uploads; JSON only.
- Date validation compares at local midnight granularity (today-or-later).

## Code Structure
- `app/onboard/page.tsx` – form page (client component)
- `lib/schema.ts` – Zod schema & types
- `lib/services.ts` – allowed service options
- `components/Alert.tsx` – accessible alert/status component

## Example Request Body
```json
{
  "fullName": "Ada Lovelace",
  "email": "ada@example.com",
  "companyName": "Analytical Engines Ltd",
  "services": ["UI/UX", "Web Dev"],
  "budgetUsd": 50000,
  "projectStartDate": "2025-09-01",
  "acceptTerms": true
}
```

## Submission
- Create public repo `client-onboarding-form-simple`
- Push code + README
- Email link to **hiring@bestyinternational.com** with subject `Client Onboarding – <Your Name>`
- Include: repo URL, 1-paragraph summary of choices, known gaps