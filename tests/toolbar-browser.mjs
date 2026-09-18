import assert from 'node:assert/strict';import {createRequire} from 'node:module';import {startTestServer} from './local-room.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
const {server,url}=await startTestServer(),browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH});const errors=[];let checks=0;
try{
 for(const viewport of [{width:568,height:320},{width:667,height:375},{width:844,height:390},{width:932,height:430},{width:1024,height:768},{width:1400,height:1000}]){
  const page=await browser.newPage({viewport,hasTouch:true,isMobile:true,serviceWorkers:'block',reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',r=>r.request().url().startsWith(url)?r.continue():r.abort());await page.goto(url);await page.waitForFunction(()=>typeof openSheet==='function');
  for(const id of ['rx-78-2-gundam','ra-cailum-class-battleship','ground-squad-fed']){
   await page.evaluate(id=>{side='federation';locked=true;turn=freshTurn();turn.started=true;turn.phase='you';const u=unitById(id);roster=[{uid:1,id,st:freshState(u)}];eqPending=null;openSheet(1);},id);
   const geometry=await page.evaluate(()=>({overflow:$('topbar').scrollWidth>$('topbar').clientWidth+1,buttons:[...document.querySelectorAll('#topbar button,#amtBar .a,#phaseChip')].filter(n=>n.getBoundingClientRect().width).map(n=>{const r=n.getBoundingClientRect();return {text:n.textContent,x:r.x,right:r.right,y:r.y,bottom:r.bottom,height:r.height,width:r.width,hit:n.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))};}),sheet:$('sheet').getBoundingClientRect().toJSON(),tl:$('tl').getBoundingClientRect().toJSON()}));
   assert.equal(geometry.overflow,false,`${id} ${viewport.width}: toolbar must not scroll horizontally`);checks++;
   assert.ok(geometry.buttons.every(b=>b.x>=0&&b.right<=viewport.width+1&&b.y>=0&&b.bottom<=viewport.height&&b.hit),JSON.stringify(geometry));checks++;
   assert.ok(geometry.buttons.every(b=>b.width>=44&&b.height>=44),'all visible targets retain 44px size');checks++;
   assert.ok(geometry.sheet.bottom<=viewport.height+1&&geometry.tl.bottom<=viewport.height+2,'sheet and timeline still fit: '+JSON.stringify(geometry));checks++;
   const amounts=viewport.width<=1100?[1,2,3,4]:[1,2,3,4,5,6,10,15];assert.equal(await page.locator('#amtBar .a:visible').count(),amounts.length+2);checks++;
   for(const value of amounts){await page.locator('#amtBar .a[data-amount="'+value+'"]').tap();assert.equal(await page.evaluate(()=>amount),value);checks++;}
   await page.locator('#amtBar .cust').tap();assert.match(await page.locator('#pickT').innerText(),/amount/i);await page.locator('#pickCancel').tap();checks++;
   await page.locator('#amtBar .cust').tap();await page.locator('#amtInput').fill('15');await page.locator('#pickExtra button').tap();assert.equal(await page.evaluate(()=>amount),15);if(viewport.width<=1100)assert.equal(await page.locator('#amtBar .cust').innerText(),'15');checks++;
   const before=await page.evaluate(()=>JSON.stringify(CUR.st));await page.locator('#amtBar .nuke').tap();assert.match(await page.locator('#pickT').innerText(),/nuclear blast/i);await page.locator('#pickCancel').tap();assert.equal(await page.evaluate(()=>JSON.stringify(CUR.st)),before,'opening/canceling nuclear dialog applies no damage');checks++;
   await page.locator('#mRep').tap();assert.equal(await page.evaluate(()=>mode),'repair');await page.locator('#mDmg').tap();assert.equal(await page.evaluate(()=>mode),'damage');checks++;
   await page.locator('#amtBar .a[data-amount="1"]').tap();await page.screenshot({path:'tests/screenshots/toolbar-cf128-'+id+'-'+viewport.width+'.png'});
  }
  await page.evaluate(()=>{amount=15;renderAmounts();});await page.setViewportSize(viewport.width<=1100?{width:1400,height:1000}:{width:667,height:375});
  await page.waitForFunction(()=>document.querySelectorAll('#amtBar .a').length===10&&document.querySelector('#amtBar .cust').textContent===(innerWidth<=1100?'15':'#'));
  assert.equal(await page.evaluate(()=>amount),15,'resizing retains selected damage');assert.equal(await page.locator('#amtBar .a:visible').count(),viewport.width<=1100?10:6);checks++;
  await page.close();
 }
 assert.deepEqual(errors,[]);console.log(`PASS ${checks} toolbar checks: compact/full presets, custom/nuke taps, six screen sizes, breakpoint resize and suit/ship/infantry sheets`);
}finally{await browser.close();await new Promise(r=>server.close(r));}
