# Liquidity Clock — Final Pitch Script

**Target:** ~2:15. Hard cap: under 3:00.

## 0:00–0:15 — Hook

Most treasury tools tell you how much liquidity you have.

But during stress, I think the more important question is different: **will that liquidity actually arrive before the current buffer runs out?**

That is why I built Liquidity Clock.

## 0:15–0:38 — Problem

A digital-asset treasury can hold money across wallets, exchanges, stablecoins, tokenized assets and bank rails.

The total balance may look safe, but these sources do not become usable at the same speed.

So you can have enough liquidity on paper and still run out of time.

## 0:38–0:55 — Why me

My background is in finance and banking, and I have been working on financial-stability and liquidity questions.

I kept coming back to the same practical point: available liquidity is not the same as **executable liquidity**.

I wanted to turn that into a product, not another research dashboard.

## 0:55–1:28 — Product

Liquidity Clock compares two things:

- how long the current executable buffer lasts;
- when the next usable liquidity actually arrives.

The difference is the **Survival Gap**.

In the main synthetic scenario, the buffer lasts 10 minutes and the next committed liquidity arrives in 17.

So the Survival Gap is **minus 7 minutes**.

The engine then checks available routes and finds the fastest sufficient intervention.

## 1:28–1:48 — Solana

For this MVP, Solana is the verifiable execution rail.

The app connects to a development Phantom wallet, submits a real Devnet transaction, waits for confirmation, records the signature, slot and execution time, and only then changes the modeled liquidity state.

The financial scenario remains synthetic and clearly labeled.

## 1:48–2:04 — Market

I am not trying to replace Fireblocks, custody platforms or a full treasury-management system.

Liquidity Clock is a stress-time decision layer that can sit above them.

The first users I am targeting are treasury and liquidity-risk teams at digital-asset companies.

## 2:04–2:15 — Vision

The long-term idea is simple: normalize not only **how much** liquidity exists, but **when it can actually be executed** across different rails.

**Liquidity Clock — amount, executability and time.**

## Validation insertion rule

Insert only one sentence after real responses exist, ideally after the founder section:

> I also spoke with [verified number] people across [verified roles], and the recurring issue was [verified theme].

Do not invent traction, customers, revenue, quotes or willingness to pay.
