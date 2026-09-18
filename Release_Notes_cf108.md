# Gunpla Battles — cf108

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
