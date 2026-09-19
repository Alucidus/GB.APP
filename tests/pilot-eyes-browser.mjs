import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {startTestServer} from './local-room.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
const {server,url}=await startTestServer(),browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH});
try{
 const page=await browser.newPage({viewport:{width:1400,height:900},serviceWorkers:'block',reducedMotion:'reduce'});await page.goto(url);await page.locator('#moPilot').click();await page.waitForFunction(()=>Pilot.ready);
 const choose=async(k,v)=>{await page.locator(`[data-choice="${k}:${v}"]`).click();await page.waitForFunction(()=>Pilot.ready);};
 const part=async v=>{await page.locator(`[data-pilot-part="${v}"]`).click();await page.waitForFunction(()=>Pilot.ready);};
 const items=[];let checks=0;
 for(const body of ['female','male'])for(let face=0;face<4;face++){
  await part('body');await choose('body',body);await choose('face',face);await part('eyes');
  for(const color of ['original','#4c91cd']){
   await choose('eyeColor',color);
   if(color==='original')await page.evaluate(()=>window.irisOriginal=document.getElementById('pilotCanvas').getContext('2d').getImageData(0,0,1254,1254).data);
   else{
    const result=await page.evaluate(({body,face})=>{
     const original=window.irisOriginal,now=document.getElementById('pilotCanvas').getContext('2d').getImageData(0,0,1254,1254).data;
     const centers=body==='female'?[[[497,525],[755,526]],[[498,526],[758,525]],[[497,523],[755,523]],[[497,522],[757,522]]][face]:[[[507,548],[748,548]],[[507,538],[748,538]],[[507,545],[748,545]],[[509,546],[748,547]]][face];
     let pigment=0,leftBrown=0,neutral=0,changedNeutral=0,dark=0;const radius=body==='female'?22:18;
     for(const [cx,baseY] of centers)for(let y=baseY+(body==='female'?244:face===0?270:241)-radius;y<=baseY+(body==='female'?244:face===0?270:241)+radius;y++)for(let x=cx-radius;x<=cx+radius;x++){
      if((x-cx)**2+(y-baseY-(body==='female'?244:face===0?270:241))**2>radius**2)continue;const i=(y*1254+x)*4,r=original[i],g=original[i+1],b=original[i+2],l=.2126*r+.7152*g+.0722*b;
      if(r-b>6&&r-g>3&&l>4&&l<180){pigment++;if(l<25)dark++;if(now[i]>now[i+2])leftBrown++;}
      if(Math.max(r,g,b)<8||Math.min(r,g,b)>225){neutral++;if(Math.max(Math.abs(now[i]-r),Math.abs(now[i+1]-g),Math.abs(now[i+2]-b))>2)changedNeutral++;}
     }
     return {pigment,leftBrown,neutral,changedNeutral,dark};
    },{body,face});
    if(body==='male'&&face===0){const edges=await page.evaluate(()=>{const a=window.irisOriginal,b=document.getElementById('pilotCanvas').getContext('2d').getImageData(0,0,1254,1254).data;return [[770,815],[770,821],[483,815],[531,815]].map(([x,y])=>{const i=(y*1254+x)*4;return Math.max(...[0,1,2].map(k=>Math.abs(a[i+k]-b[i+k])));});});assert.ok(edges.every(v=>v<=2),'male face 1 tint must not alter the outer rim/sclera');checks++;}
    assert.equal(result.leftBrown,0,`${body} ${face}: original pigment remains ${JSON.stringify(result)}`);assert.equal(result.changedNeutral,0,'pupils and white highlights must remain unchanged');assert.ok(result.neutral>10);if(!(body==='male'&&face===0))assert.ok(result.pigment>150);checks+=4;
   }
   items.push({label:`${body} ${face+1} ${color}`,src:await page.evaluate(({body,face})=>{const c=document.createElement('canvas');c.width=440;c.height=140;c.getContext('2d').drawImage(document.getElementById('pilotCanvas'),405,430+(body==='female'?244:face===0?270:241),440,140,0,0,440,140);return c.toDataURL();},{body,face})});
  }
 }
 const g=await browser.newPage({viewport:{width:1400,height:2200}});await g.setContent('<body style="background:#273441;color:white;font:18px sans-serif"><main style="display:grid;grid-template-columns:1fr 1fr;gap:10px"></main></body>');await g.evaluate(items=>{for(const i of items){const d=document.createElement('div'),im=document.createElement('img'),p=document.createElement('p');im.src=i.src;im.style.width='100%';p.textContent=i.label;d.append(p,im);document.querySelector('main').append(d);}},items);await g.screenshot({path:'tests/screenshots/pilot-iris-review.png',fullPage:true});await g.locator('main > div').nth(5).screenshot({path:'tests/screenshots/pilot-iris-female3.png'});await g.locator('main > div').nth(7).screenshot({path:'tests/screenshots/pilot-iris-female4.png'});await g.locator('main > div').nth(9).screenshot({path:'tests/screenshots/pilot-iris-male1.png'});
 console.log('PASS',checks,'iris checks across all eight faces: dark pigment replaced; pupils and highlights preserved');
}finally{await browser.close();await new Promise(r=>server.close(r));}
