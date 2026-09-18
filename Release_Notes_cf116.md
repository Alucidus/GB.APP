# Gunpla Battles — cf116

- New Epyons start with the standard Beam Sword equipped in the right hand, with full starting AP. Full Output remains off until activated. Existing saved loadouts are preserved.
- Right-hand equipment now uses copper (#d9a07b), after auditing existing colour roles. Left-hand gold and R/L text remain. Equipped weapon rows carry matching highlights on the normal sheet as well as during selection; both-hand rows use both colours.
- Audited all 50 suit entries. Fixed Luminous Crystal Body's generated force field being incorrectly treated as a forearm shield; active-mode gating and mount migration preserve resources. Phenex's remote DE and independent saber behaviour passed targeted browser checks. Existing sabers and quantities are retained.
- Main-menu disclaimer now also says: "Not affiliated with Bandai Namco Entertainment."
- See Equipment_Audit_cf116.md for full findings, starting-loadout inventory, colour audit and limitations.

Validation: 586 automated assertions and 414 real-browser assertions passed. Desktop/phone screenshots inspected. Menu also checked in portrait. Build/asset/cache versions are cf116. No deployment or live Cloudflare two-device game performed.

Up next: user review. Other empty-hand starting choices remain as previously implemented; the audit did not add starting sabers to Phenex, Luminous, Gouf or Kshatriya. Saved older Epyons need their sword equipped manually or a normal new-game reset to receive the new default.