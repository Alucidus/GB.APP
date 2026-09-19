/* Pilot identity is stored separately from battle saves and unit-owned traits. */
window.Pilot = (() => {
  const KEY='gb.pilot.v1', SIZE=1254;
  const defaults=()=>({version:1,name:'',callsign:'',background:'',faction:'federation',body:'female',face:0,hair:0,uniform:0,hairColor:'original',browColor:'original',eyeColor:'original',uniformColor:'original'});
  let draft=defaults(),saved=null,tab='appearance',part='body',manifest,pending=0,ready=false;
  const cache=new Map();
  const $=id=>document.getElementById(id);
  const palettes={hairColor:[['Original','original'],['Black','#272932'],['Brown','#79503a'],['Blond','#e0be77'],['Silver','#ccd3db'],['Auburn','#ab513a'],['Blue','#567baa'],['Pink','#c97b9f']],browColor:[['Original','original'],['Black','#272932'],['Brown','#79503a'],['Blond','#b49760'],['Silver','#aeb8c7'],['Auburn','#ab513a'],['Blue','#567baa'],['Pink','#c97b9f']],eyeColor:[['Original','original'],['Brown','#91613e'],['Blue','#4c91cd'],['Green','#58985b'],['Hazel','#b19b57'],['Grey','#95a8b8'],['Violet','#9a75c5']],uniformColor:[['Original','original'],['Navy','#405e90'],['Crimson','#a8444e'],['Forest','#4e795c'],['Sand','#b5a47b'],['White','#d4dce5'],['Charcoal','#515565']]};
  function read(){try{const p=JSON.parse(localStorage.getItem(KEY)||'null');if(p&&p.version===1){const d=defaults();for(const k of ['name','callsign','background'])d[k]=typeof p[k]==='string'?p[k].slice(0,k==='background'?1200:48):'';for(const k of ['body','faction'])if((k==='body'?['male','female']:['federation','spacenoid']).includes(p[k]))d[k]=p[k];for(const [k,max] of [['face',3],['hair',2],['uniform',4]])if(Number.isInteger(p[k])&&p[k]>=0&&p[k]<=max)d[k]=p[k];for(const k of Object.keys(palettes))if(palettes[k].some(x=>x[1]===p[k]))d[k]=p[k];return d;}}catch{}return null;}
  function status(text){$('pilotStatus').textContent=text;}
  function button(text,selected,fn){const b=document.createElement('button');b.type='button';b.className='pilot-option'+(selected?' selected':'');b.textContent=text;b.setAttribute('aria-pressed',String(selected));b.onclick=fn;return b;}
  function choices(label,key,items){const group=document.createElement('fieldset');const legend=document.createElement('legend');legend.textContent=label;group.append(legend);const row=document.createElement('div');row.className='pilot-choices';items.forEach(([text,value])=>{const b=button(text,draft[key]===value,()=>{draft[key]=value;render();});b.dataset.choice=key+':'+value;if(key.endsWith('Color')){b.classList.add('swatch');b.style.setProperty('--swatch',value==='original'?'linear-gradient(135deg,#d4bb84,#344d70)':value);}row.append(b);});group.append(row);return group;}
  function input(label,key,multiline=false){const wrap=document.createElement('label');wrap.className='pilot-field';wrap.textContent=label;const el=document.createElement(multiline?'textarea':'input');el.value=draft[key];el.maxLength=multiline?1200:48;el.id='pilot-'+key;if(multiline)el.rows=5;el.oninput=()=>{draft[key]=el.value;updateCaption();status('Unsaved changes');};wrap.append(el);return wrap;}
  function updateCaption(){$('pilotName').textContent=draft.name.trim()||'Your pilot';$('pilotCallsign').textContent=draft.callsign.trim()||'PILOT REGISTRATION';}
  function render(){
    updateCaption();$('pilotScreen').dataset.faction=draft.faction;
    document.querySelectorAll('[data-pilot-tab]').forEach(b=>{b.classList.toggle('selected',b.dataset.pilotTab===tab);b.setAttribute('aria-selected',String(b.dataset.pilotTab===tab));});
    const panel=$('pilotOptions');panel.replaceChildren();
    if(tab==='identity'){panel.append(input('Pilot name','name'),input('Callsign','callsign'),choices('Faction','faction',[['Federation','federation'],['Spacenoid','spacenoid']]),input('Pilot background','background',true));}
    else if(tab==='appearance'){
      const sections=document.createElement('div');sections.className='pilot-parts';sections.setAttribute('aria-label','Appearance options');for(const [id,label] of [['body','Body'],['hair','Hair'],['eyes','Eyes'],['uniform','Uniform']]){const b=button(label,part===id,()=>{part=id;render();});b.dataset.pilotPart=id;sections.append(b);}panel.append(sections);
      if(part==='body'){
        panel.append(choices('Body','body',[['Female','female'],['Male','male']]),choices('Face','face',[['01',0],['02',1],['03',2],['04',3]]));
        panel.querySelectorAll('[data-choice^="face:"]').forEach((b,i)=>{const image=document.createElement('img');image.src=draft.body==='female'?manifest.female[[0,2,3,1][i]].src:manifest[['male-light','male-east','male-south','male-dark'][i]][0].src;image.alt='';b.prepend(image);b.classList.add('pilot-face');b.setAttribute('aria-label','Face '+(i+1));});
      }
      if(part==='hair')panel.append(choices('Style','hair',(draft.body==='female'?['Bob','Curls','Pixie']:['Spiky','Side part','Curls']).map((x,i)=>[x,i])),choices('Hair colour','hairColor',palettes.hairColor),choices('Eyebrow colour','browColor',palettes.browColor));
      if(part==='eyes')panel.append(choices('Eye colour','eyeColor',palettes.eyeColor));
      if(part==='uniform')panel.append(choices('Uniform','uniform',['Flight black','Officer','Space green','Space light','Tan & red'].map((x,i)=>[x,i])),choices('Uniform colour','uniformColor',palettes.uniformColor));
    }else{
      const heading=document.createElement('h2');heading.textContent=draft.name.trim()||'Pilot record';panel.append(heading);
      const dl=document.createElement('dl');for(const [k,v] of [['Callsign',draft.callsign||'Not set'],['Faction',draft.faction==='federation'?'Federation':'Spacenoid'],['Rank','Rookie'],['Background',draft.background||'No background recorded']]){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=k;dd.textContent=v;dl.append(dt,dd);}panel.append(dl);
      const note=document.createElement('p');note.className='pilot-note';note.textContent='Rookie · No rank bonuses. Mobile suit traits belong to the unit.';panel.append(note);
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
      let mix=smooth(8,38,l)*(1-smooth(190,245,l));
      if(kind==='uniform')mix*=1-smooth(1.12,1.6,r/Math.max(1,g))*smooth(25,65,Math.max(r,g,b)-Math.min(r,g,b));
      const shade=Math.min(1.35,Math.pow(l/110,.72));for(let k=0;k<3;k++)a[i+k]=a[i+k]*(1-mix)+Math.min(255,rgb[k]*shade)*mix;}
    x.putImageData(d,0,0);return c;}
  const femaleFeatures=[{eyes:[[497,504],[755,505]],brows:[[404,405,584,451],[665,405,847,452]]},{eyes:[[479,430],[739,430]],brows:[[399,320,567,372],[650,320,827,372]]},{eyes:[[481,464],[741,463]],brows:[[390,367,564,407],[650,367,825,407]]},{eyes:[[500,512],[758,511]],brows:[[407,411,585,458],[668,411,849,458]]}];
  async function paint(){const token=++pending;ready=false;$('pilotSave').disabled=true;try{
    const female=draft.body==='female',key=female?'female':['male-light','male-east','male-south','male-dark'][draft.face],layers=manifest[key];
    const face=layers[female?[0,2,3,1][draft.face]:0],hair=layers[female?9+draft.hair:((key==='male-light'||key==='male-east')?9:10)+draft.hair];
    const uniform=layers[female?[8,4,5,6,7][draft.uniform]:key==='male-light'?[5,12,7,8,13][draft.uniform]:key==='male-east'?[5,6,7,8,12][draft.uniform]:[6,7,8,9,5][draft.uniform]];
    const [f,h,u]=await Promise.all([load(face),load(hair),load(uniform)]);if(token!==pending)return;
    const canvas=$('pilotCanvas'),ctx=canvas.getContext('2d');ctx.clearRect(0,0,SIZE,SIZE);let faceArt=f;
    if(female){const feat=femaleFeatures[[0,2,3,1][draft.face]];faceArt=tint(f,draft.eyeColor,(x,y,r,g,b,l)=>feat.eyes.some(([cx,cy])=>((x-cx)/25)**2+((y-cy)/25)**2<1)&&l>25&&l<170,'eye');faceArt=tint(faceArt,draft.browColor,(x,y,r,g,b,l)=>feat.brows.some(([a,b,c,d])=>x>=a&&x<=c&&y>=b&&y<=d)&&r<105&&g<90&&l>18,'brow');}
    ctx.drawImage(faceArt,face.box[0],face.box[1]);
    if(!female){for(const layer of layers.filter(l=>/eye|brow/i.test(l.name))){const original=await load(layer);if(token!==pending)return;const brow=/brow/i.test(layer.name);ctx.drawImage(tint(original,brow?draft.browColor:draft.eyeColor,(_,__,r,g,b,l)=>l>18&&l<180,brow?'brow':'eye'),layer.box[0],layer.box[1]);}}
    ctx.drawImage(tint(u,draft.uniformColor,null,'uniform'),uniform.box[0],uniform.box[1]);ctx.drawImage(tint(h,draft.hairColor),hair.box[0],hair.box[1]);ready=true;$('pilotSave').disabled=false;
  }catch(e){if(token===pending)status('Could not load the pilot artwork. Check your connection and reopen Pilot.');console.error(e);}}
  async function open(){saved=read();draft=saved?{...saved}:defaults();tab=saved?'sheet':'appearance';part='body';show('pilotScreen');try{manifest=manifest||await fetch('img/pilots/layers.json').then(r=>{if(!r.ok)throw Error('Pilot assets unavailable');return r.json();});render();m3Init();m3Start();Effects.menuShown();}catch{status('Could not load pilot options. Reopen Pilot to retry.');}}
  function save(){if(!ready)return;if(!draft.name.trim()){tab='identity';render();status('Enter a pilot name before saving.');$('pilot-name').focus();return;}draft.name=draft.name.trim();draft.callsign=draft.callsign.trim();try{localStorage.setItem(KEY,JSON.stringify(draft));saved={...draft};tab='sheet';render();status('Pilot saved on this device');}catch{status('Storage is full or unavailable. Your changes have not been saved.');}}
  function back(){if(JSON.stringify(draft)!==JSON.stringify(saved)&& (saved||draft.name||JSON.stringify(draft)!==JSON.stringify(defaults()))){$('pilotDiscard').hidden=false;$('pilotKeep').focus();return;}show('s0');}
  function init(){const screen=document.createElement('section');screen.id='pilotScreen';screen.className='screen';screen.innerHTML='<div class="m-bg m3" id="pilotBattle" aria-hidden="true"></div><div class="pilot-hangar" aria-hidden="true"></div><div class="pilot-shade" aria-hidden="true"></div><header class="pilot-header"><button class="btn" id="pilotBack">← Menu</button><div><small>PERSONNEL / HANGAR</small><h1>PILOT</h1></div><button class="btn pri" id="pilotSave">Save pilot</button></header><div class="pilot-layout"><div class="pilot-editor"><nav aria-label="Pilot sections" role="tablist"><button data-pilot-tab="identity" role="tab">Identity</button><button data-pilot-tab="appearance" role="tab">Appearance</button><button data-pilot-tab="sheet" role="tab">Record</button></nav><div id="pilotOptions" role="tabpanel"></div><p id="pilotStatus" role="status">Loading pilot artwork…</p></div><div class="pilot-preview"><div class="pilot-caption"><small id="pilotCallsign"></small><h2 id="pilotName"></h2></div><canvas id="pilotCanvas" width="1254" height="1254" role="img" aria-label="Your customised pilot portrait"></canvas></div></div><div id="pilotDiscard" hidden><div role="dialog" aria-modal="true" aria-labelledby="pilotDiscardTitle"><h2 id="pilotDiscardTitle">Leave without saving?</h2><p>Your saved pilot will remain unchanged.</p><button class="btn" id="pilotKeep">Keep editing</button><button class="btn" id="pilotLeave">Discard changes</button></div></div>';
    document.body.append(screen);const scene=$('m3').cloneNode(true);scene.querySelectorAll('.fg').forEach(n=>n.remove());$('pilotBattle').replaceChildren(...scene.children);$('pilotBack').onclick=back;$('pilotSave').onclick=save;$('pilotKeep').onclick=()=>{$('pilotDiscard').hidden=true;};$('pilotLeave').onclick=()=>{$('pilotDiscard').hidden=true;show('s0');};screen.querySelectorAll('[data-pilot-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.pilotTab;render();});
    screen.addEventListener('keydown',e=>{if($('pilotDiscard').hidden)return;if(e.key==='Escape'){e.preventDefault();$('pilotDiscard').hidden=true;$('pilotBack').focus();}if(e.key==='Tab'){e.preventDefault();(document.activeElement===$('pilotKeep')?$('pilotLeave'):$('pilotKeep')).focus();}});
  }
  init();return {open,save,get ready(){return ready;}};
})();
