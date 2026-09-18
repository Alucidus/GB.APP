// Real Chromium clicks: first-turn equipment, repeat arm assignment, fire and stow.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {startTestServer} from './local-room.mjs';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES ? process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright' : 'playwright');
const {server,url}=await startTestServer();
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||undefined,args:['--no-sandbox','--disable-dev-shm-usage']});
let checks=0;
const errors=[];
try {
 for(const viewport of [{width:1400,height:1000},{width:844,height:390}]) {
  const page=await browser.newPage({viewport,serviceWorkers:'block',reducedMotion:'reduce'});
  await page.route('**/*',route=>route.request().url().startsWith(url)?route.continue():route.abort());
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);await page.waitForFunction(()=>typeof openSheet==='function');
  async function open(id,side) {await page.evaluate(({id,side:team})=>{
   side=team;locked=true;turn=freshTurn();const u=UNITS.find(u=>u.id===id);
   roster=[{uid:1,id:u.id,st:freshState(u)}];eqPending=null;closePicker();openSheet(1);
  },{id,side});}
  for(const side of ['federation','spacenoid']) {
   await open('rx-79-g-sw-slave-wraith-mobile-suit-gundam-side-story-missing-link-crossover',side);
   assert.equal(await page.evaluate(()=>turn.round),1);
   assert.equal(await page.evaluate(()=>CUR.st.eq.hands[1]),null);checks+=2;
   const initialHP=await page.evaluate(()=>JSON.stringify(hp));
   await page.locator('#equipBtn').click();
   await page.locator('.hp.eq-arm').first().click();
   assert.equal(await page.evaluate(()=>eqPending.key),'');checks++;
   assert.equal(await page.locator('#pick').evaluate(n=>n.classList.contains('on')),false);assert.ok(await page.locator('.eq-weapon').count()>0);checks+=2;
   await page.locator('.eq-weapon[title*="Beam Saber"]').click();
   assert.ok((await page.locator('.eq-prompt').innerText()).includes('1 AP to equip'));checks++;
   await page.locator('.hp.eq-arm[title="Equip in Right Arm"]').click();
   assert.equal(await page.locator('#pick').evaluate(n=>n.classList.contains('on')),false);
   const firstAP=await page.evaluate(()=>ap);checks++;
   assert.equal(await page.locator('#equipBtn').innerText(),'DONE');checks++;
   await page.locator('.eq-weapon[title*="Beam Saber"]').click();
   await page.locator('.hp.eq-arm[title="Equip in Left Arm"]').click();
   assert.equal(await page.evaluate(()=>ap),firstAP-1);
   assert.equal(await page.evaluate(()=>new Set(CUR.st.eq.hands).size),2);
   assert.equal(await page.evaluate(()=>MSE.combo(U,CUR.st).includes('Advantage')),true);checks+=3;
   assert.equal(await page.evaluate(()=>JSON.stringify(hp)),initialHP);checks++;
   await page.locator('#stowBtn').click();
   assert.equal(await page.locator('.eq-arm').count(),2);checks++;
   await page.locator('.hp.eq-arm[title="Stow from Right Arm"]').click();
   assert.equal(await page.evaluate(()=>CUR.st.eq.hands[0]),null);
   assert.ok(await page.evaluate(()=>CUR.st.eq.hands[1]));
   assert.equal(await page.evaluate(()=>ap),firstAP-1);
   assert.equal(await page.locator('.eq-limb-label').count(),0);checks+=4;
   await page.locator('#stowBtn').click();await page.locator('#stowBtn').click();
   assert.equal(await page.evaluate(()=>eqPending),null);checks++;
   // Equipped main gun fires through the finger-sized AP hit area on turn one.
   await open('rx-78-2-gundam',side);
   const before=await page.evaluate(()=>ap);
   const costs=await page.locator('.aptap').allTextContents();
   await page.locator('#equipBtn').click();
   assert.deepEqual(await page.locator('.aptap').allTextContents(),costs);checks++;
   await page.locator('.eq-weapon[title*="Hyper Bazooka"]').click();
   assert.equal(await page.evaluate(()=>ap),before);checks++;
   await page.locator('#equipBtn').click();
   await page.locator('.aphit[title="Equip first"]').click();
   assert.equal(await page.evaluate(()=>ap),before);assert.equal(await page.evaluate(()=>eqPending),null);checks+=2;
   await page.locator('#equipBtn').click();await page.locator('.eq-more').click();
   assert.ok(await page.locator('#pick .eq-card').count()>2);checks++;
   await page.locator('#pickCancel').click();
   assert.equal(await page.locator('.eq-weapon').count(),0);checks++;
   await page.locator('.aphit[title="Tap to fire — spends 2 AP"]').click();
   assert.equal(await page.evaluate(()=>ap),before-2);checks++;
   // Stowing never loses a forearm shield or spends AP.
   const shield=await page.evaluate(()=>JSON.stringify([CUR.st.eq.shields,sh]));
   await page.locator('#stowBtn').click();await page.locator('.hp.eq-arm').click();
   assert.equal(await page.evaluate(()=>ap),before-2);
   assert.equal(await page.evaluate(()=>JSON.stringify([CUR.st.eq.shields,sh])),shield);checks+=2;
  }
  if(process.env.EQUIPMENT_SCREENSHOT){await page.locator('#equipBtn').click();await page.locator('.eq-weapon[title*="Beam Saber"]').click();await page.screenshot({path:process.env.EQUIPMENT_SCREENSHOT+'-'+viewport.width+'.png'});}
  await page.close();
 }
 assert.deepEqual(errors,[]);checks++;
 console.log('PASS '+checks+' real-browser equipment assertions: both faction themes, desktop and phone landscape, first-turn fire, dual saber assignment, stow/cancel, shield/AP preservation, no page errors.');
} finally {await browser.close();await new Promise(r=>server.close(r));}
