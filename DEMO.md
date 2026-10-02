# Demo Script

## 90-second golden demo

### 0:00–0:15 — Problem
Open **Timing Stress**.

> Liquidity can look sufficient in aggregate and still arrive too late. Liquidity Clock compares the time until the current executable buffer is exhausted with the time until the next usable source arrives.

### 0:15–0:35 — Two clocks
Show `1.50M LQUSD`, `150k/min`, `10:00`, `17:00` and Survival Gap `−07:00`.

> The current plan fails seven minutes before the next committed source becomes usable.

### 0:35–0:50 — Recommendation

> The fastest sufficient intervention is the Solana reserve. Slower routes do not close the first binding timing gap.

### 0:50–1:15 — Solana proof
Click **Run Live Solana Proof**.

> The app uses a test-only signer, tries Devnet first and Testnet second, and submits a real test-SOL transaction when public test funding is available. No user wallet or mainnet funds are required.

For the final demo, show confirmed status, signature, slot and Explorer link.

> The chain transaction is the execution proof. The 3.15M LQUSD amount is synthetic scenario notional and is applied only after confirmation.

### 1:15–1:30 — Outcome
Show executable liquidity `4.65M`, runway `31:00`, Survival Gap `+14:00`.

> Liquidity Clock turns liquidity from a static balance into a timing decision: will usable liquidity arrive before the buffer is gone?

## Signed-only fallback

If the site shows `SIGNED / NOT BROADCAST`, the treasury state must **not** change. No slot or Explorer link is shown. Use **Retry Live Confirmation** later; do not present signed-only mode as on-chain execution evidence.
