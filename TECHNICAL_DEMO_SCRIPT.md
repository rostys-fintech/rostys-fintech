# Liquidity Clock — Final Technical Demo Script

**Target:** ~1:35–1:55. Hard cap: under 3:00.

## 0:00–0:12 — Timing Stress

> This is Liquidity Clock. In this stress scenario the current executable buffer lasts ten minutes, while the next committed liquidity arrives in seventeen. That creates a minus-seven-minute Survival Gap.

Show the three headline clocks: `10:00 / -07:00 / 17:00`.

## 0:12–0:28 — Route logic

Scroll to the route table.

> The engine separates liquidity that is executable now, available for intervention, scheduled, and standby. It then checks each route against the timing constraint.

Pause on the highlighted Solana Reserve.

## 0:28–0:40 — Recommendation

> The fastest sufficient intervention here is the Solana Reserve. The projected result is a move from minus seven minutes to plus fourteen.

Show the Recommended Action card.

## 0:40–1:05 — One-click rescue

Click **Run Liquidity Rescue** once.

> The user does not need to manage a wallet or understand test-cluster funding. The product runs the rescue workflow, applies the synthetic intervention and recalculates the treasury state.

Keep the cursor still while the loading animation runs.

Show the animated progress and wait for the result.

## 1:05–1:22 — Before / After

> The simulated executable liquidity moves from 1.50 to 4.65 million, the buffer horizon from ten to thirty-one minutes, and the Survival Gap from minus seven to plus fourteen.

Pause on the final Before / After cards.

## 1:22–1:38 — Solana verification layer

Scroll to Execution & Verification.

> Solana verification runs separately in the background. When a public test-cluster transaction confirms, the product can surface its signature, slot and Explorer proof. If public test funding is unavailable, the app labels verification as pending rather than claiming a confirmation that did not happen.

Do not describe a pending or signed-only state as on-chain confirmation.

## 1:38–1:52 — Custom Stress proof of generalization

Switch to **Custom Stress** and change one timing input, preferably Reserve ETA.

> The recommendation is not hard-coded. If the reserve arrives after the current buffer is exhausted, the engine rejects that route.

## Final recording rule

The technical demo must clearly distinguish:

- **Simulated treasury outcome** — always synthetic public-safe scenario logic;
- **Live Solana verification** — only confirmed if the chain actually confirms it.

A real Explorer-confirmed transaction is a strong bonus, but the demo must never fake one and must not stall if public test funding is temporarily unavailable.
