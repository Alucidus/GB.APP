/* Visual pilot record reads the same saved campaign used by the shop and hangar. */
window.PilotRecord=(()=>{
 const B=GBPilotBuild,slugs=['rookie','veteran','ace','newtype','super-newtype','legendary'];
 const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined&&text!==null)n.textContent=text;if(cls)n.className=cls;return n;};
 function image(file,alt){const n=el('img');n.src='img/pilots/record/'+file+'.png';n.alt=alt;n.decoding='async';return n;}
 function card(title,value,cls=''){const n=el('div',null,'pilot-record-stat '+cls);n.append(el('small',title),el('strong',String(value)));return n;}
 function render(host,p,onShop,onHangar){
  const c=p.campaign||B.fresh(),r=B.rank(c),index=B.ranks.indexOf(r),next=B.ranks[index+1],units=Object.values(c.units),destroyed=units.filter(u=>u.destroyed).length;
  host.classList.add('pilot-record');
  const hero=el('header',null,'pilot-record-hero'),badge=image('rank-'+slugs[index],r[0]+' rank emblem'),identity=el('div');badge.className='pilot-rank-emblem';
  identity.append(el('small','PILOT RECORD'),el('h2',p.name),el('p',p.callsign||'Callsign not set','pilot-record-callsign'),el('span',({federation:'Federation',spacenoid:'Spacenoid',neutral:'Neutral'})[p.faction],'pilot-record-faction'));
  hero.append(badge,identity);host.append(hero);
  const rank=el('section',null,'pilot-record-rank'),rankhead=el('div',null,'pilot-rank-heading');rankhead.append(el('h3',r[0]),el('span',c.earned+' lifetime GP'));rank.append(rankhead);
  if(next){const progress=el('progress');progress.max=next[1]-r[1];progress.value=Math.max(0,c.earned-r[1]);progress.setAttribute('aria-label','Progress toward '+next[0]);progress.setAttribute('aria-valuetext',c.earned+' of '+next[1]+' lifetime GP; '+(next[1]-c.earned)+' GP to '+next[0]);rank.append(el('small','RANK PROGRESS · LIFETIME GP','pilot-rank-progress-label'),progress,el('p',(next[1]-c.earned)+' GP to '+next[0]+' · '+c.earned+' / '+next[1]+' lifetime GP'));}
  else {const progress=el('progress');progress.max=1;progress.value=1;progress.setAttribute('aria-label','Maximum rank achieved');rank.append(el('small','MAXIMUM RANK · LIFETIME GP','pilot-rank-progress-label'),progress,el('p','Maximum rank · Legendary Newtype · '+c.earned+' lifetime GP'));}
  const bonus=el('p',B.benefits(c),'pilot-rank-benefits');rank.append(bonus);host.append(rank);
  const ledger=el('section',null,'pilot-record-ledger'),wallet=el('div',null,'pilot-gp-card'),amount=el('div');wallet.append(image('gp','GP currency'));amount.append(el('small','Available GP'),el('strong',B.balance(c).toLocaleString()),el('span','Spend in the shop or hangar'));wallet.append(amount);ledger.append(wallet,card('Lifetime GP',c.earned),card('GP spent',c.spent));host.append(ledger);
  const gp=el('div',null,'pilot-gp-actions');gp.append(PilotGP.button(),el('small','Already earned GP on the tabletop? Set your balance and lifetime total.'));host.append(gp);
  const stats=el('section',null,'pilot-record-stats');stats.append(card('Owned units',units.length),card('Trait slots per unit',r[2]),card('Tier ceiling',r[3]===0?'Locked':'Tier '+r[3]));host.append(stats);
  const readiness=el('p',(units.length-destroyed)+' ready'+(destroyed?' · '+destroyed+' awaiting restoration':''),'pilot-record-readiness');host.append(readiness);
  const bio=el('section',null,'pilot-record-background');bio.append(el('h3','Pilot background'),el('p',p.background||'Your story is still to be written. Tap your portrait to add a background.'));host.append(bio);
  const note=el('p','Tap your portrait to edit your character. Purchased trait rules are recorded, but combat values are not yet applied automatically.','pilot-record-note');host.append(note);
 }
 return{render};
})();
