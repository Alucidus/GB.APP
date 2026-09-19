import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {startTestServer} from './local-room.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
const {server,url}=await startTestServer(),browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH});
try{
 const p=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce',serviceWorkers:'block'});const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(url);await p.locator('#moPilot').click();await p.waitForFunction(()=>Pilot.ready);
 await p.locator('[data-pilot-tab="identity"]').click();await p.locator('#pilot-name').fill('Neutral Pilot');await p.locator('[data-choice="faction:neutral"]').click();await p.waitForFunction(()=>Pilot.ready);await p.locator('#pilotSave').click();await p.waitForFunction(()=>Pilot.ready);assert.match(await p.locator('#pilotOptions').innerText(),/Neutral/);
 await p.reload();await p.locator('#moPilot').click();await p.waitForFunction(()=>Pilot.ready);assert.equal(await p.locator('#pilotScreen').getAttribute('data-faction'),'neutral');assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('gb.pilot.v1')).faction),'neutral');
 await p.locator('[data-pilot-tab="appearance"]').click();await p.locator('[data-choice="body:male"]').click();await p.locator('[data-pilot-part="beard"]').click();await p.waitForFunction(()=>Pilot.ready);
 for(const v of [{width:1440,height:900},{width:390,height:844}]){await p.setViewportSize(v);await p.locator('[data-choice="beard:5"]').click();await p.waitForFunction(()=>Pilot.ready);await p.locator('[data-choice="beard:5"]').scrollIntoViewIfNeeded();assert.equal(await p.locator('[data-choice="beard:5"] img').evaluate(i=>getComputedStyle(i).objectFit),'contain');await p.screenshot({path:`tests/screenshots/pilot-cf132-beards-${v.width}.png`});}
 assert.deepEqual(errors,[]);console.log('PASS Neutral record/save/reload, uncropped beard thumbnails on desktop and phone, no browser errors');
}finally{await browser.close();await new Promise(r=>server.close(r));}
