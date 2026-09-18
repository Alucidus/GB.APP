# Gunpla Battles — cf120

Quick Resolve squads now start with **2 Flashbangs, 2 Smoke Grenades and 2 Grenades**. The Detailed Battle Map's individual specialist equipment is unchanged.

## Resupply timing

The designer confirmed the complete own-turn-cycle interpretation: board during your turn 1, begin the service cycle at the start of your turn 2, remain aboard, then refill at the start of your turn 3. Boarding during an enemy turn likewise waits for the next own-turn start to begin the cycle. Qualifying transports are Car, Helicopter and Transport Ship.

The vehicle sheet shows each squad waiting, resupplying or ready, with the next completion boundary. The status panel fits desktop and phone landscape. Disembarking, changing transports, destruction or removal interrupts service; reboarding the same vehicle starts a new wait. Destruction cancels eligibility before emergency-disembarkation results are entered.

## Online state and old saves

- The room owns inventory counts and advances service only at official turn transitions. Ordinary unit saves cannot replenish or overwrite them, including a device holding the sheet lock.
- Blind picks spend at reveal; unpicking spends nothing. Forced re-engagements and Flashbang/Smoke responses spend only after the server accepts the action. Repeated messages cannot repeat the same expenditure or refill.
- New engagements, new bouts, refresh and reconnect do not refill items. Removed the old new-engagement refill path. Offline play keeps its explicit Resupplied control.
- Existing remaining quantities are preserved and capped at two per item. No extra Smoke or Grenade is silently granted to an old battle. Missing old inventory is treated as unknown/empty, not a fresh bag. Old ambiguous boarding progress restarts without granting supplies.
- Previous equipment work through cf119 remains included.

## Validation

926 automated assertions passed: 219 engagement, 300 equipment, 71 UI smoke, 272 quantity, 32 cf119 decisions, 32 authoritative resupply checks. The latter cover the chosen timing, same-transport reboarding, destruction, repair, roster removal, migration, stale writes, blind reveal spending and retry safety.

31 targeted browser assertions passed at desktop and phone-landscape sizes, including visible progress, offline manual controls, six pips, no engagement refill, duplicate turn-start protection and authoritative updates to a held sheet. Screenshots inspected at both sizes.

The two-context engagement browser scenario also passed: full four-round clash, confirmation reversal, waiting-squad items, Flashbang/Smoke extraction, turn gates, roster changes, privacy and no refill between bouts. Its harness now uses the installed Chrome path, Windows-safe screenshot paths and the app's supported landscape phone layout.

Tests use the production room with an in-memory HTTP adapter. No deployment, Cloudflare persistence/WebSocket test or physical two-device game was performed. Deploy the complete Worker and public assets together when authorized.

## Up next

User review of cf120, then the handoff's personal-base and carrier repair milestone. Before implementing its effects, settle the Tier-2 base-module track interpretation and first repair timing. Infinite Justice, Rising Freedom and Turn A remain separately deferred for rework.
