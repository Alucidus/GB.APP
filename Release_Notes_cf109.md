# Gunpla Battles — cf109

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
