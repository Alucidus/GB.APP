# Character creator - cf129 implementation

The deferred work below was activated by the user for cf129. All five PSDs from Desktop/New folder (2) were read and their layers exported to public/img/pilots. The original fitment coordinates are in layers.json. tests/extract-pilot-layers.py documents reproducible extraction with psd-tools. The original PSDs remain unchanged and outside the deployable ZIP.

public/pilot.js provides runtime female iris/brow masks, male cutout recolouring, hair shading and whole-uniform tint. Separate user palettes preserve skin and eye whites. The supplied Hangar.png is included with its existing transparency; the menu battle scene runs behind it without m3-fg. See Release_Notes_cf129.md and Pilot_Sheet_Review.md.

## Original asset handoff (historical)

# Character creator — assets and deferred work

User supplied these files on 2026-09-19 and explicitly asked to record them for later work. Character creator implementation is outside cf125.

- Female character source PSD: `C:/Users/User/Desktop/New folder (2)/girls all in one fitment psd.psd`
- Hangar foreground/window image: `C:/Users/User/Desktop/New folder (2)/Hangar.png`

For the female creator, prepare separate eye and eyebrow masks from the PSD to support the requested hair and eye color options. Preserve the fitted uniform/body alignment. The user is focusing on uniform fitment; Codex will handle the eye/brow separation when this work begins.

Use the supplied hangar as the foreground framing the creator. Place the existing menu's background battle scene behind the see-through window. Reuse that scene rather than replacing it with an unrelated backdrop. Preserve the window opening and the hangar's proportions when layering and scaling.

The source files remain at the Desktop paths above; they are not copied into the cf125 deployable app or ZIP. No masks, recolors or background integration have been created yet. Inspect the PSD's layers and the PNG's transparency when starting this milestone.
