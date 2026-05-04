Plan

HTCS Unit 6 Day 5 Animation And Demo Plan
Summary
Implement the Day 5 improvements in phased React-deck work only, targeting app/src/htcs-decks/unit6/day05/slides.tsx. Add two dedicated interactive demo slides, keep existing lecture slides intact, and make non-demo animations auto-run briefly when each slide appears.

Final deck shape: existing 25 slides plus 2 new demo slides, for 27 total.

Key Changes
Add a small shared motion layer inside the Day 5 slide module or nearby deck-local helpers:

CSS keyframes / inline motion helpers for path drawing, pulses, fades, packet movement, count-up styling, and reduced-motion fallbacks.
Respect prefers-reduced-motion; static mode should render final, legible states.
No deck runtime API change required.
Phase 1: animate high-value static diagrams:

Slide 1 Cover: subtle network-node pulse.
Slide 4 Visa vs Bitcoin: stagger reveal / count emphasis for TPS contrast.
Slide 8 Opening a Channel: draw Bob ↔ Coffeeshop channel line.
Slide 9 Multi-Sig Funding: animate Bob’s funds moving into the 2-of-2 address.
Slide 10 Balance Sheet: reveal both signatures.
Slide 14 Updated Sheet: old balances fade/cross out, new balances appear.
Slide 15 Exchanging Sheets: signed copies cross between Bob and Coffeeshop.
Slide 16 Closing Channel: latest sheet moves on-chain, then settlement split appears.
Slide 17 Reduced Load: many coffees collapse into two on-chain transactions.
Slide 18 Latest Sheet Valid: old sheet rejected, penalty state highlighted.
Slide 21 Alice to Coffeeshop: route highlight moves Alice → Bob → Coffeeshop.
Slide 22 Routing Payment: three HTLC steps reveal sequentially.
Slide 23 Network Map: pulse discovered path through the network.
Phase 2: add Channel Simulator after Latest Sheet Valid:

Controls: Buy Coffee, Close Channel, Try Cheating, Reset.
State model: Bob starts at 0.050 BTC; each coffee transfers 0.005 BTC to Coffeeshop.
Show current balance sheet, revoked prior sheets, coffee count, and on-chain tx counter fixed at open/close.
Try Cheating broadcasts an old revoked sheet and shows the penalty outcome.
Static mode renders a canonical state: several coffees bought, old sheets revoked, latest sheet valid.
Phase 3: add HTLC Routing Demo after Routing Payment:

Controls: Next Step, Back, Reset.
Steps: hash lock forward, Coffeeshop reveals secret, settlement propagates backward, Bob earns routing fee.
Use Alice → Bob → Coffeeshop diagram with animated packet/secret movement.
Static mode renders the full successful route with labels for lock, reveal, and fee.
Phase 4: update deck metadata dependencies:

Insert the two new slide definitions into DAY5_SLIDES.
Add matching speaker notes in notes.ts.
Keep public standalone HTML untouched in this phase.
Test Plan
Run npm run build from app/.
Verify /code/htcs-lessons/day5-react manually:
Arrow navigation still works.
Presenter mode still opens.
New slide count and speaker notes stay aligned.
Demos do not accidentally advance slides when using their buttons.
Verify /code/htcs-lessons/day5-react?mode=static:
Animations render as stable final states.
Demo slides show deterministic snapshots.
Browser QA:
Check slides 1, 4, 8-10, 14-18, 21-23, and both new demos at desktop size.
Enable reduced motion and confirm motion is disabled or simplified without losing meaning.
Assumptions
Implement React source first only; do not manually mirror into public/static/code/lessons/HTCS/HTCS_Unit6_Day5.html.
New demos are dedicated slides, not replacements.
Non-demo animations auto-run on slide entry, with no extra click controls unless a replay button becomes trivially useful.
Existing Day 4 dirty files are unrelated and should not be touched.
