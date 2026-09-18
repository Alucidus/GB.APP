import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import fs from 'node:fs';
import {startTestServer} from './local-room.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
const {server,url}=await startTestServer(),browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH});
const errors=[];fs.mkdirSync('tests/screenshots',{recursive:true});
try{
 for(const {width,height,touch} of [{width:720,height:310,touch:false},{width:600,height:280,touch:false},{width:667,height:375,touch:true},{width:844,height:390,touch:true}]){
  const page=await browser.newPage({viewport:{width,height},hasTouch:touch,isMobile:touch,serviceWorkers:'block',reducedMotion:'reduce'});
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',r=>r.request().url().startsWith(url)?r.continue():r.abort());
  await page.goto(url);await page.waitForFunction(()=>typeof openSheet==='function');
  await page.evaluate(()=>{
   side='federation';locked=true;turn=freshTurn();turn.round=1;turn.phase='you';turn.started=true;
   const u=unitById('ground-squad-fed');roster=[1,2,3,4].map(uid=>({uid,id:u.id,st:freshState(u)}));openSheet(1);
   mp.pid='layout';mp.code='ABCDE';mp.entered=true;mp.data.settings={phase:'battle'};mp.data['player/layout']={team:'federation',name:'Layout'};mp.leaders.federation='layout';mp.held.add('federation/1');mp.data.turn={active:'federation'};
   mp.data['team/spacenoid']={roster:[1,2,3,4].map(uid=>({uid,id:'ground-squad-spa'}))};draw();
  });
  const press=async locator=>touch?locator.tap():locator.click();
  let tabBounds;
  for(const [i,name] of ['overmap','soldiers','qr'].entries()){
   await press(page.locator('.sqtab').nth(i));
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   const bounds=await page.locator('.sqtabs').evaluate(n=>n.getBoundingClientRect().toJSON());
   await page.screenshot({path:`tests/screenshots/infantry-cf124-${name}-${width}.png`});
   assert.ok(bounds.width>=width*.9,'tabs span available width');
   if(tabBounds)assert.ok(Math.abs(bounds.y-tabBounds.y)<4&&Math.abs(bounds.width-tabBounds.width)<1,'consistent tab placement');
   tabBounds=bounds;
   const buttons=await page.locator('.sqtab').evaluateAll(ns=>ns.map(n=>n.getBoundingClientRect().toJSON()));
   assert.ok(buttons.every(r=>r.height>=16&&r.height<=32&&r.y>=0&&r.right<=width),'wide, slim tabs fit without taking soldier space');
   await page.screenshot({path:`tests/screenshots/infantry-cf124-${name}-${width}.png`});
   if(name==='overmap'){
    const before=await page.evaluate(()=>CUR.st.ap);await press(page.locator('.sqmove'));
    assert.equal(await page.evaluate(()=>CUR.st.ap),before-1,'Overmap Move spends AP');
    await press(page.locator('.squndo'));assert.equal(await page.evaluate(()=>CUR.st.ap),before,'Overmap undo stays accessible');
   }
   if(name==='soldiers'){
    assert.equal(await page.locator('.sq-soldiers .sq-content').count(),0,'soldiers keep their original full-page scaling');
    const sheetBottom=await page.locator('#sheet').evaluate(n=>n.getBoundingClientRect().bottom);
    const cardBottom=await page.locator('.sq3').evaluateAll(ns=>Math.max(...ns.map(n=>n.getBoundingClientRect().bottom)));
    assert.ok(cardBottom<=sheetBottom,'entire soldier cards fit on the sheet');
    assert.ok(await page.locator('.sq3b,.sq3-swap').evaluateAll(ns=>ns.every(n=>{const r=n.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return hit&&n.contains(hit)})),'all soldier action centers remain unobstructed');
    const before=await page.evaluate(()=>CUR.st.sq.soldiers[0].ap);await press(page.locator('.sq3b.move').first());
    assert.equal(await page.evaluate(()=>CUR.st.sq.soldiers[0].ap),before-1,'individual Move remains accessible');
    await press(page.locator('.sq3pg').nth(1));
    await page.screenshot({path:`tests/screenshots/infantry-cf124-specialists-${width}.png`});
   }
  }
  await press(page.getByRole('button',{name:/challenge an enemy squad/i}));
  await page.screenshot({path:`tests/screenshots/infantry-cf124-challenge-${width}.png`});
  assert.ok(await page.locator('#picklist').evaluate(n=>n.clientHeight>=120),'challenge leaves visible squad space');
  assert.ok(await page.locator('.ffsq').first().evaluate(n=>{const r=n.getBoundingClientRect(),list=document.querySelector('#picklist').getBoundingClientRect();return r.top>=list.top&&r.bottom<=list.bottom}),'first squad visible on opening');
  await press(page.locator('.ffsq.spa').nth(3));await press(page.locator('.ffsq.fed').nth(3));
  assert.equal(await page.locator('.ffsq.spa.on').count(),1);assert.equal(await page.locator('.ffsq.fed.on').count(),2);
  await page.locator('#ffPair0').selectOption('4');
  const footer=await page.locator('#ffGoBtn').boundingBox(),cancel=await page.locator('#pickCancel').boundingBox();
  assert.ok(footer.height>=44&&footer.y+footer.height<=height&&Math.abs(footer.y-cancel.y)<1,'one-row footer fits viewport');
  assert.ok(await page.locator('#pickbox').evaluate(n=>n.scrollWidth<=n.clientWidth+2),'challenge has no horizontal overflow beyond its decorative border');
  await press(page.locator('#pickCancel'));await page.close();
  console.log(`PASS infantry tabs, movement and challenge at ${width}x${height} (${touch?'touch':'mouse'})`);
 }
 assert.deepEqual(errors,[]);
}finally{await browser.close();await new Promise(r=>server.close(r));}
