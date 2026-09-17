# Engagement board handoff — cf100 implementation complete, visual check pending

Continue from **cf100**, in `gunpla-battle-cf-cf100.zip`. The ZIP has `public/`, `src/`, and `wrangler.toml` directly at its root. Do not rebuild the board from the cf99 plan below.

Next: run `npm test`, then follow `tests/README.md` to install Chromium and run `npm run test:browser`. Review desktop and phone screenshots, fix any visual issues, and play a full two-device game. The Playwright scenario has not yet run because Chromium was unavailable and its download timed out. The live Cloudflare Worker has not been deployed.

The build-bump helper is now included: `python3 bump.py cf101` for the next change.


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
