let objectiveField={},objectiveSelected=null,objectiveTarget=null,objectiveOrigin=null;
function objectiveRows(){
 if(!mpTeamMode())return pickupRows();
 return ['federation','spacenoid'].flatMap(team=>(mp.data['team/'+team]?.roster||[]).map(r=>({...r,team,st:mp.data['unit/'+team+'/'+r.uid]?.st}))).filter(r=>r.st);
}
function objectiveLedger(){return GBObjectives.init(mpTeamMode()?mp.data.objectives||{}:objectiveField);}
function objectiveRefresh(){if(!mpTeamMode())GBObjectives.scan(objectiveField,objectiveRows());}
function objectiveDraw(){
 objectiveRefresh();const bar=$('objectiveStatus');if(!bar)return;
 bar.replaceChildren();if(!GBObjectives.eligible(CUR))return;
 const b=el('button','btn sm');b.id='objectiveBtn';b.textContent='⚑ OBJECTIVE';b.onclick=()=>openObjectives();
 const label=el('span');const held=Object.values(objectiveLedger().items).filter(o=>GBObjectives.same(o.holder,{team:side,uid:CUR.uid}));label.textContent=held.length?held.map(o=>o.name).join(' · '):'No objective carried';bar.append(b,label);
}
function objectiveUnitName(r){const u=unitById(r?.id);return (u?.short||u?.name||'Unit')+' #'+r?.uid;}
function openObjectives(){
 if(!CUR||!GBObjectives.eligible(CUR))return;
 objectiveOrigin={team:side,uid:CUR.uid};objectiveSelected=null;objectiveTarget=null;objectiveRender();
}
function objectiveSend(op,message){
 const origin={...objectiveOrigin};repairDialog('Confirm objective action',message+' Confirm the tabletop conditions allow this action.',()=>{
  if(CUR?.uid!==origin.uid||side!==origin.team||!mpSheetCanEdit())return;
  const request={...op,uid:origin.uid,confirmed:true,requestId:Date.now().toString(36)+'-'+Math.random().toString(36).slice(2)};
  if(mpTeamMode()){mp.objectiveOps=mp.objectiveOps||[];mp.objectiveOps.push(request);closePicker();mpKick();mpToast('Updating objective…');}
  else{objectiveRefresh();const why=GBObjectives.act(objectiveField,objectiveRows(),side,request);if(why)mpToast(why);else{phaseUndo=null;logEv(origin.uid,message,'info');save();draw();renderRoster();}objectiveSelected=null;objectiveTarget=null;objectiveRender();}
 });
}
function objectiveRender(){
 if(!objectiveOrigin||CUR?.uid!==objectiveOrigin.uid||side!==objectiveOrigin.team)return;
 objectiveRefresh();const ledger=objectiveLedger(),rows=objectiveRows(),actor=rows.find(r=>GBObjectives.same(r,objectiveOrigin));
 const editable=GBObjectives.alive(actor)&&mpSheetCanEdit()&&!mp.objectiveOps?.length;
 const list=$('picklist');list.replaceChildren();$('pickExtra').replaceChildren();$('pickT').textContent='Battlefield objectives';$('pickS').textContent='Both teams · Select an objective, then an action or receiving unit. Physical positions and mission conditions are checked on the tabletop.';
 const items=Object.values(ledger.items);
 for(const o of items){const card=el('button','objective-card'+(objectiveSelected===o.id?' selected':''));card.type='button';card.dataset.objective=o.id;card.setAttribute('aria-pressed',String(objectiveSelected===o.id));
  const title=el('b');title.textContent='⚑ '+o.name;const detail=el('span'),holder=rows.find(r=>GBObjectives.same(r,o.holder));detail.textContent=holder?teamName(holder.team)+' · '+objectiveUnitName(holder):'On the battlefield · available to either team';
  if(holder)card.innerHTML=portraitHTML(unitById(holder.id),holder);card.append(title,detail);card.onclick=()=>{objectiveSelected=o.id;objectiveTarget=null;objectiveRender();};list.append(card);
 }
 if(!items.length){const p=el('p');p.textContent='No objectives yet. Name your first mission objective below.';list.append(p);}
 const o=ledger.items[objectiveSelected];
 const action=(label,fn,disabled=!editable)=>{const b=el('button','btn');b.textContent=label;b.disabled=disabled;b.onclick=fn;return b;};
 if(o){const actions=el('div','objective-actions');
  if(!o.holder)actions.append(action('Pick up',()=>objectiveSend({op:'pickup',id:o.id,rev:o.rev},'Pick up '+o.name+' with '+objectiveUnitName(actor)+'.')));
  else if(o.holder.team!==side)actions.append(action('Capture from enemy',()=>objectiveSend({op:'capture',id:o.id,rev:o.rev},'Capture '+o.name+' for '+objectiveUnitName(actor)+'. This removes it from the enemy carrier.')));
  if(GBObjectives.same(o.holder,objectiveOrigin)){
   actions.append(action('Drop on battlefield',()=>objectiveSend({op:'drop',id:o.id,rev:o.rev},'Drop '+o.name+' so either team can pick it up.')));
   const title=el('h4');title.textContent='Transfer · select the receiving unit';list.append(title);
   const grid=el('div','objective-units');for(const r of rows.filter(r=>GBObjectives.alive(r)&&!GBObjectives.same(r,objectiveOrigin))){const key=r.team+'/'+r.uid,b=el('button','objective-card'+(objectiveTarget===key?' selected':''));b.type='button';b.disabled=!editable;b.dataset.target=key;b.setAttribute('aria-pressed',String(objectiveTarget===key));b.innerHTML=portraitHTML(unitById(r.id),r);const text=el('span');text.textContent=teamName(r.team)+' · '+objectiveUnitName(r);b.append(text);b.onclick=()=>{objectiveTarget=key;objectiveRender();};grid.append(b);}list.append(grid);
   const target=rows.find(r=>r.team+'/'+r.uid===objectiveTarget);actions.append(action(target?'Transfer to '+objectiveUnitName(target):'Select a receiving unit',()=>objectiveSend({op:'transfer',id:o.id,rev:o.rev,to:{team:target.team,uid:target.uid}},'Transfer '+o.name+' to '+teamName(target.team)+' · '+objectiveUnitName(target)+'.'),!editable||!target));
  }else if(o.holder?.team===side){const p=el('p');p.textContent='Open the current carrier’s Objective button to transfer or drop this item.';actions.append(p);}
  $('pickExtra').append(actions);
  const last=o.history?.at(-1);if(last){const p=el('p','objective-history');p.textContent='Last change: '+last.reason;list.append(p);}
 }
 const create=el('div','objective-create'),input=el('input');input.id='objectiveName';input.maxLength=40;input.placeholder='Name a new objective';input.setAttribute('aria-label','New objective name');const add=action('Create & pick up',()=>{const name=GBObjectives.clean(input.value);if(!name){input.focus();return;}objectiveSend({op:'create',name},'Create and pick up '+name+'.');});create.append(input,add);list.append(create);
 $('pickCancel').textContent='Close';$('pick').classList.add('on');
}
