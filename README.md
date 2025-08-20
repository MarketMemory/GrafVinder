# GrafVinder

Een platform voor het vinden en beheren van graven in Nederland.

## Features

- Zoeken naar graven
- Graf informatie toevoegen
- Herinneringen delen
- Gebruikersauthenticatie via Supabase

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Database & Auth)
- Vercel (Deployment)

## Development

\`\`\`bash
npm install
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in je browser.

## Environment Variables

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=https://grafvinder.vercel.app
