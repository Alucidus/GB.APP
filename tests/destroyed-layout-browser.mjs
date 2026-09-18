import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {startTestServer} from './local-room.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
const {server,url}=await startTestServer(),browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH});
const errors=[];let checks=0;
try{
 for(const viewport of [{width:667,height:375},{width:844,height:390},{width:932,height:430},{width:1400,height:800}]){
  const page=await browser.newPage({viewport,hasTouch:true,isMobile:viewport.width<1000,serviceWorkers:'block',reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',r=>r.request().url().startsWith(url)?r.continue():r.abort());await page.goto(url);await page.waitForFunction(()=>typeof openSheet==='function');
  for(const headKill of [false,true]){
   await page.evaluate(headKill=>{
    side='federation';locked=true;turn=freshTurn();turn.started=true;turn.round=1;mode='damage';amount=999;
    const u=headKill?UNITS.find(u=>u.kill==='head'):unitById('rx-78-2-gundam');roster=[{uid:1,id:u.id,st:freshState(u)}];openSheet(1);
   },headKill);
   await page.locator('.hp[title="'+(headKill?'Head':'Chest')+'"]').tap();
   assert.equal(await page.locator('#dead').isVisible(),true);
   const geometry=await page.evaluate(()=>{
    const overlay=$('dead').getBoundingClientRect(),frame=document.querySelector('#frame .fgrid').getBoundingClientRect(),label=$('dead').firstElementChild.getBoundingClientRect(),sheet=$('sheet').getBoundingClientRect();
    return {overlay:overlay.toJSON(),frame:frame.toJSON(),label:label.toJSON(),sheet:sheet.toJSON()};
   });
   assert.ok(Math.abs(geometry.overlay.left-geometry.frame.left)<2&&Math.abs(geometry.overlay.right-geometry.frame.right)<2,'destroyed overlay covers the full widened frame');
   assert.ok(Math.abs(geometry.overlay.height-geometry.sheet.height)<1,'overlay keeps sheet height');
   assert.ok(geometry.label.left>=geometry.overlay.left&&geometry.label.right<=geometry.overlay.right&&geometry.label.top>=geometry.overlay.top&&geometry.label.bottom<=geometry.overlay.bottom,'death message fits within overlay');
   assert.equal(await page.evaluate(()=>{
    const overlay=$('dead');overlay.style.pointerEvents='auto';
    try{return [...document.querySelectorAll('.eq-limb-label,#helpBtn,#tablesBtn,#stanceBtn,#equipBtn,#stowBtn,#doneBtn,#rosterBtn,#rulesBtn,#pickupBtn,.qa')].every(n=>{const r=n.getBoundingClientRect();return !r.width||!r.height||document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest('#dead')===overlay;});}
    finally{overlay.style.pointerEvents='';}
   }),true,'destroyed overlay paints above both hand labels, help and all bottom actions');checks++;
   await page.screenshot({path:`tests/screenshots/destroyed-cf125-${headKill?'head':'chest'}-${viewport.width}.png`});checks++;
   await page.evaluate(()=>{hp[U.kill||'chest']=1;draw();});assert.equal(await page.locator('#dead').isVisible(),false,'manual correction removes overlay');checks++;
  }
  await page.close();
 }
 assert.deepEqual(errors,[]);console.log(`PASS ${checks} destroyed-overlay checks across four screen sizes and both mobile-suit kill locations`);
}finally{await browser.close();await new Promise(r=>server.close(r));}
