/* Mobile-suit equipment rules. State uses stable item IDs, never weapon row indices. */
const MSE = (() => {
  const arms = ['rightArm', 'leftArm'];
  const excluded = /^(infinite-justice|rising-freedom|gundam-turn-a)/;
  const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const supported = u => !!u && !u.type && !excluded.test(u.id);
  function catalog(u) {
    if (!supported(u)) return [];
    if (u.equipment) return u.equipment;
    const items = [], byKey = {};
    u.weapons.forEach((w, i) => {
      if (w.name === '—') return;
      let key = slug(w.name), kind = /Melee/i.test(w.range) ? 'melee' : 'ranged', mount = 'hand', parent = null;
      let count = /(?:x|×)\s*2|2\s*(?:x|×)|Dual Beam Sabers|or 2 for Advantage/i.test(w.name+' '+w.text) ? 2 : 1;
      if (/phenex/.test(u.id) && /Beam Saber/.test(w.name)) count=2;
      if (w.name==='Beam Tomahawks') count=2;
      let cost = kind === 'melee' && /^2$/.test(w.ap) ? 2 : 1;
      if (/dagger|schneider/i.test(w.name)) cost = 0;
      if (/Vulcan|CIWS|Funnels|^GDU-|Multi-Phase Cannon|Railguns|^Mega Particle Cannon|^MPC Scatter|RAPTOR/.test(w.name)) mount = 'body';
      if (/Head Vulcan|^Vulcan|Vulcan Guns|Wing Vulcan/.test(w.name)) mount = 'head';
      if (/Shield|AA-DE/.test(w.name)) mount = 'shield';
      if (/phenex/.test(u.id) && /Armed Armor DE/.test(w.name)) mount = 'body';
      if (/Rev\. Launcher/.test(w.name)) { mount = 'attachment'; parent = 'beam-magnum'; }
      if (/VSBR/.test(w.name)) key = 'vsbr';
      if (/Shield MPC/.test(w.name)) key = 'shield-mpc';
      if (/Beam Sword \(/.test(w.name)) key = 'beam-sword';
      if (/Machine Cannons/.test(w.name)) mount = 'body';
      if (/gouf-ms/.test(u.id)) { if (/Forearm/.test(w.name)) mount = 'leftArm'; if (/Heat Rod/.test(w.name)) mount = 'rightArm'; }
      if (/gundam-epyon/.test(u.id) && /Heat Rod/.test(w.name)) mount = 'shield';
      if (/gundam-jiyan|master-gundam/.test(u.id)) mount = 'body';
      if (/Songbird/.test(w.name)) mount = 'body';
      if (/Hunter Edges/.test(w.name)) mount = 'legs';
      if (/Palma/.test(w.name)) mount = 'arms';
      if (/nightingale/.test(u.id) && w.name === 'Beam Saber') mount = 'body';
      if (/BuCUE/.test(w.name)) { kind = 'melee'; w.range = 'Melee 20cm'; }
      if (/Flash-Edge|Throwable Beam Dagger/.test(w.name)) mount = 'throw';
      if (/TBR Dual/.test(w.name)) { key = 'twin-buster'; count = 1; }
      const twoHands = /Sniper|TBR Dual/.test(w.name) || (/destiny-gundam/.test(u.id) && /M2000/.test(w.name));
      const exclusive = /exia/.test(u.id) && w.name === 'GN Sword';
      if (exclusive) { kind = 'hybrid'; cost = 2; }
      let bonus = null;
      const explicit = (w.text || '').match(/\+(\d+) Melee Roll Bonus/);
      if (explicit) bonus = +explicit[1];
      else if (/Tomahawk|Arondight/.test(w.name)) bonus = 4;
      else if (/Beam Saber|Cold Fusion Saber/.test(w.name)) bonus = 3;
      else if (/Heat Hawk|Heat Axe|Beam Hawk|Javelin|Spear|Lance/.test(w.name) && kind === 'melee') bonus = 2;
      else if (/Dagger|Schneider/i.test(w.name)) bonus = 1;
      if (Number.isFinite(w.meleeBonus)) bonus=w.meleeBonus;
      if (/Javelin/.test(w.name)) w.range = 'Melee 30cm';
      if (/GN Beam Dagger/.test(w.name)) w.text = w.text.replace('1 AP for one, 2 AP for the pair', '0 AP to equip an individual dagger; the special Dagger Guard combination still costs 2 AP');
      w.equipKey = key;
      if (byKey[key]) { byKey[key].rows.push(i); return; }
      const item = {key, name:w.name.replace(/ \((Low-Speed|std)\)/,''), kind, mount, parent, count, cost, twoHands, exclusive, bonus, rows:[i]};
      items.push(item); byKey[key] = item;
    });
    if (/gundam-pixy/.test(u.id)) items.push({key:'beam-dagger-melee',name:'Beam Dagger (melee)',kind:'melee',mount:'hand',count:1,cost:0,bonus:1,rows:[],damage:'2/4',range:'Melee 10cm'});
    // Destiny's alternate blade profile was previously buried in Palma's description.
    if (/destiny-gundam/.test(u.id)) items.push({key:'flash-edge-blade',name:'Flash-Edge (blade)',kind:'melee',mount:'hand',count:2,cost:0,bonus:1,rows:[],damage:'2/4',range:'Melee 10cm'});
    u.abilities.forEach(a=>{if(a.kind==='matrix')a.text=a.text.replace('Each blade can still be drawn on its own at its listed stats, for 1 AP.', 'Each blade can still be drawn individually at its listed stats: daggers 0 AP, other ordinary blades 1 AP. Special pairs retain their 2 AP cost.');});
    u.equipment = items; return items;
  }
  const item = (u, ref) => catalog(u).find(x => ref === x.key || ref?.startsWith(x.key+'#'));
  const ref = (x, n=0) => x.key+'#'+n;
  function init(u, s) {
    if (!supported(u)) return null;
    const cats = catalog(u);
    if (!s.eq || s.eq.v !== 1) {
      const main = cats.find(x => x.mount === 'hand' && (x.kind === 'ranged' || x.kind === 'hybrid'));
      s.eq = {v:1,hands:[null,null],dropped:[],shields:(u.shields||[]).map((x,i) => /Coating/.test(x.label||'') || u.ring || /^zaku-ii/.test(u.id) ? 'body' : arms[i === 0 ? 1 : 0]),shieldDropped:[],mode:'rifle',segment:false};
      if (main) { s.eq.hands[0]=ref(main); if(main.twoHands) s.eq.hands[1]=ref(main); }
    }
    const e=s.eq;
    // Keep the original reference on its lost arm until recovery; repairs/undo restore it naturally.
    e.dropped=e.dropped.filter(r=>!e.hands.includes(r)||e.hands.some((v,i)=>v===r&&s.hp?.[arms[i]]<=0));
    e.shieldDropped=e.shieldDropped.filter(i=>!e.shields[i]||s.hp?.[e.shields[i]]<=0);
    e.hands.forEach((r,i)=>{if(r && !(s.hp?.[arms[i]]>0) && !e.dropped.includes(r)) e.dropped.push(r);});
    e.shields.forEach((m,i)=>{if(arms.includes(m) && !(s.hp?.[m]>0) && !e.shieldDropped.includes(i)) e.shieldDropped.push(i);});
    if(e.hands.some((r,i)=>r && (s.hp?.[arms[i]]<=0 || e.dropped.includes(r))))clearMatrix(u,s);
    return e;
  }
  function held(u,s,x) { if(!x)return false; const e=init(u,s); return e ? e.hands.some((r,i)=>item(u,r)?.key===x.key && s.hp[arms[i]]>0 && !e.dropped.includes(r)) : false; }
  function shieldReady(u,s,i=0) { const e=init(u,s); if(!e)return true; const m=e.shields[i];return !!m && !e.shieldDropped.includes(i) && (m==='body'||s.hp[m]>0) && s.sh?.[i]>0 && !(s.shDown?.[i]) && !(s.out?.[i]); }
  function reason(u,s,w) {
    if(!supported(u))return '';
    const e=init(u,s),x=item(u,w.equipKey); if(!x)return '';
    if(s.hp[u.kill||'chest']<=0)return 'Unit destroyed';
    if(x.mount==='shield')return shieldReady(u,s)?'':'Shield unavailable';
    if(x.mount==='attachment')return held(u,s,item(u,x.parent))?'':'Equip Beam Magnum';
    if(x.mount==='hand') {
      if(!held(u,s,x))return 'Equip first';
      if(x.twoHands && arms.some(k=>s.hp[k]<=0))return 'Requires both arms';
      if(x.key==='beam-sword' && /FULL/.test(w.name)) {
        const ai=u.abilities.findIndex(a=>/Full.Output/i.test(a.name));
        if(ai>=0 && !(s.track[ai]?.on||s.track[ai]===1))return 'Activate Full Output';
      }
      return '';
    }
    if(x.mount==='arms')return arms.some(k=>s.hp[k]>0)?'':'Both arms destroyed';
    if(x.mount==='legs')return s.hp.leftLeg>0||s.hp.rightLeg>0?'':'Both legs destroyed';
    if(x.mount==='throw')return arms.some(k=>s.hp[k]>0)?'':'Requires an intact arm';
    if(x.mount!=='body' && s.hp[x.mount]<=0)return 'Mount destroyed';
    return '';
  }
  function penalty(u,s,w) {
    if(!supported(u))return 0;
    const x=item(u,w.equipKey),e=init(u,s);
    if(!x || x.mount!=='hand' || x.kind!=='ranged' || x.twoHands || !held(u,s,x))return 0;
    const others=e.hands.filter((r,i)=>r && s.hp[arms[i]]>0 && !e.dropped.includes(r)).map(r=>item(u,r));
    return others.length===2 ? -3 : 0;
  }
  function stow(u,s,arm) {
    const e=init(u,s),i=arms.indexOf(arm);
    if(!e||i<0||s.hp[arm]<=0)return 'Choose an intact arm';
    if(e.segment)return 'Finish the melee segment first';
    const r=e.hands[i];if(!r||e.dropped.includes(r))return 'No usable weapon in that arm';
    e.hands=e.hands.map(v=>v===r?null:v);clearMatrix(u,s);return '';
  }
  function equip(u,s,key,hand,free=false) {
    const e=init(u,s),x=item(u,key); if(!e||!x||x.mount!=='hand')return 'Cannot equip this system';
    if(e.segment)return 'Finish the melee segment before switching';
    if(!arms.includes(hand)||s.hp[hand]<=0)return 'That arm is destroyed';
    const hi=arms.indexOf(hand);
    if(x.twoHands && arms.some(k=>s.hp[k]<=0))return 'Requires both arms';
    const occupied=e.hands.filter((r,i)=>i!==hi);
    const r=Array.from({length:x.count},(_,i)=>ref(x,i)).find(r=>!occupied.includes(r) && !e.dropped.includes(r)) || occupied.find(r=>item(u,r)?.key===x.key&&!e.dropped.includes(r));
    if(item(u,e.hands[hi])?.key===x.key && !e.dropped.includes(e.hands[hi]))return 'Already equipped';
    if(!r)return 'No available copy; recover it first';
    const cost=free?0:x.cost;
    if(s.ap<cost)return 'Not enough AP';
    e.hands=e.hands.map(r=>item(u,r)?.exclusive||item(u,r)?.twoHands?null:r);
    if(x.exclusive||x.twoHands)e.hands=[null,null];
    e.hands=e.hands.map(v=>v===r?null:v);
    e.hands[hi]=r;if(x.twoHands)e.hands[1-hi]=r;
    s.ap-=cost;
    clearMatrix(u,s); return '';
  }
  function clearMatrix(u,s) { u.abilities.forEach((a,i)=>{if(a.kind==='matrix'&&s.track[i])s.track[i].sel=null;}); }
  function recover(u,s,r,isShield=false) {
    const e=init(u,s); if(!e||e.segment)return 'Finish the melee segment first';
    if(s.ap<1)return 'Not enough AP';
    const list=isShield?e.shieldDropped:e.dropped;
    if(!list.includes(r))return 'Already recovered';
    if(!arms.some(k=>s.hp[k]>0))return 'Requires an intact arm';
    if(isShield) {
      if(!(s.sh[r]>0)||s.shDown?.[r]===-1)return 'Destroyed shields cannot be recovered';
      e.shields[r]=null;
      e.shields[r]=arms.find(k=>s.hp[k]>0&&!e.shields.includes(k))||null;
    } else {
      const x=item(u,r); if(!x)return 'Unknown weapon';
      e.hands=e.hands.map(v=>v===r?null:v);
      const i=arms.findIndex((k,i)=>s.hp[k]>0&&!e.hands[i]);
      if(i>=0 && !x.twoHands && (!x.exclusive || e.hands.every(v=>!v)) && !e.hands.some(v=>item(u,v)?.exclusive||item(u,v)?.twoHands))e.hands[i]=r;
    }
    list.splice(list.indexOf(r),1);s.ap--;return '';
  }
  function matrix(u,s,i,id,free=false) {
    const e=init(u,s),a=u.abilities[i],prev=s.track[i]||{p:0,spent:0};
    if(!e||a?.kind!=='matrix')return 'No matrix available';
    if(e.segment)return 'Finish the melee segment first';
    if(prev.sel===id)return 'Already selected';
    const o=a.options.find(o=>o.id===id);
    if(id!==null&&!o)return 'Unknown combination';
    if(o){
      if(arms.some(k=>s.hp[k]<=0))return 'Requires both arms';
      const xs=o.weapons.map(n=>catalog(u).find(x=>x.name===n));
      const refs=xs.length===1?[ref(xs[0],0),ref(xs[0],1)]:xs.map(x=>ref(x));
      if(refs.some(r=>e.dropped.includes(r)))return 'Recover the missing blade first';
      const cost=free?0:2;if(s.ap<cost)return 'Not enough AP';
      e.hands=refs;s.ap-=cost;
    }else e.hands=[null,null];
    s.track[i]={sel:id,p:o?Math.max(0,o.parries-(prev.spent||0)):0,spent:prev.spent||0};
    return '';
  }
  function combo(u,s) {
    const e=init(u,s);if(!e)return '';
    const selected=u.abilities.findIndex((a,i)=>a.kind==='matrix'&&s.track?.[i]?.sel);
    if(selected>=0){const o=u.abilities[selected].options.find(o=>o.id===s.track[selected].sel);return o?.desc||'';}
    const xs=e.hands.map((r,i)=>s.hp[arms[i]]>0&&!e.dropped.includes(r)?item(u,r):null).filter(Boolean);
    if(xs.length===2 && xs.every(x=>/Beam Saber|Cold Fusion Saber/.test(x.name)))return 'Dual sabers: Advantage (2d20, keep higher); normal weapon damage.';
    return '';
  }
  function melee(u,w) {
    const x=item(u,w.equipKey);
    return x && (x.kind==='melee'||x.kind==='hybrid') ? x : null;
  }
  function abilityReason(u,s,a) {
    if(!supported(u))return '';
    if(a.name==='Beam Magnum Absorption')return held(u,s,item(u,'beam-magnum'))?'':'Requires equipped Beam Magnum (cooldown does not matter)';
    if(a.name==='Spray and Pray') { const w=u.weapons.find(w=>a.text.includes('Uses the '+w.name));return w?reason(u,s,w):''; }
    if(/TBR/.test(a.name)){const w=u.weapons.find(w=>w.equipKey==='twin-buster');return w?reason(u,s,w):'';}
    if(a.name==='Adaptive Shield')return shieldReady(u,s)?'':'Shield unavailable';
    if(a.name==='Guillotine'){const w=u.weapons.find(w=>w.equipKey==='beam-sword');return w?reason(u,s,w):'';}
    if(/Full.Output/i.test(a.name)){const w=u.weapons.find(w=>w.equipKey==='beam-sword');return w?reason(u,s,w):'';}
    if(/Bazooka|Rifle.*Combo|Combined Attack/.test(a.name)&&/sinanju/.test(u.id))return arms.every(k=>s.hp[k]>0)?'':'Requires both arms';
    return '';
  }
  return {arms,supported,catalog,item,ref,init,held,reason,penalty,equip,stow,recover,melee,shieldReady,abilityReason,clearMatrix,combo,matrix};
})();
UNITS.forEach(u=>{if(/^(infinite-justice|rising-freedom|gundam-turn-a)/.test(u.id))u.reworkNeeded=true;MSE.catalog(u);});
TABLES['Melee Weapons']=[['Weapon','Roll Bonus','Normal / Crit','Equip AP','Charge Range'],['Bare Hands / Unarmed','+0','1 / 2','1','Adjacent only'],['Sword','+1','1 / 2','1','10cm'],['Beam Dagger','+1','2 / 4','0','10cm'],['Heat Axe / Heat Hawk','+2','2 / 4','1','15cm'],['Spear / Lance','+2','2 / 4','1','30cm (reach)'],['Beam Saber','+3','2 / 4','1','15cm'],['GN Sword','+4','3 / 6','2','30cm'],['Beam Axe / Beam Tomahawk','+4','3 / 6','2','20cm'],['Anti-Ship Sword','+4','4 / 8','2','30cm']];
TABLES.Destruction[1][1]='Arm weapons and shield unavailable; recover dropped equipment within 10cm for 1 AP.';
