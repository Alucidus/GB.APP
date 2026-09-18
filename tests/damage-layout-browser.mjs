import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {startTestServer} from './local-room.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
const {server,url}=await startTestServer(),browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH});
const errors=[];let checks=0;
try{
 for(const {width,height,touch} of [{width:667,height:375,touch:true},{width:844,height:390,touch:true},{width:720,height:310,touch:false},{width:1400,height:900,touch:false}]){
  const page=await browser.newPage({viewport:{width,height},hasTouch:touch,isMobile:touch,serviceWorkers:'block'});page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',r=>r.request().url().startsWith(url)?r.continue():r.abort());await page.goto(url);await page.waitForFunction(()=>typeof openSheet==='function');
  for(const test of [
   {id:'rx-78-2-gundam',hit:'.hp[title="Chest"]',geometry:'#sheet .txtL,#sheet .aptap,#sheet .fmech'},
   {id:'rewloola-class-battleship',hit:'.hp.shp.big',geometry:'#sheet .sw-name,#sheet .sw-ap,#sheet .sname'},
   {id:'ground-tank-fed',hit:'.hp.shp.big',geometry:'#sheet .sw-name,#sheet .sw-ap,#sheet .sname'},
   {id:'ground-squad-fed',hit:'.sq4-adj .m',geometry:'#sheet .sq3-art>img,#sheet .sq3-btns,#sheet .sq3pg,#sheet .sqtab'}
  ]){
  await page.evaluate(test=>{
   side='federation';locked=true;turn=freshTurn();turn.round=1;turn.started=true;turn.phase='you';mode='damage';amount=1;
   const u=unitById(test.id);roster=[{uid:1,id:u.id,st:freshState(u)}];openSheet(1);if(isSquad(u)){sqTab('soldiers');sqSel(0,'hp');}
   window.damageGeometry=()=>[...document.querySelectorAll(test.geometry)].map(n=>{const r=n.getBoundingClientRect();return [n.textContent,r.x,r.y,r.width,r.height]});
   window.damageHP=()=>isSquad(U)?CUR.st.sq.soldiers[0].hp:isShip(U)?CUR.st.hp.hull:isGround(U)?CUR.st.hp.hp:CUR.st.hp.chest;
  },test);
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  // Start from an existing timeline entry, so a first-entry height change is not mistaken for the redraw jump.
  await page.locator(test.hit).click();
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  for(let tap=0;tap<3;tap++){
   await page.evaluate(()=>{
    window.damageBefore=damageGeometry();window.damageFrames=[];
    document.addEventListener('click',()=>{
     damageFrames.push(damageGeometry());
     let remaining=5;const sample=()=>{damageFrames.push(damageGeometry());if(--remaining)requestAnimationFrame(sample);else window.damageComplete=true;};
     window.damageComplete=false;requestAnimationFrame(sample);
    },{once:true});
   });
   const hp=await page.evaluate(()=>damageHP()),button=page.locator(test.hit);if(touch)await button.tap();else await button.click();
   await page.waitForFunction(()=>window.damageComplete);
   const {before,frames}=await page.evaluate(()=>({before:damageBefore,frames:damageFrames}));
   for(const frame of frames){
    assert.equal(frame.length,before.length,'damage keeps table controls');
    for(let i=0;i<frame.length;i++){
     assert.equal(frame[i][0],before[i][0]);
     for(let k=1;k<5;k++)assert.ok(Math.abs(frame[i][k]-before[i][k])<1,`${test.id} at ${width}px: ${frame[i][0]} jumped at geometry ${k}: ${before[i][k]} → ${frame[i][k]}`);
    }
   }
   assert.equal(await page.evaluate(()=>damageHP()),hp-1,'tap applies damage once');checks++;
  }
  // Layout must still update when the viewport really changes.
  await page.setViewportSize({width:width+80,height});await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  assert.ok(await page.locator(test.geometry).first().evaluate(n=>n.getBoundingClientRect().left>=0),'resize preserves usable table position');checks++;
  await page.screenshot({path:`tests/screenshots/damage-stable-cf125-${test.id}-${width}.png`});
  await page.setViewportSize({width,height});
  }
  await page.close();
 }
 assert.deepEqual(errors,[]);console.log(`PASS ${checks} repeated damage and real-resize scenarios; table/model geometry checked immediately after each click and for five painted frames`);
}finally{await browser.close();await new Promise(r=>server.close(r));}
