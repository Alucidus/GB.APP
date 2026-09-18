/* Shared Quick Resolve inventory and uninterrupted transport service rules. */
globalThis.GBSupplies = (() => {
  const max = Object.freeze({fb:2,sm:2,gr:2});
  const fresh = () => ({...max});
  function normalize(q) {
    // Missing old inventory is unknown, not permission to replenish it.
    const it=q.items||{};
    q.items=Object.fromEntries(Object.keys(max).map(k=>[k,Number.isFinite(it[k])?Math.max(0,Math.min(2,Math.floor(it[k]))):0]));
    if(q.supplyVersion!==2){delete q.resupply;delete q.abRound;q.supplyVersion=2;}
    return q;
  }
  function reconcile(q,carrier,boarding) {
    normalize(q);
    if(!carrier){delete q.resupply;return;}
    if(!q.resupply||q.resupply.carrier!==carrier||q.resupply.boarding!==boarding)
      q.resupply={carrier,boarding,firstStart:null,completed:null};
  }
  function start(q,tick) {
    const p=q.resupply;if(!p||!Number.isInteger(tick))return false;
    if(p.firstStart===null){p.firstStart=tick;return false;}
    if(tick<=p.firstStart)return false;
    const spent=Object.keys(max).some(k=>q.items[k]<max[k]);
    q.items=fresh();p.firstStart=tick;p.completed=tick;return spent;
  }
  return {max,fresh,normalize,reconcile,start};
})();
