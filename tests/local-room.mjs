// Test-only HTTP adapter. Runs the production BattleRoom with in-memory storage;
// it does not emulate Cloudflare WebSockets or persistence.
import { BattleRoom } from '../src/index.js';
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
export async function startTestServer() {
  const data = new Map();
  const storage = { list: async () => data, put: async (k,v) => data.set(k,structuredClone(v)), delete: async k => data.delete(k), deleteAll: async () => data.clear(), setAlarm: async () => {} };
  const room = new BattleRoom({ storage, getWebSockets: () => [] }, {});
  await room.mem.load();
  const root = path.resolve(import.meta.dirname, '../public');
  let queue = Promise.resolve();
  const server = http.createServer(async (req,res) => {
    try {
      if (req.url === '/api/sync') {
        let raw=''; for await (const c of req) raw += c;
        const b=JSON.parse(raw); if(b.action === 'create') { b.action='init'; b.code='ABCDE'; }
        const result = await (queue = queue.then(() => room.handle(b, null)));
        res.writeHead(result.status || 200, {'content-type':'application/json'});res.end(JSON.stringify(result.body));return;
      }
      const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
      const file=path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
      if (!file.startsWith(root + path.sep)) throw Error('Invalid path');
      const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.svg':'image/svg+xml'};
      res.writeHead(200,{'content-type':types[path.extname(file)] || 'application/octet-stream'}); res.end(await fs.readFile(file));
    } catch(e) {res.writeHead(404);res.end(String(e));}
  });
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  return {room,server,url:'http://127.0.0.1:'+server.address().port};
}
