# Private Server Deployment

This deployment is for a private Tailscale beta on one Linux server.

## Files

- `docker-compose.yml`: runs PostgreSQL, the Express API, and the Next.js web app.
- `.env`: create this on the server next to `docker-compose.yml`; do not commit it.

## Server `.env`

```env
TAILSCALE_IP="100.x.y.z"
POSTGRES_PASSWORD="replace-with-a-long-random-password"
DATABASE_URL="postgresql://smartfellas:replace-with-a-long-random-password@db:5432/smartfellas"
NEXTAUTH_URL="http://100.x.y.z:3000"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"
AUTH_TRUST_HOST=true
API_BASE_URL="http://100.x.y.z:4000"
NEXT_PUBLIC_API_BASE_URL="http://100.x.y.z:4000"
WEB_ORIGIN="http://100.x.y.z:3000"
PORT=4000
SMARTFELLAS_PRIVATE_BETA_EMAIL="thomas@smartfellas.local"
SMARTFELLAS_PRIVATE_BETA_NAME="Thomas"
NEXT_PUBLIC_PRIVATE_BETA_EMAIL="thomas@smartfellas.local"
```

The private beta identity is only appropriate for a Tailscale-only deployment. Do not use it for a public internet deployment.

## Commands

```bash
cd ~/repo/smart_fellas_trivia/deploy
docker compose up -d --build
docker compose ps
```

Open the app from a Tailscale-connected device:

```text
http://100.x.y.z:3000
```
