# cf121 — Repairs, equipment status and phone menus

Personal Tier-0 bases: top-left triangular BASE button, in-game territory confirmation, no extra entry AP, one repair slot per player, +2 HP per intact location and +5 per eligible physical shield/quadrant at the next own-turn start. Units remain targetable and keep normal defenses. Called shots do not cancel ground-base presence. The leader can assign a unit's personal-base owner before entry.

Rewloola and Ra Cailum: Tier 2 in all three tracks, three service slots, +4 intact-location HP and +12 per eligible physical shield/quadrant. Dock on own turn 1, complete docking on own turn 2, first repair on own turn 3. Hangar capacities remain four and six. Queue priority can be changed in the repair-bay menu. Fully serviced units release their service slot without being launched. Musai and Salamis do not repair suits.

Repairs replace dropped weapons into inventory; they do not auto-equip them, restore destroyed limbs, revive units, refill charges, or repair hulls. Beam regeneration, generated shields, coating pools and lent-out shields are excluded. Leaving or losing the service location interrupts its cycle. Online service and docking completion are room-owned, with revisions protecting against stale snapshots. Old ships already carrying suits start a fresh service cycle.

Weapon list quantities now show unequipped copies (×2 → ×1 → ×0). Equipped-hand colors and badges remain. The purple status box shows the existing ranged dual-wield penalty and dual-saber melee Advantage, removing each when no longer applicable.

Phone changes: landscape pickers use more screen area; Firefight squad cards are full-width buttons within each team column, at least 64px tall. The fixed footer fits Cancel and Challenge on one row. Modal controls, damage amounts and squad tabs have larger touch targets. Pinch zoom is enabled. Compact ship/vehicle descriptions remain available by tapping their names, rather than overlapping the sheet rows.

Validation: 959 model/server/UI-smoke assertions; 229 equipment browser assertions; 31 resupply browser assertions; complete two-device engagement-board scenario. Mobile checks use Chromium touch emulation at 667×375, 844×390 and 932×430, plus portrait menu inspection. These are not physical iPhone/Safari tests. Dense sheet rings, footer shortcuts and ship controls still benefit from zoom; a dedicated touch sheet remains future work.

Deferred campaign decisions: personal ownership instead of shared team GP; Repair Team T4 is exactly five slots; Arsenal T4 retains T3's first-tick recovery and completes all shields on the second tick. Higher tiers and GP purchasing are not implemented in this build.

Next requested work: shared battlefield Pick Up list, own items first, cross-team weapon/shield recovery and exclusive ownership of each physical drop.
