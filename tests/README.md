# cf125 verification

See [Release_Notes_cf125.md](../Release_Notes_cf125.md) for current results and limitations. Browser tests cover unit-first ship repair assignment, infantry loading, shield-bubble equipping, Inventory naming, base ownership/entry/healing, stable damage redraws and destroyed-overlay layering. New commands include `npm run test:loading:browser`, `npm run test:damage:browser` and `npm run test:destroyed:browser`. Browser tests use Playwright with installed Chrome through CHROMIUM_EXECUTABLE_PATH. Earlier results below are historical.

# cf120 verification

Run npm test for 926 automated assertions. Run node tests/resupply-browser.mjs for 31 targeted browser assertions, and npm run test:browser for the two-player engagement scenario. Both browser scenarios passed using installed Chrome with CHROMIUM_EXECUTABLE_PATH configured. Inspect Release_Notes_cf120.md for exact scope and limitations. Earlier entries below are historical.

# cf117 quantity verification

`npm test` now includes `equipment-counts.mjs`: all 21 verified quantities, distinct copies, AP/resource preservation, saved dropped copies and unchanged special cases. Total: 859 assertions passed.

Run `node tests/saber-counts-browser.mjs` with Playwright available and `CHROMIUM_EXECUTABLE_PATH` pointing to Chrome if needed. Passed 193 assertions across all 12 increased entries at desktop and phone-landscape sizes. This result is specific to the equipment quantity scenario; historical engagement-browser limitations below remain separate.

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

## cf124 current verification

The earlier browser limitations above are historical. Current checks run using installed Chrome, Playwright and the production room's local in-memory adapter. See `Release_Notes_cf124.md` for the complete current validation and limits.

`npm run test:infantry:browser` checks all three infantry tabs at 720×310 and 600×280 mouse viewports and 667×375 and 844×390 touch viewports. It verifies full-width thin tabs, the original full-page soldier layout, unobstructed action centers, both soldier groups, movement/undo, visible challenge squads, last-row selections and matchup controls. `npm run test:mobile` checks the broader phone layout and `npm run test:layout` covers all 66 unit sheets. Use `CODEX_PRIMARY_RUNTIME_NODE_MODULES` for the directory containing Playwright and `CHROMIUM_EXECUTABLE_PATH` for an installed Chromium/Chrome binary.
