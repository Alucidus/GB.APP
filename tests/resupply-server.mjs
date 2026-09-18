import assert from 'node:assert/strict';
import {startTestServer} from './local-room.mjs';
const {room,server,url}=await startTestServer();let checks=0;
const eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;};
const post=async b=>{const r=await fetch(url+'/api/sync',{method:'POST',body:JSON.stringify(b)});const j=await r.json();assert.equal(j.ok,true);return j;};
const a=await post({action:'create',name:'Supply A'}),b=await post({action:'join',code:'ABCDE',name:'Supply B'});
const sync=(seat,writes={})=>post({action:'sync',...seat,known:{},writes});
const sq=(items={fb:0,sm:0,gr:0})=>({st:{hp:{hp:8},sq:{soldiers:Array.from({length:8},()=>({hp:6})),qr:{items,abRound:1}}}});
const car=(carry=[1],stamp='one',hp=8)=>({id:'ground-car-fed',st:{hp:{hp},gv:{carry,boardings:{1:stamp}}}});
const q=()=>room.mem.get('unit/federation/1').st.sq.qr;
const advance=async()=>{const t=room.mem.get('turn');const j=await sync(t.active==='federation'?a:b,{endTurn:{seq:t.seq}});eq(j.denied,[],'turn permitted');};
try{
 await sync(a,{player:{team:'federation'},team:{roster:[{uid:1,id:'ground-squad-fed'},{uid:2,id:'ground-car-fed'}]},units:{'federation/1':sq(),'federation/2':car()}});
 await sync(b,{player:{team:'spacenoid'},units:{'spacenoid/1':sq({fb:2,sm:2,gr:2})}});
 await sync(a,{settings:{phase:'battle',first:'federation'}});
 eq(q().items,{fb:0,sm:0,gr:0},'migration preserves spent inventory');eq(q().abRound,undefined,'discard ambiguous old progress');
 await advance();await advance();eq(q().items,{fb:0,sm:0,gr:0},'own turn 2 only starts service');eq(q().resupply.firstStart,3);
 await sync(a,{units:{'federation/1':sq({fb:2,sm:99,gr:2})}});eq(q().items,{fb:0,sm:0,gr:0},'client cannot refill');
 await sync(a);eq(q().items,{fb:0,sm:0,gr:0},'reconnect does not refill');
 // Out-and-back in one write still resets via boarding identity.
 await sync(a,{units:{'federation/2':car([1],'two')}});eq(q().resupply.firstStart,null,'same-transport reboarding resets');
 await advance();await advance();eq(q().items,{fb:0,sm:0,gr:0},'new boarding waits its full cycle');
 await advance();await advance();eq(q().items,{fb:2,sm:2,gr:2},'completed service refills 2/2/2');
 // Stale writes cannot undo either refill or later expenditure.
 await sync(a,{units:{'federation/1':sq()}});eq(q().items,{fb:2,sm:2,gr:2},'stale depleted snapshot cannot undo refill');
 await sync(a,{units:{'federation/2':car([],'three')}});eq(q().resupply,undefined,'disembark clears immediately');
 // Real pick/reveal spends once on the server, not once per client.
 const ff=async(seat,op)=>sync(seat,{ff:{id:'supplyfight',...op}});
 await ff(a,{op:'invite',aUid:1,bUid:1});await ff(b,{op:'accept'});await ff(a,{op:'mode',pick:'physical'});await ff(b,{op:'modeAnswer',yes:true});
 await ff(a,{op:'ready',hp:8,supp:0});await ff(b,{op:'ready',hp:8,supp:0});await ff(a,{op:'pick',item:'sm'});
 eq(q().items.sm,2,'selection reserves rather than spends');await ff(a,{op:'unpick'});eq(q().items.sm,2,'unpick spends nothing');
 await ff(a,{op:'pick',item:'gr'});await ff(b,{op:'pick',item:'none'});eq(q().items.gr,1,'reveal spends once');
 await ff(b,{op:'pick',item:'none'});eq(q().items.gr,1,'retry does not spend twice');
 await sync(a,{units:{'federation/1':sq({fb:2,sm:2,gr:2})}});eq(q().items.gr,1,'stale full snapshot cannot restore spent charge');
 await room.mem.set('ff/supplyfight',{...room.mem.get('ff/supplyfight'),state:'closed'});
 await sync(a,{units:{'federation/2':car([1],'four')}});await advance();await advance();
 await sync(a,{units:{'federation/2':car([1],'four',0)}});eq(q().resupply,undefined,'destroyed transport interrupts before emergency dialog');
 await sync(a,{units:{'federation/2':car([1],'five',8)}});eq(q().resupply.firstStart,null,'repair does not resume old progress');
 await advance();await advance();eq(q().items.gr,1,'repaired transport still needs full cycle');
 await sync(a,{team:{roster:[{uid:1,id:'ground-squad-fed'}]}});eq(q().resupply,undefined,'removing carrier interrupts');
 // Old partially spent saves keep counts, while explicit fresh 2/2/2 remains full.
 await sync(a,{units:{'federation/3':sq({fb:1,sm:0,gr:1}),'federation/4':sq({fb:2,sm:2,gr:2})}});
 eq(room.mem.get('unit/federation/3').st.sq.qr.items,{fb:1,sm:0,gr:1});eq(room.mem.get('unit/federation/4').st.sq.qr.items,{fb:2,sm:2,gr:2});
 console.log('PASS '+checks+' authoritative resupply assertions');
}finally{await new Promise(r=>server.close(r));}
