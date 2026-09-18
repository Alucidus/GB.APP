import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {startTestServer} from './local-room.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
const {server,url}=await startTestServer(),browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH});
let checks=0;const errors=[],same=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;};
try{
 for(const viewport of [{width:667,height:375},{width:844,height:390},{width:390,height:844},{width:1400,height:1000}]){
  const page=await browser.newPage({viewport,hasTouch:true,isMobile:viewport.width<1000,serviceWorkers:'block',reducedMotion:'reduce'});
  page.on('pageerror',e=>errors.push(e.message));page.on('dialog',async d=>{errors.push('Native dialog: '+d.message());await d.dismiss();});
  await page.route('**/*',r=>r.request().url().startsWith(url)?r.continue():r.abort());await page.goto(url);await page.waitForFunction(()=>typeof tryConfirm==='function');
  for(const team of ['federation','spacenoid']){
   await page.evaluate(team=>{
    side=team;locked=false;turn=freshTurn();budget=10000;const suffix=side==='federation'?'fed':'spa';
    roster=['car','heli','transport','squad','squad','squad','squad'].map((kind,i)=>{const u=unitById('ground-'+kind+'-'+suffix);return {uid:i+1,id:u.id,st:freshState(u)};});
    show('s3');renderRoster();tryConfirm();
   },team);
   same(await page.locator('[data-load-squad]').count(),4);same(await page.locator('.vload .assign-target').count(),0);
   const empty=await page.evaluate(()=>JSON.stringify(vloadPlan));
   await page.locator('[data-load-squad="4"]').tap();same(await page.evaluate(()=>JSON.stringify(vloadPlan)),empty,'selection does not move the squad');
   same(await page.locator('[data-load-squad="4"]').getAttribute('aria-pressed'),'true');same(await page.locator('.vload .assign-target').count(),4);
   await page.screenshot({path:'tests/screenshots/vehicle-loading-cf125-'+team+'-'+viewport.width+'.png'});
   same(await page.locator('.vload').evaluate(n=>n.scrollWidth<=n.clientWidth+1),true,'loading columns fit');
   same(await page.locator('.vload-choice').evaluateAll(ns=>ns.every(n=>n.getBoundingClientRect().height>=44)),true,'loading targets remain finger sized');
   await page.locator('[data-load-squad="4"]').tap();same(await page.locator('.vload .assign-target').count(),0,'second tap deselects without cycling');
   for(const [squad,dest] of [[4,1],[5,2],[6,3],[7,3]]){await page.locator('[data-load-squad="'+squad+'"]').tap();await page.locator('[data-load-destination="'+dest+'"]').tap();}
   same(await page.evaluate(()=>vloadPlan),{1:[4],2:[5],3:[6,7]},'capacities are one, one and two');
   same(await page.evaluate(()=>cargoVehicles().map(r=>gvCarry(r))),[[],[],[]],'draft stays separate until deployment');
   await page.locator('[data-load-squad="4"]').tap();same(await page.locator('[data-load-destination="2"]').isDisabled(),true);same(await page.locator('[data-load-destination="3"]').isDisabled(),true);
   await page.locator('[data-load-destination="board"]').tap();same(await page.evaluate(()=>vloadPlan[1]),[]);
   await page.locator('[data-load-squad="5"]').tap();await page.locator('[data-load-destination="1"]').tap();same(await page.evaluate(()=>vloadPlan),{1:[5],2:[],3:[6,7]},'transfer removes the previous destination');
   await page.locator('[data-load-squad="4"]').tap();await page.locator('.repair-selection button').tap();same(await page.evaluate(()=>vloadSelected),null);
   await page.locator('#pickCancel').tap();same(await page.evaluate(()=>locked),false);same(await page.evaluate(()=>cargoVehicles().map(r=>gvCarry(r))),[[],[],[]],'Back discards unapplied choices');
   await page.evaluate(()=>tryConfirm());same(await page.evaluate(()=>vloadPlan),{1:[],2:[],3:[]});
   await page.locator('[data-load-squad="4"]').tap();await page.locator('[data-load-destination="3"]').tap();await page.locator('#pickExtra button').tap();await page.waitForFunction(()=>locked);
   same(await page.evaluate(()=>cargoVehicles().map(r=>gvCarry(r))),[[],[],[4]]);same(await page.evaluate(()=>carrierState(4).ship.uid),3);
   // Reopening preserves confirmed destinations and a full vehicle cannot be overfilled.
   await page.evaluate(()=>openVehicleLoad(()=>{}));same(await page.evaluate(()=>vloadPlan[3]),[4]);await page.locator('[data-load-squad="5"]').tap();await page.locator('[data-load-destination="3"]').tap();
   await page.locator('[data-load-squad="6"]').tap();same(await page.locator('[data-load-destination="3"]').isDisabled(),true);same(await page.evaluate(()=>vloadPlan[3]),[4,5]);await page.locator('#pickCancel').tap();
  }
  await page.close();
 }
 same(errors,[]);console.log('PASS '+checks+' infantry vehicle-loading browser checks: select/highlight/destination, capacity, transfers, board, Back/confirm, saved destinations, both factions and phone layouts');
}finally{await browser.close();await new Promise(r=>server.close(r));}
