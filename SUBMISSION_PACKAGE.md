# Liquidity Clock — Colosseum Submission Package

Status: SUBMISSION-READY EXCEPT OPTIONAL REAL VALIDATION / OPTIONAL EXPLORER-CONFIRMED SOLANA PROOF
Date: 2026-10-02

## Product name
Liquidity Clock

## Tagline
Will executable liquidity arrive before your buffer runs out?

## One-line description
Liquidity Clock shows whether executable liquidity can arrive before a treasury's current operating buffer is exhausted.

## Short description
Liquidity Clock is a stress-time decision engine for digital-asset treasuries. It compares current executable liquidity with outflow velocity, maps when additional liquidity routes can actually become usable, identifies the first binding timing gap, and tests the fastest sufficient intervention. Its core metric, the Survival Gap, shows whether liquidity arrives before or after the current buffer runs out.

## Problem
Treasury systems can show how much liquidity exists, but under stress the critical question is whether each source can become executable before the current operating buffer is exhausted.

## Primary user
Treasury / liquidity-risk teams at digital-asset financial institutions, including exchanges, stablecoin issuers, custodians, payments companies and institutional crypto platforms.

## Core insight
Liquidity is not only an amount. Under stress, it is a race between outflow velocity and execution time. A treasury can appear liquid in aggregate and still face a timing failure.

## Founder background / founder-market fit
Rostyslav Honcharenko is a finance and banking graduate and current master's student with professional experience in corporate and SME banking at Oschadbank. His work and research interests span banking, financial stability, liquidity stress and digital finance. That background led to a practical question: institutions often focus on how much liquidity exists, while the operational constraint is how quickly that liquidity can actually become usable.

## Team
Solo founder: Rostyslav Honcharenko.

## Location
Germany. Ukrainian founder currently based in Germany.

## Blockchain / technology
Solana Devnet and Testnet, browser-based Solana Web3 integration, dedicated test-only browser signer, deterministic JavaScript liquidity engine and static responsive web UI.

## Why Solana
Solana is used as a verifiable execution rail rather than a decorative data layer. The product demo itself is deterministic and one-click, so it remains usable even when public test-cluster funding is rate-limited. Live Solana verification runs as a separate background proof layer: the app tries Devnet first and Testnet second, signs locally, submits when test SOL is available, waits for confirmation, and surfaces the real signature, slot and Explorer link only when the chain actually confirms.

If public test funding is unavailable, the app can still show a locally signed proof state but does not label it as on-chain confirmation. This keeps the user flow simple without making a false blockchain claim.

## Security / signer boundary
The MVP uses a dedicated test-only browser signer and never requires mainnet funds. The signer is not a production custody mechanism. A production version would use an institutional signer, custody provider, approval policy and access-control layer.

## Technical architecture
1. Synthetic treasury scenario defines operating liquidity, stress outflow and route timing.
2. Deterministic engine calculates buffer horizon and first binding Survival Gap.
3. Available interventions are tested for timing and sufficiency.
4. The user runs the recommended liquidity rescue with one click.
5. The deterministic scenario immediately demonstrates the projected effect and recalculates the Survival Gap.
6. In parallel, the Solana verification layer attempts Devnet first and Testnet second.
7. If a public test-cluster transaction confirms, the app surfaces real signature / slot / timing / Explorer evidence.
8. If public funding is unavailable, no false on-chain success is shown.

## Golden demo
Before:
- Executable liquidity: 1.50M LQUSD
- Outflow: 150k LQUSD/min
- Buffer horizon: 10:00
- Next committed liquidity: 17:00
- Survival Gap: -07:00

Intervention:
- Deploy Solana Reserve
- Scenario notional: 3.15M LQUSD

Simulated product outcome:
- Executable liquidity: 4.65M LQUSD
- Buffer horizon: 31:00
- Next committed liquidity: 17:00
- Survival Gap: +14:00

Optional live verification:
- Real Solana public test-cluster proof when test funding is available.
- Real slot / signature / Explorer shown only after actual chain confirmation.

## Generalization beyond the golden demo
The MVP includes Custom Stress. A reviewer can change executable liquidity, stress outflow, next committed amount / arrival time, and reserve amount / ETA. The deterministic engine recomputes the Survival Gap and refuses to recommend an intervention that arrives after buffer exhaustion.

## Current Solana scope — precise claim
Treasury amounts such as 3.15M LQUSD remain synthetic public-safe scenario notional. The live Solana layer verifies execution / settlement workflow when a transaction actually confirms; it is not presented as a real 3.15M-value asset movement.

## GitHub
https://github.com/rostys-fintech/rostys-fintech/tree/liquidity-clock

## Product URL
https://rostys-fintech.github.io/rostys-fintech/

## Pitch video
Public page:
https://liquidity-clock-videos.floot.app/pitch

Direct MP4:
https://liquidity-clock-videos.floot.app/_cdn/static/ead635b3-a328-4a74-8ce3-57e7ed39df73-liquidity-clock-pitch.mp4

Duration: 2:15.

## Technical demo
Public page:
https://liquidity-clock-videos.floot.app/demo

Direct MP4:
https://liquidity-clock-videos.floot.app/_cdn/static/2f1bb132-35e7-49e3-b424-f1f0854adea5-liquidity-clock-demo.mp4

Duration: 1:43.

## Go-to-market
Land with a free Liquidity Stress Diagnostic that lets treasury teams map route amount + ETA + rail and identify the first binding timing gap. Expand into live wallet / custodian / exchange integrations, execution-time calibration, monitoring, alerts and execution orchestration.

## Business model
B2B SaaS. Initial design-partner pilots are free. Later pricing is a hypothesis and should not be presented as validated revenue.

## Market positioning
Existing treasury infrastructure helps teams see, control and move liquidity. Liquidity Clock adds a stress-time decision layer: will that liquidity actually arrive before the executable buffer runs out?

## Validation
STATUS: REAL CUSTOMER-DISCOVERY EVIDENCE OPTIONAL BEFORE SUBMIT.

Safe wording if no responses are available:

> Early customer discovery is ongoing. The current MVP is designed to test whether treasury and liquidity-risk teams find time-to-executable-liquidity more decision-useful than a balance-only view. No paying-customer or validated-demand claim is made yet.

Do not enter invented counts, quotes, users, revenue or customer claims.

## Distribution plan
1. Founder-led outreach to treasury, liquidity-risk and crypto operations professionals.
2. Solana / Colosseum community beta testing.
3. Free stress diagnostic as low-friction entry point.
4. Integration partnerships with wallets, custodians, exchanges and treasury platforms.

## Venture-scale vision
Build an executable-liquidity orchestration layer that normalizes time-to-usability across wallets, exchanges, stablecoins, bank rails, tokenized assets and credit facilities, then helps treasury teams decide and execute the fastest viable route under stress.

## Pre-existing work disclosure
Before the hackathon, the founder had academic experience and research interests in banking, financial stability and liquidity. Private or submission-sensitive academic materials are not reproduced in this repository.

## Public-safety statement
All institutions, balances, rates, routes and scenario timings in the public MVP are synthetic. No unpublished manuscript text, reviewer correspondence, restricted data or case-specific private research assets are included.

## Claims we may make
- Synthetic public-safe stress engine.
- Deterministic first-binding-gap logic.
- One-click simulated liquidity rescue.
- Real Solana test-cluster verification only when a transaction is actually confirmed.
- Transparent separation between synthetic notional and chain proof.

## Claims we must NOT make
- Paying customers unless verified.
- Validated pricing unless verified.
- Real LQUSD token or stablecoin.
- Live on-chain proof before a transaction is actually confirmed.
- Prediction of insolvency or bank failures.
- Solana eliminates liquidity risk.

## FINAL GATE

Ready now:
- product
- public product URL
- GitHub
- pitch video URL
- technical demo URL
- founder / team / location
- chain / technology description
- GTM / distribution / business model hypothesis
- claims integrity

Optional before submit:
- replace the safe validation wording only if real evidence arrives;
- add Explorer-confirmed Solana proof only if a transaction actually confirms.

Otherwise the package is ready for final portal audit and submission.