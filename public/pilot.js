/* Pilot identity is stored separately from battle saves and unit-owned traits. */
window.Pilot = (() => {
  const KEY='gb.pilot.v1', SIZE=1254, HEIGHT=1500;
  const defaults=()=>({version:1,name:'',callsign:'',background:'',faction:'federation',body:'female',face:0,hair:0,beard:0,facialHairColor:'original',uniform:0,hairColor:'original',browColor:'original',eyeColor:'original',uniformColor:'original'});
  let editing=true,homeTab='shop';
  let draft=defaults(),saved=null,tab='appearance',part='body',manifest,pending=0,ready=false;
  const cache=new Map();
  const $=id=>document.getElementById(id);
  const palettes={hairColor:[['Original','original'],['Black','#272932'],['Brown','#79503a'],['Blond','#e0be77'],['Silver','#ccd3db'],['Auburn','#ab513a'],['Blue','#567baa'],['Pink','#c97b9f']],browColor:[['Original','original'],['Black','#272932'],['Brown','#79503a'],['Blond','#b49760'],['Silver','#aeb8c7'],['Auburn','#ab513a'],['Blue','#567baa'],['Pink','#c97b9f']],eyeColor:[['Original','original'],['Brown','#91613e'],['Blue','#4c91cd'],['Green','#58985b'],['Hazel','#b19b57'],['Grey','#95a8b8'],['Violet','#9a75c5']],uniformColor:[['Original','original'],['Navy','#405e90'],['Crimson','#a8444e'],['Forest','#4e795c'],['Sand','#b5a47b'],['White','#d4dce5'],['Charcoal','#515565']]};
  palettes.facialHairColor=palettes.hairColor;
  function validateSave(p){
    if(p?.id!==undefined&&!GBPilotService.validId(p.id))return false;
    if(!p||p.version!==1||!['male','female'].includes(p.body)||!['federation','spacenoid','neutral'].includes(p.faction))return false;
    for(const k of ['name','callsign','background'])if(typeof p[k]!=='string'||p[k].length>(k==='background'?1200:48))return false;
    for(const [k,max] of [['face',3],['hair',p.body==='female'?8:11],['beard',5],['uniform',4]])if(!Number.isInteger(p[k])||p[k]<0||p[k]>max)return false;
    return (p.campaign===undefined||GBPilotBuild.valid(p.campaign))&&Object.keys(palettes).every(k=>palettes[k].some(x=>x[1]===p[k]));
  }
  function read(){try{const p=JSON.parse(localStorage.getItem(KEY)||'null');if(p&&p.version===1){const d=defaults();for(const k of ['name','callsign','background'])d[k]=typeof p[k]==='string'?p[k].slice(0,k==='background'?1200:48):'';for(const k of ['body','faction'])if((k==='body'?['male','female']:['federation','spacenoid','neutral']).includes(p[k]))d[k]=p[k];for(const [k,max] of [['face',3],['hair',d.body==='female'?8:11],['beard',5],['uniform',4]])if(Number.isInteger(p[k])&&p[k]>=0&&p[k]<=max)d[k]=p[k];for(const k of Object.keys(palettes))if(palettes[k].some(x=>x[1]===p[k]))d[k]=p[k];if(p.campaign&&GBPilotBuild.valid(p.campaign))d.campaign=p.campaign;d.id=GBPilotService.validId(p.id)?p.id:crypto.randomUUID();if(!GBPilotService.validId(p.id))localStorage.setItem(KEY,JSON.stringify(d));return d;}}catch{}return null;}
  function status(text){$('pilotStatus').textContent=text;}
  function button(text,selected,fn){const b=document.createElement('button');b.type='button';b.className='pilot-option'+(selected?' selected':'');b.textContent=text;b.setAttribute('aria-pressed',String(selected));b.onclick=fn;return b;}
  function choices(label,key,items){const group=document.createElement('fieldset');const legend=document.createElement('legend');legend.textContent=label;group.append(legend);const row=document.createElement('div');row.className='pilot-choices';items.forEach(([text,value])=>{const b=button(text,draft[key]===value,()=>{draft[key]=value;if(key==='body'&&value==='female'&&draft.hair>8)draft.hair=0;render();});b.dataset.choice=key+':'+value;if(key.endsWith('Color')){b.classList.add('swatch');b.style.setProperty('--swatch',value==='original'?'linear-gradient(135deg,#d4bb84,#344d70)':value);}row.append(b);});group.append(row);return group;}
  function groupKey(profile=draft){return profile.body==='female'?'female':['male-light','male-east','male-south','male-dark'][profile.face];}
  function tiles(label,key,names,images){const field=choices(label,key,names.map((name,i)=>[name,i]));field.classList.add('pilot-tile-field');field.dataset.control=key;field.querySelectorAll('button').forEach((b,i)=>{const caption=document.createElement('span');caption.textContent=b.textContent;b.replaceChildren();const img=document.createElement('img');img.src=images[i];img.alt='';img.loading='lazy';b.append(img,caption);b.classList.add('pilot-tile');});return field;}
  function input(label,key,multiline=false){const wrap=document.createElement('label');wrap.className='pilot-field';wrap.textContent=label;const el=document.createElement(multiline?'textarea':'input');el.value=draft[key];el.maxLength=multiline?1200:48;el.id='pilot-'+key;if(multiline)el.rows=5;el.oninput=()=>{draft[key]=el.value;updateCaption();status('Unsaved changes');};wrap.append(el);return wrap;}
  function updateCaption(){$('pilotName').textContent=draft.name.trim()||'Your pilot';$('pilotCallsign').textContent=draft.callsign.trim()||'PILOT REGISTRATION';}
  function render(){
    updateCaption();$('pilotScreen').dataset.faction=draft.faction;
    const home=!!saved&&!editing,unitBay=home&&(homeTab==='shop'||homeTab==='hangar');$('pilotScreen').classList.toggle('pilot-home',home);$('pilotScreen').classList.toggle('pilot-unit-bay',unitBay);$('pilotScreen').classList.toggle('pilot-sheet-scene',home&&!unitBay);
    let bay=$('pilotUnitBay');if(!bay){bay=document.createElement('section');bay.id='pilotUnitBay';bay.setAttribute('aria-label','Selected mobile suit');document.querySelector('#pilotScreen .pilot-layout').append(bay);}bay.hidden=!unitBay;
    document.querySelector('.pilot-header h1').textContent=unitBay?(homeTab==='hangar'?'YOUR HANGAR':'UNIT SHOP'):home?'PILOT SHEET':'PILOT STUDIO';$('pilotSave').hidden=home;$('pilotHome').hidden=!home;$('pilotEditPortrait').hidden=!home;
    $('pilotBack').textContent=editing&&saved?'← Pilot home':'← Menu';
    if(home){renderHome();status('Pilot saved on this device');paint();return;}

    document.querySelectorAll('[data-pilot-tab]').forEach(b=>{b.classList.toggle('selected',b.dataset.pilotTab===tab);b.setAttribute('aria-selected',String(b.dataset.pilotTab===tab));});
    const panel=$('pilotOptions');panel.replaceChildren();
    if(tab==='identity'){panel.append(input('Pilot name','name'),input('Callsign','callsign'),choices('Faction','faction',[['Federation','federation'],['Spacenoid','spacenoid'],['Neutral','neutral']]),input('Pilot background','background',true));}
    else if(tab==='appearance'){
      const sections=document.createElement('div');sections.className='pilot-parts';sections.setAttribute('aria-label','Appearance options');for(const [id,label] of [['body','Face'],['hair','Hair'],...(draft.body==='male'?[['beard','Facial hair']]:[]),['eyes','Eyes'],['uniform','Uniform']]){const b=button(label,part===id,()=>{part=id;render();});b.dataset.pilotPart=id;sections.append(b);}panel.append(sections);
      if(part==='body'){
        panel.append(choices('Body','body',[['Female','female'],['Male','male']]),choices('Face','face',[['01',0],['02',1],['03',2],['04',3]]));
        panel.querySelectorAll('[data-choice^="face:"]').forEach((b,i)=>{const image=document.createElement('img');image.src=draft.body==='female'?manifest._creator.groups.female.faceThumbs[i]:manifest._creator.groups[['male-light','male-east','male-south','male-dark'][i]].faceThumbs[0];image.alt='';b.prepend(image);b.classList.add('pilot-face');b.setAttribute('aria-label','Face '+(i+1));});
      }
      if(part==='hair')panel.append(tiles('Choose your hairstyle','hair',manifest._creator.hairNames[draft.body],manifest._creator.groups[groupKey()].hairThumbs),choices('Hair colour','hairColor',palettes.hairColor),choices('Eyebrow colour','browColor',palettes.browColor));
      if(part==='beard')panel.append(tiles('Facial hair','beard',manifest._creator.beardNames,manifest._creator.groups[groupKey()].beardThumbs),choices('Facial hair colour','facialHairColor',palettes.facialHairColor));
      if(part==='eyes')panel.append(choices('Eye colour','eyeColor',palettes.eyeColor));
      if(part==='uniform')panel.append(choices('Uniform','uniform',['Flight black','Officer','Space green','Space light','Tan & red'].map((x,i)=>[x,i])),choices('Uniform colour','uniformColor',palettes.uniformColor));
    }
    status(JSON.stringify(draft)===JSON.stringify(saved)?'Pilot saved on this device':'Unsaved changes');paint();
  }
  // Read the PSD layer pixels at their original fitted coordinates. Remove only
  // detached speckles; preserve the main silhouette and its antialiased edge.
  async function load(layer){
    if(cache.has(layer.src)){const hit=cache.get(layer.src);cache.delete(layer.src);cache.set(layer.src,hit);return hit;}
    const promise=(async()=>{
      const im=new Image();im.src=layer.src;await im.decode();
      const c=document.createElement('canvas');c.width=im.width;c.height=im.height;
      const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(im,0,0);
      if(layer.preserveDetails)return c;
      const data=ctx.getImageData(0,0,c.width,c.height),a=data.data,w=c.width,h=c.height,seen=new Uint8Array(w*h),queue=new Int32Array(w*h);
      for(let i=0;i<w*h;i++){
        if(seen[i]||a[i*4+3]<8)continue;
        let head=0,tail=1;queue[0]=i;seen[i]=1;
        while(head<tail){
          const p=queue[head++],x=p%w;
          for(let dir=0;dir<4;dir++){
            const n=dir===0?(x?p-1:-1):dir===1?(x<w-1?p+1:-1):dir===2?p-w:p+w;
            if(n>=0&&n<w*h&&!seen[n]&&a[n*4+3]>=8){seen[n]=1;queue[tail++]=n;}
          }
        }
        if(tail<500)for(let j=0;j<tail;j++)a[queue[j]*4+3]=0;
      }
      ctx.putImageData(data,0,0);return c;
    })();
    cache.set(layer.src,promise);
    // Limit decoded artwork memory when a phone browses every face and outfit.
    while(cache.size>12)cache.delete(cache.keys().next().value);
    try{return await promise;}catch(e){cache.delete(layer.src);throw e;}
  }
  function tint(canvas,color,mask,kind){if(color==='original')return canvas;const c=document.createElement('canvas');c.width=canvas.width;c.height=canvas.height;const x=c.getContext('2d');x.drawImage(canvas,0,0);const d=x.getImageData(0,0,c.width,c.height),a=d.data,rgb=color.match(/[a-f0-9]{2}/gi).map(v=>parseInt(v,16)),smooth=(lo,hi,v)=>{const t=Math.max(0,Math.min(1,(v-lo)/(hi-lo)));return t*t*(3-2*t);};for(let i=0;i<a.length;i+=4){if(!a[i+3])continue;const r=a[i],g=a[i+1],b=a[i+2],l=.2126*r+.7152*g+.0722*b,px=(i/4)%c.width,py=Math.floor(i/4/c.width);if(mask&&!mask(px,py,r,g,b,l))continue;
      // Iris pigment includes very dark brown shadows. Do not blend their
      // original hue back in; keep neutral pupils and catchlights unchanged.
      if(kind==='eye'){
        if(l>185||Math.max(r,g,b)<8||Math.max(r,g,b)-Math.min(r,g,b)<4)continue;
        const shade=Math.min(1.35,Math.pow(l/110,.72));
        for(let k=0;k<3;k++)a[i+k]=Math.min(255,rgb[k]*shade);
        continue;
      }
      let mix=smooth(8,38,l)*(1-smooth(190,245,l));
      if(kind==='uniform')mix*=1-smooth(1.12,1.6,r/Math.max(1,g))*smooth(25,65,Math.max(r,g,b)-Math.min(r,g,b));
      const shade=Math.min(1.35,Math.pow(l/110,.72));for(let k=0;k<3;k++)a[i+k]=a[i+k]*(1-mix)+Math.min(255,rgb[k]*shade)*mix;}
    x.putImageData(d,0,0);return c;}
  const femaleFeatures=[{eyes:[[497,504],[755,505]],brows:[[404,405,584,451],[665,405,847,452]]},{eyes:[[479,426,28,29],[739,426,28,29]],brows:[[399,320,567,372],[650,320,827,372]]},{eyes:[[481,464],[741,463]],brows:[[390,367,564,407],[650,367,825,407]]},{eyes:[[497,506,27,28],[755,506,27,28]],brows:[[407,411,585,458],[668,411,849,458]]}];
  // Face 1's original male cutouts include a few pixels beyond the iris rim.
  // Keep those source edge pixels unchanged instead of tinting the sclera.
  function maleFirstIris(layer,x,y){
    const points=layer.box[0]>600?[[6,4],[40,4],[44,10],[44,22],[42,28],[38,34],[32,38],[20,38],[12,34],[6,28],[4,22],[3,12]]:[[10,2],[39,2],[44,6],[46,12],[46,20],[44,26],[40,32],[34,36],[24,36],[16,33],[10,28],[6,22],[5,12],[7,6]];
    let inside=false;for(let i=0,j=points.length-1;i<points.length;j=i++){const [xi,yi]=points[i],[xj,yj]=points[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)inside=!inside;}return inside;
  }
  async function renderPortrait(profile,canvas,isCurrent=()=>true){
    const female=profile.body==='female',key=groupKey(profile),layers=manifest[key],map=manifest._creator.groups[key];
    const face=layers[map.faces[female?profile.face:0]],hair=layers[map.hairs[profile.hair]],uniform=layers[map.uniforms[profile.uniform]],beard=!female&&profile.beard?layers[map.beards[profile.beard-1]]:null;
    const [f,h,u]=await Promise.all([load(face),load(hair),load(uniform)]);if(!isCurrent())return;
    const ctx=canvas.getContext('2d');ctx.clearRect(0,0,SIZE,HEIGHT);let faceArt=f;
    if(female){const feat=femaleFeatures[[0,2,3,1][profile.face]];faceArt=tint(f,profile.eyeColor,(x,y,r,g,b,l)=>feat.eyes.some(([cx,cy,rx=25,ry=25])=>((x-cx)/rx)**2+((y-cy)/ry)**2<1),'eye');faceArt=tint(faceArt,profile.browColor,(x,y,r,g,b,l)=>feat.brows.some(([a,b,c,d])=>x>=a&&x<=c&&y>=b&&y<=d)&&r<105&&g<90&&l>18,'brow');}
    ctx.drawImage(faceArt,face.box[0],face.box[1]);
    if(!female){for(const layer of layers.filter(l=>/eye|brow/i.test(l.name))){const original=await load(layer);if(!isCurrent())return;const brow=/brow/i.test(layer.name);ctx.drawImage(tint(original,brow?profile.browColor:profile.eyeColor,(x,y,r,g,b,l)=>brow?(l>18&&l<180):(key!=='male-light'||maleFirstIris(layer,x,y)),brow?'brow':'eye'),layer.box[0],layer.box[1]);}}
    ctx.drawImage(tint(u,profile.uniformColor,null,'uniform'),uniform.box[0],uniform.box[1]);
    // Facial hair stays below scalp hair, so long strands cover beards naturally.
    if(beard){const b=await load(beard);if(!isCurrent())return;ctx.drawImage(tint(b,profile.facialHairColor),beard.box[0],beard.box[1]);}
    ctx.drawImage(tint(h,profile.hairColor),hair.box[0],hair.box[1]);
  }
  async function paint(){const token=++pending;ready=false;$('pilotSave').disabled=true;try{
    await renderPortrait({...draft},$('pilotCanvas'),()=>token===pending);if(token!==pending)return;
    ready=true;$('pilotSave').disabled=false;
  }catch(e){if(token===pending)status('Could not load the pilot artwork. Check your connection and reopen Pilot.');console.error(e);}}
  let avatarJob=null;
  async function identity(){
    const profile=read();if(!profile?.name.trim())return null;
    const signature=JSON.stringify(profile),key='gb.pilot.avatar.v1';
    try{const cached=JSON.parse(localStorage.getItem(key)||'null');if(cached?.signature===signature&&/^data:image\/webp;base64,[A-Za-z0-9+/=]+$/.test(cached.portrait)&&cached.portrait.length<24000)return {id:profile.id,name:profile.name,portrait:cached.portrait,campaign:profile.campaign||GBPilotBuild.fresh()};}catch{}
    if(avatarJob?.signature===signature)return avatarJob.promise;
    const promise=(async()=>{
      manifest=manifest||await fetch('img/pilots/layers.json').then(r=>{if(!r.ok)throw Error('Pilot assets unavailable');return r.json();});
      const canvas=document.createElement('canvas');canvas.width=SIZE;canvas.height=HEIGHT;await renderPortrait(profile,canvas);
      const icon=document.createElement('canvas');icon.width=icon.height=128;
      icon.getContext('2d').drawImage(canvas,180,180,900,900,0,0,128,128);
      const portrait=icon.toDataURL('image/webp',.8);try{localStorage.setItem(key,JSON.stringify({signature,portrait}));}catch{}
      return {id:profile.id,name:profile.name,portrait,campaign:profile.campaign||GBPilotBuild.fresh()};
    })();avatarJob={signature,promise};try{return await promise;}finally{if(avatarJob?.promise===promise)avatarJob=null;}
  }
  async function open(destination='shop'){window.PilotSocial?.recordLosses();saved=read();draft=saved?{...saved}:defaults();editing=!saved;homeTab=['shop','hangar','sheet'].includes(destination)?destination:'shop';tab='appearance';part='body';show('pilotScreen');try{manifest=manifest||await fetch('img/pilots/layers.json').then(r=>{if(!r.ok)throw Error('Pilot assets unavailable');return r.json();});render();m3Init();m3Start();Effects.menuShown();}catch{status('Could not load pilot options. Reopen Pilot to retry.');}}
  function save(){if(!ready)return;if(!draft.name.trim()){tab='identity';render();status('Enter a pilot name before saving.');$('pilot-name').focus();return;}draft.id=draft.id||crypto.randomUUID();draft.name=draft.name.trim();draft.callsign=draft.callsign.trim();try{localStorage.setItem(KEY,JSON.stringify(draft));saved={...draft};editing=false;homeTab='shop';render();status('Pilot saved on this device');notify('Pilot saved');window.PilotSocial?.refresh();}catch{status('Storage is full or unavailable. Your changes have not been saved.');}}
  function notify(text){document.getElementById('pilotSavedToast')?.remove();const e=document.createElement('div');e.id='pilotSavedToast';e.setAttribute('role','status');e.textContent='✓ '+text;document.body.append(e);setTimeout(()=>e.remove(),4000);}
  function setCampaign(c,{quiet=false}={}){const p=read();if(!p)throw Error('Save your pilot first.');if(!GBPilotBuild.valid(c))throw Error('Invalid campaign data.');p.campaign=c;localStorage.setItem(KEY,JSON.stringify(p));saved=p;draft.campaign=structuredClone(c);if(manifest&&(!quiet||$('pilotScreen').classList.contains('on')))render();window.PilotSocial?.refresh();}
  function showHangar(){homeTab='hangar';editing=false;render();}
  function edit(){editing=true;tab='appearance';render();$('pilotBack').focus();}
  function renderHome(){
    const box=$('pilotHome');box.replaceChildren();const nav=document.createElement('nav');nav.className='pilot-home-tabs';
    for(const [id,label] of [['shop','Unit shop'],['hangar','Your hangar'],['sheet','Pilot sheet']]){const b=button(label,homeTab===id,()=>{homeTab=id;render();});b.dataset.homeTab=id;nav.append(b);}box.append(nav);
    const content=document.createElement('div');content.className='pilot-home-content';box.append(content);
    if(homeTab==='shop'||homeTab==='hangar'){PilotShop.mount(content,homeTab);return;}
    PilotRecord.render(content,draft,()=>{homeTab='shop';render();},showHangar);
  }
  function leaveEditor(){saved=read();draft=saved?{...saved}:defaults();if(saved){editing=false;homeTab='shop';render();}else show('s0');}
  function back(){if(JSON.stringify(draft)!==JSON.stringify(saved)&& (saved||draft.name||JSON.stringify(draft)!==JSON.stringify(defaults()))){$('pilotDiscard').hidden=false;$('pilotKeep').focus();return;}if(editing&&saved)leaveEditor();else show('s0');}
  // Coordinates use the original hangar image, not the cropped phone viewport.
  const flightRoutes=[
    [12,57,95,5],[95,5,12,57],[90,57,8,5],[8,5,90,57],
    [8,43,95,20],[95,20,8,43],[36,60,68,2],[68,2,36,60]
  ];
  let lastFlight=-1;
  function chooseFlight(){
    const stage=document.querySelector('.pilot-flight-space');
    // Avoid immediate repetition; change only during the offscreen interval.
    const choice=Math.floor(Math.random()*(flightRoutes.length-(lastFlight<0?0:1)));
    const index=lastFlight<0?choice:choice>=lastFlight?choice+1:choice;
    lastFlight=index;stage.dataset.route=String(index);stage.dataset.scene=stage.dataset.scene==='duel'?'chase':'duel';
    const [x0,y0,x2,y2]=flightRoutes[index],dx=x2-x0,dy=y2-y0;
    for(const [name,value] of Object.entries({x0,y0,x1:x0+dx*.145,y1:y0+dy*.145,x2,y2}))stage.style.setProperty('--flight-'+name,value+'%');
    stage.style.setProperty('--flight-angle',(Math.atan2(dx*1672,-dy*941)*180/Math.PI)+'deg');
    stage.style.setProperty('--flight-mirror',dx<0?'-1':'1');
  }
  function init(){const screen=document.createElement('section');screen.id='pilotScreen';screen.className='screen';screen.innerHTML='<div class="m-bg m3" id="pilotBattle" aria-hidden="true"></div><div class="pilot-flyby" aria-hidden="true"><div class="pilot-flight-space"><div class="pilot-flight pilot-flyby-gundam"><div class="pilot-craft"><img src="img/pilots/flyby/gundam.png" alt=""></div></div><div class="pilot-flight pilot-flyby-zakus"><div class="pilot-craft"><img src="img/pilots/flyby/zakus.png" alt=""></div></div></div></div><div class="pilot-hangar" aria-hidden="true"></div><div class="pilot-shade" aria-hidden="true"></div><header class="pilot-header"><button class="btn" id="pilotBack">← Menu</button><div><small>PERSONNEL · HANGAR 01</small><h1>PILOT STUDIO</h1></div><button class="btn pri" id="pilotSave">Save pilot</button></header><div class="pilot-layout"><section id="pilotHome" hidden></section><div class="pilot-editor"><nav aria-label="Pilot sections" role="tablist"><button data-pilot-tab="identity" role="tab">Identity</button><button data-pilot-tab="appearance" role="tab">Appearance</button></nav><div id="pilotOptions" role="tabpanel"></div><p id="pilotStatus" role="status">Loading pilot artwork…</p></div><div class="pilot-preview"><button type="button" id="pilotEditPortrait" hidden aria-label="Edit character"><span>Tap portrait to edit</span></button><div class="pilot-preview-label" aria-hidden="true"><span>PERSONNEL FILE</span><b>01 / PILOT</b></div><div class="pilot-caption"><small id="pilotCallsign"></small><h2 id="pilotName"></h2></div><canvas id="pilotCanvas" width="1254" height="1500" role="img" aria-label="Your customised pilot portrait"></canvas></div></div><div id="pilotDiscard" hidden><div role="dialog" aria-modal="true" aria-labelledby="pilotDiscardTitle"><h2 id="pilotDiscardTitle">Leave without saving?</h2><p>Your saved pilot will remain unchanged.</p><button class="btn" id="pilotKeep">Keep editing</button><button class="btn" id="pilotLeave">Discard changes</button></div></div>';
    document.body.append(screen);
    screen.querySelector('.pilot-flight-space').insertAdjacentHTML('beforeend','<div class="pilot-duel"><div class="pilot-sazabi"><img class="pilot-sazabi-art" src="img/pilots/flyby/sazabi.png" alt=""><div class="pilot-shield-impact"><img class="pilot-duel-beam" src="img/fx/beam-p.webp" alt=""><img class="pilot-duel-blast" src="img/fx/star-p.webp" alt=""><img class="pilot-duel-ring" src="img/fx/ring-o.webp" alt=""></div></div><div class="pilot-nu"><img src="img/pilots/flyby/nu.png" alt=""></div></div>');
    chooseFlight();screen.querySelector('.pilot-flyby-gundam').addEventListener('animationiteration',chooseFlight);const scene=$('m3').cloneNode(true);scene.querySelectorAll('.fg').forEach(n=>n.remove());$('pilotBattle').replaceChildren(...scene.children);$('pilotBack').onclick=back;$('pilotSave').onclick=save;$('pilotEditPortrait').onclick=edit;$('pilotKeep').onclick=()=>{$('pilotDiscard').hidden=true;};$('pilotLeave').onclick=()=>{$('pilotDiscard').hidden=true;leaveEditor();};screen.querySelectorAll('[data-pilot-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.pilotTab;render();});
    screen.addEventListener('keydown',e=>{if($('pilotDiscard').hidden)return;if(e.key==='Escape'){e.preventDefault();$('pilotDiscard').hidden=true;$('pilotBack').focus();}if(e.key==='Tab'){e.preventDefault();(document.activeElement===$('pilotKeep')?$('pilotLeave'):$('pilotKeep')).focus();}});
  }
  init();return {showHangar,open,save,identity,read,validateSave,setCampaign,notify,get ready(){return ready;}};
})();
