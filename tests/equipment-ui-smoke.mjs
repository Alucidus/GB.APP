// DOM smoke test: executes production scripts and callbacks; not visual/browser validation.
import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
class Node {
 constructor(){this.children=[];this.dataset={};this.style={setProperty(){},removeProperty(){}};this.className='';this._text='';this.clientWidth=1000;this.clientHeight=1000;this.offsetWidth=30;this.scrollWidth=20;this.scrollHeight=10;this.classList={add:(...xs)=>{this.className=[...new Set([...this.className.split(' ').filter(Boolean),...xs])].join(' ')},remove:(...xs)=>{this.className=this.className.split(' ').filter(x=>!xs.includes(x)).join(' ')},contains:x=>this.className.split(' ').includes(x),toggle:(x,on)=>{const add=on===undefined?!this.classList.contains(x):on;add?this.classList.add(x):this.classList.remove(x);return add;}};}
 appendChild(n){this.children.push(n);n.parentNode=this;return n}append(...ns){ns.forEach(n=>this.appendChild(n))}replaceChildren(...ns){this.children=[];this.append(...ns)}
 set innerHTML(v){this._html=v;this.children=[]}get innerHTML(){return this._html||''}set textContent(v){this._text=v}get textContent(){return this._text}
 get firstElementChild(){return this.children[0]||new Node()}get lastElementChild(){return this.children.at(-1)||new Node()}get firstChild(){return this.children[0]||null}getBoundingClientRect(){return {width:1000,height:1000,left:0,top:0,right:1000,bottom:1000}}
 querySelector(q){return this.querySelectorAll(q)[0]||null}querySelectorAll(q){const matches=n=>q.split(',').some(sel=>sel.startsWith('.')?n.classList.contains(sel.slice(1)):sel.startsWith('[data-act=')?String(n.dataset.act)===sel.match(/"(.*?)"/)[1]:false);return this.children.flatMap(n=>[...(matches(n)?[n]:[]),...n.querySelectorAll(q)]);}addEventListener(){}removeEventListener(){}setAttribute(){}removeAttribute(){}remove(){if(this.parentNode)this.parentNode.children=this.parentNode.children.filter(x=>x!==this)}focus(){}scrollIntoView(){}contains(){return false}closest(){return null}getContext(){return {}}click(){this.onclick?.({stopPropagation(){},preventDefault(){}})}
}
const nodes=new Map(),get=id=>{if(!nodes.has(id))nodes.set(id,new Node());return nodes.get(id)};
const doc={getElementById:get,createElement:()=>new Node(),createElementNS:()=>new Node(),querySelector:()=>new Node(),querySelectorAll:()=>[],body:new Node(),documentElement:new Node(),addEventListener(){},createRange:()=>({selectNodeContents(){},getBoundingClientRect:()=>({width:10})})};
const ctx=vm.createContext({console,document:doc,localStorage:{getItem:()=>null,setItem(){},removeItem(){}},navigator:{},location:{protocol:'http:',hostname:'localhost',href:'http://localhost'},history:{replaceState(){}},setTimeout:()=>0,clearTimeout(){},setInterval:()=>0,clearInterval(){},requestAnimationFrame:()=>0,cancelAnimationFrame(){},matchMedia:()=>({matches:false,addEventListener(){}}),getComputedStyle:()=>({getPropertyValue:()=>'',display:'block',backgroundColor:'rgba(0,0,0,0)'}),addEventListener(){},scrollTo(){},innerWidth:1200,innerHeight:900,devicePixelRatio:1,Image:Node,ResizeObserver:class{observe(){}},URL,URLSearchParams,performance:{now:()=>0},fetch:()=>Promise.resolve({json:()=>({})}),alert(){},confirm:()=>true});ctx.window=ctx;ctx.self=ctx;
for(const name of ['supplies','resupply-ui','data','equipment','equipment-ui','repairs','repair-ui','landscape','pickups','pickup-ui','app'])vm.runInContext(fs.readFileSync(new URL('../public/'+name+'.js',import.meta.url),'utf8'),ctx,{filename:name+'.js'});
vm.runInContext(`mpKick=()=>{};mpDirty=()=>{};renderTurn=()=>{};trackChanges=()=>{};applyHud=()=>{};renderAmounts=()=>{};side='federation';locked=true;turn=freshTurn();turn.phase='you';`,ctx);
let checks=0;
for(let i=0;i<50;i++){
 vm.runInContext(`U=UNITS[${i}];CUR={uid:1,id:U.id,st:freshState(U)};roster=[CUR];hp=CUR.st.hp;sh=CUR.st.sh;shDown=CUR.st.shDown;shMax=CUR.st.shMax;track=CUR.st.track;wpn=CUR.st.wpn;ap=CUR.st.ap;dodges=CUR.st.dodges;out=CUR.st.out;lent=[];pods=CUR.st.pods;risk={};active=null;draw();if(MSE.supported(U))openEquipment();`,ctx);checks++;
}
vm.runInContext(`U=UNITS.find(u=>u.id==='rx-78-2-gundam');CUR={uid:1,id:U.id,st:freshState(U)};roster=[CUR];hp=CUR.st.hp;sh=CUR.st.sh;shDown=CUR.st.shDown;shMax=CUR.st.shMax;track=CUR.st.track;wpn=CUR.st.wpn;ap=4;draw();eqChoose('hyper-bazooka');`,ctx);
assert.equal(vm.runInContext('eqPending.key',ctx),'hyper-bazooka');
const before=vm.runInContext('hp.leftArm',ctx);vm.runInContext("eqPickArm('leftArm')",ctx);
assert.equal(vm.runInContext('hp.leftArm',ctx),before);assert.equal(vm.runInContext('ap',ctx),3);assert.equal(vm.runInContext('CUR.st.eq.hands[1]',ctx),'hyper-bazooka#0');checks+=4;
// Exercise the live Fire callback, equipment undo and the read-only guard.
vm.runInContext('eqPending=null;closePicker();draw()',ctx);
const fire=get('sheet').children.find(n=>n.title==='Tap to fire — spends 2 AP');
assert.ok(fire,'live Fire control exists');fire.click();assert.equal(vm.runInContext('ap',ctx),1);checks+=2;
vm.runInContext('eqUndo()',ctx);assert.equal(vm.runInContext('ap',ctx),1,'cannot undo equipment across a later shot');checks++;
vm.runInContext('ap=4;draw()',ctx);
vm.runInContext('eqDockClick()',ctx);
const melee=get('sheet').children.find(n=>n.classList.contains('eq-weapon')&&n.title?.startsWith('Select Beam Saber ×2 ·'));
assert.ok(melee);melee.click();
assert.equal(vm.runInContext('eqPending.key',ctx),'beam-saber');
assert.equal(get('pick').classList.contains('on'),false,'direct equip does not open picker');
assert.equal(get('equipBtn').textContent,'DONE');
vm.runInContext("eqPickArm('rightArm')",ctx);
get('pickExtra').children[0].click();
assert.equal(get('pick').classList.contains('on'),false,'assignment does not reopen picker');
assert.equal(vm.runInContext('ap',ctx),3);assert.equal(get('equipBtn').textContent,'DONE');
assert.ok(get('sheet').children.some(n=>String(n.textContent).startsWith('[R] Beam Saber')),'right badge rendered');
assert.equal(get('sheet').children.filter(n=>n.classList.contains('eq-limb-label')).length,2,'hand labels restored beside HP');
vm.runInContext("eqChoose('beam-rifle');eqDockClick()",ctx);assert.equal(vm.runInContext('eqPending',ctx),null,'cancel exits assignment');
vm.runInContext('openEquipment()',ctx);assert.equal(get('pick').classList.contains('on'),true,'dock opens full manager');
vm.runInContext('closePicker()',ctx);checks+=11;
vm.runInContext('mpSheetCanEdit=()=>false;eqChoose("beam-saber")',ctx);assert.equal(vm.runInContext('eqPending',ctx),null,'read-only blocks assigning');checks++;
vm.runInContext(`mpSheetCanEdit=()=>true;U=UNITS.find(u=>u.id.includes('banshee-norn'));CUR={uid:1,id:U.id,st:freshState(U)};roster=[CUR];CUR.st.wsig='Beam Magnum:cooldown|Beam Saber|AA-DE Mega Cannon|AA-DE Melee Mode|Rev. Launcher (BOP/Bomb)';CUR.st.wpn=[2,0,0,0,0];openSheet(1);`,ctx);
assert.equal(vm.runInContext('wpn[0]',ctx),2,'row removal preserves Magnum cooldown');assert.equal(vm.runInContext('wpn.length',ctx),5);checks+=2;
vm.runInContext(`U=UNITS.find(u=>u.id==='rx-78-2-gundam');CUR={uid:1,id:U.id,st:freshState(U)};roster=[CUR];openSheet(1);`,ctx);
const displayed=()=>get('sheet').children.map(n=>String(n.textContent));
const quantity=()=>vm.runInContext("eqInventoryLabel(MSE.item(U,'beam-saber'),eqLive())",ctx);
assert.equal(quantity(),'Beam Saber ×2');
vm.runInContext("MSE.equip(U,eqLive(),'beam-saber','leftArm',true);draw()",ctx);
assert.equal(quantity(),'Beam Saber ×1');
assert.ok(displayed().some(t=>t.includes('RANGED ROLL −3')),'rifle plus saber penalty in status box');
assert.ok(!displayed().some(t=>t.includes('MELEE ADVANTAGE')),'mixed pair does not grant melee Advantage');
vm.runInContext("MSE.equip(U,eqLive(),'beam-saber','rightArm',true);$('sheet').children=[];draw()",ctx);
assert.equal(quantity(),'Beam Saber ×0');
assert.ok(displayed().some(t=>t.includes('MELEE ADVANTAGE · 2d20, KEEP HIGHER')),'dual saber Advantage in status box');
assert.ok(!displayed().some(t=>t.includes('RANGED ROLL −3')),'dual melee has no ranged penalty indicator');
vm.runInContext("MSE.stow(U,eqLive(),'leftArm');$('sheet').children=[];draw()",ctx);
assert.equal(quantity(),'Beam Saber ×1');
assert.ok(!displayed().some(t=>t.includes('MELEE ADVANTAGE')),'stowing clears Advantage');
vm.runInContext("MSE.stow(U,eqLive(),'rightArm');draw()",ctx);
assert.equal(quantity(),'Beam Saber ×2');checks+=10;
console.log('PASS '+checks+' UI smoke checks (stub DOM, no visual verification)');
