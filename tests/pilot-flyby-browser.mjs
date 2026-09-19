import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {startTestServer} from './local-room.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
const {server,url}=await startTestServer(),browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH});
try{
 const p=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'no-preference',serviceWorkers:'block'}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(url);await p.locator('#moPilot').click();await p.waitForFunction(()=>Pilot.ready&&document.querySelector('#pilotScreen.on'));await p.waitForTimeout(1000);
 await p.evaluate(()=>document.documentElement.classList.remove('fx-lite'));
 const seek=async t=>p.locator('.pilot-flyby img').evaluateAll((imgs,t)=>imgs.forEach(i=>{const a=i.getAnimations()[0];a.pause();a.currentTime=t;}),t);
 for(const viewport of [{width:1440,height:900},{width:844,height:390},{width:390,height:844}]){
  await p.setViewportSize(viewport);
  await seek(1800);const before=await p.locator('.pilot-flyby-gundam').boundingBox();
  await p.screenshot({path:`tests/screenshots/pilot-cf135-gundam-${viewport.width}.png`});
  await seek(2900);const after=await p.locator('.pilot-flyby-gundam').boundingBox();assert.ok(after.y<before.y);assert.equal(await p.locator('.pilot-flyby-zakus').evaluate(i=>getComputedStyle(i).opacity),'1');
  await p.screenshot({path:`tests/screenshots/pilot-cf135-zakus-${viewport.width}.png`});
 }
 assert.deepEqual(await p.locator('.pilot-flyby img').evaluateAll(imgs=>imgs.map(i=>i.complete&&i.naturalWidth===1024)),[true,true]);
 assert.equal(await p.locator('.pilot-flyby').evaluate(i=>getComputedStyle(i).pointerEvents),'none');
 await seek(10000);assert.deepEqual(await p.locator('.pilot-flyby img').evaluateAll(imgs=>imgs.map(i=>getComputedStyle(i).opacity)),['0','0']);
 await p.emulateMedia({reducedMotion:'reduce'});assert.equal(await p.locator('.pilot-flyby').evaluate(i=>getComputedStyle(i).display),'none');
 await p.emulateMedia({reducedMotion:'no-preference'});await p.evaluate(()=>document.documentElement.classList.add('fx-lite'));assert.equal(await p.locator('.pilot-flyby').evaluate(i=>getComputedStyle(i).display),'none');
 assert.deepEqual(errors,[]);console.log('PASS upward fly-by, delayed Zaku chase, quiet interval, desktop/landscape/portrait, transparent asset loading, reduced motion and effects-lite; no browser errors');
}finally{await browser.close();await new Promise(r=>server.close(r));}
