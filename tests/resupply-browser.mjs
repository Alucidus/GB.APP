import assert from 'node:assert/strict';import {createRequire} from 'node:module';
import {startTestServer} from './local-room.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES?process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright':'playwright');
const {server,url}=await startTestServer(),browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH});let checks=0;const errors=[];
const eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;};
try{
 for(const viewport of [{width:1400,height:1000},{width:844,height:390}]){
  const page=await browser.newPage({viewport,serviceWorkers:'block',reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',r=>r.request().url().startsWith(url)?r.continue():r.abort());await page.goto(url);await page.waitForFunction(()=>typeof openSheet==='function');
  await page.evaluate(()=>{side='federation';locked=true;turn=freshTurn();turn.round=1;turn.phase='you';turn.started=true;
   const squad=unitById('ground-squad-fed'),car=unitById('ground-car-fed');roster=[{uid:1,id:squad.id,st:freshState(squad)},{uid:2,id:car.id,st:freshState(car)}];openSheet(1);
  });
  eq(await page.evaluate(()=>CUR.st.sq.qr.items),{fb:2,sm:2,gr:2},'new squad full 2/2/2');
  await page.evaluate(()=>{CUR.st.sq.tab='qr';draw();});
  eq(await page.locator('.qrr-t .pp i').count(),6,'six supply pips');
  await page.evaluate(()=>{qrItemUse('sm');qrItemUse('gr');qrSet('newSeg','engagement');});
  eq(await page.evaluate(()=>CUR.st.sq.qr.items),{fb:2,sm:1,gr:1},'new engagement never refills');
  await page.locator('.qrrefill').click();eq(await page.evaluate(()=>CUR.st.sq.qr.items),{fb:2,sm:2,gr:2},'offline manual refill retained');
  await page.evaluate(()=>{CUR.st.sq.qr.items={fb:0,sm:0,gr:0};openSheet(2);gvEmbark();});
  await page.locator('#picklist .row').click();
  eq(await page.evaluate(()=>roster[0].st.sq.qr.resupply.firstStart),null,'boarding does not start full cycle');
  assert.match(await page.locator('#resupplyStatus').textContent(),/Waiting/);checks++;
  await page.evaluate(()=>{turn.phase='enemy';startMyTurnCore();openSheet(2);});
  eq(await page.evaluate(()=>roster[0].st.sq.qr.items),{fb:0,sm:0,gr:0},'turn2 no refill');assert.match(await page.locator('#resupplyStatus').textContent(),/Resupplying/);checks++;
  await page.evaluate(()=>startMyTurnCore());eq(await page.evaluate(()=>turn.round),2,'duplicate own-turn processing ignored');
  await page.evaluate(()=>gvDisembark());await page.locator('#picklist .row').click();eq(await page.evaluate(()=>roster[0].st.sq.qr.resupply),undefined,'disembark clears service');
  await page.evaluate(()=>gvEmbark());await page.locator('#picklist .row').click();
  await page.evaluate(()=>{turn.phase='enemy';startMyTurnCore();});eq(await page.evaluate(()=>roster[0].st.sq.qr.items.sm),0,'reboard needs new full cycle');
  await page.evaluate(()=>{turn.phase='enemy';startMyTurnCore();openSheet(2);});eq(await page.evaluate(()=>roster[0].st.sq.qr.items),{fb:2,sm:2,gr:2},'full uninterrupted cycle completes');
  assert.match(await page.locator('#resupplyStatus').textContent(),/Resupplied/);checks++;
  if(process.env.EQUIPMENT_SCREENSHOT)await page.screenshot({path:process.env.EQUIPMENT_SCREENSHOT+'-resupply-'+viewport.width+'.png'});
  // A missing old inventory is unknown; do not manufacture fresh charges.
  eq(await page.evaluate(()=>{const r=roster[0];r.st.sq.qr={abRound:0};sqMigrate(unitById(r.id),r.st);return r.st.sq.qr.items;}),{fb:0,sm:0,gr:0});
  // Server-owned fields must update even while this device holds the sheet lock.
  const locked=await page.evaluate(()=>{const r=roster[0];mp.pid='testviewer';mp.data['player/testviewer']={team:'federation'};mp.held=new Set(['federation/1']);mp.base.units[1]='old';mp.seen={};mp.etags['unit/federation/1']='new';mp.data['unit/federation/1']={st:JSON.parse(JSON.stringify(r.st))};mp.data['unit/federation/1'].st.sq.qr.items={fb:1,sm:2,gr:0};mpApplyUnit(r);return r.st.sq.qr.items;});eq(locked,{fb:1,sm:2,gr:0},'held sheet accepts authoritative inventory');
  await page.close();
 }
 eq(errors,[],'no browser errors');console.log('PASS '+checks+' resupply browser assertions');
}finally{await browser.close();await new Promise(r=>server.close(r));}
