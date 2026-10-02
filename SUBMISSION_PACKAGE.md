# Liquidity Clock — Colosseum Submission Package

Status: SUBMISSION-READY EXCEPT LIVE URL / FIRST VERIFIED DEVNET PROOF / FINAL VIDEOS / VALIDATION COUNTS
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
Solana Devnet, browser-based Solana Web3 integration, temporary in-memory Devnet keypair, deterministic JavaScript liquidity engine and static responsive web UI.

## Why Solana
Solana is used as a verifiable execution rail rather than decorative storage. The MVP can execute a real Devnet proof without asking a reviewer to install or connect a wallet. One click creates a disposable in-memory keypair, requests test SOL if needed, signs locally, submits a real Devnet transaction, waits for confirmation, and surfaces the real signature, slot and execution time. Only after confirmation does the synthetic treasury state change.

## Security / signer boundary
The temporary private key is not displayed, exported or persisted by the app and is discarded when the page is reloaded. This is deliberately a Devnet-only demo mechanism. A production version would use an institutional signer / custody or policy layer rather than a raw browser keypair.

## Technical architecture
1. Synthetic treasury scenario defines operating liquidity, stress outflow and route timing.
2. Deterministic engine calculates buffer horizon and first binding Survival Gap.
3. Available interventions are tested for timing and sufficiency.
4. The selected demo route triggers a self-contained Solana Devnet proof.
5. A temporary browser-memory keypair is funded with test SOL if required.
6. The proof transaction is signed locally and submitted to Devnet.
7. The app waits for confirmation and surfaces signature / slot / timing / Explorer.
8. Only after confirmation does the engine apply the synthetic intervention and recalculate the Survival Gap.

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
- Real proof: self-contained Devnet SOL transaction

After confirmed proof:
- Executable liquidity: 4.65M LQUSD
- Buffer horizon: 31:00
- Next committed liquidity: 17:00
- Survival Gap: +14:00

## Generalization beyond the golden demo
The MVP includes Custom Stress. A reviewer can change executable liquidity, stress outflow, next committed amount / arrival time, and reserve amount / ETA. The deterministic engine recomputes the Survival Gap and refuses to recommend an intervention that arrives after buffer exhaustion.

## Current Solana scope — precise claim
The public MVP uses a real Solana Devnet transaction as execution / settlement-timing proof for the selected route. Treasury amounts such as 3.15M LQUSD remain synthetic public-safe scenario notional. The proof therefore verifies the execution workflow and timing, not a real 3.15M-value asset movement.

## GitHub
https://github.com/rostys-fintech/rostys-fintech/tree/liquidity-clock

## Product URL
PENDING LIVE DEPLOYMENT

## Pitch video
PENDING FINAL RECORDING

## Technical demo
PENDING FINAL RECORDING AFTER FIRST VERIFIED DEVNET PROOF

## Go-to-market
Land with a free Liquidity Stress Diagnostic that lets treasury teams map route amount + ETA + rail and identify the first binding timing gap. Expand into live wallet / custodian / exchange integrations, execution-time calibration, monitoring, alerts and execution orchestration.

## Business model
B2B SaaS. Initial design-partner pilots are free. Later pricing is a hypothesis and should not be presented as validated revenue.

## Market positioning
Existing treasury infrastructure helps teams see, control and move liquidity. Liquidity Clock adds a stress-time decision layer: will that liquidity actually arrive before the executable buffer runs out?

## Validation
STATUS: PENDING REAL RESPONSES.
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
- Self-contained real Solana Devnet proof once the transaction is actually confirmed.
- Transparent separation between synthetic notional and on-chain proof.

## Claims we must NOT make
- Paying customers unless verified.
- Validated pricing unless verified.
- Real LQUSD token or stablecoin.
- Live Devnet proof before the transaction actually occurs.
- Prediction of insolvency or bank failures.
- Solana eliminates liquidity risk.
