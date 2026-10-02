# Liquidity Clock — Final Recording Plan

## Goal

Record two clean submission videos from the permanent public build without depending on public Solana faucet availability.

Permanent URL:

`https://rostys-fintech.github.io/rostys-fintech/`

## Video A — Pitch

Target: **2:05–2:20**.

Use `PITCH_SCRIPT.md`.

Recommended visual sequence:

1. Hero / title.
2. Three clocks and Survival Gap.
3. Route table and recommendation.
4. Run Liquidity Rescue animation and result.
5. Execution & Verification section.
6. Clean product close.

Face-cam is optional. A clean screen recording with your natural voice is sufficient and may look more professional than forcing a webcam layout.

## Video B — Technical Demo

Target: **1:35–1:55**.

Use `TECHNICAL_DEMO_SCRIPT.md`.

### Pre-recording setup

- Open only `https://rostys-fintech.github.io/rostys-fintech/`.
- Select **Timing Stress**.
- Refresh once so the scenario begins in the initial state.
- Browser zoom: 90–100%.
- Hide unrelated tabs/bookmarks if they contain personal information.
- Disable desktop/browser notifications.
- Do not open wallet extensions, email, private research files or developer tools.
- Test the full rescue once before the final take, then refresh back to the initial state.

### Recording sequence

1. Show `10:00 / -07:00 / 17:00`.
2. Scroll to Liquidity routes.
3. Pause on Solana Reserve and Recommended Action.
4. Click **Run Liquidity Rescue** once.
5. Do not move the cursor while the loading animation is running.
6. Show the completed synthetic result:
   - `1.50M → 4.65M`
   - `10:00 → 31:00`
   - `-07:00 → +14:00`
7. Scroll to Execution & Verification.
8. If Solana is live-confirmed, show signature / slot / Explorer briefly.
9. If Solana verification is pending, leave the honest pending state visible for 2–3 seconds and continue. Do not retry during the take.
10. Switch to **Custom Stress**.
11. Change Reserve ETA to a value after buffer exhaustion and recalculate.
12. Show that the route is no longer recommended.
13. End recording.

## Solana proof rule

The product demo and the Solana verification layer are intentionally separated.

- The treasury rescue outcome is a **synthetic public-safe simulation**.
- A Solana transaction is **live verification only when actually confirmed on-chain**.
- If public test funding is unavailable, the demo remains complete while verification is labelled pending.
- Never imply that 3.15M LQUSD was transferred on-chain.

An Explorer-confirmed test-cluster transaction is valuable evidence, but it is no longer a prerequisite for recording a coherent product demo.

## Recording quality gate

PASS if:

- pitch < 3:00;
- technical demo < 3:00;
- voice is clear and natural;
- no personal/private content is visible;
- all button labels in narration match the live UI;
- loading animations are visible rather than looking frozen;
- synthetic outcome and live verification are clearly separated;
- no unverified chain claim is made;
- product value is understandable without reading GitHub.

## After recording

Keep two final files:

- `liquidity-clock-pitch.mp4`
- `liquidity-clock-demo.mp4`

After the files are ready, add their public video URLs to `FORM_COPY.md` and `SUBMISSION_PACKAGE.md`, then run the final submission-form audit.
