# cf126 — Ship repair slots require a selected unit

Ship repair slot headers are disabled and visually inactive until a boarded unit is selected. Selecting a unit highlights and enables its valid destinations; its existing slot remains disabled. Assigning the unit, deselecting it or pressing Cancel selection disables the slots again. Slot headers no longer open a secondary selection/detail view. Select a unit to see its detailed repair forecast; occupied slot cards continue to show health and next-service summaries.

The separate Clear slot action remains available for occupied slots, with its existing confirmation. Base entry, repair timing and all cf125 features are unchanged.

Validation: 208 repair-interface browser checks passed at 667×375, 844×390, 932×430 and 1400×1000, covering disabled/active destinations, assignments, cancel, replacement/clear, forecasts and base entry/priority. The small landscape screenshot was inspected. Chrome touch emulation was used; physical Safari testing remains for playtest.

Build, asset URLs and offline cache are cf126. No deployment was performed. See Test_Checklist_cf126.md.
