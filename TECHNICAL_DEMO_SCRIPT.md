# Liquidity Clock — Final Technical Demo Script

**Target:** ~1:50–2:15. Hard cap: under 3:00.

## 0:00–0:15 — Timing Stress

> This is Liquidity Clock. The current executable buffer lasts ten minutes. The next committed liquidity arrives in seventeen, so the Survival Gap is minus seven minutes.

## 0:15–0:35 — Routes

Show Operating Wallet, Solana Reserve, scheduled CEX reserve and slower standby routes.

> The engine separates what is executable now, what is available, and what is scheduled. It walks the timing sequence and finds the first binding gap.

## 0:35–0:50 — Recommendation

> The Solana reserve is the fastest sufficient route in this scenario. The projected effect is minus seven minutes to plus fourteen.

## 0:50–1:10 — One-click execution

Click **Run Live Solana Proof**.

> No browser wallet or mainnet funds are required. The app tries Solana Devnet first and Testnet second, then signs locally and submits when public test funding is available.

Show:
`Prepare → Sign → Submit → Confirm → Complete`.

## 1:10–1:35 — Proof

For the final submission video, show `CONFIRMED`, execution time, slot, signature and Explorer.

> This is a real Solana test-cluster transaction. The test-SOL transfer verifies the execution path and timing. The LQUSD treasury amounts remain clearly synthetic.

If the site is in `SIGNED / NOT BROADCAST` mode during rehearsal, do not present that as the final live proof. The UI should remain at the original treasury state and the button should offer **Retry Live Confirmation**.

## 1:35–1:55 — Confirmed Before / After

> Only after confirmation does the synthetic executable balance move from 1.5 to 4.65 million. Buffer runway moves from ten to thirty-one minutes and the Survival Gap changes from minus seven to plus fourteen.

## 1:55–2:05 — Custom Stress

Optionally switch to Custom Stress and change Reserve ETA.

> The recommendation is not hard-coded. If the reserve arrives after the buffer is exhausted, the engine refuses to recommend it.

## Final rule

The final video must show a real Explorer-confirmed Solana test-cluster transaction. A signed-only fallback is useful for product resilience but does **not** count as on-chain execution proof.
