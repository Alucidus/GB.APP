import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const c=vm.createContext({});vm.runInContext(fs.readFileSync(new URL('../public/data.js',import.meta.url),'utf8')+fs.readFileSync(new URL('../public/equipment.js',import.meta.url),'utf8')+';this.units=UNITS;this.M=MSE;',c);
let checks=0;
for(const id of ['gundam-mk-ii-rx-178','rx-97-nh-gundam-night-hawk','mbf-02-strike-rouge']){
 const u=c.units.find(u=>u.id===id),w=u.weapons.find(w=>/Saber/.test(w.name)),x=c.M.item(u,w.equipKey),s={hp:{...u.limb},ap:4,sh:u.shields.map(x=>x.hp),track:u.abilities.map(()=>0)};
 assert.equal(x.count,2);assert.equal(x.bonus,3);assert.equal(x.cost,1);assert.equal(w.dmg,'2/4');assert.match(w.label,/×2$/);checks+=5;
 c.M.init(u,s);assert.equal(c.M.equip(u,s,x.key,'rightArm'),'');assert.equal(c.M.equip(u,s,x.key,'leftArm'),'');assert.equal(new Set(s.eq.hands).size,2);assert.equal(s.ap,2);assert.match(c.M.combo(u,s),/Advantage/);checks+=5;
 if(id==='gundam-mk-ii-rx-178'){assert.equal(x.key,'heat-saber');const before=JSON.stringify(s);c.M.init(u,s);assert.equal(JSON.stringify(s),before);checks+=2;}
}
console.log('PASS '+checks+' cf119 decision assertions');
