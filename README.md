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
- Projected after a successful intervention: operating liquidity **4.65M**, buffer horizon **31 min**, Survival Gap **+14 min**

## One-click Solana proof

The public MVP does not require Phantom, a user wallet or mainnet funds.

When **Run Live Solana Proof** is pressed, the browser:

1. loads or creates a dedicated test-only signer stored in this browser;
2. checks Solana Devnet first;
3. attempts to obtain test SOL and run a real test-SOL transaction;
4. automatically falls back to Solana Testnet if Devnet test funding is unavailable;
5. signs locally, submits, waits for confirmation, and surfaces the real signature / slot / Explorer link when the transaction confirms;
6. updates the synthetic treasury state **only after real on-chain confirmation**.

Public Solana faucets can be rate-limited. To keep the demo truthful and resilient, Liquidity Clock has two explicit proof modes:

- **LIVE CONFIRMED** — a real test-SOL transaction was broadcast and confirmed. Only this mode changes the treasury state from `−07:00` to `+14:00` and marks the Solana route as deployed.
- **SIGNED / NOT BROADCAST** — a fresh transaction was built against a current Solana test-cluster blockhash and signed locally, but public test funding was unavailable. No slot or Explorer link is shown, no on-chain confirmation is claimed, and the treasury state remains unchanged.

The **3.15M LQUSD** amount is synthetic stress-test notional. It is deliberately not represented as a real-valued token. The test-SOL transaction is execution / settlement-path proof; it is not presented as a real 3.15M-value liquidity movement.

## Why no browser wallet is required

This is a public test-cluster demonstration, not a custody flow. Requiring a reviewer to install or connect Phantom adds friction without improving the core product test. The MVP therefore uses a dedicated test-only browser signer. A production system would use an institutional signer / custody or policy layer rather than a raw browser keypair.

## Run locally

The deterministic app shell has no package-manager dependencies. Solana execution loads the pinned Web3 browser bundle from jsDelivr, so internet access is required for chain interaction.

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
- `app.js` — scenarios, state, rendering and proof-mode separation
- `solana-adapter.js` — Devnet → Testnet live proof path plus signed-only fallback
- `index.html` / `styles.css` / `custom.css` — single-page institutional UI

## Public-safety boundary

All institutions, balances, rates, routes and timings in the public MVP are synthetic. The product does not reproduce unpublished manuscript text, private case reconstructions, restricted datasets, reviewer communications or other submission-sensitive academic materials.

## Demo flow

1. Open **Timing Stress**.
2. Observe the initial `−7 min` Survival Gap.
3. Click **Run Live Solana Proof**.
4. The app tries Devnet, then Testnet automatically.
5. If a transaction confirms, show `CONFIRMED`, execution time, slot, signature and Explorer, then observe `−07:00 → +14:00`.
6. If public funding is unavailable, the app shows `SIGNED / NOT BROADCAST`; the state stays at `−07:00` and the reviewer can retry live confirmation later.

## Validation

Early customer-discovery responses are logged conservatively in `VALIDATION.md`. No traction claim is made without real responses.

## Audit

See `HOSTILE_JUDGE_AUDIT.md` and `INTERACTION_QA.md`.

## License

MIT.
