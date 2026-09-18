/* Deterministic service scheduler, shared by offline play and the room. */
globalThis.GBRepairs = (() => {
  const ships={ 'rewloola-class-battleship':{hangar:4},'ra-cailum-class-battleship':{hangar:6} };
  const eligible=u=>!!u&&!u.type&&!!u.limb;
  const dead=(u,s)=>!s.hp||!(s.hp[u.kill||'chest']>0);
  const shieldOK=(u,s,i)=>(!u.regen||u.shields[i].captured)&&!u.shields[i].when&&!/coating|nano|phase.shift/i.test(u.shields[i].label||'')&&!s.out?.[i];
  function needs(u,s){
    return Object.entries(u.limb).some(([k,max])=>s.hp[k]>0&&s.hp[k]<max)||
      (u.shields||[]).some((c,i)=>shieldOK(u,s,i)&&Number.isFinite(s.sh?.[i])&&(s.sh[i]<(s.shMax?.[i]??c.hp)||s.eq?.shieldDropped?.includes(i)))||!!s.eq?.dropped?.length;
  }
  function heal(u,s,tier){
    const limb=tier===2?4:2,shield=tier===2?12:5;
    for(const [k,max] of Object.entries(u.limb))if(s.hp[k]>0&&s.hp[k]<max)s.hp[k]=Math.min(max,s.hp[k]+limb);
    (u.shields||[]).forEach((c,i)=>{if(shieldOK(u,s,i)&&Number.isFinite(s.sh?.[i])){
      s.sh[i]=Math.max(s.sh[i],Math.min(s.shMax?.[i]??c.hp,s.sh[i]+shield));
      if(s.shDown)s.shDown[i]=0;
      if(s.eq?.shieldDropped)s.eq.shieldDropped=s.eq.shieldDropped.filter(n=>n!==i);
      if(s.eq?.taken)s.eq.taken=s.eq.taken.filter(k=>k!=='shield:'+i);
    }});
    if(s.eq?.dropped?.length){
      const lost=s.eq.dropped;
      s.eq.hands=s.eq.hands.map(r=>lost.includes(r)?null:r);
      s.eq.dropped=[]; // replacement goes into inventory; never auto-equips or restores a lost arm
      s.eq.taken=(s.eq.taken||[]).filter(k=>!k.startsWith('weapon:'));
    }
  }
  function process(rows,defs,tick,advance=false){
    const before=JSON.stringify(rows.map(r=>r.st)),groups=new Map(),carried=new Map(),docking=new Set(),healed=[];
    for(const r of rows)if(r.st.ship){
      const ship=r.st.ship;
      // Destruction cancels all eligibility even before emergency disembark is resolved.
      if(!(r.st.hp?.hull>0))continue;
      for(const d of ship.docking||[])docking.add(d.uid);
      for(const uid of ship.carry||[])carried.set(uid,{r,tier:ships[r.id]?2:null});
    }
    for(const r of rows){
      const base=defs.find(u=>u.id===r.id),u=globalThis.GBPickups?.definition(base,r.st)||base;if(!eligible(u))continue;
      const s=r.st,a=s.repair||(s.repair={}),c=carried.get(r.uid);
      if(dead(u,s)){delete a.entry;delete a.live;continue;}
      if(docking.has(r.uid)){delete a.entry;a.live={status:'Docking',source:null};continue;}
      let source=null,tier=0;
      if(c){delete a.entry;if(c.tier===2){source='ship:'+c.r.uid+':'+(c.r.st.ship.repairBoardings?.[r.uid]||'initial');tier=2;}}
      else if(a.entry&&a.owner)source='base:'+a.owner+':'+a.entry;
      if(!source){delete a.live;continue;}
      const group=tier===2?'ship:'+c.r.uid:'base:'+a.owner;
      if(!a.live||a.live.source!==source)a.live={source,status:'Waiting',since:null,last:null};
      if(!needs(u,s)){a.live.status='Ready';a.live.since=null;continue;}
      const priority=tier===2?c.r.st.ship.repairPriority?.[r.uid]:a.priority;
      const list=groups.get(group)||[];list.push({r,u,a,tier,priority});groups.set(group,list);
    }
    for(const list of groups.values()){
      list.sort((a,b)=>(a.priority||0)-(b.priority||0)||a.r.uid-b.r.uid);
      const capacity=list[0].tier===2?3:1;
      list.forEach(({r,u,a,tier},i)=>{
        const l=a.live;
        if(i>=capacity){l.status='Waiting';l.since=null;return;}
        l.status='Repairing';
        if(l.since===null||l.since===undefined){l.since=tick;return;}
        if(advance&&tick>l.since&&l.last!==tick){
          heal(u,r.st,tier);l.last=tick;l.since=tick;r.st.repairRevision=(r.st.repairRevision||0)+1;healed.push(r.uid);
          if(!needs(u,r.st)){l.status='Ready';l.since=null;}
        }
      });
    }
    return {changed:before!==JSON.stringify(rows.map(r=>r.st)),healed};
  }
  return {ships,eligible,dead,needs,heal,process};
})();
