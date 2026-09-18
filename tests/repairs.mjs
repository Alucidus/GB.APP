import assert from 'node:assert/strict';
import '../public/data.js';import '../public/repairs.js';
import {startTestServer} from './local-room.mjs';
const R=globalThis.GBRepairs,defs=globalThis.GBRepairUnits,u=defs.find(u=>u.id==='rx-78-2-gundam');let checks=0;
const eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;};
const suit=(uid,owner='one')=>({uid,id:u.id,st:{hp:Object.fromEntries(Object.entries(u.limb).map(([k,v])=>[k,v-5])),sh:[0],shMax:[20],eq:{hands:['beam-saber#0',null],dropped:['beam-saber#0'],shieldDropped:[]},wpn:[0,1],repair:{owner,entry:'entry-'+uid}}});
let rows=[suit(1),suit(2),suit(3,'two')];
R.process(rows,defs,1);const hp=rows[0].st.hp.chest;
eq(rows.map(r=>r.st.repair.live.status),['Repairing','Waiting','Repairing'],'one slot per owner');
R.process(rows,defs,2,true);eq(rows.map(r=>r.st.hp.chest),[hp+2,hp,hp+2],'ground next turn and independent owners');
eq(rows[0].st.sh,[5],'tier0 shield');eq(rows[0].st.eq.dropped,[],'weapon replacement');eq(rows[0].st.eq.hands,[null,null],'replacement not equipped');eq(rows[0].st.wpn,[0,1],'charges unchanged');
R.process(rows,defs,2,true);eq(rows[0].st.hp.chest,hp+2,'no repeated tick');
rows[1].st.repair.priority=-1;R.process(rows,defs,2);eq(rows[1].st.repair.live.since,2,'new priority starts own cycle');
rows[1].st.hp.leftArm=0;R.process(rows,defs,3,true);eq(rows[1].st.hp.leftArm,0,'destroyed arm never repaired');
rows[1].st.hp.chest=0;R.process(rows,defs,4,true);eq(rows[1].st.hp.chest,0,'no revival');
const saz=defs.find(x=>x.kill==='head');const dead={uid:9,id:saz.id,st:{hp:{...saz.limb,head:0},repair:{owner:'one',entry:'x'}}};R.process([dead],defs,5,true);eq(dead.st.repair.live,undefined,'unit specific kill location');
const ship={uid:10,id:'rewloola-class-battleship',st:{hp:{hull:20},ship:{carry:[1,2,3,4],docking:[],repairBoardings:{}}}};
{
 const carrier=structuredClone(ship);carrier.st.ship.repairSlots=[null,null,null];const rs=[carrier,suit(1),suit(2),suit(3),suit(4)];
 R.process(rs,defs,1);R.process(rs,defs,2,true);eq(rs[1].st.hp.chest,hp,'empty manual slots do not repair');
 carrier.st.ship.repairSlots=[2,1,2];R.process(rs,defs,2);eq(carrier.st.ship.repairSlots,[2,1,null],'unique physical assignments');
 R.process(rs,defs,3,true);eq(rs.slice(1).map(r=>r.st.hp.chest),[hp+4,hp+4,hp,hp],'only assigned units heal');
 carrier.st.ship.repairSlots=[4,null,null];R.process(rs,defs,3);eq(rs[1].st.repair.live.since,null,'removal cancels unfinished cycle');
 R.process(rs,defs,4,true);eq(rs[4].st.hp.chest,hp+4,'new selection heals after full cycle');
 carrier.st.ship.repairSlots=[3,null,null];carrier.st.ship.carry=[1,2,4];R.process(rs,defs,4);eq(carrier.st.ship.repairSlots,[null,null,null],'launched unit releases slot');
 const ready=suit(8);ready.st.hp={...u.limb};ready.st.sh=[20];ready.st.eq.dropped=[];ready.st.eq.hands=[null,null];carrier.st.ship.carry.push(8);carrier.st.ship.repairSlots=[8,null,null];rs.push(ready);R.process(rs,defs,4);eq(carrier.st.ship.repairSlots,[null,null,null],'ready unit releases slot');
}
rows=[ship,...[1,2,3,4].map(i=>suit(i))];R.process(rows,defs,2);R.process(rows,defs,3,true);
eq(rows.slice(1).map(r=>r.st.hp.chest),[hp+4,hp+4,hp+4,hp],'three carrier slots');eq(rows[1].st.sh,[12],'tier2 shield');
ship.st.hp.hull=0;R.process(rows,defs,4,true);eq(rows[1].st.repair.live,undefined,'destroyed carrier stops service');
const beam={...u,regen:true},temp={...u,shields:[{hp:20,when:'field'}]},coat={...u,shields:[{hp:20,label:'Coating'}]};
{const r=suit(1);r.st.eq.shields=['leftArm','leftArm'];r.st.eq.shieldDropped=[0];R.heal(u,r.st,0);eq(r.st.eq.shields,[null,'leftArm'],'replacement shield stays stored beside a captured shield');}
for(const def of [beam,temp,coat]){const r=suit(1);R.heal(def,r.st,2);eq(r.st.sh,[0],'nonphysical shield excluded');}
const {room,server,url}=await startTestServer();
const post=async b=>(await (await fetch(url+'/api/sync',{method:'POST',body:JSON.stringify(b)})).json());
try{
 const a=await post({action:'create',name:'Repair A'}),b=await post({action:'join',code:'ABCDE',name:'Repair B'});
 const sync=(p,writes={})=>post({action:'sync',...p,known:{},writes});
 const unit=suit(1,a.pid);delete unit.st.repair.entry;
 const carrier={uid:2,id:ship.id,st:{hp:{hull:20},ship:{carry:[],docking:[{uid:1}],aboard:0}}};
 await sync(a,{player:{team:'federation'},team:{roster:[{uid:1,id:u.id},{uid:2,id:ship.id}]},units:{'federation/1':{st:unit.st},'federation/2':{st:carrier.st}}});
 await sync(b,{player:{team:'spacenoid'}});await sync(a,{settings:{phase:'battle',first:'federation'}});
 const state=()=>room.mem.get('unit/federation/1').st;
 const advance=async()=>{const t=room.mem.get('turn');await sync(t.active==='federation'?a:b,{endTurn:{seq:t.seq}});};
 eq(state().repair.live.status,'Docking');await advance();await advance();
 eq(room.mem.get('unit/federation/2').st.ship.carry,[1],'server docks at turn2');eq(state().hp.chest,hp,'no repair turn2');
 const stale=structuredClone(state());await advance();await advance();eq(state().hp.chest,hp+4,'first carrier repair turn3');
 await sync(a,{units:{'federation/1':{st:stale}}});eq(state().hp.chest,hp+4,'stale write does not undo service');
 await sync(a);eq(state().hp.chest,hp+4,'reconnect no duplicate');
 const cleared=structuredClone(room.mem.get('unit/federation/2').st),damaged=structuredClone(state());cleared.ship.repairSlots=[null,null,null];damaged.hp.chest=1;damaged.sh[0]=0;
 await sync(a,{units:{'federation/1':{st:damaged},'federation/2':{st:cleared}}});await advance();await advance();eq(state().hp.chest,1,'shared empty manual bay cannot heal');
 const assigned=structuredClone(room.mem.get('unit/federation/2').st);assigned.ship.repairSlots=[1,null,null];await sync(a,{units:{'federation/2':{st:assigned}}});
 eq(state().repair.live.status,'Repairing','server accepts assigned slot');
 await sync(a,{units:{'federation/2':{st:cleared}}});eq(room.mem.get('unit/federation/2').st.ship.repairSlots,[1,null,null],'stale slot assignment cannot undo current choice');
 await advance();await advance();eq(state().hp.chest,5,'manual slot heals at next own turn');eq(state().sh[0],12,'manual slot retains Tier 2 shield rate');
 console.log('PASS '+checks+' repair assertions');
}finally{await new Promise(r=>server.close(r));}
