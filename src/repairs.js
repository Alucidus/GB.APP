import '../public/data.js';
import '../public/repairs.js';
const R=globalThis.GBRepairs;
export function protectRepairs(data,old,pid,leader,players,team,unitId){
  if(!data.st)return data;
  const st=data.st,prev=old?.st;
  if(st.ship&&prev?.ship&&(st.ship.repairTransitRevision||0)!==(prev.ship.repairTransitRevision||0)){
    for(const k of ['carry','docking','aboard','repairBoardings','repairTransitRevision'])if(prev.ship[k]!==undefined)st.ship[k]=structuredClone(prev.ship[k]);
  }
  if(!R.eligible(globalThis.GBRepairUnits.find(u=>u.id===unitId))&&!prev?.repair)return data;
  st.repair=st.repair||{};
  const requested=st.repair.owner,previous=prev?.repair?.owner;
  st.repair.owner=previous||leader||pid;
  if(pid===leader&&players[requested]?.team===team)st.repair.owner=requested;
  if(pid!==st.repair.owner){if(prev?.repair?.entry)st.repair.entry=prev.repair.entry;else delete st.repair.entry;st.repair.priority=prev?.repair?.priority||0;}
  // Clients declare location/priority, but cannot advance their own repair clock.
  if(prev?.repair?.live)st.repair.live=structuredClone(prev.repair.live);else delete st.repair.live;
  if(prev&&(st.repairRevision||0)!==(prev.repairRevision||0)){
    for(const k of ['hp','sh','shDown','eq'])if(prev[k]!==undefined)st[k]=structuredClone(prev[k]);
  }
  st.repairRevision=prev?.repairRevision||0;return data;
}
export async function serviceRepairs(M,oldTurn,leaders){
  const tk=M.get('turn');let changed=false;
  for(const team of ['federation','spacenoid']){
    const members=M.get('team/'+team)?.roster||[],rows=members.map(r=>({uid:r.uid,id:r.id,st:structuredClone(M.get('unit/'+team+'/'+r.uid)?.st||{})})).filter(r=>r.st.hp);
    const advancing=!!(tk&&oldTurn&&tk.seq!==oldTurn.seq&&tk.active===team);
    const tick=tk?.seq||0;
    for(const r of rows){
      const u=globalThis.GBRepairUnits.find(u=>u.id===r.id);
      if(R.eligible(u)){r.st.repair=r.st.repair||{};r.st.repair.owner=r.st.repair.owner||leaders[team];}
      if(advancing&&r.st.ship&&r.st.hp.hull>0){
        const s=r.st.ship,capacity=R.ships[r.id]?.hangar||2;
        s.repairBoardings=s.repairBoardings||{};s.carry=s.carry||[];
        if(s.docking?.length)s.repairTransitRevision=(s.repairTransitRevision||0)+1;
        for(const d of s.docking||[]){
          const suit=rows.find(x=>x.uid===d.uid),def=globalThis.GBRepairUnits.find(x=>x.id===suit?.id);
          if(suit&&def&&!R.dead(def,suit.st)&&!s.carry.includes(d.uid)&&s.carry.length<capacity){s.carry.push(d.uid);s.repairBoardings[d.uid]='dock:'+tick;}
        }
        s.docking=[];s.aboard=s.carry.length;
      }
    }
    R.process(rows,globalThis.GBRepairUnits,tick,advancing);
    for(const r of rows){const key='unit/'+team+'/'+r.uid,old=M.get(key);if(JSON.stringify(r.st)!==JSON.stringify(old.st)){await M.set(key,{...old,st:r.st});changed=true;}}
  }
  return changed;
}
