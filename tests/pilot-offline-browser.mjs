import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {startTestServer} from './local-room.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
const {server,url}=await startTestServer(),browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH});let checks=0;
try{
 const context=await browser.newContext({viewport:{width:844,height:390},hasTouch:true}),page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url);await page.waitForFunction(()=>window.Pilot);await page.evaluate(()=>navigator.serviceWorker.ready);await page.waitForFunction(()=>navigator.serviceWorker.controller);
 const battle=await page.evaluate(()=>{side='federation';budget=1500;roster=[{uid:1,id:'rx-78-2-gundam',st:freshState(unitById('rx-78-2-gundam'))}];save();renderLanding();return localStorage.getItem(SAVE);});
 assert.match(await page.locator('#lbOfflineLabel').innerText(),/CONTINUE/);checks++;
 await page.waitForTimeout(1100);await page.screenshot({path:'tests/screenshots/pilot-menu-844.png'});
 await page.locator('#moPilot').tap();await page.waitForSelector('#clashFx');checks++;await page.waitForFunction(()=>Pilot.ready&&document.querySelector('#pilotScreen.on'));await page.waitForSelector('#clashFx',{state:'detached'});
 await page.locator('[data-pilot-tab="identity"]').tap();await page.locator('#pilot-name').fill('Offline Comet');await page.locator('#pilotSave').tap();await page.waitForFunction(()=>Pilot.ready);assert.match(await page.locator('#pilotStatus').innerText(),/saved/);checks++;
 assert.equal(await page.evaluate(()=>localStorage.getItem(SAVE)),battle,'pilot saving must not change battle saves');checks++;
 await context.setOffline(true);await page.reload();await page.locator('#moPilot').tap();await page.waitForFunction(()=>Pilot.ready);await page.waitForSelector('#clashFx',{state:'detached'});assert.equal(await page.locator('#pilotName').innerText(),'Offline Comet');checks++;
 await page.locator('[data-pilot-tab="appearance"]').tap();await page.locator('[data-choice="body:male"]').tap();await page.waitForFunction(()=>Pilot.ready);await page.locator('[data-choice="face:3"]').tap();await page.waitForFunction(()=>Pilot.ready);checks++;
 await page.locator('[data-pilot-part="uniform"]').tap();await page.locator('[data-choice="uniform:4"]').tap();await page.waitForFunction(()=>Pilot.ready);await page.locator('#pilotSave').tap();await page.waitForFunction(()=>Pilot.ready);checks++;
 await page.locator('#pilotBack').tap();await page.locator('#lbCont').tap();await page.waitForFunction(()=>document.querySelector('#s1.on'));await page.waitForTimeout(800);assert.ok(!await page.locator('#mbCont').evaluate(e=>e.classList.contains('off')));await page.locator('#mbCont').tap();await page.waitForFunction(()=>document.querySelector('#s3.on'));assert.equal(await page.evaluate(()=>roster[0].id),'rx-78-2-gundam');checks++;
 await context.setOffline(false);await page.evaluate(()=>show('s0'));await page.locator('#moOn').tap();await page.waitForFunction(()=>document.querySelector('#s5.on'));checks++;
 assert.deepEqual(errors,[]);console.log('PASS',checks,'pilot offline integration checks: real clash, cache, reload, unused assets offline, battle isolation and online/offline entry');
 await context.close();
}finally{await browser.close();await new Promise(r=>server.close(r));}
