# Liquidity Clock

**Will executable liquidity arrive before your buffer runs out?**

Liquidity Clock is a public-safe synthetic stress engine for digital-asset treasuries. It compares current executable liquidity with stress outflow velocity, walks committed liquidity routes chronologically, identifies the first binding timing gap, and tests available interventions.

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
- After confirmed execution proof: operating liquidity **4.65M**, buffer horizon **31 min**, Survival Gap **+14 min**

## Real Solana Devnet proof

The browser adapter connects to Phantom and sends a **real 0.00315 Devnet SOL transfer** to an ephemeral demo recipient. The transaction is signed by the connected development wallet, submitted to `https://api.devnet.solana.com`, confirmed, and surfaced with:

- real transaction signature;
- confirmation status;
- slot;
- end-to-end execution time;
- network confirmation time;
- Solana Explorer link;
- post-transaction Devnet wallet balance.

The **3.15M LQUSD** amount is synthetic stress-test notional. It is deliberately not represented as a real-valued token. The Devnet SOL transfer is the current public MVP's execution/settlement-timing proof for the route; it is not presented as a real 3.15M-value liquidity movement.

The engine does **not** apply the 3.15M scenario intervention until the real Devnet proof transaction confirms.

## Wallet safety

Use a **development wallet only**. Do not use a wallet holding valuable mainnet assets. The app includes a Devnet faucet action and never requires mainnet SOL.

## Run locally

The deterministic app shell has no package-manager dependencies. Real chain execution loads the pinned Solana Web3 browser bundle from jsDelivr, so internet access and Phantom are required for the Devnet transaction.

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Custom stress mode

The public MVP includes a user-defined scenario builder. Reviewers can change executable liquidity, stress outflow, next committed arrival and available reserve inputs; the deterministic engine recalculates the buffer horizon, binding Survival Gap and intervention recommendation. This demonstrates that the engine is not hard-coded to the golden demo.

## Architecture

- `engine.js` — deterministic survival-gap and intervention engine
- `app.js` — scenarios, state, rendering, wallet controls, user flow
- `solana-adapter.js` — Phantom + Solana Devnet execution adapter
- `index.html` / `styles.css` — single-page institutional UI

## Public-safety boundary

All institutions, balances, rates, routes and timings in the public MVP are synthetic. The product does not reproduce unpublished manuscript text, private case reconstructions, restricted datasets, reviewer communications or other submission-sensitive academic materials.

## Demo flow

1. Open **Timing Stress**.
2. Observe the initial `−7 min` Survival Gap.
3. Optionally open **Custom Stress** and change the inputs to test a new configuration.
4. Connect a development-only Phantom wallet on Solana Devnet.
5. Execute the proof transaction.
6. Wait for confirmed settlement.
7. Observe the recalculated Survival Gap and transaction proof.

See [`DEMO.md`](DEMO.md) for the 90-second judge flow.

## Hackathon provenance

See [`HACKATHON_DISCLOSURE.md`](HACKATHON_DISCLOSURE.md) for the explicit separation between pre-existing research insight and the public product/code built for the hackathon.

## Validation

Early customer-discovery responses should be logged conservatively in [`VALIDATION.md`](VALIDATION.md). No traction claim should be made without real responses.

## Pre-submission audit

See [`HOSTILE_JUDGE_AUDIT.md`](HOSTILE_JUDGE_AUDIT.md) for the current red/yellow/green risks before submission.

## License

MIT. See [`LICENSE`](LICENSE).
