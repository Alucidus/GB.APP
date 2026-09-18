// Catalogue-wide sheet smoke and real controls for integrated/remote/field systems.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {startTestServer} from './local-room.mjs';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES?process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright':'playwright');
const {server,url}=await startTestServer();
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||undefined});
let checks=0;const errors=[];
try{
 for(const viewport of [{width:1400,height:1000},{width:844,height:390}]){
  const page=await browser.newPage({viewport,serviceWorkers:'block',reducedMotion:'reduce'});
  await page.route('**/*',r=>r.request().url().startsWith(url)?r.continue():r.abort());
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);await page.waitForFunction(()=>typeof openSheet==='function');
  async function open(id,team='federation'){
   await page.evaluate(({id,team})=>{side=team;locked=true;turn=freshTurn();const u=UNITS.find(x=>x.id===id);const ally=UNITS.find(x=>x.id==='rx-78-2-gundam');roster=[{uid:1,id,st:freshState(u)},{uid:2,id:ally.id,st:freshState(ally)}];eqPending=null;closePicker();openSheet(1);},{id,team});
  }
  const ids=await page.evaluate(()=>UNITS.filter(u=>!u.type).map(u=>u.id));
  for(const id of ids){await open(id);assert.equal(await page.evaluate(()=>!!CUR&&CUR.id===U.id),true);checks++;}
  for(const team of ['federation','spacenoid']){
   await open('unicorn-gundam-03-phenex-rx-0-n',team);
   assert.equal(await page.evaluate(()=>CUR.st.eq.hands.every(x=>x===null)),true);
   assert.equal(await page.locator('.sendbtn').count(),2);checks+=2;
   await page.locator('.aphit[title="Tap to fire — spends 2 AP"]').click();
   assert.equal(await page.evaluate(()=>ap),2);checks++;
   await page.locator('.sendbtn').first().click();await page.locator('#picklist .pkrow').click();
   await page.locator('.sendbtn').click();await page.locator('#picklist .pkrow').click();
   assert.equal(await page.evaluate(()=>ap),0);
   assert.equal(await page.evaluate(()=>out.every(x=>x===2)),true);
   assert.equal(await page.evaluate(()=>MSE.reason(U,eqLive(),U.weapons[0])), '');checks+=3;
   await page.evaluate(()=>{ap=4;roster[1].st.lent[0].cur=9;draw();});
   await page.locator('.num[title*="tap to recall"]').first().click();
   assert.equal(await page.evaluate(()=>ap),3);assert.equal(await page.evaluate(()=>sh[0]),9);checks+=2;
   // Sabers still equip independently without affecting remote DE equipment.
   await page.locator('#equipBtn').click();await page.locator('.eq-weapon[title*="Beam Saber"]').click();
   await page.locator('.hp.eq-arm[title="Equip in Right Arm"]').click();
   assert.equal(await page.evaluate(()=>ap),2);assert.equal(await page.evaluate(()=>sh[0]),9);checks+=2;
   await page.locator('#equipBtn').click();
   await open('unicorn-gundam-luminous-crystal-body',team);
   assert.equal(await page.evaluate(()=>MSE.shieldReady(U,eqLive())),false);
   assert.equal(await page.evaluate(()=>U.abilities.every(a=>!MSE.abilityReason(U,eqLive(),a))),true);checks+=2;
   await page.locator('#sheet [data-act="0"]').first().click();
   assert.equal(await page.evaluate(()=>track[0].on),true);
   assert.equal(await page.evaluate(()=>ap),5);
   assert.equal(await page.evaluate(()=>track[0].ch),2);
   assert.equal(await page.evaluate(()=>MSE.shieldReady(U,eqLive())),true);checks+=4;
   await page.evaluate(()=>{hp.leftArm=0;sh[0]=7;draw();});
   assert.equal(await page.evaluate(()=>MSE.shieldReady(U,eqLive())),true);
   assert.equal(await page.locator('.lenttag').filter({hasText:'UNAVAILABLE'}).count(),0);
   await page.evaluate(()=>{persist();openSheet(1);});
   assert.equal(await page.evaluate(()=>sh[0]),7);assert.equal(await page.evaluate(()=>track[0].ch),2);checks+=4;
   if(process.env.EQUIPMENT_SCREENSHOT)await page.screenshot({path:process.env.EQUIPMENT_SCREENSHOT+'-'+team+'-luminous-'+viewport.width+'.png'});
   await page.evaluate(()=>{track[0].on=false;draw();});assert.equal(await page.evaluate(()=>MSE.shieldReady(U,eqLive())),false);checks++;
  }
  await page.close();
 }
 assert.deepEqual(errors,[]);checks++;
 console.log('PASS '+checks+' special-case browser checks: all 50 suit sheets, Phenex DE fire/send/recall/saber, Luminous activation/field/arm loss/reopen, both themes and viewports.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
