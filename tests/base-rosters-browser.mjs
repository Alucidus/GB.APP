import assert from 'node:assert/strict';import {createRequire} from 'node:module';import {startTestServer} from './local-room.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
const {server,url}=await startTestServer(),browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH});
const post=async b=>(await(await fetch(url+'/api/sync',{method:'POST',body:JSON.stringify(b)})).json()),sync=(seat,writes={})=>post({action:'sync',...seat,known:{},writes});
const errors=[],pages=[];let checks=0;
try{
 const a=await post({action:'create',name:'Base owner'}),b=await post({action:'join',code:a.code,name:'Teammate'}),c=await post({action:'join',code:a.code,name:'Opponent'});
 for(const [seat,team] of [[a,'federation'],[b,'federation'],[c,'spacenoid']]){
  await sync(seat,{player:{team}});
  const page=await browser.newPage({viewport:{width:844,height:390},hasTouch:true,isMobile:true,serviceWorkers:'block',reducedMotion:'reduce'});pages.push(page);
  page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>r.request().url().startsWith(url)?r.continue():r.abort());
  await page.goto(url);await page.waitForFunction(()=>typeof openSheet==='function');
  const row=await page.evaluate(team=>{mpStop();mpKick=()=>{};mpSchedule=()=>{};side=team;locked=true;turn=freshTurn();turn.started=true;const u=unitById('rx-78-2-gundam');roster=[{uid:1,id:u.id,st:freshState(u)}];roster[0].st.hp.chest=1;roster[0].st.hp.leftArm=0;roster[0].st.sh[0]=1;return roster[0];},team);
  if(seat!==b)await sync(seat,{team:{roster:[{uid:1,id:row.id}],locked:true,turn:{round:1,phase:team==='federation'?'you':'enemy',started:true}},units:{[team+'/1']:{st:row.st}}});
 }
 await sync(a,{settings:{phase:'battle',first:'federation'}});
 async function refresh(page,seat){const j=await sync(seat);await page.evaluate(({seat,j})=>{Object.assign(mp,{...seat,status:'online',entered:true,data:j.changes,etags:j.etags,leaders:j.leaders,hostPid:j.hostPid});mpApply();},{seat,j});}
 for(const [i,seat] of [[0,a],[1,b],[2,c]]){await refresh(pages[i],seat);await pages[i].evaluate(()=>{renderRoster();show('s3');});}
 const [owner,ally,enemy]=pages;await owner.evaluate(()=>{mp.held.add(side+'/1');openSheet(1);});
 await owner.locator('#baseBtn').tap();
 assert.equal(await owner.locator('#picklist select').count(),0,'owner dropdown removed');checks++;
 assert.equal(await owner.locator('.repair-owner-list button').count(),2,'only teammates listed');checks++;
 assert.equal(await owner.locator('[data-owner-id="'+a.pid+'"]').getAttribute('aria-pressed'),'true');checks++;
 for(const viewport of [{width:667,height:375},{width:844,height:390},{width:1280,height:850}]){
  await owner.setViewportSize(viewport);await owner.locator('.repair-owner-list').scrollIntoViewIfNeeded();
  assert.ok(await owner.locator('.repair-owner-list button').evaluateAll(ns=>ns.every(n=>n.getBoundingClientRect().height>=44&&n.scrollWidth<=n.clientWidth)),'owner rows fit and remain touch sized');checks++;
  await owner.screenshot({path:'tests/screenshots/base-players-cf125-'+viewport.width+'.png'});
 }
 await owner.setViewportSize({width:844,height:390});
 await owner.locator('[data-owner-id="'+b.pid+'"]').tap();
 assert.equal(await owner.evaluate(()=>CUR.st.repair.owner),b.pid,'player row assigns owner');checks++;
 assert.equal(await owner.locator('#repairBaseSlot').isDisabled(),true,'only owner can enter');checks++;
 assert.equal(await owner.locator('.repair-base-unit').getAttribute('aria-disabled'),'true','another owner cannot select unit');checks++;
 assert.deepEqual((await sync(a,{units:{'federation/1':{st:await owner.evaluate(()=>CUR.st)}}})).denied,[]);checks++;
 await refresh(ally,b);await ally.evaluate(()=>{mp.held.add(side+'/1');openSheet(1);openRepairBase();});
 assert.equal(await ally.evaluate(()=>CUR.st.repair.owner),b.pid,'assignment synchronized to teammate');checks++;
 assert.equal(await ally.locator('.repair-owner-list').count(),0,'nonleader cannot reassign');checks++;
 assert.equal(await ally.locator('#repairBaseSlot').isDisabled(),true,'owner must select a unit first');checks++;
 await ally.locator('.repair-base-unit').tap();assert.equal(await ally.locator('#repairBaseSlot').isEnabled(),true,'assigned player can select and enter their base');checks++;
 await owner.locator('[data-owner-id="'+a.pid+'"]').tap();
 await sync(a,{units:{'federation/1':{st:await owner.evaluate(()=>CUR.st)}}});await refresh(ally,b);
 await owner.locator('#pickCancel').tap();
 await owner.evaluate(()=>{mp.held.clear();openRepairBase();});
 assert.equal(await owner.locator('.repair-owner-list button:enabled').count(),0,'read-only sheet cannot reassign');checks++;
 await owner.evaluate(()=>{mp.held.add(side+'/1');closePicker();});
 await ally.evaluate(()=>{openSheet(1);openPicker();});
 await owner.locator('#baseBtn').tap();await owner.locator('.repair-base-unit').tap();await owner.locator('#repairBaseSlot').tap();await owner.locator('#pickCancel').tap();
 assert.equal(await owner.evaluate(()=>!!CUR.st.repair.entry),false,'cancelling entry does not enter base');checks++;
 for(const inBase of [true,false]){
  await owner.locator('#baseBtn').tap();await owner.locator(inBase?'#repairBaseSlot':'#repairBaseAction').tap();await owner.locator('#pickExtra button').tap();
  assert.deepEqual((await sync(a,{units:{'federation/1':{st:await owner.evaluate(()=>CUR.st)}}})).denied,[]);checks++;
  for(const [page,seat] of [[owner,a],[ally,b],[enemy,c]])await refresh(page,seat);
  await owner.evaluate(()=>renderRoster());
  assert.equal(await owner.locator('#rosterBox .base-roster-state svg').count(),inBase?1:0);checks++;
  assert.equal(await ally.locator('#picklist .base-roster-state svg').count(),inBase?1:0,'open teammate picker updates without reopening');checks++;
  assert.equal(await enemy.locator('#oppBox .base-roster-state svg').count(),inBase?1:0,'enemy roster updates from shared state');checks++;
  assert.equal(await enemy.locator('#oppBox .base-roster-state').evaluate(n=>getComputedStyle(n.closest('.row')).opacity),inBase?'0.5':'1','dim only during actual base presence');checks++;
  if(inBase){
   await enemy.locator('#oppBox .base-roster-state').scrollIntoViewIfNeeded();await enemy.screenshot({path:'tests/screenshots/base-rosters-enemy-cf125.png'});await ally.screenshot({path:'tests/screenshots/base-rosters-picker-cf125.png'});
   await owner.locator('#baseBtn').tap();assert.equal(await owner.locator('.repair-owner-list button:enabled').count(),0,'owner locked while unit is in base');checks++;
   await owner.locator('#pickCancel').tap();
   const state=async()=>{const j=await sync(a);return {st:j.changes['unit/federation/1'].st,turn:j.changes.turn};};
   let current=await state();assert.equal(current.st.repair.live.status,'Repairing');checks++;
   await sync(a,{endTurn:{seq:current.turn.seq}});current=await state();assert.equal(current.st.hp.chest,1,'enemy turn does not heal');checks++;
   await sync(c,{endTurn:{seq:current.turn.seq}});current=await state();
   assert.equal(current.st.hp.chest,3,'base restores 2 HP at next own turn');assert.equal(current.st.sh[0],6,'base restores 5 shield HP');assert.equal(current.st.hp.leftArm,0,'destroyed limb stays destroyed');checks+=3;
   assert.equal((await state()).st.hp.chest,3,'sync cannot repeat healing');checks++;
   for(const [page,seat] of [[owner,a],[ally,b],[enemy,c]])await refresh(page,seat);
   assert.equal(await owner.evaluate(()=>CUR.st.hp.chest),3,'held sheet receives repair');checks++;
  }else{
   const snapshot=(await sync(a)).changes;await sync(a,{endTurn:{seq:snapshot.turn.seq}});const next=(await sync(c)).changes;await sync(c,{endTurn:{seq:next.turn.seq}});
   assert.equal((await sync(a)).changes['unit/federation/1'].st.hp.chest,3,'leaving base stops repair');checks++;
  }
 }
 assert.deepEqual(errors,[]);checks++;console.log('PASS '+checks+' base checks: player list, ownership permissions/sync, entry/cancel/exit, authoritative healing and live roster symbols');
}finally{await browser.close();await new Promise(r=>server.close(r));}
