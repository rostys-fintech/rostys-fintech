# Liquidity Clock — Final Recording Plan

## Goal

Record two clean submission videos after the first real Devnet proof is confirmed.

## Video A — Pitch

Target: 2:10–2:25.

Use `PITCH_SCRIPT.md`.

Visual sequence:

1. Hero screen.
2. Two clocks + Survival Gap.
3. Route table and recommendation.
4. Solana Devnet proof section.
5. Founder / market wedge.
6. Clean hero close.

## Video B — Technical Demo

Target: 1:50–2:15.

Use `TECHNICAL_DEMO_SCRIPT.md`.

Pre-recording setup:

- Timing Stress selected.
- Persistent Devnet demo wallet already has enough test SOL if the public faucet is rate-limited.
- No old proof values on-screen.
- Browser zoom adjusted so hero + action card are clear.
- Close unrelated tabs and notifications.
- Internet connection available.

Recording sequence:

1. Show `-07:00` initial Survival Gap.
2. Show route table and highlighted Solana Reserve.
3. Show recommendation.
4. Click `Solana Devnet` to refresh RPC status.
5. Click **Run Live Devnet Proof** once.
6. Capture `Prepare → Sign → Submit → Confirm → Complete`.
7. Hold on `CONFIRMED`.
8. Show execution time, slot and signature.
9. Open `View on Explorer` briefly.
10. Return and show `-07:00 → +14:00`, `1.50M → 4.65M`, `10:00 → 31:00`.
11. Optional: Custom Stress if still under 3 minutes.

## Faucet contingency

If automatic `requestAirdrop` returns a 429 during setup, use the in-app **Devnet Funding Fallback** once before recording:

1. Copy the persistent demo address.
2. Fund it with Devnet test SOL via an external faucet.
3. Return to the same browser.
4. Press **Run Live Devnet Proof** again.

The demo address persists in browser storage, so this setup survives refreshes. Do not show the faucet setup in the final video unless needed to explain resilience.

## Privacy gate

The demo uses only a dedicated Devnet-only browser keypair. Do not display or export private key material. Never show personal browser tabs/messages or private academic/reviewer materials.

## Proof capture

After the real transaction, save in `DEVNET_PROOF_RECORD.md`:

- date/time;
- network;
- source demo wallet (shortened);
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
- synthetic notional vs real Devnet proof is explicit;
- product value is understandable without reading the repository.
