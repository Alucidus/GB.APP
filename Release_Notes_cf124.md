# cf124 — Shield slots, repair bays, roster status and infantry layout

## Shields and pickups

- Stow now highlights equipped shield HP bubbles. Tap one to store that shield without spending AP, changing its HP or stowing the hand weapon.
- Separate R/L forearm slots show the currently mounted shield, including captured equipment. Both arms can carry a shield. A Phenex loan remains in the separate borrowed-shield area.
- Equipping onto an occupied shield mount opens an in-game swap confirmation. The displaced shield returns to storage. Stowing is free; equipping from storage costs 1 AP in battle. Pickup remains 1 AP and auto-mounts only into an empty intact slot.
- Dropped shields no longer reserve their former arm. Replacement shields supplied by repairs return to storage instead of competing with a captured shield on that arm.
- Each dropped-item card includes the source unit portrait and identity. Own losses remain first in the list.

## Repair interfaces

- Tier 2 carriers have three numbered, selectable repair slots above their boarded-unit roster. New bays start empty: choose a slot, then a fully boarded unit. Clear or replace a slot through an in-game confirmation. Moving a unit out of service cancels its unfinished cycle. Completed repairs release the slot while the unit stays aboard.
- Existing saves retain their active repair selection on migration. Slot assignments synchronize through the room; stale writes cannot overwrite a newer selection. Docking units cannot occupy a slot before they are aboard.
- Tier 0 personal bases use the same slot/card/roster styling with one repair slot. Their existing queue remains: a waiting unit takes a free slot; selecting another unit gives it priority. Only units that have confirmed base entry appear in this roster.
- Unit portraits, current limb/shield HP and exact capped repair previews explain what the next service will restore. Destroyed locations remain at zero. Waiting and docking messages do not promise a repair next turn.
- Rates are unchanged: Tier 0 restores up to 2 HP per intact location and 5 per eligible shield; Tier 2 restores up to 4 and 12 respectively. Dock on own turn 1, arrive on own turn 2, assign a repair slot, first repair on own turn 3.

## Base status

Confirmed base occupants show the faction-colored base emblem and a dimmed row on the main roster, enemy roster and sheet roster picker. Open shared pickers update as state arrives. Opening the base menu does not change presence; leaving removes the emblem/dimming. Base occupants remain targetable and their sheets remain accessible.

## Infantry and short screens

- Overmap, 8 Soldiers and Quick Resolve share three full-width, slim tabs. The 8 Soldiers page retains its original scaling and complete-page layout. The top tabs are slightly thicker and the Riflemen & MG / Specialists group buttons slightly thinner, as requested. Soldier artwork and group portraits remain in their existing positions.
- Overmap Fire and Move sit immediately below the tabs, above the scrolling content. Movement and its undo remain accessible.
- The challenge picker uses the available screen height on both touch devices and small mouse-driven browser windows. Short instructions and a single-row Cancel/Challenge footer leave space for the squads. Both roster columns and matchup controls remain scrollable.

## Validation

1,025 model/server/UI smoke assertions passed. Targeted browser checks covered equipment, pickups, two shield mounts plus a borrowed shield, HP isolation, stow/swap/cancel, portraits, persistence, repair slots, Tier 0/2 forecasts and base entry/exit. Real room tests verified shield changes across two clients, base symbols across owner/teammate/opponent clients, and authoritative repair-slot timing and stale-write protection. Layout checks covered all 66 units at three phone sizes. Screenshots were inspected at phone landscape sizes, including special shield systems.

Additional infantry checks exercised all three tabs, soldier/group artwork, Overmap and individual movement, undo, selecting the fourth squad on each side and matchup selection. Viewports included 720×310 and 600×280 with a mouse, plus 667×375 and 844×390 with touch emulation. Mobile and all-unit layout checks were repeated after these changes.

Browser tests use Chromium touch emulation and the production room through an in-memory local adapter. Physical iPhone/Safari and deployed Cloudflare transport were not tested. No deployment was performed. Build and offline cache version: cf124.
