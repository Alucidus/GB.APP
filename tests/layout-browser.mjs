import assert from 'node:assert/strict';import {createRequire} from 'node:module';import {startTestServer} from './local-room.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
const {server,url}=await startTestServer(),browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH});let checks=0;const errors=[];
try{
 for(const viewport of [{width:667,height:375},{width:844,height:390},{width:932,height:430}]){
  const page=await browser.newPage({viewport,isMobile:true,hasTouch:true,serviceWorkers:'block',reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>r.request().url().startsWith(url)?r.continue():r.abort());await page.goto(url);await page.waitForFunction(()=>typeof openSheet==='function');
  const ids=await page.evaluate(()=>UNITS.map(u=>u.id));
  for(const id of ids){
   const results=await page.evaluate(id=>{
    side='federation';locked=true;turn=freshTurn();const u=unitById(id);roster=[{uid:1,id,st:freshState(u)}];eqPending=null;openSheet(1);fitSheet();
    const rect=n=>n.getBoundingClientRect(),overlap=(a,b)=>Math.min(a.right,b.right)-Math.max(a.left,b.left)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1;
    const sheet=$('sheet'),ap=[...sheet.querySelectorAll('.spread-ap')].filter(n=>!n.classList.contains('na')),collisions=[];
    for(let i=0;i<ap.length;i++)for(let j=i+1;j<ap.length;j++)if(overlap(rect(ap[i]),rect(ap[j])))collisions.push(ap[i].textContent+'/'+ap[j].textContent);
    const help=rect($('helpBtn')),foot=[$('helpBtn'),$('doneBtn'),$('rosterBtn')],status=[...sheet.querySelectorAll('.sw-name,.sw-ap,.sw-cd,.sstep')];
    const footerHits=U.type?foot.flatMap(f=>status.filter(n=>overlap(rect(f),rect(n))).map(n=>f.id+':'+n.textContent)):[];
    const dock=rect(sheet.querySelector('.fdock.r')),buttons=[$('doneBtn'),$('rosterBtn')].map(rect);
    const background=buttons.every(r=>r.left>=dock.left-2&&r.right<=dock.right+2);
    const captions=[...sheet.querySelectorAll('.eq-arm-caption')].map(n=>rect(n).height);
    const model=sheet.querySelector('.fmech'),before=model?rect(model).toJSON():null;
    if(model){for(const n of sheet.querySelectorAll('.spread-left,.spread-right,.spread-wide'))n.classList.remove('spread-left','spread-right','spread-wide');}
    const unspread=model?rect(model).toJSON():null;spreadSheet();
    return {collisions,footerHits,background,captions,unchanged:!model||before.width===unspread.width&&before.height===unspread.height&&before.x===unspread.x&&before.y===unspread.y};
   },id);
   assert.deepEqual(results.collisions,[],id+' AP controls must not overlap');assert.deepEqual(results.footerHits,[],id+' footer must clear weapon/status controls');assert.ok(results.background,id+' footer background follows buttons');assert.ok(results.unchanged,id+' diagram remains unchanged');assert.ok(results.captions.every(h=>h<=32),id+' compact arm labels');checks+=5;
  }
  // Exercise a relocated AP cell, rather than relying only on its rectangle.
  await page.evaluate(()=>{side='federation';locked=true;turn=freshTurn();const u=unitById('rx-78-2-gundam');roster=[{uid:1,id:u.id,st:freshState(u)}];openSheet(1);fitSheet();});
  const beforeAP=await page.evaluate(()=>ap);await page.locator('.aphit[title="Tap to fire — spends 2 AP"]').first().tap();assert.equal(await page.evaluate(()=>ap),beforeAP-2);checks++;
  await page.close();
 }
 assert.deepEqual(errors,[]);console.log('PASS '+checks+' layout checks across every unit and three phone sizes: AP separation, footer clearance/background, compact labels and unchanged diagrams');
}finally{await browser.close();await new Promise(r=>server.close(r));}
