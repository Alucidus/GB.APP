# Engagement board verification (cf104)

## Automated checks completed

Run `npm test` (Node 22+; no dependency installation needed for this test).

200 assertions passed against the production BattleRoom using a local HTTP adapter and in-memory Durable Object storage. Two player seats create a battle, challenge, accept, and play four-round physical bouts. Checks cover confirmation/un-confirm, turn gates including the older roster-save path, next-turn start, roster add/withdraw, denied and successful disengagement, waiting-squad item eligibility, objective ownership after merging, plain 1v1, rolled Objective Clash, and forced re-engagement counters.

Node VM checks call the actual client board and end-state renderer for both teams, checking mutually exclusive screens and private enemy items. They also execute objective bookkeeping and the merge handler, checking ownership transfer, the eight-soldier cap, healthiest survivor, and no item refill.

JavaScript syntax checks passed for the client, server, and browser test.

## Browser verification still required

`tests/engagement-board.mjs` provides a two-browser-context Playwright scenario, using desktop (1280×850) and phone (390×844) viewports and the same production server adapter. It is included but has not run successfully: this environment had no Chromium binary, and downloading it timed out. No screenshots or visual-pass claim are included.

On a machine with network access:

```sh
npm install --no-save playwright
npx playwright install chromium
npm run test:browser
```

The browser scenario drives board buttons, checks item spending, and writes screenshots under `tests/screenshots/`. Review the screenshots and try a full game on two physical devices before treating cf101 as visually verified.

## Limits

The adapter does not test Cloudflare WebSockets, Cloudflare deployment, or Durable Object persistence. Existing networking and infrastructure settings were retained. The live Worker has not been deployed by this task.

cf101 adds checks for another Flashbang after Smoke, repeated Smoke responses, duplicate-response rejection, turn blocking during the chain, and challenge objective markers for both teams (including equal squad IDs and escaped names). The user reported cf100 functionality working; this does not replace cf101 visual verification.

cf102 also verifies both teams must agree to physical dice: self-confirmation and early ready are rejected, alternative mode requests need agreement, and both request/response screens render correctly.

cf103 checks no-loss merging: 5+5 becomes 8+2; 7+4 becomes 8+3; 3+4 becomes 7; three squads preserve overflow; full targets are no-ops; partial donors remain in server engagement lists; emptied holders transfer the objective.

cf104 checks invitation pairings, defender adjustments, rejected duplicate/out-of-roster pairs, draft retention and repair, repeat defending squads, and all bout selectors appearing together.
