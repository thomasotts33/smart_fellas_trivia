# Private Server Deployment

This deployment is for a private Tailscale beta on one Linux server.

## Files

- `docker-compose.yml`: runs PostgreSQL, the Express API, and the Next.js web app.
- `.env`: create this on the server next to `docker-compose.yml`; do not commit it.

## Server `.env`

```env
TAILSCALE_IP="100.x.y.z"
POSTGRES_PASSWORD="replace-with-a-long-random-hex-password"
DATABASE_URL="postgresql://smartfellas:replace-with-a-long-random-hex-password@db:5432/smartfellas"
NEXTAUTH_URL="http://100.x.y.z:3000"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
API_INTERNAL_SECRET="replace-with-a-different-long-random-secret"
AUTH_TRUST_HOST=true
API_BASE_URL="http://100.x.y.z:4000"
WEB_ORIGIN="http://100.x.y.z:3000"
PORT=4000
SMARTFELLAS_DEV_AUTH_BYPASS=false
```

Google OAuth should include the server callback URL, such as `http://100.x.y.z:3000/api/auth/callback/google`. Use `SMARTFELLAS_DEV_AUTH_BYPASS=true` only for local development, not for a shared private server.

Use an alphanumeric or hex-only Postgres password here. If the password includes URL-special characters, they must be URL-encoded in `DATABASE_URL`.

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
