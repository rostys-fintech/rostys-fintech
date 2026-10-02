# Liquidity Clock — Interaction QA

Status: PASS for static interaction wiring, deterministic engine checks, proof-state separation and resilient Solana test-cluster architecture.

## Verified

- JavaScript syntax passes for `engine.js`, `solana-adapter.js`, and `app.js`.
- Static DOM audit reports **0 missing ID references** from `app.js` to `index.html`.
- Scenario selector wiring exists for Safe, Timing Stress, On-chain Rescue and Custom Stress.
- Solana cluster pill is a real RPC-status control.
- `SYNTHETIC SCENARIO` is a real disclosure control and its popover now renders above clock cards with readable contrast.
- `Run Live Solana Proof`, `Recalculate scenario`, and `Copy signature` have explicit interaction logic.
- Phantom / user-wallet / mainnet requirements are removed from the visible flow.
- The proof path uses a dedicated test-only browser signer.
- Devnet is attempted first and Testnet second.
- If public test funding is unavailable on both clusters, the app creates a fresh network-bound signed transaction and labels it `SIGNED / NOT BROADCAST`.
- Signed-only mode shows no slot and no Explorer link.
- Signed-only mode does **not** change executable liquidity, buffer horizon, Survival Gap or Solana route state.
- Signed-only mode keeps the recommendation available and changes the action to `Retry Live Confirmation`.
- Only an Explorer-confirmed transaction can mark the Solana route `Deployed`, change 1.50M → 4.65M and change -07:00 → +14:00.
- Confirmed proof shows execution time, slot, signature and Explorer link.
- Custom Stress inputs use valid defaults and validation.
- Reserve ETA is binding in the engine; an intervention arriving after buffer exhaustion is not recommended.
- State reset clears stale notices and proof values.
- No manual faucet/address workflow is required in the normal UX.

## Golden deterministic check

- Executable liquidity: 1.50M LQUSD
- Stress outflow: 150k/min
- Buffer horizon: 10:00
- Next committed liquidity: 17:00
- Survival Gap: -07:00
- Recommended intervention: Solana Reserve
- Projected post-intervention Survival Gap: +14:00

## ETA edge cases

- Reserve ETA 5 sec → sufficient
- Reserve ETA 599 sec → sufficient
- Reserve ETA 601 sec → insufficient
- Reserve ETA 900 sec → insufficient

## Proof integrity rule

`SIGNED / NOT BROADCAST` is a valid cryptographic fallback but is **not** an on-chain proof.

The final submission proof remains incomplete until a real test-cluster transaction is confirmed and captured with signature / slot / Explorer URL.

## Hosting limitation

A permanent production URL remains pending because the connected Vercel account context is not currently exposed through the deployment connector. The GitHub-hosted build remains available for testing.
