---
version: alpha
name: SmartFellas
description: A warm, scoreboard-inspired design system for turning bar trivia sheets into polished team performance dashboards.
colors:
  primary: "#8F2731"
  on-primary: "#FFF8EC"
  primary-muted: "#F2DDE0"
  accent: "#D8A23A"
  on-accent: "#241A08"
  surface: "#FFF8EC"
  surface-raised: "#FFFFFF"
  surface-muted: "#F5EBDD"
  on-surface: "#1F2428"
  muted: "#6D7378"
  border: "#D8CBBB"
  success: "#2F7D4F"
  error: "#B23B3B"
  warning: "#B97912"
  info: "#2F5F89"
typography:
  display:
    fontFamily: "Oswald, Inter, sans-serif"
    fontSize: "48px"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "0"
  h1:
    fontFamily: "Oswald, Inter, sans-serif"
    fontSize: "36px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "0"
  h2:
    fontFamily: "Oswald, Inter, sans-serif"
    fontSize: "28px"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "0"
  h3:
    fontFamily: "Oswald, Inter, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0"
  label:
    fontFamily: "Oswald, Inter, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0"
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0"
  body-strong:
    fontFamily: "Inter, sans-serif"
    fontSize: "16px"
    fontWeight: 650
    lineHeight: 1.45
    letterSpacing: "0"
  caption:
    fontFamily: "Inter, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: "0"
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: "0"
rounded:
  none: "0px"
  sm: "4px"
  md: "6px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  2xl: "32px"
  3xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "#76212A"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
    height: "44px"
  button-secondary:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
    height: "44px"
  input:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
    height: "42px"
  wager-chip:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.pill}"
    padding: "6px 10px"
    height: "34px"
  wager-chip-selected:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.pill}"
    padding: "6px 10px"
    height: "34px"
  category-chip:
    backgroundColor: "{colors.primary-muted}"
    textColor: "{colors.primary}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: "5px 10px"
    height: "30px"
  kpi-card:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "16px"
  chart-panel:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "16px"
  form-section:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "16px"
  table-header:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "8px 10px"
  alert-success:
    backgroundColor: "#E4F4EA"
    textColor: "{colors.success}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "12px 14px"
  alert-error:
    backgroundColor: "#F8E4E4"
    textColor: "{colors.error}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "12px 14px"
  modal:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "24px"
---

# SmartFellas Design System

## Overview
SmartFellas should feel like a clever scoreboard built from the DNA of a real bar trivia sheet. The north star is warm, structured, and stats-forward: paper-to-data, not generic SaaS. The product can carry the SmartFellas/Fart Smellas joke, but the joke should show up as small flavor in copy, badges, or logo treatment rather than taking over the interface. The UI should never become a novelty app, a fake pub theme, or an oversized marketing page where dense trivia data has no room to breathe.

## Colors
The palette starts from the sheet: deep burgundy headers, off-white paper, charcoal ink, and a warm highlight color. `primary` is the burgundy brand anchor used for navigation, key buttons, selected wagers, and table headers. `accent` is an amber prize/highlight color for wins, active chart points, and celebratory details; use it sparingly so it still feels earned. `surface` and `surface-muted` keep the app warmer than a pure white dashboard, while `on-surface` stays dark enough for WCAG AA contrast. Semantic colors are practical and direct: green for correct/success, red for incorrect/error, amber for warnings, and blue only for neutral information.

## Typography
Use Oswald for the scoreboard layer: page titles, section headers, round labels, table headers, and compact stat labels. It echoes the condensed uppercase feel of the trivia sheet without making the entire product shout. Use Inter for body copy, forms, tables, dashboard values, and anything users need to read repeatedly. The type scale keeps large display type available for brand moments, but most app screens should rely on `h2`, `h3`, `label`, `body`, and `caption`. Letter spacing stays at `0`; do not tighten text to chase a poster effect.

## Layout
The density should be comfortable overall and compact inside the game-entry workflow. Dashboards need enough space for charts and KPI cards to breathe, but the new-game form should mirror the sheet with efficient rows for round, category, wager, and result. Use an 8px-based rhythm from the spacing tokens, with `lg` and `xl` as the default section padding range. On desktop, prefer structured grids and tables; on mobile, collapse into stacked sections without hiding required scoring context. Avoid giant empty sections, oversized cards, and marketing-style hero composition inside the product.

## Elevation & Depth
Use borders and contrast before shadows. The source sheet is made of lines, blocks, and printed headers, so the app should use crisp boundaries, tinted surfaces, and burgundy header bands to create hierarchy. Shadows are reserved for real floating layers such as modals, popovers, menus, and active overlays. Dashboard panels and form sections should usually sit flat on the warm surface with a visible border, not hover like generic SaaS cards.

## Shapes
Structural UI uses a small `6px` radius so panels, inputs, and buttons feel polished but still squared-off and score-sheet-like. Use `4px` for compact table headers or tight embedded elements. Use pill shapes only for objects that behave like compact labels: wager chips, category chips, correctness badges, roles, filters, and status indicators. Do not round large panels heavily; the app should feel crisp and practical, not bubbly.

## Components
`button-primary` is for decisive actions such as saving a game, creating a team, or inviting a teammate. `button-secondary` is for quieter actions like cancel, back, filter, or view details. `input` should be used for all text and numeric entry, with inline validation that explains scoring issues in plain language. Wager chips are a signature component: use `wager-chip-selected` to mimic the circled wager from the paper sheet. `kpi-card`, `chart-panel`, and `form-section` are the main dashboard and logging containers, while `table-header` gives dense data the burgundy score-sheet structure. Alerts should speak in the competitive-but-fun voice: useful first, playful second.

## Do's and Don'ts
Do make the game-entry form feel like a clean digital score sheet. Do use burgundy headers to organize rounds, tables, and primary navigation. Do let amber mark moments of payoff: prizes, best performances, active chart highlights, and selected insights. Do include text summaries alongside charts so the stats remain readable and accessible. Do keep the brand joke subtle enough that outside teams can still take the app seriously.

Don't turn the app into a generic blue-gray SaaS dashboard. Don't make every screen a joke, mascot moment, or novelty brand gag. Don't use huge hero sections, oversized cards, or empty marketing space in the app experience. Don't fake a pub atmosphere with dark wood, neon signs, beer graphics, or decorative clutter. Don't clone a spreadsheet; tables are fine, but the app must add validation, scoring intelligence, charts, and guidance.
