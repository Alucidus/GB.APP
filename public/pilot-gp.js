window.PilotGP=(()=>{
 function open(){
  document.getElementById('pilotGPDialog')?.remove();
  const p=Pilot.read();if(!p)return;const c=p.campaign||GBPilotBuild.fresh(),opener=document.activeElement;
  const dialog=document.createElement('dialog');dialog.id='pilotGPDialog';dialog.dataset.faction=p.faction;dialog.setAttribute('aria-labelledby','pilotGPTitle');
  dialog.innerHTML='<form><h2 id="pilotGPTitle">Manage GP</h2><p>Bring your existing tabletop progress into your pilot record, or update it after a game.</p><label>Available GP<input id="pilotGPAvailable" type="number" inputmode="numeric" min="0" max="1000000" step="1" required></label><small>Your current balance to spend.</small><label>Lifetime GP earned<input id="pilotGPLifetime" type="number" inputmode="numeric" min="0" max="1000000" step="1" required></label><small>All GP ever earned, including GP already spent. This determines your rank.</small><p id="pilotGPPreview"></p><p id="pilotGPError" role="alert"></p><footer><button type="button" class="btn" id="pilotGPCancel">Cancel</button><button class="btn pri" type="submit">Save GP</button></footer></form>';
  document.body.append(dialog);const available=dialog.querySelector('#pilotGPAvailable'),lifetime=dialog.querySelector('#pilotGPLifetime'),preview=dialog.querySelector('#pilotGPPreview'),error=dialog.querySelector('#pilotGPError');available.value=GBPilotBuild.balance(c);lifetime.value=c.earned;
  function update(){const earned=Number(lifetime.value),balance=Number(available.value);preview.textContent=earned>=balance?GBPilotBuild.rank({earned})?.[0]+' · '+(earned-balance)+' GP spent':'Lifetime GP must be at least your available GP.';error.textContent='';}
  available.oninput=()=>{if(Number(available.value)>Number(lifetime.value))lifetime.value=Number(available.value);update();};lifetime.oninput=update;update();
  dialog.querySelector('#pilotGPCancel').onclick=()=>dialog.close();dialog.onclose=()=>{dialog.remove();opener?.focus();};
  dialog.querySelector('form').onsubmit=e=>{e.preventDefault();try{const current=Pilot.read()?.campaign||GBPilotBuild.fresh(),next=GBPilotBuild.act(current,null,'set-gp',{available:Number(available.value),earned:Number(lifetime.value)});Pilot.setCampaign(next);dialog.close();Pilot.notify('GP saved · '+GBPilotBuild.balance(next)+' available');}catch(e){error.textContent=e.message;}};
  dialog.showModal();available.focus();available.select();
 }
 function button(){const b=document.createElement('button');b.type='button';b.className='btn pilot-manage-gp';b.textContent='Manage GP';b.onclick=open;return b;}
 return {open,button};
})();
