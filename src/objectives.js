import '../public/objectives.js';
const O=globalThis.GBObjectives;
export async function serviceObjectives(M,ops,pid,team,canWrite,denied){
 const before=M.get('objectives'),f=O.init(structuredClone(before||{})),rows=[];
 for(const t of ['federation','spacenoid'])for(const r of M.get('team/'+t)?.roster||[]){const u=M.get('unit/'+t+'/'+r.uid);if(u?.st)rows.push({...r,team:t,st:structuredClone(u.st)});}
 O.scan(f,rows);const fights=M.keys('ff/').map(k=>M.get(k));O.fights(f,rows,fights);
 for(const op of (Array.isArray(ops)?ops:[]).slice(0,4)){
  if(!op||typeof op.requestId!=='string'||op.requestId.length>80||!op.confirmed||!canWrite(op.uid)){denied.push('objective:You do not control this unit.');continue;}
  const receipt=pid+':'+op.requestId;if(f.receipts[receipt])continue;
  const item=f.items[op.id];
  const busy=fights.some(g=>g.hasObjective!==false&&!['closed','declined','invite'].includes(g.state)&&((item&&f.fights[g.id]?.id===item.id)|| (item&&O.clean(g.eng?.obj).toLowerCase()===item.name.toLowerCase())));
  if(busy){denied.push('objective:Finish the objective firefight or disengagement first.');continue;}
  const why=O.act(f,rows,team,op);if(why){denied.push('objective:'+why);continue;}f.receipts[receipt]=true;
 }
 const receipts=Object.keys(f.receipts);for(const k of receipts.slice(0,-300))delete f.receipts[k];
 let changed=false;for(const r of rows){const k='unit/'+r.team+'/'+r.uid,old=M.get(k);if(JSON.stringify(old.st)!==JSON.stringify(r.st)){await M.set(k,{...old,st:r.st});changed=true;}}
 if(JSON.stringify(before)!==JSON.stringify(f)){await M.set('objectives',f);changed=true;}return changed;
}
