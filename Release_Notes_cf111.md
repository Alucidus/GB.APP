# Gunpla Battles — cf111

## Equipment clarity fixes

- Enlarged the highlighted equipment banner. Selected weapons show their name, prominent equip AP cost, available AP and the next action. Setup explicitly shows 0 AP.
- Equipment mode uses cyan for the right hand and gold for the left. Held weapon rows match their arm; a row held in both hands carries both colours. The selected row also has a white outline.
- Restored persistent R/L equipment labels beside the arm HP bubbles, below the numeric HP area. Empty and lost arms are identified.
- Replacing held equipment asks for confirmation and lists affected arms/weapons and the incoming weapon's AP cost. Cancel leaves equipment, AP, HP, shields and cooldowns unchanged. Empty-hand assignments do not require confirmation. Preview uses the existing equipment rules, including both-hand/exclusive systems.
- Client build, asset URLs and service-worker cache are synchronized to cf111.
- Made the existing local test server and version-bump utility compatible with Windows path separators and UTF-8 files.

## Verification actually run

508 automated assertions passed: 219 engagement/server, 218 equipment, 71 UI smoke.
141 real Chrome browser assertions passed across Federation/Spacenoid themes at 1400x1000 and 844x390. Coverage includes swap cancellation/confirmation, preserved state, empty-hand assignment, matching arm/row colours, dual-copy assignment, stow, first-turn firing and no page errors. Desktop and phone-landscape screenshots inspected.

No deployment or live Cloudflare multi-device test was performed. The broader engagement browser scenario was not run in this build.

## Decisions and next work

This release implements only the user's requested equipment presentation fixes. Equipment rules, AP costs and physical weapon quantities are unchanged. Earlier cf109 removal of arm equipment labels is superseded by this request.
The attached complete handoff remains planning/reference context. Its proposed future work was not executed as part of cf111. Next planned milestone remains the one-unit-at-a-time saber quantity review (RX-78-2, then F91), subject to the user's next request.