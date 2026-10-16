# CKS technical audit

Audit snapshot: 2026-10-16. This records the current demo implementation and the checks run in this workspace; it is not a security certification or production-readiness claim.

## Confirmed foundation

- The CKS frontend is a React, TypeScript, and Vite application in the existing pnpm workspace.
- The demo has dashboard, markets, trade, wallet, activity, card-preview, and settings routes.
- Buy, sell, and send actions update browser-local demo balances and a locally stored illustrative journal. The interface labels these actions and values as simulated.
- The project typecheck passed before this audit's changes. A frozen pnpm install also completed successfully.
- The API server currently exposes only `/api/healthz`. Its middleware uses open CORS, and there are no account or financial endpoints.
- The Drizzle schema contains no application tables. The database package requires `DATABASE_URL` when imported; it is not used by the CKS demo.

## Confirmed limitations and risks

- Browser `localStorage` is the only persistence for the demo; it is not an account store or an authoritative ledger.
- Market prices, portfolio movements, and foreign-currency display rates are illustrative, not provider data.
- No authentication, account isolation, KYC, market-data, exchange execution, blockchain/custody, deposit, withdrawal, or card-issuer integration is implemented.
- The card is a visual prototype. The receive identifier is intentionally non-routable.
- The prior persistence loader only checked for a balances object and a transactions array before rebuilding journal rows. Malformed nested fields could therefore fail during hydration.
- Vite requires `PORT` and `BASE_PATH`. The workspace-wide build initially failed without these artifact runtime variables, making a local root build non-reproducible.
- The original logo and favicon references were root-relative, so they would not resolve under a non-root Vite base path.
- There were no project unit, integration, or browser end-to-end tests before this audit.

## Implemented in this audit

- Persisted demo data now has a Zod-validated schema, a versioned format, and migration support for the prior unversioned shape.
- Stored journal rows are discarded and recalculated from validated transaction fields; invalid data recovers to the starter scenario instead of crashing the app.
- Local storage failures are caught and disclosed in Settings, where users can see when data will not survive a reload.
- Build scripts provide artifact-specific defaults when invoked outside managed workflows, while preserving explicit `PORT` and `BASE_PATH` overrides.
- The logo, favicon, and app entry path now honor Vite's base path. Route-specific title and description metadata is set for the app pages.
- Focused persistence tests cover migration, forged journal rows, invalid data, and round trips.

## Remaining work, in recommended order

1. Keep the demo stable: complete manual route and interaction checks, improve date/asset filters and pagination, and add browser-based tests.
2. Before building user accounts or persisted financial state, decide the intended regulated operating model and provider boundaries. Implement server-side authentication, authorization, database schema, migrations, and idempotent ledger operations as a separately reviewed phase.
3. Connect market, exchange, wallet, and card providers only after provider selection, credentials, legal approvals, and security controls are available. Until then, preserve the demo labels and do not imply real execution.

No real financial integration, database migration, account system, or production deployment was performed as part of this audit pass.
