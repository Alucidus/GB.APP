import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {startTestServer} from './local-room.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
const {server,url}=await startTestServer(),browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH});let checks=0;
try{
 const p=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce',serviceWorkers:'block'}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(url);await p.locator('#moPilot').click();await p.waitForFunction(()=>Pilot.ready);
 const choose=async(k,v)=>{await p.locator(`[data-choice="${k}:${v}"]`).click();await p.waitForFunction(()=>Pilot.ready);};
 const part=async(v)=>{await p.locator(`[data-pilot-part="${v}"]`).click();await p.waitForFunction(()=>Pilot.ready);};
 for(const body of ['female','male'])for(let face=0;face<4;face++){
  await part('body');await choose('body',body);await choose('face',face);await part('hair');
  assert.equal(await p.locator('[data-choice^="hair:"]').count(),body==='female'?9:12);checks++;
  const hashes=new Set();
  for(let n=0;n<(body==='female'?9:12);n++){
   await choose('hair',n);const data=await p.evaluate(()=>{const c=document.getElementById('pilotCanvas'),a=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let hash=2166136261,pixels=0;for(let i=0;i<a.length;i+=4){if(a[i+3])pixels++;hash=Math.imul(hash^a[i]^a[i+1]^a[i+2]^a[i+3],16777619);}return {hash,pixels,height:c.height};});
   assert.equal(data.height,1500);assert.ok(data.pixels>500000);assert.ok(!hashes.has(data.hash),'each hairstyle must visibly differ');hashes.add(data.hash);checks++;
  }
  if(body==='male'){
   await part('beard');assert.equal(await p.locator('[data-choice^="beard:"]').count(),6);checks++;
   const hashes=new Set();for(let n=0;n<6;n++){await choose('beard',n);const png=await p.locator('#pilotCanvas').evaluate(c=>c.toDataURL());assert.ok(!hashes.has(png));hashes.add(png);checks++;}
  }
 }
 // Instrument the actual compositor: selected beard must draw immediately before hairstyle.
 await p.evaluate(()=>{window.drawn=[];const proto=CanvasRenderingContext2D.prototype,old=proto.drawImage;proto.drawImage=function(...a){if(this.canvas.id==='pilotCanvas')window.drawn.push([a[1],a[2]]);return old.apply(this,a);};});
 await part('hair');await choose('hair',8);await p.evaluate(()=>window.drawn=[]);await part('beard');await choose('beard',4);
 const order=await p.evaluate(async()=>{const m=await fetch('img/pilots/layers.json').then(r=>r.json()),g=m._creator.groups['male-dark'];return {drawn:window.drawn.slice(-2),expected:[m['male-dark'][g.beards[3]].box.slice(0,2),m['male-dark'][g.hairs[8]].box.slice(0,2)]};});assert.deepEqual(order.drawn,order.expected);checks++;
 await part('hair');await p.screenshot({path:'tests/screenshots/pilot-studio-1440.png'});
 await p.locator('[data-pilot-tab="identity"]').click();await p.locator('#pilot-name').fill('Fitted Pilot');await p.locator('#pilotSave').click();await p.waitForFunction(()=>Pilot.ready);await p.reload();await p.locator('#moPilot').click();await p.waitForFunction(()=>Pilot.ready);
 const saved=await p.evaluate(()=>JSON.parse(localStorage.getItem('gb.pilot.v1')));assert.equal(saved.hair,8);assert.equal(saved.beard,4);checks+=2;
 await p.locator('[data-pilot-tab="appearance"]').click();await part('hair');
 for(const viewport of [{width:844,height:390},{width:568,height:320},{width:390,height:844}]){await p.setViewportSize(viewport);await p.screenshot({path:`tests/screenshots/pilot-studio-${viewport.width}.png`});assert.ok(await p.locator('[data-choice="hair:8"] img').evaluate(im=>im.complete&&im.naturalWidth>0));checks++;}
 assert.deepEqual(errors,[]);console.log('PASS',checks,'fitted creator checks: all faces/styles/beards, actual draw order, save/reload and mobile thumbnails');
}finally{await browser.close();await new Promise(r=>server.close(r));}
