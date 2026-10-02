# Liquidity Clock — Final Submission Dry Run

Date: 2026-10-02

## Current readiness

### PASS

- Product name: Liquidity Clock
- Tagline
- Product description
- Founder background
- Team/location
- Problem statement
- Primary user
- Market positioning
- Business model hypothesis
- GTM strategy
- Distribution plan
- GitHub repository
- Public-safe product build
- Custom Stress mode
- Deterministic engine
- Solana Devnet → Testnet proof adapter
- Explicit `LIVE CONFIRMED` vs `SIGNED / NOT BROADCAST` separation
- No Phantom / mainnet requirement
- Favicon / app metadata
- Pitch script
- Technical demo script
- Recording plan
- Pre-existing work disclosure
- Claims firewall

### PENDING REAL EVIDENCE

1. Explorer-confirmed Solana test-cluster transaction
2. Confirmed signature / slot / Explorer URL
3. Validation replies / tester feedback
4. Permanent live product URL
5. Final pitch video URL
6. Final technical demo video URL

## Important integrity gate

A `SIGNED / NOT BROADCAST` fallback does **not** count as on-chain proof.

In signed-only mode:

- the Solana route remains Available;
- the treasury state remains `1.50M / 10:00 / -07:00`;
- no slot is shown;
- no Explorer link is shown;
- the UI offers `Retry Live Confirmation`.

Only an Explorer-confirmed transaction may change the state to `4.65M / 31:00 / +14:00` and mark the route as Deployed.

## Form copy source

Use `FORM_COPY.md` as the copy/paste source.

Do not replace PENDING fields with assumptions.

## Product graphic

Use the locked Liquidity Clock hero visual / clean screenshot showing:

- Buffer Clock
- Survival Gap
- Next Liquidity

Avoid screenshots dominated by disclosure text or setup controls.

## Pitch video

Use `PITCH_SCRIPT.md`.

Target: ~2:15.

Must include:

- founder background;
- problem;
- target user;
- product insight;
- Survival Gap;
- Solana execution role;
- market wedge;
- long-term vision;
- one validation sentence only if supported by real responses.

## Technical demo

Use `TECHNICAL_DEMO_SCRIPT.md`.

Target: ~2:20.

Must visibly show:

- initial -07:00 state;
- route logic;
- recommendation;
- Solana test-cluster status;
- one-click live proof;
- Confirmed status;
- slot;
- signature;
- Explorer;
- -07:00 to +14:00 recalculation after confirmation.

## Validation rule

Do not count drafts as outreach and do not count outreach as validation.

Only report:

- messages actually sent;
- replies actually received;
- demo testers who actually viewed the product;
- recurring themes supported by responses;
- quotes only with permission.

## Live URL gate

A permanent public HTTPS URL is preferred for submission.

Before inserting it into the form, verify:

- page loads without auth;
- scripts/assets load;
- mobile layout works;
- scenario buttons work;
- Custom Stress recalculates;
- signed-only mode does not mutate treasury state;
- live-confirmed mode does mutate treasury state;
- no console-breaking errors;
- favicon appears;
- no private material is exposed.

## Final submit gate

Submit only when all required fields are complete and the links are publicly accessible to judges.

Final status must be one of:

- `READY TO SUBMIT`
- `HOLD — missing real evidence`

Current status: `HOLD — missing real evidence`.
