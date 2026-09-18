# Gunpla Battles — cf107

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

