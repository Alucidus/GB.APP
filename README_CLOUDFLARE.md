# Gunpla Battle — Cloudflare version (build cf59)

This is the full app (solo tracker + team multiplayer). It runs on **Cloudflare Workers**, with a **Durable Object "room" per battle session**.

**How it syncs:** devices keep a **live connection** to their room. When anything changes, the room tells every device at once, so there's no constant polling. The Netlify MP site keeps working until you switch over.

## What's in this folder

```
wrangler.toml      Cloudflare settings: Worker name, the app folder, the room class
package.json       installs Wrangler (Cloudflare's deploy tool) during the build
package-lock.json
src/index.js       the Worker + BattleRoom (sessions, leaders, locks, deliveries)
public/            the app (index.html, images, service worker)
.gitignore
```

## One-time setup

1. **Upload the files.** Put the **contents** of this folder into your new GitHub repository, at the top level. Don't upload `node_modules`; the `.gitignore` already excludes it.
2. **Connect the repository.** In the Cloudflare dashboard, go to **Workers & Pages → Create → Import a repository**. Connect GitHub if asked, then pick the new repository.
3. **Build settings:**
   - **Project / Worker name:** `gunpla-battle`. It **must match** `name` in `wrangler.toml`. If you'd like a different name, tell me and I'll change the file.
   - **Build command:** leave empty.
   - **Deploy command:** `npx wrangler deploy` (the default).
   - **Root directory:** `/`.
4. **Deploy.** Wait until the deployment shows **Success**. Cloudflare gives it a free address ending in `.workers.dev`, and you can test there first.
5. **Add your domain.** Open the Worker → **Settings → Domains & Routes → Add → Custom domain**, and enter your domain (e.g. `play.yourdomain.com`, or the domain itself). Cloudflare sets up the certificate automatically.
6. **Plan:** the Free plan includes SQLite-backed Durable Objects, which this app uses, so you can start there. The Workers Paid plan (about $5 a month) raises the limits if you ever need more.
7. **Spending alert:** add one under **Manage account → Billing → Notifications**, if you're on Paid.

## Updating later

1. **Upload the changed files** to GitHub and commit. Cloudflare deploys automatically.
2. **Wait for the deploy.** In the Worker's **Deployments** tab, wait for **Success**.
3. **Reopen the app** on each device and check the build number on the main menu.

**Running sessions survive updates.** Connected devices drop for a moment and reconnect by themselves.

## Everyone on the same build

**Why it matters:** after uploading an update, every device must be on the **same build** (shown on the main menu). A device still showing an older build may not send turn changes.
- **Updating a device:** close the app completely and reopen it, or pull down to refresh in the browser.
- **Lobby check:** the lobby shows each player's build and warns when they differ.
- **Stuck turn:** if a turn ever sticks, the **host** can tap **"Host: give the turn to the …"** on the turn box.

## Checking it works

1. **Open the timing panel:** create a session, then tap the **MP chip 5 times**.
2. **Read the panel:**
   - **data store** should say **cloudflare room**.
   - **live link** should say **open**, and **pushes** count up as other players do things.
   - **change arrived after** is the delay players feel. Expect a few hundredths of a second plus your network time.
3. **Try these on phones:**
   - **Lock the screen** for a minute, then unlock it.
   - **Switch Wi-Fi ↔ mobile data** mid-game.
   - **Turn airplane mode on and off.**

   Each time, the **live link** should return to **open** and the board should catch up.

## If something goes wrong

- **Logs:** open the Worker → **Observability / Logs** to see errors.
- **Rolling back:** in **Deployments**, you can roll back to an earlier version.
- **Can't create a session:** check that the deploy succeeded, and that `wrangler.toml` was uploaded to the top level of the repository.

## Build history

| Build | Changed files | What changed |
|---|---|---|
| cf1 | everything | First Cloudflare version: live rooms, instant pushes, reconnection |
| cf2 | `src/index.js`, `public/index.html`, `public/sw.js` | Over-budget teams ask the **host** to raise the DP limit (Accept / Decline pop-up); a raise applies to **both teams** |
| cf3 | `public/index.html`, `public/sw.js` | Your team's roster shows **who has each sheet open** (coloured tag + outline per player) |
| cf4 | `src/index.js`, `public/index.html`, `public/sw.js` | **Official turn order** kept by the room (only the active team can end its turn; the other team waits; out-of-step devices correct themselves); **no flicker** returning from a sheet (redraws only when something changed) |
| cf5 | `public/index.html`, `public/sw.js`, **new** `public/img/ship-musai.webp`, `ship-salamis.webp`, `ship-rewloola.webp`, `ship-racailum.webp` | **Warships**: Musai, Salamis Kai, Rewloola, Ra Cailum — new ship sheet (Canva layout, code-drawn), tinted wireframes, rings for Hull / Bridge / Thrusters / weapon systems, weapons list, Crew / AP / Movement, abilities (launch, dock, Damage Control, base module, decoys); ship rules applied automatically |
| cf6 | `src/index.js`, `public/index.html`, `public/sw.js` | **Stuck turn fix**: the room also passes the turn when the active team's save shows it ended (covers devices on older builds); lobby shows every device's build and warns on a mismatch; waiting message names a leader on another build; **host button** to give the turn to a team; safer handling of a refused turn change |
| cf7 | `public/index.html`, `public/sw.js`, **new** `public/img/portraits/ship-musai.webp`, `ship-salamis.webp`, `ship-rewloola.webp`, `ship-racailum.webp` | **Roster tabs** (Mobile suits · Ships · Ground units); **grand warship picker** cards with the new ship photos; Ground units **under construction** notice; ship photos on roster rows and the ship sheet dial; fix: the unit list stays in columns after adding a unit |
| cf8 | `public/index.html`, `public/sw.js` | **Carriers**: Confirm team → **Load your carriers** (capacity rule, auto-load); passengers greyed on the roster (⚓ ABOARD); **Launch** picker (catapult bonus: +10cm/AP, may attack — purple buff on the suit sheet); **Dock** picker (aboard next turn); **Emergency Disembark** when a carrier is destroyed |
| cf9 | `public/index.html`, `public/sw.js` | Turn notice no longer flickers and is message-only; the **one** Start My Turn button turns **green and pulses** when it's your turn to start; fix: a leader's roster could be wiped if they added units / confirmed before the first sync after the battle started |
| cf10 | `public/img/portraits/ship-musai.webp`, `ship-rewloola.webp`, `public/index.html`, `public/sw.js` | Cleaner Musai and Rewloola portraits (build bump so devices fetch the new images) |
| cf11 | `public/index.html`, `public/sw.js` | Ship sheets: **MOVE** button (1 AP per move, undo, halved / straight-ahead / immobilised handled); Crew / AP / Movement labels moved **above** their boxes |
| cf12 | `public/index.html`, `public/sw.js` | Ship rules: missile launchers / barrage have a **1 turn cooldown**; every gun that can shoot 2 targets is limited to **1 target at half system HP (10 or less)** — shown as an amber 1 TARGET flag |
| cf13 | `public/index.html`, `public/sw.js` | Carriers: **several launches per turn** (1 AP each, ↶ undoes the latest); a suit launched this turn **can't dock** that turn. **☢ nuke button** on every sheet (Anti-Ship Missile / Atomic Bazooka, pick the distance: suits 15/10/5 to all 6; warships 40 Hull + Bridge & Thrusters disabled / 25 / 10). Fix: no thrusters shows immobilised even with the Bridge down |
| cf14 | `public/index.html`, `public/sw.js` | Two-target guns at half HP **fire once** (12 ×1 / 5 ×1, no stacking); **Anti-Air Array works without the Bridge**; ☢ button simplified to "caught in a nuclear blast" — one table for every nuke (suits 15/10/5 to all 6, ships 40 + Bridge & Thrusters / 25 / 10 Hull) |
| cf15 | `public/index.html`, `public/sw.js` | Fix: a mobile suit sheet's circles / MOVE / DODGE / stats no longer stay on screen when switching to a ship sheet; ship MOVE button centred under the Movement box (undo sits beside it) |
| cf16 | `public/index.html`, `public/sw.js` | **Bridge HIT button** beside the Bridge ring (one tap per attack: −2 crew, −3 next turn; ↶ undo; pulses amber when the Bridge lost HP but no hit is recorded) — the ring now only changes HP. **# chip** on the damage bar to type any amount (e.g. 14), on every sheet |
| cf17 | `public/index.html`, `public/sw.js` | **New landing page**: PLAY ONLINE (top, recommended, shows a live session) / PLAY OFFLINE (→ faction menu); hangar doors on every menu route; lobby teams headed by the faction cards (tap to join); offline menu's Multiplayer shortcut → Main menu |
| cf18 | `public/index.html`, `public/sw.js`, **new** `public/img/lobby-bg.webp` | **Lobby on the two-hangar art**: Federation panel on the blue half, Spacenoid on the red half (tap to join), your side lit / the other dimmed, session code on the centre pillar, controls in a bottom dock; sign-in on a glass panel; phone layouts |
| cf19 | `public/index.html`, `public/sw.js`, `public/img/lobby-bg.webp` (updated art) | Lobby pass 2: everything centred (Ready, host settings, Start, buttons), VS pillar with player counts, **team-pick animation** (side light sweep, name banner, panel lock-on brackets), idle scan lines, fits the screen without scrolling |
| cf20 | `public/index.html`, `public/sw.js` | PLAY ONLINE card: blue / red split instead of purple (outline, glow, RECOMMENDED tag) |
| cf21 | `public/index.html`, `public/sw.js` | Fix: PLAY ONLINE card background restored (cf20's colour wash removed) — thin blue left / red right edge glow only |
| cf22 | `public/index.html`, `public/sw.js` | PLAY ONLINE card uses the two-hangar art as one seamless background (no misaligned image seam); lobby's dark bottom band now reaches both screen edges and the bottom (no bright gaps) |
| cf23 | `public/index.html`, `public/sw.js` | Lobby: picking Federation no longer lays a blue wash over the (already bright) left half — it stays crisp, only the Spacenoid half dims; the Spacenoid red glow is unchanged |
| cf24 | `public/index.html`, `public/sw.js` | Fix: Start My Turn now turns fully green on the Spacenoid side too (a more specific Spacenoid red rule was overriding the fill) |
| cf25 | `public/index.html`, `public/sw.js` | **Turns start automatically**: when the other team ends its turn, the leader's device starts yours (full start-of-turn upkeep) and everyone gets a green "your turn has started" notice; if a teammate still has a sheet open it waits and names them. Fix: undoing a turn start no longer counts as ending the turn (it used to hand the turn to the other team) |
| cf26 | `public/index.html`, `public/sw.js`, **new folder** `public/img/ground/` (32 images) | **Ground units, stage 1**: Ground Units tab with vehicle cards (free, per-type caps + 8-vehicle cap); Tank / Car / Helicopter / Jet / Transport Ship sheets (tinted wireframes, HP + Armor rings, OVERMAP/GROUND weapons with cooldowns and Bombing/Strafe charges, Fire/Air Support target-effect tables, AP / Movement / Dodge, MOVE, Hide Stance, cargo, objective, targeting, respawn) |
| cf27 | `public/index.html`, `public/sw.js` | Fix: the round portrait badge on ship and ground-vehicle sheets used the faded "no portrait yet" style (30% opacity + scan lines) — pictures now show at full strength (was nearly invisible on Spacenoid sheets) |
| cf28 | `public/index.html`, `public/sw.js` | Ship and ground-vehicle health bubbles: numbers centred in the white bubble (current value large, "/max" small underneath); three-digit hulls fit |
| cf29 | `public/index.html`, `public/sw.js` | **STANCE button** on every sheet (beside TABLES): suits Defense / Overwatch / Focus / Boost / Peek & Shoot (+ Stealth for stealth units); warships and all vehicles Boost; one stance at a time, Stealth never combines; effects applied (Boost +10cm & attack lock, Focus no Dodge, durations), stance tags on roster + enemy panel. Tank Fire Support has no cooldown; Tank/Car lose Hide; colour wheel for duplicate ground units |
| cf30 | `public/index.html`, `public/sw.js` | STANCE button restyled to match TABLES exactly (same outline/fill layers, size, row); TABLES + STANCE now share one dock plate mirroring DONE + ROSTER (equal gap and margins); active stance keeps the same shape in purple; decorative stripes moved clear |
| cf31 | `public/index.html`, `public/sw.js` | **DONE in the enemy turn = yellow tally** ("damage counted so far"): roster marks, sheet DONE button, turn-box counter and hint; a counted unit that loses health again clears its mark and shows ↻ RE-CHECK until DONE is tapped again; repairs don't clear it; marks reset every turn and sync live |
| cf32 | `public/index.html`, `public/sw.js` | Enemy-turn sheet button now reads **DAMAGE COUNTED** (two lines, with the tally); hint and messages use the same wording |
| cf33 | `src/index.js`, `public/index.html`, `public/sw.js` | **End-turn requests**: if the other team hasn't marked every unit that can take damage as DAMAGE COUNTED, End My Turn becomes a request (waiting count + Cancel); it passes automatically once all are counted, or when the defending leader taps **Accept now**. **Pass leadership** (turn box, or 'make leader' in the lobby) |
| cf34 | `public/index.html`, `public/sw.js` | **Infantry Squads** (up to 4, free): 3-tab sheet — **Overmap** (squad health = living soldiers with a who-falls picker, AP, Hide, Coordinated Strike), **8 Soldiers** (HP / Kevlar / shields / swaps / items / KIA), **Quick Resolve** (rounds, firepower & suppression, item charges, blind call + reveal with the counter triangle, margin / volley tables, optional simulated dice, Objective Clash, Forced Re-Engagement, new segment / engagement). **Squads ride in vehicles** (Car 1, Heli 1, Transport 2): load step at Confirm, embark / disembark, Emergency Disembark when the vehicle is destroyed. Fix: ☢ on vehicles / squads |
| cf35 | `public/index.html`, `public/sw.js` | 8 Soldiers tab rebuilt for touch: big tap bubbles (HP, Kevlar, shield Armor / HP) that apply the chosen DMG amount, large item and swap buttons, 2-column scrolling grid on phones. Ground Units tab: prominent vehicle-limit meter (8-slot bar) + per-type limit chips |
| cf36 | `public/index.html`, `public/sw.js` | 8 Soldiers tab split into two pages of four (Riflemen & MG · Specialists) with page buttons showing faces and survivors; tall cards with large soldier art, role tag, KIA stamp, name bar, bubbles and gear buttons — no scrolling |
| cf37 | `public/index.html`, `public/sw.js` | Soldier cards v3: AP bubble (3, refills each turn); MOVE (1 AP) / DODGE (free, blast 4+) / FIRE (current weapon's AP, uses Rocket charges) with counters + undo; ⇄ weapon button = switch (1 AP) + full weapon list with thrown items (1 AP each); per-soldier stance corner (Overwatch 1 AP, Peek & Shoot, Defense 10cm, Recon Stealth); ⓘ GROUND RULES panel (Section 13.6 / 13.7) |
| cf38 | `public/index.html`, `public/sw.js` | Soldier cards: DODGE button removed (the blast-dodge rule stays in ⓘ GROUND RULES); MOVE and FIRE are now two large buttons |
| cf39 | `public/index.html`, `public/sw.js` | Soldier cards: "BLAST DODGE 4+" reminder under MOVE / FIRE (tooltip: Rockets and Bombing Runs can't be dodged; bullets never) |
| cf40 | `public/index.html`, `public/sw.js` | Squad sheet on phones: Overmap and Quick Resolve columns always stay side by side (no stacking that pushed FIRE off-screen); Squad Health portraits in a larger 4 × 2 grid with heads fully visible |
| cf41 | `public/index.html`, `public/sw.js` | Squad sheet: MOVE now sits under FIRE in the Coordinated Strike card (same size, with undo). 8 Soldiers and Quick Resolve hide the unit info panel and use the freed space for bigger parts; shield units show their five bubbles in two rows (AP · HP · Kevlar / Armor · Shield) so nothing is cut off on phones |
| cf42 | `public/index.html`, `public/sw.js` | Help sentence under the sheet removed; the HEAD = KILL tag removed; new **?** button beside DONE opens a "how this sheet works" guide for the open unit type (suit / ship / vehicle / squad), including the kill location |
| cf43 | `public/index.html`, `public/sw.js` | Soldier cards: stat **bars** on the left of the art (AP · HP · Kevlar, + Armor · Shield) replace the bubbles; tap a bar to select it → ▲ ▼ − + ✓ strip (AP ±1; health bars ± the DMG amount); every soldier's art is the same size |
| cf44 | `public/index.html`, `public/sw.js` | **Sheets fit the screen** (16:9 sheet sized to the space left by the top bar and timeline — no scrolling, centred on wide screens); **one-row top bar on phones**; **bigger mobile suit tables** (taller Abilities / Weapons rows, larger text and tap targets); larger ship / vehicle table text |
| cf45 | `public/index.html`, `public/sw.js` | Squad sheet: ⓘ GROUND RULES is now a full-size button centred in the bottom row on its own plate (all three tabs); soldier cards get the freed height |
| cf46 | `public/index.html`, `public/sw.js` | In-sheet ROSTER picker shows unit status: grouped (Mobile suits / Ships / Ground units), portraits, ⚓ ABOARD · carrier (greyed, "opens the …"), LAUNCHED / DOCKING, stance, ✓ DONE or counted tally, ↻ RE-CHECK, who has the sheet open, OPEN NOW, destroyed |
| cf47 | `public/index.html`, `public/sw.js` | Fix: launching, docking and decoys only on your own turn (cells show — in the enemy turn); MOVE buttons on suit, ship, vehicle and soldier sheets no longer spend AP during the enemy turn |
| cf48 | `public/index.html`, `public/sw.js`, **new** `public/img/menu2-bg.webp`, `menu2-gundam.webp`, `menu2-zaku.webp`, `menu2-clash.webp`, `menu2-logo.webp` | **New landing art** in layers (background + separate logo). **PLAY ONLINE clash animation**: the Gundam and Zaku charge in from the sides, blue-red clash with flash, shockwave and shake, white-out into the lobby (~2s); SKIP (or tap) from the second time; synthesized whoosh + clash sound with a 🔊 / 🔇 toggle; reduced-motion devices and returning to a live session use the quick transition |
| cf49 | `public/index.html`, `public/sw.js` | Clash animation v2: the logo leaves at the start; after the impact the view zooms into the clash (≈4.4×, brightening) and fades to white leaving only the logo, then the lobby fades in (~3.5s; SKIP from the second time) |
| cf50 | `public/index.html`, `public/sw.js` | Clash animation v3: harder zoom (×9 in 0.75s, accelerating, blur + blow-out); the white clears to the empty background with the logo as the hero, then the lobby fades in (~3.8s) |
| cf51 | `public/index.html`, `public/sw.js`, `public/img/menu2-clash.webp` (replaced — sharper 2600px from the designer's upscale) | Clash animation: blue / red light layer under the burst (no hard edge to the light); the end logo's lighting now animates smoothly (no glitch) |
| cf52 | `public/index.html`, `public/sw.js` | Clash animation: sound removed (and the 🔊 button); the shake now moves an oversized scene (12% larger than the screen) so no black bars appear; the landing and ending backgrounds use the same slight zoom so nothing jumps |
| cf53 | `src/index.js`, `public/index.html`, `public/sw.js` | **Online Firefight** (Quick Resolve over the link): challenge an enemy squad from the squad's Quick Resolve tab; the enemy team gets an Accept / Decline banner; choose Physical dice or Roll for me (the other side must agree — the room rolls both pools); each round both players pick Flashbang / Smoke / Grenade / none blind — picks stay on the room server until both lock — then a 3-2-1 countdown, reveal, and effect animations on the receiving screen; effects (and the margin table with rolled dice) apply to each player's own squad; READY for the next round; after round 4: Objective Clash (rolled by the room), new segment, Forced Re-Engagement, end. Pause hands the fight to any teammate (Resume). ⚔ FIREFIGHT tags on roster and enemy panel |
| cf54 | `public/index.html`, `public/sw.js`, **new** `public/img/m3-base.webp`, `m3-emblem.webp`, `m3-ships-l.webp`, `m3-ships-r.webp`, `m3-rocks.webp`, `m3-fg.webp` | **Layered landing scene**: depth parallax (mouse on desktop, drag on phones with spring-back, phone tilt — iPhones ask once), fleets slowly advancing on each other, floating asteroids, slow space zoom, twinkling stars, pulsing emblem, distant explosion flashes, rising embers; lite mode on low-memory devices; still image with reduced motion. The PLAY ONLINE clash now plays over the live scene and flies through it (front layers rush past fastest) |
| cf55 | `public/index.html`, `public/sw.js` | The offline faction menu uses the same layered, parallax scene and separate logo as the landing page (one shared motion loop for whichever menu is showing) |
| cf56 | `src/index.js`, `public/index.html`, `public/sw.js` | Quick Resolve tab rebuilt around the online firefight (the old one-device board is removed): challenge / open card, round guide, margin table. Clash screen: dice are rolled AFTER the item reveal (Smoke clears this roll's set-aside dice; the server rolls then in rolled mode); big 'ROLL N DICE NOW' box with the breakdown and a plain 'you were flashed — physically move N dice away' instruction; NEXT ROUND box (flash + your 1s / margin suppression → dice next round) |
| cf57 | `src/index.js`, `public/index.html`, `public/sw.js` | Flashbang now removes 3 dice from the enemy's roll THIS round (server rolls accordingly; Smoke still cancels it). Physical dice: '📋 LOST THIS ROUND? PICK THE MARGIN' opens the margin table (incl. enemy Perfect Volley) and applies casualties + set-aside dice; the next-round box counts your 1s + margin. Rolled dice: highlighted margin table with both totals. Reveal cards flip only once |
| cf58 | `public/index.html`, `public/sw.js` | Firefight screen: flash / smoke / explosion effects play on their own layer (adjusting your 1s can't cut them short or replay them); a redraw during the 3-2-1 countdown keeps the current number |
| cf59 | `public/index.html`, `public/sw.js`, **new** `public/img/m4-far-fed.webp`, `m4-far-zeon.webp`, `m4-near-fed.webp`, `m4-near-zeon.webp`, **replaced** `public/img/menu2-bg.webp`; **delete** `public/img/m3-ships-l.webp` and `m3-ships-r.webp` | Menu scene uses the designer's new ships: 9 ships cut out and arranged as far and near layers per fleet (Federation left, Zeon right, facing each other around the emblem), each with its own parallax depth and drift; the clash fly-through and the end background use them too |
