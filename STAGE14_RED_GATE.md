# Stage 14 — Red Gate Closure

Date: 2026-10-02

## Gate A — Live public demo

Status: **PARTIAL / PUBLIC FALLBACK WORKING**

- Production static build is complete.
- `live.html` is synchronized with `index.html` on the public `liquidity-clock` branch.
- RawGitHack is usable for browser testing.
- Automatic Vercel deployment is not currently available through the connected tool account.
- Do not claim a permanent production URL until one is verified in a normal browser.

## Gate B — Explorer-confirmed Solana proof

Status: **RESILIENT FLOW IMPLEMENTED / CONFIRMED CHAIN PROOF STILL PENDING**

Current one-click sequence:

1. Open Liquidity Clock.
2. Select **Timing Stress**.
3. Click **Run Live Solana Proof**.
4. The app tries Solana Devnet first and Testnet second.
5. If public test funding is available, it signs, submits and waits for confirmation.
6. A live success must show `CONFIRMED`, signature, slot and Explorer.
7. Only then may the synthetic state change `1.50M → 4.65M`, `10:00 → 31:00`, `−07:00 → +14:00` and mark Solana Reserve `Deployed`.

If public test funding is unavailable, the app returns `SIGNED / NOT BROADCAST` instead. That mode is not on-chain evidence and must leave the treasury state unchanged.

Hard rule: never substitute a mock, simulated, or merely signed-but-unbroadcast transaction for the final confirmed proof.

## Gate C — Real user validation

Status: **PENDING USER-AUTHORIZED OUTREACH / NO VALIDATION CLAIMS**

Do not send any email and do not create new outreach drafts unless the user explicitly asks for a draft. Sending any email requires a separate explicit user instruction.

Validation counts remain zero until real outreach is actually sent with user authorization and replies / real prototype views occur.

## What becomes submission-ready after these gates

Once a permanent public URL is verified, one real Solana test-cluster transaction is Explorer-confirmed, and real validation evidence exists:

- update `VALIDATION.md` with factual counts/themes;
- insert the verified URL into `FORM_COPY.md` and `SUBMISSION_PACKAGE.md`;
- insert the real transaction proof into the technical demo;
- record the final 2–3 minute pitch video;
- record the separate ≤3 minute product demo;
- run the final submission gate and submit.
