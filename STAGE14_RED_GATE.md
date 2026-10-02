# Stage 14 — Red Gate Closure

Date: 2026-10-02

## Gate A — Live public demo

Status: **PARTIAL / FALLBACK READY**

- Production static build is complete.
- `live.html` is a self-contained single-file fallback build on the public `liquidity-clock` branch.
- Automatic Vercel deployment is not currently available through the connected tool account.
- Do not claim a verified production URL until it is opened successfully in a normal browser.

Candidate fallback URLs to test manually:

- `https://raw.githack.com/rostys-fintech/rostys-fintech/liquidity-clock/live.html`
- `https://htmlpreview.github.io/?https://github.com/rostys-fintech/rostys-fintech/blob/liquidity-clock/live.html`

## Gate B — Real Solana Devnet proof

Status: **CODE READY / USER SIGNATURE REQUIRED**

Required manual sequence using a development-only Phantom wallet:

1. Open the live/local Liquidity Clock build in Chrome with Phantom installed.
2. Select **Timing Stress**.
3. Click **Connect Phantom** and connect a development-only wallet on Solana Devnet.
4. If needed, click **Fund Devnet**.
5. Confirm the wallet has enough Devnet SOL for the proof transfer and fees.
6. Click **Execute Liquidity**.
7. Approve the real 0.00315 Devnet SOL transaction in Phantom.
8. Wait for **CONFIRMED**.
9. Verify that the UI surfaces the real signature, slot, execution time and Explorer link.
10. Open the Explorer link and confirm it resolves to the same Devnet transaction.
11. Confirm the synthetic model changes only after confirmation: `1.50M → 4.65M`, `10:00 → 31:00`, `−07:00 → +14:00`.

Hard rule: never substitute a mock signature or simulated confirmation for this gate.

## Gate C — Real user validation

Status: **DRAFTS READY / NOTHING SENT**

Four Gmail drafts are prepared across banking, financial-stability, academic-finance and external-mentor perspectives. Current verified validation counts remain zero until messages are actually sent and replies are received.

## What becomes submission-ready after these gates

Once a public URL is verified, one real Devnet transaction is completed, and real validation responses exist:

- update `VALIDATION.md` with factual counts/themes;
- insert the verified URL into `FORM_COPY.md` and `SUBMISSION_PACKAGE.md`;
- insert the real transaction proof into the technical demo;
- record the final 2–3 minute pitch video;
- record the separate ≤3 minute product demo;
- run the final submission gate and submit.
