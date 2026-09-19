/* Shared offline/server sortie ledger. Observe each owned, piloted copy once per
   match; keep loss receipts so repairing cannot replay an old destruction. */
globalThis.GBPilotService=(()=>{
 const validId=id=>typeof id==='string'&&/^[a-zA-Z0-9-]{8,80}$/.test(id);
 function observe(previous,match,rows,seats,lookup,newId=()=>crypto.randomUUID()){
  const state=structuredClone(previous||{flights:{},events:[]});
  if(state.match!==match){state.match=match;state.flights={};}
  const byKey=new Map(rows.map(r=>[r.key,r]));
  for(const {pilot,key} of seats){
   const row=byKey.get(key);if(!row||!validId(pilot?.id)||!pilot.campaign?.units?.[row.id])continue;
   const id=pilot.id+':'+key;
   if(!state.flights[id])state.flights[id]={key,unitId:row.id,pilotId:pilot.id,lost:false};
  }
  for(const flight of Object.values(state.flights)){
   const row=byKey.get(flight.key),unit=lookup(flight.unitId);
   if(!flight.lost&&row?.id===flight.unitId&&unit&&row.st?.hp?.[unit.kill||'chest']===0){
    flight.lost=true;state.events.push({id:newId(),pilotId:flight.pilotId,unitId:flight.unitId,at:Date.now()});
   }
  }
  state.events=state.events.slice(-200);return state;
 }
 function apply(current,pilotId,events,lookup){
  const c=structuredClone(current),seen=new Set(c.lossReceipts||[]);let changed=false;
  for(const e of events||[]){if(e.pilotId!==pilotId||!validId(e.id)||seen.has(e.id))continue;
   seen.add(e.id);changed=true;const unit=lookup(e.unitId),owned=c.units[e.unitId];
   if(!unit||!owned)continue;owned.destroyed=true;c.history.push({at:e.at,text:'Destroyed in battle: '+unit.name});
  }
  if(!changed)return null;c.lossReceipts=[...seen].slice(-512);c.history=c.history.slice(-200);return c;
 }
 return {validId,observe,apply};
})();
