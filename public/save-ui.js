window.SaveFiles=(()=>{
 let overlay,opener,pending,busy=false,readVersion=0;
 const online=()=>!!mp.code||!!localStorage.getItem(MP_KEY);
 const lookup=id=>unitById(id);
 const validate=data=>GBSave.validate(data,lookup,Pilot.validateSave);
 const node=(tag,text,cls)=>{const e=document.createElement(tag);if(text)e.textContent=text;if(cls)e.className=cls;return e;};
 function message(text){const e=document.getElementById('saveMessage');if(e)e.textContent=text;}
 function current(){
  if(globalThis.GBSaveRecoveryError)throw Error('Reload to finish recovering your previous save before continuing.');
  if(online())throw Error('Leave the online session before exporting an offline backup.');
  if(side){if(CUR&&$('s4').classList.contains('on'))persist();save();stashTeam();}
  const battle=side?{side,teams,battlefield:pickupField,objectives:GBObjectives.init(objectiveField)}:null;
  const preferences={};for(const k of Object.keys(GBSave.prefs)){const v=localStorage.getItem(k);if(v!==null)preferences[k]=v;}
  return validate(GBSave.make(APP_BUILD,Pilot.read(),battle,preferences));
 }
 function download(){try{
  const data=current(),text=JSON.stringify(data,null,2);if(new TextEncoder().encode(text).length>GBSave.MAX)throw Error('This save exceeds the 8 MB limit.');
  const url=URL.createObjectURL(new Blob([text],{type:'application/json'})),a=node('a');a.href=url;a.download='gunpla-battle-save-'+data.createdAt.replace(/[:.]/g,'-')+'.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);message('Save file downloaded. On a phone, check your Downloads or Files app.');
 }catch(e){message(e.message);}}
 function close(){if(busy)return;readVersion++;pending=null;overlay?.remove();overlay=null;opener?.focus();}
 function preview(data){
  const box=$('savePreview');box.replaceChildren();box.append(node('h3','Review this save'));
  const dl=node('dl');const row=(a,b)=>dl.append(node('dt',a),node('dd',b));row('Pilot',data.pilot?data.pilot.name||'Unnamed pilot':'No saved pilot');row('Saved',new Date(data.createdAt).toLocaleString());row('Build',data.build+' · save format 1');
  for(const t of ['federation','spacenoid']){const team=data.battle?.teams[t];row(t==='federation'?'Federation':'Spacenoids',team?team.roster.length+' units · '+team.budget+' DP · turn '+team.turn.round:'No roster');}
  row('Objectives',String(Object.keys(data.battle?.objectives?.items||{}).length));row('Dropped equipment records',String(Object.keys(data.battle?.battlefield?.items||{}).length));box.append(dl,node('p','Import replaces the saved pilot, both offline rosters, battle progress, and preferences on this device. Missing sections in this file will clear those sections here.','save-warning'));
  const backup=node('button','Export current save first','btn');backup.type='button';backup.onclick=download;box.append(backup);$('saveConfirm').disabled=false;
 }
 async function choose(file){
  const version=++readVersion;pending=null;$('saveConfirm').disabled=true;$('savePreview').replaceChildren();
  if(!file)return;
  try{if(online())throw Error('Leave the online session before importing.');if(file.size>GBSave.MAX)throw Error('Save files must be smaller than 8 MB.');const text=await file.text();if(!overlay||version!==readVersion)return;
   pending=GBSave.parse(text,lookup,Pilot.validateSave);preview(pending);message('File checked. Review the preview, then confirm import.');
  }catch(e){message(e.message);}
 }
 function confirm(){
  if(!pending||busy)return;
  try{if(globalThis.GBSaveRecoveryError)throw Error('Reload to finish recovering your previous save.');if(online())throw Error('An online session is active. Leave it before importing.');const data=validate(pending);busy=true;GBSave.commit(localStorage,data);location.reload();}
  catch(e){busy=false;message(e.message);}
 }
 function open(){
  close();opener=document.activeElement;pending=null;overlay=node('div',null,'save-overlay');
  const panel=node('section',null,'save-panel');panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-labelledby','saveTitle');
  const header=node('header'),title=node('h2','Save files');title.id='saveTitle';const cancel=node('button','Close','btn sm');cancel.id='saveClose';cancel.type='button';cancel.onclick=close;header.append(title,cancel);
  const body=node('div',null,'save-body');body.append(node('p','Back up your saved pilot and offline game, or move them to another device. Artwork stays in the app; assigned pilot icons are included. Online sessions and site passwords are excluded.'));
  const actions=node('div',null,'save-actions'),out=node('button','Export Save','btn pri');out.id='saveExport';out.type='button';out.onclick=download;
  const label=node('label','Import Save','btn'),input=node('input');input.id='saveInput';input.type='file';input.accept='.json,application/json';input.onchange=()=>choose(input.files[0]);label.append(input);actions.append(out,label);body.append(actions);
  const status=node('p',globalThis.GBSaveRecoveryError||'Save your pilot changes before exporting.','save-message');status.id='saveMessage';status.setAttribute('role','status');body.append(status);
  const box=node('div');box.id='savePreview';body.append(box);
  const footer=node('footer'),button=node('button','Confirm import & replace','btn pri');button.id='saveConfirm';button.type='button';button.disabled=true;button.onclick=confirm;footer.append(button);
  if(online()){out.disabled=true;input.disabled=true;status.textContent='Leave the online session before exporting or importing an offline save.';}
  panel.append(header,body,footer);overlay.append(panel);document.body.append(overlay);cancel.focus();
  overlay.addEventListener('keydown',e=>{if(e.key==='Escape')close();if(e.key==='Tab'){const f=[...panel.querySelectorAll('button:not(:disabled),input:not(:disabled)')];if(e.shiftKey&&document.activeElement===f[0]){e.preventDefault();f.at(-1).focus();}else if(!e.shiftKey&&document.activeElement===f.at(-1)){e.preventDefault();f[0].focus();}}});
 }
 return {open,current};
})();
