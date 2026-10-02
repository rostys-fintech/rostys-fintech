# Architecture

1. Load synthetic/public-safe treasury state.
2. Calculate executable buffer horizon.
3. Order committed liquidity routes by arrival time.
4. Walk the route chain and find the first binding gap.
5. Test available interventions against the binding gap.
6. Recommend the earliest sufficient intervention.
7. Connect a development Phantom wallet to Solana Devnet.
8. Submit a real Devnet SOL proof transfer through the isolated Solana adapter.
9. Wait for confirmed settlement and capture signature, slot and timing.
10. Only after confirmation, apply the synthetic intervention to executable liquidity.
11. Recalculate buffer horizon and Survival Gap.

## Integrity rule

`synthetic scenario notional != real token value`.

The blockchain transaction proves that the selected route can execute and settle on-chain. It does not claim that LQUSD is a real asset, stablecoin or market-valued token.
