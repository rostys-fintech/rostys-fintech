# Liquidity Clock — Final Pitch Script

**Target:** ~2:15–2:25.

## 0:00–0:16 — Hook

Most treasury tools tell you how much liquidity you have.

But in a stress event, I think the more important question is: **will that liquidity actually arrive before the current buffer runs out?**

That is the idea behind Liquidity Clock.

## 0:16–0:43 — Problem

A digital-asset treasury can hold funds across wallets, exchanges, stablecoins, tokenized assets and bank rails.

On paper, the total can look fine. The problem is that those sources do not become usable at the same speed.

So a treasury can have enough liquidity overall and still run out of time.

## 0:43–1:02 — Founder insight

My background is in banking and financial-stability research.

That made me focus on the difference between liquidity that exists on paper and liquidity that can actually be executed by the required moment.

I wanted to turn that question into a practical product.

## 1:02–1:34 — Product

Liquidity Clock compares two clocks:

the time until the current executable buffer is exhausted,

and the time until additional liquidity becomes usable.

The difference is the **Survival Gap**.

In the main synthetic stress case, the buffer lasts ten minutes but the next committed liquidity arrives in seventeen.

So the Survival Gap is minus seven minutes.

The engine then tests available routes and identifies whether a faster intervention can close that gap.

## 1:34–1:55 — Solana

For the demo, Solana is a real execution rail.

One click uses a dedicated test-only signer, tries Devnet first and Testnet second, signs locally, and submits a real test-SOL transaction when public test funding is available.

The app shows the real signature, slot and Explorer link, and only after confirmation does the synthetic liquidity state change.

If public test funding is rate-limited, the app can still produce a signed-only proof, but it clearly labels it as not broadcast and does not pretend the treasury state changed.

No user wallet or mainnet funds are required.

## 1:55–2:13 — Wedge

I am not trying to replace custody platforms or full treasury systems.

Liquidity Clock is a stress-time decision layer that can sit above them.

The initial users are treasury and liquidity-risk teams managing resources across several rails.

## 2:13–2:22 — Close

The longer-term goal is to normalize not only **how much** liquidity exists, but **when it can actually be executed**.

**Liquidity Clock: amount × executability × time.**
