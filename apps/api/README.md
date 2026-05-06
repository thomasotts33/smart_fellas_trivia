# SmartFellas API

Express API for SmartFellas game logging, team access, and analytics.

## Runtime

- Node.js 20+
- PostgreSQL 15+
- Prisma Client generated from the repo root

## Environment

Set these variables on the API host:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/smartfellas"
NEXTAUTH_URL="https://YOUR-WEB-HOST"
NEXTAUTH_SECRET="use-the-same-long-secret-as-the-web-app"
API_BASE_URL="https://YOUR-API-HOST"
WEB_ORIGIN="https://YOUR-WEB-HOST"
PORT=4000
```

`WEB_ORIGIN` must match the deployed web app origin so CORS accepts browser requests.

## Deploy

1. Provision a managed PostgreSQL database.
2. Add the environment variables above to the API host.
3. Run `corepack pnpm install --frozen-lockfile`.
4. Run `corepack pnpm db:generate`.
5. Run migrations with `corepack pnpm prisma migrate deploy`.
6. Build with `corepack pnpm --filter api build`.
7. Start the API with `node apps/api/dist/src/index.js`.

For a first local beta, seed data can be loaded with `corepack pnpm db:seed` after migrations.

## Health Check

Use `GET /api/health`. A healthy API returns:

```json
{ "status": "ok" }
```
