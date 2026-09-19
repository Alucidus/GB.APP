# Character creator - cf129 implementation

## Latest hand-fitted hair assets (imported in cf131)

The user supplied `C:/Users/User/Desktop/NEWHAIRFITMENT.zip` and approved the exact hand placement. Cleaned copies are in `creator-work/edge-cleanup/NEWHAIRFITMENT_CLEANED` at the workspace root, with PSDs, fitted PNGs and a placement manifest. Original PSDs are preserved in `creator-work/user-fitment-original`.

Do not move or resize these hairstyles, especially the male dreads. The new document canvases are 1254 x 1500; their coordinates differ from the older 1254-square assets. Import the complete coordinated set without mixing old face positions with new hair positions. Preserve off-canvas layer bounds as supplied.

Required creator render order: face, eyes/eyebrows, uniform, facial hair, scalp hairstyle. Facial hair must be UNDER every hairstyle, including existing styles. The cleaned PSD copies use this order and retain original hair smart objects in a hidden backup group. Never import the backup group as selectable hairstyles.

Edge cleanup changes only contaminated perimeter RGB values on 42 new hairstyle layers across five PSDs. Alpha masks, coordinates and sizes were verified unchanged after saving and reopening. cf131 imports this set through tests/import-fitted-pilots.py. The manifest's _creator metadata supplies semantic option mappings and thumbnail paths; avoid hardcoded indices because facial-hair layers now precede every hairstyle. The portrait canvas is 1254 x 1500. Existing eye masks still operate in each face layer's local coordinates.

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
