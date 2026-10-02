# Liquidity Clock — Final Pitch Script

**Target:** ~2:05–2:20.

## 0:00–0:15 — Hook

Most treasury tools tell you how much liquidity you have.

But during stress, the more important question is: **will that liquidity actually become usable before the current buffer runs out?**

That is the idea behind Liquidity Clock.

## 0:15–0:38 — Problem

A digital-asset treasury can hold funds across wallets, exchanges, stablecoins, tokenized assets and bank rails.

The total balance may look healthy, but those sources do not become executable at the same speed.

So the institution can be liquid on paper and still run out of time.

## 0:38–0:57 — Founder insight

My background is in finance, banking and financial-stability research.

That made me focus on the difference between liquidity that exists and liquidity that can actually be mobilised by the required moment.

I wanted to turn that timing problem into a practical decision tool.

## 0:57–1:28 — Product

Liquidity Clock compares two clocks:

- how long the current executable buffer lasts;
- when the next liquidity route can actually become usable.

The difference is the **Survival Gap**.

In the main synthetic stress case, the current buffer lasts ten minutes, while the next committed liquidity arrives in seventeen.

That creates a minus-seven-minute Survival Gap.

The engine then tests available interventions and identifies the fastest sufficient route.

## 1:28–1:50 — Rescue + Solana verification

The user does not need to understand wallets, faucets or test clusters.

They press **Run Liquidity Rescue**. The app simulates the recommended intervention, recalculates the treasury state, and shows the projected result from minus seven to plus fourteen minutes.

At the same time, a separate Solana verification layer runs in the background. When a public test-cluster transaction confirms, the app can surface its signature, slot and Explorer proof. If public test funding is unavailable, the product keeps the rescue demo usable and clearly marks live verification as pending rather than pretending it confirmed.

## 1:50–2:08 — Wedge

Liquidity Clock is not trying to replace custody platforms or complete treasury systems.

It is a stress-time decision layer that can sit above them and normalize one thing they often treat differently: **time to executable liquidity**.

## 2:08–2:16 — Close

The long-term goal is simple:

**Liquidity Clock — amount × executability × time.**
