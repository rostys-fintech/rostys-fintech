# Devnet demo flow

1. Open Liquidity Clock in a browser with Phantom installed.
2. Use a separate development wallet.
3. Click **CONNECT PHANTOM**.
4. If Devnet balance is low, click **FUND DEVNET**.
5. Select **TIMING STRESS**. Initial Survival Gap is `-07:00`.
6. Click **EXECUTE LIQUIDITY**.
7. Phantom signs a transaction; the app sends the signed bytes to the Solana Devnet RPC.
8. The proof transfer is `0.00315 SOL` to an ephemeral demo recipient.
9. The app waits for confirmation and displays signature, slot, timing and an Explorer link.
10. Only then does the scenario notional change from `1.50M` to `4.65M LQUSD`, moving the Survival Gap from `-07:00` to `+14:00`.

## Demo disclosure

The 0.00315 SOL transfer is a real Devnet execution proof. The 3.15M LQUSD stress amount is synthetic notional. No mainnet funds or unpublished research data are used.
