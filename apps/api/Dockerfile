FROM node:22-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json

RUN corepack pnpm install --frozen-lockfile

COPY . .

RUN corepack pnpm db:generate
RUN corepack pnpm --filter api build

EXPOSE 4000

CMD ["sh", "-c", "corepack pnpm prisma migrate deploy && node apps/api/dist/src/index.js"]
