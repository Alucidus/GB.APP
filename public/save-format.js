/* Portable device saves. No cookies, multiplayer seats, or arbitrary storage keys. */
globalThis.GBSave=(()=>{
 const FORMAT='gunpla-battle-save',VERSION=2,MAX=8*1024*1024,JOURNAL='gb.save.import-journal.v1';
 const KEYS=['msb.state.v4','gb.pilot.v1','gb.effects','gb.mute','msb.tab','gb.clashSeen','gb.pilot.avatar.v1'];
 const prefs={'gb.effects':['auto','full','lite'],'gb.mute':['0','1'],'msb.tab':['suits','ships','ground'],'gb.clashSeen':['0','1']};
 const obj=x=>!!x&&typeof x==='object'&&!Array.isArray(x),fail=m=>{throw Error(m);};
 const number=(v,where,max=1e9)=>{if(typeof v!=='number'||!Number.isFinite(v)||Math.abs(v)>max)fail('Invalid number: '+where);};
 function tree(v,depth=0,count={n:0}){
  if(depth>50||++count.n>250000)fail('Save data is too complex.');
  if(v===null||typeof v==='boolean')return;
  // Stored event times use milliseconds since 1970; retain tighter bounds for HP/AP below.
  if(typeof v==='number'){number(v,'save data',Number.MAX_SAFE_INTEGER);return;}
  if(typeof v==='string'){if(v.length>100000)fail('A save field is too long.');return;}
  if(typeof v!=='object')fail('Invalid save data.');
  for(const [k,x] of Object.entries(v)){if(['__proto__','prototype','constructor'].includes(k))fail('Unsafe save field.');tree(x,depth+1,count);}
 }
 function safeBattle(v,key=''){
  if(typeof v==='string'&&(/<|javascript\s*:|data:text/i.test(v)||(!['name','t','reason','objName'].includes(key)&&/["`]/.test(v))))fail('Battle data contains unsupported markup.');
  if(v&&typeof v==='object')for(const [k,x] of Object.entries(v)){if(/[<>"'`]/.test(k))fail('Unsupported battle field.');safeBattle(x,k);}
 }
 function validate(data,unitLookup,pilotValid){
  if(!obj(data)||data.format!==FORMAT)fail('This is not a Gunpla Battle save file.');
  if(![1,VERSION].includes(data.version))fail('Unsupported save version. Update the app before importing this file.');
  tree(data);
  if(typeof data.createdAt!=='string'||!Number.isFinite(Date.parse(data.createdAt)))fail('The save date is invalid.');
  if(typeof data.build!=='string'||!/^cf\d+$/.test(data.build))fail('The build identifier is invalid.');
  if(data.pilot!==null&&(!obj(data.pilot)||!pilotValid(data.pilot)))fail('The pilot appearance or identity data is invalid.');
  if(!obj(data.preferences))fail('Preferences are invalid.');
  for(const [k,v] of Object.entries(data.preferences))if(!prefs[k]?.includes(v))fail('Unsupported preference: '+k);
  const b=data.battle;
  if(b!==null){
   if(!obj(b)||!['federation','spacenoid'].includes(b.side)||!obj(b.teams))fail('Offline battle data is invalid.');safeBattle(b);
   for(const team of ['federation','spacenoid']){const t=b.teams[team];if(t==null)continue;
    if(!obj(t)||!Array.isArray(t.roster)||t.roster.length>500||typeof t.locked!=='boolean')fail('Invalid '+team+' roster.');
    number(t.budget,'budget');if(t.budget<0)fail('Budget cannot be negative.');
    if(!Number.isInteger(t.nextUid)||t.nextUid<1)fail('Invalid unit counter.');
    if(!obj(t.turn)||!Number.isInteger(t.turn.round)||t.turn.round<0||!['you','enemy'].includes(t.turn.phase)||!Array.isArray(t.turn.done)||!Array.isArray(t.turn.log))fail('Invalid turn data.');
    const ids=new Set();for(const r of t.roster){if(!obj(r)||!Number.isInteger(r.uid)||r.uid<1||ids.has(r.uid)||r.uid>=t.nextUid)fail('Invalid or duplicate roster unit.');ids.add(r.uid);
     const u=unitLookup(r.id);if(!u)fail('Unknown unit '+r.id+'. Update the app before importing.');
     if(!obj(r.st)||!obj(r.st.hp))fail('Missing health state for '+r.id);number(r.st.ap,'unit AP');
     if(r.st.cosmeticNTD!==undefined&&typeof r.st.cosmeticNTD!=='boolean')fail('Invalid appearance state.');
     for(const k of Object.keys(u.limb||{})){number(r.st.hp[k],'unit HP');if(r.st.hp[k]<0)fail('HP cannot be negative.');}
     for(const k of ['sh','shMax','shDown','wpn'])if(r.st[k]!=null&&(!Array.isArray(r.st[k])||r.st[k].some(n=>typeof n!=='number'||!Number.isFinite(n))))fail('Invalid equipment counters.');
     if(u.gtype==='squad'&&(!obj(r.st.sq)||!Array.isArray(r.st.sq.soldiers)||r.st.sq.soldiers.length!==8||r.st.sq.soldiers.some(s=>!obj(s)||!['rifleman','mg','sniper','shield','armor','recon'].includes(s.r)||typeof s.hp!=='number')))fail('Invalid infantry squad.');
     if(u.type==='ground'&&u.gtype!=='squad'&&!obj(r.st.gv))fail('Missing vehicle state.');
     if(u.ship&&!obj(r.st.ship))fail('Missing ship state.');
     if(r.st.assignedPilot&&(!obj(r.st.assignedPilot)||typeof r.st.assignedPilot.name!=='string'||(r.st.assignedPilot.portrait&&!/^data:image\/webp;base64,[A-Za-z0-9+/=]+$/.test(r.st.assignedPilot.portrait))))fail('Invalid assigned pilot.');
    }
   }
   for(const key of ['battlefield','objectives'])if(b[key]!=null&&(!obj(b[key])||!obj(b[key].items)))fail('Invalid '+key+' records.');
   for(const [id,o] of Object.entries(b.objectives?.items||{})){if(!obj(o)||o.id!==id||typeof o.name!=='string'||!Number.isInteger(o.rev)||!Array.isArray(o.history))fail('Invalid objective.');if(o.holder&&!b.teams[o.holder.team]?.roster.some(r=>r.uid===o.holder.uid))fail('An objective references a missing carrier.');}
  }
  return {format:FORMAT,version:VERSION,createdAt:data.createdAt,build:data.build,pilot:data.pilot,battle:data.battle,preferences:data.preferences};
 }
 function parse(text,lookup,pilotValid){if(new TextEncoder().encode(text).length>MAX)fail('Save files must be smaller than 8 MB.');let data;try{data=JSON.parse(text);}catch{fail('This file is not valid JSON.');}return validate(data,lookup,pilotValid);}
 function strip(v){if(Array.isArray(v))return v.map(strip);if(!obj(v))return v;const r={};for(const [k,x] of Object.entries(v)){if(['token','password','sessionSecret','SESSION_SECRET','SITE_PASSWORD'].includes(k))continue;r[k]=k==='receipts'?{}:strip(x);}return r;}
 function make(build,pilot,battle,preferences){return {format:FORMAT,version:VERSION,createdAt:new Date().toISOString(),build,pilot,battle:strip(battle),preferences};}
 function recover(storage){const raw=storage.getItem(JOURNAL);if(!raw)return false;const journal=JSON.parse(raw);if(!obj(journal.before))fail('Import recovery data is invalid.');for(const k of KEYS){const v=journal.before[k];if(v==null)storage.removeItem(k);else if(typeof v==='string')storage.setItem(k,v);else fail('Import recovery data is invalid.');}storage.removeItem(JOURNAL);return true;}
 function commit(storage,data){
  const before=Object.fromEntries(KEYS.map(k=>[k,storage.getItem(k)]));
  storage.setItem(JOURNAL,JSON.stringify({before})); // Failure here leaves all existing saves intact.
  try{for(const k of KEYS)storage.removeItem(k);
   if(data.pilot)storage.setItem('gb.pilot.v1',JSON.stringify(data.pilot));
   if(data.battle)storage.setItem('msb.state.v4',JSON.stringify(data.battle));
   for(const [k,v] of Object.entries(data.preferences))storage.setItem(k,v);
   storage.removeItem(JOURNAL);
  }catch(e){try{recover(storage);}catch{throw Error('Import interrupted. Reload to recover your previous save.');}throw Error('Import failed; your previous save was restored. Storage may be full.');}
 }
 return {MAX,KEYS,prefs,parse,validate,make,commit,recover};
})();
// Recover an interrupted import before the app or pilot reads local state.
try{GBSave.recover(localStorage);}catch(e){globalThis.GBSaveRecoveryError=e.message;}
