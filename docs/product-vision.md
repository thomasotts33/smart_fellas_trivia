# Product Vision - SmartFellas

## 1. Vision & Mission

### Vision Statement
Weekly trivia teams should be able to see their progress, strengths, and habits as clearly as any serious sports team sees its season.

### Mission Statement
SmartFellas turns post-game bar trivia sheets into structured team history, visual performance trends, and lightweight strategy insights.

### Founder's Why
Thomas is not approaching this as an abstract SaaS idea. He is the first user: a Wednesday general knowledge trivia regular who already has the paper sheets, the team context, the recurring habit, and the curiosity to ask whether the team is actually improving.

His IT QA background matters because this product lives in a deceptively messy workflow. The weekly sheet has structure, but the real data arrives as circled wagers, checkmarks, category labels, partial halftime scoring, final wager outcomes, placement, prizes, and random notes. A QA mindset is useful here: the scoring rules need to be explicit, the inputs need guardrails, and the app needs to support the real workflow instead of the idealized version.

This is also a learning-oriented full-stack build. The product should be useful to the team, but it should also give Thomas practical reps in product planning, API design, relational data modeling, validation, auth, dashboards, and testable business logic.

### Core Values
**Respect game night.** SmartFellas should never make live trivia feel like work. The app exists for post-game entry and reflection, because phones are not allowed during questions and because the social energy of the night matters more than perfect real-time logging.

**Make the scoring rules visible.** The app should model the actual format: rounds 1-3 use 2/4/6 wagers once per round, rounds 4-6 use 5/7/9 wagers once per round, halftime allows partial credit, and the final question is a positive or negative wager. Users should not need to remember hidden rules the app can enforce.

**Visualize before optimizing.** The first value is not advanced recommendations. It is helping the team see percent correct, points earned, category performance, and progress over time. Strategy can come later once the data is trustworthy.

**Build for one team first.** Multi-team support is part of the six-month vision, but the first product should feel excellent for Thomas's own team. A focused personal workflow will create a stronger base than a generic team platform too early.

**Keep the joke, earn the polish.** The SmartFellas name carries the team's Fart Smellas / Smart Fellas joke, but the app should still feel like a real product. The brand can be playful without becoming sloppy.

### Strategic Pillars
**Post-game entry is the core workflow.** Any feature that makes after-game logging faster, clearer, or more accurate gets priority over live play features.

**Dashboard value must arrive quickly.** The magic moment is seeing improvement across Wednesdays. The product should make that visible as soon as a few games are logged.

**Analytics must be explainable.** Percent correct, points earned, wager performance, category trends, and prize history should be calculated in ways users can understand and trust.

**Expansion should not corrupt the MVP.** Teammate accounts and multi-team support are important, but they should extend the team model rather than forcing a heavyweight admin app before the core loop is proven.

### Success Looks Like
In 12 months, SmartFellas is a polished web app with Thomas's team using it as a weekly habit, 40+ logged games, teammate accounts, clear category and round dashboards, and a small beta group of local trivia teams testing their own team spaces. The app is also credible as a portfolio project: the scoring engine is tested, the API is clean, the Postgres model is understandable, and the product tells a real story about QA thinking applied to a fun domain.

## 2. User Research

### Primary Persona
Thomas, the team stat keeper, is a regular Wednesday trivia player with enough technical comfort to enter structured results after a game. He remembers the close misses, cares about whether the team is improving, and is willing to spend a few minutes logging data if the payoff is a dashboard that reveals trends. Today, he relies on paper sheets, phone photos, and memories, with an earlier Python-to-Power-BI experiment proving the idea but feeling too heavy for weekly use. He will switch if the app is faster than his old workflow and gives teammates something worth checking.

### Secondary Personas
Teammates are dashboard viewers first. They may not want to manage data entry, but they want to see recent results, favorite categories, improvement trends, and prize history. Their adoption depends on the app being easy to access and fun to review after the game.

Future team admins are other trivia regulars who hear about SmartFellas locally and want a similar space for their own team. They need team creation, member invites, and the same structured game format without seeing Thomas's team data.

Venue or host partners are a possible later audience, but not a near-term user. They could eventually care about engagement and recurring team performance, but designing for them now would pull the app away from its best first use case.

### Jobs To Be Done
Functionally, Thomas needs to convert a completed paper trivia sheet into a structured game record: rounds, categories, wagers, results, halftime score, final wager, placement, and prizes.

Emotionally, he wants the satisfying feeling of turning "we think we are getting better" into "we can see it." The product should make progress tangible without making the team feel over-managed.

Socially, SmartFellas lets Thomas share something useful and entertaining with teammates. It should make him look prepared and clever, not like he built a spreadsheet nobody asked for.

### Pain Points
**The old analytics workflow is too heavy.** This is the highest-severity pain because Thomas has already proven that manual entry plus Power BI can work, but the workflow is not live, polished, or teammate-friendly. It happens every week and blocks the habit from becoming social.

**Paper preserves the moment but loses the insight.** The host sheet captures the game, but it does not calculate trends, category accuracy, wager outcomes, or progress. This happens every game, though the consequence is moderate because the team can still play without solving it.

**The scoring format has enough rules to invite mistakes.** Wager values reset by round group, halftime has partial credit, and final wagers can subtract points. If the app does not enforce these rules, users will mistrust the data.

**Teammates need value without work.** If the app only serves the person entering data, adoption will stall. Teammates need a dashboard experience that is worth logging into even if they never enter a game.

### Current Alternatives & Competitive Landscape
Paper sheets and phone photos are the real current alternative. They are perfect during the game because the host already provides them, but they are poor at long-term memory and analysis.

Spreadsheets, notes apps, and Power BI can capture structured data, but they require Thomas to rebuild the scoring system and dashboards manually. They are flexible, but too much of the product experience depends on Thomas maintaining a custom workflow.

Generic trivia or scorekeeping apps focus on live play, quiz hosting, or simple scores. SmartFellas is different because it is not trying to run the game. It is a post-game performance tracker designed around a repeated weekly format.

Doing nothing is also a competitor. The team can keep playing without this product. SmartFellas wins only if the dashboard payoff feels fun enough to justify a few minutes after each game.

### Key Assumptions to Validate
We assume Thomas will consistently log games after trivia because the dashboard payoff is worth the effort. To validate: log 4 consecutive games and measure whether entry still feels tolerable.

We assume teammates will create accounts and check stats even if they do not enter data. To validate: invite at least 3 teammates and ask what they looked at without prompting.

We assume the fixed weekly format is stable enough to model directly. To validate: compare at least 6 sheets and note any format exceptions.

We assume category labels can be normalized manually without becoming annoying. To validate: track how often duplicate category names appear, such as "movies" vs "film."

We assume visual trends are more valuable than raw game history. To validate: ask teammates which dashboard charts they remember or discuss.

We assume multi-team expansion can use the same data model. To validate: show the app to 1-2 outside teams and ask whether their scoring format matches closely enough.

We assume OCR/photo extraction should be deferred. To validate: measure manual entry time before investing in image processing.

### User Journey Map
Thomas first thinks of SmartFellas after another Wednesday game where the paper sheet has useful information but no easy way to analyze it. In consideration, he compares it to his old Python and Power BI workflow and decides the product must be lighter, web-based, and easier to share.

On first use, he creates a team, logs a completed game from the paper sheet, and sees the game appear in history. The first friction point is data entry: if the form feels too generic or does not match the sheet, the habit will break.

The magic moment arrives after several games when the dashboard shows percent correct and points earned moving across Wednesdays. The team can see a story, not just a score. Habit formation happens when logging becomes a normal post-game ritual and teammates start checking the dashboard afterward.

Advocacy begins locally. Thomas can show another team or the host that SmartFellas has real team stats, not just a one-off spreadsheet. The product spreads if other teams see themselves in the workflow.

## 3. Product Strategy

### Product Principles
**Mirror the sheet.** The logging flow should match the physical game structure closely enough that Thomas can copy data without translation.

**Separate correctness from points.** A question can be correct, wagered, earned, or lost in different ways. The data model and UI should preserve those distinctions.

**Make trends the reward.** The dashboard should be the emotional payoff. Game history is useful, but visual progress is what makes the app feel alive.

**Keep entry manual before smart.** Manual entry is acceptable if it is quick and reliable. OCR, photo parsing, and automation are later upgrades.

**Use team access carefully.** Teammates should be able to view shared stats early, but edit permissions should remain controlled to protect data quality.

### Market Differentiation
SmartFellas is not a quiz host, a live scorekeeper, or a generic analytics dashboard. Its edge is that it understands the recurring trivia team workflow: paper during the game, structured entry afterward, and visual performance history over time. That matters because the team is not trying to run trivia. They are trying to remember, compare, and improve. The defensibility comes from modeling the niche well enough that spreadsheets feel like too much work and generic scorekeeping apps feel irrelevant.

### Magic Moment Design
The magic moment is the dashboard showing percent correct and points earned improving across several Wednesdays. For this to happen reliably, the MVP must include game logging, historical game storage, point calculation, and at least two visualizations over time. The shortest path is: sign in, create or join the team, log three games, visit dashboard, see trend charts. If the MVP stops at CRUD without charts, it misses the product's reason to exist.

### MVP Definition
The MVP must include authentication, one team space, teammate viewing, post-game logging, scoring validation, game history, and a visual dashboard. "Done" means Thomas can enter a real sheet after trivia, save it, and see the dashboard update.

Game logging must cover rounds 1-6, halftime, final question, placement, and prizes. It is essential because every insight depends on trustworthy game data.

Analytics must include percent correct over time, points earned over time, category performance, round performance, and wager performance. These are essential because the product's promise is visual improvement, not mere storage.

Team access must allow teammates to sign in and view shared stats. This is essential for the 90-day goal and turns the app from a private tool into a team product.

### Explicitly Out of Scope
Live question tracking is out of scope because phones are not allowed during questions and because live entry would make the product tiring.

Photo OCR is out of scope for v1 because it adds computer vision complexity before the manual flow is proven. Reconsider after manual entry time is measured across several games.

Host or venue admin features are out of scope because they serve a different audience. Reconsider only after several teams are using the app.

Payments are out of scope because the app is free while validating the habit and multi-team interest.

Advanced strategy recommendations are out of scope until enough data exists. Reconsider after 20+ logged games.

### Feature Priority (MoSCoW)
**Must Have:** Auth, team creation, teammate invites or membership, game logging, scoring rules, game history, dashboard charts, category analytics, round analytics, wager analytics.

**Should Have:** Prize and placement history, editable game records, CSV export, basic account settings, role-based edit permissions.

**Could Have:** Image attachment for original paper sheet, category normalization tools, notes field, final-question trend breakdown, public demo data.

**Won't Have This Time:** OCR, live scoring, payments, venue dashboards, host tools, deep recommendation engine.

### Core User Flows
**Create team and invite teammates.** Thomas signs in, creates the SmartFellas team, and invites teammates or adds them by email. Success means teammates can access the team dashboard but cannot accidentally corrupt game data.

**Log a completed game.** Thomas creates a new game, enters date, venue, rounds, categories, wagers, outcomes, halftime score, final wager, placement, and prizes. Success means the app calculates totals and rejects invalid scoring combinations.

**Review team performance.** A teammate opens the dashboard after a game and sees recent games, percent correct over time, points earned over time, category strengths, and wager performance. Success means the latest game is reflected without manual chart work.

### Success Metrics
The primary metric is active weekly use: at least one game logged per Wednesday for 8 of the first 10 weeks after launch.

Secondary metrics are teammate adoption and dashboard engagement. Good is 3 teammate accounts and at least 2 teammate dashboard visits per month. Great is 5 teammate accounts and dashboard discussion after most games.

Data quality is also a success metric. Good is less than 5 minutes to enter a game with no unresolved validation errors. Great is less than 3 minutes after the form is familiar.

### Risks
The largest risk is that manual entry feels like homework. Mitigation: mirror the sheet, use defaults, validate inline, and measure entry time.

Another risk is that the first few games do not create enough trend value. Mitigation: show useful single-game summaries while encouraging multiple-game trends.

Category data may become messy. Mitigation: allow suggested existing categories and normalize names.

Auth and team permissions may consume more time than expected. Mitigation: keep roles simple: owner/admin can edit, members can view.

The custom Node/Express backend may slow the build compared with managed backends. Mitigation: keep the API RESTful, test scoring logic independently, and avoid over-engineering.

Multi-team scaling may require earlier tenancy decisions. Mitigation: include team_id on core tables from the start.

The brand joke could read unpolished outside the original team. Mitigation: use SmartFellas as the clean product name and keep the Fart Smellas joke as team/logo flavor.

## 4. Brand Strategy

### Positioning Statement
For weekly bar trivia teams who want to know whether they are actually improving, SmartFellas is the post-game performance tracker that turns paper sheets into visual team trends. Unlike live scorekeeping apps or spreadsheets, SmartFellas focuses on completed games, real trivia scoring rules, and team progress over time.

### Brand Personality
SmartFellas is a bar-night strategist: casual, clever, confident, and slightly mischievous. It talks like the teammate who can make a joke, remember the final wager, and still pull up the numbers when someone asks if the team is getting better. It would wear a clean hoodie to the bar, not a blazer. It would never bury users in corporate analytics language.

### Voice & Tone Guide
| Context | Do | Don't |
| --- | --- | --- |
| Onboarding | "Create your team and start turning Wednesdays into a win-loss story." | "Configure your organization workspace." |
| Error states | "That wager does not fit this round." | "Invalid input submitted." |
| Empty states | "No games yet. Log your first sheet and let the numbers talk." | "There is no data available." |
| Success messages | "Logged. Let's see what the numbers say." | "Record successfully persisted." |
| Marketing copy | "Track what you know, what you miss, and how you improve." | "An innovative analytics solution for trivia operations." |

### Messaging Framework
Tagline: **Know what you know. Track what you miss.**

Homepage headline: **Turn weekly trivia sheets into team performance history.**

Value proposition 1: SmartFellas mirrors the real game format, so post-game entry feels natural.

Value proposition 2: SmartFellas visualizes progress, category strengths, and wager performance without spreadsheets.

Value proposition 3: SmartFellas gives teammates a shared dashboard they can check after game night.

Objection handler: If someone says a spreadsheet can do this, the answer is: yes, but only if someone keeps rebuilding the workflow. SmartFellas makes the habit easier, more visual, and team-accessible.

### Elevator Pitches
**5-second pitch:** SmartFellas turns bar trivia sheets into team stats and progress charts.

**30-second pitch:** SmartFellas is a web app for weekly trivia teams that want to see how they are actually performing. After the game, you enter the sheet, and the app shows category trends, percent correct, wager performance, points earned, placement, and prizes.

**2-minute pitch:** Every Wednesday, our trivia team gets a paper sheet that captures the whole game: categories, wagers, correct answers, halftime, final question, and score. The problem is that the sheet disappears into a phone photo or gets forgotten, so all the useful performance data vanishes. SmartFellas turns that sheet into structured history. It is not a live scorekeeper and it is not trying to host trivia. It is a post-game tracker for teams that want to see what they know, what they miss, and whether they are improving. I am building it because I play every week, I have real data, and my QA background makes me care about clean workflows and reliable scoring. The first ask is simple: use it with our team, refine it until it becomes a habit, then invite a few other local teams to beta test it.

### Competitive Differentiation Narrative
Most trivia tools focus on running the game, asking questions, or keeping a live score. Most analytics tools are too generic and force teams into spreadsheets, dashboards, and manual formulas. SmartFellas sits in the neglected middle: the game already happened, the team has a structured sheet, and now they want insight. By modeling the real scoring format and turning completed games into visual trends, SmartFellas gives casual competitive teams a reason to keep history without building their own analytics stack.

## 5. Visual Design

Visual design tokens (colors, typography, spacing, components, motion) live in `docs/design.md`. If that file does not yet exist, run `/plaid design` with image references to generate it before building.
