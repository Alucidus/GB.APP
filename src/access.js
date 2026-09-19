const COOKIE='__Host-gb-access',AGE=12*60*60;
const enc=new TextEncoder();
const hex=b=>Array.from(new Uint8Array(b),x=>x.toString(16).padStart(2,'0')).join('');
const configured=e=>typeof e.SITE_PASSWORD==='string'&&e.SITE_PASSWORD.length>0&&typeof e.SESSION_SECRET==='string'&&e.SESSION_SECRET.length>=32;
const headers={'cache-control':'no-store','x-content-type-options':'nosniff','referrer-policy':'same-origin','x-frame-options':'DENY'};
export const accessCookie=r=>(r.headers.get('cookie')||'').split(';').map(x=>x.trim()).find(x=>x.startsWith(COOKIE+'='))?.slice(COOKIE.length+1)||'';
async function signature(body,e){const key=await crypto.subtle.importKey('raw',enc.encode(e.SESSION_SECRET),{name:'HMAC',hash:'SHA-256'},false,['sign']);return hex(await crypto.subtle.sign('HMAC',key,enc.encode(body+'|'+e.SITE_PASSWORD)));}
async function equal(a,b){const [x,y]=await Promise.all([a,b].map(s=>crypto.subtle.digest('SHA-256',enc.encode(s))));let diff=0;const aa=new Uint8Array(x),bb=new Uint8Array(y);for(let i=0;i<aa.length;i++)diff|=aa[i]^bb[i];return diff===0;}
export async function validAccess(token,e){
 if(!configured(e)||!/^\d{10,13}\.[a-f0-9]{32}\.[a-f0-9]{64}$/.test(token||''))return false;
 const [exp,nonce,sig]=token.split('.'),now=Math.floor(Date.now()/1000);if(+exp<=now||+exp>now+AGE)return false;
 return equal(sig,await signature(exp+'.'+nonce,e));
}
function page(message='',status=200){return new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Private hangar · Gunpla Battle</title><style>
*{box-sizing:border-box}body{margin:0;min-height:100dvh;display:grid;place-items:center;padding:24px;background:radial-gradient(ellipse at top,#233746,#080e16 65%);color:#edf4f9;font-family:system-ui,sans-serif}main{width:min(100%,440px);padding:32px;border:1px solid #627e91;background:#0c1721;box-shadow:0 16px 80px #0008;border-top:3px solid #e4ad57}small{letter-spacing:.22em;color:#e4ad57}h1{font-size:30px;line-height:1.1;margin:18px 0}p{color:#b6c7d3;line-height:1.5}label{display:block;margin:24px 0 8px;font-weight:700}input,button{width:100%;min-height:48px;border:1px solid #647f93;padding:12px;font-size:16px;border-radius:4px}input{background:#060e16;color:#fff}button{margin-top:16px;background:#e4ad57;color:#171006;font-weight:800;cursor:pointer}input:focus-visible,button:focus-visible{outline:3px solid #fff;outline-offset:3px}.error{color:#ffc58d;min-height:24px}footer{font-size:12px;color:#8da2b2;margin-top:24px}
</style></head><body><main><small>GUNPLA BATTLE / PRIVATE ACCESS</small><h1>Enter the hangar</h1><p>This is a private fan project. Enter the access password to continue.</p><form method="post" action="/auth/login"><label for="password">Access password</label><input id="password" name="password" type="password" autocomplete="current-password" required maxlength="256" autofocus><button type="submit">UNLOCK</button><p class="error" role="alert">${message}</p></form><footer>Previously downloaded copies remain available offline. Gundam belongs to its respective owners. Not affiliated with Bandai Namco Entertainment.</footer></main></body></html>`,{status,headers:{...headers,'content-type':'text/html; charset=utf-8','content-security-policy':"default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'"}});}
const denied=(status=401)=>new Response(JSON.stringify({ok:false,code:'SITE_LOCKED',error:'Unlock the site to use online access.'}),{status,headers:{...headers,'content-type':'application/json'}});
const redirect=(path,cookie)=>new Response(null,{status:303,headers:{...headers,location:path,...(cookie?{'set-cookie':cookie}:{})}});
export async function accessGate(request,e){
 const u=new URL(request.url),path=u.pathname;
 if(path==='/auth/logout'){
  if(request.method!=='POST'||request.headers.get('origin')!==u.origin)return denied(403);
  return redirect('/auth/login',COOKIE+'=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0');
 }
 if(!configured(e))return path.startsWith('/api/')?denied(503):page('Private access is not configured yet. The owner needs to set the server secrets.',503);
 const token=accessCookie(request),valid=await validAccess(token,e);
 if(path==='/api/access/status')return valid?new Response('{"ok":true}',{headers:{...headers,'content-type':'application/json'}}):denied();
 if(path==='/auth/login'){
  if(request.method==='GET')return valid?redirect('/'):page();
  if(request.method!=='POST')return denied(405);
  if(request.headers.get('origin')!==u.origin)return denied(403);
  if(!e.LOGIN_RATE_LIMIT)return page('Access is temporarily unavailable.',503);
  const limit=await e.LOGIN_RATE_LIMIT.limit({key:request.headers.get('cf-connecting-ip')||'unknown'});
  if(!limit.success){const r=page('Too many attempts. Wait a minute and try again.',429);r.headers.set('retry-after','60');return r;}
  if(!request.headers.get('content-type')?.startsWith('application/x-www-form-urlencoded'))return denied(415);
  // Bound the streamed body even when Content-Length is absent or forged.
  const reader=request.body?.getReader();let bytes=0,chunks=[];if(reader){while(true){const {done,value}=await reader.read();if(done)break;bytes+=value.length;if(bytes>2048){await reader.cancel();return denied(413);}chunks.push(value);}}
  const buffer=new Uint8Array(bytes);let at=0;for(const chunk of chunks){buffer.set(chunk,at);at+=chunk.length;}
  const pwd=new URLSearchParams(new TextDecoder().decode(buffer)).get('password')||'';
  if(!await equal(pwd,e.SITE_PASSWORD))return page('Incorrect password. Please try again.',401);
  const body=(Math.floor(Date.now()/1000)+AGE)+'.'+hex(crypto.getRandomValues(new Uint8Array(16))),signed=body+'.'+await signature(body,e);
  return redirect('/',COOKIE+'='+signed+'; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age='+AGE);
 }
 if(valid){const origin=request.headers.get('origin');if(path.startsWith('/api/')&&((origin&&origin!==u.origin)||(path==='/api/ws'&&origin!==u.origin)))return denied(403);return null;}
 if(request.method==='GET'&&(request.headers.get('sec-fetch-mode')==='navigate'||path==='/'||path==='/index.html'))return redirect('/auth/login');
 return denied();
}
