# Liquidity Clock — Final Recording Plan

## Goal

Record two clean submission videos after the first Explorer-confirmed Solana test-cluster proof is available.

## Video A — Pitch

Target: 2:10–2:25.

Use `PITCH_SCRIPT.md`.

Visual sequence:

1. Hero screen.
2. Two clocks + Survival Gap.
3. Route table and recommendation.
4. Solana proof section.
5. Founder / market wedge.
6. Clean hero close.

## Video B — Technical Demo

Target: 1:50–2:15.

Use `TECHNICAL_DEMO_SCRIPT.md`.

Pre-recording setup:

- Timing Stress selected.
- No old proof values on-screen.
- Browser zoom adjusted so hero + action card are clear.
- Close unrelated tabs and notifications.
- Internet connection available.
- Test the button once before the final take. If the result is only `SIGNED / NOT BROADCAST`, wait and retry later; do not record that as the final chain proof.

Recording sequence:

1. Show `-07:00` initial Survival Gap.
2. Show route table and highlighted Solana Reserve.
3. Show recommendation.
4. Click the Solana cluster pill to refresh RPC status.
5. Click **Run Live Solana Proof** once.
6. Capture `Prepare → Sign → Submit → Confirm → Complete`.
7. Hold on `CONFIRMED`.
8. Show execution time, slot and signature.
9. Open `View on Explorer` briefly.
10. Return and show `-07:00 → +14:00`, `1.50M → 4.65M`, `10:00 → 31:00`.
11. Optional: Custom Stress if still under 3 minutes.

## Signed-only contingency

If public test funding is unavailable on both Devnet and Testnet, the app may return `SIGNED / NOT BROADCAST`.

That mode is a resilience fallback only:

- no manual faucet step is required;
- no mainnet funds are required;
- no slot or Explorer is shown;
- the treasury state remains unchanged;
- use **Retry Live Confirmation** later.

Do not use signed-only mode as the final on-chain proof in the submission video.

## Privacy gate

The demo uses only a dedicated test-only browser signer. Do not display or export private key material. Never show personal browser tabs/messages or private academic/reviewer materials.

## Proof capture

After the real confirmed transaction, save in `DEVNET_PROOF_RECORD.md`:

- date/time;
- actual cluster used (Devnet or Testnet);
- proof transfer amount in test SOL;
- execution time;
- slot;
- full signature;
- Explorer URL;
- screenshot filenames.

## Final video gate

PASS only if:

- pitch < 3:00;
- demo < 3:00;
- no fake/mocked proof;
- real Explorer-verifiable transaction shown;
- synthetic notional vs real test-SOL proof is explicit;
- product value is understandable without reading the repository.
