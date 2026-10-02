# Hackathon Disclosure

## What existed before the hackathon

The founder had previously worked on academic questions in banking, financial stability and liquidity. That work remains private/submission-sensitive and is **not** reproduced in this repository.

Pre-existing conceptual insight used here:

> Liquidity should be assessed not only by amount, but also by whether it can become usable before the relevant stress horizon.

## What was built for Crypto World's Fair

- the **Liquidity Clock** product definition and user flow;
- the **Survival Gap** decision metric for a synthetic digital-asset treasury;
- the deterministic route-walking stress engine;
- synthetic Safe / Timing Stress / On-chain Rescue scenarios;
- Custom Stress mode with binding reserve ETA;
- intervention ranking and first-binding-gap logic;
- the single-page institutional UI;
- the one-click Solana Devnet → Testnet execution-proof adapter;
- explicit `LIVE CONFIRMED` vs `SIGNED / NOT BROADCAST` proof states;
- post-confirmation recalculation of executable liquidity;
- transaction-proof UI with signature, slot, timing and Explorer link for confirmed proofs;
- public documentation and demo materials.

## Public-safety boundary

This repository contains **no** unpublished manuscript text, reviewer communications, private research tables, restricted datasets or case-specific reconstructions from the founder's academic work.

All institutions, balances, outflow rates, liquidity routes and timing assumptions in the public demo are synthetic.

## Chain-integrity statement

The public demo can use a real Solana test-cluster transaction as **execution / settlement-path proof**. The synthetic `LQUSD` notional is not presented as a real token, stablecoin or market-valued asset.

The liquidity engine applies the synthetic intervention only after a transaction is actually confirmed. A `SIGNED / NOT BROADCAST` fallback is not treated as on-chain proof and leaves the treasury state unchanged.
