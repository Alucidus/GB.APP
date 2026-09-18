# Engagement board verification (cf106)

## Automated checks completed

Run `npm test` (Node 22+; no dependency installation needed for this test).

219 assertions passed against the production BattleRoom using a local HTTP adapter and in-memory Durable Object storage. Two player seats create a battle, challenge, accept, and play four-round physical bouts. Checks cover confirmation/un-confirm, turn gates including the older roster-save path, next-turn start, roster add/withdraw, denied and successful disengagement, waiting-squad item eligibility, objective ownership after merging, plain 1v1, rolled Objective Clash, and forced re-engagement counters.

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

cf105 checks invitation pairings, defender adjustments, rejected duplicate/out-of-roster pairs, draft retention and repair, repeat defending squads, and all bout selectors appearing together.

cf105 additionally checks per-bout dice agreement and in-app waiting notifications, including duplicate suppression and teammate ownership.

cf106: offline tracker spending, restoration, zero limit, refill, and online protection were checked separately. Browser visual verification remains pending.


## cf107 equipment checks

`npm test` also runs equipment rules and the DOM smoke test. The latter uses stub nodes: it catches runtime and callback errors but cannot verify rendered appearance or CSS hit targets.

On desktop and phone, open Weapons / Equip, select a rifle/bazooka/saber and tap each arm HP bubble; verify only equipment/AP changes. Cancel and verify normal damage taps resume. Equip two guns and inspect their −3 notices; integrated weapons must remain unpenalised. Lose an arm with a shield and weapon; recover each for 1 AP, verify their HP/cooldowns remain unchanged and an occupied hand sends the weapon to inventory. Check Phenex's sabers and both remote-DE lending controls. Verify Exia's matrix fills both hands, costs 2 AP, and does not refill parries until Begin melee segment. Switch to another device and inspect saved hand assignments; a read-only teammate must not equip.

Chromium download timed out in this environment; no cf107 visual/browser run has been claimed.
