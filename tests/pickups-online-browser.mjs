import assert from 'node:assert/strict';import {createRequire} from 'node:module';import {startTestServer} from './local-room.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
const {server,url,room}=await startTestServer(),browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH});
const post=async b=>(await(await fetch(url+'/api/sync',{method:'POST',body:JSON.stringify(b)})).json()),sync=(s,writes={})=>post({action:'sync',...s,known:{},writes});
const a=await post({action:'create',name:'Collector'}),b=await post({action:'join',code:a.code,name:'Owner'}),pages=[],errors=[];
try{
 for(const [seat,team,dead] of [[a,'federation',false],[b,'spacenoid',true]]){
  await sync(seat,{player:{team}});
  const page=await browser.newPage({viewport:{width:844,height:390},hasTouch:true,isMobile:true,serviceWorkers:'block',reducedMotion:'reduce'});pages.push(page);page.on('pageerror',e=>errors.push(e.message));await page.goto(url);await page.waitForFunction(()=>typeof openSheet==='function');
  const rows=await page.evaluate(({team,dead})=>{mpStop();mpKick=()=>{};mpSchedule=()=>{};side=team;locked=true;turn=freshTurn();turn.started=true;const u=unitById('rx-78-2-gundam');roster=[{uid:1,id:u.id,st:freshState(u)}];if(dead)roster[0].st.hp.rightArm=0;return roster;},{team,dead});
  await sync(seat,{team:{roster:rows},units:{[team+'/1']:{st:rows[0].st}}});
 }
 await sync(a,{settings:{phase:'battle',first:'federation'}});
 async function refresh(page,seat,force=false){const j=await sync(seat);await page.evaluate(({j,seat,force})=>{Object.assign(mp,{...seat,status:'online',entered:true,data:j.changes,etags:j.etags,leaders:j.leaders,hostPid:j.hostPid});mp.held.add(side+'/1');roster.forEach(r=>mpApplyUnit(r,force));reloadCur();},{j,seat,force});}
 for(const [i,seat] of [[0,a],[1,b]]){await refresh(pages[i],seat,true);await pages[i].evaluate(()=>openSheet(1));}
 const [pa,pb]=pages;await pa.locator('#pickupBtn').tap();await pa.locator('.pickup-item button').first().tap();await pa.locator('#pickExtra button').tap();
 const writes=await pa.evaluate(()=>({pickup:mp.pickupOps,units:{[side+'/1']:{st:CUR.st}}}));const result=await sync(a,writes);assert.deepEqual(result.denied,[]);
 await pa.evaluate(()=>mp.pickupOps=[]);await refresh(pa,a);await refresh(pb,b);
 assert.equal(await pa.evaluate(()=>CUR.st.eq.loot.length),1);assert.equal(await pa.evaluate(()=>ap),3);
 assert.ok((await pb.evaluate(()=>CUR.st.eq.taken)).length>0,'held source sheet receives ownership change');
 await pa.evaluate(()=>{closePicker();draw();});await pa.locator('.eq-limb-label.eq-left').tap();assert.match(await pa.locator('#picklist').textContent(),/Beam Rifle/);
 await pb.evaluate(()=>openPickup());assert.equal(await pb.locator('.pickup-item').count(),0,'claimed item vanishes on other client');
 const item=Object.values(room.mem.get('battlefield').items)[0];assert.equal(item.status,'claimed');
 // A captured shield can be stowed and swapped through the real shared room.
 const ownerState=structuredClone(room.mem.get('unit/spacenoid/1').st);ownerState.hp.leftArm=0;ownerState.sh[0]=6;
 await sync(b,{units:{'spacenoid/1':{st:ownerState}}});await refresh(pa,a);await pa.evaluate(()=>{closePicker();draw();});
 await pa.locator('#pickupBtn').tap();await pa.locator('.pickup-item').filter({hasText:'6/12 shield HP'}).locator('button').tap();await pa.locator('#pickExtra button').tap();
 const pickupWrites=await pa.evaluate(()=>({pickup:mp.pickupOps,units:{[side+'/1']:{st:CUR.st}}}));assert.deepEqual((await sync(a,pickupWrites)).denied,[]);
 await pa.evaluate(()=>mp.pickupOps=[]);await refresh(pa,a);await refresh(pb,b);await pa.evaluate(()=>{closePicker();draw();});
 assert.equal(await pa.locator('[data-shield-arm="rightArm"] .num').innerText(),'R6/12');
 await pa.locator('#stowBtn').tap();await pa.locator('.eq-shield-stow[data-shield-index="1"] button').tap();
 await sync(a,{units:{'federation/1':{st:await pa.evaluate(()=>CUR.st)}}});assert.equal(room.mem.get('unit/federation/1').st.eq.shields[1],null);
 await pa.locator('#equipBtn').tap();await pa.locator('.eq-more').tap();await pa.locator('.eq-card[data-shield-index="1"]').getByRole('button',{name:'Equip shield · 1 AP',exact:true}).tap();
 await pa.locator('.eq-shield-equip[data-shield-arm="leftArm"] button').tap();await pa.locator('#eqSwapConfirm').tap();
 await sync(a,{units:{'federation/1':{st:await pa.evaluate(()=>CUR.st)}}});await refresh(pa,a,true);await pa.evaluate(()=>draw());
 assert.deepEqual(room.mem.get('unit/federation/1').st.eq.shields,[null,'leftArm']);assert.equal(room.mem.get('unit/federation/1').st.sh[1],6);assert.equal(await pa.evaluate(()=>ap),1);
 assert.equal(await pa.locator('[data-shield-arm="leftArm"] .num').innerText(),'L6/12');
 assert.deepEqual(errors,[]);console.log('PASS online pickup: real room, two browser clients, actual weapon/shield pickup taps, stow, swap, held-sheet updates and shared removal');
}finally{await browser.close();await new Promise(r=>server.close(r));}
