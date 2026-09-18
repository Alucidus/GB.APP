import assert from 'node:assert/strict';import {createRequire} from 'node:module';import {startTestServer} from './local-room.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
const {server,url}=await startTestServer(),browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH});
const post=async b=>(await(await fetch(url+'/api/sync',{method:'POST',body:JSON.stringify(b)})).json()),sync=(seat,writes={})=>post({action:'sync',...seat,known:{},writes});
const errors=[],pages=[];let checks=0;
try{
 const a=await post({action:'create',name:'Base owner'}),b=await post({action:'join',code:a.code,name:'Teammate'}),c=await post({action:'join',code:a.code,name:'Opponent'});
 for(const [seat,team] of [[a,'federation'],[b,'federation'],[c,'spacenoid']]){
  await sync(seat,{player:{team}});
  const page=await browser.newPage({viewport:{width:844,height:390},hasTouch:true,isMobile:true,serviceWorkers:'block',reducedMotion:'reduce'});pages.push(page);
  page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>r.request().url().startsWith(url)?r.continue():r.abort());
  await page.goto(url);await page.waitForFunction(()=>typeof openSheet==='function');
  const row=await page.evaluate(team=>{mpStop();mpKick=()=>{};mpSchedule=()=>{};side=team;locked=true;turn=freshTurn();turn.started=true;const u=unitById('rx-78-2-gundam');roster=[{uid:1,id:u.id,st:freshState(u)}];return roster[0];},team);
  if(seat!==b)await sync(seat,{team:{roster:[{uid:1,id:row.id}],locked:true,turn:{round:1,phase:team==='federation'?'you':'enemy',started:true}},units:{[team+'/1']:{st:row.st}}});
 }
 await sync(a,{settings:{phase:'battle',first:'federation'}});
 async function refresh(page,seat){const j=await sync(seat);await page.evaluate(({seat,j})=>{Object.assign(mp,{...seat,status:'online',entered:true,data:j.changes,etags:j.etags,leaders:j.leaders,hostPid:j.hostPid});mpApply();},{seat,j});}
 for(const [i,seat] of [[0,a],[1,b],[2,c]]){await refresh(pages[i],seat);await pages[i].evaluate(()=>{renderRoster();show('s3');});}
 const [owner,ally,enemy]=pages;await owner.evaluate(()=>{mp.held.add(side+'/1');openSheet(1);});
 await ally.evaluate(()=>{openSheet(1);openPicker();});
 for(const inBase of [true,false]){
  await owner.locator('#baseBtn').tap();await owner.locator('#repairBaseAction').tap();await owner.locator('#pickExtra button').tap();
  assert.deepEqual((await sync(a,{units:{'federation/1':{st:await owner.evaluate(()=>CUR.st)}}})).denied,[]);checks++;
  for(const [page,seat] of [[owner,a],[ally,b],[enemy,c]])await refresh(page,seat);
  await owner.evaluate(()=>renderRoster());
  assert.equal(await owner.locator('#rosterBox .base-roster-state svg').count(),inBase?1:0);checks++;
  assert.equal(await ally.locator('#picklist .base-roster-state svg').count(),inBase?1:0,'open teammate picker updates without reopening');checks++;
  assert.equal(await enemy.locator('#oppBox .base-roster-state svg').count(),inBase?1:0,'enemy roster updates from shared state');checks++;
  assert.equal(await enemy.locator('#oppBox .base-roster-state').evaluate(n=>getComputedStyle(n.closest('.row')).opacity),inBase?'0.5':'1','dim only during actual base presence');checks++;
  if(inBase){await enemy.locator('#oppBox .base-roster-state').scrollIntoViewIfNeeded();await enemy.screenshot({path:'tests/screenshots/base-rosters-enemy-cf124.png'});await ally.screenshot({path:'tests/screenshots/base-rosters-picker-cf124.png'});}
 }
 assert.deepEqual(errors,[]);checks++;console.log('PASS '+checks+' base roster checks: real entry/exit and live owner, teammate picker and enemy symbols');
}finally{await browser.close();await new Promise(r=>server.close(r));}
