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
function repairBaseSymbol(r){
  if(!r?.st?.repair?.entry||!unitById(r.id)||GBRepairs.dead(unitById(r.id),r.st))return '';
  return '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M4 28V12l12-8 12 8v16H4zm4-4h5v-9h6v9h5V14l-8-5-8 5v10z" fill="currentColor"/></svg><span>BASE</span>';
}
function baseTagHTML(r,team=side){
  return '<span class="base-roster-state" data-base-uid="'+r.uid+'" data-base-team="'+team+'" title="In personal base" aria-label="In personal base">'+repairBaseSymbol(r)+'</span>';
}
function repairRosterRefresh(){
  document.querySelectorAll('.base-roster-state').forEach(n=>{
    const uid=Number(n.dataset.baseUid),team=n.dataset.baseTeam;
    const r=team===side?roster.find(r=>r.uid===uid):(()=>{const row=mp.data['team/'+team]?.roster?.find(r=>r.uid===uid);return row?{...row,st:mp.data['unit/'+team+'/'+uid]?.st}:null;})();
    const html=repairBaseSymbol(r);if(n.innerHTML!==html)n.innerHTML=html;
  });
}
function repairCommit(){persist();repairRefresh();save();draw();repairRosterRefresh();}
function repairUnitCard(r,tier){
  const base=unitById(r.id),s=r.st,u=GBPickups.definition(base,s),after=JSON.parse(JSON.stringify(s));
  const destroyed=GBRepairs.dead(u,s);if(!destroyed)GBRepairs.heal(u,after,tier);
  const card=el('div','eq-card repair-unit');card.dataset.repairUid=r.uid;
  const heading=el('div','pickup-heading'),portrait=el('img','pickup-portrait'),identity=el('div'),name=el('b'),status=el('p');
  portrait.src='img/portraits/'+u.portrait+'.webp';portrait.alt=u.short||u.name;
  name.textContent=unitLabel(r.uid);status.textContent=repairStatus(r);identity.append(name,status);heading.append(portrait,identity);card.appendChild(heading);
  const health=el('div','repair-health'),changes=[],lost=[];
  const stat=(label,now,max,detail='')=>{const cell=el('div'),key=el('span'),value=el('b');key.textContent=label;value.textContent=now+'/'+max+(detail?' · '+detail:'');cell.append(key,value);health.appendChild(cell);};
  for(const [k,max] of Object.entries(u.limb)){
    const now=s.hp[k],next=after.hp[k],label=LIMB_LABEL[k]||k;
    stat(label,now,max,now===0?'destroyed':'');
    if(next>now)changes.push(label+' +'+(next-now)+' HP ('+now+' → '+next+')');
    if(now===0)lost.push(label);
  }
  (u.shields||[]).forEach((cfg,i)=>{
    const label=cfg.label||'Shield '+(i+1),now=s.sh?.[i]??0,max=s.shMax?.[i]??cfg.hp,next=after.sh?.[i]??now;
    const replaced=s.eq?.shieldDropped?.includes(i)&&!after.eq?.shieldDropped?.includes(i);
    stat(label,now,max,cfg.captured?'captured':'');
    if(next>now||replaced)changes.push(label+(next>now?' +'+(next-now)+' HP ('+now+' → '+next+')':'')+(replaced?' · replacement to storage':''));
  });
  const weapons=new Map();
  (s.eq?.dropped||[]).filter(ref=>!after.eq?.dropped?.includes(ref)).forEach(ref=>{const label=MSE.item(u,ref)?.name||'Weapon';weapons.set(label,(weapons.get(label)||0)+1);});
  for(const [label,n] of weapons)changes.push('Replace '+label+(n>1?' ×'+n:'')+' into storage');
  card.appendChild(health);
  const timing=el('p','repair-next'),state=s.repair?.live?.status;
  timing.textContent=destroyed?'Destroyed units cannot receive repairs.':state==='Docking'?'Next own turn: docking completes; no repairs yet. Assign a slot once aboard; the first repair is the following own turn.':state==='Waiting'?'Waiting: no repair promised next turn. '+(tier===2?'Assign this unit to a repair slot to start its service cycle.':'A free slot starts a complete service cycle.'):state==='Repairing'?'Next own turn: scheduled repair, if this unit remains here.':state==='Ready'?'Ready: no eligible repairs remaining.':tier===2?'No repair scheduled. Assign an eligible boarded unit to a repair slot.':'Enter the base and remain until your next own turn to receive service, if a slot is available.';
  card.appendChild(timing);
  if(changes.length){const title=el('b');title.textContent=state==='Repairing'?'Next repair:':'Next eligible service:';const list=el('ul','repair-preview');changes.forEach(text=>{const li=el('li');li.textContent=text;list.appendChild(li);});card.append(title,list);}
  if(lost.length){const note=el('p','repair-excluded');note.textContent='Destroyed locations stay at 0 HP: '+lost.join(', ')+'.';card.appendChild(note);}
  return card;
}
function repairHealthSummary(r){
  const u=GBPickups.definition(unitById(r.id),r.st),hp=Object.values(r.st.hp).reduce((a,b)=>a+b,0),max=Object.values(u.limb).reduce((a,b)=>a+b,0);
  return 'Unit HP '+hp+'/'+max+(r.st.sh?.length?' · Shield HP '+r.st.sh.join(' / '):'');
}
let repairBaseLastSig='';
function repairBaseSignature(){return JSON.stringify([CUR?.uid,CUR?.st.repair?.owner,roster.map(r=>[r.uid,r.st.hp,r.st.sh,r.st.repair,r.st.eq?.dropped,r.st.eq?.shieldDropped])]);}
function repairBaseAssign(uid){
  const owner=CUR?.st.repair?.owner,r=roster.find(r=>r.uid===uid);
  if(!r?.st.repair?.entry||r.st.repair.owner!==owner||(mpTeamMode()&&owner!==mp.pid)||isDead(r))return;
  const apply=()=>{
    const target=roster.find(r=>r.uid===uid);if(!target?.st.repair?.entry||target.st.repair.owner!==owner)return;
    target.st.repair.priority=Math.min(0,...roster.filter(r=>r.st.repair?.owner===owner).map(r=>r.st.repair.priority||0))-1;
    repairCommit();openRepairBase();
  };
  const assign=()=>{
    if(!mpForeignCheck(uid))return;
    if(mpTeamMode()&&!mp.held.has(lockKey(mpMyTeam(),uid)))mpForeign(uid,apply,()=>{},'repair slot assignment');else apply();
  };
  const old=roster.find(r=>r.st.repair?.owner===owner&&r.st.repair?.entry&&r.st.repair?.live?.status==='Repairing');
  if(old&&old.uid!==uid)repairDialog('Replace unit in base slot 1?',unitLabel(old.uid)+' returns to the base queue and loses its unfinished cycle.',assign);else assign();
}
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
  const rows=roster.filter(r=>r.st.repair?.owner===a.owner&&r.st.repair?.entry).sort((x,y)=>(x.st.repair.priority||0)-(y.st.repair.priority||0)||x.uid-y.uid);
  const current=rows.find(r=>r.st.repair?.live?.status==='Repairing'),bay=el('div','repair-base-bay'),grid=el('div','repair-slots single'),slot=el('div','repair-slot selected'),title=el('div','repair-slot-select');
  title.textContent='SLOT 1'+(current?' · '+unitLabel(current.uid):' · EMPTY');slot.appendChild(title);grid.appendChild(slot);bay.appendChild(grid);list.appendChild(bay);
  if(current){const img=el('img','pickup-portrait');img.src='img/portraits/'+unitById(current.id).portrait+'.webp';img.alt=unitLabel(current.uid);const health=el('p');health.textContent=repairHealthSummary(current);slot.append(img,health);bay.appendChild(repairUnitCard(current,0));}
  else{const note=el('p');note.textContent='No eligible unit currently needs this repair slot.';slot.appendChild(note);}
  const header=el('h3');header.textContent='UNITS IN BASE · '+rows.length;bay.appendChild(header);const help=el('p');help.textContent='The next waiting unit takes the free slot. Select a unit below to repair it first. Leaving base cancels its unfinished cycle.';bay.appendChild(help);
  if(!rows.length){const note=el('p');note.textContent='Confirm entry into base territory to join this roster.';bay.appendChild(note);}
  rows.forEach(r=>{
    const row=el('div','repair-candidate'),img=el('img','pickup-portrait'),info=el('div'),name=el('b'),health=el('p'),status=el('p'),b=el('button','btn sm');row.dataset.repairUid=r.uid;
    img.src='img/portraits/'+unitById(r.id).portrait+'.webp';img.alt=unitLabel(r.uid);name.textContent=unitLabel(r.uid);health.textContent=repairHealthSummary(r);status.textContent=repairStatus(r);info.append(name,health,status);
    b.textContent=current?.uid===r.uid?'In slot 1':'Assign to slot 1';b.disabled=!own||!mpSheetCanEdit()||current?.uid===r.uid||!GBRepairs.needs(GBPickups.definition(unitById(r.id),r.st),r.st);b.onclick=()=>repairBaseAssign(r.uid);row.append(img,info,b);bay.appendChild(row);
  });
  if(!a.entry)bay.appendChild(repairUnitCard(CUR,0));
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
  repairBaseLastSig=repairBaseSignature();$('pickExtra').appendChild(action);$('pickCancel').textContent='Close';$('pick').classList.add('on');
}
let repairBaySelection=null,repairBayLastSig='';
function repairBaySignature(){return JSON.stringify([CUR?.uid,CUR?.st.ship?.repairSlots,roster.filter(r=>CUR?.st.ship?.carry?.includes(r.uid)||CUR?.st.ship?.docking?.some(d=>d.uid===r.uid)).map(r=>[r.uid,r.st.hp,r.st.sh,r.st.repair,r.st.eq?.dropped,r.st.eq?.shieldDropped])]);}
function repairBayRefresh(){
  if($('pick').classList.contains('on')&&$('picklist').querySelector('.repair-base-bay')&&repairBaseLastSig!==repairBaseSignature()){
    const scroll=$('picklist').scrollTop;openRepairBase();$('picklist').scrollTop=scroll;
  }
  if($('pick').classList.contains('on')&&$('picklist').querySelector('.repair-bay')&&CUR?.st.ship&&repairBayLastSig!==repairBaySignature()){
    const scroll=$('picklist').scrollTop;openRepairBay();$('picklist').scrollTop=scroll;
  }
}
function repairSlotAssign(slot,uid){
  const ship=CUR;if(!ship?.st.ship||!mpSheetCanEdit()||!(ship.st.hp.hull>0))return;
  const r=roster.find(r=>r.uid===uid);
  if(uid!=null&&(!r||!ship.st.ship.carry.includes(uid)||isDead(r)||!GBRepairs.needs(GBPickups.definition(unitById(r.id),r.st),r.st)))return;
  const old=(ship.st.ship.repairSlots||[])[slot];if(old===uid)return;
  const apply=()=>{
    if(CUR!==ship||!mpSheetCanEdit())return;
    if((ship.st.ship.repairSlots?.[slot]??null)!==(old??null)||(uid!=null&&(!ship.st.ship.carry.includes(uid)||isDead(r)))){openRepairBay();return;}
    const slots=Array.from({length:3},(_,i)=>ship.st.ship.repairSlots?.[i]??null).map(v=>v===uid?null:v);slots[slot]=uid;
    ship.st.ship.repairSlots=slots;repairBaySelection=null;
    logEv(ship.uid,uid==null?'Repair slot '+(slot+1)+' cleared':unitLabel(uid)+' assigned to repair slot '+(slot+1),'info');
    repairCommit();openRepairBay();
  };
  if(old!=null)repairDialog(uid==null?'Clear repair slot '+(slot+1)+'?':'Replace unit in slot '+(slot+1)+'?',unitLabel(old)+' leaves this repair slot and loses its unfinished cycle. It remains aboard.',apply);else apply();
}
function openRepairBay(){
  if(!CUR?.st.ship||!GBRepairs.ships[CUR.id])return;
  repairRefresh();const ship=CUR,list=$('picklist');
  $('pickT').textContent=U.short+' · Repair bay';$('pickS').textContent='3 repair slots · Choose a slot, then a boarded unit. Each service restores up to 4 HP per intact location and 12 HP per physical shield. Dock turn 1 → aboard turn 2 → first repair turn 3.';
  list.innerHTML='';$('pickExtra').innerHTML='';
  const slots=Array.from({length:3},(_,i)=>ship.st.ship.repairSlots?.[i]??null),canEdit=mpSheetCanEdit()&&ship.st.hp.hull>0;
  if(repairBaySelection?.uid!==ship.uid)repairBaySelection={uid:ship.uid,slot:slots.findIndex(v=>v==null)};
  const selected=repairBaySelection.slot,bay=el('div','repair-bay'),grid=el('div','repair-slots');bay.appendChild(grid);list.appendChild(bay);
  const summary=repairHealthSummary;
  slots.forEach((uid,i)=>{
    const r=roster.find(r=>r.uid===uid),card=el('div','repair-slot'+(selected===i?' selected':''));card.dataset.repairSlot=i;
    const choose=el('button','repair-slot-select');choose.type='button';choose.setAttribute('aria-pressed',String(selected===i));choose.textContent='SLOT '+(i+1)+(r?' · '+unitLabel(uid):' · EMPTY');choose.onclick=()=>{repairBaySelection={uid:ship.uid,slot:i};openRepairBay();};card.appendChild(choose);
    if(r){
      const u=unitById(r.id),img=el('img','pickup-portrait');img.src='img/portraits/'+u.portrait+'.webp';img.alt=u.short||u.name;card.appendChild(img);
      const hp=el('p');hp.textContent=summary(r);card.appendChild(hp);
      const status=el('p');status.textContent=r.st.repair?.live?.status==='Repairing'?'Repairs next own turn':'Assigned · service starts after sync';card.appendChild(status);
      const detail=repairUnitCard(r,2),preview=el('p','repair-slot-preview');preview.textContent=[...detail.querySelectorAll('.repair-preview li')].map(n=>n.textContent).join(' · ');card.appendChild(preview);
      const clear=el('button','btn sm');clear.textContent='Clear slot';clear.disabled=!canEdit;clear.onclick=()=>repairSlotAssign(i,null);card.appendChild(clear);
    }else{const p=el('p');p.textContent='Select a boarded unit below to start a repair cycle.';card.appendChild(p);}
    grid.appendChild(card);
  });
  if(selected>=0&&slots[selected]!=null){const r=roster.find(r=>r.uid===slots[selected]);if(r)bay.appendChild(repairUnitCard(r,2));}
  const header=el('h3');header.textContent='BOARDED UNITS · '+ship.st.ship.carry.length+'/'+U.hangar+' hangar spaces';bay.appendChild(header);
  const help=el('p');help.textContent=selected>=0?'Choose a unit for slot '+(selected+1)+'. Completed units automatically free their repair slot.':'Select a slot above to assign or replace a unit. Completed units stay aboard.';bay.appendChild(help);
  const boarded=el('div','repair-boarded');bay.appendChild(boarded);
  if(!ship.st.ship.carry.length)boarded.textContent='No units fully aboard yet.';
  ship.st.ship.carry.map(uid=>roster.find(r=>r.uid===uid)).filter(Boolean).forEach(r=>{
    const u=GBPickups.definition(unitById(r.id),r.st),row=el('div','repair-candidate'),img=el('img','pickup-portrait'),info=el('div'),name=el('b'),hp=el('p'),state=el('p');row.dataset.repairUid=r.uid;
    img.src='img/portraits/'+u.portrait+'.webp';img.alt=u.short||u.name;name.textContent=unitLabel(r.uid);hp.textContent=summary(r);
    const index=slots.indexOf(r.uid),needs=GBRepairs.needs(u,r.st);state.textContent=index>=0?'In repair slot '+(index+1):needs?'Aboard · awaiting slot assignment':'Ready · no eligible repairs needed';info.append(name,hp,state);
    const b=el('button','btn sm');b.textContent=selected>=0?'Assign to slot '+(selected+1):'Choose a slot';b.disabled=!canEdit||selected<0||isDead(r)||!needs||index===selected;b.onclick=()=>repairSlotAssign(selected,r.uid);row.append(img,info,b);boarded.appendChild(row);
  });
  if(ship.st.ship.docking.length){const h=el('h3');h.textContent='DOCKING · not aboard yet';bay.appendChild(h);ship.st.ship.docking.map(d=>roster.find(r=>r.uid===d.uid)).filter(Boolean).forEach(r=>bay.appendChild(repairUnitCard(r,2)));}
  repairBayLastSig=repairBaySignature();
  $('pickCancel').textContent='Close';$('pick').classList.add('on');
}
function repairDrawUI(){
  const b=$('baseBtn'),s=$('repairStatus');if(!b||!s)return;
  const suit=CUR&&GBRepairs.eligible(U);b.style.display=suit?'block':'none';
  b.classList.toggle('in-base',!!CUR?.st.repair?.entry);
  s.textContent=suit&&CUR.st.repair?.live?repairStatus(CUR):'';
  if(CUR?.st.ship&&GBRepairs.ships[CUR.id]){s.textContent='Repair bay · '+(CUR.st.ship.repairSlots||[]).filter(v=>v!=null).length+'/3 slots assigned · '+CUR.st.ship.carry.length+'/'+U.hangar+' hangar spaces occupied';s.onclick=openRepairBay;}else s.onclick=null;
}
