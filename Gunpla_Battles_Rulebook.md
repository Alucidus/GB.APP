# MOBILE SUIT BATTLES: Core Combat Rulebook (v2.0)

---

## TABLE OF CONTENTS
1. Basic Stats
2. Action Points
3. Ranged Combat Resolution
4. Reaction Rolls
5. Limb Health
6. Combat Sequence
    - 6.1 Turn Phases & Play Order
    - 6.2 Support Fire (Mobile Suit -> Ground Battle)
    - 6.3 Player Count & Recommended Systems
7. Melee Rules
8. Skills/Abilities (Gear-Based)
9. Stances
10. Gundam-Tier Classification & Deployment Points
11. Gundam Points (GP)
12. Objectives
13. Ground Units & Firefight Clash
    - 13.5 Ship Combat & Boarding
    - 13.6 Detailed Battle Map (Individual Soldier Scale)
    - 13.7 Ground Vehicles, Buildings & Overmap Ground Rules
14. Pre-Game Setup Guide
15. Gamemode & Scenario Reference

**Appendix A: Built Unit Roster**

*A condensed, no-explanation Quick Reference sheet is available as a standalone document — see Quick_Reference.md.*

---

## 1. BASIC STATS

### Hero MS (Gundam-tier)
| Stat | Value |
|---|---|
| AP | 4 |
| Limb Health | See Limb Health table (Section 5) |
| Movement | 30cm per AP |
| Free Dodges | 2 per turn |

### Grunt MS
| Stat | Value |
|---|---|
| AP | 3 |
| Limb Health | See Limb Health table (Section 5) |
| Movement | 20cm per AP |
| Free Dodges | 0 |

### Weapon Stats *(fill in per weapon — suggested starting values below, adjust to taste)*

**Reading the Range column:** A plain value (e.g., "60cm") is that weapon's **maximum effective range — it cannot fire at all beyond that distance**, no shot is possible. A value of **"Unlimited"** means the weapon has **no upper limit** and can always fire at any distance, using the appropriate range band's target number based on actual distance to the target (e.g., the 60-90cm band's 12+, the 90-120cm band's number, etc. — whichever band the target actually falls in). This matches the "no cap" identity of a long-range weapon like Beam Sniper, versus the hard 90cm ceiling on a standard Beam Rifle or Bazooka.

**Beam Weapons**
| Weapon | Range | Damage | AP Cost | Notes |
|---|---|---|---|---|
| Beam Rifle | 90cm | 5 | 2 | Standard ranged option |
| Beam Sniper | Unlimited | 7 | 2 | Roll needed: 12+ at 120cm+, 9+ at 90-120cm, 12+ at 60-90cm, 15+ at 30-60cm, 18+ under 30cm — 90-120cm is the true sweet spot, falls off symmetrically both closer and farther |
| Beam Pistol | 60cm | 3 | 2 | Roll needed: 17+ at 60cm+, 9+ at 30-60cm, 3+ under 30cm — close range specialist, bad at range |
| Beam Magnum | Unlimited | 9 | 2 | Heavy Arms — no longer a separate Shield penalty; if Blocked, it costs the shield 9 HP (its own damage value, per Section 4.2). After firing, the weapon is on **cooldown for 1 full turn** — cannot be fired again until the turn after next. |
| Beam Machine Gun | 90cm | 3d6, 2 dmg/die (see Burst Fire, Section 8) | 2 | Weaker than a Beam Rifle due to recoil. Has Spray and Pray (Section 8). |
| Funnels/Bits | 60cm | 2 per target | 2 | Selects up to 3 targets in one action |

**Ballistic Weapons**
| Weapon | Range | Damage | AP Cost | Notes |
|---|---|---|---|---|
| Ballistic Rifle | 90cm | 2 | 1 | Standard ranged option, ballistic tier |
| Ballistic Sniper | Unlimited | 4 | 1 | Roll needed: 12+ at 120cm+, 9+ at 90-120cm, 12+ at 60-90cm, 15+ at 30-60cm, 18+ under 30cm — 90-120cm is the true sweet spot, falls off symmetrically both closer and farther |
| Ballistic Pistol | 60cm | 1 | 1 | Roll needed: 17+ at 60cm+, 9+ at 30-60cm, 3+ under 30cm — close range specialist, bad at range |
| Bazooka/Cannon | 90cm | 3 | 2 | Heavier hitting. Splash: everyone within 10cm of the impact point — the original target and any other units caught in the blast — takes 3 damage to **all 6 locations simultaneously** (matching the AoE treatment used by Spray and Pray and other blast weapons), instead of a single rolled location. |
| Vulcans | 20cm only | 1 | 1 | Automatically hits any target within 20cm — not dodgeable, only Blockable (same as Snipers/Homing Missiles). Cannot be used at all beyond 20cm — the only counter is staying out of range or Blocking. Also grants Point Defense (Section 8). |
| Ballistic Machine Gun | 90cm | 3d6, 1 dmg/die (see Burst Fire, Section 8) | 1 | Weaker than a standard rifle due to recoil. Has Spray and Pray (Section 8). |

**Melee Weapons**
| Weapon | Range | Normal Hit Dmg | Critical Attack Dmg | Draw Cost (AP) | Melee Roll Bonus | Charge Range | Notes |
|---|---|---|---|---|---|---|---|
| Bare Hands / Unarmed | Melee | 1 | 2 | 1 | +0 | 0cm (must already be adjacent) | Initiates a Melee Clash (see Section 7) |
| Sword | Melee | 1 | 2 | 1 | +1 | 10cm | Initiates a Melee Clash (see Section 7) |
| Beam Dagger | Melee | 2 | 4 | 0 | +1 | 10cm | Initiates a Melee Clash (see Section 7) |
| Heat Axe / Heat Hawk | Melee | 2 | 4 | 1 | +2 | 15cm | Initiates a Melee Clash (see Section 7) |
| Spear / Lance | Melee | 2 | 4 | 1 | +2 | 30cm | Reach weapon; initiates a Melee Clash (see Section 7) |
| Beam Saber | Melee | 2 | 4 | 1 | +3 | 15cm | Initiates a Melee Clash (see Section 7) |
| GN Sword | Melee | 3 | 6 | 2 | +4 | 30cm | Heavier signature blade (Gundam 00-tier units); initiates a Melee Clash (see Section 7) |
| Beam Axe / Beam Tomahawk (Sazabi, Sinanju-tier) | Melee | 3 | 6 | 2 | +4 | 20cm | Heavier signature melee weapon on Flagship-tier Zeon units and similar; initiates a Melee Clash (see Section 7) |
| Anti-Ship Sword (Arondight, Excalibur-tier) | Melee | 4 | 8 | 2 | +4 | 30cm | The heaviest melee tier — blades built to cut through capital ships and mobile armours. An 8-damage Critical destroys any Head outright; initiates a Melee Clash (see Section 7) |

The Melee Roll Bonus is added directly to that fighter's d20 roll for every exchange of the Melee Clash (Section 7.1), for as long as that weapon remains equipped. Kick Away always deals a flat 2 damage to a random location, regardless of which weapon is equipped (Section 7.1).

**Charge Range:** each melee weapon's Charge Range is how far a unit can close the distance and initiate melee in the same action, at no extra AP cost — having the weapon drawn already covers closing that distance (drawing costs 1 AP for most melee weapons, 2 AP for GN Sword, Beam Axe/Tomahawk and Anti-Ship Sword -- see the Draw Cost column in the Melee Weapons table). No separate Movement AP is needed as long as the target is within Charge Range. Beyond that distance, the unit must close the rest of the way with normal Movement first.

### Approved unit melee profiles (cf108)

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

Banshee Norn has no AA-DE Melee Mode attack. Its Beam Saber, AA-DE cannon and Magnum-linked Beam Jutte defence remain.

### Shield Stats *(fill in per shield type — suggested baseline below)*
**Shields are not automatic — they're a loadout choice made per unit when building your army.** A unit either comes equipped with a shield (matching its canon design, e.g. GM) or doesn't (e.g. Zaku), and this should be decided and recorded at list-building time, not assumed by default.

| Shield Type | Shield HP | Coverage | Notes |
|---|---|---|---|
| Standard Shield (Grunt tier) | 8 | 180° (front only) | Flat value — Grunt tier sits outside the chassis percentage-scaling system, same as its flat Limb Health table |
| Standard Shield | 12 (Flagship baseline) — scales with chassis tier: 13 (Super Flagship), 16 (Superweapon), 18 (Myth) | 180° (front only) | Loses HP equal to the incoming weapon's actual damage per hit absorbed (see 3.2, 4.2) |
| Multi-Shield (e.g. Kshatriya, Full Armor units) | 24 (Flagship and Super Flagship) — scales with chassis tier: 28 (Superweapon), 32 (Myth) | 360°, split into four 90° quadrants | Covers all four arcs. See Quadrant Shields below for how the total is divided and tracked. |
| **Anti-Beam Coating** | **8 (flat — does not scale with chassis tier)** | **360°** | An ablative coating sprayed onto the machine, not a held shield. Carried by any unit whose entry describes it as anti-beam coated — **with or without a shield of its own**. Reduces incoming beam damage by **1** (min 1), then absorbs the remainder into its 8 HP pool **before** any shield or Limb Health is touched. Ballistic weapons, physical melee and explosives bypass it entirely. **Cannot Shield Bash.** At 0 the coating is burned away for the rest of the game, taking the -1 with it. Full rules under **Anti-Beam Coating (trait)**, Section 4.2. |
| Beam Shield (e.g. F91) | Its own independent tier table — see below | 180° (front only), same as Standard | Functions exactly like a Standard Shield in every way except one: on reaching 0 HP, it isn't gone for the rest of the game — it goes offline for **3 full turns**, then automatically restores to its full HP. Represents a re-established energy field rather than physically destroyed plating. **Exception:** if a Beam Shield successfully Blocks an attack that rolled a **Natural 20**, the shield is **permanently destroyed** instead — the sheer force compromises the generator core even though the immediate hit was stopped. A permanently destroyed Beam Shield behaves exactly like a destroyed Standard Shield from that point on: gone for the rest of the game, no regeneration. This mirrors real canon behavior — Beam Shields aren't invincible, and a sufficiently powerful or precise hit can genuinely end one for good even if it technically did its job in the moment.

| Tier | Beam Shield HP |
|---|---|
| Flagship | 10 |
| Super Flagship | 11 |
| Superweapon | 13 |
| Myth | 15 |

Beam Shield HP is tracked independently from Standard Shield's tier progression — it's a genuinely different shield category (like Multi-Shield), not a flat modifier off the Standard value. |

**Quadrant Shields (Multi-Shield only):** unlike a Standard Shield's single HP pool, a Multi-Shield's total is split across **four separate 90° quadrants** (Front/Right/Back/Left), tracked independently — functioning like Limb Health rather than one flat pool. An incoming hit only damages whichever quadrant is actually facing that direction; the other three are untouched.

| Tier | Total | Quadrant Split |
|---|---|---|
| Flagship | 24 | 6 / 6 / 6 / 6 |
| Super Flagship | 24 | 6 / 6 / 6 / 6 |
| Superweapon | 28 | 7 / 7 / 7 / 7 |
| Myth | 32 | 8 / 8 / 8 / 8 |

Once a quadrant reaches 0 HP, that specific 90° arc no longer Blocks — any hit from that direction goes straight to the unit's own Health instead, exactly as if it had no shield at all in that arc, while the other three quadrants remain fully functional.

**Reorientation:** once per turn, as a **free action** (no AP cost), the pilot may freely reassign which of the *remaining intact* quadrants covers which direction — any arrangement, not limited to swapping two at a time. This lets a pilot proactively rotate a damaged (destroyed) quadrant away from the direction they expect the next attack from, covering that approach with an undamaged quadrant instead.

---

## 2. ACTION POINTS

Each unit has a set number of Action Points, typically ranging from **2-4** depending on the MS.

- **1 AP** may be spent on: a ranged attack (including whips/throwing weapons), or drawing a weapon.
- **Initiating a Melee Clash costs no AP by itself** — the cost is in *drawing* the melee weapon beforehand (see the Melee Weapons table, Section 1, which lists each weapon's draw cost). A unit already holding a melee weapon can initiate freely.
- **Movement has no AP cap.** A unit may spend as much of its AP pool on Movement as it likes, up to all of it — giving up every attack and ability that turn to do so. (Stealth Stance is the one exception: it caps movement at 2 AP per turn, see Section 9.6.)
- AP can be mixed freely within a turn (e.g., 1 AP move + 1 AP attack + 1 AP attack again, if the unit has 3 AP).

### AP Cost by Action Type (Quick Reference)
| Action | AP Cost |
|---|---|
| Ballistic weapon attack | 1 |
| Movement | 1 per movement increment — no cap, a unit may spend its entire AP pool on Movement if the player chooses, giving up all attacks/abilities that turn to do so |
| Beam weapon attack | 2 |
| Called Shot | Same as the weapon used — no extra AP cost |
| Ballistic Spray and Pray | 2 |
| Beam Spray and Pray | 3 |
| System Override (Crystal Body) | Matches whatever weapon is being stolen |
| Drawing / switching to a different weapon | 1 (or the weapon's own listed cost — see Section 1) |

### Equipped Weapons and Switching (cf107 designer decisions)

Track weapons by left and right hand. Before play, choose starting equipment without spending AP: normally the main beam/ballistic weapon and an available shield. Equipment persists across turns. Each ordinary weapon equipped or switched costs **1 AP**. A weapon with a listed heavy draw cost retains **2 AP** (including GN Sword, Beam Axe/Tomahawk and Anti-Ship Sword). Each dagger-type weapon costs **0 AP** to equip. Equipping two ordinary sabers costs **2 AP total**, one per saber. Equipped melee weapons do not pay the draw cost again for every exchange. Weapons cannot be switched during an active four-exchange melee segment; switch on your own turn during its pause.

**Forearm shields use separate mounts**, not hand slots: a rifle and saber, two guns, or two melee weapons may be held while a forearm shield remains mounted. Body/quadrant shields retain their own arrangement. A shield's mounted weapons need no separate switch while it is mounted and usable; destroying or losing that shield disables those weapons. Phenex's Armed Armor DE lending, remote operation and existing shield controls remain unchanged; its Beam Sabers use the hand-equipment rules.

**Integrated systems** do not require drawing or switching and are unaffected by dual-wield accuracy penalties. Their own AP, cooldowns, charges and mount-destruction restrictions still apply. There is no general ammunition system. Unequipping and re-equipping never resets cooldowns or replenishes explicit charges.

### Dual-Wield (Ranged + Melee, or Two Ranged Weapons)
Any ranged weapon usable one-handed — Beam Rifles, Magnums, Bazookas, one side of a Twin Buster Rifle-style dual weapon, etc. — may be equipped and fired in the same turn as a melee weapon. **Snipers are the sole exception**, requiring both hands to stabilize the weapon and remaining ineligible for Dual-Wield entirely.

- **The ranged weapon takes a flat +3 to its roll needed to hit** while Dual-Wielding, reflecting the accuracy lost firing one-handed. This stacks with any other applicable modifier — a Called Shot while Dual-Wielding needs the usual +5 Called Shot penalty plus this +3, for +8 total over the base range number.
- **Two ordinary handheld ranged weapons may also be equipped together. Each takes −3 to its attack roll (equivalently +3 to its target number).** Purpose-built dual systems such as Wing Zero's Twin Buster Rifle retain their documented attacks without this penalty. Integrated weapons do not receive it.
- **The melee weapon is entirely unaffected** — resolved normally through the standard Melee Clash system (Section 7.1), which doesn't concern itself with one-handed versus two-handed use.
- **Both weapons keep their own independent AP costs.** Dual-Wield doesn't create a discounted combined action — it simply permits using both a ranged and melee weapon in the same turn without needing to spend AP switching between them.

---

## 3. RANGED COMBAT RESOLUTION

### 3.1 Attack Roll
When making a ranged attack, the attacker rolls a d20 against a target number based on range to the defender:

| Range | Standard | Called (+5) | Sniper (own curve) |
|---|---|---|---|
| 120cm+ | 18+ | 23+ (effectively impossible — only a Nat 20 exception could ever reach it) | 12+ |
| 90-120cm (Sniper sweet spot) | 15+ | 20+ | 9+ |
| 60-90cm | 12+ | 17+ | 12+ |
| 30-60cm | 9+ | 14+ | 15+ |
| Under 30cm | 6+ | 11+ | 18+ |

The **Standard** column applies to every weapon except Beam/Ballistic Sniper. Standard weapons don't distinguish 90-120cm from 120cm+ — this row split only exists so the table can show the Sniper column's distinct sweet-spot number at that same distance; a Standard weapon just keeps climbing the normal way (15+ at 90-120cm, 18+ once past 120cm). The **Sniper** column applies only to Beam/Ballistic Sniper weapons, which use their own bell-curve — easiest at the 90-120cm sweet spot, harder both closer and farther than that band, reflecting a weapon built for a specific engagement distance rather than general use. The **Called (+5)** column stacks the Called Shot penalty (Section 3.2) on top of the Standard column only — a Called Shot at 120cm+ needs a 23+, which no roll can ever reach (a natural 20 still isn't a 23), meaning a Called Shot is simply not a viable option that far out.

If the roll fails, the attack misses entirely and resolution ends there — no reaction needed from the defender.

**Firing at a Concealed target:** unlike Cover (which physically blocks the shot entirely for Ballistic weapons, or requires the target be Spotted for Beam), Concealment doesn't stop a shot from being fired at all — it just makes it much harder to aim. **Any attack targeting a Concealed unit needs a flat 18+ to hit, regardless of range or weapon type** — the normal range-based target numbers above don't apply while the target is obscured. **AoE effects (Section 8) are fully effective against Concealed targets and ignore this roll entirely** — a wide-area blast doesn't need to precisely aim at anything, so hiding in smoke or dust is no protection against it. A unit relying on Concealment needs to specifically watch out for AoE-capable opponents.

### 3.2 Called Shot
Instead of a standard attack, the attacker may declare a Called Shot on a specific location (see Section 5, Limb Health) at the point of declaring the attack, before rolling.

- **Called Shot penalty: +5** to the target number needed to hit (see table below).
- If successful, damage is applied directly to the declared location — no location roll needed.
- Called Shots cost the same AP as a normal attack (no additional AP cost).

| Range | Standard Target | Standard Odds | Called Shot Target | Called Shot Odds |
|---|---|---|---|---|
| 60cm+ | 12+ | 45% | 17+ | 20% |
| 30-60cm | 9+ | 60% | 14+ | 35% |
| Under 30cm | 6+ | 75% | 11+ | 50% |

**Stacking penalty reductions:** Some pilot Specializations and unit traits (e.g., Precision Optics, Hyaku Shiki's IDE System, Marksman's Instinct) reduce the Called Shot penalty, and these can stack from multiple sources at once. The formula is always **target number = base target + penalty** — if stacked reductions push the penalty below +0, don't floor it at zero, just use the negative number directly. Adding a negative penalty subtracts from the base target number, meaning the roll gets easier rather than harder. Worked example: at 30-60cm range, the base target is 9+; a normal Called Shot adds +5 for 14+; but if stacked reductions bring the penalty down to -2, you take the base of 9 and subtract 2, needing only **7+** — easier than even a standard, non-aimed shot at that range.

### 3.3 Hit Location (Standard Attacks Only)
If an attack hits and was **not** a Called Shot, roll a d10 to determine which location takes the damage:

| Roll (d10) | Location | Odds |
|---|---|---|
| 1 | Head | 10% |
| 2-3 | Left Arm | 20% |
| 4-5 | Right Arm | 20% |
| 6 | Left Leg | 10% |
| 7 | Right Leg | 10% |
| 8-10 | Chest | 30% |

Only roll this after a hit is confirmed — don't roll location on a missed attack.

**Natural 20:** if the attack roll itself was a natural 20, skip the d10 roll entirely — the attacker may **choose any location freely**, including Chest or Head, the same precision as a Called Shot but without needing to declare it in advance or pay the +5 penalty. This applies to standard attacks only, not Called Shots (which already let you choose a location). Additionally, a natural 20 **cannot be Dodged — Free or rolled — only Blockable**, same logic as a Sniper or Homing Missile. A raised Shield in arc can still stop it.

### 3.4 Full Sequence
1. Attacker rolls to hit (Section 3.1), or declares and rolls a Called Shot (Section 3.2).
2. If the attack hits, determine the location — random roll (3.3) for standard attacks, or the declared location for Called Shots.
3. Defender may react — Free Dodge (Section 4.0, if available), then Dodge or Block (Section 4.1-4.2) — against the incoming hit.
4. If the reaction fails (or none is available/used), damage is applied to that location's Health pool (Section 5).

### 3.5 Cover
A "piece of cover" is any single terrain obstruction fully blocking line of sight to the target — a rock, a building, a wall section, etc. (agree with your group at setup on what counts as one piece).

- **Ballistic weapons** cannot fire through cover at all — if a piece of cover fully blocks line of sight to the target, a Ballistic weapon simply cannot target it. No line of sight, no shot.
- **Beam weapons** can fire through **exactly one** piece of cover, punching/burning through it to still hit the target — no penalty to the attack roll. They cannot fire through **two or more** stacked pieces of cover (e.g., a target behind a building that's behind another building) — at that point, line of sight is blocked for beams too.
- **Spotting requirement:** firing a Beam weapon through cover requires the target to be **Spotted** — at least one friendly unit (not necessarily the one taking the shot) must have clear, unobstructed line of sight to the target. If no friendly unit can actually see the target, nobody on that side can shoot through cover at them, even with a Beam weapon — you can't punch a shot through a wall at someone you don't actually know is there. A target stays Spotted for as long as at least one friendly unit maintains that line of sight; the moment every friendly unit loses LOS to them, they're no longer Spotted and beam-through-cover shots against them stop being legal until someone re-establishes sight on them again.
- A target with partial cover (not fully blocking line of sight) is unaffected by this rule — Cover only matters when it would otherwise fully block the shot.
- **Cover Capacity:** each individual piece of cover can only shelter **one unit at a time**. If a battlefield has 2 buildings, at most 2 units total can be using cover simultaneously — everyone else is exposed, regardless of how many units would like to hide.

### Destroying Cover
Rather than only going around cover, units can shoot it down directly — this is the Ballistic side's real answer to being locked out by an entrenched target.

- **Cover HP:** a standard piece of cover (rock, building, debris) has **3 HP**. Larger/fortified terrain can be given more HP at your group's discretion.
- Attacks declared against cover itself **always hit automatically** — no roll needed, it's a stationary, inanimate target.
- **Damage against cover uses each weapon's normal Damage stat directly** — no separate value to track. For reference, against 3 HP standard cover:

| Weapon | Damage | Hits to Destroy |
|---|---|---|
| Ballistic Pistol | 1 | 3 |
| Ballistic Rifle / Machine Gun | 2 | 2 |
| Ballistic Sniper | 4 | 1 |
| Bazooka | 3 | 1 |
| Beam Pistol | 3 | 1 |
| Beam Rifle / Machine Gun | 5 | 1 |
| Beam Sniper | 7 | 1 |
| Beam Magnum | 9 | 1 |
- Once a piece of cover's HP reaches 0, it's destroyed and removed from play immediately — whoever was using it loses the benefit right away, for the rest of the game.
- **Dust and Rubble Concealment:** the instant a piece of cover is destroyed, the area it occupied is obscured by dust and debris for **1 full turn** (until the start of the destroyer's next turn). Unlike the cover that used to stand there, this doesn't physically block shots — anyone can still be fired upon while standing in it, but any attack targeting them needs a flat **18+ to hit, regardless of range** (see Section 3.1's Concealment rule), and AoE effects ignore this protection entirely. Represents the settling dust cloud making it hard to aim cleanly, even though there's no longer anything solid actually in the way.

**Smoke Grenade (universal Grunt-tier equipment):** every Grunt-tier unit — regardless of specific model — carries a Smoke Grenade as standard equipment, without needing a dedicated weapon table entry or extra DP cost. **2 charges per game, 30cm range, 1 AP.** Deploys a concealment cloud at a chosen point within range, lasting **2 full turns**. Functions exactly like Dust/Rubble Concealment above — doesn't physically block shots, but any attack against a target in the cloud needs a flat **18+ to hit regardless of range**, and AoE effects ignore it entirely. Deals no damage; purely a battlefield-control tool.

---

## 4. REACTION ROLLS

Reaction Rolls cover **Dodging** and **Blocking**, and are made in response to being attacked. A unit surrounded by multiple attackers may choose, situation-dependent, whether to Dodge or Block against each incoming attack (if it has a shield).

**While locked in an active Melee Clash — including any pause where the unit failed to disengage (e.g., was Shield Bashed, per Section 7.1)** — a unit may still **Block** incoming ranged fire with its shield (if equipped and the attack is within its facing arc — see Section 4.2), and may still attempt a **rolled Dodge** (Section 4.1), but **cannot spend a Free Dodge** — it's too committed to the clash to get the guaranteed, no-roll benefit, though it can still react on its own merits. This applies to ranged attacks from other units while the clash is ongoing (e.g., someone shooting into the clash per Section 7.3, or supporting fire from allies once a target has been Bashed and denied its escape); the Melee Clash's own exchanges use the separate Shield Block/Bash system (Section 7.1) instead of Dodge/Block entirely.

**Disengaging means spending AP to move away at the pause.** If a unit has 0 AP left after the clash, it physically can't move, so it stays locked in and gets no Free Dodge for the rest of the turn, even against unrelated ranged fire. If it still has AP left, it can spend that to move away instead — and as long as the opponent doesn't Shield Bash to stop it, that counts as a successful disengage, meaning its Free Dodges are back for the rest of the turn.

### 4.0 Free Dodges
Any unit with Free Dodges available (Section 1; most Flagship-tier units and above have them, per Section 10 — though some units are deliberately priced as exceptions with none at all, trading that baseline for other strengths) may spend one to **automatically negate one incoming attack — ranged or melee-refusal — with no roll required.** This is always the first reaction to consider, since it's guaranteed unlike a rolled Dodge:

- Free Dodges refresh to their maximum at the start of each of the unit's turns — unused Free Dodges do not carry over.
- Each Free Dodge can only cancel one attack. A unit facing more incoming attacks in a turn than it has Free Dodges must fall back to Blocking or a rolled Dodge (below) for the excess.
- Spending a Free Dodge to refuse a melee initiation attempt (Section 7.2) uses the same pool — there's only one Free Dodge count per unit per turn, shared across both ranged defense and melee refusal.
- If Head is destroyed on a Gundam-tier unit, all Free Dodges are permanently lost for the rest of the game (Section 5).
- **Facing requirement:** Free Dodges only work against attacks originating from within the unit's **180° forward arc**, tracked by the direction its torso is facing. An attack from outside that arc — the flank or rear — cannot be Free Dodged at all; the defender must fall back to a **rolled Dodge** (Section 4.1) instead, with no Free Dodge option available for that specific attack regardless of how many Free Dodges remain unspent. **Exception:** a unit in an active Transformation/Overdrive state (NT-D and similar) gains **360° Free Dodge coverage** for the duration, removing the facing restriction entirely while that state is active. This facing rule governs Free Dodge eligibility specifically — it is entirely separate from a unit's Shield Coverage arc (Section 4.2), which some units document as 360° (e.g., Kshatriya's Multi-Shield) independently of their own Free Dodge facing; having a 360° shield does not grant 360° Free Dodges on its own.
- **While locked in an active Melee Clash** (including a failed disengage attempt — see above), Free Dodges cannot be spent against incoming ranged fire — but a rolled Dodge or Shield Block are still available as normal.

### 4.1 Dodging Rolls
Roll needed to successfully dodge increases the closer the attacker is:

| Range | Roll Needed |
|---|---|
| 90cm+ | 7+ |
| 60-90cm | 10+ |
| 30-60cm | 14+ |
| Under 30cm | 18+ |

**Dodge Bonus (unit passive):** some units, built around exceptional evasive reputation rather than just general speed, carry a Dodge Bonus — a flat reduction to their own Dodge target number across all range bands. This is priced into a unit's DP cost like any other ability (Section 10):

| Tier | Effect | DP Modifier |
|---|---|---|
| Agile | -2 to Dodge target number | +100 |
| Exceptionally Agile | -4 to Dodge target number | +200 |

**Rolled Dodge Cap:** you may attempt a rolled Dodge the same number of times as your Free Dodges — a Flagship/Hero-tier unit gets 2 rolled Dodges per turn (or more, for units with a boosted Free Dodge stat like Sinanju's 3), before your unit's evasion thrusters start to overheat and malfunction from overuse. **Grunt-tier units, which have 0 Free Dodges, get a flat baseline of 2 rolled Dodges per turn instead of 0** — otherwise they'd have no defensive option at all beyond Block.

**A unit that has lost its Free Dodges falls back to that same baseline.** If a Gundam-tier unit's Head is destroyed and its Free Dodges are permanently removed (Section 5), it does **not** drop to 0 rolled Dodges — it gets the **flat baseline of 2 rolled Dodges per turn**, exactly as a Grunt does. Losing the head costs you the guaranteed, no-roll negations and applies -2 to every roll you make; it does not leave the machine with no way to evade at all. Once a unit has used up its rolled Dodges for the turn, any further incoming attacks that turn must be Blocked (if a shield is available and in arc) or simply land.

**Tactical note:** since hit location is always rolled before the reaction step (Section 3.4), you already know exactly where a shot would land — Arm, Leg, Chest, or Head — before deciding whether to spend one of your limited rolled Dodges on it. This means a smart defender can afford to simply absorb a minor Arm/Leg hit and save their rolled Dodges for the shot that actually threatens to take them out of the fight (a Chest or Head hit), rather than reflexively dodging everything as it comes.

**Stacked Funnels/multi-die attacks:** when multiple dice from a Dice Pool attack (Section 8) are stacked into a single combined attack against one target (per that section's stacking rules), that target gets exactly **one** Dodge/Block reaction for the whole stack, regardless of how many dice were stacked onto them. One successful Dodge or Block negates the entire stacked hit — a defender doesn't need multiple Dodges just because an attacker chose to stack more dice. This matches how Burst Fire already works (Section 8): the real tactical tension lives in the attacker's choice of how to split their pool (a bigger stack risks more being wasted by one lucky Dodge; spreading dice thinner guarantees some damage through but caps the ceiling), not in extra bookkeeping on the defender's side.

**Anti-Beam Coating (trait).** Ablative anti-beam treatment. Hyaku Shiki's gold finish is the best-known example, but it appears across the roster on shields and whole machines alike. Wherever a unit's entry describes it as anti-beam coated, it carries this trait — and the trait is always the same, whether or not that unit also has a shield.

- The coating is an **8 HP pool**, flat, and does not scale with chassis tier. It covers **all 360°**, since it is sprayed onto the machine rather than held.
- **All incoming beam damage is reduced by 1**, to a minimum of 1. It never reduces a hit to zero.
- The remaining damage then **drains the 8 HP coating pool**. The coating is the outermost layer, so it absorbs beam hits **before** any shield or Limb Health is touched.
- **Once the pool reaches 0 the coating has burned away and is gone for the rest of the game** — both the pool and the -1 reduction. From that point beams strike the shield or Limb Health at full value as normal.
- It has **no effect whatsoever against ballistic weapons, physical melee, or explosives**, which bypass it entirely and hit the shield or Limb Health directly.
- A coating **cannot Shield Bash** — there is nothing to slam with. A unit whose only defence is a coating uses **Limb Bash** (Section 7.1) for control instead.

Being ablative, the coating is genuinely consumed in use. Eight points is a thin margin — roughly two Beam Rifle hits — so it buys a unit a brief window of beam resistance rather than lasting protection, which is exactly what an ablative layer does.

### 4.2 Blocking
If the MS has a shield equipped and the incoming attack is coming from within its coverage arc, it may choose to Block instead of Dodge. **Blocking is automatic — no roll required.** As long as the shield is up and the attack is within its arc, the hit is absorbed into Shield HP instead of the unit's own Health.

- Blocking is effective across a **180° arc** in front of the unit — the back arc remains exposed, unless the unit has multiple shields (e.g., Kshatriya, Full Armor Gundams), which extends coverage.
- The shield has its own separate HP pool (see Shield Stats above).
- **Shield HP loss per hit absorbed equals the incoming weapon's actual damage value** — not a flat rate. A 3-damage Beam Pistol costs the shield 3 HP; a 9-damage Beam Magnum costs it 9 HP. This applies to every weapon at its listed damage number, ranged or melee, standard or Critical.
- Once Shield HP reaches 0, the shield is destroyed and can no longer be used to Block.
- **A shield may Block any number of attacks in a turn, until its HP runs out.** Blocking is not a once-per-turn reaction — as long as the shield is still standing and the attack falls within its arc, it absorbs the hit. This matters most for a unit in Defense Stance (Section 9.1), which is screening for allies across the entire turn: it can body-block hit after hit until the shield finally breaks, which is precisely the point of putting a unit there.

---

## 5. LIMB HEALTH

Every unit's durability is tracked across six separate locations instead of a single flat HP pool — Left Arm, Right Arm, Left Leg, Right Leg, Chest, and Head. Damage is assigned to whichever location is hit (see targeting note below).

### Limb Health Table
| Location | Grunt MS | Hero MS (Gundam-tier) |
|---|---|---|
| Left Arm | 4 | 7 |
| Right Arm | 4 | 7 |
| Left Leg | 4 | 7 |
| Right Leg | 4 | 7 |
| Chest | 5 | 9 |
| Head | 3 | 5 |

### HP Scaling for Tiers Above Hero (Flagship and up)
Units at Flagship tier and above use a **total HP pool** derived from a percentage increase over the Hero baseline (Left Arm 7 + Right Arm 7 + Left Leg 7 + Right Leg 7 + Chest 9 + Head 5 = **42 total**), then freely distributed across the six locations to match the unit's actual identity — a tanky unit can push extra HP into Chest/limbs, a fast/fragile-flavored unit can stay leaner, as long as the six numbers sum to the tier's total pool.

| Tier | DP Range | % Increase | Total HP Pool |
|---|---|---|---|
| Flagship | 1000-1300 | +0% | 42 |
| Super Flagship | 1400-1950 | +5% | 44 |
| Superweapon | 1800-2999 | +15% | 48 |
| Myth | 3000+ | +25% | 53 |

This system applies **going forward** for new units — existing units built before this system was formalized are not required to be retroactively adjusted.

### Destruction Effects
When a location's Health reaches 0:

- **Arm destroyed** — weapons and a forearm shield on that arm become unavailable; the other arm still functions normally. Recoverable equipment can be picked up for 1 AP under Section 7.4. A weapon or shield does not become usable again merely by selecting it in the equipment list.
- **One Leg destroyed** — the unit's Movement is halved (round down) for the rest of the game.
- **Both Legs destroyed** — the unit is fully immobilized; it can no longer spend AP on movement at all.
- **Head destroyed** — sensors are knocked out: **-2 to all dice rolls** for the rest of the game (attacks, dodges, blocks). **For Gundam-tier units specifically**, this also **permanently removes all Free Dodges** for the rest of the game, including any temporary dodge bonuses granted by abilities (e.g., Extended NT-D) — with the head gone, there's no sensor system left to support them.
- **Chest destroyed** — the unit is **Dead**, regardless of the condition of any other location. This is the unit's actual kill condition; damage to other locations is debilitating but survivable.
- **Down** — a unit is considered **Down** when all four limb locations (Left Arm, Right Arm, Left Leg, Right Leg) have been destroyed simultaneously, while Chest and Head remain above 0. A Down unit is fully immobilized and unarmed (per the individual Arm/Leg destruction effects above, all stacked at once), but not Dead — it's the "knocked out but alive" state referenced by the Melee Clash rules (Section 7.1) as an alternative end condition to Dead.

### Targeting
Standard attacks determine their hit location randomly (Section 3.3). Called Shots (Section 3.2) let the attacker choose the location directly, at a +5 penalty to the attack roll.

---

## 6. COMBAT SEQUENCE

### Initiative
Roll a d20 for each side **once, at the start of the game.** Whoever rolls highest **goes first for the entire game**, with turn order proceeding in descending order of the roll. This order is fixed for the whole match — initiative is not re-rolled each round, and there's no rearranging.

### 6.1 Turn Phases
A turn covers a lot of moving parts once ground units are in play. The structure below keeps things organised — but the **Overmap phase is deliberately loose**, because forcing a player to commit all movement before seeing any shooting results strips out most of the actual decision-making.

**Overmap ground units act alongside mobile suits.** Infantry Squad markers, Cars, Tanks, and Transport Ships all share the main board, so they act in the same phase — they are not a separate step. Only an active **Detailed Battle Map** adds a phase of its own.

**Standard turn (Quick Resolve only — the 1v1 default):**

| # | Phase | What Happens |
|---|---|---|
| 1 | **Overmap Phase** | All mobile suits and Overmap ground units act — movement, Stances, shooting, and Melee Clash initiation, in **any order the player chooses** |
| 2 | **Quick Resolve Rolls** | All active Firefight Clashes roll last, after everything else has settled |

**Extended turn (a Detailed Battle Map is active):**

| # | Phase | What Happens |
|---|---|---|
| 1 | **Overmap Phase** | As above — mobile suits and Overmap ground units, any order |
| 2 | **Ground Battle Phase** | Individual soldiers on the Detailed Battle Map move and shoot, **support fire AoEs are placed** (see 6.2), and Recon's Knife Takedown resolves — the only ground melee in the game, and reactive rather than initiated |
| 3 | **Quick Resolve Rolls** | Any Firefight Clashes elsewhere on the board roll last |

**Order within a phase is up to the player.** You can move two mobile suits, shoot with them, see what happened, then decide how to commit the rest — rather than being forced to declare everything up front. A useful *default* order, if a group wants one for structure, is movement → shooting → melee, but treat that as a recommendation rather than a rule.

**The two hard rules:** support fire must be declared and rolled during the Overmap Phase before its AoE can be placed in the Ground Battle Phase (see 6.2), and **Quick Resolve always rolls last**, once the rest of the board has settled.

Play then passes to the opposing side, who runs the same sequence.

### 6.2 Support Fire (Mobile Suit → Ground Battle)
A mobile suit firing into an active Ground Battle resolves across **two separate phases**, which is what makes the coordination genuine rather than automatic:

- **Overmap Phase:** the mobile suit **declares** the support shot and **rolls to hit** — a Called Shot on the relevant hull or building section (see Sections 13.5 and 13.7). The attacker commits at this point without perfect knowledge of how the ground fight will look by the time the blast lands.
- **Ground Battle Phase:** any support shot that succeeded is now **placed as an AoE** on the Detailed Battle Map, and its damage resolves.

That gap between rolling and placing is deliberate. The mobile suit pilot has to commit to a firing angle early; the ground situation may have shifted by the time the shot actually lands.

**How this plays out differs sharply by format.** In **1v1**, a single commander is working from board history — a turn 1 support shot is close to a guess, but by turn 2 or 3 they've watched how the enemy moves, which side they favour, where they'll likely be when the blast lands. The mechanic gets meaningfully better as the game develops.

In **2v2** it works from the very first turn, because the information doesn't need to accumulate — the Ground Commander can simply *tell* their partner what they're looking at while both are still acting. That's the real advantage of concurrent play: two sets of eyes on two different boards, talking in real time. The coordination lives in the conversation rather than in the rules, which means a pair who genuinely pay attention to each other's situations will land support fire far better than a pair who don't.

### 6.3 Player Count & Recommended Systems

**1v1 (one commander per side) — Quick Resolve strongly recommended.** A single player is running mobile suits and ground forces simultaneously, which is already a lot of board to track. Sticking to Quick Resolve keeps the turn down to two clean phases (Overmap, then Quick Resolve) and stops ground combat from swallowing the mobile suit game.

This is a **recommendation, not a restriction** — a 1v1 game can absolutely run a Detailed Battle Map if both players want one. It just means accepting the extra Ground Battle Phase and a noticeably longer game, with one person managing both scales at once.

**2v2 (split command) — where the Detailed Battle Map genuinely shines.** Each side fields a **Mobile Suit Commander** and a **Ground Commander**, and the two run their phases **concurrently** rather than in sequence. The Ground Commander works the Ground Battle Phase while the Mobile Suit Commander works the Overmap Phase, and the two are expected to **talk to each other throughout** — that discussion is a genuine part of the game rather than an aside.

This is where Support Fire earns its two-phase structure: the Ground Commander can see exactly where enemy units are massing on the interior map, but has no way to hit them at scale; the Mobile Suit Commander has the firepower but not the view. *"There's a cluster on the left flank — can you put a Called Shot into that side of the ship?"* is the intended shape of play. Splitting the workload also means one player can give the Detailed Battle Map full attention without the mobile suit game stalling.

---

## 7. MELEE RULES

### 7.1 Melee Clash
When two units engage in melee, they enter a **Melee Clash** — a self-contained exchange that continues, exchange after exchange, for as long as both fighters keep choosing to stay engaged, until one fighter is Down (all four limbs destroyed — see Section 5) or Dead.

**Pacing — 4 Exchanges per Segment:** A Melee Clash resolves **4 full exchanges** at a time (both fighters roll simultaneously each exchange — 4 exchanges means 4 rolls per side, 8 total), then **pauses**. During the pause, **every unit on the board — including the two fighters who were just locked together — gets its normal turn**, moving, shooting, switching weapons, or repositioning as usual.

This means either fighter can choose to **disengage** during the pause, using normal Movement to put distance between themselves and their opponent rather than continuing the clash. Nothing stops the other fighter (or anyone else) from **chasing them down** — closing the distance again with Movement, or initiating a fresh Melee Clash if back within Charge Range (Section 1). If neither fighter moves away, or if one catches the other, the clash simply resumes for another 4-exchange segment once both have acted.

Each exchange, both fighters roll a d20 simultaneously and compare the difference:

| Difference | Result |
|---|---|
| 0-1 | Block/Parry — nothing happens |
| 2-6 | Hit — deals the winner's equipped weapon's **Normal Hit** damage (Section 1) |
| 7+ | Critical — the winner chooses one of two options (see below) |

**Natural 20:** if a fighter rolls a natural 20 on their exchange die, it's an **automatic Critical** for them — regardless of what the actual difference works out to (e.g., a natural 20 against an opponent's 15 is normally only a 5-point difference, a Normal Hit, but the natural 20 overrides that and forces a Critical instead) — **unless the opponent also rolls a 19 or 20**, in which case the difference stays at 0-1 and it's a Parry as normal, the opponent having matched or nearly matched the exceptional roll.

**Multi-Attack Units (e.g. Nightingale's Hidden Arms: Dual Strike):** a unit with an ability granting more than one exchange die (rolling 2d20, 3d20, etc. instead of the standard 1) resolves against a single-roll opponent as follows — **compare the opponent's roll against the multi-attacker's dice from highest to lowest, stopping as soon as the opponent wins or ties one of them.** If the opponent beats or ties the multi-attacker's highest die, that's the only comparison made — the lower die(s) are never checked at all, since the opponent has already successfully answered the strongest attack. Only if the opponent's roll loses to the highest die does it then get compared against the next-highest, and so on — meaning a defender who is truly overwhelmed can end up facing multiple separate Hit/Critical outcomes from the same single roll of their own, one for each of the attacker's dice that beats them in sequence.

**Dual Beam Sabers (universal rule — applies to any unit canonically carrying two):** a unit that canonically wields two Beam Sabers may spend **2 AP instead of the normal 1** to equip both. Their Advantage applies while both remain equipped and usable. Doing so means rolling **2d20 and taking the higher result** as the single exchange die — genuine Advantage, not a second separate attack. Damage stays at the standard Beam Saber rate (2/4, Normal/Critical) — this option trades AP economy for consistency (a much better chance of a good roll), not for extra damage. A unit can still choose to spend the normal 1 AP and use just one Saber at standard odds if the extra AP is needed elsewhere that turn.

**On a 7+ result, the winner chooses:**
- **Critical Attack** — deals the winner's equipped weapon's **Critical Attack** damage (Section 1) to Chest or Head (the only locations reachable on a Critical). The clash continues.
- **Kick Away** — the target is knocked back **30cm**, immediately **ending the Melee Clash**, and takes a flat **2 damage** (regardless of weapon) to a random location (roll a d10, standard Hit Location table, Section 3.3). Both fighters are now free to act normally on their own turns going forward, same as any disengage (Section 7.1 above). **Kick Away cannot be Blocked or Grabbed — it always succeeds.**

**Hit Location:** No roll needed for a Normal Hit or a Critical Attack — the winner of the exchange chooses the location directly, from a restricted set based on the result:
- **Normal Hit:** choose Left Arm, Right Arm, Left Leg, or Right Leg — only from locations not already destroyed. If all four are already at 0, a Normal Hit lands on Chest or Head instead (attacker's choice).
- **Critical Attack:** choose Chest or Head — the only way to reach these locations while any limb still remains.

**Shield Block (melee):** If equipped with a shield (and the attack is within its coverage arc), a fighter may absorb **any incoming melee hit — Normal or Critical** — into Shield HP, spending the weapon's actual damage value (its Normal Hit or Critical Attack damage, whichever applies) exactly as in ranged Blocking (Section 4.2). This is the sole defensive option against a melee hit while locked in a Clash — there is no free, unlimited-use fallback. A fighter can keep using this as long as Shield HP remains, but every point spent is a point that won't be there for the next hit.

**Shield Bash (melee):** The shield's control option, replacing what a Grab used to do. If equipped with a shield, a fighter may spend Shield HP equal to their own equipped melee weapon's **Critical damage value** (e.g., a Beam Saber's Critical of 4 means a 4 Shield HP cost; a Beam Tomahawk's Critical of 6 means a 6 Shield HP cost) to slam their shield into the opponent during the pause after a 4-exchange segment, stunning them just long enough to force the clash to continue — the opponent's attempt to leave is stopped cold, and the clash resumes for another 4-exchange segment instead. This draws from the same finite Shield HP pool as Shield Block, so every point spent stunning an opponent is a point not available to absorb the next hit.

**Simultaneous Bash attempts:** if both fighters attempt a Shield Bash on each other during the same pause (each trying to stop the other from leaving), whoever declares first succeeds automatically. If it's genuinely simultaneous and can't be determined, both fighters roll a d20 — the higher roll's Bash succeeds (their opponent is held, the clash continues), while the lower roll's attempt fails and their own Shield HP cost is still spent for nothing, same as any other use.

**Limb Bash (melee — the shieldless alternative):** A fighter **without a shield**, or whose shield has already been destroyed, may still perform the Bash control option by slamming a limb into their opponent — a shoulder charge, an elbow, or a knee. It works identically to a Shield Bash: declared during the pause after a 4-exchange segment, it stops the opponent's attempt to leave cold and forces the clash to continue for another segment.

The difference is what it costs. Instead of Shield HP, the fighter takes the **same damage to one of their own limbs** — equal to their equipped melee weapon's **Critical damage value**, exactly as a Shield Bash would have cost. **The player chooses which limb** takes it: an arm, protecting the legs from immobilization, or a leg, protecting whatever is mounted on the arms.

This is deliberately a far harsher price than a shield pays. A Myth-tier Standard Shield holds 18 HP and can absorb four Beam Saber Bashes; a Myth-tier arm holds 8 and is crippled by one. **Limb damage is permanent** (Section 5), and destroying a limb takes any weapon or shield mounted on it with it.

**Heavy weapons make this genuinely expensive.** A Bash while holding an Anti-Ship Sword costs 8, destroying a Myth-tier limb outright; Epyon in Full Output pays 10 against an 8 HP limb. **There is no overflow** — as everywhere else in these rules, excess damage beyond a location's remaining Health is simply lost and never carries into another limb or the Chest. The limb is destroyed and that is the end of it. That is the fighter's choice to make, and it creates a real incentive to **switch to a lighter weapon before Bashing**, since the cost scales with whatever is currently equipped.

**Simultaneous Bash attempts** resolve exactly as above, whether one, both, or neither fighter is using a shield.

This replaces the previous rule that shieldless units had no control option at all. Units such as Crystal Body, Master Gundam, Banshee Norn, and Gundam Night Hawk now have a universal answer available, at a price that keeps shields meaningfully better at the job.

**Melee Weapons and Switching:** Different melee weapons carry different roll bonuses (see the Melee Weapons table in Section 1), so choosing what to fight with matters. Since fighters locked in an active Melee Clash cannot act at all until the segment pauses (4 exchanges — see above), a unit **cannot switch melee weapons mid-segment**. The initiator gets to pick their weapon in advance by drawing it (1 AP, per Section 2) before initiating; a defender caught off-guard is stuck with whatever it already had equipped until the next pause, at which point it could switch on its own turn (1 AP) if the clash is still ongoing.

### 7.2 Melee Initiation — Refusing a Clash
Whether a Melee Clash can be avoided before it starts depends on who initiates:

- **If a Gundam-tier (Hero) unit initiates melee** against another Hero-tier unit, the clash cannot be refused **for free** — but the target Hero may attempt the same **Melee Refusal Gamble** described below, exactly as it would against a Grunt initiator.
- **If a grunt unit initiates melee against a Gundam-tier unit, it also cannot be refused for free.** However, the Hero unit may attempt a **Melee Refusal Gamble**: for each separate initiation attempt, give up 2 Free Dodges (or all remaining, if fewer than 2 are left), then roll a d20 — **12+ succeeds**, and that clash is avoided entirely. The Free Dodges are spent regardless of whether the roll succeeds or fails, and a unit may keep attempting this against separate initiation attempts as long as it still has Free Dodges to spend. This deliberately rewards units built around a larger Free Dodge pool (e.g. Sinanju's 3, or Crystal Body's 6 during Extended NT-D) — they can afford multiple gambles in the same turn, while a baseline 2-dodge Hero only gets one attempt before its entire pool is gone.
- **Kick Away (on a successful refusal):** a successful Refusal Gamble doesn't just avoid the clash — the refusing unit **kicks the initiator 30cm away**, and the **refusing player chooses the direction**. Without this, an attacker could simply re-initiate from where they were standing and force the defender to burn Free Dodges all over again; the kick guarantees the refusal actually buys space.

  Because the refuser picks the direction, this is a genuinely tactical reward rather than just breathing room. You can shove an attacker off an objective, into open ground where your allies can shoot them, out of their own Charge Range so they can't immediately close again, or away from a position they spent turns getting into. On a failed roll nothing moves — the Free Dodges are simply gone and the clash proceeds.

  **Knocked down:** a kicked unit is left prone and must **spend 1 AP to stand up** before doing anything else. If it still has AP remaining when it's kicked, it pays immediately from that pool; if it has already spent everything, the cost carries over and comes out of its **next turn's** AP instead. This closes the loophole where a fast unit with plenty of movement could simply cover the 30cm and re-initiate the same turn — it can still try, but the AP it spends standing up is AP it no longer has for closing the distance and swinging again.
- Grunt-vs-grunt melee initiation cannot be refused by either side, since grunts have no Free Dodges to spend.

### 7.3 Other Units Joining an Ongoing Clash
Since every other unit gets a normal turn during the pause between 4-exchange segments (Section 7.1), joining a melee no longer needs a special trigger — it's just a choice made on a unit's own turn, like any other action:

- **Joining the melee directly** — move adjacent and declare joining. No free hit for joining. Every fighter, including new joiners, still has their own Shield Block/Bash options if equipped (per Section 7.1) — joining doesn't strip anyone's defenses, but it does mean the defender is now facing multiple attackers' worth of Critical Hit chances per exchange while their Shield HP (if they have any) drains against all of them at once, which is what actually makes swarming dangerous.
- **Shooting into the clash** — apply a **+3 penalty** to the normal ranged attack roll (Section 3.1), reflecting the risk of hitting the wrong combatant. Additionally, if the attack roll comes up **4 or below**, it's a **friendly fire incident** — regardless of whether that roll would have hit or missed the intended target, the shot instead strikes the shooter's own ally within the clash. Resolve the friendly fire hit exactly like a normal attack against that ally (their normal Reaction Rolls apply as usual, though per Section 4, a locked-in fighter can only Block this, not Dodge it).

**Tactical note:** since joining still requires being within **30cm** of the clash, a unit can't teleport in from across the board to gang up — units intending to swarm a target in melee need to already be moving together as a squad before the clash starts, positioning themselves in support range rather than trying to close the distance only after seeing a fight break out.

**Why numbers matter so much here:** each additional attacker adds a full extra Critical-Hit chance per exchange against the defender, while a defender's Shield HP (their only defensive resource against melee hits, per Section 7.1) drains against every attacker equally and does not refresh mid-fight. A shieldless defender has no defensive option at all and takes every hit at full value regardless of how many attackers are involved.

**Note on swarm balance:** earlier playtesting (cited in a previous draft of this section) measured swarm survival odds under the old Free Block/Grab system, which refreshed on a melee kill and let a defender fight through attackers one at a time. That mechanic no longer exists — Shield HP is a purely depleting resource with no kill-triggered refresh, so those specific percentages are stale and shouldn't be relied on. Swarm dynamics need to be re-tested under the current Shield Block/Bash system before any new numbers are written in here, and the effect is likely more punishing for both shielded defenders (no more "cut through them" comeback route) and especially shieldless ones (no defense at all against melee while swarmed) than the old data suggested.

---

## 7.4 Battlefield Weapon Pickup

Any unit within **10cm** of a fallen (destroyed) enemy or ally unit, **or a unit that has lost a limb**, may spend **1 AP** to pick up one weapon left on the ground from that unit — a weapon that was mounted on the lost limb specifically, or any weapon carried by a fully destroyed unit. The picked-up weapon uses its **original stats exactly as documented** (range, damage, AP cost) — it does not scale to the new user's own tier or bonuses.


**Recovering your own equipment:** a unit can recover the weapon or forearm shield lost with its own arm for **1 AP**, within the same 10cm pickup range. If the surviving hand or forearm mount is empty and can legally use it, pickup equips it immediately, with no extra draw charge. If occupied, pickup returns the item to the usable equipment list and keeps the currently equipped item in place. Equipping the recovered item later uses its normal equip cost (ordinary 1 AP, heavy 2 AP, dagger 0 AP). Picking up a dagger still costs 1 AP. Shields keep their remaining HP; picking up a destroyed shield does not repair it. Weapon cooldowns and remaining charges travel with the weapon unchanged.

**Adds to arsenal, doesn't replace:** a picked-up weapon is an additional option, not a swap for one of the picker's existing weapons — though the standard 5-weapon-slot limit on a unit's sheet still applies as a hard cap.

**No limit on pickups or swaps:** a unit can pick up, drop, and pick up again as many times as they want over the course of a game, as AP allows.

**Grunt Strain Penalty:** if a **Grunt-tier unit specifically** picks up and fires a weapon with **damage higher than a standard Beam Rifle's 5** (e.g., a Beam Magnum at 9, a Sniper at 7), the unusual power output strains a frame never built for it — that Grunt takes **2 damage to the limb firing it, every time it's fired**. This does not apply to Hero-tier units or above, and does not apply to weapons at or below Beam Rifle's damage (including Bazookas, despite their heavy-hitting reputation, since their actual damage value of 3 falls under the threshold).

---

## 7.5 Base of Operations

Each side, at the start of the game, designates a **Base of Operations** — a line behind which their units deploy. Any unit standing behind that line is considered "in base."

**Sending a unit back:** a damaged unit may retreat into its own Base of Operations using normal Movement — no special AP cost to enter. The unit must then **remain in the zone for a full turn** to receive the benefit below.

**Trigger timing:** the repair effect triggers at the **start of the unit's next turn**, provided they are still standing in the zone at that point (having stayed there since arriving). A unit that passes through without stopping, or that leaves before their next turn begins, gets nothing.

**What it restores:**
- **+2 HP to every limb that is still intact** (a limb already reduced to 0 stays destroyed — this does not resurrect a lost limb, only reinforces ones still standing). This rate scales with the Repair Skill upgrade path below.
- **Shield restored 5 HP per turn** (per shield, or per Quadrant for Multi-Shield units), if the unit has one. This rate scales with the Arsenal Team upgrade path below.
- **Every weapon fully replaced** — including a destroyed original weapon or a battlefield-picked-up weapon (Section 7.4) that was lost, all returning to full working order. The base manufactures a brand-new replacement rather than recovering the specific physical item — if another unit picked up the original on the battlefield, that unit keeps using their copy; the repaired unit simply gets a fresh one from base spares, with no conflict between the two.

**Repeatable:** a unit may return to base, get repaired, head back out, and repeat this as many times as the game allows — there's no cap on how many times a single unit can use this.

**Upgrade paths:** the base can be upgraded along three independent tracks, purchased separately using the team's shared campaign pool (not an individual pilot's GP). Each path is bought in order — a tier requires the previous tier in that same path already owned — and all three can be leveled up in any combination.

**Path 1 — Repair Team (simultaneous capacity)**
| Tier | GP | Units Repairable at Once |
|---|---|---|
| 0 | — | 1 |
| 1 | 15 | 2 |
| 2 | 25 | 3 |
| 3 | 40 | 4 |
| 4 | 60 | 5+ |

**Path 2 — Repair Skill (limb/head healing)**
| Tier | GP | Limb Healing | Lost Limb | Lost Head |
|---|---|---|---|---|
| 0 | — | +2 HP/turn | No | No |
| 1 | 15 | +3 HP/turn | No | No |
| 2 | 30 | +4 HP/turn | No | No |
| 3 | 45 | +5 HP/turn | Yes — repairs at the same rate, starting from 0 | No |
| 4 | 60 | +6 HP/turn | Yes | Yes — repairs at the same rate, starting from 0 |

A Chest destruction can never be repaired at any tier of any path — the Chest is the unit's actual kill condition (Section 7.3), so a unit that's already Dead has nothing left to bring back to base.

**Path 3 — Arsenal Team (shield healing)**
| Tier | GP | Shield Heal Rate |
|---|---|---|
| 0 | — | 5 HP/turn (per shield, or per Quadrant for Multi-Shield units) |
| 1 | 15 | 8 HP/turn |
| 2 | 30 | 12 HP/turn |
| 3 | 45 | Full shield restored in 1 turn (single-shield units); 2 Quadrants fully restored at once (Multi-Shield units) |
| 4 | 60 | 2 full turns: every shield the unit has — single or Multi-Shield, all Quadrants — is fully restored, brand new |

Advanced Repair (the pilot Specialization, Section on Specializations) is a completely separate system — an onboard nanobot regeneration effect rather than an external repair crew — and does not stack, interact, or share any GP pool with Base of Operations.

---

## 8. SKILLS/ABILITIES (Gear-Based)

Certain equipped weapons or gear inherently grant the following abilities.

### Targeting Rules
- **Funnels (Dice Pool System)**: instead of rolling a d20 per target, roll a **pool of d6s all at once** — one die per potential target, up to the ability's stated maximum (e.g., standard Funnels = 3d6; Newtype Sync-boosted counts scale the pool size directly with rank). **Roll the entire pool before choosing any targets.** Each die's face value determines which range bands it's eligible to hit:
  - **1**: miss, unusable on anyone.
  - **2**: eligible only against a target Under 30cm.
  - **3**: eligible against a target Under 30cm or in the 30-60cm band.
  - **4**: eligible against a target out to 90cm.
  - **5 or 6**: eligible against a target at any range, including the 90-120cm band.

  *The 90-120cm band exists for long-reach weapons only. Funnels cap at 60cm and the machine gun options never reach that far either, so in practice a 4, 5, or 6 are interchangeable for all of them — the top band is there for a squad's anti-air rocket (Section 13.7) and any future weapon with that kind of reach.*
  
  After seeing the full pool, the pilot freely assigns each eligible die to any valid target of their choice — representing a Newtype sensing which funnels are tracking true and steering them accordingly. **Multiple dice may be stacked onto the same target** for multiple hits, or spread across separate targets — the pilot's choice. **If multiple dice are stacked onto one target, they resolve as a single combined attack, not separate ones** — that target gets exactly **one** Dodge/Block reaction for the whole stack, matching how Burst Fire works (Section 8): one successful Dodge or Block negates the entire stacked hit, regardless of how many dice contributed to it. A successful, undefended hit deals the combined damage (the ability's stated per-die damage, times however many dice were stacked on that target) to a normally-rolled Hit Location. Targets that only received one die from the pool work exactly the same way, just with a stack size of one.

- **Snipers**: not dodgeable via Free Dodge for anyone. **Grunt-tier units**: still fully undodgeable — only Blockable, no rolled Dodge available at all. **Gundam-tier (Hero) units**: may attempt a **rolled Dodge specifically, needing 15+** — Free Dodges still cannot be spent against a Sniper attack regardless of tier, but a Hero-tier pilot gets one real (if difficult) chance to roll out of the way that a Grunt never gets.
- **Homing Missiles**: not dodgeable — only blockable. No exception for any tier.
- **Point Defense** (Vulcans): free reaction, usable once per incoming Homing Missile — roll a d20, **12+ shoots the missile down** before it hits, no damage taken. Costs no AP, doesn't require the unit's turn.
- **Precision Optics** (sniper-role units — long-range scopes, sensor suites): reduces the Called Shot penalty from +5 to +2.

### Faction Armour Traits
Two settings in this roster field armour technologies that invalidate an entire category of weapon. Both are **passive, permanent, and shared by every unit of that faction** rather than being individual unit abilities, so they are documented here once instead of being restated on each stat block.

**Nano-Laminate Armour (Post Disaster / Iron-Blooded Orphans).** Nano-laminate disperses beam energy so effectively that it made beam weapons militarily obsolete in its era.
- **All beam weapons deal a flat 2 damage**, regardless of listed value. This includes **beam melee** — a Beam Saber Critical deals 2, not 4.
- Damage is absorbed by the unit's **Nano-Laminate pool**, which covers all **360°**. Once the pool reaches 0 the coating has burned away and beam weapons deal full damage for the rest of the game.
- **Ballistic weapons and physical melee ignore it entirely**, striking Limb Health directly.
- The correct counter is solid rounds at range.

**Variable Phase Shift Armour (Cosmic Era).** An electrical current alters the armour's molecular structure, making it effectively impervious to kinetic impact — but sustaining that current is enormously power-hungry.
- **Ballistic weapons and physical melee weapons deal no damage to the unit itself.** Rifles, Bazookas, Snipers, Vulcans, CIWS, Swords, Heat Axes, Spears, GN Swords and bare hands cannot touch Limb Health while PS is active. Their damage drains the **Phase Shift power pool** instead.
- **Beam weapons ignore it completely** and deal full damage straight to Limb Health, ranged or melee. Beams burn rather than strike, so no power drain occurs.
- **Once the pool reaches 0 the armour shuts down permanently.** The suit takes full damage from every source for the rest of the game — this is the classic Cosmic Era image of a Gundam losing its colour and going grey mid-battle.

| Power Source | PS Pool | Example |
|---|---|---|
| **Nuclear (Hyper-Deuterion or equivalent)** | **24** | Strike Freedom, Destiny, Legend, Infinite Justice, Rising Freedom |
| **Battery with a power extender** | **16** | Strike Rouge |
| **Battery (first-generation suits)** | **12** | — |

Nuclear power grants considerably increased operation time rather than unlimited operation, which is why later Cosmic Era machines sustain PS through a full engagement where a first-generation battery suit visibly runs down.

**The 16-point middle tier** covers battery machines fitted with a power extender — the Strike Rouge's defining modification, which drastically improved its operating time and shifted its Phase Shift colour to the distinctive red and pink. It is a genuine upgrade over a first-generation battery suit without matching a nuclear reactor.

**No unit currently in the roster uses the 12-point baseline.** It exists for first-generation battery machines should any be built later — the original Strike, Duel, Buster, Blitz or Aegis.

The two traits are precise opposites, which produces a genuine standoff when they meet: an IBO unit's ballistic and physical weapons cannot hurt a VPS unit at all, and a Cosmic Era unit's beams are reduced to a trickle against nano-laminate. Neither side can meaningfully damage the other, and that is intended.

### Movement & Utility
- **Whip/Chain weapons**: can be used to pull enemy units toward the attacker. **Requires a roll to hit** — standard melee attack roll, using the weapon's own Melee Roll Bonus if it has one. The target may attempt a Dodge in response, same as any other incoming attack. On a successful hit, the target is pulled the weapon's stated distance toward the attacker; on a miss or a successful Dodge, nothing happens.
- **Flight/Jet Packs**: allow movement beyond the standard 60cm cap per activation.

### Special Attack Actions
- **Power-Up Abilities** (e.g., Trans-Am-style systems): grant a flat bonus to all dice rolls and to movement, for a limited number of turns.
- **Burst Fire** (Ballistic Machine Gun / Beam Machine Gun, normal single-target attack): instead of one roll for fixed damage, roll **3d6** against a single target, using the same d6 range bands as the Funnels Dice Pool system (**4+ at 60cm+, 3+ at 30-60cm, 2+ under 30cm**). Each die that clears the threshold lands as a hit — **Ballistic Machine Gun deals 1 damage per successful die, Beam Machine Gun deals 2 damage per successful die**. This resolves as **one combined attack**, not three separate ones: the target gets a single normal Reaction Roll (one Dodge/Block decision covers the whole burst), and if any damage gets through, it's applied all at once to a **single, normally-rolled Hit Location** (Section 5) — unlike the AoE weapons below, this is not spread across all 6 locations. Total damage this way ranges from 0 (all three dice miss) up to the maximum (all three hit) — genuinely variable, unlike the flat damage a standard weapon deals on a successful hit.
- **Spray and Pray** (Ballistic Machine Gun / Beam Machine Gun): **submachine guns don't have it** — it belongs only to weapons listed as a Ballistic or Beam Machine Gun. Instead of a standard attack, fire in a **45° cone, 30cm long**. Every unit caught in the cone — friend or foe — is a valid target. Unlike Homing Missiles or Vulcans, this is **not automatic** — **roll one d6 per target caught in the cone**, using each target's own actual distance from the shooter: **4+ at 60cm+, 3+ at 30-60cm, 2+ under 30cm** (the same d6 range bands used by the Funnels Dice Pool system). Unlike Funnels, there's no pooling or reassigning — each target's die is fixed to them by where they're actually standing, not chosen by the attacker. Each target that gets hit still gets their normal Dodge/Block reaction on top of that roll. On a successful, undefended hit, damage is dealt to **all 6 locations simultaneously** instead of a single rolled location. Ballistic Machine Gun: 2 damage, costs 2 AP. Beam Machine Gun: 3 damage, costs 3 AP. Usable once per activation, in place of the weapon's standard attack.

### Transformation (Flight/MA Mode)
Units with a transformable frame (e.g., Zeta-type variable mobile suits) can switch between standard Mobile Suit mode and a plane-like Flight/Mobile Armor mode.

- **Transforming costs 2 AP**, usable once per turn, switching between modes.
- **While in Flight Mode:**
  - **Movement is doubled** — Hero-tier units move **60cm per AP** (instead of the standard 30cm), Grunt-tier transformable units move **40cm per AP** (instead of the standard 20cm).
  - **Immune to melee entirely** — cannot be targeted by a melee initiation attempt, cannot be dragged into a Melee Clash, and cannot itself initiate melee while transformed (no humanoid form to fight with).
  - Ranged weapons remain usable normally.
- The unit must transform back to Mobile Suit mode (another 2 AP) before it can engage in or be forced into melee again.

---

## 9. STANCES
Not Reaction Rolls in the strict sense — only Defense Stance is a true reaction. Overwatch, Focus, and Boost are all declared proactively as part of a unit's own turn, but they're grouped here together as a distinct family of tactical postures, each trading away one specific thing for a focused gain elsewhere.

### 9.1 Defense Stance (Escort/Protect)
Solves a real problem with escort- and protect-style objectives: normally, a ranged attack simply goes to whatever target the attacker picked, with no way for another unit to physically get in the way. Defense Stance gives a unit a way to actually guard someone.

**Declaring it:** at the end of a unit's turn, as a **free action** (no AP cost), a unit may declare Defense Stance. It stays active until the start of that unit's own next turn.

**What it does:** if an enemy targets a different friendly unit within **30cm** of the Stance-holder with a ranged attack, the Stance-holder may choose to intercept it — redirecting the attack onto themselves instead. Unlike a normal incoming attack, **the interceptor gets no Dodge of any kind — Free or rolled** — since they're actively diving or dashing into the shot's path on purpose, not reacting to something aimed at them. **Block is still available** if they have a shield in arc; otherwise, the hit lands in full. Represents the guarding unit throwing themselves into the shot's path to take it on their own body instead.

**Exception — Natural 20:** if the attacker rolls a Nat 20, interception fails outright and the shot goes to the original target regardless — the shot is too precisely placed to get in front of, matching how a Nat 20 already bypasses Dodge (Section 3.3).

### 9.2 Overwatch Stance
**Costs 1 AP to declare, on your own turn.** Choose a **direction and lock your ranged weapon on it, watching a straight line 10cm wide** running out from your unit. If an enemy unit moves through that watched line at any point before your next turn, you get a **free reaction attack** against them with that weapon, interrupting their movement — roll to hit as normal, using the target's actual distance at the moment they entered the line.

No charge limit and no per-game cap — a unit can go into Overwatch every turn if it has the AP to spare. The real check on spamming it isn't the cost, it's that **it only pays off if an opponent actually walks into your watched line** — a careful opponent can simply route around it, and a unit that declares Overwatch but never triggers it just spent 1 AP doing nothing that turn. Battlefield hazards (smoke, rubble, destroyed cover) are the intended long-term counterplay to a well-placed Overwatch, not an artificial limit on the ability itself.

### 9.3 Focus Stance
**Costs 1 AP to declare — can be called specifically during your attacking/shooting phase**, right before making the shot, rather than needing to be committed to earlier in the turn. From the moment it's declared onward, **you lose all Dodge access — Free and rolled — until your next turn**, same severity as Defense Stance's interception (Section 9.1) — too locked onto lining up the shot to react to anything else. Block is still available if a shield is in arc.

**In exchange, any Called Shot made this turn ignores the normal +5 penalty entirely** (Section 3.2) — it only needs the same roll as a standard, non-aimed shot, while still getting the full benefit of choosing exactly where it lands. This stacks with unit-level and Specialization-based Called Shot reductions (e.g. Marksman's Instinct, Precision Optics) the same way those already stack with each other — Focus Stance alone is already a full -5, so combining it with any other reduction pushes a Called Shot below even a standard shot's normal difficulty.

### 9.4 Boost Stance
**Declared at the start of your movement phase, this turn only** — unlike the other Stances, this doesn't carry into your next turn at all. Movement this turn gets **+10cm per AP** spent on it (Grunt: 20→30cm/AP, Hero: 30→40cm/AP), but **you cannot make any attack this turn** — every AP not spent on Movement is simply unused. Represents diverting everything into thrusters and legwork instead of weapons systems for one dedicated burst of speed.

**All vehicles, Transport Ships and warships may also declare Boost Stance**, gaining the same +10cm per AP and the same no-attack restriction. A Car goes from 25cm/AP to 35cm/AP; a Transport Ship from 20cm/AP to 30cm/AP; a Tank from 15cm/AP to 25cm/AP; a Helicopter from 35cm/AP to 45cm/AP; a Jet from 50cm/AP to 60cm/AP. Warships gain it too: a Musai goes from 30cm/AP to 40cm/AP, a Salamis Kai from 25cm/AP to 35cm/AP, a Rewloola from 20cm/AP to 30cm/AP and a Ra Cailum from 15cm/AP to 25cm/AP — a Boosting warship fires none of its weapons that turn. **Infantry Squads can never Boost.** This matters most on an extraction run, where a loaded Transport trying to outrun a pursuing warship can trade its escorts' offense for a genuine turn of speed.

Meant for covering ground fast early in a game (e.g., rushing from spawn to reach an objective or firing position sooner), not as a combat tool — since it costs the whole turn's offense, it's a deliberate trade of a turn's damage for a turn's positioning, fully resolved by the time your next turn starts.

### 9.5 Peek and Shoot Stance
**Requires the unit to currently be in Cover.** Costs the equipped weapon's own normal AP cost — no flat discount, no special reduced rate, just whatever that weapon already costs to fire. Represents briefly exposing from behind Cover to take one aimed shot, rather than fully breaking cover.

**Effect:** the unit may fire one shot using a standard weapon only (no abilities) — resolved via the normal roll table (Section 3.1), same as any other ranged attack.

**If the area is under an enemy's Overwatch Stance (Section 9.2):** the overwatching unit may choose to fire first, using its existing free reaction. Because the target is only briefly exposed rather than fully out of Cover, this shot needs **+3** to hit (e.g., a normal 12+ becomes 15+).

**After the Overwatch shot resolves (or immediately, if no Overwatch is watching):** the unit in Cover picks any target within its own vision and fires — no penalty on this shot, standard roll table as normal.

**Return fire:** the target may fire back, as a **free reaction with no AP cost**, at the same **+3** penalty the Overwatch shot used — but only if that target was **facing** the Cover unit at the time (Section 4.0's facing rule). A target caught facing away cannot return fire at all. The Cover unit may deliberately choose to shoot a target that isn't facing them, trading target selection for guaranteed safety from return fire.

### 9.6 Stealth Stance
**Only usable by units with a Stealth ability or attribute.** Unlike the other Stances, this one is **toggleable** — the player may switch it on or off freely.

**Movement while stealthed is capped at up to 2 AP spent per turn** — a real, meaningful restriction now that the general population has no such cap at all (Section 2), representing the need to move carefully and quietly rather than sprint.

**The Marker System:** while Stealth Stance is active, the player does not move the unit's physical model at all. Instead, they move a **marker** representing the unit's general position. This marker is **always visible to both players** — there is no secretly-tracked position, avoiding disputes and the need for a neutral judge. Each stealth unit's marker has a **detection radius** surrounding it, sized according to that unit's specific stealth skill/capability:

| Stealth Quality | Detection Radius |
|---|---|
| Average/baseline stealth unit | 60cm |
| Strong stealth unit | 45cm |
| Myth-tier stealth unit (best-case) | 30cm |

See individual unit entries for which tier they fall into.

**Attacking while stealthed:**
- **Stealth-tagged weapons** may be fired directly from the marker's position — range is measured from the marker to the target, and the physical model is never placed. No reveal occurs.
- **Any other weapon** forces a full reveal: the physical model is placed at the marker's position, and the unit **remains revealed for the rest of that turn and the entirety of the following enemy turn**, before automatically returning to Stealth Stance (marker-only) at the start of its own next turn.

**Forced Reveal (an enemy unit enters the detection radius):** the physical model must be placed somewhere within the detection circle.
- **If cover or a hidden spot exists anywhere within the circle,** the model may be placed anywhere behind it, regardless of how close that ends up being to the entering enemy — proximity doesn't matter if concealment is available.
- **If no cover exists anywhere in the circle,** the model must be placed in the general area of the circle farthest from the entering enemy.

**Re-Stealthing is automatic and purely proximity-based:** the moment the enemy unit(s) that triggered the reveal move back outside the detection radius (and no attack has triggered the full-turn reveal lock above), the unit returns to marker-only Stealth Stance immediately — there is no lasting "spotted" status once the threat has genuinely moved away.

---

## 10. GUNDAM-TIER CLASSIFICATION & DEPLOYMENT POINTS

### Free Dodges by Tier
Any unit costing **1000+ DP (Flagship tier and above)** gets the innate **2 Free Dodges per turn** described in Section 1, regardless of whether it's named "Gundam" or piloted by a protagonist or antagonist. This replaces the earlier naming-based rule — Free Dodges are now purely a function of a unit's tier, not its lineage. Grunt and Elite-tier units (under 1000 DP) never get Free Dodges, no matter how the unit is flavored.

The 🛡️ tag in the Master Unit List below is retained purely as a **"named Gundam" flavor marker** (relevant to the 1000+ Floor rule right below), and no longer indicates Free Dodge eligibility on its own — check a unit's DP cost against the 1000 threshold instead.

### The 1000+ Floor
Any unit that is either **named "Gundam"** or is a **main-antagonist's signature/flagship unit** — 👑 — must cost **at least 1000 DP**, regardless of what its raw stats alone would suggest.

### Deployment Point Tier Structure
| Tier | DP Range |
|---|---|
| Grunt | 500 |
| Veteran/Custom Grunt | 600-750 |
| Elite Non-Flagship | 800-950 |
| Flagship | 1000-1300 |
| Super Flagship | 1400-1950 |
| Superweapon | 1800-2999 |
| Myth | 3000+ |
| **Unknown Class** | **No fixed range — priced case-by-case** |

**Note:** Since Flagship tier starts at 1000 DP, every unit at Flagship tier or above now gets Free Dodges automatically — meaning Sazabi, Zeong, Sinanju, Kshatriya, Hyaku Shiki, and every other non-Gundam-named Flagship-or-above unit on the list below now has 2 Free Dodges per turn too, alongside all the previously-tagged 🛡️ Gundam-named units.

### Unknown Class — Beyond Normal Classification
A rare, deliberately unbounded tier reserved for units whose canon portrayal genuinely doesn't fit the standard progression — mysterious ancient technology (Turn A Gundam's "Black History" origins), reality-bending abilities, or a scale of power the show itself treats as incomprehensible rather than just "very strong." Unlike every other tier, Unknown Class has **no fixed DP range and no fixed HP pool** — stats, weapons, and abilities are built entirely case-by-case to match the specific unit's own lore, without needing to justify the total against a formula the way every other tier does.

This isn't a tier to reach for casually — most units, even extremely powerful ones like Nightingale or Kshatriya, still fit cleanly into Myth tier's scaling. Unknown Class is for the rare handful of units where forcing them into the normal pool system would actually undersell what makes them notable in their own story.

### Transformation DP Modifier
Any unit built with the Transformation (Flight/MA Mode) ability (Section 8) adds **+150 DP** on top of its normal tier cost, regardless of whether it's Grunt or Hero tier. This reflects how strong the ability actually is — a standing, always-available way to sidestep the melee-swarm mechanic entirely (the single most dangerous thing in the game to a Hero-tier unit, per the playtesting data in Section 7.3) rather than a minor utility perk.

### Melee Weapon DP Modifiers
Since melee weapons now carry distinct roll bonuses, damage, and Charge Range (Section 1) rather than being mechanically identical, equipping a stronger one adds DP on top of a unit's normal tier cost:

| Weapon | Roll Bonus | Dmg (Normal/Critical) | Charge Range | DP Modifier |
|---|---|---|---|---|
| Bare Hands / Unarmed | +0 | 1/2 | 0cm | +0 |
| Sword | +1 | 1/2 | 10cm | +15 |
| Beam Dagger | +1 | 2/4 | 10cm | +30 |
| Heat Axe / Heat Hawk | +2 | 2/4 | 15cm | +40 |
| Spear / Lance | +2 | 2/4 | 30cm | +45 |
| Beam Saber | +3 | 2/4 | 15cm | +55 |
| GN Sword | +4 | 3/6 | 30cm | +100 |
| Beam Axe / Beam Tomahawk | +4 | 3/6 | 20cm | +100 |
| Anti-Ship Sword | +4 | 4/8 | 30cm | +175 |

---

## 11. GUNDAM POINTS (GP)

Gundam Points are earned by destroying enemy units and completing objectives, and can be spent in-game on reinforcements/perks or between games on permanent roster upgrades.

### 10.1 Earning GP
When a unit is destroyed, its killer's side earns GP based on the destroyed unit's Deployment Point tier:

| Tier | DP Range | GP Earned |
|---|---|---|
| Grunt | 500 | 1 |
| Veteran/Custom Grunt | 600-750 | 1 |
| Elite Non-Flagship | 800-950 | 2 |
| Flagship | 1000-1300 | 2 |
| Super Flagship | 1400-1950 | 3 |
| Superweapon | 1800-2999 | 4 |
| Myth | 3000+ | 5 |
| Unknown Class | No fixed range | 6 |

### 10.2 Pilot Bounty Bonus (Catch-Up Mechanism)
If the unit destroyed was piloted by a **Custom Pilot** (Section 11.6) rather than a Stock Pilot, the killer earns a bonus on top of the unit-tier GP above, based on that pilot's rank:

| Killed Pilot's Rank | Bonus GP |
|---|---|
| Rookie | +0 |
| Veteran | +2 |
| Ace | +5 |
| Newtype/Coordinator | +9 |
| Super Newtype | +20 |
| Legendary Newtype | +40 |

This exists specifically as a **catch-up mechanism**: a player who hasn't invested much GP into their own pilot yet can still land a single decisive kill against a heavily-progressed opponent and immediately close a large chunk of the gap between them — a lucky or well-earned kill against a Legendary Newtype hands out nearly as much GP as an entire prior game's worth of play. Stock Pilots never trigger this bonus, since they never rank up and represent no GP investment to bounty against.

### 10.3 Spending GP — Reinforcements
GP converts to spendable Deployment Points at a flat rate: **1 GP = 250 DP.**

Once a player has banked enough GP, they may convert it to DP at any point and immediately purchase any unit(s) from the Master Unit List whose combined DP cost fits within the converted amount — spent all at once, no partial-unit purchases. Reinforcements enter play at the owning player's board edge on their next turn.

### 10.4 Spending GP — Perks
Alternatively, GP can be spent on one-time battlefield perks instead of converting to DP:

| Perk | GP Cost | Effect |
|---|---|---|
| Airstrike | 2 | One target unit takes 6 damage to a location of the caller's choice. |
| Bombing Run | 4 | All units within a 20cm radius of a chosen point take 5 damage to **every** location — Left Arm, Right Arm, Left Leg, Right Leg, Chest, and Head all take 5 damage each. |
| N-Jammer | 3 | Target unit loses all Free Dodges and cannot use any triggered ability for 1 full turn. |

### 10.5 Spending GP Between Games — Unit Revival
Only **Hero-tier units (Flagship and above)** need this rule — Grunt and Elite units are mass-produced and simply replaced via normal reinforcement. Unit Revival only applies to a Hero unit that was **fully destroyed** (Chest reduced to 0) in a previous game. A Hero unit that survived a game with damaged locations, but was never destroyed, is assumed **fully repaired for free** between games — Unit Revival isn't needed unless it actually died.

**Unit Revival Cost:** destroyed unit's DP cost ÷ 250, rounded up. Same rate as buying an equivalent unit fresh as a reinforcement — repairing a Hero should never be cheaper than simply replacing it.

| Example | DP | Revival Cost |
|---|---|---|
| RX-78-2 Gundam | 1000 | 4 GP |
| Zeong | 1100 | 5 GP |
| Sazabi | 1650 | 7 GP |

### 10.6 Spending GP Between Games — Pilot Progression

**Stock Pilots vs. Custom Pilots:** Every purchased Gunpla comes with its stock pilot (whatever canon character is packaged with it — Amuro with the Nu Gundam, Char with the Sazabi, etc.). Stock pilots are fixed forever — no GP can ever upgrade them. Each player also creates one **Custom Pilot** of their own; this is the only pilot that can ever gain rank or Specializations, and progression follows the pilot, not the machine — if a Custom Pilot's unit is destroyed and later repaired via Unit Revival, or the pilot switches to a different unit entirely, all earned rank and Specializations carry over with them.

**Funnel Access:** any unit equipped with Funnels (or a similar remote-weapon system) requires a genuinely Newtype-capable pilot to actually fire them — this isn't a rank a Custom Pilot needs to earn to unlock the weapon on a unit they already own, it's about who's in the seat. A **Stock Pilot** who is canonically a Newtype or Coordinator (Amuro, Char, Banagher, etc.) can use that unit's Funnels immediately, with no rank progression needed at all — they're already established as capable in canon. A **Custom Pilot**, however, hasn't proven that yet: they cannot fire a unit's Funnels until they've actually reached **Newtype/Coordinator rank** themselves (Section 11 below). Below that rank, a Custom Pilot flying a Funnel-equipped unit simply cannot use that specific weapon — every other weapon on the unit's sheet remains fully available.

**Rank Progression (free threshold — not a purchase):** Rank is based on **total lifetime GP earned**, not GP spent. The moment a Custom Pilot's running lifetime GP total crosses a threshold, they're automatically promoted — no cost, no need to "spend down" to unlock it, and the GP that crossed the threshold is still fully available afterward to spend on Specializations, battlefield Perks, or anything else. Ranking up never competes with any other use of that same GP.

| Rank | Lifetime GP Threshold | Effect |
|---|---|---|
| Rookie | 0 (default) | No bonus |
| Veteran | 10 | +1 to all standard ranged attack rolls; gains **Specialization Slot 1** |
| Ace | 25 | +1 to Melee Clash rolls as well; gains **Specialization Slot 2** |
| Newtype/Coordinator | 45 | Automatically gains Newtype Sync (4 targets) for free; gains **Specialization Slot 3**; unlocks access to I-Field Sync |
| Super Newtype | 100 | Newtype Sync upgrades to **6 targets**; permanent **+1 AP** on whatever unit they pilot; gains **Specialization Slot 4**; unlocks access to I-Field Mastery |
| Legendary Newtype | 200 | Newtype Sync upgrades to **8 targets**; a **second permanent +1 AP** (stacking to +2 AP total); gains **Specialization Slots 5 and 6**; automatically gains **Newtype Blackout** (below) for free |

**Specialization Slots & Picking:** given how many Specializations now exist (21 across 7 categories), slot growth starts earlier and climbs faster than the original scale:

| Rank | Specialization Slots |
|---|---|
| Rookie | 0 |
| Veteran | 1 |
| Ace | 2 |
| Newtype/Coordinator | 3 |
| Super Newtype | 4 |
| Legendary Newtype | 6 |

A pilot may fill each slot they've earned with one pick from the categories below. Each Specialization has 4 tiers of strength: **Tier 1 must be purchased before Tier 2, Tier 2 before Tier 3, and so on — tiers cannot be bought out of order.** Tier 1 costs **8 GP**; each subsequent tier (2, 3, 4) costs an additional **6 GP**. A tier can only be purchased once the pilot has actually reached the rank that unlocks it — reaching that rank unlocks the *option* to buy the next tier, it doesn't grant it for free:

| Rank | Unlocks Purchase Of |
|---|---|
| Ace | Tier 1 |
| Newtype/Coordinator | Tier 2 |
| Super Newtype | Tier 3 |
| Legendary Newtype | Tier 4 |

A pilot can hold a Specialization at a lower tier than their current rank if they choose not to pay for the next tier yet. **Newtype Sync doesn't use a slot and upgrades for free automatically** — it's the one exception, tied directly to rank itself rather than being a purchased Specialization. With 21 total purchasable Specializations across seven categories and 6 slots even at Legendary Newtype, a fully maxed pilot still has to leave 15 unpicked.

**End-Game Slot Grinding:** once a pilot has reached **Legendary Newtype rank**, they may purchase additional Specialization Slots beyond the standard 6 — each extra slot costs a flat **100 GP**, regardless of how many have already been bought. This is the genuine long-term GP sink for a maxed-rank pilot, letting a dedicated player eventually grind their way toward unlocking every Specialization in the game rather than the progression simply ending at Legendary Newtype.

**Offensive**
| Specialization | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|---|---|---|---|---|
| Marksman's Instinct | -1 to the Called Shot penalty | -2 to the Called Shot penalty | -3 to the Called Shot penalty | -4 to the Called Shot penalty |
| Melee Reflex | 1 reroll per Clash | 2 rerolls per Clash | 2 rerolls per Clash, plus roll at Advantage (2d20, take the higher) | Roll 4d20 total, in two Advantage pairs — each pair resolved by taking its higher die, then those two results are compared using the same Multi-Attack rule as Nightingale's Hidden Arms: Dual Strike (Section 7.1): compare the opponent's roll against the higher of the two results first, only checking the lower result if the higher one loses |
| Weapon Mastery | +1 damage on one chosen weapon | +1 damage on all weapons | +2 damage on all weapons | +3 damage on all weapons |

*Marksman's Instinct stacks additively with any unit-level Called Shot reduction (e.g., Precision Optics, or Hyaku Shiki's IDE System). Worked example: to hit a target at 30-60cm range, a standard attack normally needs a **9+** on the d20 (Section 3.1), and a Called Shot normally needs **14+** (the base +5 penalty added on top). Now say a pilot has Marksman's Instinct Tier 4 (-4 to the penalty) while flying Hyaku Shiki (IDE System, another -3 to the penalty) — those two reductions stack to -7 total. Applying that to the base +5 penalty leaves a **net penalty of -2**. Meaning effectively you take the base of 9 and subtract 2, so the Called Shot now only needs **7+** — genuinely easier to land than even a standard, non-aimed shot at that same range. See Section 3.2 for the general rule on how negative penalties work.

**Crowd Control**
| Specialization | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|---|---|---|---|---|
| Dazzler | Once per game: fire a 45° cone, 20cm long, in front of the unit — every enemy or ally caught inside the cone **and facing the Dazzler unit** rolls the standard d6 range-band check (Section 8) to see if they're actually caught by the flash; anyone hit loses 1 Free Dodge **and** 1 Rolled Dodge that turn | Twice per game: cone extends to 30cm, removes 2 Free Dodges and 2 Rolled Dodges | Twice per game: cone extends to 40cm, removes 3 Free Dodges and 3 Rolled Dodges | Three times per game: cone extends to 50cm, removes **all** Free Dodges and **all** Rolled Dodges |
| Entangler | Once per game: target is immobilized (no movement) for 1 turn, 60cm range | Twice per game, 70cm range | Twice per game: immobilize up to 2 separate targets at once, 80cm range | Three times per game: immobilize up to 3 separate targets at once, 90cm range |
| Quick Hands | -1 turn cooldown on one ability | -1 turn on up to two abilities | -2 turns on one ability | Before the game starts, declare one cooldown-based ability — for the rest of that game, it has no cooldown at all |

*Dazzler is grounded in the Dom's canon Scattering Beam Cannon — a real, on-screen weapon too weak to deal damage but bright enough to blind both human eyes and visual sensors on contact. Because it's a visual effect rather than a physical one, only units actually facing the flash are affected; allies caught in the cone but facing away (the normal case, since teammates don't usually face each other) are untouched. Entangler is grounded in the GM Ground Type's Net Gun and Hyaku Shiki's Clay Bazooka — real canon non-lethal capture weapons purpose-built to restrain rather than destroy.*

**Dazzler Counter-Play — two options:**
- **Turn away:** completely free, no roll required, avoids the flash entirely. Cost: per the facing rule (Section 4.0), the unit's flank/rear is now genuinely exposed for the rest of that turn — Rolled Dodges still function against attacks from that newly-exposed arc, but Free Dodges no longer cover it.
- **Arm-block:** free reaction, roll **12+**. Success avoids the flash entirely with the forward facing kept intact. Failure means taking the full Dazzler effect at whatever tier the flash was cast — e.g., a Tier 2 flash on a failed roll costs 2 Free Dodges and 2 Rolled Dodges, per the updated Dazzler table above.

**Contact-CC Counter-Play (Net/Shock weapons):** any unit targeted by a contact-based Crowd Control effect — Entangler's net, the Gouf's Heat Rod, or any similar weapon — may attempt a free reaction, provided it has a melee weapon equipped: roll **12+** to slice or deflect the weapon before it connects, negating the effect entirely.

**Anti-CC**
| Specialization | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|---|---|---|---|---|
| Shock Resistant Construction | Contact-CC Counter-Play (Net/Shock) roll needs 10+ instead of the standard 12+ | 8+ | 6+ | Fully immune — Net/Shock weapons do nothing, no roll needed |
| Polarized Sensors | Dazzler's Free/Rolled Dodge loss reduced by 1 (e.g., a Tier 1 Dazzler flash removes 0 instead of 1) | Reduced by 2 | Reduced by 3 | Fully immune — Dazzler flashes do nothing, regardless of the caster's tier |
| Refusal Instinct | Melee Refusal Gamble: -2 to roll needed (10+ instead of 12+), still costs 2 Free Dodges | -4 to roll needed (8+), still costs 2 Free Dodges | Gamble now only costs 1 Free Dodge, but roll resets to 12+ | Still costs 1 Free Dodge, -2 to roll needed (10+) |

*Shock Resistant Construction is grounded in genuine armor/frame hardening against the same contact-CC weapons covered by Section 2's counter-play rule. Polarized Sensors directly counters Dazzler's flash-blindness effect at the sensor level. Refusal Instinct improves the existing Melee Refusal Gamble (Section 7.2) rather than introducing a new mechanic — representing a pilot specifically trained to disengage from unwanted fights.*

**Recon** *(relevant only when facing off against enemy Stealth units — these specializations exist to counter Section 9.6's Stealth Stance; the pilot's own unit does not need a Stealth ability)*
| Specialization | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|---|---|---|---|---|
| Extended Detection Sense | +10cm to effective detection range against enemy Stealth units | +20cm | +30cm | +40cm |
| Air Support Recon | 1 charge/game: deploy a Core Fighter (3 HP, no Dodge/Block) up to 90cm away — it has no detection ability of its own, simply functioning as a normal unit for the purpose of triggering enemy Stealth detection. Safe (untargetable) for 1 full turn; becomes targetable starting the following turn. If it survives that 2nd turn too, the charge is refunded; if destroyed on the 2nd turn, the charge is spent and gone | 2 charges/game, same 90cm deployment range | 1 charge/game, deployment range extends to 120cm | 2 charges/game, 120cm deployment range |
| Thermal Sensor | Once a target is revealed (via Cover, Concealment, or a forced Stealth reveal), this pilot's attacks ignore that specific defense within 30cm | 40cm | 50cm | 60cm |

*Extended Detection Sense forces stealth units to reveal from farther away than their own detection radius would otherwise require. Air Support Recon extends the team's effective reach for triggering enemy detection, rather than granting any detection ability of its own — Core Fighters are flown by **Newtype pilots**, whose perception and communication work regardless of Minovsky jamming, which is precisely why ordinary aircraft cannot do this job (see Aircraft & Minovsky Interference, Section 13.7). Thermal Sensor's short range keeps it out of reach for dedicated long-range Sniper-role units, since Sniper range bands start well past 60cm — this specialization is inherently a close/mid-range tool.*

**Stealth** *(requires the pilot's own unit to already have a Stealth ability — Core Rulebook Section 9.6)*
| Specialization | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|---|---|---|---|---|
| Optical Camouflage | Detection radius set to 50cm, overriding the unit's own chassis-based stealth tier entirely | Set to 40cm | Set to 30cm (matches Myth-tier baseline regardless of actual chassis tier) | **Fully invisible** — no detection radius at all. Countered only by Thermal Sensor, by attacking (which still forces a normal reveal per Section 9.6), or by AoE effects that happen to catch the physical space. **Voluntary Reveal:** since no enemy can ever force a reveal at this tier, the pilot may instead choose to appear on their own turn if any enemy unit is within **60cm of the marker's actual position**, immediately execute one Ambush Protocol option (free counter-attack or Melee Charge Surge), then return to full invisibility immediately afterward — a single strike-and-vanish action rather than staying genuinely exposed |
| Ambush Protocol | Fires once per reveal cycle — the moment the unit transitions from stealthed to revealed (forced or voluntary) — granting **one of two options** (not both): a free counter-attack against the unit that caused the reveal or anyone else within the detection radius, or a Melee Charge Surge (see below). Cannot trigger again until the unit re-stealths and is revealed once more. Free counter-attack: standard attack, no bonus | Free counter-attack: +2 to the roll needed to hit | Free counter-attack: +2 to the roll, +2 damage | Free counter-attack is **undodgeable** — no Free Dodge, no rolled Dodge; only Blockable |
| Decoy Deployment | 1 decoy marker total (shared detection radius matching the real unit's own stealth tier) — deploy anywhere on the board at any time during the game. Once an enemy enters its radius, it's revealed as fake and permanently spent. Moves in a straight line automatically | 2 decoy markers total | 3 decoy markers total — **player directly controls decoy movement** | 4 decoy markers total, player-controlled movement |

*Optical Camouflage overrides rather than stacks with the unit's own chassis stealth tier — a lower-tier chassis can reach full Myth-tier (or better) stealth performance purely through pilot skill. Ambush Protocol rewards using Stealth offensively rather than purely to hide. Decoy Deployment is grounded in genuine Gundam-universe decoy/feint tactics — the charges may be spent all at once or spread across the game, entirely the player's choice.*

**Ambush Protocol — Melee Charge Surge (alternate use, all tiers):** instead of the free counter-attack, the pilot may spend the trigger to **double their equipped melee weapon's Charge Range** for that reveal moment (e.g., a Beam Saber's standard 20cm becomes 40cm) and immediately initiate a Melee Clash against the revealer.
- **If the target is facing the stealth unit** at the moment of the charge: the Clash's first roll gains **+5** — a surprise charge the target still catches at the last second.
- **If the target's back is to the stealth unit** (only possible when the Forced Reveal placement lands the stealth unit's model behind cover that happens to sit directly behind the revealer): the first exchange is an **automatic, guaranteed Critical** — no roll needed at all.

Only one of the two options (free counter-attack, or Melee Charge Surge) can be used per trigger.

**Defensive**
| Specialization | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|---|---|---|---|---|
| Backup Sensors | Head-destroyed roll penalty halved (-1 instead of -2) | Immune to the roll penalty entirely | Also keeps Free Dodges even if Head is destroyed | Head location cannot be targeted by a Called Shot at all |
| I-Field Sync* | Once per turn: deflect 1 beam attack, needs 13+ on d20 | Once per turn: guaranteed deflect, no roll | Once per turn: guaranteed deflect, extends to any ranged attack — not just beams | Once per turn: deflect and redirect the incoming attack into another enemy unit within range instead of simply negating it — guaranteed, no roll. The redirected attack keeps its original damage and weapon type; the new target gets their own normal Dodge/Block reaction against it |
| Advanced Repair | Once/game: restore 2 Health to one location | Restore 3 Health, twice/game | Restore a location to full, once/game | Restore two locations to full, once/game |

*I-Field Sync is an exception to the normal unlock schedule: its Tier 1 requires Newtype/Coordinator rank rather than Ace, since it represents a Newtype-specific sensory ability. It still costs 8 GP for Tier 1 and 6 GP per tier after, same as everything else — just gated to a later rank. Tiers 1-2 represent standard I-Field tech, which is beam-only in canon (a real I-Field cannot stop physical ballistics — the particle density required would fuse the field into mega particles itself). Tier 3 and 4's extension to any ranged attack represents an advanced I-Field variant, the same tier of tech as Nu Gundam's Fin Funnel Barrier, rather than standard-issue I-Field generation.

Backup Sensors' progression represents redundant sensor systems building up across the frame: Tiers 1-2 are early sensor redundancy compensating for head loss, Tier 3 extends that redundancy across the whole body (so Free Dodges no longer depend on the head at all), and Tier 4 is a genuine bonus layered on top — a small I-Field generator specifically shielding the head/cockpit, strong enough that a Called Shot can no longer get a clean lock on that location.

**Mobility**
| Specialization | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|---|---|---|---|---|
| Speed Boost | +5cm Movement per AP | +10cm per AP | +15cm per AP | +20cm per AP |
| Evasive Maneuvers | -2 to Dodge target number | -3 to Dodge target number | -4 to Dodge target number | -4 to Dodge target number, and +1 Free Dodge |
| Charge Specialist | +5cm Charge Range, all melee weapons | +10cm | +15cm | +20cm |

Speed Boost stacks with any unit-level mobility ability the pilot's current machine already has (Boost Stance, Overwhelming Mobility, etc.) — it's a flat pilot-level bonus layered on top of whatever the chassis provides, increasing how far each AP spent on Movement goes. Evasive Maneuvers is always active, with no condition tied to actually moving that turn. Charge Specialist applies to every melee weapon's Charge Range uniformly — a standard Beam Saber's baseline 15cm becomes 35cm at Tier 4.

**Newtype Blackout** — automatically granted at Legendary Newtype, no additional cost:
> Once per game, the pilot unleashes a wave of overwhelming psychic pressure. Every unit within a **30cm radius** — friend or foe, except allied Newtype-rank pilots — has all weapons disabled for 1 full turn: no ranged attacks, no melee initiation. Affected units can still move, Dodge, and Block normally; they simply can't attack. Represents every nearby pilot's coordination being overwhelmed simultaneously by raw psychic force, not a targeted system hack.

A fully progressed Custom Pilot (Legendary Newtype, 4 Specializations picked at Ace and upgraded through every subsequent tier) represents the absolute ceiling of the system — 200 GP for rank, 4×8 GP for the initial picks, plus 4×3 tiers×6 GP for full upgrades (72 GP), totaling roughly **304 GP** across a whole campaign. Meant to feel like a singular legend by the time a player reaches it — and a real, ongoing GP sink at every rank-up along the way, not a one-time purchase.

---

## 12. OBJECTIVES

Objectives are player-defined rather than fixed — each side sets their own before the game starts, using the guideline below to keep rewards balanced against straightforward combat.

### 11.1 Setup
- Players agree on **how many objectives** to use and **what mix of difficulties** before the game starts — there's no fixed count or required spread. Three objectives (one of each difficulty) is a reasonable default if you want a starting point, but any combination both sides agree to works.
- Objectives are **known to both sides** — no hidden agendas.
- Whether an objective can be **completed multiple times** in a single game (e.g., a hold-the-point objective scoring every time it's satisfied) is up to the players' agreement before the game starts.

### 11.2 GP Rewards by Difficulty
| Difficulty | GP Reward | Example |
|---|---|---|
| Easy | 2 GP | Hold a specific point on the board for 2 consecutive rounds |
| Moderate | 4 GP | Destroy a specific enemy unit before it destroys 2 of yours |
| Hard | 6 GP | Get a unit off the enemy's board edge without it being destroyed |

These values are meant to make objectives genuinely competitive with pure kill-farming, whatever combination of them a group decides to run.

### 11.3 Example Objectives

**Easy (2 GP)**
- **Hold the Line:** Control a designated point on the board (more of your units within a set radius than the enemy's) for 2 consecutive rounds.
- **First Blood:** Be the side to land the first confirmed kill of the game.
- **Recon Sweep:** Move any one unit to the enemy's board edge and back to your own without it being destroyed.

**Moderate (4 GP)**
- **Demolition Run:** Move a unit to a designated location, spend that unit's full turn "planting" (no other action that turn), then successfully fall back to a second designated location without that unit being destroyed.
- **High-Value Target:** Destroy a specific enemy unit (named before the game starts) before it destroys 2 of yours.
- **Escort:** Get a designated non-combat or weakened unit from one board edge to the other while it survives.

**Hard (6 GP)**
- **Capture Alive:** Reduce a specific enemy unit's Left Arm, Right Arm, Left Leg, and Right Leg all to 0 HP (Chest and Head left untouched, so the unit remains alive per Section 5 — fully immobilized and unarmed, but not destroyed), then physically move it to your own board edge using another unit to tow/carry it, without either unit being destroyed en route.
- **Decapitation Strike:** Destroy a named enemy Flagship-tier-or-above unit within the first 4 rounds of the game.
- **Total Air Superiority:** Have every remaining enemy unit's Left Leg and Right Leg locations both at 0 HP simultaneously at any point in the game.

### 11.4 Ground Unit Objectives
These objectives specifically involve Infantry Squads (Section 13), calibrated for how fragile ground units actually are — no Free Dodges, mostly no shields.

**Easy (2 GP)**
- **Cripple the Squad:** Reduce a specific, named enemy Infantry Squad (declared before the game) to 1 Squad Health.

**Moderate (4 GP)**
- **Combined Arms Kill:** Destroy an enemy Mobile Suit's Chest using a Ground Unit's attack as the finishing blow.
- **Capture the Leader:** Designate one enemy Infantry Squad as "the Leader" before the game. Reduce that Squad's Health to 1 (crippled, not destroyed), then move another unit adjacent and spend a full turn to capture it.

**Hard (6 GP)**
- **Full Capture:** Complete Capture the Leader above, then successfully escort that crippled Squad back to your own board edge without it being destroyed en route.
- **Ground Zero:** Have an Infantry Squad's Coordinated Strike land the finishing blow on an enemy Flagship-tier-or-above Mobile Suit.

---

## 13. GROUND UNITS

Not every unit on the board is a mobile suit. Ground Units cover infantry and vehicles, and use simplified durability tracking suited to what they actually are, rather than the full six-location Limb Health system.

### Infantry Squad (Grunt-tier)
Represents 3-4 soldiers as a single stand, using **Squad Health** — one pooled number instead of separate locations, since there's no single body part to target on a group.

| Stat | Value |
|---|---|
| AP | 3 |
| Movement | 10cm per AP |
| Squad Health | 8 |
| Free Dodges | 0 |
| Rolled Dodge | **10+**, against every incoming attack, unlimited per turn (see Ground Unit Targeting, Section 13.7) |
| Weapons | **Coordinated Strike** — see below |

At 10cm per AP a squad covers only 30cm in a full turn, which is barely a twelfth of a standard board. **Infantry on foot are a garrison unit, not a manoeuvre one** — holding ground they already occupy rather than crossing to reach it. Getting anywhere meaningful means riding in a Car (75cm/turn) or a Helicopter (105cm/turn), which is exactly why those vehicles exist. It also makes an enemy transport a genuine priority target: destroy the ride and the squad is effectively stranded.
| Shield | None |

**Coordinated Strike (Overmap ranged attack):** an Infantry Squad's only ranged action on the main mobile suit board — the squad using whatever combination of their actual gear (rifles, grenades, rockets, the sniper's long gun) best fits the target, abstracted into one simplified, repeatable strike rather than tracking individual weapons.

**1 AP · maximum range 90cm** (the sniper is what carries it that far). **Roll 1d6 to hit**, using the standard d6 range bands (Section 8):

| Range | To hit |
|---|---|
| Under 30cm | **2+** |
| 30-60cm | **3+** |
| 60-90cm | **4+** |

On a successful hit, the effect depends entirely on the target:

| Target | Effect |
|---|---|
| **Infantry Squad** | **1 casualty** — a sniper picking off a single soldier at distance, not a won firefight |
| **Ground vehicle** (Tank, Car, Transport Ship) | **5 damage** — the squad's rocket launchers. Four hits destroy a Tank, two a Car |
| **Mobile suit** | **1 damage to all 6 locations simultaneously** |
| **Aircraft** (Jet, Helicopter) | **3 damage** — one hit downs a Jet, two a Helicopter |

**Coordinated Strike cannot target an enemy Infantry Squad within 30cm.** At that range the two squads are in contact and the exchange resolves as a **Firefight Clash** (Section 13) instead, with its dice pools, items and suppression. This keeps the two systems out of each other's way: **under 30cm is a firefight, 30-90cm is ranged fire.** Vehicles, aircraft and mobile suits can be struck at any range inside 90cm — the restriction applies only to squad-versus-squad.

The result is that closing to contact is how you actually destroy a squad, while ranged Coordinated Strikes are attrition and objective denial — roughly four turns of shooting to wear down a full squad, against a single decisive Firefight Clash segment.

**Squad Effectiveness** (represents dwindling numbers as casualties mount):
- At Squad Health = 1 (down to a single soldier): AP drops to 1.

No Called Shot locations apply to a Squad — it's a flat pool, and hits reduce Squad Health directly regardless of whether the attack was called or standard.

### Firefight Clash (Squad vs. Squad)
When two Infantry Squads meet directly — securing the same objective, blocking the same doorway, contesting the same room — resolve the engagement with **Firefight Clash** instead of standard attack rolls, using scaled terrain (building interiors, urban blocks) rather than the open board.

**Dice pool scales with Squad Health, not 1:1** — a squad doesn't lose a full die for every single casualty, only every 2 HP lost. This is called **Firepower**:

| Squad Health | Firepower |
|---|---|
| 8-7 | 8 |
| 6-5 | 7 |
| 4-3 | 6 |
| 2-1 | 5 |
| 0 | Dead (out of the fight) |

This keeps a losing squad genuinely dangerous for longer — even badly outnumbered, they're never reduced to a token handful of dice.

**Roll the resulting pool as 1d6 per die.** Each die resolves as:

| Roll | Result |
|---|---|
| 1 | That soldier is **suppressed** — their squad rolls 1 fewer die **next round only**. Suppression never stacks and clears automatically each round. |
| 2 | Miss, no effect |
| 3-5 | 1 success |
| 6 | 2 successes |

**Minimum Firepower:** no matter how much suppression stacks up in a single round, a squad with 2 or more HP remaining always rolls **at least 2 dice**. A squad reduced to exactly 1 HP simply rolls its 1 remaining die (see Last Man Standing below). This floor exists specifically to prevent a losing squad from ever being reduced to zero active dice and unable to respond at all — they can still be badly outmatched, but never completely paralyzed.

**Compare each squad's total successes and find the margin** (higher total minus lower total), then apply the result to the losing squad:

| Margin | Outcome |
|---|---|
| 0 | No effect |
| 1 | 1 soldier suppressed |
| 2-3 | 1 casualty |
| 4 | 1 casualty + 1 suppressed |
| 5 | 1 casualty + 2 suppressed |
| 6+ | 2 casualties + 2 suppressed (hard cap — double casualties stay genuinely rare) |

**Special Rule — Last Man Standing:** if a squad is down to exactly 1 die and rolls a natural 6, that soldier automatically breaks contact and escapes the encounter entirely — surviving regardless of how the engagement was otherwise going.

**Special Rule — Perfect Volley:** if a squad rolls **2 to 5 dice** and **every one of them shows a natural 6**, skip the margin table entirely — that squad inflicts an immediate, decisive result on the enemy:

| Dice Rolled (all 6s) | Enemies Destroyed |
|---|---|
| 2 | 3 |
| 3 | 4 |
| 4 | 5 |
| 5 | 6 |

**This includes suppressed and flashed squads.** A squad that has been pinned down to the minimum of 2 dice still scores a Perfect Volley if both dice come up 6 — being suppressed never takes the chance away. A squad rolling **6 or more dice can never score a Perfect Volley**: with the minimum Firepower of 5 dice, the volley is a rare, dramatic result for a squad rolling a reduced pool (two sixes is 1 in 36, three is 1 in 216, four is 1 in 1,296, five is 1 in 7,776).

**Squad Items** — each squad carries a small, fixed set of tactical items for the whole game, each countering exactly one other item in a genuine rock-paper-scissors triangle:

| Item | Effect | Charges | Countered By | Counter Result |
|---|---|---|---|---|
| **Flashbang** | The enemy squad rolls **3 fewer dice this round** (items are revealed before dice are rolled) — no roll needed; the minimum of 2 dice still applies | 2 | Smoke Grenade (declared same round) | No dice removed |
| **Smoke Grenade** | Clears all of the user's own current suppression | 1 | Grenade (declared same round) | Suppression doesn't clear |
| **Grenade** | 1 guaranteed casualty on the enemy squad — no roll needed | 1 | Flashbang (declared same round) | **The blast lands on the thrower instead.** Flashed mid-throw, the soldier drops the grenade at their own feet — the intended target takes nothing, and the Grenade's own squad suffers **1 casualty**. |

Note that Flashbang is deliberately the sharpest corner of the triangle — Smoke and Grenade merely *negate* what they counter, while Flashbang actively punishes it. That asymmetry is why Flashbang is the only item with 2 charges rather than 1: it's the most valuable call to get right, and the most costly to waste.

**Order within a round:** declare items → reveal → apply item effects (Grenade casualty, Smoke clears your own set-aside dice, Flashbang removes 3 of the enemy's dice) → roll dice → compare successes and apply the margin table. Dice set aside by rolled 1s or by the margin table count against the **next** round.

**Item declarations are simultaneous and blind** — both squads commit their choice for the round (an item, or none) without seeing the other side's choice first, then reveal together. This applies whether declared verbally with an agreed reveal cue, written down, or held as a hidden token — whatever's convenient at the table, as long as neither side has any way to react to the other's choice within that same round.

**Turn structure:** one full unit turn covers **4 rounds of Firefight Clash**, directly mirroring Melee Clash's own 4-exchange segment structure (Section 7.1). If neither squad is wiped after 4 rounds, other units may act on their own turns as normal — including a mobile suit firing on either engaged squad — before Firefight Clash resumes for another 4-round segment on the squad's next turn. All suppression clears fully at each 4-round turn boundary.

### Objective Clash — Resolving Building/Room Objectives
Firefight Clash resolves *combat* between squads, but many scenarios (securing a data file, holding a captured person, contesting a control room) need a separate check for who actually **secures the objective itself**, since simply winning individual rounds of Firefight Clash doesn't automatically mean walking out with the prize.

**After a 4-round Firefight Clash segment, if both squads are still standing**, roll **Objective Clash**: both squads roll **2d6**, and whichever squad currently has the **HP advantage** adds **+1 to their roll for every 1 HP of advantage** they hold. The disadvantaged squad rolls flat, with no penalty. Higher total wins; re-roll ties.

The 2d6 bell curve is deliberate — it makes each point of Squad Health advantage worth roughly 11% rather than the ~5% a flat d20 would give, so decisively winning the firefight actually translates into taking the objective. A 1 HP lead is still close to a coinflip (56%), but wiping five of the enemy squad while taking nothing back puts you at **84%** — proportionate to how completely you won the fight. The underdog still gets through about 1 in 10 times, which is what keeps Forced Re-Engagement worth holding a Flashbang for.

**If it's the winning squad's turn next,** they may attempt to spend AP and move their marker off the building/objective area — but this is not automatically guaranteed. See **Forced Re-Engagement** below.

**If it's NOT the winning squad's turn next,** the losing squad gets a genuine choice on their own turn:
- **Re-engage** — trigger another 4-round Firefight Clash segment, attempting to shift the HP balance before the winner gets a chance to extract. Since this can change who actually holds the HP advantage, a **fresh Objective Clash roll is required afterward** — the original result doesn't carry forward once new fighting has occurred.
- **Disengage and reposition** — move their own squad to better tactical ground (a doorway, chokepoint, or to link up with supporting mobile suit fire) rather than continuing to grind the firefight, planning to intercept the extraction attempt when it actually comes instead.

**Forced Re-Engagement:** directly mirroring Melee Clash's own Shield Bash (Section 7.1), the losing squad has one more way to deny a clean extraction even on the winner's own turn — spending their **Flashbang** purely as a cost, with no suppression effect applied, to force another full 4-round Firefight Clash segment instead of letting the extraction happen. The extracting side may spend **1 Smoke Grenade** to counter that Flashbang. This cancels the **current denial only**; it does not guarantee escape. The pursuing side may immediately spend **another Flashbang**, and the extracting side must spend **another Smoke Grenade** to answer it or stay and fight on. During an engagement break, any living squad in the engagement may supply its side’s item, including a squad that has not fought yet. Each Flashbang or Smoke response consumes one charge from the squad supplying it. Continue **Flash → Smoke → Flash → Smoke** for as long as both sides choose to spend available items. A side cannot throw a second Flashbang until the previous one has been countered by Smoke. **Grenade cannot be used for this** — its guaranteed-casualty effect doesn't translate into denying a disengagement the way Flashbang and Smoke's existing counter-relationship does. The Forced Re-Engagement is declared straight away, but the new 4-round segment **begins at the start of the next turn** — the players finish the current turn with their other units first — and both squads carry on with **whatever items they have left**.

This means both sides have real incentive to hold items back rather than spend them freely mid-firefight: a losing squad may want to save their last Flashbang specifically for this moment instead of using it for suppression earlier, and a squad hoping to win and extract needs Smoke Grenades in reserve rather than spending them all defensively during the fight. A larger side can draw on more squads’ reserves to keep denying or covering extraction.

An extraction succeeds when the pursuing side lets the squad go, either immediately or after its latest Flashbang has been countered by Smoke. If it has no Flashbangs remaining, it must let the squad go after Smoke; the app uses **Let them go** to acknowledge this. If the extracting side cannot or chooses not to answer a Flashbang with another Smoke, it stays in the engagement and both sides choose and confirm their fighters again. The objective is secured outright only after the objective holder successfully leaves. A non-holder successfully disengaging removes only that squad; the engagement continues.

### Multi-Squad Firefight Clash (2+ Squads vs. 1)
When a single Infantry Squad is engaged by two or more enemy squads simultaneously, resolve the fights **sequentially rather than in parallel** — a full 4-round segment against the first enemy squad, then a full 4-round segment against the second, and so on. This keeps the bookkeeping simple: you're only ever running one ordinary Firefight Clash at a time, with no juggling of multiple simultaneous comparisons.

**Damage and remaining item charges carry between segments.** The outnumbered squad enters the second fight with whatever Squad Health it has left, rolling reduced Firepower against a fresh opponent — a real and intended disadvantage to being outnumbered. **Item charges do not reset between segments** (see Squad Items, Section 13.6): the lone squad carries whatever it has left into the second fight, so spending everything on the first attacker leaves it with nothing to deny the second one's extraction. Because a flat-value item is worth proportionally more to a smaller dice pool — a Flashbang cutting 3 dice hurts far more when you're rolling 5 than when you're rolling 8 — this genuinely offsets the HP deficit rather than leaving the outnumbered squad hopeless. Suppression clears at each segment boundary as normal.

**Squad Items scale by effect, not by squad count.** A squad does **not** receive extra Flashbangs, Smoke Grenades, or Grenades for being outnumbered — the standard 2 Flashbangs / 1 Smoke Grenade / 1 Grenade per side still applies regardless of how many squads are on that side. Because the fights resolve one at a time, items only ever affect the enemy squad currently engaged; there is no splash onto a squad waiting for its own segment.

The genuine compensation for being outnumbered on the other side is the **shared item economy**: every squad on a side may spend its own items during the breaks between segments — to deny an extraction with a Flashbang or cover one with a Smoke Grenade — even a squad that has not fought yet. A side with spare squads therefore brings more total items to bear across the engagement, which is what keeps a wounded squad in the fight against fresh opponents.

### Large Engagements (Multiple Squads on Both Sides)
Boarding actions and other big fights routinely put several squads against several squads. Rather than inventing a larger dice pool, **resolve the whole engagement as a series of ordinary 1-vs-1 Firefight Clashes**, so every roll stays at a familiar 8-or-fewer dice.

**Pairing up.** Match each attacking squad against a defending squad and fight them one pair at a time, each a full 4-round segment. Where one side has more squads than the other, the outnumbered side **re-uses a squad that has already fought** to cover the extra battle — carrying whatever damage it took **and whatever items it has left**. The defender chooses which of their surviving squads takes that extra fight, so picking the healthiest one is a real decision. If every squad on one side is wiped out before all the pairings are resolved, the remaining enemy squads simply advance unopposed.

**Ship garrisons split into squads.** A ship's Crew HP is organised into 8-HP squads for this purpose — a 26 HP garrison fields three full squads plus a 2-HP remnant. This is why garrison size is set in squads during scenario design.

**Consolidating survivors.** During a break between bouts, a side may select squads to top up the **healthiest selected squad**, keeping its name, to the normal **8-HP maximum**. If health is tied, the squad currently open is topped up first. **No survivors are discarded:** any soldiers not needed to fill the receiving squad remain in their original squads. For example, **5 + 5 becomes 8 + 2**, **7 + 4 becomes 8 + 3**, and **3 + 4 + 1 becomes 8**. Only a donor reduced to zero soldiers leaves the engagement; a surviving remnant keeps its name and may fight a later bout. Transferred soldiers keep their remaining individual health and Kevlar. Squad item charges do not refill or move between bags.

An objective held by a surviving donor stays with that donor. If the holder is completely consolidated into another squad, that receiving squad takes the objective. Consolidating can restore one squad’s full fighting strength, but reduces the reserves only by the soldiers actually transferred. Surviving remnant squads continue to provide fighters and their remaining items during breaks.

**The objective changes hands throughout.** Roll a normal **Objective Clash after every 1-vs-1 segment**, between the two squads that just fought, using the standard 2d6 + HP advantage. The winner takes control of the objective, overwriting whoever held it before — so possession genuinely swings back and forth as the fight sweeps through the ship, room by room. **The final segment's roll is the one that decides it.** Because each roll is between two comparable squads rather than two whole armies, the standard +1 per HP bonus works unchanged, with no scaling needed.

**Forced Re-Engagement applies at every one of these rolls**, not just the last. A squad that loses a segment's Objective Clash may still spend a Flashbang to deny the extraction and force another 4-round segment before the fight moves on — which means holding a Flashbang in reserve stays valuable right through a long boarding action.


### Mobile Suit Fire vs. Infantry Squads
A mobile suit's ranged weapon does not apply its full listed damage against an Infantry Squad — precisely killing multiple small, dispersed, cover-seeking targets with one shot isn't realistic even for a powerful weapon. Instead, on a successful hit, roll a d10 on the **Squad Splash Table**:

| Roll (d10) | Casualties |
|---|---|
| 1-3 | 1 |
| 4-6 | 2 |
| 7-8 | 3 |
| 9 | 4 |
| 10 | 5 |

This applies to any mobile suit weapon hitting a Squad, regardless of the weapon's own listed damage value.

### Ground Unit Deployment Caps
**Ground units cost no DP.** They deal very little damage and exist primarily to contest and hold objectives, so pricing them against mobile suits would be meaningless — a squad is never a substitute for a Gundam. Instead, each side is limited by a hard cap on how many can be on the board at once:

| Unit | Max on Board |
|---|---|
| Infantry Squad | 4 |
| Car | 4 |
| Tank | 2 |
| Transport Ship | 2 |
| Helicopter | 2 |
| Jet | 2 |

**Overall vehicle cap: 8.** Beyond the per-type limits above, a side may never have more than **8 vehicles on the board at once in total**, counting Cars, Tanks, Helicopters, Jets, and Transport Ships together. Infantry Squads are counted separately under their own cap of 4 and do not use vehicle slots.

Without this, the per-type limits would allow twelve vehicles simultaneously — enough to crowd out the mobile suit game entirely. The overall cap forces a genuine army-building decision instead, since you can field roughly two-thirds of what the individual limits permit:

| Example Build | Composition |
|---|---|
| Mobile infantry force | 4 Cars + 2 Tanks + 2 aircraft *(no transports)* |
| Balanced | 2 Cars + 2 Tanks + 2 aircraft + 2 Transport Ships |
| Fast strike | 4 Cars + 4 aircraft *(no armour, no transports)* |
| Heavy support | 2 Tanks + 2 Helicopters + 2 Jets + 2 Transport Ships |

Transport Ships deliberately count against the total. Lift capacity competes with firepower, so committing to a boarding action means giving up combat vehicles to carry the squads that will do it.

**Warships are not vehicles.** Musai, Salamis Kai, Rewloola, Ra Cailum, and any other crewed warship are **purchased with DP as units in their own right**, exactly like a mobile suit. They do not count against the 8-vehicle cap and are not subject to any deployment cap of their own — **DP is the only limit**. A side wanting to spend most of its budget on capital ships may do so, and will field very little else as a result.

Transport Ships are the exception: despite the name they are unarmed logistics craft rather than warships, cost no DP, and remain part of the vehicle cap.

**Respawning:** ground units that are destroyed come back. Infantry Squads, Cars, and Tanks respawn **from your base**; Transport Ships respawn **from your board edge**. A destroyed unit can only be replaced up to the cap — you can never have more than the listed number on the table simultaneously.

**Transport Ship capacity interacts with the squad cap:** each Transport Ship carries 2 Infantry Squads, so 2 Transport Ships lifts a side's entire 4-squad allotment. Squads aboard a Transport Ship still count against the 4-squad cap.

Infantry Squads fall under Grunt tier for Gundam Points purposes (1 GP earned per kill, per Section 11.1).

**Exception — Warships.** Warships are the one naval asset that *does* cost DP (see Section 13.5). Unlike the units above they're genuine combat platforms with mobile-suit-tier firepower, so they're purchased normally rather than capped, they sit **outside** the 8-vehicle cap, and they do not respawn. The four named classes are **Musai**, **Salamis Kai**, **Rewloola** and **Ra Cailum**.

---

## 13.5 SHIP COMBAT & BOARDING

Some scenarios (boarding actions, capturing a target aboard an enemy vessel) involve a ship as a genuine target in its own right — distinct from a mobile suit's six-location Limb Health, and distinct from a standard Infantry Squad's flat Squad Health.

### Ship Stat Block
| Component | HP | Tracks |
|---|---|---|
| **Hull HP** | **Set by class** — Musai 60 · Salamis Kai 70 · Rewloola 100 · Ra Cailum 140 (see the Ship Roster) | The ship's main Structural HP pool — reaches 0, the ship is destroyed |
| **Thruster 1 HP / Thruster 2 HP** | **Set by class** — cruisers 20 each · capital ships 30 each | One disabled = ship Movement halved. Both disabled = ship fully immobilized. Repairable — see Damage Control |
| **Bridge HP** | **Set by class** — cruisers 40 · capital ships 60 | See Bridge Hit Effect below. Reduced to 0, the ship loses all weapons and all steering — it may only continue **straight ahead on its current heading**, at normal Movement, until repaired (see Damage Control) |
| **Crew HP** | **Set by class** — see below | Total pool representing all defending Infantry Squads aboard, tracked using the same Firepower/Firefight Clash system as Section 13, at **8 Crew HP per squad**. |

**Garrison by class.** Crew size is fixed per class rather than chosen per scenario — it reflects how big the vessel actually is.

| Class | Garrison | Crew HP |
|---|---|---|
| **Musai** | 1 squad | **8** |
| **Salamis Kai** | 1 squad | **8** |
| **Rewloola** | 3 squads | **24** |
| **Ra Cailum** | 4 squads | **32** |

**Crew squads never leave the ship.** They are a stat line on the vessel's sheet, not models on the board — they exist to be fought through during a boarding action and to run Damage Control. They therefore sit **entirely outside the 4-squad deployment cap** (Section 13). No matter how many warships a side fields, it may still only deploy **four** Infantry Squads of its own onto the board.

**Cruisers cannot run Damage Control.** A 1-squad garrison is exactly 8 Crew HP, which is already at the threshold where repairs stop (see Damage Control below) — the handful of crew aboard a Musai or a Salamis Kai are fully occupied keeping the ship flying. In practice this means **a subsystem knocked out on a cruiser stays down for the rest of the game**, and a boarding party only has one squad to fight through. It is a real weakness and it is intended: cruisers are cheap, and this is part of why.

### Named Warship Classes

The generic Battle Ship entry has been **retired**. Four named classes replace it, each with its own armament, DP cost and hangar capacity. All four follow the stat block above and the rules in this section; their structural values, AP and movement are set per class (table below), and they differ in weapons, capacity and price.

| Class | Side | Hangar | Launch/turn | Base module | DP |
|---|---|---|---|---|---|
| **Musai** | Zeon | 2 | 1 | No | **2200** |
| **Salamis Kai** | Federation | 2 | 1 | No | **2500** |
| **Rewloola** | Neo Zeon | 4 | 2 | **Yes, tier 2** | **5000** |
| **Ra Cailum** | Federation | 6 | 2 | **Yes, tier 2** | **6000** |

*Structural values vary by class:*

| Class | Hull | Bridge | Thrusters | AP | Movement |
|---|---|---|---|---|---|
| Musai | 60 | 40 | 20/20 | 4 | 30cm |
| Salamis Kai | 70 | 40 | 20/20 | 4 | 25cm |
| Rewloola | 100 | 60 | 30/30 | 6 | 20cm |
| Ra Cailum | 140 | 60 | 30/30 | 6 | 15cm |

*The pattern is consistent: the bigger the ship, the tougher and slower it is. Cruisers are fast and fragile, capitals are durable and ponderous. Note that the Musai’s 4 AP offsets its speed — at 30cm per AP it can cover the same 120cm a turn as a Rewloola, but it arrives with two fewer actions left to shoot or launch with.*

---

### Rewloola-class Battleship — 5000 DP

*Char Aznable's personal flagship, developed from the Principality's Gwazine-class. Built for speed and firepower in equal measure — twelve thermonuclear thrusters, two cooling fins along the midsection, and an armament array that out-guns anything of its displacement. Two launch catapults, one above and one below the bow, both doubling as recovery decks.*

**Structure:** Hull 100 · Bridge 60 · Thrusters 30/30 · Crew HP by garrison
**Actions:** 6 AP · 20cm per AP · no Dodge, no Block
**Hangar:** 4 mobile suits · **2 launches per turn** (two catapults) · carries a **tier-2 Base of Operations module**

| Weapon | Arc | Range | AP | Damage | Mechanic |
|---|---|---|---|---|---|
| **Twin Mega Particle Main Gun** | 360° | Sniper curve | 1 | **12 per barrel, 2 barrels** | The main battery. Split the two shots across **2 separate targets**, or **stack both on one target for 24**. Each barrel rolls and resolves independently with its own Dodge/Block reaction. **1 full turn cooldown** after firing. One 20 HP system — disabling it takes both barrels offline together |
| **Twin Mega Particle Secondary Gun** | 360° | 90cm | 1 | **5 per target** | Hits **2 separate targets** simultaneously, each rolled independently. Reduced to 1 target if the system is damaged. 20 HP system |
| **Anti-Air Array** | 360° | 60cm | 1 | 6d6, **1 per successful die** | Twenty triple-barrel emplacements. **Ballistic, not beam** — so it ignores Nano-Laminate entirely, but cannot touch Limb Health through an active Phase Shift pool. Roll using the standard d6 range bands: 4+ at 60cm, 3+ at 30-60cm, 2+ under 30cm. One combined volley, a single Dodge/Block covers the whole thing. 20 HP system |
| **Missile Barrage** | **Forward arc only** | 90cm | 1 | **4 damage to all 6 locations** | A **60cm wide by 20cm deep** band laid perpendicular to the ship's heading, anywhere within range. Everything caught inside is a valid target, **friend or foe**. **Block only — no Dodge**, since there is nowhere inside the band to dodge to. **Point Defense has no effect**: Minovsky saturation blinds any seeker head, so this is unguided area saturation rather than tracked ordnance — there is nothing to intercept. 20 HP system |

**On the forward arc.** The missile launchers are hull-mounted and cannot fire through the ship's own structure, so bringing them to bear means committing the whole vessel to a heading. At 20cm per AP with no Dodge, that is a genuine commitment. It also gives the Bridge a second layer of importance — lose it and the ship may only continue straight ahead, which means it can no longer aim its missiles at anything not already in front of it. The beam turrets are on rotating mounts and fire in any direction.

**Sustained output** is roughly 26 damage per turn, deliberately close to a Myth-tier mobile suit. Rewloola's advantage is **breadth, not volume** — four weapons doing four different jobs, one of them the only ballistic weapon aboard and therefore its sole effective answer to Nano-Laminate armour.

**DP: 5000.** Derived from a Myth-tier baseline for its output, plus Hull durability (100 is nearly double a Myth suit's 53), its garrison, Damage Control, the 4-suit hangar with two catapults, and the tier-2 base module — offset by no Dodge, no Block, 20cm movement, a forward-only missile arc, and subsystems that stop repairing once the garrison falls to 8 Crew HP. The garrison is priced in and sits **outside** the normal 4-squad deployment cap, since those squads are crew rather than field units. Bringing a warship means bringing far fewer mobile suits to escort it.

---

### Ra Cailum-class Battleship — 6000 DP

*Flagship of the Londo Bell task force under Captain Bright Noa. Where the Rewloola was built around speed and gun count, the Ra Cailum was designed to excel at conventional ship-to-ship battle while still supporting mobile suit warfare — five twin mega particle guns mounted dorsal and ventral for covering fire from every approach, a catapult on each side of the hull, and six bow-mounted launchers carrying nuclear-capable anti-ship ordnance.*

**Structure:** **Hull 140** · Bridge 60 · Thrusters 30/30 · Crew HP by garrison
**Actions:** 6 AP · **15cm per AP** · no Dodge, no Block
**Hangar:** 6 mobile suits · **2 launches per turn** (a catapult on each side) · carries a **tier-2 Base of Operations module**

| Weapon | Arc | Range | AP | Damage | Mechanic |
|---|---|---|---|---|---|
| **Twin Mega Particle Main Gun** | 360° | Sniper curve | 1 | **12 per barrel, 2 barrels** | Five twin guns mounted dorsal and ventral, giving genuine all-round coverage. Split the two shots across **2 separate targets**, or **stack both on one for 24**. Each barrel rolls independently with its own Dodge/Block reaction. **1 full turn cooldown.** 20 HP system |
| **Anti-Air Array** | 360° | 60cm | 1 | 6d6, **1 per successful die** | Twenty-two twin-barrel defensive guns. **Ballistic, not beam** — ignores Nano-Laminate entirely, but cannot touch Limb Health through an active Phase Shift pool. Roll 4+ at 60cm, 3+ at 30-60cm, 2+ under 30cm. One combined volley, a single Dodge/Block covers it. 20 HP system |
| **Anti-Ship Missile** | **Forward arc only** | 90cm | 1 | See table below | **2 charges per game, with a 2 full turn cooldown between them.** The six bow launchers firing Mk-82-class nuclear ordnance — reloading a capital ship's bow tubes is slow. Undodgeable, **Block only**, and it hits **friend and foe alike** with no exceptions. 20 HP system |

**Anti-Ship Missile damage,** tiered by distance from the blast centre:

| Distance from centre | Vs. mobile suits and ground units | Vs. warships |
|---|---|---|
| **0-30cm** | **15** damage to all 6 locations | **40 Hull**, and the **Bridge and both Thrusters are disabled outright** |
| **30-60cm** | 10 damage to all 6 locations | 25 Hull |
| **60-90cm** | 5 damage to all 6 locations | 10 Hull |

A close-range hit is a **mission kill even when it doesn't destroy** — the target drifts straight ahead with no weapons and no steering until Damage Control restores the subsystems two turns later, and only if the garrison is still above 8 Crew HP. Two charges strip 80 Hull, which cripples a warship but never quite finishes one — the last of it always has to be done with guns. The **2-turn cooldown** matters as much as the damage: Ra Cailum cannot hold both charges for a single alpha strike, so the two hits land turns apart and the gap between them is exactly when a faster ship closes the distance.

### Ability — Decoy Balloons
**1 AP, 1 charge per game.** The ship releases several balloons that inflate to its own size and silhouette. Minovsky saturation means long-range sensors cannot tell them apart from the real vessel — only a close visual inspection can.

On deployment the controlling player **secretly writes down a number from 1 to 3** on paper. This is the real ship.

- **Any attacker more than 30cm away must declare a number (1-3) before attacking.** Wrong number, the shot hits a balloon — the attack is wasted and the AP is still spent. Correct number, resolve the attack normally.
- **Within 30cm no declaration is needed and the attack always finds the real ship.** At that distance a pilot can see which hull has turrets tracking them.
- **Area-of-effect attacks ignore decoys entirely** — a Missile Barrage, a Guillotine or a Twin Buster Combined Beam covers enough volume that the real ship is caught regardless.
- **The balloons deflate after 3 full turns**, or immediately if the ship is identified within 30cm.

---

### Musai-class Light Cruiser — 2200 DP

*Zeon's first warship designed from the outset to carry and support mobile suits, and the backbone of their fleet through the One Year War. Small at 234 metres, cheap, and built around a single idea: get the suits into the fight, then trade fire with enemy ships at range. Its twin mega particle guns could punch through any Federation warship of the era.*

**Structure:** Hull **60** · Bridge **40** · Thrusters **20/20** · Crew HP by garrison
**Actions:** **4 AP** · **30cm per AP** · no Dodge, no Block
**Hangar:** 2 mobile suits · **1 launch per turn** · **no Base of Operations module**

| Weapon | Arc | Range | AP | Damage | Mechanic |
|---|---|---|---|---|---|
| **Twin Mega Particle Gun** | **180° forward only** | Sniper curve | 1 | **12 per barrel, 2 barrels** | Three twin turrets, staggered along the hull. Split the two shots across **2 separate targets** or **stack both on one for 24**. Each barrel rolls independently with its own Dodge/Block reaction. **1 full turn cooldown.** 20 HP system. The turrets are mounted to fire forward and upward and cannot traverse fully — anything behind the ship is safe from them |
| **Missile Launchers** | **Forward only** | 60cm | 1 | **3 damage to all 6 locations** | Two large tubes and ten small ones. A **30cm wide by 15cm deep** band laid perpendicular to the ship's heading. Everything inside is a valid target, **friend or foe**. **Block only — no Dodge.** Point Defense has no effect: like all ship ordnance under Minovsky saturation this is unguided area fire, not tracked. 20 HP system |

### The Musai Has No Anti-Air
**This is deliberate and it is the class's defining flaw.** The Musai carries **no anti-aircraft or anti-mobile-suit defensive weapons of any kind** — a genuine design oversight that went unnoticed while Zeon held a monopoly on mobile suits, and became catastrophic the moment the Federation fielded their own.

In play this means a Musai **cannot meaningfully defend itself against a mobile suit that closes the distance.** Its main guns are on the sniper curve, so they get *worse* the nearer a target comes: 18+ to hit under 30cm. A suit that reaches close range and sits behind the ship, outside the forward arc, can dismantle a Musai completely unopposed.

**Musai cruisers are not standalone units.** They are cheap enough to field in numbers, but every one of them needs either a screen of friendly mobile suits or a heavier ship alongside it. Fielding a Musai alone is a choice to lose it.

---

### Salamis Kai-class Cruiser — 2500 DP

*The backbone of the Earth Federation fleet, and the Musai's direct counterpart. The Kai is a refit: the old sub-bridges were torn out for twin mega particle cannons, four machine gun turrets were added for anti-mobile-suit defence, and the bow was widened to take an internal hangar with a proper flight deck. Where Zeon concentrated the Musai's firepower forward, the Salamis disperses hers — fewer blind spots, but she cannot bring it all to bear on one target.*

**Structure:** Hull **70** · Bridge **40** · Thrusters **20/20** · Crew HP by garrison
**Actions:** **4 AP** · **25cm per AP** · no Dodge, no Block
**Hangar:** 2 mobile suits · **1 launch per turn** · **no Base of Operations module**

| Weapon | Arc | Range | AP | Damage | Mechanic |
|---|---|---|---|---|---|
| **Twin Mega Particle Cannon** | **360°** | Sniper curve | 1 | **12 per barrel, 2 barrels** | Turrets dispersed across the hull, so the ship has genuinely no blind spot. **The two shots MUST be split across 2 separate targets — they cannot be stacked on one.** Dispersed mounting means the guns simply cannot all bear on the same point. Each rolls independently with its own Dodge/Block reaction. **1 full turn cooldown.** 20 HP system |
| **Anti-Air Array** | 360° | 60cm | 1 | 6d6, **1 per successful die** | Four machine gun turrets added in the Kai refit, specifically to answer the mobile suit threat that gutted the original Salamis at Loum. **Ballistic, not beam** — ignores Nano-Laminate, but cannot touch Limb Health through an active Phase Shift pool. Roll 4+ at 60cm, 3+ at 30-60cm, 2+ under 30cm. One volley, one Dodge/Block. 20 HP system |
| **Missile Launchers** | **Forward only** | 60cm | 1 | **3 damage to all 6 locations** | Eight internal tubes — the external pods were removed in the refit. A **30cm wide by 15cm deep** band perpendicular to the heading. Friend and foe alike. **Block only, no Dodge.** Point Defense has no effect. 20 HP system |

### Musai vs. Salamis Kai
The two cruisers are deliberate mirrors, and the contrast is drawn straight from the fiction.

| | **Musai** (2200) | **Salamis Kai** (2500) |
|---|---|---|
| Main gun arc | **180° forward** | **360°, no blind spot** |
| Focus fire | **Yes** — stack both barrels for 24 | **No** — must split across 2 targets |
| Anti-air | **None at all** | **Yes** |
| Hull | 60 | 70 |
| Movement | 30cm per AP | 25cm per AP |
| Identity | Glass cannon — hits hardest, dies fastest | Rounded — hits softer, looks after itself |

**The Musai is the better gun platform and the worse ship.** It can concentrate 24 damage on a single target and it moves faster, but a mobile suit that closes inside 60cm and sits behind it can dismantle it without ever being shot at. **The Salamis Kai cannot be flanked and can defend itself, but it can never focus** — every turn it splits its fire whether it wants to or not, which makes finishing a damaged target genuinely awkward.

### What a Cruiser Is Actually For
Neither cruiser can kill a Flagship-tier or better mobile suit. A Myth suit dodges roughly half of everything aimed at it, while a warship has **no Dodge and no Block at all** — so a duel between the two is badly one-sided in the suit's favour, and a cruiser fielded as a gunfighter will simply die.

Cruisers earn their DP elsewhere: **delivering two mobile suits into the fight**, **carrying a garrison that sits outside the 4-squad cap**, **repairing their own subsystems**, **denying ground to squads and Grunts with missile fire**, and **engaging enemy ships from 180cm** where the ship-to-ship range table applies. A cruiser that spends the game as a carrier and a fire-support platform is doing its job. One that closes with a Gundam is not.

### Ship-to-Ship Range Table
Warships are enormous, slow, and cannot dodge — and they detect each other long before mobile suits can close. **When a ship fires at another ship, use this table instead of the standard one** (Section 3.1):

| Range | To hit |
|---|---|
| 150-180cm | **9+** |
| 120-150cm | **7+** |
| 90-120cm | **5+** |
| 60-90cm | **4+** |
| Under 60cm | **3+** |

**This applies ship-to-ship only.** A warship shooting at a mobile suit still uses the standard range table — a mobile suit is a small, fast target and the ship's gunnery was never built for it. A mobile suit shooting at a warship also uses the standard table: mobile suit weapons simply are not effective at extreme range, and the ship's poor accuracy against them is already the trade.

**Weapon ranges are not lifted.** Only the **Main Gun** reaches past 90cm, so a capital ship engagement opens as a long-range duel between main batteries alone, with secondaries, missiles and anti-air coming online as the two ships close. That approach phase is the fight.

### Rewloola vs. Ra Cailum
The two flagships are built as deliberate opposites. **Ra Cailum wins the attrition war** — 140 Hull to Rewloola's 100, nuclear ordnance that strips 40 Hull a hit once a target reaches 90cm, and decoys that tax the approach. But at **15cm per AP** it is the slowest thing on the board: it cannot chase and it cannot disengage, so it has to win where it stands.

**Rewloola wins on tempo** — four weapon systems against three, a mid-range secondary gun Ra Cailum lacks entirely, and twelve thrusters carrying it 20cm per AP. Rewloola closes 120cm in roughly two turns while still firing; Ra Cailum would need nearly three to do the same. **Rewloola therefore chooses the range, and Ra Cailum has to make that choice expensive.**

In practice Rewloola needs about four turns inside 60cm with everything hitting. Ra Cailum needs five or six, but it dictates the opening exchange and its nukes come online the moment anything reaches 90cm.

### Attacking a Ship
Ships **can** be Called Shot at any of their three named locations (Hull, Thrusters, Bridge) using the standard +5 Called Shot penalty (Section 3.1) — genuine tactical planning ("we're going for the engines this game") is intended and supported. If the attacker doesn't call a shot, roll the **Ship Hit Location Table** (d10):

| Roll | Location |
|---|---|
| 1-7 | Hull |
| 8-9 | Thrusters |
| 10 | Bridge |

**Bridge Hit Effect:** landing a hit on the Bridge (called or random) inflicts **2 guaranteed crew casualties** (no roll, applied directly to Crew HP) and **-3 to all the ship's own rolls** for its following turn.

**Choosing a subsystem target.** The HP values are set so that all three options are genuinely worth considering rather than one being strictly best:

| Goal | Target | Damage Needed |
|---|---|---|
| Slow the ship down (Movement halved) | **One Thruster** | 30 |
| Stop it moving entirely | Both Thrusters | 60 |
| Silence its weapons and take away its steering | **Bridge** | 60 |

Knocking out a single Thruster is by far the cheapest meaningful result on the board — half the cost of anything else — and it's often all you need if the goal is just keeping a warship off an objective or buying a Transport Ship time to close. Killing the Bridge costs exactly as much as full immobilization, so the choice between the two is a real judgment call rather than an obvious one — and they don't fully overlap. A Bridge kill silences every weapon but leaves the engines burning, so the ship keeps ploughing straight ahead on its last heading with nobody steering; killing both Thrusters pins it in place but leaves it shooting. Which one you want depends entirely on whether the ship is a threat or an obstacle.

**Hull Damage — Crew Casualties:** a standard, uncalled attack against the ship that happens to land on Hull only ever damages the ship's own Structural HP — it **never** threatens the crew inside. The **only** way to actually put crew at risk is a genuine **Called Shot specifically on Hull** (standard +5 penalty, Section 3.1), representing a mobile suit deliberately targeting a section of the ship it knows soldiers are fighting in rather than just shooting at the vessel generally. This Called Shot requirement is the intended limiter keeping this from being spammable every turn.

Once a Hull Called Shot lands, resolve crew casualties depending on which combat system is currently active for that ship:

- **If the Detailed Battle Map (Section 13.6) is active:** the attacker places a physical **10cm radius, 5 damage AoE** anywhere on the side of the 60x60 map corresponding to where the shot struck the hull. This represents a beam blast tearing through the section. Soldiers caught inside may attempt the standard **Rolled Dodge 4+ (1d6)** as with any other repeatable AoE (Section 13.6) — only the Rocket Launcher and Bombing Run are undodgeable.
- **If Quick Resolve/Firefight Clash (Section 13) is active instead:** roll the **Quick Resolve Table** below.

| Roll (d10) | Casualties |
|---|---|
| 1-3 | 1 |
| 4-6 | 2 |
| 7-8 | 3 |
| 9 | 4 |
| 10 | **Critical — 6** |

### Ship Weapons
Ships mount their own weapons, distinct from anything a mobile suit carries. **Each class carries its own named weapons** — see its entry in the Ship Roster for arcs, ranges, damage and mechanics. **Every ship weapon costs only 1 AP to fire**, reflecting the sheer power and resource surplus of a full warship's reactor compared to a single mobile suit — the real limiting factor on a ship's turn is its total AP pool, not individual weapon cost.

*(The generic Long-Range Beam / Turret / Double Beam Cannon loadout belonged to the retired generic Battle Ship and is no longer used.)*

**Weapon System Called Shots:** every weapon system listed in a class entry — Main Gun, Secondary Gun, Anti-Air Array, Missile Launchers / Missile Barrage, Anti-Ship Missile — has its own dedicated **20 HP pool** (roughly 4 standard Beam Rifle hits to destroy), separate from Hull/Thrusters/Bridge. A weapon system reduced to 0 is offline until repaired (see Damage Control). **Weapon systems can only be targeted via a genuine Called Shot** (standard +5 penalty) — they never appear on the random d10 Hit Location Table, since they're specific enough that a standard, uncalled shot wouldn't plausibly land on them by chance.

### Damage Control (Subsystem Repair)
A warship carries repair crews, so knocking out its subsystems is a **temporary disable rather than a permanent kill** — provided there are enough hands aboard to work on it.

**While Crew HP is 9 or higher:** any Thruster, Bridge, or weapon system reduced to 0 comes back online **after 2 full turns**, restored to its full HP pool. There are at least two squads' worth of crew aboard — one to actually run the ship, another free to handle damage control.

**At 8 Crew HP or below:** repairs stop entirely, and any subsystem knocked out from that point on stays down for the rest of the game. At 8 HP the ship is down to its **last squad**, and they're fully occupied crewing the Bridge just to keep the vessel functioning — nobody is left to run damage control. This is the same threshold as Last Stand Lockdown (below), so grinding a ship's garrison down past 8 has two consequences at once: the ship stops repairing itself, *and* it becomes vulnerable to being fully locked down by a boarding party.

**Hull damage never repairs.** Hull is the ship's structural integrity, not a system a crew can patch mid-battle — sustained fire on the Hull will still kill a warship outright regardless of how healthy its garrison is. This gives attackers two distinct approaches: grind the Hull down for a straight kill, or pick off subsystems to cripple the ship's output while a boarding party works on the crew.

### Ship Mobility
**AP and Movement per AP are set by class** — Musai 4 AP / 30cm · Salamis Kai 4 AP / 25cm · Rewloola 6 AP / 20cm · Ra Cailum 6 AP / 15cm (see the Ship Roster). Even spending every AP on movement, a warship covers only 90-120cm a turn, so crossing a standard 4-metre table takes roughly 3½ to 4½ turns — and that is the genuine floor, not the expected pace, since a ship spending all its AP running is giving up its entire offensive turn to do so. In normal play, a ship splitting AP between movement and its 1-AP weapons will cross the board slower than this, which is intended.

### Last Stand Lockdown
If a ship's total Crew HP is down to **8 or fewer** (its last full squad's worth of defenders) and an enemy squad successfully boards, the ship goes **fully inert** — no movement, no weapons fire, skips its own turn entirely — for as long as the boarding Firefight Clash remains unresolved. Every remaining crew member is fully committed to fighting off the boarders; there's no one left to actually crew the ship. The boarding fight itself still resolves as a completely standard Firefight Clash (Section 13) — this rule only adds the ship's own inert status on top. *(Table groups may adjust or drop this rule by mutual agreement if it doesn't fit a given scenario.)*



### Mobile Suit Carriers — Launching and Docking
Carrier-capable ships hold mobile suits aboard and deploy them mid-battle. Capacity and launch rate vary by class (see the Ship Roster).

**Launching.** Deploying a mobile suit from a carrier costs the **ship** 1 AP, not the suit — and that single AP covers the ship's **full per-turn launch capacity**, so a capital ship puts out two suits for the same 1 AP a cruiser spends on one. The launched suit arrives with its own AP completely intact and gains **Boost Stance movement for free** (+10cm per AP) **without Boost's usual no-attack restriction** — it is being thrown out of a catapult at speed, and can still fight the turn it deploys.

**Docking.** Recovery is deliberately slower and riskier than launching. A mobile suit must move **within 5cm of the ship model** and declare docking; the ship pays **1 AP**. The suit does *not* go aboard immediately.

Instead it remains on the board, exposed on the catapult deck, until **the opposing side's next turn has fully ended**. Only then is it safely aboard. That window is the whole point: docking cannot be used as an escape hatch, because committing to it hands the enemy an entire turn to act against a stationary target — shooting, closing to melee, or both.

**While docking, the suit:**
- **May Block and may attempt a Rolled Dodge** — it can still raise a shield or twist aside
- **May not use Free Dodges** — it is holding position on approach, not manoeuvring freely
- **Is cancelled out of the dock** if it takes a **Called Shot that lands on the body**, or is **attacked in melee**. The attempt fails, the ship's AP is spent regardless, and the suit stays on the board.
- **Is not cancelled** by ordinary uncalled fire, nor by a Called Shot that the shield Blocks or the suit Dodges. Disrupting a dock has to be a deliberate act, not a lucky graze.

If the carrier itself is destroyed during the docking window, the suit simply remains on the board — it never made it aboard.

**All warships share the Section 13.5 rules.** Every class in the roster uses the same underlying framework laid out above — Hull, Bridge, and Thruster hit locations, the d10 Hit Location Table, Called Shots on weapon systems, crew garrisons and boarding, **Damage Control**, and **Last Stand Lockdown**. What differs between classes is the numbers: hull strength, weapon loadout, garrison size, hangar capacity, and whether they carry a Base of Operations module at all.

**Deployment at game start.** A side that fields a carrier **must load it to capacity** before deploying anything on the board. Mobile suits fill the hangar first; only the remainder deploy normally at your board edge.

This means a large carrier can genuinely start the game with most or all of your force still aboard — a Ra Cailum with a six-suit army begins with nothing on the table and needs three turns to launch everything. That is the intended cost of the biggest hangar and the best repair module. The ship is not a passive container while this happens: it is a heavily armed combat unit in its own right, and its capital weapons are expected to cover for the suits still waiting on the catapults.

**Emergency Disembark — when a carrier is destroyed with suits aboard.** Mobile suits still in the hangar when the hull breaches must get clear on their own.

**Grunt-tier suits are destroyed automatically, with no roll.** Mass-production frames carry no escape system and no plot armour — loading cheap suits onto a carrier means accepting they go down with it. **Veteran/Custom Grunt tier and above** each roll **1d20**:

| d20 | Result |
|---|---|
| **1-3** | **Destroyed** — goes down with the ship |
| **4-8** | **Heavy damage** — ejects, taking **5 damage to every location** |
| **9-14** | **Light damage** — ejects, taking **3 damage to every location** |
| **15-20** | **Clean escape** — ejects unharmed |

Surviving suits are placed at the wreck's position and continue the game normally. Damage hits all six locations because a hangar breach engulfs the whole machine rather than striking one limb — a suit that rolls badly may well emerge with limbs already destroyed.

Roughly 15% of eligible suits are lost outright, 55% get out damaged, and 30% escape clean. That is deliberately kinder than the infantry equivalent aboard a Transport Ship, since a mobile suit represents a far larger share of a player's Deployment Points — but a Ra Cailum going down with six aboard is still a catastrophe worth avoiding.

### Transport Ship
The smaller support vessel that actually carries boarding squads to the target ship — durable and mobile, but purely a delivery platform with no offensive capability of its own. Small and maneuverable enough (unlike a full warship) to genuinely evade incoming fire.

| Stat | Value |
|---|---|
| AP | 3 |
| Movement | 20cm per AP |
| HP | 20 (flat pool, no Called Shot locations) |
| Rolled Dodge | Yes — standard mobile-suit-style Dodge |
| Weapons | None |
| Capacity | Carries 2 Infantry Squads. Safe and non-targetable while aboard — if the Transport Ship is destroyed with squads still inside, they get an **Emergency Disembark Roll** (see Section 13.7). |

*Targetability by mobile suits follows the same proximity-based rule as every other ground unit — see **Ground Unit Targeting**, Section 13.7. Transport Ship's own radius is 60cm.*

**Disembarking:** squads may disembark at any point — including mid-space, before actually reaching the target ship — and continue independently using their own standard Overmap stats (Infantry Squad, Section 13: 3 AP, 10cm per AP). A real decision point if the Transport Ship looks like it's about to go down: bail early and cross the remaining distance under their own power, or stay aboard and risk the whole squad if it's destroyed.

## 13.6 DETAILED BATTLE MAP (Individual Soldier Scale)

An alternative to abstracted Firefight Clash (Section 13) — a genuine scaled tactical mini-battle using individual soldier models, printed terrain, and real movement/cover, for players who want to physically play out a squad engagement rather than resolve it through dice pools. Only one Detailed Battle Map can be active at a time; it runs concurrently with the main mobile suit turn structure, adding its own Ground Battle Phase to the turn sequence (Section 6.1).

**A deliberate pacing difference:** Quick Resolve compresses 4 rounds of fighting into a single roll at the end of the turn, while the Detailed Battle Map spends a full turn on one round of soldier actions — so the same engagement takes roughly four times as many board turns to resolve here. That's intentional, not an oversight. Quick Resolve is meant to be fast and relatively insulated from outside interference; a Detailed Battle Map engagement is a longer, bloodier affair that stays open to reinforcements arriving, mobile suits repositioning, and support fire landing mid-fight. Choosing between the two systems is partly a choice about how exposed you want the fight to be.

### Map & Conversion
Two standard map sizes, chosen based on the scenario:

| Map Size | Use Case |
|---|---|
| **60x60cm** | Standard building interior, small room, tight urban engagement |
| **1x1m** | Large interior spaces — ship decks, hangars, bigger structures |

Each Infantry Squad fields **8 individual soldier models**. Casualties on the Detailed Map convert 1:1 back to the abstract Squad Health on the main board — losing 3 soldiers in the detailed fight drops that squad's overmap marker to 5 HP, no separate calculation needed.

**Weapon Range Cap:** Rifle, Machine Gun, SMG, and Pistol are all capped at **60cm range**. Sniper Rifle keeps its own existing 30cm+ minimum-range requirement, with no upper limit — making it the only weapon capable of reaching the far corners of a 1x1m map, a genuine reason to field one specifically for larger engagements.

### Individual Soldier — Base Stats
| Stat | Value |
|---|---|
| AP | 3 |
| HP | 6 |
| Kevlar | 6 (separate pool — see below) |
| Movement | 10cm per AP |
| Free Dodges | 0 |
| Rolled Dodges | **None against standard weapon fire** — Cover is the only defense against bullets at this scale. **4+ on 1d6 against AoE/blast weapons**, except the Rocket Launcher and Bombing Run which remain undodgeable (see below). |

**Rolled Dodge on the Detailed Battle Map — 4+ on 1d6.** Soldiers cannot dodge bullets at this scale, but they *can* throw themselves clear of a blast. **Any soldier caught inside an area-of-effect attack may roll 1d6, succeeding on a 4+ to avoid it entirely.** This covers Grenades, Strafe Runs, the Tank Main Cannon and Hull-strike AoEs. It is the same threshold as the Kevlar save, so there is only one number to remember for a soldier's defensive rolls.

**The two scarce ordnance types are the exception and remain undodgeable: the Rocket Launcher (2 per Armor Unit) and the Bombing Run (2 charges per Jet).** Scarcity buys lethality — a weapon a player only gets twice in the whole game lands when it is aimed, and that is precisely what makes spending one a real decision. Everything a squad can expect to face repeatedly gives them their roll.

**This rule is specific to ground squads on the Detailed Battle Map.** It does not change anything on the Overmap, where mobile suits and ground units alike use their normal Overmap defences — Free Dodges and the d20 range table for mobile suits, the per-unit Rolled Dodge thresholds for ground units (Section 13.7).

The roll represents diving for whatever cover is available rather than reacting to the munition itself, which is why it applies to sustained and repeatable ordnance but not to the two weapons a player has only two of. Note also that **Grenades damage vehicle Armor just as Rockets do** (see Ground Battle Stats).

**Kevlar.** Every soldier wears a vest with its own **6 HP pool**, tracked separately from their Health. Whenever a **regular hit** lands (a 3-5 on a weapon's dice — 1 damage), roll **1d6**: on a **4+** the round is stopped by the vest and the damage comes off Kevlar instead of the soldier's HP. On a 1-3 it punches through as normal.

**Critical hits ignore Kevlar entirely.** A natural 6 represents a round finding a gap in the plate, a headshot, or clean flesh — there is no save roll, and the 2 damage goes straight to HP. The same applies to **Sniper fire, Grenades, Rockets, and vehicle cannons**: a vest doesn't stop a high-velocity rifle round or an explosion, so none of those allow a Kevlar save.

Once Kevlar reaches 0 the vest is spent and every subsequent hit goes straight to HP. In practice it drains slowly — only ordinary small-arms hits ever touch it, and only half of those — so a soldier will usually die before their vest does. That's intended: Kevlar is a matter of luck on any given round, not a second health bar to grind through.

### Squad Composition (8 soldiers)
| Role | Count | Weapon | AP | Range | Hit Threshold | Damage |
|---|---|---|---|---|---|---|
| Rifleman | 3 | Rifle, 3d6 | 1 | 60cm | 3+ | 1 dmg (2 on a 6, critical) |
| Machine Gunner | 1 | Machine Gun, 8d6 (+ Grenade) | 2 | 60cm | 4+ | 1 dmg (2 on a 6, critical) |
| Sniper | 1 | Sniper Rifle, 1d6 | 2 | 30cm+ required | 3+ hit, 5+ crit | 4 dmg normal, 8 dmg critical |
| Sniper (backup) | — | Pistol, 2d6 (switching Sniper Rifle ⇄ Pistol costs 1 AP) | 1 | Under 30cm only | 3+ | 1 dmg (2 on a 6, critical) |
| Armor Unit | 1 | Riot Shield (3 Armor + 6 HP), Rocket Launcher | 2 (Rocket) | 60cm (Rocket) | — (10cm AoE) | 3 to everyone inside (Rocket) |
| Shield Unit | 1 | Riot Shield (3 Armor + 6 HP), SMG 3d6, Flashbang | 1 | 60cm | 4+ | 1 dmg (2 on a 6, critical) |
| Recon | 1 | SMG, 3d6 (+ Smoke Grenade) | 1 | 60cm | 4+ | 1 dmg (2 on a 6, critical) |

**Armor Unit** carries a **Riot Shield (3 Armor + 6 HP)** and passively protects any ally standing behind him relative to the shooter's actual firing angle — a genuine line-of-sight check, no distance cap and no facing requirement on Armor Unit's own part. If Armor Unit is physically standing between an attacker and an ally, that ally is protected, regardless of formation or how many allies are lined up behind him. Free, passive, no roll needed — incoming attacks on a protected ally are absorbed by the Riot Shield instead. Armor Unit is also **immune to melee attacks** (stab-proof vest), including Recon's Knife Takedown. Only 1 Armor Unit per squad.

**Shield Unit** carries an identical **Riot Shield (3 Armor + 6 HP)** and provides the same line-of-sight protection, but is a genuinely different specialist: they carry an **SMG** and **Flashbang x2** instead of a Rocket Launcher, and they have **no stab-proof vest** — meaning they *are* vulnerable to melee, including Recon's Knife Takedown. Only 1 Shield Unit per squad.

A squad therefore fields **two shields**, which is what makes the shield wall genuinely workable: one alone can only ever cover a single firing angle, leaving the formation open to flanking. Two lets a squad cover a front and a flank simultaneously. Note that only the Armor Unit is melee-immune, so an enemy Recon can still knife the Shield Unit — sending your Armor Unit off to hunt Recon leaves the Shield Unit as the vulnerable one.

**The Riot Shield as mobile cover.** The shield is deliberately built to function as a portable wall a squad can advance behind. Its **3 Armor follows the standard vehicle Armor rule** (Section 13.7): standard individual weapons — Rifle, Machine Gun, SMG, Pistol, Sniper — cannot damage the Armor at all. Only **Grenade and Rocket Launcher** can strip it. Once Armor reaches 0, the 6 HP underneath is exposed to any weapon normally.

Because the shield physically blocks the firing lane, a **Grenade or Rocket thrown at the shield from the front cannot get past it** — the blast is absorbed entirely and nobody in the formation behind takes damage. But a single 3-damage blast strips all 3 Armor exactly, leaving the shield's 6 HP open to ordinary gunfire from that point on. A well-coordinated attacker can exploit this with a **double grenade attack**: the first strips the Armor, the second lands while the shield is vulnerable.

**Flanking beats the shield.** The shield only ever covers the angle it's actually facing. A Grenade or Rocket thrown at the squad's **flank or rear** bypasses the shield completely and lands among the formation — there's no time to turn and intercept it. This makes the shield wall genuinely strong from the front and genuinely vulnerable from the side, so a squad advancing behind one has to watch its angles rather than simply pointing the shield at the nearest enemy.

Note the natural counterplay loop: the shield encourages a tight formation, and tight formations are ideal targets for the same 10cm-radius AoE weapons that break the shield. Grenades spent on a shield wall are never wasted.

**Recon** may spend 1 AP to equip a Knife. If an enemy triggers Recon's Stealth reveal (see below) while the Knife is equipped, Recon may attempt a **melee takedown**: roll **3+ on 1d6** to succeed. On a failure, the target "dodges" and may now act freely against the revealed Recon (this attempt forces the reveal either way, win or lose).

### Recon Stealth (Detailed Map)
Rescaled from Section 9.6's full Stealth Stance for the smaller map. While active, Recon's physical model is replaced by a **marker**, always visible to both players. **Detection radius: 10cm** — an enemy soldier entering this radius forces a reveal. Firing the SMG also forces a reveal, same as any weapon.

### Squad Items
All thrown items share a **20cm maximum throw range**. **Throwing an item costs 1 AP** (Grenade, Flashbang, Smoke Grenade) and does not require switching weapons — the item is thrown straight from the soldier's kit. **Firing the Rocket Launcher costs 2 AP**, and it must be the equipped weapon (see weapon switching below).

| Item | Holder | Charges | Range/Radius | Effect |
|---|---|---|---|---|
| Grenade | Machine Gunner | 2 | 20cm throw, 10cm radius | 3 damage to everyone caught inside (friend or foe) — **Rolled Dodge 4+ on 1d6** to avoid |
| Rocket Launcher | Armor Unit | 2 | 60cm range, 10cm radius | 3 damage to everyone caught inside (friend or foe), **no Dodge — only 2 per Armor Unit**, armor-piercing (see Tank Armor below) |
| Flashbang | Shield Unit | 2 | 20cm throw, 10cm radius | Every soldier caught inside must choose: **turn away** (free, avoids the flash, exposes their back — cannot fire outside their new facing arc until turning back) or **arm-block** (free reaction, roll 4+ on a d6; success avoids it with facing intact, failure = blinded: cannot fire at all and loses Rolled Dodge access until their next full turn) |
| Smoke Grenade | Recon | 2 | 20cm throw, 15cm radius | Anyone shooting into or through the cloud needs a natural 6 to hit, regardless of weapon or normal threshold |

**Switching weapons always costs 1 AP.** A soldier carrying more than one weapon has only one equipped at a time: the Sniper switches between Sniper Rifle and Pistol, Recon between SMG and Knife (equipping the Knife is this same 1 AP switch), Armor Unit between Riot Shield and Rocket Launcher, and Shield Unit between Riot Shield and SMG. Armor Unit may spend 1 AP to switch between their Riot Shield and Rocket Launcher mid-game — carrying both, but only able to have one equipped at a time. Shield Unit may likewise spend 1 AP to switch between their Riot Shield and SMG.

**Item Charges Only Refill By Resupply:** item charges are **never** restored by a fight ending or a new fight beginning. A squad keeps whatever it has left for the rest of the battle. The one way to restock is **resupply from a transport**: the squad boards a vehicle that can carry squads (Car, Helicopter, Transport Ship) and stays aboard for a **full turn**, after which its charges return to 2 Flashbangs / 1 Smoke Grenade / 1 Grenade. Boarding and disembarking in the same turn does nothing. This makes holding a Flashbang back to deny an extraction, or Smoke Grenades back to cover an extraction, a real decision — and pulling a spent squad back to its transport a real cost in time and position.

**Tank Armor:** vehicles like Tank (below) have genuine armor plating that small arms fire simply can't penetrate — **immune to all standard individual weapons** (Rifle, Machine Gun, SMG, Pistol, Sniper). Only **Grenade** and **Rocket Launcher** can damage a Tank.

### Detailed Map Stances
Rescaled versions of Section 9's Stances, adapted for the smaller board and the no-Dodge-against-bullets rule above.

**Overwatch:** 1 AP, watch a 10cm-wide line. Free reaction attack if an enemy walks through it before your next turn.

**Peek and Shoot:** requires Cover, costs the weapon's own normal AP. The peeking soldier's shot gets **-1 to its normal hit threshold** (e.g., Rifle's 3+ becomes 2+ for this shot only), representing the brief, prepared aimed exposure. **Return fire** (only if the target was facing the peeking soldier) is a free reaction, but every die needs **+1 to its normal hit threshold** instead (e.g., Rifle's 3+ becomes 4+). For Sniper specifically: peeking shifts both thresholds down by 1 (hit becomes 2+, critical becomes 4+); return fire shifts both up by 1 (hit becomes 4+, critical becomes 6+).

**Defense Stance:** free, declared at the end of a turn, active until the soldier's own next turn. Protects any ally within **10cm** — the protecting soldier may intercept an attack aimed at that ally, taking the hit directly instead (no Dodge existed to lose at this scale in the first place; Block is still available if the interceptor has a Shield — Armor Unit only).

## 13.7 GROUND VEHICLES, BUILDINGS & OVERMAP GROUND RULES

**Terminology used throughout this section:** **Overmap** = the main mobile suit board. **Ground Battle** = the Detailed Battle Map mini-battle (Section 13.6). **Ground Unit** = an individual soldier/squad member. **Ground Vehicle** = Tank or Car.

### Ground Battle Stats
Vehicles fielded on the Detailed Battle Map use a two-stage **Armor / HP** system: standard individual weapons (Rifle, Machine Gun, SMG, Pistol, Sniper) cannot damage a vehicle's Armor pool at all — only **Grenade** and **Rocket Launcher** can. Once Armor reaches 0, the vehicle's remaining HP is exposed to any weapon, including small arms.

**Vehicle-mounted Machine Guns are more accurate than a soldier's own** — 3+ to hit instead of the individual Machine Gunner's 4+, representing a stable mounted platform. Like every other individual weapon, they **cannot damage a vehicle's Armor pool at all** — only Grenade and Rocket Launcher can break Armor down. Once a vehicle's Armor reaches 0, its 50 Cal Machine Gun (like any other weapon) can freely damage the exposed HP pool underneath.

**Tank (Grunt-tier)**
A genuine combat vehicle — armored, slow, hits hard. Cannot transport a squad, but may carry the mission objective itself (e.g., the person/item being secured in a boarding scenario).

| Stat | Value |
|---|---|
| AP | 4 |
| Armor | 6 |
| HP | 18 |
| Movement | 15cm per AP |

**Weapons:**
| Weapon | AP | Range | Effect |
|---|---|---|---|
| Main Cannon | 2 | 10cm radius AoE | **6 damage** — enough to kill any soldier outright, and Kevlar grants no save against a vehicle cannon. **Rolled Dodge 4+ (1d6)**, 1 turn cooldown after firing |
| Machine Gun | 1 | 60cm | 8d6, 3+ hit, 1 dmg (2 on a 6, critical) |

**Car (Grunt-tier)**
A lighter transport vehicle — faster than Tank, less armored, and built to move a squad rather than fight independently.

| Stat | Value |
|---|---|
| AP | 3 |
| Armor | 3 |
| HP | 8 |
| Movement | 25cm per AP |
| Crew | Carries one full Infantry Squad. The squad is **safe and non-targetable** while aboard — if the Car is destroyed while they're still inside, they get an **Emergency Disembark Roll** (see below). Disembarking voluntarily beforehand is still far safer. |

**Weapons:**
| Weapon | AP | Range | Effect |
|---|---|---|---|
| Machine Gun | 1 | 60cm | 8d6, 3+ hit, 1 dmg (2 on a 6, critical) |

### Overmap Stats
Ground Vehicles can also be fielded directly on the main mobile suit board — genuinely different numbers from their Ground Battle versions, scaled to survive against (and meaningfully threaten) mobile suit weaponry.

| Vehicle | HP |
|---|---|
| Tank | **18** (~4 standard Beam Rifle hits to destroy) |
| Car | **8** (~2 standard Beam Rifle hits to destroy) |

No separate Armor stage on the Overmap — mobile suit weapons simply eat through a Ground Vehicle's flat HP directly, the same as any other Grunt-tier target.

**Fire Support — the Tank's standard Overmap attack.** Ground Vehicles don't track individual weapons at this scale. The Tank simply makes a **Fire Support** strike, an abstracted bombardment using whatever it has, rolled on the standard range-based to-hit table (Section 3.1) — exactly as the aircraft make an Air Support run.

**Fire Support: 2 AP, 60cm, 10cm radius.** Rolled on the standard range-based to-hit table. Everything caught inside the radius is a valid target — **friend or foe** — so a Tank firing into a melee will hit its own side just as readily. Its effect depends entirely on what it hits:

| Target | Effect |
|---|---|
| **Infantry Squad** | **Squad Splash Table** (Section 13) — roll a d10 for casualties |
| **Ground vehicle** (Tank, Car, Transport Ship) | **6 damage** — the Tank switches to its Main Cannon's armour-piercing round |
| **Mobile suit** | **2 damage to all 6 locations simultaneously** |
| **Aircraft** (Jet, Helicopter) | **Cannot be targeted at all.** A Tank's cannon is direct-fire and cannot elevate to engage an airborne target — aircraft are simply not valid targets for Fire Support, and are unaffected even if they sit inside the radius |

**The 6-damage anti-armour round is the whole point of fielding a Tank against another Tank.** At 18 HP a Tank dies to three hits and a Car to two, which makes armoured engagements genuinely decisive rather than a long grind.

**Those same rounds are poorly suited to mobile suits.** They are designed to punch through vehicle armour at a fixed point, not to meaningfully damage a machine that size — hence only 2 damage, spread across every location rather than concentrated. A Tank contributes to a fight against a mobile suit; it does not win one.

**A Tank has no answer to aircraft whatsoever.** Fire Support cannot target them, and the Tank carries nothing else on the Overmap. Anti-air is an **Infantry Squad's** job — the Armor Unit's Rocket Launcher is the dedicated tool (Section 13.7) — so a Tank pushed forward without infantry cover is entirely defenceless against a Jet or Helicopter working it over.

**The Car has no Overmap attack of its own.** It is a transport, not a fighting vehicle. A squad riding inside may still make its own **Coordinated Strike** out from the vehicle, but that is the squad’s action and uses the squad’s stats, not the Car’s.

Fire Support is the only thing a Ground Vehicle has that genuinely threatens a mobile suit, and 2 damage is deliberately modest — it will never kill anything on its own. What makes it worth fielding is that it spreads across every location rather than concentrating, so it chips away at the arms and legs a suit actually needs rather than politely hitting the Chest, and the 10cm radius punishes suits that cluster. Two Tanks working the same area for a few turns strip a surprising amount of Limb Health. The 60cm range is the real constraint: a Tank has to sit well inside a mobile suit's comfortable engagement band to contribute at all, and with no Rolled Dodge and no Armor at this scale, that is a genuinely dangerous place for it to be.

**Aircraft.** Both aircraft are ground-support units, and drop the Armor stage on the Overmap exactly as Tank and Car do.

| Unit | AP | HP | Movement | Crew |
|---|---|---|---|---|
| **Jet** | 4 | 3 | 50cm per AP | None |
| **Helicopter** | 3 | 6 | 35cm per AP | Carries one full Infantry Squad, with the same **Emergency Disembark Roll** on destruction as a Car |

**Air Support — the aircraft's standard Overmap attack.** Neither aircraft tracks individual weapons at this scale; both simply make an **Air Support** run, an abstracted strike using whatever ordnance is appropriate, rolled on the standard range-based table (Section 3.1).

| Attack | AP | Effect |
|---|---|---|
| **Air Support** | 2 | **3 damage** in an AoE — 10cm radius (Jet) or 15cm radius (Helicopter). **Overmap attack:** mobile suits get no Dodge against it; ground units use their normal Overmap Rolled Dodge threshold (Section 13.7). **Unlimited uses.** The Jet's run is armour-piercing. |

This is what aircraft use against anything on the Overmap itself — mobile suits, vehicles, or squads that aren't currently locked in a ground engagement.

**Bombing Run & Strafe Run — how aircraft fight.** Aircraft never appear on the Detailed Battle Map; they stay on the Overmap and call their ordnance in. The aircraft flies into range of an active ground engagement and spends **2 AP**, which does no damage directly — instead it **grants 1 charge** to that engagement. The ground player may then place the resulting AoE on the battlefield at any point, **spending no AP of their own**. An aircraft can only grant one charge per turn, so banking a full stock takes several passes.

| Aircraft | Ability | Shape | Damage | Max Charges | Dodge |
|---|---|---|---|---|---|
| **Jet** | **Bombing Run** | 10cm radius circle | **6** | 2 | **None** — armour-piercing |
| **Helicopter** | **Strafe Run** | 20cm x 10cm rectangle | **4** | 4 | **Rolled Dodge 4+ (1d6)** |

The two play very differently. A **Bombing Run** is precise and unavoidable — 6 damage kills any soldier outright, there is no Kevlar save and **no Rolled Dodge either**, and being armour-piercing it strips a Tank's entire 6 Armor in a single pass. With only 2 charges it is a scarce, decisive tool, and that scarcity is exactly what earns it the right to be undodgeable.

A **Strafe Run** sweeps a lane rather than a point, catching soldiers strung out in a line where a circle would miss them. At 4 damage it won't reliably kill a full-health soldier, it isn't armour-piercing, and targets caught inside may attempt a **Rolled Dodge 4+** — but with 4 charges it's the sustained-pressure option. The trade is exact: the Jet's two passes always land, the Helicopter's four can be evaded.

**In Quick Resolve (Firefight Clash)** there is no map to place a template on, so a charge is instead resolved on the **Squad Splash Table** (Section 13): d10, 1-3 = 1 casualty, 4-6 = 2, 7-8 = 3, 9 = 4, 10 = 5.

**Anti-Air Retaliation.** Calling in a strike exposes the aircraft. Immediately after a Bombing Run or Strafe Run resolves, the squad that was hit may **spend one Rocket Launcher charge** to fire back at the departing aircraft, rolling to hit on **1d6** for the Rocket's standard **3 damage** — the threshold depends on range (see below).

This works at **both scales**. On the Detailed Battle Map it resolves immediately, as the aircraft pulls away. In **Quick Resolve**, where combat is abstracted into 4-round segments, the retaliation is taken **in the break between segments**, as a reaction to the strike that just landed — a squad pinned in a firefight still has a moment after the bombs fall to put a rocket up at whatever dropped them.

**Squads may also fire at aircraft proactively.** A Rocket charge can be spent at any aircraft in range without waiting to be bombed first.

**The roll uses the standard d6 range bands** (Section 8) — the same table Funnels, Burst Fire, and Spray and Pray use. Roll 1d6 and check whether that face reaches the aircraft's actual distance: a **2** only reaches under 30cm, a **3** reaches 60cm, a **4** reaches 90cm, and a **5 or 6** reaches anything out to 120cm. A plane that lingers over the target, or one that spent its movement getting into position, is therefore a far easier shot than one streaking away.

**100cm is the outer limit for the launcher itself**, and that number is deliberate. A **Jet** has 4 AP at 50cm each; spending 2 on its Bombing Run leaves exactly **100cm** of escape, so a Jet that commits everything to fleeing still ends on the very edge of the bubble and faces one shot at 5+. Spend that movement on anything else and it sits closer, in a worse band. A **Helicopter** has only 1 AP left after a Strafe Run — 35cm — so it is stuck in the 30-60cm band at 50%, which is exactly right: helicopters loiter, jets streak past.

**Why the launcher is visually guided.** Minovsky particle saturation blinds any radar-homing seeker head, so what a squad actually carries is an optically-tracked launcher — the gunner holds the sight on the aircraft and walks the round in by eye. That is why range matters so steeply here: under 30cm the aircraft fills the sight, while at 100cm it is a speck against the sky. It is also why there is no reroll. You get one chance to track something moving at 50cm per AP.

Either way it costs the same scarce resource. Every rocket spent on aircraft is one unavailable for enemy armour, and a squad only carries two.

A **Jet has only 3 HP**, so a single connecting rocket destroys it outright. A **Helicopter has 6 HP** and needs two. At a 33% hit chance and only two rockets in a squad's stock, downing an aircraft is a genuine gamble rather than a reliable answer — but it means air support is never free. Every strike risks the aircraft, and every retaliation costs the squad ordnance it might have wanted for the enemy's armour.

With only 3 HP and no Armor at all, a Jet dies to almost anything that connects — the price of being the fastest thing on the board.

---

### Ground Unit Targeting
**All ground units are untargetable by mobile suits by default.** A unit becomes targetable only while an enemy mobile suit sits inside that unit's own **proximity radius** — proximity alone is enough, the mobile suit does not need to have fired.

| Unit | Proximity Radius |
|---|---|
| Infantry Squad | 20cm |
| Car | 30cm |
| Jet | 30cm |
| Tank | 40cm |
| Helicopter | 40cm |
| Transport Ship | 60cm |

**Rolled Dodge by unit.** Once targetable, a ground unit defends with a Rolled Dodge, available against **every** incoming attack with **no limit per turn** — five attacks in a turn means five dodge rolls — and against any attacker, not just mobile suits.

| Unit | Threshold |
|---|---|
| Infantry Squad | 10+ |
| Jet | 10+ |
| Car | 12+ |
| Helicopter | 14+ |
| Transport Ship | 14+ |
| **Tank** | **None** — its HP is its defence |

The attacker rolls normally on the standard range-based table (Section 3.1), so distance genuinely matters: a mobile suit at 120cm+ lands roughly one shot in fifteen against a dodging squad, while closing under 30cm brings that to about one in three.

**Vulcans cannot be dodged** — 1 guaranteed casualty per hit, no roll. At 1 AP a shot, that makes them the dedicated anti-infantry weapon, and a mobile suit that commits to it can fire four times in a turn.

### Hide Stance (Infantry Squads only)
**Free to declare on your own turn.** Only Infantry Squads can Hide — Tanks, Cars, Helicopters, Jets and Transport Ships cannot; vehicles use Boost Stance instead (Section 9.4). While in Hide Stance:

- **Movement** is halved for the turn
- **Cannot attack at all**
- **Completely untargetable by mobile suits** for the turn, regardless of proximity

**It does not protect against other ground units.** Enemy Coordinated Strikes, Tank cannons, and Firefight Clash all still hit normally — hiding from a mobile suit's sensors is a different problem from hiding from infantry at ground level.

### Comm Array (Building)
**Two per side, placed during setup.** They feed targeting data to friendly mobile suits.

- **At least one standing:** normal proximity targeting applies.
- **Both destroyed — 2-turn blackout:** that side's ground units become targetable only if a mobile suit is inside the radius **and** the unit fired that turn. A silent unit cannot be targeted at all.

### Emergency Disembark Roll
When a squad-carrying vehicle is destroyed with soldiers still aboard — Car, Transport Ship, or a warship's crew — roll **1d6 per living soldier**:

- **4+** — bails out and survives.
- **1-3** — perishes with the vehicle.

**On the Overmap:** subtract the failures from Squad Health and place the marker at the wreck. **On the Detailed Map:** remove the failed models and place the survivors at the wreck.

---

## 14. PRE-GAME SETUP GUIDE
A step-by-step walkthrough for starting a game, from choosing sides through to army building. More steps get added here as they're agreed on.

**Step 1 — Side Selection:** Both players roll a d20. Whoever rolls higher chooses which side they play this game — **Federation** (and adjacent Earth-aligned organizations) or **Spacenoid** (Zeon, Neo Zeon, and other space-based factions).

**Step 2 — Choose Your Format:** Decide between two ways to structure the game itself:
- **Gamemode-Based:** Play a standardized format with a fixed win condition (Deathmatch, King of the Hill, Capture the Flag, or an Objective from Section 12 used as a bonus). Quick to set up, no narrative required. See Section 15.1 for the full breakdown of standard Gamemodes.
- **Scenario-Based (Dynamic):** The player who won the Step 1 dice roll chooses a scenario premise for the game — a loose narrative frame for that session — and both players craft objectives together that fit it, rather than pulling from the standard list. See Section 15.2 for example scenario premises and Section 15.3 for a worked multi-game Campaign Chain example.

**Step 3 — Agree on Main Objective and Sub-Objectives:** With a scenario chosen, both players agree on:
- **The Main Objective** — the primary win condition, custom-built to fit the scenario premise (e.g., for "Rescue the Princess," the Main Objective might be extracting her from the board before the enemy captures her).
- **Sub-Objectives** — usually pulled directly from the standard list (Section 12), layered on top of the Main Objective as additional GP-earning tasks along the way, rather than being the primary win condition themselves.

**Step 4 — Set Up the Battle Zone:** Both players agree on the board/map size and zone setting.
- **Scenario-Based:** the zone setting is usually chosen to match the scenario premise from Step 2-3 (e.g., open space, a ground battlefield, a colony city interior), so it reinforces the narrative.
- **Gamemode-Based:** there's no scenario to anchor the setting, so map/zone choice is entirely up to the players' preference — pick whatever's convenient or fun. This is generally why Gamemode-Based games tend to run faster overall, since there's no narrative setup discussion needed at this step.

The zone setting can also inform terrain placement and any environmental considerations your group wants to add on top of the base rules.

**Step 5 — Agree on Deployment Points:** Both players agree on the total Deployment Points (DP) for the game (Section 10). Army lists aren't built yet at this stage — just the total budget. Note that ground units and vehicles cost no DP at all; they're limited by the deployment caps in Section 13 instead, so the DP total covers mobile suits and any warships only.

**Step 6 — Build Your Army:** Now that the DP total, format, objectives, and battle zone are all known, each player builds their army list up to the agreed DP total, using whatever units are actually available to them — whether that's a shared stock pool of kits, or each player supplying their own personal collection, depending on how your group is set up. Building after the terrain is known is deliberate — knowing you're headed into a city, for example, might mean bringing more Bazookas or Beam weapons to deal with cover, while an open-field map might favor a leaner, faster loadout.

**Step 7 — Deploy Units:** Both players position their units on their respective edges of the board, ready to begin.

**Step 8 — Roll Initiative:** Follow Section 6 (Combat Sequence) to determine turn order for the game.

---

## 15. GAMEMODE & SCENARIO REFERENCE
Detailed reference material for Step 3 of the Pre-Game Setup Guide (Section 14) — the full Gamemode breakdown, example Scenario premises, and a worked Campaign Chain example.

### 15.1 Standard Gamemodes
- **Deathmatch (Skirmish):** No objectives at all — pure elimination, whoever wipes out the other side wins.
- **King of the Hill:** Win condition is holding a designated point on the board, using the Hold the Line/Hold with Steel mechanics (Section 12) as the actual victory condition rather than just a GP bonus — first side to hold it for the agreed number of consecutive rounds wins outright.
- **Capture the Flag:** Win condition is capturing a designated enemy unit and getting it back to your own board edge, using the Capture Alive/Full Capture mechanics (Section 12) as the actual victory condition rather than a GP bonus.
- Any Objective from the standard list (Section 12) can also just be played as a GP-earning bonus layered on top of Deathmatch, rather than a full win condition, if you'd rather keep elimination as the primary path to victory.

### 15.2 Example Scenario Premises
Objectives under a Scenario are custom-built around the premise rather than using the standard 2/4/6 GP tiers directly — though you can still borrow those reward values as a starting point when inventing new objectives to fit the story.

**Federation-Flavored**
- **Operation Odessa Echo:** Liberate a colony/territory currently under Zeon occupation — Federation forces push in to retake it.
- **Convoy Escort:** Get a civilian evacuation convoy safely off the board while Zeon raiders try to intercept it.
- **Recovery Op:** A captured Federation prototype (data, parts, or the unit itself) is being held at a Zeon-controlled site — extract it before it's moved or destroyed.

**Spacenoid-Flavored**
- **Sabotage the Grid:** Cripple a Federation colony's solar power/life-support generator to weaken their war effort, rather than fighting a straightforward battle.
- **Ambush the Convoy:** A Zeon remnant cell stages a guerrilla strike on a Federation supply line — hit hard and fast rather than holding ground.
- **Secure the Cache:** A hidden stockpile of Zeon resources (Minovsky particle generators, salvaged tech) needs to be recovered before Federation forces locate it first.

### 15.3 Campaign Chains
Scenario-Based games don't have to be one-offs — a group can link several sessions together, where the outcome of one game directly shapes the premise of the next. GP and Pilot Progression (Section 11.6) already carry over between games, making this a natural extension rather than a separate system.

A full worked example of a branching, multi-game campaign — **"The Minister's Gambit"** — is available as a standalone document, since a full campaign tree gets long fast and doesn't need to clutter the core rules. It shows how a chain can fork differently depending on who wins each game, with several games and branches mapped out as a template for building your own.

---

## APPENDIX A: BUILT UNIT ROSTER

**Every unit below has a complete stat block** in `Gunpla_Unit_Stat_Blocks.md` — full Limb Health, weapons, abilities, and an itemized DP breakdown. DP values here are the final, authoritative costs taken directly from those stat blocks.

**Legend:** 🛡️ = Named "Gundam" (subject to the 1000+ Floor, Section 10) · 👑 = Main-antagonist flagship (subject to the 1000+ Floor) · **Free Dodges (2/turn) apply to any unit costing 1000+ DP**, regardless of tags — check DP cost, not tags.

### Grunt (500)
| Unit | DP |
|---|---|
| GM (RGM-79, Origin) | 500 |
| Zaku II (MS-06) | 500 |

### Veteran / Custom Grunt (600-750)
| Unit | DP |
|---|---|
| Gouf (MS-07B) | 600 |
| Blue Destiny Unit 1 (RX-79BD-1) | 650 |
| Jesta (RGM-96X) | 650 |
| Rick Dom (MS-09R) | 650 |
| RX-79[G]SW Slave Wraith | 650 |
| Zaku I Sniper Type (MS-05L) | 675 |
| Geara Zulu (AMS-129) | 700 |
| GM Sniper II (RGM-79SP) | 750 |

### Flagship (1000-1300)
| Unit | DP |
|---|---|
| Gundam EX 🛡️ | 1000 |
| Gundam Mk-II (RX-178) 🛡️ | 1000 |
| RX-78-2 Gundam 🛡️ | 1000 |
| Gundam Astray Red Frame [Flight Unit] (MBF-P02) 🛡️ | 1200 |
| MBF-02 Strike Rouge 🛡️ | 1300 |
| RX-78XX Gundam Pixy 🛡️ | 1300 |

### Super Flagship (1400-1950)
| Unit | DP |
|---|---|
| MSN-00100 Hyaku Shiki | 1400 |
| RX-80PR Pale Rider | 1450 |
| Gundam Jiyan Altron 🛡️ | 1700 |
| RX-78GP01Fb Gundam "Zephyranthes" Full Burnern 🛡️ | 1700 |
| RX-78GP02A Gundam "Physalis" 🛡️ | 1900 |
| Rozen Zulu (YAMS-132) | 1950 |

### Superweapon (2070-2900)
| Unit | DP |
|---|---|
| Sinanju Stein (MSN-06S-2) | 2070 |
| AC Nightfall *(Armored Core VI crossover)* | 2120 |
| RX-9/C Narrative Gundam C-Packs 🛡️ | 2200 |
| Sinanju (MSN-06S) 👑 | 2200 |
| ASW-G-XX Gundam Vidar 🛡️ | 2250 |
| Kshatriya (NZ-666) 👑 | 2275 |
| Delta Zayin (DZ-001) | 2400 |
| GF13-001NHII Master Gundam 🛡️👑 | 2400 |
| Gundam F91 🛡️ | 2450 |
| Infinite Justice Gundam (ZGMF-X19A) 🛡️ | 2500 |
| Nu Gundam (RX-93) 🛡️ | 2530 |
| Sazabi (MSN-04) 👑 | 2550 |
| Sinanju Zero (MSN-06S Custom) 👑 | 2650 |
| GN-001 Gundam Exia 🛡️ | 2685 |
| Rising Freedom Gundam (STTS-909) 🛡️ | 2700 |
| Strike Freedom Gundam (ZGMF-X20A) 🛡️ | 2800 |
| Unicorn Gundam 02 Banshee Norn (RX-0[N]) 🛡️ | 2900 |

### Myth (3000-3350)
| Unit | DP |
|---|---|
| OZ-13MS Gundam Epyon 🛡️ | 3000 |
| RX-97-NH Gundam Night Hawk 🛡️ | 3000 |
| Unicorn Gundam 03 Phenex (RX-0[N]) 🛡️ | 3000 |
| Unicorn Gundam [Luminous Crystal Body] 🛡️ | 3000 |
| Wing Zero (XXXG-00W0) 🛡️ | 3000 |
| Wing Zero Custom (XXXG-00W0) 🛡️ | 3000 |
| Xi Gundam (Ξ Gundam) 🛡️ | 3000 |
| ZGMF-X42S Destiny Gundam 🛡️ | 3100 |
| ZGMF-X666S Legend Gundam 🛡️ | 3200 |
| Nightingale (MSN-04II) 👑 | 3350 |

### Unknown Class
| Unit | DP |
|---|---|
| ∀ Gundam / Turn A Gundam 🛡️ | 3500 |

*Turn A sits outside normal tier progression entirely — its 77-point Limb Health total (well above Myth's standard 53) is intentional and not subject to normal scaling, per Section 10's Unknown Class rules.*

### Ground Units & Vehicles
See Sections 13, 13.5, and 13.7 for full stats.

**Ground units cost no DP.** They're limited by deployment caps instead (Section 13), since they exist to hold objectives rather than trade damage with mobile suits:

| Unit | Max on Board | Respawns From |
|---|---|---|
| Infantry Squad | 4 | Base |
| Car | 4 | Base |
| Tank | 2 | Base |
| Helicopter | 2 | Base |
| Jet | 2 | Board edge |
| Transport Ship | 2 | Board edge |

**Overall vehicle cap: 8** across Cars, Tanks, Helicopters, Jets, and Transport Ships combined. Infantry Squads are counted separately under their own cap of 4.

| Purchased Unit | DP |
|---|---|
| Musai-class Light Cruiser | 2200 |
| Salamis Kai-class Cruiser | 2500 |
| Rewloola-class Battleship | 5000 |
| Ra Cailum-class Battleship | 6000 |

*Warships are the sole exception — genuine combat platforms with mobile-suit-tier firepower, purchased with DP rather than capped, sitting outside the 8-vehicle cap, and they do not respawn. The generic Battle Ship entry has been **retired** in favour of the four named classes. See Section 13.5.*

---

*This rulebook reflects your core system as drafted: Ranged Combat Resolution (Section 3), Limb Health (Section 5), Melee Initiation/Refusal (Section 7.2), Stances (Section 9), Gundam-tier classification and Deployment Points (Section 10), Gundam Points (Section 11), Objectives (Section 12), Ground Units and Firefight Clash (Section 13), Ship Combat & Boarding (Section 13.5), the Detailed Battle Map (Section 13.6), Ground Vehicles, Buildings & Overmap Ground Rules (Section 13.7), the Pre-Game Setup Guide (Section 14), the Gamemode & Scenario Reference (Section 15), and the Built Unit Roster (Appendix A). Weapon and Shield stat tables are suggested starting values — adjust freely to match your group's playtesting.*
