# cf122 — Shared pickups and roomier landscape sheets

Includes all cf121 personal Tier-0 base and Tier-2 carrier repair work, equipment quantities, purple dual-wield modifiers and phone menu improvements. See Release_Notes_cf121.md for the confirmed repair timing and rates. This package supersedes the earlier cf121 test snapshot.

## Pickup and weapon information

- Move, Dodge and Pick Up share the suit's lower action row.
- Equipped handheld weapons and physical forearm shields drop when their arm is lost or the unit is destroyed. Stowed weapons and integrated systems are not loot.
- The battlefield list shows both teams, prioritizing the current unit's own losses. Each pickup costs 1 AP on your turn and uses an in-game confirmation that the item is within 10cm. An empty compatible hand/mount equips it; otherwise it stays stored for a later normal equip action.
- Each physical drop has exclusive ownership. Online claims are room-owned, retry-safe, permission/turn checked and protected against stale unit snapshots. Claimed items disappear for everyone. Repairing an arm alone does not retrieve its weapon. Base replacements leave the old physical drop on the ground.
- Original damage, range, AP, remaining charges/cooldowns and shield HP travel with the item. Captured physical shields never acquire the receiving unit's beam-shield regeneration. Destroyed shields cannot be recovered. Grunts firing captured ranged weapons above 5 damage take 2 firing-arm HP strain.
- Captured weapons do not add printed weapon rows or replace native weapons. This follows the latest designer decision, superseding the old five-sheet-slot replacement approach. Equip > More and Manage equipment include captured gear.
- Tap either copper/yellow arm box for that hand's weapon profiles and rules. The readable scrolling panel includes AP, damage, range, charges/cooldown, modifiers and ranged fire controls. Captured shields on that forearm have HP controls. Unit-specific powers do not transfer with a weapon.

## Layout

The diagram retains its original dimensions and aspect ratio. Surrounding tables and controls move into the left/right landscape margins. Shield arcs move with their frames; HP labels remain with their model locations. Arm labels are compact, with 28px minimum tap height and full names in the detail panel. Lists grow horizontally with larger text; unused blank suit rows yield space to taller AP actions where the number of active rows allows it. Dense lists retain their existing row spacing. The original five weapon rows remain unchanged after capture. Infantry Fire/Move sit side by side on phone landscape, clear of footer shortcuts. Ship/ground help sits beside Tables/Stance, clear of the ability/status rows. Footer background panels follow the relocated controls. Longer content scrolls within its panel.

## Validation

1,000 model/server/stub-UI assertions; 80 pickup browser checks; 229 equipment and 31 resupply browser assertions; two-client pickup and full engagement-board scenarios all passed. Pickup tests cover actual taps, a full native weapon list, cancellation, firing, cooldown, reload, shield damage and non-regeneration, held-client synchronization, stale writes, repeat claims, re-dropping, and own-item priority.

Phone audit used Chromium touch emulation at 667×375, 844×390 and 932×430, plus desktop and portrait menu checks. Screenshots include suits, Phenex/Kshatriya shield arcs, infantry, vehicles, carriers, challenge and equipment panels. Physical iPhone/Safari and deployed Cloudflare storage/WebSockets were not tested. Existing dense sheet rings and some legacy ship/footer controls still benefit from pinch zoom.

No deployment was performed. Deploy the Worker and public assets together when ready; service-worker cache and asset versions are cf122.

## Next

User playtest of this combined build. Higher base tiers/GP purchasing and the separately deferred unit reworks remain future work; they are not silently enabled here.

A brief manual playtest is included in Test_Checklist_cf122.md.

Final geometry audit: 993 checks across all 66 unit sheets at three phone sizes passed, including AP separation, footer clearance and matching backgrounds.
