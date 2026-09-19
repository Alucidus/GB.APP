window.PilotShop=(()=>{
 let overlay,selected=null,filter='all',category='Offensive / Defensive',notice='',opener,embedded=false,search='',mode='shop',confirmAction=null;
 const B=GBPilotBuild,el=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
 const profile=()=>Pilot.read(),campaign=()=>profile()?.campaign||B.fresh();
 function button(text,fn,disabled=false){const b=el('button',text,'btn');b.type='button';b.disabled=disabled;b.onclick=fn;return b;}
 function close(){if(!embedded)overlay?.remove();overlay=null;opener?.focus();}
 function purchase(u,action,id,choices){try{const c=B.act(campaign(),u,action,id,choices);Pilot.setCampaign(c);if(action==='unit'){search='';filter='all';mode='hangar';Pilot.showHangar();}notice=c.history.at(-1).text;Pilot.notify(notice);render();overlay.querySelector(action==='trait'?'[data-trait="'+id+'"]':'.pilot-shop-detail')?.scrollIntoView({block:'nearest'});}catch(e){notice=e.message;render();}}
 function mount(host,page='shop'){if(mode!==page){search='';filter='all';confirmAction=null;}mode=page;overlay=host;embedded=true;render();}
 function open(){if(!profile()){Pilot.notify('Save your pilot first');return;}close();embedded=false;opener=document.activeElement;overlay=el('div',null,'pilot-shop-overlay');document.body.append(overlay);render();overlay.querySelector('button').focus();overlay.onkeydown=e=>{if(e.key==='Escape')close();if(e.key==='Tab'){const f=[...overlay.querySelectorAll('button:not(:disabled),input,select')];if(e.shiftKey&&document.activeElement===f[0]){e.preventDefault();f.at(-1).focus();}else if(!e.shiftKey&&document.activeElement===f.at(-1)){e.preventDefault();f[0].focus();}}};}
 function renderBay(u,c){
  const bay=document.getElementById('pilotUnitBay');if(!bay||!embedded)return;
  const art=u&&UNIT_ART[u.id],build=u&&c.units[u.id],stamp=[u?.id||'',!!build,!!build?.destroyed,build?.traits.length||0,mode].join('|');
  if(bay.dataset.stamp===stamp)return;bay.dataset.stamp=stamp;bay.replaceChildren();bay.dataset.unit=u?.id||'';bay.classList.toggle('is-destroyed',!!build?.destroyed);
  const label=el('div',null,'pilot-bay-label');label.append(el('small',mode==='hangar'?'PERSONAL MOBILE SUIT BAY':'MOBILE SUIT PREVIEW'),el('h2',u?(u.short||u.name):'Choose a mobile suit'),el('p',u?(build?(build.destroyed?'Awaiting restoration':'Ready · '+build.traits.length+' installed traits'):B.price(u)+' GP · '+u.tier):'Select a unit on the left to view it in the hangar.'));bay.append(label);
  if(!art){bay.append(el('div','BAY AVAILABLE','pilot-bay-empty'));return;}
  const stand=el('div',null,'pilot-bay-stand'),canvas=el('canvas');canvas.setAttribute('role','img');canvas.setAttribute('aria-label',u.name);stand.append(canvas);bay.append(stand);
  // One pixels-per-metre scale for the entire catalogue. Oversized backpacks can
  // extend behind the UI without shrinking the suit's head-to-foot height.
  const size=art.bay||{heightM:18,headY:0,footY:1},ratio=size.heightM/28/(size.footY-size.headY);
  canvas.style.height=(ratio*100)+'%';canvas.style.bottom=((size.footY-1)*ratio*100)+'%';
  canvas.style.aspectRatio=art.crop[2]+' / '+art.crop[3];
  if(build?.destroyed)bay.classList.add('is-destroyed');else bay.classList.remove('is-destroyed');
  const image=new Image();image.onload=()=>{const [x,y,w,h]=art.crop;canvas.width=w;canvas.height=h;canvas.getContext('2d').drawImage(image,x,y,w,h,0,0,w,h);canvas.dataset.loaded='true';};image.src=art.src;
 }
 function render(){
  if(!overlay)return;overlay.replaceChildren();const c=campaign(),r=B.rank(c),panel=el('section',null,'pilot-shop-panel');if(!embedded){panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');}panel.setAttribute('aria-label','Pilot collection and trait shop');
  const head=el('header'),title=el('div');title.append(el('h2',mode==='hangar'?'Your collection':'Find your next unit'),el('p',r[0]+' · '+B.balance(c)+' GP available · '+c.earned+' lifetime GP'));head.append(title);if(!embedded)head.append(button('Close',close));panel.append(head);
  const content=el('div',null,'pilot-shop-content'),toolbar=el('div',null,'pilot-shop-toolbar'),intro=el('details');intro.append(el('summary','About this prototype'),el('p','Purchases are saved. Assigned builds show their rules; combat values are not modified yet.','pilot-shop-note'));toolbar.append(intro);
  const tools=el('details'),summary=el('summary','Prototype GP entry');tools.append(summary,el('p','Add GP manually to test progression. This raises lifetime GP and cannot be undone here; export a backup before testing.'));
  const amount=el('input');amount.type='number';amount.min=1;amount.max=1000000;amount.step=1;amount.value=30;amount.id='pilotAwardAmount';amount.setAttribute('aria-label','GP to add');tools.append(amount,button('Add GP',()=>purchase(null,'award',Number(amount.value))));toolbar.append(tools);
  const status=el('p',notice||(mode==='hangar'?'Select an owned unit to repair or upgrade.':'Select a unit to preview it and review its price.'),'pilot-shop-status');status.setAttribute('role','status');content.append(status);
  const layout=el('div',null,'pilot-shop-layout'),catalogue=el('div'),tabs=el('div',null,'pilot-shop-filters');
  for(const [id,label] of [['all',mode==='hangar'?'Owned units':'All units'],['federation','Federation'],['spacenoid','Spacenoids']]){const b=button(label,()=>{filter=id;render();});b.setAttribute('aria-pressed',String(filter===id));tabs.append(b);}catalogue.append(tabs);
  const searchBox=el('div',null,'pilot-shop-search'),input=el('input');input.type='search';input.placeholder='Search name, class or DP';input.value=search;input.id='pilotUnitSearch';input.setAttribute('aria-label','Search units');input.oninput=()=>{const pos=input.selectionStart;search=input.value;render();const next=document.getElementById('pilotUnitSearch');next.focus();try{next.setSelectionRange(pos,pos);}catch{}};searchBox.append(input,button('Clear',()=>{search='';render();document.getElementById('pilotUnitSearch').focus();},!search));catalogue.append(searchBox);
  const q=search.trim().toLowerCase(),units=UNITS.filter(u=>!u.type&&u.limb&&(mode!=='hangar'||c.units[u.id])&&(filter==='all'||filter==='owned'&&c.units[u.id]||filter===u.faction||filter!=='owned'&&filter!=='all'&&u.faction==='neutral')).filter(u=>!q||[u.name,u.short||'',u.tier,String(u.dp)].some(v=>v.toLowerCase().includes(q))).sort((a,b)=>a.dp-b.dp);
  catalogue.append(el('small',units.length+' units'));
  const list=el('div',null,'pilot-shop-list');for(const tier of [...new Set(units.map(u=>u.tier))]){const group=units.filter(u=>u.tier===tier),heading=el('div',tier,'tierhdr');heading.append(el('span',String(group.length)));list.append(heading);
   for(const u of group){const b=button('',()=>{selected=u.id;confirmAction=null;render();overlay.querySelector('.pilot-shop-detail')?.scrollIntoView({block:'nearest'});});b.className='row pilot-shop-unit';b.dataset.shopUnit=u.id;b.setAttribute('aria-pressed',String(selected===u.id));const img=el('span');img.innerHTML=portraitHTML(u,null);b.append(img,el('b',u.short||u.name),el('small',c.units[u.id]?(c.units[u.id].destroyed?'Destroyed':'Ready')+' · '+c.units[u.id].traits.length+' traits':B.price(u)+' GP · '+u.dp+' DP'));list.append(b);}
  }if(!units.length)list.append(el('p','No units match. Clear the search or choose All units.'));catalogue.append(list);layout.append(catalogue);
  const detail=el('div',null,'pilot-shop-detail'),u=mode==='hangar'&&!c.units[selected]?null:unitById(selected);renderBay(u,c);if(!u)detail.append(el('h3','Choose your unit'),el('p','Purchases belong to this pilot’s build for the selected unit type. Stock copies remain unchanged.'));
  else{
   detail.append(el('h3',u.name),el('p','Deploys for '+u.dp+' DP each battle. Only the copy carrying your pilot uses this build.'));
   const build=c.units[u.id];if(!build){detail.append(el('p','Permanent unlock · '+B.price(u)+' GP'),button('Purchase unit · '+B.price(u)+' GP',()=>purchase(u,'unit'),B.balance(c)<B.price(u)));if(B.balance(c)<B.price(u))detail.append(el('p','Not enough GP.'));}
   else if(mode==='shop'){detail.append(el('p','Already in your hangar'),button('Open in hangar',()=>{filter='all';search='';Pilot.showHangar();}));}
   else{
    const condition=el('section',null,'pilot-hangar-condition');condition.append(el('b',build.destroyed?'DESTROYED · Awaiting restoration':'READY · Available for your pilot'),el('p','Between-game condition. Restoration preserves all purchased traits and does not revive a unit in an ongoing battle.'));
    const ask=(action)=>{confirmAction=action;render();overlay.querySelector('.pilot-hangar-condition')?.scrollIntoView({block:'nearest'});};
    if(build.destroyed){const cost=B.revival(u);condition.append(button(cost?'Restore unit · '+cost+' GP':'Replace unit · Free',()=>ask('repair'),B.balance(c)<cost),button('Correct mistaken loss',()=>ask('correct')));if(B.balance(c)<cost)condition.append(el('p','Not enough GP.'));}
    else condition.append(button('Record destroyed',()=>ask('destroyed')));
    if(confirmAction){const action=confirmAction;condition.append(el('p',action==='destroyed'?'Record this owned unit as destroyed after a battle?':action==='correct'?'Correct this loss without charging GP?':'Restore this unit for '+B.revival(u)+' GP?'),button('Confirm',()=>{confirmAction=null;purchase(u,action);}),button('Cancel',()=>{confirmAction=null;render();}));}
    detail.append(condition);
    detail.append(el('p',build.traits.length+' / '+(r[2]+build.extra)+' trait slots · Tier '+r[3]+' ceiling'),button('Extra slot · 100 GP',()=>purchase(u,'slot'),r[0]!=='Legendary Newtype'||B.balance(c)<100||build.extra>=15));
    if(r[2]===0)detail.append(el('p','Veteran at 10 lifetime GP unlocks your first slot and Tier 1.'));
    const groups={'Offensive / Defensive':['Offensive','Defensive'],'Mobility / Crowd Control':['Mobility','Crowd Control'],'Anti-CC':['Anti-CC'],'Recon / Stealth':['Recon','Stealth']};
    const pages=el('nav',null,'pilot-trait-pages');pages.setAttribute('aria-label','Trait pages');for(const name of Object.keys(groups)){const b=button(name,()=>{category=name;render();overlay.querySelector('.pilot-trait-pages')?.scrollIntoView({block:'nearest'});});b.setAttribute('aria-pressed',String(category===name));pages.append(b);}detail.append(pages);
    let lastCategory='';for(const t of B.traits.filter(t=>groups[category].includes(t.category))){if(t.category!==lastCategory){lastCategory=t.category;detail.append(el('h3',t.category,'pilot-trait-heading'));}
     const owned=build.traits.find(x=>x.id===t.id),tier=(owned?.tier||0)+1,card=el('article',null,'pilot-trait-card');card.dataset.trait=t.id;card.append(el('h4',t.name+(owned?' · T'+owned.tier:'')),el('small',t.category));if(owned)card.append(el('p','Owned: '+t.tiers[owned.tier-1]));
     if(tier<=4){card.append(el('p','Tier '+tier+': '+t.tiers[tier-1]));const picks=[];
      if(t.id==='weapon-mastery'&&tier===1||t.id==='quick-hands'){
       const entries=t.id==='weapon-mastery'?u.weapons.map((w,i)=>[i,w.name]):(u.abilities||[]).map((a,i)=>[i,a.name]).filter(([i])=>B.cooldown(u.abilities[i]));
       for(let j=0;j<(t.id==='quick-hands'&&tier===2?2:1);j++){const select=el('select');select.setAttribute('aria-label',t.id==='weapon-mastery'?'Choose weapon':'Choose cooldown ability '+(j+1));select.append(el('option','Choose…'));select.firstChild.value='';for(const [i,name] of entries){const op=el('option',name);op.value=i;select.append(op);}picks.push(select);card.append(select);}
       if(!entries.length)card.append(el('p','No eligible cooldown abilities on this unit.'));
      }
      const why=B.reason(c,u,t.id);card.append(button((owned?'Upgrade':'Purchase')+' · '+(owned?6:8)+' GP',()=>purchase(u,'trait',t.id,picks.filter(p=>p.value!=='').map(p=>Number(p.value))),!!why));if(why)card.append(el('small',why));
     }else card.append(el('p','Fully upgraded'));detail.append(card);
    }
   }
  }
  layout.append(detail);content.append(layout);const history=el('details');history.append(el('summary','Purchase & GP history'));for(const h of [...c.history].reverse())history.append(el('p',new Date(h.at).toLocaleDateString()+' · '+h.text));content.append(history,toolbar);panel.append(content);overlay.append(panel);
 }
 return {open,mount};
})();
