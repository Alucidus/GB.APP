# Gunpla Battles — cf113

Equipment swaps now use the existing faction-themed in-game picker instead of a browser confirm dialog. The dialog lists the weapons returning to storage, the incoming weapon and arm, the equip cost and available AP. Cancel is initially focused; Escape and backdrop dismissal cancel without spending AP. Tab stays within the two actions.

Swap revalidates ownership, turn, equipment and resources. If the loadout or turn changed while the warning was open, a new review is required; invalid changes are rejected. Empty-hand assignments keep the direct flow. Violet/right and gold/left colours from cf112 are retained.

Verification: 165 real-browser assertions passed across both factions at desktop and phone-landscape sizes, including cancellation, Escape, acceptance, changed-state reconfirmation, no browser dialogs and AP preservation. 71 UI smoke checks passed. Dialog screenshots inspected at both sizes. No live Cloudflare testing or deployment performed. Build/asset/cache versions are cf113.

Up next: user review of the equipment feature. Other roadmap work remains pending.