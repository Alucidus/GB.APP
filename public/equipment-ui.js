/* Equipment controls reuse the sheet's picker, theme, save and multiplayer lock. */
let eqPending = null;
function eqLive() { if(CUR) { CUR.st.hp=hp;CUR.st.ap=ap;CUR.st.sh=sh;CUR.st.shDown=shDown;CUR.st.track=track; } return CUR?.st; }
function eqAllowed() { return CUR && MSE.supported(U) && mpSheetCanEdit() && !document.body.classList.contains('mpro'); }
function eqAction(fn, label, reaction=false) {
  if(!eqAllowed())return;
  if(!reaction && locked && turn.phase!=='you'){mpToast('Switch equipment on your own turn.');return;}
  const s=eqLive(),before=JSON.stringify({eq:s.eq,track:s.track,ap:s.ap});
  const why=fn(s);if(why){mpToast(why);return;}
  ap=s.ap;track=s.track;
  s.eqUndo={before,after:JSON.stringify([s.eq,s.track,s.ap,s.hp,s.wpn,s.sh]),round:turn.round,phase:turn.phase};
  qaLog(CUR.uid,'equipment',Date.now(),label);persist();draw();if(!reaction)openEquipment();
}
function eqUndo() {
  if(!eqAllowed())return;
  const s=eqLive(),b=s.eqUndo;
  if(!b || b.round!==turn.round || b.phase!==turn.phase || b.after!==JSON.stringify([s.eq,s.track,s.ap,s.hp,s.wpn,s.sh]))return;
  const prev=JSON.parse(b.before);s.eq=prev.eq;s.track=prev.track;s.ap=prev.ap;ap=s.ap;track=s.track;delete s.eqUndo;
  qaLog(CUR.uid,'equipment',Date.now(),'Equipment change undone');persist();draw();openEquipment();
}
function eqSummary() {
  const box=$('equipmentSummary');if(!box)return;
  if(!MSE.supported(U)){box.hidden=true;eqPending=null;$('sheet').classList.remove('eq-assign');return;}
  if(eqPending?.uid!==CUR.uid)eqPending=null;
  $('sheet').classList.toggle('eq-assign',!!eqPending);
  const s=eqLive(),e=MSE.init(U,s);box.hidden=false;
  const name=(r,i)=>r ? (hp[MSE.arms[i]]<=0||e.dropped.includes(r)?'Unavailable: ':'')+(MSE.item(U,r)?.name||r) : 'Empty';
  if(eqPending){box.innerHTML='<strong>Equip '+ffText(MSE.item(U,eqPending.key)?.name||'shield')+' — tap an intact arm’s health bubble</strong><button class="btn sm" onclick="eqPending=null;draw()">Cancel</button>';return;}
  box.innerHTML='<button class="btn sm pri" onclick="openEquipment()">WEAPONS / EQUIP</button><span><b>R</b> '+ffText(name(e.hands[0],0))+' · <b>L</b> '+ffText(name(e.hands[1],1))+'</span>'+
    (e.segment?'<strong>Melee segment active</strong>':'')+
    (e.dropped.length||e.shieldDropped.length?'<strong>Dropped equipment</strong>':'');
}
function eqStatus(x,s) {
  const w=U.weapons[x.rows[0]],why=w?MSE.reason(U,s,w):'';
  if(x.mount==='hand') {
    const slots=s.eq.hands.map((r,i)=>MSE.item(U,r)?.key===x.key&&!s.eq.dropped.includes(r)&&s.hp[MSE.arms[i]]>0?['Right','Left'][i]:null).filter(Boolean);
    return slots.length?'Equipped · '+slots.join(' + '):'Stored';
  }
  return why || ({body:'Integrated · always available',head:'Head-mounted',arms:'Palm-mounted',legs:'Leg-mounted',leftArm:'Left arm-mounted',rightArm:'Right arm-mounted',shield:'Shield-mounted',attachment:'Magnum attachment',throw:'Direct throw · no switching'}[x.mount]||x.mount);
}
function openEquipment() {
  if(!CUR||!MSE.supported(U))return;
  eqPending=null;eqSummary();
  const s=eqLive(),e=MSE.init(U,s),cats=MSE.catalog(U);
  $('pickT').textContent='Weapons / Equip — '+(U.short||U.name);
  $('pickS').textContent=(locked?ap+' AP available.':'Setup: choose starting equipment freely.')+' Shields use forearm mounts, not hand slots. Pickup requires being within 10cm.';
  const list=$('picklist');list.innerHTML='';
  const section=(title,body)=>{const d=el('div','eq-card');d.innerHTML='<b>'+ffText(title)+'</b><p>'+body+'</p>';list.appendChild(d);return d;};
  const button=(d,label,fn,disabled=false)=>{const b=el('button','btn sm');b.textContent=label;b.disabled=disabled||!eqAllowed();b.onclick=fn;d.appendChild(b);return b;};
  const h=section('Currently equipped',MSE.arms.map((a,i)=>'<span>'+['Right','Left'][i]+': '+ffText(e.hands[i]?MSE.item(U,e.hands[i])?.name||'—':'Empty')+(hp[a]<=0?' · ARM LOST':'')+'</span>').join('<br>'));
  MSE.arms.forEach((a,i)=>button(h,'Stow '+['right','left'][i],()=>eqAction(st=>{
    if(st.eq.segment)return 'Finish the melee segment first';
    const r=st.eq.hands[i];st.eq.hands=st.eq.hands.map((v,j)=>j===i||v===r?null:v);MSE.clearMatrix(U,st);return '';
  },'Weapon stowed'),!e.hands[i]));
  button(h,e.segment?'End melee segment':'Begin melee segment',()=>eqAction(st=>{
    st.eq.segment=!st.eq.segment;
    if(st.eq.segment)refillMatrix(U,st);
    return '';
  },e.segment?'Melee segment ended':'Melee segment started',true));
  if(MSE.combo(U,s)){const p=el('p');p.textContent=MSE.combo(U,s);h.appendChild(p);}
  const undo=s.eqUndo;
  if(undo&&undo.round===turn.round&&undo.phase===turn.phase&&undo.after===JSON.stringify([s.eq,s.track,s.ap,s.hp,s.wpn,s.sh]))button(h,'Undo last equipment change',eqUndo);
  cats.forEach(x=>{
    const w=U.weapons[x.rows[0]],melee=x.kind==='melee'||x.kind==='hybrid';
    let desc=ffText(eqStatus(x,s));
    if(w)desc+=' · '+ffText(w.dmg)+' damage · '+ffText(w.range);
    else desc+=' · '+ffText(x.damage)+' damage · '+ffText(x.range);
    if(melee)desc+='<br>Melee roll: <b>'+(x.bonus===null?'not specified in unit rules':'+'+x.bonus)+'</b>';
    if(w&&MSE.penalty(U,s,w))desc+='<br><b>−3 ranged roll (+3 target number)</b>';
    if(x.mount==='hand')desc+='<br>Equip: '+x.cost+' AP per weapon'+(x.count>1?' · '+x.count+' copies':'');
    const d=section(x.name,desc);
    if(x.mount==='hand')button(d,'Equip · '+(locked?x.cost+' AP':'free setup'),()=>eqChoose(x.key),e.segment);
    if(x.exclusive&&MSE.held(U,s,x))button(d,'Mode: '+e.mode+' · switch 1 AP',()=>eqAction(st=>{if(st.eq.segment)return 'Finish the melee segment first';if(locked&&st.ap<1)return 'Not enough AP';if(locked)st.ap--;st.eq.mode=st.eq.mode==='rifle'?'sword':'rifle';return '';},'GN Sword mode switched'));
    if(w?.limit){const n=wpn[x.rows[0]]||0;const p=el('p');p.textContent=w.limit.kind==='cooldown'?(n>0?'Cooling down · '+n+' turn steps remaining':'Ready to fire'):n+' charges remaining';d.appendChild(p);}
  });
  (U.shields||[]).forEach((cfg,i)=>{
    const m=e.shields[i],d=section(cfg.label||'Shield '+(i+1),sh[i]+'/'+shMax[i]+' HP · '+(MSE.shieldReady(U,s,i)?'Available':e.shieldDropped.includes(i)?'Dropped':m?'Unavailable':'Stored')+' · '+(m||'no mount'));
    if(m==='body')return;
    button(d,'Choose forearm · '+(locked?'1 AP':'free setup'),()=>eqChoose('shield:'+i),e.segment||e.shieldDropped.includes(i));
  });
  [...e.dropped.map(r=>({r,shield:false,name:MSE.item(U,r)?.name||r})),...e.shieldDropped.map(r=>({r,shield:true,name:'Shield '+(r+1)}))].forEach(x=>{
    const d=section('Recover '+x.name,'1 AP · confirm the dropped equipment is within 10cm. Empty hand/mount equips immediately; otherwise returns to your usable list.');
    button(d,'Within 10cm · recover 1 AP',()=>eqAction(st=>MSE.recover(U,st,x.r,x.shield),'Recovered '+x.name),e.segment);
  });
  U.abilities.forEach((a,i)=>{if(a.kind==='matrix'){const d=section(a.name,'Special combinations retain their 2 AP cost. Changing pair does not refresh spent parries.');button(d,'Choose special pair',()=>openMatrix(i),e.segment);}});
  $('pickExtra').innerHTML='';$('pickCancel').textContent='Close';$('pick').classList.add('on');
}

function eqChoose(key) {
  if(!eqAllowed())return;
  if(locked&&turn.phase!=='you'){mpToast('Switch equipment on your own turn.');return;}
  eqPending={uid:CUR.uid,key};closePicker();active=null;draw();
}
function eqPickArm(arm) {
  if(!eqPending||eqPending.uid!==CUR.uid)return;
  const key=eqPending.key;
  if(!MSE.arms.includes(arm)||hp[arm]<=0){mpToast('Tap an intact arm.');return;}
  eqPending=null;
  eqAction(st=>{
    if(!key.startsWith('shield:'))return MSE.equip(U,st,key,arm,!locked);
    const i=Number(key.slice(7));
    if(st.eq.segment)return 'Finish the melee segment first';
    if(st.eq.shieldDropped.includes(i))return 'Recover the shield first';
    if(!(st.sh[i]>0))return 'Shield offline or destroyed';
    if(st.eq.shields[i]===arm)return 'Already mounted';
    if(st.eq.shields.includes(arm))return 'Forearm mount occupied';
    if(locked&&st.ap<1)return 'Not enough AP';
    st.eq.shields[i]=arm;if(locked)st.ap--;return '';
  },'Equipment assigned to '+arm);
  draw();
}
