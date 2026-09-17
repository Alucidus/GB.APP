# Engagement board handoff — cf104

Continue from **cf104**, in `gunpla-battle-cf-cf104.zip`. The ZIP has `public/`, `src/`, and `wrangler.toml` directly at its root. Do not rebuild the board from the cf99 plan below.

Next: run `npm test`, then follow `tests/README.md` to install Chromium and run `npm run test:browser`. Review desktop and phone screenshots, fix any visual issues, and play a full two-device game. The Playwright scenario has not yet run because Chromium was unavailable and its download timed out. The live Cloudflare Worker has not been deployed.

The build-bump helper is now included: `python3 bump.py cf105` for the next change.


## cf104 — Matchups inside the challenge roster

The initial challenge roster now includes an editable **Bout lineup**. Select the participating squads, set each attacker’s enemy matchup on that same screen, and send once. HP and carried-objective markers remain visible. Adding or removing squads keeps valid choices and repairs invalid ones; outnumbered defenders can be assigned to more than one bout.

The defender opens **Review challenge**, sees every proposed bout together using the same lineup component, adjusts their fighters if needed, and presses **Confirm challenge** once. The former sequential “Who meets their squad?” screen has been removed. Invitations store the proposed pairings; the server validates them and applies the defender’s final pairings in one acceptance.

200 automated assertions pass, covering proposed pairings, defender adjustments, invalid pairings, retained selections, and all matchup rows rendering together. Browser visual verification remains pending. Deploy the full project including `src/index.js`, and refresh every device to cf104. No deployment was performed.

## cf103 — Merge without losing survivors

Merging now tops up the healthiest selected squad to eight and leaves surplus soldiers in their original squads. Equal-health ties favour the squad currently open. Examples: **5 + 5 → 8 + 2**, **7 + 4 → 8 + 3**, **3 + 4 → 7**, and **3 + 3 + 3 → 8 + 1**. A full target is a no-op. The picker previews each squad’s resulting health.

Only genuinely empty donor squads leave the engagement. Living remnants retain their names, items, and next-bout eligibility. An objective stays with a surviving donor; it transfers to the receiving squad only if its former holder is emptied. Transferred soldiers retain their individual wounds and Kevlar; merging does not replenish squad item charges. The server rejects attempts to remove a donor that still has survivors.

190 automated assertions pass, including the user’s exact 5 + 5 example, three-squad overflow, full targets, wound preservation, and multiplayer updates retaining partial donors. Browser visual verification remains pending. Deploy the full cf103 project, including the server, and refresh all devices. No deployment was performed.

## cf102 — Both teams confirm the dice mode

Choosing Physical dice now sends a request to the other team. The requester sees “Waiting for their confirmation”; the other side sees **Confirm physical dice** or **Request rolled dice**. Requesting the alternative mode requires confirmation too. Rolled dice retains two-sided agreement. The server rejects self-confirmation and starting the round while the request is pending.

173 automated assertions pass, including the request, counteroffer, confirmation, and both UI perspectives. Browser visual verification remains pending because Chromium is unavailable. Deploy the full project, including `src/index.js`, and refresh both devices to cf102. No deployment was performed.

## cf101 — Matching artwork, objective picker, and repeated extraction counters

- Engagement board styling now follows the existing Gunpla kit UI: cut-corner panels, roster-style rows, faction emblems, existing infantry art, blue Federation and red/gold Spacenoid panels, and existing theme colors for controls. No new art downloads are required.
- The challenge squad picker shows the carried objective name on both teams, including on phones. Team identity is used when squad IDs overlap.
- **Designer rule change:** Smoke counters the latest Flashbang, not the entire extraction. The pursuing side can choose **Flash again**, spending another charge from any living engaged squad. Another Smoke is required to answer it. Continue until the pursuing side lets them go or the departing side stays to fight. The latter clears fighter confirmations. If no Flashbang remains, use **Let them go** to acknowledge the escape.
- The rulebook now describes this item exchange and removes the guaranteed-Smoke-escape wording. The ordinary queued Forced Re-Engagement counter remains a cancellation of that attempt; another attempt can be made with another available Flashbang through the existing Force a re-engagement action.
- Deploy the **whole project**, including `src/index.js`. The server, UI, stylesheet, and cache version changed; all devices should show **cf101**.

**Checks:** 160 automated assertions passed, including repeated Flash/Smoke responses, duplicate-action rejection, the turn gate during the exchange, and both teams’ objective markers. The existing two-browser Playwright scenario was updated but remains unrun because Chromium is unavailable in this environment. The user confirmed cf100’s functionality in play; cf101’s visual changes still need an on-device look. No deployment was performed.

## cf100 — Engagement board update

The end of a bout now shows one decision at a time: Objective Clash, then the engagement board, then a separate disengagement response or final result.

- Federation blue / Spacenoid red squad cards show health and the objective holder. Only your team's cards show remaining item icons.
- Each side selects and confirms its next fighter. Either side can un-confirm until the turn changes. The server blocks ending the turn until both confirm, including the older roster-save turn path. The selected bout starts with the existing next-turn banner system.
- Disengage works per squad. The holder leaving is an extraction; another squad leaving removes only that squad. Any engaged squad can supply the denying Flashbang or answering Smoke. Staying after a denied escape clears both confirmations.
- Edit roster supports adding, withdrawing through the response flow, and merging into the healthiest squad, capped at eight. Objective ownership follows the merge survivor. Items do not refill.
- End firefight and Forced Re-Engagement are under More. Forced Re-Engagement appears after the scheduled bouts are complete, or for a plain 1v1.
- Back to roster lets players use their other units while keeping their confirmation. Engagement squads remain pinned until released.

**Deployment:** upload the full cf100 project, including **`src/index.js`**, `public/app.js`, `public/app.css`, `public/index.html`, and `public/sw.js`. Both the server and client changed. Refresh every device and check **cf100** before starting a new game. No Cloudflare deployment was performed in this task.

**Validation:** 140 automated assertions passed using two player seats, the production room logic, and client rendering/bookkeeping checks. See `tests/README.md`. The two-device Playwright scenario is included but **browser visual testing is still pending**: Chromium was absent and its download timed out. Test desktop/phone layout and a full two-device game before release.

---

## Original cf99 specification (retained for reference)

# Handoff — build the engagement board (Mobile Suit Battles app)

## Paste this into a new chat

> Continue the Gunpla Battle app. Current build is **cf99**, packaged in `gunpla-battle-cf.zip`; unzip it and work from `msb-cf/` (`public/app.js`, `public/app.css`, `src/index.js`). Everything works — this task is **UI only**: rebuild the end-of-bout screen for firefight engagements, one decision per screen. Follow the plan in `Handoff_Engagement_Board.md`, build it in the four steps listed, test with two devices in Playwright, bump the build with `python3 bump.py cfNN`, then package the zip and update the setup guide and `Stat_Sheet_ToDo.md`.

## The problem
After a bout the screen stacks six panels at once (objective clash, its result, the break, the next bout, Forced Re-Engagement, End firefight). The designer can't tell what to do first. Nothing is broken — it's clutter.

## The agreed flow (one decision per screen)
1. **Objective Clash alone.** "Bout 1 of 2 complete — who secures 🚩 Car?", the HP + bonus box, We secured it / They secured it. Nothing else on screen.
2. **The engagement board (roster style, may fill the page).**
   - Both sides' squads as cards (Federation blue / Spacenoid red), 🚩 on the holder, health on every card.
   - **Your own** squads show items using the new icons in `public/img/items/` (`fed-fb/sm/gr`, `spa-fb/sm/gr`); the enemy's items stay hidden.
   - **Disengage** on each of your squads (the holder disengaging = the extraction).
   - **Edit roster** (bring a squad in, merge survivors, withdraw) — only during a break.
   - **Confirm fighter** for the next bout, with **Un-confirm** until the turn ends; the board says "Waiting for the <team>"; the turn can't end until both sides confirm; the bout starts at the **start of the next turn** (existing queued/banner system).
3. **Disengage flow.** The other side may deny with a Flashbang from **any** squad in the engagement; the leaver may answer with a Smoke. Success → single end screen ("They extracted with 🚩 Car"), engagement over, that side keeps the objective. Failure → back to the board to edit, then confirm fighters again.
4. **⋯ More menu** holds End firefight, and Forced Re-Engagement (only when no bouts remain, or in a plain 1 v 1). Remove the old stacked panels.

Wording: use "bout", not "segment".

## What already exists (don't rebuild)
- **Server ops** (`src/index.js`, `firefight()`): invite (with `aUids/bUids/obj`), accept (`pairs`), nextbout, setnext, extract, deny, smokeout, letgo, fighton, concede, engedit (withdraw/add/merge), counter, roll, claim, applied, objective.
- **Record shape:** `eng {aList, bList, obj, pairs, bout}`; `a`/`b` = the pair fighting now; `ext` = the extraction attempt; `secured` = who got away.
- **Client:** `ffWizard` (round steps, physical + roll-for-me), `ffMySquads`, `ffSpendPick`, `ffEditSquads`, `ffMergePick/ffMergeGo`, `ffNextSquad`, `ffNextBout`, `ffExtract/ffDeny/ffSmokeOut/ffLetGo/ffFightOn/ffConcede`, `objTagHTML/objHeld/objTagFor`, `.ffengbar` strip.
- **Where to edit:** `renderFF()`, the `f.state === "end"` branch (the `.ffoc`, `.ffbreak`, `.ffnext2` blocks) — that is the whole job.
- **Likely server addition:** a per-side "confirmed fighter" flag so the board can wait for both and block the turn end (today `nextbout` fires from one side).

## Rules that must stay true
- Items never refill; only riding a vehicle for a full turn resupplies (2 flashbangs / 1 smoke / 1 grenade).
- Any squad in the engagement can spend items during a break (that's the outnumbering advantage); only the two fighting squads use them during a bout.
- A bout is 4 rounds, then the clash; one bout per turn; waiting squads are pinned (no move/strike).
- The objective changes hands each clash and is only **secured** when someone gets away with it.
- Merging pools health up to 8 into the **healthiest** squad, which keeps its name.
- Challenges only on your own turn; the turn can't end mid-bout.

## Test scripts (in `/home/claude/cft/` in the old session; rewrite as needed)
`cf53_ff.py` (full firefight), plus ad-hoc ones for the queue, breaks, merge, forced re-engagement, counters and the objective marker. Two-device pattern: create session → both join → teams → rosters → challenge → play.
