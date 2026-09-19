import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {startTestServer} from './local-room.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
const {server,url}=await startTestServer(),browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH});
const errors=[];let checks=0;
try{
 for(const viewport of [{width:1440,height:900},{width:844,height:390},{width:667,height:375},{width:568,height:320},{width:390,height:844}]){
  const page=await browser.newPage({viewport,hasTouch:true,reducedMotion:'reduce',serviceWorkers:'block'});
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);await page.waitForFunction(()=>window.Pilot);
  assert.equal(await page.locator('#lbCont.off').count(),0);checks++;
  if(viewport.width>viewport.height&&viewport.height<=500){const rect=await page.locator('#lbCont').boundingBox();assert.ok(rect.y+rect.height<=viewport.height,'offline entry must stay visible on short screens');checks++;}
  await page.locator('#moPilot').click();await page.waitForFunction(()=>Pilot.ready);await page.waitForTimeout(700);
  assert.equal(await page.locator('#pilotBattle .fg').count(),0);checks++;
  assert.ok(await page.locator('#pilotBattle .nearFed').count());checks++;
  const geo=await page.evaluate(()=>{const ids=['pilotOptions','pilotCanvas','pilotSave','pilotBack'];return Object.fromEntries(ids.map(id=>[id,document.getElementById(id).getBoundingClientRect().toJSON()]));});
  for(const id of ['pilotSave','pilotBack']){assert.ok(geo[id].x>=0&&geo[id].right<=viewport.width&&geo[id].y>=0&&geo[id].bottom<=viewport.height);checks++;}
  assert.ok((viewport.width>viewport.height?geo.pilotOptions.right<=geo.pilotCanvas.x:geo.pilotCanvas.bottom<=geo.pilotOptions.y)&&geo.pilotOptions.height>100);checks++;
  await page.screenshot({path:`tests/screenshots/pilot-${viewport.width}-female.png`});
  await page.locator('[data-pilot-part="hair"]').click();await page.locator('[data-choice="hairColor:#e0be77"]').click();await page.waitForFunction(()=>Pilot.ready);
  await page.locator('[data-choice="browColor:#b49760"]').click();await page.waitForFunction(()=>Pilot.ready);
  await page.locator('[data-pilot-part="eyes"]').click();await page.locator('[data-choice="eyeColor:#4c91cd"]').click();await page.waitForFunction(()=>Pilot.ready);
  await page.locator('[data-pilot-part="uniform"]').click();await page.locator('[data-choice="uniformColor:#a8444e"]').click();await page.waitForFunction(()=>Pilot.ready);
  await page.locator('[data-pilot-tab="identity"]').click();
  await page.locator('#pilot-name').fill('Test Pilot');await page.locator('#pilot-callsign').fill('COMET');await page.locator('#pilot-background').fill('Independent pilot.');
  await page.locator('#pilotSave').click();await page.waitForFunction(()=>Pilot.ready);
  assert.match(await page.locator('#pilotStatus').innerText(),/saved/);checks++;
  assert.match(await page.locator('#pilotOptions').innerText(),/Rookie/);checks++;
  await page.screenshot({path:`tests/screenshots/pilot-${viewport.width}-record.png`});
  const saved=await page.evaluate(()=>localStorage.getItem('gb.pilot.v1'));await page.reload();await page.locator('#moPilot').click();await page.waitForFunction(()=>Pilot.ready);await page.waitForTimeout(700);
  assert.equal(await page.locator('#pilotName').innerText(),'Test Pilot');checks++;
  await page.locator('[data-pilot-tab="appearance"]').click();await page.locator('[data-pilot-part="body"]').click();await page.locator('[data-choice="body:male"]').click();await page.waitForFunction(()=>Pilot.ready);
  await page.screenshot({path:`tests/screenshots/pilot-${viewport.width}-male.png`});
  await page.locator('#pilotBack').click();assert.ok(await page.locator('#pilotDiscard').isVisible());checks++;
  await page.locator('#pilotKeep').click();assert.ok(await page.locator('#pilotScreen').isVisible());checks++;
  await page.locator('#pilotBack').click();await page.locator('#pilotLeave').click();assert.equal(await page.evaluate(()=>localStorage.getItem('gb.pilot.v1')),saved);checks++;
  await page.locator('#lbCont').click();await page.waitForFunction(()=>document.getElementById('s1').classList.contains('on'));checks++;
  await page.close();
 }
 assert.deepEqual(errors,[]);console.log('PASS',checks,'pilot browser checks');
}finally{await browser.close();await new Promise(r=>server.close(r));}
