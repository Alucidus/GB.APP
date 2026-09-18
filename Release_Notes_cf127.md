# cf127 — Attached HP controls and unit-first base repair

The landscape layout was moving an HP adjustment button into a side panel while keeping its limb bubble on the diagram. The reproduced right-arm minus button was about 81px away at 667×375. All six limb adjustment pairs now remain with the diagram and anchor their nearest edges 4px from the bubble. Bubble sizing and button positions share the same diameter value, including during resizing and rotation. Damage/repair amounts are unchanged. Existing shield, borrowed-shield and stat groups retain their adjacent controls.

Personal bases now follow **select unit card → highlighted slot → confirmation**, matching the user's interaction preference. Slot 1 remains disabled until an eligible card is selected. Selecting alone neither enters the base nor changes its repair assignment. Cancel selection disables the slot again; occupied-slot replacement and physical-territory confirmations remain in-game.

Each unit has one combined base card containing its portrait, current health, service status and repair forecast. The duplicate roster row/detail card is removed, and the slot header summarizes its occupant without repeating the portrait. The current occupant is marked IN SLOT 1. Base ownership restrictions, immediate confirmed entry, next-own-turn healing, roster dimming and leaving behavior are unchanged. Ship repair controls and all cf126 features remain included.

Validation: 200 HP-control checks across six limbs, three representative mobile suits, five screen sizes and rotation; actual plus/minus taps and grouped shield/stat spacing. Also passed 240 repair-interface checks, 36 three-client base checks including authoritative healing, 64 damage/resize scenarios, 81 DOM smoke checks and the mobile audit. Screenshots of the corrected arm controls and combined base card were inspected. Browser coverage uses Chrome/touch emulation and a local production-room adapter; physical Safari remains untested.

Build, asset URLs and offline cache: cf127. No deployment. See Test_Checklist_cf127.md.
