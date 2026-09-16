# Gunpla Battle — Cloudflare version (build cf3)

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
