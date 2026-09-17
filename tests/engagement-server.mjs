import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {startTestServer} from './local-room.mjs';
const {room,server,url}=await startTestServer();
let checks=0;
const ok=(condition,msg)=>{assert.ok(condition,msg);checks++;};
const post=async b=>{const r=await fetch(url+'/api/sync',{method:'POST',body:JSON.stringify(b)});const j=await r.json();assert.equal(j.ok,true,JSON.stringify(j));return j;};
const sync=(seat,writes={})=>post({action:'sync',...seat,known:{},writes});
const a=await post({action:'create',name:'Alice'}),b=await post({action:'join',code:'ABCDE',name:'Bob'});
let id='testfight';
const ff=async(seat,op,deny=false)=>{const j=await sync(seat,{ff:{id,...op}});ok(deny?j.denied.length>0:j.denied.length===0,JSON.stringify({op,denied:j.denied}));return j;};
const state=()=>room.mem.get('ff/'+id);
const unit=hp=>({st:{hp:{hp},sq:{soldiers:Array.from({length:8},(_,i)=>({hp:i<hp?6:0})),qr:{items:{fb:2,sm:1,gr:1}}}}});
async function bout(){for(let i=0;i<4;i++){await ff(a,{op:'ready',hp:8,supp:0});await ff(b,{op:'ready',hp:8,supp:0});await ff(a,{op:'pick',item:'none'});await ff(b,{op:'pick',item:'none'});await ff(a,{op:'claim',result:'tied'});await ff(b,{op:'claim',result:'tied'});}await ff(a,{op:'ready',hp:8,supp:0});await ff(b,{op:'ready',hp:8,supp:0});}
try {
 await sync(a,{player:{team:'federation'},units:{'federation/1':unit(4),'federation/2':unit(7),'federation/3':unit(6)}});
 await sync(b,{player:{team:'spacenoid'},units:{'spacenoid/1':unit(8),'spacenoid/2':unit(8),'spacenoid/3':unit(8)}});
 await sync(a,{settings:{phase:'battle',first:'federation'}});
 await ff(b,{op:'invite',aUids:[1,2],bUids:[1,2]},true);
 await ff(a,{op:'invite',aUids:[1,2],bUids:[1,2],aLabels:['Blue 1','Blue 2'],bLabels:['Red 1','Red 2'],obj:'Car'});
 await ff(b,{op:'accept',pairs:[[1,1],[2,2]]});await ff(a,{op:'mode',pick:'physical'});
 ok((await sync(a,{endTurn:{seq:1}})).denied.includes('end-turn:firefight'),'mid-bout gate');
 await bout();ok(state().state==='end','end of four rounds');
 await ff(a,{op:'nextbout'},true);await ff(a,{op:'engedit',kind:'add',uid:3},true);
 await ff(a,{op:'objective',win:'mine',hpMine:4,hpFoe:8});await ff(b,{op:'objective',win:'mine'},true);
 const snapshot=structuredClone(state());
 await ff(a,{op:'segment',forced:true},true);
 await ff(a,{op:'nextbout'});ok(state().confirmed.a&&!state().confirmed.b,'one confirmation');
 ok((await sync(a,{endTurn:{seq:1}})).denied.includes('end-turn:firefight'),'one side cannot end turn');
 await sync(a,{team:{turn:{ends:0,phase:'you'}}});await sync(a,{team:{turn:{ends:1,phase:'enemy'}}});ok(room.mem.get('turn').seq===1,'roster fallback cannot bypass');
 await ff(b,{op:'nextbout'});ok(state().state==='end','both confirmed stay on board');
 await ff(a,{op:'setnext',uid:1},true);await ff(a,{op:'unconfirm'});await ff(a,{op:'setnext',uid:1});
 ok((await sync(a,{endRequest:{seq:1}})).denied.includes('end-request:firefight'),'request gate after unconfirm');
 await ff(a,{op:'extract',uid:1});ok(state().ext.holder,'holder extraction');
 await ff(a,{op:'engedit',kind:'add',uid:3},true);await ff(a,{op:'nextbout'},true);
 await ff(b,{op:'deny',uid:3},true);await ff(b,{op:'deny',uid:2});await ff(b,{op:'fighton'},true);await ff(a,{op:'fighton'});
 ok(!state().confirmed.a&&!state().confirmed.b&&!state().ext,'failed extraction resets both');
 await ff(a,{op:'extract',uid:2});await ff(b,{op:'letgo'});
 ok(state().state==='end'&&state().eng.aList.length===1,'non-holder leaves without extraction');
 await ff(a,{op:'engedit',kind:'add',uid:3,label:'Blue 3'});await ff(a,{op:'setnext',uid:3});await ff(a,{op:'nextbout'});await ff(b,{op:'nextbout'});
 await sync(a,{endTurn:{seq:1}});
 ok(state().state==='ready'&&state().eng.bout===2&&state().a.uid===3,'next turn starts selected bout');
 ok(room.mem.get('turn').seq===2,'turn advances once');
 await bout();await ff(a,{op:'objective',win:'mine'});
 // Merging transfers holder identity to the surviving squad.
 await ff(a,{op:'engedit',kind:'merge',uids:[3],keepUid:1});ok(state().holder.uid===1,'holder follows merge survivor');
 await ff(a,{op:'extract',uid:1});await ff(b,{op:'deny',uid:2});await ff(a,{op:'smokeout',uid:1});
 ok(state().state==='end'&&state().ext.smoke&&!state().secured,'smoke leaves another flash response window');
 await ff(a,{op:'smokeout',uid:1},true);
 ok((await sync(b,{endTurn:{seq:2}})).denied.includes('end-turn:firefight'),'cannot end turn during counter chain');
 await ff(b,{op:'deny',uid:1});ok(!state().ext.smoke&&state().ext.flashes===2,'a different squad flashes again');
 await ff(b,{op:'deny',uid:2},true);await ff(b,{op:'letgo'},true);
 await ff(a,{op:'smokeout',uid:1});ok(state().ext.smokes===2,'second smoke reopens response');
 await ff(b,{op:'letgo'});
 ok(state().state==='closed'&&state().secured==='a','escape completes after opponent lets go');
 // Plain 1v1 and rolled objective; forcing the next bout remains queued.
 id='singleff';await ff(b,{op:'invite',aUid:3,bUid:3,aLabel:'Red 3',bLabel:'Blue 3'});await ff(a,{op:'accept'});
 await ff(a,{op:'mode',pick:'roll'});await ff(b,{op:'mode',pick:'roll'});
 // Put an already-completed rolled bout in place; normal round loop above exercises transition separately.
 await room.mem.set('ff/'+id,{...state(),state:'end',round:5});await ff(a,{op:'objective',hpMine:8,hpFoe:1});
 ok(state().obj.a!==state().obj.b,'rolled objective resolves tie');
 await ff(a,{op:'segment',forced:true});ok(state().state==='queued','forced 1v1 waits for next turn');
 await ff(b,{op:'counter'});ok(state().state==='closed','forced counter');
 // Render real board/disengagement helpers for both perspectives without a DOM dependency.
 const app=await fs.readFile(new URL('../public/app.js',import.meta.url),'utf8');
 const helpers=app.slice(app.indexOf('function ffText('),app.indexOf('function renderFF()'));
 for(const sd of ['a','b']) {
   const team=snapshot[sd].team;
   const roster=snapshot.eng[sd+'List'].map(x=>({uid:x.uid,st:unit(8).st}));
   const ctx=vm.createContext({window:{},roster,mp:{data:{}},FF_ITEMS:{fb:{n:'Flashbang'},sm:{n:'Smoke'},gr:{n:'Grenade'}},sqAlive:st=>st.hp.hp,teamName:t=>t==='federation'?'Federation':'Spacenoids',ffOther:s=>s==='a'?'b':'a',ffMySquads:()=>roster.map(r=>({uid:r.uid,alive:8,items:r.st.sq.qr.items})),ffMine:()=>null});
   vm.runInContext(helpers,ctx);ctx.f=structuredClone(snapshot);ctx.s=sd;
   const html=vm.runInContext('ffBoard(f,s)',ctx);
   ok((html.match(/class="ffboard-card/g)||[]).length===4,'all four cards');
   ok((html.match(/<img src="img\/items/g)||[]).length===6,'own icons only');
   ok(!html.includes((sd==='a'?'spa':'fed')+'-fb.webp'),'enemy items hidden');
   ok(html.includes('Confirm fighter')&&!html.includes('Forced Re-Engagement'),'upcoming bout controls');
   ctx.f.confirmed={a:true,b:true};ok(vm.runInContext('ffBoard(f,s)',ctx).includes('Un-confirm'),'unconfirm on board');
   ctx.f.ext={side:sd,uid:1,holder:true,deny:{uid:2}};ok(vm.runInContext('ffDisengageScreen(f,s)',ctx).includes('Smoke out'),'denied response');
   ctx.f.ext.smoke=true;
   ok(vm.runInContext('ffDisengageScreen(f,s)',ctx).includes('waiting for the enemy to flash again'),'smoke waits on defender');
   ctx.f.ext.side=sd==='a'?'b':'a';
   ok(vm.runInContext('ffDisengageScreen(f,s)',ctx).includes('Flash again'),'defender gets flash-again button');
   ctx.roster.forEach(r=>{r.st.sq.qr.items.fb=0;});
   ok(vm.runInContext('ffDisengageScreen(f,s)',ctx).includes('No Flashbangs left'),'empty bag cannot reflash');
   ctx.f.eng.bout=2;ok(vm.runInContext('ffBoard(f,s)',ctx).includes('Forced Re-Engagement'),'forced option after all bouts');
   ctx.f.eng.obj='<img onerror=bad>';ok(!vm.runInContext('ffBoard(f,s)',ctx).includes('<img onerror'),'objective escaped');
   // Full end-state renderer: four screens must stay mutually exclusive.
   const box={innerHTML:'',querySelector:()=>({scrollTop:0}),remove:()=>{}};
   Object.assign(ctx,{$:()=>box,CUR:{uid:1,st:unit(8).st},U:{},mpTeamMode:()=>false,
     renderFFInvites:()=>{},ffActiveFight:()=>null,ffTurnKey:'',setTimeout:()=>{},ffMine:()=>ctx.f,
     ffHidden:false,ffSync:()=>{},ffSideOf:()=>sd,ffSidePidAlive:()=>true,ffLastSig:'',unitLabel:()=> 'Squad',FIREPOWER:()=>8});
   vm.runInContext(app.slice(app.indexOf('function renderFF()'),app.indexOf('// invites on the defending team',app.indexOf('function renderFF()'))),ctx);
   ctx.f=structuredClone(snapshot);ctx.f.obj=null;vm.runInContext('renderFF()',ctx);
   ok(box.innerHTML.includes('class="ffoc"')&&!box.innerHTML.includes('class="ffboard"')&&!box.innerHTML.includes('class="ffsides"'),'clash alone');
   ctx.f=structuredClone(snapshot);vm.runInContext('renderFF()',ctx);
   ok(box.innerHTML.includes('class="ffboard"')&&!box.innerHTML.includes('class="ffoc"'),'board alone');
   ctx.f.ext={side:sd,uid:1,holder:true,deny:null};vm.runInContext('renderFF()',ctx);
   ok(box.innerHTML.includes('ffdeparture')&&!box.innerHTML.includes('class="ffboard"'),'departure alone');
   ctx.f.state='closed';ctx.f.secured=sd;vm.runInContext('renderFF()',ctx);
   ok(box.innerHTML.includes('You extracted with')&&!box.innerHTML.includes('ffdeparture'),'end screen alone');
   // New bouts do not replenish items, and ownership moves to the newest holder.
   ctx.roster[0].st.sq.qr.items={fb:0,sm:0,gr:0};ctx.CUR=ctx.roster[0];ctx.turn={round:1};ctx.save=()=>{};ctx.logEv=()=>{};
   vm.runInContext(app.slice(app.indexOf('function ffSync(f)'),app.indexOf('// apply what the reveal',app.indexOf('function ffSync(f)'))),ctx);
   ctx.f=structuredClone(snapshot);ctx.f.holder={side:sd,uid:1};vm.runInContext('ffSync(f)',ctx);
   ctx.f.seg++;ctx.f.obj.seg++;ctx.f.holder.uid=2;vm.runInContext('ffSync(f)',ctx);
   ok(ctx.roster[0].st.sq.qr.items.fb===0&&ctx.roster[0].st.sq.qr.items.sm===0,'items never refill at bout boundaries');
   ok(!ctx.roster[0].st.sq.holdsObj&&ctx.roster[1].st.sq.holdsObj,'only latest holder keeps objective');
   // Run the production merge handler: capped health, healthiest survivor, no item refill.
   ctx.f=structuredClone(snapshot);ctx.CUR=ctx.roster[0];ctx.mpToast=()=>{};ctx.sqSyncHP=st=>{st.hp.hp=st.sq.soldiers.filter(x=>x.hp>0).length;};
   const sent=[];ctx.ffOp=op=>sent.push(op);
   ctx.roster[0].st=unit(4).st;ctx.roster[1].st=unit(7).st;ctx.roster[1].st.sq.qr.items.fb=0;
   ctx.chosen=ctx.roster.map((r,i)=>({uid:r.uid,r,alive:i?7:4,label:i?'Healthiest':'Wounded'}));
   vm.runInContext(app.slice(app.indexOf('function ffMergeGo('),app.indexOf('window.ffNextBout',app.indexOf('function ffMergeGo('))),ctx);
   vm.runInContext('ffMergeGo(f,chosen)',ctx);
   ok(ctx.roster[1].st.hp.hp===8&&ctx.roster[0].st.hp.hp===0,'merge caps healthiest squad at eight');
   ok(sent[0].keepUid===2&&ctx.roster[1].st.sq.qr.items.fb===0,'merge keeps healthiest identity and spent items');


 }
 // Challenge objective markers distinguish same-numbered squads on opposite teams.
 const ownUnit=unit(8).st,enemyUnit=unit(8).st;
 ownUnit.sq.holdsObj={name:'Car'};enemyUnit.sq.holdsObj={name:'Server <room>'};
 const markerCtx=vm.createContext({roster:[{uid:1,st:ownUnit}],mp:{data:{'unit/spacenoid/1':{st:enemyUnit}}},mpMyTeam:()=> 'federation',objHeld:st=>st?.sq?.holdsObj});
 vm.runInContext(app.slice(app.indexOf('function ffText('),app.indexOf('function ffMoreBouts(')),markerCtx);
 vm.runInContext(app.slice(app.indexOf('function ffChallengeObjective('),app.indexOf('function ffPickRender(')),markerCtx);
 ok(vm.runInContext('ffChallengeObjective(1,"federation")',markerCtx).includes('🚩 Car'),'own picker objective');
 ok(vm.runInContext('ffChallengeObjective(1,"spacenoid")',markerCtx).includes('Server &lt;room&gt;'),'enemy marker escaped and team-specific');
 enemyUnit.hp.hp=0;ok(vm.runInContext('ffChallengeObjective(1,"spacenoid")',markerCtx)==='','dead squad has no marker');
 ownUnit.sq.holdsObj=null;ok(vm.runInContext('ffChallengeObjective(1,"federation")',markerCtx)==='','no false marker');
 console.log('PASS '+checks+' assertions: two-player protocol, real four-round bouts, turn gates, confirmation reversal, disengagement, waiting-squad responses, roster edits, holder merge, queued next bout, plain 1v1, rolled clash, forced counter, both board perspectives and item privacy.');
} finally {await new Promise(r=>server.close(r));}
