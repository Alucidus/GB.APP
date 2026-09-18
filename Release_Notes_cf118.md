# Gunpla Battles — cf118

Implements the user's special-equipment decisions following the cf117 quantity pass:

- Banshee Norn, Phenex and Luminous gain integrated Beam Tonfa melee: 2 normal / 4 critical damage, +0 weapon roll bonus, no equip action or equip AP. Available with empty hands, including surprise melee, without activating a form. One intact arm is required. Existing unit/status modifiers remain; the tonfas do not grant dual-saber Advantage. Handheld sabers remain separate.
- Gundam EX and Wing Zero EW each have Beam Saber ×2. These are approved gameplay quantities.
- Nu retains its stronger Nu Beam Saber (3/6, +4) and gains a separate Beam Saber ×2 profile (2/4, +3). The two standard copies can be equipped for dual-saber Advantage, paying the normal 1 AP per equip.
- Rozen Zulu's incorrect handheld saber is replaced by integrated Claw melee (2/4, +0 weapon bonus, no equip action). One intact arm is required. Saved references to the removed saber are cleared without refunding AP or restoring resources.
- Inventory labels remain consistent, and special pair lookup continues to recognize original weapon profile names beneath the display labels.

Validation: 643 automated equipment/UI/quantity checks and 43 targeted browser checks passed. Browser coverage includes empty-hand integrated melee, arm destruction, Nu's standard pair and retained stronger profile, EX's independent copies, EW's quantity, and Rozen's saved-saber migration. Desktop and phone-landscape sheets inspected. No deployment performed.

## Decisions still open

- Strike Rouge: intended pack and equipment variant.
- Nightingale: integrated saber/sub-arm arrangement and quantity.
- Gundam Mk-II: whether Heat Saber remains the intended custom profile.
- Vidar: replacement Burst Saber blade tracking.
- Night Hawk: custom Cold Fusion Saber/pair behaviour.
- Kshatriya: additional sub-arm weapons or alternate gun modes beyond its two main sabers.
- Delta Zayin: alternate saber gun mode and shield dependence.
- Infinite Justice, Rising Freedom and Turn A: previously deferred equipment reworks.

GM Sniper II, EX, Nu, Wing Zero EW, Banshee Norn, Phenex, Luminous and Rozen are resolved for this pass. The older cf117 audit remains historical research; the user's decisions here supersede its deferred entries.
