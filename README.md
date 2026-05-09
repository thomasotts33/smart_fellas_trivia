# SmartFellas

SmartFellas is a trivia-night tracker for logging completed paper sheets and turning them into team analytics: round trends, category strengths, wager performance, placement, and prize history.

## Apps

- `apps/web`: Next.js web app.
- `apps/api`: Express API.
- `prisma`: PostgreSQL schema, migrations, and seed data.

## Prerequisites

- Node.js 20+
- Corepack enabled
- pnpm 10.18.3, managed by `packageManager`
- PostgreSQL 15+

For a normal PostgreSQL install on Windows, the core PostgreSQL server is enough. pgAdmin is useful but optional, and Stack Builder add-ons are not required for this MVP.

## Local Setup

1. Copy `.env.example` to `.env`.
2. Set `DATABASE_URL` for your local PostgreSQL database.
3. Set `NEXTAUTH_SECRET` to a long random value.
4. Set `API_INTERNAL_SECRET` to a different long random value shared by the web app and API.
5. For real teammate login, create Google OAuth credentials and set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`. For local-only development without OAuth, set `SMARTFELLAS_DEV_AUTH_BYPASS=true`.
6. Install packages:

```powershell
corepack pnpm install
```

7. Generate Prisma Client:

```powershell
corepack pnpm db:generate
```

8. Apply migrations:

```powershell
corepack pnpm db:migrate
```

9. Seed local sample data:

```powershell
corepack pnpm db:seed
```

10. Start both apps:

```powershell
corepack pnpm dev
```

Local URLs:

- Web: `http://localhost:3000`
- API health: `http://localhost:4000/api/health`

## Useful Commands

```powershell
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm --filter api test
corepack pnpm build
```

## Environment Variables

Use `.env.example` as the source of truth.

- `DATABASE_URL`: PostgreSQL connection string.
- `NEXTAUTH_URL`: Web app URL.
- `NEXTAUTH_SECRET`: Auth.js session secret for the web app.
- `AUTH_TRUST_HOST`: `true` for hosted environments.
- `GOOGLE_CLIENT_ID`: Google OAuth client ID for teammate sign-in.
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret for teammate sign-in.
- `API_INTERNAL_SECRET`: Shared server-to-server signing secret for trusted web-to-API requests.
- `API_BASE_URL`: API URL used by server-side web requests.
- `NEXT_PUBLIC_API_BASE_URL`: Optional API URL for public clients. Browser mutations normally use the Next.js API proxy so identity can be signed server-side.
- `WEB_ORIGIN`: Web origin allowed by the API CORS policy.
- `PORT`: API port.
- `SMARTFELLAS_DEV_AUTH_BYPASS`: Set to `true` only for local development without OAuth.

## Deployment

### Web on Vercel

1. Create a Vercel project from this repo.
2. Use `apps/web` as the project root if Vercel asks for one, or keep the repo root and use `apps/web/vercel.json`.
3. Set:

```env
NEXTAUTH_URL="https://YOUR-WEB-HOST"
NEXTAUTH_SECRET="long-random-auth-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
API_INTERNAL_SECRET="same-long-random-internal-secret-as-api"
API_BASE_URL="https://YOUR-API-HOST"
AUTH_TRUST_HOST=true
```

4. Deploy after the API host and database are available.

### API Host

See `apps/api/README.md`. The API needs PostgreSQL, Prisma migrations, and a public HTTPS URL for the web app.

### Private Tailscale Server

For a private all-in-one Linux server deployment, use `deploy/docker-compose.yml`. This keeps the app, API, and PostgreSQL on the same server and publishes the web/API ports on the server's Tailscale IP.

## Beta Handoff

- Use `docs/qa-checklist.md` before every beta share.
- Keep the first beta to trusted teammates and one real weekly trivia night.
- Known out of scope for this MVP: live scoring during trivia, email invite delivery, offline sync, multi-team switching, and advanced opponent/venue analytics.
- Capture feedback on whether the game-entry form matches the paper sheet, whether dashboard insights are clear, and whether teammate roles feel right.
