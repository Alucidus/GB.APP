// Gunpla Battle — Cloudflare Worker + Durable Objects (cf1)
//
// The Worker serves the app (static assets, from ./public) and routes multiplayer calls:
//   POST /api/sync                 create · join · sync · leave   (plain HTTP — used for create/join and as a fallback)
//   GET  /api/ws?code&pid&token    live WebSocket to the session's room (sync requests + "changed" pushes)
//
// Each session code maps to one BattleRoom Durable Object. A room handles one message at a time, keeps the
// whole session in memory (backed by its own SQLite storage), and pushes a tiny {type:"changed"} to every
// connected device whenever something meaningful changes, so devices fetch updates at once instead of polling.
//
// Keys inside a room (same data model as the Netlify version):
//   meta · settings · pseat/<pid> · player/<pid> · team/<team> · unit/<team>/<uid> · lock/<team>/<uid>
//   inbox/<team>/<uid>/<id>
// Write rules are unchanged: player (that player) · settings (host) · team (leader) · unit (lock holder, or the
// leader while nobody else holds it) · lock (claim if free or stale) · inbox (any teammate, once; cleared by holder).

import {protectSupply,serviceSupplies,spendSupply} from './resupply.js';
import {protectRepairs,serviceRepairs} from './repairs.js';
import {protectPickup,servicePickups} from './pickups.js';
const TTL_MS = 24 * 60 * 60 * 1000;
const CODE_LEN = 5;
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const TEAMS = ["federation", "spacenoid"];
const SEEN_EVERY_MS = 10000;
const LOCK_STALE_MS = 30000;
const LEAVE_MS = 90000;
const MAX_BYTES = 256 * 1024;
const MAX_MSG_BYTES = 4096;
const MAX_PLAYERS = 12;
const BUDGET_MIN = 500, BUDGET_MAX = 200000;

const json = (status, body) => new Response(JSON.stringify(body), {
  status, headers: { "content-type": "application/json", "cache-control": "no-store" },
});
const rnd = n => crypto.getRandomValues(new Uint8Array(n));
const randomCode = () => [...rnd(CODE_LEN)].map(x => CODE_CHARS[x % CODE_CHARS.length]).join("");
const randomHex = n => [...rnd(n)].map(x => x.toString(16).padStart(2, "0")).join("");
const cleanCode = c => (typeof c === "string" ? c.trim().toUpperCase() : "");
const validCode = c => c.length === CODE_LEN && [...c].every(ch => CODE_CHARS.includes(ch));
const validPid = p => typeof p === "string" && /^[a-f0-9]{12}$/.test(p);
const cleanName = n => (typeof n === "string" ? n.replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, 48) : "");
const validTeam = t => TEAMS.includes(t);
const validUid = u => Number.isInteger(u) && u > 0 && u < 1e6;
const lockOk = k => { const m = /^(federation|spacenoid)\/(\d+)$/.exec(k || ""); return m && validUid(+m[2]) ? m : null; };

// which two squads have fought each other (recorded at their first reveal): ffhist/federation-<uid>/spacenoid-<uid>
const ffPairKey = (t1, u1, t2, u2) => t1 === "federation" ? "ffhist/federation-" + u1 + "/spacenoid-" + u2 : "ffhist/federation-" + u2 + "/spacenoid-" + u1;
// physical-dice results agree when one side won and the other lost, or both tied
const claimsAgree = c => !!c && ((c.a === "won" && c.b === "lost") || (c.a === "lost" && c.b === "won") || (c.a === "tied" && c.b === "tied"));

// A break remains on screen until the turn changes, so either team can un-confirm.
const moreBouts = g => !!(g.eng && g.eng.pairs && g.eng.bout < g.eng.pairs.length);
const breakPending = g => g.state === "end" && ((!g.obj && g.hasObjective!==false) || !!g.ext ||
  (moreBouts(g) && !(g.confirmed && g.confirmed.a && g.confirmed.b)));
function startNextBout(g) {
  const pr = g.eng.pairs[g.eng.bout];
  g.eng.bout++; g.seg++; g.round = 1;
  g.mode = null; g.rollAsk = null; g.modePick = null;
  for (const [sd, n] of [["a", 0], ["b", 1]]) {
    const list = g.eng[sd + "List"];
    g[sd] = { ...g[sd], uid: pr[n], label: (list.find(x => x.uid === pr[n]) || {}).label || "Squad" };
  }
  g.obj = null; g.ext = null; g.confirmed = { a: false, b: false };
  g.ready = { a: null, b: null }; g.lock = { a: false, b: false };
  g.reveal = null; g.roll = null; g.rolled = null; g.claim = null; g.done = null; g.forced = null;
}
function removeEngSquads(g, side, uids) {
  g.eng[side + "List"] = g.eng[side + "List"].filter(x => !uids.includes(x.uid));
  if (!g.eng[side + "List"].length) { g.state = "closed"; g.secured = side === "a" ? "b" : "a"; return; }
  g.eng.pairs = g.eng.pairs.map((pr, i) => i < g.eng.bout ? pr :
    [g.eng.aList.some(x => x.uid === pr[0]) ? pr[0] : g.eng.aList[0].uid,
     g.eng.bList.some(x => x.uid === pr[1]) ? pr[1] : g.eng.bList[0].uid]);
}
function finishDisengage(g) {
  if (g.ext.holder) { g.state = "closed"; g.secured = g.ext.side; }
  else { removeEngSquads(g, g.ext.side, [g.ext.uid]); g.ext = null; }
  g.confirmed = { a: false, b: false };
}

// ---------------- Worker ----------------
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/ws") {
      const code = cleanCode(url.searchParams.get("code"));
      if (!validCode(code) || request.headers.get("Upgrade") !== "websocket") return new Response("Bad request", { status: 400 });
      return roomFor(env, code).fetch(request);                 // the room answers on the same /api/ws address
    }
    if (url.pathname === "/api/sync") {
      if (request.method !== "POST") return json(405, { ok: false, error: "Use POST." });
      let body;
      try { body = await request.json(); } catch (e) { return json(400, { ok: false, error: "Bad request." }); }
      if (body && body.action === "create") {
        const name = cleanName(body.name);
        if (!name) return json(400, { ok: false, error: "Enter a player name first." });
        for (let i = 0; i < 12; i++) {
          const code = randomCode();
          const r = await roomFor(env, code).fetch(roomRequest(request, { ...body, action: "init", code, name }));
          if (r.status === 409) continue;                        // code already in use: try another
          return r;
        }
        return json(503, { ok: false, error: "Couldn't find a free session code — try again." });
      }
      const code = cleanCode(body && body.code);
      if (!validCode(code)) return json(400, { ok: false, error: "Session codes are 5 letters." });
      return roomFor(env, code).fetch(roomRequest(request, { ...body, code }));
    }
    return new Response("Not found", { status: 404 });          // everything else is served from ./public
  },
};
const roomFor = (env, code) => env.ROOMS.get(env.ROOMS.idFromName(code));
// a request for the room, sent to the app's own /api/sync address
const roomRequest = (request, body) => new Request(new URL("/api/sync", request.url), { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });

// ---------------- in-memory mirror of a room's storage ----------------
class Mem {
  constructor(storage) { this.st = storage; this.map = new Map(); this.ver = new Map(); this.seq = 0; this.loaded = false; }
  async load() {
    if (this.loaded) return;
    const all = await this.st.list();
    for (const [k, v] of all) {
      if (!v || typeof v !== "object" || !("ver" in v)) continue;
      this.map.set(k, v.data); this.ver.set(k, v.ver);
      if (v.ver > this.seq) this.seq = v.ver;
    }
    this.loaded = true;
  }
  has(k) { return this.map.has(k); }
  get(k) { return this.map.has(k) ? this.map.get(k) : null; }
  etag(k) { return String(this.ver.get(k)); }
  keys(prefix) { return [...this.map.keys()].filter(k => !prefix || k.startsWith(prefix)); }
  async set(k, data) {
    const ver = ++this.seq;
    this.map.set(k, data); this.ver.set(k, ver);
    await this.st.put(k, { data, ver });
  }
  async setIfNew(k, data) { if (this.map.has(k)) return false; await this.set(k, data); return true; }
  async del(k) { if (!this.map.has(k)) return; this.map.delete(k); this.ver.delete(k); await this.st.delete(k); }
  async clear() { this.map.clear(); this.ver.clear(); await this.st.deleteAll(); }
}

// ---------------- the room ----------------
export class BattleRoom {
  constructor(ctx, env) {
    this.ctx = ctx; this.env = env;
    this.mem = new Mem(ctx.storage);
    // answer keep-alive pings without waking the room
    try { ctx.setWebSocketAutoResponse(new WebSocketRequestResponsePair("ping", "pong")); } catch (e) {}
  }

  async fetch(request) {
    await this.mem.load();
    const url = new URL(request.url);
    if (url.pathname === "/api/ws") {
      const pid = url.searchParams.get("pid"), token = url.searchParams.get("token");
      if (!this.live() ) return new Response("Session ended", { status: 410 });
      if (!this.tokenOk(pid, token)) return new Response("Not in this session", { status: 403 });
      const pair = new WebSocketPair();
      this.ctx.acceptWebSocket(pair[1], [pid]);
      return new Response(null, { status: 101, webSocket: pair[0] });
    }
    if (url.pathname === "/api/sync") {
      let body;
      try { body = await request.json(); } catch (e) { return json(400, { ok: false, error: "Bad request." }); }
      const res = await this.handle(body, null);
      if (res.push) this.broadcast(null);
      if (res.closeAll) this.closeAll(4000, "Session ended");
      return json(res.status, res.body);
    }
    return new Response("Not found", { status: 404 });
  }

  async webSocketMessage(ws, message) {
    await this.mem.load();
    let msg;
    try { msg = JSON.parse(typeof message === "string" ? message : new TextDecoder().decode(message)); } catch (e) { return; }
    if (!msg || typeof msg !== "object") return;
    const tags = this.ctx.getTags(ws);
    const body = msg.body || {};
    // a socket may only act as the player it was opened for
    if (body.pid && tags[0] !== body.pid) { ws.send(JSON.stringify({ id: msg.id, status: 403, j: { ok: false, error: "Wrong player for this connection." } })); return; }
    const res = await this.handle(body, ws);
    try { ws.send(JSON.stringify({ id: msg.id, status: res.status, j: res.body })); } catch (e) {}
    if (res.push) this.broadcast(ws);
    if (res.closeAll) this.closeAll(4000, "Session ended");
  }
  async webSocketClose(ws, code, reason) {
    // answer the close with a code that may be sent (1005 / 1006 / 1015 are reserved)
    const ok = code >= 1000 && code < 5000 && ![1004, 1005, 1006, 1015].includes(code);
    try { ws.close(ok ? code : 1000, "closing"); } catch (e) {}
  }
  async webSocketError(ws) { try { ws.close(1011, "error"); } catch (e) {} }

  async alarm() {
    await this.mem.load();
    const meta = this.mem.get("meta");
    if (!meta || meta.expires <= Date.now()) { this.closeAll(4000, "Session expired"); await this.mem.clear(); }
    else await this.ctx.storage.setAlarm(meta.expires);
  }

  broadcast(except) {
    const msg = JSON.stringify({ type: "changed" });
    for (const s of this.ctx.getWebSockets()) { if (s !== except) { try { s.send(msg); } catch (e) {} } }
  }
  closeAll(code, reason) { for (const s of this.ctx.getWebSockets()) { try { s.close(code, reason); } catch (e) {} } }
  live() { const m = this.mem.get("meta"); return !!(m && m.hostPid && m.expires > Date.now()); }
  tokenOk(pid, token) { if (!validPid(pid) || typeof token !== "string" || !token) return false; const r = this.mem.get("pseat/" + pid); return !!(r && r.token === token); }
  players() { const o = {}; for (const k of this.mem.keys("player/")) o[k.slice(7)] = this.mem.get(k); return o; }
  leaders(players, now) {
    const out = {};
    TEAMS.forEach(t => {
      const m = Object.entries(players).filter(([, p]) => p && p.team === t && now - (p.seen || 0) < LEAVE_MS)
        .sort((a, b) => (a[1].teamAt || 0) - (b[1].teamAt || 0) || (a[0] < b[0] ? -1 : 1));
      const pick = this.mem.get("lead/" + t);                     // a leader who was handed the role keeps it while active
      out[t] = pick && m.some(([pid]) => pid === pick) ? pick : (m.length ? m[0][0] : null);
    });
    return out;
  }
  async newPlayer(name) {
    for (let i = 0; i < 5; i++) {
      const pid = randomHex(6), token = randomHex(18);
      if (!(await this.mem.setIfNew("pseat/" + pid, { token }))) continue;
      await this.mem.set("player/" + pid, { name, team: null, ready: false, teamAt: 0, seen: Date.now() });
      return { pid, token };
    }
    throw new Error("could not allocate a player id");
  }

  async handle(body, ws) {
    const R = (status, b, extra) => ({ status, body: b, ...(extra || {}) });
    try {
      switch (body && body.action) {
        case "init": return await this.init(body, R);
        case "join": return await this.join(body, R);
        case "sync": return await this.sync(body, R);
        case "leave": return await this.leave(body, R);
        default: return R(400, { ok: false, error: "Unknown action." });
      }
    } catch (e) {
      console.error("room error", e && e.stack || e);
      return R(500, { ok: false, error: "Sync service error." });
    }
  }

  async init(body, R) {
    if (this.mem.has("meta")) {
      const m = this.mem.get("meta");
      if (m && m.expires > Date.now()) return R(409, { ok: false, error: "code taken" });
      await this.mem.clear();                                         // an old, expired session: start clean
    }
    const now = Date.now();
    const me = await this.newPlayer(cleanName(body.name));
    const meta = { v: 3, code: body.code, created: now, expires: now + TTL_MS, hostPid: me.pid };
    await this.mem.set("meta", meta);
    await this.mem.set("settings", { phase: "lobby", budget: 10000, first: null, startedAt: 0 });
    await this.ctx.storage.setAlarm(meta.expires);
    return R(200, { ok: true, code: body.code, pid: me.pid, token: me.token, host: true, expires: meta.expires });
  }

  async join(body, R) {
    if (!this.live()) return R(404, { ok: false, error: "No session with that code (it may have expired)." });
    const meta = this.mem.get("meta");
    if (body.pid && this.tokenOk(body.pid, body.token) && this.mem.has("player/" + body.pid))
      return R(200, { ok: true, code: meta.code, pid: body.pid, token: body.token, host: meta.hostPid === body.pid, expires: meta.expires, rejoined: true });
    const name = cleanName(body.name);
    if (!name) return R(400, { ok: false, error: "Enter a player name first." });
    const now = Date.now();
    const active = Object.values(this.players()).filter(p => p && now - (p.seen || 0) < LEAVE_MS);
    if (active.length >= MAX_PLAYERS) return R(409, { ok: false, error: "That session is full." });
    if (active.some(p => p.name.toLowerCase() === name.toLowerCase())) return R(409, { ok: false, error: "Someone in that session is already called " + name + " — pick another name." });
    const me = await this.newPlayer(name);
    return R(200, { ok: true, code: meta.code, pid: me.pid, token: me.token, host: false, expires: meta.expires }, { push: true });
  }

  async sync(body, R) {
    const T0 = Date.now();
    if (!this.live()) return R(410, { ok: false, error: "This session has ended or expired.", ended: true });
    if (!this.tokenOk(body.pid, body.token)) return R(403, { ok: false, error: "This device's seat is no longer valid." });
    const M = this.mem, meta = M.get("meta");
    const previousTurn = M.get('turn');
    const pid = body.pid, now = Date.now();
    const isHost = meta.hostPid === pid;
    const w = body.writes && typeof body.writes === "object" ? body.writes : {};
    const denied = [];
    let push = false;                      // something others should know about right away
    const players = this.players();
    const settings = M.get("settings");
    const me = players[pid];
    if (!me) return R(403, { ok: false, error: "You're no longer in this session." });
    const inLobby = !settings || settings.phase === "lobby";

    // 1. my player entry
    const np = { ...me };
    if (w.player && typeof w.player === "object") {
      const nm = cleanName(w.player.name);
      if (nm) np.name = nm;
      if ((w.player.team === null || validTeam(w.player.team)) && w.player.team !== me.team) {
        if (inLobby || !me.team) { np.team = w.player.team; np.teamAt = now; np.ready = false; }
        else denied.push("team");
      }
      if (typeof w.player.ready === "boolean" && np.team) np.ready = w.player.ready;
      if (typeof w.player.build === "string") np.build = w.player.build.replace(/[^a-z0-9.\-]/gi, "").slice(0, 12);
      if (Object.hasOwn(w.player,'pilot')) {
        const profile=w.player.pilot;
        if(profile===null){np.pilot=null;np.pilotUnit=null;}
        else if(profile&&cleanName(profile.name)&&typeof profile.portrait==='string'&&profile.portrait.length<24000&&/^data:image\/webp;base64,[A-Za-z0-9+/=]+$/.test(profile.portrait))np.pilot={name:cleanName(profile.name),portrait:profile.portrait};
        else denied.push('pilot:Invalid pilot portrait. Save your pilot again.');
      }
      if(np.team!==me.team)np.pilotUnit=null;
      if (!np.team) np.ready = false;
    }
    const changed = JSON.stringify({ ...np, seen: 0 }) !== JSON.stringify({ ...me, seen: 0 });
    if (changed || now - (me.seen || 0) > SEEN_EVERY_MS) {
      np.seen = now;
      await M.set("player/" + pid, np);
      players[pid] = np;
      if (changed) push = true;
    }
    const leaders = this.leaders(players, now);
    const myTeam = players[pid].team;
    const amLeader = !!myTeam && leaders[myTeam] === pid;

    // 2. settings (host)
    if (w.settings && typeof w.settings === "object") {
      if (!isHost) denied.push("settings");
      else {
        const cur = settings || { phase: "lobby", budget: 10000, first: null, startedAt: 0 };
        const ns = { ...cur };
        const b = Number(w.settings.budget);
        if (Number.isFinite(b) && b >= BUDGET_MIN && b <= BUDGET_MAX) ns.budget = Math.round(b);
        if (w.settings.first === null || validTeam(w.settings.first)) ns.first = w.settings.first;
        if (w.settings.phase === "battle" && cur.phase !== "battle") {
          if (!validTeam(ns.first)) denied.push("start:first");
          else if (!TEAMS.every(t => leaders[t])) denied.push("start:teams");
          else { ns.phase = "battle"; ns.startedAt = now; await M.set("turn", { active: ns.first, seq: 1, at: now, endedBy: null, ends: { federation: 0, spacenoid: 0 } }); }
        } else if (w.settings.phase === "lobby" && cur.phase === "battle") { ns.phase = "lobby"; ns.startedAt = 0; await M.del("turn"); }
        await M.set("settings", ns); push = true;
      }
    }

    // 2b. DP limit requests: a team leader asks, the host accepts (limit changes for both teams) or declines
    if (w.budgetRequest && typeof w.budgetRequest === "object") {
      const amt = Math.round(Number(w.budgetRequest.amount));
      if (!amLeader || !(amt >= BUDGET_MIN && amt <= BUDGET_MAX)) denied.push("budget-request");
      else { await M.set("req/" + pid, { amount: amt, name: players[pid].name, team: myTeam, at: now }); await M.del("res/" + pid); push = true; }
    }
    if (Array.isArray(w.resolve)) {
      if (!isHost) denied.push("resolve");
      else for (const r of w.resolve.slice(0, 10)) {
        if (!r || !validPid(r.pid)) continue;
        const q = M.get("req/" + r.pid); if (!q) continue;
        if (r.accept) { const cur = M.get("settings") || {}; await M.set("settings", { ...cur, budget: Math.max(cur.budget || 0, q.amount) }); }
        await M.del("req/" + r.pid);
        await M.set("res/" + r.pid, { accept: !!r.accept, amount: q.amount, at: now });
        push = true;
      }
    }
    if (w.clearResult) await M.del("res/" + pid);

    // 2c. the one official turn order: only the active team's leader can end the turn, once per turn
    // (never while a firefight is mid-segment: its 4 rounds must be played out first)
    const fightOn = () => (Array.isArray(w.ff) ? w.ff : [w.ff]).some(op => op && ["unconfirm", "extract", "engedit", "setnext"].includes(op.op)) || M.keys("ff/").some(k => { const g = M.get(k); return !!g && (["mode", "ready", "pick", "reveal"].includes(g.state) || breakPending(g)); });
    if (w.endTurn && typeof w.endTurn === "object") {
      const tk = M.get("turn");
      if (!tk || !amLeader || tk.active !== myTeam || w.endTurn.seq !== tk.seq) denied.push("end-turn");
      else if (fightOn()) denied.push("end-turn:firefight");
      else { await M.set("turn", { ...tk, active: myTeam === "federation" ? "spacenoid" : "federation", seq: tk.seq + 1, at: now, endedBy: myTeam, req: null }); push = true; }
    }
    // end-turn REQUEST: the active leader asks to end while the other side is still counting damage
    if (w.endRequest && typeof w.endRequest === "object") {
      const tk = M.get("turn");
      if (!tk || !amLeader || tk.active !== myTeam) denied.push("end-request");
      else if (w.endRequest.cancel) { if (tk.req) { await M.set("turn", { ...tk, req: null }); push = true; } }
      else if (fightOn()) denied.push("end-request:firefight");
      else if (w.endRequest.seq === tk.seq && !(tk.req && tk.req.seq === tk.seq)) { await M.set("turn", { ...tk, req: { team: myTeam, seq: tk.seq, at: now, ok: false } }); push = true; }
    }
    // the other side's leader lets the turn go early ("Accept now")
    if (w.acceptEnd && typeof w.acceptEnd === "object") {
      const tk = M.get("turn");
      if (!tk || !amLeader || !tk.req || tk.req.team === myTeam || tk.req.seq !== w.acceptEnd.seq) denied.push("accept-end");
      else if (!tk.req.ok) { await M.set("turn", { ...tk, req: { ...tk.req, ok: true, by: pid } }); push = true; }
    }
    // host override: hand the turn to a team (fixes a stuck turn)
    if (w.forceTurn && typeof w.forceTurn === "object") {
      const tk = M.get("turn");
      if (!isHost || !tk || !validTeam(w.forceTurn.active)) denied.push("force-turn");
      else if (tk.active !== w.forceTurn.active) { await M.set("turn", { ...tk, active: w.forceTurn.active, seq: tk.seq + 1, at: now, endedBy: "host", req: null }); push = true; }
    }

    const locks = {};
    for (const k of M.keys("lock/")) locks[k.slice(5)] = M.get(k);
    const alive = p => players[p] && now - (players[p].seen || 0) < LOCK_STALE_MS;

    // 3. team state (leader)
    if (w.team && typeof w.team === "object") {
      if (!amLeader) denied.push("team-state");
      else if (JSON.stringify(w.team).length > MAX_BYTES) denied.push("team-size");
      else {
        await M.set("team/" + myTeam, w.team); push = true;
        for(const [id,player] of Object.entries(players))if(player.team===myTeam&&player.pilotUnit&&!w.team.roster?.some(r=>r.uid===player.pilotUnit&&globalThis.GBRepairUnits?.some(u=>u.id===r.id))){
          player.pilotUnit=null;await M.set('player/'+id,player);
        }
        // every team save carries how many times that team has ended its turn: if the active team's count
        // went up (and it now shows the enemy turn), pass the turn on — even if the explicit message was missed
        const tk = M.get("turn"), tt = w.team.turn || {};
        if (tk && typeof tt.ends === "number") {
          const known = tk.ends && typeof tk.ends[myTeam] === "number" ? tk.ends[myTeam] : null;
          if (known === null || tt.ends !== known) {
            const nt = { ...tk, ends: { ...(tk.ends || {}), [myTeam]: tt.ends } };
            if (known !== null && tt.ends > known && tk.active === myTeam && tt.phase === "enemy" && !fightOn()) {
              nt.active = myTeam === "federation" ? "spacenoid" : "federation"; nt.seq = tk.seq + 1; nt.at = now; nt.endedBy = myTeam; nt.req = null;
            }
            await M.set("turn", nt);
          }
        }
      }
    }
      if(w.player&&Object.hasOwn(w.player,'pilotUnit')){
        const uid=w.player.pilotUnit;
        const unit=M.get('team/'+np.team)?.roster?.find(r=>r.uid===uid);
        const suit=unit&&globalThis.GBRepairUnits?.some(u=>u.id===unit.id);
        const occupied=Object.entries(players).some(([id,p])=>id!==pid&&p.team===np.team&&p.pilotUnit===uid);
        if(uid===null)np.pilotUnit=null;
        else if(!np.pilot||!validUid(uid)||!suit)denied.push('pilot:Choose a mobile suit on your team.');
        else if(occupied)denied.push('pilot:That mobile suit already has a pilot.');
        else np.pilotUnit=uid;
        if(!denied.some(d=>d.startsWith('pilot:'))){await M.set('player/'+pid,np);players[pid]=np;push=true;}
      }
    // 4. unit states (lock holder, or leader when nobody live holds the lock) — before any release / claim
    if (w.units && typeof w.units === "object") {
      for (const [k, data] of Object.entries(w.units).slice(0, 60)) {
        const m = lockOk(k);
        if (!m || m[1] !== myTeam || !data || typeof data !== "object") { denied.push("unit:" + k); continue; }
        const holder = locks[k] && locks[k].pid;
        if (!(holder === pid || (amLeader && (!holder || !alive(holder))))) { denied.push("unit:" + k); continue; }
        if (JSON.stringify(data).length > MAX_BYTES) { denied.push("unit-size:" + k); continue; }
        const unitId=M.get('team/'+myTeam)?.roster?.find(r=>String(r.uid)===m[2])?.id;
        await M.set("unit/" + k, protectPickup(protectRepairs(protectSupply(data,M.get('unit/'+k)),M.get('unit/'+k),pid,leaders[myTeam],players,myTeam,unitId),M.get('unit/'+k))); push = true;
      }
    }
    // 5. deliveries this device applied are cleared while it still holds the lock
    for (const rel of (Array.isArray(body.consume) ? body.consume.slice(0, 20) : [])) {
      const mm = /^inbox\/((federation|spacenoid)\/(\d+))\/[a-z0-9]{6,20}$/.exec(rel || "");
      if (!mm || mm[2] !== myTeam || !locks[mm[1]] || locks[mm[1]].pid !== pid) { denied.push("consume:" + rel); continue; }
      await M.del(rel); push = true;
    }
    // 6. releases, then claims
    for (const k of (Array.isArray(body.release) ? body.release.slice(0, 50) : [])) {
      if (lockOk(k) && locks[k] && locks[k].pid === pid) { await M.del("lock/" + k); delete locks[k]; push = true; }
    }
    for (const k of (Array.isArray(body.acquire) ? body.acquire.slice(0, 50) : [])) {
      const m = lockOk(k);
      if (!m || m[1] !== myTeam) { denied.push("lock:" + k); continue; }
      const cur = locks[k];
      if (cur && cur.pid === pid) continue;
      if (cur && alive(cur.pid)) { denied.push("lock:" + k); continue; }
      locks[k] = { pid, at: now };
      await M.set("lock/" + k, locks[k]); push = true;
    }
    // 7. new deliveries
    for (const m of (Array.isArray(body.inbox) ? body.inbox.slice(0, 10) : [])) {
      const k = m && m.to, mm = lockOk(k);
      if (!mm || mm[1] !== myTeam || !m.msg || typeof m.msg !== "object") { denied.push("inbox:" + k); continue; }
      const id = typeof m.id === "string" && /^[a-z0-9]{6,20}$/.test(m.id) ? m.id : randomHex(6);
      const msg = { ...m.msg, byPid: pid, at: now };
      if (JSON.stringify(msg).length > MAX_MSG_BYTES || !(await M.setIfNew("inbox/" + k + "/" + id, msg))) { denied.push("inbox:" + k); continue; }
      push = true;
    }

    if(await serviceSupplies(M,previousTurn))push=true;
    if(await servicePickups(M,w.pickup,pid,myTeam,uid=>{const holder=locks[myTeam+'/'+uid]?.pid;return holder===pid||(amLeader&&(!holder||!alive(holder)));},denied))push=true;
    if(await serviceRepairs(M,previousTurn,leaders))push=true;
    // 7b. online Firefight (Quick Resolve over the link)
    if (w.ff && myTeam) {
      const ops = Array.isArray(w.ff) ? w.ff.slice(0, 6) : [w.ff];
      for (const op of ops) { if (op && typeof op === "object" && await this.firefight(op, pid, myTeam, players, now, denied)) push = true; }
    }
    // 7c. queued Forced Re-Engagements start when their turn begins
    {
      const tk = M.get("turn");
      if (tk) for (const k of M.keys("ff/")) {
        let g = M.get(k);
        if (g && g.state === "end" && moreBouts(g) && g.confirmed?.a && g.confirmed?.b && !g.ext && tk.seq >= g.startSeq) {
          g = JSON.parse(JSON.stringify(g)); startNextBout(g); g.state = "queued";
        }
        if (!g || g.state !== "queued" || !(tk.seq >= (g.startSeq || 0))) continue;
        await M.set(k, { ...g, state: g.mode ? "ready" : "mode", round: 1, ready: { a: null, b: null }, lock: { a: false, b: false },
          reveal: null, roll: null, obj: null, fromQueue: true, startedAt: now, at: now });
        push = true;
      }
    }

    // 8. reply with everything that changed since the caller's last view (never seat tokens or secret picks)
    const known = body.known && typeof body.known === "object" ? body.known : {};
    const changes = {}, etags = {};
    for (const k of M.keys()) {
      if (k.startsWith("pseat/") || k.startsWith("ffsec/")) continue;
      const e = M.etag(k);
      etags[k] = e;
      if (known[k] !== e) changes[k] = M.get(k);
    }
    if (w.passLead && typeof w.passLead === "object" && myTeam) {
      const to = w.passLead.to, tp = players[to];
      const lead = this.leaders(players, now)[myTeam];
      if (lead !== pid || !tp || tp.team !== myTeam || now - (tp.seen || 0) >= LEAVE_MS || to === pid) denied.push("pass-lead");
      else { await M.set("lead/" + myTeam, to); push = true; }
    }
    const removed = Object.keys(known).filter(k => !(k in etags));
    return R(200, {
      ok: true, now: Date.now(), you: pid, hostPid: meta.hostPid, expires: meta.expires,
      leaders: this.leaders(this.players(), now), changes, etags, removed, denied,
      timing: { total: Date.now() - T0, list: 0, read: 0, write: 0, wrote: push, store: "cloudflare room" },
    }, { push });
  }


  // ---------- Firefight: one 1-v-1 clash between two squads ----------
  // ff/<id>      public record (both teams see it)
  // ffsec/<id>/<side>   a locked item pick — never sent to devices; revealed into ff/<id> once both sides have locked
  async firefight(op, pid, myTeam, players, now, denied) {
    const M = this.mem;
    const ITEMS = ["none", "fb", "sm", "gr"];
    const ACTIVE = s => s && s.state !== "closed" && s.state !== "declined";
    const roll = n => [...crypto.getRandomValues(new Uint8Array(Math.max(0, Math.min(8, n | 0))))].map(x => 1 + (x % 6));
    const d6 = () => 1 + (crypto.getRandomValues(new Uint8Array(1))[0] % 6);
    const inEng = (f, uid) => (f.eng ? (f.eng.aList || []).concat(f.eng.bList || []).some(x => x.uid === uid) : false);
    const busy = uid => M.keys("ff/").some(k => { const f = M.get(k); return ACTIVE(f) && (f.eng ? inEng(f, uid) : f.a.uid === uid || f.b.uid === uid); });
    const cleanList = (uids, labels) => (Array.isArray(uids) ? uids : []).slice(0, 6)
      .filter((u, i, all) => validUid(u) && all.indexOf(u) === i)
      .map((u, i) => ({ uid: u, label: String((Array.isArray(labels) ? labels[i] : "") || "Squad").slice(0, 30) }));
    for (const k of M.keys("ff/")) { const o = M.get(k); if (o && !ACTIVE(o) && now - (o.at || 0) > 60000) await M.del(k); }   // tidy finished clashes
    const id = typeof op.id === "string" && /^[a-z0-9]{6,16}$/.test(op.id) ? op.id : null;
    if (!id) { denied.push("ff:id"); return false; }
    const key = "ff/" + id;
    if (op.op === "invite") {
      const other = myTeam === "federation" ? "spacenoid" : "federation";
      // an engagement: several squads a side, fought one pair at a time
      const aList = cleanList(op.aUids, op.aLabels), bList = cleanList(op.bUids, op.bLabels);
      if (aList.length && bList.length) {
        const tk0 = M.get("turn");
        if (tk0 && tk0.active !== myTeam) { denied.push("ff:not-your-turn"); return false; }   // challenges only on your own turn
        if (aList.some(x => busy(x.uid)) || bList.some(x => busy(x.uid)) || M.has(key)) { denied.push("ff:invite"); return false; }
        const proposed = op.pairs === undefined ? null : op.pairs;
        if (proposed !== null && (!Array.isArray(proposed) || proposed.length !== aList.length ||
            proposed.some((pr, i) => !Array.isArray(pr) || pr.length !== 2 || pr[0] !== aList[i].uid || !bList.some(x => x.uid === pr[1])))) {
          denied.push("ff:pairs"); return false;
        }
        await M.set(key, { id, state: "invite", at: now, mode: null, rollAsk: null, round: 1, seg: 1, forced: null, startSeq: null,
          hasObjective: op.hasObjective!==false,
          eng: { aList, bList, obj: op.hasObjective===false?"":String(op.obj || "").slice(0, 24), pairs: proposed, bout: 1, log: [] },
          a: { team: myTeam, uid: aList[0].uid, pid, label: aList[0].label },
          b: { team: other, uid: bList[0].uid, pid: null, label: bList[0].label },
          lock: { a: false, b: false }, ready: { a: null, b: null }, hp: { a: null, b: null }, reveal: null, roll: null, obj: null });
        return true;
      }
      if (M.has(key) || !validUid(op.aUid) || !validUid(op.bUid) || busy(op.aUid) || busy(op.bUid)) { denied.push("ff:invite"); return false; }
      const tk = M.get("turn");
      const queued = op.forced === true && !!tk;          // Forced Re-Engagement: starts on its own when the next turn begins
      if (!queued && tk && tk.active !== myTeam) { denied.push("ff:not-your-turn"); return false; }   // challenges only on your own turn
      if (queued && !M.has(ffPairKey(myTeam, op.aUid, other, op.bUid))) { denied.push("ff:not-fought"); return false; }   // only a squad you already fought
      if(queued && !await spendSupply(M,myTeam,op.aUid,'fb')){denied.push('ff:no-item');return false;}
      await M.set(key, { id, state: queued ? "queued" : "invite", at: now, mode: null, rollAsk: null, round: 1, seg: 1,
        forced: queued ? "a" : null, startSeq: queued ? tk.seq + 1 : null,
        a: { team: myTeam, uid: op.aUid, pid, label: String(op.aLabel || "").slice(0, 30) },
        b: { team: other, uid: op.bUid, pid: null, label: String(op.bLabel || "").slice(0, 30) },
        lock: { a: false, b: false }, ready: { a: null, b: null }, hp: { a: null, b: null }, reveal: null, roll: null, obj: null });
      return true;
    }
    const f = M.get(key);
    if (!f || !ACTIVE(f)) { denied.push("ff:gone"); return false; }
    const side = f.a.team === myTeam ? "a" : f.b.team === myTeam ? "b" : null;
    if (!side) { denied.push("ff:side"); return false; }
    const other = side === "a" ? "b" : "a";
    const g = JSON.parse(JSON.stringify(f));
    // Older plain 1v1 records join the same break flow on their first end-of-bout action.
    if (g.state === "end" && !g.eng) g.eng = { aList: [{ uid: g.a.uid, label: g.a.label }],
      bList: [{ uid: g.b.uid, label: g.b.label }], pairs: [[g.a.uid, g.b.uid]], bout: 1, obj: "" };
    const mine = g[side].pid === pid;
    const save = async () => { g.at = now; await M.set(key, g); return true; };
    switch (op.op) {
      case "accept": {
        if (g.state !== "invite" || side !== "b") break;
        if (g.eng) {                                   // the defender chooses which of their squads meets each attacker
          const aOk = g.eng.aList.map(x => x.uid), bOk = g.eng.bList.map(x => x.uid);
          const pairs = op.pairs === undefined ? g.eng.pairs : op.pairs;
          if (!Array.isArray(pairs) || pairs.length !== aOk.length ||
              pairs.some((pr, i) => !Array.isArray(pr) || pr.length !== 2 || pr[0] !== aOk[i] || !bOk.includes(pr[1]))) {
            denied.push("ff:pairs"); return false;
          }
          g.eng.pairs = pairs; g.eng.bout = 1;
          const lab = (list, uid) => (list.find(x => x.uid === uid) || {}).label || "Squad";
          g.a = { ...g.a, uid: pairs[0][0], label: lab(g.eng.aList, pairs[0][0]) };
          g.b = { ...g.b, uid: pairs[0][1], label: lab(g.eng.bList, pairs[0][1]) };
        }
        g.b.pid = pid; g.state = "mode"; return save();
      }
      case "decline":
        if (g.state !== "invite" || side !== "b") break;
        g.state = "declined"; return save();
      case "join":                                   // pick up a paused clash for my side
        if (g.state === "invite" || (g[side].pid && players[g[side].pid] && now - (players[g[side].pid].seen || 0) < LEAVE_MS && g[side].pid !== pid)) break;
        g[side].pid = pid; return save();
      case "pause":
        if (!mine) break;
        g[side].pid = null; return save();
      case "mode": {
        if (g.state !== "mode" || !mine || !["physical", "roll"].includes(op.pick)) break;
        const pick = op.pick === "roll" ? "rolled" : "physical";
        if (g.rollAsk && g.rollAsk !== side && (g.modePick || "rolled") === pick) {
          g.mode = pick; g.rollAsk = null; g.modePick = null; g.state = "ready";
        } else { g.rollAsk = side; g.modePick = pick; }
        return save();
      }
      case "modeAnswer":
        if (g.state !== "mode" || !mine || !g.rollAsk || g.rollAsk === side || typeof op.yes !== "boolean") break;
        if (op.yes) {
          g.mode = g.modePick || "rolled"; g.rollAsk = null; g.modePick = null; g.state = "ready";
        } else {
          // Proposing the other mode also needs the other team's confirmation.
          g.modePick = (g.modePick || "rolled") === "physical" ? "rolled" : "physical"; g.rollAsk = side;
        }
        return save();
      case "ready": {                               // start of a round (after adjusting casualties)
        if (!mine || (g.state !== "ready" && g.state !== "reveal")) break;
        if (g.state === "reveal" && g.mode === "physical" && g.claim && (g.claim.a || g.claim.b) &&
            (!claimsAgree(g.claim) || !g.done || !g.done.a || !g.done.b)) break;   // results must agree and losses be applied
        if (g.state === "reveal" && g.mode === "rolled" && (!g.roll || !g.done || !g.done.a || !g.done.b)) break;   // rolled: dice first, then losses
        const hp = Math.max(0, Math.min(8, op.hp | 0)), supp = Math.max(0, Math.min(8, op.supp | 0));
        g.ready[side] = { hp, supp }; g.hp[side] = hp;
        if (g.ready.a && g.ready.b) {
          if (g.state === "reveal") g.round += 1;
          g.reveal = null; g.roll = null;
          if (g.round > 4) g.state = "end";
          else { g.state = "pick"; g.lock = { a: false, b: false }; g.pool = { a: g.ready.a, b: g.ready.b }; }
          g.ready = { a: null, b: null };
        }
        return save();
      }
      case "claim":                                 // physical dice: "I won" / "I lost" / "Tied"
        if (g.state !== "reveal" || !mine || g.mode !== "physical" || !["won", "lost", "tied"].includes(op.result)) break;
        g.claim = g.claim || { a: null, b: null }; g.done = g.done || { a: false, b: false };
        g.claim[side] = op.result; g.done[side] = op.result !== "lost";     // the loser is done once their losses are applied
        g.ready = { a: null, b: null };
        return save();
      case "roll": {                                // Roll for me: both sides press, then both pools are rolled together
        if (g.state !== "reveal" || !mine || g.mode !== "rolled" || g.roll) break;
        g.rolled = g.rolled || { a: false, b: false };
        g.rolled[side] = true;
        if (g.rolled.a && g.rolled.b) {
          const pa = g.reveal.a, pb = g.reveal.b;
          const fp = hp => hp >= 7 ? 8 : hp >= 5 ? 7 : hp >= 3 ? 6 : hp >= 1 ? 5 : 0;
          const pool = (sd, mineItem, theirItem) => {
            const p0 = (g.pool && g.pool[sd]) || { hp: 8, supp: 0 };
            const supp = mineItem === "sm" && theirItem !== "gr" ? 0 : p0.supp;       // my Smoke clears my set-aside dice
            const flashed = theirItem === "fb" && mineItem !== "sm" ? 3 : 0;          // their Flashbang takes 3 dice off THIS roll
            return p0.hp <= 0 ? 0 : p0.hp === 1 ? 1 : Math.max(fp(p0.hp) - supp - flashed, 2);
          };
          g.roll = { a: roll(pool("a", pa, pb)), b: roll(pool("b", pb, pa)), round: g.round };
          // who won (the same rules the devices apply): a Perfect Volley on 2-5 dice beats everything, then successes
          const score = d => d.reduce((m, v) => m + (v === 6 ? 2 : v >= 3 ? 1 : 0), 0);
          const volley = d => d.length >= 2 && d.length <= 5 && d.every(v => v === 6);
          const va = volley(g.roll.a), vb = volley(g.roll.b);
          const w = va && !vb ? "a" : vb && !va ? "b" : (score(g.roll.a) > score(g.roll.b) ? "a" : score(g.roll.b) > score(g.roll.a) ? "b" : null);
          g.claim = w ? { a: w === "a" ? "won" : "lost", b: w === "b" ? "won" : "lost" } : { a: "tied", b: "tied" };
          g.done = { a: g.claim.a !== "lost", b: g.claim.b !== "lost" };
        }
        return save();
      }
      case "applied":                               // the loser has applied the margin result and casualties
        if (g.state !== "reveal" || !mine || !g.claim || g.claim[side] !== "lost") break;
        g.done[side] = true; return save();
      case "unready":
        if (!mine || !g.ready[side]) break;
        g.ready[side] = null; return save();
      case "pick":
        if (g.state !== "pick" || !mine || !ITEMS.includes(op.item)) break;
        if(g.lock[side])break;
        if(op.item!=='none'){
          const q=M.get('unit/'+myTeam+'/'+g[side].uid)?.st?.sq?.qr;
          if(!q||q.resupply||!(q.items?.[op.item]>0))break;
        }
        await M.set("ffsec/" + id + "/" + side, op.item);
        g.lock[side] = true;
        if (g.lock.a && g.lock.b) {
          const pa = M.get("ffsec/" + id + "/a") || "none", pb = M.get("ffsec/" + id + "/b") || "none";
          // Validate both inventories before spending either; picks are reserved until reveal.
          if([['a',pa],['b',pb]].some(([sd,it])=>{const st=M.get('unit/'+g[sd].team+'/'+g[sd].uid)?.st;return it!=='none'&&(!(st?.hp?.hp>0)||st.sq?.qr?.resupply||!(st.sq?.qr?.items?.[it]>0));}))break;
          await spendSupply(M,g.a.team,g.a.uid,pa);await spendSupply(M,g.b.team,g.b.uid,pb);
          await M.del("ffsec/" + id + "/a"); await M.del("ffsec/" + id + "/b");
          g.reveal = { a: pa, b: pb, round: g.round, at: now }; g.state = "reveal";
          const hk = ffPairKey(g.a.team, g.a.uid, g.b.team, g.b.uid);
          if (!M.has(hk)) await M.set(hk, { at: now });                         // these two squads have now fought
          g.claim = { a: null, b: null }; g.done = { a: false, b: false };     // physical dice: who won, and who has applied their losses
          if (g.mode === "rolled") g.rolled = { a: false, b: false };       // each side presses ROLL FOR ME; dice come when both have
        }
        return save();
      case "unpick":
        if (g.state !== "pick" || !mine || !g.lock[side]) break;
        await M.del("ffsec/" + id + "/" + side); g.lock[side] = false; return save();
      case "objective": {
        if (g.state !== "end" || !mine || g.obj || g.hasObjective===false) break;
        const other = side === "a" ? "b" : "a";
        // current squad health, as the caller's device sees it (falls back to the last ready report)
        const hpOk = v => Number.isInteger(v) && v >= 0 && v <= 8;
        const ha = hpOk(op[side === "a" ? "hpMine" : "hpFoe"]) ? op[side === "a" ? "hpMine" : "hpFoe"] : (g.hp.a || 0);
        const hb = hpOk(op[side === "b" ? "hpMine" : "hpFoe"]) ? op[side === "b" ? "hpMine" : "hpFoe"] : (g.hp.b || 0);
        if (g.mode === "physical") {                  // real dice: the players roll and report who won
          if (op.win !== "mine" && op.win !== "theirs") break;
          g.obj = { manual: true, win: op.win === "mine" ? side : other, ha, hb, seg: g.seg }; g.holder = { side: g.obj.win, uid: g[g.obj.win].uid }; return save();
        }
        let ra, rb, t = 0;
        do { ra = d6() + d6() + Math.max(0, ha - hb); rb = d6() + d6() + Math.max(0, hb - ha); t++; } while (ra === rb && t < 20);
        g.obj = { a: ra, b: rb, win: ra > rb ? "a" : "b", ha, hb, seg: g.seg }; g.holder = { side: g.obj.win, uid: g[g.obj.win].uid }; return save();
      }
      case "segment":                               // another 4-round segment (re-engage / Forced Re-Engagement)
        if (g.state !== "end" || !mine || (!g.obj && g.hasObjective!==false) || g.ext || (g.eng && moreBouts(g))) break;
        if(op.forced){const uid=op.uid||g[side].uid;if(g.eng&&!g.eng[side+'List'].some(x=>x.uid===uid))break;if(!await spendSupply(M,myTeam,uid,'fb'))break;}
        g.confirmed = { a: false, b: false };
        g.mode = null; g.rollAsk = null; g.modePick = null;
        g.seg += 1; g.round = 1; g.obj = null; g.ready = { a: null, b: null }; g.lock = { a: false, b: false };
        g.forced = op.forced ? side : null;
        if (op.forced && M.get("turn")) { g.state = "queued"; g.startSeq = M.get("turn").seq + 1; }   // waits for the next turn
        else g.state = "mode";
        return save();
      case "counter":                               // the squad being forced back spends a Smoke Grenade: the re-engagement is cancelled
        if (g.state !== "queued" || !g.forced || side === g.forced) break;
        if(!await spendSupply(M,myTeam,g[side].uid,'sm'))break;
        g.state = "closed"; g.countered = side; return save();
      case "unconfirm":
        if (g.state !== "end" || !mine || !g.eng || g.ext) break;
        g.confirmed = { ...(g.confirmed || {}), [side]: false }; g.startSeq = null; return save();
      case "nextbout": {
        if (g.state !== "end" || !mine || (!g.obj && g.hasObjective!==false) || g.ext || !moreBouts(g)) break;
        const uid = g.eng.pairs[g.eng.bout][side === "a" ? 0 : 1];
        const st = (M.get("unit/" + myTeam + "/" + uid) || {}).st;
        if (!g.eng[side + "List"].some(x => x.uid === uid) || (st?.hp && st.hp.hp <= 0)) break;
        g.confirmed = { ...(g.confirmed || {}), [side]: true };
        const tk = M.get("turn");
        if (g.confirmed.a && g.confirmed.b) {
          if (tk) g.startSeq = tk.seq + 1;
          else { startNextBout(g); g.state = "mode"; }
        }
        return save();
      }
      case "setnext": {                             // a side swaps which of its squads takes the next bout
        if (g.state !== "end" || !mine || (!g.obj && g.hasObjective!==false) || g.ext || !g.eng || !g.eng.pairs || g.confirmed?.[side]) break;
        const nb = (g.eng.bout || 1) + 1;
        if (nb > g.eng.pairs.length) break;
        const list = side === "a" ? g.eng.aList : g.eng.bList;
        if (!list.some(x => x.uid === op.uid) || (M.get("unit/" + myTeam + "/" + op.uid)?.st?.hp?.hp === 0)) break;
        const pr = g.eng.pairs[nb - 1].slice();
        pr[side === "a" ? 0 : 1] = op.uid;
        g.eng.pairs[nb - 1] = pr;
        return save();
      }
      case "extract": {                          // every squad gets the same response window
        if (g.state !== "end" || !mine || (!g.obj && g.hasObjective!==false) || !g.eng || g.ext) break;
        const uid = op.uid || g[side].uid;
        if (!g.eng[side + "List"].some(x => x.uid === uid)) break;
        const holder = g.holder || (g.obj?{ side: g.obj.win, uid: g[g.obj.win].uid }:{});
        g.ext = { side, uid, holder: holder.side === side && holder.uid === uid, deny: null, smoke: false };
        g.confirmed = { a: false, b: false }; g.startSeq = null; return save();
      }
      case "deny":
        if (g.state !== "end" || !mine || !g.ext || g.ext.side === side || (g.ext.deny && !g.ext.smoke) ||
            !g.eng[side + "List"].some(x => x.uid === op.uid)) break;
        if(!await spendSupply(M,myTeam,op.uid,'fb'))break;
        g.ext.deny = { uid: op.uid }; g.ext.smoke = false; g.ext.flashes = (g.ext.flashes || 0) + 1; return save();
      case "smokeout":
        if (g.state !== "end" || !mine || !g.ext || g.ext.side !== side || !g.ext.deny || g.ext.smoke ||
            !g.eng[side + "List"].some(x => x.uid === op.uid)) break;
        if(!await spendSupply(M,myTeam,op.uid,'sm'))break;
        g.ext.smoke = true; g.ext.smokes = (g.ext.smokes || 0) + 1; return save();
      case "letgo":
        if (g.state !== "end" || !mine || !g.ext || g.ext.side === side || (g.ext.deny && !g.ext.smoke)) break;
        finishDisengage(g); return save();
      case "fighton":
        if (g.state !== "end" || !mine || !g.ext || g.ext.side !== side || !g.ext.deny || g.ext.smoke) break;
        g.ext = null; g.confirmed = { a: false, b: false }; g.startSeq = null; return save();
      case "concede":                               // my squads are gone: the enemy secures it
        if (g.state !== "end" || !mine) break;
        g.state = "closed"; g.secured = other; return save();
      case "engedit": {                             // withdraw / add / merge on my own side, between bouts
        if (g.state !== "end" || !mine || (!g.obj && g.hasObjective!==false) || g.ext || !g.eng) break;
        g.confirmed = { a: false, b: false }; g.startSeq = null;
        const list = side === "a" ? g.eng.aList : g.eng.bList;
        if (op.kind === "merge") {
          const rm = (Array.isArray(op.uids) ? op.uids : []).filter(u => list.some(x => x.uid === u));
          if (!list.some(x => x.uid === op.keepUid && !rm.includes(x.uid))) break;
          // A top-up may leave every donor alive. Remove only verified empty squads.
          if (rm.some(uid => M.get("unit/" + myTeam + "/" + uid)?.st?.hp?.hp !== 0)) break;
          if (g.holder?.side === side && rm.includes(g.holder.uid)) g.holder.uid = op.keepUid;
          const keep = list.filter(x => !rm.includes(x.uid));
          if (!keep.length) { g.state = "closed"; g.secured = other; return save(); }   // that side has left the fight
          if (side === "a") g.eng.aList = keep; else g.eng.bList = keep;
        } else if (op.kind === "add") {
          if (!validUid(op.uid) || list.some(x => x.uid === op.uid) || busy(op.uid)) break;
          list.push({ uid: op.uid, label: String(op.label || "Squad").slice(0, 30) });
        } else break;
        const aOk = g.eng.aList.map(x => x.uid), bOk = g.eng.bList.map(x => x.uid);
        g.eng.pairs = (g.eng.pairs || []).map((pr, i) => i < (g.eng.bout || 1) ? pr
          : [aOk.includes(pr[0]) ? pr[0] : aOk[0], bOk.includes(pr[1]) ? pr[1] : bOk[0]]);
        return save();
      }
      case "end":
        if (!mine || (g.state !== "invite" && (g.state !== "end" || (!g.obj && g.hasObjective!==false) || g.ext))) break;
        await M.del("ffsec/" + id + "/a"); await M.del("ffsec/" + id + "/b");
        g.state = "closed"; return save();
    }
    denied.push("ff:" + String(op.op).slice(0, 12));
    return false;
  }

  async leave(body, R) {
    if (!this.tokenOk(body.pid, body.token)) return R(200, { ok: true });
    const meta = this.mem.get("meta");
    if (meta && meta.hostPid === body.pid && body.endForAll) {
      await this.mem.clear();
      return R(200, { ok: true, ended: true }, { closeAll: true, push: false, endAll: true });
    }
    for (const k of this.mem.keys("lock/")) { const l = this.mem.get(k); if (l && l.pid === body.pid) await this.mem.del(k); }
    await this.mem.del("player/" + body.pid);
    await this.mem.del("pseat/" + body.pid);
    for (const s of this.ctx.getWebSockets(body.pid)) { try { s.close(4001, "Left session"); } catch (e) {} }
    return R(200, { ok: true }, { push: true });
  }
}
