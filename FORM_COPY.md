# Liquidity Clock — Copy/Paste Form Answers

## Product Name
Liquidity Clock

## Tagline
Will executable liquidity arrive before your buffer runs out?

## Product Description — short
Liquidity Clock is a stress-time decision engine for digital-asset treasuries. It compares current executable liquidity with outflow velocity, maps when additional liquidity routes can actually become usable, identifies the first binding timing gap, and tests the fastest sufficient intervention.

## What problem are you solving?
Treasury teams can know how much liquidity exists without knowing whether it can become usable in time. Under stress, that timing difference matters. Liquidity Clock identifies when the executable buffer will be exhausted, when committed liquidity will actually arrive, and which available intervention can bridge the gap fastest.

## Who is it for?
Treasury and liquidity-risk teams at digital-asset institutions such as exchanges, stablecoin issuers, custodians, payments companies and institutional crypto platforms.

## Why now?
Digital-asset treasuries increasingly manage liquidity across several rails with different execution and settlement times. A single balance view does not capture whether those resources are executable by the required horizon. Liquidity Clock adds that timing layer.

## Why blockchain / why Solana?
Solana is a verifiable execution rail in the product, not a decorative data layer. The MVP can run a real Devnet proof without requiring a user wallet: it creates a temporary in-memory Devnet keypair, obtains test SOL, signs locally, submits the transaction, waits for confirmation and surfaces the resulting signature, slot and execution timing. The synthetic treasury state changes only after confirmation.

## What did you build?
A public-safe single-page treasury stress engine with preset scenarios plus a Custom Stress mode, deterministic Survival Gap calculations, chronological route logic, intervention sufficiency checks, responsive animated UI and a self-contained Solana Devnet execution proof with real Explorer-verifiable output.

## What is unique?
The product is centered on time-to-executable-liquidity rather than total balances. Its core metric, the Survival Gap, directly compares the treasury's remaining executable-buffer horizon with the arrival time of the next committed liquidity source.

## Founder / team background
I am a finance and banking graduate and current master's student with professional experience in corporate and SME banking at Oschadbank. My work and research interests include banking, financial stability, liquidity stress and digital finance. Liquidity Clock came from a practical question I kept returning to: having liquidity on paper is different from being able to mobilise it before the relevant deadline.

## Team location
Germany. I am a Ukrainian founder currently based in Germany.

## Go-to-market
Start with a free Liquidity Stress Diagnostic for treasury teams: map route amount, ETA and rail, then identify the first timing gap. Use founder-led outreach and Solana / crypto-operations communities to recruit design partners. Expand from stress testing into live integrations, monitoring, alerts, execution-time calibration and liquidity orchestration.

## Demand validation
PENDING. Insert only verified outreach / tester results before submission.

## Business model
B2B SaaS. Initial pilots are free for design partners. Paid plans would later combine monitoring, integrations and execution workflows for institutional treasury teams. Pricing remains a hypothesis until validated.

## Why is this more than a feature?
The stress diagnostic is the entry wedge. The larger system continuously normalizes balances, obligations and execution times across treasury rails, detects binding timing gaps, applies approval / policy constraints, initiates permissible interventions and verifies settlement. That control layer can sit above wallets, exchanges, custodians, tokenized assets and bank rails.

## Long-term vision
Turn Liquidity Clock into an executable-liquidity orchestration layer that normalizes time-to-usability across on-chain and off-chain rails and helps treasury teams select, execute and verify the fastest viable route under stress.

## Repository
https://github.com/rostys-fintech/rostys-fintech/tree/liquidity-clock

## Website
PENDING LIVE URL

## Pitch video
PENDING

## Product demo
PENDING

## Previous work / disclosure
The founder had prior academic experience in banking, financial stability and liquidity. Private academic materials are not reproduced. The public product architecture, synthetic scenarios, Survival Gap implementation, UI, Solana adapter and submission package were developed as the hackathon productization layer.
