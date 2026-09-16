# Gunpla Battle — Cloudflare version (build cf10)

This is the full app (solo tracker + team multiplayer). It runs on **Cloudflare Workers**, with a **Durable Object "room" per battle session**.

**How it syncs:** devices keep a **live connection** to their room. When anything changes, the room tells every device at once, so there's no constant polling. The Netlify MP site keeps working until you switch over.

## What's in this folder

```
wrangler.toml      Cloudflare settings: Worker name, the app folder, the room class
package.json       installs Wrangler (Cloudflare's deploy tool) during the build
package-lock.json
src/index.js       the Worker + BattleRoom (sessions, leaders, locks, deliveries)
public/            the app (index.html, images, service worker)
.gitignore
```

## One-time setup

1. **Upload the files.** Put the **contents** of this folder into your new GitHub repository, at the top level. Don't upload `node_modules`; the `.gitignore` already excludes it.
2. **Connect the repository.** In the Cloudflare dashboard, go to **Workers & Pages → Create → Import a repository**. Connect GitHub if asked, then pick the new repository.
3. **Build settings:**
   - **Project / Worker name:** `gunpla-battle`. It **must match** `name` in `wrangler.toml`. If you'd like a different name, tell me and I'll change the file.
   - **Build command:** leave empty.
   - **Deploy command:** `npx wrangler deploy` (the default).
   - **Root directory:** `/`.
4. **Deploy.** Wait until the deployment shows **Success**. Cloudflare gives it a free address ending in `.workers.dev`, and you can test there first.
5. **Add your domain.** Open the Worker → **Settings → Domains & Routes → Add → Custom domain**, and enter your domain (e.g. `play.yourdomain.com`, or the domain itself). Cloudflare sets up the certificate automatically.
6. **Plan:** the Free plan includes SQLite-backed Durable Objects, which this app uses, so you can start there. The Workers Paid plan (about $5 a month) raises the limits if you ever need more.
7. **Spending alert:** add one under **Manage account → Billing → Notifications**, if you're on Paid.

## Updating later

1. **Upload the changed files** to GitHub and commit. Cloudflare deploys automatically.
2. **Wait for the deploy.** In the Worker's **Deployments** tab, wait for **Success**.
3. **Reopen the app** on each device and check the build number on the main menu.

**Running sessions survive updates.** Connected devices drop for a moment and reconnect by themselves.

## Everyone on the same build

**Why it matters:** after uploading an update, every device must be on the **same build** (shown on the main menu). A device still showing an older build may not send turn changes.
- **Updating a device:** close the app completely and reopen it, or pull down to refresh in the browser.
- **Lobby check:** the lobby shows each player's build and warns when they differ.
- **Stuck turn:** if a turn ever sticks, the **host** can tap **"Host: give the turn to the …"** on the turn box.

## Checking it works

1. **Open the timing panel:** create a session, then tap the **MP chip 5 times**.
2. **Read the panel:**
   - **data store** should say **cloudflare room**.
   - **live link** should say **open**, and **pushes** count up as other players do things.
   - **change arrived after** is the delay players feel. Expect a few hundredths of a second plus your network time.
3. **Try these on phones:**
   - **Lock the screen** for a minute, then unlock it.
   - **Switch Wi-Fi ↔ mobile data** mid-game.
   - **Turn airplane mode on and off.**

   Each time, the **live link** should return to **open** and the board should catch up.

## If something goes wrong

- **Logs:** open the Worker → **Observability / Logs** to see errors.
- **Rolling back:** in **Deployments**, you can roll back to an earlier version.
- **Can't create a session:** check that the deploy succeeded, and that `wrangler.toml` was uploaded to the top level of the repository.

## Build history

| Build | Changed files | What changed |
|---|---|---|
| cf1 | everything | First Cloudflare version: live rooms, instant pushes, reconnection |
| cf2 | `src/index.js`, `public/index.html`, `public/sw.js` | Over-budget teams ask the **host** to raise the DP limit (Accept / Decline pop-up); a raise applies to **both teams** |
| cf3 | `public/index.html`, `public/sw.js` | Your team's roster shows **who has each sheet open** (coloured tag + outline per player) |
| cf4 | `src/index.js`, `public/index.html`, `public/sw.js` | **Official turn order** kept by the room (only the active team can end its turn; the other team waits; out-of-step devices correct themselves); **no flicker** returning from a sheet (redraws only when something changed) |
| cf5 | `public/index.html`, `public/sw.js`, **new** `public/img/ship-musai.webp`, `ship-salamis.webp`, `ship-rewloola.webp`, `ship-racailum.webp` | **Warships**: Musai, Salamis Kai, Rewloola, Ra Cailum — new ship sheet (Canva layout, code-drawn), tinted wireframes, rings for Hull / Bridge / Thrusters / weapon systems, weapons list, Crew / AP / Movement, abilities (launch, dock, Damage Control, base module, decoys); ship rules applied automatically |
| cf6 | `src/index.js`, `public/index.html`, `public/sw.js` | **Stuck turn fix**: the room also passes the turn when the active team's save shows it ended (covers devices on older builds); lobby shows every device's build and warns on a mismatch; waiting message names a leader on another build; **host button** to give the turn to a team; safer handling of a refused turn change |
| cf7 | `public/index.html`, `public/sw.js`, **new** `public/img/portraits/ship-musai.webp`, `ship-salamis.webp`, `ship-rewloola.webp`, `ship-racailum.webp` | **Roster tabs** (Mobile suits · Ships · Ground units); **grand warship picker** cards with the new ship photos; Ground units **under construction** notice; ship photos on roster rows and the ship sheet dial; fix: the unit list stays in columns after adding a unit |
| cf8 | `public/index.html`, `public/sw.js` | **Carriers**: Confirm team → **Load your carriers** (capacity rule, auto-load); passengers greyed on the roster (⚓ ABOARD); **Launch** picker (catapult bonus: +10cm/AP, may attack — purple buff on the suit sheet); **Dock** picker (aboard next turn); **Emergency Disembark** when a carrier is destroyed |
| cf9 | `public/index.html`, `public/sw.js` | Turn notice no longer flickers and is message-only; the **one** Start My Turn button turns **green and pulses** when it's your turn to start; fix: a leader's roster could be wiped if they added units / confirmed before the first sync after the battle started |
| cf10 | `public/img/portraits/ship-musai.webp`, `ship-rewloola.webp`, `public/index.html`, `public/sw.js` | Cleaner Musai and Rewloola portraits (build bump so devices fetch the new images) |
