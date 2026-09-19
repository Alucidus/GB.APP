# cf129 - Pilot creator

The main menu now has a large Pilot entry alongside Play Online. Play Offline moves to the bottom bar and becomes Continue Offline when a saved battle exists. That entry opens the offline menu, retaining both new-battle and continue controls. Short landscape menus keep the bottom actions visible.

Pilot plays the existing clash transition and opens the supplied hangar over the existing menu battle scene, with m3-fg omitted from the creator scene. Effects and reduced-motion settings remain respected. Desktop and landscape layouts put options on the left and the portrait on the right. Portrait phones place the portrait above the controls so the face stays readable.

Appearance uses the supplied PSD layers at their original 1254 x 1254 fitted coordinates: female and male bodies, four face options each, three hairstyles each and five uniforms each. Body, Hair, Eyes and Uniform sections have explicit selection highlights. Hair, brows and irises have separate palettes. Uniform tint preserves shading and warm insignia accents; it is a whole-outfit tint, not separate trim colour controls. Original restores the source colours. Runtime masks isolate female brows and irises; male eye/brow cutouts come from the supplied PSDs. Detached background speckles are removed when rendering. Decoded layer caching is bounded for phones.

Identity records name, callsign, faction and background. Save pilot stores one editable pilot on this device, separately from battle saves. The Record tab shows that identity and the default Rookie rank. Unsaved changes use an in-game discard dialog. No GP spending, automatic rank effects, multiplayer portrait sharing or unit trait assignment is introduced in this milestone. Source PSDs and the PowerPoint remain unchanged.

Validation: all 120 fitted face/hair/uniform combinations, isolated iris recolouring, save/reload/discard, desktop and phone layouts, real clash transition, service-worker offline reopening and previously unused assets offline, battle-save isolation and both online/offline entry points. Existing compact toolbar regression passed 252 checks. Screenshot inspection included all eight faces and representative original/tinted outfits. Browser checks use installed Chrome; physical iPhone Safari is not tested.

Build, asset URLs and offline cache: cf129. No deployment. See Test_Checklist_cf129.md and Pilot_Sheet_Review.md.
