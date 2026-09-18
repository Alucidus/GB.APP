import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import {startTestServer} from './local-room.mjs';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES ? process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright' : 'playwright');
const {room,server,url}=await startTestServer();
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||undefined});
const errors=[];
const pages=[];
const post=async b => {const r=await fetch(url+'/api/sync',{method:'POST',body:JSON.stringify(b)});const j=await r.json();assert.equal(j.ok,true,JSON.stringify(j));return j;};
const a=await post({action:'create',name:'Alice'}),b=await post({action:'join',code:a.code,name:'Bob'});
const sync=async (seat,writes={}) => post({action:'sync',...seat,known:{},writes});
async function refresh(page,seat) {
 const j=await sync(seat);
 await page.evaluate(j=>{mp.data=j.changes;mp.etags=j.etags;mp.leaders=j.leaders;mp.hostPid=j.hostPid;roster.forEach(r=>mpApplyUnit(r,true));ffLastSig='';renderFF();},j);
}
async function flush(page,seat) {
 const writes=await page.evaluate(()=>{const ops=mp.ffOps||[];mp.ffOps=[];const units={};roster.forEach(r=>units[side+'/'+r.uid]={st:r.st});return {ff:ops,units};});
 const j=await sync(seat,writes);assert.deepEqual(j.denied||[],[]);await refresh(page,seat);return j;
}
const both=async()=>{await refresh(pages[0],a);await refresh(pages[1],b);};
try {
 await sync(a,{player:{team:'federation'}});await sync(b,{player:{team:'spacenoid'}});
 await sync(a,{settings:{phase:'battle',first:'federation'}});
 for(const [i,seat,team] of [[0,a,'federation'],[1,b,'spacenoid']]) {
   const ctx=await browser.newContext({viewport:i?{width:844,height:390}:{width:1280,height:850},serviceWorkers:'block'});
   const page=await ctx.newPage();pages.push(page);page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
   await page.goto(url);await page.waitForFunction(()=>typeof sqFresh==='function');
   const j=await sync(seat);
   const rows=await page.evaluate(({seat,team,j})=>{
     mpStop();mpKick=()=>{};mpSchedule=()=>{};
     Object.assign(mp,{...seat,status:'online',entered:true,data:j.changes,etags:j.etags,leaders:j.leaders,hostPid:j.hostPid});
     side=team;locked=true;turn=freshTurn();
     const unit=GROUND_UNITS.find(u=>isSquad(u)&&u.faction===team);
     roster=[1,2,3].map(uid=>({uid,id:unit.id,name:(team==='federation'?'Blue ':'Red ')+uid,st:sqFresh(unit)}));
     nextUid=4;
     return roster;
   },{seat,team,j});
   const units={};rows.forEach(r=>units[team+'/'+r.uid]={st:r.st});
   const r=await sync(seat,{units,team:{roster:rows,turn:{ends:0,phase:'you'}}});assert.deepEqual(r.denied,[]);
 }
 // Real challenge / acceptance and four rounds, leaving damage unchanged for tied physical rolls.
 const ff=async(seat,x)=>{const j=await sync(seat,{ff:{id:'testfight',...x}});assert.deepEqual(j.denied||[],[],JSON.stringify(x));return j;};
 await ff(a,{op:'invite',aUids:[1,2],bUids:[1,2],aLabels:['Blue 1','Blue 2'],bLabels:['Red 1','Red 2'],obj:'Car'});
 await ff(b,{op:'accept',pairs:[[1,1],[2,2]]});await ff(a,{op:'mode',pick:'physical'});await ff(b,{op:'modeAnswer',yes:true});
 for(let i=1;i<=4;i++) {
   await ff(a,{op:'ready',hp:8,supp:0});await ff(b,{op:'ready',hp:8,supp:0});
   await ff(a,{op:'pick',item:'none'});await ff(b,{op:'pick',item:'none'});
   await ff(a,{op:'claim',result:'tied'});await ff(b,{op:'claim',result:'tied'});
 }
 await ff(a,{op:'ready',hp:8,supp:0});await ff(b,{op:'ready',hp:8,supp:0});
 assert.equal(room.mem.get('ff/testfight').state,'end');
 for(let i=0;i<2;i++) {await refresh(pages[i],i?b:a);await pages[i].evaluate(()=>{openSheet(1);ffHidden=false;ffLastSig='';renderFF();});}
 const [pa,pb]=pages;
 assert.equal(await pa.locator('.ffoc').count(),1);assert.equal(await pa.locator('.ffboard').count(),0);
 assert.equal(await pa.locator('.ffsides').count(),0);
 assert.ok((await sync(a,{endTurn:{seq:1}})).denied.includes('end-turn:firefight'));
 await pa.getByRole('button',{name:'We secured it',exact:true}).click();await flush(pa,a);await both();
 assert.equal(await pa.locator('.ffoc').count(),0);assert.equal(await pa.locator('.ffboard-card').count(),4);
 assert.equal(await pb.locator('.ffboard-items img').count(),6);assert.equal(await pb.locator('.ffboard-team.federation .ffboard-items').count(),0);
 await fs.mkdir(new URL('./screenshots/',import.meta.url),{recursive:true});
 await pa.screenshot({path:fileURLToPath(new URL('./screenshots/board-desktop.png',import.meta.url))});await pb.screenshot({path:fileURLToPath(new URL('./screenshots/board-phone.png',import.meta.url))});
 for(const p of pages) assert.equal(await p.evaluate(()=>document.querySelector('.ffpanel').scrollWidth>document.querySelector('.ffpanel').clientWidth),false);
 // Two confirmations, reversible even after both confirm; stale roster fallback cannot end early.
 await pa.getByRole('button',{name:'Confirm fighter',exact:true}).click();await flush(pa,a);await both();
 assert.match(await pa.locator('.ffboard-confirm').innerText(),/Waiting for the Spacenoids/);
 assert.ok((await sync(a,{endTurn:{seq:1}})).denied.includes('end-turn:firefight'));
 await sync(a,{team:{turn:{ends:1,phase:'enemy'}}});assert.equal(room.mem.get('turn').seq,1);
 await pb.getByRole('button',{name:'Confirm fighter',exact:true}).click();await flush(pb,b);await both();
 assert.equal(room.mem.get('ff/testfight').state,'end');
 await pa.getByRole('button',{name:'Un-confirm',exact:true}).click();await flush(pa,a);await both();
 assert.ok((await sync(a,{endTurn:{seq:1}})).denied.includes('end-turn:firefight'));
 // Disengagement denied by waiting squad, then stay resets BOTH confirmations.
 await pa.locator('.ffboard-card').filter({hasText:'Blue 1'}).getByRole('button',{name:/Disengage/}).click();await flush(pa,a);await both();
 assert.equal(await pa.locator('.ffboard').count(),0);
 await pb.getByRole('button',{name:'Deny · 1 Flashbang',exact:true}).click();
 await pb.locator('#picklist .row').filter({hasText:'Red 2'}).click();await flush(pb,b);await both();
 assert.equal(await pb.evaluate(()=>roster.find(r=>r.uid===2).st.sq.qr.items.fb),1);
 await pa.getByRole('button',{name:'Stay and fight on',exact:true}).click();await flush(pa,a);await both();
 assert.deepEqual(room.mem.get('ff/testfight').confirmed,{a:false,b:false});
 // Non-holder gets the same response flow and can leave without ending the engagement.
 await pa.locator('.ffboard-card').filter({hasText:'Blue 2'}).getByRole('button',{name:/Disengage/}).click();await flush(pa,a);await both();
 await pb.getByRole('button',{name:'Let them go',exact:true}).click();await flush(pb,b);await both();
 assert.equal(room.mem.get('ff/testfight').state,'end');assert.equal(room.mem.get('ff/testfight').eng.aList.length,1);
 // Add survivor to roster and choose it; turn boundary starts precisely one bout.
 await ff(a,{op:'engedit',kind:'add',uid:3,label:'Blue 3'});await both();
 await pa.locator('.ffboard-card').filter({hasText:'Blue 3'}).getByRole('button',{name:'Select fighter'}).click();await flush(pa,a);
 await pa.getByRole('button',{name:'Confirm fighter',exact:true}).click();await flush(pa,a);
 await pb.getByRole('button',{name:'Confirm fighter',exact:true}).click();await flush(pb,b);
 await sync(a,{endTurn:{seq:1}});await both();
 assert.equal(room.mem.get('turn').seq,2);assert.equal(room.mem.get('ff/testfight').state,'mode');assert.equal(room.mem.get('ff/testfight').a.uid,3);assert.equal(room.mem.get('ff/testfight').eng.bout,2);
 assert.equal(room.mem.get('unit/spacenoid/2').st.sq.qr.items.fb,1);
 await ff(a,{op:'mode',pick:'physical'});await ff(b,{op:'modeAnswer',yes:true});await both();
 // Play second bout via protocol, reopen the newly chosen squad, then smoke extraction.
 for(let i=1;i<=4;i++) {
   await ff(a,{op:'ready',hp:8,supp:0});await ff(b,{op:'ready',hp:8,supp:0});await ff(a,{op:'pick',item:'none'});await ff(b,{op:'pick',item:'none'});await ff(a,{op:'claim',result:'tied'});await ff(b,{op:'claim',result:'tied'});
 }
 await ff(a,{op:'ready',hp:8,supp:0});await ff(b,{op:'ready',hp:8,supp:0});
 await both();await pa.evaluate(()=>{openSheet(3);ffHidden=false;renderFF();});await pb.evaluate(()=>{openSheet(2);ffHidden=false;renderFF();});
 await pa.getByRole('button',{name:'We secured it',exact:true}).click();await flush(pa,a);await both();
 assert.equal(await pa.locator('.ffboard-flag').count(),1);
 assert.equal(await pa.evaluate(()=>roster.filter(r=>r.st.sq.holdsObj).length),1);
 assert.equal(await pa.getByRole('button',{name:'Confirm fighter',exact:true}).count(),0);
 await pa.locator('.ffboard-more summary').click();assert.equal(await pa.getByRole('button',{name:/Forced Re-Engagement/}).count(),1);
 await pa.locator('.ffboard-card').filter({hasText:'Blue 3'}).getByRole('button',{name:/Disengage/}).click();await flush(pa,a);await both();
 await pb.getByRole('button',{name:'Deny · 1 Flashbang',exact:true}).click();await pb.locator('#picklist .row').filter({hasText:'Red 2'}).click();await flush(pb,b);await both();
 await pa.getByRole('button',{name:'Smoke out · 1 Smoke',exact:true}).click();await pa.locator('#picklist .row').filter({hasText:'Blue 1'}).click();await flush(pa,a);await both();
 await pb.getByRole('button',{name:'Let them go',exact:true}).click();await flush(pb,b);await both();
 assert.equal(room.mem.get('ff/testfight').secured,'a');assert.equal(room.mem.get('ff/testfight').state,'closed');
 assert.match(await pb.locator('#ffx').innerText(),/They extracted with 🚩 Car/);
 assert.equal(await pa.evaluate(()=>roster.find(r=>r.uid===1).st.sq.qr.items.sm),1);
 assert.equal(await pa.locator('.ffboard').count(),0);
 assert.deepEqual(errors,[]);
 console.log('PASS: two browser devices; four-round clash; board privacy; confirmations/un-confirm; explicit and fallback turn gates; waiting-squad Flashbang; failed extraction reset; non-holder departure; roster add; selection; next-turn start; no refill; objective transfer; final-bout More; smoke extraction.');
} finally {await browser.close();await new Promise(r=>server.close(r));}
