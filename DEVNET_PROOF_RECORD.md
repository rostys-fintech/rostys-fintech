# Liquidity Clock — Solana Proof Record

Status: PENDING FIRST EXPLORER-CONFIRMED TEST-CLUSTER TRANSACTION

Fill only from an actual confirmed transaction shown by the app and Solana Explorer.

## Confirmed proof

- Date/time: PENDING
- Network: PENDING — Solana Devnet or Solana Testnet
- Signer mode: dedicated browser test signer
- Proof transfer: 0.0000315 test SOL
- Confirmation status: PENDING
- End-to-end execution time: PENDING
- Network confirmation time: PENDING
- Transaction slot: PENDING
- Signature: PENDING
- Explorer URL: PENDING

## Scenario effect after confirmed proof

Synthetic scenario only:

- Before executable liquidity: 1.50M LQUSD
- After executable liquidity: 4.65M LQUSD
- Before buffer horizon: 10:00
- After buffer horizon: 31:00
- Before Survival Gap: -07:00
- After Survival Gap: +14:00

## Signed-only fallback

The app may produce a `SIGNED / NOT BROADCAST` transaction if public test funding is unavailable.

That fallback is **not** the confirmed proof recorded above.

In signed-only mode:

- the signature may be displayed;
- slot remains blank;
- Explorer remains hidden;
- Solana Reserve stays Available rather than Deployed;
- treasury state remains 1.50M / 10:00 / -07:00;
- the user can retry live confirmation later.

## Claim boundary

A confirmed test-cluster transaction is real execution / settlement-path proof using test SOL.

The 3.15M LQUSD scenario amount is synthetic public-safe notional and is not represented as a real-valued on-chain asset movement.

A locally signed but unbroadcast transaction must never be described as confirmed or on-chain.

## Evidence files

- Confirmation screenshot: PENDING
- Explorer screenshot: PENDING
- Demo video timestamp: PENDING
