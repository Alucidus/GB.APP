import assert from 'node:assert/strict';
import fs from 'node:fs';import vm from 'node:vm';
const c=vm.createContext({});vm.runInContext(fs.readFileSync(new URL('../public/data.js',import.meta.url),'utf8')+fs.readFileSync(new URL('../public/equipment.js',import.meta.url),'utf8')+';this.units=UNITS;this.rules=MSE;this.tables=TABLES;',c);
const M=c.rules,units=c.units;let checks=0;const ok=(x,msg)=>{assert.ok(x,msg);checks++;};
const unit=q=>units.find(u=>u.id.includes(q));
const state=u=>({hp:{...u.limb},ap:20,sh:(u.shields||[]).map(x=>x.hp),shDown:(u.shields||[]).map(()=>0),wpn:u.weapons.map(w=>w.limit?.kind==='charges'?w.limit.max:0),track:u.abilities.map(a=>a.kind==='matrix'?{sel:null,p:0}:a.kind==='mode'?{on:false}:null)});
const w=(u,q)=>u.weapons.find(w=>w.name.includes(q));
for(const u of units){const s=state(u);if(!M.supported(u)){ok(!M.init(u,s),'rework excluded');continue;}M.init(u,s);ok(M.catalog(u).every(x=>x.key&&x.count&&x.cost>=0),'complete metadata '+u.id);ok(u.weapons.filter(x=>x.name!=='—').every(x=>M.item(u,x.equipKey)),'all weapon rows classified '+u.id);const saved=JSON.parse(JSON.stringify(s));M.init(u,saved);ok(JSON.stringify(s)===JSON.stringify(saved),'stable persisted state '+u.id);}
{
 const u=unit('rx-78-2-gundam'),s=state(u);M.init(u,s);
 ok(!M.reason(u,s,w(u,'Beam Rifle')),'default rifle ready');ok(M.reason(u,s,w(u,'Bazooka')),'bazooka initially stored');
 ok(!M.equip(u,s,w(u,'Bazooka').equipKey,'leftArm'),'second ranged equipped');ok(s.ap===19,'1AP switch');
 ok(M.penalty(u,s,w(u,'Beam Rifle'))===-3&&M.penalty(u,s,w(u,'Bazooka'))===-3,'both ranged penalised');ok(M.penalty(u,s,w(u,'Vulcan'))===0,'integrated unaffected');ok(M.shieldReady(u,s),'shield does not use hand slot');
 const sh=s.sh[0];s.hp.leftArm=0;M.init(u,s);ok(M.reason(u,s,w(u,'Bazooka'))&& !M.shieldReady(u,s),'arm loss disables held weapon and shield');ok(!M.reason(u,s,w(u,'Vulcan')),'body system survives unrelated arm loss');
 ok(!M.recover(u,s,w(u,'Bazooka').equipKey+'#0'),'recover to occupied hand inventory');ok(s.ap===18&&!s.eq.hands.includes(w(u,'Bazooka').equipKey+'#0'),'pickup charges once and preserves rifle');
 ok(M.recover(u,s,w(u,'Bazooka').equipKey+'#0'),'repeat recovery rejected');ok(!M.equip(u,s,w(u,'Bazooka').equipKey,'rightArm'),'recovered weapon equippable');ok(s.ap===17,'later equip costs 1');
 ok(!M.recover(u,s,0,true),'shield recovery');ok(s.sh[0]===sh&&s.eq.shields[0]==='rightArm'&&M.shieldReady(u,s),'shield mounts separately retaining HP');
 s.eq.segment=true;ok(M.equip(u,s,w(u,'Beam Rifle').equipKey,'rightArm'),'segment switching blocked');
}
{
 const u=unit('sazabi-msn'),s=state(u);M.init(u,s);ok(!M.equip(u,s,w(u,'Tomahawk').equipKey,'rightArm'),'heavy equips');ok(s.ap===18,'heavy costs 2');s.ap=1;ok(M.equip(u,s,w(u,'Tomahawk').equipKey,'leftArm'),'heavy cannot bypass insufficient AP');
}
{
 const u=unit('strike-rouge'),s=state(u);M.init(u,s);ok(!M.equip(u,s,w(u,'Schneider').equipKey,'leftArm'),'dagger equips');ok(s.ap===20,'dagger free');s.hp.leftArm=0;M.init(u,s);ok(!M.recover(u,s,w(u,'Schneider').equipKey+'#0'),'dagger recovery');ok(s.ap===19,'dagger recovery still 1 AP');
}
{
 const u=unit('banshee-norn'),s=state(u);M.init(u,s);const mag=w(u,'Magnum');s.wpn[u.weapons.indexOf(mag)]=2;
 ok(!M.reason(u,s,w(u,'Rev.')),'launcher available during magnum cooldown');ok(!M.abilityReason(u,s,u.abilities.find(a=>a.name==='Beam Magnum Absorption')),'jutte available during cooldown');
 M.equip(u,s,w(u,'Saber').equipKey,'rightArm');ok(M.reason(u,s,w(u,'Rev.')),'launcher disabled when magnum stored');ok(M.abilityReason(u,s,u.abilities.find(a=>a.name==='Beam Magnum Absorption')),'jutte gated');ok(s.wpn[u.weapons.indexOf(mag)]===2,'switch preserves cooldown');
}
{
 const u=unit('f91-gundam'),s=state(u);M.init(u,s);ok(M.reason(u,s,w(u,'Low-Speed')),'VSBR requires equip');M.equip(u,s,'vsbr','rightArm');ok(!M.reason(u,s,w(u,'High-Speed')),'both modes one equipment');
}
{
 const u=unit('phenex'),s=state(u);M.init(u,s);s.out=[1,2];s.sh=[0,0];ok(!M.reason(u,s,w(u,'Armed Armor')),'Phenex DE behaviour unchanged');ok(!M.equip(u,s,w(u,'Saber').equipKey,'rightArm'),'Phenex saber equipment supported');
}
{
 const u=unit('gundam-epyon'),s=state(u);M.init(u,s);ok(!M.reason(u,s,w(u,'Heat Rod')),'heat rod no switch');s.sh[0]=0;ok(M.reason(u,s,w(u,'Heat Rod')),'destroyed shield disables rod');
}
{
 const u=unit('zaku-i-sniper'),s=state(u);M.init(u,s);ok(s.eq.hands[0]===s.eq.hands[1],'sniper uses two hands');s.hp.leftArm=0;ok(M.reason(u,s,w(u,'Sniper')),'sniper arm loss');
}
{
 const u=unit('wing-zero-xxx'),s=state(u);M.init(u,s);ok(M.penalty(u,s,w(u,'TBR'))===0,'purpose-built dual exemption');
}
{
 const u=unit('gundam-exia'),s=state(u);M.init(u,s);M.equip(u,s,w(u,'Short').equipKey,'leftArm');ok(!M.held(u,s,M.item(u,'gn-sword')),'drawing another weapon stows exclusive GN Sword');M.equip(u,s,'gn-sword','rightArm');ok(s.eq.hands[1]===null,'GN Sword cannot pair');
}
{
 const u=unit('rx-78-2-gundam'),s=state(u);M.init(u,s);s.hp.rightArm=0;M.init(u,s);s.eq.hands[0]=null;ok(!M.recover(u,s,w(u,'Rifle').equipKey+'#0'),'recover into surviving empty hand');ok(s.eq.hands[1]===w(u,'Rifle').equipKey+'#0','auto equips recovered weapon');
}
ok(c.tables['Melee Weapons'].some(r=>r[0]==='Spear / Lance'&&r[4]==='30cm (reach)'),'spear reference updated');
{const u=unit('gundam-exia'),s=state(u),i=u.abilities.findIndex(a=>a.kind==='matrix');M.init(u,s);M.equip(u,s,'gn-long-blade','rightArm');const before=s.ap;M.equip(u,s,'gn-sword','rightArm');ok(s.ap===before-2,'GN Sword retains heavy equip cost');ok(!M.matrix(u,s,i,'dagger'),'special dagger pair');ok(s.track[i].p===2,'two initial parries');s.track[i].p=1;s.track[i].spent=1;M.matrix(u,s,i,'blade');ok(s.track[i].p===0,'pair swap preserves expenditure');M.matrix(u,s,i,'dagger');ok(s.track[i].p===1,'no free parry refill');s.hp.leftArm=0;M.init(u,s);ok(M.matrix(u,s,i,'saber'),'matrix cannot bypass lost arm');}
for(const [id,name,bonus] of [['gundam-mk-ii','Heat Saber',2],['rick-dom','Heat Saber',2],['gouf-ms','Heat Sword',3],['nu-gundam','Nu Beam Saber',4],['gundam-vidar','Burst Saber',4],['astray-red','Gerbera Straight',3],['ac-nightfall','Pulse Blade',3],['jiyan-altron','Dual Fang Blades',3],['astray-red','BuCUE Head',3],['gouf-ms','Heat Rod',2],['master-gundam','Darkness Finger',3]]){const u=unit(id),weapon=w(u,name);ok(M.item(u,weapon.equipKey).bonus===bonus,'approved bonus '+name);}
{const u=unit('destiny-gundam'),x=M.item(u,'flash-edge-blade');ok(x.cost===0&&x.bonus===1&&x.damage==='2/4'&&x.range==='Melee 10cm','Flash-Edge dagger profile');}
ok(!unit('banshee-norn').weapons.some(w=>w.name==='AA-DE Melee Mode'),'obsolete Banshee row removed');
ok(w(unit('astray-red'),'BuCUE Head').dmg==='2/4','BuCUE complete damage profile');
console.log('PASS '+checks+' equipment assertions');
