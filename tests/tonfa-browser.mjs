import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {startTestServer} from './local-room.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES?process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright':'playwright');
const {server,url}=await startTestServer(),browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH});
let checks=0;const errors=[];
try{
 for(const viewport of [{width:1400,height:1000},{width:844,height:390}]){
  const page=await browser.newPage({viewport,serviceWorkers:'block',reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',r=>r.request().url().startsWith(url)?r.continue():r.abort());await page.goto(url);await page.waitForFunction(()=>typeof openSheet==='function');
  for(const id of ['unicorn-gundam-02-banshee-norn-rx-0-n','unicorn-gundam-luminous-crystal-body','unicorn-gundam-03-phenex-rx-0-n']){
   await page.evaluate(id=>{side='federation';locked=true;turn=freshTurn();const u=UNITS.find(u=>u.id===id);roster=[{uid:1,id,st:freshState(u)}];MSE.init(u,roster[0].st);roster[0].st.eq.hands=[null,null];openSheet(1);},id);
   const result=await page.evaluate(()=>{const w=U.weapons.find(w=>w.integratedTonfa),x=MSE.melee(U,w);return {reason:MSE.reason(U,eqLive(),w),bonus:x.bonus,mount:x.mount,dmg:w.dmg,cost:w.ap,combo:MSE.combo(U,eqLive()),label:eqStatus(x,eqLive())};});
   assert.deepEqual(result,{reason:'',bonus:0,mount:'arms',dmg:'2/4',cost:'0',combo:'',label:'Forearm melee · no equip needed'});checks++;
   await page.locator('#sheet .txtL').filter({hasText:'Beam Tonfa'}).click();assert.match(await page.locator('#pop').textContent(),/no equip action/i);checks++;await page.evaluate(()=>document.getElementById('pop').classList.remove('on'));
   await page.locator('#equipBtn').click();assert.equal(await page.locator('.eq-weapon[title*="Tonfa"]').count(),0);checks++;await page.locator('#equipBtn').click();
   if(process.env.EQUIPMENT_SCREENSHOT)await page.screenshot({path:process.env.EQUIPMENT_SCREENSHOT+'-'+id+'-'+viewport.width+'.png'});
   const loss=await page.evaluate(()=>{const w=U.weapons.find(w=>w.integratedTonfa);hp.rightArm=0;draw();const one=MSE.reason(U,eqLive(),w);hp.leftArm=0;draw();return [one,MSE.reason(U,eqLive(),w)];});assert.deepEqual(loss,['','Both arms destroyed']);checks++;
  }
  await page.evaluate(()=>{const u=UNITS.find(u=>u.id==='gundam-ex');roster=[{uid:1,id:u.id,st:freshState(u)}];openSheet(1);});
  assert.equal(await page.evaluate(()=>{const w=U.weapons.find(w=>w.name==='Beam Saber');return w.label;}),'Beam Saber ×2');checks++;
  const copies=await page.evaluate(()=>{const x=MSE.item(U,'beam-saber'),s=eqLive();const a=MSE.equip(U,s,x.key,'rightArm'),b=MSE.equip(U,s,x.key,'leftArm');return [a,b,new Set(s.eq.hands).size,s.ap];});assert.deepEqual(copies,['','',2,2]);checks++;
  await page.evaluate(()=>{const u=UNITS.find(u=>u.id==='nu-gundam-rx-93');roster=[{uid:1,id:u.id,st:freshState(u)}];openSheet(1);});
  await page.locator('#equipBtn').click();await page.locator('.eq-weapon[title*="Select Beam Saber ×2"]').click();await page.locator('.hp.eq-arm[title="Equip in Right Arm"]').click();await page.locator('#eqSwapConfirm').click();
  await page.locator('.eq-weapon[title*="Select Beam Saber ×2"]').click();await page.locator('.hp.eq-arm[title="Equip in Left Arm"]').click();await page.locator('#equipBtn').click();
  const nu=await page.evaluate(()=>({hands:CUR.st.eq.hands,ap,combo:MSE.combo(U,eqLive()),strong:U.weapons.find(w=>w.name==='Nu Beam Saber').dmg,ordinary:U.weapons.find(w=>w.name==='Beam Saber').dmg}));
  assert.deepEqual(nu.hands,['beam-saber#0','beam-saber#1']);assert.equal(nu.ap,2);assert.match(nu.combo,/Advantage/);assert.equal(nu.strong,'3/6');assert.equal(nu.ordinary,'2/4');checks+=5;
  if(process.env.EQUIPMENT_SCREENSHOT){await page.waitForTimeout(1600);await page.screenshot({path:process.env.EQUIPMENT_SCREENSHOT+'-nu-'+viewport.width+'.png'});}
  const extras=await page.evaluate(()=>{
   const wing=UNITS.find(u=>u.id==='wing-zero-custom-xxxg-00w0'),u=UNITS.find(u=>u.id==='rozen-zulu-yams-132'),s=freshState(u);MSE.init(u,s);s.eq.hands=['beam-saber#0',null];s.eq.dropped=['beam-saber#0'];s.ap=2;MSE.init(u,s);
   const w=u.weapons.find(w=>w.integratedClaw);return {wing:MSE.item(wing,'beam-saber').count,oldSaber:u.weapons.some(w=>w.name==='Beam Saber'),hands:s.eq.hands,dropped:s.eq.dropped,ap:s.ap,reason:MSE.reason(u,s,w),damage:w.dmg,bonus:MSE.melee(u,w).bonus};
  });assert.deepEqual(extras,{wing:2,oldSaber:false,hands:[null,null],dropped:[],ap:2,reason:'',damage:'2/4',bonus:0});checks++;
  await page.evaluate(()=>{const u=UNITS.find(u=>u.id==='rozen-zulu-yams-132');roster=[{uid:1,id:u.id,st:freshState(u)}];openSheet(1);});
  assert.equal(await page.locator('#sheet .txtL').filter({hasText:'Claw'}).count(),1);checks++;
  if(process.env.EQUIPMENT_SCREENSHOT)await page.screenshot({path:process.env.EQUIPMENT_SCREENSHOT+'-rozen-'+viewport.width+'.png'});
  await page.close();
 }
 assert.deepEqual(errors,[]);checks++;console.log('PASS '+checks+' tonfa/EX browser assertions');
}finally{await browser.close();await new Promise(r=>server.close(r));}
