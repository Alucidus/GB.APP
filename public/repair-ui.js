function repairTick(){return mpTeamMode()?mp.data.turn?.seq||0:turn.round;}
function repairMe(){return mpTeamMode()?mp.pid:'local:'+side;}
function repairOwnerName(owner){return mpTeamMode()?mpNameOf(owner):'Your personal base';}
function repairRefresh(advance=false){
  if(mpTeamMode())return;
  roster.forEach(r=>{if(GBRepairs.eligible(unitById(r.id))){r.st.repair=r.st.repair||{};r.st.repair.owner=r.st.repair.owner||repairMe();}});
  const result=GBRepairs.process(roster,UNITS,repairTick(),advance);
  if(advance)result.healed.forEach(uid=>logEv(uid,'Repair service completed · HP, eligible shields and replacement weapons','good'));
}
function repairStatus(r){
  const l=r.st.repair?.live;
  if(!l)return 'Outside repair service';
  if(l.status==='Ready')return 'Ready · eligible repairs complete';
  if(l.status==='Waiting')return 'Waiting for a repair slot';
  if(l.status==='Docking')return 'Docking · exposed until the enemy turn ends';
  return 'Repairing · next repair at your next turn start';
}
function repairDialog(title,text,go){
  $('pickT').textContent=title;$('pickS').textContent=text;$('picklist').innerHTML='';$('pickExtra').innerHTML='';
  const b=el('button','btn pri');b.textContent='Confirm';b.onclick=()=>{closePicker();go();};$('pickExtra').appendChild(b);
  $('pickCancel').textContent='Cancel';$('pick').classList.add('on');
}
function repairCommit(){persist();repairRefresh();save();draw();}
function openRepairBase(){
  if(!CUR||!GBRepairs.eligible(U))return;
  repairRefresh();const uid=CUR.uid;
  const a=CUR.st.repair||(CUR.st.repair={owner:mpTeamMode()?mp.leaders[mpMyTeam()]:repairMe()});
  $('pickT').textContent='Personal base · Tier 0';
  $('pickS').textContent='1 repair slot · +2 intact-location HP · +5 per physical shield/quadrant. Entry costs no extra AP. You remain targetable and defend normally.';
  const list=$('picklist');list.innerHTML='';$('pickExtra').innerHTML='';
  const note=el('div','eq-card');note.textContent='Owner: '+repairOwnerName(a.owner||repairMe())+' · '+repairStatus(CUR);list.appendChild(note);
  if(mpTeamMode()&&mpAmLeader()){
    const label=el('label');label.textContent='Unit owner ';const select=el('select');select.className='repair-owner';
    Object.entries(mpPlayers()).filter(([,p])=>p.team===mpMyTeam()).forEach(([id,p])=>{const o=document.createElement('option');o.value=id;o.textContent=p.name;o.selected=id===a.owner;select.appendChild(o);});
    select.disabled=!!a.entry||!mpSheetCanEdit();select.onchange=()=>{a.owner=select.value;repairCommit();openRepairBase();};label.appendChild(select);list.appendChild(label);
  }
  const own=!mpTeamMode()||a.owner===mp.pid;
  roster.filter(r=>r.st.repair?.owner===a.owner&&r.st.repair?.entry).sort((x,y)=>(x.st.repair.priority||0)-(y.st.repair.priority||0)||x.uid-y.uid).forEach(r=>{
    const card=el('div','eq-card');card.textContent=unitLabel(r.uid)+' · '+repairStatus(r);list.appendChild(card);
    if(r.uid===uid){const priority=el('button','btn sm');priority.textContent='Repair this unit first';priority.disabled=!own||!mpSheetCanEdit();priority.onclick=()=>{a.priority=-Date.now();repairCommit();openRepairBase();};card.appendChild(priority);}
  });
  const action=el('button','btn pri');action.id='repairBaseAction';action.textContent=a.entry?'Leave base':'Enter base territory';
  action.disabled=!own||!mpSheetCanEdit()||isDead(CUR)||!!carrierState(uid);
  action.onclick=()=>{
    const leaving=!!a.entry;
    repairDialog(leaving?'Leave base?':'Enter base territory?',leaving?'Leaving cancels this unit’s unfinished repair cycle.':'Confirm this unit is physically inside your personal base territory. Remain there until your next turn starts to receive repairs, if a slot is available.',()=>{
      const r=roster.find(r=>r.uid===uid);if(!r||CUR?.uid!==uid||!mpSheetCanEdit()||carrierState(uid)||isDead(r))return;
      if(leaving)delete r.st.repair.entry;else r.st.repair.entry=Date.now().toString(36)+'-'+uid;
      logEv(uid,leaving?'Left personal base':'Entered personal base territory','info');repairCommit();
    });
  };
  $('pickExtra').appendChild(action);$('pickCancel').textContent='Close';$('pick').classList.add('on');
}
function openRepairBay(){
  if(!CUR?.st.ship||!GBRepairs.ships[CUR.id])return;
  repairRefresh();const ship=CUR,list=$('picklist');
  $('pickT').textContent=U.short+' · Repair bay';$('pickS').textContent='Tier 2 · 3 repair slots · +4 intact-location HP · +12 per physical shield/quadrant. Dock turn 1 → aboard turn 2 → first repair turn 3.';
  list.innerHTML='';$('pickExtra').innerHTML='';
  const ids=[...ship.st.ship.carry,...ship.st.ship.docking.map(d=>d.uid)];
  if(!ids.length)list.textContent='No suits aboard or docking.';
  ids.map(uid=>roster.find(r=>r.uid===uid)).filter(Boolean).forEach(r=>{
    const d=el('div','eq-card');d.textContent=unitLabel(r.uid)+' · '+repairStatus(r);list.appendChild(d);
    const b=el('button','btn sm');b.textContent='Repair this unit first';b.disabled=!mpSheetCanEdit();b.onclick=()=>{
      repairDialog('Change repair priority?','Give '+unitLabel(r.uid)+' first priority? A displaced unit restarts its repair cycle when a slot becomes available.',()=>{
        if(CUR!==ship||!mpSheetCanEdit())return;
        ship.st.ship.repairPriority=ship.st.ship.repairPriority||{};ship.st.ship.repairPriority[r.uid]=-Date.now();repairCommit();openRepairBay();
      });
    };d.appendChild(b);
  });
  $('pickCancel').textContent='Close';$('pick').classList.add('on');
}
function repairDrawUI(){
  const b=$('baseBtn'),s=$('repairStatus');if(!b||!s)return;
  const suit=CUR&&GBRepairs.eligible(U);b.style.display=suit?'block':'none';
  b.classList.toggle('in-base',!!CUR?.st.repair?.entry);
  s.textContent=suit&&CUR.st.repair?.live?repairStatus(CUR):'';
  if(CUR?.st.ship&&GBRepairs.ships[CUR.id]){s.textContent='Repair bay · 3 slots · '+CUR.st.ship.carry.length+'/'+U.hangar+' hangar spaces occupied';s.onclick=openRepairBay;}else s.onclick=null;
}
