import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
const root=new URL('../',import.meta.url),ctx=vm.createContext({});
vm.runInContext(fs.readFileSync(new URL('public/data.js',root),'utf8')+fs.readFileSync(new URL('public/equipment.js',root),'utf8')+';this.units=UNITS;this.M=MSE;',ctx);
const {M,units}=ctx,rows=JSON.parse(fs.readFileSync(new URL('fixtures/saber-counts-cf117.json',import.meta.url),'utf8'));
let checks=0;const check=(v,message)=>{assert.ok(v,message);checks++;};
const state=u=>({hp:{...u.limb},ap:10,sh:(u.shields||[]).map(x=>x.hp),shDown:[],track:u.abilities.map(()=>0),wpn:u.weapons.map(()=>2)});
for(const entry of rows){
 const u=units.find(u=>u.id===entry.id),w=u.weapons.find(w=>w.name===entry.weapon),x=M.item(u,w.equipKey),s=state(u);M.init(u,s);
 check(x.count===entry.copies,'verified physical count '+u.id);
 const expectedName=(entry.weapon.startsWith('GN ')?'GN ':'')+'Beam Saber';
 check(w.label===expectedName+(entry.copies>1?' ×'+entry.copies:''),'consistent inventory label '+u.id);
 check(x.name===expectedName,'individual equipped copy has singular name '+u.id);
 const untouched=JSON.stringify([s.hp,s.sh,s.wpn,s.track]);
 check(!M.equip(u,s,x.key,'rightArm'),'first saber equips '+u.id);
 const firstRef=s.eq.hands[0];
 check(s.ap===10-x.cost,'first copy equip cost retained');
 check(!M.equip(u,s,x.key,'leftArm'),'saber selectable in other hand');
 if(entry.copies===2){
  check(new Set(s.eq.hands).size===2&&s.eq.hands.every(r=>M.item(u,r)?.key===x.key),'two separate saber copies');
  check(s.eq.hands[0]===firstRef,'second copy does not move first');
 }else check(s.eq.hands[0]===null&&s.eq.hands[1]===firstRef,'one-copy unit moves its only saber');
 check(s.ap===10-2*x.cost,'second assignment charges existing cost');
 check(JSON.stringify([s.hp,s.sh,s.wpn,s.track])===untouched,'quantity never changes damage/cooldowns/shields');
 const saved=JSON.stringify(s);M.init(u,s);check(JSON.stringify(s)===saved,'reopen preserves hand references and AP');
 if(entry.before===1&&entry.copies===2){
  // A cf116 save with the original copy dropped must keep that loss on upgrade.
  const old=state(u);M.init(u,old);old.eq.hands=[x.key+'#0',null];old.hp.rightArm=0;old.eq.dropped=[x.key+'#0'];old.ap=3;
  M.init(u,old); // Normalize pre-existing arm/shield-loss bookkeeping before saving.
  const snapshot=JSON.stringify(old);M.init(u,old);check(JSON.stringify(old)===snapshot,'old save migrated without resetting resources: '+u.id);
  check(!M.equip(u,old,x.key,'leftArm'),'newly modelled second copy available');
  check(old.eq.hands[1]===x.key+'#1'&&old.eq.dropped.includes(x.key+'#0'),'does not resurrect or move dropped first copy');
 }
}
for(const [id,count] of [['gundam-ex',2],['nu-gundam-rx-93',1],['unicorn-gundam-02-banshee-norn-rx-0-n',1],['unicorn-gundam-luminous-crystal-body',1],['unicorn-gundam-03-phenex-rx-0-n',2],['wing-zero-custom-xxxg-00w0',2],['nightingale-msn-04ii',1]]){
 const u=units.find(u=>u.id===id),x=M.catalog(u).find(x=>/Saber/.test(x.name));check(x.count===count,'deferred special case preserved '+id);
}
console.log('PASS '+checks+' saber quantity/state assertions');
