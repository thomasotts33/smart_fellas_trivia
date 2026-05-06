# MVP QA Checklist

Use this before sharing SmartFellas with beta teammates.

## Local Smoke Test

- [ ] `corepack pnpm db:generate` completes.
- [ ] `corepack pnpm prisma validate` completes.
- [ ] `corepack pnpm db:seed` completes.
- [ ] API health returns `{ "status": "ok" }`.
- [ ] Web app loads at `http://localhost:3000`.

## Game Entry

- [ ] A new game can be logged with date, venue, placement, total teams, prize, and notes.
- [ ] Rounds 1-3 require wagers 2, 4, and 6 exactly once per round.
- [ ] Rounds 4-6 require wagers 5, 7, and 9 exactly once per round.
- [ ] Duplicate or missing wagers show an error before submit.
- [ ] Long category names do not break the form at 390px, 768px, or desktop widths.
- [ ] Refreshing the new-game page preserves unsaved draft data.
- [ ] A successful save clears the draft and opens the game detail page.

## Scoring Cases

- [ ] Correct regular questions add the selected wager.
- [ ] Wrong regular questions earn 0.
- [ ] Halftime calculates partial credit from `partsCorrect / partsTotal * pointsPossible`.
- [ ] Final correct adds the final wager.
- [ ] Final wrong subtracts the final wager.
- [ ] Game totals match the paper host sheet after entry.

## Team Access

- [ ] Owner/admin can add an existing user by email.
- [ ] Member can view dashboard and games.
- [ ] Member cannot see new-game, edit, or delete controls.
- [ ] API denies unauthorized member edits even if the UI is bypassed.

## Dashboard

- [ ] Empty state appears before any games are logged.
- [ ] One-game state sets expectations for trends.
- [ ] KPI cards update after a saved game.
- [ ] Percent-correct and points trend charts render.
- [ ] Category, wager, round, prize, and placement sections render with seeded data.
- [ ] Tables and charts do not overflow on mobile.

## Accessibility

- [ ] Keyboard-only navigation can reach all form fields and buttons.
- [ ] Focus outlines are visible.
- [ ] Form errors are announced as alerts.
- [ ] Charts include text or ARIA summaries.
- [ ] Game history has a table label.

## Production Readiness

- [ ] API host has `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `API_BASE_URL`, `WEB_ORIGIN`, and `PORT`.
- [ ] Web host has `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `API_BASE_URL`, `NEXT_PUBLIC_API_BASE_URL`, and `AUTH_TRUST_HOST`.
- [ ] Prisma migrations run against the production database.
- [ ] Vercel points browser requests at the hosted API, not localhost.

## Out of Scope for MVP

- [ ] Live in-game scoring.
- [ ] Email invite delivery.
- [ ] Offline sync.
- [ ] Multi-team switching.
- [ ] Advanced venue or opponent analytics.
