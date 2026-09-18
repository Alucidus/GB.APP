import assert from 'node:assert/strict';import {createRequire} from 'node:module';import {startTestServer} from './local-room.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
const {server,url}=await startTestServer(),browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH});
const errors=[];let checks=0;
try{
 for(const viewport of [{width:667,height:375},{width:844,height:390},{width:932,height:430},{width:1024,height:768},{width:1400,height:1000}]){
  const page=await browser.newPage({viewport,isMobile:viewport.width<1000,hasTouch:true,serviceWorkers:'block',reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',r=>r.request().url().startsWith(url)?r.continue():r.abort());await page.goto(url);await page.waitForFunction(()=>typeof openSheet==='function');
  for(const id of ['rx-78-2-gundam','unicorn-gundam-03-phenex-rx-0-n','kshatriya-nz-666']){
   await page.evaluate(id=>{side='federation';locked=true;turn=freshTurn();mode='damage';amount=1;const u=unitById(id);roster=[{uid:1,id,st:freshState(u)}];eqPending=null;openSheet(1);},id);
   for(const key of ['rightArm','leftArm','head','chest','rightLeg','leftLeg']){
    const label=await page.evaluate(key=>LIMB_LABEL[key],key),bubble=page.locator('.hp[title="'+label+'"]');
    const before=await page.evaluate(key=>hp[key],key);await bubble.tap();
    const bounds=await page.evaluate(key=>{
     const bubble=[...document.querySelectorAll('.hp')].find(n=>n.title===LIMB_LABEL[key]).getBoundingClientRect();
     const minus=document.querySelector('[data-hp-limb="'+key+'"][data-hp-adjust="minus"]').getBoundingClientRect(),plus=document.querySelector('[data-hp-limb="'+key+'"][data-hp-adjust="plus"]').getBoundingClientRect();
     return {left:bubble.left-minus.right,right:plus.left-bubble.right,dyMinus:(minus.top+minus.bottom-bubble.top-bubble.bottom)/2,dyPlus:(plus.top+plus.bottom-bubble.top-bubble.bottom)/2};
    },key);
    assert.ok(Math.abs(bounds.left-4)<1&&Math.abs(bounds.right-4)<1,`${id} ${key} at ${viewport.width}: controls must stay 4px from the HP bubble: ${JSON.stringify(bounds)}`);
    assert.ok(Math.abs(bounds.dyMinus)<1&&Math.abs(bounds.dyPlus)<1,'adjustments remain vertically centered');checks++;
    await page.locator('[data-hp-limb="'+key+'"][data-hp-adjust="plus"]').tap();assert.equal(await page.evaluate(key=>hp[key],key),before,'plus restores one HP');
    await page.locator('[data-hp-limb="'+key+'"][data-hp-adjust="minus"]').tap();assert.equal(await page.evaluate(key=>hp[key],key),before-1,'minus removes one HP');checks++;
    if(key==='rightArm')await page.screenshot({path:'tests/screenshots/hp-controls-cf127-'+id+'-'+viewport.width+'.png'});
   }
   // Shield, borrowed-shield, pod, AP and dodge steppers already share a flex group.
   const groups=await page.evaluate(()=>{
    active=null;lent=[{owner:'Phenex',label:'Borrowed shield',cur:8,hp:18}];draw();
    document.querySelectorAll('.grp .step').forEach(n=>{n.style.transition='none';n.classList.add('show');});
    return [...document.querySelectorAll('.grp')].flatMap(g=>{
     const n=g.querySelector(':scope > .num'),steps=g.querySelectorAll(':scope > .step');if(!n||steps.length!==2)return [];
     const b=n.getBoundingClientRect(),m=steps[0].getBoundingClientRect(),p=steps[1].getBoundingClientRect();return [{left:b.left-m.right,right:p.left-b.right}];
    });
   });
   assert.ok(groups.length>=3);assert.ok(groups.every(g=>Math.abs(g.left-4)<1&&Math.abs(g.right-4)<1),'grouped health/stat controls stay adjacent: '+JSON.stringify(groups));checks++;
  }
  // A real rotation/refit must not pull any limb control back into a side panel.
  await page.setViewportSize({width:viewport.height,height:viewport.width});
  await page.evaluate(()=>{active='l_rightArm';draw();fitSheet();});
  assert.equal(await page.locator('[data-hp-limb].spread-left,[data-hp-limb].spread-right').count(),0,'rotation keeps limb adjustments with the diagram');checks++;
  await page.close();
 }
 assert.deepEqual(errors,[]);console.log(`PASS ${checks} HP-control checks: six limbs, stat/shield groups, actual +/- taps, five viewports and rotation`);
}finally{await browser.close();await new Promise(r=>server.close(r));}
