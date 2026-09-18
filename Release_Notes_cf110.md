# Gunpla Battles — cf110

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
