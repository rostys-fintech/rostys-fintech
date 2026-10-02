# Liquidity Clock — Final Recording Plan

## Goal

Record two clean submission videos immediately after the first real Devnet proof is confirmed.

## Video A — Pitch

Target: 2:10–2:20.

Use `PITCH_SCRIPT.md`.

Visual sequence:

1. 0:00–0:15 — Logo / hero screen.
2. 0:15–0:38 — Simple route visual or full product overview.
3. 0:38–0:55 — Founder on camera or clean voiceover with name + banking/finance background.
4. 0:55–1:28 — Two clocks + Survival Gap.
5. 1:28–1:48 — Execution Proof section / Solana Devnet label.
6. 1:48–2:04 — Product overview / route table.
7. 2:04–2:15 — Clean hero close.

Do not spend pitch time showing Phantom signing in detail. That belongs in the technical demo.

## Video B — Technical Demo

Target: 2:15–2:30.

Use `TECHNICAL_DEMO_SCRIPT.md`.

Pre-recording setup:

- Chrome with Phantom enabled.
- Development wallet only.
- Wallet already funded with enough Devnet SOL.
- Timing Stress selected.
- No old proof values on-screen.
- Browser zoom 100% or adjusted so hero + action card are clear.
- Close unrelated tabs and hide bookmarks if distracting.
- Disable notifications.

Recording sequence:

1. Show `-07:00` initial Survival Gap.
2. Show route table and highlighted Solana Reserve.
3. Show recommendation.
4. Click `Solana Devnet` to refresh RPC status.
5. Connect Phantom if not already connected.
6. Click `Execute Devnet Proof`.
7. Approve transaction in Phantom.
8. Capture Prepare → Sign → Submit → Confirm → Complete.
9. Hold for 2–3 seconds on `CONFIRMED`.
10. Show execution time, slot and signature.
11. Open `View on Explorer` briefly.
12. Return and show `-07:00 → +14:00` / `1.50M → 4.65M` / `10:00 → 31:00`.
13. Optional: Custom Stress recalculation if still under 3 minutes.

## Privacy gate

Never show:

- seed phrase;
- private key;
- mainnet wallet balances;
- personal browser tabs/messages;
- private academic/reviewer materials.

## Proof capture

After the real transaction, save these exact fields in `DEVNET_PROOF_RECORD.md`:

- date/time;
- network;
- source wallet shortened only;
- proof transfer amount in test SOL;
- execution time;
- slot;
- full signature;
- Explorer URL;
- screenshot filename(s).

## Final video gate

PASS only if:

- audio is clear;
- pitch < 3:00;
- demo < 3:00;
- no fake/mocked proof;
- no sensitive wallet information;
- Solana role is explained clearly;
- synthetic notional vs real Devnet proof is explicit;
- product value is understandable without reading the repository.
