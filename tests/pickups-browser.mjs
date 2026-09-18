import assert from 'node:assert/strict';import {createRequire} from 'node:module';import {startTestServer} from './local-room.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
const {server,url}=await startTestServer(),browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH});
const errors=[];let checks=0;
try{
 for(const viewport of [{width:667,height:375},{width:844,height:390},{width:932,height:430},{width:1400,height:1000}]){
  const page=await browser.newPage({viewport,isMobile:viewport.width<1000,hasTouch:true,serviceWorkers:'block',reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',r=>r.request().url().startsWith(url)?r.continue():r.abort());await page.goto(url);await page.waitForFunction(()=>typeof openSheet==='function');
  await page.evaluate(()=>{
   side='federation';locked=true;turn=freshTurn();turn.started=true;turn.phase='you';
   const u=UNITS.find(u=>u.id==='f91-gundam-f91'),enemy=UNITS.find(u=>u.id.includes('banshee'));
   roster=[{uid:1,id:u.id,st:freshState(u)}];roster[0].st.ap=10;
   teams.spacenoid={roster:[{uid:2,id:enemy.id,st:freshState(enemy)}]};teams.spacenoid.roster[0].st.hp.chest=0;
   pickupField={seq:0,items:{},receipts:{}};eqPending=null;openSheet(1);
  });
  const before=await page.evaluate(()=>({native:U.weapons.map(w=>[w.name,w.y]),ap,rect:document.querySelector('.fmech').getBoundingClientRect().toJSON()}));
  await page.locator('#pickupBtn').tap();
  const card=page.locator('.pickup-item').filter({has:page.locator('b',{hasText:'Beam Magnum'})}).first();await card.locator('button').tap();
  await page.locator('#pickCancel').tap();assert.equal(await page.evaluate(()=>ap),before.ap);checks++;
  await page.locator('#pickupBtn').tap();await card.locator('button').tap();await page.locator('#pickExtra button').tap();await page.locator('#pickCancel').tap();
  assert.equal(await page.evaluate(()=>ap),before.ap-1);checks++;
  assert.deepEqual(await page.evaluate(()=>U.weapons.filter(w=>!w.pickupId).map(w=>[w.name,w.y])),before.native);checks++;
  assert.equal(await page.evaluate(()=>CUR.st.eq.loot.length),1);checks++;
  await page.screenshot({path:'tests/screenshots/pickup-sheet-'+viewport.width+'.png'});
  const labels=await page.locator('.eq-limb-label').evaluateAll(ns=>ns.map(n=>{const r=n.getBoundingClientRect();return {w:r.width,h:r.height,x:r.x,right:r.right,y:r.y,bottom:r.bottom,hit:document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)===n};}));
  assert.ok(labels.every(r=>r.h>=28&&r.w>=28&&r.x>=0&&r.right<=innerWidthSafe(viewport)&&r.hit),'compact arm labels are visible and unobstructed');checks++;
  assert.ok(labels[0].right<labels[1].x,'arm labels do not overlap');checks++;
  await page.locator('.eq-limb-label.eq-left').tap();assert.match(await page.locator('#picklist').textContent(),/Beam Magnum/);checks++;
  assert.match(await page.locator('#picklist').textContent(),/9\/\+2SH/);checks++;
  await page.screenshot({path:'tests/screenshots/pickup-details-'+viewport.width+'.png'});
  const fire=page.getByRole('button',{name:'Fire · 2 AP',exact:true});await fire.tap();
  assert.equal(await page.evaluate(()=>ap),before.ap-3);assert.equal(await fire.isDisabled(),true);checks+=2;
  assert.match(await page.locator('#picklist').textContent(),/Cooldown: 2/);checks++;
  const geometry=await page.locator('#pickbox').evaluate(n=>({w:n.clientWidth,sw:n.scrollWidth,list:document.getElementById('picklist').clientHeight}));
  assert.ok(geometry.sw<=geometry.w+2&&geometry.list>=120,'readable scrolling detail panel without horizontal overflow');checks++;
  await page.locator('#pickCancel').tap();
  const after=await page.evaluate(()=>document.querySelector('.fmech').getBoundingClientRect().toJSON());assert.equal(after.width,before.rect.width);assert.equal(after.height,before.rect.height);checks+=2;
  await page.evaluate(()=>save());await page.reload();await page.waitForFunction(()=>typeof openSheet==='function');await page.evaluate(()=>openSheet(1));
  assert.equal(await page.evaluate(()=>CUR.st.eq.loot.length),1);assert.equal(await page.evaluate(()=>wpn[U.weapons.findIndex(w=>w.pickupId)]),2);checks+=2;
  // A physical enemy shield keeps its HP on a suit with native beam-shield regeneration.
  await page.evaluate(()=>{
   mp.code=null;mp.entered=false;side='federation';locked=true;turn=freshTurn();turn.started=true;
   const u=UNITS.find(u=>u.id==='f91-gundam-f91'),enemy=unitById('rx-78-2-gundam');roster=[{uid:1,id:u.id,st:freshState(u)}];roster[0].st.ap=8;
   const st=freshState(enemy);st.hp.chest=0;st.sh[0]=3;teams.spacenoid={roster:[{uid:2,id:enemy.id,st}]};pickupField={seq:0,items:{},receipts:{}};openSheet(1);
  });
  await page.locator('#pickupBtn').tap();const shieldCard=page.locator('.pickup-item').filter({hasText:'3/12 shield HP'});await shieldCard.locator('button').tap();await page.locator('#pickExtra button').tap();await page.locator('#pickCancel').tap();
  assert.equal(await page.evaluate(()=>sh.at(-1)),3);checks++;
  await page.locator('.eq-limb-label.eq-right').tap();await page.getByRole('button',{name:'−1 shield HP',exact:true}).tap();assert.equal(await page.evaluate(()=>sh.at(-1)),2);checks++;
  await page.getByRole('button',{name:'−1 shield HP',exact:true}).tap();await page.getByRole('button',{name:'−1 shield HP',exact:true}).tap();assert.equal(await page.evaluate(()=>shDown.at(-1)),0);checks++;
  await page.locator('#pickCancel').tap();
  await page.evaluate(()=>{turn.phase='enemy';startMyTurnCore();});assert.equal(await page.evaluate(()=>sh.at(-1)),0,'captured physical shield does not regenerate');checks++;
  await page.close();
 }
 assert.deepEqual(errors,[]);console.log('PASS '+checks+' pickup browser checks: full five-row list, actual taps, captured firing, save/reload and phone geometry');
}finally{await browser.close();await new Promise(r=>server.close(r));}
function innerWidthSafe(v){return v.width;}
