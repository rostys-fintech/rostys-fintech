# Liquidity Clock — Interaction QA

Status: PASS for static interaction wiring and deterministic engine checks.

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

## Deterministic engine check

Golden stress scenario:

- Executable liquidity: 1.50M LQUSD
- Stress outflow: 150k/min
- Buffer horizon: 10:00
- Next committed liquidity: 17:00
- Survival Gap: -07:00
- Recommended intervention: Solana Reserve
- Projected post-intervention Survival Gap: +14:00

## Important limitation

The final on-chain gate still requires a real development Phantom wallet signature in the user's browser. No mock transaction should be represented as live Devnet evidence.

The production hosting connector is not currently exposing a deployable Vercel project/team context, so a permanent production URL remains pending.
