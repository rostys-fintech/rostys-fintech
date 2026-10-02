# Solana test-cluster demo flow

1. Open Liquidity Clock.
2. Select **Timing Stress**. Initial Survival Gap is `-07:00`.
3. Click **Run Live Solana Proof**.
4. The app uses a dedicated test-only browser signer.
5. It attempts Devnet first and Testnet second.
6. If test SOL is available, the app signs, submits and confirms a real `0.0000315 test SOL` transfer.
7. The app displays confirmation status, execution time, signature, slot and Explorer link.
8. Only after real confirmation does the synthetic scenario change from `1.50M` to `4.65M LQUSD`, moving the Survival Gap from `-07:00` to `+14:00` and marking the Solana route `Deployed`.

## Signed-only fallback

If public test funding is unavailable on both clusters, the app creates a fresh transaction tied to a current test-cluster blockhash and signs it locally.

The UI then shows:

- `SIGNED / NOT BROADCAST`;
- signature;
- no slot;
- no Explorer link;
- unchanged treasury state;
- **Retry Live Confirmation**.

This fallback is not on-chain proof.

## Demo disclosure

The test-SOL transfer is execution / settlement-path proof. The 3.15M LQUSD stress amount is synthetic notional. No mainnet funds, personal wallet or unpublished research data are used.
