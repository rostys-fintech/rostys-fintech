# Liquidity Clock — 2:20 Pitch Script

**Target:** 2:10–2:30. Do not exceed 3:00.

## 0:00–0:15 — Hook

Treasury teams usually ask how much liquidity they have. Under stress, I think the more important question is: **will that liquidity actually arrive before the current buffer runs out?**

That is the problem behind Liquidity Clock.

## 0:15–0:42 — Problem

A digital-asset treasury can hold funds across wallets, exchanges, stablecoins, tokenized assets and bank rails. On paper, the total can look comfortable. But those sources do not become usable at the same speed.

A treasury can therefore have enough liquidity in aggregate and still face a timing gap.

## 0:42–1:00 — Founder insight

My background is in banking and financial-stability research. That work made me focus less on nominal liquidity and more on **executable liquidity** — what can actually become usable by the required horizon.

I wanted to turn that question into a practical product rather than another research dashboard.

## 1:00–1:32 — Product

Liquidity Clock compares two clocks: the time until the current executable buffer is exhausted, and the time until additional liquidity becomes usable.

The difference is the **Survival Gap**.

In the main synthetic stress case, the buffer lasts 10 minutes but the next committed liquidity arrives in 17. The gap is minus seven minutes.

The engine then tests available routes and identifies the fastest sufficient intervention.

## 1:32–1:52 — Solana

For the MVP, Solana is not just a label on the UI. The product connects to a development Phantom wallet, submits a real Devnet transaction, waits for confirmation, records the signature, slot and execution time, and only then recalculates the liquidity state.

That gives the demo a verifiable execution layer.

## 1:52–2:10 — Market / wedge

I am not trying to replace custody platforms or full treasury-management systems. Liquidity Clock is a stress-time decision layer that can sit above them.

The initial users are digital-asset treasury and liquidity-risk teams that manage resources across several rails.

## 2:10–2:20 — Vision

The longer-term goal is simple: normalize not only **how much** liquidity exists, but **when it can actually be executed** — across on-chain and off-chain rails.

**Liquidity Clock: amount × executability × time.**

## Validation insertion rule

Add one short sentence only after verified responses exist. Example structure:

> We spoke with [verified number] people across [verified roles], and the recurring issue was [verified recurring feedback].

Do not invent traction, customers, revenue, or willingness to pay.
