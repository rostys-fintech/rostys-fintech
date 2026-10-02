# Architecture

1. Load synthetic/public-safe treasury state.
2. Calculate executable buffer horizon.
3. Order committed liquidity routes by arrival time.
4. Walk the route chain and find the first binding gap.
5. Test available interventions against the binding gap.
6. Recommend the earliest sufficient intervention.
7. Prepare a dedicated test-only Solana signer in the browser.
8. Attempt a real proof transaction on Solana Devnet.
9. If Devnet public test funding is unavailable, automatically try Solana Testnet.
10. If a transaction is broadcast, wait for confirmed settlement and capture signature, slot, timing and Explorer URL.
11. Only after confirmation, apply the synthetic intervention to executable liquidity and recalculate the Survival Gap.
12. If public test funding is unavailable on both clusters, create a fresh network-bound signed transaction and mark it `SIGNED / NOT BROADCAST`; do not change the treasury state and do not claim on-chain confirmation.

## Integrity rule

`synthetic scenario notional != real token value`.

A confirmed test-SOL transaction proves the execution / settlement path on a Solana test cluster. It does not claim that LQUSD is a real asset, stablecoin or market-valued token.

A signed-but-unbroadcast transaction proves local transaction construction and signing only. It is not on-chain evidence.
