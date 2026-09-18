import {createRequire} from 'node:module';import fs from 'node:fs';import assert from 'node:assert/strict';
import {startTestServer} from './local-room.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
const {server,url}=await startTestServer(),browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH});
fs.mkdirSync('tests/screenshots',{recursive:true});const errors=[];
try{
 for(const viewport of [{width:844,height:390},{width:667,height:375},{width:932,height:430}]){
  const page=await browser.newPage({viewport,isMobile:true,hasTouch:true,deviceScaleFactor:1,serviceWorkers:'block',reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',r=>r.request().url().startsWith(url)?r.continue():r.abort());await page.goto(url);await page.waitForFunction(()=>typeof openSheet==='function');
  await page.evaluate(()=>{side='federation';locked=true;turn=freshTurn();turn.round=1;turn.phase='you';turn.started=true;const u=unitById('rx-78-2-gundam');roster=[{uid:1,id:u.id,st:freshState(u)}];roster[0].st.hp.chest-=4;openSheet(1);});
  await page.screenshot({path:'tests/screenshots/mobile-sheet-'+viewport.width+'.png'});
  await page.locator('#baseBtn').tap({position:{x:15,y:15}});await page.locator('.repair-base-unit').tap();await page.locator('#repairBaseSlot').tap();await page.locator('#pickExtra button').tap();
  assert.match(await page.locator('#repairStatus').textContent(),/Repairing/);
  const before=await page.evaluate(()=>CUR.st.hp.chest);await page.evaluate(()=>{turn.phase='enemy';startMyTurnCore();});assert.equal(await page.evaluate(()=>CUR.st.hp.chest),before+2);
  await page.evaluate(()=>openEquipment());await page.screenshot({path:'tests/screenshots/mobile-equipment-'+viewport.width+'.png'});await page.evaluate(()=>closePicker());
  for(const id of ['unicorn-gundam-03-phenex-rx-0-n','kshatriya-nz-666','ground-squad-fed','ground-tank-fed','rewloola-class-battleship']){
   await page.evaluate(id=>{const u=unitById(id);roster=[{uid:1,id,st:freshState(u)}];openSheet(1);},id);
   await page.screenshot({path:'tests/screenshots/mobile-'+id+'-'+viewport.width+'.png'});
   if(id==='ground-squad-fed'){
    const beforeAP=await page.evaluate(()=>CUR.st.ap);await page.locator('.sqmove').tap();assert.equal(await page.evaluate(()=>CUR.st.ap),beforeAP-1,'squad Move accessible without footer interception');
   }
   if(id.includes('phenex')||id.includes('kshatriya'))assert.ok(await page.evaluate(()=>{const svg=document.querySelector('.arcring').getBoundingClientRect(),dial=document.querySelector('.fdial.o').getBoundingClientRect();return Math.abs(svg.x+U.ring.cx/100*svg.width-(dial.x+dial.width/2))<2;}),'shield arcs align with their moved frame');
  }
  await page.evaluate(()=>openRepairBay());assert.match(await page.locator('#pickS').textContent(),/first repair turn 3/);await page.locator('#pickCancel').tap();
  await page.evaluate(()=>{
   const u=unitById('ground-squad-fed');roster=[1,2,3,4].map(uid=>({uid,id:u.id,st:freshState(u)}));openSheet(1);
   mp.pid='mobile';mp.code='ABCDE';mp.entered=true;mp.data.settings={phase:'battle'};mp.data['player/mobile']={team:'federation',name:'Mobile'};mp.leaders.federation='mobile';mp.held.add('federation/1');mp.data.turn={active:'federation'};
   mp.data['team/spacenoid']={roster:[1,2,3,4].map(uid=>({uid,id:'ground-squad-spa'}))};
   ffChallenge();
  });
  await page.screenshot({path:'tests/screenshots/mobile-challenge-'+viewport.width+'.png'});
  await page.locator('.ffsq.spa').first().tap();assert.equal(await page.locator('.ffsq.spa.on').count(),1);
  await page.locator('.ffsq.fed').nth(3).tap();assert.equal(await page.locator('.ffsq.fed.on').count(),2);
  await page.locator('#ffPair0').selectOption('1');
  assert.equal(await page.locator('#ffGoBtn').isVisible(),true);
  const sizes=await page.locator('#pickbox button,#pickbox select,#pickbox input').evaluateAll(ns=>ns.filter(n=>!n.disabled).map(n=>({w:n.getBoundingClientRect().width,h:n.getBoundingClientRect().height})));
  assert.ok(sizes.every(s=>s.w>=44&&s.h>=44),'challenge tap targets at least 44px');
  assert.ok(await page.locator('#picklist').evaluate(n=>n.clientHeight>=140),'squad list has useful viewport height');
  await page.locator('#pickCancel').tap();
  await page.evaluate(()=>{mp.code=null;mp.entered=false;renderRoster();show('s3');});await page.screenshot({path:'tests/screenshots/mobile-roster-'+viewport.width+'.png'});
  await page.evaluate(()=>show('s0'));await page.setViewportSize({width:viewport.height,height:viewport.width});await page.screenshot({path:'tests/screenshots/mobile-menu-'+viewport.height+'.png'});
  await page.setViewportSize(viewport);await page.evaluate(()=>{openSheet(1);mp.code='ABCDE';mp.entered=true;ffChallenge();});
  console.log(viewport.width,await page.locator('#pickbox').evaluate(box=>({box:box.getBoundingClientRect().toJSON(),small:[...box.querySelectorAll('button,select,input,[onclick]')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.height&&(r.width<44||r.height<44)}).map(e=>({text:e.textContent.slice(0,50),width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height})),scrollWidth:box.scrollWidth,clientWidth:box.clientWidth})));
  await page.close();
 }
 assert.deepEqual(errors,[]);console.log('PASS mobile repair flow; challenge geometry recorded');
}finally{await browser.close();await new Promise(r=>server.close(r));}
