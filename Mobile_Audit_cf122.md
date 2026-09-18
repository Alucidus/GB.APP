# cf122 phone audit

Chromium touch emulation: 667×375, 844×390, 932×430; desktop 1400×1000; portrait main menu. No physical iPhone/Safari was available.

Reviewed screenshots of suit sheets, captured weapon details, Phenex/Kshatriya shield arcs, infantry, tank, Rewloola, roster, Firefight challenge and portrait menu. Actual taps verify pickup confirmation/cancel, arm information, firing/cooldown, captured shield HP and infantry Move. Geometry checks cover compact 28px arm controls, nonoverlap, hit-test visibility, unchanged diagram dimensions, native weapon row positions, scrolling panel width and shield arc/frame alignment. Challenge selection reaches the fourth squad with controls at least 44px.

Fixed detached ship HP labels, vehicle target-frame alignment, shield SVG alignment and infantry Move/footer collision found during the audit. Information panels scroll independently; arm labels are bounded to two lines and the full name appears in their panel. Captured gear never creates additional printed rows.

Existing dense diagram rings, weapon AP cells, ship controls and footer shortcuts are still compact and may need pinch zoom. Battle sheets retain the existing portrait rotate prompt. This is not a claim that every legacy control is 44px or that native Safari has been verified.

Reproduce with npm run test:mobile and npm run test:pickup:browser. Screenshots are under tests/screenshots.

Final layout pass includes every unit at all three phone sizes, checking non-overlapping AP controls, footer/status separation, footer-background alignment and unchanged diagrams. Lists expand into available width; suit lists use fewer blank rows to make actions taller when space allows.

Final geometry audit: 993 checks across all 66 unit sheets at three phone sizes passed, including AP separation, footer clearance and matching backgrounds.
