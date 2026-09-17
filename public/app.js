/* ---------- state ---------- */
let side = null, budget = 0, roster = [], locked = false;   // [{uid, id, st}] -- one entry per physical model
let nextUid = 1;
// each faction keeps its own force, budget and lock state
let teams = { federation: null, spacenoid: null };
function blankTeam() { return { budget: 0, roster: [], nextUid: 1, locked: false, turn: freshTurn() }; }
// one round = your turn, then the enemy's turn. round 0 exists only if the enemy opens the game
function freshTurn() { return { round: 1, phase: "you", first: "you", started: false, log: [], done: [] }; }
let turn = freshTurn();
function stashTeam() {
  if (!side) return;
  teams[side] = { budget: budget, roster: roster, nextUid: nextUid, locked: locked, turn: turn };
}
function loadTeam(s) {
  const t = teams[s] || blankTeam();
  budget = t.budget || 0;
  roster = t.roster || [];
  nextUid = t.nextUid || (roster.length + 1);
  locked = !!t.locked;
  turn = (t.turn && typeof t.turn.round === "number") ? t.turn : freshTurn();
  if (!Array.isArray(turn.log)) turn.log = [];
  if (!Array.isArray(turn.done)) turn.done = [];
}
const PRESETS = [5000, 10000, 15000, 20000];
const SAVE = "msb.state.v4";

const $ = id => document.getElementById(id);
// ================= WARSHIPS (cf5) =================
// Four named classes (Rulebook Section 13.5). A warship is a roster unit like any suit, but it has its own
// sheet: a tinted wireframe with rings for Hull, Bridge, both Thrusters and every weapon system, a weapons
// list, Crew / AP / Movement readouts and an abilities table (launch, dock, Damage Control, …).
// State lives in r.st.ship (plus r.st.hp.hull and r.st.ap so roster rows, sync and turn code work unchanged).
const SHIP_WEAPON_HP = 20;
const SHIP_UNITS = [
  { id: "musai-class-light-cruiser", name: "Musai-class Light Cruiser", short: "Musai", ship: "musai", faction: "spacenoid", dp: 2200,
    hull: 60, bridge: 40, thr: [20, 20], ap: 4, moveCm: 30, crew: 8, garrison: 1, dc: false, hangar: 2, launches: 1, base: 0, decoy: false,
    aspect: 1.807, box: { h: 58, top: 2, cx: 40 },
    sw: [
      { key: "main", name: "Twin Mega Particle Gun", label: "Main Guns", tech: "Twin mega particle", ring: "MAIN GUNS", arc: "180° forward", range: "Sniper curve", dmg: "12 ×2", dmgHalf: "12 ×1", ap: 1, cd: 1, twoTargets: true,
        note: "Three twin turrets. Split the two shots across 2 targets or stack both on one for 24. Each barrel rolls separately with its own Dodge/Block. 1 full turn cooldown. The turrets can't fire behind the ship. At half system HP (10 or less) it can only fire once — a single shot at one target, no stacking." },
      { key: "missile", name: "Missile Launchers", ring: "MISSILES", arc: "Forward", range: "60cm", dmg: "3 → all 6", ap: 1, cd: 1,
        note: "A 30cm wide × 15cm deep band across the ship's heading. Everything inside is a target, friend or foe. Block only — no Dodge. Point Defense has no effect. 1 full turn cooldown." },
    ],
    rings: { bridge: [25, 15, "b"], thr0: [12, 64, "b"], thr1: [21, 44, "b"], hull: [62, 64], main: [46, 38], missile: [88, 82] },
    abil: ["launch", "dock", "dc", "bridgehit", "lockdown"] },
  { id: "salamis-kai-class-cruiser", name: "Salamis Kai-class Cruiser", short: "Salamis Kai", ship: "salamis", faction: "federation", dp: 2500,
    hull: 70, bridge: 40, thr: [20, 20], ap: 4, moveCm: 25, crew: 8, garrison: 1, dc: false, hangar: 2, launches: 1, base: 0, decoy: false,
    aspect: 1.790, box: { h: 60, top: 2, cx: 40 },
    sw: [
      { key: "main", name: "Twin Mega Particle Cannon", label: "Main Cannon", tech: "Twin mega particle", ring: "MAIN CANNON", arc: "360°", range: "Sniper curve", dmg: "12 ×2", dmgHalf: "12 ×1", ap: 1, cd: 1, twoTargets: true,
        note: "Turrets dispersed across the hull — no blind spot. The two shots MUST be split across 2 separate targets; they can't be stacked. Each rolls separately with its own Dodge/Block. 1 full turn cooldown. At half system HP (10 or less) it can only fire once — a single shot at one target, no stacking." },
      { key: "aa", name: "Anti-Air Array", arc: "360°", range: "60cm", dmg: "6d6", ap: 1, cd: 0, indep: true,
        note: "Four machine gun turrets. Ballistic, not beam: ignores Nano-Laminate, but can't touch Limb Health through an active Phase Shift pool. Roll 4+ at 60cm, 3+ at 30–60cm, 2+ under 30cm; 1 damage per success. One volley, one Dodge/Block." },
      { key: "missile", name: "Missile Launchers", ring: "MISSILES", arc: "Forward", range: "60cm", dmg: "3 → all 6", ap: 1, cd: 1,
        note: "Eight internal tubes. A 30cm wide × 15cm deep band across the heading. Friend and foe alike. Block only — no Dodge. Point Defense has no effect. 1 full turn cooldown." },
    ],
    rings: { bridge: [36, 10, "b"], thr0: [6, 32, "b"], thr1: [20, 6, "b"], hull: [40, 55], main: [74, 62], aa: [57, 40], missile: [53, 72, "b"] },
    abil: ["launch", "dock", "dc", "bridgehit", "lockdown"] },
  { id: "rewloola-class-battleship", name: "Rewloola-class Battleship", short: "Rewloola", ship: "rewloola", faction: "spacenoid", dp: 5000,
    hull: 100, bridge: 60, thr: [30, 30], ap: 6, moveCm: 20, crew: 24, garrison: 3, dc: true, hangar: 4, launches: 2, base: 2, decoy: false,
    aspect: 2.513, box: { h: 52, top: 5, cx: 45 }, hitDx: 0.01, hitDy: 5.8,
    sw: [
      { key: "main", name: "Twin Mega Particle Main Gun", label: "Main Gun", tech: "Twin mega particle", ring: "MAIN GUN", arc: "360°", range: "Sniper curve", dmg: "12 ×2", dmgHalf: "12 ×1", ap: 1, cd: 1, twoTargets: true,
        note: "The main battery. Split the two shots across 2 targets, or stack both on one for 24. Each barrel rolls separately with its own Dodge/Block. 1 full turn cooldown. One 20 HP system — disabling it takes both barrels offline. At half system HP (10 or less) it can only fire once — a single shot at one target, no stacking." },
      { key: "sec", name: "Twin Mega Particle Secondary Gun", label: "Secondary Gun", tech: "Twin mega particle", ring: "SECONDARY GUN", arc: "360°", range: "90cm", dmg: "5 each", dmgHalf: "5 ×1", ap: 1, cd: 0, twoTargets: true,
        note: "Hits 2 separate targets at once, each rolled separately. At half system HP (10 or less) it can only fire once — a single shot at one target, no stacking." },
      { key: "aa", name: "Anti-Air Array", arc: "360°", range: "60cm", dmg: "6d6", ap: 1, cd: 0, indep: true,
        note: "Twenty triple-barrel emplacements. Ballistic, not beam: ignores Nano-Laminate, but can't touch Limb Health through an active Phase Shift pool. Roll 4+ at 60cm, 3+ at 30–60cm, 2+ under 30cm; 1 damage per success. One volley, one Dodge/Block." },
      { key: "missile", name: "Missile Barrage", arc: "Forward", range: "90cm", dmg: "4 → all 6", ap: 1, cd: 1,
        note: "A 60cm wide × 20cm deep band across the heading, anywhere in range. Friend and foe alike. Block only — no Dodge. Point Defense has no effect. 1 full turn cooldown." },
    ],
    rings: { bridge: [33, 17], thr0: [7, 62], thr1: [11, 30], hull: [30, 64], main: [46, 33], sec: [60, 55], aa: [73, 44], missile: [90, 86] },
    abil: ["launch", "dock", "dc", "base", "bridgehit"] },
  { id: "ra-cailum-class-battleship", name: "Ra Cailum-class Battleship", short: "Ra Cailum", ship: "racailum", faction: "federation", dp: 6000,
    hull: 140, bridge: 60, thr: [30, 30], ap: 6, moveCm: 15, crew: 32, garrison: 4, dc: true, hangar: 6, launches: 2, base: 2, decoy: true,
    aspect: 2.028, box: { h: 58, top: 2, cx: 44 },
    sw: [
      { key: "main", name: "Twin Mega Particle Main Gun", label: "Main Gun", tech: "Twin mega particle", ring: "MAIN GUN", arc: "360°", range: "Sniper curve", dmg: "12 ×2", dmgHalf: "12 ×1", ap: 1, cd: 1, twoTargets: true,
        note: "Five twin guns, dorsal and ventral. Split the two shots across 2 targets, or stack both on one for 24. Each barrel rolls separately with its own Dodge/Block. 1 full turn cooldown. At half system HP (10 or less) it can only fire once — a single shot at one target, no stacking." },
      { key: "aa", name: "Anti-Air Array", arc: "360°", range: "60cm", dmg: "6d6", ap: 1, cd: 0, indep: true,
        note: "Twenty-two twin-barrel guns. Ballistic, not beam: ignores Nano-Laminate, but can't touch Limb Health through an active Phase Shift pool. Roll 4+ at 60cm, 3+ at 30–60cm, 2+ under 30cm; 1 damage per success. One volley, one Dodge/Block." },
      { key: "asm", name: "Anti-Ship Missile", arc: "Forward", range: "90cm", dmg: "15/10/5", ap: 1, cd: 2, charges: 2,
        note: "Nuclear ordnance. 2 charges per game, 2 full turn cooldown between them. Undodgeable, Block only, hits friend and foe.\n\nBy distance from the blast centre:\n0–30cm — suits 15 to all 6 · warships 40 Hull, Bridge and both Thrusters disabled\n30–60cm — suits 10 to all 6 · warships 25 Hull\n60–90cm — suits 5 to all 6 · warships 10 Hull" },
    ],
    rings: { bridge: [29, 11], thr0: [9, 50], thr1: [16, 27], hull: [40, 41], main: [60, 44], aa: [52, 66], asm: [88, 73] },
    abil: ["launch", "dock", "dc", "decoy", "base"] },
];
SHIP_UNITS.forEach(s => Object.assign(s, {
  portrait: "ship-" + s.ship,
  tier: "Warship", type: "warship", move: s.moveCm + "cm", dodges: 0, kill: "hull", limb: { hull: s.hull },
  abilities: [], weapons: [], shields: [],
}));
const isShip = u => !!(u && u.type === "warship");
const shipSrc = u => "img/ship-" + u.ship + ".webp";

function shipFresh(u) {
  return { hp: { hull: u.hull }, dodges: 0, ap: u.ap, track: [], wpn: [], sh: [], shMax: [], shDown: [], pods: null, out: null, lent: [], risk: {},
    ship: { bridge: u.bridge, thr: u.thr.slice(), sys: u.sw.map(() => SHIP_WEAPON_HP), crew: u.crew,
      cd: u.sw.map(() => 0), cdFresh: u.sw.map(() => false), ch: u.sw.map(w => w.charges || null), rep: {},
      aboard: 0, carry: [], launched: [], docking: [], bridgeHit: 0, decoy: { ch: u.decoy ? 1 : 0, left: 0 } } };
}
function shipMigrate(u, st) {
  const f = shipFresh(u);
  if (!st.hp || typeof st.hp.hull !== "number") st.hp = f.hp;
  if (!st.ship || typeof st.ship !== "object") st.ship = f.ship;
  const S = st.ship;
  Object.keys(f.ship).forEach(k => { if (S[k] === undefined) S[k] = f.ship[k]; });
  if (!Array.isArray(S.sys) || S.sys.length !== u.sw.length) S.sys = f.ship.sys;
  if (!Array.isArray(S.cd) || S.cd.length !== u.sw.length) S.cd = f.ship.cd;
  if (!Array.isArray(S.cdFresh) || S.cdFresh.length !== u.sw.length) S.cdFresh = f.ship.cdFresh;
  if (!Array.isArray(S.carry)) S.carry = [];
  if (!Array.isArray(S.launched)) S.launched = [];
  if (!Array.isArray(S.docking)) S.docking = [];
  const alive = new Set(roster.map(r => r.uid));
  S.carry = S.carry.filter(x => alive.has(x));
  S.docking = S.docking.filter(d => d && alive.has(d.uid));
  S.aboard = S.carry.length;
  if (!Array.isArray(S.ch) || S.ch.length !== u.sw.length) S.ch = f.ship.ch;
  ["track", "wpn", "sh", "shMax", "shDown", "lent"].forEach(k => { if (!Array.isArray(st[k])) st[k] = []; });
  if (typeof st.ap !== "number") st.ap = u.ap;
  st.dodges = 0;
  return st;
}
const shipDCActive = (u, S) => u.dc && S.crew >= 9;
function shipMove(u, S) {
  const down = S.thr.filter(v => v === 0).length;
  if (down >= 2) return { txt: "0", sub: "immobilised", warn: true };            // no thrusters beats no bridge
  const cm = down === 1 ? u.moveCm / 2 : u.moveCm;
  if (S.bridge === 0) return { txt: cm + "cm", sub: "drift \u00b7 straight only" + (down ? " \u00b7 halved" : ""), warn: true };
  if (down === 1) return { txt: cm + "cm", sub: "halved", warn: true };
  return { txt: u.moveCm + "cm", sub: "per AP", warn: false };
}
// start of this side's turn
function shipAdvance(u, st) {
  shipMigrate(u, st);
  const S = st.ship, uid = (roster.find(r => r.st === st) || {}).uid;
  st.ap = u.ap;
  // a weapon fired last turn sits out this whole turn; the countdown starts after that
  S.cd = S.cd.map((v, i) => { if (S.cdFresh[i]) { S.cdFresh[i] = false; return v; } return Math.max(0, (v || 0) - 1); });
  S.launched = [];                                   // the catapult bonus only lasts the turn of the launch
  if (S.docking.length) {                            // the enemy's turn has ended: docking suits are aboard
    S.docking.forEach(d => { if (!S.carry.includes(d.uid) && S.carry.length < u.hangar) S.carry.push(d.uid); });
    if (uid != null) logEv(uid, S.docking.map(d => unitLabel(d.uid)).join(", ") + " docked and aboard", "good");
    S.docking = [];
  }
  S.aboard = S.carry.length;
  if (S.bridgeHit > 0) S.bridgeHit -= 1;
  if (S.decoy && S.decoy.left > 0) { S.decoy.left -= 1; if (!S.decoy.left && uid != null) logEv(uid, "Decoy balloons deflated", "info"); }
  // Damage Control: knocked-out subsystems return after 2 full turns while the crew can spare the hands
  Object.keys(S.rep || {}).forEach(k => {
    if (!shipDCActive(u, S)) { delete S.rep[k]; return; }
    S.rep[k] -= 1;
    if (S.rep[k] > 0) return;
    delete S.rep[k];
    const lab = shipPartLabel(u, k);
    if (k === "bridge") S.bridge = u.bridge;
    else if (k === "thr0" || k === "thr1") S.thr[+k[3]] = u.thr[+k[3]];
    else { const i = u.sw.findIndex(w => w.key === k); if (i >= 0) S.sys[i] = SHIP_WEAPON_HP; }
    if (uid != null) logEv(uid, lab + " back online (Damage Control)", "good");
  });
}
function shipPartLabel(u, k) {
  if (k === "hull") return "Hull";
  if (k === "bridge") return "Bridge";
  if (k === "thr0") return "Thruster 1";
  if (k === "thr1") return "Thruster 2";
  const w = u.sw.find(x => x.key === k);
  return w ? w.name : k;
}
function shipPartGet(u, st, k) {
  const S = st.ship;
  if (k === "hull") return [st.hp.hull, u.hull];
  if (k === "bridge") return [S.bridge, u.bridge];
  if (k === "thr0" || k === "thr1") return [S.thr[+k[3]], u.thr[+k[3]]];
  const i = u.sw.findIndex(w => w.key === k);
  return [S.sys[i], SHIP_WEAPON_HP];
}
function shipPartSet(u, st, k, v) {
  const S = st.ship;
  if (k === "hull") st.hp.hull = v;
  else if (k === "bridge") S.bridge = v;
  else if (k === "thr0" || k === "thr1") S.thr[+k[3]] = v;
  else { const i = u.sw.findIndex(w => w.key === k); S.sys[i] = v; }
}
// a tap on a ring: damage or repair by the current amount
function shipTap(k) {
  if (!CUR || !isShip(U) || !mpSheetCanEdit()) return;
  const st = CUR.st, S = st.ship, uid = CUR.uid;
  const [cur, max] = shipPartGet(U, st, k);
  const next = mode === "repair" ? Math.min(max, cur + amount) : Math.max(0, cur - amount);
  if (next === cur) return;
  shipPartSet(U, st, k, next);
  const lab = shipPartLabel(U, k);
  aggDmg(uid, "ship:" + k, lab, cur - next, next, max);
  if (cur > 0 && next === 0) {
    const what = k === "hull" ? "DESTROYED" : k === "bridge" ? "Bridge destroyed — " + (U.sw.some(w => w.indep) ? "no main weapons (Anti-Air still firing)" : "no weapons") + ", no steering"
      : k.startsWith("thr") ? lab + " destroyed — " + (S.thr.every(v => v === 0) ? "ship immobilised" : "movement halved") : lab + " offline";
    logEv(uid, what, "bad", "ship0:" + k);
    if (k !== "hull" && shipDCActive(U, S)) { S.rep[k] = 2; logEv(uid, lab + ": Damage Control — back in 2 turns", "info"); }
    if (k === "hull" && S.carry.length) { const shipR = CUR; setTimeout(() => openDisembark(shipR), 60); }
  } else if (cur === 0 && next > 0) {
    if (S.rep) delete S.rep[k];
    logEv(uid, lab + " repaired", "good");
  }
  shipCommit();
}
// one tap per attack that hit the Bridge, however its damage was entered
const bridgeHitsNow = S => (S.bhit && S.bhit.k === turnKeyNow2()) ? S.bhit.n : 0;
function bridgeDamagedNow(uid) {
  return turn.log.some(e => e.u === uid && e.key === "ship:bridge" && e.r === turn.round && e.p === turn.phase && e.n > 0);
}
function shipBridgeHit(dir) {
  if (!CUR || !isShip(U) || !mpSheetCanEdit()) return;
  const st = CUR.st, S = st.ship, uid = CUR.uid, key = turnKeyNow2();
  if (!S.bhit || S.bhit.k !== key) S.bhit = { k: key, n: 0, prev: S.bridgeHit || 0, crew: [] };
  if (dir === "undo") {
    if (!S.bhit.n) return;
    S.bhit.n -= 1;
    S.crew = Math.min(U.crew, S.crew + (S.bhit.crew.pop() || 0));
    if (!S.bhit.n) S.bridgeHit = S.bhit.prev;
    if (!unlog(uid, "bhit:" + key + ":" + (S.bhit.n + 1))) logEv(uid, "Bridge hit undone", "info");
    return shipCommit();
  }
  if (st.hp.hull === 0) return;
  const lost = Math.min(2, S.crew);
  S.crew -= lost; S.bhit.crew.push(lost); S.bhit.n += 1; S.bridgeHit = 2;
  logEv(uid, "Bridge hit" + (S.bhit.n > 1 ? " #" + S.bhit.n : "") + " \u2014 " + lost + " crew lost, \u22123 to the ship's rolls next turn", "bad", "bhit:" + key + ":" + S.bhit.n);
  shipCommit();
}
function shipCommit() { ap = CUR.st.ap; save(); draw(); }
function shipFire(i) {
  if (!CUR || !isShip(U) || !mpSheetCanEdit()) return;
  const st = CUR.st, S = st.ship, w = U.sw[i], uid = CUR.uid;
  if (st.hp.hull === 0) return;
  if (stanceOf(st) === "boost") { mpToast("Boost Stance: a Boosting warship fires none of its weapons this turn."); return; }
  if ((S.bridge === 0 && !w.indep) || S.sys[i] === 0) { mpToast(w.name + " is offline" + (S.sys[i] > 0 ? " \u2014 no Bridge." : ".")); return; }
  if (S.cd[i] > 0) { mpToast(w.name + " is cooling down (" + S.cd[i] + " turn" + (S.cd[i] > 1 ? "s" : "") + ")."); return; }
  if (w.charges && !(S.ch[i] > 0)) { mpToast("No " + w.name + " charges left."); return; }
  if (st.ap < w.ap) { mpToast("Not enough AP."); return; }
  st.ap -= w.ap;
  if (w.cd) { S.cd[i] = w.cd; S.cdFresh[i] = true; }   // sits out the next turn(s); counts down from the one after
  if (w.charges) S.ch[i] -= 1;
  logEv(uid, w.name + " fired (" + w.ap + " AP)" + (w.charges ? " — " + S.ch[i] + " charge" + (S.ch[i] === 1 ? "" : "s") + " left" : ""), "info");
  shipCommit();
}
function shipAbility(kind, dir) {
  if (!CUR || !isShip(U) || !mpSheetCanEdit()) return;
  const st = CUR.st, S = st.ship, uid = CUR.uid;
  if (kind === "launch") { if (st.hp.hull === 0) return; openLaunchPicker(); return; }
  if (kind === "dock") { if (dir === "undo") { cancelDock(); return; } if (st.hp.hull === 0) return; openDockPicker(); return; }
  if (kind === "decoy") {
    if (!(S.decoy && S.decoy.ch > 0)) { mpToast("Decoy balloons already used."); return; }
    if (st.ap < 1) { mpToast("Not enough AP."); return; }
    st.ap -= 1; S.decoy.ch = 0; S.decoy.left = 3;
    logEv(uid, "Decoy balloons released — write down the real ship (1–3)", "buff");
    return shipCommit();
  }
}
function shipStat(k, v) {
  if (!CUR || !isShip(U) || !mpSheetCanEdit()) return;
  const st = CUR.st, S = st.ship;
  if (k === "crew") { const was = S.crew; S.crew = Math.max(0, Math.min(U.crew, v)); if (was !== S.crew) aggDmg(CUR.uid, "ship:crew", "Crew", was - S.crew, S.crew, U.crew, "lost"); }
  if (k === "ap") st.ap = Math.max(0, Math.min(U.ap + 4, v));
  shipCommit();
}

// ---------- the sheet ----------
const SHIP_ROWS_W = [69.5, 74.65, 79.75, 84.55, 88.85];
const SHIP_HEX = [[62.6, "CREW"], [72.9, "AP"], [83.2, "MOVEMENT"]];   // box centre (label sits above), top to bottom
const SHIP_MOVE_Y = 92.8;
const SHIP_ROWS_A = [70.2, 75.35, 80.45, 85.2, 89.5];
function shipRingPos(u, k) {
  const b = u.box, w = u.aspect * b.h * 0.5625;           // model width in % of the sheet width
  const left = b.cx - w / 2;
  const [ix, iy] = u.rings[k];
  return [left + ix * w / 100, b.top + iy * b.h / 100];
}
function buildShipFrame() {
  const u = U, key = ["ship", u.id, sideKey(), (CUR && CUR.mark) || ""].join("|");
  const F = $("frame");
  $("sheet").dataset.side = sideKey();
  $("sheet").classList.add("shipsheet");
  if (key === frameKey && F.childElementCount) return;
  frameKey = key;
  F.innerHTML = "";
  const add = (cls, st, html) => { const d = document.createElement("div"); d.className = cls; if (st) Object.assign(d.style, st); if (html !== undefined) d.innerHTML = html; F.appendChild(d); return d; };
  const pc = v => v + "%";
  add("fbreath"); add("fbreath b2"); add("fgrid");
  add("fb tl"); add("fb tr"); add("fb bl"); add("fb br");
  add("fstripe", { left: "36%", top: "1cqw" }); add("fstripe", { left: "27%", bottom: "1.2cqw" });
  add("fdock l"); add("fdock r");
  // the ship wireframe
  const b = u.box, mwid = u.aspect * b.h * 0.5625;
  const mw = add("fmech fship", { left: pc(b.cx), top: pc(b.top), height: pc(b.h), width: mwid + "cqw" });
  const mi = document.createElement("canvas"); mi.className = "fmech-in"; mw.appendChild(mi);
  paintMech(mi, "ship-" + u.ship, sideKey());
  // rings, labels and HP captions
  const parts = ["hull", "bridge", "thr0", "thr1"].concat(u.sw.map(w => w.key));
  parts.forEach(k => {
    const [x, y] = shipRingPos(u, k);
    add("fret" + (k === "hull" ? " big" : ""), { left: pc(x), top: pc(y) });
    const wdef = u.sw.find(w => w.key === k);
    const lab = k === "hull" ? "HULL" : k === "bridge" ? "BRIDGE" : k === "thr0" ? "THRUSTER 1" : k === "thr1" ? "THRUSTER 2"
      : (wdef.ring || wdef.name.toUpperCase());
    const up = u.rings[k][2] === "b" ? false : y > 12;
    add("flbl flimb fshiplbl", { left: pc(x), top: pc(up ? y - (k === "hull" ? 7.6 : 6.4) : y + 6.6) }, lab);
    add("flbl fhp", { left: pc(x < 50 ? x - (k === "hull" ? 4.9 : 4.2) : x + (k === "hull" ? 4.9 : 4.2)), top: pc(y) }, "HP");
  });
  // section titles and panels
  add("fsec", { left: "23.2%", top: "57.4%" }, "<i></i>WEAPONS LIST<i></i>");
  add("fsec", { left: "74.2%", top: "57.9%" }, "<i></i>ABILITIES<i></i>");
  const table = (x0, x1, rows, cols, heads, nums, numX) => {
    const y0 = rows[0], yh = rows[1], H = rows[rows.length - 1] - y0;
    const t = add("ftbl", { left: pc(x0), top: pc(y0), width: pc(x1 - x0), height: pc(H) });
    const hd = document.createElement("div"); hd.className = "fhead"; hd.style.height = pc((yh - y0) / H * 100); t.appendChild(hd);
    rows.slice(2, -1).forEach(r => { const d = document.createElement("div"); d.className = "frow"; d.style.top = pc((r - y0) / H * 100); t.appendChild(d); });
    cols.forEach(c => { const d = document.createElement("div"); d.className = "fcol"; d.style.left = pc((c - x0) / (x1 - x0) * 100); t.appendChild(d); });
    heads.forEach(([hx, txt]) => add("flbl fth", { left: pc(hx), top: pc((y0 + yh) / 2) }, txt));
    nums.forEach((y, i) => add("flbl fnum", { left: pc(numX), top: pc(y) }, String(i + 1)));
  };
  table(5.3, 43.2, [62.3, 66.9, 72.1, 77.2, 82.3, 86.8, 90.9], [24.2, 29.9, 34.8],
    [[14.7, "WEAPON NAME"], [27.05, "DMG"], [32.35, "AP"], [39.0, "RANGE"]], SHIP_ROWS_W, 6.2);
  table(57.0, 94.8, [63.0, 67.5, 72.8, 77.9, 83.0, 87.4, 91.6], [76.0, 81.6],
    [[66.5, "SKILL"], [78.8, "AP"], [88.2, "COOLDOWN"]], SHIP_ROWS_A, 57.9);
  // crew / AP / movement
  SHIP_HEX.forEach(([y, t]) => {
    add("flbl fstatc", { left: "49.8%", top: pc(y - 4.4) }, t);
    add("fhex", { left: "49.8%", top: pc(y) });
  });
  // name panel + dial with the ship silhouette
  add("fname fshipname"); add("flbl fsub", { left: "69.6%", top: "4.9%" }, "SHIP //");
  const cx = 94.3, cy = 10.6;
  add("fdial o", { left: pc(cx), top: pc(cy) }); add("fdial i", { left: pc(cx), top: pc(cy) });
  add("fdial arc full", { left: pc(cx), top: pc(cy) });
  const pf = add("fport fshipport", { left: pc(cx), top: pc(cy) });
  const pim = document.createElement("img"); pim.alt = ""; pim.src = "img/portraits/" + u.portrait + ".webp"; pf.appendChild(pim);
  const mk = markOf(CUR);
  if (mk) { const pp = document.createElement("span"); pp.className = "mpip fp"; pp.style.setProperty("--pc", mk.c); pf.appendChild(pp); }
}
function drawShip() {
  const u = U, st = shipMigrate(u, CUR.st), S = st.ship;
  $("sheet").classList.remove("st-noattack", "sqcompact"); updateStanceBtn(); $("rulesBtn").style.display = "none";
  const boosting = stanceOf(st) === "boost";
  hp = st.hp; ap = st.ap; dodges = 0;
  const sheet = $("sheet");
  sheet.classList.add("shipsheet");
  // clear this sheet's own pieces AND anything a mobile suit sheet left behind (circles, MOVE/DODGE, stats, buff strip)
  [...sheet.querySelectorAll(".sx,.hp,.grp,.tog,.step,.wrow,.txt,.num,.wpip,.sendbtn,.lenttag,.podstate,.arcring,.arcrot,.qa,.aphit,.swapz,.hudwarn,.porthit")].forEach(n => n.remove());
  renderAmounts();
  $("uname").textContent = u.short;
  $("umeta").textContent = "Warship · " + u.dp.toLocaleString() + " DP";
  $("total").textContent = "HULL " + st.hp.hull + "/" + u.hull;
  const dead = st.hp.hull === 0;
  $("dead").style.display = dead ? "flex" : "none";
  $("dead").firstElementChild.textContent = "DESTROYED";
  const pc = v => v + "%";
  const add = (tag, cls, style, html) => { const e = el(tag, "sx " + cls, style); if (html !== undefined) e.innerHTML = html; sheet.appendChild(e); return e; };
  const colOf = (v, m) => v === 0 ? "#64748b" : v / m <= .34 ? "#ef4444" : v / m <= .67 ? "#f59e0b" : "#22c55e";
  // name panel text
  add("div", "sname", { left: "69.6%", top: "8.2%" }, u.short.toUpperCase());
  add("div", "sclass", { left: "69.6%", top: "13.4%" }, u.name.replace(u.short + "-class ", "").replace(u.short, "") + " · " + u.dp.toLocaleString() + " DP · " + (u.faction === "federation" ? "Federation" : "Spacenoid"));
  add("div", "sclass", { left: "69.6%", top: "16.6%" }, "HANGAR " + u.hangar + " · LAUNCH " + u.launches + "/TURN" + (u.base ? " · BASE T" + u.base : ""));
  // rings
  const parts = ["hull", "bridge", "thr0", "thr1"].concat(u.sw.map(w => w.key));
  parts.forEach(k => {
    const [x, y] = shipRingPos(u, k);
    const [v, m] = shipPartGet(u, st, k);
    const col = colOf(v, m);
    const r = add("div", "hp shp" + (k === "hull" ? " big" : "") + (m >= 100 ? " w3" : ""), { left: pc(x), top: pc(y), borderColor: col,
      background: v === 0 ? "rgba(100,116,139,.92)" : "rgba(255,255,255,.96)", color: v === 0 ? "#e2e8f0" : "#0f172a" });
    r.innerHTML = v + "<small>/" + m + "</small>";
    r.title = shipPartLabel(u, k) + " — tap to " + (mode === "repair" ? "repair" : "damage") + " " + amount;
    r.onclick = () => shipTap(k);
    const rep = S.rep && S.rep[k];
    if (v === 0 && k !== "hull") add("div", "stag " + (rep ? "rep" : "off"), { left: pc(x), top: pc(y + (k === "hull" ? 6 : 5.2)) },
      rep ? "\u21BB " + rep + "T" : "OFFLINE");
  });
  {
    // HIT button beside the Bridge ring: one tap per attack that hit the Bridge
    const [x, y] = shipRingPos(u, "bridge");
    const n = bridgeHitsNow(S), owed = !n && bridgeDamagedNow(CUR.uid) && !dead;
    const hx = x + (u.hitDx || 5.0), hy = y + (u.hitDy || 0);
    const hb = add("div", "bhit" + (n ? " on" : "") + (owed ? " owed" : "") + (dead ? " off" : ""), { left: pc(hx), top: pc(hy) },
      "<b>HIT</b>" + (n ? "<small>\u00d7" + n + "</small>" : "<small>\u22122 crew</small>"));
    hb.title = owed ? "The Bridge lost HP this turn \u2014 tap once for each attack that hit it" : "Tap once per attack that hit the Bridge: \u22122 crew and \u22123 to the ship's rolls next turn";
    hb.onclick = e => { e.stopPropagation(); shipBridgeHit(); };
    if (n) { const ub = add("div", "bhitu", { left: pc(hx + 3.4), top: pc(hy) }, "\u21B6"); ub.title = "Undo the last Bridge hit"; ub.onclick = e => { e.stopPropagation(); shipBridgeHit("undo"); }; }
    if (S.bridgeHit > 0) add("div", "hudwarn swarn", { left: pc(hx + (n ? 1.7 : 0)), top: pc(hy + 3.6) }, S.bridgeHit === 2 ? "\u22123 ROLLS NEXT TURN" : "\u22123 TO ROLLS");
  }
  if (S.decoy && S.decoy.left > 0) add("div", "hudwarn swarn good", { left: "30%", top: "55.2%" }, "\u25C8 DECOYS ACTIVE \u00b7 " + S.decoy.left + "T");
  // weapons list
  const bridgeDown = S.bridge === 0;
  u.sw.forEach((w, i) => {
    const y = SHIP_ROWS_W[i];
    const off = (bridgeDown && !w.indep) || S.sys[i] === 0 || dead;
    const nm = add("div", "sw-name" + (off ? " off" : ""), { left: "7.2%", top: pc(y) },
      '<b>' + (w.label || w.name) + '</b><span>' + (w.tech ? w.tech + " \u00b7 " : "") + w.arc + (w.charges ? " \u00b7 " + S.ch[i] + "/" + w.charges + " charges" : "") +
      (w.twoTargets && S.sys[i] <= SHIP_WEAPON_HP / 2 && S.sys[i] > 0 ? " \u00b7 <em>fires once only</em>" : "") + '</span>');
    nm.onclick = () => shipInfo(w, i);
    const halfed = w.twoTargets && S.sys[i] > 0 && S.sys[i] <= SHIP_WEAPON_HP / 2;
    add("div", "sw-cell" + (halfed ? " half" : ""), { left: "27.05%", top: pc(y) }, halfed ? w.dmgHalf : w.dmg);
    add("div", "sw-cell rng", { left: "39.0%", top: pc(y) }, w.range);
    const cd = S.cd[i] || 0, noCh = w.charges && !(S.ch[i] > 0);
    const b = add("div", "sw-ap" + (off ? " off" : cd ? " cd" : noCh ? " off" : ""), { left: "32.35%", top: pc(y) },
      off ? "\u2715" : cd ? "CD " + cd : noCh ? "0" : String(w.ap));
    b.title = off ? "Offline" : cd ? "Cooling down" : "Tap to fire (" + w.ap + " AP)";
    b.onclick = () => shipFire(i);
    if (off && !dead) add("div", "sw-flag", { left: "20.6%", top: pc(y) }, bridgeDown ? "NO BRIDGE" : "OFFLINE");
    else if (!dead && w.twoTargets && S.sys[i] <= SHIP_WEAPON_HP / 2) add("div", "sw-flag half", { left: "20.6%", top: pc(y) }, "FIRES ONCE");
  });
  // abilities
  const dcOn = shipDCActive(u, S);
  const ownTurn = turn.phase === "you";
  const reps = Object.keys(S.rep || {}).map(k => shipPartLabel(u, k).replace("Twin Mega Particle ", "") + " " + S.rep[k] + "T");
  const rows = {
    launch: { name: "Launch suits", sub: "up to " + u.launches + " per launch \u00b7 free Boost", ap: ownTurn ? "1" : "\u2014",
      cd: "ABOARD " + S.carry.length + "/" + u.hangar + (S.launched.some(d => d.key === turnKeyNow2()) ? " \u00b7 " + S.launched.filter(d => d.key === turnKeyNow2()).length + " OUT" : ""),
      act: ownTurn ? () => shipAbility("launch") : null, on: S.launched.some(d => d.key === turnKeyNow2()),
      undo: S.launched.some(d => d.key === turnKeyNow2()) ? () => undoLaunch() : null, undoSym: "\u21B6", undoTitle: "Undo the latest launch (AP back)",
      info: "Each launch costs the ship 1 AP and sends out up to " + u.launches + " suit" + (u.launches > 1 ? "s" : "") + " — the ship may pay again to launch more in the same turn. Launched suits keep all their AP, get Boost Stance movement for free (+10cm per AP) and may still attack this turn. A suit launched this turn can't dock until your next turn.\n\nTap the AP to choose who launches; \u21B6 undoes the latest launch.\n\nAboard now: " + (S.carry.length ? S.carry.map(unitLabel).join(", ") : "nobody") + "." },
    dock: { name: "Dock a suit", sub: "within 5cm \u00b7 aboard after enemy turn", ap: ownTurn ? "1" : "\u2014",
      cd: S.docking.length ? S.docking.map(d => unitLabel(d.uid)).join(", ").toUpperCase() : "\u2014",
      act: ownTurn ? () => shipAbility("dock") : null, undo: ownTurn && S.docking.length ? () => shipAbility("dock", "undo") : null, undoSym: "\u2715", undoTitle: "Cancel the latest dock",
      info: "The suit must be within 5cm of the ship; the ship pays 1 AP. The suit stays on the board until the opposing side's next turn has fully ended, then it is aboard.\n\nWhile docking it may Block and Rolled-Dodge but not use Free Dodges. A Called Shot that lands on its body, or a melee attack, cancels the dock (AP still spent)." },
    dc: { name: "Damage Control", sub: !u.dc ? "cruiser — no spare crew" : dcOn ? "crew 9+ \u00b7 2-turn repairs" : "crew 8 or less — stopped",
      ap: "\u2014", cd: !u.dc ? "NONE" : reps.length ? reps.join(" \u00b7 ") : dcOn ? "READY" : "OFFLINE", warn: u.dc && !dcOn,
      info: "While Crew HP is 9 or more, a Thruster, the Bridge or a weapon system knocked out comes back at full HP after 2 full turns. At 8 Crew HP or less, repairs stop and anything knocked out stays down. Hull damage never repairs.\n\nCruisers (1 squad, 8 Crew HP) can never run Damage Control." },
    base: { name: "Base of Operations", sub: "tier " + u.base + " module aboard", ap: "\u2014", cd: "TIER " + u.base,
      info: "This capital ship carries a tier-" + u.base + " Base of Operations module (campaign rules)." },
    decoy: { name: "Decoy Balloons", sub: "secretly pick the real ship (1–3)", ap: S.decoy && S.decoy.ch && ownTurn ? "1" : "\u2014",
      cd: S.decoy && S.decoy.left ? "ACTIVE " + S.decoy.left + "T" : S.decoy && S.decoy.ch ? "1 CHARGE" : "USED", act: ownTurn ? () => shipAbility("decoy") : null, on: S.decoy && S.decoy.left > 0,
      info: "1 AP, 1 charge per game. Write down a number from 1 to 3 — that's the real ship.\n\nAttackers more than 30cm away must name a number first; a wrong guess hits a balloon (attack wasted, AP spent). Within 30cm no guess is needed. Area attacks ignore the decoys. The balloons deflate after 3 full turns, or as soon as the real ship is identified within 30cm." },
    bridgehit: { name: "Bridge hit", sub: "2 crew lost \u00b7 −3 to own rolls", ap: "\u2014",
      cd: S.bridgeHit === 2 ? "NEXT TURN" : S.bridgeHit === 1 ? "THIS TURN" : "\u2014", warn: S.bridgeHit > 0,
      info: "Any hit on the Bridge (called or random) kills 2 crew straight away and gives −3 to all of the ship's own rolls for its following turn.\n\nEnter the damage on the Bridge ring as usual, then tap HIT beside the ring ONCE for that attack \u2014 however many taps the damage took. It glows amber if the Bridge lost HP this turn and no hit has been recorded yet. \u21B6 undoes a hit." },
    lockdown: { name: "Last Stand Lockdown", sub: "crew 8 or less + boarded", ap: "\u2014", cd: S.crew <= 8 ? "AT RISK" : "SAFE", warn: S.crew <= 8,
      info: "If the ship is down to 8 Crew HP or fewer and an enemy squad successfully boards, the ship goes fully inert — no movement, no weapons, skips its turns — while the boarding Firefight Clash lasts." },
  };
  u.abil.forEach((k, i) => {
    const R = rows[k], y = SHIP_ROWS_A[i];
    const nm = add("div", "sw-name ab" + (R.warn ? " warn" : ""), { left: "59.0%", top: pc(y) }, '<b>' + R.name + '</b><span>' + R.sub + '</span>');
    nm.onclick = () => showNotice(R.name, R.info);
    const a = add("div", "sw-ap ab" + (R.act ? "" : " na") + (R.on ? " on" : ""), { left: "78.8%", top: pc(y) }, R.ap);
    if (R.act) a.onclick = R.act;
    const c = add("div", "sw-cd" + (R.warn ? " warn" : "") + (R.undo ? " withbtn" : ""), { left: R.undo ? "86.9%" : "88.2%", top: pc(y) }, R.cd);
    if (R.undo) { const un = add("div", "sstep", { left: "93.1%", top: pc(y) }, R.undoSym || "\u2715"); un.title = R.undoTitle || ""; un.onclick = R.undo; }
  });
  // crew / AP / movement values
  const stepper = (y, val, max, k) => {
    const g = add("div", "grp sgrp", { left: "49.8%", top: pc(y) });
    const col = k === "crew" ? (val <= 8 && u.dc ? "#ef4444" : val < max ? "#f59e0b" : "#22c55e") : val === 0 ? "#64748b" : "#38bdf8";
    const m = el("div", "step show"); m.textContent = "\u2212"; m.style.borderColor = col; m.style.color = col; m.onclick = () => shipStat(k, val - 1);
    const n = el("div", "num"); n.style.borderColor = col; n.innerHTML = val + "<small>/" + max + "</small>";
    const p = el("div", "step show"); p.textContent = "+"; p.style.borderColor = col; p.style.color = col; p.onclick = () => shipStat(k, val + 1);
    g.append(m, n, p);
  };
  stepper(SHIP_HEX[0][0], S.crew, u.crew, "crew");
  stepper(SHIP_HEX[1][0], st.ap, u.ap, "ap");
  const mv = shipMove(u, S);
  add("div", "smove" + (mv.warn ? " warn" : "") + (boosting ? " boost" : ""), { left: "49.8%", top: pc(SHIP_HEX[2][0]) },
    (boosting && mv.txt.endsWith("cm") ? (parseFloat(mv.txt) + 10) + "cm" : mv.txt) + "<small>" + (boosting ? "boosted \u00b7 " : "") + mv.sub + "</small>");
  // MOVE: 1 AP per move, like the suit sheets
  const QT = sideKey() === "red"
    ? ["rgba(48,5,10,.5)", "rgba(48,5,10,.78)", "#ff4d5a", "#ffe4e6", "rgba(255,77,90,.24)", "#3a0509"]
    : ["rgba(6,30,78,.46)", "rgba(6,30,78,.72)", "#7dd3fc", "#e0f2fe", "rgba(125,211,252,.28)", "#082f49"];
  let qa = st.qa;
  if (!qa || !sameHalf(qa)) qa = st.qa = { r: turn.round, p: turn.phase, m: 0, d: 0 };
  const cm0 = S.thr.filter(v => v === 0).length >= 2 ? 0 : S.thr.some(v => v === 0) ? u.moveCm / 2 : u.moveCm;
  const cm = cm0 > 0 && boosting ? cm0 + 10 : cm0;
  if (boosting) add("div", "hudwarn swarn good", { left: "49.8%", top: "55.5%" }, "\u00BB BOOST \u2014 +10cm/AP \u00b7 NO WEAPONS THIS TURN");
  const cantMove = st.ap < 1 || cm === 0 || dead;
  const box = add("div", "qa sqa", { left: "49.8%", top: pc(SHIP_MOVE_Y) });
  ["--qa-bg", "--qa-bg-on", "--qa-ac", "--qa-tx", "--qa-glow", "--qa-dk"].forEach((k, j) => box.style.setProperty(k, QT[j]));
  const logMoves = () => qaLog(CUR.uid, "qa:m", qa.m, "Moved " + qa.m + "\u00d7 (" + (qa.m * cm) + "cm, " + qa.m + " AP)" + (S.bridge === 0 ? " \u2014 straight ahead" : ""));
  const mvb = el("div", "qab move" + (cantMove || turn.phase !== "you" ? " off" : ""));
  mvb.innerHTML = "<b>MOVE</b><small>" + (dead ? "destroyed" : cm === 0 ? "immobilised" : cm + "cm \u00b7 1 AP" + (S.bridge === 0 ? " \u00b7 straight" : "")) + "</small>";
  mvb.title = dead ? "The ship is destroyed" : cm === 0 ? "Both thrusters destroyed \u2014 the ship cannot move"
    : st.ap < 1 ? "No AP left" : S.bridge === 0 ? "No Bridge: the ship may only continue straight ahead"
    : turn.phase !== "you" ? "It's the enemy turn" : "Spend 1 AP to move up to " + cm + "cm";
  mvb.onclick = e => {
    e.stopPropagation();
    if (cantMove || !mpSheetCanEdit()) return;
    if (turn.phase !== "you") { mpToast("That can only be done on your own turn."); return; }
    qa.m += 1; st.ap -= 1; logMoves(); shipCommit();
  };
  const mu = el("div", "qau" + (qa.m ? "" : " hide"));
  mu.innerHTML = "<span>\u21B6</span>" + (qa.m ? "<small>\u00d7" + qa.m + "</small>" : "");
  mu.title = "Undo the last move (gives the AP back)";
  mu.onclick = e => { e.stopPropagation(); if (!qa.m || !mpSheetCanEdit()) return; qa.m -= 1; st.ap = Math.min(u.ap, st.ap + 1); logMoves(); shipCommit(); };
  box.append(mvb, mu);
  renderTurn();
  if (typeof mpSheetMode === "function") mpSheetMode();
}
function shipInfo(w, i) {
  const S = CUR.st.ship;
  $("popT").textContent = w.name;
  $("popK").textContent = "Weapon system \u00b7 " + S.sys[i] + "/" + SHIP_WEAPON_HP + " HP";
  $("popS").innerHTML = "<b>Arc</b> " + w.arc + " &nbsp; <b>Range</b> " + w.range + " &nbsp; <b>AP</b> " + w.ap + " &nbsp; <b>Damage</b> " + w.dmg +
    (w.cd ? " &nbsp; <b>Cooldown</b> " + w.cd + " turn" + (w.cd > 1 ? "s" : "") : "") + (w.charges ? " &nbsp; <b>Charges</b> " + S.ch[i] + "/" + w.charges : "");
  $("popB").textContent = w.note + "\n\nThe system has 20 HP and can only be hit with a Called Shot (+5). At 0 it is offline" + (U.dc ? " until Damage Control restores it." : " for the rest of the game.") +
    (w.indep ? "\n\nIndependent turrets: keeps firing even with the Bridge destroyed." : "\n\nNeeds the Bridge: offline while the Bridge is at 0.");
  $("pop").classList.add("on");
}

// ================= CARRIERS (cf8) =================
// Which suits are aboard which warship. Kept in the ship's own state (st.ship.carry / docking / launched), so it
// syncs with the ship and never needs another unit's lock — except when a destroyed carrier damages its passengers.
const turnKeyNow2 = () => turn.round + ":" + turn.phase;
function carrierState(uid) {
  for (const r of roster) {
    const u = unitById(r.id);
    if (!isShip(u) || !r.st || !r.st.ship) continue;
    const S = r.st.ship;
    if (Array.isArray(S.carry) && S.carry.includes(uid)) return { ship: r, u, state: "aboard" };
    if (Array.isArray(S.docking) && S.docking.some(d => d.uid === uid)) return { ship: r, u, state: "docking" };
    if (Array.isArray(S.launched) && S.launched.some(d => d.uid === uid && d.key === turnKeyNow2())) return { ship: r, u, state: "launched" };
  }
  for (const r of roster) {
    const u = unitById(r.id);
    if (!isGround(u) || !r.st || !r.st.gv || !Array.isArray(r.st.gv.carry)) continue;
    if (r.st.gv.carry.includes(uid)) return { ship: r, u, state: "aboard" };
  }
  return null;
}
const outOfPlay = uid => { const c = carrierState(uid); return !!c && (c.state === "aboard" || c.state === "docking"); };
const catapultActive = uid => { const c = carrierState(uid); return !!c && c.state === "launched" && turn.phase === "you"; };
const carriersInRoster = () => roster.filter(r => isShip(unitById(r.id)) && !isDead(r));
const suitsInRoster = () => roster.filter(r => unitTab(unitById(r.id)) === "suits");
function carrierTag(uid) {
  const c = carrierState(uid); if (!c) return "";
  const nm = c.u.short.toUpperCase();
  if (c.state === "aboard") return '<span class="cartag aboard">\u2693 ABOARD \u00b7 ' + nm + '</span>';
  if (c.state === "docking") return '<span class="cartag docking">\u2693 DOCKING \u2192 ' + nm + '</span>';
  return '<span class="cartag launched">\u{1F680} LAUNCHED \u00b7 +10cm/AP</span>';
}

// ---------- the load step (before a team with a carrier is confirmed) ----------
let loadPlan = null, loadSel = null, loadGo = null;
function confirmWithLoading(after) {
  const go = () => hangarGo(() => { confirmTeam(); if (after) after(); });
  const vehicles = () => (cargoVehicles().length && squadsInRoster().length) ? openVehicleLoad(go) : go();
  if (carriersInRoster().length && suitsInRoster().length) openLoadDialog(vehicles);
  else vehicles();
}
function openLoadDialog(go) {
  loadGo = go; loadPlan = {};
  const suitIds = new Set(suitsInRoster().map(r => r.uid)), used = new Set();
  carriersInRoster().forEach(r => {
    shipMigrate(unitById(r.id), r.st);
    loadPlan[r.uid] = (r.st.ship.carry || []).filter(x => suitIds.has(x) && !used.has(x) && used.add(x)).slice(0, unitById(r.id).hangar);
  });
  loadSel = carriersInRoster()[0].uid;
  let box = $("loadDlg");
  if (!box) { box = document.createElement("div"); box.id = "loadDlg"; document.body.appendChild(box); }
  renderLoad();
  box.classList.add("on");
}
function loadStatus() {
  const ships = carriersInRoster(), suits = suitsInRoster();
  const cap = ships.reduce((m, r) => m + unitById(r.id).hangar, 0);
  const need = Math.min(cap, suits.length);
  const have = Object.values(loadPlan).reduce((m, a) => m + a.length, 0);
  return { cap, need, have, ok: have === need };
}
function renderLoad() {
  const box = $("loadDlg"); if (!box) return;
  const ships = carriersInRoster(), suits = suitsInRoster(), st = loadStatus();
  const fac = side === "federation" ? "fed" : "spa";
  const where = uid => { for (const k in loadPlan) if (loadPlan[k].includes(uid)) return +k; return null; };
  box.className = "on " + fac;
  box.innerHTML =
    '<div class="ld-wrap">' +
      '<div class="ld-head"><div class="ld-step">DEPLOYMENT</div><h2>Load your carriers</h2>' +
        '<p>A side that fields a carrier <b>must load it to capacity</b> before deploying anything else. Suits aboard start in the hangar and are launched from the ship\'s sheet.</p></div>' +
      '<div class="ld-ships">' + ships.map(r => {
        const u = unitById(r.id), n = loadPlan[r.uid].length;
        return '<button class="ld-ship' + (r.uid === loadSel ? ' on' : '') + (n === u.hangar ? ' full' : '') + '" onclick="loadPick(' + r.uid + ')">' +
          '<img src="img/portraits/' + u.portrait + '.webp" alt="">' +
          '<span class="ld-sn">' + u.short + (ships.filter(x => x.id === r.id).length > 1 ? ' #' + copyIndex(r) : '') + '</span>' +
          '<span class="ld-cap">' + n + ' / ' + u.hangar + ' ABOARD</span>' +
          '<span class="ld-pips">' + Array.from({ length: u.hangar }, (_, i) => '<i class="' + (i < n ? 'on' : '') + '"></i>').join("") + '</span>' +
        '</button>';
      }).join("") + '</div>' +
      '<div class="ld-hint">Tap a suit to put it aboard the <b>' + unitById(roster.find(r => r.uid === loadSel).id).short + '</b> \u2014 tap again to take it off.</div>' +
      '<div class="ld-suits">' + suits.map(r => {
        const u = unitById(r.id), w = where(r.uid), ws = w !== null ? unitById(roster.find(x => x.uid === w).id) : null;
        return '<button class="ld-suit' + (w !== null ? (w === loadSel ? ' here' : ' other') : '') + '" onclick="loadTap(' + r.uid + ')">' +
          portraitHTML(u, null).replace('class="pt', 'class="pt ld-pt') +
          '<span class="ld-nm">' + unitLabel(r.uid) + '</span><span class="ld-tr">' + u.tier + ' \u00b7 ' + u.dp.toLocaleString() + ' DP</span>' +
          '<span class="ld-where">' + (ws ? '\u2693 ' + ws.short.toUpperCase() : 'ON THE BOARD') + '</span>' +
        '</button>';
      }).join("") + '</div>' +
      '<div class="ld-foot">' +
        '<span class="ld-msg' + (st.ok ? ' ok' : '') + '">' + (st.ok
          ? '\u2713 ' + st.have + ' suit' + (st.have === 1 ? '' : 's') + ' aboard' + (suits.length > st.have ? ' \u00b7 ' + (suits.length - st.have) + ' deploy on the board' : ' \u2014 nothing starts on the board')
          : 'Load ' + (st.need - st.have) + ' more suit' + (st.need - st.have === 1 ? '' : 's') + ' (' + st.have + ' / ' + st.need + ')') + '</span>' +
        '<button class="btn" onclick="loadAuto()">Auto-load</button>' +
        '<button class="btn" onclick="loadClear()">Clear</button>' +
        '<button class="btn" onclick="loadCancel()">\u2190 Back to roster</button>' +
        '<button class="btn pri' + (st.ok ? ' ready' : '') + '" onclick="loadConfirm()"' + (st.ok ? '' : ' disabled') + '>Confirm &amp; deploy \u25B8</button>' +
      '</div>' +
    '</div>';
}
window.loadPick = uid => { loadSel = uid; renderLoad(); };
window.loadTap = uid => {
  const cap = unitById(roster.find(r => r.uid === loadSel).id).hangar;
  const here = loadPlan[loadSel];
  if (here.includes(uid)) { loadPlan[loadSel] = here.filter(x => x !== uid); renderLoad(); return; }
  if (here.length >= cap) { mpToast("That hangar is full \u2014 take a suit off first, or pick another ship."); return; }
  Object.keys(loadPlan).forEach(k => { loadPlan[k] = loadPlan[k].filter(x => x !== uid); });
  loadPlan[loadSel].push(uid);
  renderLoad();
};
window.loadAuto = () => {
  Object.keys(loadPlan).forEach(k => loadPlan[k] = []);
  const suits = suitsInRoster().map(r => r.uid);
  carriersInRoster().forEach(r => { const cap = unitById(r.id).hangar; while (loadPlan[r.uid].length < cap && suits.length) loadPlan[r.uid].push(suits.shift()); });
  renderLoad();
};
window.loadClear = () => { Object.keys(loadPlan).forEach(k => loadPlan[k] = []); renderLoad(); };
window.loadCancel = () => { $("loadDlg").classList.remove("on"); loadGo = null; };
window.loadConfirm = () => {
  if (!loadStatus().ok) return;
  carriersInRoster().forEach(r => {
    const S = r.st.ship;
    S.carry = loadPlan[r.uid].slice(); S.launched = []; S.docking = [];
    S.aboard = S.carry.length;
  });
  save();
  $("loadDlg").classList.remove("on");
  const go = loadGo; loadGo = null;
  if (go) go();
};

// ---------- launching and docking from the ship's sheet ----------
function openLaunchPicker() {
  const st = CUR.st, S = st.ship, u = U, key = turnKeyNow2();
  if (turn.phase !== "you") { mpToast("Suits are launched on your own turn."); return; }
  if (!S.carry.length) { mpToast("No suits aboard to launch."); return; }
  if (st.ap < 1) { mpToast("Not enough AP."); return; }
  const pickSet = new Set();
  const draw2 = () => {
    $("pickT").textContent = "Launch from the " + u.short;
    $("pickS").innerHTML = "Choose up to <b>" + u.launches + "</b> suit" + (u.launches > 1 ? "s" : "") + ". Costs the ship <b>1 AP</b> for the whole launch \u2014 pay another AP to launch again this turn. " +
      "Launched suits keep all their AP, get <b>Boost movement for free (+10cm per AP)</b> and may still attack this turn.";
    const lst = $("picklist"); lst.innerHTML = "";
    S.carry.forEach(uid => {
      const r = roster.find(x => x.uid === uid); if (!r) return;
      const su = unitById(r.id), on = pickSet.has(uid);
      const d = el("div", "row" + (on ? " done" : ""));
      d.innerHTML = '<span class="tick' + (on ? ' on' : '') + '">\u2713</span>' + portraitHTML(su) +
        '<span style="min-width:0;flex:1"><div class="nm">' + unitLabel(uid) + '</div><div class="tr">' + su.tier + '</div></span>';
      d.onclick = () => {
        if (on) pickSet.delete(uid);
        else { if (pickSet.size >= u.launches) { mpToast("The " + u.short + " launches up to " + u.launches + " at a time \u2014 launch again (1 AP) for more."); return; } pickSet.add(uid); }
        draw2();
      };
      lst.appendChild(d);
    });
    $("pickExtra").innerHTML = "";
    const go = el("button", "btn pri" + (pickSet.size ? " ready" : ""));
    go.textContent = pickSet.size ? "Launch " + pickSet.size + " \u25B8" : "Pick a suit";
    go.disabled = !pickSet.size;
    go.onclick = () => {
      if (!pickSet.size) return;
      closePicker();
      const ids = [...pickSet];
      st.ap -= 1;
      S.carry = S.carry.filter(x => !pickSet.has(x));
      const batch = S.launched.filter(d => d.key === key).reduce((m, d) => Math.max(m, d.b || 1), 0) + 1;
      S.launched = S.launched.filter(d => d.key === key).concat(ids.map(uid => ({ uid, key, b: batch })));
      logEv(CUR.uid, "Launched " + ids.map(unitLabel).join(", ") + " (free Boost, may attack)", "buff");
      shipCommit();
    };
    $("pickExtra").appendChild(go);
    $("pickCancel").textContent = "Cancel";
    $("pick").classList.add("on");
  };
  draw2();
}
function undoLaunch() {
  const st = CUR.st, S = st.ship, key = turnKeyNow2();
  const mine = S.launched.filter(d => d.key === key); if (!mine.length) return;
  const last = mine.reduce((m, d) => Math.max(m, d.b || 1), 0);
  const back = mine.filter(d => (d.b || 1) === last);
  S.carry = S.carry.concat(back.map(d => d.uid));
  S.launched = S.launched.filter(d => !(d.key === key && (d.b || 1) === last));
  st.ap = Math.min(unitById(CUR.id).ap, st.ap + 1);
  logEv(CUR.uid, "Launch undone (" + back.map(d => unitLabel(d.uid)).join(", ") + ")", "info");
  shipCommit();
}
function openDockPicker() {
  const st = CUR.st, S = st.ship, u = U, key = turnKeyNow2();
  if (turn.phase !== "you") { mpToast("Docking is declared on your own turn."); return; }
  if (S.carry.length + S.docking.length >= u.hangar) { mpToast("The hangar is full."); return; }
  if (st.ap < 1) { mpToast("Not enough AP."); return; }
  const cands = suitsInRoster().filter(r => !isDead(r) && !carrierState(r.uid));   // launched this turn: can't dock until next turn
  $("pickT").textContent = "Dock a suit on the " + u.short;
  $("pickS").innerHTML = "The suit must be <b>within 5cm</b> of the ship; the ship pays <b>1 AP</b>. It stays on the board until the enemy's next turn has ended, then it's aboard. " +
    "While docking it may Block and Rolled-Dodge, but not use Free Dodges. A Called Shot on its body or a melee attack cancels the dock.";
  const lst = $("picklist"); lst.innerHTML = "";
  if (!cands.length) lst.innerHTML = '<div class="empty">No suits on the board can dock. (A suit launched this turn can\'t dock until your next turn.)</div>';
  cands.forEach(r => {
    const su = unitById(r.id), d = el("div", "row");
    d.innerHTML = portraitHTML(su) + '<span style="min-width:0;flex:1"><div class="nm">' + unitLabel(r.uid) + '</div><div class="tr">' + su.tier + '</div></span>';
    d.onclick = () => {
      closePicker();
      st.ap -= 1;
      S.launched = S.launched.filter(x => x.uid !== r.uid);
      S.docking.push({ uid: r.uid, key });
      logEv(CUR.uid, unitLabel(r.uid) + " docking \u2014 aboard after the enemy's next turn", "info");
      shipCommit();
    };
    lst.appendChild(d);
  });
  $("pickExtra").innerHTML = ""; $("pickCancel").textContent = "Cancel";
  $("pick").classList.add("on");
}
function cancelDock() {
  const st = CUR.st, S = st.ship; if (!S.docking.length) return;
  const d = S.docking.pop();
  if (d.key === turnKeyNow2()) { st.ap += 1; logEv(CUR.uid, "Docking undone (" + unitLabel(d.uid) + ")", "info"); }
  else logEv(CUR.uid, unitLabel(d.uid) + "'s dock was cancelled (AP stays spent)", "bad");
  shipCommit();
}

// ---------- a carrier destroyed with suits aboard ----------
const DISEMBARK = [
  { k: "x", lab: "1\u20133", txt: "Destroyed", dmg: null },
  { k: "h", lab: "4\u20138", txt: "Heavy \u2014 5 to all", dmg: 5 },
  { k: "l", lab: "9\u201314", txt: "Light \u2014 3 to all", dmg: 3 },
  { k: "c", lab: "15\u201320", txt: "Clean escape", dmg: 0 },
];
function openDisembark(shipR) {
  const S = shipR.st.ship, sname = unitById(shipR.id).short;
  const aboard = S.carry.slice();
  if (!aboard.length) return;
  const pick = {};
  aboard.forEach(uid => { const r = roster.find(x => x.uid === uid); if (r && unitById(r.id).tier === "Grunt") pick[uid] = "x"; });
  const draw3 = () => {
    $("pickT").textContent = "Emergency Disembark \u2014 " + sname;
    $("pickS").innerHTML = "The " + sname + " was destroyed with suits aboard. <b>Grunt-tier suits go down with it.</b> Every other suit rolls <b>1d20</b> \u2014 pick each result.";
    const lst = $("picklist"); lst.innerHTML = "";
    aboard.forEach(uid => {
      const r = roster.find(x => x.uid === uid); if (!r) return;
      const su = unitById(r.id), grunt = su.tier === "Grunt";
      const d = el("div", "row dsb");
      d.style.cursor = "default";
      d.innerHTML = portraitHTML(su) + '<span style="min-width:0;flex:1"><div class="nm">' + unitLabel(uid) + '</div><div class="tr">' +
        (grunt ? 'Grunt \u2014 destroyed automatically' : su.tier + ' \u2014 roll 1d20') + '</div></span>';
      if (!grunt) {
        const opts = el("span", "dsb-opts");
        DISEMBARK.forEach(o => {
          const b = el("button", "btn sm" + (pick[uid] === o.k ? " pri ready" : ""));
          b.innerHTML = '<b>' + o.lab + '</b> ' + o.txt;
          b.onclick = () => { pick[uid] = o.k; draw3(); };
          opts.appendChild(b);
        });
        d.appendChild(opts);
      }
      lst.appendChild(d);
    });
    const ready = aboard.every(uid => pick[uid]);
    $("pickExtra").innerHTML = "";
    const go = el("button", "btn pri" + (ready ? " ready" : ""));
    go.textContent = ready ? "Apply results \u25B8" : "Pick every result";
    go.disabled = !ready;
    go.onclick = () => { closePicker(); applyDisembark(shipR, pick); };
    $("pickExtra").appendChild(go);
    $("pickCancel").textContent = "Later";
    $("pick").classList.add("on");
  };
  draw3();
}
function applyDisembark(shipR, pick) {
  const S = shipR.st.ship;
  Object.keys(pick).forEach(k => {
    const uid = +k, r = roster.find(x => x.uid === uid); if (!r) return;
    const su = unitById(r.id), o = DISEMBARK.find(x => x.k === pick[k]);
    const before = JSON.parse(JSON.stringify(r.st.hp));
    const after = {};
    LIMB_ORDER.forEach(l => { after[l] = o.dmg === null ? 0 : Math.max(0, (before[l] || 0) - o.dmg); });
    const put = () => { const rr = roster.find(x => x.uid === uid); if (rr) Object.assign(rr.st.hp, after); };
    put();
    snaps[uid] = snapOf(r);
    damageUntick(uid);
    logEv(uid, "Emergency Disembark: " + o.txt + (o.dmg === null ? "" : " \u2014 ejected from the " + unitById(shipR.id).short), o.dmg === 0 ? "good" : "bad");
    if (typeof mpForeign === "function") mpForeign(uid, put, () => { const rr = roster.find(x => x.uid === uid); if (rr) Object.assign(rr.st.hp, before); }, "the disembark result was");
  });
  S.carry = []; S.docking = []; S.aboard = 0;
  logEv(shipR.uid, "Hangar emptied \u2014 survivors placed at the wreck", "info");
  save();
  if (CUR && $("s4").classList.contains("on")) draw(); else renderRoster();
}

// ================= GROUND VEHICLES (cf26 — stage 1) =================
// Rulebook Sections 13 / 13.5 / 13.7. Ground units cost no DP; each side is capped per type and at 8 vehicles overall.
// State: r.st.hp.hp (flat HP, both scales), r.st.ap, r.st.gv (armor, cooldowns, charges, hide, cargo, objective).
const GROUND_CAP = { tank: 2, car: 4, heli: 2, jet: 2, transport: 2, squad: 4 };
const GROUND_VEHICLE_CAP = 8;
const GV_TARGETS = {
  fire: [["Infantry Squad", "Squad Splash Table (d10)"], ["Ground vehicle", "6 dmg \u2014 armour-piercing"], ["Mobile suit", "2 dmg to all 6 locations"], ["Aircraft", "Cannot target at all"]],
  air:  [["Infantry Squad", "Squad Splash Table (d10)"], ["Ground vehicle", "3 dmg"], ["Aircraft", "3 dmg"], ["Mobile suit", "3 dmg to all 6 locations \u00b7 no Dodge"]],
};
const SPLASH_TABLE = "d10: 1\u20133 = 1 casualty \u00b7 4\u20136 = 2 \u00b7 7\u20138 = 3 \u00b7 9 = 4 \u00b7 10 = 5";
const GV_TYPES = {
  tank: { cls: "Tank", hp: 18, armor: 6, ap: 4, moveCm: 15, dodge: null, prox: 40, respawn: "base", cargo: 0, objective: true, targets: "fire",
    targetNote: "Fire Support hits friend and foe inside the radius. Aircraft are never affected.",
    gw: [
      { key: "fire", scale: "OVERMAP", name: "Fire Support", dmg: "per target", ap: 2, range: "60cm \u00b7 10cm AoE", cd: 0,
        note: "The Tank's only Overmap attack. Standard range-based to-hit. Everything inside the 10cm radius is a target, friend or foe. Effect by target: Infantry Squad \u2192 Squad Splash Table (" + SPLASH_TABLE + "); ground vehicle \u2192 6 damage (armour-piercing round); mobile suit \u2192 2 damage to all 6 locations; aircraft \u2192 cannot be targeted." },
      { key: "cannon", scale: "GROUND", name: "Main Cannon", dmg: "6", ap: 2, range: "10cm AoE", cd: 1,
        note: "Detailed Battle Map. 6 damage in a 10cm radius \u2014 kills any soldier outright, no Kevlar save. Rolled Dodge 4+ (1d6). 1 turn cooldown." },
      { key: "mg", scale: "GROUND", name: "Machine Gun", dmg: "8d6 \u00b7 3+", ap: 1, range: "60cm", cd: 0,
        note: "Detailed Battle Map. 8d6, 3+ to hit, 1 damage (2 on a 6, critical). Cannot damage Armor." },
    ] },
  car: { cls: "Car", hp: 8, armor: 3, ap: 3, moveCm: 25, dodge: 12, prox: 30, respawn: "base", cargo: 1, targets: null,
    targetNote: "The Car has no Overmap attack. A squad riding inside may still make its own Coordinated Strike out of the vehicle \u2014 that uses the squad's action and stats.",
    gw: [
      { key: "mg", scale: "GROUND", name: "Machine Gun", dmg: "8d6 \u00b7 3+", ap: 1, range: "60cm", cd: 0,
        note: "Detailed Battle Map. 8d6, 3+ to hit (a mounted gun is steadier than a soldier's), 1 damage (2 on a 6, critical). Cannot damage Armor." },
    ] },
  heli: { cls: "Helicopter", hp: 6, armor: 0, ap: 3, moveCm: 35, dodge: 14, prox: 40, respawn: "base", cargo: 1, targets: "air", overmapOnly: true,
    targetNote: "Air Support is always 3 damage \u2014 except Infantry Squads, which roll the Squad Splash Table.",
    gw: [
      { key: "air", scale: "OVERMAP", name: "Air Support", dmg: "3 \u00b7 per target", ap: 2, range: "15cm AoE", cd: 0,
        note: "Standard range-based to-hit, unlimited uses. 15cm radius. Infantry Squad \u2192 Squad Splash Table; ground vehicle 3; aircraft 3; mobile suit 3 to all 6 locations with no Dodge. Ground units use their normal Rolled Dodge." },
      { key: "strafe", scale: "GROUND CALL", name: "Strafe Run", dmg: "4", ap: 2, range: "20\u00d710cm", cd: 0, charges: 4,
        note: "Fly into range of an active ground engagement and spend 2 AP to grant it 1 Strafe charge (max 4). A 20\u00d710cm lane, 4 damage, not armour-piercing, Rolled Dodge 4+. In Quick Resolve a charge rolls the Squad Splash Table. The squad hit may fire back with a Rocket (Anti-Air Retaliation)." },
    ] },
  jet: { cls: "Jet", hp: 3, armor: 0, ap: 4, moveCm: 50, dodge: 10, prox: 30, respawn: "board edge", cargo: 0, targets: "air", overmapOnly: true,
    targetNote: "Air Support is always 3 damage \u2014 except Infantry Squads, which roll the Squad Splash Table. A missile barrage: mobile suits take 3 on every location.",
    gw: [
      { key: "air", scale: "OVERMAP", name: "Air Support", dmg: "3 \u00b7 per target", ap: 2, range: "10cm AoE", cd: 0,
        note: "Standard range-based to-hit, unlimited uses, armour-piercing. 10cm radius. Infantry Squad \u2192 Squad Splash Table; ground vehicle 3; aircraft 3; mobile suit 3 to all 6 locations with no Dodge." },
      { key: "bomb", scale: "GROUND CALL", name: "Bombing Run", dmg: "6", ap: 2, range: "10cm AoE", cd: 0, charges: 2,
        note: "Fly into range of an active ground engagement and spend 2 AP to grant it 1 Bombing charge (max 2). 10cm radius, 6 damage, no Kevlar, NO Rolled Dodge, armour-piercing (strips a Tank's 6 Armor in one pass). In Quick Resolve a charge rolls the Squad Splash Table. The squad hit may fire back with a Rocket." },
    ] },
  transport: { cls: "Transport Ship", hp: 20, armor: 0, ap: 3, moveCm: 20, dodge: 14, prox: 60, respawn: "board edge", cargo: 2, targets: null,
    targetNote: "No weapons \u2014 a delivery platform for boarding squads. Squads may disembark at any point, even mid-space, and continue on their own stats.",
    gw: [] },
};
const GV_MODELS = {
  federation: { tank: "Type 61", car: "Hover Truck", heli: "Gunperry", jet: "Federation Fighter", transport: "Columbus-class" },
  spacenoid: { tank: "Magella Attack", car: "Armored Car", heli: "Attack Helicopter", jet: "Dopp", transport: "Papua-class" },
};
const GV_ASPECT = { "fed-tank": 1.425, "spa-tank": 1.366, "fed-car": 1.824, "spa-car": 1.482, "fed-heli": 1.218, "spa-heli": 1.519,
  "fed-jet": 1.843, "spa-jet": 1.63, "fed-transport": 1.613, "spa-transport": 1.541 };
const GROUND_UNITS = [];
["federation", "spacenoid"].forEach(fac => {
  const sk = fac === "federation" ? "fed" : "spa";
  Object.keys(GV_TYPES).forEach(t => {
    const T = GV_TYPES[t];
    GROUND_UNITS.push(Object.assign({}, T, {
      id: "ground-" + t + "-" + sk, gtype: t, name: GV_MODELS[fac][t] + " (" + T.cls + ")", short: GV_MODELS[fac][t],
      faction: fac, tier: "Ground " + T.cls, dp: 0, type: "ground", move: T.moveCm + "cm", dodges: 0,
      kill: "hp", limb: { hp: T.hp }, abilities: [], weapons: [], shields: [],
      portrait: "../ground/" + sk + "-" + t, wire: "ground/wire-" + sk + "-" + t, aspect: GV_ASPECT[sk + "-" + t] || 1.5,
    }));
  });
});
const isGround = u => !!(u && u.type === "ground");
const isVehicle = u => isGround(u) && u.gtype !== "squad";

function gvFresh(u) {
  return { hp: { hp: u.hp }, dodges: 0, ap: u.ap, track: [], wpn: [], sh: [], shMax: [], shDown: [], pods: null, out: null, lent: [], risk: {},
    gv: { armor: u.armor, cd: u.gw.map(() => 0), cdFresh: u.gw.map(() => false), ch: u.gw.map(() => 0), hide: false, cargo: 0, carry: [], objective: false } };
}
function gvMigrate(u, st) {
  const f = gvFresh(u);
  if (!st.hp || typeof st.hp.hp !== "number") st.hp = f.hp;
  if (!st.gv || typeof st.gv !== "object") st.gv = f.gv;
  const G = st.gv;
  Object.keys(f.gv).forEach(k => { if (G[k] === undefined) G[k] = f.gv[k]; });
  ["cd", "cdFresh", "ch"].forEach(k => { if (!Array.isArray(G[k]) || G[k].length !== u.gw.length) G[k] = f.gv[k]; });
  ["track", "wpn", "sh", "shMax", "shDown", "lent"].forEach(k => { if (!Array.isArray(st[k])) st[k] = []; });
  if (typeof st.ap !== "number") st.ap = u.ap;
  st.dodges = 0;
  return st;
}
function gvAdvance(u, st) {
  gvMigrate(u, st);
  const G = st.gv;
  st.ap = u.ap;
  G.cd = G.cd.map((v, i) => { if (G.cdFresh[i]) { G.cdFresh[i] = false; return v; } return Math.max(0, (v || 0) - 1); });
  G.hide = false;                                    // Hide Stance is declared each turn
}
// roster limits: per type, and 8 vehicles overall
function groundCapCheck(u) {
  if (!isGround(u)) return null;
  const mine = roster.map(r => unitById(r.id)).filter(isGround);
  const sameType = mine.filter(x => x.gtype === u.gtype).length;
  if (sameType >= GROUND_CAP[u.gtype]) return "Only " + GROUND_CAP[u.gtype] + " " + u.cls + (GROUND_CAP[u.gtype] > 1 ? "s" : "") + " per side.";
  if (isVehicle(u) && mine.filter(isVehicle).length >= GROUND_VEHICLE_CAP) return "The vehicle limit is " + GROUND_VEHICLE_CAP + " per side (Cars, Tanks, Helicopters, Jets and Transport Ships together).";
  return null;
}
function groundCardsHTML() {
  const units = UNITS.filter(u => isGround(u) && u.faction === side);
  const fac = side === "federation" ? "fed" : "spa";
  const mine = roster.map(r => unitById(r.id)).filter(isGround);
  const vehicles = mine.filter(isVehicle).length;
  const card = u => {
    const n = mine.filter(x => x.id === u.id).length, cap = GROUND_CAP[u.gtype], full = n >= cap || vehicles >= GROUND_VEHICLE_CAP;
    const stat = (k, v) => '<div class="sc-st"><small>' + k + '</small><b>' + v + '</b></div>';
    return '<div class="shipcard gcard ' + fac + (n ? ' has' : '') + (full ? ' full' : '') + '" onclick="addUnit(\'' + u.id + '\');promptMarks(\'' + u.id + '\')">' +
      '<div class="sc-grid"></div><div class="sc-glow"></div>' +
      '<div class="sc-art' + (u.gtype === "squad" ? ' sq' : '') + '"><img src="img/ground/' + fac + '-' + (u.gtype === "squad" ? "rifleman" : u.gtype) + '.webp" alt="" loading="lazy" decoding="async"></div>' +
      '<div class="sc-info">' +
        '<div class="sc-class">' + u.cls + (u.overmapOnly ? ' \u00b7 Overmap only' : '') + '</div>' +
        '<div class="sc-name">' + u.short + '</div>' +
        '<div class="sc-stats">' + stat(u.gtype === "squad" ? "Soldiers" : "HP", u.hp) + (u.armor ? stat("Armor", u.armor) : '') + stat("AP", u.ap) + stat("Move", u.moveCm + "cm") +
          stat("Dodge", u.dodge ? u.dodge + "+" : "none") + (u.cargo ? stat("Squads", u.cargo) : '') + '</div>' +
        '<div class="sc-weap">' + (u.gtype === "squad" ? '<span>Coordinated Strike</span><span>Firefight Clash</span><span class="ab">Hide Stance</span>'
          : u.gw.length ? u.gw.map(w => '<span>' + w.name + '</span>').join("") : '<span class="ab">No weapons</span>') + '</div>' +
      '</div>' +
      '<div class="sc-foot">' +
        '<div class="sc-dp">FREE<small>0 DP</small></div>' +
        '<div class="sc-qty' + (full ? ' capped' : '') + '">' + n + ' / ' + cap + '</div>' +
        '<div class="sc-add">' + (full ? 'Limit reached' : '+ Add to force') + '</div>' +
      '</div></div>';
  };
  const typeCount = t => mine.filter(x => x.gtype === t).length;
  const chip = (t, lab) => { const n = typeCount(t), c = GROUND_CAP[t]; return '<span class="gcap-chip' + (n >= c ? ' full' : n ? ' some' : '') + '">' + lab + ' <b>' + n + ' / ' + c + '</b></span>'; };
  return '<div class="gcap2' + (vehicles >= GROUND_VEHICLE_CAP ? ' full' : '') + '">' +
      '<div class="gcap-main"><small>VEHICLE LIMIT</small><b>' + vehicles + '<i> / ' + GROUND_VEHICLE_CAP + '</i></b>' +
        '<span class="gcap-bar">' + Array.from({ length: GROUND_VEHICLE_CAP }, (_, k) => '<i class="' + (k < vehicles ? 'on' : '') + '"></i>').join("") + '</span>' +
        '<em>' + (vehicles >= GROUND_VEHICLE_CAP ? 'FULL \u2014 no more vehicles' : (GROUND_VEHICLE_CAP - vehicles) + ' left \u00b7 ground units cost no DP') + '</em></div>' +
      '<div class="gcap-types">' + chip("tank", "Tank") + chip("car", "Car") + chip("heli", "Helicopter") + chip("jet", "Jet") + chip("transport", "Transport") + chip("squad", "Infantry Squads") + '</div>' +
    '</div>' +
    '<div class="shipgrid">' + units.map(card).join("") +
    '</div>';
}

// ---------- the vehicle sheet ----------
function gvModelBox(u) {
  const h = 52, w = u.aspect * h * 0.5625;
  const maxW = 58;
  const scale = w > maxW ? maxW / w : 1;
  return { h: h * scale, w: w * scale, top: 4 + (52 - h * scale) / 2, cx: 34 };
}
function buildGroundFrame() {
  const u = U, key = ["ground", u.id, sideKey(), (CUR && CUR.mark) || ""].join("|");
  const F = $("frame");
  $("sheet").dataset.side = sideKey();
  $("sheet").classList.add("shipsheet");
  if (key === frameKey && F.childElementCount) return;
  frameKey = key;
  F.innerHTML = "";
  const add = (cls, st, html) => { const d = document.createElement("div"); d.className = cls; if (st) Object.assign(d.style, st); if (html !== undefined) d.innerHTML = html; F.appendChild(d); return d; };
  const pc = v => v + "%";
  add("fbreath"); add("fbreath b2"); add("fgrid");
  add("fb tl"); add("fb tr"); add("fb bl"); add("fb br");
  add("fstripe", { left: "36%", top: "1cqw" }); add("fstripe", { left: "27%", bottom: "1.2cqw" });
  add("fdock l"); add("fdock r");
  const b = gvModelBox(u);
  const mw = add("fmech fship", { left: pc(b.cx), top: pc(b.top), height: pc(b.h), width: b.w + "cqw" });
  const mi = document.createElement("canvas"); mi.className = "fmech-in"; mw.appendChild(mi);
  paintMech(mi, u.wire, sideKey());
  // HP (and Armor) rings on the model
  const rings = u.armor ? [["hp", 26, 34, "HP"], ["armor", 42, 34, "ARMOR"]] : [["hp", 34, 34, "HP"]];
  rings.forEach(([k, x, y, lab]) => {
    add("fret" + (k === "hp" ? " big" : ""), { left: pc(x), top: pc(y) });
    add("flbl flimb fshiplbl", { left: pc(x), top: pc(y - (k === "hp" ? 7.6 : 6.4)) }, k === "armor" ? "ARMOR <small>(GROUND)</small>" : "HP");
  });
  add("fsec", { left: "23.2%", top: "57.4%" }, "<i></i>WEAPONS<i></i>");
  add("fsec", { left: "74.2%", top: "57.9%" }, "<i></i>STATUS<i></i>");
  const table = (x0, x1, rows, cols, heads, nums, numX) => {
    const y0 = rows[0], yh = rows[1], H = rows[rows.length - 1] - y0;
    const t = add("ftbl", { left: pc(x0), top: pc(y0), width: pc(x1 - x0), height: pc(H) });
    const hd = document.createElement("div"); hd.className = "fhead"; hd.style.height = pc((yh - y0) / H * 100); t.appendChild(hd);
    rows.slice(2, -1).forEach(r => { const d = document.createElement("div"); d.className = "frow"; d.style.top = pc((r - y0) / H * 100); t.appendChild(d); });
    cols.forEach(c => { const d = document.createElement("div"); d.className = "fcol"; d.style.left = pc((c - x0) / (x1 - x0) * 100); t.appendChild(d); });
    heads.forEach(([hx, txt]) => add("flbl fth", { left: pc(hx), top: pc((y0 + yh) / 2) }, txt));
    nums.forEach((y, i) => add("flbl fnum", { left: pc(numX), top: pc(y) }, String(i + 1)));
  };
  table(5.3, 43.2, [62.3, 66.9, 72.1, 77.2, 82.3, 86.8, 90.9], [24.2, 29.9, 34.8],
    [[14.7, "WEAPON"], [27.05, "DMG"], [32.35, "AP"], [39.0, "RANGE"]], SHIP_ROWS_W, 6.2);
  table(57.0, 94.8, [63.0, 67.5, 72.8, 77.9, 83.0, 87.4, 91.6], [76.0, 81.6],
    [[66.5, "STATUS"], [78.8, "AP"], [88.2, "STATE"]], SHIP_ROWS_A, 57.9);
  GV_HEX.forEach(([y, t]) => { add("flbl fstatc", { left: "49.8%", top: pc(y - 4.4) }, t); add("fhex", { left: "49.8%", top: pc(y) }); });
  // target effects panel (right, under the name panel)
  add("ftbl gtarget", { left: "57%", top: "22.5%", width: "37.8%", height: "30.5%" });
  add("flbl fth", { left: "75.9%", top: "25%" }, u.targets === "fire" ? "FIRE SUPPORT \u2014 TARGET EFFECTS" : u.targets === "air" ? "AIR SUPPORT \u2014 TARGET EFFECTS" : "OVERMAP ATTACK");
  add("fname fshipname"); add("flbl fsub", { left: "69.6%", top: "4.9%" }, "GROUND //");
  const cx = 94.3, cy = 10.6;
  add("fdial o", { left: pc(cx), top: pc(cy) }); add("fdial i", { left: pc(cx), top: pc(cy) });
  add("fdial arc full", { left: pc(cx), top: pc(cy) });
  const pf = add("fport fshipport", { left: pc(cx), top: pc(cy) });
  const pim = document.createElement("img"); pim.alt = ""; pim.src = "img/portraits/" + u.portrait + ".webp"; pf.appendChild(pim);
  const mk = markOf(CUR);
  if (mk) { const pp = document.createElement("span"); pp.className = "mpip fp"; pp.style.setProperty("--pc", mk.c); pf.appendChild(pp); }
}
const GV_HEX = [[62.6, "AP"], [72.9, "MOVEMENT"], [83.2, "DODGE"]];
function gvCommit() { ap = CUR.st.ap; save(); draw(); }
function gvTap(k) {
  if (!CUR || !isGround(U) || !mpSheetCanEdit()) return;
  const st = CUR.st, G = st.gv, uid = CUR.uid;
  const max = k === "hp" ? U.hp : U.armor, cur = k === "hp" ? st.hp.hp : G.armor;
  const next = mode === "repair" ? Math.min(max, cur + amount) : Math.max(0, cur - amount);
  if (next === cur) return;
  if (k === "hp") st.hp.hp = next; else G.armor = next;
  aggDmg(uid, "gv:" + k, k === "hp" ? "HP" : "Armor", cur - next, next, max);
  if (k === "hp" && cur > 0 && next === 0) {
    logEv(uid, "DESTROYED \u2014 respawns from the " + U.respawn, "bad", "gv0");
    if (gvCarry(CUR).length) { const vr = CUR; setTimeout(() => openVehicleDisembark(vr), 60); }
  }
  if (k === "armor" && cur > 0 && next === 0) logEv(uid, "Armor stripped \u2014 any weapon can now hurt the HP", "bad");
  gvCommit();
}
function gvFire(i) {
  if (!CUR || !isGround(U) || !mpSheetCanEdit()) return;
  const st = CUR.st, G = st.gv, w = U.gw[i], uid = CUR.uid;
  if (st.hp.hp === 0) return;
  if (stanceOf(st) === "boost") { mpToast("Boost Stance: no attacks this turn."); return; }
  if (G.cd[i] > 0) { mpToast(w.name + " is cooling down."); return; }
  if (w.charges && G.ch[i] >= w.charges) { mpToast("All " + w.charges + " " + w.name + " charges have been granted."); return; }
  if (st.ap < w.ap) { mpToast("Not enough AP."); return; }
  st.ap -= w.ap;
  if (w.cd) { G.cd[i] = w.cd; G.cdFresh[i] = true; }
  if (w.charges) G.ch[i] += 1;
  logEv(uid, w.name + (w.charges ? " \u2014 1 charge granted to the ground engagement (" + G.ch[i] + "/" + w.charges + ")" : " fired (" + w.ap + " AP)"), "info");
  gvCommit();
}
function gvToggle(k, v) {
  if (!CUR || !isGround(U) || !mpSheetCanEdit()) return;
  const st = CUR.st, G = st.gv, uid = CUR.uid;
  if (k === "hide") { G.hide = !G.hide; logEv(uid, G.hide ? "Hide Stance \u2014 movement halved, no attacks, untargetable by mobile suits" : "Hide Stance off", G.hide ? "buff" : "info"); }
  if (k === "objective") {
    G.objective = !G.objective;
    if (G.objective) G.objName = (prompt("What is this objective? (e.g. Data core)", G.objName || "") || "").trim().slice(0, 24);
    logEv(uid, G.objective ? "\u{1F6A9} Carrying " + (G.objName || "the objective") : "Objective dropped", "info");
  }
  if (k === "cargo") G.cargo = Math.max(0, Math.min(U.cargo, G.cargo + v));
  if (k === "ap") st.ap = Math.max(0, Math.min(U.ap + 4, st.ap + v));
  if (k === "respawn") {
    if (!confirm("Respawn this " + U.cls + " at full strength from the " + U.respawn + "?")) return;
    CUR.st = gvFresh(U); CUR.st.ap = 0; logEv(uid, "Respawned from the " + U.respawn, "good");
    save(); openSheet(uid); return;
  }
  gvCommit();
}
function drawGround() {
  const u = U, st = gvMigrate(u, CUR.st), G = st.gv;
  $("sheet").classList.remove("st-noattack", "sqcompact"); updateStanceBtn(); $("rulesBtn").style.display = "none";
  const boosting = stanceOf(st) === "boost";
  hp = st.hp; ap = st.ap; dodges = 0;
  const sheet = $("sheet");
  sheet.classList.add("shipsheet");
  [...sheet.querySelectorAll(".sx,.hp,.grp,.tog,.step,.wrow,.txt,.num,.wpip,.sendbtn,.lenttag,.podstate,.arcring,.arcrot,.qa,.aphit,.swapz,.hudwarn,.porthit")].forEach(n => n.remove());
  renderAmounts();
  $("uname").textContent = u.short;
  $("umeta").textContent = u.cls + " \u00b7 no DP";
  $("total").textContent = "HP " + st.hp.hp + "/" + u.hp + (u.armor ? " \u00b7 ARMOR " + G.armor + "/" + u.armor : "");
  const dead = st.hp.hp === 0;
  $("dead").style.display = dead ? "flex" : "none";
  $("dead").firstElementChild.textContent = "DESTROYED";
  const pc = v => v + "%";
  const add = (tag, cls, style, html) => { const e = el(tag, "sx " + cls, style); if (html !== undefined) e.innerHTML = html; sheet.appendChild(e); return e; };
  const colOf = (v, m) => v === 0 ? "#64748b" : v / m <= .34 ? "#ef4444" : v / m <= .67 ? "#f59e0b" : "#22c55e";
  add("div", "sname" + (u.short.length > 11 ? " long" : ""), { left: "69.6%", top: "8.2%" }, u.short.toUpperCase());
  add("div", "sclass", { left: "69.6%", top: "13.4%" }, u.cls + " \u00b7 " + (u.faction === "federation" ? "Federation" : "Spacenoid") + " \u00b7 no DP");
  add("div", "sclass", { left: "69.6%", top: "16.6%" }, "TARGETABLE WITHIN " + u.prox + "CM" + (u.overmapOnly ? " \u00b7 OVERMAP ONLY" : ""));
  // rings
  const rings = u.armor ? [["hp", 26, 34], ["armor", 42, 34]] : [["hp", 34, 34]];
  rings.forEach(([k, x, y]) => {
    const v = k === "hp" ? st.hp.hp : G.armor, m = k === "hp" ? u.hp : u.armor, col = colOf(v, m);
    const r = add("div", "hp shp" + (k === "hp" ? " big" : ""), { left: pc(x), top: pc(y), borderColor: col,
      background: v === 0 ? "rgba(100,116,139,.92)" : "rgba(255,255,255,.96)", color: v === 0 ? "#e2e8f0" : "#0f172a" });
    r.innerHTML = v + "<small>/" + m + "</small>";
    r.title = (k === "hp" ? "HP (both scales)" : "Armor \u2014 Detailed Battle Map only; only Grenades / Rockets strip it") + " \u2014 tap to " + (mode === "repair" ? "repair" : "damage") + " " + amount;
    r.onclick = () => gvTap(k);
  });
  if (u.armor) add("div", "gnote", { left: "34%", top: "45.5%" }, "Armor exists on the Detailed Battle Map only \u2014 the Overmap uses the flat HP.");
  if (boosting) add("div", "hudwarn swarn good", { left: "34%", top: "51%" }, "\u00BB BOOST \u2014 +10cm/AP \u00b7 NO ATTACKS THIS TURN");
  // weapons
  if (!u.gw.length) add("div", "sw-name", { left: "7.2%", top: pc(SHIP_ROWS_W[0]) }, "<b>No weapons</b><span>delivery platform only</span>");
  u.gw.forEach((w, i) => {
    const y = SHIP_ROWS_W[i], cd = G.cd[i] || 0, used = w.charges ? G.ch[i] : 0;
    const off = dead || boosting || (w.charges && used >= w.charges);
    const nm = add("div", "sw-name" + (dead ? " off" : ""), { left: "7.2%", top: pc(y) },
      '<b>' + w.name + '</b><span><em class="gscale ' + (w.scale === "OVERMAP" ? "om" : "gd") + '">' + w.scale + '</em>' +
      (w.charges ? " \u00b7 " + used + "/" + w.charges + " charges granted" : "") + (w.cd ? " \u00b7 " + w.cd + "-turn cooldown" : "") + '</span>');
    nm.onclick = () => showNotice(w.name + " \u2014 " + w.scale, w.note);
    add("div", "sw-cell", { left: "27.05%", top: pc(y) }, w.dmg);
    add("div", "sw-cell rng", { left: "39.0%", top: pc(y) }, w.range);
    const b = add("div", "sw-ap" + (off ? " off" : cd ? " cd" : ""), { left: "32.35%", top: pc(y) }, off ? "\u2715" : cd ? "CD " + cd : String(w.ap));
    b.title = boosting ? "Boost Stance: no attacks this turn" : cd ? "Cooling down" : "Tap to use (" + w.ap + " AP)";
    b.onclick = () => gvFire(i);
  });
  // target effects
  const T = u.targets ? GV_TARGETS[u.targets] : null;
  const tb = add("div", "gtargets", { left: "58.2%", top: "28%" },
    (T ? '<table>' + T.map(([a, b2]) => '<tr><td>' + a + '</td><td>' + b2 + '</td></tr>').join("") + '</table>' : '') +
    '<p>' + u.targetNote + (T && T[0][1].indexOf("Splash") >= 0 ? ' <i>Splash: ' + SPLASH_TABLE + '</i>' : '') + '</p>');
  // status rows
  const rows = [];
  if (u.cargo) rows.push({ name: "Squads aboard", sub: (gvCarry(CUR).length ? gvCarry(CUR).map(unitLabel).join(", ") : "capacity " + u.cargo + " \u00b7 safe & untargetable"),
    ap: "+", act: () => gvEmbark(), cd: gvCarry(CUR).length + " / " + u.cargo, step: true,
    info: "Carries " + u.cargo + " Infantry Squad" + (u.cargo > 1 ? "s" : "") + ", safe and untargetable while aboard. If destroyed with squads inside: Emergency Disembark \u2014 roll 1d6 per living soldier, 4+ survives, 1\u20133 perishes; survivors are placed at the wreck. Tap + to embark a squad, \u21E9 to disembark one." });
  if (u.objective) rows.push({ name: G.objective && G.objName ? "\u{1F6A9} " + G.objName : "Objective", sub: "may carry the mission objective", ap: G.objective ? "ON" : "set", cd: G.objective ? "CARRYING" : "\u2014", act: () => gvToggle("objective"), on: G.objective,
    info: "A Tank cannot transport a squad, but may carry the mission objective itself (e.g. the person or item being secured)." });
  rows.push({ name: "Targeting", sub: "untargetable by suits unless one is within " + u.prox + "cm", ap: "\u2014", cd: (u.dodge ? "DODGE " + u.dodge + "+" : "NO DODGE"),
    info: "Untargetable by mobile suits by default \u2014 targetable only while an enemy mobile suit is within " + u.prox + "cm (proximity alone). " +
      (u.dodge ? "Rolled Dodge " + u.dodge + "+ against every attack, unlimited per turn. " : "No Rolled Dodge \u2014 its HP is its defence. ") +
      "Vulcans cannot be dodged. If both of this side's Comm Arrays are destroyed (2-turn blackout), it is targetable only if it also fired that turn." });
  rows.push({ name: dead ? "Respawn" : "Respawns from", sub: dead ? "back at full strength" : "when destroyed", ap: dead ? "\u21BB" : "\u2014", cd: u.respawn.toUpperCase(),
    act: dead ? () => gvToggle("respawn") : null, warn: dead,
    info: "Destroyed ground units come back: Infantry Squads, Cars, Tanks and Helicopters respawn from your base; Jets and Transport Ships from your board edge \u2014 never above the side's limits." });
  rows.slice(0, 5).forEach((R, i) => {
    const y = SHIP_ROWS_A[i];
    const nm = add("div", "sw-name ab" + (R.warn ? " warn" : ""), { left: "59.0%", top: pc(y) }, '<b>' + R.name + '</b><span>' + R.sub + '</span>');
    nm.onclick = () => showNotice(R.name, R.info);
    const a = add("div", "sw-ap ab" + (R.act ? "" : " na") + (R.on ? " on" : ""), { left: "78.8%", top: pc(y) }, R.ap);
    if (R.act) a.onclick = R.act;
    add("div", "sw-cd" + (R.warn ? " warn" : "") + (R.step ? " withbtn" : ""), { left: R.step ? "87.6%" : "88.2%", top: pc(y) }, R.cd);
    if (R.step) {
      const p = add("div", "sstep", { left: "93.1%", top: pc(y) }, "\u21E9"); p.title = "Disembark a squad"; p.onclick = () => gvDisembark();
    }
  });
  // AP / movement / dodge
  {
    const y = GV_HEX[0][0], g = add("div", "grp sgrp", { left: "49.8%", top: pc(y) }), col = st.ap === 0 ? "#64748b" : "#38bdf8";
    const m = el("div", "step show"); m.textContent = "\u2212"; m.style.borderColor = col; m.style.color = col; m.onclick = () => gvToggle("ap", -1);
    const n = el("div", "num"); n.style.borderColor = col; n.innerHTML = st.ap + "<small>/" + u.ap + "</small>";
    const p = el("div", "step show"); p.textContent = "+"; p.style.borderColor = col; p.style.color = col; p.onclick = () => gvToggle("ap", 1);
    g.append(m, n, p);
  }
  const cm = boosting ? u.moveCm + 10 : u.moveCm;
  add("div", "smove" + (boosting ? " boost" : ""), { left: "49.8%", top: pc(GV_HEX[1][0]) }, cm + "cm<small>" + (boosting ? "boosted \u00b7 per AP" : "per AP") + "</small>");
  add("div", "smove", { left: "49.8%", top: pc(GV_HEX[2][0]) }, (u.dodge ? u.dodge + "+" : "NONE") + "<small>" + (u.dodge ? "rolled \u00b7 unlimited" : "HP is its defence") + "</small>");
  // MOVE
  const QT = sideKey() === "red"
    ? ["rgba(48,5,10,.5)", "rgba(48,5,10,.78)", "#ff4d5a", "#ffe4e6", "rgba(255,77,90,.24)", "#3a0509"]
    : ["rgba(6,30,78,.46)", "rgba(6,30,78,.72)", "#7dd3fc", "#e0f2fe", "rgba(125,211,252,.28)", "#082f49"];
  let qa = st.qa;
  if (!qa || !sameHalf(qa)) qa = st.qa = { r: turn.round, p: turn.phase, m: 0, d: 0 };
  const cantMove = st.ap < 1 || dead;
  const box = add("div", "qa sqa", { left: "49.8%", top: pc(SHIP_MOVE_Y) });
  ["--qa-bg", "--qa-bg-on", "--qa-ac", "--qa-tx", "--qa-glow", "--qa-dk"].forEach((k, j) => box.style.setProperty(k, QT[j]));
  const logMoves = () => qaLog(CUR.uid, "qa:m", qa.m, "Moved " + qa.m + "\u00d7 (" + (qa.m * cm) + "cm, " + qa.m + " AP)");
  const mvb = el("div", "qab move" + (cantMove || turn.phase !== "you" ? " off" : ""));
  mvb.innerHTML = "<b>MOVE</b><small>" + (dead ? "destroyed" : cm + "cm \u00b7 1 AP") + "</small>";
  mvb.onclick = e => { e.stopPropagation(); if (cantMove || !mpSheetCanEdit()) return; if (turn.phase !== "you") { mpToast("That can only be done on your own turn."); return; } qa.m += 1; st.ap -= 1; logMoves(); gvCommit(); };
  const mu = el("div", "qau" + (qa.m ? "" : " hide"));
  mu.innerHTML = "<span>\u21B6</span>" + (qa.m ? "<small>\u00d7" + qa.m + "</small>" : "");
  mu.onclick = e => { e.stopPropagation(); if (!qa.m || !mpSheetCanEdit()) return; qa.m -= 1; st.ap = Math.min(u.ap, st.ap + 1); logMoves(); gvCommit(); };
  box.append(mvb, mu);
  renderTurn();
  if (typeof mpSheetMode === "function") mpSheetMode();
}

// ================= STANCES (cf29) =================
// One stance at a time (Section 9). Stealth is its own thing and never combines.
// Stored on the unit: r.st.stance = { k, r: round declared, key: "round:phase" declared } — so it syncs like any unit change.
const STANCES = {
  defense:   { name: "Defense",      icon: "\u{1F6E1}", cost: "FREE",       lasts: "until your next turn",
               eff: "If an enemy aims a ranged attack at an ally within 30cm, you may intercept it and take the hit instead.",
               trade: "An interceptor gets no Dodge of any kind. A Natural 20 can't be intercepted." },
  overwatch: { name: "Overwatch",    icon: "\u{1F441}", cost: "1 AP",       ap: 1, lasts: "until your next turn",
               eff: "Lock a ranged weapon on a straight line 10cm wide. An enemy moving through it takes a free reaction shot (normal roll, its distance at that moment).",
               trade: "Only pays off if someone actually crosses the line." },
  focus:     { name: "Focus",        icon: "\u25CE",    cost: "1 AP",       ap: 1, lasts: "until your next turn",
               eff: "Called Shots this turn ignore the +5 penalty.",
               trade: "No Dodge at all (Free or rolled) until your next turn." },
  boost:     { name: "Boost",        icon: "\u00BB",    cost: "FREE",       lasts: "this turn only",
               eff: "+10cm per AP of movement this turn.",
               trade: "No attacks at all this turn." },
  peek:      { name: "Peek & Shoot", icon: "\u2316",    cost: "WEAPON AP",  lasts: "one shot",
               eff: "From Cover, fire one shot with a standard weapon (no abilities). If the area is under enemy Overwatch, that unit may fire first at +3 to hit. Then you shoot with no penalty.",
               trade: "Your target may return fire for free at +3 — only if it was facing you." },
  stealth:   { name: "Stealth",      icon: "\u25D0",    cost: "TOGGLE",     lasts: "until switched off",
               eff: "Move a marker instead of the model; it has a detection radius. Stealth-tagged weapons fire from the marker; any other weapon reveals you for the rest of this turn and the whole enemy turn.",
               trade: "Movement capped at 2 AP per turn. Never combines with another stance." },
  hide:      { name: "Hide",         icon: "\u25D2",    cost: "FREE",       lasts: "this turn",
               eff: "Completely untargetable by mobile suits this turn, whatever the distance.",
               trade: "Movement halved, no attacks. Ground attacks (Coordinated Strike, Tank cannon, Firefight) still hit." },
};
function stanceList(u) {
  if (!u) return [];
  if (isShip(u)) return ["boost"];
  if (isGround(u)) return u.gtype === "squad" ? ["hide"] : ["boost"];
  const L = ["defense", "overwatch", "focus", "boost", "peek"];
  if ((u.abilities || []).some(a => a.fx && a.fx.stealth)) L.push("stealth");
  return L;
}
function stanceOf(st) {
  const s = st && st.stance; if (!s || !STANCES[s.k]) return null;
  if (s.k === "boost" || s.k === "hide") return s.key === turnKeyNow2() ? s.k : null;          // this turn only
  if (turn.phase === "you" && turn.round > s.r) return null;                                 // until your next turn
  return s.k;
}
function suitStealthIdx(u) { return (u && u.abilities || []).findIndex(a => a.fx && a.fx.stealth && a.kind === "toggle"); }
function suitStealthOn(u, st) { const i = suitStealthIdx(u); return i >= 0 && st && Array.isArray(st.track) && st.track[i] === 1; }
function stanceNow(r) {                       // what a roster row / enemy panel should show
  const u = unitById(r.id); if (!u || !r.st) return null;
  if (!isShip(u) && !isGround(u) && suitStealthOn(u, r.st)) return "stealth";
  return stanceOf(r.st);
}
function stanceTagHTML(k) { return k ? '<span class="sttag st-' + k + '">' + STANCES[k].icon + ' ' + STANCES[k].name.toUpperCase() + '</span>' : ''; }
// AP of the open unit, whatever kind it is
function stanceAP() { return (isShip(U) || isGround(U)) ? CUR.st.ap : ap; }
function stanceSpend(n) {
  if (isShip(U) || isGround(U)) { CUR.st.ap = Math.max(0, CUR.st.ap - n); ap = CUR.st.ap; }
  else ap = Math.max(0, ap - n);
}
function stanceCommit() {
  if (isShip(U)) return shipCommit();
  if (isGround(U)) return gvCommit();
  persist(); snaps[CUR.uid] = snapOf(CUR); draw(); save();
}
function setStance(k) {
  if (!CUR || !U || (typeof mpSheetCanEdit === "function" && !mpSheetCanEdit())) return;
  const D = STANCES[k], st = CUR.st, uid = CUR.uid;
  if (!stanceList(U).includes(k)) return;
  if (k === "peek") { closePicker(); showNotice("Peek & Shoot", "Requires the unit to be in Cover. Costs the equipped weapon's normal AP \u2014 spend it on the weapon as usual.\n\n1. If the area is under an enemy's Overwatch, that unit may fire first: its shot needs +3 to hit.\n2. Then you pick any target in your vision and fire one standard-weapon shot (no abilities) \u2014 no penalty.\n3. Return fire: your target may fire back for free at +3, but only if it was facing you. Shooting a target that faces away is safe from return fire."); return; }
  if (turn.phase !== "you") { mpToast("Stances are declared on your own turn."); return; }
  const stIdx = isShip(U) || isGround(U) ? -1 : suitStealthIdx(U);
  const stealthOn = stIdx >= 0 && track[stIdx] === 1;
  const cur = stanceOf(st);
  if (k === "stealth") {
    if (stIdx < 0) return;
    if (!stealthOn && cur) {                                    // Stealth replaces whatever stance was up
      if (STANCES[cur].ap && st.stance.key === turnKeyNow2()) ap = ap + STANCES[cur].ap;
      st.stance = null;
    }
    track[stIdx] = stealthOn ? 0 : 1;
    logEv(uid, stealthOn ? "Stealth Stance off" : "Stealth Stance on \u2014 move the marker, not the model", stealthOn ? "info" : "buff");
    closePicker(); stanceCommit(); return;
  }
  if (stealthOn) { mpToast("Stealth Stance is its own thing \u2014 switch Stealth off first."); return; }
  if (cur === k) {                                              // tap again: drop it
    if (D.ap && st.stance.key === turnKeyNow2()) { if (isShip(U) || isGround(U)) { CUR.st.ap += D.ap; ap = CUR.st.ap; } else ap += D.ap; }
    st.stance = null;
    unlog(uid, "stance:" + k) || logEv(uid, D.name + " Stance dropped", "info");
    closePicker(); stanceCommit(); return;
  }
  const refund = cur && STANCES[cur].ap && st.stance.key === turnKeyNow2() ? STANCES[cur].ap : 0;
  if ((D.ap || 0) > stanceAP() + refund) { mpToast("Not enough AP for " + D.name + " (" + D.ap + " AP)."); return; }
  if (refund) stanceSpend(-refund);
  if (cur) unlog(uid, "stance:" + cur);
  if (D.ap) stanceSpend(D.ap);
  st.stance = { k, r: turn.round, key: turnKeyNow2() };
  logEv(uid, D.name + " Stance" + (D.ap ? " (" + D.ap + " AP)" : "") + " \u2014 " + D.lasts, "buff", "stance:" + k);
  closePicker(); stanceCommit();
}
window.setStance = setStance;
window.openStances = () => {
  if (!CUR || !U) return;
  const list = stanceList(U), st = CUR.st;
  const cur = (!isShip(U) && !isGround(U) && suitStealthOn(U, { track })) ? "stealth" : stanceOf(st);
  $("pickT").textContent = "Stances \u2014 " + (U.short || U.name);
  $("pickS").innerHTML = "One stance at a time, declared on your own turn. Tap an active stance to drop it." +
    (turn.phase !== "you" ? " <b>It's the enemy turn</b> \u2014 you can read them, but not declare one now." : "");
  const lst = $("picklist"); lst.innerHTML = "";
  const grid = el("div", "stgrid");
  list.forEach(k => {
    const D = STANCES[k], on = cur === k;
    const c = el("button", "stcard st-" + k + (on ? " on" : ""));
    c.innerHTML = '<div class="stc-top"><span class="stc-ic">' + D.icon + '</span><b>' + D.name + '</b><em>' + D.cost + '</em></div>' +
      '<div class="stc-when">' + (on ? "\u2713 ACTIVE \u00b7 " : "") + D.lasts + '</div>' +
      '<p>' + D.eff + '</p><p class="stc-trade">' + D.trade + '</p>';
    c.onclick = () => setStance(k);
    grid.appendChild(c);
  });
  lst.appendChild(grid);
  $("pickExtra").innerHTML = ""; $("pickCancel").textContent = "Close";
  $("pick").classList.add("on");
};
function updateStanceBtn() {
  const b = $("stanceBtn"); if (!b) return;
  if (!CUR || !U) { b.style.display = "none"; return; }
  b.style.display = "";
  const k = (!isShip(U) && !isGround(U) && suitStealthOn(U, { track })) ? "stealth" : stanceOf(CUR.st);
  b.className = k ? "on st-" + k : "";
  b.innerHTML = k ? STANCES[k].icon + " " + STANCES[k].name.toUpperCase() : "STANCE";
  b.title = k ? STANCES[k].name + " Stance active \u2014 tap to change" : "Declare a stance";
}

// ================= INFANTRY SQUADS + QUICK RESOLVE (cf34) =================
// Rulebook 13.6 (squad, soldiers, items) and the Firefight Clash rules. A squad's health IS the number of living soldiers.
const SQ_ROLES = [
  { r: "rifleman", name: "Rifleman", n: 3, wpn: "Rifle, 3d6", line: "1 AP \u00b7 60cm \u00b7 3+ \u00b7 1 dmg (2 on a 6)" },
  { r: "mg", name: "Machine Gunner", n: 1, wpn: "Machine Gun, 8d6", line: "2 AP \u00b7 60cm \u00b7 4+ \u00b7 1 dmg (2 on a 6)", items: { nade: 2 } },
  { r: "sniper", name: "Sniper", n: 1, wpn: "Sniper Rifle 1d6 \u00b7 Pistol 2d6", line: "Sniper 2 AP, 30cm+, 3+ hit / 5+ crit, 4 / 8 dmg \u00b7 Pistol 1 AP, under 30cm, 3+" },
  { r: "armor", name: "Armor Unit", n: 1, wpn: "Riot Shield + Rocket Launcher", line: "Shield 3 Armor + 6 HP, mobile cover \u00b7 melee-immune \u00b7 1 AP to swap", items: { rocket: 2 }, shield: true, swap: ["Shield", "Rocket"] },
  { r: "shield", name: "Shield Unit", n: 1, wpn: "Riot Shield + SMG 3d6", line: "SMG 1 AP \u00b7 60cm \u00b7 4+ \u00b7 not melee-immune \u00b7 1 AP to swap", items: { flash: 2 }, shield: true, swap: ["Shield", "SMG"] },
  { r: "recon", name: "Recon", n: 1, wpn: "SMG, 3d6", line: "1 AP \u00b7 60cm \u00b7 4+ \u00b7 Knife 1 AP (3+ takedown) \u00b7 Stealth 10cm", items: { smoke: 2 } },
];
const SQ_ITEM = {
  nade:   { name: "Grenade",         icon: "\u2739", note: "20cm throw, 10cm radius, 3 damage to everyone inside (friend or foe). Rolled Dodge 4+." },
  rocket: { name: "Rocket Launcher", icon: "\u27B6", note: "60cm, 10cm radius, 3 damage to everyone inside. No Dodge. Armour-piercing." },
  flash:  { name: "Flashbang",       icon: "\u2726", note: "20cm throw, 10cm radius. Each soldier inside turns away (free, exposes back) or arm-blocks (4+)." },
  smoke:  { name: "Smoke Grenade",   icon: "\u25CC", note: "20cm throw, 15cm radius. Shooting into or through the cloud needs a natural 6." },
};
const FIREPOWER = hp => hp >= 7 ? 8 : hp >= 5 ? 7 : hp >= 3 ? 6 : hp >= 1 ? 5 : 0;
const MARGIN_TABLE = [[0, "No effect"], [1, "1 soldier suppressed"], ["2\u20133", "1 casualty"], [4, "1 casualty + 1 suppressed"], [5, "1 casualty + 2 suppressed"], ["6+", "2 casualties + 2 suppressed"]];
const MARGIN_FX = m => m <= 0 ? [0, 0] : m === 1 ? [0, 1] : m <= 3 ? [1, 0] : m === 4 ? [1, 1] : m === 5 ? [1, 2] : [2, 2];
const VOLLEY = n => n >= 2 && n <= 5 ? n + 1 : 0;   // Perfect Volley: a squad rolling 2–5 dice, every die a 6 (incl. suppressed squads down to 2 dice)
const QR_ITEMS = { fb: { name: "Flashbang", icon: "\u2726", max: 2 }, sm: { name: "Smoke Grenade", icon: "\u25CC", max: 1 }, gr: { name: "Grenade", icon: "\u2739", max: 1 } };
const STRIKE_TARGETS = [["Infantry Squad", "1 casualty (a sniper picking one off)"], ["Ground vehicle", "5 dmg (rockets)"], ["Mobile suit", "1 dmg to all 6 locations"], ["Aircraft", "3 dmg"]];

["federation", "spacenoid"].forEach(fac => {
  const sk = fac === "federation" ? "fed" : "spa";
  GROUND_UNITS.push({
    id: "ground-squad-" + sk, gtype: "squad", name: "Infantry Squad", short: "Infantry Squad", cls: "Infantry Squad",
    faction: fac, tier: "Ground Infantry", dp: 0, type: "ground", hp: 8, armor: 0, ap: 3, moveCm: 10, dodge: 10, prox: 20,
    respawn: "base", cargo: 0, targets: null, gw: [], move: "10cm", dodges: 0, kill: "hp", limb: { hp: 8 },
    abilities: [], weapons: [], shields: [], portrait: "../ground/" + sk + "-rifleman", wire: null, aspect: 1, sk,
  });
});
const isSquad = u => !!(u && u.type === "ground" && u.gtype === "squad");

function sqFresh(u) {
  const soldiers = [];
  SQ_ROLES.forEach(R => { for (let i = 0; i < R.n; i++) soldiers.push({ r: R.r, hp: 6, kev: 6 }); });
  return { hp: { hp: 8 }, dodges: 0, ap: u.ap, track: [], wpn: [], sh: [], shMax: [], shDown: [], pods: null, out: null, lent: [], risk: {},
    sq: { soldiers, shield: { armor: { a: 3, h: 6 }, shield: { a: 3, h: 6 } }, items: { nade: 2, rocket: 2, flash: 2, smoke: 2 },
      eq: { armor: 0, shield: 0 }, tab: "overmap",
      qr: { round: 1, supp: 0, next: 0, items: { fb: 2, sm: 1, gr: 1 }, my: "none", foe: "none", res: null, foeHp: 8, foeSupp: 0, sim: false, roll: null, obj: null } } };
}
function sqMigrate(u, st) {
  const f = sqFresh(u);
  if (!st.sq || !Array.isArray(st.sq.soldiers) || st.sq.soldiers.length !== 8) st.sq = f.sq;
  ["shield", "items", "eq", "qr"].forEach(k => { if (!st.sq[k]) st.sq[k] = f.sq[k]; });
  if (!st.sq.qr.items) st.sq.qr.items = f.sq.qr.items;
  st.sq.soldiers.forEach(x => sqSoldierFix(x));
  if (typeof st.ap !== "number") st.ap = u.ap;
  ["track", "wpn", "sh", "shMax", "shDown", "lent"].forEach(k => { if (!Array.isArray(st[k])) st[k] = []; });
  st.dodges = 0;
  sqSyncHP(st);
  return st;
}
const sqAlive = st => st.sq.soldiers.filter(s => s.hp > 0).length;
function sqSyncHP(st) { if (!st.hp) st.hp = {}; st.hp.hp = sqAlive(st); }
const sqRole = r => SQ_ROLES.find(x => x.r === r);
function sqLabel(st, i) {
  const s = st.sq.soldiers[i], R = sqRole(s.r);
  if (R.n === 1) return R.name;
  let k = 0; for (let j = 0; j <= i; j++) if (st.sq.soldiers[j].r === s.r) k++;
  return R.name + " #" + k;
}
function sqCommit() { sqSyncHP(CUR.st); ap = CUR.st.ap; save(); draw(); }
// a casualty on the squad: pick which soldier falls (players choose — Armor Unit / Recon never come back)
function sqCasualtyPicker(count, why, done) {
  const st = CUR.st, uid = CUR.uid;
  if (count <= 0 || !sqAlive(st)) { if (done) done(); return; }
  $("pickT").textContent = "Which soldier falls?" + (count > 1 ? " (" + count + " left)" : "");
  $("pickS").innerHTML = (why ? why + " " : "") + "The controlling player chooses. Armor Unit and Recon are capped at 1 per squad \u2014 once either dies, that role is gone for the rest of the game.";
  const lst = $("picklist"); lst.innerHTML = "";
  st.sq.soldiers.forEach((s, i) => {
    if (s.hp <= 0) return;
    const d = el("div", "row");
    d.innerHTML = '<span class="pt shipp gp"><img src="img/ground/' + U.sk + '-' + s.r + '.webp" alt=""></span><span style="min-width:0;flex:1"><div class="nm">' + sqLabel(st, i) + '</div><div class="tr">HP ' + s.hp + '/6 \u00b7 Kevlar ' + s.kev + '/6</div></span>';
    d.onclick = () => {
      const before = sqAlive(st);
      s.hp = 0; sqSyncHP(st);
      aggDmg(uid, "sq:hp", "Squad Health", before - sqAlive(st), sqAlive(st), 8, "lost");
      logEv(uid, sqLabel(st, i) + " is down", "bad");
      if (!sqAlive(st)) logEv(uid, "SQUAD WIPED OUT \u2014 respawns from base", "bad", "gv0");
      closePicker(); sqCommit();
      if (count > 1 && sqAlive(st)) setTimeout(() => sqCasualtyPicker(count - 1, why, done), 80); else if (done) done();
    };
    lst.appendChild(d);
  });
  $("pickExtra").innerHTML = ""; $("pickCancel").textContent = "Later";
  $("pick").classList.add("on");
}
function sqRevivePicker() {
  const st = CUR.st, uid = CUR.uid;
  const dead = st.sq.soldiers.map((s, i) => ({ s, i })).filter(x => x.s.hp <= 0 && !(sqRole(x.s.r).n === 1 && (x.s.r === "armor" || x.s.r === "recon")));
  if (!dead.length) { mpToast("No soldier can be restored (Armor Unit and Recon never come back)."); return; }
  $("pickT").textContent = "Restore a soldier"; $("pickS").innerHTML = "Undo a casualty entered by mistake.";
  const lst = $("picklist"); lst.innerHTML = "";
  dead.forEach(({ s, i }) => {
    const d = el("div", "row");
    d.innerHTML = '<span class="pt shipp gp"><img src="img/ground/' + U.sk + '-' + s.r + '.webp" alt=""></span><span style="min-width:0;flex:1"><div class="nm">' + sqLabel(st, i) + '</div><div class="tr">back at 6 HP</div></span>';
    d.onclick = () => { s.hp = 6; closePicker(); logEv(uid, sqLabel(st, i) + " restored", "good"); sqCommit(); };
    lst.appendChild(d);
  });
  $("pickExtra").innerHTML = ""; $("pickCancel").textContent = "Cancel";
  $("pick").classList.add("on");
}
window.sqPage = k => { if (!CUR || !isSquad(U)) return; sqSelState = null; CUR.st.sq.page = k; save(); draw(); };
const sqTabLocal = {};                                   // which tab each squad shows on THIS device
window.sqTab = t => { if (!CUR || !isSquad(U)) return; sqSelState = null; sqTabLocal[CUR.uid] = t; CUR.st.sq.tab = t; save(); draw(); };
window.sqPip = () => {
  if (!CUR || !mpSheetCanEdit()) return;
  if (mode === "repair") { sqRevivePicker(); return; }
  sqCasualtyPicker(Math.min(amount, sqAlive(CUR.st)), "");
};
window.sqSoldier = (i, what, j) => {
  if (!CUR || !mpSheetCanEdit()) return;
  const st = CUR.st, s = st.sq.soldiers[i], uid = CUR.uid, rep = mode === "repair";
  if (what === "hp" || what === "kev") {
    const was = s[what], before = sqAlive(st);
    s[what] = rep ? Math.min(6, was + amount) : Math.max(0, was - amount);
    if (s[what] === was) return;
    if (what === "hp") {
      aggDmg(uid, "sq:s" + i, sqLabel(st, i), was - s[what], s[what], 6);
      if (before !== sqAlive(st)) { logEv(uid, sqLabel(st, i) + (s.hp ? " is back" : " is down"), s.hp ? "good" : "bad"); if (!s.hp) aggDmg(uid, "sq:hp", "Squad Health", 1, sqAlive(st), 8, "lost"); }
    } else aggDmg(uid, "sq:k" + i, sqLabel(st, i) + " Kevlar", was - s.kev, s.kev, 6);
  } else if (what === "sha" || what === "shh") {
    const S = st.sq.shield[s.r], k = what === "sha" ? "a" : "h", max = k === "a" ? 3 : 6, was = S[k];
    S[k] = rep ? Math.min(max, was + amount) : Math.max(0, was - amount);
    if (S[k] === was) return;
    aggDmg(uid, "sq:" + s.r + k, sqLabel(st, i) + " shield " + (k === "a" ? "Armor" : "HP"), was - S[k], S[k], max);
  } else if (what === "item") {
    const it = st.sq.items, max = 2;
    it[j] = rep ? Math.min(max, it[j] + 1) : Math.max(0, it[j] - 1);
    logEv(uid, SQ_ITEM[j].name + (rep ? " restored" : " used") + " (" + it[j] + " left)", rep ? "info" : "buff");
  } else if (what === "swap") {
    if (st.ap < 1 && !rep) { mpToast("Swapping costs 1 AP."); return; }
    st.sq.eq[s.r] = st.sq.eq[s.r] ? 0 : 1; st.ap -= 1;
    logEv(uid, sqLabel(st, i) + " swaps to " + sqRole(s.r).swap[st.sq.eq[s.r]] + " (1 AP)", "info");
  }
  sqCommit();
};
window.sqStrike = () => {
  if (!CUR || !mpSheetCanEdit()) return;
  if (ffPinned(CUR.uid)) { mpToast("\u2694 Pinned in the engagement \u2014 this squad waits for its bout. It can still spend items in the breaks."); return; }
  const st = CUR.st;
  if (stanceOf(st) === "hide") { mpToast("Hide Stance: no attacks this turn."); return; }
  if (outOfPlay(CUR.uid)) { /* firing out of a vehicle is allowed */ }
  if (st.ap < 1) { mpToast("Not enough AP."); return; }
  st.ap -= 1; logEv(CUR.uid, "Coordinated Strike (1 AP)", "info"); sqCommit();
};
function ffPinned(uid) {
  if (!mpTeamMode()) return null;
  const f = ffForUid(uid, mpMyTeam());
  return f && f.eng && ffActive(f) && f.state !== "closed" && (!ffFightingNow(f, uid, mpMyTeam()) || f.state === "end" || f.state === "queued") ? f : null;
}
window.sqMoveSquad = d => {
  if (!CUR || !isSquad(U) || !mpSheetCanEdit()) return;
  if (d > 0 && ffPinned(CUR.uid)) { mpToast("\u2694 Pinned in the engagement \u2014 this squad can't move until its bout is done."); return; }
  const st = CUR.st, uid = CUR.uid, alive = sqAlive(st), apMax = alive === 1 ? 1 : U.ap, hiding = stanceOf(st) === "hide", cm = hiding ? 5 : 10;
  let qa = st.qa;
  if (!qa || !sameHalf(qa)) qa = st.qa = { r: turn.round, p: turn.phase, m: 0, d: 0 };
  if (d > 0) { if (st.ap < 1 || !alive || outOfPlay(uid) || turn.phase !== "you") return; qa.m += 1; st.ap -= 1; }
  else { if (!qa.m) return; qa.m -= 1; st.ap = Math.min(apMax, st.ap + 1); }
  qaLog(uid, "qa:m", qa.m, "Moved " + qa.m + "\u00d7 (" + (qa.m * cm) + "cm, " + qa.m + " AP)");
  sqCommit();
};
window.sqAP = v => { if (!CUR || !mpSheetCanEdit()) return; const st = CUR.st; st.ap = Math.max(0, Math.min(8, st.ap + v)); sqCommit(); };
window.sqRespawn = () => {
  if (!CUR || !mpSheetCanEdit()) return;
  if (!confirm("Respawn this squad at full strength from your base?")) return;
  const tab = CUR.st.sq.tab; CUR.st = sqFresh(U); CUR.st.ap = 0; CUR.st.sq.tab = tab;
  logEv(CUR.uid, "Squad respawned from base", "good"); save(); openSheet(CUR.uid);
};

// ---------- Quick Resolve (Firefight Clash) ----------
function qrDice(hp, supp) { return hp <= 0 ? 0 : hp === 1 ? 1 : Math.max(FIREPOWER(hp) - supp, 2); }
window.qrSet = (k, v) => {
  if (!CUR || !mpSheetCanEdit()) return;
  const q = CUR.st.sq.qr, uid = CUR.uid;
  if (k === "round") q.round = Math.max(1, Math.min(4, v));
  else if (k === "supp") q.supp = Math.max(0, Math.min(8, q.supp + v));
  else if (k === "next") q.next = Math.max(0, Math.min(8, q.next + v));
  else if (k === "foeHp") q.foeHp = Math.max(0, Math.min(8, q.foeHp + v));
  else if (k === "foeSupp") q.foeSupp = Math.max(0, Math.min(8, q.foeSupp + v));
  else if (k === "my" || k === "foe") { q[k] = v; q.res = null; }
  else if (k === "sim") { q.sim = !q.sim; q.roll = null; logEv(uid, q.sim ? "Firefight: simulated dice ON (both teams agreed)" : "Firefight: back to physical dice", "info"); }
  else if (k === "item") { const it = q.items; it[v] = mode === "repair" ? Math.min(QR_ITEMS[v].max, it[v] + 1) : Math.max(0, it[v] - 1); }
  else if (k === "nextRound") {
    if (q.round >= 4) { mpToast("That was round 4 \u2014 roll the Objective Clash or start a new bout."); return; }
    q.round += 1; q.supp = q.next; q.next = 0; q.my = "none"; q.foe = "none"; q.res = null; q.roll = null;
    logEv(uid, "Firefight round " + q.round + (q.supp ? " \u2014 " + q.supp + " of ours suppressed" : ""), "info");
  } else if (k === "newSeg") {
    q.round = 1; q.supp = 0; q.next = 0; q.my = "none"; q.foe = "none"; q.res = null; q.roll = null; q.obj = null;
    if (v === "engagement") { q.items = { fb: 2, sm: 1, gr: 1 }; logEv(uid, "New firefight engagement \u2014 items refilled", "info"); }
    else logEv(uid, "New 4-round firefight bout", "info");
  } else if (k === "forced") {
    if (q.items.fb < 1) { mpToast("No Flashbang left to force a re-engagement."); return; }
    q.items.fb -= 1; q.round = 1; q.supp = 0; q.next = 0; q.my = "none"; q.foe = "none"; q.res = null; q.roll = null; q.obj = null;
    logEv(uid, "Forced Re-Engagement \u2014 Flashbang spent, another 4-round bout", "buff");
  }
  sqCommit();
};
// reveal the two item calls and apply what lands on this squad
window.qrReveal = () => {
  if (!CUR || !mpSheetCanEdit()) return;
  const q = CUR.st.sq.qr, my = q.my, foe = q.foe, uid = CUR.uid, lines = [];
  if (my !== "none" && q.items[my] < 1) { mpToast("No " + QR_ITEMS[my].name + " left."); return; }
  if (my !== "none") q.items[my] -= 1;
  let ourCas = 0;
  if (my === "fb") lines.push(foe === "sm" ? "Your Flashbang was cancelled by their Smoke." : "Your Flashbang lands \u2014 3 of theirs are suppressed next round.");
  if (my === "sm") { if (foe === "gr") lines.push("Your Smoke was cancelled by their Grenade \u2014 your suppression stays."); else { lines.push("Your Smoke clears your suppression."); q.supp = 0; } }
  if (my === "gr") { if (foe === "fb") { lines.push("COUNTERED \u2014 flashed mid-throw, your Grenade drops at your own feet: 1 casualty to you."); ourCas += 1; } else lines.push("Your Grenade lands \u2014 1 guaranteed casualty on them."); }
  if (foe === "fb") { if (my === "sm") lines.push("Their Flashbang was cancelled by your Smoke."); else { lines.push("Their Flashbang lands \u2014 3 of yours are suppressed next round."); q.next = Math.min(8, q.next + 3); } }
  if (foe === "sm") lines.push(my === "gr" ? "Their Smoke was cancelled by your Grenade." : "Their Smoke clears their suppression.");
  if (foe === "gr") { if (my === "fb") lines.push("COUNTERED \u2014 their Grenade blows up on their own squad: 1 casualty to them."); else { lines.push("Their Grenade lands \u2014 1 casualty to you."); ourCas += 1; } }
  if (my === "none" && foe === "none") lines.push("No items this round.");
  q.res = lines;
  logEv(uid, "Items: you " + (my === "none" ? "none" : QR_ITEMS[my].name) + " vs them " + (foe === "none" ? "none" : QR_ITEMS[foe].name), "info");
  sqCommit();
  if (typeof qrFx === "function") qrFx(my, foe);
  if (ourCas) setTimeout(() => sqCasualtyPicker(ourCas, "Item result: " + ourCas + " casualty."), 400);
};
// optional simulated dice (both teams agreed)
window.qrRoll = () => {
  if (!CUR || !mpSheetCanEdit()) return;
  const st = CUR.st, q = st.sq.qr, uid = CUR.uid;
  const myN = qrDice(sqAlive(st), q.supp), foeN = qrDice(q.foeHp, q.foeSupp);
  const d = n => Array.from({ length: n }, () => 1 + Math.floor(Math.random() * 6));
  const score = a => a.reduce((m, v) => m + (v === 6 ? 2 : v >= 3 ? 1 : 0), 0);
  const mine = d(myN), theirs = d(foeN);
  const ms = score(mine), ts = score(theirs);
  const volley = a => a.length >= 2 && a.every(v => v === 6);
  const lms = a => a.length === 1 && a[0] === 6;
  let text = [], ourCas = 0, ourSupp = 0;
  if (volley(mine)) text.push("PERFECT VOLLEY \u2014 you destroy " + VOLLEY(mine.length) + " of theirs.");
  if (volley(theirs)) { text.push("THEIR PERFECT VOLLEY \u2014 you lose " + VOLLEY(theirs.length) + "."); ourCas += VOLLEY(theirs.length); }
  if (!volley(mine) && !volley(theirs)) {
    const m = ms - ts;
    if (m === 0) text.push("Tied " + ms + "\u2013" + ts + " \u2014 no effect.");
    else if (m > 0) { const [c, s2] = MARGIN_FX(m); text.push("You win by " + m + " \u2014 they take " + (c ? c + " casualt" + (c > 1 ? "ies" : "y") : "no casualties") + (s2 ? " + " + s2 + " suppressed" : "") + "."); }
    else { const [c, s2] = MARGIN_FX(-m); ourCas += c; ourSupp += s2; text.push("They win by " + (-m) + " \u2014 you take " + (c ? c + " casualt" + (c > 1 ? "ies" : "y") : "no casualties") + (s2 ? " + " + s2 + " suppressed" : "") + "."); }
  }
  if (lms(mine)) text.push("LAST MAN STANDING \u2014 your last soldier breaks contact and escapes.");
  if (lms(theirs)) text.push("Their last soldier breaks contact and escapes.");
  const ones = mine.filter(v => v === 1).length;
  if (ones) text.push(ones + " of your dice rolled a 1 \u2014 " + ones + " suppressed next round.");
  q.next = Math.min(8, q.next + ones + ourSupp);
  q.roll = { mine, theirs, ms, ts, text };
  logEv(uid, "Simulated firefight roll: " + ms + " vs " + ts, "info");
  sqCommit();
  if (ourCas) setTimeout(() => sqCasualtyPicker(Math.min(ourCas, sqAlive(st)), "Firefight result: " + ourCas + " casualt" + (ourCas > 1 ? "ies" : "y") + "."), 300);
};
window.qrObjective = () => {
  if (!CUR || !mpSheetCanEdit()) return;
  const st = CUR.st, q = st.sq.qr, mine = sqAlive(st), foe = q.foeHp;
  const r = () => 1 + Math.floor(Math.random() * 6);
  let a, b, tries = 0;
  do { const adv = mine - foe; a = r() + r() + Math.max(0, adv); b = r() + r() + Math.max(0, -adv); tries++; } while (a === b && tries < 20);
  q.obj = { a, b, win: a > b };
  logEv(CUR.uid, "Objective Clash: " + a + " vs " + b + " \u2014 " + (a > b ? "your squad secures the objective" : "the enemy secures the objective"), a > b ? "good" : "bad");
  sqCommit();
};

// ---------- the squad sheet ----------
function buildSquadFrame() {
  const u = U, key = ["squad", u.id, sideKey(), (CUR && CUR.mark) || ""].join("|");
  const F = $("frame");
  $("sheet").dataset.side = sideKey();
  $("sheet").classList.add("shipsheet");
  if (key === frameKey && F.childElementCount) return;
  frameKey = key; F.innerHTML = ""; sqSelState = null;
  const add = (cls, st, html) => { const d = document.createElement("div"); d.className = cls; if (st) Object.assign(d.style, st); if (html !== undefined) d.innerHTML = html; F.appendChild(d); return d; };
  add("fbreath"); add("fbreath b2"); add("fgrid");
  add("fb tl"); add("fb tr"); add("fb bl"); add("fb br");
  add("fstripe", { left: "36%", top: "1cqw" }); add("fstripe", { left: "27%", bottom: "1.2cqw" });
  add("fdock l"); add("fdock r"); add("fdock c");
  add("fname fshipname"); add("flbl fsub", { left: "69.6%", top: "4.9%" }, "GROUND // INFANTRY");
  const cx = 94.3, cy = 10.6;
  add("fdial o", { left: cx + "%", top: cy + "%" }); add("fdial i", { left: cx + "%", top: cy + "%" }); add("fdial arc full", { left: cx + "%", top: cy + "%" });
  const pf = add("fport fshipport sqport", { left: cx + "%", top: cy + "%" });
  const pim = document.createElement("img"); pim.alt = ""; pim.src = "img/portraits/" + u.portrait + ".webp"; pf.appendChild(pim);
  const mk = markOf(CUR);
  if (mk) { const pp = document.createElement("span"); pp.className = "mpip fp"; pp.style.setProperty("--pc", mk.c); pf.appendChild(pp); }
}
function drawSquad() {
  const u = U, st = sqMigrate(u, CUR.st), S = st.sq, q = S.qr, uid = CUR.uid;
  if (sqTabLocal[uid]) S.tab = sqTabLocal[uid];
  hp = st.hp; ap = st.ap; dodges = 0;
  const sheet = $("sheet");
  sheet.classList.add("shipsheet"); sheet.classList.remove("st-noattack"); updateStanceBtn();
  [...sheet.querySelectorAll(".sx,.hp,.grp,.tog,.step,.wrow,.txt,.num,.wpip,.sendbtn,.lenttag,.podstate,.arcring,.arcrot,.qa,.aphit,.swapz,.hudwarn,.porthit")].forEach(n => n.remove());
  renderAmounts();
  const alive = sqAlive(st), dead = alive === 0, hiding = stanceOf(st) === "hide";
  const apMax = alive === 1 ? 1 : u.ap;
  if (st.ap > apMax && turn.phase === "you") st.ap = apMax;
  $("uname").textContent = u.short;
  $("umeta").textContent = "Infantry \u00b7 no DP";
  $("total").textContent = "SQUAD " + alive + "/8";
  $("dead").style.display = dead ? "flex" : "none";
  $("dead").firstElementChild.textContent = "WIPED OUT";
  const compact = S.tab !== "overmap";
  $("rulesBtn").style.display = "flex";
  sheet.classList.toggle("sqcompact", compact);
  const box = el("div", "sx sqwrap"); sheet.appendChild(box);
  if (!compact) {
    const nm = el("div", "sx sname long"); nm.style.left = "69.6%"; nm.style.top = "8.2%"; nm.textContent = "INFANTRY SQUAD"; sheet.appendChild(nm);
    const c1 = el("div", "sx sclass"); c1.style.left = "69.6%"; c1.style.top = "13.4%"; c1.textContent = (u.faction === "federation" ? "Federation" : "Spacenoid") + " \u00b7 8 soldiers \u00b7 no DP"; sheet.appendChild(c1);
    const c2 = el("div", "sx sclass"); c2.style.left = "69.6%"; c2.style.top = "16.6%"; c2.textContent = "TARGETABLE WITHIN 20CM \u00b7 DODGE 10+"; sheet.appendChild(c2);
  }
  const tabs = [["overmap", "OVERMAP"], ["soldiers", "8 SOLDIERS"], ["qr", "QUICK RESOLVE"]];
  let h = '<div class="sqtabs">' + tabs.map(([k, t]) => '<button class="sqtab' + (S.tab === k ? ' on' : '') + '" onclick="sqTab(\'' + k + '\')">' + t + '</button>').join("") + '</div>';
  if (S.tab !== "qr" && mpTeamMode() && ffForUid(uid, mpMyTeam())) h += ffCardHTML();
  const cs = carrierState(uid);
  const pinned = typeof ffPinned === "function" ? ffPinned(uid) : null;
  if (pinned) h += '<div class="sqnote pinned">\u2694 Pinned in the ' + pinned.eng.aList.length + ' vs ' + pinned.eng.bList.length + ' engagement' + (pinned.eng.obj ? ' for \u{1F6A9} ' + pinned.eng.obj : '') +
    ' \u2014 waiting for its bout. No moving or strikes; it can still spend items in the breaks.</div>';
  if (cs && cs.state === "aboard") h += '<div class="sqnote">\u2693 Aboard the ' + cs.u.short + ' \u2014 safe and untargetable. Disembark from the vehicle\'s sheet.</div>';
  if (S.tab === "overmap") {
    h += S.holdsObj
      ? '<div class="sqnote objnote">\u{1F6A9} <b>Holds ' + (objName(S.holdsObj) || "the objective") + '</b>' + (S.holdsObj.vs ? ' \u2014 secured against ' + S.holdsObj.vs + (S.holdsObj.turn ? ' (turn ' + S.holdsObj.turn + ')' : '') : '') +
        '<button class="btn sm" onclick="sqObjective(true)">Rename</button>' +
        '<button class="btn sm" onclick="sqObjective(false)">Clear</button></div>'
      : '<div class="sqobjlink"><button class="linkbtn" onclick="sqObjective(true)">\u{1F6A9} Mark as holding the objective</button></div>';
    const pips = S.soldiers.map((s, i) => '<button class="sqpip' + (s.hp > 0 ? ' on' : '') + '" onclick="sqPip()" title="' + sqLabel(st, i) + '"><img src="img/ground/' + u.sk + '-' + s.r + '.webp" alt=""></button>').join("");
    h += '<div class="sqgrid om">' +
      '<div class="sqcard"><h4>SQUAD HEALTH <b>' + alive + ' / 8</b></h4><div class="sqpips">' + pips + '</div>' +
        '<p>Tap to record casualties (you choose who falls) \u00b7 Repair mode restores a soldier. At 1 soldier the squad drops to 1 AP.</p>' +
        '<div class="sqstats">' +
          '<div><small>AP</small><span class="sqstep"><button onclick="sqAP(-1)">\u2212</button><b>' + st.ap + '<i>/' + apMax + '</i></b><button onclick="sqAP(1)">+</button></span></div>' +
          '<div class="' + (hiding ? 'warn' : '') + '"><small>MOVE</small><b>' + (hiding ? 5 : 10) + 'cm</b><em>' + (hiding ? 'hiding \u00b7 halved' : 'per AP') + '</em></div>' +
          '<div><small>DODGE</small><b>10+</b><em>rolled</em></div>' +
          '<div><small>FIREPOWER</small><b>' + FIREPOWER(alive) + '</b><em>quick resolve</em></div>' +
        '</div>' +
        (dead ? '<button class="btn pri ready sqbig" onclick="sqRespawn()">\u21BB Respawn from base</button>' : '') +
      '</div>' +
      '<div class="sqcard"><h4>COORDINATED STRIKE <em>the only Overmap attack</em></h4>' +
        '<p><b>1 AP \u00b7 90cm</b> \u00b7 roll 1d6: <b>2+</b> under 30cm, <b>3+</b> at 30\u201360cm, <b>4+</b> at 60\u201390cm</p>' +
        '<table class="sqtbl">' + STRIKE_TARGETS.map(([a, b]) => '<tr><td>' + a + '</td><td>' + b + '</td></tr>').join("") + '</table>' +
        '<p class="warn">Cannot target an enemy squad within 30cm \u2014 that\'s a Firefight Clash instead.</p>' +
        '<button class="btn pri sqbig' + (hiding || dead || st.ap < 1 ? ' off' : '') + '" onclick="sqStrike()">FIRE \u2014 1 AP</button>' +
        (() => { const qa0 = st.qa && sameHalf(st.qa) ? st.qa.m : 0, cm = hiding ? 5 : 10, cant = st.ap < 1 || dead || outOfPlay(uid) || turn.phase !== "you";
          return '<div class="sqmoverow"><button class="btn sqbig sqmove' + (cant ? ' off' : '') + '" onclick="sqMoveSquad(1)">MOVE \u2014 ' + cm + 'cm \u00b7 1 AP' + (qa0 ? '<em>\u00d7' + qa0 + '</em>' : '') + '</button>' +
            (qa0 ? '<button class="btn squndo" onclick="sqMoveSquad(-1)" title="Undo the last move">\u21B6</button>' : '') + '</div>'; })() +
        (hiding ? '<p class="warn">Hide Stance: no attacks this turn \u2014 untargetable by mobile suits.</p>' : '') +
      '</div>' +
    '</div>';
  } else if (S.tab === "soldiers") {
    const bub = (v, m, kind, lab, act) => {
      const p = m ? Math.round(v / m * 100) : 0;
      const col = kind === "kev" ? "#38bdf8" : kind === "ar" ? "#e2e8f0" : kind === "sh" ? "#94a3b8"
        : v === 0 ? "#64748b" : p <= 34 ? "#ef4444" : p <= 67 ? "#f59e0b" : "#22c55e";
      return '<button class="sbub k-' + kind + (v === 0 ? ' zero' : '') + '" style="--p:' + p + ';--c:' + col + '" onclick="' + act + '" title="' + lab + ' \u2014 tap to ' + (mode === "repair" ? "repair" : "damage") + ' ' + amount + '">' +
        '<span class="sbub-in"><b>' + v + '</b><i>/' + m + '</i></span><small>' + lab + '</small></button>';
    };
    const page = S.page === 1 ? 1 : 0;
    const PAGES = [{ t: "RIFLEMEN & MG", idx: [0, 1, 2, 3] }, { t: "SPECIALISTS", idx: [4, 5, 6, 7] }];
    h += '<div class="sq3pages">' + PAGES.map((P, k) => {
      const up = P.idx.filter(x => S.soldiers[x].hp > 0).length;
      return '<button class="sq3pg' + (k === page ? ' on' : '') + '" onclick="sqPage(' + k + ')">' +
        '<span class="sq3pg-faces">' + P.idx.map(x => '<img class="' + (S.soldiers[x].hp > 0 ? '' : 'dead') + '" src="img/ground/' + u.sk + '-' + S.soldiers[x].r + '.webp" alt="">').join("") + '</span>' +
        '<span class="sq3pg-t"><b>' + P.t + '</b><small>' + up + ' / 4 standing</small></span></button>';
    }).join("") + '</div>';
    h += '<div class="sq3grid">' + PAGES[page].idx.map(i => {
      const s = S.soldiers[i], R = sqRole(s.r), down = s.hp <= 0, W = SW[s.w];
      const sst = s.stealth ? "stealth" : stanceOf({ stance: s.stance });
      const selK = sqSelState && sqSelState.i === i ? sqSelState.k : null;
      const bars = SQ_BARS(s).map(k => {
        const [lab, max] = SQ_BAR_META[k], v = sqBarVal(S, s, k), p = v / max;
        const col = k === "ap" ? "#a78bfa" : k === "kev" ? "#38bdf8" : k === "ar" ? "#e2e8f0" : k === "sh" ? "#94a3b8"
          : v === 0 ? "#64748b" : p <= .34 ? "#ef4444" : p <= .67 ? "#f59e0b" : "#22c55e";
        return '<button class="sbar' + (selK === k ? ' sel' : '') + '" style="--c:' + col + '" onclick="sqSel(' + i + ',\'' + k + '\')">' +
          '<span class="sbar-h"><b>' + lab + '</b><i>' + v + '/' + max + '</i></span>' +
          '<span class="sbar-t">' + Array.from({ length: max }, (_, x) => '<i class="' + (x < v ? 'on' : '') + '"></i>').join("") + '</span></button>';
      }).join("");
      const adj = selK ? '<div class="sq4-adj">' +
        '<button onclick="sqSelMove(-1)" title="Previous bar">\u25B2</button><button onclick="sqSelMove(1)" title="Next bar">\u25BC</button>' +
        '<button class="m" onclick="sqAdj(-1)">\u2212' + (selK === "ap" ? 1 : amount) + '</button><button class="p" onclick="sqAdj(1)">+' + (selK === "ap" ? 1 : amount) + '</button>' +
        '<button class="ok" onclick="sqSel(' + i + ',\'' + selK + '\')" title="Done">\u2713</button></div>' : '';
      const mv = sqCnt(s, "mv"), dg = sqCnt(s, "dg"), fr = sqCnt(s, "fr");
      const noFire = W.none || (W.charge && S.items[W.charge] < 1) || s.ap < W.ap;
      const kit = ROLE_KIT[s.r];
      const extras = (kit.t || []).map(k => SW_THROW[k].name.split(" ")[0] + " \u00d7" + S.items[k]).concat(W.charge ? [W.name.split(" ")[0] + " \u00d7" + S.items[W.charge]] : []).join(" \u00b7 ");
      return '<div class="sq3' + (down ? ' down' : '') + '">' +
        '<div class="sq3-art"><span class="sq3-role">' + R.name.toUpperCase() + '</span>' +
          '<button class="sq3-stance' + (sst ? ' on st-' + sst : '') + '" onclick="sqStances(' + i + ')" title="Stance">' + (sst ? SOLDIER_STANCES[sst].icon + '<small>' + SOLDIER_STANCES[sst].name.toUpperCase() + '</small>' : '\u25C8<small>STANCE</small>') + '</button>' +
          '<div class="sq4-bars">' + bars + '</div>' +
          '<img src="img/ground/' + u.sk + '-' + s.r + '.webp" alt="">' + (down ? '<span class="sq3-kia">KIA</span>' : '') + adj + '</div>' +
        '<div class="sq3-name"><b>' + sqLabel(st, i) + '</b></div>' +
        '<div class="sq3-btns">' +
          '<button class="sq3b move' + (s.ap < 1 ? ' off' : '') + '" onclick="sqAct(' + i + ',\'move\')"><b>MOVE</b><small>10cm \u00b7 1 AP</small>' + (mv ? '<em>\u00d7' + mv + '</em>' : '') + '</button>' +
          '<button class="sq3b fire' + (noFire ? ' off' : '') + '" onclick="sqAct(' + i + ',\'fire\')"><b>FIRE</b><small>' + (W.none ? 'shield up' : W.react ? 'takedown' : W.ap + ' AP') + '</small>' + (fr ? '<em>\u00d7' + fr + '</em>' : '') + '</button>' +
        '</div>' +
        '<div class="sq3-undo"><span class="sq3-dodge" title="Blast dodge: roll 1d6, 4+ avoids an area attack. Rockets and Bombing Runs can\'t be dodged; bullets can\'t be dodged at all (Cover only).">BLAST DODGE 4+</span>' +
          (mv ? '<button onclick="sqAct(' + i + ',\'unmove\')">\u21B6 move</button>' : '') +
          '</div>' +
        '<button class="sq3-swap" onclick="sqWeapons(' + i + ')"><b>\u21C4 ' + W.name + '</b><small>' + (W.none ? 'no attack' : [W.dice, W.range, W.hit].filter(v => v && v !== "\u2014").join(' \u00b7 ')) + (extras ? ' \u00b7 ' + extras : '') + '</small></button>' +
      '</div>';
    }).join("") + '</div>' +
    '';
  } else {
    h += qrResourcesHTML(S);
    h += ffCardHTML();
    if (!mpTeamMode()) h += '<div class="ffcta"><b>Playing face to face</b><span>Fight the firefight at the table and tap the items above as you use them. For blind picks on each device, start an online session (PLAY ONLINE).</span></div>';
    h += '<div class="qr2">' +
      '<div class="qr2c"><h4>HOW A FIREFIGHT ROUND WORKS</h4><ol>' +
        '<li><b>Pick an item in secret</b> \u2014 Flashbang, Smoke Grenade, Grenade or none \u2014 and lock it in.</li>' +
        '<li><b>Reveal together.</b> Grenade = 1 casualty now. Smoke = clears your set-aside dice <em>for this roll</em>. Flashbang = the enemy rolls <em>3 fewer dice this round</em>.</li>' +
        '<li><b>Roll your dice</b> (the app tells you how many): 1 = that die is set aside next round \u00b7 2 = miss \u00b7 3\u20135 = 1 success \u00b7 6 = 2 successes.</li>' +
        '<li><b>Compare successes</b> \u2014 the loser takes the margin result. Record casualties, then ready up for the next round.</li></ol>' +
        '<p class="qrsmall">4 rounds per bout, then the Objective Clash. A squad with 2+ soldiers always rolls at least 2 dice. Items resupply only after a full turn aboard a carrier.</p></div>' +
      '<div class="qr2c"><h4>MARGIN TABLE <small>applied to the losing squad</small></h4>' +
        '<table class="sqtbl qrt">' + MARGIN_TABLE.map(([m, o]) => '<tr><td>' + m + '</td><td>' + o + '</td></tr>').join("") + '</table>' +
        '<p class="qrsmall"><b>Firepower:</b> 8\u20137 soldiers \u2192 8 dice \u00b7 6\u20135 \u2192 7 \u00b7 4\u20133 \u2192 6 \u00b7 2\u20131 \u2192 5. <b>Perfect Volley:</b> a squad rolling 2\u20135 dice that rolls all 6s skips the table and destroys 2d=3 \u00b7 3d=4 \u00b7 4d=5 \u00b7 5d=6 \u2014 this includes a suppressed squad down to 2 dice. Six or more dice cannot volley. <b>Last Man Standing:</b> a lone die rolling a 6 escapes.</p></div>' +
    '</div>';
  }
  box.innerHTML = h;
  renderTurn();
  if (typeof mpSheetMode === "function") mpSheetMode();
  if (typeof renderFF === "function") renderFF();
}

// the squad's Quick Resolve items, shown first on the tab (so players know what's left after a fight)
function qrResourcesHTML(S) {
  const q = S.qr || {}, it = q.items || { fb: 2, sm: 1, gr: 1 };
  const MAX = { fb: 2, sm: 1, gr: 1 };
  const NAMES = { fb: ["Flashbang", "enemy rolls 3 fewer dice \u00b7 forces a re-engagement"], sm: ["Smoke Grenade", "clears your set-aside dice \u00b7 counters a forced re-engagement"], gr: ["Grenade", "1 enemy casualty"] };
  const offline = !mpTeamMode();            // offline the fight happens at the table: the app just tracks what's used
  const tile = k => {
    const n = Math.max(0, it[k] || 0), m = MAX[k];
    const pips = Array.from({ length: m }, (_, i) => offline
      ? '<i class="' + (i < n ? 'on' : 'used') + '" role="button" title="' + (i < n ? 'Available' : 'Used \u2014 tap to restore') + '" onclick="event.stopPropagation();qrItemPip(\'' + k + '\',' + i + ')"></i>'
      : '<i class="' + (i < n ? 'on' : '') + '"></i>').join("");
    return '<div class="qrr-t' + (n ? '' : ' out') + (offline ? ' tap' : '') + '"' + (offline ? ' role="button" onclick="qrItemUse(\'' + k + '\')"' : '') + '><b class="ic">' + FF_ITEMS[k].i + '</b>' +
      '<span class="nm">' + NAMES[k][0] + '</span><span class="pp">' + pips + '</span>' +
      '<span class="ct">' + (n ? n + ' left' : 'none left') + '</span><small>' + (offline ? (n ? 'tap to use one' : 'all used \u2014 tap a crossed mark to restore') : NAMES[k][1]) + '</small></div>';
  };
  const f = mpTeamMode() && CUR ? ffForUid(CUR.uid, mpMyTeam()) : null;
  const sub = offline ? 'tap an item when you use it' : 'no refills \u2014 resupply by riding a vehicle';
  return '<div class="qrres"><h4>QUICK RESOLVE RESOURCES <small>' + sub + '</small>' +
    (offline ? '<button class="btn sm qrrefill" onclick="qrItemRefill()" title="Squads resupply by riding a vehicle">\u21BA Resupplied</button>' : '') + '</h4>' +
    '<div class="qrr-g">' + ["fb", "sm", "gr"].map(tile).join("") + '</div></div>';
}

// offline item tracking
const QR_MAX = { fb: 2, sm: 1, gr: 1 };
function qrItems() {
  const S = CUR.st.sq; S.qr = S.qr || {};
  if (!S.qr.items) S.qr.items = { fb: 2, sm: 1, gr: 1 };
  return S.qr.items;
}
window.qrItemUse = k => {
  if (!CUR || !CUR.st || !CUR.st.sq) return;
  const it = qrItems();
  if (!(it[k] > 0)) return;
  it[k] -= 1;
  logEv(CUR.uid, FF_ITEMS[k].n + " used (" + it[k] + " left)", "info");
  save(); draw();
};
window.qrItemPip = (k, i) => {
  if (!CUR || !CUR.st || !CUR.st.sq) return;
  const it = qrItems();
  if (i < (it[k] || 0)) { window.qrItemUse(k); return; }          // an available mark: use one
  it[k] = Math.min(QR_MAX[k], (it[k] || 0) + 1);                   // a crossed mark: restore one
  logEv(CUR.uid, FF_ITEMS[k].n + " restored (" + it[k] + " left)", "info");
  save(); draw();
};
window.qrItemRefill = () => {
  if (!CUR || !CUR.st || !CUR.st.sq) return;
  CUR.st.sq.qr = CUR.st.sq.qr || {};
  CUR.st.sq.qr.items = { fb: 2, sm: 1, gr: 1 };
  logEv(CUR.uid, "Items refilled for a new engagement", "info");
  save(); draw();
};

// ---------- squads riding in vehicles (Car 1 · Helicopter 1 · Transport Ship 2) ----------
const cargoVehicles = () => roster.filter(r => { const u = unitById(r.id); return isGround(u) && !isSquad(u) && u.cargo > 0 && !isDead(r); });
const squadsInRoster = () => roster.filter(r => isSquad(unitById(r.id)));
function gvCarry(r) { const G = r.st && r.st.gv; if (!G) return []; if (!Array.isArray(G.carry)) G.carry = []; return G.carry; }
let vloadPlan = null, vloadGo = null;
function openVehicleLoad(go) {
  vloadGo = go; vloadPlan = {};
  const sq = new Set(squadsInRoster().map(r => r.uid)), used = new Set();
  cargoVehicles().forEach(r => { vloadPlan[r.uid] = gvCarry(r).filter(x => sq.has(x) && !used.has(x) && used.add(x)).slice(0, unitById(r.id).cargo); });
  renderVehicleLoad();
}
function renderVehicleLoad() {
  const vs = cargoVehicles(), sqs = squadsInRoster();
  const where = uid => { for (const k in vloadPlan) if (vloadPlan[k].includes(uid)) return +k; return null; };
  $("pickT").textContent = "Load your vehicles";
  $("pickS").innerHTML = "Optional: put Infantry Squads into Cars (1), Helicopters (1) and Transport Ships (2). Squads aboard are safe and untargetable, and can disembark at any time from the vehicle's sheet. Tap a squad to cycle it through the vehicles.";
  const lst = $("picklist"); lst.innerHTML = "";
  vs.forEach(r => {
    const u = unitById(r.id), d = el("div", "row");
    d.innerHTML = portraitHTML(u) + '<span style="min-width:0;flex:1"><div class="nm">' + unitLabel(r.uid) + '</div><div class="tr">' + u.cls + ' \u00b7 ' + vloadPlan[r.uid].length + ' / ' + u.cargo + ' aboard' +
      (vloadPlan[r.uid].length ? ' \u2014 ' + vloadPlan[r.uid].map(unitLabel).join(", ") : '') + '</div></span>';
    lst.appendChild(d);
  });
  const sep = el("div", "vlsep"); sep.textContent = "SQUADS"; lst.appendChild(sep);
  sqs.forEach(r => {
    const w = where(r.uid), d = el("div", "row" + (w !== null ? " done" : ""));
    d.innerHTML = portraitHTML(unitById(r.id)) + '<span style="min-width:0;flex:1"><div class="nm">' + objTagFor(r.uid) + unitLabel(r.uid) + '</div><div class="tr">' + (w !== null ? '\u2693 aboard ' + unitLabel(w) : 'on the board') + '</div></span>';
    d.onclick = () => {                                   // cycle: board -> vehicle 1 -> vehicle 2 -> ... -> board
      const order = [null].concat(vs.map(v => v.uid));
      let k = order.indexOf(w);
      Object.keys(vloadPlan).forEach(v => vloadPlan[v] = vloadPlan[v].filter(x => x !== r.uid));
      for (let step = 1; step <= order.length; step++) {
        const nxt = order[(k + step) % order.length];
        if (nxt === null) break;
        if (vloadPlan[nxt].length < unitById(roster.find(x => x.uid === nxt).id).cargo) { vloadPlan[nxt].push(r.uid); break; }
      }
      renderVehicleLoad();
    };
    lst.appendChild(d);
  });
  $("pickExtra").innerHTML = "";
  const ok = el("button", "btn pri ready"); ok.textContent = "Confirm & deploy \u25B8";
  ok.onclick = () => {
    cargoVehicles().forEach(r => { r.st.gv.carry = vloadPlan[r.uid].slice(); r.st.gv.cargo = r.st.gv.carry.length; });
    save(); closePicker(); const g = vloadGo; vloadGo = null; if (g) g();
  };
  $("pickExtra").appendChild(ok);
  $("pickCancel").textContent = "Back";
  $("pick").classList.add("on");
}
window.gvEmbark = () => {
  if (!CUR || !isGround(U) || !mpSheetCanEdit()) return;
  const G = CUR.st.gv, carry = gvCarry(CUR);
  if (carry.length >= U.cargo) { mpToast("The " + U.short + " is full (" + U.cargo + " squad" + (U.cargo > 1 ? "s" : "") + ")."); return; }
  const cands = squadsInRoster().filter(r => !isDead(r) && !carrierState(r.uid));
  $("pickT").textContent = "Embark a squad"; $("pickS").innerHTML = "The squad must be at the vehicle. It becomes safe and untargetable while aboard.";
  const lst = $("picklist"); lst.innerHTML = cands.length ? "" : '<div class="empty">No squads on the board.</div>';
  cands.forEach(r => {
    const d = el("div", "row"); d.innerHTML = portraitHTML(unitById(r.id)) + '<span style="min-width:0;flex:1"><div class="nm">' + objTagFor(r.uid) + unitLabel(r.uid) + '</div><div class="tr">' + sqAlive(r.st) + ' / 8 soldiers</div></span>';
    d.onclick = () => { closePicker(); carry.push(r.uid); G.cargo = carry.length; logEv(CUR.uid, unitLabel(r.uid) + " embarked", "info"); gvCommit(); };
    lst.appendChild(d);
  });
  $("pickExtra").innerHTML = ""; $("pickCancel").textContent = "Cancel"; $("pick").classList.add("on");
};
window.gvDisembark = () => {
  if (!CUR || !isGround(U) || !mpSheetCanEdit()) return;
  const G = CUR.st.gv, carry = gvCarry(CUR);
  if (!carry.length) { mpToast("Nobody aboard."); return; }
  $("pickT").textContent = "Disembark a squad"; $("pickS").innerHTML = "Squads may disembark at any point and continue on their own stats.";
  const lst = $("picklist"); lst.innerHTML = "";
  carry.forEach(uid => {
    const r = roster.find(x => x.uid === uid); if (!r) return;
    const d = el("div", "row"); d.innerHTML = portraitHTML(unitById(r.id)) + '<span style="min-width:0;flex:1"><div class="nm">' + objTagFor(uid) + unitLabel(uid) + '</div><div class="tr">disembark here</div></span>';
    d.onclick = () => { closePicker(); G.carry = carry.filter(x => x !== uid); G.cargo = G.carry.length; logEv(CUR.uid, unitLabel(uid) + " disembarked", "info"); gvCommit(); };
    lst.appendChild(d);
  });
  $("pickExtra").innerHTML = ""; $("pickCancel").textContent = "Cancel"; $("pick").classList.add("on");
};
// a vehicle destroyed with squads aboard: 1d6 per living soldier, 4+ survives
function openVehicleDisembark(vr) {
  const carry = gvCarry(vr).slice(); if (!carry.length) return;
  const lost = {}; carry.forEach(uid => lost[uid] = 0);
  const drawV = () => {
    $("pickT").textContent = "Emergency Disembark \u2014 " + unitById(vr.id).short;
    $("pickS").innerHTML = "Roll <b>1d6 per living soldier</b> aboard: <b>4+</b> survives, 1\u20133 perishes. Set how many each squad lost (or roll here), then apply \u2014 you'll pick who fell. Survivors are placed at the wreck.";
    const lst = $("picklist"); lst.innerHTML = "";
    carry.forEach(uid => {
      const r = roster.find(x => x.uid === uid); if (!r) return;
      const n = sqAlive(r.st), d = el("div", "row");
      d.innerHTML = portraitHTML(unitById(r.id)) + '<span style="min-width:0;flex:1"><div class="nm">' + unitLabel(uid) + '</div><div class="tr">' + n + ' soldiers aboard</div></span>';
      const ctl = el("span", "sqstep");
      const m = el("button"); m.textContent = "\u2212"; m.onclick = () => { lost[uid] = Math.max(0, lost[uid] - 1); drawV(); };
      const b = el("b"); b.textContent = lost[uid] + " lost";
      const p = el("button"); p.textContent = "+"; p.onclick = () => { lost[uid] = Math.min(n, lost[uid] + 1); drawV(); };
      const rl = el("button", "btn sm"); rl.textContent = "\u{1F3B2} roll"; rl.onclick = () => { let k = 0; for (let i = 0; i < n; i++) if (1 + Math.floor(Math.random() * 6) <= 3) k++; lost[uid] = k; drawV(); };
      ctl.append(m, b, p, rl); d.appendChild(ctl); lst.appendChild(d);
    });
    $("pickExtra").innerHTML = "";
    const go = el("button", "btn pri ready"); go.textContent = "Apply \u25B8";
    go.onclick = () => {
      closePicker();
      vr.st.gv.carry = []; vr.st.gv.cargo = 0;
      logEv(vr.uid, "Squads aboard disembarked at the wreck", "info");
      save();
      const queue = carry.filter(uid => lost[uid] > 0);
      const next = () => {
        const uid = queue.shift(); if (uid == null) { renderRoster(); return; }
        const r = roster.find(x => x.uid === uid);
        const before = JSON.parse(JSON.stringify(r.st.sq.soldiers));
        const n = lost[uid];
        const apply = () => {                             // automatic casualties, riflemen first (adjust on the Soldiers tab)
          const rr = roster.find(x => x.uid === uid); if (!rr) return;
          sqMigrate(unitById(rr.id), rr.st);
          let k = n;
          ["rifleman", "mg", "sniper", "shield", "armor", "recon"].forEach(role => rr.st.sq.soldiers.forEach(s => { if (k > 0 && s.r === role && s.hp > 0) { s.hp = 0; k--; } }));
          sqSyncHP(rr.st);
        };
        apply();
        damageUntick(uid);
        logEv(uid, "Emergency Disembark: " + n + " soldier" + (n > 1 ? "s" : "") + " lost (riflemen first \u2014 adjust on the Soldiers tab)", "bad");
        if (typeof mpForeign === "function") mpForeign(uid, apply, () => { const rr = roster.find(x => x.uid === uid); if (rr) { rr.st.sq.soldiers = before; sqSyncHP(rr.st); } }, "the disembark losses were");
        next();
      };
      next();
    };
    $("pickExtra").appendChild(go); $("pickCancel").textContent = "Later"; $("pick").classList.add("on");
  };
  drawV();
}

// ---------- soldier card v3 (cf37): AP / MOVE / DODGE / FIRE / weapon list / per-soldier stance ----------
const SW = {
  rifle:  { name: "Rifle",           ap: 1, dice: "3d6", range: "60cm",           hit: "3+",            dmg: "1 (2 on a 6)" },
  mg:     { name: "Machine Gun",     ap: 2, dice: "8d6", range: "60cm",           hit: "4+",            dmg: "1 (2 on a 6)" },
  sniper: { name: "Sniper Rifle",    ap: 2, dice: "1d6", range: "30cm+ (no max)", hit: "3+ hit \u00b7 5+ crit", dmg: "4 \u00b7 8 on a crit", note: "No Kevlar save. The only weapon that reaches the far corners of a 1\u00d71m map." },
  pistol: { name: "Pistol",          ap: 1, dice: "2d6", range: "under 30cm",     hit: "3+",            dmg: "1 (2 on a 6)", note: "The Sniper's backup inside 30cm." },
  smg:    { name: "SMG",             ap: 1, dice: "3d6", range: "60cm",           hit: "4+",            dmg: "1 (2 on a 6)" },
  shield: { name: "Riot Shield",     ap: 0, none: true, dice: "\u2014", range: "\u2014", hit: "\u2014", dmg: "3 Armor + 6 HP",
            note: "Mobile cover: protects allies behind it along the shooter's line. Small arms can't damage its Armor \u2014 only Grenades and Rockets. A blast from the front is absorbed; flanks and rear bypass it. No attack while held." },
  rocket: { name: "Rocket Launcher", ap: 2, charge: "rocket", dice: "\u2014", range: "60cm \u00b7 10cm radius", hit: "\u2014", dmg: "3 to everyone inside",
            note: "No Dodge. Armour-piercing \u2014 damages vehicle Armor and shields. Friend or foe. Only 2 per Armor Unit." },
  knife:  { name: "Knife",           ap: 0, react: true, dice: "1d6", range: "melee", hit: "3+ takedown", dmg: "takedown",
            note: "When an enemy triggers Recon's Stealth reveal while the Knife is equipped: roll 3+ on 1d6 for a takedown. On a failure the target 'dodges' and may act freely. The attempt reveals Recon either way." },
};
const SW_THROW = {
  nade:  { name: "Grenade",       ap: 1, range: "20cm throw \u00b7 10cm radius", dmg: "3 to everyone inside", note: "Friend or foe. Rolled Dodge 4+. Damages vehicle Armor and shields." },
  flash: { name: "Flashbang",     ap: 1, range: "20cm throw \u00b7 10cm radius", dmg: "flash",
           note: "Everyone inside chooses: turn away (free, back exposed, can't fire outside the new facing arc until turning back) or arm-block (4+ on 1d6)." },
  smoke: { name: "Smoke Grenade", ap: 1, range: "20cm throw \u00b7 15cm radius", dmg: "cover", note: "Anyone shooting into or through the cloud needs a natural 6." },
};
const ROLE_KIT = {
  rifleman: { w: ["rifle"] }, mg: { w: ["mg"], t: ["nade"] }, sniper: { w: ["sniper", "pistol"] },
  armor: { w: ["shield", "rocket"] }, shield: { w: ["shield", "smg"], t: ["flash"] }, recon: { w: ["smg", "knife"], t: ["smoke"] },
};
const SOLDIER_STANCES = {
  overwatch: { name: "Overwatch", icon: "\u{1F441}", cost: "1 AP", ap: 1, lasts: "until your next turn",
               eff: "Watch a 10cm-wide line. Free reaction attack on an enemy that walks through it." },
  peek:      { name: "Peek & Shoot", icon: "\u2316", cost: "WEAPON AP", lasts: "one shot",
               eff: "Needs Cover. Your shot gets \u22121 to its hit number (Rifle 3+ \u2192 2+; Sniper hit 2+ / crit 4+). Return fire (only if the target faces you) needs +1 on every die." },
  defense:   { name: "Defense", icon: "\u{1F6E1}", cost: "FREE", lasts: "until your next turn",
               eff: "Protect an ally within 10cm: intercept an attack aimed at them and take the hit yourself (Block still works for the Armor Unit's shield)." },
  stealth:   { name: "Stealth", icon: "\u25D0", cost: "TOGGLE", lasts: "until switched off", recon: true,
               eff: "Recon becomes a marker (always visible). An enemy soldier within 10cm forces a reveal. Firing the SMG reveals you too." },
};
function sqSoldierFix(s) {
  const kit = ROLE_KIT[s.r];
  if (typeof s.ap !== "number") s.ap = 3;
  if (!s.w || !kit.w.includes(s.w)) s.w = kit.w[0];
  return s;
}
const sKey = () => turnKeyNow2();
function sqCnt(s, k) { return s[k] && s[k].key === sKey() ? s[k].n : 0; }
function sqBump(s, k, d) { const n = Math.max(0, sqCnt(s, k) + d); s[k] = { key: sKey(), n }; return n; }
window.sqAct = (i, what, arg) => {
  if (!CUR || !isSquad(U) || !mpSheetCanEdit()) return;
  const st = CUR.st, S = st.sq, s = sqSoldierFix(S.soldiers[i]), uid = CUR.uid, who = sqLabel(st, i), rep = mode === "repair";
  if (s.hp <= 0 && what !== "ap") { mpToast(who + " is down."); return; }
  const soldierStance = () => stanceOf({ stance: s.stance });
  if (what === "ap") { s.ap = Math.max(0, Math.min(3, s.ap + (rep ? 1 : -1))); }
  else if (what === "move") {
    if (turn.phase !== "you") { mpToast("That can only be done on your own turn."); return; }
    if (s.ap < 1) { mpToast(who + " has no AP left."); return; }
    s.ap -= 1; const n = sqBump(s, "mv", 1);
    qaLog(uid, "sq:mv" + i, n, who + " moved " + n + "\u00d7 (" + (n * 10) + "cm)");
  } else if (what === "unmove") {
    if (!sqCnt(s, "mv")) return;
    s.ap = Math.min(3, s.ap + 1); const n = sqBump(s, "mv", -1);
    qaLog(uid, "sq:mv" + i, n, who + " moved " + n + "\u00d7 (" + (n * 10) + "cm)");
  } else if (what === "dodge") {
    const n = sqBump(s, "dg", 1);
    qaLog(uid, "sq:dg" + i, n, who + " \u2014 blast dodge roll" + (n > 1 ? "s: " + n : "") + " (4+ on 1d6)");
    mpToast("Blast dodge: 4+ on 1d6. Rockets and Bombing Runs can't be dodged; bullets can't be dodged (Cover only).");
  } else if (what === "undodge") {
    if (!sqCnt(s, "dg")) return;
    const n = sqBump(s, "dg", -1);
    qaLog(uid, "sq:dg" + i, n, who + " \u2014 blast dodge roll" + (n > 1 ? "s: " + n : "") + " (4+ on 1d6)");
  } else if (what === "fire") {
    const W = SW[s.w];
    if (W.none) { mpToast(who + " is holding the Riot Shield \u2014 swap weapons (1 AP) to attack."); return; }
    if (stanceOf(st) === "hide") { mpToast("The squad is in Hide Stance \u2014 no attacks this turn."); return; }
    if (W.charge && S.items[W.charge] < 1) { mpToast("No " + W.name + " rounds left."); return; }
    if (s.ap < W.ap) { mpToast(W.name + " needs " + W.ap + " AP."); return; }
    s.ap -= W.ap;
    if (W.charge) S.items[W.charge] -= 1;
    if (s.stealth && s.w === "smg") { s.stealth = false; logEv(uid, who + " revealed by firing", "info"); }
    const n = sqBump(s, "fr", 1);
    logEv(uid, who + (W.react ? " attempts a knife takedown (3+)" : " fired the " + W.name + (W.ap ? " (" + W.ap + " AP)" : "")) + (W.charge ? " \u2014 " + S.items[W.charge] + " left" : ""), "info");
  } else if (what === "throw") {
    const T = SW_THROW[arg];
    if (stanceOf(st) === "hide") { mpToast("The squad is in Hide Stance \u2014 no attacks this turn."); return; }
    if (S.items[arg] < 1) { mpToast("No " + T.name + " left."); return; }
    if (s.ap < T.ap) { mpToast("Throwing needs " + T.ap + " AP."); return; }
    s.ap -= T.ap; S.items[arg] -= 1;
    logEv(uid, who + " threw a " + T.name + " (1 AP) \u2014 " + S.items[arg] + " left", "buff");
    closePicker();
  } else if (what === "swap") {
    if (arg === s.w) { closePicker(); return; }
    if (s.ap < 1) { mpToast("Switching weapons costs 1 AP."); return; }
    s.ap -= 1; s.w = arg;
    logEv(uid, who + " switched to the " + SW[arg].name + " (1 AP)", "info");
    closePicker();
  } else if (what === "stance") {
    const D = SOLDIER_STANCES[arg];
    if (arg === "peek") { closePicker(); showNotice("Peek & Shoot", D.eff + "\n\nIt costs the weapon's own AP \u2014 use FIRE as normal."); return; }
    if (turn.phase !== "you") { mpToast("Stances are declared on your own turn."); return; }
    if (arg === "stealth") { s.stealth = !s.stealth; if (s.stealth) s.stance = null; logEv(uid, who + (s.stealth ? " goes stealthed (marker)" : " is revealed"), "info"); closePicker(); sqCommit(); return; }
    if (s.stealth) { mpToast("Stealth never combines with another stance \u2014 reveal first."); return; }
    const cur = soldierStance();
    if (cur === arg) {
      if (D.ap && s.stance.key === sKey()) s.ap = Math.min(3, s.ap + D.ap);
      s.stance = null; logEv(uid, who + " drops " + D.name, "info"); closePicker(); sqCommit(); return;
    }
    const refund = cur && SOLDIER_STANCES[cur].ap && s.stance.key === sKey() ? SOLDIER_STANCES[cur].ap : 0;
    if ((D.ap || 0) > s.ap + refund) { mpToast(D.name + " needs " + D.ap + " AP."); return; }
    s.ap = s.ap + refund - (D.ap || 0);
    s.stance = { k: arg, r: turn.round, key: sKey() };
    logEv(uid, who + " \u2014 " + D.name + (D.ap ? " (1 AP)" : ""), "buff");
    closePicker();
  }
  sqCommit();
};
// cf43: stat bars on the soldier art — tap a bar to select it, then ▲ ▼ − + to adjust
let sqSelState = null;
const SQ_BARS = s => ["ap", "hp", "kev"].concat(sqRole(s.r).shield ? ["ar", "sh"] : []);
const SQ_BAR_META = { ap: ["AP", 3], hp: ["HP", 6], kev: ["KEVLAR", 6], ar: ["ARMOR", 3], sh: ["SHIELD", 6] };
function sqBarVal(S, s, k) { return k === "ap" ? s.ap : k === "hp" ? s.hp : k === "kev" ? s.kev : k === "ar" ? S.shield[s.r].a : S.shield[s.r].h; }
window.sqSel = (i, k) => {
  if (!CUR || !isSquad(U)) return;
  sqSelState = sqSelState && sqSelState.i === i && sqSelState.k === k ? null : { i, k };
  draw();
};
window.sqSelMove = d => {
  if (!sqSelState || !CUR) return;
  const s = CUR.st.sq.soldiers[sqSelState.i], L = SQ_BARS(s);
  sqSelState.k = L[(L.indexOf(sqSelState.k) + d + L.length) % L.length];
  draw();
};
window.sqAdj = sign => {
  if (!sqSelState || !CUR || !isSquad(U) || !mpSheetCanEdit()) return;
  const st = CUR.st, S = st.sq, i = sqSelState.i, k = sqSelState.k, s = sqSoldierFix(S.soldiers[i]), uid = CUR.uid, who = sqLabel(st, i);
  const max = SQ_BAR_META[k][1], step = k === "ap" ? 1 : amount;
  const was = sqBarVal(S, s, k), now = Math.max(0, Math.min(max, was + sign * step));
  if (now === was) return;
  const before = sqAlive(st);
  if (k === "ap") s.ap = now;
  else if (k === "hp") s.hp = now;
  else if (k === "kev") s.kev = now;
  else if (k === "ar") S.shield[s.r].a = now;
  else S.shield[s.r].h = now;
  if (k !== "ap") {
    const lab = k === "hp" ? who : k === "kev" ? who + " Kevlar" : who + " shield " + (k === "ar" ? "Armor" : "HP");
    aggDmg(uid, "sq:" + k + i, lab, was - now, now, max);
    if (k === "hp" && before !== sqAlive(st)) {
      logEv(uid, who + (s.hp ? " is back" : " is down"), s.hp ? "good" : "bad");
      if (!s.hp) aggDmg(uid, "sq:hp", "Squad Health", 1, sqAlive(st), 8, "lost");
    }
  }
  sqCommit();
};
window.sqWeapons = i => {
  if (!CUR || !isSquad(U)) return;
  const st = CUR.st, S = st.sq, s = sqSoldierFix(S.soldiers[i]), kit = ROLE_KIT[s.r];
  $("pickT").textContent = sqLabel(st, i) + " \u2014 weapons";
  $("pickS").innerHTML = "Tap a weapon to switch to it (<b>1 AP</b>). Thrown items are used straight from here (<b>1 AP</b>, no switch needed). " + s.ap + " AP left.";
  const lst = $("picklist"); lst.innerHTML = "";
  const card = (title, W, onTap, badge, cls) => {
    const d = el("div", "wcard" + (cls ? " " + cls : ""));
    d.innerHTML = '<div class="wc-top"><b>' + title + '</b>' + badge + '</div>' +
      '<div class="wc-stats">' + [["AP", W.ap], ["DICE", W.dice], ["RANGE", W.range], ["HIT", W.hit], ["DAMAGE", W.dmg]]
        .filter(([, v]) => v !== undefined && v !== "\u2014").map(([k, v]) => '<span><small>' + k + '</small>' + v + '</span>').join("") + '</div>' + (W.note ? '<p>' + W.note + '</p>' : '');
    d.onclick = onTap; lst.appendChild(d);
  };
  kit.w.forEach(k => {
    const W = SW[k], cur = s.w === k;
    card(W.name, W, () => sqAct(i, "swap", k),
      (cur ? '<em class="on">EQUIPPED</em>' : '<em>SWITCH \u00b7 1 AP</em>') + (W.charge ? '<em class="n">\u00d7' + S.items[W.charge] + '</em>' : ''), cur ? "cur" : "");
  });
  (kit.t || []).forEach(k => {
    const T = SW_THROW[k];
    card(T.name + " \u00b7 thrown", T, () => sqAct(i, "throw", k), '<em class="thr">THROW \u00b7 1 AP</em><em class="n">\u00d7' + S.items[k] + '</em>', S.items[k] ? "thr" : "thr empty");
  });
  $("pickExtra").innerHTML = ""; $("pickCancel").textContent = "Close";
  $("pick").classList.add("on");
};
window.sqStances = i => {
  if (!CUR || !isSquad(U)) return;
  const st = CUR.st, s = sqSoldierFix(st.sq.soldiers[i]);
  const cur = s.stealth ? "stealth" : stanceOf({ stance: s.stance });
  $("pickT").textContent = sqLabel(st, i) + " \u2014 stance";
  $("pickS").innerHTML = "Detailed Battle Map stances. One at a time; Stealth never combines. Tap an active stance to drop it.";
  const lst = $("picklist"); lst.innerHTML = "";
  const grid = el("div", "stgrid");
  Object.keys(SOLDIER_STANCES).forEach(k => {
    const D = SOLDIER_STANCES[k];
    if (D.recon && s.r !== "recon") return;
    const c = el("button", "stcard st-" + k + (cur === k ? " on" : ""));
    c.innerHTML = '<div class="stc-top"><span class="stc-ic">' + D.icon + '</span><b>' + D.name + '</b><em>' + D.cost + '</em></div>' +
      '<div class="stc-when">' + (cur === k ? "\u2713 ACTIVE \u00b7 " : "") + D.lasts + '</div><p>' + D.eff + '</p>';
    c.onclick = () => sqAct(i, "stance", k);
    grid.appendChild(c);
  });
  lst.appendChild(grid);
  $("pickExtra").innerHTML = ""; $("pickCancel").textContent = "Close";
  $("pick").classList.add("on");
};
window.sqRules = () => {
  const sec = (t, body, open) => '<details class="gr"' + (open ? ' open' : '') + '><summary>' + t + '</summary><div>' + body + '</div></details>';
  const tbl = rows => '<table class="grt">' + rows.map((r, k) => '<tr>' + r.map(c => k ? '<td>' + c + '</td>' : '<th>' + c + '</th>').join("") + '</tr>').join("") + '</table>';
  $("pickT").textContent = "\u24D8 Ground rules \u2014 Detailed Battle Map";
  $("pickS").innerHTML = "Section 13.6 / 13.7 at a glance.";
  $("picklist").innerHTML =
    sec("Map, conversion & ranges",
      tbl([["Map", "Use"], ["60\u00d760cm", "building interior, small room, tight urban fight"], ["1\u00d71m", "ship decks, hangars, big structures"]]) +
      "<p>Each squad fields <b>8 soldier models</b>. Casualties convert 1:1 to Squad Health on the Overmap. Rifle, Machine Gun, SMG and Pistol are capped at <b>60cm</b>; the Sniper Rifle needs 30cm+ with no maximum. A full turn on this map is one round of soldier actions.</p>", true) +
    sec("Soldier stats & squad",
      tbl([["Stat", "Value"], ["AP", "3"], ["HP", "6"], ["Kevlar", "6 (separate pool)"], ["Movement", "10cm per AP"], ["Dodge", "none vs bullets (Cover only) \u00b7 4+ on 1d6 vs blasts"]]) +
      tbl([["Role", "No.", "Weapon", "AP", "Range", "Hit", "Damage"],
        ["Rifleman", "3", "Rifle 3d6", "1", "60cm", "3+", "1 (2 on a 6)"],
        ["Machine Gunner", "1", "MG 8d6 + Grenade \u00d72", "2", "60cm", "4+", "1 (2 on a 6)"],
        ["Sniper", "1", "Sniper Rifle 1d6", "2", "30cm+", "3+ / 5+ crit", "4 / 8"],
        ["Sniper backup", "\u2014", "Pistol 2d6", "1", "under 30cm", "3+", "1 (2 on a 6)"],
        ["Armor Unit", "1", "Riot Shield + Rocket \u00d72", "2 (rocket)", "60cm", "\u2014", "3 AoE"],
        ["Shield Unit", "1", "Riot Shield + SMG 3d6 + Flashbang \u00d72", "1", "60cm", "4+", "1 (2 on a 6)"],
        ["Recon", "1", "SMG 3d6 + Knife + Smoke \u00d72", "1", "60cm", "4+", "1 (2 on a 6)"]]) +
      "<p><b>Switching weapons costs 1 AP</b> (Shield \u21C4 Rocket / SMG, Sniper \u21C4 Pistol, SMG \u21C4 Knife). <b>Thrown items cost 1 AP</b>; the <b>Rocket costs 2 AP</b>.</p>") +
    sec("Kevlar & dodging blasts",
      "<p><b>Kevlar:</b> on a regular hit (3\u20135, 1 damage) roll 1d6 \u2014 <b>4+</b> the vest takes it instead of HP. Criticals (6), Sniper fire, Grenades, Rockets and vehicle cannons ignore Kevlar. At 0 the vest is spent.</p>" +
      "<p><b>Blast dodge:</b> any soldier inside an area attack may roll 1d6 \u2014 <b>4+</b> avoids it (Grenades, Strafe Runs, Tank Main Cannon, Hull-strike blasts). <b>Rockets and Bombing Runs can't be dodged.</b> Bullets can't be dodged at all \u2014 Cover is the only defence.</p>") +
    sec("Shields",
      "<p>Armor Unit and Shield Unit each carry a <b>Riot Shield (3 Armor + 6 HP)</b> that protects any ally behind it along the shooter's actual line of fire. Small arms can't touch its Armor; only Grenades and Rockets can. A Grenade or Rocket from the front is absorbed completely \u2014 but a 3-damage blast strips all 3 Armor, leaving the 6 HP open. <b>Flank or rear blasts bypass the shield.</b> Only the Armor Unit is melee-immune (the Shield Unit has no stab-proof vest). Two shields let a squad cover a front and a flank.</p>") +
    sec("Items (charges refresh every new engagement)",
      tbl([["Item", "Holder", "No.", "Range", "Effect"],
        ["Grenade", "Machine Gunner", "2", "20cm throw \u00b7 10cm", "3 damage to everyone inside \u00b7 Dodge 4+"],
        ["Rocket Launcher", "Armor Unit", "2", "60cm \u00b7 10cm", "3 damage to everyone inside \u00b7 no Dodge \u00b7 armour-piercing"],
        ["Flashbang", "Shield Unit", "2", "20cm throw \u00b7 10cm", "turn away (free, back exposed) or arm-block 4+"],
        ["Smoke Grenade", "Recon", "2", "20cm throw \u00b7 15cm", "shooting into / through it needs a natural 6"]]) +
      "<p>All thrown items share a <b>20cm</b> maximum throw. Grenades damage vehicle Armor just like Rockets.</p>") +
    sec("Recon: Knife & Stealth",
      "<p><b>Knife</b> (equip 1 AP): when an enemy triggers Recon's Stealth reveal, roll <b>3+ on 1d6</b> for a takedown. On a failure the target dodges and may act freely; the attempt reveals Recon either way.</p>" +
      "<p><b>Stealth:</b> Recon becomes a marker (always visible to both players). An enemy soldier within <b>10cm</b> forces a reveal; firing the SMG reveals too.</p>") +
    sec("Stances (Detailed Map)",
      "<p><b>Overwatch</b> \u2014 1 AP, watch a 10cm-wide line; free reaction attack on anyone who walks through before your next turn.</p>" +
      "<p><b>Peek & Shoot</b> \u2014 needs Cover, costs the weapon's AP; your shot is \u22121 to its hit number (Sniper: hit 2+, crit 4+). Return fire (only if the target faces you) is free but +1 on every die (Sniper: hit 4+, crit 6+).</p>" +
      "<p><b>Defense</b> \u2014 free, end of turn, until your next turn: intercept an attack aimed at an ally within 10cm (the Armor Unit may still Block with the shield).</p>") +
    sec("Vehicles in a ground battle",
      "<p>Vehicles use <b>Armor + HP</b> here. Rifle, Machine Gun, SMG, Pistol and Sniper can't damage Armor at all \u2014 only <b>Grenades and Rockets</b> can. Once Armor is 0, any weapon hurts the HP.</p>" +
      tbl([["Vehicle", "Armor", "HP", "AP", "Move", "Weapons"],
        ["Tank", "6", "18", "4", "15cm/AP", "Main Cannon 2 AP, 10cm AoE, 6 dmg, Dodge 4+, 1-turn cooldown \u00b7 MG 1 AP, 60cm, 8d6 at 3+"],
        ["Car", "3", "8", "3", "25cm/AP", "MG 1 AP, 60cm, 8d6 at 3+ \u00b7 carries 1 squad"]]) +
      "<p>Aircraft never land on this map: a Helicopter's <b>Strafe Run</b> (20\u00d710cm, 4 dmg, Dodge 4+) and a Jet's <b>Bombing Run</b> (10cm, 6 dmg, no Dodge, armour-piercing) arrive as charges. A squad hit by one may fire back with a Rocket.</p>");
  $("pickExtra").innerHTML = ""; $("pickCancel").textContent = "Close";
  $("pick").classList.add("on");
};

// ================= ONLINE FIREFIGHT (cf53) =================
// A clash between two squads, run by one player on each side. Picks stay on the room server until both are locked.
const FF_ITEMS = { none: { n: "No item", i: "\u2014" }, fb: { n: "Flashbang", i: "\u2726" }, sm: { n: "Smoke Grenade", i: "\u25CC" }, gr: { n: "Grenade", i: "\u2739" } };
let ffHidden = false, ffShown = {}, ffLastSig = "";
const ffAll = () => Object.keys(mp.data || {}).filter(k => k.startsWith("ff/")).map(k => mp.data[k]).filter(Boolean);
// a closed engagement stays "live" just long enough to show how it ended
const ffActive = f => !!f && f.state !== "declined" && (f.state !== "closed" || (!!f.secured && !!f.eng && !ffShown["sec:" + f.id]));
const ffSideOf = f => f.a.team === mpMyTeam() ? "a" : f.b.team === mpMyTeam() ? "b" : null;
const ffOther = s => s === "a" ? "b" : "a";
// the fight this squad belongs to — the pair fighting now, or any squad in the engagement
function ffForUid(uid, team) {
  return ffAll().find(f => ffActive(f) && (f.eng && f.state !== "closed"
    ? ["a", "b"].some(sd => f[sd].team === team && (f.eng[sd + "List"] || []).some(x => x.uid === uid))
    : ((f.a.uid === uid && f.a.team === team) || (f.b.uid === uid && f.b.team === team)))) || null;
}
const ffFightingNow = (f, uid, team) => !!f && ((f.a.uid === uid && f.a.team === team) || (f.b.uid === uid && f.b.team === team));
function ffOp(op) { mp.ffOps = mp.ffOps || []; mp.ffOps.push(op); mpKick(); }
function ffNewId() { return (Date.now().toString(36) + Math.random().toString(36).slice(2, 6)).slice(-12); }
function ffSidePidAlive(f, side) {
  const pid = f[side].pid; if (!pid) return false;
  const p = mpPlayers()[pid]; return !!(p && mpNow() - (p.seen || 0) < 90000);
}
// the clash this device is running (my squad sheet is open and I'm my side's player)
function ffMine() {
  if (!mpTeamMode() || !CUR || !U || !isSquad(U) || !$("s4").classList.contains("on")) return null;
  const f = ffForUid(CUR.uid, mpMyTeam()) || ffAll().find(g => {
    const sd = ffSideOf(g);
    return sd && ffActive(g) && ["end", "closed"].includes(g.state) && g[sd].pid === mp.pid && g[sd].uid === CUR.uid;
  }); if (!f) return null;
  if (!ffFightingNow(f, CUR.uid, mpMyTeam())) return null;        // a squad waiting for its bout doesn't open the clash screen
  const s = ffSideOf(f);
  return f[s].pid === mp.pid ? f : null;
}
function ffEnemySquads() {
  const ot = otherTeam(mpMyTeam()), td = mp.data["team/" + ot];
  if (!td || !Array.isArray(td.roster)) return [];
  const aboard = new Set();
  td.roster.forEach(x => {
    const st = (mp.data["unit/" + ot + "/" + x.uid] || {}).st || {};
    ((st.ship && st.ship.carry) || []).forEach(v => aboard.add(v));
    ((st.gv && st.gv.carry) || []).forEach(v => aboard.add(v));
  });
  const squads = td.roster.filter(x => (x.id || "").indexOf("ground-squad") === 0);
  return squads.map((x, k) => {
    const st = (mp.data["unit/" + ot + "/" + x.uid] || {}).st || {};
    const alive = st.hp ? st.hp.hp : 8;
    return { uid: x.uid, label: "Infantry Squad" + (squads.length > 1 ? " #" + (k + 1) : ""), alive, aboard: aboard.has(x.uid), busy: !!ffForUid(x.uid, ot) };
  });
}
let ffSel = null;
const ffSideClass = t => t === "federation" ? "fed" : "spa";
window.ffPickTap = (side, uid) => {
  if (!ffSel) return;
  const set = ffSel[side];
  const k = set.indexOf(uid);
  if (k >= 0) set.splice(k, 1); else set.push(uid);
  ffPickRender();
};
function ffPickRender() {
  const P = ffSel; if (!P) return;
  const box = (side, x, team) => {
    const on = P[side].includes(x.uid), off = x.busy || x.aboard || x.alive <= 0;
    return '<div class="ffsq ' + ffSideClass(team) + (on ? ' on' : '') + (off ? ' off' : '') + '"' +
      (off ? '' : ' onclick="ffPickTap(\'' + side + '\',' + x.uid + ')"') + '>' +
      '<span class="pt shipp gp"><img src="img/ground/' + (team === "federation" ? "fed" : "spa") + '-rifleman.webp" alt=""></span>' +
      '<span class="t"><b>' + x.label + '</b><em>' + (x.alive <= 0 ? "wiped out" : x.busy ? "\u2694 in a firefight" : x.aboard ? "aboard a vehicle" : x.alive + " / 8 \u00b7 " + HEALTH_WORD(x.alive / 8)) + '</em></span>' +
      (on ? '<span class="tick">\u2713</span>' : '') + '</div>';
  };
  const col = (side, list, team, title) => '<div class="ffcol"><h5 class="' + ffSideClass(team) + '">' + title + '</h5>' + list.map(x => box(side, x, team)).join("") + '</div>';
  const n = P.me.length, m = P.foe.length;
  $("picklist").innerHTML = '<div class="ffpick2">' +
    col("me", P.mine, mpMyTeam(), "Your side \u00b7 " + teamName(mpMyTeam())) +
    '<div class="ffvsmid">VS</div>' +
    col("foe", P.enemy, otherTeam(mpMyTeam()), "Enemy \u00b7 " + teamName(otherTeam(mpMyTeam()))) + '</div>' +
    '<label class="ffobjname">\u{1F6A9} What are they fighting over?<input id="ffObjName" maxlength="24" placeholder="e.g. Server room" value="' + (P.obj || "") + '" oninput="ffSel.obj=this.value"></label>';
  const go = $("ffGoBtn");
  if (go) {
    go.textContent = n && m ? "\u2694 CHALLENGE \u00b7 " + n + " vs " + m : "Pick at least one squad a side";
    go.className = "btn big " + (n && m ? "pri" : "off");
  }
}
window.ffChallenge = () => {
  if (!mpTeamMode()) { mpToast("Online firefights need a battle session."); return; }
  if (mp.data.turn && mp.data.turn.active !== mpMyTeam()) { mpToast("Firefights can only be started on your own turn."); return; }
  if (!CUR || !isSquad(U) || !mpSheetCanEdit()) return;
  if (ffForUid(CUR.uid, mpMyTeam())) { mpToast("This squad is already in a firefight."); return; }
  if (!sqAlive(CUR.st)) { mpToast("This squad has no soldiers left."); return; }
  const mine = squadsInRoster().filter(r => !isDead(r)).map(r => {
    const cs = carrierState(r.uid);
    return { uid: r.uid, label: unitLabel(r.uid), alive: sqAlive(r.st), busy: !!ffForUid(r.uid, mpMyTeam()), aboard: !!(cs && cs.state === "aboard") };
  });
  ffSel = { mine, enemy: ffEnemySquads(), me: [CUR.uid], foe: [], obj: "" };
  $("pickT").textContent = "\u2694 Challenge an enemy squad";
  $("pickS").innerHTML = "Tap squads on both sides to put them in this engagement. They fight <b>one pair per turn</b> \u2014 the enemy chooses who meets each of your squads.";
  ffPickRender();
  const go = el("button", "btn big pri"); go.id = "ffGoBtn";
  go.onclick = () => {
    const P = ffSel; if (!P || !P.me.length || !P.foe.length) return;
    const lab = (list, uid) => (list.find(x => x.uid === uid) || {}).label || "Squad";
    closePicker();
    ffHidden = false;
    ffOp({ op: "invite", id: ffNewId(),
      aUids: P.me, aLabels: P.me.map(u => lab(P.mine, u)),
      bUids: P.foe, bLabels: P.foe.map(u => lab(P.enemy, u)),
      obj: (P.obj || "").trim() });
    mpToast(P.me.length + " vs " + P.foe.length + " challenge sent \u2014 waiting for the enemy to accept.");
    ffSel = null;
  };
  $("pickExtra").innerHTML = ""; $("pickExtra").appendChild(go);
  $("pickCancel").textContent = "Cancel";
  $("pick").classList.add("on");
  ffPickRender();
};
// enemy squads this squad has already fought (the server records each pair at their first reveal)
function ffFoughtWith(uid) {
  const me = mpMyTeam(), ot = otherTeam(me);
  return ffEnemySquads().filter(e => {
    const k = me === "federation" ? "ffhist/federation-" + uid + "/spacenoid-" + e.uid : "ffhist/federation-" + e.uid + "/spacenoid-" + uid;
    return !!mp.data[k];
  });
}
window.ffForce = () => {
  if (!mpTeamMode() || !CUR || !isSquad(U) || !mpSheetCanEdit()) return;
  const q = CUR.st.sq.qr;
  if (ffForUid(CUR.uid, mpMyTeam())) { mpToast("This squad is already in a firefight."); return; }
  if (!(q.items && q.items.fb > 0)) { mpToast("No Flashbang left to force a re-engagement."); return; }
  const list = ffFoughtWith(CUR.uid);
  if (!list.length) { mpToast("You can only force a re-engagement with an enemy squad this squad has already fought."); return; }
  $("pickT").textContent = "\u2726 Force a re-engagement";
  $("pickS").innerHTML = "Spend 1 Flashbang to stop an enemy squad <b>you already fought</b> from moving away. The firefight starts by itself when the <b>next turn begins</b> \u2014 no need to accept.";
  const lst = $("picklist"); lst.innerHTML = list.length ? "" : '<div class="empty">The enemy has no infantry squads.</div>';
  list.forEach(e => {
    const off = e.busy || e.aboard || e.alive <= 0;
    const d = el("div", "row" + (off ? " car-aboard" : ""));
    d.innerHTML = '<span class="pt shipp gp"><img src="img/ground/' + (mpMyTeam() === "federation" ? "spa" : "fed") + '-rifleman.webp" alt=""></span>' +
      '<span style="min-width:0;flex:1"><div class="nm">' + e.label + '</div><div class="tr">' +
      (e.alive <= 0 ? "wiped out" : e.busy ? "\u2694 already in a firefight" : e.aboard ? "aboard a vehicle" : HEALTH_WORD(e.alive / 8)) + '</div></span>';
    if (!off) d.onclick = () => {
      closePicker();
      q.items.fb -= 1; logEv(CUR.uid, "Forced Re-Engagement on " + e.label + " \u2014 Flashbang spent", "buff"); save();
      ffOp({ op: "invite", id: ffNewId(), aUid: CUR.uid, bUid: e.uid, aLabel: unitLabel(CUR.uid), bLabel: e.label, forced: true });
      mpToast("\u2726 Forced Re-Engagement booked \u2014 it starts when the next turn begins.");
    };
    lst.appendChild(d);
  });
  $("pickExtra").innerHTML = ""; $("pickCancel").textContent = "Cancel";
  $("pick").classList.add("on");
};
// the squad being forced back cancels the re-engagement with a Smoke Grenade
window.ffCounter = () => {
  if (!mpTeamMode() || !CUR || !isSquad(U)) return;
  if (!mpSheetCanEdit()) { const l = mpLockOf(mpMyTeam(), CUR.uid); mpToast((l && mpLockAlive(l) ? mpNameOf(l.pid) + " has" : "Someone else has") + " this squad open \u2014 they can counter it."); return; }
  const f = ffForUid(CUR.uid, mpMyTeam()), q = CUR.st.sq.qr;
  if (!f || f.state !== "queued" || f.forced === ffSideOf(f)) return;
  if (!(q.items && q.items.sm > 0)) { mpToast("No Smoke Grenade left to counter with."); return; }
  if (!confirm("Spend 1 Smoke Grenade to cancel the Forced Re-Engagement? Your squad gets away.")) return;
  q.items.sm -= 1;
  logEv(CUR.uid, "\u25CC Smoke Grenade \u2014 countered the Forced Re-Engagement by " + f[ffOther(ffSideOf(f))].label, "buff");
  save(); if (typeof sqCommit === "function") sqCommit();
  ffOp({ op: "counter", id: f.id });
  mpToast("\u25CC Countered with Smoke \u2014 your squad gets away.");
};
function ffTagHTML(f, uid, team) {
  if (f && f.state === "queued") return '<span class="fftag queued" title="Re-engages next turn">\u2726<b> RE-ENGAGES NEXT TURN</b></span> ';
  if (f && f.eng && uid !== undefined && !ffFightingNow(f, uid, team)) return '<span class="fftag waiting" title="In the engagement, waiting for its bout">\u2694<b> WAITING ITS BOUT</b></span> ';
  return '<span class="fftag" title="In a firefight">\u2694<b> FIREFIGHT</b></span> ';
}
const objName = o => (o && typeof o === "object" && o.name ? String(o.name) : "").slice(0, 24);
const objTagHTML = name => '<span class="objtag" title="Holds ' + (name || "the objective") + '">\u{1F6A9}<b> ' + (name ? name.toUpperCase() : "OBJECTIVE") + '</b></span> ';
const objHeld = st => st && ((st.sq && st.sq.holdsObj) ? { name: objName(st.sq.holdsObj) } : (st.gv && st.gv.objective) ? { name: (st.gv.objName || "") } : null);
const objTagFor = uid => { const r = roster.find(x => x.uid === uid); const h = r && !isDead(r) ? objHeld(r.st) : null; return h ? objTagHTML(h.name) : ""; };
const OBJ_TAG = objTagHTML("");
// counter straight from the notification (takes the squad's sheet quietly if needed, like ticking a unit done)
window.ffBannerCounter = id => {
  const f = mp.data["ff/" + id]; if (!f || f.state !== "queued") return;
  const s = ffSideOf(f); if (!s || f.forced === s) return;
  const r = roster.find(x => x.uid === f[s].uid); if (!r || !r.st || !r.st.sq) return;
  const t = mpMyTeam(), k = lockKey(t, r.uid), l = mpLockOf(t, r.uid);
  if (!mp.held.has(k) && l && l.pid !== mp.pid && mpLockAlive(l)) { mpToast(mpNameOf(l.pid) + " has that squad open \u2014 they can counter from its sheet."); return; }
  const S = r.st.sq; S.qr = S.qr || {};
  if (!S.qr.items) S.qr.items = { fb: 2, sm: 1, gr: 1 };
  if (!(S.qr.items.sm > 0)) { mpToast("No Smoke Grenade left to counter with."); renderFFInvites(); return; }
  if (!confirm("Spend 1 Smoke Grenade to cancel the Forced Re-Engagement? Your " + f[s].label + " gets away.")) return;
  const apply = () => {
    const f2 = mp.data["ff/" + id];
    if (!f2 || f2.state !== "queued") { mpToast("That re-engagement is no longer waiting."); return; }
    if (!(S.qr.items.sm > 0)) { mpToast("No Smoke Grenade left to counter with."); return; }
    S.qr.items.sm -= 1;
    logEv(r.uid, "\u25CC Smoke Grenade \u2014 countered the Forced Re-Engagement by " + f2[f2.forced].label, "buff");
    save();
    ffOp({ op: "counter", id });
    ffShown["bk:" + id] = 1;
    mpToast("\u25CC Countered with Smoke \u2014 your " + f2[s].label + " gets away.");
    renderFFInvites();
    if (CUR && CUR.uid === r.uid && $("s4").classList.contains("on")) draw();
  };
  if (mp.held.has(k)) { apply(); return; }
  mp.afterLock[k] = () => { apply(); if (mp.viewing !== r.uid) mp.wantRelease.add(k); mp.again = true; };
  mp.wantAcquire.add(k); mpKick();
};
window.ffReviewForced = id => {
  const f = mp.data["ff/" + id]; if (!f) return;
  const s = ffSideOf(f), r = roster.find(x => x.uid === f[s].uid); if (!r) return;
  ffShown["bk:" + id] = 1;
  if ($("s4").classList.contains("on")) closeSheet();
  openSheet(r.uid); sqTab("qr"); renderFFInvites();
};
window.ffAccept = id => {
  const f = mp.data["ff/" + id]; if (!f || f.state !== "invite") return;
  if (f.eng && (f.eng.aList.length > 1 || f.eng.bList.length > 1)) { ffMatchups(id); return; }   // several squads: choose who meets whom
  ffAcceptGo(id, f.eng ? [[f.eng.aList[0].uid, f.eng.bList[0].uid]] : null, f.b.uid);
};
function ffAcceptGo(id, pairs, openUid) {
  const r = roster.find(x => x.uid === openUid); if (!r) return;
  const l = mpLockOf(mpMyTeam(), r.uid);
  if (l && l.pid !== mp.pid && mpLockAlive(l)) { mpToast(mpNameOf(l.pid) + " has that squad open \u2014 they can accept instead."); return; }
  ffHidden = false;
  if ($("s4").classList.contains("on")) closeSheet();
  openSheet(r.uid); sqTab("qr");
  ffOp(pairs ? { op: "accept", id, pairs } : { op: "accept", id });
}
// the defender answers "who meets their Squad A?" for each attacker in order
function ffMatchups(id, picked) {
  const f = mp.data["ff/" + id]; if (!f || !f.eng || f.state !== "invite") return;
  const chosen = picked || [];
  const att = f.eng.aList[chosen.length];
  if (!att) { closePicker(); ffAcceptGo(id, chosen, chosen[0][1]); return; }
  $("pickT").textContent = "\u2694 Who meets their " + att.label + "?";
  $("pickS").innerHTML = "Bout " + (chosen.length + 1) + " of " + f.eng.aList.length + " \u2014 pick one of your squads. A squad can be used twice; its second bout happens on a later turn.";
  const lst = $("picklist"); lst.innerHTML = "";
  f.eng.bList.forEach(x => {
    const r = roster.find(y => y.uid === x.uid), alive = r && r.st ? sqAlive(r.st) : 0;
    const used = chosen.filter(c => c[1] === x.uid).length;
    const d = el("div", "row" + (alive <= 0 ? " car-aboard" : ""));
    d.innerHTML = '<span class="pt shipp gp"><img src="img/ground/' + (mpMyTeam() === "federation" ? "fed" : "spa") + '-rifleman.webp" alt=""></span>' +
      '<span style="min-width:0;flex:1"><div class="nm">' + x.label + '</div><div class="tr">' + (alive <= 0 ? "wiped out" : alive + " / 8 \u00b7 " + HEALTH_WORD(alive / 8)) + (used ? " \u00b7 already fighting bout " + (chosen.findIndex(c => c[1] === x.uid) + 1) : "") + '</div></span>';
    if (alive > 0) d.onclick = () => ffMatchups(id, chosen.concat([[att.uid, x.uid]]));
    lst.appendChild(d);
  });
  $("pickExtra").innerHTML = ""; $("pickCancel").textContent = "Cancel";
  $("pick").classList.add("on");
}
window.ffDecline = id => ffOp({ op: "decline", id });
window.ffResume = id => {
  const f = mp.data["ff/" + id]; if (!f) return;
  const s = ffSideOf(f); if (!s) return;
  const r = roster.find(x => x.uid === f[s].uid); if (!r) return;
  ffHidden = false;
  const sheetOpen = $("s4").classList.contains("on");
  if (!CUR || CUR.uid !== r.uid || !sheetOpen) { if (sheetOpen) closeSheet(); openSheet(r.uid); sqTab("qr"); }
  if (f[s].pid !== mp.pid) ffOp({ op: "join", id });
  renderFF();
};
window.ffPause = () => {
  const f = ffMine(); ffHidden = true;
  if (f) { ffOp({ op: "pause", id: f.id }); mpToast("Firefight paused \u2014 resume it from the squad's Quick Resolve tab."); }
  renderFF();
};
window.ffMode = pick => { const f = ffMine(); if (f) ffOp({ op: "mode", id: f.id, pick }); };
window.ffModeAnswer = yes => { const f = ffMine(); if (f) ffOp({ op: "modeAnswer", id: f.id, yes }); };
window.ffReady = () => {
  const f = ffMine(); if (!f) return;
  const q = CUR.st.sq.qr, alive = sqAlive(CUR.st);
  const supp = f.state === "reveal" ? (q.nextExtra || 0) : q.supp;   // set-aside dice for the round about to start
  ffOp({ op: "ready", id: f.id, hp: alive, supp: Math.min(8, supp) });
};
function ffSumNext(q) { q.nextExtra = Math.min(8, (q.nextOnes || 0) + (q.nextMargin || 0)); }
// how many of your dice rolled a 1: one tap, updated in place (no redraw, so the screen doesn't jump)
window.ffOnes = n => {
  if (!CUR) return;
  const q = CUR.st.sq.qr, alive = sqAlive(CUR.st);
  q.nextOnes = Math.max(0, Math.min(8, n)); ffSumNext(q);
  const f = ffMine(); if (f) q.onesKey = f.id + ":" + f.seg + ":" + f.round;   // the dice have been rolled this round
  save();
  const rb = document.querySelector("#ffx .ffcolR .ffroll:not(.small)"); if (rb) rb.remove();   // so it can't be mistaken for next round's roll
  if (f && f.mode === "physical") { ffFs(f, q).ones = q.nextOnes; window.ffGo("compare"); return; }
  document.querySelectorAll("#ffx .ffo").forEach(b => b.classList.toggle("on", +b.dataset.n === q.nextOnes));
  const nd = document.querySelector("#ffx .ffnd");
  if (nd) nd.innerHTML = ffNextText(q, alive);
};
window.ffExtra = d => { if (CUR) ffOnes((CUR.st.sq.qr.nextOnes || 0) + d); };
function ffNextText(q, alive) {
  const ne = Math.min(8, (q.nextOnes || 0) + (q.nextMargin || 0));
  return "Next round you roll <b>" + qrDice(alive, ne) + "</b> dice" + (ne ? " (" + ne + " set aside)" : "");
}
let ffDetOpen = false, ffTurnKey = "";
// ---------- physical dice: one step at a time (cf83) ----------
// roll -> ones -> compare (won / lost / tied) -> [lost: margin -> casualties] -> summary.  The winner waits until the loser is done.
const FF_AGREE = (a, b) => (a === "won" && b === "lost") || (a === "lost" && b === "won") || (a === "tied" && b === "tied");
function ffFs(f, q) {
  const k = f.id + ":" + f.seg + ":" + f.round;
  if (!q.fs || q.fs.k !== k) q.fs = { k, s: "roll" };
  return q.fs;
}
window.ffGo = step => {
  if (!CUR) return;
  const f = ffMine(); if (!f) return;
  ffFs(f, CUR.st.sq.qr).s = step; save(); ffLastSig = ""; renderFF();
};
window.ffClaim = r => {
  const f = ffMine(); if (!f || !CUR) return;
  const q = CUR.st.sq.qr, fs = ffFs(f, q), was = fs.claim;
  fs.claim = r;
  ffOp({ op: "claim", id: f.id, result: r });
  if (r === "lost") {
    if (fs.applied) { ffOp({ op: "applied", id: f.id }); ffGo("summary"); return; }   // losses already applied this round
    ffGo("margin"); return;
  }
  q.nextMargin = 0; ffSumNext(q);
  if (was === "lost" && fs.applied && typeof mpToast === "function") mpToast("If soldiers were removed by mistake, bring them back with Repair.");
  fs.applied = false;
  ffGo(r === "won" ? "wait" : "tie");
};
function ffLossDone() {
  const f = ffMine(); if (!f || !CUR) return;
  const fs = ffFs(f, CUR.st.sq.qr);
  fs.applied = true;
  ffOp({ op: "applied", id: f.id });
  ffGo("summary");
}
function ffApplyLoss(lab, fx, cas, sup) {
  const f = ffMine(); if (!f || !CUR) return;
  const q = CUR.st.sq.qr, fs = ffFs(f, q);
  q.nextMargin = sup; ffSumNext(q);
  q.marginKey = fs.k; q.marginLab = lab + ": " + fx;
  fs.lab = lab + " \u00b7 " + fx;
  logEv(CUR.uid, "Firefight round " + f.round + ": " + lab.toLowerCase() + " \u2014 " + fx, "bad");
  if (cas > 0 && sqAlive(CUR.st) > 0) {
    fs.target = Math.max(0, sqAlive(CUR.st) - cas); fs.s = "cas"; save(); ffLastSig = ""; renderFF();
    setTimeout(() => window.ffCasualties(), 150);
  } else { save(); ffLossDone(); }
}
window.ffPickMargin = k => {
  const M = FF_MARGINS.find(m => m.k === k); if (!M) return;
  if (M.pv) { window.ffGo("volley"); return; }
  ffApplyLoss(M.lab, M.fx, M.cas, M.sup);
};
window.ffPickVolley = n => ffApplyLoss("Lost to a Perfect Volley (" + n + " sixes)", VOLLEY(n) + " destroyed", VOLLEY(n), 0);
window.ffCasualties = () => {
  if (!CUR) return;
  const f = ffMine(); if (!f) return;
  const fs = ffFs(f, CUR.st.sq.qr), left = Math.max(0, sqAlive(CUR.st) - (fs.target || 0));
  if (left <= 0) { ffLossDone(); return; }
  sqCasualtyPicker(left, fs.lab || "", () => {
    if (!CUR) return;
    if (sqAlive(CUR.st) <= (fs.target || 0)) ffLossDone(); else { ffLastSig = ""; renderFF(); }
  });
};
function ffWizard(f, s, o, q, alive, v) {
  const fs = ffFs(f, q), cl = f.claim || {}, dn = f.done || {};
  const mine = cl[s], theirs = cl[o];
  const agree = !!(mine && theirs && FF_AGREE(mine, theirs));
  const clash = !!(mine && theirs && !agree);
  const tag = (n, t) => '<div class="ffstep"><small>STEP ' + n + ' OF 6</small><b>' + t + '</b></div>';
  const back = to => '<button type="button" class="ffback" onclick="ffGo(\'' + to + '\')">\u2190 Back</button>';
  const readyBtn = () => {
    const iReady = !!f.ready[s], ok = agree && dn[s] && dn[o];
    if (!ok) return '<div class="ffwait">\u23F3 ' + (!theirs ? "Waiting for the enemy to report their result\u2026" : "Waiting for the enemy to apply their losses\u2026") + '</div>';
    return '<button class="btn big ffready ' + (iReady ? "ready" : "pri") + '" onclick="' + (iReady ? "ffUnready()" : "ffReady()") + '">' +
      (iReady ? "\u2713 READY \u2014 tap to wait" : f.round >= 4 ? "READY \u2014 finish the bout" : "READY FOR ROUND " + (f.round + 1)) + '</button>' +
      '<span class="ffwho">' + (f.ready[o] ? "\u2713 The enemy is ready" : "Waiting for the enemy to press ready\u2026") + '</span>';
  };
  const summary = () => {
    const res = mine === "won" ? '<div class="ffchip good">\u2713 You won the exchange</div>'
      : mine === "tied" ? '<div class="ffchip neutral">Tied \u2014 no effect</div>'
      : '<div class="ffchip bad">\u26A0 ' + (fs.lab || q.marginLab || "You lost the exchange") + '</div>';
    return tag(6, "Round " + f.round + " summary") + res +
      (f.round < 4 ? '<div class="ffnd">' + ffNextText(q, alive) + '</div>' : '') + readyBtn();
  };
  let st = fs.s;
  if (clash) st = "compare";
  if (f.mode === "rolled") {
    if (f.roll && st === "roll") { st = fs.s = "dice"; save(); }
    if (f.roll) { const res = ffApplyRoll(f); if (res) { fs.cas = res.cas; fs.lab = res.lab; save(); } }
    if (st === "roll") {
      const pressed = !!(f.rolled && f.rolled[s]) || ffPendingRoll === fs.k;
      return '<div class="ffwiz">' + tag(1, "Reveal \u2014 roll for me") + v.vs + v.chips + v.det +
        '<div class="ffroll"><b>\u{1F3B2} ' + v.nowDice + ' DICE</b><span>' + v.parts + '</span></div>' +
        (pressed
          ? '<div class="ffwait">\u23F3 Rolled \u2014 waiting for the enemy to roll\u2026 both rolls are shown together.</div>'
          : '<button class="btn big pri ffnext ffrollbtn" onclick="ffRollForMe()">\u{1F3B2} ROLL FOR ME</button>' +
            (f.rolled && f.rolled[o] ? '<small class="ffhint">\u2713 The enemy has rolled \u2014 waiting for you.</small>' : '')) + '</div>';
    }
    if (st === "dice") {
      const rk = fs.k, anim = !ffShown[rk + ":dice"]; ffShown[rk + ":dice"] = 1;
      const score = a => (a || []).reduce((m, x) => m + (x === 6 ? 2 : x >= 3 ? 1 : 0), 0);
      const ms = score(f.roll[s]), ts = score(f.roll[o]), ones = (f.roll[s] || []).filter(x => x === 1).length;
      const res = mine === "won" ? '<div class="ffchip good">\u2713 You won ' + ms + '\u2013' + ts + '</div>'
        : mine === "tied" ? '<div class="ffchip neutral">Tied ' + ms + '\u2013' + ts + ' \u2014 no effect</div>'
        : '<div class="ffchip bad">\u26A0 ' + (fs.lab || "You lost " + ms + "\u2013" + ts) + '</div>';
      return '<div class="ffwiz">' + tag(2, "The dice") +
        '<div class="ffdice2' + (anim ? ' anim' : '') + '">' +
          '<div class="dr me"><small>YOU \u00b7 ' + (f.roll[s] || []).length + ' dice</small><p>' + ffDiceRow(f.roll[s], anim) + '</p><b>' + ms + ' success' + (ms === 1 ? '' : 'es') + '</b></div>' +
          '<div class="dr foe"><small>ENEMY \u00b7 ' + (f.roll[o] || []).length + ' dice</small><p>' + ffDiceRow(f.roll[o], anim) + '</p><b>' + ts + ' success' + (ts === 1 ? '' : 'es') + '</b></div>' +
        '</div>' +
        '<small class="ffhint">6 = 2 successes \u00b7 3\u20135 = 1 \u00b7 2 = miss \u00b7 1 = set aside next round</small>' +
        '<div class="ffreslt' + (anim ? ' late' : '') + '">' + res +
          (ones ? '<div class="ffchip neutral">' + ones + ' of your dice rolled a 1 \u2014 set aside next round</div>' : '') +
          '<button class="btn big pri ffnext" onclick="ffRolledNext()">' + (mine === "lost" && (fs.cas || 0) > 0 && !fs.applied ? 'Remove casualties \u25B8' : 'Continue \u25B8') + '</button></div></div>';
    }
  }
  let h = "";
  switch (st) {
    case "roll":
      h = tag(1, "Reveal \u2014 now roll") + v.vs + v.chips + v.det +
        '<div class="ffroll"><b>\u{1F3B2} ROLL ' + v.nowDice + ' DICE</b><span>' + v.parts + '</span>' +
        (v.off ? '<em>' + (v.fl ? 'Flashed \u2014 ' : '') + 'move ' + Math.min(v.off, v.fp) + (Math.min(v.off, v.fp) === 1 ? ' die' : ' dice') + ' away before rolling</em>' : '') + '</div>' +
        '<button class="btn big pri ffnext" onclick="ffGo(\'ones\')">\u2713 DICE ROLLED \u25B8</button>';
      break;
    case "ones":
      h = tag(2, "How many of your dice rolled a 1?") +
        '<div class="ffonesrow big">' + Array.from({ length: Math.max(1, v.nowDice) + 1 }, (_, n) =>
          '<button type="button" class="ffo' + (fs.ones === n ? ' on' : '') + '" data-n="' + n + '" onclick="ffOnes(' + n + ')">' + n + '</button>').join("") + '</div>' +
        '<small class="ffhint">They are set aside next round.</small>' + back("roll");
      break;
    case "compare":
      h = tag(3, "Compare successes") +
        (clash ? '<div class="ffwarn">\u26A0 ' + (mine === "won" && theirs === "won" ? "You both said you won \u2014 there can only be one winner."
          : mine === "lost" && theirs === "lost" ? "You both said you lost \u2014 there can only be one loser."
          : "Your results don't match \u2014 one of you said tied.") + ' Recount your successes and choose again.</div>'
          : '<div class="ffbanner">\u{1F3AF} Now compare your successes with the enemy<small>3\u20135 = 1 success \u00b7 6 = 2 successes \u00b7 1 and 2 = none</small></div>') +
        '<button class="ffbig won' + (mine === "won" ? ' on' : '') + '" onclick="ffClaim(\'won\')">\u2713 I WON</button>' +
        '<button class="ffbig lost' + (mine === "lost" ? ' on' : '') + '" onclick="ffClaim(\'lost\')">\u2717 I LOST</button>' +
        '<button class="fftie' + (mine === "tied" ? ' on' : '') + '" onclick="ffClaim(\'tied\')">= Tied</button>' + back("ones");
      break;
    case "margin":
      h = tag(4, "You lost \u2014 by how much?") + '<div class="ffmgrid">' +
        FF_MARGINS.map(M => '<button type="button" class="ffmopt' + (M.pv ? ' pv' : '') + '" onclick="ffPickMargin(\'' + M.k + '\')"><b>' + M.lab.replace("Lost to a ", "") + '</b><span>' + (M.pv ? "all their dice were 6s" : M.fx) + '</span></button>').join("") +
        '</div>' + back("compare");
      break;
    case "volley":
      h = tag(4, "Perfect Volley \u2014 how many sixes?") +
        '<small class="ffhint">Counts for any squad rolling 2\u20135 dice, including a suppressed squad down to 2.</small><div class="ffmgrid">' +
        [2, 3, 4, 5].map(n => '<button type="button" class="ffmopt pv" onclick="ffPickVolley(' + n + ')"><b>' + n + ' sixes</b><span>' + VOLLEY(n) + ' of yours destroyed</span></button>').join("") +
        '</div>' + back("margin");
      break;
    case "cas": {
      const left = Math.max(0, alive - (fs.target || 0));
      h = tag(5, "Remove casualties") + '<div class="ffchip bad">\u26A0 ' + (fs.lab || "") + '</div>' +
        (left > 0 ? '<button class="btn big pri ffnext" onclick="ffCasualties()">Choose who falls (' + left + ' left)</button>'
                  : '<button class="btn big pri ffnext" onclick="ffCasualties()">Continue \u25B8</button>');
      break;
    }
    case "wait":
      if (agree && dn[o]) { h = summary(); break; }
      h = tag(4, "You won the exchange") + '<div class="ffchip good">\u2713 You won \u2014 the enemy applies their losses</div>' +
        '<div class="ffwait">\u23F3 ' + (!theirs ? "Waiting for the enemy to report their result\u2026" : "Waiting for the enemy to apply their losses\u2026") + '</div>' + back("compare");
      break;
    case "tie":
      if (agree) { h = summary(); break; }
      h = tag(4, "Tied") + '<div class="ffchip neutral">Tied \u2014 no effect this round</div>' +
        '<div class="ffwait">\u23F3 Waiting for the enemy to confirm the tie\u2026</div>' + back("compare");
      break;
    default:
      h = summary();
  }
  return '<div class="ffwiz">' + h + '</div>';
}

// physical dice: pick the margin you lost by and the app applies it
const FF_MARGINS = [
  { k: "m1", lab: "Lost by 1", fx: "1 die set aside next round", cas: 0, sup: 1 },
  { k: "m23", lab: "Lost by 2–3", fx: "1 casualty", cas: 1, sup: 0 },
  { k: "m4", lab: "Lost by 4", fx: "1 casualty + 1 set aside", cas: 1, sup: 1 },
  { k: "m5", lab: "Lost by 5", fx: "1 casualty + 2 set aside", cas: 1, sup: 2 },
  { k: "m6", lab: "Lost by 6 or more", fx: "2 casualties + 2 set aside", cas: 2, sup: 2 },
  { k: "pv", lab: "Lost to a Perfect Volley", fx: "they rolled 2\u20135 dice and every one was a 6 \u2014 you'll say how many", cas: 0, sup: 0, pv: true },
];
// Perfect Volley: how many sixes did they roll? (only 2 or 3 dice count)
function ffVolleyPick(f, key) {
  const q = CUR.st.sq.qr;
  $("pickT").textContent = "\u2620 Lost to a Perfect Volley";
  $("pickS").innerHTML = "A Perfect Volley happens when a squad rolls <b>2 to 5 dice</b> and <b>every die is a 6</b> \u2014 it skips the margin table. " +
    "It still counts for a squad that has been suppressed or flashed down to just 2 dice: two sixes is a Perfect Volley. Six or more dice can never be one. How many sixes did they roll?";
  const lst = $("picklist"); lst.innerHTML = "";
  [[2, "2 sixes (2 dice)", "3 of your soldiers destroyed"], [3, "3 sixes (3 dice)", "4 destroyed"], [4, "4 sixes (4 dice)", "5 destroyed"], [5, "5 sixes (5 dice)", "6 destroyed"]].forEach(([n, lab, fx]) => {
    const d = el("div", "row fmrow pv big"); d.innerHTML = '<span style="font-size:26px;min-width:44px;text-align:center">' + "\u2685".repeat(n) + '</span><span style="min-width:0;flex:1"><div class="nm">' + lab + '</div><div class="tr">' + fx + '</div></span>';
    d.onclick = () => {
      const cas = VOLLEY(n), again = q.marginKey === key;
      q.nextMargin = 0; ffSumNext(q);
      q.marginKey = key; q.marginPick = "pv" + n; q.marginLab = "Perfect Volley (" + n + " sixes): " + cas + " destroyed";
      logEv(CUR.uid, "Firefight round " + f.round + ": lost to a Perfect Volley (" + n + " sixes) \u2014 " + cas + " destroyed", "bad");
      save(); closePicker(); ffLastSig = ""; renderFF();
      if (!again) setTimeout(() => sqCasualtyPicker(Math.min(cas, sqAlive(CUR.st)), "Perfect Volley: " + cas + " soldiers destroyed."), 150);
      else mpToast("Updated. Record any extra casualties with \u2620 if needed.");
    };
    lst.appendChild(d);
  });
  const back = el("button", "btn"); back.textContent = "\u2190 Back to the margin table"; back.onclick = () => ffMarginPick();
  $("pickExtra").innerHTML = ""; $("pickExtra").appendChild(back);
  $("pickCancel").textContent = "Close";
  $("pick").classList.add("on");
}
window.ffMarginPick = () => {
  const f = ffMine(); if (!f || !CUR) return;
  const q = CUR.st.sq.qr, key = f.id + ":" + f.seg + ":" + f.round;
  $("pickT").textContent = "\u{1F4CB} Margin table \u2014 round " + f.round;
  $("pickS").innerHTML = "Compare total successes. <b>If you lost</b>, tap the row for how much you lost by \u2014 casualties and set-aside dice are applied for you." +
    (q.marginKey === key ? "<br>Currently applied: <b>" + q.marginLab + "</b>. Picking again replaces the set-aside part (restore any wrong casualty with Repair)." : "");
  const lst = $("picklist"); lst.innerHTML = "";
  const row = (lab, fx, on, fn, cls) => { const d = el("div", "row fmrow" + (cls ? " " + cls : "") + (on ? " done" : "")); d.innerHTML = '<span style="min-width:0;flex:1"><div class="nm">' + lab + '</div><div class="tr">' + fx + '</div></span>'; d.onclick = fn; lst.appendChild(d); };
  row("We won or tied", "nothing happens to your squad", q.marginKey === key && q.marginPick === "none", () => {
    q.nextMargin = 0; ffSumNext(q); q.marginKey = key; q.marginPick = "none"; q.marginLab = "won / tied"; save(); closePicker(); ffLastSig = ""; renderFF();
  }, "win");
  FF_MARGINS.forEach(M => row(M.lab, M.fx, q.marginKey === key && q.marginPick && q.marginPick.indexOf(M.k) === 0, () => {
    if (M.pv) { ffVolleyPick(f, key); return; }
    const again = q.marginKey === key;
    q.nextMargin = M.sup; ffSumNext(q);
    q.marginKey = key; q.marginPick = M.k; q.marginLab = M.lab.replace("Lost by ", "margin ") + ": " + M.fx;
    logEv(CUR.uid, "Firefight round " + f.round + ": " + M.lab.toLowerCase() + " \u2014 " + M.fx, "bad");
    save(); closePicker(); ffLastSig = ""; renderFF();
    if (M.cas && !again) setTimeout(() => sqCasualtyPicker(Math.min(M.cas, sqAlive(CUR.st)), M.lab + ": " + M.cas + " casualt" + (M.cas === 1 ? "y" : "ies") + "."), 150);
    else if (M.cas && again) mpToast("Set-aside dice updated. Record the new casualties with \u2620 if needed.");
  }, M.k.startsWith("pv") ? "pv" : ""));
  $("pickExtra").innerHTML = ""; $("pickCancel").textContent = "Close";
  $("pick").classList.add("on");
};
window.ffUnready = () => { const f = ffMine(); if (f) ffOp({ op: "unready", id: f.id }); };
window.ffPick = item => {
  const f = ffMine(); if (!f) return;
  const q = CUR.st.sq.qr;
  if (item !== "none" && !(q.items[item] > 0)) { mpToast("No " + FF_ITEMS[item].n + " left."); return; }
  q.ffPick = item; save();
  ffOp({ op: "pick", id: f.id, item });
};
window.ffUnpick = () => { const f = ffMine(); if (f) ffOp({ op: "unpick", id: f.id }); };
// objective clash: rolled mode = the server rolls with the current HP; physical = the players roll and report the winner
window.ffObjective = win => {
  const f = ffMine(); if (!f || !CUR) return;
  const o = ffOther(ffSideOf(f)), est = (mp.data["unit/" + f[o].team + "/" + f[o].uid] || {}).st || {};
  const enemyHp = est.hp && Number.isInteger(est.hp.hp) ? est.hp.hp : undefined;     // unknown: the server uses its last report
  ffOp({ op: "objective", id: f.id, hpMine: sqAlive(CUR.st), hpFoe: enemyHp, win });
};
window.ffSegment = forced => {
  const f = ffMine(); if (!f || f.state !== "end" || !f.obj || f.ext || ffMoreBouts(f)) return;
  const queue = x => {
    ffOp({ op: "segment", id: f.id, forced: !!forced, uid: x?.uid });
    mpToast("Forced Re-Engagement booked — it starts next turn.");
  };
  if (forced && f.eng) {
    ffSpendPick(f, "fb", "Force a re-engagement", "Choose a squad's Flashbang for the next bout.", queue);
  } else if (forced) {
    const q = CUR.st.sq.qr;
    if (!(q.items.fb > 0)) { mpToast("No Flashbang left to force a re-engagement."); return; }
    q.items.fb--; logEv(CUR.uid, "Forced Re-Engagement — Flashbang spent", "buff"); save(); queue();
  } else queue();
};
// squads of mine in this engagement, with what they have left
function ffMySquads(f) {
  const s = ffSideOf(f), list = (s === "a" ? f.eng.aList : f.eng.bList) || [];
  return list.map(x => { const r = roster.find(y => y.uid === x.uid); const st = r && r.st;
    return { uid: x.uid, label: x.label, r, alive: st ? sqAlive(st) : 0, items: (st && st.sq && st.sq.qr && st.sq.qr.items) || { fb: 0, sm: 0, gr: 0 } }; });
}
// spend one item from a chosen squad of mine (its own bag), then run the action
function ffSpendPick(f, kind, title, sub, go) {
  const opts = ffMySquads(f).filter(x => x.alive > 0 && (x.items[kind] || 0) > 0);
  if (!opts.length) { mpToast("No " + FF_ITEMS[kind].n + " left in this engagement."); return; }
  const run = x => {
    const current = ffMine();
    if (!current || current.id !== f.id || current.state !== "end" ||
        JSON.stringify(current.ext) !== JSON.stringify(f.ext) ||
        !(current.eng[ffSideOf(current) + "List"] || []).some(y => y.uid === x.uid) ||
        (mp.ffOps || []).some(op => op.id === f.id && ["deny", "smokeout", "segment"].includes(op.op)) ||
        sqAlive(x.r.st) <= 0 || !(x.r.st.sq.qr.items[kind] > 0)) return;
    const st = x.r.st; st.sq.qr.items[kind] = Math.max(0, (st.sq.qr.items[kind] || 0) - 1);
    logEv(x.uid, FF_ITEMS[kind].i + " " + FF_ITEMS[kind].n + " spent \u2014 " + title.toLowerCase(), "buff");
    save(); if (typeof sqCommit === "function" && CUR && CUR.uid === x.uid) sqCommit();
    go(x);
  };
  if (opts.length === 1) { run(opts[0]); return; }
  $("pickT").textContent = title;
  $("pickS").innerHTML = sub;
  const lst = $("picklist"); lst.innerHTML = "";
  opts.forEach(x => {
    const d = el("div", "row");
    d.innerHTML = '<span class="pt shipp gp"><img src="img/ground/' + (mpMyTeam() === "federation" ? "fed" : "spa") + '-rifleman.webp" alt=""></span>' +
      '<span style="min-width:0;flex:1"><div class="nm">' + objTagFor(x.uid) + x.label + '</div><div class="tr">' + x.alive + ' / 8 \u00b7 ' + FF_ITEMS[kind].i + ' \u00d7' + x.items[kind] + '</div></span>';
    d.onclick = () => { closePicker(); run(x); };
    lst.appendChild(d);
  });
  $("pickExtra").innerHTML = ""; $("pickCancel").textContent = "Cancel";
  $("pick").classList.add("on");
}
window.ffExtract = uid => { const f = ffMine(); if (f) ffOp({ op: "extract", id: f.id, uid: uid || f[ffSideOf(f)].uid }); };
window.ffDeny = () => {
  const f = ffMine(); if (!f) return;
  ffSpendPick(f, "fb", "\u2726 Deny the extraction", "Any squad in this engagement can throw it \u2014 pick whose Flashbang stops them leaving.",
    x => { ffOp({ op: "deny", id: f.id, uid: x.uid }); mpToast("\u2726 Flashbang \u2014 they can't slip away."); });
};
window.ffLetGo = () => { const f = ffMine(); if (f && confirm(f.ext?.holder ? "Let them leave with the objective? The engagement ends." : "Let this squad leave the engagement?")) ffOp({ op: "letgo", id: f.id }); };
window.ffSmokeOut = () => {
  const f = ffMine(); if (!f) return;
  ffSpendPick(f, "sm", "\u25CC Smoke out", "Pick whose Smoke Grenade covers the escape.",
    x => { ffOp({ op: "smokeout", id: f.id, uid: x.uid }); mpToast("\u25CC Smoke — your squad gets away."); });
};
window.ffFightOn = () => { const f = ffMine(); if (f) ffOp({ op: "fighton", id: f.id }); };
window.ffConcede = () => { const f = ffMine(); if (f && confirm("Your squads are out of the fight. The enemy secures the objective?")) ffOp({ op: "concede", id: f.id }); };
// withdraw / add / merge between bouts
window.ffEditSquads = () => {
  const f = ffMine(); if (!f || !f.eng || f.state !== "end" || !f.obj || f.ext) return;
  const s = ffSideOf(f), mineList = ffMySquads(f);
  $("pickT").textContent = "\u21C4 Edit your squads";
  $("pickS").innerHTML = "Between bouts you can pull a squad out, bring one in, or merge survivors. Leaving can be stopped by an enemy Flashbang.";
  const lst = $("picklist"); lst.innerHTML = "";
  const row = (title, sub, fn, cls) => { const d = el("div", "row" + (cls ? " " + cls : "")); d.innerHTML = '<span style="min-width:0;flex:1"><div class="nm">' + title + '</div><div class="tr">' + sub + '</div></span>'; d.onclick = fn; lst.appendChild(d); };
  row("\u2190 Withdraw a squad", "pull it out of the engagement", () => ffPickSquadList(f, mineList.filter(x => x.alive > 0), "Withdraw which squad?", x => {
    if (!confirm("Pull " + x.label + " out of the engagement?")) return;
    closePicker(); ffExtract(x.uid);
  }));
  const free = squadsInRoster().filter(r => !isDead(r) && sqAlive(r.st) > 0 && !ffForUid(r.uid, mpMyTeam()) && !(carrierState(r.uid) || {}).state)
    .map(r => ({ uid: r.uid, label: unitLabel(r.uid), r, alive: sqAlive(r.st), items: (r.st.sq.qr && r.st.sq.qr.items) || {} }));
  row("+ Bring a squad in", free.length ? free.length + " squad(s) nearby" : "no free squads", () => {
    if (!free.length) { mpToast("No free squads to bring in."); return; }
    ffPickSquadList(f, free, "Bring which squad in?", x => { ffOp({ op: "engedit", id: f.id, kind: "add", uid: x.uid, label: x.label }); mpToast(x.label + " joins the engagement."); });
  });
  row("\u29C9 Merge survivors", "pool their health into the healthiest squad (max 8)", () => ffMergePick(f), "");
  $("pickExtra").innerHTML = ""; $("pickCancel").textContent = "Close";
  $("pick").classList.add("on");
};
function ffPickSquadList(f, list, title, go) {
  $("pickT").textContent = title; $("pickS").innerHTML = "";
  const lst = $("picklist"); lst.innerHTML = list.length ? "" : '<div class="empty">Nothing to pick.</div>';
  list.forEach(x => {
    const d = el("div", "row");
    d.innerHTML = '<span class="pt shipp gp"><img src="img/ground/' + (mpMyTeam() === "federation" ? "fed" : "spa") + '-rifleman.webp" alt=""></span>' +
      '<span style="min-width:0;flex:1"><div class="nm">' + objTagFor(x.uid) + x.label + '</div><div class="tr">' + x.alive + ' / 8 \u00b7 \u2726' + (x.items.fb || 0) + ' \u25CC' + (x.items.sm || 0) + ' \u2739' + (x.items.gr || 0) + '</div></span>';
    d.onclick = () => { closePicker(); go(x); };
    lst.appendChild(d);
  });
  $("pickExtra").innerHTML = ""; $("pickCancel").textContent = "Cancel";
  $("pick").classList.add("on");
}
// merge: pooled health (max 8) into the healthiest squad; the others leave the table
function ffMergePick(f) {
  const opts = ffMySquads(f).filter(x => x.alive > 0);
  if (opts.length < 2) { mpToast("You need two squads in the engagement to merge."); return; }
  const chosen = [];
  const draw = () => {
    const pool = Math.min(8, chosen.reduce((m, x) => m + x.alive, 0));
    $("pickT").textContent = "\u29C9 Merge survivors";
    $("pickS").innerHTML = "Tap two or more of your squads. Their health pools into the healthiest one (max 8) and the rest leave the table." +
      (chosen.length > 1 ? "<br><b>" + chosen.map(x => x.label + " (" + x.alive + ")").join(" + ") + " \u2192 " + pool + " / 8</b>" : "");
    const lst = $("picklist"); lst.innerHTML = "";
    opts.forEach(x => {
      const on = chosen.some(c => c.uid === x.uid), d = el("div", "row" + (on ? " done" : ""));
      d.innerHTML = '<span style="min-width:0;flex:1"><div class="nm">' + (on ? "\u2713 " : "") + objTagFor(x.uid) + x.label + '</div><div class="tr">' + x.alive + ' / 8</div></span>';
      d.onclick = () => { const k = chosen.findIndex(c => c.uid === x.uid); if (k >= 0) chosen.splice(k, 1); else chosen.push(x); draw(); };
      lst.appendChild(d);
    });
    $("pickExtra").innerHTML = "";
    if (chosen.length > 1) {
      const go = el("button", "btn big pri"); go.textContent = "Merge into " + chosen.slice().sort((a, b) => b.alive - a.alive)[0].label + " (" + pool + " / 8)";
      go.onclick = () => { closePicker(); ffMergeGo(f, chosen); };
      $("pickExtra").appendChild(go);
    }
    $("pickCancel").textContent = "Cancel"; $("pick").classList.add("on");
  };
  draw();
}
function ffMergeGo(f, chosen) {
  const keep = chosen.slice().sort((a, b) => b.alive - a.alive)[0];
  const latest = ffMine();
  if (!latest || latest.id !== f.id || latest.state !== "end" || latest.ext) return;
  const pool = Math.min(8, chosen.reduce((m, x) => m + x.alive, 0));
  const gone = chosen.filter(x => x.uid !== keep.uid);
  const st = keep.r.st;
  st.sq.soldiers.forEach((sol, i) => { sol.hp = i < pool ? Math.max(1, sol.hp || 1) : 0; });
  sqSyncHP(st);
  logEv(keep.uid, "\u29C9 Merged with " + gone.map(x => x.label).join(", ") + " \u2014 " + pool + " / 8 soldiers", "buff");
  gone.forEach(x => { x.r.st.sq.soldiers.forEach(sol => { sol.hp = 0; }); sqSyncHP(x.r.st); logEv(x.uid, "\u29C9 Merged into " + keep.label, "info"); });
  save(); if (typeof sqCommit === "function" && CUR && chosen.some(c => c.uid === CUR.uid)) sqCommit();
  ffOp({ op: "engedit", id: f.id, kind: "merge", keepUid: keep.uid, uids: gone.map(x => x.uid) });
  mpToast("\u29C9 Merged into " + keep.label + " \u2014 " + pool + " / 8 soldiers.");
}
window.ffNextBout = () => { const f = ffMine(); if (!f) return; ffOp({ op: "nextbout", id: f.id }); mpToast("\u2694 Next bout lined up \u2014 it starts when the next turn begins."); };
window.ffNextSquad = () => {
  const f = ffMine(); if (!f || !f.eng || !f.eng.pairs) return;
  const s = ffSideOf(f), nb = (f.eng.bout || 1) + 1;
  if (nb > f.eng.pairs.length) return;
  const list = s === "a" ? f.eng.aList : f.eng.bList;
  $("pickT").textContent = "\u21C4 Who takes bout " + nb + "?";
  $("pickS").innerHTML = "Pick one of your squads in this engagement. A squad that just fought can go again \u2014 it keeps its wounds and whatever items it has left.";
  const lst = $("picklist"); lst.innerHTML = "";
  list.forEach(x => {
    const r = roster.find(y => y.uid === x.uid), alive = r && r.st ? sqAlive(r.st) : 0;
    const it = r && r.st && r.st.sq && r.st.sq.qr && r.st.sq.qr.items;
    const now = (s === "a" ? f.eng.pairs[nb - 1][0] : f.eng.pairs[nb - 1][1]) === x.uid;
    const d = el("div", "row" + (now ? " done" : "") + (alive <= 0 ? " car-aboard" : ""));
    d.innerHTML = '<span class="pt shipp gp"><img src="img/ground/' + (mpMyTeam() === "federation" ? "fed" : "spa") + '-rifleman.webp" alt=""></span>' +
      '<span style="min-width:0;flex:1"><div class="nm">' + objTagFor(x.uid) + x.label + (now ? ' \u2713' : '') + '</div><div class="tr">' +
      (alive <= 0 ? "wiped out" : alive + " / 8 \u00b7 " + (it ? "\u2726" + (it.fb || 0) + " \u25CC" + (it.sm || 0) + " \u2739" + (it.gr || 0) : "full items")) + '</div></span>';
    if (alive > 0 && !now) d.onclick = () => { closePicker(); ffOp({ op: "setnext", id: f.id, uid: x.uid }); mpToast(x.label + " takes bout " + nb + "."); };
    lst.appendChild(d);
  });
  $("pickExtra").innerHTML = ""; $("pickCancel").textContent = "Cancel";
  $("pick").classList.add("on");
};
window.ffEnd = () => {
  const f = ffMine() || (CUR && ffForUid(CUR.uid, mpMyTeam())); if (!f) return;
  if (!confirm("End this firefight for both sides?")) return;
  ffOp({ op: "end", id: f.id });
};
// ---------- my side's bookkeeping, once per state change ----------
// manual objective marker (for fights resolved without the app, or when the squad leaves the objective)
window.sqObjective = on => {
  if (!CUR || !CUR.st || !CUR.st.sq) return;
  if (typeof mpSheetCanEdit === "function" && mpTeamMode() && !mpSheetCanEdit()) { mpToast("Only the player controlling this sheet can change that."); return; }
  let oname = "";
  if (on) oname = (prompt("What is this objective? (e.g. Server room)", objName(CUR.st.sq.holdsObj)) || "").trim().slice(0, 24);
  CUR.st.sq.holdsObj = on ? { vs: "", turn: turn.round || 0, name: oname } : null;
  logEv(CUR.uid, on ? "\u{1F6A9} Holds " + (oname || "the objective") : "No longer holds the objective", "info");
  save(); if (typeof sqCommit === "function") sqCommit(); else draw();
};
function ffSync(f) {
  const s = ffSideOf(f), q = CUR.st.sq.qr;
  if (q.ffId !== f.id) {                                   // a new engagement: items refill
    q.ffId = f.id; q.ffSeg = f.seg; q.round = 1; q.supp = 0; q.suppFlash = 0; q.next = 0; q.nextFlash = 0; q.nextExtra = 0; q.nextOnes = 0; q.nextMargin = 0; q.res = null; q.ffRound = "1:1"; q.ffApplied = "";
    logEv(CUR.uid, "Firefight vs " + f[ffOther(s)].label, "info"); save();
  }
  // items are never refilled by a fight: a squad keeps what is left until it resupplies aboard a vehicle
  if (f.obj && f.obj.seg === f.seg) {
    const holder = f.holder || { side: f.obj.win, uid: f[f.obj.win].uid };
    const ok = f.id + ":" + f.seg + ":" + holder.side + ":" + holder.uid;
    if (q.objKey !== ok) {
      q.objKey = ok;
      const ids = f.eng ? f.eng[ s + "List" ].map(x => x.uid) : [f[s].uid];
      // Include a removed holder when merges changed the roster.
      roster.filter(r => ids.includes(r.uid) || r.st?.sq?.holdsObj?.engId === f.id).forEach(r => {
        if (!r.st.sq) return;
        r.st.sq.holdsObj = holder.side === s && holder.uid === r.uid ?
          { vs: f[ffOther(s)].label, turn: turn.round || 0, name: f.eng?.obj || "", engId: f.id } : null;
      });
      logEv(CUR.uid, holder.side === s ? "🚩 Your side holds the objective" : "The enemy holds the objective", holder.side === s ? "buff" : "bad");
      save(); if (typeof sqCommit === "function") sqCommit();
    }
  }
  const rk = f.seg + ":" + f.round;
  if (q.ffRound !== rk && (f.state === "pick" || f.state === "ready")) {   // a new round began: next round's suppression becomes current
    const newSeg = q.ffRound && q.ffRound.split(":")[0] !== String(f.seg);
    q.flashNow = 0;
    q.supp = newSeg ? 0 : Math.min(8, q.nextExtra || 0);
    q.next = 0; q.nextFlash = 0; q.nextExtra = 0; q.nextOnes = 0; q.nextMargin = 0; q.round = f.round; q.ffRound = rk; save();
  }
}
// apply what the reveal means for MY squad (both devices do this for themselves)
function ffApply(f) {
  const s = ffSideOf(f), o = ffOther(s), q = CUR.st.sq.qr, uid = CUR.uid;
  const key = f.id + ":" + f.seg + ":" + f.round;
  if (q.ffApplied === key) return null;
  q.ffApplied = key;
  const my = f.reveal[s], foe = f.reveal[o], lines = [];
  let cas = 0, fx = [];
  if (my !== "none" && q.items[my] > 0) q.items[my] -= 1;
  const chips = [];
  const say = (tone, chip, line) => { chips.push({ t: tone, s: chip }); lines.push(line); };
  q.flashNow = 0;
  if (my === "fb") { if (foe === "sm") say("bad", "Your flashbang was blocked", "Their Smoke cancelled your Flashbang."); else say("good", "Flashbang landed: they roll 3 fewer dice", "Your Flashbang lands \u2014 they roll 3 fewer dice this round."); }
  if (my === "sm") { if (foe === "gr") say("bad", "Your smoke was blocked", "Their Grenade cancelled your Smoke."); else { say("good", "Smoke cleared your set-aside dice", "Your Smoke clears your set-aside dice \u2014 roll your full firepower this round."); q.supp = 0; q.suppFlash = 0; } }
  if (my === "gr") { if (foe === "fb") { say("bad", "Flashed mid-throw: your grenade hit you (1 down)", "Flashed mid-throw \u2014 your Grenade dropped at your feet: 1 casualty to you."); cas += 1; fx.push("boom"); } else say("good", "Grenade hit: 1 enemy down", "Your Grenade lands \u2014 1 casualty on them."); }
  if (foe === "fb") { if (my === "sm") say("good", "You blocked their flashbang", "Your Smoke cancelled their Flashbang."); else { say("bad", "Flashed: you roll 3 fewer dice", "Flashed \u2014 you roll 3 fewer dice this round."); q.flashNow = 3; fx.push("flash"); } }
  if (foe === "sm") { if (my === "gr") say("good", "You blocked their smoke", "Your Grenade cancelled their Smoke."); else { say("neutral", "They cleared their set-aside dice", "Their Smoke clears their set-aside dice."); fx.push("smoke"); } }
  if (foe === "gr") { if (my === "fb") say("good", "Their grenade hit their own squad", "Your Flashbang made their Grenade drop on their own squad."); else { say("bad", "Their grenade: 1 of yours down", "Their Grenade lands \u2014 1 casualty to you."); cas += 1; fx.push("boom"); } }
  if (my === "none" && foe === "none") say("neutral", "No items this round", "No items this round.");
  q.res = lines; q.chips = chips;
  logEv(uid, "Firefight round " + f.round + ": you " + FF_ITEMS[my].n + " vs them " + FF_ITEMS[foe].n, "info");
  save();
  return { cas, fx };
}
// Roll for me: apply what the dice mean for MY squad, once, when they arrive
function ffApplyRoll(f) {
  const s = ffSideOf(f), o = ffOther(s), q = CUR.st.sq.qr;
  const key = f.id + ":" + f.seg + ":" + f.round;
  if (!f.roll || q.rollApplied === key) return null;
  q.rollApplied = key;
  q.chips = (q.chips || []).slice(); q.res = (q.res || []).slice();
  const say = (tone, chip, line) => { q.chips.push({ t: tone, s: chip }); q.res.push(line); };
  const mine = f.roll[s] || [], theirs = f.roll[o] || [];
  const score = a => a.reduce((m, v) => m + (v === 6 ? 2 : v >= 3 ? 1 : 0), 0);
  const volley = a => a.length >= 2 && a.length <= 5 && a.every(v => v === 6);
  const ms = score(mine), ts = score(theirs);
  const casText = c => c + " casualt" + (c === 1 ? "y" : "ies");
  let cas = 0, lab = "";
  q.nextMargin = 0;
  if (volley(theirs) && !volley(mine)) { cas = VOLLEY(theirs.length); lab = "Their Perfect Volley \u00b7 " + cas + " destroyed"; say("bad", lab, "Their Perfect Volley \u2014 you lose " + cas + "."); }
  else if (volley(mine) && !volley(theirs)) say("good", "Perfect volley: " + VOLLEY(mine.length) + " enemies down", "Your Perfect Volley destroys " + VOLLEY(mine.length) + " of theirs.");
  else {
    const m = ms - ts;
    if (m < 0) { const [c, su] = MARGIN_FX(-m); cas = c; q.nextMargin = su; lab = "Lost by " + (-m) + " \u00b7 " + casText(c) + (su ? " + " + su + " set aside" : ""); say("bad", lab, "They won the exchange " + ts + "\u2013" + ms + " \u2014 you take " + casText(c) + (su ? " and set " + su + " dice aside next round" : "") + "."); }
    else if (m > 0) { const [c, su] = MARGIN_FX(m); say("good", "Won by " + m + ": they take " + casText(c) + (su ? " + " + su + " set aside" : ""), "You won the exchange " + ms + "\u2013" + ts + " \u2014 they take " + casText(c) + (su ? " and set " + su + " dice aside next round" : "") + "."); }
    else say("neutral", "Tied " + ms + "\u2013" + ts, "The exchange is tied " + ms + "\u2013" + ts + ".");
  }
  const ones = mine.filter(v => v === 1).length;
  q.nextOnes = ones; ffSumNext(q);
  if (ones) q.res.push(ones + " of your dice rolled a 1 \u2014 set aside next round.");
  if (mine.length === 1 && mine[0] === 6) say("good", "Last man standing: your soldier escapes", "Last Man Standing \u2014 your soldier breaks contact and escapes.");
  save();
  return { cas, lab, ms, ts, ones };
}
window.ffRollForMe = () => { const f = ffMine(); if (!f) return; ffOp({ op: "roll", id: f.id }); ffPendingRoll = f.id + ":" + f.seg + ":" + f.round; ffLastSig = ""; renderFF(); };
let ffPendingRoll = "";
window.ffRolledNext = () => {
  const f = ffMine(); if (!f || !CUR) return;
  const q = CUR.st.sq.qr, fs = ffFs(f, q), s = ffSideOf(f), cl = f.claim || {};
  if (cl[s] !== "lost") { window.ffGo("summary"); return; }
  if (fs.applied) { window.ffGo("summary"); return; }
  if ((fs.cas || 0) > 0 && sqAlive(CUR.st) > 0) {
    fs.target = Math.max(0, sqAlive(CUR.st) - fs.cas); fs.s = "cas"; save(); ffLastSig = ""; renderFF();
    setTimeout(() => window.ffCasualties(), 150);
  } else ffLossDone();
};
function ffDiceRow(a, anim) {
  return (a || []).map((v, i) => '<i class="ffdz d' + v + (anim ? ' roll' : '') + '"' + (anim ? ' style="animation-delay:' + (i * 0.07).toFixed(2) + 's"' : '') + '>' + v + '</i>').join("");
}
// ---------- the clash screen ----------
function ffDiceHTML(a) { return (a || []).map(v => '<i class="d' + v + '">' + v + '</i>').join(""); }
function ffPlay(fx) {
  // effects live on their own layer, so screen updates (e.g. adjusting your 1s) never cut them short or replay them
  let box = $("fffx");
  if (!box) { box = document.createElement("div"); box.id = "fffx"; document.body.appendChild(box); }
  fx.forEach((k, n) => setTimeout(() => {
    const d = document.createElement("div"); d.className = "ffanim " + k;
    if (k === "smoke") d.innerHTML = "<i></i><i></i><i></i><i></i><i></i><img class=\"ffspr sm\" src=\"img/fx/smoke-o.webp\" alt=\"\">";
    if (k === "boom") d.innerHTML = "<i></i><img class=\"ffspr gr\" src=\"img/fx/ground.webp\" alt=\"\"><img class=\"ffspr fb2\" src=\"img/fx/star-y.webp\" alt=\"\">";
    if (k === "flash") d.innerHTML = "<img class=\"ffspr fl\" src=\"img/fx/star-w.webp\" alt=\"\">";
    box.appendChild(d); setTimeout(() => d.remove(), k === "smoke" ? 2600 : 1400);
  }, n * 250));
}
let ffCardSig = "";
// End-of-bout flow: clash -> engagement board -> one disengagement decision.
function ffText(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function ffMoreBouts(f) { return !!(f.eng && f.eng.pairs && f.eng.bout < f.eng.pairs.length); }
function ffBreakPending(f) {
  return f.state === "end" && (!f.obj || !!f.ext || (ffMoreBouts(f) && !(f.confirmed?.a && f.confirmed?.b)));
}
window.ffBoardBack = () => { ffHidden = true; renderFF(); closeSheet(); };
window.ffConfirmFighter = () => {
  const f = ffMine(); if (!f) return;
  ffOp({ op: f.confirmed?.[ffSideOf(f)] ? "unconfirm" : "nextbout", id: f.id });
};
window.ffChooseFighter = uid => {
  const f = ffMine(); if (f) ffOp({ op: "setnext", id: f.id, uid });
};
function ffBoard(f, s) {
  const o = ffOther(s), name = ffText(f.eng?.obj || "the objective");
  const more = ffMoreBouts(f), mine = f.confirmed?.[s], theirs = f.confirmed?.[o];
  const holder = f.holder || (f.obj && { side: f.obj.win, uid: f[f.obj.win].uid });
  const lists = f.eng || { aList: [f.a], bList: [f.b] };
  const pr = more ? f.eng.pairs[f.eng.bout] : null;
  const cards = sd => lists[sd + "List"].map(x => {
    const own = sd === s, r = own && roster.find(y => y.uid === x.uid);
    const st = r ? r.st : (mp.data["unit/" + f[sd].team + "/" + x.uid] || {}).st;
    const hp = st?.sq ? sqAlive(st) : st?.hp?.hp ?? "?";
    const items = st?.sq?.qr?.items || {};
    const chosen = pr && pr[sd === "a" ? 0 : 1] === x.uid;
    const holds = holder?.side === sd && holder.uid === x.uid;
    return '<article class="ffboard-card' + (chosen ? ' selected' : '') + '">' +
      '<div class="ffboard-name"><b>' + ffText(x.label) + '</b>' + (holds ? '<span class="ffboard-flag">🚩 ' + name + '</span>' : '') + '</div>' +
      '<div class="ffboard-hp"><b>' + hp + ' / 8</b><span>' + (chosen ? 'Next fighter' : hp === 0 ? 'Out of action' : 'In the engagement') + '</span></div>' +
      (own ? '<div class="ffboard-items">' + ["fb", "sm", "gr"].map(k => '<span><img src="img/items/' + (f[sd].team === "federation" ? "fed" : "spa") + '-' + k + '.webp" alt="' + FF_ITEMS[k].n + '"><b>×' + (items[k] || 0) + '</b></span>').join('') + '</div>' : '<div class="ffboard-hidden">Items hidden</div>') +
      (own && hp > 0 ? '<div class="ffboard-actions">' + (more ? '<button class="btn' + (chosen ? ' pri' : '') + '" onclick="ffChooseFighter(' + x.uid + ')"' + (mine || chosen ? ' disabled' : '') + '>' + (chosen ? '✓ Selected' : 'Select fighter') + '</button>' : '') +
        '<button class="btn" onclick="ffExtract(' + x.uid + ')">Disengage' + (holds ? ' with 🚩' : '') + '</button></div>' : '') + '</article>';
  }).join('');
  const noAlive = f.eng && !ffMySquads(f).some(x => x.alive > 0);
  const status = mine && theirs ? 'Both teams confirmed — bout ' + (f.eng.bout + 1) + ' starts next turn.' : mine ? 'Waiting for the ' + teamName(f[o].team) + ' to confirm.' : 'Choose your next fighter, then confirm.';
  return '<section class="ffboard"><div class="ffboard-title"><div><small>BETWEEN BOUTS</small><h2>Engagement board</h2><p>🚩 ' + name + ' · ' + (holder?.side === s ? 'Your squad holds it' : 'The enemy holds it') + '</p></div>' +
    (f.eng ? '<button class="btn" onclick="ffEditSquads()">⇄ Edit roster</button>' : '') + '</div>' +
    '<div class="ffboard-teams">' + [s, o].map(sd => '<section class="ffboard-team ' + f[sd].team + '"><h3>' + teamName(f[sd].team) + '<small>' + (sd === s ? 'YOUR SQUADS' : 'ENEMY SQUADS') + '</small></h3>' + cards(sd) + '</section>').join('') + '</div>' +
    (noAlive ? '<div class="ffboard-confirm"><b>Your squads are out of the fight.</b><button class="btn pri" onclick="ffConcede()">End the engagement</button></div>' : more ? '<div class="ffboard-confirm" role="status"><div><b>Bout ' + (f.eng.bout + 1) + ' of ' + f.eng.pairs.length + '</b><p>' + status + '</p><small>' + (mine && theirs ? 'You can un-confirm until this turn ends.' : 'Both teams must confirm before the turn can end.') + '</small></div><button class="btn big ' + (mine ? '' : 'pri') + '" onclick="ffConfirmFighter()">' + (mine ? 'Un-confirm' : 'Confirm fighter') + '</button></div>' : '<p class="ffboard-finished">All bouts complete. Disengage to leave, or open More for the remaining options.</p>') +
    '<details class="ffboard-more"><summary>⋯ More</summary><div class="ffrow wrap">' + (!more ? '<button class="btn" onclick="ffSegment(true)">✦ Forced Re-Engagement · 1 Flashbang</button>' : '') + '<button class="btn" onclick="ffEnd()">End firefight</button></div></details></section>';
}
function ffDisengageScreen(f, s) {
  const ex = f.ext, own = ex.side === s;
  const who = (f.eng[ex.side + "List"].find(x => x.uid === ex.uid) || f[ex.side]).label;
  const obj = ex.holder ? ' with 🚩 ' + ffText(f.eng.obj || 'the objective') : '';
  const has = k => ffMySquads(f).some(x => x.alive > 0 && x.items[k] > 0);
  return '<div class="ffmsg ffdeparture"><b>' + (own ? 'Disengaging: ' : 'They are disengaging: ') + ffText(who) + obj + '</b>' +
    (own ? ex.deny ? '<span>The enemy used a Flashbang. Use Smoke to get away, or stay and choose fighters again.</span><div class="ffrow wrap"><button class="btn big pri" onclick="ffSmokeOut()"' + (!has('sm') ? ' disabled' : '') + '>Smoke out · 1 Smoke</button><button class="btn" onclick="ffFightOn()">Stay and fight on</button></div>' + (!has('sm') ? '<small>No Smoke left in your engagement.</small>' : '') : '<span>Waiting for the enemy to let you go or deny with a Flashbang.</span>' :
      ex.deny ? '<span>Flashbang thrown — waiting for their Smoke response.</span>' : '<span>Any of your squads in this engagement can spend a Flashbang.</span><div class="ffrow wrap"><button class="btn big pri" onclick="ffDeny()"' + (!has('fb') ? ' disabled' : '') + '>Deny · 1 Flashbang</button><button class="btn" onclick="ffLetGo()">Let them go</button></div>') + '</div>';
}

function renderFF() {
  let box = $("ffx");
  renderFFInvites();
  // keep the squad sheet's firefight card current
  if (mpTeamMode() && CUR && U && isSquad(U) && $("s4").classList.contains("on") && CUR.st.sq) {
    const cf = ffForUid(CUR.uid, mpMyTeam());
    const qi = (CUR.st.sq.qr && CUR.st.sq.qr.items) || {};
    const cs = (cf ? [cf.id, cf.state, cf.round, cf.seg, cf.a.pid, cf.b.pid].join("|") : "-") + "|" + [qi.fb, qi.sm, qi.gr].join(",");
    if (cs !== ffCardSig) { ffCardSig = cs; setTimeout(() => { if (CUR && U && isSquad(U)) draw(); }, 0); }
  }
  const fightKey = JSON.stringify(ffActiveFight());
  if (fightKey !== ffTurnKey) { ffTurnKey = fightKey; setTimeout(() => { if (typeof renderTurn === "function" && turn) renderTurn(); }, 0); }
  const f = ffMine();
  if (!f || ffHidden) { if (box) box.remove(); ffLastSig = ""; renderFFInvites(); return; }
  if ((f.state === "closed" && !(f.secured && f.eng)) || f.state === "declined" || f.state === "queued") { if (box) box.remove(); ffLastSig = ""; renderFFInvites(); return; }
  ffSync(f);
  const s = ffSideOf(f), o = ffOther(s), q = CUR.st.sq.qr, alive = sqAlive(CUR.st);
  const enemyUnit = (mp.data["unit/" + f[o].team + "/" + f[o].uid] || {}).st || {};
  const enemyAlive = enemyUnit.hp ? enemyUnit.hp.hp : "?";
  const otherHere = ffSidePidAlive(f, o) || f.state === "invite";
  const sig = JSON.stringify([f, alive, q.supp, q.flashNow, q.nextOnes, q.nextMargin, q.onesKey, q.fs, q.marginKey, q.marginPick, q.items, q.res, otherHere, enemyAlive, f.state === "end" && f.eng ? [ffMySquads(f).map(x => [x.uid, x.alive, x.items]), f.eng[o + "List"].map(x => mp.data["unit/" + f[o].team + "/" + x.uid]?.st?.hp)] : null]);
  if (!box) { box = document.createElement("div"); box.id = "ffx"; document.body.appendChild(box); }
  if (sig === ffLastSig) return;
  ffLastSig = sig;
  const myLabel = unitLabel(CUR.uid), foeLabel = f[o].label || "Enemy squad";
  const pips = [1, 2, 3, 4].map(r => '<i class="' + (r < f.round ? "past" : r === f.round && f.state !== "end" ? "on" : "") + '"></i>').join("");
  let body = "";
  const itemBtns = () => Object.keys(FF_ITEMS).map(k => {
    const n = k === "none" ? null : q.items[k];
    return '<button class="ffitem it-' + k + (k !== "none" && !n ? " empty" : "") + '" onclick="ffPick(\'' + k + '\')"><b>' + FF_ITEMS[k].i + '</b><span>' + FF_ITEMS[k].n + '</span>' +
      (n === null ? "" : '<em>\u00d7' + n + '</em>') + '</button>';
  }).join("");
  if (f.state === "invite") body = '<div class="ffmsg"><b>Challenge sent</b><span>Waiting for the ' + teamName(f.b.team) + ' to accept\u2026</span><button class="btn" onclick="ffEnd()">Cancel challenge</button></div>';
  else if (f.state === "mode") {
    if (!f.rollAsk) body = '<div class="ffmsg"><b>How are you rolling?</b><span>Physical dice: roll at the table and the app tracks items and effects. Roll for me: the app rolls both squads\u2019 dice \u2014 the enemy must agree.</span>' +
      '<div class="ffrow"><button class="btn big" onclick="ffMode(\'physical\')">\u{1F3B2} Physical dice</button><button class="btn big pri" onclick="ffMode(\'roll\')">\u2699 Roll for me</button></div></div>';
    else if (f.rollAsk === s) body = '<div class="ffmsg"><b>Asked the enemy to use rolled dice</b><span>Waiting for their answer\u2026</span></div>';
    else body = '<div class="ffmsg"><b>The enemy wants the app to roll the dice</b><span>Both squads\u2019 dice would be rolled by the app each round.</span>' +
      '<div class="ffrow"><button class="btn big pri" onclick="ffModeAnswer(true)">Accept rolled dice</button><button class="btn big" onclick="ffModeAnswer(false)">Use physical dice</button></div></div>';
  } else if (f.state === "ready") {
    const iReady = !!f.ready[s];
    body = '<div class="ffmsg"><b>' + (f.seg > 1 ? "Bout " + f.seg + " \u2014 " : "") + "Round " + f.round + ' \u2014 get ready</b><span>' +
      "You'll pick an item first, then roll after the reveal." + (q.supp ? ' <b class="warnt">' + q.supp + ' of your dice start this round set aside.</b>' : '') + '</span>' +
      '<div class="ffrow"><button class="btn big ' + (iReady ? "ready" : "pri") + '" onclick="' + (iReady ? "ffUnready()" : "ffReady()") + '">' + (iReady ? "\u2713 READY \u2014 tap to wait" : "READY") + '</button></div>' +
      '<span class="ffwho">' + (f.ready[o] ? "\u2713 The enemy is ready" : "The enemy is getting ready\u2026") + '</span></div>';
  } else if (f.state === "pick") {
    const locked = f.lock[s];
    body = (q.supp ? '<div class="ffaside">\u26A0 ' + q.supp + ' of your dice are set aside this round (1s / margin from last round) \u2014 unless your Smoke clears them. A Flashbang would take 3 more.</div>' : '') +
      (locked
        ? '<div class="ffmsg"><b>\u{1F512} ' + FF_ITEMS[q.ffPick || "none"].n + ' locked in</b><span>' + (f.lock[o] ? "Both locked \u2014 revealing\u2026" : "Waiting for the enemy to choose\u2026") + '</span><button class="btn" onclick="ffUnpick()">Change</button></div>'
        : '<div class="ffmsg"><b>Choose your item \u2014 blind</b><span>' + (f.lock[o] ? "\u{1F512} The enemy has locked in." : "The enemy is choosing\u2026") + '</span></div><div class="ffitems">' + itemBtns() + '</div>');
  } else if (f.state === "reveal") {
    const rkey = f.id + ":" + f.seg + ":" + f.round;
    const counted = ffShown[rkey];
    if (!counted) {
      body = '<div class="ffcount"><b>3</b></div>';
      ffShown[rkey] = "counting"; ffShown[rkey + ":n"] = 3;
      [2, 1].forEach((n, k) => setTimeout(() => { ffShown[rkey + ":n"] = n; const c = document.querySelector("#ffx .ffcount b"); if (c) c.textContent = n; }, (k + 1) * 550));
      setTimeout(() => {
        ffShown[rkey] = "done";
        const res = ffApply(f);
        ffLastSig = "";
        renderFF();
        if (res) { ffPlay(res.fx); if (res.cas) setTimeout(() => sqCasualtyPicker(Math.min(res.cas, sqAlive(CUR.st)), "Firefight: " + res.cas + " casualt" + (res.cas === 1 ? "y" : "ies") + "."), 900); }
      }, 1700);
    } else if (counted === "done") {
      const my = f.reveal[s], foe = f.reveal[o], iReady = !!f.ready[s];
      const still = ffShown[rkey + ":flip"] ? " still" : ""; ffShown[rkey + ":flip"] = 1;   // flip only once
      const fp = FIREPOWER(alive), fl = q.flashNow || 0, off = q.supp + fl, nowDice = qrDice(alive, off);
      const parts = "Firepower " + fp + (q.supp ? " \u2212 " + q.supp + " set aside" : "") + (fl ? " \u2212 3 flashed" : "") + (alive > 1 && fp - off < 2 ? " (minimum 2)" : "");
      const rolled = f.mode === "rolled" && f.roll;
      // left: what happened
      const vs = '<div class="ffvs2' + still + '"><span class="it-' + my + '"><small>YOU</small><b>' + FF_ITEMS[my].i + '</b>' + FF_ITEMS[my].n + '</span>' +
        '<em>VS</em><span class="it-' + foe + '"><small>ENEMY</small><b>' + FF_ITEMS[foe].i + '</b>' + FF_ITEMS[foe].n + '</span></div>';
      const dice = rolled ? '<div class="ffdice"><div><small>YOUR DICE</small><p>' + ffDiceHTML(f.roll[s]) + '</p></div><div><small>ENEMY DICE</small><p>' + ffDiceHTML(f.roll[o]) + '</p></div></div>' : '';
      const chips = '<div class="ffchips">' + (q.chips || []).map(c => '<span class="ffchip ' + c.t + '">' + (c.t === "good" ? "\u2713 " : c.t === "bad" ? "\u26A0 " : "") + c.s + '</span>').join("") + '</div>';
      const det = '<details class="ffdet"' + (ffDetOpen ? ' open' : '') + ' ontoggle="ffDetOpen=this.open"><summary>\u24D8 Details</summary>' +
        (q.res || []).map(t => '<p>' + t + '</p>').join("") +
        '<p class="key">Dice: 1 = set aside next round \u00b7 2 = miss \u00b7 3\u20135 = 1 success \u00b7 6 = 2 successes</p>' +
        (rolled ? '<div class="fm-rows">' + MARGIN_TABLE.map(([mm, oo]) => '<span><b>' + mm + '</b>' + oo + '</span>').join("") + '</div>' : '') + '</details>';
      // right: what to do
      const onesDone = q.onesKey === f.id + ":" + f.seg + ":" + f.round;
      const rollBox = !rolled
        ? (onesDone ? '' : '<div class="ffroll"><b>\u{1F3B2} ROLL ' + nowDice + ' DICE NOW</b><span>' + parts + '</span>' +
          (off ? '<em>' + (fl ? 'Flashed \u2014 ' : '') + 'move ' + Math.min(off, fp) + (Math.min(off, fp) === 1 ? ' die' : ' dice') + ' away before rolling</em>' : '') + '</div>')
        : '<div class="ffroll small"><span>The app rolled ' + (f.roll[s] || []).length + ' dice for you' + (off ? ' (' + parts + ')' : '') + '</span></div>';
      const ones = q.nextOnes || 0, maxOnes = Math.max(1, rolled ? (f.roll[s] || []).length : nowDice);
      const onesRow = f.round < 4 ? '<div class="ffones"><span>How many of your dice rolled a 1?</span><div class="ffonesrow">' +
        Array.from({ length: maxOnes + 1 }, (_, n) => '<button type="button" class="ffo' + (n === ones ? ' on' : '') + '" data-n="' + n + '" onclick="ffOnes(' + n + ')">' + n + '</button>').join("") +
        '</div></div>' : '';
      const key = f.id + ":" + f.seg + ":" + f.round, applied = q.marginKey === key;
      const margin = !rolled
        ? '<button class="ffmbtn' + (applied ? ' done' : '') + '" onclick="ffMarginPick()">' + (applied ? '\u2713 ' + q.marginLab + ' \u00b7 change' : '\u{1F4CB} Lost this round? Pick the margin') + '</button>'
        : '';
      const next = f.round < 4 ? '<div class="ffnd">' + ffNextText(q, alive) + '</div>' : '';
      const ready = '<button class="btn big ffready ' + (iReady ? "ready" : "pri") + '" onclick="' + (iReady ? "ffUnready()" : "ffReady()") + '">' +
        (iReady ? "\u2713 READY \u2014 tap to wait" : f.round >= 4 ? "READY \u2014 finish the bout" : "READY FOR ROUND " + (f.round + 1)) + '</button>' +
        '<span class="ffwho">' + (f.ready[o] ? "\u2713 The enemy is ready" : "The enemy is adjusting\u2026") + '</span>';
      body = f.mode === "physical" || f.mode === "rolled"
        ? ffWizard(f, s, o, q, alive, { vs, chips, det, nowDice, parts, off, fl, fp })
        : '<div class="ffrv2"><div class="ffcolL">' + vs + dice + chips + det + '</div><div class="ffcolR">' + rollBox + onesRow + margin + next + ready + '</div></div>';
    } else body = '<div class="ffcount"><b class="keep">' + (ffShown[rkey + ":n"] || 1) + '</b></div>';   // a redraw mid-countdown keeps the number
  } else if (f.state === "closed" && f.secured && f.eng) {
    body = '<div class="ffmsg"><b>' + (!f.ext?.holder ? (f.secured === s ? "Your side secured 🚩 " : "They secured 🚩 ") + ffText(f.eng.obj || "the objective") : f.secured === s ? "You extracted with 🚩 " + ffText(f.eng.obj || "the objective") : "They extracted with 🚩 " + ffText(f.eng.obj || "the objective")) + '</b>' +
      '<span>' + (!f.ext?.holder ? "The engagement is over." : f.secured === s ? "Your squad got away with \u{1F6A9} " + ffText(f.eng.obj || "the objective") + "." : "Their squad got away with \u{1F6A9} " + ffText(f.eng.obj || "the objective") + ".") + '</span>' +
      '<div class="ffrow"><button class="btn big pri" onclick="ffShown[\'sec:' + f.id + '\']=1;ffLastSig=\'\';renderFF();renderRoster&&renderRoster()">Close</button></div></div>';
  } else if (f.state === "end") {
    const ob = f.obj && f.obj.seg === f.seg ? f.obj : null, mineHp = alive, foeHp = enemyAlive;
    const adv = typeof foeHp === "number" ? mineHp - foeHp : null;
    const bonus = adv === null ? 'Check the enemy squad\u2019s HP \u2014 the side with more HP adds +1 per HP of advantage'
      : adv > 0 ? '<b class="ok">YOU add +' + adv + '</b> to your roll \u00b7 the enemy rolls flat'
      : adv < 0 ? '<b class="bad">The ENEMY adds +' + (-adv) + '</b> to their roll \u00b7 you roll flat'
      : 'Equal HP \u2014 <b>no bonus</b> for either side';
    const name = ffText(f.eng?.obj || "the objective");
    const title = "Bout " + (f.eng?.bout || f.seg) + (f.eng ? " of " + f.eng.pairs.length : "") + " complete — who secures 🚩 " + name + "?";
    const clash = '<div class="ffmsg"><b>' + title + '</b><div class="ffoc"><b>OBJECTIVE CLASH · 2d6 + HP advantage</b>' +
      '<span class="ocHp">Your squad <b>' + mineHp + ' HP</b> · Enemy <b>' + foeHp + ' HP</b></span><span class="ocBn">' + bonus + '</span>' +
      '<small>Re-roll ties. The winner holds the objective until a squad gets away with it.</small><div class="ffrow wrap">' +
      (f.mode === "physical" ? '<button class="btn big pri" onclick="ffObjective(\'mine\')">We secured it</button><button class="btn big" onclick="ffObjective(\'theirs\')">They secured it</button>' : '<button class="btn big pri" onclick="ffObjective()">Roll the Objective Clash</button>') + '</div></div></div>';
    body = !ob ? clash : f.ext ? ffDisengageScreen(f, s) : ffBoard(f, s);
  }
  const keepScroll = box.querySelector(".ffpanel") ? box.querySelector(".ffpanel").scrollTop : 0;
  box.innerHTML = '<div class="ffpanel">' +
    '<div class="ffhead"><b>\u2694 FIREFIGHT</b><span class="ffpips">' + pips + '</span><span class="ffmode">' + (f.mode === "rolled" ? "ROLLED DICE" : f.mode === "physical" ? "PHYSICAL DICE" : "") + (f.seg > 1 ? " \u00b7 BOUT " + f.seg : "") + '</span>' +
      (f.state === "end" && f.obj && !f.ext ? '<button class="btn sm" onclick="ffBoardBack()">Back to roster</button>' : '<button class="btn sm" onclick="ffPause()">\u23F8 Pause</button>') + '</div>' +
    ((f.state === "end" || f.state === "closed") ? '' : '<div class="ffsides"><div class="ffside me"><small>YOU</small><b>' + myLabel + '</b><em>' + alive + ' / 8 \u00b7 FP ' + FIREPOWER(alive) + (q.supp ? ' \u00b7 ' + q.supp + ' dice set aside' : '') + '</em>' +
      '<span class="ffinv">' + ["fb", "sm", "gr"].map(k => FF_ITEMS[k].i + "\u00d7" + q.items[k]).join("  ") + '</span></div>' +
      '<div class="ffside foe"><small>ENEMY</small><b>' + foeLabel + '</b><em>' + enemyAlive + ' / 8</em><span class="ffinv">items hidden</span></div></div>') +
    (f.state !== "end" && f.state !== "closed" && f.eng && f.eng.pairs ? '<div class="ffengbar"><b>\u2694 ENGAGEMENT ' + f.eng.aList.length + ' vs ' + f.eng.bList.length + '</b>' +
      '<span>Bout ' + f.eng.bout + ' of ' + f.eng.pairs.length + (f.eng.obj ? ' \u00b7 \u{1F6A9} ' + f.eng.obj : '') + '</span>' +
      '<span class="pl">' + f.eng.pairs.map((pr, i) => { const la = (f.eng.aList.find(x => x.uid === pr[0]) || {}).label, lb = (f.eng.bList.find(x => x.uid === pr[1]) || {}).label;
        const meFirst = s === "a"; return '<i class="' + (i + 1 === f.eng.bout ? "now" : "") + '">' + (meFirst ? la + ' vs ' + lb : lb + ' vs ' + la) + '</i>'; }).join("") + '</span></div>' : '') +
    (!otherHere && f.state !== "end" && f.state !== "closed" ? '<div class="ffpause">\u23F8 The enemy player has stepped away \u2014 a teammate of theirs can resume the firefight.</div>' : '') +
    '<div class="ffbody">' + body + '</div></div>';
  if (keepScroll) box.querySelector(".ffpanel").scrollTop = keepScroll;
}
// invites on the defending team, and a challenger's declined notice
function renderFFInvites() {
  let bar = $("ffinv");
  const t = mpTeamMode() ? mpMyTeam() : null;
  const inv = t ? ffAll().filter(f => f.state === "invite" && f.b.team === t) : [];
  const mineNow = ffMine();
  const booked = t ? ffAll().filter(f => f.state === "queued" && f.forced && f[ffOther(f.forced)].team === t && !ffShown["bk:" + f.id]) : [];
  const countered = t ? ffAll().filter(f => f.state === "closed" && f.countered && f[f.forced] && f[f.forced].team === t && !ffShown["ct:" + f.id]) : [];
  countered.forEach(f => { ffShown["ct:" + f.id] = 1; mpToast("\u25CC The enemy countered your Forced Re-Engagement with Smoke \u2014 their " + f[f.countered].label + " gets away."); });
  const started = t ? ffAll().filter(f => {
    if (!f.fromQueue || !["mode", "ready", "pick", "reveal"].includes(f.state)) return false;
    const sd = ffSideOf(f); if (!sd) return false;
    if (mineNow && mineNow.id === f.id) return false;                          // already open here
    return !f[sd].pid || f[sd].pid === mp.pid || !ffSidePidAlive(f, sd);       // nobody else on my team is running it
  }) : [];
  const declined = t ? ffAll().filter(f => f.state === "declined" && f.a.team === t && f.a.pid === mp.pid && !ffShown["dec:" + f.id]) : [];
  declined.forEach(f => { ffShown["dec:" + f.id] = 1; mpToast("The enemy declined the firefight with your " + f.a.label + "."); });
  if (!inv.length && !started.length && !booked.length) { if (bar) bar.remove(); return; }
  if (!bar) { bar = document.createElement("div"); bar.id = "ffinv"; document.body.appendChild(bar); }
  const html = inv.map(f => '<div class="ffinvrow"><b>\u2694 ' + (mpNameOf(f.a.pid) || "The enemy") +
    (f.eng && (f.eng.aList.length > 1 || f.eng.bList.length > 1)
      ? ' challenges you \u2014 ' + f.eng.aList.length + ' vs ' + f.eng.bList.length + (f.eng.obj ? ' for \u{1F6A9} ' + f.eng.obj : '') + '<small>' + f.eng.aList.map(x => x.label).join(", ") + ' vs your ' + f.eng.bList.map(x => x.label).join(", ") + ' \u2014 you choose who meets whom.</small>'
      : '\u2019s ' + f.a.label + ' challenges your ' + f.b.label + (f.eng && f.eng.obj ? ' for \u{1F6A9} ' + f.eng.obj : '')) + '</b>' +
    '<span><button class="btn sm pri" onclick="ffAccept(\'' + f.id + '\')">Accept</button><button class="btn sm" onclick="ffDecline(\'' + f.id + '\')">Decline</button></span></div>').join("") +
    started.map(f => { const sd = ffSideOf(f), od = ffOther(sd);
      return '<div class="ffinvrow forced"><b>\u2726 Forced Re-Engagement \u2014 your ' + f[sd].label + ' vs their ' + f[od].label + ' has begun</b>' +
        '<span><button class="btn sm pri" onclick="ffResume(\'' + f.id + '\')">Open the firefight</button></span></div>'; }).join("") +
    booked.map(f => { const sd = ffOther(f.forced), r = roster.find(x => x.uid === f[sd].uid);
      const it = r && r.st && r.st.sq && r.st.sq.qr && r.st.sq.qr.items, sm = it ? (it.sm || 0) : 1;
      const l = r ? mpLockOf(t, r.uid) : null, other = l && l.pid !== mp.pid && mpLockAlive(l) ? mpNameOf(l.pid) : "";
      const dismiss = '<button class="btn sm" onclick="ffShown[\'bk:' + f.id + '\']=1;renderFFInvites()">' + (sm > 0 && !other ? 'Let it happen' : 'OK') + '</button>';
      return '<div class="ffinvrow forced"><b>\u2726 The enemy\u2019s ' + f[f.forced].label + ' forces your ' + f[sd].label + ' back into a firefight next turn' +
        (other ? '<small>' + other + ' has that squad open \u2014 they can counter it from its sheet.</small>'
          : sm > 0 ? '' : '<small>No Smoke Grenade left \u2014 it will happen.</small>') + '</b>' +
        '<span>' + (sm > 0 && !other ? '<button class="btn sm pri" onclick="ffBannerCounter(\'' + f.id + '\')">\u25CC Counter with Smoke <small>(' + sm + ' left)</small></button>' : '') +
        dismiss + '</span></div>'; }).join("");
  if (bar.innerHTML !== html) bar.innerHTML = html;
}
// the firefight card on a squad's Quick Resolve tab (online)
function ffCardHTML() {
  if (!mpTeamMode() || !CUR || !isSquad(U)) return "";
  const f = ffForUid(CUR.uid, mpMyTeam());
  const q0 = CUR.st.sq && CUR.st.sq.qr;
  const myTurn = !mp.data.turn || mp.data.turn.active === mpMyTeam();
  if (!f) return '<div class="ffcta">' + (myTurn
      ? '<button class="btn big pri" onclick="ffChallenge()">\u2694 CHALLENGE AN ENEMY SQUAD</button>' +
        '<span>Online firefight: blind item picks on each device, reveal together, optional rolled dice.</span>'
      : '<span class="ffhint">\u2694 Firefights can only be started on your own turn.</span>') +
    (q0 && q0.items && q0.items.fb > 0 && ffFoughtWith(CUR.uid).length
      ? '<button class="btn big ffforce" onclick="ffForce()">\u2726 FORCE A RE-ENGAGEMENT <small>1 Flashbang \u00b7 ' + q0.items.fb + ' left</small></button>' +
        '<span>Play it when an enemy squad you just fought tries to move away \u2014 the firefight starts when the next turn begins.</span>' : '') + '</div>';
  if (f.state === "queued") {
    const s0 = ffSideOf(f), o0 = ffOther(s0), mineForced = f.forced === s0, sm = (q0 && q0.items && q0.items.sm) || 0;
    return '<div class="ffcta live queued"><b>\u2726 Forced Re-Engagement \u2014 ' + (mineForced ? 'your ' + f[s0].label + ' vs their ' + f[o0].label : 'their ' + f[o0].label + ' re-engages your ' + f[s0].label) + '</b>' +
      '<span>Starts by itself when the next turn begins \u2014 keep playing your other units until then.' +
      (mineForced ? ' The enemy can still cancel it with a Smoke Grenade.' : '') + '</span>' +
      (mineForced ? '' : sm > 0
        ? '<button class="btn big ffcounter" onclick="ffCounter()">\u25CC COUNTER WITH SMOKE <small>1 Smoke Grenade \u00b7 ' + sm + ' left \u2014 your squad gets away</small></button>'
        : '<span class="ffhint">No Smoke Grenade left \u2014 the re-engagement will happen.</span>') + '</div>';
  }
  const s = ffSideOf(f), o = ffOther(s), mineNow = f[s].pid === mp.pid, someone = ffSidePidAlive(f, s);
  return '<div class="ffcta live"><b>\u2694 ' + (f.eng ? 'In a ' + f.eng.aList.length + ' vs ' + f.eng.bList.length + ' engagement' + (f.eng.obj ? ' for \u{1F6A9} ' + f.eng.obj : '') + ' \u2014 ' : 'In a firefight with the enemy ') + (f.eng ? 'now: your ' + f[s].label + ' vs their ' + f[o].label : f[o].label) + '</b><span>' +
    (f.state === "invite" ? (s === "a" ? "Waiting for them to accept." : "Accept it from the banner at the top.") : f.state === "end" ? "Bout " + f.seg + " complete" : f.state === "mode" ? "Choosing dice" : "Round " + Math.min(4, f.round) + " of 4 \u00b7 bout " + f.seg) +
    (someone && !mineNow ? " \u00b7 " + mpNameOf(f[s].pid) + " is running it" : "") + '</span>' +
    (f.state !== "invite" || s === "a" ? '<button class="btn big pri" onclick="ffResume(\'' + f.id + '\')">' + (mineNow ? "Open the firefight" : someone ? "Take over" : "Resume") + '</button>' : '') + '</div>';
}

SHIP_UNITS.forEach(s => UNITS.push(s));
GROUND_UNITS.forEach(g => UNITS.push(g));
const unitById = id => UNITS.find(u => u.id === id);

function show(id) {
  if (id === "s0") { stashTeam(); refreshSideCards(); renderLanding(); }
  if (id === "s1") { stashTeam(); refreshSideCards(); if (!menuSide) menuSide = side || null; renderMenu(); }
  if (id === "s2") renderPresets();
  if (id === "s5") { renderLobby(); setTimeout(() => { if (typeof lbInit === "function") { lbInit(); lbLayout(); lbSpawn(); } }, 0); }
  else applyTheme();                           // leaving the lobby: back to this device's side colours
  if (id !== "s3") document.body.classList.remove("locked");
  else document.body.classList.toggle("locked", locked);
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("on"));
  const scr = $(id);
  scr.classList.add("on");
  if (id === "s5") mpLobbyTheme();              // now that the lobby is showing, colour it by the picked team
  document.body.classList.toggle("sheetmode", id === "s4");
  window.scrollTo(0, 0);
  // short enter animation (CSS does the work; skipped for reduced motion)
  scr.classList.remove("enter"); void scr.offsetWidth; scr.classList.add("enter");
  clearTimeout(scr._enterT); scr._enterT = setTimeout(() => scr.classList.remove("enter"), 1000);
}

function save() {
  try {
    stashTeam();                       // fold the live team back into teams[side]
    localStorage.setItem(SAVE, JSON.stringify({ side: side, teams: teams }));
  } catch (e) {}
  try { mpDirty(); } catch (e) {}
}
function load() {
  try {
    const d = JSON.parse(localStorage.getItem(SAVE) || "null");
    if (d && d.side) {
      side = d.side;
      teams = d.teams || { federation: null, spacenoid: null };
      loadTeam(side);
      return true;
    }
  } catch (e) {}
  return false;
}

/* ---------- 1. main menu ---------- */
let menuSide = null;
// place the menu just below the title painted into the background art
function layoutMenu() {
  const W = innerWidth, H = innerHeight, IW = 1672, IH = 941, TITLE_B = 350;
  let y;
  if (W / H <= 0.8) y = TITLE_B * (W * 2.4 / IW);                    // portrait: 240vw wide, top aligned
  else { const sc = Math.max(W / IW, H / IH); y = TITLE_B * sc + (H - IH * sc) * 0.30; }   // cover, 30% down
  document.documentElement.style.setProperty("--menuTitleB", Math.max(40, Math.round(y)) + "px");
}
addEventListener("resize", layoutMenu);
addEventListener("orientationchange", () => setTimeout(layoutMenu, 150));
function renderMenu() {
  layoutMenu();
  if (typeof m3Init === "function") { m3Init(); m3Start(); }
  if (typeof Effects !== "undefined") Effects.menuShown();
  $("fcFed").classList.toggle("sel", menuSide === "federation");
  $("fcSpa").classList.toggle("sel", menuSide === "spacenoid");
  document.querySelector(".m-cards").classList.toggle("picked", !!menuSide);
  const en = $("mEnter");
  en.classList.toggle("ready", !!menuSide);
  en.style.setProperty("--enterc", menuSide === "spacenoid" ? "#ff2e3f" : "#38bdf8");
  en.style.setProperty("--enterbg", menuSide === "spacenoid" ? "#3d1117" : "#0f2c3d");
  $("mEnterTxt").textContent = menuSide ? "ENTER THE BATTLEFIELD" : "SELECT A FACTION";
  // continue: the last side played, if it has a team
  const t = side && teams[side];
  const has = !!(t && ((t.roster && t.roster.length) || t.budget));
  $("mbCont").classList.toggle("off", !has);
  $("mbContSub").textContent = has
    ? (side === "federation" ? "FEDERATION" : "SPACENOIDS") + " \u00b7 " + ((t.roster || []).length) + " MODEL" + (((t.roster || []).length === 1) ? "" : "S")
      + (t.locked ? " \u00b7 TURN " + ((t.turn && t.turn.round) || 1) : "")
    : "NO SAVED BATTLE";
}
// ---- landing page ----
function renderLanding() {
  layoutMenu();
  if (typeof m3Init === "function") { m3Init(); m3Start(); }
  if (typeof Effects !== "undefined") Effects.menuShown();
  const ems = $("moEmbs");
  if (ems && !ems.childElementCount)
    ems.innerHTML = ["#fcFed .fc-emb", "#fcSpa .fc-emb"].map(q => { const e = document.querySelector(q); return e ? e.outerHTML : ""; }).join("");
  updateLandingOnline();
  const t = side && teams[side];
  const has = !!(t && ((t.roster && t.roster.length) || t.budget));
  const txt = has ? (side === "federation" ? "FEDERATION" : "SPACENOIDS") + " \u00b7 " + ((t.roster || []).length) + " MODEL" + (((t.roster || []).length === 1) ? "" : "S")
      + (t.locked ? " \u00b7 TURN " + ((t.turn && t.turn.round) || 1) : "") : "NO SAVED BATTLE";
  $("lbCont").classList.toggle("off", !has);
  $("lbContSub").textContent = txt;
  $("moOffSub").textContent = has ? "SAVED: " + txt : "PICK A FACTION AND BUILD YOUR FORCE";
}
function updateLandingOnline() {
  const sub = $("moOnSub"); if (!sub) return;
  sub.textContent = mp.code ? "SESSION " + mp.code + (mp.status === "live" ? " \u00b7 LIVE" : "") + " \u2014 TAP TO RETURN" : "CREATE OR JOIN A SESSION";
  $("moOn").classList.toggle("live", !!mp.code);
}
// ================= LANDING: layered art + PLAY ONLINE clash (cf48) =================
// synthesized sound (no files): a thruster whoosh and a heavy clash. Mute is remembered on this device.
const SFX = (() => {
  let ctx = null;
  const muted = () => { try { return localStorage.getItem("gb.mute") === "1"; } catch (e) { return false; } };
  const ac = () => {
    if (muted()) return null;
    try { ctx = ctx || new (window.AudioContext || window.webkitAudioContext)(); if (ctx.state === "suspended") ctx.resume(); } catch (e) { ctx = null; }
    return ctx;
  };
  const noise = (c, secs) => {
    const b = c.createBuffer(1, Math.floor(c.sampleRate * secs), c.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const s = c.createBufferSource(); s.buffer = b; return s;
  };
  return {
    muted,
    setMuted(v) { try { localStorage.setItem("gb.mute", v ? "1" : "0"); } catch (e) {} },
    whoosh(pan, delay) {
      const c = ac(); if (!c) return;
      const t = c.currentTime + (delay || 0), n = noise(c, 0.9), f = c.createBiquadFilter(), g = c.createGain();
      const p = c.createStereoPanner ? c.createStereoPanner() : null;
      f.type = "bandpass"; f.Q.value = 1.4;
      f.frequency.setValueAtTime(260, t); f.frequency.exponentialRampToValueAtTime(2400, t + 0.7);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.5, t + 0.45); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.85);
      n.connect(f); f.connect(g);
      if (p) { p.pan.setValueAtTime(pan, t); p.pan.linearRampToValueAtTime(0, t + 0.75); g.connect(p); p.connect(c.destination); } else g.connect(c.destination);
      n.start(t); n.stop(t + 0.9);
    },
    clash(delay) {
      const c = ac(); if (!c) return;
      const t = c.currentTime + (delay || 0), out = c.createGain();
      out.gain.value = 0.9; out.connect(c.destination);
      // low boom
      const o = c.createOscillator(), og = c.createGain();
      o.type = "sine"; o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(32, t + 0.9);
      og.gain.setValueAtTime(1, t); og.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
      o.connect(og); og.connect(out); o.start(t); o.stop(t + 1.2);
      // crack of noise
      const n = noise(c, 1.2), nf = c.createBiquadFilter(), ng = c.createGain();
      nf.type = "lowpass"; nf.frequency.setValueAtTime(6000, t); nf.frequency.exponentialRampToValueAtTime(300, t + 1);
      ng.gain.setValueAtTime(0.9, t); ng.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
      n.connect(nf); nf.connect(ng); ng.connect(out); n.start(t); n.stop(t + 1.2);
      // metallic ring (beam sabers locking)
      [820, 1237, 1690, 2410].forEach((fr, k) => {
        const r = c.createOscillator(), rg = c.createGain();
        r.type = k % 2 ? "square" : "triangle"; r.frequency.setValueAtTime(fr, t); r.frequency.linearRampToValueAtTime(fr * 0.985, t + 1.4);
        rg.gain.setValueAtTime(0.0001, t); rg.gain.exponentialRampToValueAtTime(0.09 / (k + 1), t + 0.02); rg.gain.exponentialRampToValueAtTime(0.0001, t + 1.5);
        r.connect(rg); rg.connect(out); r.start(t); r.stop(t + 1.6);
      });
      // electric crackle
      for (let k = 0; k < 7; k++) {
        const cn = noise(c, 0.05), cf = c.createBiquadFilter(), cg = c.createGain(), ts = t + 0.08 + Math.random() * 0.6;
        cf.type = "highpass"; cf.frequency.value = 2500; cg.gain.setValueAtTime(0.25, ts); cg.gain.exponentialRampToValueAtTime(0.0001, ts + 0.05);
        cn.connect(cf); cf.connect(cg); cg.connect(out); cn.start(ts); cn.stop(ts + 0.06);
      }
    },
  };
})();
window.toggleMute = () => { SFX.setMuted(!SFX.muted()); renderMuteBtn(); if (!SFX.muted()) SFX.whoosh(0, 0); };
function renderMuteBtn() { const b = $("muteBtn"); if (b) { b.textContent = SFX.muted() ? "\u{1F507}" : "\u{1F50A}"; b.title = SFX.muted() ? "Sound off \u2014 tap to turn on" : "Sound on \u2014 tap to mute"; } }
// preload the animation layers while the landing page is showing
["menu2-gundam", "menu2-zaku", "menu2-clash"].forEach(n => { const i = new Image(); i.decoding = "async"; i.src = "img/" + n + ".webp"; });

let clashBusy = false;
function playClash(after) {
  if (clashBusy) return;
  const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  let seen = false; try { seen = localStorage.getItem("gb.clashSeen") === "1"; } catch (e) {}
  if (reduce) { hangarGo(after); return; }
  clashBusy = true;
  const s0 = $("s0");
  const fx = document.createElement("div");
  fx.id = "clashFx";
  const lr = $("mLogo") ? $("mLogo").getBoundingClientRect() : null;
  fx.innerHTML = (lr ? '<img class="cx-logo" src="img/menu2-logo.webp" alt="" style="left:' + lr.left + 'px;top:' + lr.top + 'px;width:' + lr.width + 'px;height:' + lr.height + 'px">' : '') + '<div class="cx-shake"><div class="cx-scene"><div class="cx-bg"></div><div class="cx-l"></div><div class="cx-r"></div><div class="cx-glow"></div><div class="cx-ring"></div><div class="cx-clash"></div></div></div><div class="cx-end"></div>' +
    '<div class="cx-flash"></div>' + (seen ? '<button class="cx-skip">SKIP \u25B8</button>' : '');
  const live = $("m3"), sc = fx.querySelector(".cx-scene");
  if (live) { fx.classList.add("onm3"); s0.classList.add("m3clash"); }
  document.body.appendChild(fx);
  s0.classList.add("clashing");
  const timers = [];
  let done = false;
  const finish = () => {
    if (done) return; done = true;
    timers.forEach(clearTimeout);
    try { localStorage.setItem("gb.clashSeen", "1"); } catch (e) {}
    fx.classList.add("white", "logo", "out");
    after();
    s0.classList.remove("clashing");
    setTimeout(() => { fx.remove(); clashBusy = false; s0.classList.remove("m3clash", "m3hit", "m3zoom"); }, 750);
  };
  if (seen) fx.addEventListener("click", finish);
  requestAnimationFrame(() => fx.classList.add("go"));
  timers.push(setTimeout(() => { fx.classList.add("hit"); s0.classList.add("m3hit"); }, 760));
  timers.push(setTimeout(() => { fx.classList.add("zoom"); s0.classList.add("m3zoom"); }, 900));
  timers.push(setTimeout(() => fx.classList.add("white"), 1300));
  timers.push(setTimeout(() => fx.classList.add("logo"), 1750));
  timers.push(setTimeout(finish, 3100));
}

// ================= LANDING SCENE: layered parallax (cf54) =================
// Layers back → front, each with a depth (how far it moves, in % of the screen).
const M3_DEPTH = { base: 0.7, stars: 0.9, emb: 1.3, far: 2.0, fx: 2.6, near: 3.4, rocks: 4.2, fg: 6.4, embers: 7.2 };
const M3 = { x: 0, y: 0, tx: 0, ty: 0, raf: 0, drag: null, gyro: null, gyroBase: null, asked: false, boomT: 0 };
function m3Root() {                                     // the scene on the menu screen that is showing (landing or offline menu)
  if (document.hidden) return null;
  for (const id of ["s0", "s1"]) { const sc = $(id); if (sc && sc.classList.contains("on")) return sc.querySelector(".m-bg.m3"); }
  return null;
}
function m3On() { return !!m3Root(); }
function m3Reduced() { return !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches); }
// the scene is drawn at most 1920×1080 and scaled up on bigger screens (the art is 1672px wide, so no detail is lost)
function m3Size(root) {
  const W = innerWidth, H = innerHeight, k = Math.max(1, W / 1920, H / 1080);
  const cw = W / k, ch = H / k;
  root.classList.toggle("capped", k > 1);
  root.style.width = k > 1 ? cw + "px" : ""; root.style.height = k > 1 ? ch + "px" : "";
  root.style.scale = k > 1 ? String(k) : "";
  root.style.setProperty("--m3u", (Math.max(cw, ch) / 100) + "px");
  root.style.setProperty("--m3w", cw + "px"); root.style.setProperty("--m3h", ch + "px");
  root._cw = cw; root._ch = ch;
}
function m3SizeAll() { document.querySelectorAll(".m-bg.m3").forEach(m3Size); }
addEventListener("resize", m3SizeAll);
function m3Apply(root, x, y) {
  if (!root._cw) m3Size(root);
  const key = x.toFixed(4) + "," + y.toFixed(4);
  if (root._last === key) return;                     // nothing moved: no style work this frame
  root._last = key;
  root.querySelectorAll("[data-d]").forEach(el => {
    const d = M3_DEPTH[el.dataset.d] || 0;
    el.style.translate = (x * d * root._cw / 100).toFixed(2) + "px " + (y * d * 0.6 * root._ch / 100).toFixed(2) + "px";
  });
}
function m3Kick() { if (!M3.raf && !m3Reduced()) M3.raf = requestAnimationFrame(m3Loop); }
function m3Loop() {
  M3.raf = 0;
  if (!m3On() || $("s0").classList.contains("m3clash")) return;     // no parallax work while the clash plays
  let tx = M3.tx, ty = M3.ty;
  if (!M3.drag && M3.gyro) { tx = M3.gyro.x; ty = M3.gyro.y; }
  M3.x += (tx - M3.x) * 0.08; M3.y += (ty - M3.y) * 0.08;
  const settled = Math.abs(tx - M3.x) < 0.0015 && Math.abs(ty - M3.y) < 0.0015;
  if (settled) { M3.x = tx; M3.y = ty; }
  const root = m3Root(); if (root) m3Apply(root, M3.x, M3.y);
  M3.raf = settled ? 0 : requestAnimationFrame(m3Loop);        // sleep until the pointer / finger / tilt moves again
}
function m3Start() {
  if (m3Reduced()) return;
  m3SizeAll();
  const r0 = m3Root(); if (r0) r0._last = "";
  m3Kick();
  clearTimeout(M3.boomT);
  // ships on each side (canvas %), where hits land and beams start
  const FED = [[19, 11], [31, 26], [18, 27], [16, 46]], ZEON = [[80, 25], [72, 44], [80, 8], [68, 24], [64, 6]];
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const jit = ([x, y], r) => [x + (Math.random() - 0.5) * r, y + (Math.random() - 0.5) * r * 0.7];
  const sprite = (fx, name, x, y, size, cls, life) => {
    const im = document.createElement("img");
    im.className = "m3-sx " + (cls || ""); im.src = "img/fx/" + name + ".webp"; im.alt = ""; im.decoding = "async";
    im.style.left = x + "%"; im.style.top = y + "%"; im.style.width = "calc(var(--m3u) * " + size.toFixed(2) + ")";
    im.style.height = "calc(var(--m3u) * " + (size * (0.45 + Math.random() * 0.25)).toFixed(2) + ")";   // stretched a little, differently each time
    im.style.setProperty("--rot", (Math.random() * 40 - 20).toFixed(0) + "deg");
    fx.appendChild(im); setTimeout(() => im.remove(), life || 1300);
  };
  const rnd = (a, b) => a + Math.random() * (b - a);
  const blastSize = () => { const r = Math.random(); return r < 0.5 ? rnd(3, 6) : r < 0.85 ? rnd(6, 10) : rnd(10, 15); };
  const blast = (fx, onFed, at, size, delay) => setTimeout(() => {
    if (!fx.isConnected) return;
    // space explosions: starbursts and rings only (yellow on Federation ships, pink on Zeon ships)
    // every hit is a starburst; a shockwave ring is only ever added around one (always on big hits, sometimes on medium)
    sprite(fx, onFed ? "star-y" : "star-p", at[0], at[1], size, size > 10 ? "big" : "", size > 10 ? 1700 : 1300);
    if (size > 10 || (size > 6 && Math.random() < 0.35)) sprite(fx, onFed ? "ring-o" : "ring-p", at[0], at[1], size * 1.5, "ring", 1500);
  }, delay || 0);
  const beam = (fx, fromFed, mega) => {
    const a = jit(pick(fromFed ? FED : ZEON), 4), b = jit(pick(fromFed ? ZEON : FED), 5);
    const W = fx.clientWidth || innerWidth, H = fx.clientHeight || innerHeight;
    const dx = (b[0] - a[0]) / 100 * W, dy = (b[1] - a[1]) / 100 * H;
    const ang = Math.atan2(dy, dx) * 180 / Math.PI, len = Math.hypot(dx, dy);
    const bm = document.createElement("img");
    bm.src = "img/fx/" + (fromFed ? "beam-p" : "beam-y") + ".webp"; bm.alt = "";
    bm.style.left = a[0] + "%"; bm.style.top = a[1] + "%";
    bm.style.setProperty("--ang", ang.toFixed(1) + "deg"); bm.style.setProperty("--len", len.toFixed(0) + "px");
    if (mega) {
      // a long beam stretched from the ship all the way to its target
      bm.className = "m3-mega";
      bm.style.width = len.toFixed(0) + "px"; bm.style.height = "calc(var(--m3u) * " + rnd(1.4, 2.6).toFixed(2) + ")";
      fx.appendChild(bm); setTimeout(() => bm.remove(), 1000);
      blast(fx, !fromFed, b, rnd(10, 14), 160);
      sprite(fx, fromFed ? "spark-p" : "star-y", a[0], a[1], rnd(3, 5), "muzzle", 700);
    } else {
      // a bolt: random length and thickness, flies across
      bm.className = "m3-beam";
      bm.style.width = "calc(var(--m3u) * " + rnd(8, 20).toFixed(1) + ")"; bm.style.height = "calc(var(--m3u) * " + rnd(1, 2.4).toFixed(2) + ")";
      fx.appendChild(bm); setTimeout(() => bm.remove(), 700);
      setTimeout(() => { if (fx.isConnected) blast(fx, !fromFed, b, blastSize(), 0); }, 430);
    }
  };
  const boom = () => {
    const root = m3Root();
    if (!root || document.documentElement.classList.contains("fx-lite")) { if (root) M3.boomT = setTimeout(boom, 3000); return; }
    const fx = root.querySelector(".m3-fx");
    if (fx && fx.childElementCount < 12) {
      const r = Math.random(), fromFed = Math.random() < 0.5;          // Federation fires pink, Zeon fires yellow
      if (r < 0.22) beam(fx, fromFed, true);                           // long beam
      else if (r < 0.72) {                                              // one to three bolts, sometimes answered
        const n = Math.random() < 0.35 ? 3 : 1;
        for (let k = 0; k < n; k++) setTimeout(() => fx.isConnected && beam(fx, fromFed, false), k * 140);
        if (Math.random() < 0.3) setTimeout(() => fx.isConnected && beam(fx, !fromFed, Math.random() < 0.25), 380 + Math.random() * 300);
      } else if (r < 0.82) {                                            // a chain of small blasts across one ship
        const onFed = Math.random() < 0.5, c = pick(onFed ? FED : ZEON), n = 2 + Math.floor(Math.random() * 3);
        for (let k = 0; k < n; k++) blast(fx, onFed, [c[0] + (k - n / 2) * rnd(1.5, 3) * (onFed ? 1 : -1), c[1] + rnd(-2, 2)], rnd(3, 6), k * rnd(120, 220));
      } else {                                                          // a single hit, small to big
        const onFed = Math.random() < 0.5;
        blast(fx, onFed, jit(pick(onFed ? FED : ZEON), 6), blastSize(), 0);
      }
    }
    M3.boomT = setTimeout(boom, 700 + Math.random() * 1200);
  };
  M3.boomT = setTimeout(boom, 1200);
}
const m3Clamp = v => Math.max(-1, Math.min(1, v));
function m3Init() {
  const s0 = $("s0"); if (!s0 || s0.dataset.m3) return;
  s0.dataset.m3 = "1";
  const screens = ["s0", "s1"].map(id => $(id)).filter(Boolean);
  // embers rising from the ruins
  screens.forEach(sc => { const em = sc.querySelector(".m3-embers");
  if (em && !em.childElementCount) for (let k = 0; k < 18; k++) {
    const e = document.createElement("i");
    e.style.left = (Math.random() * 100).toFixed(1) + "%";
    e.style.setProperty("--dur", (7 + Math.random() * 7).toFixed(1) + "s");
    e.style.setProperty("--del", (-Math.random() * 14).toFixed(1) + "s");
    e.style.setProperty("--dxf", ((Math.random() - 0.5) * 0.12).toFixed(3));
    e.style.setProperty("--sz", (2 + Math.random() * 3).toFixed(1) + "px");
    e.className = Math.random() < 0.5 ? "b" : "r";
    em.appendChild(e);
  } });
  // mouse: the scene leans away from the pointer; touch: drag to look around, springs back on release
  screens.forEach(s0 => {
  s0.addEventListener("pointermove", ev => {
    if (ev.pointerType === "mouse") {
      M3.tx = -m3Clamp((ev.clientX / innerWidth) * 2 - 1);
      M3.ty = -m3Clamp((ev.clientY / innerHeight) * 2 - 1);
      m3Kick();
    } else if (M3.drag) {
      M3.tx = m3Clamp((ev.clientX - M3.drag.x) / (innerWidth * 0.45));
      M3.ty = m3Clamp((ev.clientY - M3.drag.y) / (innerHeight * 0.45));
      m3Kick();
    }
  }, { passive: true });
  s0.addEventListener("pointerdown", ev => {
    if (ev.pointerType !== "mouse") M3.drag = { x: ev.clientX, y: ev.clientY };
    // phone tilt: iOS asks once, on a tap
    if (!M3.asked && window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === "function") {
      M3.asked = true;
      DeviceOrientationEvent.requestPermission().catch(() => {});
    }
  }, { passive: true });
  const release = () => { M3.drag = null; M3.tx = 0; M3.ty = 0; m3Kick(); };
  ["pointerup", "pointercancel"].forEach(t => s0.addEventListener(t, ev => { if (ev.pointerType !== "mouse") release(); }, { passive: true }));
  s0.addEventListener("pointerleave", ev => { if (ev.pointerType === "mouse") { M3.tx = 0; M3.ty = 0; m3Kick(); } }, { passive: true });
  });
  window.addEventListener("deviceorientation", ev => {
    if (ev.gamma == null || ev.beta == null) return;
    if (!M3.gyroBase) M3.gyroBase = { b: ev.beta };
    M3.gyro = { x: m3Clamp(-ev.gamma / 25), y: m3Clamp(-(ev.beta - M3.gyroBase.b) / 25) };
    m3Kick();
  });
  document.addEventListener("visibilitychange", () => { if (!document.hidden) m3Start(); });
}

// ================= HANGAR (LOBBY) EFFECTS (cf66) =================
// An effects layer sized exactly like the hangar picture (cover, 50% / 30%), so every effect is placed in picture %.
const LB_IMG = { w: 1536, h: 1024, px: 0.5, py: 0.3 };
const LB_STRIPS = [   // [x %, top %, bottom %, colour]  the light strips on the central pillar and the upper-left gantry
  [46.6, 12, 77, "b"], [53.6, 10, 77, "r"], [20.6, 5, 42, "b"], [16.4, 17, 25, "b"],
];
const LB_SPARKS = [[33.5, 84, "b"], [22, 44, "b"], [40.5, 55, "b"], [63.5, 83, "r"], [80.5, 45, "r"], [58, 55, "r"]];
const LB_WINDOWS = { fed: [33, 5, 45, 34], zeon: [55, 5, 67, 38] };   // [x0, y0, x1, y1] %
let lbT = { spark: 0, win: 0 };
function lbOn() { const s5 = $("s5"); return !!(s5 && s5.classList.contains("on") && !document.hidden); }
function lbReduced() { return !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches); }
// where the background picture actually sits (it is anchored differently on narrow screens)
function bgAnchor(el, pseudo, fx, fy) {
  try {
    const pos = getComputedStyle(el, pseudo).backgroundPosition.split(",").pop().trim().split(/\s+/);
    const pc = v => /%$/.test(v) ? parseFloat(v) / 100 : v === "center" ? 0.5 : v === "top" || v === "left" ? 0 : v === "bottom" || v === "right" ? 1 : null;
    const x = pc(pos[0]), y = pc(pos[1] !== undefined ? pos[1] : "center");
    return [x === null ? fx : x, y === null ? fy : y];
  } catch (e) { return [fx, fy]; }
}
function lbLayout() {
  const box = $("lbfx"); if (!box) return;
  [LB_IMG.px, LB_IMG.py] = bgAnchor($("s5"), "::after", 0.5, 0.3);
  const W = document.documentElement.clientWidth || innerWidth, H = document.documentElement.clientHeight || innerHeight, s = Math.max(W / LB_IMG.w, H / LB_IMG.h);   // the visible area (no scrollbar), like the fixed background
  const iw = LB_IMG.w * s, ih = LB_IMG.h * s, k = Math.max(1, s);      // drawn at the picture's own size at most, then scaled
  box.style.left = ((W - iw) * LB_IMG.px) + "px"; box.style.top = ((H - ih) * LB_IMG.py) + "px";
  box.style.width = (iw / k) + "px"; box.style.height = (ih / k) + "px";
  box.style.scale = k > 1 ? String(k) : ""; box.classList.toggle("capped", k > 1);
}
function lbInit() {
  const s5 = $("s5"); if (!s5 || $("lbfx") || lbReduced()) return;
  const box = document.createElement("div"); box.id = "lbfx"; box.setAttribute("aria-hidden", "true");
  // eyes only: the Gundam's twin eyes and the Zaku's mono-eye (drawn into the blacked-out slot of the picture)
  box.innerHTML = '<i class="lb-eye g l"></i><i class="lb-eye g r"></i><i class="lb-eye z"></i>';
  s5.appendChild(box);
  lbLayout();
  addEventListener("resize", lbLayout);
  addEventListener("orientationchange", () => setTimeout(lbLayout, 150));
}
function lbSpawn() { lbLayout(); }
// your side powers up when you pick it
function lbPower(t) {
  const box = $("lbfx"); if (!box) return;
  const cls = t === "federation" ? "pw-fed" : "pw-spa";
  box.classList.remove("pw-fed", "pw-spa"); void box.offsetWidth; box.classList.add(cls);
  clearTimeout(box._pw); box._pw = setTimeout(() => box.classList.remove(cls), 2200);
}
// everyone ready: beacons + launch sequence tag
function lbAlarm(on) {}
// hangar doors: sparks along the seam and steam as they seal

document.addEventListener("visibilitychange", () => { if (!document.hidden) lbSpawn(); });




// ---------- performance: big-screen tweaks + automatic lite effects (cf68) ----------
function perfBigScreen() {
  const px = innerWidth * innerHeight * Math.pow(window.devicePixelRatio || 1, 2);
  document.documentElement.classList.toggle("bigscreen", px > 2600000);
}
perfBigScreen(); addEventListener("resize", perfBigScreen);

// ================= EFFECTS QUALITY (cf75) =================
// One saved setting and one class on <html>:
//   gb.effects = "auto" (default) | "full" | "lite"
//   <html class="fx-lite">  turns the ambient background animation off (parallax and eye glows stay)
// Auto starts with full effects and switches to lite for this visit if a menu runs slowly for a few seconds.
// The speed check only runs while a menu is on screen, and stops once it has an answer.
const Effects = {
  KEY: "gb.effects",
  lite: false,
  checked: false,                       // auto: has this visit's speed check finished?
  busy: false,
  mode() {
    try { return localStorage.getItem(this.KEY) || "auto"; } catch (e) { return "auto"; }
  },
  apply(lite) {
    this.lite = lite;
    document.documentElement.classList.toggle("fx-lite", lite);
    this.paint();
  },
  paint() {
    const auto = this.mode() === "auto";
    document.querySelectorAll(".fxtog").forEach(b => {
      b.classList.toggle("lite", this.lite);
      b.setAttribute("aria-pressed", this.lite ? "true" : "false");
      b.querySelector(".fxstate").textContent = this.lite ? "LITE" : "FULL";
      b.querySelector(".fxsub").textContent = this.lite ? (auto ? "AUTO \u00b7 TAP FOR FULL" : "TAP FOR FULL") : "TAP FOR LITE";
    });
  },
  toggle() {
    const next = this.lite ? "full" : "lite";
    try { localStorage.setItem(this.KEY, next); } catch (e) {}
    this.apply(next === "lite");
    if (!this.lite && typeof m3Start === "function") m3Start();
    if (typeof mpToast === "function") mpToast(this.lite ? "Lite effects: background animations off." : "Full background effects on.");
  },
  // called whenever a menu appears
  menuShown() {
    this.paint();
    if (this.mode() === "auto" && !this.lite && !this.checked) this.measure();
  },
  // time a few seconds of frames on the menu; slower than ~35 fps twice in a row -> lite for this visit
  measure() {
    if (this.busy) return;
    this.busy = true;
    const onMenu = () => ["s0", "s1"].some(id => { const e = $(id); return e && e.classList.contains("on"); }) && !document.hidden && !$("clashFx");
    let last = 0, sum = 0, n = 0, slow = 0, windows = 0;
    const frame = now => {
      if (!onMenu() || this.mode() !== "auto") { this.busy = false; return; }   // left the menu: stop, try again next time
      if (last && now - last < 1000) { sum += now - last; n++; }
      last = now;
      if (sum > 3000) {
        const avg = sum / n; windows++;
        slow = avg > 28 ? slow + 1 : 0;
        sum = 0; n = 0;
        if (slow >= 2) {
          this.apply(true);
          if (typeof mpToast === "function") mpToast("Background effects reduced to keep things smooth.");
        }
        if (slow >= 2 || windows >= 3) { this.checked = true; this.busy = false; return; }   // answer found: stop measuring
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  },
  init() {
    try { ["gb.fx", "gb.noautolite"].forEach(k => localStorage.removeItem(k)); sessionStorage.removeItem("gb.autolite"); } catch (e) {}   // settings from older builds
    this.apply(this.mode() === "lite");
  },
};
Effects.init();

window.landOnline = () => { if (mp.code) hangarGo(() => openMP()); else playClash(() => openMP()); };
window.landOffline = () => hangarGo(() => show("s1"));
window.menuPick = s => { menuSide = menuSide === s ? null : s; renderMenu(); };
// ---- hangar-door transition for major screen changes ----
let hangarBusy = false;
window.hangarGo = (fn, sideHint) => {
  const H = $("hangar");
  const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!H || hangarBusy || reduce) { fn(); return; }
  hangarBusy = true;
  const sd = sideHint || side || "federation";
  // the team emblem, split across the two doors
  const src = document.querySelector(sd === "spacenoid" ? "#fcSpa .fc-emb" : "#fcFed .fc-emb");
  H.querySelectorAll(".hd-emb").forEach(e => { e.innerHTML = src ? src.outerHTML : ""; });
  H.className = "run " + (sd === "spacenoid" ? "spa" : "fed");
  void H.offsetWidth;
  H.classList.add("shut");
  setTimeout(() => {
    try { fn(); } catch (e) { console.error(e); }
    setTimeout(() => {
      H.classList.remove("shut");
      setTimeout(() => { H.className = ""; hangarBusy = false; }, 500);
    }, 280);
  }, 480);
};
window.menuEnter = () => {
  if (!menuSide) {                                   // nudge: show which cards to tap
    document.querySelectorAll(".fcard").forEach(c => { c.animate([{ transform: "translateX(0)" }, { transform: "translateX(-4px)" }, { transform: "translateX(4px)" }, { transform: "translateX(0)" }], { duration: 260 }); });
    return;
  }
  const s0 = menuSide;
  hangarGo(() => pickSide(s0, true), s0);
};
window.menuContinue = () => {
  const t = side && teams[side];
  if (!(t && ((t.roster && t.roster.length) || t.budget))) return;
  const s0 = side;
  hangarGo(() => pickSide(s0), s0);
};
window.menuInstall = () => showNotice("Install Gunpla Battle",
  "iPhone / iPad: open this page in Safari, tap the Share button, then 'Add to Home Screen'.\n\n" +
  "Android: open it in Chrome, then tap 'Install app' (or the ⋮ menu \u2192 'Add to Home screen').\n\n" +
  "Once installed it opens full screen and works offline.");

/* ---------- 1b. faction ---------- */
function applyTheme() {
  document.body.classList.remove("lbneutral");
  document.body.classList.toggle("fed", side === "federation");
  document.body.classList.toggle("spa", side === "spacenoid");
}
// the multiplayer lobby takes the colours of the team you picked there (neutral until you pick one)
function mpLobbyTheme() {
  if (!$("s5") || !$("s5").classList.contains("on")) return;
  const t = mp.code ? mpMyTeam() : null;
  document.body.classList.toggle("fed", t === "federation");
  document.body.classList.toggle("spa", t === "spacenoid");
  document.body.classList.toggle("lbneutral", !t);
}
function refreshSideCards() {
  [["federation", "fedInfo"], ["spacenoid", "spaInfo"]].forEach(([f, id]) => {
    const el2 = $(id); if (!el2) return;
    const t = teams[f];
    el2.textContent = (t && t.roster && t.roster.length)
      ? ("SAVED: " + t.roster.length + " MODEL" + (t.roster.length === 1 ? "" : "S") + " \u00b7 " + (t.budget || 0).toLocaleString() + " DP" + (t.locked ? " \u00b7 IN BATTLE" : ""))
      : "";
  });
}
function pickSide(s, setup) {        // setup = true: always open the budget page (ENTER THE BATTLEFIELD)
  stashTeam();          // keep whatever the previous side had
  side = s;
  loadTeam(s);
  applyTheme();
  $("s2title").textContent = "Deployment Points";
  $("s2side").textContent = s === "federation" ? "FEDERATION" : "SPACENOIDS";
  const emb = document.querySelector(s === "spacenoid" ? "#fcSpa .fc-emb" : "#fcFed .fc-emb");
  $("s2emb").innerHTML = emb ? emb.outerHTML : "";
  renderPresets();
  save();
  const to = (budget && !setup) ? "s3" : "s2";
  show(to);
  if (to === "s3") renderRoster();
}

/* ---------- 2. budget ---------- */
function renderPresets() {
  $("presets").innerHTML = "";
  PRESETS.forEach((p, k) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "bt" + (budget === p ? " on" : "");
    b.innerHTML = (budget === p ? '<span class="bt-tag">\u2713 SELECTED</span>' : '') +
      '<b>' + p.toLocaleString() + '</b><small>DEPLOYMENT POINTS</small>' +
      '<span class="bt-meter">' + PRESETS.map((_, j) => '<i' + (j <= k ? ' class="on"' : '') + '></i>').join("") + '</span>';
    b.onclick = () => { budget = p; save(); hangarGo(() => { renderRoster(); show("s3"); }); };
    $("presets").appendChild(b);
  });
  const c = $("customDp");
  if (c) c.value = (budget && PRESETS.indexOf(budget) < 0) ? budget : "";   // a custom budget stays visible
  // what is already saved for this side
  const st = $("bpState");
  if (st) {
    const n = roster.length;
    st.className = "bp-state" + (locked ? " live" : n ? " wip" : "");
    st.innerHTML = locked
      ? "\u2694 Battle in progress \u2014 " + n + " model" + (n === 1 ? "" : "s") + ", " + budget.toLocaleString() + " DP. Tap your budget to return to it."
      : n ? "Team in progress: " + n + " model" + (n === 1 ? "" : "s") + " \u2014 pick a budget to keep building." : "";
  }
}
function useCustom() {
  const v = parseInt($("customDp").value, 10);
  if (!v || v < 100) return;
  budget = v; save();
  hangarGo(() => { renderRoster(); show("s3"); });
}

/* ---------- 3. roster ---------- */
let query = "";
function available() {
  const q = query.trim().toLowerCase();
  return UNITS
    .filter(u => u.faction === side || u.faction === "neutral")
    .filter(u => !q || (u.short || u.name).toLowerCase().includes(q)
                    || u.name.toLowerCase().includes(q)
                    || u.tier.toLowerCase().includes(q)
                    || String(u.dp).includes(q))
    .sort((a, b) => a.dp - b.dp);
}
window.clearSearch = () => { query = ""; const f = $("search"); if (f) f.value = ""; renderRoster(); };
function freshState(u) {
  if (u && u.type === "warship") return shipFresh(u);
  if (u && u.type === "ground") return u.gtype === "squad" ? sqFresh(u) : gvFresh(u);
  const hp = {}; LIMB_ORDER.forEach(k => hp[k] = u.limb[k]);
  return {
    hp, dodges: u.dodges, ap: u.ap,
    track: u.abilities.map(a => a.kind === "matrix" ? { sel: null, p: 0 } : a.kind === "dualmode" ? { mode: a.modes[0].id, n: 1 } : a.kind === "counter" ? a.max
      : a.kind === "mode" ? { on: false, left: a.duration || 1, ch: a.charges || null }
      : a.kind === "toggle" ? 0 : null),
    wpn: u.weapons.map(w => w.limit && w.limit.kind === "charges" ? w.limit.max : 0),
    sh: (u.shields || []).map(s => s.hp),
    shMax: (u.shields || []).map(s => s.hp),                     // a swapped shield keeps its own maximum
    shDown: (u.shields || []).map(() => 0),
    pods: u.pods ? Array.from({ length: u.pods.count }, () => ({ hp: u.pods.hp, state: 0 })) : null,
    out: u.lendable ? Array(u.lendable.count).fill(null) : null,   // who each lendable is with
    lent: [],                                                     // shields received from others
    risk: {},                                                     // escalating-risk counters (HADES)
  };
}
function spent() {
  return roster.reduce((s, r) => s + unitById(r.id).dp, 0);
}
function countOf(id) { return roster.filter(r => r.id === id).length; }
function copyIndex(r) {
  return roster.filter(x => x.id === r.id).findIndex(x => x.uid === r.uid) + 1;
}
function addUnit(id) {
  if (!mpGuardLeader("change the roster")) return;
  { const why = groundCapCheck(unitById(id)); if (why) { mpToast(why); return; } }
  roster.push({ uid: nextUid++, id, st: freshState(unitById(id)) });
  save(); renderRoster();
}
function removeLast(id) {
  if (!mpGuardLeader("change the roster")) return;
  for (let i = roster.length - 1; i >= 0; i--) if (roster[i].id === id) { roster.splice(i, 1); break; }
  save(); renderRoster();
}
function removeOne(uid) {
  if (!mpGuardLeader("change the roster")) return;
  if (turn && Array.isArray(turn.done)) turn.done = turn.done.filter(x => x !== uid);
  const i = roster.findIndex(r => r.uid === uid);
  if (i >= 0) roster.splice(i, 1);
  save(); renderRoster();
}
function clearRoster() { if (!mpGuardLeader("change the roster")) return; roster = []; locked = false; turn = freshTurn(); snaps = {}; save(); renderRoster(); }
// confirming is blocked while the team costs more than the DP limit
window.tryConfirm = after => {
  if (!roster.length || !mpGuardLeader("confirm the team")) return;
  const used = spent();
  if (used <= budget) { confirmWithLoading(after); return; }
  overBudgetDialog(used, after);
};
function overBudgetDialog(used, after) {
  const over = used - budget;
  $("pickT").textContent = "Over budget";
  $("pickS").innerHTML = "Your team costs <b>" + used.toLocaleString() + " DP</b> but the limit is <b>" + budget.toLocaleString() +
    " DP</b> \u2014 <b style='color:#fca5a5'>" + over.toLocaleString() + " DP over</b>. Raise the limit, or go back and change your team.";
  const presets = PRESETS.filter(p => p >= used);
  $("picklist").innerHTML =
    '<div class="obwrap"><label for="obDp">New DP limit</label>' +
    '<div class="obrow"><input type="number" id="obDp" min="' + used + '" step="100" value="' + used + '" inputmode="numeric">' +
    presets.map(p => '<span class="chip obchip" data-v="' + p + '">' + p.toLocaleString() + '</span>').join("") + '</div>' +
    '<div class="obmsg" id="obMsg"></div></div>';
  $("pickCancel").textContent = "Edit team";
  $("pickExtra").innerHTML = "";
  const go = document.createElement("button");
  go.className = "btn pri ready";
  $("pickExtra").appendChild(go);
  const inp = $("obDp"), msg = $("obMsg");
  const sync = () => {
    const v = parseInt(inp.value, 10);
    const ok = v >= used;
    go.disabled = !ok;
    go.textContent = ok ? "Raise to " + v.toLocaleString() + " DP & confirm \u25B8" : "Raise the limit & confirm \u25B8";
    msg.textContent = ok ? "" : "The limit must be at least " + used.toLocaleString() + " DP (your team's cost).";
    document.querySelectorAll(".obchip").forEach(c => c.classList.toggle("on", +c.dataset.v === v));
  };
  inp.addEventListener("input", sync);
  document.querySelectorAll(".obchip").forEach(c => c.onclick = () => { inp.value = c.dataset.v; sync(); });
  const team = typeof mpTeamMode === "function" && mpTeamMode();
  const host = team && mpIsHost();
  if (team) {
    $("pickS").innerHTML += host
      ? "<br>You're the host: raising it changes the limit for <b>both teams</b>."
      : "<br>In a team game the <b>host (" + mpNameOf(mp.hostPid) + ")</b> decides \u2014 a raise applies to <b>both teams</b>.";
    const base = sync;
    const label = () => { const v = parseInt(inp.value, 10); if (v >= used) go.textContent = host ? "Raise to " + v.toLocaleString() + " DP for both teams & confirm \u25B8" : "Ask the host for " + v.toLocaleString() + " DP \u25B8"; };
    inp.addEventListener("input", label);
    document.querySelectorAll(".obchip").forEach(c => c.addEventListener("click", label));
    setTimeout(label, 0);
  }
  go.onclick = () => {
    const v = parseInt(inp.value, 10);
    if (!(v >= used)) { sync(); return; }
    if (team && !host) {                                   // the host decides
      mp.wantBudgetReq = { amount: v };
      mp.budgetAsk = { amount: v, at: Date.now() };
      closePicker(); mpKick(); renderRoster();
      mpToast("Request sent \u2014 waiting for " + mpNameOf(mp.hostPid) + " to answer.");
      return;
    }
    if (team && host) mpSetSetting("budget", Math.max(v, (mpSettings().budget || 0)));
    budget = v; save(); renderRoster(); renderPresets();
    closePicker();
    confirmWithLoading(after);
  };
  sync();
  $("pick").classList.add("on");
}
window.rowTap = uid => {
  if (locked) { openSheet(uid); return; }
  if (mpTeamMode() && !mpAmLeader()) { mpToast("\u{1F451} " + mpLeaderName(mpMyTeam()) + " is still building the roster."); return; }
  // not confirmed yet: sheets, DONE and the turn tracker only work on a confirmed team
  const r = roster.find(x => x.uid === uid);
  $("pickT").textContent = "Confirm your team first";
  $("pickS").innerHTML = "Stat sheets, the <b>DONE</b> button and the turn tracker only work once your team is confirmed. " +
    "You can still change it afterwards with <b>Edit team</b>.";
  $("picklist").innerHTML = '<div class="row" style="cursor:default"><span style="min-width:0"><div class="nm">' + roster.length + ' model(s) \u00b7 ' +
    roster.reduce((a, x) => a + unitById(x.id).dp, 0).toLocaleString() + ' / ' + (budget || 0).toLocaleString() + ' DP</div>' +
    '<div class="tr">Tapped: ' + (r ? unitLabel(uid) : "") + '</div></span></div>';
  $("pickCancel").textContent = "Keep building";
  $("pickExtra").innerHTML = "";
  const go = document.createElement("button");
  go.className = "btn pri ready";
  go.textContent = "Confirm team & open \u25B8";
  go.onclick = () => { closePicker(); tryConfirm(() => { if (roster.some(x => x.uid === uid)) openSheet(uid); }); };
  $("pickExtra").appendChild(go);
  $("pick").classList.add("on");
};
function confirmTeam() { if (!roster.length) return; locked = true; save(); renderRoster(); window.scrollTo(0, 0); }
function editTeam() { locked = false; save(); renderRoster(); }

// ---- colour markers: a coloured pip per model, matched by a post-it on the real model ----
const MARKS = [
  { k: "red", c: "#ef4444", n: "Red" }, { k: "orange", c: "#f97316", n: "Orange" }, { k: "yellow", c: "#facc15", n: "Yellow" },
  { k: "lime", c: "#a3e635", n: "Lime" }, { k: "green", c: "#22c55e", n: "Green" }, { k: "teal", c: "#14b8a6", n: "Teal" },
  { k: "cyan", c: "#22d3ee", n: "Cyan" }, { k: "blue", c: "#3b82f6", n: "Blue" }, { k: "indigo", c: "#6366f1", n: "Indigo" },
  { k: "purple", c: "#a855f7", n: "Purple" }, { k: "magenta", c: "#d946ef", n: "Magenta" }, { k: "pink", c: "#f472b6", n: "Pink" },
];
const markOf = r => (r && r.mark) ? MARKS.find(m => m.k === r.mark) || null : null;
const markPipHTML = (r, cls) => { const m = markOf(r); return m ? '<span class="mpip ' + (cls || '') + '" style="--pc:' + m.c + '" title="Marker: ' + m.n + '"></span>' : ''; };
let markQueue = [], markUid = null, markTotal = 1, markStepN = 1;
function drawMarkWheel() {
  const r = roster.find(x => x.uid === markUid); if (!r) return;
  const u = unitById(r.id);
  const taken = {};
  roster.forEach(x => { if (x.id === r.id && x.uid !== r.uid && x.mark) taken[x.mark] = "#" + copyIndex(x); });
  const svg = $("cwSvg"), NS = "http://www.w3.org/2000/svg";
  svg.innerHTML = "";
  const R1 = 104, R0 = 52, n = MARKS.length, step = 360 / n;
  const pt = (a, rad) => { const t = (a - 90) * Math.PI / 180; return [rad * Math.cos(t), rad * Math.sin(t)]; };
  MARKS.forEach((m, i) => {
    const a0 = i * step + 1.2, a1 = (i + 1) * step - 1.2;
    const [x0, y0] = pt(a0, R1), [x1, y1] = pt(a1, R1), [x2, y2] = pt(a1, R0), [x3, y3] = pt(a0, R0);
    const p = document.createElementNS(NS, "path");
    p.setAttribute("d", `M${x0} ${y0} A${R1} ${R1} 0 0 1 ${x1} ${y1} L${x2} ${y2} A${R0} ${R0} 0 0 0 ${x3} ${y3} Z`);
    p.setAttribute("fill", m.c);
    p.setAttribute("class", "cwseg" + (taken[m.k] ? " taken" : "") + (r.mark === m.k ? " cur" : ""));
    const tt = document.createElementNS(NS, "title"); tt.textContent = m.n + (taken[m.k] ? " — used by " + (u.short || u.name) + " " + taken[m.k] : ""); p.appendChild(tt);
    if (!taken[m.k]) p.addEventListener("click", () => markPick(m.k));
    svg.appendChild(p);
    if (taken[m.k]) {
      const [tx, ty] = pt((a0 + a1) / 2, (R0 + R1) / 2);
      const t = document.createElementNS(NS, "text");
      t.setAttribute("x", tx); t.setAttribute("y", ty + 5); t.setAttribute("class", "cwtaken"); t.textContent = taken[m.k];
      svg.appendChild(t);
    }
  });
  // centre: the unit's portrait (or blueprint) with its current colour as a ring
  const defs = document.createElementNS(NS, "defs");
  defs.innerHTML = '<clipPath id="cwClip"><circle cx="0" cy="0" r="44"/></clipPath>';
  svg.appendChild(defs);
  const bg = document.createElementNS(NS, "circle"); bg.setAttribute("r", "46"); bg.setAttribute("class", "cwcore"); svg.appendChild(bg);
  const im = document.createElementNS(NS, "image");
  im.setAttribute("href", u.portrait ? "img/portraits/" + u.portrait + ".webp" : modelImg(u));
  im.setAttribute("x", "-44"); im.setAttribute("y", "-44"); im.setAttribute("width", "88"); im.setAttribute("height", "88");
  im.setAttribute("preserveAspectRatio", "xMidYMin slice"); im.setAttribute("clip-path", "url(#cwClip)");
  if (!u.portrait) im.setAttribute("opacity", ".35");
  svg.appendChild(im);
  const m = markOf(r);
  const ring = document.createElementNS(NS, "circle"); ring.setAttribute("r", "46"); ring.setAttribute("class", "cwring");
  ring.setAttribute("stroke", m ? m.c : "rgba(255,255,255,.25)"); ring.setAttribute("stroke-width", m ? "5" : "2");
  if (!m) ring.setAttribute("stroke-dasharray", "4 4");
  svg.appendChild(ring);
  // copy number badge on the portrait
  const copyN = countOf(r.id) > 1 ? "#" + copyIndex(r) : "";
  if (copyN) {
    const bw = 18 + copyN.length * 9;
    const pill = document.createElementNS(NS, "rect");
    pill.setAttribute("x", -bw / 2); pill.setAttribute("y", "20"); pill.setAttribute("width", bw); pill.setAttribute("height", "22"); pill.setAttribute("rx", "11");
    pill.setAttribute("class", "cwbadge"); svg.appendChild(pill);
    const bt = document.createElementNS(NS, "text");
    bt.setAttribute("x", "0"); bt.setAttribute("y", "36"); bt.setAttribute("class", "cwbadgeT"); bt.textContent = copyN; svg.appendChild(bt);
  }
  // step label, big title, current colour
  $("cwStep").textContent = markTotal > 1 ? "MARKING " + markStepN + " OF " + markTotal : "COLOUR MARKER";
  $("cwT").innerHTML = (u.short || u.name) + (copyN ? ' <span class="cwnum">' + copyN + '</span>' : '');
  $("cwName").textContent = m ? "Current: " + m.n : "No marker yet";
  $("cwSkip").textContent = markQueue.length ? "Skip \u25B8 " + unitLabel(markQueue[0]) : (m ? "Done" : "Skip");
  // every copy of this unit: the one being marked glows; tap a chip to switch to it
  const copies = roster.filter(x => x.id === r.id);
  const cc = $("cwCopies"); cc.innerHTML = "";
  if (copies.length > 1) copies.forEach(x => {
    const xm = markOf(x);
    const c = document.createElement("button");
    c.type = "button";
    c.className = "cwcopy" + (x.uid === r.uid ? " now" : "") + (markQueue.indexOf(x.uid) >= 0 ? " next" : "");
    c.innerHTML = '<i style="--pc:' + (xm ? xm.c : 'transparent') + '"' + (xm ? '' : ' class="nocol"') + '></i>#' + copyIndex(x);
    c.title = unitLabel(x.uid) + (xm ? " \u2014 " + xm.n : " \u2014 no marker");
    c.onclick = () => { if (x.uid === markUid) return; markQueue = markQueue.filter(q => q !== x.uid); markUid = x.uid; markTotal = Math.max(markTotal, markStepN); animStep(); drawMarkWheel(); };
    cc.appendChild(c);
  });
}
window.openMarkWheel = (uid, queue) => {
  if (!mpGuardLeader("set colour markers")) return;
  markUid = uid; markQueue = Array.isArray(queue) ? queue.slice() : [];
  markTotal = 1 + markQueue.length; markStepN = 1;
  $("cwDone").classList.remove("on");
  drawMarkWheel();
  $("cw").classList.add("on");
  animStep();
};
function animStep() {
  const b = $("cwbox"); b.classList.remove("cwanim"); void b.offsetWidth; b.classList.add("cwanim");
}
let markTimer = null;
function markNext(doneText) {
  clearTimeout(markTimer);
  const go = () => {
    $("cwDone").classList.remove("on");
    if (markQueue.length) { markUid = markQueue.shift(); markStepN++; drawMarkWheel(); animStep(); return; }
    $("cw").classList.remove("on"); markUid = null;
  };
  if (doneText) {                       // show what was just marked, then move on
    const d = $("cwDone"); d.innerHTML = doneText; d.classList.add("on");
    markTimer = setTimeout(go, markQueue.length ? 750 : 550);
  } else go();
}
function markRefresh(uid) {
  save(); renderRoster();
  if (CUR && CUR.uid === uid && $("s4").classList.contains("on")) { frameKey = ""; buildFrame(); draw(); }
}
window.markPick = k => {
  const r = roster.find(x => x.uid === markUid); if (!r) { markNext(); return; }
  if (k) r.mark = k; else delete r.mark;
  markRefresh(r.uid);
  drawMarkWheel();
  const m = markOf(r);
  markNext('<b>\u2713 ' + unitLabel(r.uid) + '</b>' + (m ? '<span><i style="--pc:' + m.c + '"></i>' + m.n + '</span>' : '<span>no marker</span>') +
    (markQueue.length ? '<em>next: ' + unitLabel(markQueue[0]) + '</em>' : ''));
};
window.markSkip = () => markNext();
// adding a second (third...) copy of a unit: offer a colour for every copy that has none yet
function promptMarks(id) {
  const copies = roster.filter(r => r.id === id);
  if (copies.length < 2) return;
  const need = copies.filter(r => !r.mark).map(r => r.uid);
  if (need.length) openMarkWheel(need[0], need.slice(1));
}

// roster portrait: the unit's picture if it has one, otherwise a frame holding its blueprint silhouette
// (with a roster entry it also shows the colour marker and opens the colour wheel when tapped)
function portraitHTML(u, r) {
  const tap = r ? ' onclick="event.stopPropagation();openMarkWheel(' + r.uid + ')" title="Tap to set a colour marker"' : '';
  return u.portrait
    ? '<span class="pt' + (u.type === "warship" || u.type === "ground" ? ' shipp' : '') + (u.type === "ground" ? ' gp' : '') + (r ? ' tapm' : '') + '"' + tap + '><img src="img/portraits/' + u.portrait + '.webp" alt="" loading="lazy" decoding="async">' + markPipHTML(r) + '</span>'
    : '<span class="pt ph' + (u.type === "warship" ? ' shipph' : '') + (r ? ' tapm' : '') + '"' + (tap || (u.type === "warship" ? '' : ' title="Portrait coming soon"')) + '><img src="' + modelImg(u) + '" alt="" loading="lazy" decoding="async">' + markPipHTML(r) + '</span>';
}
// Lists used to rely on CSS multi-column layout. Safari fails to register taps outside the first column
// once rows have clipping / animations, so the app now builds real columns itself (same top-to-bottom order).
function splitColumns() {
  const W = window.innerWidth || 0;
  const n = W >= 1180 ? 3 : W >= 640 ? 2 : 1;
  document.querySelectorAll(".list").forEach(list => {
    if (list.__splitN === n) return;          // already laid out for this width: moving rows would restart their animation
    list.__splitN = n;
    const items = [];
    [...list.children].forEach(ch => { if (ch.classList.contains("lcol")) items.push(...ch.children); else items.push(ch); });
    items.forEach(i => i.remove());
    [...list.querySelectorAll(".lcol")].forEach(c => c.remove());
    if (n === 1 || items.length < 2) { list.classList.remove("split"); items.forEach(i => list.appendChild(i)); return; }
    const w = el => el.classList.contains("tierhdr") ? 0.55 : 1;
    const target = items.reduce((a, i) => a + w(i), 0) / n;
    const cols = []; let cur = [], acc = 0;
    if (!items.some(i => i.classList.contains("tierhdr"))) {
      // plain lists: even split, extras go to the first columns (e.g. 4 rows over 3 columns = 2 / 1 / 1)
      const base = Math.floor(items.length / n), extra = items.length % n;
      let k = 0;
      for (let c = 0; c < n; c++) { const len = base + (c < extra ? 1 : 0); if (len) cols.push(items.slice(k, k + len)); k += len; }
      list.classList.add("split");
      cols.forEach(cc => { const col = document.createElement("div"); col.className = "lcol"; cc.forEach(i => col.appendChild(i)); list.appendChild(col); });
      return;
    }
    items.forEach(it => {
      if (cur.length && acc + w(it) / 2 > target && cols.length < n - 1) {
        // never leave a tier heading alone at the bottom of a column
        if (cur[cur.length - 1].classList.contains("tierhdr")) { const h = cur.pop(); cols.push(cur); cur = [h]; acc = w(h); }
        else { cols.push(cur); cur = []; acc = 0; }
      }
      cur.push(it); acc += w(it);
    });
    cols.push(cur);
    list.classList.add("split");
    cols.forEach(c => { const col = document.createElement("div"); col.className = "lcol"; c.forEach(i => col.appendChild(i)); list.appendChild(col); });
  });
}
let splitT = null;
addEventListener("resize", () => { clearTimeout(splitT); splitT = setTimeout(splitColumns, 120); });

// ================= MULTIPLAYER TEAMS (msb-mp v2 / mp3) =================
// Local-first: with no session everything works exactly as the solo app. In a session:
//  - every device has a player entry (name, team, ready); the host sets budget + who goes first and starts the battle
//  - each team's LEADER (first to join it) builds the roster and ends / starts the team's turn
//  - a unit's sheet can only be changed by the device holding that unit's LOCK; everyone else watches read-only
// Nothing here blocks the tracker: all network work happens in a background loop.
const SYNC_URL = "/api/sync";
const MP_KEY = "msb.mp.v2", MP_NAME_KEY = "msb.mp.name";
const MP_FAST = 400, MP_SLOW = 1000, MP_IDLE = 3000, MP_BACKOFF = [3000, 10000, 30000];
const MP_PUSH_DELAY = 75;          // coalesces a quick burst of taps into one send
const MP_MIN_GAP = 120;            // never start checks closer together than this
let MP_IDLE_AFTER = 10 * 60000;    // nothing changed for this long -> slow checks (a forgotten tablet)
const MP_LOCK_STALE = 30000;
const TEAMS2 = ["federation", "spacenoid"];
let mp = { code: null, pid: null, token: null, status: "off", msg: "",
  data: {}, etags: {}, seen: {}, base: { team: undefined, units: {} }, leaders: {}, hostPid: null, skew: 0,
  held: new Set(), wantAcquire: new Set(), wantRelease: new Set(), afterLock: {}, viewing: null,
  wantPlayer: null, wantSettings: null, entered: false, prompt: null,
  wantInbox: [], wantConsume: new Set(), delivered: new Set(), inboxUndo: {}, incoming: null,
  timer: null, pushTimer: null, busy: false, again: false, fails: 0, lastOk: 0, oppAt: 0, localAt: 0, toastT: null };

// ---------- timing panel (tap the MP chip 5 times, or open the app with ?mpdebug) ----------
const mpStats = { rtt: [], srv: [], lag: [], send: [] };
function mpStat(k, v) { const a = mpStats[k]; a.push(v); if (a.length > 30) a.shift(); }
const mpAvg = a => a.length ? Math.round(a.reduce((x, y) => x + y, 0) / a.length) : null;
let mpDebugOn = (() => { try { return /[?&]mpdebug\b/.test(location.search) || localStorage.getItem("msb.mp.debug") === "1"; } catch (e) { return false; } })();
let mpChipTaps = [];
window.mpChipTap = () => {
  const now = Date.now();
  mpChipTaps = mpChipTaps.filter(t => now - t < 2500); mpChipTaps.push(now);
  if (mpChipTaps.length >= 5) {
    mpChipTaps = []; mpDebugOn = !mpDebugOn;
    try { localStorage.setItem("msb.mp.debug", mpDebugOn ? "1" : "0"); } catch (e) {}
    mpDebugRender(); mpToast("Timing panel " + (mpDebugOn ? "on" : "off"));
    return true;
  }
  return false;
};
function mpDebugRender() {
  let p = $("mpDebug");
  if (!mpDebugOn || !mp.code) { if (p) p.style.display = "none"; return; }
  if (!p) { p = document.createElement("div"); p.id = "mpDebug"; document.body.appendChild(p); }
  p.style.display = "block";
  const last = a => a.length ? a[a.length - 1] : "\u2014";
  const t = mp.lastTiming || {};
  p.innerHTML = '<b>SYNC TIMING</b>' +
    '<div>round trip <i>' + last(mpStats.rtt) + ' ms</i> avg ' + (mpAvg(mpStats.rtt) ?? "\u2014") + '</div>' +
    '<div>server <i>' + last(mpStats.srv) + ' ms</i> (list ' + (t.list ?? "\u2014") + ' \u00b7 read ' + (t.read ?? "\u2014") + ' \u00b7 write ' + (t.write ?? "\u2014") + ')</div>' +
    '<div>send after tap <i>' + last(mpStats.send) + ' ms</i></div>' +
    '<div>change arrived after <i>' + last(mpStats.lag) + ' ms</i> avg ' + (mpAvg(mpStats.lag) ?? "\u2014") + '</div>' +
    '<div>checking every <i>' + (mp.curInterval || "\u2014") + ' ms</i> \u00b7 ' + mp.status + '</div>' +
    '<div>data store <i>' + (t.store || "\u2014") + '</i></div>' +
    '<div>live link <i>' + (mp.link || "closed") + '</i> \u00b7 pushes ' + (mp.pushes || 0) + ' \u00b7 reconnects ' + (mp.reconnects || 0) + '</div>';
}

// ---------- small helpers ----------
const teamName = t => t === "federation" ? "Federation" : t === "spacenoid" ? "Spacenoids" : "\u2014";
const teamPoss = t => t === "spacenoid" ? "Spacenoids'" : teamName(t) + "'s";
const otherTeam = t => t === "federation" ? "spacenoid" : "federation";
const mpPlayers = () => { const o = {}; Object.keys(mp.data).forEach(k => { if (k.startsWith("player/") && mp.data[k]) o[k.slice(7)] = mp.data[k]; }); return o; };
const mpMe = () => mp.pid ? mp.data["player/" + mp.pid] || null : null;
const mpMyTeam = () => { const m = mpMe(); return m ? m.team : null; };
const mpSettings = () => mp.data.settings || { phase: "lobby", budget: 10000, first: null };
const mpIsHost = () => !!mp.pid && mp.hostPid === mp.pid;
const mpInBattle = () => !!mp.code && mpSettings().phase === "battle";
const mpTeamMode = () => mpInBattle() && !!mpMyTeam() && side === mpMyTeam() && mp.entered;
const mpAmLeader = () => { const t = mpMyTeam(); return !!t && mp.leaders[t] === mp.pid; };
const mpLeaderName = t => { const p = mp.leaders[t] && mp.data["player/" + mp.leaders[t]]; return p ? p.name : "the leader"; };
const mpNameOf = pid => { const p = mp.data["player/" + pid]; return p ? p.name : "another player"; };
const mpNow = () => Date.now() + mp.skew;
const lockKey = (t, uid) => t + "/" + uid;
const mpLockOf = (t, uid) => mp.data["lock/" + lockKey(t, uid)] || null;
const mpLockAlive = l => { if (!l) return false; const p = mp.data["player/" + l.pid]; return !!p && mpNow() - (p.seen || 0) < MP_LOCK_STALE; };
const turnKeyNow = () => turn.round + ":" + turn.phase;
const mpActive = () => !!(mp.code && mp.status !== "ended" && mp.status !== "error");
function mpToast(t) {
  let e = $("mpToast");
  if (!e) { e = document.createElement("div"); e.id = "mpToast"; document.body.appendChild(e); }
  e.textContent = t; e.classList.add("on");
  clearTimeout(mp.toastT); mp.toastT = setTimeout(() => e.classList.remove("on"), 2600);
}
function mpStore() {
  try {
    if (mp.code) localStorage.setItem(MP_KEY, JSON.stringify({ code: mp.code, pid: mp.pid, token: mp.token }));
    else localStorage.removeItem(MP_KEY);
  } catch (e) {}
}
// ---------- live connection (Cloudflare room) ----------
const MP_LINK_POLL = 5000;          // backup check while the live connection is open (pushes do the real work)
let mpWs = null, mpWsSeq = 0, mpWsWait = {}, mpWsRetry = 0, mpWsTimer = null;
mp.link = "closed"; mp.reconnects = 0; mp.pushes = 0;
function mpConnect() {
  if (!mp.code || !mp.pid || !mp.token || mpWs || document.hidden) return;
  clearTimeout(mpWsTimer);
  const proto = location.protocol === "https:" ? "wss:" : "ws:";
  let ws;
  try { ws = new WebSocket(proto + "//" + location.host + "/api/ws?code=" + encodeURIComponent(mp.code) + "&pid=" + encodeURIComponent(mp.pid) + "&token=" + encodeURIComponent(mp.token)); }
  catch (e) { mpLinkLost(); return; }
  mpWs = ws; mp.link = "connecting"; mpDebugRender();
  ws.onopen = () => { mp.link = "open"; mpWsRetry = 0; mp.linkAt = Date.now(); mpDebugRender(); mpKickQuiet(); };
  ws.onmessage = ev => {
    mp.linkAt = Date.now();                                        // anything (even a pong) proves the link is alive
    let m; try { m = JSON.parse(ev.data); } catch (e) { return; }
    if (m && m.type === "changed") { mp.pushes++; mpKickQuiet(); return; }
    if (m && m.id && mpWsWait[m.id]) { const w = mpWsWait[m.id]; delete mpWsWait[m.id]; clearTimeout(w.t); w.res({ status: m.status, j: m.j || {} }); }
  };
  ws.onclose = ev => {
    if (mpWs !== ws) return;                                        // an old connection we already replaced
    mpWs = null;
    Object.values(mpWsWait).forEach(w => { clearTimeout(w.t); w.res({ status: 0, j: { error: "Connection lost." } }); }); mpWsWait = {};
    if (ev.code === 4000) { mp.status = "ended"; mp.msg = "The session has ended."; mpStop(); mpRender(); return; }
    if (ev.code === 4001) return;                                   // this device left
    mpLinkLost();
  };
  ws.onerror = () => {};
}
function mpLinkLost() {
  mp.link = "closed"; mpDebugRender();
  if (!mpActive()) return;
  mp.reconnects++;
  const wait = [500, 1000, 2000, 4000, 8000][Math.min(mpWsRetry++, 4)];
  clearTimeout(mpWsTimer);
  mpWsTimer = setTimeout(mpConnect, wait);
  mpKickQuiet();                                                   // the regular requests keep things going meanwhile
}
// heartbeat: Cloudflare answers "ping" itself (the room stays asleep); silence means the link is dead
setInterval(() => {
  if (!mpWs || mpWs.readyState !== 1) return;
  if (Date.now() - (mp.linkAt || 0) > 35000) {                   // no answer for a while: start over
    const w = mpWs; mpWs = null;
    try { w.close(4002, "stale"); } catch (e) {}
    mpLinkLost();
    return;
  }
  try { mpWs.send("ping"); } catch (e) {}
}, 15000);
function mpDisconnect() {
  clearTimeout(mpWsTimer);
  if (mpWs) { const w = mpWs; mpWs = null; try { w.close(1000, "bye"); } catch (e) {} }
  mp.link = "closed";
}
function mpWsCall(body, ms) {
  return new Promise(res => {
    const id = ++mpWsSeq;
    const t = setTimeout(() => { delete mpWsWait[id]; res({ status: 0, j: { error: "The server didn't answer in time." } }); }, ms || 8000);
    mpWsWait[id] = { res, t };
    try { mpWs.send(JSON.stringify({ id, body })); }
    catch (e) { clearTimeout(t); delete mpWsWait[id]; res({ status: 0, j: { error: "Connection lost." } }); }
  });
}
// a sync triggered by the server or the connection (not by this player)
function mpKickQuiet() {
  if (!mpActive() || document.hidden) return;
  if (mp.busy) { mp.again = true; return; }
  if (mp.timer) { clearTimeout(mp.timer); mp.timer = null; }
  mpTick();
}
document.addEventListener("visibilitychange", () => {
  if (document.hidden) return;
  if (mp.code && !mpWs && mpActive()) mpConnect();
});
async function mpCall(body, ms) {
  if (body.action === "sync" && mpWs && mpWs.readyState === 1) return mpWsCall(body, ms);
  const ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
  const t = ctrl ? setTimeout(() => ctrl.abort(), ms || 9000) : null;
  try {
    const r = await fetch(SYNC_URL, { method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify(body), cache: "no-store", signal: ctrl ? ctrl.signal : undefined });
    let j = {}; try { j = await r.json(); } catch (e) {}
    return { status: r.status, j };
  } catch (e) {
    return { status: 0, j: { error: navigator.onLine === false ? "You're offline." : "Can't reach the sync service." } };
  } finally { if (t) clearTimeout(t); }
}

// ---------- what this device writes ----------
function teamLog() { return (turn.log || []).filter(e => e.u == null).slice(-60); }
function unitLog(uid) { return (turn.log || []).filter(e => e.u === uid).slice(-40); }
function mpTeamJSON() {
  return JSON.stringify({ v: 2, roster: roster.map(r => ({ uid: r.uid, id: r.id, mark: r.mark || null })), nextUid, locked,
    turn: { round: turn.round, phase: turn.phase, first: turn.first, started: turn.started, ends: turn.mpEnds || 0 }, log: teamLog() });
}
function mpUnitJSON(r) {
  return JSON.stringify({ st: r.st, done: isDone(r.uid) ? turnKeyNow() : null, log: unitLog(r.uid) });
}
// may this device write this unit right now?
function mpMayWriteUnit(uid) {
  const t = mpMyTeam();
  if (mp.held.has(lockKey(t, uid))) return true;
  const l = mpLockOf(t, uid);
  return mpAmLeader() && (!l || !mpLockAlive(l));
}
function mpDirty() {
  if (!mpActive()) return;
  mp.localAt = Date.now(); mp.lastActivity = Date.now();
  if (!mp.dirtyAt) mp.dirtyAt = performance.now();
  clearTimeout(mp.pushTimer);
  mp.pushTimer = setTimeout(mpKick, MP_PUSH_DELAY);
}
function mpKick() {
  mp.localAt = Date.now(); mp.lastActivity = Date.now();       // something happened on this device
  if (!mpActive() || document.hidden) return;
  if (mp.busy) { mp.again = true; return; }
  if (mp.timer) { clearTimeout(mp.timer); mp.timer = null; }
  mpTick();
}

// ---------- the sync round trip ----------
async function mpSync() {
  const body = { action: "sync", code: mp.code, pid: mp.pid, token: mp.token, known: mp.etags, writes: {} };
  const sentPlayer = mp.wantPlayer, sentSettings = mp.wantSettings;
  if (sentPlayer) body.writes.player = sentPlayer;
  const sentReq = mp.wantBudgetReq, sentRes = (mp.wantResolve || []).splice(0), sentClear = mp.wantClearResult;
  if (sentReq) body.writes.budgetRequest = sentReq;
  if (sentRes.length) body.writes.resolve = sentRes;
  if (sentClear) body.writes.clearResult = true;
  const sentEnd = mp.wantEndTurn;
  if (sentEnd) body.writes.endTurn = sentEnd;
  const sentForce = mp.wantForceTurn;
  if (sentForce) body.writes.forceTurn = sentForce;
  const sentEndReq = mp.wantEndRequest, sentAccept = mp.wantAcceptEnd, sentLead = mp.wantPassLead;
  if (sentEndReq) body.writes.endRequest = sentEndReq;
  if (sentAccept) body.writes.acceptEnd = sentAccept;
  if (sentLead) body.writes.passLead = sentLead;
  const sentFF = (mp.ffOps || []).slice(0, 6);
  if (sentFF.length) body.writes.ff = sentFF;
  if (sentSettings) body.writes.settings = sentSettings;
  const unitsSent = {};
  let teamSent;
  if (mpTeamMode()) {
    const t = mpMyTeam();
    if (mpAmLeader() && mp.base.team !== undefined) {
      const tj = mpTeamJSON();
      if (tj !== mp.base.team) { body.writes.team = Object.assign(JSON.parse(tj), { _t: mpNow() }); teamSent = tj; }
    }
    roster.forEach(r => {
      const b = mp.base.units[r.uid];
      if (b === undefined || !mpMayWriteUnit(r.uid)) return;
      const uj = mpUnitJSON(r);
      if (uj !== b) { body.writes.units = body.writes.units || {}; body.writes.units[lockKey(t, r.uid)] = Object.assign(JSON.parse(uj), { _t: mpNow() }); unitsSent[r.uid] = uj; }
    });
  }
  const acq = [...mp.wantAcquire], rel = [...mp.wantRelease];
  if (acq.length) body.acquire = acq;
  if (rel.length) body.release = rel;
  const outbox = mp.wantInbox.splice(0), cons = [...mp.wantConsume];
  if (outbox.length) body.inbox = outbox;
  if (cons.length) body.consume = cons;
  const dirtyStart = mp.dirtyAt; mp.dirtyAt = 0;
  const tReq = performance.now();
  const r = await mpCall(body);
  const rtt = Math.round(performance.now() - tReq);
  if (r.status !== 200) { mp.wantInbox = outbox.concat(mp.wantInbox); mp.wantResolve = sentRes.concat(mp.wantResolve || []); mpTrouble(r); return; }
  const j = r.j;
  mpStat("rtt", rtt);
  if (j.timing) { mpStat("srv", j.timing.total); mp.lastTiming = j.timing; }
  if ((body.writes.team || body.writes.units) && dirtyStart) mpStat("send", Math.round(tReq - dirtyStart));
  if (sentPlayer && mp.wantPlayer === sentPlayer) mp.wantPlayer = null;
  if (sentReq && mp.wantBudgetReq === sentReq) mp.wantBudgetReq = null;
  if (sentClear) mp.wantClearResult = false;
  if (sentEnd && mp.wantEndTurn === sentEnd) mp.wantEndTurn = null;
  if (sentForce && mp.wantForceTurn === sentForce) mp.wantForceTurn = null;
  if (sentEndReq && mp.wantEndRequest === sentEndReq) mp.wantEndRequest = null;
  if (sentAccept && mp.wantAcceptEnd === sentAccept) mp.wantAcceptEnd = null;
  if (sentLead && mp.wantPassLead === sentLead) mp.wantPassLead = null;
  cons.forEach(k => mp.wantConsume.delete(k));
  if (sentSettings && mp.wantSettings === sentSettings) mp.wantSettings = null;
  rel.forEach(k => { mp.wantRelease.delete(k); mp.held.delete(k); });
  const denied = new Set(j.denied || []);
  if (sentFF.length) {
    mp.ffOps.splice(0, sentFF.length);
    if (denied.has("ff:invite")) mpToast("That squad is already in a firefight.");
    else if (denied.has("ff:gone")) mpToast("That firefight has already ended.");
  }
  outbox.forEach(m => {
    const undo = mp.inboxUndo[m.id]; delete mp.inboxUndo[m.id];
    if (denied.has("inbox:" + m.to) && undo) undo();
  });
  if (teamSent !== undefined && !denied.has("team-state")) mp.base.team = teamSent;
  Object.entries(unitsSent).forEach(([uid, uj]) => { if (!denied.has("unit:" + lockKey(mpMyTeam(), uid))) mp.base.units[uid] = uj; });
  if (denied.has("team")) mpToast("Teams can't be changed once the battle has started.");
  if ([...denied].some(d => d.startsWith("start:"))) mpToast("Both teams need a player and a first turn before starting.");
  // merge the server's view
  // lobby activity = a real change to names / teams / ready / settings (not the 10 s "still here" refresh)
  const plain = v => JSON.stringify(Object.assign({}, v || {}, { seen: 0 }));
  if (Object.entries(j.changes || {}).some(([k, v]) => k === "settings" || (k.startsWith("player/") && plain(mp.data[k]) !== plain(v)))
      || (j.removed || []).some(k => k.startsWith("player/"))) { mp.lobbyAt = Date.now(); mp.lastActivity = Date.now(); }
  (j.removed || []).forEach(k => { delete mp.data[k]; mp.delivered.delete(k); });
  Object.entries(j.changes || {}).forEach(([k, v]) => {
    if (v && v._t && mp.etags[k] !== undefined && (k.startsWith("unit/") || k.startsWith("team/"))) {
      const lag = Date.now() + (j.now ? j.now - Date.now() : mp.skew) - v._t;
      if (lag >= 0 && lag < 60000) { mpStat("lag", lag); if (Date.now() - mp.localAt > 500) mp.lastActivity = Date.now(); }
    }
    mp.data[k] = v;
  });
  mp.etags = j.etags || {};
  Object.keys(mp.data).forEach(k => { if (!(k in mp.etags)) delete mp.data[k]; });
  mp.leaders = j.leaders || {}; mp.hostPid = j.hostPid || mp.hostPid;
  if (sentEnd && (j.denied || []).includes("end-turn")) {
    delete mp.etags.turn; delete mp.data.turn; mp.again = true;     // fetch the real turn order again
    mp.endDenied = true;                                            // decided once the real order is back
  }
  if (j.now) mp.skew = j.now - Date.now();
  // lock results
  acq.forEach(k => {
    const l = mp.data["lock/" + k];
    mp.wantAcquire.delete(k);
    if (l && l.pid === mp.pid) { mpGranted(k); }
    else {
      const cb = mp.afterLock[k]; delete mp.afterLock[k];
      const undo = mp.afterDeny && mp.afterDeny[k]; if (mp.afterDeny) delete mp.afterDeny[k];
      if (undo) undo();
      else if (cb && !(mp.quiet && mp.quiet.has(k))) mpToast((l ? mpNameOf(l.pid) : "Someone") + " is using this unit right now.");
      if (mp.quiet) mp.quiet.delete(k);
    }
  });
  mpApply();
  mpOk();
}
function mpGranted(k) {
  // take the latest version of the unit before editing it
  const uid = +k.split("/")[1];
  const r = roster.find(x => x.uid === uid);
  if (r) mpApplyUnit(r, true);
  mp.held.add(k);
  const cb = mp.afterLock[k]; delete mp.afterLock[k];
  if (mp.afterDeny) delete mp.afterDeny[k];
  if (cb) cb();
  mpSheetMode();
}
function mpOk() { mp.fails = 0; mp.lastOk = Date.now(); if (mp.status !== "ended") mp.status = "live"; mpRender(); }
function mpTrouble(r) {
  if (r.status === 410) { mp.status = "ended"; mp.msg = r.j.error || "The session has ended."; mpStop(); mpDisconnect(); }
  else if (r.status === 403) { mp.status = "error"; mp.msg = r.j.error || "This device is no longer in the session."; mpStop(); mpDisconnect(); }
  else { mp.fails++; mp.status = "retrying"; mp.msg = r.j.error || "Sync problem \u2014 retrying."; }
  mpSheetMode(); mpRender();
}
function mpInterval() {
  if (mp.fails) return MP_BACKOFF[Math.min(mp.fails - 1, 2)];
  if (mp.link === "open") return MP_LINK_POLL;                    // the room pushes changes; this is only a backup
  const now = Date.now();
  if (!mp.lastActivity) mp.lastActivity = now;
  if (now - mp.lastActivity > MP_IDLE_AFTER) return MP_IDLE;     // nothing happening for a long time
  const s = mpSettings();
  if (s.phase !== "battle") return now - Math.max(mp.localAt, mp.lobbyAt || 0) < 5000 ? MP_FAST : MP_SLOW;
  const ot = mp.data["team/" + otherTeam(mpMyTeam())];
  const theirTurn = ot && ot.locked && ot.turn && ot.turn.phase === "you";
  const myTd = mp.data["team/" + mpMyTeam()];
  const building = !(myTd && myTd.locked) || !(ot && ot.locked);        // a roster is still being picked
  const recent = building || now - mp.oppAt < 20000 || now - (mp.teamAt || 0) < 20000 || now - mp.localAt < 10000
    || mp.viewing != null || mp.wantAcquire.size;
  return theirTurn || recent ? MP_FAST : MP_SLOW;
}
async function mpTick() {
  mp.timer = null;
  if (!mpActive() || document.hidden || mp.busy) return;
  mp.busy = true; mp.again = false;
  const started = performance.now();
  try { await mpSync(); } catch (e) { console.error(e); } finally { mp.busy = false; }
  if (!mpActive()) return;
  if (mp.timer) clearTimeout(mp.timer);
  const took = performance.now() - started;
  const iv = mpInterval();
  mp.curInterval = iv;
  // aim for one check every `iv` measured from when this one STARTED (request time isn't added on top)
  const wait = mp.again ? 0 : Math.max(MP_MIN_GAP, iv - took);
  mp.timer = setTimeout(mpTick, wait);
  mpDebugRender();
}
function mpStart() {
  if (mp.busy) { mp.again = true; return; }
  mpStop(); mp.timer = setTimeout(mpTick, 50);
}
function mpStop() { if (mp.timer) clearTimeout(mp.timer); mp.timer = null; clearTimeout(mp.pushTimer); }
document.addEventListener("visibilitychange", () => { if (!document.hidden && mpActive() && !mp.timer) mpStart(); });
addEventListener("online", () => { if (mpActive()) mpStart(); });

// ---------- applying what others changed ----------
function mpUseSide(t) {
  if (side === t) return;
  stashTeam(); side = t; loadTeam(t); applyTheme();
}
function deepFill(target, src) {           // replace target's contents in place (keeps references the sheet holds)
  if (Array.isArray(target) && Array.isArray(src)) {
    target.length = src.length;
    src.forEach((v, i) => {
      if (v && typeof v === "object" && target[i] && typeof target[i] === "object" && Array.isArray(v) === Array.isArray(target[i])) deepFill(target[i], v);
      else target[i] = v && typeof v === "object" ? JSON.parse(JSON.stringify(v)) : v;
    });
    return target;
  }
  Object.keys(target).forEach(k => { if (!(k in src)) delete target[k]; });
  Object.keys(src).forEach(k => {
    const v = src[k];
    if (v && typeof v === "object" && target[k] && typeof target[k] === "object" && Array.isArray(v) === Array.isArray(target[k])) deepFill(target[k], v);
    else target[k] = v && typeof v === "object" ? JSON.parse(JSON.stringify(v)) : v;
  });
  return target;
}
function mpApplyUnit(r, force) {
  const t = mpMyTeam(), key = "unit/" + lockKey(t, r.uid);
  const d = mp.data[key];
  if (!d) { if (mp.base.units[r.uid] === undefined) mp.base.units[r.uid] = mpUnitJSON(r); return false; }
  const etag = mp.etags[key];
  if (!force && mp.seen[key] === etag && mp.base.units[r.uid] !== undefined) return false;
  if (!force && mp.held.has(lockKey(t, r.uid)) && mp.base.units[r.uid] !== undefined) { mp.seen[key] = etag; return false; }
  if (d.st) deepFill(r.st, d.st);
  // done flag + this unit's events
  turn.done = (turn.done || []).filter(x => x !== r.uid);
  if (d.done && d.done === turnKeyNow()) turn.done.push(r.uid);
  const others = (turn.log || []).filter(e => e.u !== r.uid);
  turn.log = others.concat(Array.isArray(d.log) ? d.log : []).sort((a, b) => (a.at || 0) - (b.at || 0));
  mp.seen[key] = etag;
  mp.base.units[r.uid] = mpUnitJSON(r);
  snaps[r.uid] = snapOf(r);
  return true;
}
function mpBudgetFlow() {
  const s = mpSettings();
  // everyone: the limit changed during the battle
  if (s.phase === "battle" && mp.lastBudget != null && s.budget !== mp.lastBudget) {
    mpToast("\u{1F4B0} Deployment points are now " + (s.budget || 0).toLocaleString() + " for both teams.");
    if (mpTeamMode()) { budget = s.budget; renderOppIfVisible(); if ($("s3").classList.contains("on")) renderRoster(); }
  }
  mp.lastBudget = s.budget;
  // host: requests waiting for an answer
  if (mpIsHost()) {
    const reqs = Object.keys(mp.data).filter(k => k.startsWith("req/") && mp.data[k]).sort((a, b) => mp.data[a].at - mp.data[b].at);
    const box = $("mpReq");
    const showing = box && box.classList.contains("on") ? box.dataset.pid : null;
    if (!showing && reqs.length) mpShowRequest(reqs[0].slice(4), mp.data[reqs[0]]);
    if (showing && !mp.data["req/" + showing]) box.classList.remove("on");
  }
  // requester: the host answered
  const res = mp.data["res/" + mp.pid];
  if (res && !mp.wantClearResult && mp.resSeen !== res.at) {
    mp.resSeen = res.at; mp.wantClearResult = true; mp.budgetAsk = null;
    if (res.accept) { mp.prompt = "budgetOk"; mp.promptAmount = res.amount; }
    else { mp.prompt = "budgetNo"; mp.promptAmount = res.amount; }
    mp.again = true;
  }
}
function mpShowRequest(pid, q) {
  let box = $("mpReq");
  if (!box) {
    box = document.createElement("div"); box.id = "mpReq";
    box.innerHTML = '<div class="mprq"><div class="cwstep">HOST DECISION</div><h3>Raise the deployment points?</h3><p id="mpReqT"></p>' +
      '<div class="cwbtns"><button class="btn" id="mpReqNo">Decline</button><button class="btn pri ready" id="mpReqYes">Accept</button></div></div>';
    document.body.appendChild(box);
  }
  const cur = mpSettings().budget || 0;
  box.dataset.pid = pid;
  $("mpReqT").innerHTML = "<b>" + q.name + "</b> (" + teamName(q.team) + " leader) asks to raise the limit from <b>" + cur.toLocaleString() +
    "</b> to <b>" + q.amount.toLocaleString() + " DP</b>.<br>If you accept, <b>both teams</b> get " + Math.max(cur, q.amount).toLocaleString() + " DP.";
  const decide = accept => {
    box.classList.remove("on");
    mp.wantResolve = (mp.wantResolve || []).concat([{ pid, accept }]);
    if (accept) mp.data.settings = Object.assign({}, mpSettings(), { budget: Math.max(cur, q.amount) });
    delete mp.data["req/" + pid];
    mpKick(); mpRender();
  };
  $("mpReqYes").onclick = () => decide(true);
  $("mpReqNo").onclick = () => decide(false);
  box.classList.add("on");
}
function mpApply() {
  const s = mpSettings(), me = mpMe();
  if (!me) return;
  mpBudgetFlow();
  const t = me.team;
  // lobby <-> battle
  if (s.phase === "battle" && t && !mp.entered) {
    mp.entered = true;
    const onLobby = $("s5") && $("s5").classList.contains("on");
    const go = () => { mpUseSide(t); mpEnterTeam(); renderRoster(); show("s3"); };
    if (onLobby) hangarGo(go, t); else { mpUseSide(t); mpEnterTeam(); }
  } else if (s.phase !== "battle" && mp.entered) {
    mp.entered = false; mp.base = { team: undefined, units: {} }; mp.seen = {};
    if ($("s3").classList.contains("on") || $("s4").classList.contains("on")) { mpToast("The host sent everyone back to the lobby."); show("s5"); }
  }
  if (!mpTeamMode()) { renderOppIfVisible(); return; }
  let changed = false;
  // team roster + turn (from the leader)
  const tkey = "team/" + t, td = mp.data[tkey];
  budget = s.budget || budget;
  if (td && (mp.seen[tkey] !== mp.etags[tkey] || mp.base.team === undefined)) {
    const mine = mpAmLeader() && mp.base.team !== undefined;
    if (!mine) {
      const byUid = {}; roster.forEach(r => byUid[r.uid] = r);
      roster = (td.roster || []).filter(x => unitById(x.id)).map(x => {
        const r = byUid[x.uid] || { uid: x.uid, id: x.id, st: freshState(unitById(x.id)) };
        r.id = x.id; if (x.mark) r.mark = x.mark; else delete r.mark;
        return r;
      });
      nextUid = Math.max(td.nextUid || 1, ...roster.map(r => r.uid + 1), 1);
      const wasLocked = locked;
      locked = !!td.locked;
      const tt = td.turn || {};
      const prevKey = turnKeyNow();
      turn.round = tt.round != null ? tt.round : turn.round;
      turn.phase = tt.phase || turn.phase;
      turn.first = tt.first || turn.first;
      turn.started = !!tt.started;
      turn.mpEnds = tt.ends || 0;
      if (prevKey !== turnKeyNow()) { turn.done = []; phaseUndo = null; }
      const unitEvents = (turn.log || []).filter(e => e.u != null);
      turn.log = unitEvents.concat(td.log || []).sort((a, b) => (a.at || 0) - (b.at || 0));
      if (!wasLocked && locked && $("s3").classList.contains("on")) mpToast("\u{1F451} " + mpLeaderName(t) + " confirmed the team.");
      if (turnKeySeen !== null && prevKey !== turnKeyNow()) { turnKeySeen = turnKeyNow(); turnBanner(); }
    }
    mp.seen[tkey] = mp.etags[tkey];
    mp.base.team = mpTeamJSON();
    changed = true;
  } else if (!td && mpAmLeader() && mp.base.team === undefined) {
    // first leader of a new battle: start an empty roster with the host's settings
    roster = []; nextUid = 1; locked = false; turn = freshTurn(); snaps = {};
    turn.first = s.first === t ? "you" : "enemy";
    turn.round = turn.first === "enemy" ? 0 : 1;
    turn.phase = turn.first === "enemy" ? "enemy" : "you";
    mp.base.team = "";                                  // forces the first push
    changed = true;
  } else if (mp.base.team === undefined && !td) {
    // wait for the leader's roster; the turn order is already known from the host
    if (roster.length || locked || turn.first !== (s.first === t ? "you" : "enemy")) {
      roster = []; locked = false; turn = freshTurn();
      turn.first = s.first === t ? "you" : "enemy";
      turn.round = turn.first === "enemy" ? 0 : 1;
      turn.phase = turn.first === "enemy" ? "enemy" : "you";
      changed = true;
    }
  }
  // units
  roster.forEach(r => { if (mpApplyUnit(r)) changed = true; });
  // deliveries for units this device holds (or can pick up)
  if (mpDeliveries()) changed = true;
  if (changed) {
    save();
    if (CUR && $("s4").classList.contains("on")) { reloadCur(); if (CUR) { draw(); } }
    if ($("s3").classList.contains("on")) renderRoster();
  }
  // opponent activity + turn prompt
  const ok = "team/" + otherTeam(t);
  if (mp.data[ok] && mp.seen["opp:" + ok] !== mp.etags[ok]) {
    const prev = mp.oppPrev; const cur = mp.data[ok];
    mp.seen["opp:" + ok] = mp.etags[ok]; mp.oppAt = Date.now();
    mpTurnWatch(prev, cur); mp.oppPrev = cur;
  }
  Object.keys(mp.etags).forEach(k => { if (k.startsWith("unit/" + otherTeam(t) + "/") && mp.seen["opp:" + k] !== mp.etags[k]) { mp.seen["opp:" + k] = mp.etags[k]; mp.oppAt = Date.now(); } });
  if (changed) { mp.lastActivity = Date.now(); mp.teamAt = Date.now(); }   // a teammate's change counts as activity too
  // the official turn order
  const tk = mp.data.turn;
  if (tk && tk.req && tk.req.team === t && tk.req.seq === tk.seq && !tk.req.pending && tk.active === t && locked &&
      turn.phase === "you" && mpAmLeader() && !mp.wantEndTurn && mpEndGate() === "go" && !mpOthersEditing().length) {
    setTimeout(() => { const k2 = mp.data.turn; if (k2 && k2.active === t && turn.phase === "you") endMyTurn(); }, 0);
  }
  if (tk && mp.endDenied) {
    mp.endDenied = false;
    if (tk.active === t && turn.phase === "enemy" && phaseUndo) {      // the room still says it's our turn: undo the end
      undoPhase(); mpToast("Your turn change wasn't accepted \u2014 it's still your turn.");
    }
  }
  if (tk && locked) {
    // the other side ended its turn: ours starts by itself (the leader's device runs the start-of-turn upkeep)
    if (tk.active === t && !tk.pending) {
      const other = teamName(tk.active === "federation" ? "spacenoid" : "federation");
      if (turn.phase === "enemy") {
        if (mpAmLeader()) {
          if (mp.autoSeq !== tk.seq) {
            const busy = mpOthersEditing();
            if (busy.length) { mp.prompt = "startwait"; mp.promptBusy = busy; mp.promptOther = other; }
            else {
              mp.autoSeq = tk.seq;
              startMyTurn();
              mpAnnounceStart(tk.seq, other);
            }
          }
        } else if (mp.startedSeq !== tk.seq) {
          mp.prompt = "startwait"; mp.promptBusy = mpTeamLocksExceptLeader(); mp.promptOther = other;
        }
      } else if (mp.startedSeq !== tk.seq && tk.endedBy && Date.now() - (tk.at || 0) < 60000) {
        mpAnnounceStart(tk.seq, other);                                   // members: the leader's start has arrived
      } else if (mp.startedSeq !== tk.seq) mp.startedSeq = tk.seq;        // battle start / reload: nothing to announce
    }
    if (tk.active !== t && turn.phase === "you" && mpAmLeader() && !tk.pending && !mp.wantEndTurn) {
      turn.phase = "enemy"; turn.done = []; phaseUndo = null; save();        // this device fell out of step: match the room
      mpToast("Turn order corrected \u2014 it's the " + teamPoss(tk.active) + " turn.");
      if ($("s3").classList.contains("on")) renderRoster();
    }
    // redraw the turn box whenever anything it shows changes: turn, request, either side's count, who leads
    const dc = mpDefenderCount(), my = doneTally();
    const sig = [tk.seq, tk.active, tk.req ? [tk.req.seq, tk.req.team, !!tk.req.ok, !!tk.req.pending].join(",") : "-", dc.n, dc.of, my.n, my.of, mpAmLeader()].join("|");
    if (mp.turnSig !== sig) { mp.turnSig = sig; mp.lastTurnSeq = tk.seq; if ($("s3").classList.contains("on")) renderTurn(); }
  }
  // a sheet I'm watching became free: take control
  if (mp.viewing != null) {
    const k = lockKey(t, mp.viewing), l = mpLockOf(t, mp.viewing);
    if (!mp.held.has(k) && !mp.wantAcquire.has(k) && (!l || !mpLockAlive(l))) { mp.wantAcquire.add(k); mp.again = true; }
  }
  mpSheetMode();
  renderOppIfVisible();
  const ls = mpLockSig();
  if (ls !== mp.lockSig) { mp.lockSig = ls; if ($("s3").classList.contains("on")) renderRoster(); }
}
function mpEnterTeam() {
  mp.base = { team: undefined, units: {} }; mp.seen = {}; mp.held = new Set(); mp.oppPrev = null;
  budget = mpSettings().budget || budget;
  // a brand-new battle (the team has no saved roster yet): start clean right away, so nothing the leader
  // adds before the first sync gets wiped by it
  const t = mpMyTeam(), s = mpSettings();
  if (t && !mp.data["team/" + t]) {
    roster = []; nextUid = 1; locked = false; turn = freshTurn(); snaps = {};
    turn.first = s.first === t ? "you" : "enemy";
    turn.round = turn.first === "enemy" ? 0 : 1;
    turn.phase = turn.first === "enemy" ? "enemy" : "you";
    if (mpAmLeader()) mp.base.team = "";               // the leader's next sync publishes it
  }
}
function mpAnnounceStart(seq, other) {
  mp.startedSeq = seq; mp.prompt = "started"; mp.promptOther = other; mp.promptAt = Date.now();
  clearTimeout(mp._startedT); mp._startedT = setTimeout(() => { if (mp.prompt === "started") { mp.prompt = null; mpRender(); } }, 8000);
}
// sheets open on my team, by anyone but the leader (what a member's device can see holding up the start)
function mpTeamLocksExceptLeader() {
  const t = mpMyTeam(), lead = mp.leaders[t], out = [];
  Object.keys(mp.data).forEach(k => {
    if (!k.startsWith("lock/" + t + "/")) return;
    const l = mp.data[k];
    if (!l || l.pid === lead || !mpLockAlive(l)) return;
    const r = roster.find(x => x.uid === +k.split("/")[2]);
    out.push((l.pid === mp.pid ? "you" : mpNameOf(l.pid)) + (r ? " (" + unitLabel(r.uid) + ")" : ""));
  });
  return out;
}
function mpTurnWatch(prev, cur) {
  if (mp.data.turn) return;                      // the room keeps the official order (cf4+)
  if (!cur || !cur.turn || !cur.locked || !prev || !prev.turn) return;
  if ((cur.turn.ends || 0) > (prev.turn.ends || 0) && cur.turn.phase === "enemy" && locked && turn.phase === "enemy") mp.prompt = "start";
  else if (prev.turn.phase === "enemy" && cur.turn.phase === "you" && locked && turn.phase === "you") mp.prompt = "clash";
}

// ---------- sheet locks ----------
function mpWantSheet(uid) {
  const t = mpMyTeam(), k = lockKey(t, uid);
  [...mp.held].forEach(h => { if (h !== k) mp.wantRelease.add(h); });
  mp.viewing = uid;
  if (!mp.held.has(k)) mp.wantAcquire.add(k);
  mpSheetMode(); mpKick();
}
function mpLeaveSheet() {
  if (mp.viewing == null) return;
  const k = lockKey(mpMyTeam(), mp.viewing);
  mp.viewing = null; mp.wantAcquire.delete(k);
  if (mp.held.has(k)) mp.wantRelease.add(k);
  mpSheetMode(); mpKick();
}
function mpSheetCanEdit() {
  if (!mpTeamMode() || !CUR) return true;
  return mp.held.has(lockKey(mpMyTeam(), CUR.uid));
}
function mpSheetMode() {
  const inc = mp.incoming && mp.incoming.until > Date.now() && CUR && mp.incoming.uid === CUR.uid && $("s4").classList.contains("on") ? mp.incoming : null;
  const ro = !!inc || (mpTeamMode() && CUR && $("s4").classList.contains("on") && !mpSheetCanEdit());
  document.body.classList.toggle("mpro", !!ro);
  let ov = $("mpRO");
  if (!ov) {
    ov = document.createElement("div"); ov.id = "mpRO";
    ov.onclick = e => { e.stopPropagation(); mpToast(ov.dataset.msg || "View only"); };
    $("sheet").appendChild(ov);
  }
  let msg = "";
  if (inc) msg = inc.text;
  else if (ro) {
    const l = mpLockOf(mpMyTeam(), CUR.uid);
    msg = mp.status !== "live" ? "Offline \u2014 view only until the connection is back"
      : l && mpLockAlive(l) && l.pid !== mp.pid ? "\u{1F512} Controlled by " + mpNameOf(l.pid) + " \u2014 view only"
      : "Requesting control\u2026";
  }
  ov.dataset.msg = msg;
  ov.style.display = ro ? "block" : "none";
  let tag = $("mpROtag");
  if (!tag) { tag = document.createElement("div"); tag.id = "mpROtag"; $("sheet").appendChild(tag); }
  tag.textContent = msg; tag.style.display = ro ? "block" : "none";
  tag.classList.toggle("incoming", !!inc);
}

// ---------- session actions ----------
function mpBegin(j) {
  Object.assign(mp, { code: j.code, pid: j.pid, token: j.token, status: "connecting", msg: "", data: {}, etags: {}, seen: {},
    base: { team: undefined, units: {} }, leaders: {}, hostPid: j.host ? j.pid : null, held: new Set(), wantAcquire: new Set(),
    wantRelease: new Set(), afterLock: {}, viewing: null, wantPlayer: { build: APP_BUILD }, wantSettings: null, entered: false, prompt: null, fails: 0 });
  mpStore(); mpRender(); mpStart(); mpConnect();
}
const mpNameInput = () => { const v = ($("mpName") || {}).value || ""; const n = v.trim().slice(0, 18); try { if (n) localStorage.setItem(MP_NAME_KEY, n); } catch (e) {} return n; };
window.mpCreate = async () => {
  const name = mpNameInput();
  if (!name) { mp.msg = "Enter your player name first."; mpRender(); return; }
  mp.msg = "Creating a session\u2026"; mpRender();
  const r = await mpCall({ action: "create", name });
  if (r.status === 200 && r.j.ok) mpBegin(r.j); else { mp.msg = r.j.error || "Couldn't create a session."; mpRender(); }
};
window.mpJoin = async () => {
  const name = mpNameInput();
  if (!name) { mp.msg = "Enter your player name first."; mpRender(); return; }
  const code = (($("mpCode") || {}).value || "").trim().toUpperCase();
  if (!/^[A-Z]{5}$/.test(code)) { mp.msg = "Enter the 5-letter session code."; mpRender(); return; }
  mp.msg = "Joining " + code + "\u2026"; mpRender();
  const r = await mpCall({ action: "join", code, name });
  if (r.status === 200 && r.j.ok) mpBegin(r.j); else { mp.msg = r.j.error || "Couldn't join that session."; mpRender(); }
};
window.mpPickTeam = t => {
  if (mpInBattle() && mpMyTeam()) { mpToast("Teams are fixed once the battle has started."); return; }
  mp.wantPlayer = Object.assign({}, mp.wantPlayer || {}, { team: t, ready: false });
  const me = mpMe(); if (me) { me.team = t; me.ready = false; me.teamAt = mpNow(); }
  mpRender(); mpKick();
};
window.mpReady = () => {
  const me = mpMe(); if (!me || !me.team) { mpToast("Pick a team first."); return; }
  const v = !me.ready;
  mp.wantPlayer = Object.assign({}, mp.wantPlayer || {}, { ready: v });
  me.ready = v; mpRender(); mpKick();
};
window.mpSetSetting = (k, v) => {
  if (!mpIsHost()) return;
  mp.wantSettings = Object.assign({}, mp.wantSettings || {}, { [k]: v });
  mp.data.settings = Object.assign({}, mpSettings(), { [k]: v });
  mpRender(); mpKick();
};
window.mpCustomBudget = () => { const v = parseInt(($("mpBudget") || {}).value, 10); if (v >= 500) mpSetSetting("budget", v); };
window.mpStartBattle = () => {
  const st = mpLobbyState();
  if (!st.canStart) { mpToast(st.why); return; }
  mpSetSetting("phase", "battle");
};
window.mpBackToBattle = () => {
  const t = mpMyTeam();
  if (!t || !mpInBattle()) return;
  hangarGo(() => { mpUseSide(t); if (!mp.entered) { mp.entered = true; mpEnterTeam(); } renderRoster(); show("s3"); }, t);
};
window.mpLeave = (endForAll) => {
  if (mp.code) fetch(SYNC_URL, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "leave", code: mp.code, pid: mp.pid, token: mp.token, endForAll: !!endForAll }) }).catch(() => {});
  mpStop(); mpDisconnect();
  const wasBattle = mp.entered;
  Object.assign(mp, { code: null, pid: null, token: null, status: "off", msg: "You left the session. Your roster on this device is unchanged.",
    data: {}, etags: {}, seen: {}, entered: false, viewing: null, held: new Set(), wantAcquire: new Set(), wantRelease: new Set(), prompt: null });
  mpStore(); mpSheetMode(); mpRender();
  if (wasBattle && $("s3").classList.contains("on")) renderRoster();
};
function mpResume() {
  try {
    const d = JSON.parse(localStorage.getItem(MP_KEY) || "null");
    if (d && d.code && d.pid && d.token) {
      Object.assign(mp, { code: d.code, pid: d.pid, token: d.token, status: "connecting", wantPlayer: { build: APP_BUILD } });
      mpStart(); mpConnect();
    }
  } catch (e) {}
}
window.openMP = () => { renderLobby(); show("s5"); };
window.mpForceTurn = team => {
  if (!mpIsHost()) return;
  if (!confirm("Give the turn to the " + teamName(team) + "?\n\nUse this if the turn order is stuck (for example a device that didn't update).")) return;
  mp.wantForceTurn = { active: team };
  mpKick();
};
window.mpPromptGo = () => { mp.prompt = null; if (mpAmLeader() && locked && turn.phase === "enemy") phaseTap(); mpRender(); };
window.mpPromptX = () => { mp.prompt = null; mpRender(); };

// ---------- guards used by the roster / sheet code ----------
function mpGuardLeader(what) {
  if (!mpTeamMode() || mpAmLeader()) return true;
  mpToast("Only the team leader (\u{1F451} " + mpLeaderName(mpMyTeam()) + ") can " + what + ".");
  return false;
}
function mpOthersEditing() {
  if (!mpTeamMode()) return [];
  const t = mpMyTeam();
  return roster.map(r => ({ r, l: mpLockOf(t, r.uid) })).filter(x => x.l && x.l.pid !== mp.pid && mpLockAlive(x.l))
    .map(x => mpNameOf(x.l.pid) + " (" + unitLabel(x.r.uid) + ")");
}
// a change to ANOTHER unit (shield lending / recall): take that unit's lock for a moment.
// Returns false (and changes nothing) if someone else has that unit open.
function mpForeignCheck(uid) {
  if (!mpTeamMode()) return true;
  const t = mpMyTeam(), k = lockKey(t, uid);
  if (mp.held.has(k)) return true;
  const l = mpLockOf(t, uid);
  if (l && l.pid !== mp.pid && mpLockAlive(l)) { mpToast(mpNameOf(l.pid) + " has " + unitLabel(uid) + " open \u2014 ask them to close it first."); return false; }
  return true;
}
function mpForeign(uid, opTarget, undo, what) {
  if (!mpTeamMode()) return;
  const t = mpMyTeam(), k = lockKey(t, uid);
  if (mp.held.has(k)) return;                           // already ours: the normal sync carries it
  mp.afterLock[k] = () => {                            // runs on the unit's latest state, once the lock is ours
    opTarget(); save();
    if (mp.viewing !== uid) mp.wantRelease.add(k);
    mp.again = true;
    if (CUR && $("s4").classList.contains("on")) { reloadCur(); draw(); }
  };
  mp.afterDeny = mp.afterDeny || {};
  mp.afterDeny[k] = () => { undo(); save(); if (CUR && $("s4").classList.contains("on")) { reloadCur(); draw(); } renderRoster(); mpToast("Someone just opened " + unitLabel(uid) + " \u2014 " + what + " cancelled."); };
  mp.wantAcquire.add(k); mpKick();
}
// ---- who has which sheet open (roster highlight) ----
const MP_PLAYER_COLS = ["#38bdf8", "#f59e0b", "#a78bfa", "#34d399", "#f472b6", "#fb7185", "#22d3ee", "#facc15", "#c084fc", "#4ade80", "#fb923c", "#60a5fa"];
function mpPlayerColour(pid) {
  let h = 0; for (const ch of String(pid)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return MP_PLAYER_COLS[h % MP_PLAYER_COLS.length];
}
function mpControlOf(uid) {
  if (typeof mpTeamMode !== "function" || !mpTeamMode() || !locked) return null;
  const t = mpMyTeam(), k = lockKey(t, uid);
  if (mp.held.has(k) && mp.viewing === uid) return { me: true, name: "You", col: mpPlayerColour(mp.pid) };
  const l = mpLockOf(t, uid);
  if (!l || !mpLockAlive(l) || l.pid === mp.pid) return null;
  return { me: false, name: mpNameOf(l.pid), col: mpPlayerColour(l.pid) };
}
function mpLockSig() {
  const t = mpMyTeam(); if (!t) return "";
  return Object.keys(mp.data).filter(k => k.startsWith("lock/" + t + "/")).sort()
    .map(k => k + ":" + (mp.data[k] && mp.data[k].pid) + ":" + (mpLockAlive(mp.data[k]) ? 1 : 0)).join("|") + "|v" + (mp.viewing ?? "");
}
// ---- deliveries to a unit someone else has open (shield lends / recalls / returns) ----
function mpHeldByOther(uid) {
  if (!mpTeamMode()) return false;
  const t = mpMyTeam(), l = mpLockOf(t, uid);
  return !!(l && l.pid !== mp.pid && mpLockAlive(l) && !mp.held.has(lockKey(t, uid)));
}
function mpSend(toUid, msg, undo) {
  const id = Math.random().toString(36).slice(2, 12).replace(/[^a-z0-9]/g, "a").padEnd(8, "x");
  mp.wantInbox.push({ to: lockKey(mpMyTeam(), toUid), id, msg });
  if (undo) mp.inboxUndo[id] = undo;
  mpKick();
}
function mpNotifyIncoming(uid, text) {
  mp.incoming = { uid, text, until: Date.now() + 1500 };
  if (!(CUR && CUR.uid === uid && $("s4").classList.contains("on"))) mpToast(text);
  mpSheetMode();
  setTimeout(mpSheetMode, 1600);
}
function mpDeliver(key, msg, uid) {
  const t = mpMyTeam();
  const r = roster.find(x => x.uid === uid); if (!r) return;
  if (CUR && CUR.uid === uid && $("s4").classList.contains("on")) persist();
  const st = r.st;
  if (msg.type === "lend" && msg.entry) {
    const e = msg.entry;
    st.lent = (Array.isArray(st.lent) ? st.lent : []).filter(x => !(x.from === e.from && x.slot === e.slot));
    st.lent.push(Object.assign({}, e));
    mpNotifyIncoming(uid, "\u21E3 Receiving " + (e.label || "shield") + " from " + (e.owner || "an ally"));
  } else if (msg.type === "recall") {
    const e = (Array.isArray(st.lent) ? st.lent : []).find(x => x.from === msg.from && x.slot === msg.slot);
    st.lent = (Array.isArray(st.lent) ? st.lent : []).filter(x => !(x.from === msg.from && x.slot === msg.slot));
    if (e) mp.wantInbox.push({ to: lockKey(t, msg.from), id: Math.random().toString(36).slice(2, 12).padEnd(8, "x"),
      msg: { type: "return", slot: msg.slot, cur: e.cur, label: e.label, fromUid: uid } });
    mpNotifyIncoming(uid, "\u21E1 " + ((e && e.label) || "Shield") + " recalled by " + ((e && e.owner) || "its owner"));
  } else if (msg.type === "return") {
    if (Array.isArray(st.sh) && (!Array.isArray(st.out) || st.out[msg.slot] == null)) st.sh[msg.slot] = msg.cur;
    mpNotifyIncoming(uid, "\u21E3 " + (msg.label || "Shield") + " is back (" + msg.cur + " HP)");
  }
  snaps[uid] = snapOf(r);
  if (CUR && CUR.uid === uid && $("s4").classList.contains("on")) { reloadCur(); draw(); }
  save();
}
function mpDeliveries() {
  const t = mpMyTeam(); if (!t) return false;
  const pre = "inbox/" + t + "/";
  const msgs = Object.keys(mp.data).filter(k => k.startsWith(pre) && mp.data[k])
    .sort((a, b) => (mp.data[a].at || 0) - (mp.data[b].at || 0));
  let changed = false;
  const needRelease = new Set();
  msgs.forEach(k => {
    const uid = +k.split("/")[2], lk = lockKey(t, uid), msg = mp.data[k];
    if (mp.held.has(lk)) {
      if (!mp.delivered.has(k)) { mpDeliver(k, msg, uid); mp.delivered.add(k); changed = true; }
      mp.wantConsume.add(k);
      if (mp.viewing !== uid && !mp.afterLock[lk]) needRelease.add(lk);
      return;
    }
    const l = mpLockOf(t, uid);
    if (l && mpLockAlive(l)) return;                    // the holder's device will take it in
    // nobody has the unit open: the sender (or the leader, if the sender is gone) collects it
    const senderHere = msg.byPid && mp.data["player/" + msg.byPid] && mpNow() - (mp.data["player/" + msg.byPid].seen || 0) < MP_LOCK_STALE;
    const mine = msg.byPid === mp.pid || (!senderHere && mpAmLeader());
    if (mine && !mp.wantAcquire.has(lk)) { mp.wantAcquire.add(lk); mp.quiet = mp.quiet || new Set(); mp.quiet.add(lk); mp.again = true; }
  });
  needRelease.forEach(lk => mp.wantRelease.add(lk));
  if (needRelease.size) mp.again = true;
  return changed;
}
// tick a unit done from the roster: needs that unit's lock for a moment
function mpQuickDone(uid, v) {
  const t = mpMyTeam(), k = lockKey(t, uid);
  if (mp.held.has(k)) { setDone(uid, v); renderRoster(); return; }
  const l = mpLockOf(t, uid);
  if (l && l.pid !== mp.pid && mpLockAlive(l)) { mpToast(mpNameOf(l.pid) + " has " + unitLabel(uid) + " open."); return; }
  mp.afterLock[k] = () => { setDone(uid, v); renderRoster(); if (mp.viewing !== uid) mp.wantRelease.add(k); mp.again = true; };
  mp.wantAcquire.add(k); mpKick();
}

// ---------- lobby screen ----------
function mpLobbyState() {
  const ps = mpPlayers(), now = mpNow();
  const act = Object.entries(ps).filter(([, p]) => now - (p.seen || 0) < 90000);
  const on = t => act.filter(([, p]) => p.team === t);
  const unassigned = act.filter(([, p]) => !p.team);
  const notReady = act.filter(([, p]) => p.team && !p.ready);
  const s = mpSettings();
  let why = "";
  if (!on("federation").length || !on("spacenoid").length) why = "Both teams need at least one player.";
  else if (notReady.length) why = "Waiting for " + notReady.map(([, p]) => p.name).join(", ") + " to be ready.";
  else if (!s.first) why = "Choose who goes first.";
  return { act, on, unassigned, notReady, why, canStart: !why };
}
function setLobbyHTML(box, html) {            // only touch the page when something actually changed
  if (box.__html === html) return;
  box.__html = html; box.innerHTML = html;
}
function renderLobby() {
  const box = $("mpLobby"); if (!box) return;
  mpLobbyTheme();
  const nameVal = (() => { try { return localStorage.getItem(MP_NAME_KEY) || ""; } catch (e) { return ""; } })();
  const msg = mp.msg ? '<p class="mpmsg">' + mp.msg + '</p>' : '';
  if (!mp.code) {
    box.classList.remove("lb2wrap"); $("s5").classList.remove("lb2on");
    setLobbyHTML(box,
      '<div class="lb-head"><div class="cwstep">MULTIPLAYER</div><h1>Battle Session</h1>' +
      '<p class="bp-sub">Everyone uses their own device. Create a session, share the code, and pick teams together.</p></div>' +
      '<div class="lb-start">' +
        '<label class="bp-cbox lb-name"><span class="bp-cl">NAME</span><input id="mpName" maxlength="18" placeholder="Your name" value="' + nameVal.replace(/"/g, "&quot;") + '"></label>' +
        '<button class="btn pri mpbig" onclick="mpCreate()">Create session</button>' +
        '<div class="mpor">or join one</div>' +
        '<div class="mpjoin"><input id="mpCode" maxlength="5" autocapitalize="characters" autocomplete="off" spellcheck="false" placeholder="CODE">' +
        '<button class="btn" onclick="mpJoin()">Join</button></div>' + msg +
      '</div>' +
      '<div class="bp-foot"><button class="btn" onclick="hangarGo(() => show(\'s0\'))">&larr; Main menu</button></div>');
    const c = $("mpCode"); if (c) c.addEventListener("input", () => { c.value = c.value.toUpperCase().replace(/[^A-Z]/g, ""); });
    return;
  }
  const s = mpSettings(), st = mpLobbyState(), me = mpMe(), battle = s.phase === "battle";
  const col = t => {
    const list = st.on(t).sort((a, b) => (a[1].teamAt || 0) - (b[1].teamAt || 0));
    const cls = t === "federation" ? "fed" : "spa", mineT = me && me.team === t;
    const emb = document.querySelector(t === "federation" ? "#fcFed .fc-emb" : "#fcSpa .fc-emb");
    const canPick = !mineT && (!battle || (me && !me.team));
    const lead = mp.leaders[t] && mp.data["player/" + mp.leaders[t]];
    return '<div class="lb-team ' + cls + (mineT ? " mine" : "") + (mineT && mp.lockUntil > Date.now() ? " lockon" : "") + '">' +
      '<div class="fcard lb-card ' + cls + (mineT ? ' sel' : '') + (canPick ? '' : ' nopick') + '"' + (canPick ? ' onclick="mpPickTeam(\'' + t + '\')"' : '') + '>' +
        '<div class="fc-in">' + (emb ? emb.outerHTML : '') +
          '<div class="fc-txt"><b>' + (t === "federation" ? "FEDERATION" : "SPACENOIDS") + '</b>' +
            '<small>' + (t === "federation" ? "UNITY <i>/</i> PEACE <i>/</i> PROGRESS" : "INDEPENDENCE <i>/</i> POWER <i>/</i> VICTORY") + '</small>' +
            '<em>' + list.length + ' PLAYER' + (list.length === 1 ? '' : 'S') + (lead ? ' \u00b7 \u{1F451} ' + lead.name.toUpperCase() : '') + '</em></div>' +
          '<span class="fc-sel">YOUR TEAM</span>' +
          (canPick ? '<span class="lb-tap">TAP TO JOIN</span>' : '') +
        '</div></div>' +
      '<div class="lb-list">' + (list.length ? list.map(([pid, p]) =>
        '<div class="lb-p' + (pid === mp.pid ? ' me' : '') + '">' +
          '<span class="lb-n">' + (mp.leaders[t] === pid ? '<i title="Team leader">\u{1F451}</i>' : '') + p.name + (pid === mp.pid ? ' <em>(you)</em>' : '') + '</span>' +
          (pid === mp.hostPid ? '<span class="lb-tag">HOST</span>' : '') +
          (me && me.team === t && mp.leaders[t] === mp.pid && pid !== mp.pid ? '<button class="linkbtn lb-mklead" onclick="event.stopPropagation();mpMakeLead(\'' + pid + '\')">\u{1F451} make leader</button>' : '') +
          '<span class="lb-build' + (p.build === APP_BUILD ? '' : ' bad') + '">' + (p.build || "old") + '</span>' +
          (battle ? '' : '<span class="lb-ready' + (p.ready ? ' on' : '') + '">' + (p.ready ? '\u2713 READY' : 'NOT READY') + '</span>') +
        '</div>').join("") : '<div class="lb-empty">No players yet</div>') + '</div>' +
      (!battle && (!me || me.team !== t) ? '<button class="btn lb-join" onclick="mpPickTeam(\'' + t + '\')">Join ' + teamName(t) + '</button>' : '') +
      (battle && me && !me.team ? '<button class="btn lb-join" onclick="mpPickTeam(\'' + t + '\')">Join this team</button>' : '') +
    '</div>';
  };
  const builds = [...new Set(st.act.map(([, p]) => p.build || "old"))];
  const buildWarn = builds.length > 1 ? '<div class="lb-un">\u26A0 Devices are on different builds (' + builds.join(", ") + '). Everyone should close and reopen the app so all show build ' + APP_BUILD + '.</div>' : '';
  const unassigned = buildWarn + (st.unassigned.length ? '<div class="lb-un">Not on a team yet: ' + st.unassigned.map(([, p]) => p.name).join(", ") + '</div>' : '');
  let controls = "";
  if (!battle) {
    const mine = me && me.team;
    controls += '<div class="lb-me">' +
      (mine ? '<button class="btn ' + (me.ready ? 'ready' : 'pri') + ' mpbig" onclick="mpReady()">' + (me.ready ? '\u2713 Ready \u2014 tap to change' : 'I\'m ready') + '</button>'
            : '<p class="cws">Pick a team to join. You can swap until you tap Ready.</p>') + '</div>';
    if (mpIsHost()) {
      controls += '<div class="lb-host"><div class="lb-hh">HOST SETTINGS</div>' +
        '<div class="lb-row"><span>Deployment points</span><div class="lb-chips">' +
          PRESETS.map(p => '<span class="chip' + (s.budget === p ? ' on' : '') + '" onclick="mpSetSetting(\'budget\',' + p + ')">' + (s.budget === p ? '\u2713 ' : '') + p.toLocaleString() + '</span>').join("") +
          '<input id="mpBudget" type="number" min="500" step="100" placeholder="Custom" value="' + (PRESETS.indexOf(s.budget) < 0 ? s.budget : "") + '"><button class="btn sm" onclick="mpCustomBudget()">Set</button>' +
        '</div></div>' +
        '<div class="lb-row"><span>Who goes first?</span><div class="lb-chips">' +
          TEAMS2.map(t => '<span class="chip' + (s.first === t ? ' on' : '') + '" onclick="mpSetSetting(\'first\',\'' + t + '\')">' + (s.first === t ? '\u2713 ' : '') + teamName(t) + '</span>').join("") +
        '</div></div>' +
        '<button class="btn pri mpbig' + (st.canStart ? ' ready' : '') + '" onclick="mpStartBattle()">Start battle \u25B8</button>' +
        (st.canStart ? '' : '<p class="mpmsg">' + st.why + '</p>') + '</div>';
    } else {
      controls += '<div class="lb-host"><div class="lb-hh">SET BY THE HOST</div>' +
        '<p class="lb-set">Deployment points: <b>' + (s.budget || 0).toLocaleString() + '</b> \u00b7 First turn: <b>' + (s.first ? teamName(s.first) : 'not chosen yet') + '</b></p>' +
        '<p class="cws">' + (st.canStart ? 'Waiting for the host to start the battle\u2026' : st.why) + '</p></div>';
    }
  } else {
    controls += '<div class="lb-host"><div class="lb-hh">BATTLE IN PROGRESS</div>' +
      '<p class="lb-set">Deployment points: <b>' + (s.budget || 0).toLocaleString() + '</b> \u00b7 First turn: <b>' + teamName(s.first) + '</b></p>' +
      (me && me.team ? '<button class="btn pri mpbig" onclick="mpBackToBattle()">Go to my team \u25B8</button>' : '<p class="cws">Pick a team above to join the battle.</p>') + '</div>';
  }
  const status = mp.status === "live" ? "" : '<p class="mpstatus ' + mp.status + '">' + (mp.status === "retrying" ? "Connection trouble \u2014 retrying" : mp.status === "ended" ? "Session ended" : mp.status === "error" ? "Session error" : "Connecting\u2026") + '</p>';
  box.classList.add("lb2wrap"); $("s5").classList.add("lb2on");
  setLobbyHTML(box,
    '<div class="lb2-top"><div class="cwstep">SESSION</div>' +
      '<div class="mpcode">' + mp.code.split("").map(c => '<span>' + c + '</span>').join("") + '</div>' +
      '<p class="bp-sub">Share this code \u2014 everyone joins with it and picks a side.</p>' + status + msg + '</div>' +
    '<div class="lb2-sides' + (me && me.team ? ' picked' : '') + '">' + col("federation") + '<div class="lb2-mid" aria-hidden="true"><div class="lb2-vs"><span class="vs-f">' + st.on("federation").length + '</span><b>VS</b><span class="vs-s">' + st.on("spacenoid").length + '</span></div></div>' + col("spacenoid") + '</div>' +
    '<div class="lb2-dock">' + unassigned + '<div class="lb2-ctl">' + controls + '</div>' +
    '<div class="bp-foot lb-foot">' +
      '<button class="btn" onclick="hangarGo(() => show(\'s0\'))">&larr; Main menu</button>' +
      (mpIsHost() ? '<button class="btn enemyturn" onclick="if (confirm(\'End the session for everyone?\')) mpLeave(true)">End session</button>'
                  : '<button class="btn" onclick="if (confirm(\'Leave this session? Your roster on this device stays as it is.\')) mpLeave(false)">Leave session</button>') +
    '</div></div>');
  const myT = (me && me.team) || null;
  if (typeof lbAlarm === "function") lbAlarm(!battle && st.canStart);
  if (mp.fxTeam !== undefined && myT && myT !== mp.fxTeam && !battle) lobbyTeamFx(myT);
  mp.fxTeam = myT;
}
// the "you joined this side" moment: light sweep from that side, name slam, panel lock-on
function lobbyTeamFx(t) {
  const cls = t === "federation" ? "fed" : "spa";
  mp.lockUntil = Date.now() + 800;                  // kept through the redraws that follow a pick
  const panel = document.querySelector("#mpLobby .lb-team." + cls);
  if (panel) { panel.classList.remove("lockon"); void panel.offsetWidth; panel.classList.add("lockon"); }
  let fx = $("teamFx");
  if (!fx) { fx = document.createElement("div"); fx.id = "teamFx"; fx.setAttribute("aria-hidden", "true"); document.body.appendChild(fx); }
  fx.className = "";
  fx.innerHTML = '<div class="tf-sweep"></div><div class="tf-band"><b>' + (t === "federation" ? "FEDERATION" : "SPACENOIDS") + '</b><span>SIDE JOINED \u2014 WELCOME, PILOT</span></div>';
  void fx.offsetWidth;
  fx.className = "on " + cls;
  clearTimeout(fx._t); fx._t = setTimeout(() => { fx.className = ""; }, 1900);
  if (typeof lbPower === "function") lbPower(t);
}

// ---------- rendering on the roster / sheet ----------
function mpRender() {
  if (typeof renderFF === "function") try { renderFF(); } catch (e) { console.error(e); }
  const chip = $("mpChip");
  if (chip) {
    const st = !mp.code ? "off" : mp.status;
    chip.className = "mpchip " + st;
    const me = mpMe();
    chip.innerHTML = !mp.code ? "&#8644; MP" : '<i></i>' + mp.code + (me && me.name ? " \u00b7 " + me.name : "") +
      (mpTeamMode() && mpAmLeader() ? " \u{1F451}" : "") + " \u00b7 " + (st === "live" ? "LIVE" : st === "retrying" ? "RETRYING" : st === "ended" ? "ENDED" : st === "error" ? "ERROR" : "CONNECTING");
  }
  updateLandingOnline();
  if (mp.prompt === "budgetOk" && (!mpTeamMode() || locked)) mp.prompt = null;
  if (mp.prompt === "start" && !(mpTeamMode() && locked && turn.phase === "enemy")) mp.prompt = null;
  if (mp.prompt === "startwait" && !(mpTeamMode() && locked && turn.phase === "enemy")) mp.prompt = null;
  if (mp.prompt === "started" && (!mpTeamMode() || turn.phase !== "you")) mp.prompt = null;
  if (mp.prompt === "clash" && !(mpTeamMode() && locked && turn.phase === "you")) mp.prompt = null;
  const pr = $("mpPrompt");
  if (pr) {
    const lead = mpAmLeader();
    setHTMLIfChanged(pr, !mp.prompt || !mpTeamMode() ? ""
      : mp.prompt === "budgetOk" ? '<div class="mpprompt"><b>\u2713 The host raised the limit to ' + (mp.promptAmount || 0).toLocaleString() + ' DP.</b>' +
          '<button class="btn sm pri ready" onclick="mp.prompt=null;tryConfirm()">Confirm team \u25B8</button><button class="btn sm" onclick="mpPromptX()">Later</button></div>'
      : mp.prompt === "budgetNo" ? '<div class="mpprompt warn"><b>\u2715 The host declined ' + (mp.promptAmount || 0).toLocaleString() + ' DP.</b><span>Edit your team to fit ' + (budget || 0).toLocaleString() + ' DP.</span><button class="btn sm" onclick="mpPromptX()">OK</button></div>'
      : mp.prompt === "started"
      ? '<div class="mpprompt go started"><b>\u21C4 The ' + (mp.promptOther || "other team") + ' ended their turn.</b><span>Your turn has started \u2014 go!</span>' +
        '<button class="linkbtn" onclick="mpPromptX()" title="Hide this message">\u2715</button></div>'
      : mp.prompt === "startwait"
      ? '<div class="mpprompt warn"><b>\u21C4 The ' + (mp.promptOther || "other team") + ' ended their turn.</b><span>' +
        ((mp.promptBusy || []).length ? 'Your turn starts as soon as ' + mp.promptBusy.join(", ") + ' close' + (mp.promptBusy.length === 1 && mp.promptBusy[0].indexOf("you") !== 0 ? 's' : '') + ' the open sheet' + (mp.promptBusy.length > 1 ? 's' : '') + '.'
          : 'Starting your turn\u2026') + '</span></div>'
      : mp.prompt === "start"
      ? '<div class="mpprompt go"><b>\u21C4 The ' + teamName(otherTeam(mpMyTeam())) + ' ended their turn.</b>' +
        (lead ? '<span>Start your turn with the green button below.</span>'
              : '<span>Waiting for \u{1F451} ' + mpLeaderName(mpMyTeam()) + ' to start your turn.</span>') +
        '<button class="linkbtn" onclick="mpPromptX()" title="Hide this message">\u2715</button></div>'
      : '<div class="mpprompt warn"><b>\u26A0 Both teams say it\'s their turn.</b><span>Agree who is playing; that team\'s leader ends their turn.</span><button class="btn sm" onclick="mpPromptX()">OK</button></div>');
  }
  if ($("s5") && $("s5").classList.contains("on")) {
    mpLobbyTheme();
    const f = document.activeElement;
    if (!(f && (f.id === "mpName" || f.id === "mpCode" || f.id === "mpBudget"))) renderLobby();
  }
  renderOppIfVisible();
  mpSheetMode();
}
function renderOppIfVisible() { if ($("s3") && $("s3").classList.contains("on")) renderOpp(); }
const HEALTH_WORD = p => p <= 0 ? "Destroyed" : p <= .34 ? "Critical" : p <= .67 ? "Damaged" : "Healthy";
const HEALTH_COL = p => p <= 0 ? "#7f1d1d" : p <= .34 ? "#ef4444" : p <= .67 ? "#f59e0b" : "#22c55e";
function renderOpp() {
  const box = $("oppBox"); if (!box) return;
  const t = mpMyTeam();
  if (!mpTeamMode()) { if (box.firstChild) { box.innerHTML = ""; box.__html = ""; } return; }
  const ot = otherTeam(t), td = mp.data["team/" + ot];
  const cls = ot === "federation" ? "opp-fed" : "opp-spa";
  const members = Object.values(mpPlayers()).filter(p => p.team === ot).map(p => p.name);
  let h = '<div class="grouphdr opphdr ' + cls + '">Enemy \u2014 ' + teamName(ot) +
    (td ? ' \u00b7 ' + (td.roster || []).length + ' model(s)' + (td.locked ? ' \u00b7 turn ' + (td.turn.round || "\u2014") + ' \u00b7 ' + (td.turn.phase === "you" ? '<span class="opp-act">their turn</span>' : 'waiting') : ' \u00b7 <span class="opp-wait">still building</span>') : '') +
    (members.length ? ' <span class="opp-ago">' + members.join(", ") + '</span>' : '') + '</div>';
  if (!td) { setHTMLIfChanged(box, h + '<div class="empty">The other team hasn\'t started building yet.</div>'); return; }
  h += '<div class="list oppList ' + cls + '">';
  const counts = {}; (td.roster || []).forEach(x => counts[x.id] = (counts[x.id] || 0) + 1);
  const seen = {};
  const tdShown = (td.roster || []).filter(x => unitTab(unitById(x.id)) === rosterTab);
  const oppAboard = new Set();
  (td.roster || []).forEach(x => { if (isShip(unitById(x.id))) { const d = mp.data["unit/" + ot + "/" + x.uid]; ((d && d.st && d.st.ship && d.st.ship.carry) || []).forEach(v => oppAboard.add(v)); } });
  if (!tdShown.length) { setHTMLIfChanged(box, h + '</div><div class="empty">' + (rosterTab === "ground" ? "No ground units yet." : "No enemy " + (rosterTab === "ships" ? "warships" : "mobile suits") + ".") + '</div>'); return; }
  (td.roster || []).forEach(x => { if (unitTab(unitById(x.id)) !== rosterTab) seen[x.id] = (seen[x.id] || 0) + 1; });
  tdShown.forEach(x => {
    const u = unitById(x.id); if (!u) return;
    seen[x.id] = (seen[x.id] || 0) + 1;
    const ud = mp.data["unit/" + ot + "/" + x.uid];
    const hpNow = ud && ud.st && ud.st.hp ? ud.st.hp : u.limb;
    const kl = u.kill || "chest", pct = hpNow[kl] / u.limb[kl];
    const dn = td.locked && td.turn && td.turn.phase === "you" && ud && ud.done === td.turn.round + ":you";
    const label = (u.short || u.name) + (counts[x.id] > 1 ? " #" + seen[x.id] : "");
    h += '<div class="row opprow ' + cls + (pct <= 0 ? ' dead' : '') + (oppAboard.has(x.uid) ? ' car-aboard' : '') + '" onclick="oppDetail(' + x.uid + ')">' +
      (dn ? '<span class="tick on" title="Done this turn">\u2713</span>' : '') +
      '<span class="opphp" style="background:' + HEALTH_COL(pct) + '"></span>' +
      portraitHTML(u).replace('</span>', markPipHTML(x) + '</span>') +
      '<span style="min-width:0"><div class="nm">' +
        (ud && ud.st && pct > 0 && objHeld(ud.st) ? objTagHTML(objHeld(ud.st).name) : '') +
        (ffForUid(x.uid, t) ? ffTagHTML(ffForUid(x.uid, t), x.uid, t) : '') +
        label + (oppAboard.has(x.uid) ? ' <span class="cartag aboard">\u2693 ABOARD</span>' : '') +
        (ud && ud.st ? ' ' + stanceTagHTML(stanceNow({ id: x.id, st: ud.st })) : '') + '</div><div class="tr"><b style="color:' + HEALTH_COL(pct) + '">' + HEALTH_WORD(pct) + '</b> \u00b7 ' + u.tier + '</div></span>' +
      '<span class="dp">' + u.dp.toLocaleString() + '</span></div>';
  });
  if (setHTMLIfChanged(box, h + '</div>')) splitColumns();
}
window.oppDetail = uid => {
  const ot = otherTeam(mpMyTeam()), td = mp.data["team/" + ot]; if (!td) return;
  const x = (td.roster || []).find(y => y.uid === uid); if (!x) return;
  const u = unitById(x.id), ud = mp.data["unit/" + ot + "/" + uid], st = (ud && ud.st) || {};
  const hpNow = st.hp || u.limb;
  if (isGround(u)) {
    const G = st.gv || gvFresh(u).gv, hpv = (st.hp || {}).hp ?? u.hp, p = hpv / u.hp;
    let rows2 = '<div class="od-row"><span class="od-dot" style="background:' + HEALTH_COL(p) + '"></span><span>HP</span><b style="color:' + HEALTH_COL(p) + '">' + HEALTH_WORD(p) + '</b></div>';
    if (u.armor) { const pa = G.armor / u.armor; rows2 += '<div class="od-row"><span class="od-dot" style="background:' + HEALTH_COL(pa) + '"></span><span>Armor (ground battle)</span><b style="color:' + HEALTH_COL(pa) + '">' + (pa <= 0 ? "Stripped" : HEALTH_WORD(pa)) + '</b></div>'; }
    { const sk = stanceOf(st); if (sk) rows2 += '<div class="od-row"><span></span><span>Stance</span><b>' + STANCES[sk].name + '</b></div>'; }
    $("popT").textContent = "Enemy \u2014 " + u.short; $("popK").textContent = teamName(ot) + " \u00b7 " + u.cls;
    $("popS").innerHTML = ""; $("popB").innerHTML = '<div class="oppdetail">' + rows2 + '</div><p class="cws" style="margin-top:8px">Exact numbers are hidden for enemy units.</p>';
    $("pop").classList.add("on");
    return;
  }
  if (isShip(u)) {
    const S = st.ship || shipFresh(u).ship, sst = { hp: { hull: (st.hp || {}).hull ?? u.hull }, ship: S };
    const parts = ["hull", "bridge", "thr0", "thr1"].concat(u.sw.map(w => w.key));
    let rows2 = parts.map(k => { const [v, m] = shipPartGet(u, sst, k), p = v / m;
      return '<div class="od-row"><span class="od-dot" style="background:' + HEALTH_COL(p) + '"></span><span>' + shipPartLabel(u, k) + '</span><b style="color:' + HEALTH_COL(p) + '">' + (p <= 0 && k !== "hull" ? "Offline" : HEALTH_WORD(p)) + '</b></div>'; }).join("");
    if (td.locked && td.turn && td.turn.phase === "you") rows2 += '<div class="od-row"><span></span><span>This turn</span><b>' + (ud && ud.done === td.turn.round + ":you" ? "\u2713 Done" : "Not done yet") + '</b></div>';
    $("popT").textContent = "Enemy \u2014 " + u.short; $("popK").textContent = teamName(ot) + " \u00b7 warship";
    $("popS").innerHTML = ""; $("popB").innerHTML = '<div class="oppdetail">' + rows2 + '</div><p class="cws" style="margin-top:8px">Exact numbers are hidden for enemy units.</p>';
    $("pop").classList.add("on");
    return;
  }
  let rows = LIMB_ORDER.map(k => { const p = hpNow[k] / u.limb[k];
    return '<div class="od-row"><span class="od-dot" style="background:' + HEALTH_COL(p) + '"></span><span>' + LIMB_LABEL[k] + (k === (u.kill || "chest") ? ' <em>(kill location)</em>' : '') + '</span><b style="color:' + HEALTH_COL(p) + '">' + HEALTH_WORD(p) + '</b></div>'; }).join("");
  if (st.sh && st.sh.length) rows += '<div class="od-row"><span class="od-dot" style="background:' + (st.sh.some(v => v > 0) ? "#38bdf8" : "#64748b") + '"></span><span>Shields</span><b>' + (st.sh.every(v => v > 0) ? "Up" : st.sh.some(v => v > 0) ? "Partly down" : "Down") + '</b></div>';
  if (td.locked && td.turn && td.turn.phase === "you") rows += '<div class="od-row"><span></span><span>This turn</span><b>' + (ud && ud.done === td.turn.round + ":you" ? "\u2713 Done" : "Not done yet") + '</b></div>';
  $("popT").textContent = "Enemy \u2014 " + (u.short || u.name); $("popK").textContent = teamName(ot);
  $("popS").innerHTML = ""; $("popB").innerHTML = '<div class="oppdetail">' + rows + '</div><p class="cws" style="margin-top:8px">Exact numbers are hidden for enemy units.</p>';
  $("pop").classList.add("on");
};
setInterval(() => { if (mp.code && $("s5") && $("s5").classList.contains("on")) mpRender(); }, 5000);

// replace an element's contents only when they actually changed (a redraw restarts the row animations)
function setHTMLIfChanged(el, html) {
  if (el.__html === html && el.__first === el.firstChild && el.firstChild) return false;
  el.innerHTML = html; el.__html = html; el.__first = el.firstChild;
  return true;
}
function renderRoster() { renderRosterCore(); renderOpp(); splitColumns(); mpRender(); }
// ---------- roster tabs: Mobile suits · Ships · Ground units ----------
const unitTab = u => !u ? "suits" : u.type === "warship" ? "ships" : u.type === "ground" ? "ground" : "suits";
let rosterTab = (() => { try { const t = localStorage.getItem("msb.tab"); return ["suits", "ships", "ground"].includes(t) ? t : "suits"; } catch (e) { return "suits"; } })();
window.setRosterTab = t => {
  if (rosterTab === t) return;
  rosterTab = t;
  try { localStorage.setItem("msb.tab", t); } catch (e) {}
  renderRoster();
};
const TAB_ICON = {
  suits: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M12 3h8l1.5 4H10.5z M9 9h14l2 7-3 2v4h-4l-1 7h-2l-1-7h-4v-4l-3-2z M5 11l3-1-1 9-3 1z M27 11l-3-1 1 9 3 1z" fill="currentColor"/></svg>',
  ships: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M2 19l7-3h9l3-5h4l1 5 4 1-2 3H9z M11 14h5l1-3h-4z M4 23h22l-2 2H6z" fill="currentColor"/></svg>',
  ground: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M8 12h11l2 3h8v2H21l-1 1H6l-2-3z M3 19h24l-2 5H6z M8 21.5a1.2 1.2 0 1 0 0 .1z" fill="currentColor"/></svg>',
};
function renderTabs() {
  const box = $("rosterTabs"); if (!box) return;
  const count = t => roster.filter(r => unitTab(unitById(r.id)) === t).length;
  const tab = (t, label, extra) => '<button class="rtab ' + t + (rosterTab === t ? ' on' : '') + '" onclick="setRosterTab(\'' + t + '\')">' +
    TAB_ICON[t] + '<span>' + label + '</span>' + (extra || '<b>' + count(t) + '</b>') + '</button>';
  setHTMLIfChanged(box, tab("suits", "Mobile suits") + tab("ships", "Ships") + tab("ground", "Ground units"));
}
function groundNoticeHTML() {
  return '<div class="uc"><div class="uc-stripes"></div><div class="uc-body">' +
    '<div class="uc-icon">\u26A0</div><h3>Under construction</h3>' +
    '<p>Ground units \u2014 infantry squads, vehicles, tanks and transports \u2014 are coming in a future update.</p>' +
    '</div><div class="uc-stripes"></div></div>';
}
function shipCardsHTML() {
  const ships = UNITS.filter(u => u.type === "warship" && u.faction === side).sort((a, b) => a.dp - b.dp);
  if (!ships.length) return '<div class="empty">No warships for this side yet.</div>';
  const fac = side === "federation" ? "fed" : "spa";
  return '<div class="shipgrid">' + ships.map(u => {
    const n = countOf(u.id);
    const cls = u.name.replace(u.short + "-class ", "").replace(u.short, "").trim();
    const stat = (k, v) => '<div class="sc-st"><small>' + k + '</small><b>' + v + '</b></div>';
    return '<div class="shipcard ' + fac + (n ? ' has' : '') + '" onclick="addUnit(\'' + u.id + '\');promptMarks(\'' + u.id + '\')">' +
      '<div class="sc-grid"></div><div class="sc-glow"></div>' +
      '<div class="sc-art"><img src="img/portraits/' + u.portrait + '.webp" alt="" loading="lazy" decoding="async"></div>' +
      '<div class="sc-info">' +
        '<div class="sc-class">' + cls + ' \u00b7 ' + (u.faction === "federation" ? "Earth Federation" : "Spacenoid forces") + '</div>' +
        '<div class="sc-name">' + u.short + '</div>' +
        '<div class="sc-stats">' + stat("Hull", u.hull) + stat("AP", u.ap) + stat("Move", u.moveCm + "cm") + stat("Hangar", u.hangar) + stat("Crew", u.crew) + '</div>' +
        '<div class="sc-weap">' + u.sw.map(w => '<span>' + (w.label || w.name) + '</span>').join("") + (u.decoy ? '<span class="ab">Decoy Balloons</span>' : '') + (u.base ? '<span class="ab">Base T' + u.base + '</span>' : '') + '</div>' +
      '</div>' +
      '<div class="sc-foot">' +
        '<div class="sc-dp">' + u.dp.toLocaleString() + '<small>DP</small></div>' +
        (n ? '<div class="sc-qty">\u00d7' + n + ' in force</div>' : '') +
        '<div class="sc-add">+ Add to force</div>' +
      '</div></div>';
  }).join("") + '</div>' +
  '<p class="shipnote">Warships are bought with DP like mobile suits. Their crew never leave the ship, and a carrier must be loaded to capacity before anything else deploys.</p>';
}
function renderRosterCore() {
  document.body.classList.toggle("locked", locked);
  renderTurn();
  const used = spent(), left = budget - used, over = used > budget;
  $("tally").innerHTML =
    '<span class="' + (over ? "over" : "") + '"><b>' + used.toLocaleString() + '</b> / ' + budget.toLocaleString() + ' DP</span>' +
    '<br><span style="color:' + (over ? "#fca5a5" : "var(--muted)") + '">' +
    (over ? (used - budget).toLocaleString() + " over budget" : left.toLocaleString() + " remaining") + '</span>';

  $("btnBudget").style.display = locked ? "none" : "";
  $("btnClear").style.display  = locked ? "none" : "";
  $("btnConfirm").style.display = (!locked && roster.length) ? "" : "none";
  $("btnConfirm").classList.toggle("ready", !locked && roster.length > 0 && !over);   // glows until the team is confirmed
  $("btnConfirm").classList.toggle("overb", !locked && roster.length > 0 && over);    // amber while over budget
  $("btnEdit").style.display   = locked ? "" : "none";
  const mpT = mpTeamMode(), mpL = mpAmLeader();
  if (mpT) {
    $("btnBudget").style.display = "none";
    if (!mpL) ["btnClear", "btnConfirm", "btnEdit"].forEach(b => $(b).style.display = "none");
  }

  const box = $("rosterBox");
  renderTabs();
  const shownRoster = roster.filter(r => unitTab(unitById(r.id)) === rosterTab);
  const tabNoun = rosterTab === "ships" ? "ship(s)" : rosterTab === "ground" ? "ground unit(s)" : "mobile suit(s)";
  if (roster.length && !shownRoster.length) {
    setHTMLIfChanged(box, '<div class="grouphdr">' + (locked ? "Deployed force" : "Your roster") + ' \u2014 no ' + tabNoun.replace("(s)", "s") + '</div><div class="empty">' +
      (locked ? 'No ' + (rosterTab === "ships" ? "warships" : rosterTab === "ground" ? "ground units" : "mobile suits") + ' in this force.'
              : rosterTab === "ships" ? 'No warships yet \u2014 pick one below.' : rosterTab === "ground" ? 'No ground units yet \u2014 pick some below. They cost no DP.' : 'No mobile suits yet \u2014 pick one below.') + '</div>');
  } else if (!roster.length) {
    setHTMLIfChanged(box, '<div class="grouphdr">Your roster</div><div class="empty">' + (mpTeamMode() && !mpAmLeader()
      ? 'Your team leader \u{1F451} ' + mpLeaderName(mpMyTeam()) + ' is picking the roster \u2014 it will appear here as they build it.'
      : 'Nothing selected yet \u2014 tap a unit below to add it.') + '</div>');
  } else {
    let s = '<div class="grouphdr">' + (locked ? "Deployed force" : "Your roster") + ' \u2014 ' + shownRoster.length + ' ' + tabNoun +
      (shownRoster.length !== roster.length ? ' <span class="tabtot">\u00b7 ' + roster.length + ' in total</span>' : '') +
      (locked ? '' : mpT && mp.budgetAsk ? ' <span class="unconf">\u23F3 waiting for the host to answer your ' + mp.budgetAsk.amount.toLocaleString() + ' DP request</span>'
        : mpT && !mpL ? ' <span class="unconf">\u{1F451} ' + mpLeaderName(mpMyTeam()) + ' is building the roster</span>'
                                 : ' <span class="unconf">\u26A0 not confirmed \u2014 tap Confirm team to play</span>') + '</div><div class="list">';
    shownRoster.forEach(r => {
      const u = unitById(r.id), n = countOf(r.id), idx = copyIndex(r);
      const kl = u.kill || "chest";
      const tot = u.limb[kl], now = r.st.hp[kl];
      const dead = now === 0, pct = now / tot;
      const col = dead ? "#7f1d1d" : pct <= .34 ? "#ef4444" : pct <= .67 ? "#f59e0b" : "#22c55e";
      const cst = locked ? carrierState(r.uid) : null, away = cst && cst.state !== "launched";
      const showTick = locked && !dead && !away;
      const dn = showTick && isDone(r.uid);
      const ctl = mpControlOf(r.uid);
      s += '<div class="row' + (dn ? (turn.phase === "you" ? ' done' : ' counted') : '') + (ctl ? ' ctl' : '') + (cst ? ' car-' + cst.state : '') + '" data-uid="' + r.uid + '" onclick="rowTap(' + r.uid + ')"' + (ctl ? ' style="--ctl:' + ctl.col + '"' : '') + '>' +
        (showTick ? '<span class="tick' + (turn.phase !== "you" ? ' tally' : '') + (dn ? ' on' : '') + '" title="' + (turn.phase !== "you"
            ? (dn ? 'Damage counted so far \u2014 a new hit clears this' : 'Tap once this unit\'s damage is applied')
            : (dn ? 'Done this turn \u2014 tap to un-tick' : 'Tap when this unit has finished')) + '" onclick="event.stopPropagation();toggleDone(' + r.uid + ')">' + doneMark() + '</span>' : '') +
        '<span style="width:6px;height:' + (locked ? 40 : 30) + 'px;border-radius:3px;flex:none;background:' + col + '"></span>' +
        portraitHTML(u, r) +
        '<span style="min-width:0"><div class="nm">' +
          (locked && !dead && objHeld(r.st) ? objTagHTML(objHeld(r.st).name) : '') +
          (locked && mpTeamMode() && ffForUid(r.uid, mpMyTeam()) ? ffTagHTML(ffForUid(r.uid, mpMyTeam()), r.uid, mpMyTeam()) : '') +
          (u.short || u.name) + (n > 1 ? ' <span style="color:var(--muted)">#' + idx + '</span>' : '') +
          (ctl ? ' <span class="ctltag" title="' + (ctl.me ? 'You have this sheet open' : ctl.name + ' has this sheet open') + '">' + (ctl.me ? '\u270E You' : '\u{1F512} ' + ctl.name) + '</span>' : '') +
          (cst ? ' ' + carrierTag(r.uid) : '') + (locked ? ' ' + stanceTagHTML(stanceNow(r)) : '') +
          (locked && needsRecheck(r) ? ' <span class="rechecktag">\u21BB RE-CHECK</span>' : '') +
          '</div>' +
        '<div class="tr">' + (dead ? "DESTROYED" : (LIMB_LABEL[kl] || "Chest") + " " + now + "/" + tot) + ' \u00b7 ' + u.tier +
        (!dead && u.abilities.some(x => x.kind === "auto" && autoOn(x, u, r.st))
          ? ' <b style="color:#fff;background:#b91c1c;border-radius:3px;padding:0 5px;margin-left:4px">' + u.abilities.find(x => x.kind === "auto").name.split(" ")[0].toUpperCase() + '</b>' : '') +
        '</div></span>' +
        '<span class="dp">' + u.dp.toLocaleString() + '</span>' +
        (locked || (mpT && !mpL) ? '' : '<button class="btn sm" onclick="event.stopPropagation();removeOne(' + r.uid + ')">Remove</button>') +
        '</div>';
    });
    setHTMLIfChanged(box, s + "</div>");
  }

  const pool = $("pool"), hdr = $("poolHdr"), tools = $("poolTools");
  if (locked || (mpTeamMode() && !mpAmLeader())) { pool.innerHTML = ""; pool.style.display = "none"; hdr.style.display = "none"; if (tools) tools.style.display = "none"; return; }
  pool.style.display = ""; hdr.style.display = ""; if (tools) tools.style.display = "flex";
  if (rosterTab !== "suits") {                                     // the other tabs have no search box
    if (tools) tools.style.display = "none";
    hdr.textContent = rosterTab === "ground" ? "Available ground units" : "Available warships";
  } else hdr.textContent = "Available mobile suits";
  const poolSig = JSON.stringify([side, query, budget, roster.map(r => r.id), typeof mpTeamMode === "function" && mpTeamMode(), rosterTab]);
  if (pool.__sig === poolSig && pool.firstChild) return;
  pool.__sig = poolSig;
  pool.innerHTML = "";
  pool.__splitN = null; pool.classList.remove("split");             // a rebuilt list must be laid out into columns again
  if (rosterTab !== "suits") {
    pool.classList.remove("list");
    if (tools) tools.style.display = "none";
    hdr.textContent = rosterTab === "ground" ? "Available ground units" : "Available warships";
    pool.innerHTML = rosterTab === "ground" ? groundCardsHTML() : shipCardsHTML();
    return;
  }
  pool.classList.add("list");
  hdr.textContent = "Available mobile suits";
  const avail = available().filter(u => unitTab(u) === "suits");
  const tierCount = avail.reduce((m, x) => { m[x.tier] = (m[x.tier] || 0) + 1; return m; }, {});
  let lastTier = null;
  avail.forEach(u => {
    if (u.tier !== lastTier) {
      lastTier = u.tier;
      const n = tierCount[u.tier];
      const th = document.createElement("div");
      th.className = "tierhdr";
      th.innerHTML = u.tier + '<span>' + n + '</span>';
      pool.appendChild(th);
    }
    const n = countOf(u.id);
    const d = document.createElement("div");
    d.className = "row";
    d.innerHTML = portraitHTML(u) + '<span style="min-width:0"><div class="nm">' + (u.short || u.name) + '</div><div class="tr">' + u.tier + ' \u00b7 ' + u.faction + '</div></span>' +
                  '<span class="dp">' + u.dp.toLocaleString() + '</span>' +
                  (n ? '<span class="qty">' + n + '</span>' : '');
    d.onclick = () => { addUnit(u.id); promptMarks(u.id); };
    pool.appendChild(d);
  });
  const list = avail;
  const total = UNITS.filter(u => (u.faction === side || u.faction === "neutral") && unitTab(u) === "suits").length;
  $("searchCount").textContent = query.trim() ? (list.length + " of " + total) : (total + " units");
  $("searchClear").style.display = query.trim() ? "" : "none";
  if (!list.length) pool.innerHTML = '<div class="empty">No units match that search.</div>';
}

/* ---------- 4. stat sheet ---------- */
/* circle positions measured from the artwork.
   The red-toned sheets place the arms slightly differently to every other colour. */
const LIMB_POS_DEFAULT = {
  head:     { x: 55.48, y: 17.31 }, chest:    { x: 59.36, y: 40.86 },
  rightArm: { x: 47.79, y: 44.49 }, leftArm:  { x: 70.95, y: 44.58 },
  rightLeg: { x: 48.72, y: 69.84 }, leftLeg:  { x: 70.19, y: 69.84 },
};
const LIMB_POS_RED = {
  head:     { x: 55.48, y: 17.31 }, chest:    { x: 59.36, y: 40.86 },
  rightArm: { x: 47.04, y: 44.09 }, leftArm:  { x: 71.83, y: 44.75 },
  rightLeg: { x: 48.72, y: 69.84 }, leftLeg:  { x: 70.19, y: 69.84 },
};
const limbPos = bg => (bg === "red" || bg === "red360") ? LIMB_POS_RED : LIMB_POS_DEFAULT;
const LIMB_ORDER = ["head", "chest", "rightArm", "leftArm", "rightLeg", "leftLeg"];
const LIMB_LABEL = { head: "Head", chest: "Chest", rightArm: "Right Arm", leftArm: "Left Arm", rightLeg: "Right Leg", leftLeg: "Left Leg", hull: "Hull", hp: "HP" };
const SKILL_Y = [19.7, 25.9, 32.1, 38.3, 44.5];
// cf44: taller weapon rows — each weapon's stored row centre is moved onto the new grid (shield positions are left alone)
const WEAP_Y_OLD = [68.55, 73.65, 78.7, 83.5, 88.1], WEAP_Y = [61.5, 68.1, 74.7, 81.3, 87.9];
UNITS.forEach(u => (u.weapons || []).forEach(w => {
  if (typeof w.y !== "number" || w.y < 60 || w.y > 92) return;
  let k = 0; WEAP_Y_OLD.forEach((v, j) => { if (Math.abs(v - w.y) < Math.abs(WEAP_Y_OLD[k] - w.y)) k = j; });
  w.y = WEAP_Y[k];
}));
const COL = { skillName: 7.3, skillAP: 25.8, skillCD: 35.5, wName: 7.3, wDmg: 25.8, wAP: 31.1, wRange: 37.7,
              nameX: 67.2, nameY: 11.7, dpX: 67.2, dpY: 17.2, moveX: 80.5, moveY: 38.5 };
const SHEET_ACCENT = {
  blue: "#7dd3fc", blue360: "#7dd3fc", phenex: "#7dd3fc",
  green: "#bef264", grey: "#cbd5e1", red: "#ff4d5a", red360: "#ff4d5a",
};
const accentOf = bg => SHEET_ACCENT[bg] || "#7dd3fc";
// The sheet is drawn entirely in code (the printed sheet images are retired).
const hudMode = true;
// sheet colour follows the player's side: Federation blue, Spacenoid red
const sideKey = () => side === "spacenoid" ? "red" : "blue";
// blueprint model:
//   grunts (incl. Veteran/Custom)  -> Zaku (Spacenoid) / GM (Federation)
//   Federation and neutral suits   -> Gundam
//   Spacenoid suits                -> Sazabi, except the Gundam designs (GP02A Physalis, Xi) -> Gundam
const GUNDAM_SPACENOID = ["rx-78gp02a-gundam-physalis", "xi-gundam-gundam"];   // Spacenoid-side Gundam designs
const isGruntTier = u => /Grunt/.test(u.tier);
const mechModel = u => {
  if (u && u.type === "warship") return "ship-" + u.ship;
  if (u && u.type === "ground") return u.wire;
  if (isGruntTier(u)) return u.faction === "spacenoid" ? "zaku" : u.faction === "federation" ? "gm" : (side === "spacenoid" ? "zaku" : "gm");
  if (u.faction === "spacenoid") return GUNDAM_SPACENOID.some(k => u.id.indexOf(k) === 0) ? "gundam" : "sazabi";
  return "gundam";
};
const MECH_ASPECT = { gundam: 0.5216, sazabi: 0.632, zaku: 0.619, gm: 0.5563 };   // includes the glow margin
let frameKey = "";
// feedback when an AP value is used: the cell flashes and "-N AP" floats up
function apFeedback(x, y, w, n) {
  const sheet = $("sheet");
  const f = document.createElement("div"); f.className = "apflash";
  Object.assign(f.style, { left: x + "%", top: y + "%", width: w + "%", height: "4.4%" });
  const t = document.createElement("div"); t.className = "apfloat";
  Object.assign(t.style, { left: x + "%", top: (y - 1) + "%" });
  t.textContent = "\u2212" + n + " AP";
  sheet.append(f, t);
  setTimeout(() => { f.remove(); t.remove(); }, 1000);
}
let apShown = { uid: null, ap: null };
// wireframe models: stored once as white cut-outs, coloured here for the side (light blue / gold) with a soft glow
const modelImg = u => (u && u.type === "warship") ? "img/ship-" + u.ship + ".webp" : "img/mech-" + mechModel(u) + ".webp";
const MECH_TINT = { blue: ["#a5e4ff", "rgba(56,189,248,.95)"], red: ["#ff6b76", "rgba(255,45,65,.95)"] };
const mechSrc = {}, mechTinted = {};
function tintMech(img, colour) {
  const [line, glow] = MECH_TINT[colour] || MECH_TINT.blue, pad = 12;
  const t = document.createElement("canvas"); t.width = img.naturalWidth; t.height = img.naturalHeight;
  const tx = t.getContext("2d");
  tx.drawImage(img, 0, 0);
  tx.globalCompositeOperation = "source-in";          // keep the wireframe's shape, fill it with the side colour
  tx.fillStyle = line; tx.fillRect(0, 0, t.width, t.height);
  const c = document.createElement("canvas"); c.width = t.width + pad * 2; c.height = t.height + pad * 2;
  const x = c.getContext("2d");
  x.shadowColor = glow; x.shadowBlur = 6; x.globalAlpha = .85; x.drawImage(t, pad, pad); x.globalAlpha = 1;   // tight glow hugging the lines
  x.shadowBlur = 0; x.drawImage(t, pad, pad);                                                                 // lines drawn twice: bolder
  x.shadowBlur = 0; x.drawImage(t, pad, pad);                           // crisp lines on top
  return c;
}
function paintMech(canvas, model, colour) {
  const key = model + "|" + colour;
  canvas.dataset.want = key;
  const show = c => { canvas.width = c.width; canvas.height = c.height; canvas.getContext("2d").drawImage(c, 0, 0); canvas.dataset.painted = key; };
  if (mechTinted[key]) { show(mechTinted[key]); return; }
  const ready = img => {
    if (!mechTinted[key]) mechTinted[key] = tintMech(img, colour);
    if (canvas.dataset.want === key) show(mechTinted[key]);
  };
  let img = mechSrc[model];
  if (!img) { img = mechSrc[model] = new Image(); img.src = (model.indexOf("ship-") === 0 || model.indexOf("ground/") === 0 ? "img/" : "img/mech-") + model + ".webp"; }
  if (img.complete && img.naturalWidth) ready(img);
  else img.addEventListener("load", () => ready(img), { once: true });
}

function applyHud() {
  document.body.classList.add("hud");
  document.body.dataset.sheet = sideKey();
  buildFrame();
}
// the HUD frame: panels, tables, stat frames, limb reticles and the coverage dial, all positioned
// on the same layout the sheet engine uses (measured from the original sheets)
function buildFrame() {
  if (!U) return;
  if (isShip(U)) { buildShipFrame(); return; }
  if (isGround(U)) { if (isSquad(U)) buildSquadFrame(); else buildGroundFrame(); return; }
  $("sheet").classList.remove("shipsheet");
  const cov = ["blue360", "red360", "phenex"].indexOf(U.bg) >= 0 ? "360" : "180";
  const ring = !!U.ring, model = mechModel(U), rolled = isGruntTier(U);
  const key = [sideKey(), cov, ring, model, rolled, U.portrait || "", (CUR && CUR.mark) || ""].join("|");
  const F = $("frame");
  $("sheet").dataset.side = sideKey();
  if (key === frameKey && F.childElementCount) return;
  frameKey = key;
  F.innerHTML = "";
  const add = (cls, st, html) => { const d = document.createElement("div"); d.className = cls; if (st) Object.assign(d.style, st); if (html !== undefined) d.innerHTML = html; F.appendChild(d); return d; };
  const pc = v => v + "%";
  // soft "breathing" light behind the sheet
  add("fbreath"); add("fbreath b2");
  add("fgrid");                                                           // the HUD grid, above the background and the glow
  // corners and hazard stripes
  add("fb tl"); add("fb tr"); add("fb bl"); add("fb br");
  add("fstripe", { left: "27%", bottom: "1.6cqw" }); add("fstripe", { right: "2.9cqw", top: "1cqw" });
  add("fdock l"); add("fdock r");                                        // plates the bottom buttons sit on
  // blueprint model behind everything else
  const mh = 76 * 0.5625;                                            // 76% of the sheet height, in container units
  const mw = add("fmech", { width: (MECH_ASPECT[model] * mh) + "cqw" });
  const mi = document.createElement("canvas"); mi.className = "fmech-in " + model; mw.appendChild(mi);
  paintMech(mi, model, sideKey());
  // section titles
  add("fsec", { left: "22.6%", top: "4.3%" }, "<i></i>ABILITIES<i></i>");
  add("fsec", { left: "22.6%", top: "50.9%" }, "<i></i>WEAPONS LIST<i></i>");
  // tables
  const table = (x0, x1, y0, yh, rows, cols, heads, nums) => {
    const H = rows[rows.length - 1] - y0;
    const t = add("ftbl", { left: pc(x0), top: pc(y0), width: pc(x1 - x0), height: pc(H) });
    const hd = document.createElement("div"); hd.className = "fhead"; hd.style.height = pc((yh - y0) / H * 100); t.appendChild(hd);
    rows.slice(1, -1).forEach(r => { if (r === yh) return; const d = document.createElement("div"); d.className = "frow"; d.style.top = pc((r - y0) / H * 100); t.appendChild(d); });
    cols.forEach(c => { const d = document.createElement("div"); d.className = "fcol"; d.style.left = pc((c - x0) / (x1 - x0) * 100); t.appendChild(d); });
    heads.forEach(([hx, txt]) => add("flbl fth", { left: pc(hx), top: pc((y0 + yh) / 2) }, txt));
    nums.forEach((y, i) => add("flbl fnum", { left: "4.3%", top: pc(y) }, String(i + 1)));
  };
  table(3.4, 41.85, 12.6, 16.6, [12.6, 16.6, 22.8, 29.0, 35.2, 41.4, 47.6], [5.2, 23.0, 28.8],
    [[14.1, "SKILL"], [25.85, "AP"], [35.3, "COOLDOWN"]], SKILL_Y);
  table(3.4, 41.75, 54.2, 58.2, [54.2, 58.2, 64.8, 71.4, 78.0, 84.6, 91.2], [5.2, 23.0, 28.65, 33.55],
    [[14.1, "WEAPON NAME"], [25.8, "DMG"], [31.1, "AP"], [37.65, "RANGE"]], WEAP_Y);
  // name panel
  add("fname"); add("flbl fsub", { left: "67.2%", top: "7.0%" }, "MOBILE SUIT //");
  // unit portrait in the name panel (blueprint silhouette until a portrait is added)
  const pf = add(U.portrait ? "fport" : "fport ph", { left: "92.6%", top: "11.85%" });
  const pim = document.createElement("img"); pim.alt = ""; pim.decoding = "async";
  pim.src = U.portrait ? "img/portraits/" + U.portrait + ".webp" : "img/mech-" + model + ".webp";
  pf.appendChild(pim);
  const mk = markOf(CUR);
  if (mk) { const pp = document.createElement("span"); pp.className = "mpip fp"; pp.style.setProperty("--pc", mk.c); pf.appendChild(pp); }
  // stat frames and labels
  [[28.7, "AP"], [38.5, "MOVEMENT"], [47.9, rolled ? "ROLLED<br>DODGES" : "DODGES"], [57.3, "SHIELD<br>HP"]].forEach(([y, t]) => {
    add("fhex", { left: "80.5%", top: pc(y) }); add("fstat", { left: "85.9%", top: pc(y) }, t);
  });
  // limb reticles and labels
  const L = LIMB_POS_DEFAULT;
  Object.keys(L).forEach(k => add("fret", { left: pc(L[k].x), top: pc(L[k].y) }));
  const lab = (t, x, y) => add("flbl flimb", { left: pc(x), top: pc(y) }, t);
  const hpl = (x, y) => add("flbl fhp", { left: pc(x), top: pc(y) }, "HP");
  lab("HEAD", L.head.x, L.head.y - 7.4); hpl(L.head.x - 4.2, L.head.y);
  lab("CHEST", L.chest.x, L.chest.y - 6.6); hpl(L.chest.x, L.chest.y + 6.3);
  lab("RIGHT<br>ARM", L.rightArm.x, L.rightArm.y - 8.0); hpl(L.rightArm.x, L.rightArm.y + 7.6);
  lab("LEFT<br>ARM", L.leftArm.x, L.leftArm.y - 8.0); hpl(L.leftArm.x, L.leftArm.y + 7.6);
  hpl(L.rightLeg.x, L.rightLeg.y - 7.4); lab("RIGHT<br>LEG", L.rightLeg.x, L.rightLeg.y + 8.2);
  hpl(L.leftLeg.x, L.leftLeg.y - 7.4); lab("LEFT<br>LEG", L.leftLeg.x, L.leftLeg.y + 8.2);
  // shield coverage dial
  const cx = 87.36, cy = 73.6;
  add("fdial o", { left: pc(cx), top: pc(cy) });
  add("fdial i", { left: pc(cx), top: pc(cy) });
  add("fdial arc " + (cov === "360" ? "full" : "half"), { left: pc(cx), top: pc(cy) });
  add("farrow", { left: pc(cx), top: pc(cy) });
  add("fcore", { left: pc(cx), top: pc(cy + 0.6) });
  if (!ring) add("flbl fcov", { left: "93.4%", top: "63.3%" }, cov + "\u00b0");
  add("flbl fcap", { left: "88.6%", top: "86.3%" }, "\u25C8 " + (ring ? cov + "\u00b0 " : "") + "SHIELD COVERAGE");
  if (ring) [[80.91, 66.32], [93.8, 66.45], [80.97, 80.97], [93.8, 80.98]].forEach(([x, y]) => add("fbub", { left: pc(x), top: pc(y) }));
}
const WROW_X = 6.3, WROW_W = 35.4, WROW_H = 5.8, WPIP_X = 43.5, IDLE = 2500, LIMB_OFF = 4.8;

let amount = 1;
const AMOUNTS = [1, 2, 3, 4, 5, 6, 10, 15];
let risk = {};
let shMax = [];
let swapFlash = null, swapNote = null;
let U = null, hp = {}, sh = [], shDown = [], out = null, lent = [], pods = null,
    swapMode = false, swapFrom = null, dodges = 0, ap = 0, track = [], wpn = [],
    mode = "damage", active = null, timer = null;

let CUR = null;
function openSheet(uid) {
  CUR = roster.find(r => r.uid === uid);
  if (!CUR) return;
  { const cs = locked ? carrierState(uid) : null;
    if (cs && cs.state === "aboard") { mpToast(unitLabel(uid) + " is aboard the " + cs.u.short + " \u2014 " + (isShip(cs.u) ? "launch it from the ship's sheet." : "disembark it from the vehicle's sheet.")); openSheet(cs.ship.uid); return; } }
  U = unitById(CUR.id);
  if (isShip(U) || isGround(U)) {                    // warships and ground vehicles have their own sheets
    const s = isShip(U) ? shipMigrate(U, CUR.st) : isSquad(U) ? sqMigrate(U, CUR.st) : gvMigrate(U, CUR.st);
    hp = s.hp; dodges = 0; ap = s.ap; track = s.track; wpn = s.wpn; sh = s.sh; shDown = s.shDown; shMax = s.shMax;
    out = null; lent = s.lent; pods = null; risk = s.risk; swapMode = false; swapFrom = null; active = null;
    applyHud();
    const acc = accentOf(sideKey());
    ["rosterBtn", "tablesBtn"].forEach(b => { $(b).style.borderColor = acc; $(b).style.color = acc; });
    $("rosterBtn").style.display = "";
    snaps[CUR.uid] = snapOf(CUR); tlSel = null;
    show("s4"); draw();
    if (mpTeamMode()) mpWantSheet(uid);
    return;
  }
  // the interface takes the side's colours while a sheet is open
  const s = CUR.st;
  // the weapon list changed since this game was saved: start its counters fresh
  const wsig = U.weapons.map(w => w.name + (w.limit ? ":" + w.limit.kind : "")).join("|");
  if (!Array.isArray(s.wpn) || s.wpn.length !== U.weapons.length || (s.wsig && s.wsig !== wsig))
    s.wpn = U.weapons.map(w => w.limit && w.limit.kind === "charges" ? w.limit.max : 0);
  if (s.wsig !== wsig && Array.isArray(s.wpn) && !s.wsig) {
    // saves from before this check: reset only if a charge weapon holds an impossible value
    U.weapons.forEach((w, j) => { if (w.limit && w.limit.kind === "charges" && !(s.wpn[j] > 0 && s.wpn[j] <= w.limit.max)) s.wpn[j] = w.limit.max; });
  }
  s.wsig = wsig;
  // skills added, removed or reordered since the game was saved: keep each saved value with its own skill
  const anames = U.abilities.map(a => a.name);
  if (Array.isArray(s.track) && Array.isArray(s.anames) && s.anames.join("|") !== anames.join("|"))
    s.track = anames.map(n => { const j = s.anames.indexOf(n); return j >= 0 ? s.track[j] : undefined; });
  else if (Array.isArray(s.track) && !s.anames && s.track.length < anames.length)
    s.track = s.track.concat(Array(anames.length - s.track.length).fill(undefined));   // older saves: a skill was added at the end
  s.anames = anames;
  if (!Array.isArray(s.track) || s.track.length !== U.abilities.length)
    s.track = U.abilities.map(a => a.kind === "matrix" ? { sel: null, p: 0 } : a.kind === "dualmode" ? { mode: a.modes[0].id, n: 1 } : a.kind === "counter" ? a.max
      : a.kind === "mode" ? { on: false, left: a.duration || 1, ch: a.charges || null }
      : a.kind === "toggle" ? 0 : null);
  // an ability whose type changed since the game was saved gets a fresh, valid slot
  s.track = s.track.map((v, i) => {
    const a = U.abilities[i];
    if (a.kind === "counter") return typeof v === "number" ? Math.max(0, Math.min(v, a.max)) : a.max;
    if (a.kind === "mode") return (v && typeof v === "object" && "on" in v) ? v : { on: false, left: a.duration || 1, ch: a.charges || null };
    if (a.kind === "toggle") return v === 1 ? 1 : 0;
    if (a.kind === "matrix") return (v && typeof v === "object" && "sel" in v) ? v : { sel: null, p: 0 };
    if (a.kind === "dualmode") return (v && typeof v === "object" && a.modes.some(m => m.id === v.mode)) ? v : { mode: a.modes[0].id, n: 1 };
    if (a.kind === "pod" || a.kind === "none" || a.kind === "auto") return null;
    return v === undefined ? null : v;
  });
  if (!s.hp || Object.keys(s.hp).length !== 6) { s.hp = {}; LIMB_ORDER.forEach(k => s.hp[k] = U.limb[k]); }
  hp = s.hp; dodges = s.dodges; ap = s.ap; track = s.track; wpn = s.wpn;
  // migrate state saved before a unit's shield layout changed
  const want = (U.shields || []).length;
  if (!Array.isArray(s.sh) || s.sh.length !== want || s.sh.some(v => typeof v !== "number")) {
    s.sh = (U.shields || []).map(x => x.hp);
    s.shDown = (U.shields || []).map(() => 0);
  }
  if (!Array.isArray(s.shDown) || s.shDown.length !== want) s.shDown = (U.shields || []).map(() => 0);
  sh = s.sh;
  if (!Array.isArray(s.shMax) || s.shMax.length !== want) s.shMax = (U.shields || []).map(x => x.hp);
  shMax = s.shMax;
  shDown = s.shDown;
  if (U.lendable) { if (!Array.isArray(s.out) || s.out.length !== U.lendable.count) s.out = Array(U.lendable.count).fill(null); }
  else { s.out = null; }                      // not a lender -- make sure nothing lingers
  if (!Array.isArray(s.lent)) s.lent = [];
  if (!s.risk || typeof s.risk !== "object") s.risk = {};
  risk = s.risk;
  if (U.pods) { if (!Array.isArray(s.pods) || s.pods.length !== U.pods.count)
    s.pods = Array.from({ length: U.pods.count }, () => ({ hp: U.pods.hp, state: 0 })); }
  else s.pods = null;
  pods = s.pods;
  swapMode = false; swapFrom = null;
  out = U.lendable ? s.out : null;
  lent = s.lent;
  active = null;
  applyHud();
  const acc = accentOf(sideKey());
  $("rosterBtn").style.display = "";
  $("rosterBtn").style.borderColor = acc;
  $("rosterBtn").style.color = acc;
  $("tablesBtn").style.borderColor = acc;
  $("tablesBtn").style.color = acc;
  snaps[CUR.uid] = snapOf(CUR);            // opening a sheet is not an event
  tlSel = null;
  show("s4"); draw();
  if (mpTeamMode()) mpWantSheet(uid);        // multiplayer: take control, or watch read-only
}
function persist() {
  if (!CUR) return;
  CUR.st.hp = hp; CUR.st.dodges = dodges; CUR.st.ap = ap;
  CUR.st.track = track; CUR.st.wpn = wpn; CUR.st.sh = sh; CUR.st.shDown = shDown; CUR.st.shMax = shMax;
  CUR.st.out = U && U.lendable ? out : null;
  CUR.st.pods = U && U.pods ? pods : null;
  if (Array.isArray(lent)) CUR.st.lent = lent;
  CUR.st.risk = risk;
  save();
}
function closeSheet() { persist(); if (mpTeamMode()) mpLeaveSheet(); renderRoster(); show("s3"); if (typeof renderFF === "function") renderFF(); }

function wake(id) { if (swapMode && U && U.ring && /^l_/.test(id)) { draw(); return; } active = id; clearTimeout(timer); timer = setTimeout(() => { active = null; draw(); }, IDLE); draw(); }
function el(t, c, s) { const e = document.createElement(t); if (c) e.className = c; if (s) Object.assign(e.style, s); return e; }

window.openPicker = (mode, slot) => {
  const lst = $("picklist"); lst.innerHTML = "";
  const lendMode = mode === "lend";
  const LEND = U.lendable || { label: "shield", hp: 0, ap: 1, range: "", count: 0 };
  $("pickT").textContent = lendMode ? ("Send " + LEND.label) : "Your force";
  const canAfford = !lendMode || ap >= LEND.ap;
  $("pickS").innerHTML = lendMode
    ? ("Choose an ally within " + LEND.range + ". Costs <b>" + LEND.ap + " AP</b> — you have <b>" + ap + "</b>."
       + (canAfford ? " Lasts until recalled." : " <span style='color:#fca5a5'>Not enough AP.</span>"))
    : "Tap a model to open its sheet.";
  // cf46: grouped rows with the same status tags as the roster screen
  const groups = [["suits", "Mobile suits"], ["ships", "Ships"], ["ground", "Ground units"]];
  groups.forEach(([gk, gl]) => {
    const rows = roster.filter(r => unitTab(unitById(r.id)) === gk)
      .filter(r => !(lendMode && (r.uid === CUR.uid || isShip(unitById(r.id)) || isGround(unitById(r.id)) || outOfPlay(r.uid))));
    if (!rows.length) return;
    if (!lendMode) { const hd = el("div", "pkgrp"); hd.textContent = gl.toUpperCase() + " \u00b7 " + rows.length; lst.appendChild(hd); }
    rows.forEach(r => {
      const un = unitById(r.id), n = countOf(r.id), idx = copyIndex(r);
      const kl = un.kill || "chest", tot = un.limb[kl], now = r.st.hp[kl];
      const dead = now === 0;
      const col = dead ? "#7f1d1d" : (now / tot) <= .34 ? "#ef4444" : (now / tot) <= .67 ? "#f59e0b" : "#22c55e";
      const cst = locked ? carrierState(r.uid) : null;
      const ctl = typeof mpControlOf === "function" ? mpControlOf(r.uid) : null;
      const isCur = CUR && CUR.uid === r.uid;
      const you = turn.phase === "you";
      const doneTag = locked && !dead && !(cst && cst.state === "aboard") && isDone(r.uid)
        ? (you ? '<span class="pktag done">\u2713 DONE</span>' : '<span class="pktag counted">' + TALLY_SVG + ' COUNTED</span>') : '';
      const d = el("div", "row pkrow" + (cst ? " car-" + cst.state : "") + (dead ? " pkdead" : "") + (isCur ? " pkcur" : ""));
      d.innerHTML = '<span style="width:6px;height:36px;border-radius:3px;flex:none;background:' + col + '"></span>' +
        portraitHTML(un) +
        '<span style="min-width:0;flex:1"><div class="nm">' + markPipHTML(r, 'inl') + (un.short || un.name) + (n > 1 ? ' <span style="color:var(--muted)">#' + idx + '</span>' : '') +
          (isCur ? ' <span class="pktag cur">OPEN NOW</span>' : '') +
          (ctl && !isCur ? ' <span class="ctltag">' + (ctl.me ? '\u270E You' : '\u{1F512} ' + ctl.name) + '</span>' : '') + '</div>' +
          '<div class="tr">' + (dead ? "DESTROYED" : (LIMB_LABEL[kl] || "Chest") + " " + now + "/" + tot) + ' \u00b7 ' + (un.tier || "") + '</div>' +
          '<div class="pktags">' + (cst ? carrierTag(r.uid) : '') + (locked ? stanceTagHTML(stanceNow(r)) : '') + doneTag +
            (locked && needsRecheck(r) ? '<span class="rechecktag">\u21BB RE-CHECK</span>' : '') + '</div></span>' +
        (cst && cst.state === "aboard" && !lendMode ? '<span class="pkgo">opens the ' + cst.u.short + '</span>' : '');
      d.onclick = () => {
        if (lendMode) { lendTo(slot, r); } else { closePicker(); openSheet(r.uid); }
      };
      lst.appendChild(d);
    });
  });
  $("pick").classList.add("on");
};
window.closePicker = () => {
  $("pick").classList.remove("on");
  $("pickExtra").innerHTML = "";          // extra buttons belong to one dialog only
  $("pickCancel").textContent = "Cancel";
};

let tblKey = Object.keys(TABLES)[0];
window.openTables = () => { renderTables(); $("tbl").classList.add("on"); };
window.closeTables = () => $("tbl").classList.remove("on");
function renderTables() {
  const tabs = $("tbltabs"); tabs.innerHTML = "";
  Object.keys(TABLES).forEach(k => {
    const b = document.createElement("div");
    b.className = "tb" + (k === tblKey ? " on" : "");
    b.textContent = k;
    b.onclick = () => { tblKey = k; renderTables(); };
    tabs.appendChild(b);
  });
  const rows = TABLES[tblKey] || [];
  let html = "<table><thead><tr>";
  (rows[0] || []).forEach(c => { html += "<th>" + c + "</th>"; });
  html += "</tr></thead><tbody>";
  rows.slice(1).forEach(r => {
    html += "<tr>";
    r.forEach(c => { html += "<td>" + c + "</td>"; });
    html += "</tr>";
  });
  $("tblbody").innerHTML = html + "</tbody></table>";
}

function lendTo(slot, target) {
  const L = U.lendable;
  if (!L || !out || !target || !target.st) { closePicker(); return; }
  if (ap < L.ap) { closePicker(); return; }
  if (mpHeldByOther(target.uid)) {                      // someone has the receiver open: their device takes it in
    const cost = L.ap, lenderUid = CUR.uid, tUid = target.uid;
    ap -= cost; out[slot] = tUid;
    const carry = (typeof sh[slot] === "number") ? sh[slot] : L.hp;
    const entry = { from: lenderUid, slot: slot, hp: L.hp, cur: carry, label: L.label || "Shield", owner: U.short || U.name };
    closePicker(); draw(); save();
    const l = mpLockOf(mpMyTeam(), tUid);
    mpToast((L.label || "Shield") + " on its way \u2014 " + mpNameOf(l.pid) + " has " + unitLabel(tUid) + " open.");
    mpSend(tUid, { type: "lend", entry }, () => {
      if (CUR && CUR.uid === lenderUid) persist();
      const lr = roster.find(r => r.uid === lenderUid);
      if (lr) { if (Array.isArray(lr.st.out) && lr.st.out[slot] === tUid) lr.st.out[slot] = null; lr.st.ap = (lr.st.ap || 0) + cost; }
      if (CUR && CUR.uid === lenderUid) { reloadCur(); draw(); }
      save(); mpToast("The shield couldn't be sent \u2014 try again.");
    });
    return;
  }
  if (!mpForeignCheck(target.uid)) { closePicker(); return; }
  ap -= L.ap;
  out[slot] = target.uid;
  const carry = (typeof sh[slot] === "number") ? sh[slot] : L.hp;   // damage travels with it
  const entry = { from: CUR.uid, slot: slot, hp: L.hp, cur: carry, label: L.label || "Shield", owner: U.short || U.name };
  const lenderUid = CUR.uid, tUid = target.uid, cost = L.ap;
  const put = () => {                                  // safe to run twice
    const t = roster.find(r => r.uid === tUid); if (!t) return;
    t.st.lent = (Array.isArray(t.st.lent) ? t.st.lent : []).filter(x => !(x.from === entry.from && x.slot === entry.slot));
    t.st.lent.push(Object.assign({}, entry));
  };
  put();
  closePicker(); draw(); save();
  mpForeign(tUid, put, () => {
    if (CUR && CUR.uid === lenderUid) persist();
    const lr = roster.find(r => r.uid === lenderUid);
    if (lr) { if (Array.isArray(lr.st.out) && lr.st.out[slot] === tUid) lr.st.out[slot] = null; lr.st.ap = (lr.st.ap || 0) + cost; }
    const t = roster.find(r => r.uid === tUid);
    if (t && Array.isArray(t.st.lent)) t.st.lent = t.st.lent.filter(x => !(x.from === entry.from && x.slot === entry.slot));
  }, "the lend was");
}
window.recallDE = (slot) => {
  const L = U.lendable || { ap: 1, hp: 0 };
  const tgtUid = out[slot];
  if (tgtUid != null && mpHeldByOther(tgtUid)) {         // the holder's device hands it back with its current HP
    const lenderUid = CUR.uid, prevAp = ap, cost = L.ap;
    out[slot] = null; ap = Math.max(0, ap - cost);
    draw(); save();
    const l = mpLockOf(mpMyTeam(), tgtUid);
    mpToast("Recalling \u2014 " + mpNameOf(l.pid) + "'s device is sending it back.");
    mpSend(tgtUid, { type: "recall", from: lenderUid, slot: slot }, () => {
      if (CUR && CUR.uid === lenderUid) persist();
      const lr = roster.find(r => r.uid === lenderUid);
      if (lr) { if (Array.isArray(lr.st.out)) lr.st.out[slot] = tgtUid; lr.st.ap = prevAp; }
      if (CUR && CUR.uid === lenderUid) { reloadCur(); draw(); }
      save(); mpToast("The recall couldn't be sent \u2014 try again.");
    });
    return;
  }
  if (tgtUid != null && !mpForeignCheck(tgtUid)) return;
  const t = roster.find(r => r.uid === tgtUid);
  const lenderUid = CUR.uid, prevSh = sh[slot], prevAp = ap;
  let entry = null;
  if (t && Array.isArray(t.st.lent)) entry = t.st.lent.find(x => x.from === lenderUid && x.slot === slot) || null;
  if (entry) sh[slot] = entry.cur;              // comes home in whatever state it is in
  const drop = () => {                           // safe to run twice
    const tt = roster.find(r => r.uid === tgtUid);
    if (tt && Array.isArray(tt.st.lent)) tt.st.lent = tt.st.lent.filter(x => !(x.from === lenderUid && x.slot === slot));
  };
  drop();
  out[slot] = null;
  ap = Math.max(0, ap - L.ap);
  draw(); save();
  if (tgtUid != null) mpForeign(tgtUid, drop, () => {
    if (CUR && CUR.uid === lenderUid) persist();
    const lr = roster.find(r => r.uid === lenderUid);
    if (lr) { if (Array.isArray(lr.st.out)) lr.st.out[slot] = tgtUid; lr.st.ap = prevAp; if (Array.isArray(lr.st.sh)) lr.st.sh[slot] = prevSh; }
    const tt = roster.find(r => r.uid === tgtUid);
    if (tt && entry) { tt.st.lent = (Array.isArray(tt.st.lent) ? tt.st.lent : []).filter(x => !(x.from === lenderUid && x.slot === slot)); tt.st.lent.push(entry); }
  }, "the recall was");
};


function renderAmounts() {
  const bar = $("amtBar"); if (!bar) return;
  bar.innerHTML = "<b>DMG</b>";
  AMOUNTS.forEach(n => {
    const b = document.createElement("div");
    b.className = "a" + (n === amount ? " on" : "");
    b.textContent = n;
    b.title = "Each tap on a limb applies " + n;
    b.onclick = () => { amount = n; renderAmounts(); if (typeof sqSelState !== "undefined" && sqSelState && U && isSquad(U)) draw(); };
    bar.appendChild(b);
  });
  const custom = AMOUNTS.indexOf(amount) < 0;
  const cu = document.createElement("div");
  cu.className = "a cust" + (custom ? " on" : "");
  cu.textContent = custom ? amount : "#";
  cu.title = "Type any amount (e.g. 14)";
  cu.onclick = () => openAmountInput();
  bar.appendChild(cu);
  const nk = document.createElement("div");
  nk.className = "a nuke"; nk.textContent = "\u2622"; nk.title = "Caught in a nuclear blast \u2014 apply the damage to this unit";
  nk.onclick = () => openNuke();
  bar.appendChild(nk);
}
// ---------- a typed damage amount ----------
function openAmountInput() {
  $("pickT").textContent = (mode === "repair" ? "Repair" : "Damage") + " amount";
  $("pickS").innerHTML = "Type the exact amount \u2014 each tap on a ring or limb then applies it once.";
  const lst = $("picklist"); lst.innerHTML = "";
  const wrap = el("div", "amtin");
  const inp = document.createElement("input");
  inp.type = "number"; inp.min = "1"; inp.max = "999"; inp.step = "1"; inp.inputMode = "numeric"; inp.id = "amtInput";
  inp.value = AMOUNTS.indexOf(amount) < 0 ? amount : "";
  inp.placeholder = "e.g. 14";
  const keys = el("div", "amtkeys");
  ["1","2","3","4","5","6","7","8","9","\u232B","0","\u2713"].forEach(k => {
    const b = el("button", "btn" + (k === "\u2713" ? " pri ready" : ""));
    b.textContent = k;
    b.onclick = () => {
      if (k === "\u232B") inp.value = inp.value.slice(0, -1);
      else if (k === "\u2713") go();
      else if (inp.value.length < 3) inp.value += k;
    };
    keys.appendChild(b);
  });
  const go = () => {
    const n = parseInt(inp.value, 10);
    if (!(n >= 1)) { mpToast("Type an amount of 1 or more."); return; }
    amount = Math.min(999, n);
    closePicker(); renderAmounts();
    if (typeof sqSelState !== "undefined" && sqSelState && U && isSquad(U)) draw();
  };
  inp.onkeydown = e => { if (e.key === "Enter") go(); };
  wrap.append(inp, keys);
  lst.appendChild(wrap);
  $("pickExtra").innerHTML = "";
  const ok = el("button", "btn pri ready"); ok.textContent = "Use this amount \u25B8"; ok.onclick = go;
  $("pickExtra").appendChild(ok);
  $("pickCancel").textContent = "Cancel";
  $("pick").classList.add("on");
  setTimeout(() => { try { inp.focus({ preventScroll: true }); } catch (e) {} }, 60);
}
// ---------- nuclear hits ----------
// this unit was caught in a nuclear blast (any nuke uses the same table); pick how far it was from the centre
const NUKE = { suit: [15, 10, 5], ship: [{ hull: 40, disable: true }, { hull: 25 }, { hull: 10 }] };
const NUKE_BANDS = ["0\u201330cm", "30\u201360cm", "60\u201390cm"];
function openNuke() {
  if (!CUR || !U) return;
  if (typeof mpSheetCanEdit === "function" && !mpSheetCanEdit()) return;
  const ship = isShip(U);
  $("pickT").textContent = "\u2622 Caught in a nuclear blast \u2014 " + (U.short || U.name);
  $("pickS").innerHTML = "Apply the blast damage to <b>this " + (ship ? "ship" : "unit") + "</b>. How far was it from the blast centre? " +
    "Nukes are undodgeable \u2014 <b>Block only</b>" + (ship ? "." : "; if it Blocked, apply the damage to the shield instead.");
  const lst = $("picklist"); lst.innerHTML = "";
  NUKE_BANDS.forEach((band, i) => {
    const d = el("button", "nk-band b" + i);
    const eff = ship ? NUKE.ship[i].hull + " Hull" + (NUKE.ship[i].disable ? " \u00b7 Bridge + both Thrusters disabled" : "")
                     : NUKE.suit[i] + " damage to all 6 locations";
    d.innerHTML = '<span class="nk-dist">' + band + '</span><span class="nk-eff">' + eff + '</span>';
    d.onclick = () => { closePicker(); applyNuke(i); };
    lst.appendChild(d);
  });
  $("pickExtra").innerHTML = ""; $("pickCancel").textContent = "Cancel";
  $("pick").classList.add("on");
}
function applyNuke(i) {
  const tag = "\u2622 Nuclear blast (" + NUKE_BANDS[i] + ")";
  if (isShip(U)) {
    const st = CUR.st, S = st.ship, e = NUKE.ship[i], uid = CUR.uid;
    const hullWas = st.hp.hull;
    st.hp.hull = Math.max(0, hullWas - e.hull);
    aggDmg(uid, "ship:hull", "Hull", hullWas - st.hp.hull, st.hp.hull, U.hull);
    let txt = tag + " \u2014 " + e.hull + " Hull";
    if (e.disable) {
      const knocked = [];
      if (S.bridge > 0) { S.bridge = 0; knocked.push("bridge"); }
      S.thr.forEach((v, j) => { if (v > 0) { S.thr[j] = 0; knocked.push("thr" + j); } });
      if (shipDCActive(U, S)) knocked.forEach(k => { S.rep[k] = 2; });
      txt += ", Bridge and both Thrusters disabled" + (knocked.length && shipDCActive(U, S) ? " (Damage Control: back in 2 turns)" : "");
    }
    logEv(uid, txt, "bad");
    if (hullWas > 0 && st.hp.hull === 0) {
      logEv(uid, "DESTROYED", "bad", "ship0:hull");
      if (S.carry.length) { const shipR = CUR; setTimeout(() => openDisembark(shipR), 60); }
    }
    shipCommit();
    return;
  }
  const dmg = NUKE.suit[i];
  if (isSquad(U)) {
    logEv(CUR.uid, tag + " \u2014 every soldier caught in the blast takes " + dmg, "bad");
    if (dmg >= 6) sqCasualtyPicker(sqAlive(CUR.st), "Nuclear blast: " + dmg + " damage kills every soldier caught inside \u2014 pick each one (tap Later to stop).");
    else mpToast("Apply " + dmg + " damage to each soldier caught in the blast on the Soldiers tab.");
    return;
  }
  if (isGround(U)) {
    const was = CUR.st.hp.hp; CUR.st.hp.hp = Math.max(0, was - dmg);
    aggDmg(CUR.uid, "gv:hp", "HP", was - CUR.st.hp.hp, CUR.st.hp.hp, U.hp);
    logEv(CUR.uid, tag + " \u2014 " + dmg + " damage", "bad");
    if (was > 0 && CUR.st.hp.hp === 0) { logEv(CUR.uid, "DESTROYED \u2014 respawns from the " + U.respawn, "bad", "gv0"); if (gvCarry(CUR).length) { const vr = CUR; setTimeout(() => openVehicleDisembark(vr), 60); } }
    gvCommit(); return;
  }
  LIMB_ORDER.forEach(k => { hp[k] = Math.max(0, hp[k] - dmg); });
  logEv(CUR.uid, tag + " \u2014 " + dmg + " damage to all 6 locations", "bad");
  draw(); save();
}

// an ability that switches itself on from the unit's own state (EXAM: shield destroyed)
function autoOn(a, u, st) {
  if (!a || a.kind !== "auto" || !st) return false;
  if (a.trigger === "shieldDown") {
    const n = (u.shields || []).length;
    if (!n || !Array.isArray(st.sh)) return false;
    return u.shields.every((_, j) => st.sh[j] === 0 || (st.shDown && st.shDown[j] === -1));
  }
  return false;
}
let examCheck = {};   // uid -> true (berserk) / false (passed); cleared at End Turn

// was this ability switched on during the half-turn we are in now?
const sameHalf = x => !!(x && x.r === turn.round && x.p === turn.phase);
// after an undo: bring the saved copy up to date so the change tracker logs nothing
function quietDraw() { persist(); snaps[CUR.uid] = snapOf(CUR); draw(); }
function actStore() { if (!CUR.st.act || typeof CUR.st.act !== "object") CUR.st.act = {}; return CUR.st.act; }
// Dual-Wield Matrix: which pair is drawn, and how many parries it has left
const mxOpt = (a, id) => (a.options || []).find(o => o.id === id) || null;
// two-mode abilities (Delta Zayin): each mode's use refills at its own point in the round
function refillDual(u, st, when) {
  u.abilities.forEach((a, i) => {
    const t = st.track && st.track[i];
    if (a.kind !== "dualmode" || !t) return;
    const m = a.modes.find(x => x.id === t.mode);
    if (m && m.refill === when) t.n = 1;
  });
}
function refillMatrix(u, st) {
  u.abilities.forEach((a, i) => {
    const t = st.track && st.track[i];
    if (a.kind === "matrix" && t && t.sel) { const o = mxOpt(a, t.sel); t.p = o ? o.parries : 0; }
  });
}
window.openMatrix = i => {
  const a = U.abilities[i], cur = track[i] && track[i].sel;
  $("pickT").textContent = a.name + " \u2014 pick a pair";
  const cost = (a.fx && a.fx.ap) || 0;
  $("pickS").innerHTML = "Pick the pair " + (U.short || U.name) + " is holding. Drawing a pair costs <b>" + cost + " AP</b> \u2014 you have <b>" + ap + "</b>." +
    (ap < cost ? " <span style='color:#fca5a5'>Not enough AP to draw a new pair.</span>" : "") + " Changing pair refills its parries.";
  const lst = $("picklist"); lst.innerHTML = "";
  const add = (id, name, desc) => {
    const d = el("div", "row");
    d.innerHTML = '<span style="min-width:0;flex:1"><div class="nm">' + name + '</div><div class="tr" style="white-space:normal">' + desc + '</div></span>' +
      (cur === id ? '<span class="qty">\u2713</span>' : (id !== null && cost ? '<span class="dp" style="font-size:13px">' + cost + ' AP</span>' : ''));
    const short = id !== null && id !== cur && ap < cost;
    if (short) { d.style.opacity = ".45"; d.style.cursor = "not-allowed"; }
    d.onclick = () => {
      if (id === cur) { closePicker(); return; }
      if (short) return;                                   // cannot afford to draw it
      const o = mxOpt(a, id), prev = track[i] || { sel: null, p: 0 };
      if (id === null) { track[i] = { sel: null, p: 0 }; }   // putting the blades away is free
      else {
        ap -= cost;
        track[i] = { sel: id, p: o ? o.parries : 0,
                     u: { r: turn.round, p: turn.phase, ap: cost, prevSel: prev.sel || null, prevP: prev.p || 0 } };
      }
      closePicker(); active = null; draw();
    };
    lst.appendChild(d);
  };
  (a.options || []).forEach(o => add(o.id, o.name, o.desc));
  add(null, "No pair", "Single weapon at its listed stats \u2014 no parries");
  $("pick").classList.add("on");
};

// the always-visible undo arrow shown beside anything switched on this half-turn
function undoArrow(fn) {
  const c = el("div", "undoA", { borderRadius: "5px", padding: "2px 7px", fontWeight: "900",
    fontSize: "clamp(4px,1.7cqw,23px)", border: "2px solid #3b82f6", background: "rgba(255,255,255,.96)",
    color: "#1e3a8a", cursor: "pointer", lineHeight: "1.15" });
  c.textContent = "\u21B6";
  c.title = "Undo \u2014 switched on by mistake? Puts the charge, AP and Dodges back and removes it from the timeline";
  c.onclick = e => { e.stopPropagation(); fn(); };
  return c;
}
// target number for an escalating risk check: 6+ on the first turn, +2 each turn after
function riskTarget(cfg, n) { return cfg.start + cfg.step * Math.max(0, (n || 1) - 1); }

// turns of penalty a mode leaves behind when it ends (Trans-Am burnout)
function burnTurns(a) { return (a && a.fx && a.fx.burnout && a.fx.burnout.turns) || 0; }
// burnout started during the enemy's turn must still cover the unit's own next turn,
// so it survives one extra Start My Turn
function burnFor(a) { const b = burnTurns(a); return b ? b + (turn.phase === "enemy" ? 1 : 0) : 0; }

// is an ability gated behind another one being switched on?
function abilityLocked(a, abilities, trackArr) {
  if (!a || !a.requires) return false;
  const rq = abilities.findIndex(x => x.name.indexOf(a.requires) === 0 || x.name === a.requires);
  if (rq < 0) return false;
  const rs = trackArr[rq];
  return !((abilities[rq] || {}).kind === "mode" ? !!(rs && rs.on) : rs === 1);
}

function draw() {
  if (U && isShip(U)) { drawShip(); return; }
  if (U && isGround(U)) { if (isSquad(U)) drawSquad(); else drawGround(); return; }
  $("sheet").classList.remove("shipsheet");
  $("rulesBtn").style.display = "none";
  $("sheet").classList.toggle("st-noattack", !!CUR && stanceOf(CUR.st) === "boost");
  $("sheet").classList.remove("sqcompact");
  updateStanceBtn();
  [...$("sheet").querySelectorAll(".sx")].forEach(n => n.remove());
  persist();
  trackChanges();
  const LIVE = { sh: sh, shDown: shDown };   // this unit's shields, safe from the local names below
  const shMx = j => (Array.isArray(shMax) && shMax[j]) || ((U.shields || [])[j] || {}).hp || 0;
  const sheet = $("sheet");
  [...sheet.querySelectorAll(".hp,.grp,.tog,.step,.wrow,.txt,.num,.wpip,.sendbtn,.lenttag,.podstate,.arcring,.arcrot,.qa,.aphit,.swapz,.hudwarn,.porthit")].forEach(n => n.remove());
  renderAmounts();
  $("uname").textContent = U.short || U.name;
  $("umeta").textContent = U.tier + " · " + U.dp + " DP";
  const now = LIMB_ORDER.reduce((s, k) => s + hp[k], 0);
  const max = LIMB_ORDER.reduce((s, k) => s + U.limb[k], 0);
  $("total").textContent = "HP " + now + "/" + max;
  $("dead").style.display = hp[U.kill || "chest"] === 0 ? "flex" : "none";
  $("dead").firstElementChild.textContent = (U.kill === "head" && hp.head === 0) ? "DESTROYED \u2014 HEAD HIT" : "DESTROYED";

  const openPop = (title, kind, stats, body) => {
    $("popT").textContent = title; $("popK").textContent = kind || "";
    $("popS").innerHTML = stats || ""; $("popB").textContent = body || "No description recorded.";
    $("pop").classList.add("on");
  };
  window.closePop = () => $("pop").classList.remove("on");

  // shrink an element's font until its text genuinely fits, measured not estimated
  // shrink until the text fits, expressed in cqw so it keeps scaling with the sheet
  const shrinkToFit = (e, minCqw, twoLine) => {
    if (!e) return e;
    const SW = sheet.clientWidth || 1;
    // measure the real text width: rounded pixel sizes can hide a sub-pixel overflow that still shows "..."
    const textW = () => { const rg = document.createRange(); rg.selectNodeContents(e); return rg.getBoundingClientRect().width; };
    const over = () => twoLine ? (e.scrollHeight > e.clientHeight + 1)
                               : (textW() > e.getBoundingClientRect().width + 0.05);
    for (let i = 0; i < 14; i++) {
      if (!e.clientWidth || !over()) break;
      const curCqw = parseFloat(getComputedStyle(e).fontSize) / SW * 100;
      const next = Math.max(minCqw || 0.85, curCqw * 0.93);
      if (Math.abs(next - curCqw) < 0.005) break;
      e.style.fontSize = next.toFixed(3) + "cqw";
    }
    return e;
  };

  const T = (x, y, txt, sz, cls, w) => {
    const e = el("div", "txt " + (cls || ""), { left: x + "%", top: y + "%", fontSize: `clamp(${sz[0]}px,${sz[1]}cqw,${sz[2]}px)` });
    if (w) e.style.maxWidth = w + "%";
    e.textContent = txt; sheet.appendChild(e); return e;
  };

  // effects from passives + anything currently switched on
  let dodgeMax = U.dodges, apMax = U.ap, rollMod = 0, rollTemp = false, dodgeMod = 0, dodgeTemp = false, meleeCharge = 0;
  let apTemp = false, dodgeCountTemp = false;
  let meleeRoll = 0, chargeRange = 0, meleeDmg = null, stealth = 0, moveCap = 0, rangedPlus = 0, tags = [];
  let baseMove = parseInt(U.move, 10), moveNow = baseMove, moveBoosted = false;
  U.abilities.forEach((a, i) => {
    const fx = a.fx; if (!fx) return;
    const passive = a.kind === "none";
    const on = passive || (a.kind === "mode" && track[i] && track[i].on) || (a.kind === "toggle" && track[i] === 1)
      || (a.kind === "auto" && autoOn(a, U, LIVE));
    if (!on) return;
    if (fx.dodgesSet !== undefined) { dodgeMax = fx.dodgesSet; if (!passive) dodgeCountTemp = true; }
    if (fx.dodgesPlus) { dodgeMax += fx.dodgesPlus; if (!passive) dodgeCountTemp = true; }
    if (fx.apPlus) { apMax += fx.apPlus; if (!passive) apTemp = true; }
    if (fx.moveSet) { moveNow = fx.moveSet; if (!passive) moveBoosted = true; }
    else if (fx.movePlus) { moveNow += fx.movePlus; if (!passive) moveBoosted = true; }
    if (fx.rollPlus) { rollMod += fx.rollPlus; if (!passive) rollTemp = true; }
    if (fx.dodgeMod) { dodgeMod += fx.dodgeMod; if (!passive) dodgeTemp = true; }
    if (fx.meleeCharge && !passive) meleeCharge += fx.meleeCharge;
    if (fx.rangedPlus && !passive) rangedPlus += fx.rangedPlus;
    if (fx.tag && !passive) tags.push(fx.tag);
    if (fx.meleeRoll && !passive) meleeRoll += fx.meleeRoll;
    if (fx.chargeRange && !passive) chargeRange += fx.chargeRange;
    if (fx.meleeDmg && !passive) meleeDmg = fx.meleeDmg;
    if (fx.stealth && !passive) { stealth = fx.stealth; moveCap = fx.moveCap || 0; }
  });
  // burnout left behind by a mode that has ended
  const burnNotes = [];
  U.abilities.forEach((a, i) => {
    const st = track[i];
    if (a.kind === "mode" && st && !st.on && st.burn > 0 && a.fx && a.fx.burnout) {
      rollMod += a.fx.burnout.rollPlus || 0;
      burnNotes.push(a.name.toUpperCase() + " BURNOUT \u2014 " + (a.fx.burnout.rollPlus || 0) + " to every roll");
    }
  });
  // ---- destruction effects (Section 3, Destruction Effects) ----
  const GUNDAM_TIER = ["Flagship", "Super Flagship", "Superweapon", "Myth", "Unknown Class"];
  // a unit whose kill location is the Head takes the sensor debuff on the Chest instead
  const killLoc = U.kill || "chest";
  const debuffLoc = killLoc === "head" ? "chest" : "head";
  const headGone = hp[debuffLoc] === 0;
  const legsGone = (hp.leftLeg === 0 ? 1 : 0) + (hp.rightLeg === 0 ? 1 : 0);
  const armsGone = (hp.leftArm === 0 ? 1 : 0) + (hp.rightArm === 0 ? 1 : 0);
  const isGundamTier = GUNDAM_TIER.indexOf(U.tier) >= 0;
  const down = armsGone === 2 && legsGone === 2 && hp[killLoc] > 0 && !headGone;
  if (headGone) {
    rollMod -= 2;                                  // -2 to every roll; shown in the status strip, not as a badge
    if (isGundamTier) dodgeMax = 0;                // no Free Dodges at all
  }
  if (legsGone === 2) moveNow = 0;
  else if (legsGone === 1) moveNow = Math.floor(moveNow / 2);
  const catapult = CUR && catapultActive(CUR.uid);
  if (catapult && moveNow > 0) { moveNow += 10; moveBoosted = true; }
  const stanceK = CUR ? stanceOf(CUR.st) : null;
  if (stanceK === "boost" && moveNow > 0 && !catapult) { moveNow += 10; moveBoosted = true; }

  // a dropped maximum must pull the live value down with it
  if (dodges > dodgeMax) dodges = dodgeMax;
  if (ap > apMax) ap = apMax;

  const uname = U.short || U.name;
  const une = T(COL.nameX, COL.nameY, uname, [4, 2.15, 30], "txtL unitname", 21.2);   // stops short of the portrait
  une.style.height = "6.2%";                       // its own band (y 8.6-14.8), clear of the DP line
  shrinkToFit(une, 1.0, true);
  shrinkToFit(T(COL.dpX, COL.dpY, "DP: " + U.dp, [4, 1.30, 17], "txtL dpline", 21.2), 0.85);
  const mv = T(COL.moveX, COL.moveY, moveNow + "cm", [4, 2.0, 28], "");
  if (moveBoosted) { mv.style.color = "#6d28d9"; mv.style.fontWeight = "800"; }
  // only show a dodge modifier that something has switched ON.
  // a permanent one is already stated in its ability row, and a bare "-2"
  // reads like the head-destroyed penalty rather than an advantage.
  // active buffs collected into one strip, like the red damage strip below it
  const buffNotes = [];
  if (catapult) buffNotes.push("\u{1F680} CATAPULT LAUNCH \u2014 FREE BOOST, MAY ATTACK");
  if (stanceK === "boost") buffNotes.push("\u00BB BOOST STANCE \u2014 +10cm/AP \u00b7 NO ATTACKS THIS TURN");
  if (stanceK === "boost") {                                   // lay a lock over the weapons table
    const lk = el("div", "txt stlock", { left: "3.4%", top: "58.2%", width: "38.35%", height: "33%" });
    lk.innerHTML = "<span>\u00BB BOOST \u2014 NO ATTACKS THIS TURN</span>";
    sheet.appendChild(lk);
  }
  if (stanceK === "focus") buffNotes.push("\u25CE FOCUS \u2014 CALLED SHOTS NO +5 \u00b7 NO DODGE UNTIL YOUR NEXT TURN");
  if (stanceK === "defense") buffNotes.push("\u{1F6E1} DEFENSE \u2014 MAY INTERCEPT FOR AN ALLY WITHIN 30cm (NO DODGE)");
  if (stanceK === "overwatch") buffNotes.push("\u{1F441} OVERWATCH \u2014 10cm LINE \u00b7 FREE REACTION SHOT");
  if (moveBoosted) buffNotes.push("MOVE " + moveNow + "cm");
  if (apTemp) buffNotes.push("AP " + apMax);
  if (dodgeCountTemp) buffNotes.push("DODGES " + dodgeMax);
  if (dodgeMod && dodgeTemp) buffNotes.push("DODGE " + dodgeMod);
  if (rollMod && rollTemp) buffNotes.push("ROLLS " + (rollMod > 0 ? "+" : "") + rollMod);
  if (rangedPlus) buffNotes.push("RANGED +" + rangedPlus);
  tags.forEach(t => buffNotes.push(t));
  U.abilities.forEach((a, i) => {
    if (a.kind !== "dualmode") return;
    const t = track[i], m = t && a.modes.find(x => x.id === t.mode);
    if (m) buffNotes.push(t.n > 0 ? m.strip : m.stripUsed);
  });
  U.abilities.forEach((a, i) => {
    if (a.kind !== "matrix") return;
    const o = mxOpt(a, track[i] && track[i].sel);
    if (o) buffNotes.push(o.strip);
  });
  if (meleeCharge) buffNotes.push("MELEE CHARGE " + meleeCharge);
  if (meleeRoll) buffNotes.push("MELEE ROLL +" + meleeRoll);
  if (chargeRange) buffNotes.push("CHARGE +" + chargeRange + "cm");
  if (meleeDmg) buffNotes.push("MELEE " + meleeDmg);
  if (stealth) buffNotes.push("STEALTH " + stealth + "cm \u00b7 MOVE CAP " + moveCap + " AP");
  const autoLive = U.abilities.find(x => x.kind === "auto" && autoOn(x, U, LIVE));
  if (autoLive && U.kill !== "head") {
    const eb = T(LIMB_POS_DEFAULT.head.x, 9.6, "\u25C9 " + autoLive.name.split(" ")[0].toUpperCase() + " ACTIVE", [4, 1.2, 15], "");
    Object.assign(eb.style, { color: "#fff", fontWeight: "800", background: "rgba(185,28,28,.95)",
      padding: "0.15em 0.55em", borderRadius: "0.3em", border: "1px solid #fecaca", zIndex: 7, letterSpacing: ".05em" });
    eb.title = "Optical sensors glowing red \u2014 " + autoLive.name + " is running";
  }
  if (buffNotes.length) {
    const bs = T(24, 9.3, buffNotes.join("   \u00b7   "), [4, 1.25, 16], "");
    bs.style.color = "#ede9fe";
    bs.style.fontWeight = "800";
    bs.style.background = "rgba(76,29,149,.92)";
    bs.style.padding = "0.22em 0.6em";
    bs.style.borderRadius = "0.3em";
    bs.style.border = "1px solid #a78bfa";
    bs.style.maxWidth = "37%";
    bs.style.zIndex = 8;
    shrinkToFit(bs, 0.7);
  }


  const skillAP = [], weapAP = [];
  // this half-turn's taps on AP values, newest last, so each row can be undone
  const actLog = () => {
    let L = CUR.st.wf;
    if (!L || !sameHalf(L)) L = CUR.st.wf = { r: turn.round, p: turn.phase, st: [] };
    return L;
  };
  const logAct = (t, i) => {
    const L = actLog(), mine = L.st.filter(x => x.t === t && x.i === i);
    const n = mine.length, spent = mine.reduce((m, x) => m + x.ap, 0);
    const nm = t === "w" ? U.weapons[i].name : U.abilities[i].name;
    qaLog(CUR.uid, "act:" + t + i, n, nm + (t === "w" ? " fired" : " used") + (n > 1 ? " " + n + "\u00d7" : "") + " (" + spent + " AP)");
  };
  const quietAct = () => { persist(); snaps[CUR.uid] = snapOf(CUR); draw(); save(); };
  U.abilities.forEach((a, i) => {
    if (i >= SKILL_Y.length) return;
    const reqUnmet = abilityLocked(a, U.abilities, track);
    const sn = T(COL.skillName, SKILL_Y[i], a.name, [5, 2.0, 28], "txtL", 15.2);
    shrinkToFit(sn, 0.7);
    sn.style.pointerEvents = "auto"; sn.style.cursor = "pointer";
    if (reqUnmet) sn.style.opacity = ".45";
    if (a.kind === "auto" && autoOn(a, U, LIVE)) {
      Object.assign(sn.style, { color: "#fff", background: "rgba(185,28,28,.92)", borderRadius: "0.25em",
        padding: "0 0.3em", fontWeight: "800" });
      sn.title = a.name + " is ACTIVE \u2014 stays on until the shield is repaired";
    }
    sn.onclick = () => openPop(a.name, a.kind === "mode" ? "Form \u00b7 " + a.duration + (a.duration === 1 ? " turn" : " turns") + " \u2014 each lasts through the enemy's turn"
      : a.tracks === "pool" ? "Armour pool \u00b7 " + a.max
      : a.tracks === "charges" ? "Ability \u00b7 " + a.max + " charges"
      : a.kind === "toggle" ? "Toggle" : a.kind === "auto" ? "Automatic \u00b7 triggers when the shield is destroyed"
      : a.popKind ? a.popKind
      : a.kind === "dualmode" ? "Two modes \u00b7 " + ((a.fx && a.fx.ap) || 0) + " AP to switch \u00b7 tap the mode button"
      : a.kind === "matrix" ? "Weapon pairs \u00b7 tap SELECT to choose"
      : a.kind === "pod" ? "Remote pod \u00b7 " + ((U.pods || {}).hp || "") + " HP \u00b7 tap its state to cycle" : "Passive", "", a.text);
    const fx = a.fx || {};
    const labelCost = a.apText && /AP/.test(a.apText) && apOptions(a.apText).length === 1 ? apOptions(a.apText)[0] : undefined;
    const cost = fx.ap !== undefined ? fx.ap : (a.kind === "none" ? labelCost : undefined);
    const apTxt = a.apText ? a.apText : cost === "all" ? "All AP" : cost === 0 ? "Free"
      : (cost ? cost + " AP" : (a.kind === "none" ? "Free" : a.kind === "auto" ? "Auto" : a.kind === "matrix" ? "2 AP" : "\u2014"));
    const ae = T(COL.skillAP, SKILL_Y[i], apTxt, [5, 1.9, 26], "", 5.3);
    shrinkToFit(ae, 0.7);
    if (reqUnmet) ae.style.opacity = ".45";
    skillAP[i] = ae;
    if (typeof cost === "number" && cost > 0 && a.kind === "none") {
      // a reminder skill with a cost: tapping spends it, with an undo
      ae.classList.add("aptap");
      if (ap < cost) ae.classList.add("cant");
      ae.onclick = () => {
        if (ap < cost) return;
        const L = actLog();
        L.st.push({ t: "s", i: i, ap: cost });
        ap -= cost; logAct("s", i); quietAct();
      };
      ae.title = ap >= cost ? "Tap to use \u2014 spends " + cost + " AP" : "Not enough AP";
    }
    if (a.kind === "none") shrinkToFit(T(COL.skillCD, SKILL_Y[i], a.cdText || "\u2014", [5, a.cdText ? 1.55 : 1.9, 26], "", 12), 0.7);
  });

  U.weapons.forEach((w, wi) => {
    const wn = T(COL.wName, w.y, w.name, [5, 2.0, 28], "txtL", 15.2);
    const paired = U.abilities.some((a, i) => a.kind === "matrix" && (mxOpt(a, track[i] && track[i].sel) || { weapons: [] }).weapons.indexOf(w.name) >= 0);
    if (paired) { wn.style.color = "#6d28d9"; wn.style.fontWeight = "900"; }
    shrinkToFit(wn, 0.7);
    wn.style.pointerEvents = "auto"; wn.style.cursor = "pointer";
    // Spray and Pray lives in the skill rows (see the weapon's popup)
    wn.onclick = () => openPop(w.name, "Weapon",
      "<span>Damage <b>" + (w.dmg || "\u2014") + "</b></span><span>AP <b>" + (w.ap || "\u2014")
      + "</b></span><span>Range <b>" + (w.range || "\u2014") + "</b></span>"
      + (w.limit ? "<span>Limit <b>" + (w.limit.kind === "cooldown"
          ? w.limit.turns + "-turn cooldown" : w.limit.max + " charges") + "</b></span>" : "")
      + (w.spray ? "<span>Spray &amp; Pray <b>" + (w.spray === "beam" ? "3 dmg \u00b7 3 AP" : "2 dmg \u00b7 2 AP") + "</b></span>" : ""),
      w.text);
    const bi = w.boost ? U.abilities.findIndex(x => x.name === w.boost.when) : -1;
    const boosted = bi >= 0 && autoOn(U.abilities[bi], U, LIVE);
    const wd = T(COL.wDmg, w.y, boosted ? w.boost.dmg : w.dmg, [5, 1.9, 26], "");
    if (boosted) { wd.style.color = "#6d28d9"; wd.style.fontWeight = "900"; wd.title = w.boost.note || ""; }
    wd.style.maxWidth = "5.2%"; shrinkToFit(wd, 0.62);        // long damage values stay inside the DMG column
    weapAP[wi] = T(COL.wAP, w.y, w.ap, [5, 1.9, 26], "");
    shrinkToFit(T(COL.wRange, w.y, w.range, [5, 1.7, 24], "", 9), 0.8);
  });

  U.abilities.forEach((a, i) => {
    if (a.kind === "none" || a.kind === "pod" || i >= SKILL_Y.length) return;
    const y = SKILL_Y[i];
    if (a.kind === "auto") {
      const live = autoOn(a, U, LIVE);
      const g = el("div", "grp", { left: COL.skillCD + "%", top: y + "%" });
      const chip = (txt, bg, fg, bd, fn, tip) => {
        const c = el("div", null, { borderRadius: "5px", padding: "2px 8px", fontWeight: "800",
          fontSize: "clamp(4px,1.6cqw,22px)", border: "2px solid " + bd, background: bg, color: fg,
          cursor: fn ? "pointer" : "default", whiteSpace: "nowrap" });
        c.textContent = txt; if (tip) c.title = tip;
        if (txt === "\u21B6") c.classList.add("undoA");
        if (fn) c.onclick = e => { e.stopPropagation(); fn(); };
        g.appendChild(c); return c;
      };
      if (!live) {
        chip("STANDBY", "rgba(255,255,255,.92)", "#475569", "#94a3b8", null,
          "Switches on by itself the moment the shield is destroyed");
      } else if (a.berserk && active === "exam" + i) {
        // asking for the physical d20 result
        chip(a.berserk.fail, "rgba(153,27,27,.95)", "#fee2e2", "#ef4444",
          () => { examCheck[CUR.uid] = true; active = null; draw(); }, "Rolled " + a.berserk.fail + " \u2014 berserk");
        chip("4+", "rgba(22,101,52,.95)", "#dcfce7", "#22c55e",
          () => { examCheck[CUR.uid] = false; active = null; draw(); }, "Rolled 4 or higher \u2014 attack as intended");
      } else {
        // the ability name itself turns red to show it is running; one button keeps the row narrow
        if (a.berserk) chip("CHECK " + a.berserk.die, "rgba(185,28,28,.95)", "#fff", "#ef4444",
          () => { active = "exam" + i; clearTimeout(timer); draw(); },
          "Starting a melee? Roll a " + a.berserk.die + " and enter the result");
      }
      sheet.appendChild(g);
      return;
    }
    if (a.kind === "dualmode") {
      const t = track[i], m = a.modes.find(x => x.id === t.mode) || a.modes[0];
      const other = a.modes.find(x => x.id !== m.id);
      const cost = (a.fx && a.fx.ap) || 0, id = "dm" + i, shw = active === id;
      const hue = m.id === "cannon" ? ["#ea580c", "#fed7aa"] : ["#0891b2", "#cffafe"];
      const g = el("div", "grp", { left: COL.skillCD + "%", top: y + "%" });
      const mb = el("div", null, { borderRadius: "5px", padding: "2px 8px", fontWeight: "900", whiteSpace: "nowrap",
        fontSize: "clamp(4px,1.6cqw,22px)", cursor: "pointer", border: "2px solid " + hue[0], background: hue[0], color: "#fff" });
      mb.textContent = m.label + " \u21C4";
      mb.title = m.tip + "\nTap to switch to " + other.label + " (" + cost + " AP).";
      mb.dataset.act = i;                                   // tapping the AP switches mode too
      mb.onclick = e => {
        e.stopPropagation();
        if (ap < cost) return;
        const prev = { mode: t.mode, n: t.n };
        ap -= cost;
        track[i] = { mode: other.id, n: 1, u: { r: turn.round, p: turn.phase, ap: cost, prev: prev } };
        active = null; draw();
      };
      g.appendChild(mb);
      const col = t.n > 0 ? hue[0] : "#64748b";
      const mi = el("div", "step" + (shw ? " show" : ""), { borderColor: col, color: col });
      mi.textContent = "\u2212"; mi.title = "Use the " + m.use;
      mi.onclick = e => { e.stopPropagation(); t.n = 0; wake(id); };
      const n = el("div", "num", { borderColor: col, cursor: "pointer", minWidth: "2.2em",
        background: t.n > 0 ? hue[1] : "rgba(100,116,139,.92)", color: t.n > 0 ? "#0f172a" : "#e2e8f0",
        boxShadow: shw ? "0 0 0 2px " + col + "66" : "none" });
      n.innerHTML = t.n + "<small>/1</small>";
      n.title = (m.id === "cannon" ? "Bonus shot" : "Free block") + (t.n > 0 ? " available" : " used") + " \u2014 tap for \u2212/+";
      n.onclick = () => wake(id);
      const pl = el("div", "step" + (shw ? " show" : ""), { borderColor: col, color: col });
      pl.textContent = "+"; pl.title = "Give it back";
      pl.onclick = e => { e.stopPropagation(); t.n = 1; wake(id); };
      g.append(mi, n, pl);
      if (sameHalf(t.u)) g.appendChild(undoArrow(() => {
        const u0 = t.u;
        ap = Math.min(apMax, ap + (u0.ap || 0));
        track[i] = { mode: u0.prev.mode, n: u0.prev.n };
        active = null;
        unlog(CUR.uid, "ab:" + i + ":mode");
        quietDraw();
      }));
      sheet.appendChild(g);
      return;
    }
    if (a.kind === "matrix") {
      const t = track[i] || { sel: null, p: 0 }, o = mxOpt(a, t.sel), id = "mx" + i, shw = active === id;
      const g = el("div", "grp", { left: COL.skillCD + "%", top: y + "%" });
      const pick = el("div", null, { borderRadius: "5px", padding: "2px 9px", fontWeight: "800",
        fontSize: "clamp(4px,1.7cqw,23px)", cursor: "pointer", whiteSpace: "nowrap",
        border: "2px solid " + (o ? "#a78bfa" : "#94a3b8"),
        background: o ? "#a78bfa" : "rgba(255,255,255,.92)", color: o ? "#1e1b4b" : "#475569" });
      pick.textContent = o ? "\u21C4 " + o.label : "SELECT";
      pick.title = o ? o.name + " \u2014 tap to change pair" : "Pick which pair of weapons is drawn";
      pick.onclick = e => { e.stopPropagation(); openMatrix(i); };
      pick.dataset.act = i;
      g.appendChild(pick);
      if (o && o.parries) {
        const col = t.p === 0 ? "#64748b" : "#16a34a";
        const m = el("div", "step" + (shw ? " show" : ""), { borderColor: col, color: col });
        m.textContent = "\u2212"; m.title = "Spend a parry";
        m.onclick = e => { e.stopPropagation(); t.p = Math.max(0, t.p - 1); wake(id); };
        const n = el("div", "num", { borderColor: col, cursor: "pointer",
          background: t.p === 0 ? "rgba(100,116,139,.92)" : "rgba(220,252,231,.97)",
          color: t.p === 0 ? "#e2e8f0" : "#14532d", boxShadow: shw ? "0 0 0 2px " + col + "66" : "none" });
        n.innerHTML = t.p + "<small>/" + o.parries + "</small>";
        n.title = "Parries left this segment \u2014 tap for \u2212/+. Refills when a turn ends or starts.";
        n.onclick = () => wake(id);
        const p = el("div", "step" + (shw ? " show" : ""), { borderColor: col, color: col });
        p.textContent = "+"; p.title = "Give a parry back";
        p.onclick = e => { e.stopPropagation(); t.p = Math.min(o.parries, t.p + 1); wake(id); };
        g.append(m, n, p);
      } else if (o && o.tag) {
        const n = el("div", "num", { borderColor: "#a78bfa", cursor: "default", background: "rgba(255,255,255,.96)", color: "#4c1d95" });
        n.textContent = o.tag;
        g.appendChild(n);
      }
      if (o && sameHalf(t.u)) {
        g.appendChild(undoArrow(() => {
          const u0 = t.u;
          ap = Math.min(apMax, ap + (u0.ap || 0));
          track[i] = { sel: u0.prevSel, p: u0.prevP };
          active = null;
          unlog(CUR.uid, "ab:" + i + ":sel");
          quietDraw();
        }));
      }
      sheet.appendChild(g);
      return;
    }
    if (a.kind === "toggle" && a.fx && a.fx.risk) {
      const R = a.fx.risk, on = track[i] === 1, r = risk[i] || { n: 0 };
      const g = el("div", "grp", { left: COL.skillCD + "%", top: y + "%" });
      const chip = (txt, bg, fg, bd, fn, tip) => {
        const c = el("div", null, { borderRadius: "5px", padding: "2px 8px", fontWeight: "800",
          fontSize: "clamp(4px,1.6cqw,22px)", border: "2px solid " + bd, background: bg, color: fg,
          cursor: fn ? "pointer" : "default", whiteSpace: "nowrap" });
        c.textContent = txt; if (tip) c.title = tip;
        if (txt === "\u21B6") c.classList.add("undoA");
        if (fn) c.onclick = e => { e.stopPropagation(); fn(); };
        g.appendChild(c); return c;
      };
      const tgt = riskTarget(R, r.n);
      const A = (CUR.st.act || {})[i];
      // only the very first check, still unanswered, can be undone as a mis-tap
      const canUndo = on && r.pend && r.n === 1 && sameHalf(A);
      const undoRisk = () => {
        if (A && typeof A.dodges === "number") dodges = A.dodges;
        track[i] = 0; delete risk[i]; delete actStore()[i]; active = null;
        unlog(CUR.uid, "ab:" + i);
        quietDraw();
      };
      const undoMini = () => { if (canUndo) chip("\u21B6", "rgba(255,255,255,.96)", "#1e3a8a", "#3b82f6", undoRisk,
        "Mis-tap \u2014 switch it back off with no check and remove it from the timeline"); };
      if (!on) {
        chip("OFF", "rgba(255,255,255,.92)", "#475569", "#94a3b8", () => {
          actStore()[i] = { r: turn.round, p: turn.phase, ap: 0, dodges: dodges };
          track[i] = 1; risk[i] = { n: 1, pend: true, res: null };      // first check is due on activation
          if (a.fx.dodgesSet !== undefined) dodges = a.fx.dodgesSet;   // the extra Dodges arrive at once
          active = "risk" + i; clearTimeout(timer);                    // go straight to PASS / FAIL
          draw();
        }, "Switch on \u2014 free, any time on this unit's own turn. Roll the " + R.start + "+ check immediately");
        g.lastElementChild.dataset.act = i;
      } else if (r.pend && active === "risk" + i) {
        chip("PASS", "rgba(22,101,52,.95)", "#dcfce7", "#22c55e", () => {
          r.pend = false; r.res = "pass"; risk[i] = r; active = null; draw();
        }, "Rolled " + tgt + " or higher");
        chip("FAIL", "rgba(153,27,27,.95)", "#fee2e2", "#ef4444", () => {
          hp[R.loc] = Math.max(0, hp[R.loc] - R.dmg);
          r.pend = false; r.res = "fail"; risk[i] = r; active = null; draw();
        }, "Rolled under " + tgt + " \u2014 takes " + R.dmg + " " + LIMB_LABEL[R.loc] + " damage");
        undoMini();
      } else if (r.pend) {
        chip("CHECK " + tgt + "+", "rgba(185,28,28,.95)", "#fff", "#ef4444",
          () => { active = "risk" + i; clearTimeout(timer); draw(); },
          "Start of turn: roll a " + R.die + ", need " + tgt + "+ or take " + R.dmg + " " + LIMB_LABEL[R.loc] + " damage");
        undoMini();
      } else {
        chip("ACTIVE", "#a78bfa", "#1e1b4b", "#a78bfa", () => {
          track[i] = 0; delete risk[i]; delete actStore()[i]; draw();
        }, "Tap to switch off (free). Turning it back on means a fresh " + R.start + "+ check");
        const nx = riskTarget(R, r.n + 1);
        chip(nx + "+", "rgba(255,255,255,.96)", "#1e1b4b", "#a78bfa", null,
          "Next start-of-turn check needs " + nx + "+ (turn " + (r.n + 1) + " active)");
      }
      sheet.appendChild(g);
      return;
    }
    if (a.kind === "toggle") {
      const on = track[i] === 1;
      const t = el("div", "tog", { left: COL.skillCD + "%", top: y + "%",
        background: on ? "#a78bfa" : "rgba(255,255,255,.92)", color: on ? "#1e1b4b" : "#475569",
        borderColor: on ? "#a78bfa" : "#94a3b8" });
      t.textContent = on ? "ACTIVE" : "OFF";
      t.dataset.act = i;
      const A = (CUR.st.act || {})[i];
      const c = (a.fx && a.fx.ap) || 0;
      const switchOff = () => {
        if (c && ap < c) return;                 // cannot afford to switch either way
        if (c) ap -= c;                          // switching costs AP in both directions
        track[i] = 0; delete actStore()[i]; active = null; draw();
      };
      const undoToggle = () => {
        ap = Math.min(apMax, ap + (A.ap || 0));
        track[i] = 0; delete actStore()[i]; active = null;
        unlog(CUR.uid, "ab:" + i);
        quietDraw();
      };
      if (on && sameHalf(A)) {
        // switched on this half-turn: ACTIVE plus a visible undo arrow
        const g = el("div", "grp", { left: COL.skillCD + "%", top: y + "%" });
        const b2 = el("div", null, { borderRadius: "5px", padding: "2px 10px", fontWeight: "700",
          fontSize: "clamp(4px,1.9cqw,26px)", border: "2px solid #a78bfa", background: "#a78bfa", color: "#1e1b4b", cursor: "pointer" });
        b2.textContent = "ACTIVE";
        b2.onclick = switchOff;
        b2.dataset.act = i;                  // the \u21B6 beside it handles mis-taps
        g.append(b2, undoArrow(undoToggle));
        sheet.appendChild(g); return;
      }
      t.onclick = () => {
        if (on) { switchOff(); return; }
        if (c && ap < c) return;
        if (c) ap -= c;
        track[i] = 1;
        actStore()[i] = { r: turn.round, p: turn.phase, ap: c };
        draw();
      };
      sheet.appendChild(t); return;
    }
    if (a.kind === "mode") {
      const st = track[i], on = st.on, id = "m" + i, sh = active === id;
      const out = st.ch !== null && st.ch !== undefined && st.ch <= 0 && !on;
      const g = el("div", "grp", { left: COL.skillCD + "%", top: y + "%" });
      const t = el("div", null, { borderRadius: "5px", padding: "2px 9px", fontWeight: "700",
        fontSize: "clamp(4px,1.9cqw,26px)", cursor: out ? "not-allowed" : "pointer",
        border: "2px solid " + (on ? "#a78bfa" : out ? "#64748b" : "#94a3b8"),
        background: on ? "#a78bfa" : out ? "rgba(100,116,139,.9)" : "rgba(255,255,255,.92)",
        color: on ? "#1e1b4b" : out ? "#e2e8f0" : "#475569" });
      t.textContent = on ? "ACTIVE" : out ? "SPENT" : "OFF";
      const endMode = () => { track[i] = { on: false, left: a.duration, ch: st.ch, burn: burnFor(a) }; active = null; draw(); };
      const canUndo = on && sameHalf(st.u);
      const doUndo = () => {
        const U0 = st.u;
        ap = Math.max(0, ap + (U0.ap || 0) - (U0.apPlus || 0));
        dodges = U0.dodges;
        (U0.sh || []).forEach(x => { LIVE.sh[x.j] = x.v; LIVE.shDown[x.j] = x.d; });
        track[i] = { on: false, left: a.duration,
          ch: st.ch === null || st.ch === undefined ? st.ch : Math.min(a.charges || 99, st.ch + 1), burn: U0.burn || 0 };
        active = null;
        unlog(CUR.uid, "ab:" + i);
        quietDraw();
      };
      t.onclick = () => {
        const c = (a.fx && a.fx.ap) || 0;
        if (on) { endMode(); return; }         // the \u21B6 beside it handles mis-taps
        if (c && ap < c) return;
        if (st.ch !== null && st.ch !== undefined && st.ch <= 0) return;   // no charges left
        // remember exactly what switching on changed, so a mis-tap can be put back
        const U0 = { r: turn.round, p: turn.phase, ap: c, apPlus: (a.fx && a.fx.apPlus) || 0,
                     dodges: dodges, burn: st.burn || 0, sh: [] };
        if (c) ap -= c;
        if (a.fx) {
          if (a.fx.dodgesSet !== undefined) dodges = a.fx.dodgesSet;
          if (a.fx.dodgesPlus) dodges += a.fx.dodgesPlus;
          if (a.fx.apPlus) ap += a.fx.apPlus;
          if (a.fx.grantsShield) {
            // each activation grants a fresh field -- it never carries over
            (U.shields || []).forEach((cfg, j) => {
              if (cfg.when && a.name.indexOf(cfg.when) === 0) {
                U0.sh.push({ j: j, v: LIVE.sh[j], d: LIVE.shDown[j] });
                LIVE.sh[j] = shMx(j); LIVE.shDown[j] = 0;
              }
            });
          }
        }
        track[i] = { on: true, left: a.duration, ch: st.ch === null || st.ch === undefined ? null : st.ch - 1, u: U0 };
        draw();
      };
      if (!on && st.burn > 0) {
        // burnout replaces the OFF button until it wears off (tap to clear early)
        Object.assign(t.style, { borderColor: "#ef4444", background: "rgba(127,29,29,.95)",
          color: "#fecaca", cursor: "pointer" });
        t.textContent = "BURN";
        t.title = "Burnout \u2014 lasts through " + (st.burn > 1 ? "your next turn" : "this turn") + " (clears when your following turn starts). Tap to clear now.";
        t.onclick = e => { e.stopPropagation(); st.burn = 0; draw(); };
      }
      if (!on && !out && !(st.burn > 0)) t.dataset.act = i;   // tapping the AP switches it on
      g.appendChild(t);
      if (!on && st.ch !== null && st.ch !== undefined) {
        // not running -- what matters is how many activations are left
        const cc = el("div", "num", { borderColor: st.ch === 0 ? "#64748b" : "#a78bfa",
          background: st.ch === 0 ? "rgba(100,116,139,.92)" : "rgba(255,255,255,.96)",
          color: st.ch === 0 ? "#e2e8f0" : "#1e1b4b", cursor: "default", minWidth: "2.2em" });
        cc.innerHTML = st.ch + "<small>/" + a.charges + "</small>";
        cc.title = "activations left";
        g.appendChild(cc);
      }
      if (on) {
        const col = "#a78bfa";
        const m = el("div", "step" + (sh ? " show" : ""), { borderColor: col, color: col });
        m.textContent = "−"; m.onclick = e => { e.stopPropagation(); st.left = Math.max(0, st.left - 1);
          if (!st.left) track[i] = { on: false, left: a.duration, ch: st.ch, burn: burnFor(a) }; wake(id); };
        const n = el("div", "num", { borderColor: col, boxShadow: sh ? "0 0 0 2px " + col + "66" : "none" });
        n.innerHTML = st.left + "<small>/" + a.duration + "</small>";
        n.title = "turns remaining"; n.onclick = () => wake(id);
        const p = el("div", "step" + (sh ? " show" : ""), { borderColor: col, color: col });
        p.textContent = "+"; p.onclick = e => { e.stopPropagation(); st.left = Math.min(a.duration, st.left + 1); wake(id); };
        g.append(m, n, p);
        if (canUndo) g.appendChild(undoArrow(doUndo));
      }
      sheet.appendChild(g);
      return;
    }
    const locked = abilityLocked(a, U.abilities, track);
    const v = track[i], empty = v === 0;
    const col = locked ? "#475569" : empty ? "#64748b" : "#a78bfa";
    const sh = !locked && active === "a" + i;
    const g = el("div", "grp", { left: COL.skillCD + "%", top: y + "%" });
    const selfAll = (a.fx && a.fx.selfAll) || 0;
    const rawAp = a.fx && a.fx.ap;
    const fullTurn = rawAp === "all";
    const apCost = fullTurn ? Math.max(2, ap) : (rawAp || 0);
    const m = el("div", "step" + (sh ? " show" : ""), { borderColor: col, color: col });
    m.textContent = "−";
    if (a.tracks !== "pool") m.dataset.act = i;          // tapping the AP uses a charge
    m.title = fullTurn ? "Full-turn action \u2014 spends a charge and ALL remaining AP (min 2)"
      : apCost ? ("Use this ability \u2014 spends a charge and " + apCost + " AP") : "Spend a charge";
    m.onclick = e => {
      e.stopPropagation();
      if (locked) return;
      if (v > 0 && ap >= apCost) {
        track[i] = v - 1;
        if (fullTurn) ap = 0;                                       // full-turn action
        else if (apCost) ap -= apCost;
        if (selfAll) LIMB_ORDER.forEach(k => { hp[k] = Math.max(0, hp[k] - selfAll); });
      }
      wake("a" + i);
    };
    const n = el("div", "num", { borderColor: col, background: empty ? "rgba(100,116,139,.92)" : "rgba(255,255,255,.96)",
      color: empty ? "#e2e8f0" : "#1e1b4b", boxShadow: sh ? "0 0 0 2px " + col + "66" : "none" });
    n.innerHTML = v + "<small>/" + a.max + "</small>";
    n.onclick = () => { if (!locked) wake("a" + i); };
    const pl = el("div", "step" + (sh ? " show" : ""), { borderColor: col, color: col });
    pl.textContent = "+";
    pl.onclick = e => {
      e.stopPropagation();
      if (locked) return;
      if (v < a.max) {
        track[i] = v + 1;
        if (apCost) ap = Math.min(apMax, ap + apCost);
        if (selfAll) LIMB_ORDER.forEach(k => { hp[k] = Math.min(U.limb[k], hp[k] + selfAll); });  // undo
      }
      wake("a" + i);
    };
    if (locked) {
      g.style.opacity = ".42";
      n.title = "Requires " + a.requires + " to be active";
      n.style.cursor = "not-allowed";
    }
    if (selfAll) {
      n.title = (n.title || "") + "  \u2014 each use costs " + selfAll + " damage to ALL your own locations";
      n.style.boxShadow = (sh ? "0 0 0 2px " + col + "66, " : "") + "inset 0 0 0 2px rgba(239,68,68,.55)";
    }
    g.append(m, n, pl); sheet.appendChild(g);
  });

  // keep every ability control inside the Cooldown column (measured x 28.9-41.85 on all sheets)
  // so nothing spills left over the AP column
  const fitCD = () => {
    const CD_L = 28.9, CD_R = 41.85;
    const colPx = (CD_R - CD_L) / 100 * (sheet.clientWidth || 1) - 6;
    [...sheet.children]
      .filter(e => (e.classList.contains("grp") || e.classList.contains("tog")) && e.style.left === COL.skillCD + "%")
      .forEach(g => {
        if (!colPx || g.offsetWidth <= colPx) return;          // already fits (plain counters)
        const steps = [...g.children].filter(c => c.classList.contains("step"));
        if (steps.length) {                                    // +/- hang off the right, not the left
          const box = el("div", null, { position: "absolute", left: "calc(100% + 4px)", top: "50%",
            transform: "translateY(-50%)", display: "flex", gap: "4px" });
          steps.forEach(st => box.appendChild(st));
          g.appendChild(box);
        }
        g.style.left = ((CD_L + CD_R) / 2) + "%";
        const w = g.offsetWidth;
        if (w > colPx) g.style.transform = "translate(-50%,-50%) scale(" + (colPx / w).toFixed(3) + ")";
      });
  };
  fitCD();
  U.abilities.forEach((a, i) => {
    const ae = skillAP[i], ctl = sheet.querySelector('[data-act="' + i + '"]');
    if (!ae || !ctl || a.kind === "none" || ae.textContent === "\u2014") return;   // no cost shown: use the buttons
    ae.classList.add("aptap");
    const c = a.fx && typeof a.fx.ap === "number" ? a.fx.ap : 0;
    const used = a.kind === "counter" && track[i] === 0;
    if (used || abilityLocked(a, U.abilities, track) || (c && ap < c && !(a.kind === "toggle" && track[i] === 1))) ae.classList.add("cant");
    ae.title = "Tap to use (same as the button beside it)";
    ae.onclick = e => { e.stopPropagation(); const t = sheet.querySelector('[data-act="' + i + '"]'); if (t) t.click(); };
  });

  const wGet = i => { const gp = U.weapons[i].limit.group; if (!gp) return wpn[i];
    return Math.max(...U.weapons.map((w, j) => w.limit && w.limit.group === gp ? wpn[j] : 0)); };
  const wSet = (i, v) => { const gp = U.weapons[i].limit.group; if (!gp) { wpn[i] = v; return; }
    U.weapons.forEach((w, j) => { if (w.limit && w.limit.group === gp) wpn[j] = v; }); };

  // fire a weapon: spend its AP and start its cooldown / use a charge
  const canFire = i => { const lim = U.weapons[i].limit; if (!lim) return true;
    const cur = wGet(i); return lim.kind === "cooldown" ? !(cur > 0) : cur > 0; };
  const fireW = (i, cost) => {
    const w = U.weapons[i], lim = w.limit;
    if (ap < cost || !canFire(i)) return;
    actLog().st.push({ t: "w", i: i, ap: cost, prev: lim ? wGet(i) : null });
    ap -= cost;
    if (lim) wSet(i, lim.kind === "cooldown" ? lim.turns + 1 : wGet(i) - 1);
    active = null; logAct("w", i); quietAct();
  };
  const fireTap = i => {
    const opts = apOptions(U.weapons[i].ap);
    if (!opts.length) return;
    if (opts.length === 1) fireW(i, opts[0]);
    else wake("wap" + i);                                  // two costs: show both to pick from
  };
  U.weapons.forEach((w, i) => {
    const at = weapAP[i], opts = apOptions(w.ap);
    if (!at || !opts.length) return;
    at.classList.add("aptap");
    at.style.zIndex = 3;
    if (!canFire(i) || ap < Math.min(...opts)) at.classList.add("cant");
    at.title = !canFire(i) ? (w.limit.kind === "cooldown" ? "On cooldown" : "No uses left")
      : ap < Math.min(...opts) ? "Not enough AP" : "Tap to fire \u2014 spends " + opts.join(" or ") + " AP";
    at.onclick = e => { e.stopPropagation(); fireTap(i); };
    if (opts.length > 1 && active === "wap" + i) {
      const ch = el("div", "grp apchoice", { left: COL.wAP + "%", top: w.y + "%" });
      opts.forEach(c => {
        const b = el("div", (ap < c || !canFire(i)) ? "cant" : "");
        b.textContent = c + " AP";
        b.title = "Fire for " + c + " AP";
        b.onclick = e => { e.stopPropagation(); const before = ap; fireW(i, c); if (ap < before) apFeedback(COL.wAP, w.y, 4.7, before - ap); };
        ch.appendChild(b);
      });
      sheet.appendChild(ch);
    }
  });
  // remote pods: "2 / Free" -> active fire (2 AP) or ambush (free); either way the pod is revealed
  U.abilities.forEach((a, i) => {
    if (a.kind !== "pod" || !U.pods || !pods || i >= SKILL_Y.length) return;
    const ae = skillAP[i], P = pods[a.pod];
    if (!ae || !P) return;
    const opts = apOptions(a.apText).concat(/free/i.test(a.apText || "") ? [0] : []);
    const ready = P.hp > 0 && P.state === 1;                          // must be deployed to fire
    ae.classList.add("aptap");
    if (!ready || ap < Math.min(...opts)) ae.classList.add("cant");
    ae.title = P.hp === 0 ? "Pod destroyed" : P.state !== 1 ? "Deploy the pod first" : "Tap to fire this pod";
    const firePod = c => {
      if (!ready || ap < c) return;
      actLog().st.push({ t: "s", i: i, ap: c, pod: a.pod, prevState: P.state });
      ap -= c; P.state = 2; active = null;
      qaLog(CUR.uid, "act:s" + i, actLog().st.filter(x => x.t === "s" && x.i === i).length,
        a.name + " fired" + (c ? " (" + c + " AP)" : " (ambush, free)"));
      quietAct();
    };
    ae.onclick = e => { e.stopPropagation(); if (ready) wake("pap" + i); };
    if (active === "pap" + i && ready) {
      const ch = el("div", "grp apchoice", { left: COL.skillAP + "%", top: SKILL_Y[i] + "%" });
      opts.forEach(c => {
        const bt = el("div", ap < c ? "cant" : "");
        bt.textContent = c ? c + " AP fire" : "Free ambush";
        bt.onclick = e => { e.stopPropagation(); const before = ap; firePod(c); if (ap < before) apFeedback(COL.skillAP, SKILL_Y[i], 5.5, before - ap); };
        ch.appendChild(bt);
      });
      sheet.appendChild(ch);
    }
  });
  // undo arrows over the row numbers for anything fired / used this half-turn
  {
    const L = CUR.st.wf && sameHalf(CUR.st.wf) ? CUR.st.wf : null;
    const rows = {};
    (L ? L.st : []).forEach(x => { rows[x.t + x.i] = x; });
    Object.keys(rows).forEach(k => {
      const x = rows[k];
      const y = x.t === "w" ? U.weapons[x.i].y : SKILL_Y[x.i];
      const ub = el("div", "wpip undoA", { left: "4.3%", top: y + "%", borderColor: "#3b82f6",
        background: "rgba(255,255,255,.96)", color: "#1e3a8a", zIndex: 6 });
      ub.textContent = "\u21B6";
      ub.title = "Undo the last " + (x.t === "w" ? U.weapons[x.i].name + " shot" : U.abilities[x.i].name) + " (gives the AP back)";
      ub.onclick = e => {
        e.stopPropagation();
        const j = L.st.map(z => z.t + z.i).lastIndexOf(k); if (j < 0) return;
        const z = L.st.splice(j, 1)[0];
        ap = Math.min(apMax, ap + z.ap);
        if (z.t === "w" && U.weapons[z.i].limit && z.prev !== null) wSet(z.i, z.prev);
        if (z.pod !== undefined && pods && pods[z.pod]) pods[z.pod].state = z.prevState;
        logAct(z.t, z.i); quietAct();
      };
      sheet.appendChild(ub);
    });
  }

  U.weapons.forEach((w, i) => {
    if (!w.limit) return;
    const isCd = w.limit.kind === "cooldown";
    const cur = wGet(i);
    // cooldown: 0 = ready. Firing sets turns+1 so a "1-turn cooldown"
    // costs you the whole following turn before it comes back.
    const spent = isCd ? cur > 0 : cur === 0;
    const col = spent ? "#ef4444" : "#22c55e";

    const r = el("div", "wrow", { left: WROW_X + "%", top: (w.y - WROW_H / 2) + "%",
      width: WROW_W + "%", height: WROW_H + "%" });
    if (spent) r.className = "wrow fired";
    r.title = w.name + (isCd ? (spent ? " \u2014 on cooldown" : " \u2014 ready")
                             : " \u2014 " + cur + "/" + w.limit.max + " charges");
    const manual = () => {
      if (isCd) wSet(i, cur > 0 ? 0 : w.limit.turns + 1);
      else wSet(i, Math.max(0, cur - 1));
      draw();
    };
    r.onclick = () => fireTap(i);
    r.oncontextmenu = e => { e.preventDefault();
      if (!isCd) wSet(i, Math.min(w.limit.max, cur + 1));
      draw(); };
    sheet.appendChild(r);

    const pip = el("div", "wpip", { left: WPIP_X + "%", top: w.y + "%",
      borderColor: col, background: spent ? "rgba(153,27,27,.92)" : "rgba(22,101,52,.92)",
      color: "#fff" });
    // a number only when it is worth showing: multi-turn reload, or charges left
    pip.textContent = isCd ? (spent && cur > 1 ? String(cur - 1) : "") : String(cur);
    pip.title = r.title;
    pip.title = r.title + " \u2014 tap to mark by hand (no AP)";
    pip.onclick = e => { e.stopPropagation(); manual(); };
    sheet.appendChild(pip);
    const firedByAP = !!(CUR.st.wf && sameHalf(CUR.st.wf) && CUR.st.wf.st.some(x => x.t === "w" && x.i === i));
    if (!isCd && cur < w.limit.max && !firedByAP) {        // the row-number undo covers shots fired from the AP
      // phones have no right-click: a small arrow gives one use back
      const rb = el("div", "wpip undoA", { left: (w.y > 76 ? WPIP_X + 2.9 : WPIP_X - 2.9) + "%", top: w.y + "%",
        borderColor: "#3b82f6", background: "rgba(255,255,255,.96)", color: "#1e3a8a" });
      rb.textContent = "\u21B6";
      rb.title = "Give one " + w.name + " back";
      rb.onclick = e => { e.stopPropagation(); wSet(i, Math.min(w.limit.max, cur + 1)); draw(); };
      sheet.appendChild(rb);
    }
  });

  const dmgNotes = burnNotes.slice();
  const okNotes = [];                       // good news gets its own green strip
  U.abilities.forEach((a, i) => {
    if (!(a.kind === "toggle" && a.fx && a.fx.risk && track[i] === 1)) return;
    const R = a.fx.risk, r = risk[i] || {}, tgt = riskTarget(R, r.n), nm = a.name.split(" ")[0].toUpperCase();
    if (r.pend) dmgNotes.push(nm + " CHECK \u2014 roll " + R.die + ", need " + tgt + "+ or take " + R.dmg + " " + LIMB_LABEL[R.loc] + " damage");
    else if (r.res === "pass") okNotes.push("\u2713 " + nm + " check passed (" + tgt + "+)");
    else if (r.res === "fail") dmgNotes.push(nm + " check failed \u2014 " + R.dmg + " " + LIMB_LABEL[R.loc] + " damage taken");
  });
  U.abilities.forEach(a => {
    if (a.kind !== "auto" || !autoOn(a, U, LIVE)) return;
    if (a.berserk && examCheck[CUR.uid] !== undefined)
      { if (examCheck[CUR.uid]) dmgNotes.push(a.berserk.failText); else okNotes.push("\u2713 " + a.berserk.passText); }
    else dmgNotes.push(a.name.toUpperCase() + " \u2014 must start a melee every turn if any unit is in Charge Range");
  });
  if (headGone) dmgNotes.push((debuffLoc === "chest" ? "CHEST GONE" : "HEAD GONE") + " \u2014 \u22122 to every roll"
    + (isGundamTier ? " \u00b7 Free Dodges lost, 2 rolled Dodges remain" : ""));
  if (legsGone === 2) dmgNotes.push("BOTH LEGS \u2014 immobilised");
  else if (legsGone === 1) dmgNotes.push("LEG LOST \u2014 movement halved");
  if (armsGone === 1) dmgNotes.push("ARM LOST \u2014 that arm's weapons disabled");
  else if (armsGone === 2) dmgNotes.push("BOTH ARMS \u2014 all arm weapons disabled");
  if (down) dmgNotes.push("DOWN");
  if (okNotes.length) {
    // sits in the usual spot; any red strip moves up above it
    const os = T(24, 58.5, okNotes.join("   \u00b7   "), [4, 1.25, 16], "");
    Object.assign(os.style, { color: "#dcfce7", fontWeight: "800", background: "rgba(21,128,61,.92)",
      padding: "0.22em 0.6em", borderRadius: "0.3em", border: "1px solid #4ade80", maxWidth: "37%", zIndex: 8 });
    shrinkToFit(os, 0.7);
  }
  if (dmgNotes.length) {
    const ds = T(24, okNotes.length ? 54.6 : 58.5, dmgNotes.join("   \u00b7   "), [4, 1.25, 16], "");
    ds.style.color = "#fecaca";
    ds.style.fontWeight = "800";
    ds.style.background = "rgba(127,29,29,.9)";
    ds.style.padding = "0.22em 0.6em";
    ds.style.borderRadius = "0.3em";
    ds.style.border = "1px solid #ef4444";
    ds.style.maxWidth = "37%";
    ds.style.zIndex = 8;
    shrinkToFit(ds, 0.7);
  }

  LIMB_ORDER.forEach(k => {
    const v = hp[k], mx = U.limb[k], p = v / mx, id = "l_" + k, sh = active === id;
    const ring = v === 0 ? "#991b1b" : p <= .34 ? "#ef4444" : p <= .67 ? "#f59e0b" : "#22c55e";

    const pos = LIMB_POS_DEFAULT[k];
    const b = el("div", "hp", { left: pos.x + "%", top: pos.y + "%", borderColor: ring,
      background: v === 0 ? "rgba(153,27,27,.95)" : "rgba(255,255,255,.97)",
      color: v === 0 ? "#fff" : "#0f172a",
      boxShadow: (sh ? "0 0 0 3px " + ring + "77, " : "") + "0 0 10px " + ring + "88" });
    b.textContent = v; b.title = LIMB_LABEL[k];
    b.onclick = () => { hp[k] = mode === "damage" ? Math.max(0, v - amount) : Math.min(mx, v + amount); wake(id); };
    sheet.appendChild(b);
    if (hudMode) {
      if (v === 0) {
        b.classList.add("hudlost");
        const w = el("div", "hudwarn", { left: pos.x + "%", top: (pos.y + 4.5) + "%" });
        w.textContent = "\u26A0 DESTROYED";
        w.title = LIMB_LABEL[k] + " destroyed";
        sheet.appendChild(w);
      } else if (p <= .34) b.classList.add("hudlow");
    }
    [[-LIMB_OFF, "\u2212", () => hp[k] = Math.max(0, hp[k] - 1)],
     [LIMB_OFF, "+", () => hp[k] = Math.min(mx, hp[k] + 1)]].forEach(([dx, lab, fn]) => {
      const s = el("div", "step" + (sh ? " show" : ""), { position: "absolute", transform: "translate(-50%,-50%)",
        left: (pos.x + dx) + "%", top: pos.y + "%", borderColor: ring, color: ring, zIndex: 5 });
      s.textContent = lab; s.onclick = e => { e.stopPropagation(); fn(); wake(id); };
      sheet.appendChild(s);
    });
  });

  renderTurn();
  // tap the portrait to set this model's colour marker
  {
    const ph = el("div", "porthit", { left: "92.6%", top: "11.85%" });
    ph.title = "Tap to set a colour marker";
    ph.onclick = e => { e.stopPropagation(); openMarkWheel(CUR.uid); };
    sheet.appendChild(ph);
  }
  // ---- quick MOVE / DODGE at the unit's feet ----
  {
    let qa = CUR.st.qa;
    if (!qa || !sameHalf(qa)) qa = CUR.st.qa = { r: turn.round, p: turn.phase, m: 0, d: 0 };
    const grunt = !isGundamTier && U.dodges > 0 && /Grunt/.test(U.tier);
    const dodgeWord = grunt ? "Rolled Dodges" : "Free Dodges";
    const QA_THEME = {
      blue:    ["rgba(6,30,78,.46)",  "rgba(6,30,78,.72)",  "#7dd3fc", "#e0f2fe", "rgba(125,211,252,.28)", "#082f49"],
      blue360: ["rgba(6,30,78,.46)",  "rgba(6,30,78,.72)",  "#7dd3fc", "#e0f2fe", "rgba(125,211,252,.28)", "#082f49"],
      phenex:  ["rgba(6,30,78,.46)",  "rgba(6,30,78,.72)",  "#7dd3fc", "#e0f2fe", "rgba(125,211,252,.28)", "#082f49"],
      red:     ["rgba(48,5,10,.5)", "rgba(48,5,10,.78)", "#ff4d5a", "#ffe4e6", "rgba(255,77,90,.24)",  "#3a0509"],
      red360:  ["rgba(48,5,10,.5)", "rgba(48,5,10,.78)", "#ff4d5a", "#ffe4e6", "rgba(255,77,90,.24)",  "#3a0509"],
      green:   ["rgba(18,48,18,.46)", "rgba(18,48,18,.72)", "#bef264", "#ecfccb", "rgba(190,242,100,.24)", "#1a2e05"],
      grey:    ["rgba(30,36,48,.46)", "rgba(30,36,48,.72)", "#e2e8f0", "#f8fafc", "rgba(226,232,240,.22)", "#0f172a"],
    };
    const th = QA_THEME[sideKey()] || QA_THEME.blue;
    const box = el("div", "qa", { left: "59.4%", top: "91.3%",
      "--qa-bg": th[0], "--qa-bg-on": th[1], "--qa-ac": th[2], "--qa-tx": th[3], "--qa-glow": th[4], "--qa-dk": th[5] });
    ["--qa-bg", "--qa-bg-on", "--qa-ac", "--qa-tx", "--qa-glow", "--qa-dk"].forEach((k, j) => box.style.setProperty(k, th[j]));
    const logMoves = () => qaLog(CUR.uid, "qa:m", qa.m, "Moved " + qa.m + "\u00d7 (" + (qa.m * moveNow) + "cm, " + qa.m + " AP)");
    const logDodges = () => qaLog(CUR.uid, "qa:d", qa.d, dodgeWord + " used: " + qa.d);
    const quiet = () => { persist(); snaps[CUR.uid] = snapOf(CUR); draw(); save(); };

    // MOVE: 1 AP per increment
    const capped = stealth && moveCap && turn.phase === "you" && qa.m >= moveCap;
    const cantMove = ap < 1 || moveNow === 0;
    const mu = el("div", "qau" + (qa.m ? "" : " hide"));
    mu.innerHTML = "<span>\u21B6</span>" + (qa.m ? "<small>\u00d7" + qa.m + "</small>" : ""); mu.title = "Undo the last move (gives the AP back) \u2014 " + qa.m + " move(s) this turn";
    mu.onclick = e => { e.stopPropagation(); if (!qa.m) return; qa.m -= 1; ap = Math.min(apMax, ap + 1); logMoves(); quiet(); };
    const mv = el("div", "qab move" + (cantMove || turn.phase !== "you" ? " off" : "") + (capped ? " warn" : ""));
    mv.innerHTML = "<b>MOVE</b><small>" + (moveNow === 0 ? "immobilised" : moveNow + "cm \u00b7 1 AP") + "</small>" +
      "";
    mv.title = moveNow === 0 ? "Both legs destroyed \u2014 this unit cannot move"
      : ap < 1 ? "No AP left" : capped ? "Stealth Stance caps movement at " + moveCap + " AP per turn"
      : turn.phase !== "you" ? "It's the enemy turn" : "Spend 1 AP to move up to " + moveNow + "cm";
    mv.onclick = e => {
      e.stopPropagation();
      if (cantMove) return;                          // no AP to spend, or immobilised
      if (turn.phase !== "you") { mpToast("That can only be done on your own turn."); return; }
      qa.m += 1; ap -= 1; logMoves(); quiet();
    };

    // DODGE: one Free Dodge (Rolled Dodges on grunt sheets share the box)
    const focusNoDodge = CUR && stanceOf(CUR.st) === "focus";
    const cantDodge = dodges < 1 || focusNoDodge;
    const dg = el("div", "qab dodge" + (cantDodge ? " off" : ""));
    dg.innerHTML = "<b>DODGE</b><small>" + dodges + " left</small>";
    if (focusNoDodge) dg.innerHTML = "<b>DODGE</b><small>Focus: none</small>";
    dg.title = focusNoDodge ? "Focus Stance: no Dodge until your next turn" : cantDodge ? "No " + dodgeWord + " left this turn" : "Spend 1 of your " + dodgeWord;
    dg.onclick = e => { e.stopPropagation(); if (cantDodge) return; qa.d += 1; dodges -= 1; logDodges(); quiet(); };
    const du = el("div", "qau" + (qa.d ? "" : " hide"));
    du.innerHTML = "<span>\u21B6</span>" + (qa.d ? "<small>\u00d7" + qa.d + "</small>" : ""); du.title = "Undo the last dodge (gives it back) \u2014 " + qa.d + " dodge(s) this turn";
    du.onclick = e => { e.stopPropagation(); if (!qa.d) return; qa.d -= 1; dodges = Math.min(dodgeMax, dodges + 1); logDodges(); quiet(); };

    box.append(mu, mv, dg, du);
    sheet.appendChild(box);
    if (capped) {
      const cw = T(59.4, 84.6, "STEALTH MOVE CAP REACHED (" + moveCap + " AP)", [4, 1.1, 15], "");
      Object.assign(cw.style, { color: "#1c1917", background: "#f59e0b", fontWeight: "900", padding: "0.15em 0.5em", borderRadius: "0.3em", zIndex: 9 });
    }
  }

  mkStat("ap", 80.5, 28.7, ap, apMax, apTemp ? "#a78bfa" : "#facc15", v => ap = v, true);
  mkStat("dg", 80.5, 47.9, dodges, dodgeMax, dodgeCountTemp ? "#a78bfa" : "#22c55e", v => dodges = v, false);

  // shDown[i]:  0 = fine | -2 = at zero, awaiting your call | -1 = destroyed for good | n>0 = regenerating
  (U.shields || []).forEach((cfg, i) => {
    // a shield that only exists while an ability is running
    if (cfg.when) {
      const rq = U.abilities.findIndex(x => x.name.indexOf(cfg.when) === 0);
      const rs = rq >= 0 ? track[rq] : null;
      const live = (U.abilities[rq] || {}).kind === "mode" ? !!(rs && rs.on) : rs === 1;
      if (!live) return;
    }
    if (swapMode && U.ring) {
      // swapping: show the value for reference only -- the big zones take every tap
      const away = !!(U.lendable && out && out[i] !== null && out[i] !== undefined);
      const d = shDown[i] || 0;
      const g = el("div", "grp", { left: cfg.x + "%", top: cfg.y + "%", pointerEvents: "none", zIndex: 10 });
      const nb = el("div", "num", { borderColor: "#94a3b8", cursor: "default",
        background: away ? "rgba(71,85,105,.95)" : "rgba(255,255,255,.96)", color: away ? "#e2e8f0" : "#0f172a" });
      nb.innerHTML = away ? "LENT" : d === -1 ? "\u2715" : d > 0 ? "\u21BB" + d : (sh[i] + "<small>/" + shMx(i) + "</small>");
      g.appendChild(nb); sheet.appendChild(g);
      return;
    }
    // a lendable shield that has been sent away shows a Recall button instead
    if (U.lendable && out && out[i] !== null && out[i] !== undefined) {
      const t = roster.find(r => r.uid === out[i]);
      const g = el("div", "grp", { left: cfg.x + "%", top: cfg.y + "%" });
      const b = el("div", "num", { borderColor: accentOf(sideKey()), background: "rgba(15,23,42,.94)",
        color: accentOf(sideKey()), cursor: "pointer", minWidth: "3.4em" });
      b.innerHTML = "\u2192" + (t ? (unitById(t.id).short || "ally").slice(0, 7) : "?");
      b.title = "Lent to " + (t ? (unitById(t.id).short || unitById(t.id).name) : "?") + " — tap to recall (" + U.lendable.ap + " AP)";
      b.onclick = () => recallDE(i);
      g.appendChild(b); sheet.appendChild(g);
      return;
    }
    const v = sh[i], d = shDown[i] || 0, id = "sh" + i, shw = active === id;
    const asking = d === -2, dead = d === -1, regen = d > 0;
    const pr = shMx(i) ? v / shMx(i) : 1;
    const col = dead ? "#7f1d1d" : regen ? "#a855f7" : asking ? "#f59e0b"
      : v === 0 ? "#64748b" : pr <= .34 ? "#ef4444" : pr <= .67 ? "#f59e0b" : "#22c55e";
    const g = el("div", "grp", { left: cfg.x + "%", top: cfg.y + "%" });

    if (asking) {
      // a beam shield just hit 0 -- was it a Natural 20 Block?
      const lab = el("div", "num", { borderColor: col, background: "rgba(120,53,15,.95)",
        color: "#fde68a", cursor: "default", minWidth: "1.6em" });
      lab.textContent = "0"; lab.title = "Shield down — choose what happened";
      const rb = el("div", "step show", { borderColor: "#a855f7", color: "#a855f7" });
      rb.textContent = "↻"; rb.title = "Normal — offline " + U.regen + " turns, then restores";
      rb.onclick = e => { e.stopPropagation(); shDown[i] = U.regen; draw(); };
      const xb = el("div", "step show", { borderColor: "#ef4444", color: "#ef4444" });
      xb.textContent = "✕"; xb.title = "Natural 20 Block — generator destroyed, gone for good";
      xb.onclick = e => { e.stopPropagation(); shDown[i] = -1; draw(); };
      g.append(lab, rb, xb);
      sheet.appendChild(g);
      return;
    }

    const m = el("div", "step" + (shw ? " show" : ""), { borderColor: col, color: col });
    m.textContent = "−";
    m.onclick = e => { e.stopPropagation();
      if (dead) return;
      sh[i] = Math.max(0, v - amount);
      if (sh[i] === 0 && U.regen && !regen) shDown[i] = -2;   // ask
      wake(id); };
    const n = el("div", "num", { borderColor: col,
      background: dead ? "rgba(127,29,29,.95)" : regen ? "rgba(88,28,135,.92)"
        : v === 0 ? "rgba(100,116,139,.92)" : "rgba(255,255,255,.96)",
      color: (dead || regen || v === 0) ? "#f5f3ff" : "#0f172a",
      boxShadow: shw ? "0 0 0 2px " + col + "66" : "none" });
    n.innerHTML = dead ? "✕" : regen ? ("↻" + d) : (v + "<small>/" + shMx(i) + "</small>");
    n.title = dead ? "Destroyed permanently — Natural 20 Block"
      : regen ? ("Offline — restores in " + d + " turn(s)")
      : ((cfg.label ? cfg.label + (cfg.coverage ? " (" + cfg.coverage + "\u00b0)" : "") + " \u2014 " : U.shields.length > 1 ? "Shield " + (i + 1) + " — " : "Shield ") + v + "/" + shMx(i));
    n.onclick = () => wake(id);
    const p = el("div", "step" + (shw ? " show" : ""), { borderColor: col, color: col });
    p.textContent = "+";
    p.onclick = e => { e.stopPropagation();
      if (dead || regen) { shDown[i] = 0; sh[i] = shMx(i); }   // manual restore
      else sh[i] = Math.min(shMx(i), v + 1);
      wake(id); };
    g.append(m, n, p);
    if (hudMode && (dead || regen || v === 0)) {
      const w = el("div", "hudwarn" + (regen ? " amber" : ""), { left: Math.max(5.5, Math.min(cfg.x, 94.3)) + "%", top: (cfg.y - 4.3) + "%" });
      w.textContent = regen ? "\u26A0 SHIELD OFFLINE" : "\u26A0 SHIELD DOWN";
      sheet.appendChild(w);
      // keep the tag on the sheet (the right-hand shields sit near the edge)
      const SR = sheet.getBoundingClientRect(), q = w.getBoundingClientRect();
      if (SR.width) {
        if (q.right > SR.right - 3) w.style.left = (parseFloat(w.style.left) - (q.right - SR.right + 4) / SR.width * 100) + "%";
        else if (q.left < SR.left + 3) w.style.left = (parseFloat(w.style.left) + (SR.left - q.left + 4) / SR.width * 100) + "%";
      }
    }
    if (U.lendable && Array.isArray(out) && i < U.lendable.count) {
      const sb = el("div", "sendbtn", { position: "absolute", transform: "translate(-50%,-50%)",
        left: cfg.x + "%", top: (cfg.y > 75 ? cfg.y - 5.0 : cfg.y + (U.ring && U.shields.length === 2 ? 5.0 : 6.2)) + "%", zIndex: 8, borderRadius: "4px", padding: "1px 5px",
        fontSize: "clamp(5px,1.25cqw,16px)", fontWeight: "700", cursor: "pointer",
        background: "rgba(15,23,42,.92)", border: "1px solid " + accentOf(sideKey()), color: accentOf(sideKey()) });
      sb.textContent = "SEND";
      sb.title = "Send this " + (U.lendable.label || "shield") + " to an ally within " + (U.lendable.range || "range");
      sb.onclick = e => { e.stopPropagation(); openPicker("lend", i); };
      sheet.appendChild(sb);
    }
    sheet.appendChild(g);
  });

  // shields lent to this unit by someone else
  (Array.isArray(lent) && !(swapMode && U.ring) ? lent.filter(x => x && typeof x.hp === "number") : []).forEach((L, k) => {
    const id = "lent" + k, shw = active === id;
    const pr = L.hp ? L.cur / L.hp : 1;
    const col = L.cur === 0 ? "#64748b" : pr <= .34 ? "#ef4444" : pr <= .67 ? "#f59e0b" : accentOf(sideKey());
    // borrowed shields always sit in a dedicated strip along the bottom,
    // which is clear on every background including the 4-bubble sheets
    // on ring sheets, borrowed shields flank the ring left and right
    const lx = U.ring ? (k === 0 ? 76.8 : 96.4) : (k === 0 ? 80.9 : 93.8);
    const y = U.ring ? 73.2 : 88.6;
    const g = el("div", "grp", { left: lx + "%", top: y + "%" });
    const m = el("div", "step" + (shw ? " show" : ""), { borderColor: col, color: col });
    m.textContent = "\u2212"; m.onclick = e => { e.stopPropagation(); L.cur = Math.max(0, L.cur - amount); wake(id); };
    const n = el("div", "num", { borderColor: col,
      background: L.cur === 0 ? "rgba(100,116,139,.92)" : "rgba(224,242,254,.97)",
      color: L.cur === 0 ? "#e2e8f0" : "#0c4a6e",
      boxShadow: shw ? "0 0 0 2px " + col + "66" : "none" });
    n.innerHTML = L.cur + "<small>/" + L.hp + "</small>";
    n.title = (L.label || "Shield") + " on loan from " + (L.owner || "ally");
    n.onclick = () => wake(id);
    const p = el("div", "step" + (shw ? " show" : ""), { borderColor: col, color: col });
    p.textContent = "+"; p.onclick = e => { e.stopPropagation(); L.cur = Math.min(L.hp, L.cur + 1); wake(id); };
    const tag = el("div", "lenttag", { position: "absolute", transform: "translate(-50%,-50%)",
      left: lx + "%", top: (y + (U.ring ? 5.4 : 4.2)) + "%", fontSize: "clamp(5px,1.05cqw,13px)", fontWeight: "700",
      color: accentOf(sideKey()), whiteSpace: "nowrap" });
    tag.textContent = "\u2190 " + String(L.owner || "ally").slice(0, 10);
    g.append(m, n, p); sheet.appendChild(g); sheet.appendChild(tag);
  });
  // shield arcs drawn inside the printed white ring
  if (U.ring && (U.shields || []).length) {
    const R = U.ring, VB = 1600, VH = 900;
    const cx = R.cx / 100 * VB, cy = R.cy / 100 * VH;
    const rIn = R.rIn / 100 * VB, rOut = R.rOut / 100 * VB;
    const n = U.shields.length, step = 360 / n;
    // explicit start angle per shield (0 deg = top of the ring, clockwise)
    // 4 shields sit on the printed bubbles: TL, TR, BL, BR
    // 2 shields (Phenex's DEs): DE 1 covers the front 180 (top half), DE 2 the rear 180 (bottom half)
    const ARC_START = n === 4 ? [270, 0, 180, 90]
                    : n === 2 ? [270, 90]
                    : U.shields.map((_, i) => i * step);

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "arcring");
    svg.setAttribute("viewBox", "0 0 " + VB + " " + VH);
    Object.assign(svg.style, { position: "absolute", inset: "0", width: "100%", height: "100%", zIndex: 6, pointerEvents: "none" });

    const pt = (ang, r) => {
      const a = (ang - 90) * Math.PI / 180;
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    };
    const seg = (a0, a1, r0, r1) => {
      const [x0, y0] = pt(a0, r1), [x1, y1] = pt(a1, r1);
      const [x2, y2] = pt(a1, r0), [x3, y3] = pt(a0, r0);
      const big = (a1 - a0) > 180 ? 1 : 0;
      return `M${x0},${y0} A${r1},${r1} 0 ${big} 1 ${x1},${y1} L${x2},${y2} A${r0},${r0} 0 ${big} 0 ${x3},${y3} Z`;
    };

    U.shields.forEach((cfg, i) => {
      const v = sh[i], d = shDown[i] || 0;
      const away = !!(U.lendable && out && out[i] !== null && out[i] !== undefined);
      const dead = d === -1, regen = d > 0, asking = d === -2;
      const pr = shMx(i) ? v / shMx(i) : 1;
      const fill = away ? "#334155"                      // lent out -- this arc is uncovered
        : dead ? "#7f1d1d" : regen ? "#a855f7" : asking ? "#f59e0b"
        : v === 0 ? "#475569" : pr <= .34 ? "#ef4444" : pr <= .67 ? "#f59e0b" : "#22c55e";
      const a0 = ARC_START[i] + 1.4, a1 = ARC_START[i] + step - 1.4;
      const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
      p.setAttribute("d", seg(a0, a1, rIn + 1.5, rOut - 1.5));
      p.setAttribute("fill", fill);
      p.setAttribute("opacity", away ? ".38" : dead ? ".55" : ".92");
      p.setAttribute("stroke", away ? "rgba(148,163,184,.85)" : "rgba(2,6,23,.55)");
      p.setAttribute("stroke-width", away ? "2" : "1.5");
      if (away) p.setAttribute("stroke-dasharray", "6 5");
      p.style.cursor = "pointer";
      p.style.pointerEvents = swapMode ? "none" : "auto";
      if (swapMode && swapFrom === i) {
        const glow = document.createElementNS("http://www.w3.org/2000/svg", "path");
        glow.setAttribute("d", seg(a0 - 1, a1 + 1, Math.max(1, rIn - 14), rOut + 14));
        glow.setAttribute("fill", accentOf(sideKey()));
        glow.setAttribute("opacity", ".55");
        glow.style.pointerEvents = "none";
        svg.appendChild(glow);
        const glow2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        glow2.setAttribute("d", seg(a0 - 2, a1 + 2, Math.max(1, rIn - 24), rOut + 24));
        glow2.setAttribute("fill", accentOf(sideKey()));
        glow2.setAttribute("opacity", ".22");
        glow2.style.pointerEvents = "none";
        svg.appendChild(glow2);
        p.setAttribute("stroke", "#ffffff"); p.setAttribute("stroke-width", "4");
      }
      p.addEventListener("click", ev => {
        ev.stopPropagation();
        wake("sh" + i);
      });
      const t = document.createElementNS("http://www.w3.org/2000/svg", "title");
      const t2 = away ? roster.find(r => r.uid === out[i]) : null;
      t.textContent = "Shield " + (i + 1) + " — " + (away
        ? ("lent to " + (t2 ? (unitById(t2.id).short || unitById(t2.id).name) : "an ally") + " — this arc is uncovered")
        : dead ? "destroyed" : v + "/" + shMx(i))
        + "  (arc " + Math.round(((a0 + a1) / 2 % 360 + 360) % 360) + "\u00b0)";
      p.appendChild(t);
      svg.appendChild(p);
    });

    sheet.appendChild(svg);

    const acc = accentOf(sideKey());
    const shName = k => U.shields[k].label || (U.lendable ? "DE " + (k + 1) : "Shield " + (k + 1));
    if (swapMode) {
      // whole-corner tap zones, as large as the shield panel allows
      const ZL = 75.6, ZR = 99, ZT = 61, ZB = 88.8, GAP = 0.3, two = U.shields.length === 2;
      U.shields.forEach((cfg, i) => {
        const left = cfg.x < R.cx, top = cfg.y < R.cy;
        const x0 = two ? ZL : (left ? ZL : R.cx + GAP), x1 = two ? ZR : (left ? R.cx - GAP : ZR);
        const y0 = top ? ZT : R.cy + GAP, y1 = top ? R.cy - GAP : ZB;
        const away = !!(U.lendable && out && out[i] !== null && out[i] !== undefined);
        const z = el("div", "swapz" + (swapFrom === i ? " sel" : "") + (away ? " off" : "") + (two ? "" : (left ? " lft" : " rgt")),
          { left: x0 + "%", top: y0 + "%", width: (x1 - x0) + "%", height: (y1 - y0) + "%" });
        z.style.setProperty("--acc", acc);
        // invisible zone: the HP box (which reads LENT when lent out) and the glow on the picked shield say the rest
        z.title = away ? "Lent to an ally \u2014 recall it before swapping" : "Tap to pick " + shName(i);
        z.onclick = e => {
          e.stopPropagation();
          if (away) { swapNote = { t: "RECALL THAT DE FIRST", until: Date.now() + 1800 }; draw(); setTimeout(draw, 1850); return; }
          if (swapFrom === null) { swapFrom = i; draw(); return; }
          if (swapFrom === i) { swapFrom = null; draw(); return; }
          const a = swapFrom, b = i;
          [sh[a], sh[b]] = [sh[b], sh[a]];
          [shDown[a], shDown[b]] = [shDown[b], shDown[a]];
          [shMax[a], shMax[b]] = [shMax[b], shMax[a]];          // each shield keeps its own maximum
          swapFrom = null; swapMode = false; active = null;
          swapFlash = { a: a, b: b, uid: CUR.uid, until: Date.now() + 550 };
          setTimeout(draw, 600);
          persist(); snaps[CUR.uid] = snapOf(CUR);                // a swap is not damage or a repair
          logEv(CUR.uid, shName(a) + " \u21C4 " + shName(b) + " (arcs swapped)", "info", "swap");
          draw(); save();
        };
        sheet.appendChild(z);
      });
    }

    // control bar under the ring: fits between MOVE/DODGE (ends x 75.4) and ROSTER (starts x 89.8)
    const rc = el("div", "arcrot swapbar swapmid", { position: "absolute", transform: "translate(-50%,-50%)",
      left: R.cx + "%", top: R.cy + "%", zIndex: 12 });
    rc.style.setProperty("--acc", acc);
    if (!swapMode && swapFlash && swapFlash.uid === CUR.uid && swapFlash.until > Date.now()) {
      const done = el("div", "arcrot swapbar swapnote", { position: "absolute", transform: "translate(-50%,-50%)",
        left: R.cx + "%", top: "61.8%", zIndex: 13, pointerEvents: "none" });
      done.style.setProperty("--acc", acc);
      const dt = el("div", "hint"); dt.textContent = shName(swapFlash.a).toUpperCase() + " \u21C4 " + shName(swapFlash.b).toUpperCase() + " SWAPPED";
      done.appendChild(dt); sheet.appendChild(done);
    }
    if (swapMode) {
      // the instruction sits on the ring itself; taps pass straight through to the zones
      const hint = el("div", "arcrot swapbar swapnote", { position: "absolute", transform: "translate(-50%,-50%)",
        left: R.cx + "%", top: "61.8%", zIndex: 13, pointerEvents: "none" });
      hint.style.setProperty("--acc", acc);
      const ht = el("div", "hint", { textAlign: "center" });
      const noteNow = swapNote && swapNote.until > Date.now() ? swapNote.t : null;
      ht.textContent = noteNow || (swapFrom === null ? "TAP THE FIRST SHIELD" : "TAP WHERE IT GOES");
      if (noteNow) ht.classList.add("warn");
      hint.appendChild(ht);
      sheet.appendChild(hint);
      const cancel = el("div", "btn2");
      cancel.textContent = "\u2715 CANCEL";
      cancel.onclick = e => { e.stopPropagation(); swapMode = false; swapFrom = null; draw(); };
      rc.append(cancel);
    } else {
      const sw = el("div", "btn2");
      sw.textContent = "\u21C4 SWAP";
      sw.title = "Reassign which shield covers which arc \u2014 tap two shields to exchange them";
      sw.onclick = e => { e.stopPropagation(); swapMode = true; swapFrom = null; active = null; draw(); };
      rc.appendChild(sw);
    }
    sheet.appendChild(rc);
  }

  // remote pods -- their own HP and deploy state
  if (U.pods && pods) {
    const STATE = U.pods.states || ["STOWED", "DEPLOYED", "REVEALED"];
    const SCOL = ["#64748b", "#22c55e", "#f59e0b"];
    pods.forEach((P, i) => {
      const slot = U.pods.slots[i]; if (!slot) return;
      const inRow = slot.row !== undefined;
      const cfg = inRow ? { x: COL.skillCD, y: SKILL_Y[slot.row] } : slot;
      const id = "pod" + i, shw = active === id, dead = P.hp === 0;
      const pr = P.hp / U.pods.hp;
      const col = dead ? "#7f1d1d" : pr <= .34 ? "#ef4444" : pr <= .67 ? "#f59e0b" : accentOf(sideKey());
      const g = el("div", "grp", { left: cfg.x + "%", top: cfg.y + "%" });
      const m = el("div", "step" + (shw ? " show" : ""), { borderColor: col, color: col });
      m.textContent = "\u2212"; m.onclick = e => { e.stopPropagation(); P.hp = Math.max(0, P.hp - amount); wake(id); };
      const n = el("div", "num", { borderColor: col,
        background: dead ? "rgba(127,29,29,.95)" : "rgba(255,255,255,.96)",
        color: dead ? "#fee2e2" : "#0f172a", boxShadow: shw ? "0 0 0 2px " + col + "66" : "none" });
      n.innerHTML = dead ? "\u2715" : (P.hp + "<small>/" + U.pods.hp + "</small>");
      n.title = U.pods.label + " " + (i + 1) + (dead ? " — destroyed" : " — " + P.hp + "/" + U.pods.hp + " HP");
      n.onclick = () => wake(id);
      const p = el("div", "step" + (shw ? " show" : ""), { borderColor: col, color: col });
      p.textContent = "+"; p.onclick = e => { e.stopPropagation(); P.hp = Math.min(U.pods.hp, P.hp + 1); wake(id); };
      g.append(m, n, p); sheet.appendChild(g);

      const st = el("div", "podstate", Object.assign(inRow ? { whiteSpace: "nowrap" } : { position: "absolute", transform: "translate(-50%,-50%)",
        left: (cfg.x + 13) + "%", top: cfg.y + "%" }, { borderRadius: "4px", padding: "1px 6px",
        fontSize: "clamp(5px,1.15cqw,15px)", fontWeight: "800", cursor: dead ? "default" : "pointer",
        background: dead ? "rgba(127,29,29,.9)" : "rgba(15,23,42,.92)",
        border: "1px solid " + (dead ? "#7f1d1d" : SCOL[P.state]),
        color: dead ? "#fca5a5" : SCOL[P.state] }));
      st.textContent = dead ? "DESTROYED" : STATE[P.state];
      st.title = dead ? "Pod destroyed — permanent" : "Tap to cycle: " + STATE.join(" \u2192 ");
      st.onclick = e => { e.stopPropagation(); if (!dead) { P.state = (P.state + 1) % STATE.length; draw(); } };
      if (inRow) g.appendChild(st); else sheet.appendChild(st);
      if (!dead && P.state === 1) {
        // bring a deployed pod home before it is revealed
        const rc = el("div", "undoA", { borderRadius: "4px", padding: "1px 6px", fontWeight: "900", whiteSpace: "nowrap",
          fontSize: "clamp(5px,1.15cqw,15px)", cursor: "pointer", background: "rgba(255,255,255,.96)",
          border: "1px solid #3b82f6", color: "#1e3a8a" });
        rc.textContent = "\u21A9 RECALL";
        rc.title = "Recall this pod to " + (U.short || U.name) + " \u2014 back to STOWED, ready to redeploy";
        rc.onclick = e => { e.stopPropagation(); P.state = 0; draw(); };
        if (inRow) g.appendChild(rc);
        else { Object.assign(rc.style, { position: "absolute", transform: "translate(-50%,-50%)", left: (cfg.x + 21) + "%", top: cfg.y + "%" }); sheet.appendChild(rc); }
      }
    });
  }

  // finger-sized tap areas: the whole AP cell, not just the characters (measured from the sheet art)
  [...sheet.querySelectorAll(".aptap")].forEach(c => {
    const x = parseFloat(c.style.left), y = parseFloat(c.style.top);
    const isSkill = Math.abs(x - COL.skillAP) < 0.05, isWeap = Math.abs(x - COL.wAP) < 0.05;
    if (!isSkill && !isWeap) return;
    const hb = el("div", "aphit", isSkill
      ? { left: "25.85%", top: y + "%", width: "5.5%", height: "4.4%" }
      : { left: "31.1%", top: y + "%", width: "4.7%", height: "4.6%" });
    hb.title = c.title;
    hb.onclick = e => {
      e.stopPropagation();
      const before = ap;
      c.onclick && c.onclick(e);
      if (ap < before) apFeedback(isSkill ? 25.85 : 31.1, y, isSkill ? 5.5 : 4.7, before - ap);
    };
    sheet.appendChild(hb);
  });
  fitCD();                                   // pod rows are drawn late
  // a combined total when there is more than one
  if ((U.shields || []).length > 1) {
    // a shield that has been lent away is not protecting this unit, so it leaves the total
    const isAway = j => !!(U.lendable && out && out[j] !== null && out[j] !== undefined);
    const tot = sh.reduce((a, b, j) => a + (isAway(j) ? 0 : b), 0);
    const t = el("div", "num", { position: "absolute", transform: "translate(-50%,-50%)",
      left: "80.5%", top: "57.3%", cursor: "default",
      borderColor: tot === 0 ? "#64748b" : "#22c55e",
      background: tot === 0 ? "rgba(100,116,139,.92)" : "rgba(255,255,255,.96)",
      color: tot === 0 ? "#e2e8f0" : "#0f172a" });
    const liveMax = U.shields.reduce((a, c, j) => a + ((shDown[j] === -1 || isAway(j)) ? 0 : shMx(j)), 0);
    const homeCount = U.shields.filter((_, j) => !isAway(j)).length;
    t.innerHTML = liveMax === 0 ? "\u2014" : (tot + "<small>/" + liveMax + "</small>");
    t.style.borderColor = liveMax === 0 ? "#64748b" : (tot === 0 ? "#64748b" : "#22c55e");
    t.style.background = liveMax === 0 ? "rgba(100,116,139,.92)" : t.style.background;
    t.style.color = liveMax === 0 ? "#e2e8f0" : t.style.color;
    t.title = homeCount === U.shields.length
      ? ("total across all " + U.shields.length + " shields")
      : (homeCount === 0 ? "every shield is lent out \u2014 no protection" 
         : ("total across the " + homeCount + " shield(s) still aboard"));
    sheet.appendChild(t);
    // a small caption beside the stack so the split is obvious
    const first = U.shields[0];
    if (first && first.x > 88 && U.shields.length > 2) {
      const cap = el("div", "txt", { left: (first.x - 10.5) + "%", top: first.y + "%",
        fontSize: "clamp(5px,1.15cqw,15px)", fontWeight: "800", color: accentOf(sideKey()), whiteSpace: "nowrap" });
      cap.textContent = U.shields.length + "\u00d7";
      sheet.appendChild(cap);
    }
  }

  // HUD sheet: restyle the light chips drawn for the printed sheet (coloured states keep their colours)
  if (hudMode) {
    const light = e => {
      const m = (getComputedStyle(e).backgroundColor.match(/[\d.]+/g) || []).map(Number);
      return m.length >= 3 && (m[3] === undefined || m[3] > .5) && m[0] > 185 && m[1] > 185 && m[2] > 185;
    };
    sheet.querySelectorAll(".num,.tog,.hp,.wpip,.grp div:not(.step)").forEach(e => { if (light(e)) e.classList.add("hudlite"); });
    // the four stat readouts inside the printed hex frames
    const statAt = e => Math.abs(parseFloat(e.style.left) - 80.5) < .05 && [28.7, 38.5, 47.9, 57.3].some(y => Math.abs(parseFloat(e.style.top) - y) < .05);
    sheet.querySelectorAll(".grp,.txt,.num").forEach(e => { if (e.style.left && statAt(e)) e.classList.add("hudstat"); });
    // pulse the AP readout when AP has just gone down on this unit
    const apG = [...sheet.querySelectorAll(".grp.hudstat")].find(g => Math.abs(parseFloat(g.style.top) - 28.7) < .05);
    if (apG && apShown.uid === CUR.uid && typeof apShown.ap === "number" && ap < apShown.ap) apG.classList.add("apdrop");
    apShown = { uid: CUR.uid, ap: ap };
  }



  function mkStat(id, x, y, val, mx, colOn, set, cap) {
    const sh = active === id;
    const pr = mx ? val / mx : 1;
    const col = val === 0 ? "#64748b"
      : (cap && pr <= .34) ? "#ef4444" : (cap && pr <= .67) ? "#f59e0b" : colOn;
    const g = el("div", "grp", { left: x + "%", top: y + "%" });
    const m = el("div", "step" + (sh ? " show" : ""), { borderColor: col, color: col });
    m.textContent = "−"; m.onclick = e => { e.stopPropagation(); set(Math.max(0, val - 1)); wake(id); };
    const n = el("div", "num", { borderColor: col, background: val === 0 ? "rgba(100,116,139,.92)" : "rgba(255,255,255,.96)",
      color: val === 0 ? "#e2e8f0" : "#0f172a", boxShadow: sh ? "0 0 0 2px " + col + "66" : "none" });
    n.innerHTML = val + "<small>/" + mx + "</small>";
    n.onclick = () => wake(id);
    const p = el("div", "step" + (sh ? " show" : ""), { borderColor: col, color: col });
    p.textContent = "+"; p.onclick = e => { e.stopPropagation(); set(cap ? Math.min(mx, val + 1) : val + 1); wake(id); };
    g.append(m, n, p); sheet.appendChild(g);
  }
}


// ---------- ? : how this sheet works (cf42) ----------
window.openSheetHelp = () => {
  if (!U) return;
  const sec = (t, body, open) => '<details class="gr"' + (open ? ' open' : '') + '><summary>' + t + '</summary><div>' + body + '</div></details>';
  const li = a => '<ul class="hl">' + a.map(x => '<li>' + x + '</li>').join("") + '</ul>';
  const kind = isShip(U) ? "ship" : isSquad(U) ? "squad" : isGround(U) ? "vehicle" : "suit";
  const kill = kind === "suit" ? (LIMB_LABEL[U.kill || "chest"] || "Chest") : null;
  let unit = "";
  if (kind === "suit") unit = sec("This mobile suit", li([
    "<b>Kill location: " + kill + "</b> \u2014 destroying the " + kill + " destroys the unit" + (U.kill === "head" ? " (head-mounted cockpit, not the Chest)." : "."),
    "<b>Limb circles</b> \u2014 tap to apply the DMG amount (Repair mode adds it back). Colours: green \u2192 amber \u2192 red \u2192 grey (destroyed).",
    "<b>AP / Dodges / Shield HP</b> \u2014 tap the number to show its <b>\u2212 / +</b> buttons, then adjust.",
    "<b>MOVE</b> spends 1 AP per move; <b>DODGE</b> spends one of your dodges. The small \u21B6 undoes the last one.",
    "<b>Abilities & weapons</b> \u2014 tap a <b>name</b> to read what it does; tap its AP / cooldown / ammo pips to use or track it.",
    "<b>Shield coverage dial</b> \u2014 shows which arc your shield blocks; tap it to turn the shield.",
  ]), true);
  if (kind === "ship") unit = sec("This warship", li([
    "<b>Hull / Bridge / Thrusters / Systems rings</b> \u2014 tap to apply the DMG amount (Repair adds). Hull 0 destroys the ship.",
    "<b>HIT</b> beside the Bridge \u2014 tap once per hit on the Bridge (\u22122 crew, \u22123 to rolls next turn). It pulses if the Bridge lost HP with no hit recorded.",
    "<b>Weapons</b> \u2014 tap the AP cell to fire (cooldowns and half-HP limits are applied). Tap a name for its rules.",
    "<b>CREW / AP \u2212 +</b> steppers; <b>MOVE</b> spends 1 AP (halved with one thruster down, none with both).",
    "<b>Launch / Dock</b> rows carry mobile suits; a destroyed ship asks for Emergency Disembark rolls.",
  ]), true);
  if (kind === "vehicle") unit = sec("This vehicle", li([
    "<b>HP ring</b> (and <b>Armor</b> for Tank / Car in a ground battle) \u2014 tap to apply the DMG amount.",
    "<b>Weapons</b> \u2014 tap the AP cell to use it; OVERMAP / GROUND tags say where it works; charges and cooldowns are tracked.",
    "<b>Target effects</b> (right) \u2014 what the attack does to squads, vehicles, suits and aircraft.",
    "<b>Squads aboard</b> \u2014 + embarks a squad, \u21E9 disembarks one. If the vehicle is destroyed, Emergency Disembark opens.",
    "<b>AP \u2212 +</b>, <b>MOVE</b> (1 AP), and <b>Respawn</b> once destroyed.",
  ]), true);
  if (kind === "squad") unit = sec("This infantry squad", li([
    "<b>OVERMAP</b> \u2014 tap a soldier portrait to record a casualty (you pick who falls); FIRE / MOVE for the squad; Hide from the STANCE button.",
    "<b>8 SOLDIERS</b> \u2014 two pages. Each soldier: AP / HP / Kevlar (+ Armor / Shield) bubbles (tap = DMG amount), MOVE and FIRE, \u21C4 weapon list (switch 1 AP, throw items 1 AP), stance corner. \u24D8 GROUND RULES has every table.",
    "<b>QUICK RESOLVE</b> \u2014 rounds, suppression, items, blind item call + REVEAL, margin table, optional simulated dice, Objective Clash.",
  ]), true);
  $("pickT").textContent = "? How this sheet works";
  $("pickS").innerHTML = (U.short || U.name);
  $("picklist").innerHTML = unit +
    sec("Top bar", li([
      "<b>DAMAGE / REPAIR</b> \u2014 what a tap on a ring or bubble does.",
      "<b>DMG 1\u201315</b> \u2014 how much each tap applies. <b>#</b> types any amount. <b>\u2622</b> applies a nuclear blast by distance.",
      "The turn chip shows whose turn it is \u2014 tap it to go to the roster.",
    ])) +
    sec("Bottom buttons", li([
      "<b>TABLES</b> \u2014 hit, range and damage tables.",
      "<b>STANCE</b> \u2014 declare a stance (one at a time).",
      "<b>DONE \u2713</b> \u2014 your turn: this unit has finished. Enemy turn: <b>DAMAGE COUNTED</b> (yellow tally) \u2014 this unit's damage is entered so far; a new hit clears it.",
      "<b>ROSTER</b> \u2014 back to the force list. Turns are ended once, for the whole force, from the roster.",
    ])) +
    sec("Timeline", li([
      "The strip under the sheet lists what happened to this unit each turn. Tap a turn to read it; \u21B6 buttons on the sheet undo the latest action.",
    ]));
  $("pickExtra").innerHTML = ""; $("pickCancel").textContent = "Close";
  $("pick").classList.add("on");
};
// cf44: the 16:9 sheet always fits the screen (width follows the height left over by the top bar and timeline)
function fitSheet() {
  const s4 = $("s4"), sh = $("sheet");
  if (!s4 || !sh || !s4.classList.contains("on")) return;
  const avail = window.innerHeight - $("topbar").offsetHeight - $("tl").offsetHeight;
  const full = s4.clientWidth || document.documentElement.clientWidth;
  const w = Math.max(300, Math.min(full, Math.floor(avail * 16 / 9)));
  if (sh.style.width !== w + "px") sh.style.width = w + "px";
}
window.addEventListener("resize", () => requestAnimationFrame(fitSheet));
window.addEventListener("orientationchange", () => setTimeout(fitSheet, 150));
const APP_BUILD = "cf100";
if ($("buildTag")) $("buildTag").textContent = APP_BUILD;
if ($("buildTag0")) $("buildTag0").textContent = APP_BUILD;

/* ---------- wiring ---------- */
$("search").addEventListener("input", e => { query = e.target.value; renderRoster(); });
$("mDmg").onclick = () => { mode = "damage"; document.body.classList.remove("repair"); $("mDmg").className = "on-dmg"; $("mRep").className = ""; };
$("mRep").onclick = () => { mode = "repair"; document.body.classList.add("repair"); $("mRep").className = "on-rep"; $("mDmg").className = ""; };
function advance(u, st) {
  if (isShip(u)) { shipAdvance(u, st); return; }
  if (isGround(u)) {
    if (u.gtype === "squad") { sqMigrate(u, st); st.ap = sqAlive(st) === 1 ? 1 : u.ap; st.sq.soldiers.forEach(x => { sqSoldierFix(x); x.ap = x.hp > 0 ? 3 : 0; }); return; }
    gvAdvance(u, st); return;
  }
  // modes tick first, so a buff that runs out does not leak into the new turn
  u.abilities.forEach((a, i) => {
    const t = st.track[i];
    if (a.kind !== "mode" || !t) return;
    if (!t.on && t.burn > 0) t.burn -= 1;                  // an existing burnout wears off
    if (t.on) {
      t.left = Math.max(0, t.left - 1);
      if (!t.left) st.track[i] = { on: false, left: a.duration, ch: t.ch, burn: burnTurns(a) };
    }
  });
  u.abilities.forEach((a, i) => {
    if (a.kind !== "toggle" || !a.fx || !a.fx.risk || st.track[i] !== 1) return;
    if (!st.risk) st.risk = {};
    const r = st.risk[i] || (st.risk[i] = { n: 0 });
    r.n += 1; r.pend = true; r.res = null;
  });
  let dm = u.dodges, am = u.ap;
  u.abilities.forEach((a, i) => {
    const fx = a.fx; if (!fx) return;
    const on = a.kind === "none"
      || (a.kind === "mode" && st.track[i] && st.track[i].on)
      || (a.kind === "toggle" && st.track[i] === 1);
    if (!on) return;
    if (fx.dodgesSet !== undefined) dm = fx.dodgesSet;
    if (fx.dodgesPlus) dm += fx.dodgesPlus;
    if (fx.apPlus) am += fx.apPlus;
  });
  // head destroyed strips Free Dodges from a Gundam-tier unit permanently
  const GT = ["Flagship","Super Flagship","Superweapon","Myth","Unknown Class"];
  const dLoc = (u.kill || "chest") === "head" ? "chest" : "head";
  if (st.hp && st.hp[dLoc] === 0 && GT.indexOf(u.tier) >= 0) dm = 0;
  st.ap = am; st.dodges = dm;
  u.weapons.forEach((w, i) => {
    if (w.limit && w.limit.kind === "cooldown" && st.wpn[i] > 0) st.wpn[i] = Math.max(0, st.wpn[i] - 1);
  });
  refillMatrix(u, st);
  refillDual(u, st, "start");                     // Funnel Cannon bonus shot: ready for your turn
  // revealed pods go home at the start of the unit's next turn
  if (u.pods && Array.isArray(st.pods)) st.pods.forEach(P => { if (P.hp > 0 && P.state === 2) P.state = 0; });
  // beam shields come back online after their regeneration window
  (u.shields || []).forEach((cfg, i) => {
    if (st.shDown && st.shDown[i] > 0) {
      st.shDown[i] -= 1;
      if (st.shDown[i] === 0) st.sh[i] = (Array.isArray(st.shMax) && st.shMax[i]) || cfg.hp;
    }
  });
}

/* ---------- turn tracker ---------- */
let snaps = {}, tlSel = null, phaseUndo = null;
const SEV = { bad: 4, remind: 3, good: 2, buff: 1, info: 0 };
const SEVCOL = { bad: "#dc2626", remind: "#d97706", good: "#16a34a", buff: "#7c3aed", info: "#475569" };

function logEv(uid, text, kind, key) {
  turn.log.push({ r: turn.round, p: turn.phase, u: uid, t: text, k: kind || "info", key: key || null, at: Date.now() });
  if (turn.log.length > 800) turn.log.splice(0, turn.log.length - 800);
  turn.started = true;
}
// a change reversed straight away (mis-tap) removes its entry instead of adding another
function unlog(uid, key) {
  for (let i = turn.log.length - 1; i >= 0; i--) {
    const e = turn.log[i];
    if (e.r !== turn.round || e.p !== turn.phase) return false;
    if (e.u === uid && e.key === key) { turn.log.splice(i, 1); return true; }
  }
  return false;
}
let sheetTap = null;
document.addEventListener("pointerdown", ev => { if (ev.target.closest && ev.target.closest("#sheet")) sheetTap = { x: ev.clientX, y: ev.clientY, t: Date.now() }; }, true);
function sheetFx(kind) {
  if (!sheetTap || Date.now() - sheetTap.t > 800) return;
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let box = $("sheetfx");
  if (!box) { box = document.createElement("div"); box.id = "sheetfx"; document.body.appendChild(box); }
  if (box.childElementCount > 6) return;
  const im = document.createElement("img");
  im.className = "sfx " + kind; im.alt = "";
  im.src = "img/fx/" + (kind === "kill" ? "star-y" : ["star-y", "spark-p", "star-w"][Math.floor(Math.random() * 3)]) + ".webp";
  im.style.left = sheetTap.x + "px"; im.style.top = sheetTap.y + "px";
  box.appendChild(im); setTimeout(() => im.remove(), kind === "kill" ? 1100 : 600);
  if (kind === "kill") {
    const rg = document.createElement("img"); rg.className = "sfx ring"; rg.alt = ""; rg.src = "img/fx/ring-o.webp";
    rg.style.left = sheetTap.x + "px"; rg.style.top = sheetTap.y + "px"; box.appendChild(rg); setTimeout(() => rg.remove(), 1000);
  }
}
function aggDmg(uid, key, label, delta, nowVal, max, verb) {
  if (!delta) return;
  if (delta > 0) { damageUntick(uid); sheetFx(nowVal === 0 ? "kill" : "hit"); }
  let e = turn.log.find(x => x.u === uid && x.key === key && x.r === turn.round && x.p === turn.phase);
  if (!e) { logEv(uid, "", "bad", key); e = turn.log[turn.log.length - 1]; e.n = 0; }
  e.n = (e.n || 0) + delta;
  if (e.n === 0) { turn.log.splice(turn.log.indexOf(e), 1); return; }       // a mis-tap cancelled out
  const tail = " (" + nowVal + "/" + max + (e.n > 0 ? " left)" : ")");
  e.k = e.n > 0 ? "bad" : "good";
  e.t = e.n > 0 ? label + " " + (verb || "took") + " " + e.n + tail : label + " repaired " + (-e.n) + tail;
}
// "2" -> [2], "1-2" / "1/2" / "2/3" -> both, "1 ea" -> [1], "—" -> nothing to tap
function apOptions(txt) {
  const nums = String(txt || "").match(/\d+/g);
  if (!nums) return [];
  return nums.slice(0, 2).map(Number).filter((v, k, arr) => arr.indexOf(v) === k);
}
// one running timeline line per half-turn for the quick buttons
function qaLog(uid, key, n, text) {
  let e = turn.log.find(x => x.u === uid && x.key === key && x.r === turn.round && x.p === turn.phase);
  if (!n) { if (e) turn.log.splice(turn.log.indexOf(e), 1); return; }
  if (!e) { logEv(uid, "", "info", key); e = turn.log[turn.log.length - 1]; }
  e.n = n; e.t = text; e.k = "info";
}
function snapOf(r) {
  const st = r.st || {};
  return JSON.parse(JSON.stringify({ hp: st.hp || {}, sh: st.sh || [], shDown: st.shDown || [], track: st.track || [],
    wpn: st.wpn || [], pods: st.pods || null, risk: st.risk || {}, ex: examCheck[r.uid], shMax: st.shMax || null }));
}
function trackChanges() {
  if (!CUR || !U) return;
  const now = snapOf(CUR), was = snaps[CUR.uid];
  snaps[CUR.uid] = now;
  if (!was) return;
  const uid = CUR.uid, u = U, kl = u.kill || "chest";
  const add = (key, text, kind) => logEv(uid, text, kind, key);
  const undoOr = (key, text, kind) => { if (!unlog(uid, key)) logEv(uid, text, kind, key + ":r"); };
  // hit locations
  LIMB_ORDER.forEach(k => {
    const a = was.hp[k], b = now.hp[k];
    if (typeof a === "number" && typeof b === "number") aggDmg(uid, "hp:" + k, LIMB_LABEL[k], a - b, b, u.limb[k]);
    if (a > 0 && b === 0) add("limb:" + k, k === kl ? "DESTROYED (" + LIMB_LABEL[k] + ")" : LIMB_LABEL[k] + " destroyed", "bad");
    else if (a === 0 && b > 0) undoOr("limb:" + k, LIMB_LABEL[k] + " repaired", "good");
  });
  // shields
  (u.shields || []).forEach((c, i) => {
    const nm = c.label || (u.lendable ? "DE " + (i + 1) : u.shields.length > 1 ? "Shield " + (i + 1) : "Shield");
    // a shield coming back from regeneration is not a repair tap
    if (typeof was.sh[i] === "number" && typeof now.sh[i] === "number" && !(was.shDown[i] > 0 && now.shDown[i] === 0))
      aggDmg(uid, "shd:" + i, nm, was.sh[i] - now.sh[i], now.sh[i], (now.shMax && now.shMax[i]) || c.hp);
    if (was.sh[i] > 0 && now.sh[i] === 0) add("sh:" + i, nm + (c.label ? " burned away" : " destroyed"), "bad");
    else if (was.sh[i] === 0 && now.sh[i] > 0 && !(was.shDown[i] > 0)) undoOr("sh:" + i, nm + " repaired", "good");
    if (was.shDown[i] !== -1 && now.shDown[i] === -1) add("shx:" + i, nm + " generator destroyed (Natural 20 Block)", "bad");
    if (!(was.shDown[i] > 0) && now.shDown[i] > 0) add("shr:" + i, nm + " offline \u2014 back in " + now.shDown[i] + " turns", "info");
  });
  // abilities
  u.abilities.forEach((a, i) => {
    const A = was.track[i], B = now.track[i], key = "ab:" + i;
    if (a.kind === "dualmode" && A && B) {
      const mA = a.modes.find(x => x.id === A.mode), mB = a.modes.find(x => x.id === B.mode);
      if (A.mode !== B.mode) add(key + ":mode", a.name + " \u2192 " + (mB ? mB.label : B.mode) + " mode", "buff");
      else if (A.n > 0 && B.n === 0) add(key + ":use", (mB.id === "cannon" ? "Funnel Cannon bonus shot fired" : "I-Field free block used"), mB.id === "cannon" ? "buff" : "good");
      else if (A.n === 0 && B.n > 0) undoOr(key + ":use", (mB.id === "cannon" ? "Bonus shot" : "Free block") + " given back", "info");
    }
    if (a.kind === "matrix" && A && B) {
      if (A.sel !== B.sel) {
        const o = mxOpt(a, B.sel);
        add(key + ":sel", o ? a.name + ": " + o.name + " drawn" : a.name + ": pair put away", "buff");
      } else if (B.sel && B.p < A.p) {
        const o = mxOpt(a, B.sel);
        for (let n = A.p - 1; n >= B.p; n--) add(key + ":p", o.name + " parry used (" + n + "/" + o.parries + " left)", "good");
      } else if (B.sel && B.p > A.p) {
        for (let n = A.p; n < B.p; n++) undoOr(key + ":p", "Parry given back", "info");
      }
    }
    if (a.kind === "mode" && A && B) {
      if (!A.on && B.on) add(key, a.name + " activated" + (B.ch !== null && B.ch !== undefined ? " (" + B.ch + "/" + a.charges + " left)" : ""), "buff");
      else if (A.on && !B.on) {
        add(key + ":off", a.name + " switched off", "info");
        if (B.burn > 0 && a.fx && a.fx.burnout) add(key + ":burn", a.name + " burnout \u2014 " + a.fx.burnout.rollPlus + " to every roll", "bad");
      }
      if (A.burn > 0 && !(B.burn > 0) && !B.on) add(key + ":burnx", a.name + " burnout cleared", "info");
    } else if (a.kind === "toggle") {
      if (A !== 1 && B === 1) add(key, a.name + " ON", "buff");
      else if (A === 1 && B !== 1) add(key + ":off", a.name + " OFF", "info");
      if (a.fx && a.fx.risk) {
        const ra = was.risk[i] || {}, rb = now.risk[i] || {};
        if (rb.res && rb.res !== ra.res) {
          const tgt = riskTarget(a.fx.risk, rb.n), nm = a.name.split(" ")[0];
          if (rb.res === "pass") add(key + ":risk", nm + " check passed (" + tgt + "+)", "good");
          else add(key + ":risk", nm + " check failed (" + tgt + "+) \u2014 " + a.fx.risk.dmg + " " + LIMB_LABEL[a.fx.risk.loc] + " damage", "bad");
        }
      }
    } else if (a.kind === "counter" && typeof A === "number" && typeof B === "number" && A !== B) {
      if (a.tracks === "pool") {
        aggDmg(uid, "pool:" + i, a.name, A - B, B, a.max, "absorbed");
        if (A > 0 && B === 0) add(key, a.name + " depleted", "bad");
        else if (A === 0 && B > 0) undoOr(key, a.name + " restored", "good");
      } else if (B < A) {
        for (let n = A - 1; n >= B; n--) add(key, a.name + " used (" + n + "/" + a.max + " left)", "buff");
      } else {
        for (let n = A; n < B; n++) undoOr(key, a.name + " charge restored", "info");
      }
    } else if (a.kind === "auto") {
      const oa = autoOn(a, u, was), ob = autoOn(a, u, now), nm = a.name.split(" ")[0];
      if (!oa && ob) add(key, a.name + " triggered", "bad");
      else if (oa && !ob) undoOr(key, a.name + " ended \u2014 shield repaired", "good");
    }
  });
  if (was.ex !== now.ex && now.ex !== undefined) {
    const a = u.abilities.find(x => x.berserk);
    add("ex", now.ex ? "Berserk check " + (a ? a.berserk.fail : "") + " \u2014 attacks the nearest unit" : "Berserk check passed", now.ex ? "bad" : "good");
  }
  // weapons with limits
  const seen = {};
  u.weapons.forEach((w, i) => {
    if (!w.limit) return;
    const g = w.limit.group || ("w" + i);
    if (seen[g]) return;
    const A = was.wpn[i], B = now.wpn[i], key = "w:" + g;
    if (A === B) return;
    seen[g] = 1;
    if (w.limit.kind === "cooldown") {
      if (!(A > 0) && B > 0) add(key, w.name + " fired", "buff");
      else if (A > 0 && !(B > 0)) undoOr(key, w.name + " marked ready", "info");
    } else if (B < A) add(key, w.name + " fired (" + B + "/" + w.limit.max + " left)", "buff");
    else undoOr(key, w.name + " charge restored", "info");
  });
  // remote pods
  if (u.pods && Array.isArray(now.pods) && Array.isArray(was.pods)) {
    const ST = u.pods.states || ["STOWED", "DEPLOYED", "REVEALED"];
    now.pods.forEach((P, i) => {
      const Q = was.pods[i] || {}, nm = u.pods.label + " " + (i + 1), key = "pod:" + i;
      if (typeof Q.hp === "number") aggDmg(uid, key + ":hp", nm, Q.hp - P.hp, P.hp, u.pods.hp);
      if (Q.hp > 0 && P.hp === 0) add(key + ":x", nm + " destroyed", "bad");
      else if (Q.hp === 0 && P.hp > 0) undoOr(key + ":x", nm + " repaired", "good");
      if (P.hp > 0 && Q.state !== P.state)
        add(key, nm + " " + (Q.state === 1 && P.state === 0 ? "recalled" : ST[P.state]), P.state === 2 ? "bad" : "info");
    });
  }
}

function reloadCur() {
  if (!CUR) return;
  const r = roster.find(x => x.uid === CUR.uid);
  if (!r) { CUR = null; return; }
  CUR = r; U = unitById(r.id);
  const s = r.st;
  hp = s.hp; dodges = s.dodges; ap = s.ap; track = s.track; wpn = s.wpn; sh = s.sh; shDown = s.shDown;
  shMax = Array.isArray(s.shMax) ? s.shMax : (U.shields || []).map(x => x.hp);
  out = U.lendable ? (s.out || null) : null;
  lent = Array.isArray(s.lent) ? s.lent : [];
  pods = U.pods ? s.pods : null;
  risk = s.risk || {};
}
function captureState() { return JSON.stringify({ sts: roster.map(r => [r.uid, r.st]), turn: turn }); }
function beforePhase() {
  if ($("s4").classList.contains("on")) persist();   // flush the open sheet only if it is showing
  phaseUndo = captureState();
}
let turnKeySeen = null;
function turnBanner() {
  const b = $("tbanner"); if (!b) return;
  const you = turn.phase === "you";
  $("tbannerT").textContent = you ? "YOUR TURN" : "ENEMY TURN";
  $("tbannerS").textContent = "ROUND " + Math.max(1, turn.round);
  b.className = you ? "you" : "enemy";
  void b.offsetWidth; b.classList.add("go");
  clearTimeout(b._t); b._t = setTimeout(() => { b.className = ""; }, 1500);
}
function afterPhase(notes) {
  const tk = turn.round + ":" + turn.phase;
  if (turnKeySeen !== null && tk !== turnKeySeen) turnBanner();
  turnKeySeen = tk;
  examCheck = {};
  tlSel = null;
  reloadCur();
  snaps = {};
  roster.forEach(r => { snaps[r.uid] = snapOf(r); });
  save(); renderRoster();
  if ($("s4").classList.contains("on") && CUR) draw(); else renderTurn();
  if (notes && notes.length) showNotice("End of turn " + (turn.round) + " \u2014 reminders", notes.join("\n\n"));
}
const markPipFor = uid => markPipHTML(roster.find(x => x.uid === uid), "inl");
function unitLabel(uid) {
  const r = roster.find(x => x.uid === uid);
  if (!r) return "(removed)";
  const u = unitById(r.id), n = countOf(r.id);
  return (u.short || u.name) + (n > 1 ? " #" + copyIndex(r) : "");
}
// the other team's leader runs a different build (it may not send turn changes)
function mpBuildHint(team) {
  const lp = mp.leaders && mp.leaders[team], p = lp && mp.data["player/" + lp];
  if (!p) return "";
  if (!p.build) return '<small> \u2014 ' + p.name + ' is on an older build: ask them to refresh the app</small>';
  if (p.build !== APP_BUILD) return '<small> \u2014 ' + p.name + ' is on build ' + p.build + ' (you: ' + APP_BUILD + '): ask them to refresh</small>';
  return "";
}
// the other side's units that can still take damage, and how many of them are marked DAMAGE COUNTED
function mpDefenderCount() {
  const ot = otherTeam(mpMyTeam()), td = mp.data["team/" + ot];
  if (!td || !Array.isArray(td.roster)) return { n: 0, of: 0 };
  const key = td.turn ? td.turn.round + ":" + td.turn.phase : null;
  const aboard = new Set();
  td.roster.forEach(x => {
    const u = unitById(x.id); if (!isShip(u)) return;
    const S = (mp.data["unit/" + ot + "/" + x.uid] || {}).st; const sh = S && S.ship;
    ((sh && sh.carry) || []).forEach(v => aboard.add(v));
    ((sh && sh.docking) || []).forEach(d => aboard.add(d.uid));
  });
  td.roster.forEach(x => {
    const u = unitById(x.id); if (!isGround(u)) return;
    const G = ((mp.data["unit/" + ot + "/" + x.uid] || {}).st || {}).gv;
    ((G && G.carry) || []).forEach(v => aboard.add(v));
  });
  let n = 0, of = 0;
  td.roster.forEach(x => {
    const u = unitById(x.id); if (!u) return;
    const d = mp.data["unit/" + ot + "/" + x.uid], st = d && d.st, kl = u.kill || "chest";
    if (st && st.hp && st.hp[kl] === 0) return;          // destroyed
    if (aboard.has(x.uid)) return;                        // passengers can't be hit
    of += 1;
    if (d && d.done && d.done === key) n += 1;
  });
  return { n, of };
}
function mpEndGate() {                                    // may the active team end its turn right now?
  const tk = mpOfficialTurn(); if (!tk) return "go";
  const c = mpDefenderCount();
  if (!c.of || c.n >= c.of) return "go";
  if (tk.req && tk.req.team === mpMyTeam() && tk.req.seq === tk.seq && tk.req.ok) return "go";
  return "wait";
}
window.mpMakeLead = pid => {
  const p = mpPlayers()[pid]; if (!p || !mpAmLeader()) return;
  if (!confirm("Make " + p.name + " the team leader?")) return;
  save(); mp.wantPassLead = { to: pid }; mpKick();
};
window.mpCancelEndRequest = () => { if (!mpAmLeader()) return; mp.wantEndRequest = { cancel: true }; mpKick(); };
window.mpAcceptEnd = () => {
  const tk = mpOfficialTurn(); if (!tk || !tk.req || !mpAmLeader()) return;
  if (!confirm("Let the " + teamName(tk.req.team) + " end their turn now, before every unit's damage is counted?")) return;
  mp.wantAcceptEnd = { seq: tk.req.seq }; mpKick();
};
window.mpPassLead = () => {
  if (!mpAmLeader()) return;
  const t = mpMyTeam(), now = mpNow();
  const mates = Object.entries(mpPlayers()).filter(([pid, p]) => pid !== mp.pid && p.team === t && now - (p.seen || 0) < 90000);
  $("pickT").textContent = "\u{1F451} Pass leadership";
  $("pickS").innerHTML = "The leader builds the roster, confirms the team and ends / starts the turn. Pick who takes over \u2014 you become a normal team member.";
  const lst = $("picklist"); lst.innerHTML = "";
  if (!mates.length) lst.innerHTML = '<div class="empty">No other active players on your team.</div>';
  mates.forEach(([pid, p]) => {
    const d = el("div", "row");
    d.innerHTML = '<span style="font-size:20px">\u{1F451}</span><span style="min-width:0;flex:1"><div class="nm">' + p.name + '</div><div class="tr">make team leader</div></span>';
    d.onclick = () => {
      if (!confirm("Make " + p.name + " the team leader?")) return;
      closePicker(); save(); mp.wantPassLead = { to: pid }; mpKick();
      mpToast(p.name + " is now the team leader.");
    };
    lst.appendChild(d);
  });
  $("pickExtra").innerHTML = ""; $("pickCancel").textContent = "Cancel";
  $("pick").classList.add("on");
};
function mpOfficialTurn() { return typeof mpTeamMode === "function" && mpTeamMode() ? (mp.data.turn || null) : null; }
// a firefight between the teams that is mid-segment (its 4 rounds aren't finished)
function ffActiveFight() {
  if (typeof mpTeamMode !== "function" || !mpTeamMode()) return null;
  return Object.values(mp.data).find(v => v && v.id && v.a && v.b && (["mode", "ready", "pick", "reveal"].includes(v.state) || ffBreakPending(v))) || null;
}
function endMyTurn() {
  const tk = mpOfficialTurn();
  const fight = ffActiveFight();
  if (tk && fight) {
    mpToast(fight.state === "end" ? "Finish the objective clash or disengagement, then both teams confirm their next fighters." : "Finish the firefight’s four rounds before ending the turn.");
    renderTurn(); return;
  }
  if (tk && tk.active !== mpMyTeam()) { mpToast("It's the " + teamPoss(tk.active) + " turn right now."); renderTurn(); return; }
  if (tk && mpEndGate() === "wait") {
    if (!(tk.req && tk.req.team === mpMyTeam() && tk.req.seq === tk.seq)) {
      mp.wantEndRequest = { seq: tk.seq };
      mp.data.turn = Object.assign({}, tk, { req: { team: mpMyTeam(), seq: tk.seq, ok: false, pending: true } });
      mpKick();
      mpToast("The " + teamName(otherTeam(mpMyTeam())) + " are still counting damage \u2014 your turn ends as soon as they finish.");
    }
    renderTurn(); return;
  }
  endMyTurnCore();
  if (tk) {
    mp.wantEndTurn = { seq: tk.seq };
    mp.data.turn = Object.assign({}, tk, { active: otherTeam(mpMyTeam()), seq: tk.seq + 1, endedBy: mpMyTeam(), pending: true });
    mpKick(); renderTurn();
  }
}
function endMyTurnCore() {
  beforePhase();
  const notes = [];
  roster.forEach(r => {
    const u = unitById(r.id);
    if (r.st.hp && r.st.hp[u.kill || "chest"] === 0) return;
    u.abilities.forEach((a, i) => {
      if (!a.eot) return;
      if (a.eotWhen === "active" && !(r.st.track[i] && r.st.track[i].on)) return;
      logEv(r.uid, a.eot, "remind", "eot:" + i);
      notes.push(unitLabel(r.uid) + " \u2014 " + a.eot);
    });
  });
  roster.forEach(r => refillMatrix(unitById(r.id), r.st));   // a new clash segment always starts in a new half-turn
  roster.forEach(r => refillDual(unitById(r.id), r.st, "end"));   // I-Field free block: ready for the enemy's attacks
  turn.phase = "enemy"; turn.started = true;
  turn.done = [];
  // multiplayer: count every real end of turn (an undo never counts), so the room can't miss one
  turn.mpEnds = (turn.mpEnds || 0) + 1;
  afterPhase(notes);
}
function startMyTurn() {
  const tk = mpOfficialTurn();
  if (tk && tk.active !== mpMyTeam()) { mpToast("Wait for the " + teamName(tk.active) + " to end their turn."); renderTurn(); return; }
  startMyTurnCore();
}
function startMyTurnCore() {
  if (typeof mp !== "undefined" && mp.data && mp.data.turn) mp.autoSeq = mp.data.turn.seq;   // a manual start counts too
  beforePhase();
  turn.done = [];                                   // enemy-turn tallies don't carry into your own turn
  turn.round += 1; turn.phase = "you"; turn.started = true;
  roster.forEach(r => {
    const u = unitById(r.id), was = JSON.parse(JSON.stringify(r.st));
    advance(u, r.st);
    const st = r.st, uid = r.uid;
    // squads resupply by riding a vehicle: aboard through a whole turn = a full set of items again
    if (isSquad(u) && st.sq) {
      st.sq.qr = st.sq.qr || {};
      const q = st.sq.qr, cs = carrierState(uid), aboard = cs && cs.state === "aboard";
      if (!aboard) delete q.abRound;
      else if (q.abRound == null) q.abRound = turn.round;                       // just boarded: the clock starts
      else if (turn.round > q.abRound) {
        const it = q.items || (q.items = { fb: 2, sm: 1, gr: 1 });
        if (it.fb < 2 || it.sm < 1 || it.gr < 1) {
          q.items = { fb: 2, sm: 1, gr: 1 };
          logEv(uid, "\u2693 Resupplied aboard the " + (cs.u.short || cs.u.name) + " \u2014 2 Flashbangs \u00b7 1 Smoke \u00b7 1 Grenade", "buff");
        }
        q.abRound = turn.round;
      }
    }
    u.abilities.forEach((a, i) => {
      const A = was.track[i], B = st.track[i];
      if (a.kind === "mode" && A && B) {
        if (A.on && !B.on) {
          logEv(uid, a.name + " ended", "info");
          if (B.burn > 0 && a.fx && a.fx.burnout) logEv(uid, a.name + " burnout this turn \u2014 " + a.fx.burnout.rollPlus + " to every roll", "bad");
        }
        if (A.burn > 0 && !(B.burn > 0) && !B.on) logEv(uid, a.name + " burnout over", "info");
        if (A.burn > 0 && B.burn > 0 && !A.on && !B.on && a.fx && a.fx.burnout)
          logEv(uid, a.name + " burnout continues this turn \u2014 " + a.fx.burnout.rollPlus + " to every roll", "bad");
      }
      if (a.kind === "toggle" && a.fx && a.fx.risk && B === 1) {
        const rr = (st.risk || {})[i];
        if (rr && rr.pend) logEv(uid, a.name.split(" ")[0] + " check due \u2014 need " + riskTarget(a.fx.risk, rr.n) + "+", "remind");
      }
    });
    (u.shields || []).forEach((c, i) => {
      if (was.shDown && was.shDown[i] > 0 && st.shDown[i] === 0) logEv(uid, (u.shields.length > 1 ? "Shield " + (i + 1) : "Shield") + " back online", "good");
    });
    const seen = {};
    u.weapons.forEach((w, i) => {
      if (!w.limit || w.limit.kind !== "cooldown") return;
      const g = w.limit.group || ("w" + i);
      if (seen[g]) return;
      if (was.wpn[i] > 0 && st.wpn[i] === 0) { seen[g] = 1; logEv(uid, w.name + " ready", "info"); }
    });
    if (u.pods && Array.isArray(was.pods)) was.pods.forEach((P, i) => {
      if (P.hp > 0 && P.state === 2 && st.pods[i].state === 0) logEv(uid, u.pods.label + " " + (i + 1) + " returned", "info");
    });
  });
  afterPhase();
}
// enemy turn: a yellow tally = "this unit's damage is counted so far" (more hits clear it again)
const TALLY_SVG = '<svg class="tallyic" viewBox="0 0 48 40" aria-hidden="true"><g fill="currentColor"><rect x="9" y="1" width="4.4" height="38" rx="1"/><rect x="18" y="1" width="4.4" height="38" rx="1"/><rect x="27" y="1" width="4.4" height="38" rx="1"/><rect x="36" y="1" width="4.4" height="38" rx="1"/><rect x="-1" y="17.8" width="50" height="4.4" rx="1" transform="rotate(32 24 20)"/></g></svg>';
const doneMark = () => turn.phase === "you" ? "\u2713" : TALLY_SVG;
function needsRecheck(r) { return !!(r && r.st && r.st.recheck === turnKeyNow() && !isDone(r.uid) && turn.phase !== "you"); }
// health went down on a unit already counted this enemy turn: clear its mark
function damageUntick(uid) {
  if (turn.phase === "you" || !isDone(uid)) return;
  const r = roster.find(x => x.uid === uid); if (!r) return;
  r.st.recheck = turnKeyNow();
  if (typeof mpTeamMode === "function" && mpTeamMode()) mpQuickDone(uid, false); else setDone(uid, false);
  logEv(uid, "New damage after it was counted \u2014 check this unit again", "remind");
  mpToast(unitLabel(uid) + " took new damage \u2014 tap DAMAGE COUNTED again once it's applied.");
}
// per-unit "done this turn" ticks
function isDead(r) { const u = unitById(r.id); return !!(r.st && r.st.hp && r.st.hp[u.kill || "chest"] === 0); }
function isDone(uid) { return turn.done.indexOf(uid) >= 0; }
function setDone(uid, v) {
  turn.done = turn.done.filter(x => x !== uid);
  if (v) { turn.done.push(uid); const r = roster.find(x => x.uid === uid); if (r && r.st && r.st.recheck) delete r.st.recheck; }
  save();
}
window.toggleDone = uid => {
  if (mpTeamMode()) { mpQuickDone(uid, !isDone(uid)); return; }
  setDone(uid, !isDone(uid)); renderRoster(); if ($("s4").classList.contains("on")) renderTurn();
};
function doneTally() {
  const alive = roster.filter(r => !isDead(r) && !outOfPlay(r.uid));
  return { n: alive.filter(r => isDone(r.uid)).length, of: alive.length };
}
function phaseTap() {
  if (!mpGuardLeader(turn.phase === "you" ? "end the turn" : "start the turn")) return;
  const fight = turn.phase === "you" && ffActiveFight();
  if (fight) { mpToast(fight.state === "end" ? "Finish the objective clash or disengagement, then both teams confirm their next fighters." : "Finish the firefight’s four rounds before ending the turn."); return; }
  const busy = mpOthersEditing();
  if (busy.length) { mpToast("Wait until these sheets are closed: " + busy.join(", ")); return; }
  if (turn.phase !== "you") { startMyTurn(); return; }
  const left = roster.filter(r => !isDead(r) && !isDone(r.uid) && !outOfPlay(r.uid));
  if (!left.length) { endMyTurn(); return; }
  // some units have not been ticked off: warn before handing the turn over
  $("pickT").textContent = left.length === 1 ? "1 unit hasn't moved yet" : left.length + " units haven't moved yet";
  $("pickS").innerHTML = "These units aren't ticked off as done. Are you sure you want to go to the <b>enemy turn</b>? Tap a unit to open its sheet.";
  const lst = $("picklist"); lst.innerHTML = "";
  left.forEach(r => {
    const u = unitById(r.id), d = el("div", "row");
    d.innerHTML = '<span class="tick"></span><span style="min-width:0;flex:1"><div class="nm">' + markPipHTML(r, "inl") + unitLabel(r.uid) + '</div>' +
      '<div class="tr">' + u.tier + ' \u00b7 tap to open its sheet</div></span>';
    d.onclick = () => { closePicker(); openSheet(r.uid); };
    lst.appendChild(d);
  });
  $("pickCancel").textContent = "Keep playing";
  const go = el("button", "btn enemyturn");
  go.textContent = "End turn anyway \u25B8";
  go.onclick = () => { closePicker(); endMyTurn(); };
  $("pickExtra").innerHTML = ""; $("pickExtra").appendChild(go);
  $("pick").classList.add("on");
}
function undoPhase() {
  if (!phaseUndo || !mpGuardLeader("undo the turn change")) return;
  const d = JSON.parse(phaseUndo);
  d.sts.forEach(([uid, st]) => { const r = roster.find(x => x.uid === uid); if (r) r.st = st; });
  turn = d.turn; phaseUndo = null;
  afterPhase();
}
function setFirst(who) {
  if (turn.started || mpTeamMode()) return;          // in a session the host decides who goes first
  turn.first = who;
  turn.round = who === "enemy" ? 0 : 1;
  turn.phase = who === "enemy" ? "enemy" : "you";
  save(); renderTurn(); if ($("s3").classList.contains("on")) renderRoster();
}
function newGame() {
  if (!mpGuardLeader("start a new game")) return;
  if (!confirm("Start a new game?\n\nThe turn count and timeline reset, and every model goes back to full health.")) return;
  turn = freshTurn();
  roster.forEach(r => { r.st = freshState(unitById(r.id)); });
  phaseUndo = null;
  afterPhase();
}
function showNotice(title, body) {
  $("popT").textContent = title; $("popK").textContent = "";
  $("popS").innerHTML = ""; $("popB").textContent = body;
  $("pop").classList.add("on");
}
window.closePop = () => $("pop").classList.remove("on");

// the pips: one pill per round, left half = your turn, right half = enemy turn
function pipsHTML(uid, big) {
  const lo = turn.first === "enemy" ? 0 : 1;
  const from = Math.max(lo, turn.round - (big ? 11 : 7));
  const curIdx = turn.round * 2 + (turn.phase === "enemy" ? 1 : 0);
  const sel = tlSel || { r: turn.round, p: turn.phase };
  let h = '<div class="pips' + (big ? ' big' : '') + '">';
  for (let r = from; r <= turn.round; r++) {
    h += '<div class="rnd' + (r === turn.round ? ' cur' : '') + '"><div class="halves">';
    ["you", "enemy"].forEach(p => {
      if (r === 0 && p === "you") { h += '<div class="half you skip" title="The enemy opened the game"></div>'; return; }
      const idx = r * 2 + (p === "enemy" ? 1 : 0);
      const st = idx < curIdx ? "done" : idx === curIdx ? "now" : "future";
      const evs = turn.log.filter(e => e.r === r && e.p === p && e.u !== null && (uid === null || e.u === uid));
      let dot = "";
      if (evs.length) {
        const worst = evs.reduce((m, e) => SEV[e.k] > SEV[m] ? e.k : m, "info");
        dot = '<span class="dot" style="background:' + SEVCOL[worst] + '">' + evs.length + '</span>';
      }
      const isSel = sel.r === r && sel.p === p;
      h += '<div class="half ' + p + ' ' + st + (isSel ? ' sel' : '') + '" onclick="pickHalf(' + r + ',\'' + p + '\')" title="' +
        (p === "you" ? "Your turn " : "Enemy turn ") + (r || "(opening)") + '">' + dot + '</div>';
    });
    h += '</div><div class="lbl">' + (r === 0 ? "OPEN" : "T" + r) + '</div></div>';
  }
  return h + '</div>';
}
window.pickHalf = (r, p) => {
  const idx = r * 2 + (p === "enemy" ? 1 : 0), cur = turn.round * 2 + (turn.phase === "enemy" ? 1 : 0);
  if (idx > cur) return;
  tlSel = (r === turn.round && p === turn.phase) ? null : { r: r, p: p };
  renderTurn();
};
function eventsHTML(uid, withNames) {
  const sel = tlSel || { r: turn.round, p: turn.phase };
  const evs = turn.log.filter(e => e.r === sel.r && e.p === sel.p && e.u !== null && (uid === null || e.u === uid)).slice().reverse();
  const when = (sel.p === "you" ? "Your turn " : "Enemy turn ") + (sel.r || "(opening)");
  if (!evs.length) return '<div class="evl"><div class="ev"><span class="none">' + when + ' \u2014 nothing recorded' + (uid !== null ? ' for this unit' : '') + '</span></div></div>';
  // hit-location damage totals for this half-turn (shields and armour pools are listed separately)
  const tot = {};
  evs.forEach(e => { if (e.key && e.key.indexOf("hp:") === 0 && e.n > 0) tot[e.u] = (tot[e.u] || 0) + e.n; });
  const ids = Object.keys(tot);
  const totHTML = ids.length ? '<div class="ev bad" style="font-weight:700"><span>Damage taken: ' +
    ids.map(k => (withNames ? markPipFor(+k) + unitLabel(+k) + ' ' : '') + tot[k]).join(' \u00b7 ') + '</span></div>' : '';
  return '<div class="evl">' + totHTML + evs.map(e => '<div class="ev ' + e.k + '">' + (withNames ? '<b>' + markPipFor(e.u) + unitLabel(e.u) + '</b>' : '') + '<span>' + e.t + '</span></div>').join("") + '</div>';
}
function renderTurn() {
  setTimeout(fitSheet, 0);
  if (turnKeySeen === null && turn) turnKeySeen = turn.round + ":" + turn.phase;
  const you = turn.phase === "you";
  const label = you ? "YOUR TURN" : "ENEMY TURN";
  const nUnits = roster.filter(r => !isDead(r) && !outOfPlay(r.uid)).length;   // destroyed units and passengers are out of the fight
  const scope = " \u2014 all " + nUnits + (nUnits === 1 ? " unit" : " units");
  const fightNow = you && typeof ffActiveFight === "function" && ffActiveFight();
  const btnTxt = fightNow ? "\u2694 Firefight in progress \u2014 round " + fightNow.round + " of 4"
    : (you ? "End My Turn" : "Start My Turn") + scope + " \u25B8";
  const sel = tlSel || { r: turn.round, p: turn.phase };
  // sheet: top bar + bottom strip
  const pc = $("phaseChip");
  if (pc) { pc.textContent = (turn.round ? "T" + turn.round : "OPENING") + " \u00b7 " + label + "  \u2197 roster"; pc.className = "phase sm " + (you ? "you" : "enemy"); }
  const pb = $("phaseBtn");
  if (pb) { pb.textContent = btnTxt; pb.className = "btn sm " + (fightNow ? "fightlock" : you ? "pri" : "enemyturn"); }
  const ub = $("undoBtn");
  if (ub) ub.style.display = phaseUndo ? "" : "none";
  const db = $("doneBtn");
  if (db) {
    const show = !!(CUR && locked && !isDead(CUR) && !outOfPlay(CUR.uid));
    db.style.display = show ? "flex" : "none";
    if (show) {
      const d = isDone(CUR.uid);
      if (you) { db.textContent = d ? "\u2713 DONE" : "DONE \u2713"; db.className = d ? "isdone" : ""; }
      else { db.innerHTML = TALLY_SVG + "<span>DAMAGE<br>COUNTED</span>"; db.className = "tallybtn" + (d ? " isdone" : ""); }
      const acc = accentOf(sideKey());
      db.style.borderColor = d ? "" : acc; db.style.color = d ? "" : acc;
      db.title = !you ? (d ? "Damage counted so far \u2014 tap to clear. A new hit clears it by itself." : "This unit's damage is applied \u2014 mark it counted (it can still take more)")
        : d ? "Ticked off for this turn \u2014 tap to un-tick" : "Finished with this unit \u2014 tick it off and go back to the roster";
    }
  }
  const tl = $("tl");
  if (tl && CUR) {
    tl.innerHTML = '<div class="tlh">Timeline<br>' + ((sel.p === "you" ? "You " : "Enemy ") + (sel.r ? "T" + sel.r : "open")) + '</div>' +
      pipsHTML(CUR.uid, false) + eventsHTML(CUR.uid, false);
  }
  // roster: the big tracker
  const tb = $("turnBox");
  const dt = doneTally();
  if (tb) {
    let h = '<div class="tb-head">' +
      '<div class="tb-round"><small>TURN</small>' + (turn.round || "\u2014") + '</div>' +
      '<span class="phase ' + (you ? "you" : "enemy") + '">' + label + '</span>' +
      (locked ? '<span class="donecount' + (you ? '' : ' tally') + (dt.of && dt.n === dt.of ? ' all' : '') + '">' + (you ? '' : TALLY_SVG + ' ') + dt.n + ' / ' + dt.of + (you ? ' done' : ' counted') + '</span>' : '') +
      (mpOfficialTurn() && mpOfficialTurn().req && mpOfficialTurn().req.seq === mpOfficialTurn().seq && mpOfficialTurn().active === mpMyTeam() && you
        ? (() => { const c = mpDefenderCount();
            return '<span class="mpwait gate req">\u23F3 Ending your turn \u2014 waiting for the ' + teamName(otherTeam(mpMyTeam())) + ' to finish counting damage' +
              '<small>' + TALLY_SVG + ' ' + c.n + ' / ' + c.of + ' counted' + (mpOfficialTurn().req.ok ? ' \u00b7 accepted' : '') + '</small></span>' +
              (mpAmLeader() ? '<button class="btn sm" onclick="mpCancelEndRequest()">Cancel request</button>' : ''); })()
      : mpOfficialTurn() && mpOfficialTurn().req && mpOfficialTurn().req.seq === mpOfficialTurn().seq && mpOfficialTurn().active !== mpMyTeam()
        ? (() => { const dt2 = doneTally();
            return '<span class="mpwait gate req them">\u26A0 The ' + teamName(mpOfficialTurn().active) + ' want to end their turn \u2014 finish counting damage' +
              '<small>' + TALLY_SVG + ' ' + dt2.n + ' / ' + dt2.of + ' counted' + (mpOfficialTurn().req.ok ? ' \u00b7 accepted \u2014 passing now' : '') + '</small></span>' +
              (mpAmLeader() && !mpOfficialTurn().req.ok ? '<button class="btn sm pri" onclick="mpAcceptEnd()">Accept now</button>' : ''); })()
      : mpOfficialTurn() && mpOfficialTurn().active !== mpMyTeam()
        ? '<span class="mpwait gate">\u23F3 Waiting for the ' + teamName(mpOfficialTurn().active) + ' to end their turn' + mpBuildHint(mpOfficialTurn().active) + '</span>' +
          (mpIsHost() ? '<button class="btn sm" onclick="mpForceTurn(\'' + mpMyTeam() + '\')" title="Fix a stuck turn order">Host: give the turn to the ' + teamName(mpMyTeam()) + ' \u25B8</button>' : '')
        : mpTeamMode() && !mpAmLeader()
        ? '<span class="mpwait">\u{1F451} ' + mpLeaderName(mpMyTeam()) + (you ? ' ends the turn' : ' starts the turn') + '</span>'
        : '<button class="btn big ' + (fightNow ? "fightlock" : you ? "pri" : "enemyturn") + (you && !fightNow && dt.of && dt.n === dt.of ? " ready" : "") +
            (!you && mpOfficialTurn() && mpOfficialTurn().active === mpMyTeam() ? " startnow" : "") + '" onclick="phaseTap()">' + btnTxt + '</button>') +
      (phaseUndo && (!mpTeamMode() || (mpAmLeader() && you)) ? '<button class="btn" onclick="undoPhase()">\u21B6 Undo</button>' : '') +
      '<span style="margin-left:auto;display:flex;gap:6px;align-items:center">' +
      (!turn.started && !mpTeamMode() ? '<span style="font-size:12px;color:var(--muted)">Who goes first?</span>' +
        '<span class="chip' + (turn.first === "you" ? " on" : "") + '" onclick="setFirst(\'you\')">' + (turn.first === "you" ? "\u2713 " : "") + 'We do</span>' +
        '<span class="chip' + (turn.first === "enemy" ? " on" : "") + '" onclick="setFirst(\'enemy\')">' + (turn.first === "enemy" ? "\u2713 " : "") + 'Enemy</span>' : '') +
      (!mpTeamMode() ? '<button class="linkbtn" onclick="newGame()">New game</button>' : '') +
      (mpTeamMode() && mpAmLeader() ? '<button class="linkbtn" onclick="mpPassLead()">\u{1F451} Pass leadership</button>' : '') + '</span></div>' +
      '<div class="tb-sub">' + (you ? (dt.of && dt.n === dt.of ? "Every unit has moved \u2014 end your turn." : "Your turn: tick units off as you finish them, then end the turn here \u2014 once, for the whole force.") : "Enemy turn: apply damage, then tap DAMAGE COUNTED on each unit \u2014 a unit hit again clears its mark by itself.") + '</div>' +
      pipsHTML(null, true) +
      '<div class="tb-sub">' + (sel.p === "you" ? "Your turn " : "Enemy turn ") + (sel.r || "(opening)") + (tlSel ? ' \u00b7 <button class="linkbtn" onclick="tlSel=null;renderTurn()">back to now</button>' : '') + '</div>' +
      eventsHTML(null, true);
    setHTMLIfChanged(tb, h);
  }
}
$("phaseChip").onclick = () => closeSheet();
let doneBusy = false;
$("doneBtn").onclick = () => {
  if (!CUR || doneBusy) return;
  if (isDone(CUR.uid)) { setDone(CUR.uid, false); renderTurn(); return; }
  const uid = CUR.uid;
  setDone(uid, true);
  renderTurn();
  const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const back = () => {
    doneBusy = false;
    closeSheet();
    const row = document.querySelector('#rosterBox .row[data-uid="' + uid + '"]');
    if (row) { row.classList.remove("justdone"); void row.offsetWidth; row.classList.add("justdone"); setTimeout(() => row.classList.remove("justdone"), 1100); }
  };
  if (reduce) { back(); return; }
  doneBusy = true;
  const st = document.createElement("div");
  st.className = "donestamp";
  st.innerHTML = "\u2713 DONE<small>" + unitLabel(uid) + "</small>";
  $("sheet").appendChild(st);
  setTimeout(() => { st.remove(); back(); }, 620);
};

$("resetU").onclick = () => {
  if (!CUR) return;
  const uid = CUR.uid;
  // this half-turn's entries describe a state that no longer exists
  turn.log = turn.log.filter(e => !(e.u === uid && e.r === turn.round && e.p === turn.phase));
  const history = turn.log.some(e => e.u === uid);
  if (history) logEv(uid, "Sheet reset to full", "info", "reset");
  CUR.st = freshState(U);
  openSheet(uid);
  save();
};

refreshSideCards();
if (load()) { applyTheme(); renderPresets(); renderRoster(); }
show("s0");                                   // always start on the landing page (Continue returns to a saved battle)
mpResume();                                   // reconnect a multiplayer session saved on this device
// service workers only register when the app is served from a web address
if (location.protocol.startsWith("http") && "serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
