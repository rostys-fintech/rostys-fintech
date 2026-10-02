# Liquidity Clock — Colosseum Submission Package

Status: SUBMISSION-READY EXCEPT LIVE URL / REAL DEVNET PROOF / FINAL VIDEOS / VALIDATION COUNTS
Date: 2026-10-02

## Product name
Liquidity Clock

## Tagline
Will executable liquidity arrive before your buffer runs out?

## One-line description
Liquidity Clock shows whether executable liquidity can arrive before a treasury's current operating buffer is exhausted.

## Short description
Liquidity Clock is a stress-time decision engine for digital-asset treasuries. It compares current executable liquidity with outflow velocity, maps when additional liquidity routes can actually become usable, identifies the first binding timing gap, and tests the fastest sufficient intervention. Its core metric, the Survival Gap, shows whether liquidity arrives before or after the current buffer runs out.

## Long description
Digital-asset treasuries can hold substantial liquidity across wallets, exchanges, stablecoins, bank accounts, tokenized assets and other rails, but those resources do not all become usable at the same speed. Liquidity Clock models that timing problem directly.

The product begins with the treasury's immediately executable liquidity and a stress outflow rate. It then maps committed and available liquidity routes by amount, execution path and time-to-usability. A deterministic engine walks those routes in chronological order and identifies the first binding timing gap.

The core metric is the Survival Gap:

buffer-exhaustion time - next committed liquidity arrival time

A negative Survival Gap means the treasury's executable buffer runs out before the next committed source becomes usable.

In the main synthetic demo, the treasury begins with 1.50M LQUSD of executable liquidity and a 150k-per-minute stress outflow. Its operating buffer lasts 10 minutes while the next committed liquidity arrives in 17 minutes, creating a -7 minute Survival Gap. Liquidity Clock identifies a faster Solana reserve as the narrowest sufficient intervention. After confirmed execution proof, the executable buffer expands to 4.65M LQUSD, the horizon rises to 31 minutes, and the Survival Gap moves to +14 minutes.

The public MVP uses synthetic scenario notional and a real Solana Devnet transaction as execution and settlement proof. The synthetic scenario balance changes only after the Devnet proof transaction confirms.

Liquidity Clock is not a custody platform or a full treasury-management system. Its wedge is narrower: a stress-time decision layer focused on amount x executability x time.

## Problem
Treasury systems can show how much liquidity exists, but under stress the critical question is whether each source can become executable before the current operating buffer is exhausted.

## Primary user
Treasury / liquidity-risk teams at digital-asset financial institutions, including exchanges, stablecoin issuers, custodians, payments companies and institutional crypto platforms.

## Core insight
Liquidity is not only an amount. Under stress, it is a race between outflow velocity and execution time. A treasury can appear liquid in aggregate and still face a timing failure.

## Founder background / founder-market fit
Rostyslav Honcharenko is a finance and banking graduate and current master's student with professional experience in corporate and SME banking at Oschadbank. His work and research interests span banking, financial stability, liquidity stress and digital finance. That background led to a practical question: institutions often focus on how much liquidity exists, while the operational constraint is how quickly that liquidity can actually become usable. Liquidity Clock turns that question into a product for digital-asset treasuries.

## Team
Solo founder: Rostyslav Honcharenko.

## Location
Germany. Ukrainian founder currently based in Germany.

## Blockchain / technology
Solana Devnet, Phantom wallet, browser-based Solana Web3 integration, deterministic TypeScript/JavaScript liquidity engine, static responsive web UI.

## Why Solana
Solana is used as a verifiable execution rail rather than as decorative storage. The MVP connects to Phantom, submits a real Devnet transaction, waits for network confirmation, captures the signature / slot / execution timing, and only then recalculates the treasury's synthetic executable-liquidity state. In the current public MVP, the on-chain transfer verifies execution and settlement timing while the institutional treasury amount remains synthetic public-safe notional.

## Technical architecture
1. Synthetic treasury scenario defines operating liquidity, stress outflow and route timing.
2. Deterministic engine calculates buffer horizon and first binding Survival Gap.
3. Available interventions are tested for sufficiency and timing.
4. The selected Solana route is executed through a development Phantom wallet on Devnet.
5. The app waits for confirmed settlement.
6. Signature, slot, timing and Explorer link are surfaced.
7. Only after confirmation does the engine apply the synthetic intervention and recalculate the Survival Gap.

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
- Real proof: Devnet SOL transaction signed and confirmed through Phantom

After:
- Executable liquidity: 4.65M LQUSD
- Buffer horizon: 31:00
- Next committed liquidity: 17:00
- Survival Gap: +14:00

## Generalization beyond the golden demo
The MVP also includes a **Custom Stress** mode. A reviewer can change executable liquidity, stress outflow, next committed amount / arrival time, and available Solana reserve assumptions. The deterministic engine recomputes the buffer horizon, Survival Gap and intervention recommendation from those new inputs. This is intended to demonstrate that the core logic is not hard-coded to the headline -7 to +14 minute example.

## Why this can become a company rather than a feature
The initial wedge is a stress-time diagnostic. The larger product is an executable-liquidity control layer across heterogeneous treasury rails. Over time, connectors ingest balances and route states; execution history calibrates time-to-usability; the engine continuously detects binding timing gaps; policy workflows identify permissible actions; transactions are initiated across supported rails; and confirmed settlement feeds back into the treasury state. Liquidity Clock is the entry interface into that broader **Executable Liquidity Infrastructure**.

## Current Solana scope — precise claim
The public MVP uses a **real Solana Devnet transaction as execution and settlement-timing proof for the selected route**. Treasury amounts such as 3.15M LQUSD remain synthetic public-safe scenario notional. The current demo therefore verifies the execution workflow and timing, not a real 3.15M-value asset movement. A production version would bind the modeled route directly to a real tokenized treasury asset or institutional rail.

## GitHub
https://github.com/rostys-fintech/rostys-fintech/tree/liquidity-clock

## Product URL
PENDING LIVE DEPLOYMENT

## Pitch video
PENDING FINAL RECORDING
Target length: ~2:20
Script: PITCH_SCRIPT.md

## Technical demo
PENDING FINAL RECORDING AFTER REAL DEVNET PROOF
Target length: ~2:00
Script: TECHNICAL_DEMO_SCRIPT.md

## Go-to-market
Land with a free Liquidity Stress Diagnostic that lets treasury teams map route amount + ETA + rail and identify the first binding timing gap. Expand into live wallet integrations, CEX / custodian balances, historical execution-time calibration, monitoring, alerts and execution orchestration. Long-term distribution can include integrations with existing treasury, custody and payment infrastructure rather than trying to replace them.

## Business model
B2B SaaS. Initial design-partner pilots are free. Later pricing hypothesis: team plans in the low-thousands per month and custom institutional contracts. The pricing is not yet validated and should not be represented as validated revenue.

## Market positioning
Existing treasury infrastructure helps teams see, control and move liquidity. Liquidity Clock adds a stress-time decision layer: will that liquidity actually arrive before the executable buffer runs out?

## Validation
STATUS: PENDING REAL RESPONSES.
Do not enter invented counts, quotes, users, revenue or customer claims.

Once responses exist, report only verified facts such as:
- number of relevant conversations;
- number of prototype testers;
- recurring operational concerns;
- product changes driven by feedback;
- quotes only with permission.

## Distribution plan
1. Founder-led outreach to treasury, liquidity-risk and crypto operations professionals.
2. Solana / Colosseum community beta testing.
3. Free stress diagnostic as low-friction entry point.
4. Integration partnerships with wallets, custodians, exchanges and treasury platforms.
5. Publish practical liquidity-stress content / case abstractions without exposing private academic work.

## Venture-scale vision
Build an executable-liquidity orchestration layer that normalizes time-to-usability across wallets, exchanges, stablecoins, bank rails, tokenized assets and credit facilities, then helps treasury teams decide and execute the fastest viable route under stress.

## Pre-existing work disclosure
Before the hackathon, the founder had academic experience and research interests in banking, financial stability and liquidity. Private or submission-sensitive academic materials are not reproduced in this repository.

The hackathon productization includes the Liquidity Clock product concept, Survival Gap implementation for the synthetic digital-asset treasury use case, deterministic route engine, synthetic scenarios, interface, Solana Devnet adapter, transaction-proof workflow, public documentation and submission materials.

## Public-safety statement
All institutions, balances, rates, routes and scenario timings in the public MVP are synthetic. No unpublished manuscript text, reviewer correspondence, restricted data or case-specific private research assets are included.

## Claims we may make
- Synthetic public-safe stress engine.
- Deterministic first-binding-gap logic.
- Real Solana Devnet execution proof once the transaction is actually completed.
- Transparent separation between synthetic notional and on-chain proof.
- Founder background in banking / finance / financial-stability research.

## Claims we must NOT make
- Paying customers unless verified.
- Validated pricing unless verified.
- Real LQUSD token or stablecoin.
- Live Devnet proof before the transaction actually occurs.
- Prediction of insolvency or bank failures.
- Solana eliminates liquidity risk.
- Academic results that are private, unpublished or under review.
