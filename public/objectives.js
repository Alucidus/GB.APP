/* Shared objective rules: the ledger owns possession; unit markers are projections. */
(function(root){
 const clean=s=>String(s||'').replace(/[\u0000-\u001f<>]/g,'').trim().slice(0,40);
 const eligible=r=>!!r&&/^ground-(squad|tank|car|heli|transport)-(fed|spa)$/.test(r.id);
 const alive=r=>eligible(r)&&r.st?.hp?.hp>0;
 const same=(a,b)=>!!a&&!!b&&a.team===b.team&&a.uid===b.uid;
 const init=f=>{f.seq=f.seq||0;f.items=f.items||{};f.migrated=f.migrated||{};f.receipts=f.receipts||{};f.fights=f.fights||{};return f;};
 const byName=(f,n)=>Object.values(f.items).find(o=>o.name.toLowerCase()===clean(n).toLowerCase());
 function add(f,name){const id='obj-'+(++f.seq);return f.items[id]={id,name:clean(name)||'Objective',holder:null,rev:0,history:[]};}
 function move(o,to,reason){const from=o.holder;o.rev++;o.holder=to?{team:to.team,uid:to.uid}:null;o.history.push({from,to:o.holder,reason,at:Date.now()});o.history=o.history.slice(-20);}
 function scan(f,rows){
  init(f);
  for(const r of rows){const key=r.team+'/'+r.uid;if(!eligible(r)||f.migrated[key])continue;
   const old=r.st?.sq?.holdsObj||(r.st?.gv?.objective?{name:r.st.gv.objName}:null);
   if(old){const name=clean(old.name)||'Objective',o=byName(f,name)||add(f,name);if(!o.holder&&alive(r))move(o,r,'Imported existing marker');}
   f.migrated[key]=true;
  }
  for(const o of Object.values(f.items))if(o.holder&&!rows.some(r=>same(r,o.holder)&&alive(r)))move(o,null,'Carrier destroyed or removed');
  project(f,rows);return f;
 }
 function project(f,rows){for(const r of rows){if(!r.st)continue;r.st.objectives=Object.values(f.items).filter(o=>same(o.holder,r)).map(o=>({id:o.id,name:o.name}));if(r.st.sq)r.st.sq.holdsObj=null;if(r.st.gv){r.st.gv.objective=false;delete r.st.gv.objName;}}}
 function act(f,rows,team,op){
  init(f);const actor=rows.find(r=>r.team===team&&r.uid===op.uid);if(!alive(actor))return 'Choose a living eligible ground unit.';
  let o=f.items[op.id];
  if(op.op==='create'){const name=clean(op.name);if(!name)return 'Name the objective.';if(byName(f,name))return 'That objective already exists. Select it from the list.';if(Object.keys(f.items).length>=100)return 'The objective list is full.';o=add(f,name);move(o,actor,'Created and picked up');}
  else{
   if(!o)return 'Objective no longer exists.';if(op.rev!==o.rev)return 'Possession changed. Select the objective again.';
   if(op.op==='pickup'){if(o.holder)return 'Already held. Use transfer or capture.';move(o,actor,'Picked up');}
   else if(op.op==='capture'){if(!o.holder||o.holder.team===team)return 'Select an enemy-held objective.';move(o,actor,'Captured from enemy');}
   else if(op.op==='drop'||op.op==='transfer'){
    if(!same(o.holder,actor))return 'Only the current carrier can give up this objective.';
    if(op.op==='drop')move(o,null,'Dropped');
    else{const to=rows.find(r=>same(r,op.to));if(!alive(to)||same(to,actor))return 'Choose another living eligible ground unit.';move(o,to,'Transferred');}
   }else return 'Unknown objective action.';
  }
  project(f,rows);return '';
 }
 // A new clash result or holder merge moves the same objective once, never on every sync.
 function fights(f,rows,list){for(const g of list){
   if(g.hasObjective===false||(!g.obj&&!(g.state==='closed'&&g.secured)))continue;
   let h=g.holder||{side:g.obj?.win||g.secured,uid:g[g.obj?.win||g.secured]?.uid};
   if(g.state==='closed'&&g.secured&&h.side!==g.secured)h={side:g.secured,uid:g[g.secured]?.uid};
   const sig=g.id+':'+g.seg+':'+h.side+':'+h.uid;if(f.fights[g.id]?.sig===sig)continue;
   const previous=f.fights[g.id],name=clean(g.eng?.obj)||'Objective '+g.id;
   const o=f.items[g.eng?.objectiveId]||f.items[previous?.id]||byName(f,name)||add(f,name);const to=rows.find(r=>r.team===g[h.side]?.team&&r.uid===h.uid);
   move(o,alive(to)?to:null,'Firefight objective secured');f.fights[g.id]={sig,id:o.id};
  }project(f,rows);}
 root.GBObjectives={clean,eligible,alive,same,init,byName,ensure:(f,name)=>byName(f,name)||add(f,name),scan,project,act,fights};
})(globalThis);
