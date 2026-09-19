/* Saved-pilot presentation and assignment. Online assignments belong to players,
   not unit locks; choosing a pilot never grants control of another player's sheet. */
window.PilotSocial = (() => {
  let profile=null,selected=false,dialog=null,opener=null,refreshVersion=0;
  const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const validPortrait=s=>typeof s==='string'&&s.length<24000&&/^data:image\/webp;base64,[A-Za-z0-9+/=]+$/.test(s);
  function icon(p){return validPortrait(p?.portrait)?'<img class="pilot-avatar" src="'+p.portrait+'" alt="'+esc(p.name)+' portrait">':'';}
  function lobbyIdentity(){return profile?'<div class="pilot-lobby-identity">'+icon(profile)+'<span><b>'+esc(profile.name)+'</b><small>Saved pilot · ready for online play</small></span></div>':'';}
  async function refresh(){
    const version=++refreshVersion;
    try{const result=await Pilot.identity();if(version!==refreshVersion)return;profile=result;
      if(mpActive()&&profile&&JSON.stringify(mpMe()?.pilot)!==JSON.stringify(profile)){
        mp.wantPlayer={...mp.wantPlayer,pilot:profile,name:profile.name};mpKick();
      }
      if(document.getElementById('s5')?.classList.contains('on'))renderLobby();
      update();
    }catch{if(dialog)document.getElementById('pilotAssignHint').textContent='Could not load your pilot portrait. Reopen Pilot to retry.';}
  }
  function owner(uid,team=mpMyTeam()){
    if(!mpTeamMode())return null;
    return Object.entries(mpPlayers()).find(([,p])=>p.team===team&&p.pilotUnit===uid&&p.pilot);
  }
  function badge(r,team=mpMyTeam()){
    const p=mpTeamMode()?owner(r.uid,team)?.[1]?.pilot:r.st?.assignedPilot;
    return p?'<span class="pilot-roster-badge">'+icon(p)+'<span>'+esc(p.name)+'</span></span>':'';
  }
  function close(){if(dialog){dialog.remove();dialog=null;opener?.focus();}}
  function open(){
    close();opener=document.activeElement;selected=false;
    dialog=document.createElement('div');dialog.className='pilot-assign-overlay';
    dialog.innerHTML='<section class="pilot-assign-panel" role="dialog" aria-modal="true" aria-labelledby="pilotAssignTitle"><header><h2 id="pilotAssignTitle">Assign pilot</h2><button class="btn sm" id="pilotAssignClose">Close</button></header><p id="pilotAssignHint" role="status">Loading your saved pilot…</p><div id="pilotAssignChoice"></div><div id="pilotAssignUnits"></div></section>';
    document.body.append(dialog);document.getElementById('pilotAssignClose').onclick=close;
    dialog.addEventListener('keydown',e=>{if(e.key==='Escape')close();if(e.key==='Tab'){const buttons=[...dialog.querySelectorAll('button:not(:disabled)')];if(e.shiftKey&&document.activeElement===buttons[0]){e.preventDefault();buttons.at(-1).focus();}else if(!e.shiftKey&&document.activeElement===buttons.at(-1)){e.preventDefault();buttons[0].focus();}}});
    document.getElementById('pilotAssignClose').focus();update();refresh();
  }
  function update(){
    if(!dialog)return;
    const hint=document.getElementById('pilotAssignHint'),choice=document.getElementById('pilotAssignChoice'),units=document.getElementById('pilotAssignUnits');
    if(!profile){hint.textContent=Pilot.read()?.name?'Loading your saved pilot…':'Save a character in Pilot Studio first.';choice.innerHTML='';units.innerHTML='';return;}
    const current=mpTeamMode()?mpMe()?.pilotUnit:roster.find(r=>r.st?.assignedPilot)?.uid;
    hint.textContent=selected?'Select a highlighted mobile suit. Choosing another suit moves your pilot.':'Select your pilot, then choose their mobile suit.';
    choice.innerHTML='<button class="pilot-select-card'+(selected?' selected':'')+'" aria-pressed="'+selected+'" id="pilotAssignSelect">'+icon(profile)+'<span><b>'+esc(profile.name)+'</b><small>'+(selected?'✓ Selected · choose a suit below':'Tap to select')+'</small></span></button>'+(current?'<button class="btn sm" id="pilotAssignRemove">Unassign pilot</button>':'');
    document.getElementById('pilotAssignSelect').onclick=()=>{selected=!selected;update();};
    const remove=document.getElementById('pilotAssignRemove');if(remove)remove.onclick=()=>assign(null);
    const suits=roster.filter(r=>unitTab(unitById(r.id))==='suits');
    units.innerHTML=suits.length?suits.map(r=>{
      const occupied=owner(r.uid),other=occupied&&occupied[0]!==mp.pid,u=unitById(r.id);
      return '<button class="pilot-unit-choice'+(selected&&!other?' available':'')+'" data-pilot-unit="'+r.uid+'" '+(!selected||other?'disabled':'')+'>'+portraitHTML(u,r)+'<span><b>'+esc(u.short||u.name)+(countOf(r.id)>1?' #'+copyIndex(r):'')+'</b><small>'+(other?'Assigned to '+esc(occupied[1].pilot.name):current===r.uid?'Your pilot is assigned here':selected?'Assign here':'Select your pilot first')+'</small></span>'+(current===r.uid?icon(profile):'')+'</button>';
    }).join(''):'<p>Add a mobile suit to your roster first.</p>';
    units.querySelectorAll('[data-pilot-unit]').forEach(b=>b.onclick=()=>assign(Number(b.dataset.pilotUnit)));
  }
  function assign(uid){
    if(!profile||(uid!==null&&!selected))return;
    if(mpTeamMode()){
      const occupied=owner(uid);if(uid!==null&&occupied&&occupied[0]!==mp.pid){update();return;}
      mp.wantPlayer={...mp.wantPlayer,pilot:profile,pilotUnit:uid};mpKick();
    }else{
      roster.forEach(r=>{if(r.st)delete r.st.assignedPilot;});
      const unit=roster.find(r=>r.uid===uid);if(unit)unit.st.assignedPilot={...profile};
      save();renderRoster();
    }
    close();
  }
  refresh();
  return {refresh,open,update,icon,lobbyIdentity,badge};
})();
