# CKS Crypto Klein Shop

A browser-only, interactive cryptocurrency platform demo with an illustrative portfolio, sandbox trading, wallet previews, an activity journal, and digital-card concept.

## Run & Operate

- `pnpm --filter @workspace/cks-demo run dev` — run the CKS demo web app through its managed workflow
- `pnpm --filter @workspace/cks-demo run typecheck` — typecheck the CKS frontend
- `pnpm --filter @workspace/cks-demo run build` — build the static frontend
- The CKS demo does not require API credentials or a database.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/cks-demo/src/pages/` — dashboard, markets, sandbox trade, wallet, activity, card preview, and settings.
- `artifacts/cks-demo/src/lib/demo-store.tsx` — seeded demo state, browser persistence, integer-unit helpers, and balanced per-asset journal entries.
- `artifacts/cks-demo/src/index.css` — shared visual tokens and responsive styles.

## Architecture decisions

- This is a demo only: balances, prices, sends, trades, and card controls are illustrative and local to the browser. They must never imply that real financial services are connected.
- Demo values persist in browser `localStorage`; there is no user authentication, API, exchange, blockchain, custody, issuer, or database integration.
- Monetary calculations use integer EUR cents and atomic asset quantities; transaction details show balanced demo journal entries per asset.
- Real financial operation requires authorized providers, security review, and jurisdiction-specific legal approval before any production integration.

## Product

Customers can explore the illustrative portfolio, browse sample markets, simulate buy/sell/send flows, inspect transaction references and balanced journal entries, copy a non-routable receive identifier, preview card freeze controls, hide balances, change display currency, and reset the demo.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
