let pickupField={seq:0,items:{},receipts:{}};
function pickupRows(){return ['federation','spacenoid'].flatMap(team=>(team===side?roster:teams[team]?.roster||[]).map(r=>({...r,team})));}
function pickupRefresh(){if(!mpTeamMode())GBPickups.scan(pickupField,pickupRows(),UNITS);}
function pickupLedger(){return mpTeamMode()?mp.data.battlefield||{items:{}}:pickupField;}
function pickupConfirm(v){
 const uid=CUR.uid;
 repairDialog('Pick up '+v.name+'?', 'Confirm the item is within 10cm. Spend 1 AP'+'?',()=>{
  if(CUR?.uid!==uid||!eqAllowed()||turn.phase!=='you')return;
  persist();
  if(mpTeamMode()){
   mp.pickupOps=mp.pickupOps||[];mp.pickupOps.push({uid,itemId:v.id,within10:true,requestId:Date.now().toString(36)+'-'+Math.random().toString(36).slice(2)});mpKick();mpToast('Picking up '+v.name+'…');
  }else{
   pickupRefresh();const why=GBPickups.claim(pickupField,pickupRows(),UNITS,side,uid,v.id);
   if(why){mpToast(why);openPickup();return;}phaseUndo=null;logEv(uid,'Picked up '+v.name+' · 1 AP','info');reloadCur();save();draw();openPickup();
  }
 });
}
function pickupChoose(v){
 pickupConfirm(v);
}
function openPickup(){
 if(!CUR||!MSE.supported(U))return;
 pickupRefresh();const list=$('picklist'),items=GBPickups.available(pickupLedger(),side,CUR.uid);
 $('pickT').textContent='Pick Up · battlefield equipment';$('pickS').textContent='Your lost items first · both teams · 1 AP each · within 10cm. Remaining shield HP, charges and cooldowns travel with the item.';
 list.innerHTML='';$('pickExtra').innerHTML='';
 if(!items.length)list.textContent='No equipment is currently on the ground.';
 items.forEach(v=>{
  const card=el('div','eq-card pickup-item');card.dataset.itemId=v.id;const name=el('b');name.textContent=v.name;
  const who=el('p'),own=v.team===side&&v.uid===CUR.uid;who.textContent=(own?'YOUR LOST ITEM':v.team===side?'ALLY':'ENEMY')+' · '+(unitById(v.unitId)?.short||v.unitId)+' #'+v.uid;
  const detail=el('p');detail.textContent=v.kind==='shield'?v.hp+'/'+v.max+' shield HP':v.profiles.map((w,i)=>w.dmg+' damage · '+w.range+' · '+w.ap+' AP'+(w.limit?' · '+v.values[i]+(w.limit.kind==='charges'?' charges':' cooldown steps'):'')).join(' / ');
  const b=el('button','btn');b.textContent='Pick up · 1 AP';b.disabled=!eqAllowed()||ap<1||turn.phase!=='you'||hp[U.kill||'chest']<=0||(v.kind==='shield'&&(!(v.hp>0)||v.down===-1))||!!mp.pickupOps?.length;
  b.onclick=()=>pickupChoose(v);card.append(name,who,detail,b);list.appendChild(card);
 });$('pickCancel').textContent='Close';$('pick').classList.add('on');
}

// Equipment details live in a scrollable panel, never another printed weapon row.
function openEquippedInfo(arm){
 if(!CUR||!MSE.arms.includes(arm))return;
 const uid=CUR.uid,s=eqLive(),e=MSE.init(U,s),ref=e.hands[MSE.arms.indexOf(arm)],item=MSE.item(U,ref);
 $('pickT').textContent=LIMB_LABEL[arm]+' · equipment';
 $('pickS').textContent='Weapon stats and rules · shields retain their remaining HP.';
 const list=$('picklist');list.innerHTML='';$('pickExtra').innerHTML='';
 const card=(title)=>{const c=el('div','eq-card equipment-detail'),h=el('h4');h.textContent=title;c.appendChild(h);list.appendChild(c);return c;};
 const paragraph=(c,text)=>{const p=el('p');p.textContent=text;c.appendChild(p);};
 const button=(c,text,fn,disabled=false)=>{const b=el('button','btn');b.textContent=text;b.disabled=disabled;b.onclick=()=>{if(CUR?.uid===uid)fn();};c.appendChild(b);return b;};
 if(item&&!e.dropped.includes(ref)&&hp[arm]>0){
  item.rows.forEach(i=>{
   const w=U.weapons[i],c=card(w.label||w.name),stats=el('dl','equipment-stats');
   for(const [name,value] of [['Damage',w.dmg],['Range',w.range],['AP',w.ap]]){const dt=el('dt'),dd=el('dd');dt.textContent=name;dd.textContent=value;stats.append(dt,dd);}c.appendChild(stats);
   if(w.text)paragraph(c,w.text);
   if(item.kind==='melee'||item.kind==='hybrid')paragraph(c,'Melee bonus: '+(item.bonus==null?'see weapon rules':'+'+item.bonus)+' · equip '+item.cost+' AP');
   if(MSE.penalty(U,s,w))paragraph(c,'Ranged roll −3 while dual wielding.');
   const combo=MSE.combo(U,s);if(combo)paragraph(c,combo);
   const left=wpn[i]||0,lim=w.limit,why=MSE.reason(U,s,w);
   if(lim)paragraph(c,lim.kind==='charges'?left+' / '+lim.max+' charges remaining':left>0?'Cooldown: '+left+' turn steps remaining':'Ready to fire');
   if(why)paragraph(c,why);
   if(item.kind!=='melee'&&!(item.kind==='hybrid'&&e.mode==='sword')){
    if(w.pickupId&&U.tier==='Grunt'&&parseFloat(w.dmg)>5)paragraph(c,'Firing strains this arm for 2 HP.');
    for(const cost of apOptions(w.ap))button(c,'Fire · '+cost+' AP',()=>{window.fireEquippedWeapon(i,cost);openEquippedInfo(arm);},!eqAllowed()||ap<cost||!!why||!!(lim&&(lim.kind==='cooldown'?left>0:left<=0)));
   }
  });
 }else paragraph(card(hp[arm]<=0?'Arm lost':'Empty hand'),'Use Equip to assign a weapon or Pick Up to recover dropped equipment.');
 (U.shields||[]).forEach((cfg,i)=>{
  if(e.shields[i]!==arm||e.shieldDropped.includes(i))return;
  const c=card(cfg.label||'Shield');paragraph(c,sh[i]+' / '+shMax[i]+' HP');
  if(cfg.captured){
   paragraph(c,'Captured shield · physical shield; no regeneration.');
   const change=delta=>{if(!eqAllowed())return;sh[i]=Math.max(0,Math.min(shMax[i],sh[i]+delta));persist();draw();openEquippedInfo(arm);};
   button(c,'−'+amount+' shield HP',()=>change(-amount),!eqAllowed()||sh[i]<=0);
   button(c,'+1 · correct HP',()=>change(1),!eqAllowed()||sh[i]>=shMax[i]);
  }
 });
 button(list,'Manage equipment',openEquipment,!eqAllowed());
 $('pickCancel').textContent='Close';$('pick').classList.add('on');
}
