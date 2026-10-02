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

The browser adapter connects to Phantom and sends a **real 0.00315 Devnet SOL transfer** to an ephemeral demo recipient. The transaction is signed by the connected development wallet, submitted to Solana Devnet, confirmed, and surfaced with a real signature, slot, timing and Explorer link.

The **3.15M LQUSD** amount is synthetic stress-test notional. It is deliberately not represented as a real-valued token. The engine does **not** apply the scenario intervention until the real Devnet proof transaction confirms.

## Run locally

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Demo flow

1. Open **Timing Stress**.
2. Observe the initial `−7 min` Survival Gap.
3. Connect a development-only Phantom wallet on Solana Devnet.
4. Execute the proof transaction.
5. Wait for confirmed settlement.
6. Observe the recalculated `+14 min` Survival Gap and transaction proof.

See [`DEMO.md`](DEMO.md) for the 90-second judge flow.

## Hackathon provenance

See [`HACKATHON_DISCLOSURE.md`](HACKATHON_DISCLOSURE.md) for the separation between pre-existing research insight and the public product/code built for the hackathon.

## Public-safety boundary

All institutions, balances, rates, routes and timings in the public MVP are synthetic. The product does not reproduce unpublished manuscript text, private case reconstructions, restricted datasets, reviewer communications or other submission-sensitive academic materials.

## License

MIT.
