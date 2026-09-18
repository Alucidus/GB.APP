import '../public/data.js';import '../public/equipment.js';import '../public/pickups.js';
const P=globalThis.GBPickups,defs=globalThis.GBRepairUnits;
export function protectPickup(data,old){
 if(!data.st||!old?.st)return data;
 if((data.st.pickupRevision||0)!==(old.st.pickupRevision||0)){
  for(const k of ['eq','wpn','wsig','sh','shMax','shDown','ap','pickupRevision'])if(old.st[k]!==undefined)data.st[k]=structuredClone(old.st[k]);
 }else if(data.st.eq&&old.st.eq){
  for(const k of ['loot','ground','taken']){if(old.st.eq[k]!==undefined)data.st.eq[k]=structuredClone(old.st.eq[k]);else delete data.st.eq[k];}
 }
 return data;
}
export async function servicePickups(M,ops,pid,team,canWrite,denied){
 let field=structuredClone(M.get('battlefield')||{seq:0,items:{},receipts:{}}),rows=[];
 for(const t of ['federation','spacenoid'])for(const r of M.get('team/'+t)?.roster||[]){const st=M.get('unit/'+t+'/'+r.uid)?.st;if(st?.hp)rows.push({...r,team:t,st:structuredClone(st)});}
 P.scan(field,rows,defs);
 for(const op of (Array.isArray(ops)?ops:[]).slice(0,4)){
  const receipt=pid+':'+op.requestId;
  if(field.receipts?.[receipt])continue;
  if(typeof op.requestId!=='string'||op.requestId.length>80||!op.within10||!canWrite(op.uid)||M.get('turn')?.active!==team){denied.push('pickup:Not allowed on this unit or turn');continue;}
  const nextField=structuredClone(field),nextRows=structuredClone(rows);
  const why=P.claim(nextField,nextRows,defs,team,op.uid,op.itemId,op.replace||null);
  if(why){denied.push('pickup:'+why);continue;}
  field=nextField;rows=nextRows;field.receipts=field.receipts||{};field.receipts[receipt]=true;
  const keys=Object.keys(field.receipts);if(keys.length>300)delete field.receipts[keys[0]];
 }
 let changed=false;
 for(const r of rows){const k='unit/'+r.team+'/'+r.uid,old=M.get(k);if(JSON.stringify(old.st)!==JSON.stringify(r.st)){await M.set(k,{...old,st:r.st});changed=true;}}
 if(JSON.stringify(field)!==JSON.stringify(M.get('battlefield'))){await M.set('battlefield',field);changed=true;}
 return changed;
}
