# Liquidity Clock — Interaction QA

Status: PASS for static interaction wiring and deterministic engine checks. Final live-chain verification still requires a real development Phantom signature in the user's browser.

## Verified

- JavaScript syntax passes for `engine.js`, `solana-adapter.js`, and `app.js`.
- All JavaScript DOM references resolve to existing IDs in `index.html`.
- All button IDs have explicit click handlers or dedicated scenario handlers.
- Scenario selector wiring is present for Safe, Timing Stress, On-chain Rescue, and Custom Stress.
- `Solana Devnet` is a real button and refreshes RPC status.
- `SYNTHETIC SCENARIO` is a real disclosure button with an explanatory popover.
- `Connect Phantom`, `Fund Devnet`, `Execute Devnet Proof`, `Recalculate scenario`, and `Copy signature` have explicit interaction logic.
- Disabled states are used for actions that are not currently executable.
- Faucet fallback appears on Devnet funding failure.
- Explorer and signature controls remain hidden until a confirmed proof exists.
- Custom scenario inputs use valid default values and input validation.
- State reset clears stale notices and stale transaction proof values when switching scenarios.
- The Mac launcher now selects a free local port, opens Chrome when available, and cleans up the local server on exit.

## Engine audit

The intervention engine now respects `Reserve ETA` rather than treating every AVAILABLE route as immediately executable.

Golden stress scenario:

- Executable liquidity: 1.50M LQUSD
- Stress outflow: 150k/min
- Buffer horizon: 10:00
- Next committed liquidity: 17:00
- Survival Gap: -07:00
- Solana reserve ETA: 5 sec
- Recommended intervention: Solana Reserve
- Projected post-intervention Survival Gap: +14:00

Edge checks:

- Reserve ETA 599 sec: intervention still reaches the buffer before exhaustion.
- Reserve ETA 601 sec: intervention is too late by 1 sec and is not recommended.
- Reserve ETA 900 sec: intervention is too late by 5 min and is not recommended.
- Insufficient AVAILABLE routes are no longer exposed as recommendations.

## Devnet proof audit

- Faucet confirmation is polled before a funding success is shown.
- Balance update is verified after the airdrop.
- Transaction confirmation must succeed before the synthetic model is updated.
- Transaction metadata retries `getTransaction()` after confirmation.
- The displayed slot comes from the actual transaction/status result, not the RPC query-context slot.
- Real test-SOL execution proof remains explicitly separated from synthetic LQUSD scenario notional.

## Important limitations

- The final on-chain gate still requires a real development Phantom wallet signature in the user's browser. No mock transaction should be represented as live Devnet evidence.
- The public Devnet proof measures the test-SOL execution path; it does not by itself validate the synthetic LQUSD notional or every off-chain approval/settlement assumption.
- The production hosting connector is not currently exposing a deployable Vercel project/team context, so a permanent production URL remains pending.
