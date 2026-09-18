import assert from 'node:assert/strict';import '../public/data.js';import '../public/equipment.js';import '../public/pickups.js';import {startTestServer} from './local-room.mjs';
const P=globalThis.GBPickups,E=globalThis.GBEquipment,defs=globalThis.GBRepairUnits;let checks=0;const eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;};
const unit=id=>defs.find(u=>u.id.includes(id));
function row(uid,u,team='federation'){const st={hp:{...u.limb},ap:5,sh:(u.shields||[]).map(c=>c.hp),shMax:(u.shields||[]).map(c=>c.hp),shDown:(u.shields||[]).map(()=>0),wpn:u.weapons.map(w=>w.limit?.kind==='charges'?w.limit.max:0),track:u.abilities.map(()=>0)};E.init(u,st);return {uid,id:u.id,team,st};}
const gundam=unit('rx-78-2-gundam'),gm=unit('gm-rgm');
let source=row(1,gundam),target=row(2,gm),rows=[source,target],field={items:{},seq:0};
source.st.hp.rightArm=0;source.st.hp.leftArm=0;source.st.sh[0]=7;P.scan(field,rows,defs);
eq(P.available(field,'federation',1).length,2,'arm loss drops weapon and physical shield');
source.st.hp.rightArm=7;source.st.hp.leftArm=7;P.scan(field,rows,defs);eq(source.st.eq.dropped.length,1,'repairing arm does not retrieve weapon');
const gun=P.available(field,'federation',2).find(v=>v.kind==='weapon'),shield=P.available(field,'federation',1).find(v=>v.kind==='shield');
eq(P.claim(field,rows,defs,'federation',2,gun.id),'');eq(target.st.ap,4,'one AP');eq(P.available(field,'federation',1).length,1,'claim removes for everyone');
eq(P.claim(field,rows,defs,'federation',2,gun.id),'Already picked up');eq(target.st.ap,4,'repeat no charge');
eq(E.recover(gundam,source.st,gun.ref),'Another unit already picked this up','source cannot duplicate');
const equipped=P.definition(gm,target.st),captured=equipped.weapons.find(w=>w.pickupId);eq(captured.dmg,gun.profiles[0].dmg,'original damage');eq(captured.range,gun.profiles[0].range,'original range');
eq(P.claim(field,rows,defs,'federation',1,shield.id),'');eq(source.st.ap,4);eq(source.st.sh[0],7,'shield keeps HP');
// Destruction drops only equipped physical items, not stowed sabers or integrated guns.
source=row(1,gundam,'spacenoid');target=row(2,gm);rows=[source,target];field={items:{},seq:0};source.st.hp.chest=0;P.scan(field,rows,defs);
eq(P.available(field,'federation',2).length,2,'death drops held gun and mounted shield');
eq(P.available(field,'spacenoid',1).every(v=>v.uid===1),true);const foreignShield=Object.values(field.items).find(v=>v.kind==='shield');foreignShield.hp=3;
eq(P.claim(field,rows,defs,'federation',2,foreignShield.id),'');eq(target.st.sh.at(-1),3,'enemy shield HP transfers');
// A two-hand gun is one physical drop, not two copies.
source=row(1,unit('gm-sniper-ii'));source.st.hp.rightArm=0;field={items:{},seq:0};P.scan(field,[source],defs);eq(Object.values(field.items).filter(v=>v.kind==='weapon').length,1);
// Fresh base replacements must not delete the original ground item.
source=row(1,gundam);source.st.hp.rightArm=0;field={items:{},seq:0};P.scan(field,[source],defs);const original=Object.values(field.items)[0];source.st.eq.hands=[null,null];source.st.eq.dropped=[];source.st.eq.taken=[];P.scan(field,[source],defs);eq(field.items[original.id].status,'ground','replacement leaves old physical drop');
const {room,server,url}=await startTestServer();const post=async b=>(await(await fetch(url+'/api/sync',{method:'POST',body:JSON.stringify(b)})).json());
// Captured gear stays off the native sheet, preserves resources, and can drop again.
source=row(10,unit('banshee'),'spacenoid');target=row(20,unit('f91-gundam'));rows=[source,target];field={items:{},seq:0};
source.st.wpn[0]=2;source.st.hp.rightArm=0;P.scan(field,rows,defs);
const magnum=Object.values(field.items).find(v=>v.kind==='weapon'),native=structuredClone(unit('f91-gundam').weapons);
eq(P.claim(field,rows,defs,'federation',20,magnum.id),'','full native list accepts off-sheet equipment');
let derived=P.prepare(unit('f91-gundam'),target.st);eq(derived.weapons.filter(w=>!w.pickupId),native,'native rows and positions unchanged');
let index=derived.weapons.findIndex(w=>w.pickupId);eq(target.st.wpn[index],2,'cooldown travels unchanged');
const heldArm=E.arms[target.st.eq.hands.findIndex(r=>E.item(derived,r)?.key==='pickup-'+magnum.id)];
target.st.hp[heldArm]=0;P.scan(field,rows,defs);const redrop=Object.values(field.items).find(v=>v.team==='federation'&&v.kind==='weapon');
eq(!!redrop,true,'captured item can drop again');eq(redrop.values,[2]);eq(Object.values(field.items).filter(v=>v.status==='ground'&&v.name===magnum.name).length,1,'one physical item on ground');
eq(P.available(field,'federation',20)[0].uid,20,'own loss comes first');
target.st.hp[heldArm]=7;target.st.ap=0;eq(P.claim(field,rows,defs,'federation',20,redrop.id),'Not enough AP');target.st.ap=5;
target.st.wpn[index]=0;eq(P.claim(field,rows,defs,'federation',20,redrop.id),'');eq(target.st.wpn[index],2,'own recovery uses ground cooldown');
target.st.hp.rightArm=0;target.st.hp.leftArm=0;eq(P.claim(field,rows,defs,'federation',20,'missing'),'Already picked up');
source=row(10,gundam,'spacenoid');source.st.hp.chest=0;target=row(20,gm);rows=[source,target];field={items:{},seq:0};P.scan(field,rows,defs);
const deadShield=Object.values(field.items).find(v=>v.kind==='shield');deadShield.hp=0;eq(P.claim(field,rows,defs,'federation',20,deadShield.id),'Destroyed shields cannot be picked up');
const droppedGun=Object.values(field.items).find(v=>v.kind==='weapon');target.st.hp.rightArm=target.st.hp.leftArm=0;eq(P.claim(field,rows,defs,'federation',20,droppedGun.id),'Requires an intact arm');
try{
 const a=await post({action:'create',name:'Pickup A'}),b=await post({action:'join',code:'ABCDE',name:'Pickup B'}),sync=(p,writes={})=>post({action:'sync',...p,known:{},writes});
 const x=row(1,gundam,'spacenoid');x.st.hp.chest=0;const y=row(2,gm),z=row(3,gm);
 await sync(a,{player:{team:'federation'},team:{roster:[y,z].map(({uid,id})=>({uid,id}))},units:{'federation/2':{st:y.st},'federation/3':{st:z.st}}});
 await sync(b,{player:{team:'spacenoid'},team:{roster:[{uid:1,id:x.id}]},units:{'spacenoid/1':{st:x.st}}});await sync(a,{settings:{phase:'battle',first:'federation'}});
 const drop=Object.values(room.mem.get('battlefield').items).find(v=>v.kind==='weapon');
 const op={uid:2,itemId:drop.id,within10:true,requestId:'claim-one'};const result=await sync(a,{pickup:[op]});eq(result.denied,[],'claim allowed');
 eq(room.mem.get('unit/federation/2').st.ap,4);await sync(a,{pickup:[op]});eq(room.mem.get('unit/federation/2').st.ap,4,'retry idempotent');
 const race=await sync(a,{pickup:[{...op,uid:3,requestId:'claim-two'}]});eq(race.denied,['pickup:Already picked up'],'second unit cannot claim');eq(room.mem.get('unit/federation/3').st.ap,5);
 await sync(a,{units:{'federation/2':{st:y.st}}});eq(room.mem.get('unit/federation/2').st.ap,4,'stale AP protected');eq(room.mem.get('unit/federation/2').st.eq.loot.length,1,'stale inventory protected');
 const badTurn=await sync(b,{pickup:[{...op,uid:1,requestId:'wrong-turn'}]});eq(badTurn.denied,['pickup:Not allowed on this unit or turn']);
 const distant=await sync(a,{pickup:[{...op,within10:false,requestId:'no-range-confirm'}]});eq(distant.denied,['pickup:Not allowed on this unit or turn']);
 console.log('PASS '+checks+' pickup assertions');
}finally{await new Promise(r=>server.close(r));}
