import '../public/supplies.js';
const Q=globalThis.GBSupplies;
export function protectSupply(data,previous) {
  if(!data.st?.sq)return data;
  const q=data.st.sq.qr||(data.st.sq.qr={});
  if(previous?.st?.sq){
    const old=structuredClone(previous.st.sq.qr||{});Q.normalize(old);
    q.items=old.items;q.supplyVersion=2;
    if(old.resupply)q.resupply=old.resupply;else delete q.resupply;
  }else Q.normalize(q);
  delete q.abRound;return data;
}
export async function serviceSupplies(M,oldTurn) {
  const tk=M.get('turn');let changed=false;
  for(const team of ['federation','spacenoid']){
    const roster=M.get('team/'+team)?.roster;
    const active=Array.isArray(roster)?new Set(roster.map(r=>r.uid)):null;
    const units=M.keys('unit/'+team+'/').map(k=>({k,uid:+k.split('/')[2],d:M.get(k)}));
    const carriers=new Map();
    for(const x of units){
      if(active&&!active.has(x.uid))continue;
      const id=roster?.find(r=>r.uid===x.uid)?.id||x.d.id;
      const capacity=/^ground-(car|heli)-/.test(id)?1:/^ground-transport-/.test(id)?2:0;
      if(!capacity||!(x.d.st?.hp?.hp>0))continue;
      for(const uid of (x.d.st.gv?.carry||[]).slice(0,capacity)){
        // Ambiguous double carriage must not grant service.
        carriers.set(uid,carriers.has(uid)?null:{uid:x.uid,boarding:x.d.st.gv.boardings?.[uid]||'legacy'});
      }
    }
    for(const x of units){
      if(!x.d.st?.sq)continue;
      const d=structuredClone(x.d),q=d.st.sq.qr||(d.st.sq.qr={}),c=d.st.hp?.hp>0&&(!active||active.has(x.uid))?carriers.get(x.uid):null;
      Q.reconcile(q,c?.uid,c?.boarding);
      // Only an actual official turn transition can advance service.
      if(tk&&oldTurn&&tk.seq!==oldTurn.seq&&tk.active===team)Q.start(q,tk.seq);
      if(JSON.stringify(d)!==JSON.stringify(x.d)){await M.set(x.k,d);changed=true;}
    }
  }
  return changed;
}
export async function spendSupply(M,team,uid,item) {
  if(item==='none')return true;
  if(!(item in Q.max))return false;
  const key='unit/'+team+'/'+uid,old=M.get(key);
  if(!old?.st?.sq||!(old.st.hp?.hp>0))return false;
  const d=structuredClone(old),q=d.st.sq.qr||(d.st.sq.qr={});Q.normalize(q);
  if(q.resupply||q.items[item]<1)return false;
  q.items[item]--;await M.set(key,d);return true;
}
