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
      if(profile&&!mpActive()&&side){let changed=false;const rows=[...roster,...Object.values(teams).flatMap(t=>t?.roster||[])];for(const r of rows)if(r.st?.assignedPilot&&(r.st.assignedPilot.id===profile.id||!r.st.assignedPilot.id&&r.st.assignedPilot.name===profile.name)&&JSON.stringify(r.st.assignedPilot)!==JSON.stringify(profile)){r.st.assignedPilot={...profile};changed=true;}if(changed){save();renderRoster();}}

      if(mpActive()&&profile&&JSON.stringify(mpMe()?.pilot)!==JSON.stringify(profile)){
        mp.wantPlayer={...mp.wantPlayer,pilot:profile,name:profile.name};mpKick();
      }
      if(document.getElementById('s5')?.classList.contains('on'))renderLobby();
      update();
    }catch{if(document.getElementById('pilotAssignHint'))document.getElementById('pilotAssignHint').textContent='Could not load your pilot portrait. Reopen Pilot to retry.';}
  }
  function owner(uid,team=mpMyTeam()){
    if(!mpTeamMode())return null;
    return Object.entries(mpPlayers()).find(([,p])=>p.team===team&&p.pilotUnit===uid&&p.pilot);
  }
  function badge(r,team=mpMyTeam()){
    if(!mpTeamMode())team=side;
    const p=mpTeamMode()?owner(r.uid,team)?.[1]?.pilot:r.st?.assignedPilot;
    return p?'<button class="pilot-roster-badge pilot-build-badge" onclick="event.stopPropagation();PilotSocial.showBuild('+r.uid+',\''+team+'\')">'+icon(p)+'<span>'+esc(p.name)+' · '+(p.campaign?.units?.[r.id]?.traits?.length||0)+' traits</span></button>':'';
  }
  function showBuild(uid,team){
    const r=(team===side?roster:teams[team]?.roster||[]).find(r=>r.uid===uid);if(!r)return;
    const p=mpTeamMode()?owner(uid,team)?.[1]?.pilot:r.st?.assignedPilot;if(!p)return;
    close();opener=document.activeElement;dialog=document.createElement('div');dialog.className='pilot-assign-overlay';
    const c=p.campaign||GBPilotBuild.fresh(),b=c.units[r.id],rank=GBPilotBuild.rank(c);
    dialog.innerHTML='<section class="pilot-assign-panel" role="dialog" aria-modal="true" aria-label="Assigned pilot build"><header><h2>'+esc(p.name)+' · '+esc(rank[0])+'</h2><button class="btn" id="pilotBuildClose">Close</button></header><p>'+esc(GBPilotBuild.benefits(c))+'</p><p>Assigned build · prototype reference only. Combat values are not modified yet.</p><p>'+(b?'Purchased build for '+esc(unitById(r.id).name):'No purchased build for this unit.')+'</p>'+((b?.traits||[]).map(t=>{const def=GBPilotBuild.traits.find(x=>x.id===t.id);return '<article class="pilot-trait-card"><b>'+esc(def.name)+' · Tier '+t.tier+'</b><p>'+esc(def.tiers[t.tier-1])+'</p>'+t.choices.map(i=>'<small>'+esc((t.id==='weapon-mastery'?unitById(r.id).weapons:unitById(r.id).abilities)?.[i]?.name)+'</small>').join('')+'</article>';}).join(''))+'</section>';
    document.body.append(dialog);const bclose=document.getElementById('pilotBuildClose');bclose.onclick=close;bclose.focus();dialog.onkeydown=e=>{if(e.key==='Escape')close();if(e.key==='Tab'){e.preventDefault();bclose.focus();}};
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
    if(!dialog||!document.getElementById('pilotAssignHint'))return;
    const hint=document.getElementById('pilotAssignHint'),choice=document.getElementById('pilotAssignChoice'),units=document.getElementById('pilotAssignUnits');
    if(!profile){hint.textContent=Pilot.read()?.name?'Loading your saved pilot…':'Save a character in Pilot Studio first.';choice.innerHTML='';units.innerHTML='';return;}
    const current=mpTeamMode()?mpMe()?.pilotUnit:roster.find(r=>r.st?.assignedPilot)?.uid;
    hint.textContent=selected?'Select a highlighted mobile suit. Choosing another suit moves your pilot.':'Select your pilot, then choose their mobile suit.';
    choice.innerHTML='<button class="pilot-select-card'+(selected?' selected':'')+'" aria-pressed="'+selected+'" id="pilotAssignSelect">'+icon(profile)+'<span><b>'+esc(profile.name)+'</b><small>'+(selected?'✓ Selected · choose a suit below':'Tap to select')+'</small></span></button>'+(current?'<button class="btn sm" id="pilotAssignRemove">Unassign pilot</button>':'');
    document.getElementById('pilotAssignSelect').onclick=()=>{selected=!selected;update();};
    const remove=document.getElementById('pilotAssignRemove');if(remove)remove.onclick=()=>assign(null);
    const suits=roster.filter(r=>unitTab(unitById(r.id))==='suits');
    units.innerHTML=suits.length?suits.map(r=>{
      const occupied=owner(r.uid),other=occupied&&occupied[0]!==mp.pid,u=unitById(r.id),destroyed=profile.campaign?.units?.[r.id]?.destroyed||isDead(r);
      return '<button class="pilot-unit-choice'+(selected&&!other&&!destroyed?' available':'')+'" data-pilot-unit="'+r.uid+'" '+(!selected||other||destroyed?'disabled':'')+'>'+portraitHTML(u,r)+'<span><b>'+esc(u.short||u.name)+(countOf(r.id)>1?' #'+copyIndex(r):'')+'</b><small>'+(destroyed?'Restore this unit in your hangar':other?'Assigned to '+esc(occupied[1].pilot.name):current===r.uid?'Your pilot is assigned here':selected?'Assign here':'Select your pilot first')+'</small></span>'+(current===r.uid?icon(profile):'')+'</button>';
    }).join(''):'<p>Add a mobile suit to your roster first.</p>';
    units.querySelectorAll('[data-pilot-unit]').forEach(b=>b.onclick=()=>assign(Number(b.dataset.pilotUnit)));
  }
  function assign(uid){
    if(!profile||(uid!==null&&!selected))return;
    if(uid!==null&&(!roster.some(r=>r.uid===uid)||isDead(roster.find(r=>r.uid===uid))))return;
    recordLosses();
    if(uid!==null&&Pilot.read()?.campaign?.units?.[roster.find(r=>r.uid===uid)?.id]?.destroyed)return;
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
  let recording=false;
  function recordLosses(){
    if(recording||globalThis.GBSaveRecoveryError)return;const p=Pilot.read();if(!p?.id)return;
    recording=true;
    try{
      let events=[];
      if(mpActive())events=mp.data['pilot-service']?.events||[];
      else if(side){
        const all={...teams,[side]:{roster,turn,locked}};
        for(const [team,t] of Object.entries(all)){
          if(!t?.locked)continue;
          const rows=t.roster.map(r=>({...r,key:team+'/'+r.uid})),seats=rows.filter(r=>r.st?.assignedPilot).map(r=>({key:r.key,pilot:r.st.assignedPilot}));
          t.turn.pilotMatchId=t.turn.pilotMatchId||crypto.randomUUID();
          t.turn.pilotService=GBPilotService.observe(t.turn.pilotService,t.turn.pilotMatchId,rows,seats,unitById);
          events.push(...t.turn.pilotService.events);
        }
      }
      const updated=GBPilotService.apply(p.campaign||GBPilotBuild.fresh(),p.id,events,unitById);
      if(updated){Pilot.setCampaign(updated,{quiet:true});if(profile?.id===p.id)profile={...profile,campaign:updated};Pilot.notify('Battle loss recorded · repair your unit in the hangar');}
    }catch(e){console.error('Pilot loss could not be saved',e);Pilot.notify('Could not save the battle loss. Free device storage and retry.');}
    finally{recording=false;}
  }
  refresh();
  return {recordLosses,refresh,showBuild,open,update,icon,lobbyIdentity,badge};
})();
