import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {startTestServer} from './local-room.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
const {server,url}=await startTestServer(),browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH});
let checks=0;const errors=[],same=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;};
try{
 for(const viewport of [{width:667,height:375},{width:844,height:390},{width:932,height:430},{width:1400,height:1000}]){
  const page=await browser.newPage({viewport,hasTouch:true,isMobile:viewport.width<1000,serviceWorkers:'block',reducedMotion:'reduce'});
  page.on('pageerror',e=>errors.push(e.message));page.on('dialog',async d=>{errors.push('Native dialog: '+d.message());await d.dismiss();});
  await page.route('**/*',r=>r.request().url().startsWith(url)?r.continue():r.abort());await page.goto(url);await page.waitForFunction(()=>typeof openSheet==='function');
  await page.evaluate(()=>{
   side='federation';locked=true;turn=freshTurn();turn.started=true;turn.phase='you';
   const u=unitById('rx-78-2-gundam');roster=[{uid:1,id:u.id,st:freshState(u)}];
   teams.spacenoid={roster:[5,8,7].map((n,j)=>{const st=freshState(u);st.hp.chest=0;st.sh[0]=n;return {uid:j+2,id:u.id,st};})};
   pickupField={seq:0,items:{},receipts:{}};eqPending=null;openSheet(1);
  });
  const hand=await page.evaluate(()=>CUR.st.eq.hands.slice());
  await page.locator('#stowBtn').tap();await page.locator('.eq-shield-stow[data-shield-index="0"] button').tap();
  same(await page.evaluate(()=>({mount:CUR.st.eq.shields[0],hp:sh[0],ap,hands:CUR.st.eq.hands})),{mount:null,hp:12,ap:4,hands:hand},'stow bubble preserves HP, AP and weapon');
  for(const n of [5,8,7]){
   await page.locator('#pickupBtn').tap();
   const item=page.locator('.pickup-item').filter({hasText:n+'/12 shield HP'});
   await item.locator('img').scrollIntoViewIfNeeded();await item.locator('img').evaluate(img=>img.decode());
   same(await item.locator('img').getAttribute('src'),'img/portraits/rx-78-2.webp');
   if(n===5)await page.screenshot({path:'tests/screenshots/pickup-portraits-cf124-'+viewport.width+'.png'});
   await item.locator('button').tap();
   await page.locator('#pickExtra button').tap();await page.locator('#pickCancel').tap();
  }
  same(await page.evaluate(()=>CUR.st.eq.shields),[null,'rightArm','leftArm',null],'two shields equip; third enters storage');
  same(await page.locator('[data-shield-arm="rightArm"] .num').innerText(),'R5/12');
  same(await page.locator('[data-shield-arm="leftArm"] .num').innerText(),'L8/12');
  await page.locator('#equipBtn').tap();same(await page.locator('.eq-more').textContent(),'INVENTORY');await page.locator('.eq-more').tap();
  assert.match(await page.locator('#pickT').innerText(),/^Inventory/i);checks++;
  await page.locator('.eq-card[data-shield-index="3"]').getByRole('button',{name:'Equip shield · 1 AP',exact:true}).tap();
  same(await page.locator('.hp.eq-arm').count(),0,'shield selection highlights HP bubbles, not arms');same(await page.locator('.eq-shield-equip button:enabled').count(),2);
  assert.match(await page.locator('.eq-hint').innerText(),/Tap an R\/L shield HP bubble/);checks++;
  assert.ok(await page.locator('.eq-prompt').evaluate(n=>n.scrollWidth<=n.clientWidth+1),'Inventory label fits equipment prompt');checks++;
  await page.screenshot({path:'tests/screenshots/shields-equip-cf125-'+viewport.width+'.png'});
  await page.locator('.eq-shield-equip[data-shield-arm="rightArm"] button').tap();same(await page.locator('#pickT').textContent(),'Swap equipped shield?');
  await page.locator('#pickCancel').tap();same(await page.evaluate(()=>CUR.st.eq.shields),[null,'rightArm','leftArm',null]);
  await page.locator('.eq-shield-equip[data-shield-arm="rightArm"] button').tap();await page.locator('#eqSwapConfirm').tap();
  same(await page.evaluate(()=>({mounts:CUR.st.eq.shields,ap,sh,hands:CUR.st.eq.hands})),{mounts:[null,null,'leftArm','rightArm'],ap:0,sh:[12,5,8,7],hands:hand});
  // The live bubble edits the selected physical shield, never the old native shield.
  await page.locator('[data-shield-arm="rightArm"] .num').tap();await page.locator('[data-shield-arm="rightArm"] .step').first().tap();
  same(await page.evaluate(()=>sh),[12,5,8,6]);
  await page.evaluate(()=>{lent=[{owner:'Phenex',label:'Armed Armor DE',cur:11,hp:18}];persist();draw();});
  const borrowed=page.locator('.num[title="Armed Armor DE on loan from Phenex"]');same(await borrowed.innerText(),'11/18');
  const rectangles=await page.locator('[data-shield-arm] .num,.num[title="Armed Armor DE on loan from Phenex"]').evaluateAll(ns=>ns.map(n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,w:r.width,h:r.height};}));
  for(let i=0;i<rectangles.length;i++){const a=rectangles[i];assert.ok(a.x>=0&&a.right<=viewport.width&&a.y>=0&&a.bottom<=viewport.height);checks++;for(let j=i+1;j<rectangles.length;j++){const b=rectangles[j];assert.ok(a.right<=b.x||b.right<=a.x||a.bottom<=b.y||b.bottom<=a.y,'shield and borrowed bubbles do not overlap');checks++;}}
  await page.screenshot({path:'tests/screenshots/shields-cf124-'+viewport.width+'.png'});
  await page.locator('#stowBtn').tap();await page.screenshot({path:'tests/screenshots/shields-stow-cf124-'+viewport.width+'.png'});
  await page.locator('.eq-shield-stow[data-shield-index="3"] button').tap();same(await page.evaluate(()=>({m:CUR.st.eq.shields[3],sh,ap,hands:CUR.st.eq.hands,lent:lent[0].cur})),{m:null,sh:[12,5,8,6],ap:0,hands:hand,lent:11});
  await page.evaluate(()=>save());await page.reload();await page.waitForFunction(()=>typeof openSheet==='function');await page.evaluate(()=>openSheet(1));
  same(await page.evaluate(()=>({mounts:CUR.st.eq.shields,sh,ap})),{mounts:[null,null,'leftArm',null],sh:[12,5,8,6],ap:0});
  // Shield-only stowing still works after both weapons are put away.
  await page.evaluate(()=>{MSE.stow(U,eqLive(),'rightArm');persist();draw();});
  await page.locator('#stowBtn').tap();await page.locator('.eq-shield-stow[data-shield-index="2"] button').tap();same(await page.evaluate(()=>CUR.st.eq.shields.every(m=>!m)),true);
  // Empty shield slots are equip targets; a lost arm is not. Hand controls cannot equip shields or deal damage during selection.
  await page.evaluate(()=>{ap=2;hp.rightArm=0;persist();draw();});
  await page.locator('#equipBtn').tap();await page.locator('.eq-more').tap();await page.locator('.eq-card[data-shield-index="3"]').getByRole('button',{name:'Equip shield · 1 AP',exact:true}).tap();
  same(await page.locator('.eq-shield-equip[data-shield-arm="rightArm"] button').isDisabled(),true);same(await page.locator('.eq-shield-equip[data-shield-arm="leftArm"] button').innerText(),'L—');
  same(await page.locator('.eq-limb-label.eq-left').isDisabled(),true);
  const selectedState=await page.evaluate(()=>JSON.stringify([hp,ap,CUR.st.eq]));await page.locator('.hp[title="Left Arm"]').dispatchEvent('click');same(await page.evaluate(()=>JSON.stringify([hp,ap,CUR.st.eq])),selectedState);
  await page.locator('.eq-shield-equip[data-shield-arm="leftArm"] button').tap();same(await page.evaluate(()=>({mount:CUR.st.eq.shields[3],hp:sh[3],ap})),{mount:'leftArm',hp:6,ap:1});same(await page.locator('#pick').evaluate(n=>n.classList.contains('on')),false,'empty shield slot requires no swap warning');
  // Native ring systems, beam generators and shieldless suits keep separate slots.
  for(const id of ['f91-gundam-f91','unicorn-gundam-03-phenex-rx-0-n','kshatriya-nz-666','unicorn-gundam-luminous-crystal-body','asw-g-xx-gundam-vidar']){
   await page.evaluate(id=>{
    closePicker();eqPending=null;const u=unitById(id),source=unitById('rx-78-2-gundam');roster=[{uid:1,id,st:freshState(u)}];
    const s=roster[0].st;MSE.init(u,s);for(let i=0;i<s.eq.shields.length;i++)MSE.stowShield(u,s,i);
    teams.spacenoid={roster:[2,3].map(uid=>{const st=freshState(source);st.hp.chest=0;st.sh[0]=uid+2;return {uid,id:source.id,st};})};
    pickupField={items:{},seq:0,receipts:{}};GBPickups.scan(pickupField,pickupRows(),UNITS);
    Object.values(pickupField.items).filter(v=>v.kind==='shield').forEach(v=>{const why=GBPickups.claim(pickupField,pickupRows(),UNITS,side,1,v.id);if(why)throw Error(why);});
    openSheet(1);
   },id);
   same(await page.locator('[data-shield-arm="rightArm"] .num').innerText(),'R4/12',id+' right HP');
   same(await page.locator('[data-shield-arm="leftArm"] .num').innerText(),'L5/12',id+' left HP');
   if(viewport.width===667)await page.screenshot({path:'tests/screenshots/shields-cf124-'+id+'.png'});
   await page.locator('#stowBtn').tap();await page.locator('.eq-shield-stow[data-shield-arm="leftArm"] button').tap();
   same(await page.evaluate(()=>MSE.shieldAt(U,eqLive(),'leftArm')),-1,id+' captured shield stows');
  }
  await page.close();
 }
 same(errors,[]);console.log('PASS '+checks+' shield browser assertions: native/captured stow bubbles, two mounts, swap/cancel, HP isolation, third borrowed shield, phone geometry and persistence');
}finally{await browser.close();await new Promise(r=>server.close(r));}
