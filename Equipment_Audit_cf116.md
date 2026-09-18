# Starting equipment and special-case audit — cf116

## Scope and result

Reviewed all 50 mobile-suit catalogue entries, their generated equipment metadata, starting hand assignments, initial weapon/ability equipment gates and special shield rules. Opened all 50 production sheets in real Chrome at desktop and phone-landscape sizes. This is an equipment audit, not certification of every ability or all game rules.

47 suits use equipment enforcement. Turn A, Rising Freedom and Infinite Justice retain their existing rework exclusions.

## Confirmed issues fixed

- **Epyon:** starting equipment selected only ranged/hybrid handheld weapons. Its melee sword was omitted, so sword-dependent controls asked to equip first. New Epyons now start with one Beam Sword in the right hand, standard profile available, Full Output off and all starting AP intact. Standard/FULL remain two profiles of one weapon; +4 melee and 2 AP re-equip cost are unchanged.
- **Luminous Crystal Body:** its generated I-Field was classified as a left forearm shield. Arm loss could falsely mark the field dropped/unavailable. The field now uses a body mount and readiness follows Luminous Crystal Form. Old incorrect mount/drop metadata is corrected without restoring field HP, AP, charges or duration. Existing ability activation still grants its documented field.

## Special-case outcomes

| Unit | Findings / retained behaviour |
|---|---|
| Phenex | Starts with empty hands; Beam Saber inventory is retained (two copies under existing metadata). DE weapon is integrated, DE shields are body-mounted. Fire, send both, recall with damage retained, and independent saber equipment passed real UI checks. Sending DEs does not impose an equip-first gate on their weapon mode. |
| Luminous Crystal Body | Starts with empty hands and retains its existing Beam Saber. Crystal Form, Temporal Anchor and System Override have no saber prerequisite. Form activation, AP gain, charge spending, field availability after arm loss and reopening were checked. System Override remains the existing manual rules workflow; this release does not implement automated hijacking. |
| Master Gundam / Jiyan Altron | Empty hands are intentional for their integrated catalogue attacks. No handheld equipment gate was introduced. |
| Gouf | Starts empty-handed; forearm gun and Heat Rod retain their arm-mount rules. Heat Sword stays stored until equipped. |
| Kshatriya | Starts empty-handed; integrated cannons and Vulcan remain available. Beam Saber stays stored until equipped. |
| Snipers / Wing Zero variants | Existing two-hand starting assignments retained; two-hand/arm-loss and dual-system exceptions remain covered by equipment regression checks. |
| Exia / Banshee / Destiny / Nightingale | Existing exclusive GN Sword, Magnum attachment, integrated palm/sub-arm attacks and specialist equipment mappings retained. |
| Pixy | Spray and Pray remains gated by its named Bullpup MG while the starting 90mm SMG is held; this is a weapon-specific prerequisite, not a blanket empty-hand bug. |

User clarified to preserve Phenex/Luminous sabers and audit usability. This release does not add default sabers to other empty-handed units or change physical quantities. Existing saved Epyon loadouts are also preserved: intentionally stowed/dropped/left-hand weapons are not silently re-equipped. An older Epyon already saved empty-handed still needs EQUIP; the new default applies on creation or a normal new-game reset.

## Colour audit

Inspected public/app.css and public/app.js, including active ability controls, health/shield indicators, stance/carrier tags, faction palettes, model markers and decorative effects.

| Colour family | Existing use |
|---|---|
| Purple/violet | Active abilities/buffs, temporary stats, regeneration, stances, transport and queued/forced engagement states |
| Cyan/blue | Selection controls, Federation styling, information/armour accents |
| Red | Damage/danger, enemy/Spacenoid styling |
| Green | Health, successful/ready states |
| Amber/gold | Warnings, objectives, AP and faction accents; existing left-hand equipment identity |
| White/grey | Text, inactive/neutral controls, stealth, selected weapon outline |
| Pink | Optional model markers and decorative weapon/mono-eye effects |

The model-marker wheel already spans twelve hue families, so no basic hue is globally unused. Chosen **copper #d9a07b** is a dedicated equipment token with no pre-existing exact colour use in the reviewed client source. Right-hand equipment uses copper; left retains gold. R/L text remains authoritative rather than relying on colour alone. Equipped rows show the same accents in normal and equipment modes; rows held in both hands show a split highlight. Purple status controls were left unchanged.

## Validation and limits

586 automated assertions passed: 219 engagement/server, 296 equipment rules, 71 DOM smoke.
414 real-browser assertions passed: 229 equipment UI and 185 catalogue/special-case checks. Both faction themes and desktop/phone-landscape layouts covered for the targeted interactions; all 50 suit sheets opened at both sizes. Screenshots inspected for normal equipment highlights, Epyon and Luminous. Menu checked in desktop, landscape and portrait with the added Bandai Namco Entertainment disclaimer.

Run `npm test`, `npm run test:equipment:browser`, and `node tests/equipment-special-cases.mjs`. The browser suites require Playwright and Chromium; CHROMIUM_EXECUTABLE_PATH can point to installed Chrome. No deployment or live Cloudflare multi-device test was performed. Other broader historical rules/roadmap questions remain unresolved.

## Catalogue starting-loadout inventory

| Suit | Right hand | Left hand | Initial equipment restrictions |
|---|---|---|---|
| GM | beam-spray-gun#0 | Empty | Beam Saber: Equip first |
| Jesta | beam-rifle#0 | Empty | Beam Saber: Equip first |
| Blue Destiny Unit 1 | 100mm-machine-gun#0 | Empty | Dual Beam Sabers: Equip first |
| Slave Wraith | beam-rifle#0 | Empty | Beam Saber x2: Equip first; Rocket Launcher: Equip first |
| GM Sniper II | sniper-rifle#0 | sniper-rifle#0 | Beam Pistol: Equip first; Beam Saber: Equip first |
| RX-78-2 Gundam | beam-rifle#0 | Empty | Beam Saber: Equip first; Hyper Bazooka: Equip first |
| Gundam EX | beam-rifle#0 | Empty | Beam Saber: Equip first; Hyper Bazooka: Equip first |
| Gundam Mk-II | beam-rifle#0 | Empty | Heat Saber: Equip first; Hyper Bazooka: Equip first |
| Gundam Pixy | 90mm-submachine-gun#0 | Empty | Bullpup MG: Equip first |
| Hyaku Shiki | beam-rifle#0 | Empty | Beam Saber: Equip first; Clay Bazooka: Equip first |
| Pale Rider | hyper-beam-rifle#0 | Empty | 180mm Cannon: Equip first; Hyper Bazooka: Equip first; Beam Saber: Equip first |
| GP01Fb Zephyranthes | beam-rifle#0 | Empty | Beam Saber x2: Equip first |
| Narrative C-Packs | c-equip-beam-rifle#0 | Empty | Beam Saber: Equip first |
| Gundam F91 | beam-rifle#0 | Empty | Ballistic MG: Equip first; VSBR (Low-Speed): Equip first; VSBR (High-Speed): Equip first; Beam Saber: Equip first |
| Nu Gundam | beam-rifle#0 | Empty | Nu Beam Saber: Equip first; Hyper Bazooka: Equip first |
| Banshee Norn | beam-magnum#0 | Empty | Beam Saber: Equip first |
| Xi Gundam | beam-rifle#0 | Empty | Beam Saber: Equip first |
| Night Hawk | nightlance-mpc#0 | Empty | Stalker Rifle: Equip first; Cold Fusion Saber x2: Equip first |
| Astray Red Frame | beam-rifle#0 | Empty | Gerbera Straight: Equip first; Beam Saber: Equip first; BuCUE Head: Equip first |
| Strike Rouge | 57mm-beam-rifle#0 | Empty | Beam Saber x2: Equip first; Armor Schneider x2: Equip first |
| Gundam Jiyan Altron | Empty | Empty | None |
| AC Nightfall | arquebus-beam-linear-rifle#0 | Empty | Pulse Blade: Equip first |
| Gundam Vidar | 110mm-rifle#0 | Empty | Handgun x2: Equip first; Burst Saber: Equip first |
| Master Gundam | Empty | Empty | None |
| Infinite Justice Gundam | Rework excluded | — | None |
| Gundam Exia | gn-sword#0 | Empty | GN Long Blade: Equip first; GN Short Blade: Equip first; GN Beam Saber x2: Equip first; GN Beam Dagger x2: Equip first |
| Rising Freedom Gundam | Rework excluded | — | None |
| Strike Freedom Gundam | beam-rifle#0 | Empty | Beam Saber: Equip first |
| Luminous Crystal Body | Empty | Empty | Beam Saber: Equip first |
| Phenex | Empty | Empty | Beam Saber: Equip first |
| Gundam Epyon | beam-sword#0 | Empty | Beam Sword (FULL): Activate Full Output |
| Wing Zero | twin-buster#0 | twin-buster#0 | Beam Saber: Equip first |
| Wing Zero Custom | twin-buster#0 | twin-buster#0 | Beam Saber: Equip first |
| Destiny Gundam | ma-bar73-s-rifle#0 | Empty | M2000GX Cannon: Equip first; Arondight (melee): Equip first |
| Legend Gundam | ma-bar78f-rifle#0 | Empty | Beam Javelin x2: Equip first |
| Turn A Gundam | Rework excluded | — | None |
| Zaku II | zaku-machine-gun#0 | Empty | Heat Hawk: Equip first |
| Gouf | Empty | Empty | Heat Sword: Equip first |
| Rick Dom | giant-bazooka#0 | Empty | Heat Saber: Equip first |
| Zaku I Sniper Type | beam-sniper-rifle#0 | beam-sniper-rifle#0 | None |
| Geara Zulu | beam-weapon-mg-rifle#0 | Empty | Beam Hawk: Equip first |
| GP02A Physalis | 135mm-anti-ship-rifle#0 | Empty | Beam Saber x2: Equip first |
| Rozen Zulu | beam-rifle#0 | Empty | Beam Saber: Equip first |
| Sinanju Stein | beam-rifle#0 | Empty | Rocket Bazooka: Equip first; Beam Saber x2: Equip first |
| Sinanju | beam-rifle#0 | Empty | Rocket Bazooka: Equip first; Beam Tomahawks: Equip first; Beam Saber: Equip first |
| Kshatriya | Empty | Empty | Beam Saber: Equip first |
| Delta Zayin | beam-rifle#0 | Empty | Beam Saber: Equip first |
| Sazabi | beam-shot-rifle#0 | Empty | Beam Tomahawk: Equip first; Beam Saber: Equip first |
| Sinanju Zero | beam-rifle#0 | Empty | Rocket Bazooka: Equip first; Beam Tomahawk: Equip first |
| Nightingale | mega-beam-rifle#0 | Empty | Beam Tomahawk: Equip first |