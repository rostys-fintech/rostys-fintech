# Liquidity Clock — Technical Demo Script

**Target:** 2:00–2:35. Hard cap: under 3:00.

## 0:00–0:15 — Open on Timing Stress

Show the full hero state.

> This is Liquidity Clock. The current executable buffer lasts ten minutes. The next committed liquidity arrives in seventeen, so the Survival Gap is minus seven minutes.

## 0:15–0:38 — Route map

Show Operating Wallet, Solana Reserve, scheduled CEX reserve, and slower standby routes.

> The engine separates what is executable now, what is available but not yet activated, and what is scheduled or standby. It walks committed routes chronologically and finds the first binding timing gap.

## 0:38–0:58 — Recommendation

Highlight Recommended Action.

> The fastest sufficient route is the Solana reserve. The projected effect is minus seven minutes to plus fourteen.

## 0:58–1:18 — Connect / fund Devnet

Show the dedicated development Phantom wallet.

> The public MVP uses Solana Devnet only. No mainnet funds are used. The on-chain transfer is execution proof; the LQUSD treasury amounts are explicitly synthetic scenario notional.

## 1:18–1:52 — Execute

Click **Execute Liquidity** and show Prepare → Sign → Submit → Confirm → Complete.

> The transaction is signed in Phantom, submitted to Solana Devnet and confirmed before the model changes state.

## 1:52–2:12 — Proof

Show CONFIRMED, execution time, slot, signature and Explorer link.

> The app surfaces the real signature, slot, confirmation and execution time, so the execution layer can be independently verified.

## 2:12–2:30 — Before / After

Show the green post-execution state.

> After confirmation, executable liquidity rises from 1.5 to 4.65 million in the synthetic scenario, buffer runway moves from ten to thirty-one minutes, and the Survival Gap changes from minus seven to plus fourteen.

## 2:30–2:38 — Architecture close

> The MVP is deliberately narrow: deterministic stress logic, transparent route states and verifiable Solana execution. No black-box risk score and no claim that the synthetic amounts are real assets.

## HARD RULE FOR FINAL VIDEO

The final submission video must show a **real confirmed Devnet transaction**. Do not use the recording mock, placeholder signature, fake Explorer link, or synthetic confirmation as if it were real.
