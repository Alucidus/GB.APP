# cf125 — Clear selection, repair access and stable sheets

Ship repair assignment now follows **select unit → highlight → select slot**. Tapping a boarded unit highlights it with a checkmark and lights up valid destinations; it does not assign anything yet. Tap a numbered slot to apply the assignment. Occupied destinations still require an in-game replacement warning. Cancel selection changes no assignment. Portraits, current HP, forecasts, three-slot capacity and repair timing are retained.

Infantry loading during team confirmation follows the same pattern. Select a squad, then a highlighted vehicle or On the board. Capacity and the current destination are visible; full vehicles are unavailable. Repeated squad taps select/deselect rather than cycling destinations. Choices remain a draft until Confirm & deploy, and Back discards that draft. Cars/helicopters still carry one squad and transport ships carry two.

The equipment prompt's More button and panel are now called **Inventory**. Choose Equip shield there, then tap the R/L shield HP bubble, matching Stow. Empty shield slots work, destroyed arms are unavailable, and occupied slots retain the in-game swap confirmation. The selected physical shield keeps its current HP; weapon hands and Phenex's separate borrowed shield are unaffected. The inactive base triangle is hidden during equipment selection so it cannot cover the prompt.

The personal base's Unit owner dropdown is now a lobby-style teammate list with a selected-owner checkmark, leader crown, Host badge and “you” label. Existing permissions remain: the leader assigns ownership on an editable sheet, and ownership is locked while the unit is inside a base.

For base entry, tap the base's Slot 1 and confirm physical base territory in the in-game dialog. Entry is immediate, with a green active slot, portrait and health display. There is no queued-entry phase. A damaged entrant takes the slot; if another unit is displaced, the confirmation explains that its unfinished repair cycle is lost and it remains in the base roster. Enter on own turn 1 → first Tier 0 repair at the start of own turn 2. Carrier timing remains dock on turn 1 → fully aboard on turn 2 → first repair on turn 3 when assigned on turn 2. Tier 0 stays +2 per intact location / +5 per eligible shield; Tier 2 stays +4/+12, capped at maximum, with destroyed locations excluded.

Damage redraws now finish the sheet layout synchronously before the browser paints. This removes the reproduced one-frame sideways jump on suit, ship, vehicle and soldier sheets while preserving resizing on actual viewport changes.

The mobile-suit destroyed overlay covers the full widened landscape frame and scales its message. It paints above the L/R hand labels, help button and every bottom action, including Tables, Stance, Equip, Stow, Move, Dodge, Pick Up, Done and Roster.

All cf124 features remain included, including original full-page 8 Soldiers scaling and the final slightly thicker top tabs / thinner group buttons.

## Verification

- 185 infantry loading browser checks: both factions, four viewports including phone portrait, selection without assignment, capacity, transfers, board placement, Back/Confirm and saved destinations.
- 176 repair-interface checks: four viewports, selected units and highlighted slots, cancel/replace/clear, portraits, current HP, capped forecasts, base entry, occupied-base entry cancellation/replacement and base priority.
- 193 shield browser assertions: bubble targets, empty slots, lost arms, swap/cancel, AP and HP preservation, separate borrowed shield, reload and special shield systems.
- 229 equipment browser assertions and 81 DOM smoke checks; two-browser production-room pickup/shield synchronization scenario.
- 34 three-client base checks, including owner permissions, entry/cancel/exit, shared base symbols and actual turn-driven healing. 36 repair model/server checks cover capacity, rates, timing and stale writes.
- 64 repeated damage/resize scenarios verify stable positions immediately after each tap and across five painted frames. 24 destroyed-overlay checks cover four screen sizes, chest/head destruction, the full overlay bounds, all bottom action layers and recovery from corrected HP.
- Existing 993-check sheet layout sweep and infantry layout checks passed during cf125 work. The mobile audit also passed after the interaction changes.

Screenshots were inspected for small-screen loading, shield selection, repair selection and destroyed-overlay layering. Browser tests use installed Chrome, touch emulation and the production room through a local in-memory adapter. Physical iPhone/Safari and deployed Cloudflare transport were not tested. No deployment was performed.

Build and offline cache version: **cf125**. See Test_Checklist_cf125.md. UI_Interaction_Preferences.md records the user's interaction pattern. Character_Creator_Asset_Handoff.md records the female PSD and hangar/battle-scene work explicitly deferred by the user.
