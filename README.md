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
- Projected after confirmed execution proof: operating liquidity **4.65M**, buffer horizon **31 min**, Survival Gap **+14 min**

## One-click real Solana Devnet proof

The public MVP does not require Phantom or a user wallet.

When **Run Live Devnet Proof** is pressed, the browser:

1. loads or creates a **Devnet-only demo keypair** stored in this browser;
2. checks its current Devnet balance;
3. requests test SOL automatically if the public Devnet faucet is available;
4. signs a real **0.0000315 Devnet SOL** transfer locally;
5. submits it to `https://api.devnet.solana.com`;
6. waits for network confirmation;
7. surfaces the real transaction signature, slot, timing and Explorer link;
8. only then applies the synthetic intervention to the Liquidity Clock scenario.

The demo key exists only for Devnet testing and has no mainnet purpose. Keeping the same demo address in browser storage is intentional: if the public faucet is rate-limited, a reviewer can fund that Devnet-only address once and reuse it across reloads and repeated demos.

The **3.15M LQUSD** amount is synthetic stress-test notional. It is deliberately not represented as a real-valued token. The Devnet SOL transfer is execution/settlement proof for the demo route; it is not presented as a real 3.15M-value liquidity movement.

**Status:** the proof path is implemented. The final public proof is complete only after a real Devnet transaction is successfully confirmed and recorded.

## Faucet fallback

Solana's public Devnet airdrop is rate-limited. If automatic funding returns a 429, Liquidity Clock keeps the same demo wallet and shows:

- the full demo address;
- **Copy demo address**;
- the official Solana faucet;
- the QuickNode Devnet faucet.

After that address receives test SOL, press **Run Live Devnet Proof** again. No Phantom is required.

## Why no browser wallet is required

This is a public testnet demonstration, not a custody flow. Requiring a reviewer to install/connect Phantom adds friction without improving the core proof. The MVP therefore uses a dedicated Devnet-only browser keypair. A production system would use an institutional signer / custody policy layer rather than a raw browser keypair.

## Run locally

The deterministic app shell has no package-manager dependencies. Real chain execution loads the pinned Solana Web3 browser bundle from jsDelivr, so internet access is required for Devnet execution.

On macOS, use `RUN_ON_MAC.command`.

Manual fallback:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Custom Stress

Reviewers can change executable liquidity, stress outflow, next committed arrival and available reserve inputs. The deterministic engine recalculates the buffer horizon, binding Survival Gap and intervention recommendation.

**Reserve ETA is binding**: a route that arrives after buffer exhaustion is not recommended.

## Architecture

- `engine.js` — deterministic survival-gap and intervention engine
- `app.js` — scenarios, state, rendering and one-click proof flow
- `solana-adapter.js` — persistent Devnet-only browser demo wallet + real execution proof
- `index.html` / `styles.css` / `custom.css` — single-page institutional UI

## Public-safety boundary

All institutions, balances, rates, routes and timings in the public MVP are synthetic. The product does not reproduce unpublished manuscript text, private case reconstructions, restricted datasets, reviewer communications or other submission-sensitive academic materials.

## Demo flow

1. Open **Timing Stress**.
2. Observe the initial `−7 min` Survival Gap.
3. Click **Run Live Devnet Proof**.
4. If automatic faucet funding is rate-limited, fund the displayed persistent Devnet address once and retry.
5. Watch `Prepare → Sign → Submit → Confirm → Complete`.
6. Verify the real signature / slot / Explorer link.
7. Observe the synthetic scenario move to `+14 min` only after confirmation.

## Validation

Early customer-discovery responses are logged conservatively in `VALIDATION.md`. No traction claim is made without real responses.

## Audit

See `HOSTILE_JUDGE_AUDIT.md` and `INTERACTION_QA.md`.

## License

MIT.
