# User interaction preferences

These preferences were explicitly requested during cf125 development. Use them when designing new interactions or revising existing ones.

- For assigning units or equipment, use **select → highlight → select destination**. The first tap selects the item and makes its selection obvious. Valid destinations light up. Only the destination tap applies the choice. Show text or a checkmark as well as color, and allow deselection.
- Do not cycle a unit through destinations with repeated taps. Do not preselect a destination that makes the next unit tap unexpectedly assign it.
- Keep equivalent actions on the same controls. Shields equip and stow through the R/L shield HP bubbles; handheld weapons use the arm controls.
- Use familiar labels. The equipment panel is **Inventory**, including picked-up weapons and shields. Avoid vague labels such as More for that panel.
- Use the game's themed confirmation dialogs for swaps and replacements. Explain what will be displaced and the AP or unfinished-repair-cycle consequence before applying it.
- Show portraits, current health and repair forecasts near the related unit. Show player ownership as a lobby-style player list.
- Extra landscape space should improve readability and tapping. Spread tables and controls into the side space while preserving artwork proportions; avoid oversized hand labels, overlaps and clipped content.
- Preserve the full-page 8 Soldiers layout and original scaling. Its top tabs span the width; the group selectors stay slimmer. Do not enlarge controls until they hide the soldiers or squad choices.

Implemented in cf125: ship repair assignment and pre-deployment infantry vehicle loading both select the unit first and then its destination. Infantry loading remains a draft until Confirm & deploy; Back discards draft choices. Repair timing is unchanged by the interaction pattern.
