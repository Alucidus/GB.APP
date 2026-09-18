/* Shared physical-item ledger. No UI or network dependencies. */
globalThis.GBPickups=(()=>{
 const E=globalThis.GBEquipment,clone=x=>JSON.parse(JSON.stringify(x));
 const weaponKey=(w,i)=>w.pickupId?'pickup:'+w.pickupId+':'+w.pickupProfile:w.name+(w.limit?':'+w.limit.kind:'');
 function definition(base,s){
  if(!base)return base;
  if(!s?.eq?.loot?.length)return base;
  const u=clone(base);u.equipment=clone(E.catalog(base));
  u.shields=u.shields||[];
  for(const v of s.eq.loot||[]){
   if(v.kind==='shield'){u.shields.push({...clone(v.cfg),captured:true,x:81+(u.shields.length%2)*13,y:66+Math.floor(u.shields.length/2)*14});continue;}
   const item={...clone(v.item),key:'pickup-'+v.id,count:1,rows:[],label:v.item.name};
   u.equipment.push(item);
   v.profiles.forEach((p,i)=>{const w={...clone(p),equipKey:item.key,equipmentId:item.key,pickupId:v.id,pickupProfile:i};delete w.boost;if(w.limit?.group)w.limit.group='pickup-'+v.id+'-'+w.limit.group;u.weapons.push(w);});
  }
  u.equipment.forEach(x=>{x.rows=u.weapons.map((w,i)=>w.equipKey===x.key?i:-1).filter(i=>i>=0);});
  return u;
 }
 function prepare(base,s){
  if(!E.supported(base))return base;
  if(!s.eq?.v)E.init(base,s);
  const u=definition(base,s),keys=u.weapons.map(weaponKey),old=s.wsig?.split('|');
  s.eq=s.eq||{};const values=s.eq.weaponValues||(s.eq.weaponValues={});
  if(old)old.forEach((k,i)=>{if(Number.isFinite(s.wpn?.[i]))values[k]=s.wpn[i];});
  else base.weapons.forEach((w,i)=>{if(Number.isFinite(s.wpn?.[i]))values[weaponKey(w,i)]=s.wpn[i];});
  s.wpn=keys.map((k,i)=>Number.isFinite(values[k])?values[k]:(u.weapons[i].limit?.kind==='charges'?u.weapons[i].limit.max:0));
  s.wsig=keys.join('|');return u;
 }
 const physicalShield=(u,s,i)=>!u.shields[i]?.when&&(!u.regen||u.shields[i]?.captured)&&(!u.ring||u.shields[i]?.captured)&&!/coating|nano|phase.shift/i.test(u.shields[i]?.label||'')&&!s.out?.[i];
 function scan(field,rows,defs){
  field.items=field.items||{};field.seq=field.seq||0;
  for(const r of rows){
   const base=defs.find(u=>u.id===r.id);if(!E.supported(base)||!r.st?.hp)continue;
   const s=r.st,u=prepare(base,s),e=E.init(u,s);e.ground=e.ground||{};e.taken=e.taken||[];
   const missing=[...e.dropped.map(ref=>({ref,kind:'weapon'})),...e.shieldDropped.filter(i=>physicalShield(u,s,i)).map(ref=>({ref,kind:'shield'}))];
   const keys=missing.map(d=>d.kind+':'+d.ref);
   for(const key of Object.keys(e.ground))if(!keys.includes(key)){delete e.ground[key];e.taken=e.taken.filter(k=>k!==key);}
   for(const d of missing){
    const key=d.kind+':'+d.ref;if(e.ground[key])continue;
    const item=d.kind==='weapon'?E.item(u,d.ref):null;if(d.kind==='weapon'&&(!item||item.mount!=='hand'))continue;
    const id='drop'+(++field.seq),v={id,team:r.team,uid:r.uid,unitId:r.id,ref:d.ref,kind:d.kind,name:item?.name||u.shields[d.ref]?.label||'Shield',status:'ground'};
    if(item){v.item=clone(item);v.profiles=item.rows.map(i=>clone(u.weapons[i]));v.values=item.rows.map(i=>s.wpn[i]||0);if(!v.profiles.length){const original=E.catalog(base).find(x=>x.key===item.key);if(original){v.profiles=original.rows.map(i=>clone(base.weapons[i]));v.values=original.rows.map(i=>e.weaponValues[weaponKey(base.weapons[i],i)]||0);}}}
    else {v.cfg=clone(u.shields[d.ref]);v.hp=s.sh[d.ref];v.max=s.shMax?.[d.ref]??v.cfg.hp;v.down=s.shDown?.[d.ref]||0;}
    e.ground[key]=id;field.items[id]=v;s.pickupRevision=(s.pickupRevision||0)+1;
   }
  }return field;
 }
 function available(field,team,uid){return Object.values(field.items||{}).filter(v=>v.status==='ground').sort((a,b)=>Number(b.team===team&&b.uid===uid)-Number(a.team===team&&a.uid===uid)||Number(b.team===team)-Number(a.team===team)||a.id.localeCompare(b.id,undefined,{numeric:true}));}
 function claim(field,rows,defs,team,uid,id,replace=null){
  const v=field.items?.[id],r=rows.find(r=>r.team===team&&r.uid===uid),base=defs.find(u=>u.id===r?.id);
  if(!v||v.status!=='ground')return 'Already picked up';if(!r||!E.supported(base))return 'Select a mobile suit';
  const s=r.st,u=prepare(base,s),e=E.init(u,s),key=v.kind+':'+v.ref;
  if(!(s.hp[base.kill||'chest']>0))return 'Unit destroyed';if(s.ap<1)return 'Not enough AP';if(e.segment)return 'Finish the melee segment first';if(!E.arms.some(a=>s.hp[a]>0))return 'Requires an intact arm';
  if(v.kind==='shield'&&(!(v.hp>0)||v.down===-1))return 'Destroyed shields cannot be picked up';
  if(replace)return 'Pickup does not replace your weapon list';
  const own=v.team===team&&v.uid===uid&&e.ground?.[key]===id&&!e.taken.includes(key);
  if(own){
   if(v.kind==='shield'){s.sh[v.ref]=v.hp;s.shDown[v.ref]=v.down;}
   else {const x=E.item(u,v.ref);x.rows.forEach((i,j)=>{s.wpn[i]=v.values[j];e.weaponValues[weaponKey(u.weapons[i],i)]=v.values[j];});}
   const why=E.recover(prepare(base,s),s,v.ref,v.kind==='shield');if(why)return why;
  }else if(v.kind==='weapon'){
   e.loot=e.loot||[];e.loot.push({id:v.id,kind:'weapon',item:clone(v.item),profiles:clone(v.profiles)});
   const nu=definition(base,s),x=E.item(nu,'pickup-'+v.id);v.profiles.forEach((p,i)=>{e.weaponValues['pickup:'+v.id+':'+i]=v.values[i];});
   prepare(base,s);s.ap--;
   const arm=E.arms.find((a,i)=>s.hp[a]>0&&!e.hands[i]);
   if(arm&&(!x.twoHands||E.arms.every((a,i)=>s.hp[a]>0&&!e.hands[i]))&&(!x.exclusive||e.hands.every(r=>!r))&&!e.hands.some(r=>E.item(nu,r)?.exclusive||E.item(nu,r)?.twoHands))E.equip(nu,s,x.key,arm,true);
  }else{
   const i=u.shields.length;e.loot=e.loot||[];e.loot.push({id:v.id,kind:'shield',cfg:clone(v.cfg)});
   s.sh[i]=v.hp;s.shMax=s.shMax||u.shields.map(c=>c.hp);s.shMax[i]=v.max;s.shDown=s.shDown||[];s.shDown[i]=v.down;
   e.shields[i]=E.arms.find(a=>s.hp[a]>0&&E.shieldAt(definition(base,s),s,a)<0)||null;s.ap--;
  }
  const owner=rows.find(r=>r.team===v.team&&r.uid===v.uid);
  if(!own&&owner?.st.eq?.ground?.[key]===id){owner.st.eq.taken=[...new Set([...(owner.st.eq.taken||[]),key])];owner.st.pickupRevision=(owner.st.pickupRevision||0)+1;}
  v.status='claimed';v.claimedBy={team,uid};if(own)delete e.ground[key];s.pickupRevision=(s.pickupRevision||0)+1;return '';
 }
 return {definition,prepare,scan,claim,available,weaponKey};
})();
