# Liquidity Clock — Interaction QA

Status: PASS for static interaction wiring, deterministic engine checks and self-contained Devnet execution architecture.

## Verified

- JavaScript syntax passes for `engine.js`, `solana-adapter.js`, and `app.js`.
- All current app DOM references resolve to IDs in `index.html`.
- Scenario selector wiring exists for Safe, Timing Stress, On-chain Rescue and Custom Stress.
- `Solana Devnet` is a real RPC-status control.
- `SYNTHETIC SCENARIO` is a real disclosure control.
- `Run Live Devnet Proof`, `Recalculate scenario`, `Copy signature`, and `Copy demo address` have explicit interaction logic.
- Phantom / user-wallet controls are removed from the visible flow.
- The proof path uses a dedicated Devnet-only demo keypair stored in browser local storage so external test-SOL funding survives reloads.
- The demo key is never displayed or exported by the UI and must never be used for mainnet assets.
- If funding is needed, the proof path first requests Devnet test SOL automatically.
- If `requestAirdrop` is rate-limited, the app preserves the same wallet, displays its full public address, and exposes Solana + QuickNode faucet fallbacks.
- After external funding, pressing `Run Live Devnet Proof` again reuses the same funded wallet instead of requesting a new one.
- The proof transfer is intentionally tiny (`0.0000315 test SOL`) so one test-SOL top-up supports many repeated demos.
- The scenario balance changes only after a real confirmed Devnet transaction.
- Explorer and signature controls remain hidden until confirmation.
- Custom Stress inputs use valid defaults and validation.
- Reserve ETA is binding in the engine; an intervention arriving after buffer exhaustion is not recommended.
- State reset clears stale notices and stale proof values without deleting the persisted Devnet demo wallet.

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

## Live-network limitation

The self-contained Devnet path is implemented, but a final public proof is not considered complete until a real transaction is successfully confirmed and captured with its signature / slot / Explorer URL.

Public Devnet airdrops are externally rate-limited. A 429 must remain an honest funding-recovery state, never a fake success state.

## Hosting limitation

A permanent production URL remains pending because the connected Vercel account context is not currently exposed through the deployment connector.
