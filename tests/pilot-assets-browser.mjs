import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {startTestServer} from './local-room.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
const {server,url}=await startTestServer(),browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH});
const errors=[];let checks=0;const gallery=[];
try{
 const page=await browser.newPage({viewport:{width:1440,height:900},serviceWorkers:'block',reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(e.message));await page.goto(url);await page.locator('#moPilot').click();await page.waitForFunction(()=>Pilot.ready);await page.waitForTimeout(650);
 const choose=async(key,value)=>{await page.locator(`[data-choice="${key}:${value}"]`).click();await page.waitForFunction(()=>Pilot.ready);};
 const part=async name=>{await page.locator(`[data-pilot-part="${name}"]`).click();await page.waitForFunction(()=>Pilot.ready);};
 // Inspect every supplied face, hairstyle and uniform; verify each changes the preview.
 for(const body of ['female','male']){
  await part('body');await choose('body',body);
  for(let face=0;face<4;face++){
   await part('body');await choose('face',face);
   const hashes=new Set();
   for(let hair=0;hair<3;hair++){
    await part('hair');await choose('hair',hair);
    for(let uniform=0;uniform<5;uniform++){
     await part('uniform');await choose('uniform',uniform);
     const data=await page.evaluate(()=>{const c=document.getElementById('pilotCanvas'),a=c.getContext('2d').getImageData(0,0,1254,1254).data;let alpha=0,hash=2166136261;for(let i=0;i<a.length;i+=4){if(a[i+3]>100)alpha++;hash=Math.imul(hash^a[i],16777619);hash=Math.imul(hash^a[i+1],16777619);hash=Math.imul(hash^a[i+2],16777619);}return {alpha,hash};});
     assert.ok(data.alpha>500000,body+' '+face+' '+hair+' '+uniform+' should have a complete portrait');assert.ok(!hashes.has(data.hash),'each hair/uniform combination must be distinct');hashes.add(data.hash);checks+=2;
     if(hair===face%3&&uniform===face%5)gallery.push({label:`${body} face ${face+1} / hair ${hair+1} / uniform ${uniform+1}`,src:await page.locator('#pilotCanvas').evaluate(c=>c.toDataURL())});
    }
   }
   await part('hair');await choose('hair',2);await choose('hairColor','original');await choose('browColor','original');await part('eyes');await choose('eyeColor','original');
   // Changing the iris colour must leave skin, eye whites and all other parts identical.
   await page.evaluate(()=>{window.pilotBefore=document.getElementById('pilotCanvas').getContext('2d').getImageData(0,0,1254,1254).data;});
   await choose('eyeColor','#4c91cd');
   const diff=await page.evaluate(()=>{const before=window.pilotBefore,after=document.getElementById('pilotCanvas').getContext('2d').getImageData(0,0,1254,1254).data;let changed=0;const escaped=[];for(let i=0;i<after.length;i+=4){if(before[i+3]<240||after[i+3]<240)continue;if(Math.max(Math.abs(before[i]-after[i]),Math.abs(before[i+1]-after[i+1]),Math.abs(before[i+2]-after[i+2]))<=2)continue;changed++;const x=(i/4)%1254,y=Math.floor(i/4/1254);if(!(y>=480&&y<=580&&((x>=440&&x<=545)||(x>=700&&x<=800)))){if(escaped.length<5)escaped.push({x,y});}}delete window.pilotBefore;return {changed,escaped};});
   assert.deepEqual(diff.escaped,[],'iris tint escaped its fitted mask: '+body+face);assert.ok(diff.changed>200,'iris colour should visibly change for '+body+face);checks+=2;
   await part('hair');await choose('hairColor','#e0be77');await choose('browColor','#b49760');await part('uniform');await choose('uniform',0);await choose('uniformColor','#a8444e');
   gallery.push({label:`${body} face ${face+1} / blond, blue, crimson`,src:await page.locator('#pilotCanvas').evaluate(c=>c.toDataURL())});
   await part('hair');await choose('hairColor','original');await choose('browColor','original');await part('eyes');await choose('eyeColor','original');await part('uniform');await choose('uniformColor','original');
  }
 }
 const g=await browser.newPage({viewport:{width:1600,height:1800}});await g.setContent('<body style="margin:0;background:#132737;color:white;font:16px sans-serif"><main style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px"></main></body>');await g.evaluate(items=>{for(const item of items){const el=document.createElement('div'),im=document.createElement('img'),label=document.createElement('p');im.src=item.src;im.style.width='100%';label.textContent=item.label;el.append(im,label);document.querySelector('main').append(el);}},gallery);await g.screenshot({path:'tests/screenshots/pilot-artwork-gallery.png',fullPage:true});
 assert.deepEqual(errors,[]);console.log('PASS',checks,'pilot asset checks: all 120 fitted combinations and isolated iris recolouring');
}finally{await browser.close();await new Promise(r=>server.close(r));}
