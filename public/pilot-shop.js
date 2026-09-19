window.PilotShop=(()=>{
 let overlay,selected=null,filter='all',category='All',notice='',opener;
 const B=GBPilotBuild,el=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
 const profile=()=>Pilot.read(),campaign=()=>profile()?.campaign||B.fresh();
 function button(text,fn,disabled=false){const b=el('button',text,'btn');b.type='button';b.disabled=disabled;b.onclick=fn;return b;}
 function close(){overlay?.remove();overlay=null;opener?.focus();}
 function purchase(u,action,id,choices){try{const c=B.act(campaign(),u,action,id,choices);Pilot.setCampaign(c);notice=c.history.at(-1).text;Pilot.notify(notice);render();overlay.querySelector(action==='trait'?'[data-trait="'+id+'"]':'.pilot-shop-detail')?.scrollIntoView({block:'nearest'});}catch(e){notice=e.message;render();}}
 function open(){if(!profile()){Pilot.notify('Save your pilot first');return;}close();opener=document.activeElement;overlay=el('div',null,'pilot-shop-overlay');document.body.append(overlay);render();overlay.querySelector('button').focus();overlay.onkeydown=e=>{if(e.key==='Escape')close();if(e.key==='Tab'){const f=[...overlay.querySelectorAll('button:not(:disabled),input,select')];if(e.shiftKey&&document.activeElement===f[0]){e.preventDefault();f.at(-1).focus();}else if(!e.shiftKey&&document.activeElement===f.at(-1)){e.preventDefault();f[0].focus();}}};}
 function render(){
  if(!overlay)return;overlay.replaceChildren();const c=campaign(),r=B.rank(c),panel=el('section',null,'pilot-shop-panel');panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-label','Pilot collection and trait shop');
  const head=el('header'),title=el('div');title.append(el('h2','Collection & traits'),el('p',r[0]+' · '+B.balance(c)+' GP available · '+c.earned+' lifetime GP'));head.append(title,button('Close',close));panel.append(head);
  const content=el('div',null,'pilot-shop-content'),toolbar=el('div',null,'pilot-shop-toolbar'),intro=el('details');intro.append(el('summary','About this prototype'),el('p','Purchases are saved. Assigned builds show their rules; combat values are not modified yet.','pilot-shop-note'));toolbar.append(intro);content.append(toolbar);
  const tools=el('details'),summary=el('summary','Prototype GP entry');tools.append(summary,el('p','Add GP manually to test progression. This raises lifetime GP and cannot be undone here; export a backup before testing.'));
  const amount=el('input');amount.type='number';amount.min=1;amount.max=1000000;amount.step=1;amount.value=30;amount.id='pilotAwardAmount';amount.setAttribute('aria-label','GP to add');tools.append(amount,button('Add GP',()=>purchase(null,'award',Number(amount.value))));toolbar.append(tools);
  const status=el('p',notice||'Select a unit card, then review its purchase or traits.','pilot-shop-status');status.setAttribute('role','status');content.append(status);
  const layout=el('div',null,'pilot-shop-layout'),catalogue=el('div'),tabs=el('div',null,'pilot-shop-filters');
  for(const [id,label] of [['all','All units'],['owned','Owned'],['federation','Federation'],['spacenoid','Spacenoids']]){const b=button(label,()=>{filter=id;render();});b.setAttribute('aria-pressed',String(filter===id));tabs.append(b);}catalogue.append(tabs);
  const list=el('div',null,'pilot-shop-list');for(const u of UNITS.filter(u=>!u.type&&u.limb&&(filter==='all'||filter==='owned'&&c.units[u.id]||filter===u.faction))){const b=button('',()=>{selected=u.id;render();overlay.querySelector('.pilot-shop-detail')?.scrollIntoView({block:'nearest'});});b.className='pilot-shop-unit';b.dataset.shopUnit=u.id;b.setAttribute('aria-pressed',String(selected===u.id));const img=el('span');img.innerHTML=portraitHTML(u,null);b.append(img,el('b',u.short||u.name),el('small',c.units[u.id]?'Owned · '+c.units[u.id].traits.length+' traits':B.price(u)+' GP · '+u.dp+' DP'));list.append(b);}if(!list.children.length)list.append(el('p','No owned units yet. Choose All units to start.'));catalogue.append(list);layout.append(catalogue);
  const detail=el('div',null,'pilot-shop-detail'),u=unitById(selected);if(!u)detail.append(el('h3','Choose your unit'),el('p','Purchases belong to this pilot’s build for the selected unit type. Stock copies remain unchanged.'));
  else{
   detail.append(el('h3',u.name),el('p','Deploys for '+u.dp+' DP each battle. Only the copy carrying your pilot uses this build.'));
   const build=c.units[u.id];if(!build){detail.append(el('p','Permanent unlock · '+B.price(u)+' GP'),button('Purchase unit · '+B.price(u)+' GP',()=>purchase(u,'unit'),B.balance(c)<B.price(u)));if(B.balance(c)<B.price(u))detail.append(el('p','Not enough GP.'));}
   else{
    detail.append(el('p',build.traits.length+' / '+(r[2]+build.extra)+' trait slots · Tier '+r[3]+' ceiling'),button('Extra slot · 100 GP',()=>purchase(u,'slot'),r[0]!=='Legendary Newtype'||B.balance(c)<100||build.extra>=15));
    if(r[2]===0)detail.append(el('p','Veteran at 10 lifetime GP unlocks your first slot and Tier 1.'));
    const categories=el('select');categories.setAttribute('aria-label','Trait category');for(const name of ['All',...new Set(B.traits.map(t=>t.category))]){const op=el('option',name);op.value=name;op.selected=category===name;categories.append(op);}categories.onchange=()=>{category=categories.value;render();};detail.append(categories);
    for(const t of B.traits.filter(t=>category==='All'||t.category===category)){
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
  layout.append(detail);content.append(layout);const history=el('details');history.append(el('summary','Purchase & GP history'));for(const h of [...c.history].reverse())history.append(el('p',new Date(h.at).toLocaleDateString()+' · '+h.text));content.append(history);panel.append(content);overlay.append(panel);
 }
 return {open};
})();
