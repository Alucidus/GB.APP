# Gunpla Battles — cf115

Added a visible footer disclaimer to the main menu: "Unofficial fan project for personal use. We do not own the Gundam IP. Gundam and related names, characters, designs and artwork belong to their respective rights holders. This project is not affiliated with or endorsed by them."

Checked rendering in Chrome at desktop, phone landscape and phone portrait sizes; inspected phone screenshots. This is a menu text/style change. Earlier equipment fixes through cf114 are included. Client version, asset URLs and service-worker cache are cf115. No deployment performed.

Up next: user review of the equipment UI.

Latest package: gunpla-battle-cf-cf115.zip. Older entries below are historical.

# Gunpla Battles — cf114

Moved the mobile-suit right-arm HP label to the right of its bubble and the left-arm HP label to the left of its bubble, aligned with the bubble centres. Equipment labels remain below the bubbles. Includes cf113's faction-themed in-game swap confirmation and cf112's violet/right and gold/left equipment colours.

Verification: 165 real-browser equipment assertions passed across both faction themes at desktop and phone-landscape sizes. Inspected normal-sheet screenshots at both sizes to verify HP label placement. No gameplay rules changed. Build, asset URLs and service-worker cache are cf114. No deployment performed.

Up next: user review of the equipment UI.

Latest package: gunpla-battle-cf-cf114.zip. Older notes below are historical.

# Gunpla Battles — cf113

Equipment swaps now use the existing faction-themed in-game picker instead of a browser confirm dialog. The dialog lists the weapons returning to storage, the incoming weapon and arm, the equip cost and available AP. Cancel is initially focused; Escape and backdrop dismissal cancel without spending AP. Tab stays within the two actions.

Swap revalidates ownership, turn, equipment and resources. If the loadout or turn changed while the warning was open, a new review is required; invalid changes are rejected. Empty-hand assignments keep the direct flow. Violet/right and gold/left colours from cf112 are retained.

Verification: 165 real-browser assertions passed across both factions at desktop and phone-landscape sizes, including cancellation, Escape, acceptance, changed-state reconfirmation, no browser dialogs and AP preservation. 71 UI smoke checks passed. Dialog screenshots inspected at both sizes. No live Cloudflare testing or deployment performed. Build/asset/cache versions are cf113.

Up next: user review of the equipment feature. Other roadmap work remains pending.

Latest package: gunpla-battle-cf-cf113.zip. Older notes below are historical.

# Gunpla Battles — cf112

Small colour correction to cf111: cyan remains the selectable-control colour. Right-hand equipment now uses violet (#c4a1ff); left-hand equipment remains gold. Matching arm outlines, prompts, labels, held weapon rows and both-hand split highlights follow these colours. R/L labels and the white selection outline remain.

141 real-browser assertions passed across both faction themes at desktop and phone-landscape sizes; the phone screenshot was visually checked. No gameplay rules changed. Build labels, asset URLs and service-worker cache are cf112 to prevent cached cf111 colours. No deployment performed.

Up next: user review of the cf111 equipment features. Earlier roadmap and unresolved work remain in the handoff.

Latest package: gunpla-battle-cf-cf112.zip. The following cf111 and older entries are historical.

# App handoff — cf111

Latest application: gunpla-battle-cf-cf111.zip. Read Release_Notes_cf111.md for changes and current verification. The original complete cf110 handoff and reference assets remain in the parent bundle.

## Up next

Await the user's next milestone; the recorded roadmap begins with the RX-78-2, then F91 saber quantity review. Counts and campaign work were not changed in cf111. Deployment is only on request; live Cloudflare multi-device validation remains pending.

# Gunpla Battles — cf111

## Equipment clarity fixes

- Enlarged the highlighted equipment banner. Selected weapons show their name, prominent equip AP cost, available AP and the next action. Setup explicitly shows 0 AP.
- Equipment mode uses cyan for the right hand and gold for the left. Held weapon rows match their arm; a row held in both hands carries both colours. The selected row also has a white outline.
- Restored persistent R/L equipment labels beside the arm HP bubbles, below the numeric HP area. Empty and lost arms are identified.
- Replacing held equipment asks for confirmation and lists affected arms/weapons and the incoming weapon's AP cost. Cancel leaves equipment, AP, HP, shields and cooldowns unchanged. Empty-hand assignments do not require confirmation. Preview uses the existing equipment rules, including both-hand/exclusive systems.
- Client build, asset URLs and service-worker cache are synchronized to cf111.
- Made the existing local test server and version-bump utility compatible with Windows path separators and UTF-8 files.

## Verification actually run

508 automated assertions passed: 219 engagement/server, 218 equipment, 71 UI smoke.
141 real Chrome browser assertions passed across Federation/Spacenoid themes at 1400x1000 and 844x390. Coverage includes swap cancellation/confirmation, preserved state, empty-hand assignment, matching arm/row colours, dual-copy assignment, stow, first-turn firing and no page errors. Desktop and phone-landscape screenshots inspected.

No deployment or live Cloudflare multi-device test was performed. The broader engagement browser scenario was not run in this build.

## Decisions and next work

This release implements only the user's requested equipment presentation fixes. Equipment rules, AP costs and physical weapon quantities are unchanged. Earlier cf109 removal of arm equipment labels is superseded by this request.
The attached complete handoff remains planning/reference context. Its proposed future work was not executed as part of cf111. Next planned milestone remains the one-unit-at-a-time saber quantity review (RX-78-2, then F91), subject to the user's next request.

---
Historical handoff follows; current cf111 notes take precedence.

# App handoff — cf110

Continue from **cf110**, in `gunpla-battle-cf-cf110.zip`. The ZIP has `public/`, `src/`, and `wrangler.toml` directly at its root. Do not rebuild the board from the cf99 plan below.

Next: deploy only when requested, then play a full two-device Cloudflare game. Equipment now has real Chromium coverage (109 assertions) for desktop and phone landscape. The earlier engagement browser scenario and live deployment remain separate pending checks. Run `npm test` and `npm run test:equipment:browser`; set CHROMIUM_EXECUTABLE_PATH if using a separately installed Chromium.

The build-bump helper is now included: `python3 bump.py cf111` for the next change.


## cf110 — On-sheet equipment selection

## Equipment mode on the sheet

- EQUIP now enters on-sheet selection rather than opening the equipment manager. Handheld weapon rows and intact usable arms receive cyan outlines.
- Choose a weapon, then an arm. The prompt shows the equip/switch cost before assigning. Selecting a weapon alone spends no AP and fires nothing.
- After assigning a handheld weapon, equipment mode remains open. Select another weapon, or the same saber profile again when another copy is available, then choose its arm.
- EQUIP becomes DONE while selecting. DONE leaves equipment mode and keeps completed assignments; it does not end the unit’s turn. STOW switches to the existing quick arm-based stowing flow.
- Weapon rows always show AP values. Ranged rows show firing AP; melee rows show equip AP, including free daggers/integrated melee. Stored ranged weapon costs stay readable. Firing a stored weapon explains how to equip it instead of silently entering assignment.
- Outside equipment mode, weapon names still open their information, and equipped ranged AP controls fire normally. During selection, row clicks select equipment, and arm clicks cannot damage HP.
- MORE in the selection prompt opens the retained manager for shield mounts, dropped-item recovery, virtual weapon profiles, special combinations, GN Sword modes and melee segments. Closing it clears selection overlays.
- Existing AP validation, arm loss, cooldowns, ownership restrictions, segment locks, forearm shields and Phenex DE behavior are retained.

## Deliberately unchanged

All beam-saber copy counts are unchanged from cf109. The sourced quantity review remains a proposal for the next one-by-one discussion, including RX-78-2 and F91. This build retains the cf109 melee bonuses (including Epyon +4 for both profiles), previous agreed profiles and rework markings.

## Verification

508 automated assertions passed: 219 engagement, 218 equipment-model and 71 DOM smoke checks. The updated Chromium browser scenario passed **109 assertions** across both faction themes, desktop and phone landscape. It checks first-turn controls, unchanged AP text, no firing/AP spend on selection, two-copy assignment, HP preservation, DONE, STOW/cancel, shield/AP preservation, stored-weapon firing rejection, access to MORE, overlay cleanup and absence of page errors. Desktop and phone screenshots were inspected.

Client asset URLs, build label and service-worker cache are synchronized to cf110. Deploy the whole package and refresh all devices together. **No deployment was performed.** Live Cloudflare multi-device testing remains separate from local browser checks.


## cf109 — Equip/stow UX and remaining melee decisions

## Equipment controls

- Weapon-row buttons now say **EQUIP**, without a 0/1/2 suffix. Equip costs remain in weapon information and equipment cards.
- Handheld melee keeps its EQUIP control after assigning the first copy: tap again, then the other arm, for units carrying two copies. Each weapon charges its own existing equip cost.
- Added **STOW** beside EQUIP, matching TABLES/STANCE styling. Tap STOW, then a cyan-highlighted occupied arm to put its weapon away. No extra menu or AP cost; a two-handed weapon clears both hand references. Forearm shields stay mounted. Cancel returns to the sheet; melee segment and ownership restrictions still apply.
- Removed weapon text beneath arm bubbles so HP labels remain clear. Equipped rows retain R/L markers and highlighting.
- Both faction themes use cyan arm-selection outlines. Equipment cards remain scrollable on smaller screens.
- New units retain their main ranged weapon in the right hand and available shield on its separate mount (two-handed mains occupy both hands). Existing loadouts are preserved.

## Newly agreed melee stats

| Unit / weapon | Roll bonus | Normal / critical | Existing range |
|---|---:|---|---|
| Epyon Beam Sword — standard | **+4** | 3/6 | 20cm |
| Epyon Beam Sword — FULL | **+4** | 5/10 | 30cm |
| Vidar Hunter Edges | **+0** | 2/4 | Adjacent |
| Master Gundam Master Cloth | **+0** | 1/2 | 15cm |
| Destiny Palma Fiocina | **+0** | 2/4 | Adjacent |

Built-in melee has no roll bonus by default; explicit agreed exceptions remain: Darkness Finger +3, Dual Fang Blades +3 and Gouf Heat Rod +2. Epyon retains its 2 AP equip cost and Full Output activation requirement. Existing damage, cooldowns and mode costs remain unchanged. These decisions are also recorded in the rulebook.

Turn A joins Rising Freedom and Infinite Justice as **REWORK NEEDED**, excluded from equipment enforcement. Gundam Hammer remains unresolved. Phenex's saber equipment stays available; its remote DE system is unchanged.

## Verification and reported first-turn issue

508 automated assertions passed (219 engagement, 218 equipment rules, 71 DOM smoke). An additional **65 real Chromium browser assertions** passed at desktop and phone-landscape sizes across both faction themes: first-turn menu, AP firing, successive dual-saber assignment, stow/cancel, unchanged HP labels, shield and AP preservation, and no page errors. Desktop and phone screenshots were inspected.

The user reported that the initial switching/fire problem disappeared and suggested a version mismatch. First-turn controls worked in browser testing; the original transient failure was not reproduced, so a cache/version mismatch remains a possibility rather than a confirmed root cause. No speculative fire-rule change was made. Client assets and service-worker cache are all bumped to cf109; refresh all participating devices after deploying the complete build.

This package has not been deployed. Real Cloudflare multi-device testing remains pending. Campaign/resupply work is unchanged.


## cf108 — Equipment UI and approved melee profiles

## Equipment on the stat sheet

- EQUIP now sits beside STANCE and TABLES, using their exact shared dock-button styling, size and background treatment. The background dock extends to fit all three buttons. The separate equipment toolbar is removed.
- Every stored handheld weapon displays **EQUIP 0 / 1 / 2**. Tap it, then a valid arm HP bubble. This neither opens an intermediate menu nor reopens the equipment manager afterward. Equipped ranged weapons retain their normal Fire AP control; equipped melee weapons show READY. Tap the weapon name for full information.
- Equipped weapon rows have a subtle faction-coloured highlight and **[R]**, **[L]**, or **[R+L]** markers. Independent systems use **INT**, shield weapons **SH**, attachments **LINK**, and directly throwable systems **THROW**. Unavailable mounts are muted. These labels do not allocate integrated systems to hand slots.
- Each arm bubble has a short held-weapon label and a separate SH shield status. Forearm shields still do not consume a hand slot.
- During assignment, valid arms have a crisp **cyan outline for Spacenoid**, **white for Federation**, and **EQUIP HERE** labels. Other sheet elements are dimmed; their controls cannot apply damage during assignment. EQUIP becomes CANCEL. Reduced-motion preferences disable the outline animation. Invalid assignments (AP, damage, unavailable equipment, melee segment) are rejected before entering selection.
- The dock EQUIP button retains the full manager for shield mounts, recovery, stowing, special pairs, and melee segment tracking.

## Approved melee profiles

| Weapon | Roll bonus | Normal / critical | Equip AP | Charge |
|---|---:|---|---|---|
| Mk-II Heat Saber | +2 | 2/4 | 1 | 15cm |
| Rick Dom Heat Saber | +2 | 2/4 | 1 | 20cm |
| Gouf Heat Sword | +3 | 2/4 | 1 | 15cm |
| Nu Beam Saber | +4 | 3/6 | 2 | 20cm |
| Vidar Burst Saber | +4 | 3/6 | 2 | 15cm |
| Gerbera Straight | +3 | 2/4 | 1 | 15cm |
| Nightfall Pulse Blade | +3 | 2/4 | 1 | 15cm |
| Jiyan Dual Fang Blades | +3 | 2/4 | No switch | 15cm |
| Destiny Flash-Edge blade | +1 | 2/4 | **0** | 10cm |
| Astray BuCUE Head | +3 | 2/4 | 1 | 20cm |
| Gouf Heat Rod | +2 | 2/4 | No switch | 20cm |
| Master Darkness Finger | +3 | 2/4 | No switch | 15cm |

The generic melee table remains the baseline, with these approved custom profiles. Daggers remain **free to equip** despite the pasted table's old 1 AP entry. Flash-Edge throwing remains independent of held equipment. Heavy weapon draw costs remain 2 AP.

Removed Banshee Norn's unexplained **AA-DE Melee Mode** weapon row. Beam Saber, AA-DE Mega Cannon, Revolving Launcher and Beam Jutte defence remain. Save migration matches weapon counters by identity, so removing a row does not refresh the Magnum cooldown. Stale shot-undo entries tied to previous row indices are cleared when the weapon list changes.

## Verification and outstanding work

**499 automated checks pass:** 219 engagement checks, 209 equipment checks, and 71 UI smoke checks. Smoke tests execute all 50 mobile-suit sheets and exercise direct row selection, unchanged HP, AP charging, no intermediate/reopened picker, cancellation, labels, read-only protection and Banshee cooldown migration. They use a stub DOM, not a visual browser. Browser/device layout verification remains pending because Chromium is unavailable; no deployment was performed.

Unresolved custom melee profiles remain listed in Equipment_Audit_cf108.md; no new bonuses were invented for those weapons. Rising Freedom and Infinite Justice remain excluded pending reworks. Phenex's DE mechanics remain unchanged. Recovery still covers a unit's own dropped equipment; cross-unit battlefield-loot transfers, campaign features and resupply changes remain outside this release.


## cf107 — Mobile-suit equipment and melee reference

### Using it

Open **Weapons / Equip**, choose a weapon, then tap the highlighted **arm HP bubble** on the sheet. That tap assigns equipment; it does not apply damage. Cancel exits assignment mode. The summary shows both hands. Shields have separate forearm mounts and can be assigned through the same bubble flow. Before locking the roster, choose starting equipment for free.

### Implemented

- Equipment state persists in existing unit saves and multiplayer unit updates. Old saves receive the standard main-weapon loadout without spending AP. Opponent details show held equipment without revealing numerical resources.
- Ordinary equips cost 1 AP; listed heavy melee weapons cost 2 AP; dagger-type equips cost 0 AP; two ordinary sabers cost 1 AP each. Melee rows open equipment management and show READY when usable, rather than repeatedly charging draw AP.
- Two ordinary handheld guns are allowed, with −3 displayed on each affected attack; gun-plus-melee penalises the gun similarly. Integrated weapons remain unaffected. Snipers use both hands. Wing Zero's purpose-built Twin Buster retains its exception.
- Integrated, mounted, shield-linked, attached and handheld systems have distinct availability checks. Existing Fire AP costs, charge counters, cooldowns and undo remain in place. Fire and relevant special attacks reject unavailable equipment.
- Arm loss makes held equipment and its forearm shield unavailable. Recover your own dropped weapon/shield within 10cm for 1 AP. An empty surviving hand/mount equips immediately; otherwise the item returns to your usable list. Shield HP, cooldowns and charges are preserved. Repeated pickup is rejected. Recovery does not repair a destroyed shield.
- No switching while a manually marked melee segment is active. Use **Begin melee segment / End melee segment** in the picker. Exia parries refresh on a new segment, not by repeatedly changing pair. The special Dagger Guard still costs 2 AP; individual GN daggers are free to equip. Special matrix selection fills the actual hand slots and requires usable blades and arms.
- Melee weapon reference added to Tables, including the agreed Spear/Lance 30cm charge and free dagger equip. Legend's Beam Javelin follows the spear/lance reach profile. Known base melee bonuses appear beside weapon names, in popups, and in the equipment picker. Undefined custom bonuses are explicitly marked rather than invented; see Equipment_Audit_cf107.md.
- Phenex now supports equipping its Beam Sabers, including one per hand. Its existing DE weapon availability, remote lending and shield controls are retained. Rising Freedom and Infinite Justice are marked **REWORK NEEDED** and excluded from equipment enforcement.

### Catalogue decisions carried forward

Pale Rider's 180mm Cannon and F91's VSBR require equipping; VSBR modes share one equipment identity and retain their cooldown group. Nightfall's Songbird is integrated; Pulse Blade requires equipping. Astray's BuCUE Head is classified as melee and costs 1 AP to equip; its existing damage remains unchanged pending a defined critical/roll-bonus profile. Jiyan's Wolf-Ken/Tiger-Ken and Dual Fang Blades, and Master's Darkness Finger/Master Cloth, are independently usable. Gouf's forearm MG and Heat Rod need no switch; Heat Sword does. Epyon's Heat Rod depends on its shield. Shield missiles/cannons depend on an available shield.

Banshee's Revolving Launcher follows the equipped Magnum, and Beam Jutte eligibility ignores its firing cooldown. Sinanju-family Attachment Bazooka remains a temporary special attack with its existing AP/charges; it never creates a persistent combined weapon. Ordinary firing modes do not charge extra equip AP. Exia GN Sword retains its explicit 1 AP mode switch and cannot pair with another weapon. Destiny's Flash-Edge can be thrown without changing the loadout; its melee profile is separately selectable. Vidar's Hunter Edges and Destiny's Palma remain integrated.

### Validation and limits

195 equipment-rule assertions, 58 UI smoke checks and all 219 existing engagement assertions pass (472 total). The UI smoke test executes all 50 mobile-suit sheets using a stub DOM and tests arm selection, Fire, undo safety and read-only protection. It is not a visual browser test. Chromium was unavailable and its installation timed out, so desktop/mobile rendering and live two-device play still need on-device verification. No deployment was performed.

The app remains a tabletop tracker: range, physical dice and melee outcomes are resolved by players. Dual-wield modifiers are displayed for those rolls. This release automates recovery of the unit's **own** dropped equipment; transferring weapons between different units under the wider battlefield-loot rule is not implemented. Mount assignments for undocumented generic items use editable hand/forearm defaults; distinctive fixed systems retain explicit mappings. No general ammo counter was added. Campaign, pilot shop, personal-base automation and the proposed resupply/2-2-2 changes remain planned work.

## cf106 — Simple offline Quick Resolve tracker

Offline Quick Resolve now shows only the Flashbang, Smoke Grenade, and Grenade resource trackers. Tap an item to spend one, tap a used mark to restore one, and use **Resupplied** to refill the tracked supplies. Removed the online-session prompt and firefight workflow instructions from the offline tab; challenge controls are restricted to online play. Manual resource controls cannot change online supplies. Resupply logs now describe resupply rather than suggesting every engagement refills items.

Validation: all 219 existing automated assertions pass. Offline controls were checked for spending, restoration, empty supplies, refill, and online protection. Browser visual verification remains pending. Deploy the full project and refresh devices to cf106. No deployment was performed.

## cf105 — Fighter reminders and dice choice for every bout

When the opposing team confirms its next fighter, your team receives an in-app notification. Away from the engagement board, a persistent **Choose fighter** banner opens the pending selection. Repeated syncs do not repeat the notification; confirming clears it. If another teammate controls the fight, the banner identifies them instead of taking over.

Each new bout, including forced re-engagement, resets the previous dice selection. Choose **physical** or **rolled** again, with the opposing side confirming before play begins. The next-bout start banner now correctly labels ordinary bouts and prompts for dice choice.

219 automated assertions pass, including second-bout mode reset and agreement, forced-bout reset, reminders from both team perspectives, repeat-sync suppression, clearing, and teammate ownership. Browser visual verification remains pending. Deploy the full project including `src/index.js`, and refresh every device to cf105. No deployment was performed. Notifications are in-app; this update does not add background operating-system push notifications.

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
