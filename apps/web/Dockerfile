FROM node:22-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json

RUN corepack pnpm install --frozen-lockfile

COPY . .

ARG API_BASE_URL
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_PRIVATE_BETA_EMAIL

ENV API_BASE_URL=$API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_PRIVATE_BETA_EMAIL=$NEXT_PUBLIC_PRIVATE_BETA_EMAIL

RUN corepack pnpm --filter web build

EXPOSE 3000

CMD ["corepack", "pnpm", "--filter", "web", "exec", "next", "start", "-p", "3000", "-H", "0.0.0.0"]
