import assert from 'node:assert/strict';import {createRequire} from 'node:module';import {startTestServer} from './local-room.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
const {server,url}=await startTestServer(),browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH});let checks=0;const errors=[];
try{
 for(const viewport of [{width:667,height:375},{width:844,height:390},{width:932,height:430},{width:1400,height:1000}]){
  const page=await browser.newPage({viewport,hasTouch:true,isMobile:viewport.width<1000,serviceWorkers:'block',reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',r=>r.request().url().startsWith(url)?r.continue():r.abort());await page.goto(url);await page.waitForFunction(()=>typeof openSheet==='function');
  await page.evaluate(()=>{
   side='federation';locked=true;turn=freshTurn();turn.started=true;turn.phase='you';const ship=unitById('ra-cailum-class-battleship'),suit=unitById('rx-78-2-gundam');
   roster=[{uid:1,id:ship.id,st:freshState(ship)},...[2,3,4,5,6].map(uid=>{const st=freshState(suit);st.hp.chest=5;st.hp.head=0;st.sh[0]=4;return {uid,id:suit.id,st};})];
   roster[0].st.ship.carry=[2,3,4,5];roster[0].st.ship.docking=[{uid:6}];eqPending=null;openSheet(1);openRepairBay();
  });
  assert.equal(await page.locator('.repair-slot').count(),3);checks++;
  assert.deepEqual(await page.evaluate(()=>CUR.st.ship.repairSlots),[null,null,null]);checks++;
  for(const [slot,uid] of [[0,2],[1,3],[2,4]]){
   await page.locator('[data-repair-slot="'+slot+'"] .repair-slot-select').tap();
   await page.locator('.repair-candidate[data-repair-uid="'+uid+'"] button').tap();
  }
  assert.deepEqual(await page.evaluate(()=>CUR.st.ship.repairSlots),[2,3,4]);checks++;
  await page.locator('[data-repair-slot="0"] .repair-slot-select').tap();
  const first=page.locator('.repair-unit[data-repair-uid="2"]');await first.locator('img').evaluate(img=>img.decode());assert.equal(await first.locator('img').getAttribute('src'),'img/portraits/rx-78-2.webp');checks++;
  const text=await first.innerText();for(const expected of ['Chest','5/9','0/5 · destroyed','4/12','Next own turn: scheduled repair','Chest +4 HP (5 → 9)','Shield 1 +8 HP (4 → 12)','Destroyed locations stay at 0 HP: Head.']){assert.ok(text.includes(expected),expected);checks++;}
  assert.match(await page.locator('.repair-candidate[data-repair-uid="5"]').innerText(),/awaiting slot assignment/);checks++;
  assert.match(await page.locator('.repair-unit[data-repair-uid="6"]').innerText(),/docking completes; no repairs yet/);checks++;
  const before=await page.evaluate(()=>JSON.stringify(roster));await page.evaluate(()=>roster.slice(1).forEach(r=>repairUnitCard(r,2)));assert.equal(await page.evaluate(()=>JSON.stringify(roster)),before,'previews do not apply repairs');checks++;
  assert.equal(await first.evaluate(n=>n.scrollWidth<=n.clientWidth+1),true);checks++;
  await page.locator('.repair-slots').scrollIntoViewIfNeeded();await page.screenshot({path:'tests/screenshots/repair-bay-cf124-'+viewport.width+'.png'});
  await page.locator('.repair-candidate[data-repair-uid="5"] button').tap();await page.locator('#pickCancel').tap();assert.deepEqual(await page.evaluate(()=>CUR.st.ship.repairSlots),[2,3,4]);checks++;
  await page.evaluate(()=>openRepairBay());await page.locator('.repair-candidate[data-repair-uid="5"] button').tap();await page.locator('#pickExtra button').tap();assert.deepEqual(await page.evaluate(()=>CUR.st.ship.repairSlots),[5,3,4]);checks++;
  assert.equal(await page.evaluate(()=>roster.find(r=>r.uid===2).st.repair.live.since),null,'displaced unit restarts its cycle');checks++;
  await page.locator('[data-repair-slot="1"] .btn').tap();await page.locator('#pickExtra button').tap();assert.deepEqual(await page.evaluate(()=>CUR.st.ship.repairSlots),[5,null,4]);checks++;
  await page.evaluate(()=>{closePicker();roster[0].st.ship.carry=[];roster[0].st.ship.docking=[];roster[1].st.repair={owner:'local:federation',entry:'base-entry'};openSheet(2);openRepairBase();});
  const baseText=await page.locator('.repair-unit[data-repair-uid="2"]').innerText();assert.ok(baseText.includes('Chest +2 HP (5 → 7)'));assert.ok(baseText.includes('Shield 1 +5 HP (4 → 9)'));checks+=2;
  await page.evaluate(()=>{roster.find(r=>r.uid===3).st.repair={owner:'local:federation',entry:'second-base-entry'};openRepairBase();});
  assert.equal(await page.locator('.repair-base-bay .repair-slot').count(),1);checks++;
  await page.locator('.repair-base-bay .repair-candidate[data-repair-uid="3"] button').tap();await page.locator('#pickExtra button').tap();
  assert.equal(await page.evaluate(()=>roster.find(r=>r.uid===3).st.repair.live.status),'Repairing');assert.equal(await page.evaluate(()=>roster.find(r=>r.uid===2).st.repair.live.status),'Waiting');checks+=2;
  await page.locator('.repair-base-bay .repair-slot').scrollIntoViewIfNeeded();await page.screenshot({path:'tests/screenshots/base-slot-cf124-'+viewport.width+'.png'});
  await page.close();
 }
 assert.deepEqual(errors,[]);console.log('PASS '+checks+' repair bay browser checks: portraits, current HP, capped Tier 0/2 forecasts, destroyed limbs, waiting and docking timing, phone layouts');
}finally{await browser.close();await new Promise(r=>server.close(r));}
