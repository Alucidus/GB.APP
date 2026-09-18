import assert from 'node:assert/strict';import fs from 'node:fs';import {createRequire} from 'node:module';
import {startTestServer} from './local-room.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES?process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright':'playwright');
const rows=JSON.parse(fs.readFileSync(new URL('fixtures/saber-counts-cf117.json',import.meta.url),'utf8')).filter(x=>x.before!==x.copies);
const {server,url}=await startTestServer();const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||undefined});let checks=0;const errors=[];
try{
 for(const viewport of [{width:1400,height:1000},{width:844,height:390}]){
  const page=await browser.newPage({viewport,serviceWorkers:'block',reducedMotion:'reduce'});
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',r=>r.request().url().startsWith(url)?r.continue():r.abort());
  await page.goto(url);await page.waitForFunction(()=>typeof openSheet==='function');
  for(const [i,row] of rows.entries()){
   await page.evaluate(({id,i})=>{side=i%2?'spacenoid':'federation';locked=true;turn=freshTurn();const u=UNITS.find(u=>u.id===id);roster=[{uid:1,id,st:freshState(u)}];eqPending=null;closePicker();openSheet(1);},{id:row.id,i});
   const before=await page.evaluate(()=>ap),shield=await page.evaluate(()=>JSON.stringify([sh,CUR.st.eq.shields]));
   await page.locator('#equipBtn').click();await page.locator('.eq-weapon[title*="Beam Saber"]').click();await page.locator('.hp.eq-arm[title="Equip in Right Arm"]').click();
   if(await page.locator('#eqSwapConfirm').isVisible())await page.locator('#eqSwapConfirm').click();
   await page.locator('.eq-weapon[title*="Beam Saber"]').click();await page.locator('.hp.eq-arm[title="Equip in Left Arm"]').click();
   assert.equal(await page.evaluate(()=>new Set(CUR.st.eq.hands).size),2);
   assert.equal(await page.evaluate(()=>CUR.st.eq.hands.every(r=>MSE.item(U,r)?.key==='beam-saber')),true);
   assert.equal(await page.evaluate(()=>ap),before-2);
   assert.equal(await page.evaluate(()=>JSON.stringify([sh,CUR.st.eq.shields])),shield);checks+=4;
   await page.locator('#equipBtn').click();assert.equal(await page.locator('.eq-row.eq-both').count(),1);checks++;
   assert.equal(await page.locator('#sheet .txtL').filter({hasText:'[R+L] Beam Saber ×2'}).count(),1);checks++;
   if(process.env.EQUIPMENT_SCREENSHOT&&/^(rx-78-2|f91)/.test(row.id))await page.screenshot({path:process.env.EQUIPMENT_SCREENSHOT+'-'+row.id+'-'+viewport.width+'.png'});
   await page.evaluate(()=>{persist();openSheet(1);});
   assert.equal(await page.evaluate(()=>new Set(CUR.st.eq.hands).size),2);assert.equal(await page.evaluate(()=>ap),before-2);checks+=2;
  }
  await page.close();
 }
 assert.deepEqual(errors,[]);checks++;console.log('PASS '+checks+' browser assertions across all 12 increased saber inventories at desktop and phone sizes');
}finally{await browser.close();await new Promise(r=>server.close(r));}
