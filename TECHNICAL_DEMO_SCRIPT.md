# Liquidity Clock — Final Technical Demo Script

**Target:** ~2:20. Hard cap: under 3:00.

## 0:00–0:12 — Open Timing Stress

Show the hero screen.

> This is Liquidity Clock. The current executable buffer lasts 10 minutes, while the next committed liquidity arrives in 17. The Survival Gap is minus 7 minutes.

## 0:12–0:35 — Show route logic

Scroll to **Liquidity routes**.

> The engine separates liquidity that is executable now, available but not yet activated, scheduled, and standby. It walks committed routes in time order and identifies the first binding gap.

Briefly point to the highlighted Solana Reserve.

## 0:35–0:52 — Recommendation

Show **Recommended Action**.

> Here the fastest sufficient intervention is the Solana reserve. The modeled effect is from minus 7 minutes to plus 14.

Do not execute yet.

## 0:52–1:08 — Verify Devnet / connect Phantom

Click **Solana Devnet** so the RPC status visibly refreshes.

Click **Connect Phantom**.

> The public MVP uses a development Phantom wallet and Solana Devnet only. No mainnet funds are required.

If the wallet needs test SOL, click **Fund Devnet** before recording the main execution sequence, so the final video stays clean.

## 1:08–1:42 — Execute real proof

Click **Execute Devnet Proof**.

Show Phantom approval, then return to the app.

Let the UI visibly progress through:

**Prepare → Sign → Submit → Confirm → Complete**

> The transaction is signed in Phantom, submitted to Solana Devnet and confirmed before the modeled liquidity state can change.

## 1:42–2:03 — Show proof

Keep the Execution Proof section visible.

Show:

- `CONFIRMED`;
- execution time;
- transaction slot;
- real signature;
- **View on Explorer**.

Open Explorer briefly if recording flow allows.

> The app surfaces the real signature, slot and execution time, so the execution proof is independently verifiable.

## 2:03–2:19 — Before / After

Return to the product state.

> Only after confirmation does the synthetic scenario update. Executable liquidity moves from 1.5 to 4.65 million, the buffer horizon from 10 to 31 minutes, and the Survival Gap from minus 7 to plus 14.

## 2:19–2:27 — Close

> The MVP is deliberately narrow: transparent stress logic, explicit route timing and verifiable execution. The institutional amounts are synthetic; the Devnet transaction is real execution evidence.

## OPTIONAL 10-SECOND GENERALIZATION SHOT

Only if the video remains comfortably under 3:00:

Open **Custom Stress**, change one input, click **Recalculate scenario**, and show that the Survival Gap and recommendation change.

This demonstrates the engine is not hard-coded to the headline demo.

## HARD RULES FOR FINAL VIDEO

- Show a real confirmed Devnet transaction.
- Do not use a mock signature or fake Explorer link.
- Do not imply the `3.15M LQUSD` synthetic scenario amount moved on-chain.
- The real transaction is Devnet test-SOL execution / settlement proof.
- Keep Phantom seed phrase, private keys and sensitive wallet information off-screen.
