# Physical pilot sheet review and next milestones

Reference: C:/Users/User/Desktop/Custom_Pilot_Sheet (7).pptx, eight slides. The first two sheets use embedded image backgrounds with TEST placeholders. Their layout and the remaining slides were inspected as reference material, not instructions to change gameplay rules.

Pilot page: portrait, pilot name, callsign, current rank, pilot background, current GP and total GP. Rank thresholds shown: Rookie 0, Veteran 10, Ace 25, Newtype/Coordinator 45, Super Newtype 100, Legendary Newtype 200.

Unit page: unit identity/portrait, unit lore and six base trait slots with tiers 1-4. Additional slots are shown at 100 GP each. Traits belong to units; the pilot rank sets the tier ceiling. Keep pilot identity separate from unit build data.

cf129 implements the appearance creator and basic saved identity record. Next is the full digital character sheet and unit records, then save/export/import, then GP and campaign progression. Do not infer GP balances or purchased traits from the creator appearance.

Before implementing progression, reconcile slide 3's rank-dependent specialization slot counts with later slides' six free unit trait slots. These may refer to separate concepts; do not silently merge them. The base reference's Tier 4 capacity says 5+ (unlimited), while the user previously confirmed five for this app. Preserve the agreed implementation until separately discussed. These questions do not block the appearance creator.

Future character-sheet layout can use an identity summary with portrait and separate unit cards. Selecting a unit should highlight it and show its own traits and lore. Follow the existing select-then-select interaction preference for assignments.
