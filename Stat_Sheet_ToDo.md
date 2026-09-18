# Current status — cf120

Completed: equipment quantity decisions, infantry Quick Resolve 2/2/2 and transport resupply. See Release_Notes_cf120.md for timing, migration and validation. Next milestone: personal-base and carrier repair services after user review. Historical entries below may describe older states.

# Mobile Suit Battles — To-Do List

## cf110 update

EQUIP now selects weapons and arms directly on the sheet; AP values remain visible, repeat assignments remain in equipment mode, DONE exits and MORE preserves advanced controls. 109 real-browser assertions pass. Beam-saber inventory corrections are pending the user’s one-by-one review; no copy counts changed in cf110.


## cf109 update

Delivered plain EQUIP labels, repeated dual-saber assignment, matching STOW dock button with cyan arm selection, clear HP labels, Epyon +4 (both profiles), built-in Hunter Edges/Master Cloth/Palma +0, and Turn A rework marking. Real browser checks pass on both themes, desktop and phone landscape. Transient first-turn failure was not reproduced; user reports it resolved. See Release_Notes_cf109.md.


## cf108 update

Equipment dock styling, direct weapon-to-arm assignment, row/bubble labels and approved melee profiles are implemented. Banshee AA-DE Melee Mode is removed. See Release_Notes_cf108.md and Equipment_Audit_cf108.md for current verification and remaining custom profiles.


## cf107 equipment status

Implemented: persistent hand equipment, forearm shield mounts, arm-bubble assignment, AP costs, Fire eligibility, own-equipment recovery and melee reference. See Release_Notes_cf107.md.

Remaining: browser/device verification; unspecified custom melee bonuses in Equipment_Audit_cf107.md; cross-unit battlefield weapon transfers; Rising Freedom and Infinite Justice reworks. Campaign, resupply timing and 2/2/2 are still pending.


## ✅ TOP PRIORITY — App fixes (all done by v40)

### ~~1. Spray and Pray for machine guns~~ ✅ DONE (v34)
*Built (v35 layout): a **Spray and Pray skill row** on each qualifying unit — **2 AP · "2 dmg · all 6"** (Zaku II, Gouf, Blue Destiny, Pixy), **3 AP · "MG · 3 dmg · all 6"** (Geara Zulu). Tap the AP to spend it; tap the name for the full rule. Zaku II's empty "—" row became Spray and Pray. The weapon popups point to the skill and keep a **Spray & Pray** line in their stats; the v34 badges were removed. Also: a **Machine Guns** tab under TABLES, and damage labels unified to **3d6×1** / **4d6×1** / **3d6×2/5**. Pixy's SMG and F91's MG popups say why they don't get it. Rulebook follow-up below still stands.*
*v35 also: saved games now keep each skill's counter **by name**, so adding or reordering skills no longer resets them; and text fitting measures the real text width, so values like "Melee 15cm" no longer show as "Melee 15…".*
The rule is unchanged in Rulebook Section 8, but the app has never shown it (only listed under TABLES → AP Costs). Add it to each qualifying weapon's popup, plus a **Machine Guns** tab under TABLES showing Burst Fire and Spray and Pray side by side.

*Rule: instead of a standard attack, 45° cone, 30cm long; every unit in the cone is a target (friend or foe); d6 per target by its distance — 4+ at 60cm+, 3+ at 30–60cm, 2+ under 30cm; normal Dodge/Block; a hit deals damage to all 6 locations; once per activation.*

| Unit | Weapon | Spray and Pray |
|---|---|---|
| Zaku II | Zaku Machine Gun | ✅ Ballistic — 2 dmg, 2 AP |
| Gouf | Forearm Machine Gun | ✅ Ballistic — 2 dmg, 2 AP |
| Blue Destiny Unit 1 | 100mm Machine Gun | ✅ Ballistic — 2 dmg, 2 AP |
| Gundam Pixy | Bullpup MG | ✅ Ballistic — 2 dmg, 2 AP |
| Geara Zulu | Beam Weapon (MG mode) | ✅ **Beam** — 3 dmg, 3 AP |
| Gundam Pixy | 90mm Submachine Gun | ❌ **Submachine guns don't get it** (designer ruling) |
| Gundam F91 | Ballistic MG | ❌ Point Defense instead |
| GM | Beam Spray Gun | ❌ Single-shot 4-damage rifle, not a machine gun |

- Also tidy the machine-gun damage labels so they match (Zaku II and Gouf show "1/die", Blue Destiny and F91 show "1 ea")
- ⚠️ Rules follow-up: add the submachine-gun exclusion to Rulebook Section 8 (it currently says "Ballistic Machine Gun / Beam Machine Gun" only)

### ~~2. Mega Particle Cannons → abilities (Sazabi and Nightingale)~~ ✅ DONE (v34)
*Built: Sazabi — **Mega Particle Cannon** skill, 3/3, 3 AP; **Shield Missiles** weapon with a **3-use counter**. Nightingale — **Mega Particle Cannon** skill (abdominal, 3 AP, No limit); **Shield Missiles** now on the sheet in row 5 with a 3-use counter. Limited-use weapons show their count in the pip beside the row; tap the row or pip to fire, and a **↶** beside it gives one back (phones have no right-click). Old saves whose weapon list changed get fresh counters.*
Both are 40cm, 45° cone AoE attacks — move them out of the weapon list into the skills.
- **Sazabi — Mega Particle Cannon:** 4 dmg, 3 AP, **3 charges/game**, no attack roll (Dodge/Block still apply) → a **3/3 counter** costing 3 AP. Sazabi has 2 skills, so there is room
- **Nightingale — Abdominal Mega Particle Cannon:** 5 dmg, 3 AP, **no charge limit** → a reminder row showing **3 AP**. Nightingale has 3 skills, so there is room
- This frees a weapon row on each: **Nightingale's Shield Missiles** (20cm, 2 dmg, 1 AP, **3 charges/game**, Block only) can finally go on the sheet, and **Sazabi's Shield Missiles** need a **3-charge counter** too

### ~~3. Funnel AP labels say "Free" — they cost 2 AP~~ ✅ DONE (v34)
*All now read **2 AP**: Nightingale Funnels x10, Sazabi Funnels, Kshatriya Funnels x6 and Saturation, Nu Gundam Fin Funnels, Xi Funnel Missiles, Strike Freedom Super DRAGOON. Legend's DRAGOON System stays as is (its pods are costed in the weapon rows).*
Reminder abilities default to "Free" in the AP column, but funnel attacks cost **2 AP**.
- **Nightingale — Funnels x10 (Enhanced):** change to **2 AP** (reported)
- Same problem on: **Sazabi — Funnels**, **Kshatriya — Funnels x6 (Enhanced)** and **Saturation**, **Nu Gundam — Fin Funnels**, **Xi Gundam — Funnel Missiles**, **Strike Freedom — Super DRAGOON System**. Check each against its rules text; Legend's DRAGOON System has no AP in its text (its pods are in the weapon rows at 2 AP)

### ~~4. Delta Zayin — Adaptive Shield toggle (make it functional)~~ ✅ DONE (v39)
*Built: the Cooldown area shows **I-FIELD ⇄** (teal) or **CANNON ⇄** (orange); tapping it — or the **1 AP** value — switches mode for 1 AP, with a **↶** undo for this half-turn. Beside it a **1/1** counter (tap for −/+): the **free block** in I-Field mode, refilled at **End My Turn** (ready for the enemy's attacks); the **bonus shot** in Cannon mode, refilled at **Start My Turn**. Switching gives the new mode's use straight away. Purple strip: *I-FIELD · 1st HIT BLOCKED FREE* / *FREE BLOCK USED*, *CANNON · FREE SHOT 60cm 3 dmg · BLOCKS COST HP* / *SHOT USED*. Timeline records switches, free blocks used and bonus shots fired. The "5 HP pool" line is corrected to **16 HP** in the stat block and the app.*

Currently a reminder only. Make it a two-mode switch in the Cooldown area: **I-FIELD ⇄ CANNON**.
- **Costs 1 AP to switch, either direction**; the mode persists until switched back. Starts in **I-Field Mode**
- **I-Field Mode (default):** the **first incoming hit each turn is Blocked free** — no Shield HP cost. Show a **1/1 free-block** counter beside the mode that refills each turn; later hits use the normal shield
- **Funnel Cannon Mode:** a **free bonus ranged attack every turn** (60cm, 3 dmg, 0 AP, roll to hit, target may Dodge/Block) — show a **1/1 bonus-shot** counter that refills each turn; Blocking now costs normal Shield HP
- Purple strip names the mode; the timeline records switches, free blocks and bonus shots; ↶ undo like other toggles
- ✅ **Rules check resolved:** the ability text said *"the shield's 5 HP pool"*; corrected to **16 HP** in the stat block and the app (matches Base Stats)
- Open question: does "each turn" mean each of Delta Zayin's own turns, or each round (its turn plus the enemy turn after it)? The app's tracker would refill on Start My Turn either way


### ~~5. Quick MOVE and DODGE buttons at the unit's feet~~ ✅ DONE (v32, themed in v33)
*v33: the buttons are see-through (blurred, tinted to the sheet) and take the sheet's accent colour — light blue on blue sheets, gold on red, lime on green, silver on grey. Counters and undo arrows match.*
*Built as described below. Sizes: 86–91 × 38px on a phone, about 120 × 52px on an iPad; undo arrows 35px / 50px. Placed at x 44–75%, y 87–95% — clear of the leg circles, labels and the TABLES / ROSTER buttons on every sheet. On phones held sideways the sheet is slightly taller than the screen, so a small scroll may be needed to reach them (same as the lower weapon rows). Free Dodges are not refilled until Start My Turn, so dodges spent on your own turn are gone for the enemy turn (Rulebook 4.0).*

Two large buttons side by side over the unit's feet (bottom centre of the sheet, between the RIGHT LEG and LEFT LEG labels, about x 52–66%, y 88–96%), so the two most common actions are one tap.
- **MOVE** — spends **1 AP** for one movement increment. The label shows the current distance per AP (e.g. *MOVE 30cm*, *MOVE 50cm* while Wings of Light is on) and how many moves were made this turn (*×2*)
- **DODGE** — spends **1 Free Dodge** (Rolled Dodges on grunt sheets, which share the same box). Shows how many are left
- **Flag, never block:** MOVE goes grey (still tappable) with 0 AP, with both legs destroyed (movement 0), or in the enemy turn; it warns once the **Stealth Stance 2-AP movement cap** is reached (Night Hawk, Pixy). DODGE goes grey at 0 Dodges
- **Undo:** a **↶** beside each button for the current half-turn takes the last one back (refunds the AP or Dodge)
- **Timeline:** one running line per half-turn, like damage — *Moved 3× (90cm, 3 AP)*, *Free Dodges used: 2*
- Must not cover the TABLES / ROSTER corner buttons or the leg circles and their −/+ buttons; check on phone and iPad


### ~~6. Multi-shield SWAP mode — big tap zones (agreed design)~~ ✅ DONE (v40–v43)
*Built for Kshatriya, Sinanju Zero and Phenex. Tap **⇄ SWAP** under the ring → the shield panel becomes **four invisible corner tap zones** (two halves on Phenex; fully invisible since v41–v42 — the only highlight is a glowing accent band on the picked shield's **ring quadrant**), about **97 × 58–71px on a phone, 135 × 82–99px on an iPad** (was a 7px ring). Tap anywhere in a zone — its box, the ring or empty space — to pick it (its ring quadrant glows), then tap where it goes. Shield boxes stay visible but can't be edited; SEND buttons and borrowed shields are hidden; a lent Phenex shield (its box reads **LENT**) can't be picked. Since v43 the **⇄ SWAP** button sits in the **centre of the four quadrants** (inside the ring) and becomes **✕ CANCEL** in swap mode; the instruction (*TAP THE FIRST SHIELD* → *TAP WHERE IT GOES*) is a single line in the gap above the quadrants, and taps pass through it. Swap mode ends after one swap. (The gap above the quadrants was too small for a tappable button — about 55 × 17px on a phone — so the button went in the middle instead: 63 × 27px on a phone, 86 × 38px on an iPad.) Timeline: *Shield 1 ⇄ Shield 3 (arcs swapped)* — no false damage/repair entries.*
*Fixed at the same time: **each shield's maximum now moves with it**. Before, swapping Sinanju Zero's 16 HP arm shield with a 12 HP wing shield showed "12/16" and "16/12"; now a wing moved to the front shows 12/12, and its regeneration, + button and the combined total all use the right maximum.*

**Problem (tested on phone and iPad):** the swappable ring band is only about **7px thick** on a phone, and the shield HP boxes sit over it, so swap taps land on the boxes and change HP instead. Affects **Kshatriya**, **Sinanju Zero** (4 quadrants) and **Phenex** (2 halves).

**While SWAP mode is on:**
- **Whole-corner tap zones, as large as the panel allows.** The shield panel (about **x 74.5–99%, y 60–92%**, split at the ring centre **87.36 / 73.6**) becomes four big zones — top-left, top-right, bottom-left, bottom-right — or **top half / bottom half** for Phenex. Each zone includes its shield box, the ring segment and all the empty space around them; tapping anywhere in it selects that shield. On a phone each zone is roughly 110 × 75px
- **Shield HP editing is locked:** no −/+ buttons, tapping a box selects it instead of editing it, Phenex's SEND buttons and borrowed-shield boxes are hidden. The boxes stay **visible** (the HP values are what you decide by). Limb circles don't wake while swapping, so the Left Leg's + button can't appear over the left zones
- **Clear feedback:** the strip reads *SWAP — tap the first shield* → *tap where it goes*; the selected zone glows; **SWAP ARCS** becomes a large **CANCEL**; swap mode ends after one swap (as now)
- **Edge cases:** a Phenex shield lent to an ally can't be selected (its arc is uncovered); destroyed or regenerating shields **can** be moved; the zones stay clear of the Shield HP total box above and the ROSTER button below
- **Timeline:** each swap is recorded, e.g. *Shield 2 ⇄ Shield 4*

**Outside SWAP mode:** nothing changes — boxes, −/+ buttons and SEND work as they do now.


### ✅ DONE (v36–v38) — Tap an AP value to fire / use
- **Weapons:** tap the **AP number** (or anywhere on a limited weapon's row) to fire — spends the AP, starts the cooldown (**Beam Magnum**, **VSBR** — both VSBR modes lock together) or uses a charge (**Shield Missiles**). A weapon on cooldown or out of uses can't fire; its AP shows crossed out, as it does when you're short on AP
- **Two costs** (*1-2* paired sabers, *2/3* Sazabi's rifle, *1/2*, *2/1*): tapping shows both as small buttons to pick from
- **Undo:** a **↶** over the row number takes back the last shot — refunds the AP and restores the cooldown / charge. The small dot beside limited weapons is still a manual correction with no AP
- **Skills:** tapping the AP presses the skill's own control — uses a charge (Attachment Bazooka, Guillotine, Mega Particle Cannon…), switches a form or toggle on (Trans-Am, Full Output, HADES…), or opens the Dual-Wield Matrix picker. Reminder skills with a cost (Spray and Pray, Atomic-style reminders) spend it with a ↶ undo. Skills showing "—" and armour pools stay untappable (use their −/+)
- **Timeline:** one running line per weapon / skill, e.g. *Beam Rifle fired 2× (4 AP)*, *Spray and Pray used (2 AP)*
- **v38 — finger-sized tap areas:** the tap target used to be only the characters themselves (a weapon's "2" was **9 × 16px** on a phone), so taps beside the value did nothing — the cause of "some funnel AP buttons aren't pressable". Each tappable AP value now has an invisible tap area covering its **whole cell** (measured from the sheet art: skill AP column x 23.0–28.7%, weapon AP column x 28.7–33.5%, row height ~4.5%): **40–46 × 21–22px on a phone, 55–65 × 29–31px on an iPad**, with a brief highlight when pressed. Tested by tapping near the corner of all 216 tappable cells on every sheet; nothing else sits under a tap area
- **v37 sweep (all 307 AP values on 49 sheets):** the funnel / DRAGOON skills (Nu, Xi, Strike Freedom, Kshatriya ×2, Sazabi, Nightingale) and Nightingale's Mega Particle Cannon showed a cost but weren't tappable (the v34 label fix changed only the text) — now they spend their AP with a ↶ undo. **Night Hawk's RAPTOR Pods** ("2 / Free") now offer **2 AP fire** or **Free ambush** while the pod is deployed; either marks it REVEALED, and ↶ puts it back. Every value that shows a cost is now tappable (223 of 307); the rest are "—", "Passive", "Auto" or armour pools. The tappable outline is drawn outside the text so it never cuts a label off

---

## PRIORITY ORDER — reviewed after v90 (roster builder + tracker ✅ complete)

| # | Task | Why this order | Size |
|---|---|---|---|
| **1** | **Playtest v90 on real devices** + clear the hand-off backlog (below) | Cheapest step with the most information: settles the on-device checks, ship durability, whether the enemy-turn soft lock is needed, and any UI issues before building more on top | Small |
| **2** | **Quick fixes bundle** — Destiny & Rising Freedom CIWS (don't fit the 5-weapon sheet), Night Hawk pods at End Turn + recall cost, permanent Dodge modifiers shown on the sheet, anything the playtest turns up | Small, known gaps in units that are already "done" | Small |
| **3** | **Warships in the app** — Musai, Salamis Kai, Rewloola, Ra Cailum: new sheet layout (Hull / Bridge / Thrusters, weapon arcs, hangar & launches, garrison crew HP, base module) | They're **bought with DP** and fully statted, so a real game can already include them — but the app can't track them yet | Large |
| **4** | **Ground units** — Infantry Squads, Cars, Tanks, Transport Ships, Helicopters, Jets: lighter unit cards, **no DP**, the per-type caps and 8-vehicle cap shown (flag, never block), respawn tracking | Completes "every piece on the table is trackable" | Medium |
| **5** | **Save backup** — export / import a save (file or copy-paste code) | Everything lives in the browser's storage; clearing it or changing phone loses the lot. Must exist **before** campaign progress is stored | Small–medium |
| **6** | **Campaign layer** — GP earned & spent, Custom Pilot rank & specialisations, Base of Operations upgrades, **Purchase Reinforcements**, **Build Codes** (settle the 4 deferred questions first) | The biggest build and needs a few rules decisions up front; benefits from 1–5 being solid | Large |
| **7** | **Multiplayer session sync** — ✅ **first version built as `msb-mp` (mp1)** on Netlify Functions + Blobs; needs deploying + a two-device test | Built early at the designer's request | Medium–large |
| ⏸️ | Infinite Justice ability rework | Model in repair | — |
| 💭 | Enemy-turn soft lock | Only if the playtest shows it's needed | — |

**Change from the old order:** GP & progression was "next up". It moves to #6 because it's a *campaign* feature, while warships and ground units are needed to track a *single game* fully — and a save backup should exist before campaign progress is stored. *(Designer's call — swap back if the campaign layer matters more right now.)*

### 🚢 Warship sheets — agreed plan (next build; moved up because the code-drawn sheets make it quick)
**Waiting on the designer:** wireframe artwork for the four ships (same style as the suit blueprints). ✅ **Prototype sheet received** (Canva, blue + red versions) — the build follows it:
- **Top ⅔:** large angled ship wireframe with **hit-location rings on the ship**: Thruster 1, Thruster 2, Bridge, Hull, and **one ring per weapon system** (20 HP each — e.g. Main Gun (long range), Secondary Guns, Anti-Air Array). Ring positions are set **per ship** once its artwork arrives
- **Top right:** **SHIP:** name panel (+ portrait, like the suit sheets)
- **Bottom left:** **Weapons List** (name · DMG · AP · range, 5 rows; tap AP to fire)
- **Bottom middle:** hex readouts **Crew · AP · Movement**
- **Bottom right:** **Abilities** (skill · AP · cooldown, 5 rows) — also holds the ship trackers: **Hangar** (suits aboard −/+), **Launch** (per turn), **Base Module** (tier 2 / none), **Damage Control** (active / offline by crew), **Decoy Balloons** (Ra Cailum)
- Blue (Federation) / red (Spacenoid) like the prototype's two versions
- Every weapon needs its own ring on the artwork: Rewloola's **Missile Barrage**, Ra Cailum's **Anti-Ship Missile** and both cruisers' **Missile Launchers** as well as the guns
- *The earlier proposed layout below is superseded where the prototype differs*

**Proposed layout** (same HUD frame, side colours, dock, animations)
- **Left — Weapon Systems table** (up to 4 rows): name · arc (360° / 180° fwd / fwd) · range · damage · AP (tap to fire; cooldowns / charges as on suits) · **20 HP system box** per weapon → **OFFLINE** at 0, with a **2-turn Damage Control countdown** when the crew can repair
- **Centre — ship wireframe + hit-location rings:** **HULL** (0 = destroyed + Emergency Disembark reminder) · **BRIDGE** (0 = no weapons, no steering; quick *Bridge hit* button: −2 crew, −3 to rolls next turn) · **THRUSTER 1 / 2** (one down halves Movement, both down = immobilised — applied automatically)
- **Right column:** AP · Movement (auto) · **Crew HP** (garrison × 8, −/+; ≤ 8 → *Damage Control offline*, *Last Stand Lockdown if boarded*) · **Hangar** · Launches / turn · Base module (tier 2 / none)
- **Bottom:** MOVE (no DODGE — ships can't dodge), DONE, TABLES, ROSTER
- **Ra Cailum:** Decoy Balloons (1 charge)
- **Roster:** a **WARSHIPS** group in the unit list, counts toward DP; roster rows show **Hull**
- **Data:** all four classes already in `units.json` (hull, bridge, thrusters, AP, movement, hangar, launches, garrison, base module, weapons with arcs and system HP)

**Decisions**
- **Hangar tracking:** ✅ **simple count** of suits aboard (−/+, capped at the class capacity). Assigning actual roster suits to a ship (launch / dock buttons) can come later
- **Artwork:** ✅ designer's **wireframe images** of the four ships

**⚠️ Rules chat — leftovers from the retired generic Battle Ship in Section 13.5** (they contradict the four class tables; the app will use the class values)
- *Ship Stat Block* still says **Hull 100 (Ra Cailum 140) · Bridge 60 · Thrusters 30 each** for every ship — Musai and Salamis Kai are Hull 60 / 70, Bridge 40, Thrusters 20
- *Ship Mobility* still says **6 AP, 20cm per AP** for all ships — the classes range from 4 AP / 30cm to 6 AP / 15cm
- *Ship Weapons* still lists the generic **Long-Range Beam / Turret / Double Beam Cannon** (and their Weapon System Called Shot names), which no class carries any more

### Hand-off backlog
**Rules chat** — ✅ **prompt ready:** `Rules_Chat_Update_Prompt.md` (also applied to the app chat's copy of `Gunpla_Battles_Rulebook.md`: Spray and Pray / submachine guns, Section 13.5 ship values + retired generic ship weapons + mobility, Wing Zero Custom in Appendix A). Still to **decide**: Night Hawk pod recall cost/timing, Delta Zayin Adaptive Shield refill timing. Pale Rider HADES wording is already correct in this chat's copy (rules chat to check theirs). Xi Gundam → Spacenoid and Delta Zayin → Federation only matter for faction lists (the rulebook has none)

**PPTX chat** *(only if the printed set is still being kept up — the app no longer uses the printed sheets)*
- Strike Freedom slide 83: 360° → 180° background
- Exia: new sheet for the Dual-Wield Matrix rework
- Sazabi / Nightingale: Mega Particle Cannon and Shield Missile counters
- Delta Zayin: Federation / blue sheet · Xi Gundam: Spacenoid / red sheet
- Wing Zero Custom: clone of Wing Zero's sheet

### Previously completed
| # | Task | Status |
|---|---|---|
| 0 | App fixes (Spray and Pray, MPCs, funnel AP, Delta Zayin shield, MOVE / DODGE, multi-shield swap) | ✅ v40 |
| — | Ship stats and weapons · unit data → JSON · all 49 (now 50) mobile suits · roster builder · late-unit verification | ✅ |
| — | **Roster builder + tracker polish** (v41–v90): HUD sheets, portraits, colour markers, transitions, confirm / budget checks | ✅ **complete** |

**Ships are fully done.** All four classes have weapons, DP, structure and garrisons. The app's unit data is complete: **49 mobile suits plus 4 warships = 53 purchasable units.** The 49 suits are all in the app; the 4 warships are not yet (different sheet layout — priority 7).

| Class | DP | Hull | AP | Move | Hangar | Garrison |
|---|---|---|---|---|---|---|
| Musai | 2200 | 60 | 4 | 30cm | 2 | 1 squad |
| Salamis Kai | 2500 | 70 | 4 | 25cm | 2 | 1 squad |
| Rewloola | 5000 | 100 | 6 | 20cm | 4 | 3 squads |
| Ra Cailum | 6000 | 140 | 6 | 15cm | 6 | 4 squads |

The only ship item left is a **playtest question, not a design gap** — see the durability note below.

---

## New Units to Build

Each needs three things: a **stat block** in `Gunpla_Unit_Stat_Blocks.md` (tier, DP, base stats, Limb Health, weapons, abilities, DP breakdown), a **PPTX stat sheet** matching the existing format, and an **Appendix A roster entry** in the rulebook.

| # | Unit | Source | Notes |
|---|---|---|---|
| ~~1~~ | ~~**Narrative Gundam C-Packs**~~ | RX-9/C, Gundam NT | ✅ **DONE** — Superweapon, 2200 DP. Stat block, Appendix A entry, and `Narrative_C_Packs_Stat_Sheet.pptx` all created |
| ~~2~~ | ~~**Gundam Vidar**~~ | ASW-G-XX, Iron-Blooded Orphans | ✅ **DONE** — Superweapon, 2250 DP. Established **Nano-Laminate Armour** as a faction-wide IBO trait (24 HP, 360°, all beams reduced to flat 2; ballistics and physical melee ignore it) and **Alaya-Vijnana Type E** (duel-only melee boost) |
| ~~3~~ | ~~**Legend Gundam**~~ | ZGMF-X666S, SEED Destiny | ✅ **DONE** — Myth, 3200 DP. Two DRAGOON pools (GDU-X5 8d6/1dmg, GDU-X7 2d6/5dmg unblockable), Full Barrage, Earth-capable pods, 2x independent 13 HP beam shields |
| ~~4~~ | ~~**Destiny Gundam**~~ | ZGMF-X42S, SEED Destiny | ✅ **DONE** — Myth, 3100 DP. Arondight established the new **Anti-Ship Sword** melee tier (4/8, +4, 30cm). Wings of Light + Mirage Colloid with the Voiture Lumiere charge |
| ~~5~~ | ~~**Huckebein Mk-III**~~ | — | ✅ **DONE** — rebuilt from scratch as the **RX-97-NH Gundam Night Hawk**, Myth tier, 3000 DP. Stealth/psycommu ambush unit with RAPTOR hologram pods |
| ~~6~~ | ~~**Gundam Epyon**~~ | OZ-13MS, Gundam Wing | ✅ **DONE** — Myth, 3000 DP, deliberately level with Wing Zero. Full Output mode, Guillotine sweep, Epyon System self-rerolls, and the Berserk drawback that punishes fighting alongside allies |
*(Gundam EX — done. Stat block, Appendix A entry, and `Gundam_EX_Stat_Sheet.pptx` all created. RX-78-2's missing stat block and roster entry were filled in at the same time.)*

---

## Rework

### ⏸️ Justice Rework — Infinite Justice Gundam (ZGMF-X19A) — PAUSED

**On hold — the physical model is damaged and awaiting repair.** No rush on the rework until it's back together.

Now sits at **Myth tier, 2500 DP** after gaining Variable Phase Shift Armour, but its **abilities are still the original underpowered set** and need reworking.

**Diagnosis:** its base stats are fine — AP, Movement, Free Dodges, Chest, and Shield all match every other Superweapon. The weakness is entirely in its abilities.

| Unit | DP | Abilities |
|---|---|---|
| Nu Gundam | 2530 | Fin Funnels · Newtype Resonance · Ultimate Defense Field |
| Sazabi | 2550 | Funnels · Psycho-Frame Sync |
| Rising Freedom | 2700 | HiMAT Full Burst · MA Mode · Phase Shift |
| Strike Freedom | 2800 | Super DRAGOON · Full Burst · Phase Shift |
| **Infinite Justice** | **2500** | **An extra gun · a once-per-game ram · Phase Shift** |

- **Ability 1 (Fatum-01 Hyper Fortis Cannons)** is just another weapon with a normal to-hit roll. Every peer's first ability is a genuine system.
- **Ability 2 (Fatum-01 Ram Assault)** does 8 damage to one random location — weak for an Ultimate next to Full Burst effects.
- **Phase Shift is now doing most of the work.** Strip the 250 DP armour trait away and it's still a 2250 unit with two weak abilities.

**Proposed direction:** lean into what the machine actually is — the mobility and close-combat half of the Freedom/Justice pair.
- **Fatum-01 Flight Mode** — a movement/transformation ability using the subflight unit. No current peer has a mobility-focused ability, so this would be genuinely distinct.
- **Upgrade the Ram** into something worth an Ultimate slot.
- **Push the melee identity further** — it already rolls twice on Dual Beam Saber.

---

## Notes

- **Infinite Justice already has a PPTX sheet** (`Infinite_Justice_Stat_Sheet.pptx`) — the rework means updating it, not creating one.
- If a **SEED Freedom Type II** version is wanted later, it should be a separate unit alongside the X19A rather than a replacement — same pattern as Sinanju and Sinanju Stein.

---

---

## Stat Sheet Build Order — Three Tiers

`units.json` was analysed to sort every unit by how far it strays from the standard sheet template. **Build Tier 1 first, prove the template, then handle 2 and 3 one at a time.**

### Tier 1 — Standard template (31 units, 63%)
One shield, 0-3 abilities, no extra pools. These all fit the same layout: six limb circles, one shield box, an ability list. **If the template works for these, it works for most of the roster.**

GM · Zaku II · Gouf · Blue Destiny · Jesta · Slave Wraith · Rick Dom · Zaku I Sniper · Geara Zulu · GM Sniper II · Gundam EX · RX-78-2 · Astray Red Frame · Pixy · Pale Rider · Jiyan Altron · GP01Fb · GP02A · AC Nightfall · Narrative C-Packs · Kshatriya · Delta Zayin · Master Gundam · F91 · Nu Gundam · Sazabi · Exia · Banshee Norn · Crystal Body · Wing Zero · Nightingale

### Tier 2 — One exception each (10 units)
| Unit | The exception |
|---|---|
| Strike Rouge | Phase Shift pool (16) |
| Infinite Justice | Phase Shift pool |
| Rising Freedom | Phase Shift pool |
| Rozen Zulu | Two charged abilities to track |
| Sinanju Stein | Four abilities |
| Sinanju | Four abilities |
| Epyon | Five abilities |
| Xi Gundam | Four abilities |
| Phenex | No shield unless Armed Armor DE is deployed |
| Turn A | No shield at all |

### Tier 3 — Multiple exceptions (8 units)
| Unit | Exceptions |
|---|---|
| Gundam Mk-II | Shield + Anti-Beam Coating pool |
| Hyaku Shiki | Shield + Anti-Beam Coating pool |
| Vidar | No shield + Nano-Laminate pool |
| Strike Freedom | Two shields + Phase Shift |
| Destiny | Two shields + Phase Shift |
| Legend | **Two independent 13 HP shields on separate regen timers** + Phase Shift |

*Correction: Destiny has **one** 13 HP beam shield (stat block), not two.*
| Night Hawk | Anti-Beam Coating + 2 destructible RAPTOR pods + 4 abilities |
| **Sinanju Zero** | Two shields, two charged abilities, five abilities — the hardest sheet in the roster |

**Legend and Sinanju Zero are the true stress tests.** If the tracker handles those two, nothing else will surprise it.

---

## App — Roster Builder (Priority 2)

**Full build prompt:** `App_Build_Prompt_Roster_Builder.md` — paste the quoted section at the top of that file to start.

**What it is:** a Progressive Web App, installable to the home screen on iOS and Android, works offline, saves to device storage. Hosted free by dragging a folder onto Netlify. No app store, no developer fees, and rule updates reach everyone the next time they open it.

**The flow:** pick faction → pick DP budget (5000 / 10000 / 15000 / 20000 / custom) → add units → live DP tally.

**Decisions already made:**
- **Flag, never block.** Over budget or over cap shows red but still lets you build.
- **Three factions:** Federation (20 units), Spacenoid (14), Neutral (15, available to both). UC units take a side; every other universe is Neutral. Full list is in the build prompt.
- **Ground forces are a separate panel** — no DP cost, capped instead, swappable mid-game.
- **Warships are DP-purchased** and sit outside the vehicle cap. Structure the data so the four named classes slot in once their stats exist.
- **Local save only.** No accounts, no server, no sharing for now — players usually build fresh each game anyway.
- **Sheet colours do not change** to match faction. Colour is narrative role, faction is pickability.

**One build step to remember:** the 48 stat blocks need converting from markdown to JSON before the app can list anything. Mechanical, but it has to happen.

---

## App Phase 2 — Health, Shields & Cooldown Tracker

**Decided: the app uses the existing stat sheet artwork as backgrounds, and forces landscape orientation.** No sheet redesign — players already know where everything is, so there is nothing to relearn, and tap targets can be positioned over artwork whose coordinates are already known from the PPTX work.

**The art is ready to go.** Nine distinct 1920x1080 backgrounds exist across the decks — grey, green, red 180°, red 360°, blue 180°, blue 360°, and two pilot-sheet variants. Roughly 7.1 MB raw, which compresses to around 1.5-2 MB as WebP. The app can serve the correct coloured sheet automatically based on which unit is selected.

**What it needs to track:**
- **Limb Health** — six locations, tap a circle to mark damage
- **Shield HP**, including multi-shield units like Legend's two independent 13 HP pools
- **Phase Shift** pools (24 nuclear / 16 Strike Rouge / 12 battery)
- **Nano-Laminate** pool (24) and **Anti-Beam Coating** (8)
- **Kevlar** (6 per soldier) on squad sheets
- **Ability charges and cooldowns** — NT-D, Full Output, Trans-Am, RAPTOR pods, Wings of Light and the rest
- **Free Dodges and Rolled Dodges** spent per turn

**Orientation note:** landscape suits a tablet propped at the table very well. On a phone it will mean turning the device sideways, which is an accepted trade for keeping the real sheets.

---

## App — Handoff Notes (read first in a new chat)

Everything below was worked out by measuring the actual sheet artwork. Do not re-derive it by eye.

### Sheet geometry — measured, not guessed
- Slides are **10 x 5.625 inches**, not the PowerPoint widescreen default. Dividing by 13.333 puts every coordinate out by 1.33x.
- **Seven backgrounds**, identified by hashing each sheet's 1920x1080 image: grey, green, blue, blue360, red, red360, phenex.
- **Limb circles** are identical on every sheet except the reds, whose arms differ: default arms 47.79/44.49 and 70.95/44.58; **red and red360** arms 47.04/44.09 and 71.83/44.75. Head, chest and legs never move.
- **Only red360 and phenex** have the four printed shield bubbles at 80.91/66.32, 93.80/66.45, 80.97/80.97, 93.80/80.98, plus the white arc ring centred 87.36/73.60 with a band from 3.78% to 4.58% of width.
- **Mobile Suit panel interior** is y 10-18; the printed "MOBILE SUIT:" label occupies y 5-9 and the panel's bottom edge y 19-24.
- **Weapon table** spans x 6.3-41.7, centre 24.0 — both status strips are centred there.
- Key rows: skills y 24.6/29.7/34.6/39.7/44.1, weapons y 68.2/73.7/78.7/83.7/88.1, stat boxes x 80.5 at y 28.7 AP, 38.5 movement, 47.9 dodges, 57.3 shield.

### Sizing rules that took several attempts
- **Never use a pixel floor above ~5px** in a clamp on the sheet. A higher floor stops scaling on small windows and the text looks oversized. Everything uses `cqw` against the `#sheet` container.
- **Measure, don't estimate.** Estimating glyph width was wrong twice; `shrinkToFit()` measures the rendered box and shrinks until it fits.
- `-webkit-line-clamp` breaks that measurement — it caps `scrollHeight`, so the overflow check never fires. Use a fixed height with `overflow:hidden` instead.
- Strip padding and radius are in `em` so they scale with their own text.

### Mistakes worth not repeating
- **Never delete a code range by its two endpoints** without printing what is between them. Doing that once removed the limb circles, weapon pips, both status strips and the whole text layer.
- **`node --check` cannot catch use-before-declaration.** Three separate outages came from splicing a variable into one place and reading it in another. Shared logic belongs in a function (see `abilityLocked()`), not a local.
- **Verify both halves of a paired edit.** Several `str_replace` calls silently no-matched on whitespace and were only noticed later — the per-faction save bug shipped this way.
- Full-size overlays need `pointer-events: none`, or they swallow every click (the arc-ring SVG did).
- Module-level variables must be reassigned unconditionally in `openSheet`. A conditional write let `out` leak between units and put SEND buttons on Vidar.

---

## App — Verification Pass (done, app v5)

Every sheet was opened in a test browser, compared against `Gunpla_Unit_Stat_Blocks.md`, and the tracker behaviour was tested by script. All 49 units open and survive End Turn with no errors.

### Data errors found and fixed
| Unit | Problem | Fix |
|---|---|---|
| **Night Hawk** | Ability names sat one row off their rules text (stealth switch labelled "RAPTOR Pod 1"). Anti-Beam Coating counted twice — ability pool **and** shield box | Names corrected. Coating kept as the 8 HP ability pool only, same as Vidar's Nano-Laminate; shield box now empty |
| **Rising Freedom** | Same shifted names ("Dual Beam Saber", "Shield Boomerang") | HiMAT Full Burst · MA Mode · Phase Shift Armour |
| **Gundam Mk-II** | Point Defense and Anti-Beam Coating names swapped; "Beam Saber" | Swapped back; **Heat Saber** per stat block |
| **Exia** | Placeholder sheet — Beam Rifle, Hyper Bazooka, no Trans-Am | Rebuilt: GN Sword Rifle / Sword, Long Blade, Short Blade, Beam Saber ×2 (GN Vulcans noted in the Saber popup — no sixth row). Dual-Wield Matrix + **Trans-Am** (3 charges, 2 turns, +5 rolls, +15cm) |
| **Sinanju Zero** | Weapon row 4 blank | **Razor Feather Funnels** (3 each, 2 AP, 60cm) |
| **Sinanju Stein** | Rocket Bazooka 1 AP | 2 AP |
| **F91** | Ballistic MG 60cm | 90cm |
| **Xi Gundam** | "Double" Missile Volley | Multi Missile Volley |

### Behaviour fixes
- **Switching costs AP both ways.** Full Output (1 AP) and every Transformation (2 AP) previously cost nothing to switch off
- **Trans-Am burnout.** When the mode ends, naturally or by tapping ACTIVE off after a hit, the row shows a red **BURN** chip and a red strip: −5 to every roll. Clears at the next End Turn, or tap BURN to clear early
- **End Turn order.** Modes now expire before next turn's AP and Dodges are worked out, so Wings of Light's extra Dodge no longer leaks into the following turn
- **Sazabi.** Restored the red **HEAD = KILL** badge above the head circle; the overlay reads "DESTROYED — HEAD HIT"
- **Legend / Strike Freedom.** Shields sit **left and right of the coverage arc** (v24, x 80.4 / 94.5, y 69.8). The left box is placed just clear of the Left Leg's + button, so both stay tappable
- Removed a duplicate Dodges box drawn twice on every sheet
- Service worker cache bumped to **msb-v5** so installed copies pick up the update. Save key unchanged (v4) — saved games migrate

### Checked and fine
Kshatriya bubbles · Phenex shields, SEND and borrowed-shield slots · Sinanju Zero ring · F91 shared VSBR cooldown · Night Hawk pods · Epyon Guillotine locked until Full Output · Turn A, Master Gundam, Destiny, F91 ability kinds · beam shield ↻ / ✕ choice

### Still open
- **On-device look** at Legend, Strike Freedom, Night Hawk and Exia — a phone may lay out differently from the test browser
- **Night Hawk pods** don't change state by themselves at End Turn — REVEALED pods are returned by tapping
- **Dodge-target modifiers** only appear when something is switched on (Destiny, F91 Heat Venting). Permanent ones (Sinanju, Wing Zero, Agile) are stated in their ability row only
- **Sheets hold five weapons.** Destiny and Rising Freedom CIWS, and Nightingale's Shield Missiles, don't fit

---

## App — EXAM System (Blue Destiny Unit 1, app v6)

Built from the stat block. **No manual on/off** — EXAM follows the shield, exactly as the rules say.

- **Trigger:** the shield reaches 0 → EXAM is on. Repair the shield (any HP) → EXAM is off. Survives closing and reopening the app
- **While on:** ability name turns red · Dual Beam Sabers show **3/6** in purple · purple strip **MELEE ROLL +4 · MELEE 3/6** · red **◉ EXAM ACTIVE** badge above the head (v7 — the old red glow on the head circle looked like 2 damage, since red rings mean low HP) · red reminder that she must start a melee every turn if any unit is in Charge Range · red **EXAM** tag on her roster row
- **Berserk check:** tap **CHECK d20** when she starts a melee, roll a physical d20, tap **1-3** or **4+**. **1-3** shows a red BERSERK strip (attack goes to the nearest unit, friend or foe); **4+** shows a **green** "✓ EXAM check passed" strip (v8). If damage notes are showing too, the red strip moves up above the green one. Cleared at End Turn
- The ability type is **auto** with a `shieldDown` trigger, and weapons can carry a `boost` that applies while it runs — reusable if another unit ever needs a self-triggering state

---

## App — HADES System (Pale Rider, app v10)

Built from the stat block.

- **Switch:** tap **OFF / ACTIVE** — free, any time. Switching on grants the 3 Free Dodges immediately **and the first check is due at once** — the row jumps straight to PASS / FAIL for the **6+** roll (v10, designer ruling)
- **While on:** Free Dodges **0 → 3** · purple strip **DODGES 3 · RANGED +3 · DUAL STRIKE**
- **Escalating risk:** 6+ on activation, then every End Turn with HADES still on the row shows **CHECK 8+**, **10+**, **12+** (+2 each turn). Tap it, roll a physical **d20**, tap **PASS** (green strip) or **FAIL** (2 Chest damage applied automatically, red strip). Between checks the row shows **ACTIVE** plus the number the next check will need
- **Switching off** resets the count — turning it back on means a fresh 6+ check. A due check must be answered first, since the rules check at the start of every turn it is still on
- Survives closing the app. Older saved games open normally
- **Bug fixed:** HADES was stored as an always-on ability, so Pale Rider had **3 Free Dodges permanently** instead of 0
- **Stat block updated** to match: check on activation, then each turn it stays on, rolled on a **d20**
- A mis-tapped FAIL is undone with the Chest **+** button
- Reusable: any toggle can carry a `risk` block (die, start, step, location, damage)

---

## App — Cooldown Column Fit (app v11)

ACTIVE boxes on modes and toggles (NT-D, Trans-Am, Wings of Light, HADES, Full Output…) used to be centred and wider than the column, so they spilled left over the **AP** column. Now any control wider than the Cooldown column (measured **x 28.9–41.85**, identical on every sheet colour) keeps its **−/+ buttons to its right** and shrinks just enough to stay inside. Controls that already fit, like plain charge counters, are unchanged. Checked with every mode and toggle switched on, at tablet and phone sizes.

---

## Tentative — Enemy-Turn Soft Lock (not scheduled)

**Only build this if playtests show players activating own-turn abilities during the enemy's turn**, or if new players join who don't yet know which abilities are reactive. Currently judged **not worth the effort**: off-turn mistakes are cheap to fix (Undo, the +/− steppers, the timeline), and the red ENEMY TURN chip plus roster-only turn ending already cover most confusion.

**If built — a soft lock, never a hard lock** (keeps the *flag, never block* rule)
- During ENEMY TURN, own-turn controls are **dimmed with a small lock**: switching modes on (NT-D, Trans-Am, HADES), spending charges on non-reactive abilities, the AP box
- Tapping a dimmed control asks **"It's the enemy's turn — use anyway?"**; confirming works normally and the timeline marks it *(during enemy turn)*
- **Always fully available:** limb damage/repair, shield HP and the beam shield ↻ / ✕ choice, Free Dodges, armour pools (Phase Shift, Nano-Laminate, Anti-Beam Coating), switching modes **off** (Trans-Am auto-cancel, HADES off), weapon rows (Overwatch, counter-attacks, clashes started by the enemy), and every reactive ability
- **Reactive abilities to keep lit:** Phenex Wings of Light · Nu Gundam Ultimate Defense Field · AC Nightfall Assault Armor · Turn A I-Field Deflection · Rozen Zulu Psycho Jammer and Funnel Jamming · Night Hawk pod Ambush Reaction and Ambush Protocol · Point Defense · Zero System and Epyon System rerolls · Geara Zulu Piercing Stab (inside a Clash)

**The real work:** every ability on all 49 units needs a tag — **reaction**, **own turn only**, or **any time** — and every new unit needs one too. Draft the full tag list for review before building, since a wrong tag would warn on a legal move.

---

## Exia Rework — Dual-Wield Matrix (stat block + app done, PPTX sheet pending)

**Stat block updated** in `Gunpla_Unit_Stat_Blocks.md`. Cost unchanged at **2685 DP**.

- **Dagger Guard** (GN Beam Dagger ×2, new weapon, 1/2, +3): 2 parries per segment against **any** hit, Criticals included
- **Blade & Parry** (Long + Short): Long Blade rolls with Advantage at +3, 1 parry per segment against **Normal Hits only**. Replaces the old Dual Strike
- **Twin Sabers** (Beam Saber ×2): Advantage at **+4**
- **Removed:** Short Blade ×2 and Long Blade ×2 pairings (Exia carries one of each)
- **Weapon page fits 5 rows:** GN Sword Rifle/Sword merged into one row; GN Vulcans moved to Ability 3 (Point Defense)

**Still to do**
- [ ] Hand the change to the rules chat (Appendix A roster entry if it lists Exia's weapons)
- [ ] Update the PPTX stat sheet to match
- [x] **App updated (v21):** new weapon rows (GN Sword row shown as **GN Sword · 5·3/6 · 90cm / 30cm**, both modes explained in its popup), Ability 3 Point Defense, and the **matrix selector**:
  - Cooldown area shows **SELECT** → picker with Dagger Guard / Blade & Parry / Twin Sabers / No pair (each with its stats)
  - Once picked: **⇄ DAGGERS / BLADES / SABERS** (tap to change pair) plus the **parry counter** — 2/2 or 1/1, tap for −/+. Twin Sabers shows **ADV +4** instead
  - Parries refill when the pair changes and automatically at **End My Turn** and **Start My Turn** (a new 4-exchange segment always starts in a new half-turn)
  - The paired weapons are highlighted purple, the purple strip names the pair, and the timeline records pairs drawn and parries used
  - Damage values now shrink to fit the DMG column on every sheet
  - **v23: drawing a pair costs 2 AP** (and changing pair costs 2 again). Not enough AP → the picker says so and won't draw it; **No pair** is free; re-picking the current pair is free. A **↶** beside the pair (this half-turn only) refunds the AP and restores the previous pair and parries. *In an enemy-initiated clash with 0 AP left, add AP with the AP box's + first if your group allows drawing there*
- [ ] **Pale Rider HADES** still has the backwards Dual Strike wording ("only check the lower die if the higher one loses") — should follow Section 7.1

---

## App — Small fixes (v26)

- **Xi Gundam — Minovsky Flight System** now has a **1/1 use counter** (free, once per game, usable any time). It was a plain reminder before
- **Old saved games are repaired per ability:** if an ability's type changed since the game was saved (e.g. a reminder that became a counter), that one slot is reset to a valid state and everything else is kept. Previously only a change in the *number* of abilities triggered a repair, so an old Xi save showed "null/1"

---

## 🔗 Multiplayer build — `msb-mp` (builds mp1–mp11) — separate project
Based on the feasibility study (`Multiplayer_Sync_Feasibility.md`). **The normal app (`msb-app`, v95) is untouched**; `msb-mp` is its own Netlify site, deployed **GitHub → Netlify** (see `msb-mp_DEPLOY_GUIDE.md`).
- **Server:** one Netlify Function (`/api/sync`) with create / join / push / pull / leave, backed by Netlify Blobs (store `msb-battles`, strong consistency). Every key has a single writer: `meta` + `hostseat` (host, once), `guestseat` (first guest, once — race-proof), `host` / `guest` (each device its own). **Seat tokens** stop anyone else writing to a seat; 5-letter codes without I / O; 24 h expiry checked on every call, expired sessions swept lazily
- **Local-first:** nothing waits on the network. Changes push ~1 s after `save()`; the other side is pulled every 3 s (tiny "nothing new" replies when unchanged, heartbeat every 30 s), polling pauses while the tab is hidden and backs off (3 s → 10 s → 30 s) on errors. The service worker never touches `/api/`
- **UI:** **MULTIPLAYER** on the main menu and a **⇄ MP** status chip on the roster bar (WAITING / LIVE / RETRYING / ENDED) → dialog with Create session (big 5-letter code), Join by code, both sides' status, Disconnect (roster kept; the host leaving ends the session)
- **Opponent panel** on the roster screen: their units with portraits, colour markers, kill-location HP (DESTROYED), done ticks, turn and "updated N s ago"; tap for limb / shield / AP details and recent events. Version check if the two devices run different builds
- **Turn handover:** when the opponent ends their turn (a shared end-of-turn counter, so it can't be missed), a prompt offers **Start my turn ▸** — never automatic; a "both devices say it's their turn" warning if they clash
- **Tested here** with a local Blobs server and two browser profiles: create / join / wrong side / full / bad code, damage seen on the other device in ~3.5 s, turn prompts both ways, offline → RETRYING with the tracker still working → catch-up in ~1.5 s, reload rejoins, ~7 calls per 10 s for both devices and none while hidden, host disconnect → guest ENDED with rosters intact; the regular test suite passes on the MP copy
- **mp2 — faster sync** (designer found a big delay on real devices):
  - **Changes go out sooner:** about 0.2 s after a tap, instead of 0.9 s.
  - **One trip per check:** sending and fetching are combined into a single request, with parallel storage reads and short-lived seat / session caches in the function.
  - **Faster checks while active:** about every 1 s during the opponent's turn or just after any change, 2.5 s when quiet, paused when hidden.
  - **Bugs fixed:** a duplicate checking loop (visibility / online events arriving mid-request) and the 30 s presence update being mistaken for activity.
  - **Measured locally:** a change reaches the other device in **~0.5 s** during play (was ~3.5 s), and up to ~2.5 s after a quiet spell. Idle: 4 calls per device per 10 s. Cost roughly **5 credits per hour** of active play.
  - **Update:** replace `sync.mjs`, `public/index.html` and `public/sw.js` in GitHub.
- **mp3 — team battles (any number of devices)** (designer's flow):
  - **Lobby:** MULTIPLAYER → name → Create / Join by code. The lobby shows a **Federation list and a Spacenoid list**; players swap teams freely, then tap Ready.
  - **Host settings:** the **host** sets the DP budget and **who goes first** (synced to everyone), then starts the battle, and every device goes to its team's roster.
  - **Team leader 👑:** the first player on a team (the next one takes over if they leave or drop out). Only the leader builds and confirms the roster, sets colour markers, and ends / starts the team's turn. Members watch live; their End Turn button reads "👑 <leader> ends the turn".
  - **Sheet locks 🔒:** opening a sheet takes control of that unit. Others can view it read-only ("Controlled by <name>"), with live updates. Closing frees it, and a watcher takes over automatically. Stale locks free after ~30 s, and roster done-ticks take the lock briefly. The leader can't end / start the turn while a teammate has a sheet open (it names who).
  - **Enemy team:** shown in **its own colours**, with **health words / colours only** (Healthy / Damaged / Critical / Destroyed). The detail pop-up shows per-limb colours with no numbers, and enemy events are hidden.
  - **Server:** every key keeps a single writer — player entries (each player), settings (host), team roster / turn (leader), unit state (lock holder, or the leader when unlocked), locks (claimed with only-if-new). Replies send only what changed (tracked by version tags), and seat tokens are never sent.
  - **Tested with four simulated devices:** the full flow, locks, takeover, turn handover, reload, leader handover. The solo test suite still passes.
  - **Known limitations:** offline sheets are view-only in a session; leadership can't be handed over manually yet; the host can't send everyone back to the lobby from the UI yet.
- **mp4 — shield lending syncs** (Phenex, Kshatriya, Sinanju Zero):
  - **Receiver free:** lending / recalling briefly takes the receiver's lock, re-applies the change to its latest state (safe to repeat) and releases it.
  - **Receiver open on another device:** the action is refused up front with a message, and nothing changes.
  - **Lost race** (receiver opened at the same instant): the action is undone on both units, AP and shield HP included.
  - **Tested with three devices:** a lend arrives everywhere and the lock is released; a recall is refused while the receiver is open, then works and brings the damage home; a race is fully undone. Only `index.html` and `sw.js` changed.
- **mp5 — lobby colours:** the lobby used the colours of the side last played solo (e.g. all red while on the Federation team). It now follows **the team you picked in the lobby**: neutral grey before picking, **blue on Federation**, **red on Spacenoids**, switching instantly on a swap. Each team's Join button always uses that team's colour. Leaving the lobby restores the device's normal side colours. Only `index.html` / `sw.js` changed
- **mp6 — shield deliveries into an open sheet** (designer request):
  - **Delivering instead of refusing:** when the receiver is open on a teammate's device, the lend is no longer refused. It goes into a **delivery box** (`inbox/<team>/<uid>/<id>`, written once by the sender).
  - **Receiving:** the device holding that unit's lock applies it, pauses the sheet for ~1.5 s with "⇣ Receiving … from …", saves, and clears the delivery.
  - **Recall:** the holder's device sends the shield back with its **current HP** (a `return` delivery to the lender).
  - **Why not take the lock:** the holder may have changes still in flight, which would be lost.
  - **Dropout:** if the holder's device drops out, the delivery waits until the lock is stale (~30 s), then the sender (or the leader) collects it.
  - **Server order:** unit writes → collect deliveries → releases → lock claims → new deliveries.
  - **Tested with three devices:** delivery in 0.84 s with the pause and no duplicate; recall returned 14 of 18 HP (damage kept); dropout pickup after ~30 s. All three files changed.
- **mp7 — speed (from the latency review):**
  - **Timings:** a change is sent **75 ms** after a tap; checks run every **400 ms** while active, **1 s** when quiet, and **3 s** after 10 min with no changes. Checks are scheduled from the start of each request (request time no longer added on top), with a 120 ms minimum gap, still one request at a time, and paused while hidden.
  - **Server:** parallel unit / release / delivery writes (order between steps unchanged), the second storage listing skipped when nothing was written, and timings returned with each reply.
  - **Timing panel:** 5 taps on the MP chip, or `?mpdebug`.
  - **Also fixed:** the lobby redrew on every check (now only when its contents change — avoids lost taps); the 10 s "still here" refresh counted as activity (kept the lobby fast and blocked idle); teammates briefly showed "your turn" before the leader's data arrived.
  - **Measured locally (no network):** a change reached the other device in **0.28 s** median (max 0.33) during play (mp6 ~0.5 s); ~0.3 s when quiet; 1.4 s for the first change after idling; shield delivery 0.24 s. **Real devices add network time** — use the timing panel. The functions region was switched to **Singapore** by the designer.
  - **Cost:** ~8–9 credits per device per active hour; a 4-player 3-hour game is ≈100 credits (5,000 / month plan).
  - **Update:** all three files changed.
- **mp8 — roster picks as fast as sheet changes:** devices watching the leader build only counted their own changes, enemy changes or an open sheet as activity, so roster picks arrived at the relaxed 1 s rate (~1.1 s, while shield swaps on an open sheet felt instant). Now checks stay fast while either roster is unconfirmed, and teammate changes count as activity. Measured with picks 12 s apart: teammate 1.08 s → **0.33 s**, enemy panel 1.08 s → **0.41 s**. `index.html` / `sw.js` only. *(Light testing: targeted two-device check; full multiplayer suite not re-run.)*
- **mp9 — session data moved to Singapore:**
  - **Real-device finding:** 2–3 s syncs, with the timing panel showing **server 200–2000 ms**.
  - **Cause:** site-wide Blobs stores do **not** follow the Functions region. Without a `region` option the data sits in Netlify's default region, so every storage call from the Singapore function crossed the Pacific.
  - **Fix:** the store now uses `region: "ap-southeast-1"` under a fresh name (`msb-battles-sin`), and the function is pinned in code with `config.region: "sin"`, so they can't drift apart. Sessions still survive redeploys (a site-wide store, not a per-deploy one). The timing panel shows the store region.
  - **Update:** all three files; start new sessions afterwards. *(Light testing: local API + two-device roster check.)* **To verify on real devices:** server time should drop to tens of ms.
- **mp10 — fix "you are no longer in this session" (mp9 regression):**
  - **The failure:** with the site-wide store pinned to `ap-southeast-1`, Netlify's listing of that store came back empty in production, so a new session couldn't find its own player → 403. It couldn't be reproduced on the local test server.
  - **Storage:** now a **per-deploy store** (`getDeployStore`) by default, which Netlify places in the function's region. **Trade-off:** redeploys end running sessions.
  - **Store mode setting:** `MSB_STORE_MODE` = `deploy` / `site-region` / `site-default`, changeable in the Netlify UI without new code.
  - **Server safeguards:** a listing that misses the caller's player is re-checked by direct read (no false kick-out); a listing missing the session's own meta returns 503 (the device retries instead of wiping its board); a storage setup failure returns a clean error.
  - **Timing panel:** shows the store mode.
  - *Tested:* local API and the four-device team test on the per-deploy store. **To verify on real devices:** sessions start, and server time stays low.
- **mp11 — back to the reliable store:**
  - **The failure:** mp10's per-deploy store also returned **incomplete listings on the live site** ("Storage listing incomplete"); both regional options (mp9, mp10) fail on Netlify's live servers, even though they work on the local test server.
  - **The fix:** default is `site-default` again (the mp3–mp8 store: reliable, but in Netlify's default region, far from Asia). The regional modes stay available via `MSB_STORE_MODE`, but should be avoided. The mp10 safeguards stay.
  - **Immediate workaround without new code:** set `MSB_STORE_MODE=site-default` and redeploy.
  - **Conclusion:** on Netlify, fast sync from Asia isn't achievable with Blobs listings. **Cloudflare (live connections + per-session rooms) is the path to speed** — the designer has an account, domain and a new repo ready; the move is paused at the designer's request.
- **☁️ Cloudflare version — `gunpla-battle-cf` (build cf1):**
  - **Why:** mp11 on Netlify still fluctuated 1–2 s from Asia (Netlify's storage listings are only reliable in its default region, and functions can't push).
  - **Architecture:**
    - **Worker:** serves `public/` and routes `/api/sync` (create / join / sync / leave) and `/api/ws` (live WebSocket).
    - **One BattleRoom Durable Object per session code:** SQLite-backed, whole session held in memory, one message at a time; alarm-based 24 h expiry; hibernation plus automatic ping / pong.
    - **Same data model and write rules** as mp11: players, host settings, leaders, locks, unit states, deliveries.
  - **Sync:** when anything meaningful changes, the room pushes `{type:"changed"}` to the other devices, which fetch their update over the same connection. A backup check runs every 5 s while the link is open (it also keeps "seen" and lock liveness fresh). If the link is down, the app falls back to ordinary requests with the old adaptive timings.
  - **Connection handling:** reconnect with back-off (0.5 → 8 s), a heartbeat every 15 s (a link silent for 35 s is treated as dead), reconnect when the app becomes visible again, and close codes 4000 (session ended) / 4001 (left).
  - **Timing panel:** adds live link state, pushes and reconnects.
  - **Tested locally with Wrangler** (real Workers runtime):
    - **Flows:** the four-device team flow; deliveries and dropout pickup; host ending the session closes every connection.
    - **Speed:** lobby changes reach other devices in **~55 ms**, roster picks ~0.13 s.
    - **Recovery:** reconnect after a closed connection; catch-up after going offline.
  - **Setup:** `Cloudflare_Setup_Guide.md` — import the repo in Workers & Pages (Worker name `gunpla-battle` must match `wrangler.toml`), deploy with `npx wrangler deploy`, add the custom domain. SQLite-backed Durable Objects work on the Free plan.
  - ✅ **Deployed by the designer** on Cloudflare (Workers Paid plan, custom domain). Real-device test: **near-instant updates**.
  - **Still to check on phones:** lock screen for a minute, Wi-Fi ↔ mobile data, airplane mode on / off (the live link should return to *open* and the board catch up).
  - **cf2 — over-budget teams ask the host:**
    - **Request:** in a team game, a leader over budget sends **"Ask the host for X DP"** instead of changing the limit locally.
    - **Host decision:** the host gets an Accept / Decline pop-up on any screen. Accept raises the limit for **both teams** and everyone gets a notice; the requester gets **Confirm team ▸**. Decline tells the requester to edit their team.
    - **Host over budget:** the host raises it directly for both teams.
    - **Room:** new keys `req/<pid>` (requester) and `res/<pid>` (host answer).
    - *Targeted test passed* (decline, accept, confirm, host raise).
  - **cf3 — who controls what:** on your own team's (confirmed) roster, a unit whose sheet a teammate has open gets a tag ("🔒 Dan") and an outline in that player's colour (12-colour palette picked from the player ID); tags update live as sheets open and close. No tags on enemy rows. Plain CSS (no colour-mix), so it works on older iPads. `index.html` / `sw.js` only. *Targeted test passed.*
  - **cf4 — turn order + flicker:**
    - **Turn order:** the room keeps **one official turn order** (key `turn` = active team + sequence, set from the host's first-turn choice at battle start). Only the active team's leader can end the turn, once per turn (stale / double presses are refused, and a refused end is undone locally). The other team's box reads "⏳ Waiting for the … to end their turn". The Start prompt follows the official order. A leader device that disagrees with the room corrects itself. Undo after ending a turn and New game are hidden in team games. The old "both teams say it's their turn" warning is gone.
    - **Flicker:** the roster, turn box, enemy panel and unit list only redraw when their content changed, and columns aren't re-laid when already arranged (moving rows restarted their animation). 0 extra rebuilds after closing a sheet.
    - **Note:** sessions started before cf4 have no official turn order — start a new session.
    - *Targeted tests passed; the four-device flow and DP requests still pass.*
  - **cf5 — ⚓ warships in the app** (priority #3 ✅ first version):
    - **Artwork:** the designer's Canva ship sheet (blue / red versions) measured at 1920×1080 and rebuilt in code with the suit sheets' styles and colours. The four green wireframes were converted to white cut-outs (`img/ship-*.webp`, ~225 KB each) and tinted per side.
    - **Sheet layout:** a ring per part, placed on each ship's own features (Hull, Bridge, Thruster 1 / 2, one per weapon system); weapons list (short name + "Twin mega particle · arc", DMG, tap-to-fire AP, range); Crew / AP steppers and a Movement readout; abilities table; name panel with dial.
    - **Automatic rules:**
      - **Bridge hit:** −2 crew and "−3 next turn"; Bridge 0 takes all weapons offline and sets movement to DRIFT.
      - **Thrusters:** one down halves movement (e.g. 7.5cm); both down immobilise the ship.
      - **Weapon systems:** OFFLINE at 0.
      - **Damage Control:** 2-turn repairs, only while crew is 9+ (cruisers never).
      - **Cooldowns:** a weapon sits out the full turn(s) after firing (main guns 1 turn, Anti-Ship Missile 2 turns + 2 charges).
      - **Launch:** 1 AP for the full capacity, with an "aboard" counter and undo.
      - **Dock:** the suit is aboard at the start of the next own turn.
      - **Decoys:** 1 charge, lasting 3 turns.
      - **Also on the sheet:** base module and Last Stand info; Hull 0 = DESTROYED.
    - **In the app:**
      - **Unit list:** a "Warship" group that counts toward DP; roster rows show "Hull x/y".
      - **Multiplayer:** ships sync, lock and show read-only like suits; the enemy panel and detail pop-up show health words per part; ships can't receive lent shields.
    - **Rules kept as written (designer to confirm):** missile launchers / barrage have **no cooldown**; Rewloola's Secondary Gun drops to **1 target once its system HP is below 20**.
    - *Tested:* layout screenshots of all four ships, a rules walkthrough (damage, cooldowns across turns, Damage Control, launch / dock / decoy, low crew, destruction), a multiplayer ship check, and the four-device team flow.
    - **Next:** ground units (priority #4).
  - **cf25 — automatic turn start:**
    - **Auto-start:** when the other team ends its turn, the **leader's device starts ours automatically** — AP / dodge refills, cooldowns, ship upkeep, docking — and everyone on the team sees a green "The X ended their turn — your turn has started" notice (clears after 8 s). No Start press needed.
    - **Open sheets:** if a teammate still has a sheet open (e.g. entering enemy damage), the start waits. The leader sees "…as soon as Bob (GM #1) closes the open sheet", and Bob sees "…as soon as you close…". It starts the moment the sheet closes.
    - **Undo:** each turn change auto-starts only once. After Undo the green Start button is there for a manual start.
    - **No false notice** at battle start or after a reload.
    - **Bug fixed:** undoing a turn start counted as an *end* of turn (the end counter went up in `afterPhase`), so the room's safety net handed the turn to the other team. The counter now only rises in `endMyTurn`.
    - *Tested:* a three-device walkthrough (auto-start, wait on an open sheet, undo + manual start, notice timeout); the four-device team flow; three auto-started turn cycles.
  - **cf24 — fix:** Start My Turn stayed red (only the green glow showed) on the Spacenoid side — `body.spa .btn.enemyturn` outranked `.btn.big.startnow`. The green rule is now scoped to `#turnBox` and wins on both sides; the normal enemy-turn button keeps its team red.
  - **cf23 — lobby Federation look:** the blue wash made the bright RX-78 half look hazy / low quality. Federation pick now leaves the left half untouched and only dims the Spacenoid half; the Spacenoid red wash (looks good on the Zaku) is kept.
  - **cf22 — two visual fixes:**
    - **PLAY ONLINE card:** the two small faction pictures placed side by side left a visible seam mid-card. It now uses the two-hangar lobby art as one seamless background (dark fade behind the text).
    - **Lobby:** the page's 14/16px padding left bright strips beside and under the dark control band. The padding is removed while the lobby shows, so the band runs edge to edge and to the bottom (measured 0–1400px wide, reaching the page bottom on desktop and phone).
  - **cf21 — fix:** cf20 painted a wide blue/red wash over the PLAY ONLINE card (flattened the art, tinted the emblems). Restored the cf19 background; only a thin blue-left / red-right inner edge glow remains.
  - **cf20 — PLAY ONLINE card recoloured:** blue left / red right (outline, glow, RECOMMENDED tag) — no purple; subtitle light grey.
  - **cf19 — lobby pass 2:**
    - **Art:** the designer's updated background (glowing eyes).
    - **Centring:** everything shares the screen's centre line (session code, VS, Ready, host settings, Start battle, menu buttons — pixel-checked on desktop and phones). The dock is one centred column; host settings is a clean framed box with Deployment points | Who goes first side by side (stacked on phones). The page fits the screen without scrolling.
    - **VS pillar:** a glowing "VS" with each team's player count.
    - **Team-pick animation** (only when *you* pick or switch; toned down for reduced motion):
      - **Sweep:** a side-coloured light sweep across the screen.
      - **Banner:** a big "FEDERATION / SPACENOIDS — SIDE JOINED" slam-in.
      - **Panel:** lock-on (corner brackets close in, pop, scan flash).
      - **Idle:** slow scan lines on the panels; joinable cards lift on hover.
  - **cf18 — lobby redesigned on the designer's two-hangar art** (`img/lobby-bg.webp`: RX-78 / blue banner left, Zaku / red banner right):
    - **Session:** code at the top on the centre pillar.
    - **Team panels:** glass panels on each half, bottom-aligned so the suits stay visible. The Federation panel is left-aligned, the Spacenoid panel mirrored. Tap a card to join; TAP TO JOIN / YOUR TEAM tags.
    - **Picked side:** it lights up in its colour (blue / red wash), and the other side dims.
    - **Bottom dock:** Ready, host settings (DP, first turn, Start battle) or "set by the host", Main menu / Leave / End session.
    - **Sign-in screen:** the same art with a glass panel.
    - **Phones:** upright stacks the panels under the art; sideways keeps them side by side.
    - *Tested:* four desktop states, phone upright and sideways; the four-device team flow still passes.
  - **cf17 — new landing page (online first):**
    - **First screen:** the same hangar art / logo, "CHOOSE HOW TO PLAY".
      - **PLAY ONLINE** (top, larger, RECOMMENDED, both emblems): shows "SESSION CODE · LIVE — TAP TO RETURN" while in a session.
      - **PLAY OFFLINE** → the existing faction menu; shows the saved offline battle.
      - **Bar:** Continue offline / Quick reference / Install app.
    - **Hangar doors** on every menu route: landing ↔ online, landing ↔ offline, lobby / session entry / roster Menu → landing. The offline menu's Multiplayer shortcut became **Main menu**, and the budget page's back button now says "← Factions".
    - **Lobby:** each team column is headed by the offline menu's **faction card** (art, emblem, motto, player count, 👑 leader). Tap the card to join (TAP TO JOIN / YOUR TEAM tags).
    - *Tested:* desktop, phone portrait and landscape, every transition, team join via card, live-session card; the four-device team flow and turn cycle still pass.
  - **cf16 — Bridge hits counted per attack + typed damage (designer chose A + C):**
    - **A. HIT button** beside every Bridge ring (below it on the Rewloola). The ring now only changes HP.
      - **Tap:** once per attack that hit the Bridge → −2 crew and "−3 to rolls next turn". The button shows **HIT ×n** for this turn; ↶ undoes a hit (crew back, log entry removed).
      - **Reminder:** pulses **amber** when the Bridge lost HP this turn but no hit is recorded. The count resets each turn.
    - **C. # chip** on the damage bar (every sheet): a keypad / number field to type any amount (e.g. 14); the chip then shows that number and stays selected.
    - *Tested:* 14 in one tap and 10 + 4 cost no crew until HIT; HIT ×2 / undo ×2; next-turn reset; a typed amount on a suit sheet; placement on all four ships.
  - **cf15 — two ship sheet bugs** (designer screenshot):
    - **Suit leftovers:** switching from a suit sheet to a ship sheet left the suit's HP circles, MOVE/DODGE box, stats and buff strip on screen. The ship sheet now clears the suit's pieces too (0 leftovers in testing).
    - **MOVE centring:** the hidden undo button took up space and pushed MOVE left. MOVE is now centred exactly under the Movement box on all four ships, with ↶ beside it.
  - **cf14 — ship rules part 3 (designer answers):**
    - **Half HP:** a two-target gun **fires once** — one shot, one target, no stacking (main guns 12 ×1, Rewloola secondary 5 ×1; amber "FIRES ONCE").
    - **Anti-Air Array works without the Bridge** (independent turrets); every other weapon still goes offline at Bridge 0.
    - **Bridge hit** = 2 crew per hit (kept). **Damage Control** = back at full HP after 2 turns (kept).
    - **☢ button** is only for applying blast damage to *this* unit — the weapon choice was removed. One table for every nuke.
      - **Suits:** 15 / 10 / 5 to all 6 locations. Verified: the Ra Cailum Anti-Ship Missile (Section 13.5) and the GP02A Atomic Bazooka (ability text) match.
      - **Warships:** 40 Hull + Bridge & both Thrusters disabled / 25 / 10 Hull, from any nuke.
    - ⚠️ **Rules chat hand-off:**
      - **(1)** Section 13.5 Bridge HP: "loses all weapons" → "loses all weapons except the Anti-Air Array".
      - **(2)** Half-HP rule wording: "fires once — single shot, one target, no stacking" for all twin main guns + the Rewloola Secondary Gun.
      - **(3)** The GP02 Atomic Bazooka entry should state the warship damage (40 + Bridge & Thrusters / 25 / 10).
      - **(4)** Missile Launchers / Missile Barrage 1-turn cooldown (from cf12).
    - **Still open:** Salamis Kai with only one target in range (fire one barrel, or not at all?).
  - **cf13 — ship rules part 2 + nuke button:**
    - **Launches:** a ship may **launch several times per turn** — each launch costs 1 AP and sends up to the ship's capacity. ↶ undoes the latest launch (AP back); the row shows "ABOARD x/y · n OUT".
    - **No launch-then-dock:** a suit launched this turn can't be picked for docking until your next turn.
    - **Docking timing confirmed:** "aboard after the enemy's next turn has fully ended" = the app moves it aboard when you tap Start My Turn.
    - **☢ nuke button** on the damage-amount bar of every sheet → pick the weapon (Ra Cailum Anti-Ship Missile / GP02A Atomic Bazooka), then the distance band.
      - **Suits:** 15 / 10 / 5 to all 6 locations (block note shown).
      - **Warships:** 40 Hull + Bridge & both Thrusters disabled (Damage Control countdown if active) / 25 / 10 Hull.
      - A destroyed carrier opens Emergency Disembark. Each weapon keeps its own damage table (`NUKES`), ready for future nukes.
    - ⚠️ **Designer to confirm:** GP02's Atomic Bazooka vs warships is assumed to match the Anti-Ship Missile (same Mk-82 warhead) → rules chat.
    - **Fix:** both thrusters down now shows *immobilised* even when the Bridge is down; Bridge down + one thruster = drift at half speed.
    - **Still open:** stacking at half HP; Salamis with one target; Bridge 0 and the AA; Bridge-hit crew per tap; Damage Control timing.
  - **cf12 — ship rules confirmed by the designer (part 1):**
    - **Missile Launchers** (Musai, Salamis Kai) and **Missile Barrage** (Rewloola): **1 full turn cooldown**.
    - **Every gun that can shoot 2 targets** (all Twin Mega Particle main guns + Rewloola Secondary Gun) can only shoot **one target once its system is at half HP (10 of 20 or less)** — amber "1 TARGET" flag + "1 target only" on the sheet.
    - ⚠️ **Rules chat hand-off:** update Section 13.5 — add the 1-turn cooldown to the three missile systems; replace Rewloola's "reduced to 1 target if the system is damaged" with the half-HP rule, and add it to every twin main gun.
    - **Still open** (current app behaviour kept):
      - **(a)** Stackable main guns at half HP: 1 target *with both barrels stacked* (24), or a single barrel (12)? The Salamis Kai can't stack — one barrel (12)?
      - **(b)** Salamis Kai with only one target in range: fire one barrel, or not at all?
      - **(c)** Bridge at 0 also takes the Anti-Air Array offline?
      - **(d)** Bridge hit costs 2 crew per ring tap — keep, or a separate "Bridge hit" button? Does a hit on a Bridge at 0 still cost crew?
      - **(e)** Damage Control timing = two of your own turn starts?
  - **cf11 — ship sheet MOVE + clearer centre column:**
    - **MOVE control** under the Movement box, like the suit sheets: 1 AP per move, ↶ undo with a counter, logged as "Moved N× (Xcm, N AP)". Movement is halved with one thruster down, "straight" with no Bridge, and the button is disabled when immobilised, out of AP, destroyed or in the enemy turn.
    - **Labels:** CREW / AP / MOVEMENT now sit **above** their boxes, larger and brighter.
    - *Targeted test passed.*
  - **cf10 — cleaner Musai / Rewloola portraits** (designer's transparent versions); build bump so cached devices fetch them.
  - **cf9 — turn notice + Start button:**
    - **Notice:** the "other team ended their turn" notice was rebuilt on every sync, restarting its animation (flicker). It now only redraws when its text changes, and is **message-only** ("start your turn with the green button below", ✕ to hide).
    - **Start button:** the single big **Start My Turn** button turns **green with a pulsing glow** whenever the room says it's your turn to start (steady glow with reduced motion).
    - **Bug fix (found while testing):** a team leader's device prepared its blank roster on the first sync *after* entering the battle — anything added or confirmed before that sync was wiped. It now prepares it the moment the device enters.
    - *Tested:* 0 notice rebuilds in 6 s; green pulse and state reset after starting; team flow, turn cycle and carrier team check still pass.
  - **cf8 — carriers (passengers, launch, dock):**
    - **Load step:** Confirm team with a ship → **Load your carriers** screen (ship tabs with photos and slot pips, suit cards, tap to load / unload). Rulebook rule enforced: carriers must be filled to capacity unless you run out of suits. Auto-load / Clear / Back / Confirm & deploy.
    - **Roster:** passengers greyed with a purple **⚓ ABOARD · SHIP** tag. No done tick, left out of the turn count and the "hasn't moved" warning. Tapping one opens its ship. They can't receive lent shields.
    - **Launch** (ship sheet): pick up to the ship's launches per turn; 1 AP; tap again to undo that turn's launch. Launched suits get **🚀 LAUNCHED** and, on their sheet, the purple **CATAPULT LAUNCH — FREE BOOST, MAY ATTACK** strip with +10cm movement (purple) for that turn.
    - **Dock:** pick a suit on the board; 1 AP; **⚓ DOCKING** until the start of your next turn, then aboard. The ✕ cancels the latest dock (AP refunded only in the same turn).
    - **Emergency Disembark** when a carrier's Hull hits 0 with passengers: Grunts are destroyed automatically, others choose their d20 result (1–3 destroyed, 4–8 −5 all, 9–14 −3 all, 15–20 clean). Damage is applied to the suits (synced through a brief lock in team games).
    - **Enemy panel:** enemy passengers marked ⚓ ABOARD.
    - **Data:** passenger lists live in the ship's state (`carry`, `launched`, `docking`), so they sync with the ship.
    - *Tested:* the solo walkthrough of every step, plus a team check (teammate / enemy views, launch seen by teammates).
  - **cf7 — roster tabs + grand ship picker:**
    - **Tabs:** big **MOBILE SUITS · SHIPS · GROUND UNITS** tabs (icons + counts; Ground shows "SOON") filter your roster / deployed force, the unit picker and the enemy panel. The choice is remembered.
    - **Ships tab:** large cards for your side's warships — photo, class, name, Hull / AP / Move / Hangar / Crew, weapon and ability tags, DP, "×n in force", **Add to force**.
    - **Ground Units tab:** hazard-striped **UNDER CONSTRUCTION** notice.
    - **Photos:** the designer's ship photos (white backgrounds cut out on Musai / Rewloola) are now the ship portraits — roster rows, cards and the sheet dial.
    - **Fix:** since cf4, adding a unit flattened the unit list out of its columns (a stale layout flag) — the list is now re-laid after every rebuild. Ships no longer appear mixed into the suit list.
    - *Light testing:* tab / picker / notice checks, phone layout, enemy panel filtering.
  - **cf6 — stuck turn fix** (designer report: stuck on "Waiting for the Spacenoids…"):
    - **Finding:** the normal flow worked in testing. The likely cause is a device on an older cached build, or one outside the team game, ending its turn locally without telling the room.
    - **Room fix:** the room now records each team's end-of-turn count from its team saves (included since mp1) and passes the turn when the active team's count rises while it shows the enemy turn — even without the explicit message. The count only starts being tracked for battles started on cf6.
    - **Builds:** every device reports its build; the lobby shows builds and warns on a mismatch; the waiting message names a leader on another build.
    - **Host override:** a host button gives the turn to a team (works on older sessions too).
    - **Refusals:** a refused end-turn is only undone if the room still says it's that team's turn.
    - *Tested:* normal cycle, an old-build device (turn passed automatically), a lost end (host button).
  - **Sheet control (designer question):** control passes when the holder closes the sheet, or after 30 s if their device drops out; an open sheet on an online device never expires. **Possible addition:** a "Request control" button (holder gets Hand over / Keep, auto hand-over after ~20 s). **Testing tip:** a private / incognito tab counts as a separate player, so two phones can give three players.
  - **Going forward:** the Cloudflare repo (`gunpla-battle-cf`) is the **main app** for all new work (warships, ground units, campaign). `msb-mp` (Netlify) and `msb-app` (solo v95) are frozen; retire them once cf1 has held up for a game night or two.
- **Testing approach (agreed):** light checks while a feature is being shaped; full multiplayer + solo testing once the designer says a feature / batch feels good.
- **Next:** deploy and test on two real devices; then consider read-only opponent sheets, and keeping `msb-mp` in step with future `msb-app` changes (both are copies of the same app — decide later whether to merge them)

## Xi Gundam moved to Spacenoid (v95)
- **Designer decision:** the Xi Gundam is **Spacenoid** (it fights the Federation in *Hathaway*), not Federation. It now appears only in the Spacenoid list with a red sheet; build code number unchanged (29)
- **Blueprint:** Gundam (added to the Spacenoid Gundam designs alongside GP02A Physalis) — switching it to the Sazabi blueprint is a one-line change
- `units.json` synced: Xi → spacenoid, Delta Zayin → federation (v69), Wing Zero Custom added (v85)
- Federation teams already saved with Xi keep it, but it can no longer be added on that side
- ⚠️ **Hand-off:** rules chat / printed Master Roster — Xi Gundam is Spacenoid; PPTX — red sheet if the printed set is kept

## App — Safari fix: units in the 2nd / 3rd column couldn't be tapped (v94)
- **Cause:** the roster and unit lists used CSS multi-column layout to flow into 2–3 columns. Safari (every iPhone / iPad browser) doesn't register taps outside the first column once the rows have clipping, portrait frames or entrance animations
- **Fix:** the app now builds **real columns** itself — 3 on wide screens (≥ 1180 px), 2 on tablets (≥ 640 px), 1 on phones — keeping the same top-to-bottom order, never leaving a tier heading alone at the bottom of a column, and giving extra rows to the first columns (4 models = 2 / 1 / 1). Rebuilt on every refresh and when the screen is resized / rotated; multi-column layout is switched off everywhere
- Checked in Chrome: every row in every column is tappable (real taps on the last unit of each column add it), order unchanged, resizing re-splits. **Needs a quick re-check on the designer's Safari device** (Safari can't be run here)

## App — Budget picker redesign (v91–v93)
- The Deployment Points screen is now **centred and menu-style**: the side's emblem, a *FEDERATION* / *SPACENOIDS* heading with rules either side, a big **DEPLOYMENT POINTS** title, and the reminder that both players agree the total (rulebook Step 5)
- **Four large cut-corner budget tiles** (5,000 / 10,000 / 15,000 / 20,000) with big numbers and a small **size meter**; the current budget glows with a **✓ SELECTED** tag on its top edge (gold-rimmed on Spacenoid). Tapping a tile still goes straight to the roster
- **Custom** box with **SET ▸** underneath (a custom budget stays shown in the box), **← Main menu** centred at the bottom
- A row of four on wide screens, two-by-two on upright phones; fits without scrolling on desktop and phones. Entry animation: emblem drops in, title fades, tiles rise one after another
- No invented game-size names — the rulebook doesn't define standard sizes
- **v92:** picking a budget tile or setting a custom amount now goes to the roster **through the hangar doors** (an invalid custom amount doesn't trigger them)
- **v93 — clear jobs for the two menu buttons:** **ENTER THE BATTLEFIELD always opens the budget page** (it used to skip it whenever that side already had a budget saved — e.g. after clearing the team); **CONTINUE** still goes straight back to the saved roster / battle. The budget page now says what's already saved: *Team in progress: N models — pick a budget to keep building*, or *⚔ Battle in progress — N models, X DP. Tap your budget to return to it*; the current budget stays highlighted, so it's one tap back

## App — Gold limb rings on Spacenoid (v80)
- The rings around each body part's HP bubble on **Spacenoid** sheets now have **gold** arcs (with a soft gold glow), gold crosshair ticks and a faint gold dashed ring. The HP bubbles keep their health colours; Federation unchanged

## App — No confirming over budget (v90)
- **Confirm team** (and *Confirm team & open* on the confirm-first prompt) is blocked while the team costs more than the DP limit. Instead an **Over budget** pop-up shows the team's cost, the limit and how far over it is, with two ways out:
  - **Raise the limit** — a number box pre-filled with the team's exact cost, plus quick buttons for any preset that covers it (e.g. 10,000 / 15,000 / 20,000); **Raise to … DP & confirm ▸** sets the new limit and confirms in one step (a limit below the team's cost is refused with a message)
  - **Edit team** — closes the pop-up so units can be removed
- While over budget the **Confirm team** button turns **amber** instead of glowing green

## App — Confirm-first gate + DONE animation (v89)
- **No stat sheets before the team is confirmed** (designer kept opening sheets while building and thinking the missing DONE button was a bug). Tapping a unit in the builder shows **"Confirm your team first"** — why (sheets, DONE and the turn tracker need a confirmed team; *Edit team* still works afterwards), the model count / DP, and two buttons: **Keep building** or **Confirm team & open ▸** (confirms through the hangar doors, then opens that unit's sheet)
- While unconfirmed, the roster heading shows **⚠ not confirmed — tap Confirm team to play** and the **Confirm team** button glows green. Portrait taps (colour markers) still work before confirming
- **DONE animation:** tapping DONE ticks the unit immediately, punches a green **✓ DONE** stamp (with the unit's name) onto the sheet for ~0.6 s, then returns to the roster where that unit's row **flashes green**. Reduced-motion devices go straight back

## App — Transitions everywhere (v87)
Simple, quick animations so screens no longer jump instantly (all ~0.2-0.5 s; everything is skipped for reduced-motion devices):
- **Budget / roster screens** slide up gently; roster rows and budget chips ripple in one after another; the turn tracker and headings fade up
- **Main menu:** faction cards glide in from each side, the top taglines drop in, then ENTER THE BATTLEFIELD, the bottom bar and footer fade up
- **Stat sheets** fade in with a glowing **scan line sweeping down** the sheet (also when switching unit from the roster picker); the top bar drops in and the timeline fades up
- **Dialogs** (rule pop-ups, pickers, warnings, quick reference, colour wheel) fade their backdrop and pop the box in slightly
- **Turn banner:** ending your turn or starting a new one sweeps a banner across the middle of the screen — **ENEMY TURN** (red) / **YOUR TURN** (side colour, gold on Spacenoid) with the round number underneath. It never blocks taps and doesn't appear on load
- The hangar doors (v86) still handle the major changes; these cover everything else

## App — Hangar-door transition (v86, v88)
- **Two hangar doors** (steel panels, hazard stripes on the meeting edges and top / bottom, blinking status lights) slide in from the sides, meet in the middle, then open onto the new screen. The **team emblem** sits across the seam — half on each door — so it only reads whole when they're shut. Federation: blue steel, blue compass star; Spacenoid: dark gunmetal, gold ring, red crest
- **Timing:** ~1.2 s total (close ~0.45 s, short hold while the screen changes behind the doors, open ~0.45 s); taps are blocked while the doors move
- **Used for major changes only:** ENTER THE BATTLEFIELD and CONTINUE on the main menu, the ☰ Menu and ← Main menu buttons, Confirm team, and (v92) budget screen → roster. **Not** used when opening / closing unit sheets (that happens constantly during play) — easy to add if wanted
- Devices set to reduce motion switch screens instantly (no doors)
- **v88 fix:** the two halves of the emblem didn't line up (each door centred its half on its own edge, and the doors overlap slightly — ~10 px off on a laptop, ~20 px on a large screen). Both halves are now centred exactly on the screen's middle; measured 0 px offset on phone, laptop and 2560-wide screens

## New unit — Wing Zero Custom (v85)
- **Wing Zero Custom (XXXG-00W0)** — **Neutral, Myth tier, 3000 DP**: an **exact copy of Wing Zero's stats and abilities** (only the name differs; inside its own rules text "Wing Zero" now reads "Wing Zero Custom")
- ✅ Stat block added to `Gunpla_Unit_Stat_Blocks.md` (right after Wing Zero)
- ✅ In the app: available to both sides, blue sheet, Gundam blueprint, its own portrait; checked that its sheet draws and every AP tap behaves identically to Wing Zero's
- ✅ Build code **unit number 50** (`Build_Code_System.md`)
- ⚠️ **Hand-off — rules chat:** add Wing Zero Custom to **Appendix A** (Built Unit Roster, Myth tier, 3000 DP)
- ⚠️ **Hand-off — PPTX chat:** a printed sheet for Wing Zero Custom (clone of Wing Zero's slide, renamed) if the printed set is still being kept up

## App — Colour markers (v82–v84)
Designer idea: mark each model with a coloured pip in the app and a matching **post-it on the real model**, so copies of the same unit (GM #1, GM #2…) are easy to tell apart on the table.
- **Colour wheel** — 12 colours (red, orange, yellow, lime, green, teal, cyan, blue, indigo, purple, magenta, pink) around the unit's portrait; **No marker** clears it; **Skip** / **Done** closes it
- **Opens when:** you **tap a portrait** (roster rows, deployed force, or the stat sheet's name panel), or you **add a second copy** of a unit in the builder — it then walks through every copy that has no colour yet (GM #1, then GM #2; Skip moves to the next)
- **No clashes:** a colour already used by another copy of the same unit is dimmed, labelled with that copy's number (*#1*) and can't be picked
- **The marker** is a small coloured dot with a white rim on the **top-right of the portrait** — roster rows, deployed force and the sheet's name panel — and beside the name in the in-sheet roster picker. Saved with the model, so it survives reloads
- Tapping a roster portrait opens the wheel instead of the sheet (tap the rest of the row to open the sheet)
- **v84 — clearer step-by-step marking:** a step label (**MARKING 1 OF 2**), a big title with the copy number highlighted (**GM #1**), the copy number as a badge on the portrait, and a row of **copy chips** under the wheel (the one being marked glows and pulses, marked ones show their colour, tap a chip to switch). After each pick a short confirmation (**✓ GM #1 · Red · next: GM #2**) shows for under a second, then the dialog slides on to the next copy
- **v83:** the marker also shows beside the unit's name in the **unmoved-units warning** list, in every **timeline entry**, and in the **Damage taken** summary line

## App — Table side bars (v81)
- The skill and weapon tables now carry the same glowing **side accent bar** as the name panel, on their left edge below the header — **gold on Spacenoid, blue on Federation** (it uses the same colour setting as the name panel's bar, so the two always match)

## App — Gold limb-ring accents on Spacenoid (v80)
- The target rings around each body part's HP bubble on Spacenoid sheets now have **gold arcs and gold crosshair ticks**; the dashed outer ring stays **red**. HP bubbles keep their health colours. Federation unchanged

## App — Turn markers (v79)
- **Bug:** the turn markers (the T1 / T2 blocks on the roster's turn tracker and in the timeline strip under each sheet) were clipped into a slanted shape, which cut the white "selected" outline along the angled ends
- **Fix:** the markers are now **slanted** instead of clipped, so the outline bends with the shape and stays whole; the event-count badges are tilted back so their numbers stay upright. Tapping a marker still selects it

## App — Outlines that follow the cut corners (v78)
- **Bug:** END MY TURN (and every angled app button, the We do / Enemy and budget chips, and the "x / y done" counter) lost its glowing outline along the angled corners — clipping the shape also sliced the border
- **Fix:** these are now drawn in two layers — an outline shape underneath and the fill 1px inside it on a solid base — so the outline runs round every corner, on both sides and on the sheets
- **Ready state:** when every unit is done, END MY TURN pulses a **green glow that traces its shape** (it used to fade the whole button, text included); off for reduced-motion devices
- The ✓ on selected chips is now part of the text; the "all done" counter shows green text on a dark-green fill; the Custom DP and search boxes are plain rectangles (clipping cut their outlines too)

## App — AP picker colours (v77)
- The AP picker (two-cost weapons like "1-2", RAPTOR pods' "2 / Free") was fixed navy / light blue. It now follows the sheet: **red outline on Spacenoid, blue on Federation**, dark sheet-coloured fill, white text; options you can't afford turn **grey and crossed out**; pressed option fills with the accent colour
- Reminder: a RAPTOR pod's picker only opens once that pod is **deployed** (by design)

## App — Grid back; full breathing (v76)
- **Grid:** it was drawn behind the frame, and since v72 the Spacenoid frame had its own solid background covering it (Federation's was only very faint). The grid is now its own layer inside the frame, above the background and the glow, on both sides — fine lines every 2.5% plus a brighter major line every fourth cell
- **Breathing light** restored to the v70 strength: large centre glow cycling ~7% → ~30% over 6.5 s, plus the two fainter glows on an 8 s offset cycle

## App — Blueprints pop more (v75)
- Both sides: the model shows at **92%** (was 66%), lines are **brighter** (light blue #a5e4ff / bright red #ff6b76) and drawn **twice** for bolder strokes, with a **tight** glow hugging the lines (no wide blur). Measured bright line pixels: Federation ~28k → ~45k, Spacenoid ~6.5k → ~35k
- Readability over the brighter lines: limb / section / stat labels get a dark outline; the **HP** labels are now white with a dark outline (the accent-coloured ones blended into the lines)

## App — Less haze (v74)
- **Why it looked smoky:** the page background and the see-through panels were almost the same dark grey (no separation), with a large red breathing glow, a baked-in blur on the blueprint and glow shadows on most text layered on top
- **Fix:** **darker page** (about 4-6% above black, red glow kept in the middle) with **lighter, near-solid grey panels** on top, so each layer separates; breathing light smaller and fainter (peak ~12%, the second glow pair removed); blueprint glow tightened and its lines slightly stronger; glow shadows on labels, stats and AP values replaced by a crisp dark shadow; no inner smoke shadow on the tracker / dialogs; grid fainter. Colours unchanged. Preview: `Spacenoid_theme_preview.png` (v73 vs v74)

## App — Turn tracker / dialog shape (v73)
- **Bug:** the turn tracker (and pop-ups, pickers, quick reference) used the kit's notched, angled panel shape. Clipping to it cut the 1px outline at every angle — odd diagonal gaps — and trimmed any outer glow
- **Fix:** plain rectangle with a whole outline, a soft outer glow and **HUD corner brackets** (gold on Spacenoid, blue on Federation); nothing is clipped any more

## App — Spacenoid dark grey → red; name panel fix (v71–v72)
- **Colours (v72):** v69's pure black was too heavy and v71's darks too soft. Now **dark greys about 8-15% above black fading into deep red**, with the **see-through** tables, name panel, dock plates, roster rows and dialogs kept. Blueprint model is **red** (gold only as trim). Preview: `Spacenoid_theme_preview.png` (v70 vs v72)
- **Name panel (v72):** moved right (65.6% → 96.6%, still inside the corner bracket) so it no longer sits over the blueprint's head; the portrait moved with it
- **Name / DP cut-off fixed:** the name's text box used to run down into the DP line on every sheet, clipping two-line names and low letters. The name now has its own band above DP (clear gap), is centred vertically, and starts under the *MOBILE SUIT //* label with about a third more width, so long names shrink less. Checked on all 49 sheets at desktop, iPad and phone: no clipping, no overlap with DP or the portrait, everything inside the panel

## App — Breathing light on the sheets (v70)
- A soft glow in the sheet colour sits behind the middle of every stat sheet (plus two fainter ones behind the tables and the stat column) and slowly brightens and dims — a 6.5 s and an 8 s cycle, offset so it never pulses in lockstep. Subtle: roughly a 25-40% brightness swing in the background only. Opacity-only animation (cheap on battery), never catches taps, and held still for reduced-motion devices

## App — Spacenoid gold blueprints, more black; Delta Zayin to Federation (v69)
- **Spacenoid sheets:** the blueprint model in the middle is **gold** again (the rest of the theme stays red); **more black** — near-black table headers, table fill, hex frames, name panel, portrait frame, dock plates, top bar, timeline, roster rows, turn tracker, dialogs and buttons
- **Delta Zayin is now a Federation unit** (designer decision): it appears only in the Federation list, uses the **blue** sheet and the **Gundam** blueprint (Federation non-grunt rule). A Spacenoid team saved with Delta Zayin in it keeps it, but it can no longer be added on that side
- ⚠️ **Hand-off:** if the printed Master Roster / stat sheet or any rules text shows Delta Zayin as Spacenoid (or on a red sheet), update it to Federation / blue

## App — Portrait scanline (v68)
- The full-page scanline sweep on the stat sheet is gone; instead a thin glowing scanline sweeps down the **unit portrait** in the name panel (every 2.6 s, in the sheet colour). Off for reduced-motion devices

## App — Spacenoid colours: red + dark, gold trim (v67)
Replaces the red / black / gold mix (which leaned heavily gold).
- **Red (#ff4d5a) on near-black** everywhere on the Spacenoid side: roster, turn tracker, buttons, chips, pop-ups, the sheet frame lines, blueprint model, AP values, MOVE / DODGE, dock buttons, undo arrows
- **Gold (#e2b04a) only as trim:** panel side bars, the sheet's corner brackets, hazard stripes, dock centre marks, the coverage dial's centre, and **YOUR TURN** + your turn markers (so your turn never looks like the red ENEMY TURN)
- Backgrounds darker and less brown; health colours (green / amber / red) and warnings unchanged
- Federation is unchanged

## App — Roster portraits + hangar backgrounds (v62–v63)
- **Portraits** on every roster row (available units, your roster, deployed force — larger when deployed), in cut-corner frames. Stored at 192 px (`img/portraits/<name>.webp`, ~17 KB each) and linked to the unit by a `portrait` entry in the unit data; saved for offline use
- **Units without a portrait** show a **placeholder**: the same frame holding a faint crop of their blueprint model (Gundam / Sazabi / Zaku / GM) — they switch to the real picture as soon as it is added
- **Backgrounds:** the budget and roster screens use the designer's hangar art — **blue hangar (Nu Gundam) for Federation**, **red hangar (Char's Zaku) for Spacenoid** — darkened on the left / bottom behind the lists; the old emblem watermark is dropped (the art has its own banners)

- **v63 — portraits on the stat sheets too:** the animated rings beside the unit name are gone; the unit's **portrait** sits there in a cut-corner frame inside the name panel (blueprint placeholder for units without one yet). The name's space was narrowed slightly so long names never touch it — checked on all 49 sheets, phone and desktop

### Portraits — ✅ complete: all 49 units (v66)
Added in four batches (14 + 17 + 16 + 2 — AC Nightfall and Sinanju Zero last). Every roster row and every stat sheet now shows the unit's portrait; the blueprint placeholder only appears for units added in future until their portrait arrives.

## App — Phenex swap fix (v59) *(arcs changed to front / rear in v60)*
- **Cause:** Phenex's two DEs were drawn as the **front / rear** halves of the ring, while their boxes and swap tap zones are **left / right** — picking the left zone lit the top half, tapping low on the panel picked a side DE, and swapping two full 18/18 DEs showed no visible change
- **Fix:** the two DE arcs are now the **left and right halves** (matching the boxes and zones; the stat block doesn't fix their arcs). A finished swap **flashes both halves** and shows **"DE 1 ⇄ DE 2 SWAPPED"** for a moment; tapping a **lent** DE's side shows a red **"RECALL THAT DE FIRST"** instead of doing nothing. Timeline entries call them **DE 1 / DE 2**. Kshatriya and Sinanju Zero (four quadrants) are unchanged

## App — Bottom dock alignment (v58)
- **TABLES** now sits centred on its own plate, matching DONE + ROSTER: both plates fit their buttons with **equal 0.8% margins** each side, both groups moved slightly inward (TABLES from the left edge, DONE + ROSTER from the right), and the plates start a little lower so there is a clear gap under the weapons table. Checked on phone, iPad and desktop: no overlap with brackets, stripe or MOVE / DODGE

## App — MOVE / DODGE press fix (v57)
- **Bug:** after a press, the move / dodge counter (×N) sat on the button's cut corner and was sliced into a broken fragment; pressing also shrank the button, which combined with its blur can flicker on Safari
- **Fix:** pressing now **glows** instead of shrinking; the **count moved into the ↶ undo box** beside each button (*↶ ×2*), which only appears once you have moved / dodged — so the button text is never covered and nothing is clipped

## App — Bottom dock + sheet-coloured undo (v56)
- **TABLES, DONE and ROSTER** moved inside the corner brackets (they used to sit on top of them) and now rest on two **dock plates** built into the sheet frame (dark plate, thin top edge, glowing centre mark). All three are the same size (about 81 × 30px on a phone, 154 × 58px on a large screen)
- Their **outline now follows the cut corners all the way round** (drawn as two layers instead of a clipped border, which used to lose the edges); text and outline use the sheet colour, ticked DONE is solid green
- The bottom **hazard stripe** moved out from under TABLES
- **Undo arrows** (skill switches, HADES check, fired weapons, limited-use weapons) and the pod **RECALL** button now use the **sheet colour** — gold on Spacenoid sheets, light blue on Federation — instead of fixed blue
- Checked: no button touches the brackets, stripes or MOVE / DODGE at any size; every button sits on its plate

## App — UI polish (v55)
- **Who goes first (We do / Enemy) and budget presets:** the selected chip is now a solid accent fill with a **✓** (gold on Spacenoid, blue on Federation); the other is dimmed. Before, the Spacenoid chip style hid the selection completely and the Federation tint was too faint
- **AP fire buttons without boxes:** tappable AP values are shown in the **accent colour with a glowing underline**; values you can't use right now are **grey and crossed out**. Tapping one **flashes the cell**, floats **"−N AP"** up from it, and **pulses the AP readout** in its hex frame. The tap areas are unchanged (whole cell). Two-cost pickers and RAPTOR pod choices give the same feedback. Animations switch off for reduced-motion devices

## App — Code-Drawn HUD Sheet (v51–v54) ✅ replaces the printed sheets

The printed sheet images and the HUD / CLASSIC switch are **retired**. Every unit now uses the HUD sheet, and its frame (grid, corner brackets, framed tables, hex stat frames, limb reticles, name panel, coverage dial, labels) is **built in HTML/CSS**, so it stays sharp at any size. The layout is unchanged, so every control still lands in place.
- **Colour follows the player's side:** Federation **blue**, Spacenoid **red**, whatever the unit (neutral units take the side fielding them). Buttons, pop-ups, MOVE / DODGE and shield rings follow the same colour
- **Coverage:** 180° dial, 360° ring (Night Hawk), 360° with four shield bubbles (Kshatriya, Sinanju Zero, Phenex)
- **Dodge label:** *ROLLED DODGES* on grunt and Veteran/Custom Grunt units, *DODGES* otherwise
- **Blueprint model** (the designer's four wireframes, coloured light blue on Federation sheets and gold on Spacenoid sheets) — **rules as set by the designer (v54):**

| Model | Units |
|---|---|
| **GM** | Federation grunts (Grunt + Veteran/Custom): GM, Jesta, Blue Destiny Unit 1, Slave Wraith, GM Sniper II |
| **Zaku** | Spacenoid grunts: Zaku II, Gouf, Rick Dom, Zaku I Sniper Type, Geara Zulu |
| **Gundam** | **every other Federation suit** (incl. Hyaku Shiki, Pale Rider), **every neutral suit** (incl. AC Nightfall), and the Spacenoid Gundams **GP02A Physalis** and **Xi Gundam** (v95) |
| **Sazabi** | **every other Spacenoid suit**: Rozen Zulu, Sinanju Stein, Sinanju, Kshatriya, Sazabi, Sinanju Zero, Nightingale *(Delta Zayin moved to Federation → Gundam in v69)* |

- **Hex stat frames** have a solid dark fill (v52) so the glowing numbers read clearly
- **v53 — wireframes now drawn on a canvas.** v52 coloured the models with CSS masks, which didn't show on the designer's device (most likely Safari, which every iPhone / iPad browser uses). The app now loads each white cut-out, colours it for the side (light blue / gold) with a soft glow on a canvas, and draws that — no masks, so it renders the same everywhere. Coloured versions are kept in memory, so switching units is instant
- **Files:** `img/mech-gundam|sazabi|zaku|gm.webp` (~180–240 KB each); the 7 printed sheets and 7 HUD background images were removed
- **Checked:** every unit's model and colour on both sides; no text cut off, no overlaps, all tap areas clear, all 49 sheets draw; installable and works offline; no references to removed images

## App — HUD Test Sheet (v49–v50) — superseded by v51

A test alternative to the printed sheet, switched with **HUD / CLASSIC** in the sheet's top bar (remembered per device; classic stays the default).
- **Artwork:** generated in the kit style — dark HUD panels, grid, corner brackets, hex stat frames, limb reticles, coverage dial — with the designer's **blueprint Gundam** in the middle, re-coloured per family. It is drawn to the **exact layout of the printed sheets**, so every existing control (counters, AP taps, swaps, pods, undo, timeline) lands in place unchanged
- **Images** (`img/hud-*.webp`, ~80 KB each, saved offline): grey 180°, green 180° (both *ROLLED DODGES*), red 180° (red-sheet arm positions), blue 180°, blue 360° (Night Hawk), red 360° with four shield bubbles (Kshatriya, Sinanju Zero), blue 360° with bubbles (Phenex)
- **Text** switches to light on the dark panels; AP buttons get a light outline
- **Animations:** slow scanline sweep, rotating + pulsing reticle on the name panel (all switched off if the device asks for reduced motion)
- **Warnings (HUD only):** limb at 0 → flashing hazard tag **⚠ DESTROYED** under it and a pulsing red ring; limb at ⅓ or less → amber pulse; shield at 0 / destroyed → **⚠ SHIELD DOWN**, regenerating → amber **⚠ SHIELD OFFLINE** (tags stay on the sheet — they shift inward near the edge); kill location lost → full-screen **⚠ UNIT DESTROYED** with hazard stripes, glitching text and a red pulse
- **v50 refinements:** the blueprint Gundam is shorter (76% of the sheet height, starting 16.5% down) so its head clears the name panel and its limbs sit behind the HP rings. On the HUD sheet the controls match the kit: light counter / switch / picker chips become **dark cut-corner chips** with light text (coloured states such as ACTIVE, pairs and pod states keep their colours); HP rings become dark with their health-colour ring; −/+ buttons get cut corners; **AP buttons** are square accent-outlined buttons; **AP, movement, dodges and shield** show as **glowing readouts** inside the hex frames, with the state colour kept as an underline and zero values dimmed. The restyle is decided by each control's actual colour after drawing, so it works the same in Safari
- **Checked in HUD mode:** no cut-off text, no overlaps, all tap areas clear, Cooldown column fits, all 49 sheets draw, all 349 warning tags on-sheet (phone and desktop)
- **Open questions for the designer:** keep the warnings HUD-only or add them to the classic sheets too? Make HUD the default later?

## App — Main Menu (v46)

Built from the designer's **title art** (background) and **menu mock-up** (layout).
- **Always opens on the menu.** A saved battle is one tap away via **CONTINUE**, and the last side played is pre-selected
- **Layout:** corner taglines (*BUILD / FIGHT / CONQUER* · *MOBILE SUITS / TABLETOP / THE BATTLEFIELD IS YOURS*); the art's own GUNPLA BATTLE title; **CHOOSE YOUR FACTION**; two angular framed cards — **FEDERATION** (blue, *UNITY / PEACE / PROGRESS*) and **SPACENOIDS** (red, *INDEPENDENCE / POWER / VICTORY*) — with ship crops from the art; **ENTER THE BATTLEFIELD** (reads *SELECT A FACTION* until a card is picked); bottom bar; footer *IT'S NOT JUST A MODEL… / …IT'S A WAR.* with the build number
- **Cards:** tap to select (glow + SELECTED tag, the other card dims); each shows its saved team (*SAVED: 4 MODELS · 10,000 DP · IN BATTLE*)
- **Bottom bar — only working items:** **CONTINUE** (greyed with no save), **QUICK REFERENCE**, **INSTALL APP** (iPhone / Android instructions). The mock-up's Tutorial, Settings, Armory, Gallery and Quit were left out — they don't exist yet, and a web app can't quit itself
- **Emblems:** simple original symbols (a compass star; a spiked crest), not the Federation / Zeon trademarks shown in the mock-up
- **Fits every screen:** desktop, iPad, sideways and upright phones — the menu starts just below the title in the art (worked out from how the image is scaled) and never needs scrolling; cards stack when the phone is upright
- **Files:** `img/menu-bg.webp` (238 KB), `img/menu-fed.webp`, `img/menu-spa.webp` — saved for offline use

### Menu styling carried into the budget and roster screens (v47)
- A large, faint **faction emblem** sits behind the budget and roster screens (Federation compass star in cyan; Spacenoid crest in red with a gold outline), with a soft faction-coloured glow
- The budget title uses the menu's spaced capitals with the emblem beside it (*FEDERATION — DEPLOYMENT POINTS* / *SPACENOIDS — DEPLOYMENT POINTS*); section headers get a small glowing diamond
- The roster top bar starts with the small emblem and a new **☰ Menu** button (always shown, so a confirmed team can get back to the main menu); the budget screen's Back button now reads **← Main menu**

### Interface colours follow the open sheet (v48)
While a stat sheet is open, the top bar, timeline strip, buttons, Damage-amount chips, pop-ups, roster picker and quick-reference tables take the **sheet's** colours; leaving the sheet returns to the faction colours.
| Sheet | Interface |
|---|---|
| grey | white / silver **#cbd5e1** on charcoal |
| green | lime **#bef264** on dark olive |
| red, red 360° | gold **#fcd34d** with **red** side bars on red-black (the Spacenoid palette, matching the sheet's gold trim) |
| blue, blue 360°, Phenex | light blue **#7dd3fc** on dark navy |

Damage (red) and Repair (green) keep their meaning colours on every sheet.

## App — Gunpla UI Skin (v44–v45)

Styled after the designer's **gunpla-ui.css** and **gunpla-ui-extended.css**. The kits can't be pasted in as-is (their `.btn`, `.row`, `.step`, `.tab` classes clash with the app's own), so the look is applied as a **skin** over the app's elements, appended at the end of the stylesheet.
- **Faction colours:** Federation **cyan #38bdf8**; **Spacenoid red, black and gold (v45)** — gold **#eab94b** headings, borders, chips and YOUR TURN, **red #e3283b** glowing side bars and enemy markers, red-black panels and background; neutral grey before a side is picked; green / purple / amber for good, buff and reminder timeline entries
- **DONE** appears only once the team is **confirmed**, and only on **your** turn (by design — there is nothing to tick before the turn tracker starts)
- **Kit panels** (cut corners, accent side bar, dark gradient): faction cards, turn tracker, pop-ups, pickers, warning dialog, quick-reference tables
- **Kit buttons** (cut corners, tinted gradient, uppercase): every app button; **kit tags** for budget chips; **kit tabs** for the reference tables; **status chips** for YOUR TURN / ENEMY TURN; stat-row styling for roster rows
- **Sheet buttons:** **TABLES**, **DONE** and **ROSTER** are now the same size (86 × 31px phone, 120 × 44px iPad) with cut corners; **DONE sits directly beside ROSTER**; ticked DONE is solid green. SWAP / CANCEL, MOVE / DODGE, undo arrows and AP-cost pickers share the cut-corner shape
- **Unchanged:** the printed sheet artwork and every measured position on it; tap-area sizes
- **Older iPads:** every colour the kits mix with `color-mix()` is pre-mixed, so nothing depends on iOS 16.2+
- **Font:** the kits ask for **Inter**; not bundled yet, so devices use their system font (Inter is OFL-licensed and could be bundled later)
- Previews: `UI_skin_preview.png` (before → after, 7 screens) and `UI_skin_spacenoid_preview.png` (v45 Spacenoid colours)

## App — Logo (v31)

The **GUNPLA BATTLE** artwork is now the app icon and appears on the first screen. The black frame was removed and the rounded corners filled with a blurred continuation of the art, so phones can apply their own icon shape. A padded **maskable** version keeps the whole title visible on Android launchers that crop icons to a circle. Files: `icons/icon-192.png`, `icon-512.png`, `apple-touch-icon.png`, `icon-maskable-512.png`, `logo.webp`. ⚠️ The app is still *named* "Mobile Suit Battles" (home-screen label "MSB") while the logo reads "Gunpla Battle"

## App — Netlify Release (v30)

**Ready to deploy.** Build tag **v30** shows on the first screen ("Choose a side · build v30") so every tester can confirm they are on the same version.

**What's in the folder:** `index.html` · `sw.js` · `manifest.json` · `_headers` · `img/` (7 sheet backgrounds) · `icons/` (192, 512, Apple 180)

- **Installable:** app icons added (Android "Install app" needs them; iOS uses the Apple icon), manifest completed (id, scope, description, icons). Chrome reports no installability errors
- **`_headers`** tells Netlify to always re-check `index.html`, `sw.js` and `manifest.json`, so updates reach phones quickly
- **Offline:** all 13 files are saved on first visit; the app, sheet art and saved games work with no connection
- **Deploying:** unzip, then drag the **folder** (the one containing `index.html`) onto Netlify. To update an existing site, drop it on that site's **Deploys** page — Netlify Drop on its own makes a new site with a new address
- **After an update:** testers open the app once more (twice if they had a build older than v18)

---

## App — Unit Check Progress (v29)

**✅ Federation — all checked** · **✅ Neutral — all checked** · **✅ Spacenoid — all checked**

v29 fixes from the last pass:
- **Epyon:** Guillotine removed from the weapon list (it is tracked in the skills). Weapons are now Beam Sword (std) · Beam Sword (FULL) · Heat Rod (pull) · Vulcans
- **Wing Zero:** TBR Combined Beam removed from the weapon list (tracked in the skills). Weapons are now TBR Dual Attack · Beam Saber · Machine Cannons · Wing Vulcan
- **Luminous Crystal Body:** Temporal Anchor has a **1/1** use counter (free)

### ✅ Spacenoid — checked by the designer (findings: Delta Zayin shield, Mega Particle Cannons — both on the top-priority list)
| # | Unit | Tier · DP | Sheet | Worth a closer look |
|---|---|---|---|---|
| 1 | Zaku II | Grunt · 500 | green | Baseline grunt, no ability (row shows —) |
| 2 | Gouf | Vet/Custom · 600 | green | Heat Rod Grapple and Improved Ground Mobility are reminders only |
| 3 | Rick Dom | Vet/Custom · 650 | green | Scattering Beam Gun is a reminder only |
| 4 | Zaku I Sniper Type | Vet/Custom · 675 | green | 15cm movement; Bracing is a reminder only |
| 5 | Geara Zulu | Vet/Custom · 700 | green | Piercing Stab 1/1 counter |
| 6 | GP02A Physalis | Super Flagship · 1900 | red | Atomic Bazooka 1/1; weapon rows 4–5 are blank (only 3 weapons) |
| 7 | Rozen Zulu | Super Flagship · 1950 | red | Two counters: Psycho Jammer 1/1, Funnel Jamming 3/3 |
| 8 | Sinanju Stein | Superweapon · 2070 | red | Attachment Bazooka 3/3; **weapon row 4 is blank** between Beam Saber x2 and Head Vulcans |
| 9 | Sinanju | Superweapon · 2200 | red | 3 Free Dodges; Attachment Bazooka 3/3; movement shows 45cm |
| 10 | Kshatriya | Superweapon · 2275 | red360 | **4 × 7 HP shields** on the printed bubbles, Swap Arcs, arc ring; funnels are reminders |
| 11 | Delta Zayin | Superweapon · 2400 | red | Wave Rider Mode toggle (2 AP); Adaptive Shield is a reminder only |
| 12 | Sazabi | Superweapon · 2550 | red | **HEAD = KILL**. ⚠️ Stat block gives the **Mega Particle Cannon** and **Shield Missiles 3 charges/game** each — **no counters in the app yet** |
| 13 | Sinanju Zero | Superweapon · 2650 | red360 | **4 shields** (16/16/12/12) on the bubbles; Attachment Bazooka 3/3 and Zero System 3/3; Razor Feather Funnels once per turn (not tracked) |
| 14 | Nightingale | Myth · 3350 | red | ⚠️ **Shield Missiles (3 charges/game) are not on the sheet** — the 5 weapon rows are full (Vulcan Cannons took the slot) |

*Warships (Musai, Rewloola) are not in the app yet — priority 7.*

---

## App — Multiplayer Sync (Priority 8 — after the full app is built)

**Goal:** two devices, one per side, linked by a **session code** (e.g. `MSB-4K7Q`) so turn changes and short notifications reach the other player automatically. **Turn state and notifications only** — rosters, damage, and anything hidden (e.g. which Night Hawk marker is real) stay on each device.

**How it would work**
- One device taps **Create session** and gets a code; the other taps **Join** and types it in
- **Who goes first** is chosen once when joining, so both trackers start in agreement
- Tapping **End My Turn** sends one message: the other device switches to **YOUR TURN** with a notice ("Enemy ended their turn — your turn 4")
- **Offline fallback:** if the connection drops, each device keeps working exactly as now, with the manual roster buttons

**The one real hurdle:** the app has no server — it is static files on Netlify — so the two devices need a go-between service.

| Option | Verdict |
|---|---|
| **Firebase or Supabase** (hosted real-time database) | **Recommended.** Free tier is far more than enough, updates in about a second, works with the current drag-the-folder Netlify deploy. Needs a free account and a few settings pasted into the app |
| Netlify Functions | Keeps everything on Netlify, but drag-and-drop deploys don't include functions — would need a different deploy method |
| Direct phone-to-phone (WebRTC) | No database, but unreliable on mobile data and drops if either app is closed |

**Decide when we get there**
- Share turn changes only at first; sharing events like "Enemy activated NT-D" is optional and may be something players prefer to keep private
- The turn tracker (v13) already records each turn change as a single event, which is exactly what would be sent — nothing needs changing before then

---

## App — Turn Tracker & Timeline (app v13–v22)

**Replaces the single End Turn button.** One device runs one side. A **round** is your turn followed by the enemy's turn (the game is played one whole side at a time, Section 6.1).

| You tap | When | What happens |
|---|---|---|
| **End My Turn** | your turn is finished | end-of-turn reminders pop up and are logged (Turn A and Master Gundam regeneration, Crystal Body instability roll while active). Nothing refills; Dodges stay available. Bar turns red: **ENEMY TURN** |
| **Start My Turn** | the enemy has finished | round +1. AP and Free Dodges refill (Section 4.0), weapon cooldowns and beam shield regeneration count down, effects that have run their course end, Trans-Am burnout clears, HADES check falls due, revealed RAPTOR pods return |

- **Effect durations** now count your turns *including the enemy turn after each one*. Heat Venting is back to a normal **1 turn** and naturally covers the enemy's attacks (the v12 two-press workaround is gone). **Destiny's Wings of Light now works the same way.**
- **Roster screen:** big tracker — turn number, YOUR TURN / ENEMY TURN, the big button, **Undo** (reverses the last phase tap), **New game** (turn 1, everything back to full health), and **Who goes first?** until the game starts (enemy first adds an OPENING enemy turn before your turn 1).
- **Pips:** one pill per round, left half your turn, right half the enemy's. A numbered dot shows how many things happened, coloured by the most serious (red damage, amber reminder, green good news, purple abilities). Tap a half to read it; the list shows every unit by name.
- **Turns are ended from the roster only (v14)** so nobody mistakes it for a per-unit button. The big button names its scope: **End My Turn — all 4 units ▸**. Undo sits beside it.
- **Per-unit Done ticks (v15; moved in v43):** during your turn each sheet has a **DONE ✓** button — since v43 it sits **on the sheet next to ROSTER**, in the same style and size as the other sheet buttons (turns green once ticked) — it ticks the unit off and returns to the roster (reopen and tap **✓ Done** to un-tick). Roster rows get a tick box you can tap directly; finished units fade and are struck through. The tracker shows **3 / 4 done**, and when every unit still standing is done the End My Turn button glows (it still works early — flag, never block). Destroyed units drop out of the count and the button label. Ticks clear at End My Turn; Undo restores them
- **Unmoved-units warning (v22):** tapping **End My Turn** while any surviving unit isn't ticked off opens a warning — *"2 units haven't moved yet"* — listing them. **Keep playing** closes it; **End turn anyway** ends the turn; tapping a listed unit opens its sheet. Destroyed and ticked units are ignored, Start My Turn never warns, and Undo still works
- **Mis-tap undo (v16):** tapping **ACTIVE** on a mode or toggle that was switched on *in this same half-turn* offers **↶ UNDO** or **END / OFF**. UNDO restores everything the activation changed — the charge, AP (including Epyon's switching cost), Dodges, a granted shield (Crystal Body), and any earlier burnout — and removes the entry from the timeline. END / OFF is a real switch-off (Trans-Am cancelled by a hit → burnout applies; toggles pay their AP). Anything switched on in an earlier half-turn goes straight to END. **HADES** shows a **↶** beside its first, unanswered check
- **Visible undo (v18):** anything switched on this half-turn shows a **↶** right beside ACTIVE. **Since v20, tapping ACTIVE simply switches it off** (END for modes, with burnout where it applies; OFF for toggles, paying their AP) — the UNDO / END prompt was removed because the ↶ already covers mis-taps
- **Updates show up faster (v18):** the page now checks the network first and falls back to the saved copy offline. **This one update still needs the app opened twice** (the old offline setup is in charge the first time); every update after it appears on the first open
- **Trans-Am burnout timing fixed (v19):** burnout is *1 turn*, meaning the unit's own turn plus the enemy turn after it. **Cancelled by a hit during the enemy's turn** → the −5 now carries into Exia's next turn (the timeline says *burnout continues this turn*) and clears when the turn after that starts. Previously it was wiped the moment her turn started. **Cancelled on her own turn** or **expiring naturally** → burnout covers that turn and the following enemy turn, as before
- **Reset** now removes that unit's entries from the current half-turn; if the unit has earlier history it adds one **"Sheet reset to full"** note so the log still makes sense
- **Bug fixed (v16):** Luminous Crystal Form never actually refreshed its 18 HP I-Field on activation (it wrote to the wrong variable). It does now
- **Damage log (v17):** every hit location, shield, armour pool (Phase Shift, Nano-Laminate, Anti-Beam Coating) and RAPTOR pod gets **one running line per half-turn** — e.g. *Left Arm took 3 (4/7 left)*, *Phase Shift Armour absorbed 5 (19/24 left)*. Several hits on the same location add up on one line; a damage tap followed by a repair tap cancels out and the line disappears; a genuine repair shows as *repaired 2*. Only the damage actually applied is counted (tapping 10 on a 7 HP arm records 7). The roster list opens with **Damage taken: Gundam F91 10 · GM 5** (hit locations only), and each sheet's strip shows that unit's total. Recorded on both halves of the turn (Overwatch, clashes and HADES also cause damage on your own turn). Beam shields coming back from regeneration are not counted as repairs
- **Possible later addition:** noting *which enemy unit* dealt each hit — would need an extra tap per hit, so left out for now
- **Sheet:** the top bar keeps a status chip only — **T3 · YOUR TURN ↗ roster** — and tapping it goes to the roster. A timeline strip under the sheet shows only that unit's events. The hint line explains where turns are ended.
- **Recorded automatically:** abilities switched on/off, charges used, pools depleted, HADES and EXAM results, limbs/shields/pods destroyed, limited weapons fired, shields back online, effects ending. A change undone straight away (mis-tap) removes its entry instead of adding a second one.
- Saved with the team; older saves open normally.

---

## App — Units to Check Individually (original list)

All 49 mobile suits are in the app and playable. The list below is what was **built or corrected late**, so each wants a look on a real screen before it is trusted.

### Multi-shield layouts
| Unit | Shields | Where they render |
|---|---|---|
| **Kshatriya** | 4 × 7 (28) | the four printed bubbles on its sheet |
| **Phenex** | 2 × 18 (36) | top two bubbles; bottom two reserved for borrowed shields |
| **Legend** | 2 × 13 (26) | **left and right of the coverage arc** at x 80.4 / 94.5, y 69.8 (v24) |
| **Strike Freedom** | 2 × 14 (28) | same as Legend (v24). **Sheet background changed to blue 180° (v25)**; stat block now says **180° coverage**. Printed Master Roster slide 83 still uses the 360° background — handed to the PPTX chat |
| **Sinanju Zero** | 2 × 16 + 2 × 12 (56) | red360 sheet, so it uses the four printed bubbles like Kshatriya |

Only Kshatriya and Phenex have printed bubbles — everything else prints a single total box, so the stack sits beside it with a **2×** / **4×** caption. The printed box shows the live total and is read-only.

### Beam shield regeneration
**F91 · AC Nightfall · Destiny · Strike Freedom · Legend.** At 0 HP the box turns amber and offers two buttons: **↻** (offline 3 turns, then restores) or **✕** (Natural 20 Block — destroyed permanently). Legend's two shields regenerate on independent timers. The combined total drops its ceiling when a shield is destroyed for good.

### Ability kinds corrected late — verify each behaves
| Unit | Ability | Was | Now |
|---|---|---|---|
| **Turn A** | Moonlight Butterfly | passive | 1 charge |
| **Epyon** | Guillotine | toggle | **3 charges per game, 4 AP each**, only while Full Output is on (confirmed) |
| **Master Gundam** | Sekiha Tenkyoken | passive | 1 charge |
| **Destiny** | Wings of Light | counter | mode, 3 charges × 1 turn |
| **F91** | Heat Venting Burst | counter | mode, 3 charges × 1 turn |
| **Night Hawk** | RAPTOR | passive | dedicated pod tracker |

### Night Hawk layout — matches the printed sheet (v27)
| Row | Skill | AP | Cooldown area |
|---|---|---|---|
| 1 | RAPTOR Pod 1 | 2 / Free | **18/18 HP tracker** + STOWED → DEPLOYED → REVEALED |
| 2 | RAPTOR Pod 2 | 2 / Free | same |
| 3 | Low-Observability | Toggle | OFF / ACTIVE (45cm stealth) |
| 4 | Anti-Beam Coating | Passive | *8 HP · shield box* (reminder only) |
| 5 | Ambush Protocol | Free | Tier 1 |

**Shield box = the 8 HP Anti-Beam Coating, 360°** (logged as *Anti-Beam Coating took 3* / *burned away*). This reverses the v5 change that moved the coating into an ability pool. Pods no longer sit in the right-hand column. Also in v27: **skill names and AP text now fit their own columns on every sheet** (names used to run into the AP column, e.g. "Point Defense (Vulcans)Free")

**Pod recall (v28):** while a pod is **DEPLOYED**, a **↩ RECALL** button sits beside it — one tap sends it straight back to STOWED (timeline: *RAPTOR Pod 1 recalled*) without passing through REVEALED. Recall is currently **free**. ⚠️ **Rules gap:** the stat block doesn't mention recalling a deployed pod at all — needs a line (and an AP cost, if any) from the rules chat

### Night Hawk RAPTOR pods (original notes)
Two pods, **18 HP each**, with a tappable state: **STOWED → DEPLOYED → REVEALED**. Destroyed at 0 and permanent. Rendered in the right column at x 80.5, y 67 / 77.4.

### Phenex Armed Armor DE transfer
**SEND** beside each shield opens the roster picker (1 AP, ally within 90cm). The shield moves to that ally at its **current HP**, appearing under the bubble columns at x 80.9 / 93.8, y 88.6, tagged with the owner. **Recall** costs 1 AP at any range and brings it home in whatever state it is in. Send both and Phenex has no shield at all.

### Dodge-target modifiers — newly parsed, check they display
Seven abilities modify Dodge target numbers and had never been captured: **Destiny −4** (Wings of Light) · **Sinanju / Sinanju Stein −4** (Exceptionally Agile) · **Wing Zero / F91 −2** (Agile) · **F91 −2** (Heat Venting) · **Sinanju Zero −2**. Passive ones show grey, temporary ones purple.

### Everything else worth a glance
- **Sazabi** — Head is the kill condition, not Chest. Red "HEAD = KILL" warning on the sheet, and the roster bar tracks Head.
- **F91** — VSBR Low and High share one cooldown; firing either marks both with a **⇄**.
- **Red-sheet arm positions** differ from every other background (47.04 / 71.83 rather than 47.79 / 70.95). Affects all 11 red units plus Kshatriya.
- **Weapon cooldowns** now cost a full turn: fire → blocked next turn → ready. Green pip = ready, red = fired.

---

## App — Purchase Reinforcements (with GP tracking)

**Added during the roster-lock work.** Once a team is confirmed the available-units list is hidden, because switching between sheets mid-game with 35 units listed underneath is too busy. The roster scales up and becomes the working view.

**What is still needed:** a **Purchase Reinforcements** button that brings the unit list back so a player can buy replacements mid-campaign. This belongs with the GP system rather than the roster builder, because reinforcements are bought with GP converted to DP (**1 GP = 250 DP**, Section 10) rather than from the original budget.

Behaviour when built:
- Button appears on the locked roster, alongside Edit team
- Opens the unit pool with the player's **available GP** shown as the spending limit, not the original DP budget
- Purchased units join the roster as fresh models at full health
- The original DP budget stays displayed for reference but is not the constraint

---

## App Phase 3 — GP & Progression

**These are one feature, not two.** GP is earned from kills and objectives, and it is spent on pilot specializations and Base of Operations upgrades — so a GP counter with nothing to spend on would be half a tool. Build the earning and the spending together.

**What it covers:**
- **GP earned** — per kill by tier (Grunt/Veteran 1 · Elite/Flagship 2 · Super Flagship 3 · Superweapon 4 · Myth 5), plus objective rewards
- **Pilot specializations** — the four trees and their tiers, with GP costs deducted as you climb
- **Base of Operations upgrades** — Repair Team, Repair Skill, Arsenal Team, each with four tiers
- **Conversion** — 1 GP = 250 DP when cashing out for reinforcements
- **Persistence across games**, since GP and pilot progression carry between sessions in a campaign

**Worth noting:** capital ships arrive with a **preset tier-2 base module** on all three paths, which acts as a floor rather than stacking. The tracker needs to handle that interaction — a player who has purchased tier 3 keeps tier 3.

### 🔑 Build Codes — share and paste specialised units *(designer idea — build with the GP update)*

Once players start putting specialisations on their units, each built unit gets a **short build code** that captures exactly how it is built, so builds can be **shared between players** and **pasted back in** to recreate a custom-specced unit instantly.

**What a code holds**
- **Which unit** (e.g. Nu Gundam)
- **Each specialisation** on it (e.g. 4 of them)
- **The tier** of each specialisation

**What the app needs**
- **Copy code** — on a specialised unit (roster row and / or its stat sheet), shows the code with a one-tap copy button
- **Paste code** — on the roster builder: paste a code → the app shows the unit and its specialisations for a quick check → **Add** puts it in the roster, already specced
- **Validation on paste:** a mistyped or corrupted code is rejected with a clear message instead of creating a wrong unit; a code for a unit or specialisation the app no longer has is flagged; the unit is only added if it fits the budget (DP) and whatever the GP rules require for its specs
- Works offline (the code is generated and read on the device — no server needed)

**Agreed format** — full mapping in `Build_Code_System.md`
- `UNIT-SPECS`, e.g. `33-A3C2U4V1` = **Nu Gundam** (unit 33) with Marksman's Instinct T3, Weapon Mastery T2, Speed Boost T4, Evasive Maneuvers T1
- **Unit number** 1-49 (by tier, then DP); new units take the next number, retired numbers are never reused
- **One letter + one tier digit per specialisation** (21 specialisations × 4 tiers = 84 combinations — too many for single letters, even with upper/lower case). Letters A-W in rulebook category order, skipping I and O so they can't be confused with 1 and 0
- Not case-sensitive; the app lists specialisations in letter order so the same build always gives the same code; each letter appears once

**Open questions — ⏸️ deferred by the designer, decide when the GP update is built** *(also listed in `Build_Code_System.md`)*
- Weapon Mastery T1 and Quick Hands T1-3 apply to a *chosen* weapon / ability — should the code carry that choice, or is it picked after pasting?
- Should the code also carry the pilot's rank, or is it taken from the player's saved pilot?
- Does pasting a code charge the GP, or only set up a build the player has already earned?
- Should whole teams be shareable in one code (e.g. `12-A3C2/35-B4S2`), or one unit at a time?

---

## Ship Rework — Named Classes (Priority 1)

**Squad cap corrected.** The rulebook previously said **5** Infantry Squads in the deployment table while the stat sheets and app prompt said **4**. Settled at **4 on the board at any one time**, and corrected in all four places: the Section 13 cap table, the Transport Ship interaction note, the cruiser prose in 13.5, and the Appendix respawn table. Ship garrisons remain entirely outside this cap.

**⚠️ PLAYTEST NOTE — ship durability.** All four classes are statted on paper but the maths flags one risk: **ships have no Dodge and no Block, so every attack lands.** A Myth-tier suit focusing a cruiser kills it in roughly 3 turns; the cruiser needs about 20 to kill the suit back. That may be fine in a real game where the board is contested and escorts intervene — but if ships feel like expensive scenery in the first test, **buff Hull rather than DP.** The cleanest lever after that would be some form of damage reduction against mobile suit weapons.



Replacing the single generic **Battle Ship** entry with four named classes, matching the printed models. Design was agreed but **weapons and DP are still open**.

### Agreed So Far

| Ship | Side | Capacity | Launch/Turn | Base Module | DP |
|---|---|---|---|---|---|
| ~~**Musai**~~ | Zeon | 2 | 1 | No | ✅ **2200 — DONE** | TBD |
| ~~**Salamis Kai**~~ | Federation | 2 | 1 | No | ✅ **2500 — DONE** | TBD |
| ~~**Rewloola**~~ | Neo Zeon | 4 | 2 | Yes — tier 2 | ✅ **5000 — DONE** |
| **Ra Cailum** | Federation | 6 | 2 | **Yes — tier 2** | ~6000 |

*(Two Musai are printed — 2 capacity each, 4 suits total across both hulls.)*

### Launching (new mechanic)
Deploying from a carrier grants the launching mobile suit **Boost Stance movement (+10cm per AP) for free, without Boost's no-attack restriction** — a catapult throwing the suit out at speed.

- Costs the **ship** 1 AP, not the mobile suit
- **1 AP covers the ship's full per-turn launch capacity** — so 1 AP launches 2 suits from a capital ship, or 1 from a cruiser
- Works **every time** a suit launches, not once per game
- The suit deploys with its own AP fully intact

### Ships as Mobile Bases
Capital ships carry a **Base of Operations module** (Section 7.5) — the same system as the fixed base, treated as a module aboard the ship.

- **Fielding a capital ship replaces your fixed board-edge base entirely.** There is no static zone; the ship *is* your base.
- **If the ship is destroyed, you lose all repair access for the remainder of that game.** Campaign upgrades are unaffected and carry into the next.
- **Cruisers (Musai, Salamis Kai) have no module** — bring only those and your fixed base works normally.
- **Preset: tier 2 on all three paths** (Repair Team, Repair Skill, Arsenal Team) — worth roughly 130 GP of upgrades.
- Presets are a **floor, not a stack**: a team that has purchased tier 3 uses tier 3, not tier 5.

The purchased upgrade paths stay worth climbing because they're **permanent and safe**, while a ship's module is borrowed and killable.

### Resolved — Already Written Into the Rulebook (Section 13.5)

- **Launching** — ship pays 1 AP covering its full per-turn capacity; suit deploys with full AP and free Boost movement, without Boost's no-attack restriction
- **Docking** — move within 5cm, ship pays 1 AP, suit stays exposed until the opposing side's next turn fully ends. Block and Rolled Dodge allowed, no Free Dodges. Cancelled only by a Called Shot landing on the body or by melee — not by ordinary fire, and not if Blocked or Dodged
- **Deployment at start** — carriers must be loaded to capacity before anything deploys on the board; remainder goes to your board edge
- **Emergency Disembark** — Grunt-tier suits aboard a destroyed carrier die automatically. Veteran/Custom and above roll d20: 1-3 destroyed, 4-8 take 5 damage to every location, 9-14 take 3 to every location, 15-20 escape clean
- **Shared framework** — all classes use the existing Section 13.5 rules (hit locations, Called Shots on weapon systems, garrisons, Damage Control, Last Stand Lockdown). Only the numbers differ per class
- **Warships are DP-purchased units, not vehicles** — outside the 8-vehicle cap, no deployment limit, DP is the only constraint. Transport Ships remain the exception: unarmed logistics, no DP, still in the vehicle cap
- **Base module** — capital ships only, preset at tier 2 on all three paths, acting as a floor rather than stacking. Fielding one replaces your fixed board-edge base entirely; losing it means no repairs for the rest of that game

---

### Still To Do — Ship Stats & Weapons

**This is now Priority 1** — the app build is waiting on it. The roster is confirmed as four classes:

| Ship | Side | Capacity | Launch/Turn | Base Module |
|---|---|---|---|---|
| **Musai** | Zeon | 2 | 1 | No |
| **Salamis Kai** | Federation | 2 | 1 | No |
| **Rewloola** | Zeon | 4 | 2 | Yes — tier 2 |
| ~~**Ra Cailum**~~ | Federation | 6 | 2 | Yes — tier 2 | ✅ **6000 — DONE** |

Still to design when you come back to it:

- [x] ~~**Rewloola loadout**~~ ✅ Twin Main Gun (12x2, sniper curve, split or stack, 1-turn cd) · Twin Secondary (5x2, 90cm) · Anti-Air Array (6d6 **ballistic**, 60cm) · Missile Barrage (60x20cm band, **forward arc only**, 4 to all 6 locations, Block only)
- [x] ~~**Ra Cailum loadout**~~ ✅ Twin Main Gun (12x2) · Anti-Air Array (6d6 ballistic) · **Anti-Ship Missile** (2 nuclear charges, 40 Hull vs ships) · **Decoy Balloons** (1-3 declaration)
- [x] ~~**Musai loadout**~~ ✅ Twin Mega Particle Gun (12x2, sniper, **180° forward arc**) · Missile Launchers (30x15cm band) · **NO anti-air at all** — its canon design flaw, kept as the class identity
- [x] ~~**Salamis Kai loadout**~~ ✅ Twin Mega Particle Cannon (12x2, **360° but CANNOT stack**) · Anti-Air Array (6d6 ballistic) · Missile Launchers. Deliberate mirror of the Musai
- [x] ~~Capital ship DP~~ ✅ Rewloola 5000, Ra Cailum 6000
- [x] ~~Cruiser DP~~ ✅ Musai 2200, Salamis Kai 2500
- [x] ~~**Hull / Bridge / Thruster / Speed**~~ — settled: **Bridge 60, Thrusters 30/30 and 6 AP on every class.** Hull and Movement vary: **Musai 60 Hull / 40 Bridge / 20 Thrusters, 4 AP at 30cm/AP** · **Rewloola 100 Hull at 20cm/AP** (twelve thrusters, fast) · **Ra Cailum 140 Hull at 15cm/AP** (eight thrusters, slow and tough). Salamis Kai still to set
- [x] ~~**Garrison size**~~ ✅ **Musai 1 squad (8 Crew HP) · Salamis Kai 1 · Rewloola 3 (24) · Ra Cailum 4 (32).** Crew never leave the ship and sit outside the deployment cap — **the 4-squad cap stays at 4 regardless of how many warships you field.** Note the consequence: a 1-squad cruiser starts at the 8 HP Damage Control threshold, so **cruisers can never repair subsystems.** Intended, and documented in 13.5
- [x] **Differentiating Rewloola from Ra Cailum** — settled: **the difference is weapon systems.** Both carry an identical tier-2 base module, so hangar capacity (4 vs 6) plus a heavier Ra Cailum loadout carries the ~1000 DP gap. Design their armament together rather than in isolation, so the gap is visible in the stat lines
- [x] ~~**Ship-to-ship combat**~~ ✅ **Dedicated range table**: 3+ under 60cm, 4+ at 60-90, 5+ at 90-120, 7+ at 120-150, 9+ at 150-180. Ship-to-ship only. Weapon ranges NOT lifted, so only the Main Gun reaches past 90cm — capital duels open as a main-battery exchange and escalate as they close
- [x] ~~Generic Battle Ship~~ — **RETIRED.** The four named classes replace it entirely. Keeping it at 5000 alongside Rewloola would have made it a dead entry

## 🔜 Queued after the ground unit roster — Firefight Clash panel (Quick Resolve) — DESIGN FINAL, all questions answered
Designer scope (confirmed): **HP tracker + resource tracker + margin tables + online blind declarations with animations.**
- **Entry:** ⚔ FIREFIGHT button on an Infantry Squad sheet. Your squad vs the enemy squad side by side; ROUND 1–4 pips; "New engagement" (refills items, resets rounds).
- **HP tracker:** Squad Health 8 (−/+) → Firepower from the table (8-7→8, 6-5→7, 4-3→6, 2-1→5); suppression this round; dice to roll = Firepower − suppression, min 2 (1 at 1 HP).
- **Resources:** Flashbang ●● / Smoke ● / Grenade ● per side.
- **Item declaration:** none / ✦ / ◌ / ✹ + LOCK. When both are locked → reveal, and the triangle is applied automatically:
  - **Flashbang:** 3 suppressed next round; cancelled by Smoke.
  - **Smoke:** clears own suppression; cancelled by a Grenade.
  - **Grenade:** 1 casualty; a Flashbang flips it onto the thrower.
- **Dice — physical (default):** no dice entry. Players roll real dice and simply adjust **HP and suppression** with −/+ (like the sheets). Firepower / Margin / Perfect Volley tables are shown for reference in a pull-down.
- **Dice — simulated (optional, both teams must agree):** one side proposes, the other accepts. A **Roll** button then rolls both pools with a dice animation and works out:
  - **Successes:** 3-5 = 1, 6 = 2.
  - **Suppression:** 1s suppress your own squad next round.
  - **Margin:** the outcome is applied to the loser (1 = 1 suppressed; 2-3 = 1 casualty; 4 = +1 suppressed; 5 = +2 suppressed; 6+ = 2 casualties + 2 suppressed).
  - **Specials:** Perfect Volley and Last Man Standing.

  Either side can switch back to physical dice.
- **Volunteers:** any team member (not only the leader) can **take the clash** for their team → they control that squad while the clash is open (like an open sheet); teammates see "Bob is handling the clash" and keep playing other units. The existing rule already stops the leader ending the turn while the squad is held.
- **After round 4:** Objective Clash helper (2d6 + HP advantage) + Forced Re-Engagement (spend a Flashbang).
- **Online:** a shared clash record in the room. Picks are kept **secret server-side** until both sides lock, then revealed to both at once. Each side writes its own squad HP. Offline: both squads on one device.
- **Animations:**
  - **Flashbang:** white flash + ringing blur.
  - **Smoke:** rolling grey clouds.
  - **Grenade:** orange burst + shake; if flashed, it blows up on the thrower's side.
  - **Countered:** COUNTERED stamp.
  - **Reduced motion:** simple fades.
- **Still to confirm:**
  - ~~(1) charges~~ → decided: **Quick Resolve always uses 2 Flashbangs / 1 Smoke / 1 Grenade per squad**, refreshed at the start of every new firefight engagement. (The Detailed Map's own item counts are separate and don't apply here.)
  - ~~(2) dice entry~~ → decided: physical dice = HP / suppression adjust only; simulated roll optional with both teams' agreement; volunteers can handle clashes.

## 📄 Ground unit sheets — designer's PPTX reviewed (Ground_Unit_4_Squads, 14 slides, text/shapes only)
- **Per squad (×4), three sheets:**
  - **Overmap** (slides 1/3/5/7):
    - **Header:** name / player / rank.
    - **Squad Health:** 8 circles.
    - **Rules on the sheet:** at 1 HP, AP → 1. "Which soldier dies?" is the player's choice; Armor Unit and Recon are max 1 and never replaced.
    - **Coordinated Strike:** 1 AP, 90cm, 2+/3+/4+; target table; can't target a squad within 30cm.
  - **8 Soldiers** (slides 2/4/6/8): Rifleman ×3, MG Gunner, Sniper, Armor Unit, Shield Unit, Recon.
    - **Every card:** HP ○×6 + Kevlar ○×6 + weapon lines.
    - **Item pips:** Rocket ×2 (Armor), Flashbang ×2 (Shield), Smoke ×2 (Recon).
    - **Also:** Kevlar save box.
  - **Quick Resolve** (slides 11–14):
    - **Dice zones:** Freshly Pinned → About to Rejoin → Active Dice.
    - **Items:** Flashbang ○○ / Smoke ○ / Grenade ○.
    - **Also:** margin table + reminders.
- **Shared references:** slide 9 (Knife Takedown, Armor area protection, rocket anti-air), slide 10 (Kevlar and dodge at both scales: Overmap dodge Squad / Jet 10+, Car 12+, Heli / Transport 14+, Tank none).
- **Planned app mapping:** Infantry Squad unit (Ground tab, max 4, no DP) with a 3-tab sheet.
  - **Overmap:** health pips, auto AP drop, Dodge 10+, Coordinated Strike fire button.
  - **Soldiers:** 8 cards with HP / Kevlar / items / KIA; losing Squad Health opens a "which soldier died?" picker with the Armor / Recon caps.
  - **Quick Resolve:** the agreed Firefight panel; the dice zones become a live pinned / rejoining / active display.
- **⚠️ Open questions for the designer:**
  - ~~(1) Margin table~~ → **decided: the RULEBOOK table is correct** (0 none · 1 = 1 supp · 2-3 = 1 cas · 4 = 1 cas +1 supp · 5 = 1 cas +2 supp · 6+ = 2 cas +2 supp). The app uses it. The PPTX Quick Resolve slides 11–14 carry an outdated table and need updating.
  - *(old note)* **Margin table mismatch.**
    - **Sheet:** 0-1 none · 2 = 1 supp · 3-4 = 1 cas · 5 = +1 cas +1 supp · 6-7 = +1 cas +2 supp · 8+ = 2 cas (cap).
    - **Rulebook:** 0 none · 1 = 1 supp · 2-3 = 1 cas · 4 = 1 cas +1 supp · 5 = 1 cas +2 supp · 6+ = 2 cas +2 supp.

    Which is current? (→ rules chat)
  - ~~(2) MG Gunner grenades~~ → **decided: yes, MG Gunner gets Grenade ×2** (rulebook).
  - ~~(3) Vehicles~~ → the designer sent Ground_Vehicle_Stat_Sheets (Car, Tank, Transport Ship). **Designer rule: the PPTX files are layout ideas only and may be stale — the RULEBOOK is the source of truth.**

## 🚙 Ground unit stat blocks (from the rulebook) — awaiting designer OK, then build with placeholder art
- **Stale in the vehicle PPTX** (rulebook wins):
  - **Car:** the slide gives it an Overmap strike; the rulebook says the Car has NO Overmap attack (the squad inside fires its own Coordinated Strike).
  - **Transport:** the slide says disembarked squads move 15cm/AP; the rulebook says 10cm.
- **Infantry Squad** (max 4, no DP):
  - **Overmap:** 3 AP (1 at 1 HP), 10cm/AP, Squad Health 8, Dodge 10+, proximity 20cm, Coordinated Strike 1 AP / 90cm.
  - **Soldiers:** 8, each HP 6 + Kevlar 6.
  - **Items:** Rocket ×2 (Armor), Flashbang ×2 (Shield), Smoke ×2 (Recon), Grenade ×2 (MG).
  - **Quick Resolve:** the Firefight panel.
- **Tank** (max 2):
  - **Overmap:** 4 AP, 15cm/AP, 18 HP (no Armor stage), no Dodge, proximity 40cm.
  - **Fire Support:** 2 AP, 60cm, 10cm AoE, friend and foe, 1-turn cooldown → squad Splash Table / vehicle 6 / MS 2 to all 6 / aircraft can't be targeted.
  - **Ground:** Armor 6 + HP 18; Main Cannon 2 AP, 10cm AoE, 6 dmg, dodge 4+, 1-turn cd; MG 1 AP, 60cm, 8d6 at 3+.
  - **Other:** can carry the objective; no squad.
- **Car** (max 4):
  - **Overmap:** 3 AP, 25cm/AP, 8 HP, Dodge 12+, proximity 30cm, no attack.
  - **Ground:** Armor 3 + HP 8; MG 1 AP, 60cm, 8d6 at 3+.
  - **Other:** carries 1 squad (Emergency Disembark 1d6 per soldier, 4+ survives).
- **Helicopter** (max 2, Overmap only):
  - **Stats:** 3 AP, 35cm/AP, 6 HP, Dodge 14+, proximity 40cm.
  - **Air Support:** 2 AP, 3 dmg, 15cm AoE.
  - **Strafe Run:** 2 AP → 1 charge (max 4), 20×10cm, 4 dmg, dodge 4+.
  - **Other:** carries 1 squad.
- **Jet** (max 2, Overmap only):
  - **Stats:** 4 AP, 50cm/AP, 3 HP, Dodge 10+, proximity 30cm.
  - **Air Support:** 2 AP, 3 dmg, 10cm AoE, armour-piercing.
  - **Bombing Run:** 2 AP → 1 charge (max 2), 10cm AoE, 6 dmg, no dodge.
- **Transport Ship** (max 2):
  - **Stats:** 3 AP, 20cm/AP, 20 HP flat, proximity 60cm, no weapons.
  - **Other:** carries 2 squads (aboard / disembarked / lost); Emergency Disembark.
- **Shared:**
  - **Vehicle cap:** 8 overall.
  - **Hide Stance:** free; halves movement, no attack, untargetable by mobile suits.
  - **Comm Array:** 2 per side; both destroyed → 2-turn blackout.
- ~~Transport Ship dodge~~ → **decided: 14+** (Section 13.7 table). ⚠️ Rules chat: fix Section 13.5's "standard mobile-suit-style Dodge" wording to 14+.

### Ground Overmap attack tables — check
- **Coordinated Strike** (Squad): per-target table ✓ (squad 1 casualty · vehicle 5 · MS 1 to all 6 · aircraft 3; no squad target within 30cm).
- **Fire Support** (Tank): per-target table ✓ (squad Splash Table · vehicle 6 · MS 2 to all 6 · aircraft can't be targeted).
- ~~Air Support table~~ → **decided by the designer: Air Support always deals 3 damage, except vs Infantry Squads → Squad Splash Table (d10).**
  - **Table:** squad = Splash Table · vehicle 3 · aircraft 3 · mobile suit (no Dodge) → see below.
  - **Jet AND Helicopter vs mobile suit: 3 damage to EVERY location** (missile barrage) — designer confirmed both.
  - **Final Air Support table (both aircraft):** Infantry Squad → Splash Table (d10) · Ground vehicle → 3 · Aircraft → 3 · Mobile suit → 3 to all 6 locations, no Dodge.
  - ⚠️ **Rules chat:** add this per-target table to Section 13.7 Air Support.
- **Car / Transport:** no Overmap attack (by design).

### 📸 Ground unit images — ✅ ALL COLLECTED and processed (saved in `public/img/ground/`, not yet in a build)
- **Vehicles (10):**
  - **Tank:** fed = Type 61 · spa = Magella Attack.
  - **Car:** fed = Federation hover truck · spa = Zeon armoured car.
  - **Helicopter:** fed = Gunperry (close stand-in) · spa = battle heli (transparent PNG used; the white-background .webp duplicate skipped).
  - **Jet:** fed = Federation fighter · spa = Dopp.
  - **Transport:** fed = Columbus-class · spa = Papua-class (transparent PNG used; the .jpg duplicate skipped).
- **Soldiers (12):** Federation + Spacenoid × Rifleman (also the squad image) / Machine Gunner / Sniper / Armor Unit / Shield Unit / Recon.
  - **Cut from the designer's two line-up sheets:** each shape was assigned to the soldier whose boots it touches, loose pieces to the nearest soldier.
  - **All 12 soldiers** now come straight from the **designer's own layered PSD** (one named layer per soldier, Federation + Spacenoid) — cleaner than automatic cutting.
- **Files:** `{fed|spa}-{rifleman,mg,sniper,armor,shield,recon,tank,car,heli,jet,transport}.webp` (≈35–80 KB each).
- **Optional, not provided:** Comm Array (the app will draw an icon); wireframes (sheets will use the profile images).

## ✅ cf26 — Ground units STAGE 1 built (roster + 5 vehicle sheets)
- **Images:** the designer's wireframes (10) were converted to tintable white line art (`img/ground/wire-*.webp`, blue / red per side), plus the 10 vehicle portraits and 12 soldier portraits (from the designer's PSD).
- **Ground Units tab:** vehicle cards per side (portrait, class, HP / Armor / AP / Move / Dodge / squads, weapons, "n / cap").
  - **Rules:** free (0 DP); caps Tank 2 · Car 4 · Heli 2 · Jet 2 · Transport 2 plus **8 vehicles overall**, enforced when adding.
  - **Infantry Squad card:** shows "next build".
- **Vehicle sheet** (ship-style layout):
  - **Model and rings:** tinted wireframe; **HP** ring; **Armor** ring (Tank / Car, labelled ground-battle only).
  - **Weapons table** tagged OVERMAP / GROUND / GROUND CALL, with tap-to-use AP:
    - **Tank:** Fire Support and Main Cannon have 1-turn cooldowns.
    - **Helicopter / Jet:** Strafe (max 4) and Bombing Run (max 2) charges granted to a ground engagement.
  - **Target-effects panel:** Fire Support (Tank) / Air Support (aircraft, incl. the splash roll); a "no attack" note for Car / Transport.
  - **Centre:** AP stepper, Movement (halved in Hide Stance), Dodge (10+/12+/14+/none), MOVE with undo.
  - **Status rows:**
    - **Hide Stance:** blocks attacks; resets each turn.
    - **Squads aboard:** −/+ (Car 1, Heli 1, Transport 2).
    - **Objective:** Tank only.
    - **Targeting:** proximity radius + dodge + Comm Array blackout note.
    - **Respawn:** base / board edge; restores full strength when destroyed.
  - **Destruction log:** HP 0 → DESTROYED; an Emergency Disembark reminder is logged if squads were aboard.
- **Other:** carriers only load mobile suits; no shields lent to ground units; the enemy pop-up shows HP / Armor words and Hide Stance.
- *Tested:* caps, carrier exclusion, tank HP / armor / cooldown / hide / destroy / respawn, jet charge cap, all 10 sheets on both sides, phone tab; the four-device team flow and carrier walkthrough still pass.
- **cf27 fix:** the sheet name-panel badge on ships and vehicles used the placeholder style (30% opacity + scan lines), so pictures were nearly invisible on Spacenoid sheets — it now uses the normal portrait style. Screenshots are re-sent as `*_cf27.jpg` (new names so phones don't show cached copies).
- **cf28:** ship and vehicle health bubbles — numbers are centred in the white bubble (value large, "/max" small underneath; measured within ~1px of centre on tablet and phone; 140/140 fits).
- **Next — stage 2:** Infantry Squad sheet (Overmap + 8 Soldiers, linking "Squads aboard" to real squads). Then stages 3–4: the Firefight Clash panel (offline, then online with animations).

## 🔧 Fixes requested after cf28 (designer) — to build next
1. ✅ (cf29) **Colour wheel for duplicate ground units** (same as mobile suits): picking a second Tank / Car / etc. should open the marker-colour wheel, and the pip shows on roster rows + the sheet badge. The ground cards currently call only `addUnit` → add `promptMarks`.
2. ✅ (cf29) **Tank cooldowns:** **Overmap Fire Support has NO cooldown.** Only the **Ground Battle Main Cannon** has the 1-turn cooldown. (The app currently gives Fire Support a 1-turn cd → set cd 0 and fix its note / row text.)
3. **Infantry loading for vehicles:** Car (1 squad), Helicopter (1), Transport Ship (2) use **the same loading system as the warship carriers** (load screen at Confirm, ⚓ ABOARD tags, launch / deploy and dock-style pickers, Emergency Disembark on destruction), but for Infantry Squads. Depends on stage 2 (squads exist) → build together with the Infantry Squad sheet. Replaces the temporary "Squads aboard −/+" counter.
4. ✅ (cf29) **Stance button** for ALL units, bottom-left next to TABLES — built (see below). **cf30:** restyled to match TABLES exactly and placed on a shared dock plate mirroring DONE + ROSTER.

### ✅ Rulebook updated (Section 9.4 Boost Stance)
- **Car fix:** Car Boost is **25 → 35cm/AP** (the old text said 20 → 30).
- **Now covers:** **all vehicles, Transport Ships and warships**, with the same no-attack restriction.
  - **Vehicles:** Tank 15→25, Car 25→35, Transport 20→30, Helicopter 35→45, Jet 50→60.
  - **Warships:** Musai 30→40, Salamis Kai 25→35, Rewloola 20→30, Ra Cailum 15→25.
  - A Boosting warship fires none of its weapons that turn.
- **Infantry Squads can never Boost.**
- (Updated `Gunpla_Battles_Rulebook.md` delivered. Assumptions to confirm: helicopters / jets count as "vehicles" for Boost; a Boosting warship may still launch / dock since those aren't attacks.)

### 🎛 Stance button — decisions so far
- **Rules:** **one stance at a time**; **Stealth is its own thing and never combines** (a unit shown only as a marker can't be tracked on Overwatch etc.).
- **✅ Built in cf29.** Final per-unit list (designer):
  - **Mobile suits:** Defense, Overwatch, Focus, Boost, Peek & Shoot, + Stealth (Pixy, Night Hawk).
  - **Warships:** Boost.
  - **Vehicles** (Tank, Car, Helicopter, Jet, Transport): **Boost only** — Tanks and Cars **cannot Hide**.
  - **Infantry Squads:** **Hide only** (no Boost) — comes with stage 2.
  - **Rulebook updated:** Hide is Infantry Squads only.
- **Behaviour:**
  - **Tap to declare / tap again to drop.** AP stances (Overwatch, Focus) refund if dropped or swapped in the same turn.
  - **Durations:** Boost is this turn only; Defense / Overwatch / Focus last until your next turn.
  - **Suits:** Boost = +10cm (purple) + a striped "NO ATTACKS" lock over the weapons table; Focus = DODGE disabled; each stance shows in the purple buff strip.
  - **Stealth** toggles the unit's existing stealth ability (2-AP move cap already applied) and blocks every other stance.
  - **Ships / vehicles:** Boost = +10cm, weapons refuse to fire, banner.
  - **Tags:** stance tags on roster rows + the enemy panel.
- *(earlier proposal kept for reference)* **Stances per unit (proposed, * = decided):**
  - **Mobile suits:** Defense, Overwatch, Focus, Boost, Peek & Shoot, Stealth (stealth units only).
  - **Warships:** **Boost*.**
  - **Vehicles** (Tank / Car / Heli / Jet / Transport): **Boost***, Hide (Transport / aircraft Hide still to confirm).
  - **Infantry Squad (Overmap):** Hide, **no Boost***.
  - **Soldiers (Detailed Map):** Defense (10cm), Overwatch, Peek & Shoot; Recon Stealth.
- **Planned UI:** a STANCE button next to TABLES opens stance cards (only the ones the unit can use); the active stance shows in the purple buff strip + roster badge (visible to the enemy online).
  - **Boost:** +10cm/AP; attacks locked this turn.
  - **Focus:** 1 AP; dodges off until next turn; "no +5 Called Shot" reminder.
  - **Defense:** badge until next turn.
  - **Overwatch:** 1 AP; watching badge.
  - **Stealth:** toggle; MOVE capped at 2; detection-radius badge.
  - **Hide:** moves out of the status table into this panel.
  - **Peek & Shoot:** a guided single shot with the +3 reminders.

## ✅ cf31 — DONE during the enemy turn = yellow TALLY ("damage counted so far")
- **Symbol:** the designer's tally image recreated as a small inline SVG (4 bars + slash); no counting logic, just the symbol.
- **Enemy turn:**
  - **Roster tick box:** shows the tally; tapping it (or the sheet's **DONE** button, which turns yellow with the tally) marks the unit counted.
  - **Counted rows:** keep their normal look (no dim / strike-through) with a thin yellow edge.
  - **Turn box:** "n / N counted" (yellow) + hint "apply damage, then tap DONE on each unit — a unit hit again clears its mark by itself".
- **Re-check:** a counted unit whose health drops again (limb / hull HP, shield, armor, crew, nuke, disembark) clears its mark automatically. It shows a pulsing **↻ RE-CHECK** tag + a toast naming the unit until DONE is tapped again. Repairs don't clear it. No targeting system needed — the trigger is purely "health went down after it was counted".
- **Turn changes:** marks reset every turn; in your own turn DONE stays the green ✓ (finished acting). Stored per unit → teammates see marks / clears live (tested with an editor and a watcher).
- **Decided:** no roster reordering; no "all unhurt" button. **cf32:** the enemy-turn sheet button reads **DAMAGE COUNTED** (two lines + tally) — own turn stays DONE ✓; hint / toast / log use "damage counted".

## ✅ cf33 — End-turn REQUEST while the defenders count damage + leadership hand-over
- **Decisions:**
  - Unhurt units just need DAMAGE COUNTED pressed.
  - Only the defending **leader** gets Accept now.
  - Only units that can take damage count (alive, not aboard / docking).
- **Flow:**
  - **All counted:** the active leader taps End My Turn; if every such defending unit is marked → the turn passes at once.
  - **Otherwise it becomes a request:**
    - **Requesting side:** "⏳ Ending your turn — waiting for the X to finish counting damage" + tally count + **Cancel request**.
    - **Defending side:** a pulsing banner "The X want to end their turn — finish counting damage" + count; the leader gets **Accept now**.
  - **Passing:** when the last unit is counted (or accepted), the requesting leader's device runs its normal End Turn (all end-of-turn effects) → the defenders auto-start. A unit hit again clears its mark → the request keeps waiting.
- **Server:** `turn.req {team, seq, ok}`, messages `endRequest` (+cancel) / `acceptEnd` (other side's leader only); cleared on every turn change (end, force, ends-count safety net).
- **Leadership hand-over:** "👑 Pass leadership" in the turn box (leader) → pick an active teammate → confirm; also "👑 make leader" next to teammates in the lobby. Server keeps a `lead/<team>` override while that player is active (falls back to the old rule otherwise). The old leader's pending team save is sent first.
- **Fix:** the turn box now redraws when the request, either side's count or the leader changes (not only on turn changes).
- *Tested:* 3-device walkthrough (request / cancel / live count / auto-pass / member banner without Accept / leader Accept / destroyed unit excluded / hand-over); the team-flow and turn-cycle tests updated so defenders count first — all pass.

## ✅ cf34 — Ground units STAGE 2 + STAGE 3 (Infantry Squads, vehicle loading, Quick Resolve offline)
- **Infantry Squad unit** (per side, max 4, free; portrait = that side's Rifleman). Sheet with three tabs:
  - **OVERMAP:**
    - **Squad Health:** 8 soldier portraits = living soldiers. Tap → "which soldier falls?" picker (player chooses; Repair restores, never Armor Unit / Recon).
    - **Stats:** AP (1 at 1 soldier), Move 10cm (5 in Hide), Dodge 10+, Firepower.
    - **Coordinated Strike card:** 1 AP, 90cm, 2+/3+/4+, target table, no squads within 30cm.
    - **Other:** MOVE; Respawn when wiped.
  - **8 SOLDIERS:** cards per role with HP ●×6 and Kevlar ●×6.
    - **Shields:** Armor / Shield Unit shield (3 Armor + 6 HP) + Shield ⇄ Rocket / SMG swap (1 AP).
    - **Items:** Grenade ×2 (MG), Rocket ×2 (Armor), Flashbang ×2 (Shield), Smoke ×2 (Recon).
    - **Other:** KIA state + Kevlar rules note. A soldier reaching 0 HP lowers squad health automatically.
  - **QUICK RESOLVE:**
    - **Rounds and dice:** round 1–4; squad strength + Firepower; suppressed this round / next round; "ROLL n DICE" (min 2 rule).
    - **Buttons:** Record casualty / Next round (moves suppression over).
    - **Items and call:** item charges (2 Flashbang / 1 Smoke / 1 Grenade); blind call YOU / THEM + REVEAL (counter triangle applied: Flashbang → +3 of yours suppressed, Smoke clears yours, Grenade casualty picker incl. COUNTERED on the thrower).
    - **Reference:** margin table + Perfect Volley / Last Man Standing / Firepower notes.
    - **Optional SIMULATED DICE** (both teams agree): enemy strength / suppression, ROLL, dice faces, margin result applied (casualty picker + suppression), 1s tracked.
    - **After round 4:** Objective Clash (2d6 + HP advantage, re-roll ties), Forced Re-Engagement (spends a Flashbang), New segment / New engagement (refills items).
  - **Stance:** Hide only (blocks the strike, halves movement).
- **Vehicle loading (Car 1 / Heli 1 / Transport 2):**
  - **Load step:** "Load your vehicles" after the ship load step at Confirm (optional; tap a squad to cycle it through the vehicles).
  - **Aboard squads:** ⚓ ABOARD tag, skipped for turn / damage counts, open the vehicle's sheet.
  - **Vehicle sheet:** "Squads aboard" row → + Embark / ⇩ Disembark pickers.
  - **Destroyed vehicle:** Emergency Disembark (set or roll losses per squad — 1d6 per soldier, 4+ survives; losses applied riflemen-first, adjust on the Soldiers tab; synced via a brief lock).
- **Fix:** the ☢ button on ground vehicles (flat HP damage) and squads (casualty picker / per-soldier note) — it used to write mobile-suit limbs.
- *Tested:* caps, load step, tags, embark / disembark, emergency disembark, casualties, soldier HP link, item reveals incl. counter, rounds / suppression, engagement refill, simulated roll, Objective Clash, Hide, nukes; online sync (teammate sees casualties, aboard squads skipped in the enemy's count); team-flow and carrier regressions pass.
- **Next — STAGE 4 (online Firefight):**
  - **Clash link:** pair your squad with an enemy squad in a shared clash.
  - **Blind picks:** kept secret by the room until both lock.
  - **Reveal animations:** flash / smoke / explosion.
  - **Volunteers:** any member can run the clash.
  - **Shared dice:** simulated dice agreement between both devices.

## ✅ cf35 — touch-friendly 8 Soldiers tab + visible ground limits
- **Soldier cards:**
  - **Bubbles:** big tap bubbles with a coloured ring (HP green→amber→red, Kevlar blue, shield ARMOR / SHIELD grey); a tap applies the DMG amount chosen at the top (Repair adds).
  - **Buttons:** items (×n, "tap to use") and the ⇄ swap; the rules line moves to a tooltip for shield units.
  - **Sizes:** ≈69px bubbles on desktop (57px on 4-bubble cards); 2-column scrolling grid on phones (≈76px bubbles).
- **Ground Units tab:** VEHICLE LIMIT n / 8 with an 8-slot bar ("n left" / amber "FULL") + chips per type (Tank 2, Car 4, Heli 2, Jet 2, Transport 2, Infantry Squads 4), amber when full.
- **cf36:** the soldiers tab is now **two pages of four** (RIFLEMEN & MG · SPECIALISTS), with page buttons showing the four faces + "n / 4 standing".
  - **Cards:** tall, with **large soldier art** (side-coloured glow, floor shadow, role tag), a big red KIA stamp + greyed art when down, a name bar, bubbles (≈73px desktop / 61 tablet / 40 phone) and gear buttons.
  - **No scrolling** inside the page.
- **Open (designer):** Quick Resolve "YOU / THEM" — the designer finds it odd ("shouldn't it be us only"). Offline the THEM pick is needed to work out the counter; online (stage 4) each team picks on its own device, so only "us" would show. To be settled when we rework Quick Resolve.

## ✅ cf37 — Soldier card v3 (built)
- **Designer decisions:**
  - **AP costs:** thrown items **1 AP**, Rocket **2 AP**.
  - **Switching weapons always costs 1 AP** (Shield ⇄ Rocket / SMG, Sniper ⇄ Pistol, SMG ⇄ Knife).
  - **Stance button** on each soldier (top-right of the art).
  - *(App reading: thrown items are used straight from the weapon list, not "switched to", so a Grenade costs 1 AP, not 2.)*
  - ✅ **Rulebook updated** (Section 13.6): Armor Unit table row (Rocket 2 AP, 60cm, 10cm AoE), items paragraph (throwing 1 AP, no switch; Rocket 2 AP and must be equipped), one weapon-switch rule (1 AP for Sniper ⇄ Pistol, SMG ⇄ Knife, Shield ⇄ Rocket / SMG), Sniper backup row note.
- **Card:**
  - **Top:** big art + role tag + stance corner; name bar.
  - **Bubbles:** AP (purple, 3, refills each turn) · HP · Kevlar (+ Armor · Shield).
  - **Buttons:**
    - **MOVE:** 1 AP, ×count, ↶ undo.
    - **DODGE:** free, logs a blast dodge 4+ with the "no Rockets / Bombing Run / bullets" reminder, ×count, ↶ undo.
    - **FIRE:** current weapon's AP; the Rocket uses a charge; shield = "shield up" refuse; the Knife logs a takedown attempt; Recon firing the SMG ends Stealth.
  - **⇄ weapon button:** shows the current weapon's dice / range / hit + charges; opens the weapon list (stat chips + rule notes, EQUIPPED / SWITCH · 1 AP, thrown items THROW · 1 AP ×n).
- **Per-soldier stances:** Overwatch (1 AP, until next turn), Peek & Shoot (guide, ±1 rules), Defense (free, 10cm), Stealth (Recon only, toggle, never combines). Swapping refunds AP in the same turn.
- **ⓘ GROUND RULES panel** (collapsible): map / conversion / ranges · soldier stats + squad table (with the new AP costs) · Kevlar & blast dodge · shields · items · Recon knife / stealth · detailed-map stances · vehicles in a ground battle.
- *Tested:* every action / cost / refund / refusal, stance durations, turn refill; the squad regression passes.
- **cf38:** DODGE button removed from soldier cards (designer: not useful, takes space); MOVE and FIRE are now two large buttons (≈146×60px desktop). The blast-dodge rule remains in the GROUND RULES panel.
- **cf39:** a green "BLAST DODGE 4+" reminder under MOVE / FIRE on every soldier card (tooltip: no Rockets / Bombing Run / bullets).
- **cf40:** squad sheet on phones — Overmap (2 columns) and Quick Resolve (3 columns) never stack (stacking pushed FIRE and other info off-screen); Squad Health portraits in a 4 × 2 grid (≈66px phone / 104px desktop), shifted down so heads aren't cut off. No card overflow on phone 892×551, tablet or desktop.
- **Noted (not changed):** on narrow phones the sheet's top bar wraps onto two rows, so every sheet scrolls slightly at the bottom — possible future polish (a single-row compact top bar).
- **cf41:** squad sheet — **MOVE under FIRE** in the Coordinated Strike card (same size, ×count, ↶ undo; the floating MOVE is removed).
  - **8 Soldiers / Quick Resolve:** hide the top-right unit panel (compact mode) and use the space. Soldiers' bubbles are larger (≈48px phone / 64 tablet / 76 desktop).
  - **Shield units:** show **two bubble rows** (AP · HP · Kevlar / Armor · Shield ≈43px on phone) — nothing clipped on phone 892×551, tablet or desktop.
- **cf42:** removed the always-on help sentence under the sheet and the red HEAD = KILL tag.
  - **New ? button** (bottom-right, beside DONE, same style; right dock plate widened) → "How this sheet works" guide.
  - **Guide content:** a section for the open unit type (suit incl. **kill location**; ship; vehicle; squad) + top bar, bottom buttons (DONE / DAMAGE COUNTED explained), timeline.

- **cf43 (designer idea):** soldier stats became **segmented bars** on the left of the art (AP purple 3 · HP green→amber→red 6 · Kevlar blue 6 · + Armor grey 3 · Shield slate 6 for shield units); the bubble row is gone, so every soldier's art is the same size.
  - **Editing:** tap a bar to select it (glow) → strip **▲ ▼** (move the selection, wraps) **− / +** (AP ±1; health bars ± the DMG amount, logged, HP 0 → KIA + squad health) **✓** (close; tapping the bar again also closes).
  - **Behaviour:** the strip label follows DMG chip / # changes. The selection clears on page / tab change or when opening another squad.
  - **Phone:** bars 25px, strip buttons 31×28px, nothing clipped.

## ✅ cf44 — sheet sizing + bigger tables (designer: yes to all three)
- **Why not a plain stretch:** the sheet is a fixed 16:9 drawing (positions in % of the sheet; circles, text and wireframes scale with its width). Stretching to other screen shapes would squash the wireframes and pull the rings off their limbs.
- **Proposal:**
  - **(1) Fit to screen:** the sheet scales down to fit the screen height too, so the whole sheet + bars is always visible without scrolling (side margins on very wide phones).
  - **(2) Compact one-row top bar** on phones.
  - **(3) Bigger ability / weapon tables** on suits and ships: re-lay the left column (tables taller, bigger text and AP / cooldown / ammo tap targets) using the space around them.
- **Built (cf44):**
  - **Fit to screen:** the sheet keeps 16:9 and its width follows the height left by the top bar and timeline (recomputed on resize / rotation / timeline changes); the timeline is capped (16vh, 14vh on phones) and scrolls inside. Measured with **no page scroll** on phone 892×551, tablet 1180×820, desktop 1400×880 and wide 1920×950 (centred with side margins).
  - **Phones (≤1000px):** the top bar is **one row** (meta + duplicate HP total hidden, name ellipsis, smaller chips, sideways scroll as a fallback) — 31px tall.
  - **Mobile suit tables:**
    - **Abilities:** 12.6–47.6% with 6.2% rows.
    - **Weapons:** 54.2–91.2% with 6.6% rows.
    - **Other:** text ~15% larger; each weapon's stored row is remapped to the new grid (shield positions untouched); buff strip and Boost lock moved to match.
  - **Ship / vehicle tables:** larger name / cell / AP text (their height is limited by the model art above).
- **cf45:** ⓘ GROUND RULES moved into the sheet's bottom row — full size, centred on its own plate between TABLES · STANCE and ? · DONE · ROSTER; shown on all squad tabs, hidden on other sheets; the soldier grid gets the freed height.
- **cf46:** the in-sheet **ROSTER picker** now shows unit status like the roster screen.
  - **Layout:** grouped by Mobile suits / Ships / Ground units, with portraits.
  - **Tags:** ⚓ ABOARD · carrier (greyed row + "opens the …"; tapping still redirects to the carrier), 🚀 LAUNCHED / DOCKING, stance, ✓ DONE (your turn) or yellow COUNTED tally (enemy turn), ↻ RE-CHECK, ✎ You / 🔒 name (sheet open), OPEN NOW, destroyed (struck through).
- **cf47 fix (designer report):** suits could be launched from a ship during the enemy turn.
  - **Ship abilities:** Launch / Dock / Decoy are now own-turn only (cells show — and the pickers refuse with a message).
  - **MOVE:** also found that MOVE buttons (suit, ship, vehicle, soldier) looked disabled in the enemy turn but still spent AP when tapped — now blocked ("That can only be done on your own turn").
  - **Still allowed in the enemy turn:** Emergency Disembark and squad disembark ("at any point").

## ✅ cf48 — new menu art + PLAY ONLINE clash animation
- **Designer's layers:**
  - **Background:** no suits / text.
  - **Suits:** the Gundam + Zaku image, split at the empty gap (x 830 of 1672) into two full-size transparent layers so they stay aligned.
  - **Clash effect:** transparent overlay (1400px, 365 KB).
  - **Logo:** trimmed.
  - **Files:** `img/menu2-*.webp`, offline-cached, preloaded on the landing page.
- **Landing (idle):** background + separate logo (drop-in) + cards; 🔊 / 🔇 toggle top-right (saved per device).
- **PLAY ONLINE:**
  - **0–0.25s:** cards / bars fade; the logo dims and lifts.
  - **0.1–0.85s:** the Gundam charges in from the left and the Zaku from the right (blur + skew easing into place).
  - **0.85s impact:** clash burst (screen blend) + white shockwave ring + hit flash + screen shake; the suits recoil; the logo flares; synthesized clash sound (boom + crack + metallic ring + crackle).
  - **1.6s:** white-out → **lobby at ~2.0s** → overlay gone by 2.65s (measured in-page).
  - **Whoosh:** a synthesized whoosh panned from both sides plays on the charge.
- **Designer decisions:**
  - **After the clash:** straight into the lobby (the hangar doors stay for team → roster).
  - **Skip:** from the 2nd time a SKIP ▸ button (or a tap anywhere).
  - **Sound:** OK if no files needed (all Web Audio).
- **Other paths:** returning to a live session and reduced-motion devices use the quick hangar transition. PLAY OFFLINE is unchanged (hangar doors). The offline faction menu (s1) still uses the old art.
- **cf49 — clash animation v2 (designer):**
  - **Sequence:** the logo disappears at the tap (landing logo and overlay copy) → the suits charge → impact at 0.76s → **zoom into the clash** from 1.0s (whole scene ×4.4 around the impact point, brightening) → **white** from 1.5s → **only the logo** on white at 2.0s (blur-in) → at 2.9s the lobby appears under it and the white + logo fade out (gone ≈3.65s).
  - **Fix:** the overlay's logo copy briefly showed around the impact; it is now hidden until the logo stage.
  - **Unchanged:** SKIP / reduced-motion paths.
- **cf50 — clash animation v3 (designer):**
  - **Zoom:** harder — starts at 0.9s, ×9 in 0.75s with a strong ease-in, brightening, slight blur, blowing out to white (white from 1.3s).
  - **Ending:** instead of the logo on white, the white clears (0.7s) to the **empty background** (darkened edges, slow settle) with the **logo as the hero** (big, blur-in flare) from 1.75s. The lobby fades in at 3.1s (overlay gone ≈3.85s).
  - **Unchanged:** SKIP / reduced-motion paths.
- **Designer is also trying a generated video version** — a prompt set was provided (main prompt, negative prompt, settings, 3-clip fallback). If a video comes back: MP4 / WebM < 5 MB, no audio, ending on white; the app would overlay its own logo / lobby fade and keep the code animation as a fallback.
- **cf51 — clash polish (designer):**
  - **Sharper clash:** from the designer's 4× upscale (6688px) → `menu2-clash.webp` at 2600px (965 KB), noticeably sharper during the zoom.
  - **Glow layer:** under the clash (inside the zooming scene) — a white core + blue light spreading left + red light spreading right (screen blend); fades / scales in with the impact, then pulses gently, so the burst's light no longer ends abruptly.
  - **Logo glitch fix:** the end-logo animation switched between different filter lists, so the browser jumped instead of blending. Every keyframe now uses the same list (blur · brightness · shadow · glow) and the lighting eases smoothly (brightness 2.2 → 1.0).
- **Video route:** the designer is making a Higgsfield clip (start frame = background, end frame = logo, elements @clash @Gundam @zaku). Prompt + negative prompt delivered, plus `end_frame_logo_on_background.png`.
- **cf52 (designer):**
  - **Sound removed** (no whoosh / clash; 🔊 button gone).
  - **Black-bar fix:** the shake moved the whole screen and exposed an edge. Now the scene sits in a wrapper 6% larger than the screen on every side and only that wrapper shakes (slightly softer); measured ≥17px overhang on every edge at every shake frame (phone portrait) and ≥29–37px on landscape / desktop.
  - **Matching zoom:** the landing background and the ending background use the same 12% zoom, so they line up exactly with the animation (0px offset).

## 🟢 STAGE 4 — ONLINE FIREFIGHT — PART A BUILT (cf53); part B (multi-squad) next
- **Flow:**
  1. **Invite:** squad → QUICK RESOLVE → "⚔ Challenge" → pick enemy squad(s).
  2. **Accept:** any enemy device can accept or decline (the first to accept volunteers for that side).
  3. **Dice mode:** Physical / Roll for me (a "Roll for me" needs the other side's OK; a decline means physical).
  4. **Clash screen:** full screen on both devices.
- **Round:**
  - **Roll for me only:** the room rolls both pools first.
  - **Declare:** pick None / Flashbang / Smoke / Grenade and LOCK.
  - **Reveal:** once both lock, a 3-2-1 countdown, then REVEAL on both.
  - **Animations** on the receiving screen: Flashbang = white flash, Smoke = clouds, Grenade = explosion (on the thrower's screen if countered).
  - **Physical dice:** each side adjusts its own casualties / suppression, then READY.
  - **Rolled dice:** the app applies the triangle + margin table (the loser picks who falls), then READY.
  - **After round 4:** Objective Clash / new segment / Forced Re-Engagement / end.
- **Designer decisions:**
  - **Leaving:** the clash PAUSES and any device on that team can pick it up.
  - **Enemy item charges:** HIDDEN (a skill to track mentally).
  - **Challenges:** any squad may challenge any enemy squad (distance handled at the table), but a squad already in a firefight can't be challenged.
  - **Roll for me:** roll first, then declare (as described).
- **Multi-squad** (rules 13.6: always sequential 1v1 segments):
  - **Challenges:** one challenge = your squad(s) vs enemy squad(s) → a queue of 1v1 segments.
  - **2v1:** the lone squad fights each in turn, damage carries, **items refill each segment**.
  - **Larger fights:** pair up; the outnumbered side re-uses a squad that already fought (damage carried, items refilled).
  - **Objective:** an Objective Clash after every segment sets the objective holder; Forced Re-Engagement after each segment.
  - **Merge survivors:** a side can combine its squads (HP pooled up to 8, no reserves left).
  - **Status:** ⚔ IN FIREFIGHT · segment n / N on roster rows / enemy panel; a fight card with segments / holder / Resume on the involved squads' Quick Resolve tab.
- **Technical:**
  - **Secrecy:** the room server holds picks until both lock.
  - **Dice:** the server rolls "Roll for me" dice.
  - **Squad lock:** the volunteer holds the squad lock during the clash.
  - **Offline:** the one-device Quick Resolve stays as is.
- **OPEN:** who orders / pairs segments? Proposal — the challenger picks their squads + order; the defender picks which of theirs is re-used when outnumbered.
- **Build plan:**
  - **(A)** 1v1 core: invites, clash screen, secret picks, animations, physical / rolled dice, pause / resume.
  - **(B)** multi-squad queues, merge, objective tracking.
- **cf53 — part A built:**
  - **Server:** `ff/<id>` public record + `ffsec/<id>/<side>` secret picks (never synced).
    - **Ops:** invite / accept / decline / join / pause / mode / modeAnswer / ready / unready / pick / unpick / objective / segment / end.
    - **Dice:** the room rolls both pools (rolled mode) and the Objective Clash.
    - **Other:** a squad can only be in one active fight; old records are tidied after 60s; if both players ask for rolled dice, that counts as agreement.
  - **App:**
    - **Challenge:** CHALLENGE card on the squad's Quick Resolve tab → enemy squad list (busy / aboard / wiped out greyed).
    - **Invite banner:** on the defending team (any player can accept — opens that squad's sheet).
    - **Clash screen:** header with round pips / mode / ⏸ Pause; your squad (strength, FP, suppression, your items) vs enemy (strength, items hidden).
    - **Stages:** challenge sent → dice mode (physical / roll-for-me ask → answer) → READY → (rolled dice shown) blind item pick + LOCK / Change → 3-2-1 countdown → flip-in item cards + effects text → animations on the receiving screen (Flashbang white-out, Smoke clouds, Grenade blast + shake, including a countered grenade on the thrower) → physical: Record casualty + next-round suppression / rolled: margin table applied (casualty picker, suppression, Perfect Volley, Last Man Standing, 1s) → READY FOR ROUND n → after round 4: Objective Clash result, new segment, Forced Re-Engagement (spends a Flashbang), end.
    - **Bookkeeping:** each device applies effects to its own squad; items refill per engagement; suppression carries to the next round (cleared at a new segment).
    - **Pause:** pausing hands the side to any teammate (card: Open / Take over / Resume, on every squad tab).
    - **Tags:** ⚔ FIREFIGHT on the roster + enemy panel.
    - **Fixes found in testing:** pickers above the clash screen; enemy strength refresh; the squad tab kept per device (it used to be reset by sync); invite banner refresh.
  - *Tested (2 devices):* invite / accept, rolled agreement + identical dice, pick secrecy, countdown / reveal, countered grenade, flash suppression, margin casualties, 4 rounds + end + objective, pause / resume, new segment, end, physical-mode fight on a second squad; team-flow, carrier and end-turn-request regressions pass.
- **Next:**
  - **(B)** multi-squad queues (2v1 / NvM pairing, the defender picks re-used squads, damage carries, items refill), merge survivors, objective holder across segments.
  - **Then** rework the one-device Quick Resolve.

## ✅ cf54 — layered landing scene (designer: "do whatever, make it look pretty")
- **Designer's layers:** background (space + planet), emblem, ships (split at the empty gap x 835 into the Federation / Zeon fleets), rocks, foreground ruins → `img/m3-*.webp` (≈1 MB total, offline-cached).
- **Parallax:**
  - **Depth per layer:** space 0.7 · stars 0.9 · emblem 1.3 · fleets 2.6 · flashes 3 · asteroids 4.2 · ruins 6.4 · embers 7.2 (% of the screen); all layers 8% oversized so edges never show.
  - **Input:** mouse (leans away from the pointer), touch drag (springs back on release), phone tilt (iPhone permission asked on the first tap), eased per frame; paused when the page is hidden or the clash plays.
- **Ambient:**
  - **Scenery:** fleets advance / retreat (17s / 19s), asteroid float, slow space zoom, twinkling star specks.
  - **Emblem glow:** a blurred duplicate fades in and out (no costly filter animation).
  - **Effects:** blue / red explosion flashes among the fleets every 1.4–4s, 18 embers rising from the ruins.
- **Clash integration:**
  - **Live scene:** the overlay is transparent over the live landing scene (identical start), and the scene shakes with the impact.
  - **Fly-through zoom:** per layer — ruins ×3, asteroids ×2.2, fleets ×1.6, emblem ×1.5, space ×1.25, fading out as the burst takes over.
  - **Why not a copy:** an earlier version copied the scene into the overlay; it was far too heavy (2 frames vs 20) and was dropped.
- **Performance:**
  - **No layer pinning:** no permanent will-change on the big layers (it would pin ~100 MB of GPU memory on high-DPI phones).
  - **Lite mode** (≤2 GB memory or ≤2 CPU cores): parallax only.
  - **Reduced motion:** a still image.
  - **Measured:** clash smoothness back in line with cf53 in the test browser.
- *Tested:* parallax offsets by depth and edge coverage, phone drag + release, explosion flashes, landing reset after returning, clash screenshots at the impact / fly-through, animation flow (skip, reduced motion, phones); team-flow and firefight regressions pass.
- ✅ **cf55:** the offline faction menu (s1) uses the same layered scene + separate logo; the motion loop / flashes / pointer handling serve whichever menu is showing; measured no overlap / no scroll on desktop, phone landscape and portrait; faction pick → enter still works.
- **cf56 — Quick Resolve cleanup (designer):**
  - **Old board removed:** the one-device Quick Resolve board is gone. The QR tab = the online firefight card (Challenge / Open / Resume), a note when not in a session, a 4-step "how a round works" guide and the margin table (+ firepower, Perfect Volley, Last Man Standing).
  - **Rules order fixed:** items are revealed first, then dice are rolled (Smoke clears THIS roll's set-aside dice; Flashbang affects NEXT round). The server's rolled-mode dice are now rolled at the reveal, using each side's soldiers + set-aside dice (Smoke applied).
  - **Clearer set-aside dice:**
    - **Pick screen:** "⚠ N of your dice are set aside this round (you were flashed) — unless your Smoke clears them".
    - **After the reveal:** "🎲 ROLL N DICE NOW · Firepower F − S set aside" + "You were flashed last round — physically move S dice away from your pool before rolling" + the die key.
    - **NEXT ROUND box:** "✦ Flashed: set 3 dice aside" (automatic) + one adjuster for "your 1s + margin-table suppression" (auto-filled with rolled dice) → "next round you roll M dice".
  - **Wording:** "suppressed" is now "set aside" in all firefight text.
- **Still to do:** part B (multi-squad), then decide whether a one-device firefight is needed at all (designer: removed for now).
- **cf57 — designer corrections:**
  - **Flashbang is IMMEDIATE:** the flashed squad rolls 3 fewer dice THIS round (8 firepower → roll 5; minimum 2 still applies; the target's Smoke cancels it).
    - **App:** the roll box shows "Firepower F − 3 flashed → ROLL N DICE NOW" + "You were flashed — physically move 3 dice away".
    - **Server:** rolled mode removes the 3 dice.
    - **Rulebook updated:** items table + an explicit in-round order (declare → reveal → item effects → roll → margin; 1s / margin set-aside dice count next round).
  - **Margin on the battle screen:**
    - **Physical:** a "📋 LOST THIS ROUND? PICK THE MARGIN" button → table (won / tied, lost by 1 / 2–3 / 4 / 5 / 6+, enemy Perfect Volley 2–7+ dice) → applies casualties (who-falls picker) + next-round set-aside dice; shows "✓ margin 4: 1 casualty + 1 set aside — tap to change".
    - **Rolled:** the table with YOU x – y ENEMY and the matching row highlighted.
  - **NEXT ROUND box:** "your dice that rolled a 1" adjuster + margin part → "you start next round with N dice".
  - **Fixes:** the reveal cards flip only once (re-renders were restarting the flip); remaining "suppressed" wording → "set aside".
- **cf58 — replay check (designer asked):** adjusting "your 1s" does NOT replay anything — measured: the reveal cards stay settled (flip once), and no animation restarts across 3 taps.
  - **Hardened:** item effects (flash / smoke / blast) now play on their own fixed layer so redraws can't cut them short (verified: the flash kept running through 4 taps), and a redraw during the 3-2-1 countdown keeps showing the current number instead of "…".
- **cf59 — new menu ships (designer's sheet):**
  - **Cut-out:** 9 ships (4 Federation, 5 Zeon) cut out individually. Two touching pairs were separated with a column cut and a per-column gap trace.
  - **Arrangement (canvas 1672×941):**
    - **Far (smaller, dimmer):** Federation smalls top-left; Zeon smalls top-right and just right of the emblem.
    - **Near:** Federation mid-size + flagship on the left (flagship partly behind the ruins); Zeon red big upper-right + green big right.
  - **Layers:** `m4-far-fed / far-zeon / near-fed / near-zeon.webp` (14–59 KB each) replace `m3-ships-l/r` (deleted).
  - **Depths:** far 2.0, near 3.4 (between the flashes and the asteroids).
  - **Drift:** far 23 / 25s, near 16 / 18s with bigger swings.
  - **Clash fly-through:** far ×1.35, near ×1.8.
  - **End background:** `menu2-bg.webp` rebuilt with the new ships.
  - **Layout script:** saved in the project (`ship_layout_compose.py`), so positions can be tweaked quickly.
- **cf60 — Perfect Volley rule change (designer):** with the minimum Firepower of 5 dice, the full-pool volley was near-impossible.
  - **New rule:** a Perfect Volley happens only when a squad rolls **2–5 dice**, every die a 6 — destroys 2d=3 · 3d=4 · 4d=5 · 5d=6. It **includes suppressed / flashed squads down to 2 dice**; 6+ dice can never volley.
  - **Rulebook** updated (table + explanation + odds).
  - **App:** the margin picker has ONE row "Lost to a Perfect Volley" → "how many sixes?" (2 / 3 / 4 / 5, with the suppressed-squad explanation) → applies the casualties (who-falls picker). Rolled mode uses the same 2–5 rule. The QR tab reference text is updated.
- **cf61 — effect art (designer's explosion + beam sheets):**
  - **Sprites:** cut into `img/fx/` (15 files, ≈440 KB): orange fireballs ×3, orange ring, pink blasts ×2, pink star, pink ring, yellow star, white star, pink spark, ground blast, fire-smoke, yellow beam (flipped so the head leads), pink beam.
  - **Menu scene (landing + offline):** every 1.1–3.3s either a ship takes a hit (orange blasts on Federation ships, pink on Zeon) or a beam shot crosses the gap (pink from Federation, yellow from Zeon), travelling along its angle and ending in an impact sprite. Uses ship hotspots matching the cf59 layout.
  - **Firefight:** Flashbang = white starburst behind the white-out; Grenade = fireball + ground blast + shake; Smoke = clouds + desaturated smoke sprite.
  - **Unit sheets:** tapping damage shows a small spark at the tap; a part / unit reaching 0 shows a fireball; nothing on repair; off with reduced motion.
  - **Note:** the ambient menu effects are skipped in **lite mode** (≤2 CPU cores or ≤2 GB memory). The test browser has 1 core, so effects were verified with a simulated 8-core device.
- **cf62 — effects variety (designer: "scale and stretch them as needed"):**
  - **Menu events every 0.9–2.9s:**
    - **Long beam (14%):** the beam image stretched to the full ship→target distance, flashes on, holds, thins and fades; a big impact (10–14vmax) + shockwave ring + muzzle spark.
    - **Bolts (36%):** 1 or a burst of 3; random length 8–20vmax and thickness 1–2.4vmax.
    - **Chain (12%):** 2–4 small blasts rippling across one ship.
    - **Single blast (38%):** small 3–6 / medium 6–10 / big 10–15vmax (big + ring).
    - **Stretch:** every sprite is slightly squashed differently for variety.
  - **Sheets:** destroyed parts get a bigger fireball (up to 380px) plus an orange shockwave ring.
- **cf63 — explosion re-cut (designer: crops were bad on boom-o1, boom-p1, boom-p2, star-p, star-w, star-y):**
  - **Cause:** the fixed 4×4 grid chopped rays that cross cell lines and pulled in neighbours' fragments.
  - **New method:** a watershed split on the alpha channel, seeded with each sprite's solid core, so boundaries follow the dimmest gaps; an 8px soft fade where two sprites touch; a 6px transparent margin.
  - **Result:** all 16 sprites verified with edge alpha 0; 13 used files re-exported with the same names (max 420px wide).
  - **Layer order:** the menu effects layer now sits above the near ships (hits on them were hidden) and below the asteroids / ruins.
- **cf64 — more beam fire (designer):**
  - **Colours confirmed:** Zeon fires YELLOW beams, the Federation fires PINK.
  - **Timing:** events every 0.7–1.9s (was 0.9–2.9).
  - **Mix:** long beams 22% / bolts 50% (bursts of 3 at 35%, return fire from the other fleet 30% of the time) / chains 10% / single blasts 18%.
  - **Limit:** up to 12 effects at once.
  - **Measured:** ≈19 beams per 20s (~1 per second).
- **cf65 — space explosions (designer):** the menu uses only the round fireballs + ring blasts — Federation ships: boom-o1 / o2 / o3 + ring-o; Zeon ships: boom-p1 / p2 + ring-p. Starbursts (star-y / spark-p) are only used as the muzzle flash at a long beam's origin. Verified over 20s.
  - ⚠ **Note:** the working folder contained an UNAPPROVED, never-delivered hangar-effects build (from another branch of the conversation). It was set aside (`/home/claude/aside/index_with_hangar_fx.html`, `lbfx_module.js`). cf65 was rebuilt from the delivered cf64 zip, so it has no hangar code.

## 🟡 Proposed — hangar (lobby) effects — waiting for the designer
- **Single-image ideas:**
  - **Suits:** Zaku mono-eye sweep, Gundam eye glow + flare on joining.
  - **Lighting:** light strips pulse / chase; overhead flicker; searchlight sweeps; wet-floor sheen.
  - **Atmosphere:** floor fog + dust; welding sparks; distant battle flashes in the space windows.
  - **Lobby moments:** your hangar powers up when you pick a side; all ready → alarm beacons + "LAUNCH SEQUENCE"; start → door-seam sparks + steam.
- **Layered-art ideas:** parallax, banner sway, suit idle sway, crew walking — needs layers (space windows · structure · Gundam · Zaku · banners · foreground · light strips).
- **Open questions:** single image now or wait for layers? Which favourites? Silent?
- **A draft implementation exists (set aside).** It can be restored once the designer chooses.
- **cf65 — space explosions (designer):** the menu scene uses ONLY starbursts and rings — star-y + orange ring on Federation ships, star-p + pink ring on Zeon ships (the same for bolt impacts, long-beam impacts and chains); muzzle flashes unchanged.
  - *Measured over 20s:* star-y 15, ring-o 7, ring-p 8, star-p 5, no fireballs.
- ⚠️ **Note:** the working folder contained an unfinished, never-delivered hangar-effects build from another version of this conversation. cf65 was rebuilt from the delivered cf64 WITHOUT it; that code is saved aside (`/home/claude/aside/`) in case the designer wants the hangar effects.

## ✅ Hangar effects — built in cf66 (designer: lobby first, then roster backgrounds)
- **Single-image version:**
  - **Suits:** Zaku mono-eye sweep + glow, Gundam eye pulse.
  - **Lighting:** light strips pulsing / chasing, overhead flicker, searchlights, floor sheen.
  - **Atmosphere:** floor fog + dust, welding sparks, distant beam flashes in the space windows.
  - **Lobby moments:** your hangar powers up when you pick a side; alarm beacons + "LAUNCH SEQUENCE" when all are ready; door-seam sparks + steam at start.
- **Needs layered art:** parallax, banner sway, suit idle sway, crew movement.
- **Questions:** single image now or wait for layers? Favourites? Keep it silent?
- **cf66 — hangar effects:**
  - **Team lobby (s5):** the set-aside hangar module was reviewed and brought in.
    - **Layer:** matched to the lobby picture (cover 50% / 30%).
    - **Suits:** Gundam eye glow + Zaku mono-eye sweep (positions verified on the art).
    - **Lighting:** 4 light strips chasing upwards, 2 searchlights, floor sheen.
    - **Atmosphere:** 2 fog bands + 22 dust specks; welding sparks at 6 spots.
    - **Space windows:** beams in the side's colour + star / ring blasts only.
    - **Lobby moments:** picking a side → that hangar powers up (eye flare + fast strips); everyone ready → amber beacons + LAUNCH SEQUENCE tag; start → door-seam sparks + steam.
    - **Tested:** 2 players.
  - **Budget / roster (s2 / s3):** a new layer for the side's hangar picture (cover 70% / 40%, tall screens 72% / 50%), masked so it fades out behind the list.
    - **Federation:** Nu Gundam visor glow (71.4%, 16.6%). **Spacenoid:** Zaku mono-eye glow + sweep (69.1%, 13.4%).
    - **Also:** 3 flickering ceiling lights per side, 2 mist clouds at the feet, a searchlight, floor sheen, 16 dust specks, sparks at 4 spots.
    - **Switching:** the layer switches with the side and disappears off those screens.
  - **Modes:** lite mode keeps only the glows / flicker / mist; reduced motion turns everything off.
  - *Regressions:* team flow, firefight, clash, infantry, carriers all pass.
- **cf67 — no more fireballs (designer: "explosions still use boom"):** the only remaining boom uses were the sheet's destroyed-part effect and the firefight Grenade.
  - **Now:** sheet kill = star-y + orange ring; Grenade = ground blast + star-y.
  - **Files:** boom-o1/o2/o3 and boom-p1/p2 removed from the app, the offline cache and the zip (kept aside in /home/claude/aside/unused_fx).
  - **Verified:** by watching network requests across menu, sheet, firefight and lobby — no boom files requested.
  - **If fireballs are still seen:** the device is on an older build (check the build tag; reopen the app to update).
- **cf68 — fullscreen lag on PC (designer report):**
  - **Cause:** cost scales with screen pixels (1440p ≈ 4× a mid window). Measured in the test browser: landing 31ms/frame at 960×540 vs 353ms at 2560×1440 (lobby 17 → 54, roster 17 → 38).
  - **Fixes:**
    - **Menu scene:** drawn at ≤1920×1080 and scaled (`scale` + will-change on the container, scene-relative units for parallax / sprites / beams / embers / drift).
    - **Hangar layers:** drawn at the picture's native size.
    - **Parallax:** the loop sleeps when settled and skips unchanged writes.
    - **Emblem glow:** pre-baked (`m3-emblem-glow.webp`), no live blur.
    - **Blend modes:** removed from the big search / sheen layers.
    - **Big screens (>2.6M device px):** no backdrop blur on the lobby / sheet glass panels (solid tint).
    - **Automatic lite:** if steady screens average >28ms / frame for two 3s windows → `html.autolite` (session only) + notice.
  - *Verified:* the slow 1440p test browser went 300–430ms → ~30ms / frame after auto-lite. A real GPU should stay at full effects thanks to the scaling / idle fixes; auto-lite is the safety net.
- **cf69 — hangar effects trimmed (designer):**
  - **Eyes only:** all hangar effects removed except the eyes (lobby + roster); the "your side powers up" eye flare is kept. Removed: strips, searchlights, sheen, fog, dust, sparks, window battle, beacons / LAUNCH SEQUENCE, door-seam sparks.
  - **New art:** the designer's lobby picture with the Zaku eye blacked out (the diff found the slot at x 68.75–71.2%, y 27.15–29.1%).
  - **Zaku mono-eye:** a solid pink core + glow + lens streak at 69.9% / 28%, sweeping ±38% of its width inside the slot.
  - **Gundam eyes:** re-measured at 28.55 / 24.65 and 29.75 / 25.0.
  - **Real cause of the misalignment:** on screens ≤760px wide the lobby picture is anchored `center top`, but the effect layer assumed 50% / 30%. Both layers now read the background's computed position and the visible area.
  - *Verified:* eye offsets ≤0.5px at 1280×800, 2560×1440, 892×551, 390×844 and 700×900; roster eyes 0px (federation / spacenoid, desktop / tall phone).
- **cf70 — hangar doors reverted (designer: the door effects / explosions looked odd):**
  - **Removed:** the seam sparks + steam styles and the (already empty) effect call. The door code and styles now match the cf55 original exactly (verified by diff).
  - **Note:** a first pass also cut unrelated style sections that sat after the door block (roster eyes, big-screen / auto-lite); caught by diffing against cf69 and restored — only the 7 door lines differ from cf69.
- **cf71 — effects toggle (designer):** an "✨ EFFECTS: FULL / LITE" item in the bottom bar of the landing page and the offline menu.
  - **Behaviour:** the choice is saved on the device (`gb.fx`). LITE = the auto-lite styles (no layer animations, embers, explosions / beams, emblem glow; parallax + eyes stay). FULL = effects on and the automatic downgrade disabled. With no choice made, the automatic behaviour stays and the label shows the current state ("AUTO · TAP FOR FULL" if it kicked in).
  - **Narrow phones:** landing bar 2×2 grid, offline bar 3 columns (icon above label).
  - **Scroll fix:** logos smaller on short portrait screens — fixes a small scroll on the offline menu that already existed; both menus fit at 320×640, 360×740, 390×844, 892×551 and 1280×720.
- **cf72 — designer:**
  - **Play Online card:** uses `img/online-card.webp` (the original art with the Zaku eye, identical to the old lobby picture); the lobby keeps the blacked-out picture.
  - **Zaku eye path:** the visor slot was measured from the blacked-out area (centre-line fit: ~15°, lower on the left; ends at 68.88 / 28.38 and 71.03 / 27.53).
    - **Path:** the eye now centres at 69.95 / 27.96, sweeps down-left to 68.96 / 28.40 and nearly level right to 70.84 / 27.90 (verified by freezing the animation); the streak is rotated −15°.
- **cf73 — Windows Defender false positive (Trojan:Win32/MalUri.A!cl on public/index.html; it quarantined the file in the designer's GitHub folder and the commit failed):**
  - **MalUri** is a cloud-ML detection for suspicious URI patterns in HTML. Culprits: one 890 KB HTML file with ~630 KB inline script, 4 URL-encoded `data:image/svg+xml` backgrounds, and a comment containing "file://".
  - **Fix:**
    - **Split:** index.html (16 KB) + app.css (243 KB) + data.js (146 KB) + app.js (484 KB), loaded in the same order with `?v=<build>`, precached in sw.js.
    - **SVGs:** the encoded SVGs became img/emb-{fed,spa}-{bg,sm}.svg.
    - **Comment:** reworded.
  - **Verified:** all regression suites pass; landing / budget / sheet screenshots are pixel-identical to the single-file cf72.
  - **Workflow:**
    - **Zips:** delivered as a password-protected zip (password `gunpla`).
    - **Designer's PC:** add a Defender exclusion for the repo folder `C:\Users\User\Documents\GitHub\GB.APP`, and restore the quarantined file.
    - **Build numbers:** future builds bump with `python3 bump.py cfNN` (app.js build tag + ?v= + sw cache name).
    - **Where edits go:** code edits now go to app.js / app.css (index.html only holds the markup).
- **cf74 — lobby eyes (designer):**
  - **Gundam glow:** toned down (1.0×0.8% instead of 1.25×1.05%, softer gradient, pulse opacity .35–.75, scale .95–1.1); its own gentle flare on picking Federation (peak scale 1.7, brightness 1.3 instead of 4× / 2×).
  - **Zaku sweep:** the right stop pulled in to 70.44% / 27.92% (was 70.84%).
- **Delivery:** plain zip again (designer asked for no password). The designer added Defender exclusions for the repo + download folders; the Microsoft false-positive submission was suggested.
- **cf75 — effects code review + rewrite (designer suspects the cf71 toggle started the Defender flags; unverifiable here, but the code needed cleaning anyway):**
  - **Review findings:**
    - **Duplicated lite systems:** three overlapping ones (m3lite / hangar .lite / autolite).
    - **Scattered settings:** three storage keys (gb.fx, gb.noautolite, session gb.autolite).
    - **Battery bug:** a frame loop that ran forever on every screen.
    - **Hardware probing:** navigator.deviceMemory / hardwareConcurrency read in 2 places (fingerprint-like).
    - **Fake switch:** a div posing as a switch.
  - **Rewrite:** one `Effects` module in app.js, one setting (`gb.effects`), one class (`html.fx-lite`).
    - **Auto:** measures up to three 3s windows only while s0 / s1 is showing, then stops; slow twice → lite for this visit.
    - **Toggle:** a real `<button>` (styled identically). Old keys are removed on start; the CSS m3lite / autolite rules were merged into fx-lite.
  - **Tested:** defaults, toggle + persistence, auto on the slow 1440p test browser (→ lite, then stops), FULL blocks auto, a small window stays full, the idle roster screen makes 1 rAF request in 2s (was continuous); the bar looks identical; all regression suites pass.
  - **Tests:** now use `gb.effects` instead of `gb.noautolite`.
- **Delivery change (Defender now flags src/index.js inside the zip — the Worker / room server, unchanged since cf57):**
  - **Why:** its shape (player ids "pid" ×95, "token" ×27, WebSocket push / inbox, random ids) resembles remote-control malware to the cloud ML.
  - **Routine zips** now contain only `public/` + README (e.g. gunpla-battle-cf75-app.zip).
  - **Server changes** will be delivered separately and called out.
  - **Designer:** restore src/index.js from Protection history if it was removed from GB.APP (online mode needs it).
  - **Possible later step:** rename the protocol fields (pid → playerId, token → seatKey) in server + client to look less like a C2 — speculative; only if flags continue.
- **cf76 — Defender now flagged `src/index.js` (the Worker) inside the zip:**
  - **Likely trigger (MalUri family):** the invented single-label URLs `https://room/ws` and `https://room/rpc` used to call the Durable Object.
  - **Fix:**
    - **WebSocket:** the Worker forwards the original request (the DO answers on `/api/ws`).
    - **Room calls:** `roomRequest()` builds `new URL("/api/sync", request.url)` (the DO answers on `/api/sync`).
    - **Naming:** "rpc" removed. The wire protocol is unchanged.
  - **Verified locally:** create session OK, live links `GET /api/ws 101`; mp3 team flow, firefight, end-turn requests, lobby and carriers suites all pass.
- **cf77 — Zaku eye (designer):**
  - **Size:** larger at rest (2.3 × 2.8% of the picture, was 1.9 × 2.3%).
  - **Path:** the sweep percentages were rescaled so the route is identical (left stop 68.96 / 28.40, right stop 70.44 / 27.92 — verified).
  - **Flare:** a new gentle flare (lbFlareZ: peak 1.45×, brightness 1.3; was lbFlare 4× / 2×).
- **Also cf76 confirmed clean by the designer** (no Defender flag).
- **Designer decisions:** the app stays a free personal web app (no stores); no password protection for now.
- **cf78 — roster eye effects removed (designer):**
  - **Removed:** the s2 / s3 eye-glow layer (Nu Gundam visor / Zaku mono-eye) on both sides — the module, its show() hook and all #rsfx / .rs-* styles (the diff confirmed only roster-effect rules went).
  - **Checked:** the lobby eyes are untouched; budget / roster backgrounds still render; regressions pass.
- **cf79 — no lone rings (designer):**
  - **Explosions:** menu hits are always a starburst (star-y on Federation ships, star-p on Zeon ships); the ring is only layered around one (always when size > 10, 35% when size 6–10).
  - **Beam impacts:** now call the same `blast()`.
  - **Measured over 30s:** 45 stars, 12 rings, 0 lone rings.
  - **Preview:** `explosion_effects_preview.png` + `big_combo_animation.gif` shown to the designer.
- **cf80 — Firefight clash screen on phones (designer tested on mobile):**
  - **Problems measured on 892×411:** content 675px vs 393px visible (282px scroll); tapping +1 reset scroll to 0 (the whole panel was rebuilt); result text all yellow and 'COUNTERED' always red regardless of who benefited.
  - **Fix:**
    - **Reveal layout:** `.ffrv2`, two columns — left: compact item VS strip, dice (rolled), result chips (good / bad / neutral from YOUR side), `<details>` ⓘ Details with the full sentences + dice key (+ margin table when rolled); right: roll box, a 0–N number row (`ffOnes(n)`, 40–48px buttons, updates in place), margin button, next-round line (`ffNextText`), READY (full width).
    - **Redraws:** the panel keeps its scroll position; the details open-state persists.
    - **Compact styles:** for max-height 560px and 400px; the squad strip goes to one line.
    - **Results:** `ffApply` now returns `q.chips` (tone + short text) alongside `q.res` (full sentences).
  - **Verified:** overflow 0 at 892×411, 780×360 and 1280×720; READY visible; perspective-correct colours (flashed = red for the victim, green for the thrower); firefight / team-flow / clash / infantry / end-turn suites pass. Portrait stays behind the rotate prompt (designer's choice).
- **cf81 — roll box hides once the 1s are set (designer):**
  - **Behaviour:** `ffOnes()` stores `q.onesKey = id:seg:round` and removes the physical ROLL box in place; the render skips the box while `onesKey` matches this round (it is in the redraw signature). It returns next round with the new count. Rolled mode keeps its small "app rolled N dice" line.
  - **Wording:** "move 1 die away".
  - **Verified:** before tap = shown, after tap = hidden, after redraw = hidden, round 2 = back ("ROLL 7 DICE NOW · Firepower 8 − 1 set aside").
- **cf82 — Objective Clash (designer: physical dice shouldn't auto-roll):**
  - **Server:** the `objective` op takes the caller's `hpMine` / `hpFoe` (current squad health; falls back to the last ready report).
    - **Physical mode:** requires `win: mine|theirs` and stores `{manual: true, win, ha, hb, seg}` (no roll).
    - **Rolled mode:** rolls 2d6 + advantage with current HP (bug fix: it used the HP from round 4's ready, before that round's casualties).
  - **App end screen:** a `.ffoc` panel with both HPs and a perspective bonus line (YOU add +N / ENEMY adds +N / equal), "Higher total secures · re-roll ties", then "We secured it" / "They secured it" buttons (physical) or "Roll the Objective Clash" (rolled); the result shows on both devices.
  - **Classes:** named ocHp / ocBn (`.hp` clashed with the sheet's HP-ring class).
  - **Verified:** a physical flow to the end on a phone (no auto roll, 5 vs 8 HP → Alice "ENEMY adds +3", Cat "YOU add +3", result mirrored); rolled flow (3 vs 8 HP → ha 3 / hb 8, 10 vs 11).
- **cf83 — step-by-step physical rounds (designer's flow):**
  - **Server:**
    - **At reveal:** `g.claim {a, b}` and `g.done {a, b}` are reset.
    - **`claim` op:** won / lost / tied; won and tied count as done at once.
    - **`applied` op:** the loser, after margin + casualties.
    - **READY:** refused in physical mode unless the claims agree (won + lost, or tied + tied) and both are done.
  - **App:** `ffWizard()` for physical reveals, with the local step in `q.fs {k, s, ones, claim, lab, target, applied}`.
    - **Steps:** roll (chips + details + ROLL box + DICE ROLLED) → ones (big 0..N row, Back) → compare (banner + dice key; big green I WON, red I LOST, Tied; conflict warning) → margin (2-col options incl. Perfect Volley) → volley (2–5 sixes) → cas (casualty picker with a done callback; "Choose who falls (N left)" if postponed) → summary (result chip, next-round dice, READY only when agreed + both done; otherwise a waiting line).
    - **Winner:** "Waiting for the enemy to apply their losses…".
    - **Changing a claim:** re-claiming lost after losses were applied skips the margin step; switching away from lost resets the margin and reminds to Repair.
  - **Verified (2 devices, phone 892×411):** both-won warning + server refusing READY, lost by 4 with a casualty, the winner waiting then the summary, a tie on both, lost by 1 (no casualties), Perfect Volley (3 sixes → 4 destroyed); every step fits the screen; all regression suites pass. The main firefight test was updated for the steps.
- **cf84 — no ending the turn mid-firefight (designer):**
  - **Server:** `fightOn()` (any ff/ record in mode / ready / pick / reveal) → denies `endTurn` and non-cancel `endRequest` ("end-turn:firefight"). A finished segment (state end) is allowed.
  - **App:** `ffActiveFight()`.
    - **Turn-box / sheet button:** shows "⚔ Firefight in progress — round N of 4" (amber `.fightlock`).
    - **Checks:** `phaseTap()` and `endMyTurn()` toast "finish its 4 rounds before ending the turn".
    - **Refresh:** renderFF refreshes the turn button when the fight's round / state changes.
  - **Verified (2 devices):** blocked at round 1 and round 2, the forced write refused by the server (turn and seq unchanged), 4 tied rounds → segment end → button back to End My Turn and the end request accepted. Team-flow, end-request, firefight, clash and infantry suites pass.
- **cf85 — segment end (designer):**
  - **Removed:** the "New 4-round segment" button.
  - **Forced Re-Engagement:** shown only if `q.items.fb > 0` (label shows the cost and remaining count); otherwise the hint "No Flashbang left — you can't force another segment". End firefight is the primary button, with a hint that Forced Re-Engagement is usually played at the start of the enemy turn when they try to move away.
  - **Verified:** Alice (2 fb) sees Forced + End; Cat (0 fb) sees the hint + End; using it → segment 2, fb 2 → 1.
  - **Open question:** should Forced Re-Engagement also be available after the firefight was ended (e.g. from the QR tab, when the enemy moves the squad away next turn)? Right now it only works while the end screen is still open.
- **cf86 — objective holder marker (designer):**
  - **Setting it:** `ffSync` sets `st.sq.holdsObj = {vs, turn}` for the winning squad and null for the loser (each device updates its own squad once per segment via `q.objKey`; logs the event; `sqCommit` syncs).
  - **Tags:** `.objtag` "🚩 OBJECTIVE" on the own roster row and the enemy list row (hidden when destroyed).
  - **Overmap tab:** `.objnote` banner "Holds the objective — secured against X (turn N)" + Clear; otherwise a "Mark as holding the objective" link (`window.sqObjective(on)`, respects sheet control).
  - **Verified (2 devices):** the physical objective win → Alice's banner, roster tag and Cat's enemy-list tag; Clear removes them on both; the manual mark brings the tag back.
- **cf87 — Forced Re-Engagement = booked for the next turn (designer):** lets the waiting player move other units instead of sitting through 4+ rounds now.
  - **Server:**
    - **Queuing:** `invite` with `forced: true` creates `state: "queued"` (forced a, `startSeq = turn.seq + 1`, no acceptance); a forced `segment` also becomes queued.
    - **Starting (section 7c, each sync):** queued fights with `turn.seq >= startSeq` → `state = mode ? "ready" : "mode"`, `fromQueue: true`.
    - **Turn blocking:** queued doesn't block end-turn (only mode / ready / pick / reveal do).
  - **App:**
    - **Hidden while queued:** no clash overlay.
    - **End-screen button:** books it (toast).
    - **QR card:** "✦ FORCE A RE-ENGAGEMENT (1 Flashbang · N left)" when the squad has fought before and has a flashbang (`ffForce` picker, spends the flashbang); a queued card text for both sides.
    - **Roster tag:** "✦ RE-ENGAGES NEXT TURN" (purple).
    - **Start banner:** "Forced Re-Engagement — your X vs their Y has begun · Open the firefight" for both teams (hidden once it is open on that device or a teammate is running it).
    - **Bug fix:** `ffResume` now reopens the sheet when the same squad was open before but the sheet is closed.
  - **Verified (2 devices):** route A (end screen → queued → turn passes → segment 2 auto-starts → banners → both open); route B (end fight → QR force → queued → turn passes back → mode screen → Cat banner → joins). All suites pass.
- **cf88 — items reset for a forced segment (designer):**
  - **App:** `ffSync` refills `q.items` (and clears set-aside dice) when `q.ffSeg !== f.seg` on the same fight (it runs only once the segment has started, not while queued).
  - **Verified:** Alice 1 / 1 / 1 → 2 / 1 / 1, Cat 0 / 0 / 1 → 2 / 1 / 1 at segment 2.
  - **Rulebook:** the Forced Re-Engagement paragraph now says the segment begins at the start of the next turn and item charges reset.
  - **Smoke counter:** added in cf89.
- **cf89 — Smoke counter to Forced Re-Engagement (designer: yes):**
  - **Server:** `counter` op (queued only, not the forcing side) → `state: closed`, `countered: side`.
  - **App:**
    - **Queued card for the forced-back squad:** "◌ COUNTER WITH SMOKE (1 Smoke · N left)" → confirm → sm − 1, log, op; otherwise the hint "No Smoke Grenade left — the re-engagement will happen". The forcer's card notes the enemy can still counter.
    - **Defending-team banner while booked:** "The enemy's X forces your Y back into a firefight next turn" + "Counter with Smoke?" (opens that squad's QR tab) / "Let it happen" (dismiss).
    - **Forcer:** a toast when countered.
  - **Verified (2 devices):** banner → sheet; no-smoke hint; counter button; cancel → both tags gone, Cat sm 1 → 0, Alice notified. The route A / B force suite and all regressions pass.
- **cf90 — (designer) challenges only on your own turn; objective tag hidden on small phones:**
  - **Challenges:**
    - **Server:** a non-forced `invite` is denied unless `turn.active === myTeam` ("ff:not-your-turn"); forced invites are allowed on any turn.
    - **App:** the QR card shows the Challenge button only on your turn (otherwise the hint "Firefights can only be started on your own turn."); `ffChallenge` guards too; Force a re-engagement stays available.
  - **Tags:** the `.nm` line is nowrap + ellipsis, so tags after the name got cut on 360 / 390px (tag at x 321–416 vs a line ending 293 / 323). Status tags (`OBJ_TAG`, `ffTagHTML`) now go before the name; ≤1000px shows the icon only (🚩 / ⚔ / ✦).
  - **Verified:** tags visible at 360, 390, 667, 892 and 1280; the enemy-turn card + blocked challenge + server refusal; Alice's own-turn challenge works; force / counter / objective / firefight / team / end-request / clash / infantry suites pass.
- **cf91 — force only a squad you already fought (designer):**
  - **Server:** records `ffhist/federation-<uid>/spacenoid-<uid>` at a pair's first reveal (synced to devices); a forced invite without that record is denied ("ff:not-fought").
  - **App:** `ffFoughtWith(uid)` filters `ffEnemySquads()`; the Force button only shows when the list is non-empty (and the squad has a flashbang); the picker lists only those squads.
  - **Verified (Cat has 2 squads, Alice fought #1):** no button before any fight; history recorded; the picker shows only #1; the server refused #2 and accepted #1; Cat's unfought #2 has no Force button. Force / counter / firefight / team / end-request / clash suites pass.
- **cf92 — QR resources first (designer):**
  - **Panel:** `qrResourcesHTML(S)` at the top of the Quick Resolve tab — 3 tiles (Flashbang 2 max, Smoke 1, Grenade 1) with diamond pips, "N left" / "none left" (red when empty), and a one-line use reminder. Subtitle: "in the current firefight" or "refill at the start of each new engagement".
  - **Order:** firefight card and guides now below.
  - **Redraw:** the card signature includes item counts, so the tab refreshes when items are spent.
  - **Verified:** 1280 / 892 screenshots (fb 1, sm 0 → red, gr 1); guides below; firefight / booking / team / infantry suites pass.
- **cf93 — offline QR = item tracker (designer):** offline (not team mode) the resources panel is interactive.
  - **Tile tap** → `qrItemUse` (−1, logged).
  - **Pip tap** → `qrItemPip` (an available pip uses one; a crossed pip restores one, max 2 / 1 / 1).
  - **"↺ Refill all"** → `qrItemRefill`.
  - **Visuals:** used pips show a red X; the offline note now reads "Playing face to face — tap the items above as you use them".
  - **Online:** unchanged (read-only panel).
  - **Verified:** use ×2, no-op when empty, restore, smoke use, persists across reload, refill, timeline entries; firefight / infantry suites pass.
- **cf94 — (designer) direct counter from the banner + step-by-step Roll for me:**
  - **Banner counter (`ffBannerCounter`):**
    - **With smoke:** confirm → if this device holds the squad lock, apply now; else quietly acquire the lock (the `mpQuickDone` pattern) → sm − 1, log, `counter` op, release.
    - **Other rows:** "No Smoke Grenade left — it will happen" + OK; "X has that squad open — they can counter from its sheet" + OK.
    - **`ffCounter` on the sheet:** now toasts instead of silently returning when the sheet isn't editable.
    - **Verified:** countered from the roster with the sheet closed; Cat sm 0 synced to Alice; lock released.
  - **Roll for me:**
    - **Server:** no dice at reveal (`g.rolled {a, b}`); a `roll` op — when both have pressed, both pools are rolled together and `claim` / `done` are set from the dice (volley 2–5 all 6s, then successes); READY in rolled mode needs roll + both done.
    - **App:** `ffApplyRoll()` (dice part split out of `ffApply`, runs once when the roll arrives: chips, lab, ones, margin set-aside); `ffWizard` rolled steps: roll (ROLL FOR ME / "Rolled — waiting for the enemy") → dice (`.ffdice2`, tumble animation, 1s red / 6s gold / 2s faded, success totals, result + ones chips, Continue / Remove casualties) → shared cas → summary.
    - **Verified:** the main firefight test (4 rolled rounds, dice identical on both, auto claims, casualties, objective) plus phone screenshots (every step fits). All suites pass.
- **cf95 — items: no auto-refill, resupply by vehicle (designer; stage 1 of multi-squad):**
  - **Removed:** the new-engagement and new-segment refills in `ffSync` (cf88's segment refill reverted).
  - **Added:** in `startMyTurnCore`, a squad aboard a carrying vehicle stores `qr.abRound`; when a later turn starts while still aboard, items reset to 2 / 1 / 1 with a log line. Leaving clears the clock.
  - **QR tab:** subtitle "no refills — resupply by riding a vehicle"; the offline button is now "↺ Resupplied".
  - **Rulebook:** 13.6 rewritten (resupply only), multi-squad + Forced Re-Engagement paragraphs updated; the outnumbered side's compensation is now the shared item economy in breaks.
  - **Verified:** on foot = no refill; boarding = clock starts; a full turn aboard = resupplied; after leaving = no refill; a forced re-engagement keeps spent items (Alice 1/1/1, Cat 0/0/1). Firefight / infantry / team / carrier suites pass.
- **Multi-squad design agreed (build stages 2-4 next):** challenge picker (multi-select, Federation blue / Spacenoid red, name the objective, challenger orders + defender matchups) · one bout per turn, each side picks its squad · pinned waiting squads (no move / shoot / strike) that can still spend items in breaks · breaks: extract / deny with any squad's Flashbang / counter with Smoke / edit squads (withdraw, add, swap, merge — merged squad keeps the healthiest name) · leaving can be pinned like an extraction; only the objective holder secures it · ends on a wipe-out or a successful extraction.
- **cf96 — multi-squad stage 2 (picker + engagement record):**
  - **Server:** `invite` accepts `aUids/bUids/aLabels/bLabels/obj` → stores `eng {aList, bList, obj, pairs, bout}`; `busy()` covers every squad in an engagement; `accept` takes `pairs` (validated, one per attacker) and sets the first pairing. The engagement branch runs before the old single-squad checks; own-turn rule kept.
  - **App:** `ffChallenge` rebuilt as a two-column multi-select (`ffSel` state — renamed to avoid clashing with the `ffPick` item function), Federation blue / Spacenoid red boxes, objective-name field, "⚔ CHALLENGE · N vs M"; `ffMatchups()` asks the defender who meets each attacker; `.ffengbar` strip on the clash screen (bout X of N, objective, pairing list with the current one highlighted); the QR card and invite banner mention the engagement; `ffForUid` now matches engagement members, `ffFightingNow` keeps waiting squads off the clash screen, and tags show ⚔ FIREFIGHT or ⚔ WAITING ITS BOUT.
  - **Fixed along the way:** the rewrite had removed ffFoughtWith / ffForce / ffTagHTML / OBJ_TAG / ffBannerCounter / ffReviewForced (restored), and `ffPick` name collision broke item locking.
  - **Verified:** 1v1 through the new picker (full firefight suite), 2v2 (picker → invite → matchups → pairs [[1,1],[2,2]] → strip + card + 2 tags each side); force / fought / counter / banner-counter / turn-rule / team / infantry / clash suites pass.
  - **Next (stage 3):** play the queue — bout per turn, each side picks its squad, pinned waiting squads; then stage 4 breaks (extract / deny / counter / edit squads / merge).
- **cf97 — objective marker in vehicle menus + multi-squad stage 3 (the queue):**
  - **Marker:** `objTagFor(uid)` adds 🚩 to the pre-battle vehicle load list, gvEmbark and gvDisembark.
  - **Server:** `nextbout` (end state → advances eng.bout, sets the new pair, resets the round state, queues it with `startSeq = turn.seq + 1`) and `setnext` (a side swaps its squad for the next bout).
  - **App:** the end screen shows a `.ffnext2` box (next pairing, "starts when the next turn begins") with ⇄ Change my squad (`ffNextSquad`: list with HP, items ✦◌✹ and 🚩) and "Line up bout N" (`ffNextBout`); `ffPinned(uid)` blocks sqMoveSquad / sqStrike for engagement squads that aren't fighting, with a `.sqnote.pinned` note.
  - **Verified (2 devices, 2v2):** pinned waiting squad; bout 1 played to the end; next-bout box; swap → pairs [[1,1],[1,2]]; queued → clash closed → turn ended → bout 2 auto-started with the swapped squad + banners. Firefight / team / force / infantry / carrier suites pass.
  - **Next (stage 4):** breaks — extract / deny with any squad's Flashbang / counter with Smoke / edit squads (withdraw, add, merge — healthiest name) and ending the engagement on a wipe-out or successful extraction.
- **cf98 — multi-squad stage 4 (breaks):**
  - **Server ops:** extract (clash winner only) · deny (other side, any squad) · smokeout (leaver → closed + secured) · letgo (→ closed + secured) · fighton (denied → carry on) · concede · engedit (withdraw / add / merge; empties a side → closed + secured to the other; upcoming pairs are repaired).
  - **App:** `.ffbreak` panel on the end screen with the right buttons per side/state; `ffSpendPick` takes the item from a chosen squad's own bag (auto if only one has it); `ffEditSquads` (withdraw / bring in / merge), `ffMergePick` + `ffMergeGo` (pool up to 8 into the healthiest, others emptied, engagement list trimmed); closed+secured engagements stay on screen until Close (`ffActive` keeps them alive via `ffShown["sec:"+id]`).
  - **Verified (2 devices, 2v2):** break panel → pull out → deny with the WAITING squad's flashbang (2→1) → smoke out → both screens show secured; merge 3 + 4 → 7/8 into the healthiest and the list trimmed; queue, firefight, team, force and infantry suites pass.
  - **Remaining for the designer to test:** full multi-squad play end to end.
- **cf99 — nameable objectives (designer):** `objName` / `objTagHTML(name)` / `objHeld(st)`; squads store `holdsObj.name` (taken from `eng.obj` on a clash win, or asked for when marking by hand, with Rename on the Overmap banner) and Tanks store `gv.objName` (asked when toggling Objective, shown on the ability row). Roster and enemy-list markers show the name (icon-only under 1000px). Verified: 🚩 SERVER ROOM on a squad and 🚩 DATA CORE on a Type 61; objective / firefight / infantry suites pass.


---

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

**Remaining for the next session:** run the included Playwright scenario, review phone and desktop layout, and play one full multi-squad game on actual devices. Earlier completed-build notes above are historical; cf100 describes the current end-of-bout flow.


---

## cf101 — Matching artwork, objective picker, and repeated extraction counters

- Engagement board styling now follows the existing Gunpla kit UI: cut-corner panels, roster-style rows, faction emblems, existing infantry art, blue Federation and red/gold Spacenoid panels, and existing theme colors for controls. No new art downloads are required.
- The challenge squad picker shows the carried objective name on both teams, including on phones. Team identity is used when squad IDs overlap.
- **Designer rule change:** Smoke counters the latest Flashbang, not the entire extraction. The pursuing side can choose **Flash again**, spending another charge from any living engaged squad. Another Smoke is required to answer it. Continue until the pursuing side lets them go or the departing side stays to fight. The latter clears fighter confirmations. If no Flashbang remains, use **Let them go** to acknowledge the escape.
- The rulebook now describes this item exchange and removes the guaranteed-Smoke-escape wording. The ordinary queued Forced Re-Engagement counter remains a cancellation of that attempt; another attempt can be made with another available Flashbang through the existing Force a re-engagement action.
- Deploy the **whole project**, including `src/index.js`. The server, UI, stylesheet, and cache version changed; all devices should show **cf101**.

**Checks:** 160 automated assertions passed, including repeated Flash/Smoke responses, duplicate-action rejection, the turn gate during the exchange, and both teams’ objective markers. The existing two-browser Playwright scenario was updated but remains unrun because Chromium is unavailable in this environment. The user confirmed cf100’s functionality in play; cf101’s visual changes still need an on-device look. No deployment was performed.


---

## cf102 — Both teams confirm the dice mode

Choosing Physical dice now sends a request to the other team. The requester sees “Waiting for their confirmation”; the other side sees **Confirm physical dice** or **Request rolled dice**. Requesting the alternative mode requires confirmation too. Rolled dice retains two-sided agreement. The server rejects self-confirmation and starting the round while the request is pending.

173 automated assertions pass, including the request, counteroffer, confirmation, and both UI perspectives. Browser visual verification remains pending because Chromium is unavailable. Deploy the full project, including `src/index.js`, and refresh both devices to cf102. No deployment was performed.


---

## cf103 — Merge without losing survivors

Merging now tops up the healthiest selected squad to eight and leaves surplus soldiers in their original squads. Equal-health ties favour the squad currently open. Examples: **5 + 5 → 8 + 2**, **7 + 4 → 8 + 3**, **3 + 4 → 7**, and **3 + 3 + 3 → 8 + 1**. A full target is a no-op. The picker previews each squad’s resulting health.

Only genuinely empty donor squads leave the engagement. Living remnants retain their names, items, and next-bout eligibility. An objective stays with a surviving donor; it transfers to the receiving squad only if its former holder is emptied. Transferred soldiers retain their individual wounds and Kevlar; merging does not replenish squad item charges. The server rejects attempts to remove a donor that still has survivors.

190 automated assertions pass, including the user’s exact 5 + 5 example, three-squad overflow, full targets, wound preservation, and multiplayer updates retaining partial donors. Browser visual verification remains pending. Deploy the full cf103 project, including the server, and refresh all devices. No deployment was performed.


---

## cf104 — Matchups inside the challenge roster

The initial challenge roster now includes an editable **Bout lineup**. Select the participating squads, set each attacker’s enemy matchup on that same screen, and send once. HP and carried-objective markers remain visible. Adding or removing squads keeps valid choices and repairs invalid ones; outnumbered defenders can be assigned to more than one bout.

The defender opens **Review challenge**, sees every proposed bout together using the same lineup component, adjusts their fighters if needed, and presses **Confirm challenge** once. The former sequential “Who meets their squad?” screen has been removed. Invitations store the proposed pairings; the server validates them and applies the defender’s final pairings in one acceptance.

200 automated assertions pass, covering proposed pairings, defender adjustments, invalid pairings, retained selections, and all matchup rows rendering together. Browser visual verification remains pending. Deploy the full project including `src/index.js`, and refresh every device to cf104. No deployment was performed.

## cf105 — Fighter reminders and dice choice for every bout

When the opposing team confirms its next fighter, your team receives an in-app notification. Away from the engagement board, a persistent **Choose fighter** banner opens the pending selection. Repeated syncs do not repeat the notification; confirming clears it. If another teammate controls the fight, the banner identifies them instead of taking over.

Each new bout, including forced re-engagement, resets the previous dice selection. Choose **physical** or **rolled** again, with the opposing side confirming before play begins. The next-bout start banner now correctly labels ordinary bouts and prompts for dice choice.

219 automated assertions pass, including second-bout mode reset and agreement, forced-bout reset, reminders from both team perspectives, repeat-sync suppression, clearing, and teammate ownership. Browser visual verification remains pending. Deploy the full project including `src/index.js`, and refresh every device to cf105. No deployment was performed. Notifications are in-app; this update does not add background operating-system push notifications.


## cf106 — Simple offline Quick Resolve tracker

Offline Quick Resolve now shows only the Flashbang, Smoke Grenade, and Grenade resource trackers. Tap an item to spend one, tap a used mark to restore one, and use **Resupplied** to refill the tracked supplies. Removed the online-session prompt and firefight workflow instructions from the offline tab; challenge controls are restricted to online play. Manual resource controls cannot change online supplies. Resupply logs now describe resupply rather than suggesting every engagement refills items.

Validation: all 219 existing automated assertions pass. Offline controls were checked for spending, restoration, empty supplies, refill, and online protection. Browser visual verification remains pending. Deploy the full project and refresh devices to cf106. No deployment was performed.

