# Liquidity Clock

**Will executable liquidity arrive before your buffer runs out?**

Liquidity Clock is a public-safe stress engine for digital-asset treasuries. It compares current executable liquidity with stress outflow velocity, walks committed liquidity routes chronologically, identifies the first binding timing gap, and tests available interventions.

## Core metric

`Survival Gap = buffer-exhaustion time − next committed liquidity arrival time`

A negative gap means the treasury exhausts its executable buffer before the next committed source becomes usable.

## Golden demo

- Operating liquidity: **1.50M LQUSD**
- Stress outflow: **150k LQUSD/min**
- Buffer horizon: **10 min**
- Next committed liquidity: **17 min**
- Initial Survival Gap: **−7 min**
- Available intervention: **3.15M LQUSD Solana reserve (synthetic notional)**
- Simulated outcome after the intervention: **4.65M**, **31 min**, **+14 min**

## One-click user flow

The main product flow is deliberately simple:

1. Select a stress scenario.
2. Click **Run Liquidity Rescue**.
3. Watch `Analyze → Prepare → Apply → Recalculate → Complete`.
4. The deterministic engine applies the synthetic rescue scenario and shows the before/after result.
5. Solana verification runs separately in the background and never blocks the product demo.

The interface shows loading spinners / pulse states while the app is analyzing, recalculating, checking the Solana network, or waiting for background verification.

## Simulation vs live verification

These are intentionally separate.

### Simulated outcome

The treasury scenario is synthetic. The main demo can therefore always show the modeled effect of the selected intervention:

`1.50M / 10:00 / −07:00 → 4.65M / 31:00 / +14:00`

The Solana route is marked **Simulated**, not verified.

### Live Solana verification

In parallel, the app attempts a real test-cluster transaction:

- Devnet first;
- Testnet fallback;
- dedicated browser test signer;
- no Phantom requirement;
- no mainnet funds required.

If a transaction really confirms, the UI upgrades the result to **LIVE VERIFIED**, shows the real slot / signature / Explorer link, and marks the route **Verified**.

If public test funding is rate-limited, the user still gets the full product demo. The UI says **Demo complete · live verification pending** and does not claim on-chain confirmation.

The **3.15M LQUSD** amount is synthetic stress-test notional. A test-SOL transaction, when confirmed, is execution / settlement-path verification; it is not presented as a real 3.15M-value asset movement.

## Why no browser wallet is required

This is a public test-cluster demonstration, not a custody flow. Requiring a reviewer to install or connect Phantom adds friction without improving the core product test. A production system would use an institutional signer / custody or policy layer.

## Run locally

The deterministic app shell has no package-manager dependencies. Solana verification loads the pinned Web3 browser bundle from jsDelivr, so internet access is required only for the optional chain-verification layer.

On macOS, use `RUN_ON_MAC.command`.

Manual local server:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Custom Stress

Reviewers can change executable liquidity, stress outflow, next committed arrival and available reserve inputs. The deterministic engine recalculates the buffer horizon, binding Survival Gap and intervention recommendation.

**Reserve ETA is binding**: a route that arrives after buffer exhaustion is not recommended.

## Architecture

- `engine.js` — deterministic survival-gap and intervention engine
- `app.js` — one-click rescue UX, animated loading states, scenario state and verification separation
- `solana-adapter.js` — Devnet → Testnet real verification path plus honest signed fallback
- `index.html` / `styles.css` / `custom.css` — single-page institutional UI

## Public-safety boundary

All institutions, balances, rates, routes and timings in the public MVP are synthetic. The product does not reproduce unpublished manuscript text, private case reconstructions, restricted datasets, reviewer communications or other submission-sensitive academic materials.

## Validation

Early customer-discovery responses are logged conservatively in `VALIDATION.md`. No traction claim is made without real responses.

## Audit

See `FINAL_PRODUCT_AUDIT.md`, `HOSTILE_JUDGE_AUDIT.md` and `INTERACTION_QA.md`.

## License

MIT.
