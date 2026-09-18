// DOM smoke test: executes production scripts and callbacks; not visual/browser validation.
import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
class Node {
 constructor(){this.children=[];this.dataset={};this.style={setProperty(){},removeProperty(){}};this.className='';this._text='';this.clientWidth=1000;this.clientHeight=1000;this.offsetWidth=30;this.scrollWidth=20;this.scrollHeight=10;this.classList={add:()=>{},remove:()=>{},contains:()=>false,toggle:()=>false};}
 appendChild(n){this.children.push(n);n.parentNode=this;return n}append(...ns){ns.forEach(n=>this.appendChild(n))}replaceChildren(...ns){this.children=[];this.append(...ns)}
 set innerHTML(v){this._html=v;this.children=[]}get innerHTML(){return this._html||''}set textContent(v){this._text=v}get textContent(){return this._text}
 get firstElementChild(){return this.children[0]||new Node()}get lastElementChild(){return this.children.at(-1)||new Node()}get firstChild(){return this.children[0]||null}getBoundingClientRect(){return {width:1000,height:1000,left:0,top:0,right:1000,bottom:1000}}
 querySelector(){return null}querySelectorAll(){return []}addEventListener(){}removeEventListener(){}setAttribute(){}removeAttribute(){}remove(){}focus(){}scrollIntoView(){}contains(){return false}closest(){return null}getContext(){return {}}click(){this.onclick?.({stopPropagation(){},preventDefault(){}})}
}
const nodes=new Map(),get=id=>{if(!nodes.has(id))nodes.set(id,new Node());return nodes.get(id)};
const doc={getElementById:get,createElement:()=>new Node(),createElementNS:()=>new Node(),querySelector:()=>new Node(),querySelectorAll:()=>[],body:new Node(),documentElement:new Node(),addEventListener(){},createRange:()=>({selectNodeContents(){},getBoundingClientRect:()=>({width:10})})};
const ctx=vm.createContext({console,document:doc,localStorage:{getItem:()=>null,setItem(){},removeItem(){}},navigator:{},location:{protocol:'http:',hostname:'localhost',href:'http://localhost'},history:{replaceState(){}},setTimeout:()=>0,clearTimeout(){},setInterval:()=>0,clearInterval(){},requestAnimationFrame:()=>0,cancelAnimationFrame(){},matchMedia:()=>({matches:false,addEventListener(){}}),getComputedStyle:()=>({getPropertyValue:()=>'',display:'block'}),addEventListener(){},scrollTo(){},innerWidth:1200,innerHeight:900,devicePixelRatio:1,Image:Node,ResizeObserver:class{observe(){}},URL,URLSearchParams,performance:{now:()=>0},fetch:()=>Promise.resolve({json:()=>({})}),alert(){},confirm:()=>true});ctx.window=ctx;ctx.self=ctx;
for(const name of ['data','equipment','equipment-ui','app'])vm.runInContext(fs.readFileSync(new URL('../public/'+name+'.js',import.meta.url),'utf8'),ctx,{filename:name+'.js'});
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
vm.runInContext('closePicker();draw()',ctx);
const fire=get('sheet').children.find(n=>n.title==='Tap to fire — spends 2 AP');
assert.ok(fire,'live Fire control exists');fire.click();assert.equal(vm.runInContext('ap',ctx),1);checks+=2;
vm.runInContext('eqUndo()',ctx);assert.equal(vm.runInContext('ap',ctx),1,'cannot undo equipment across a later shot');checks++;
vm.runInContext('mpSheetCanEdit=()=>false;eqChoose("beam-saber")',ctx);assert.equal(vm.runInContext('eqPending',ctx),null,'read-only blocks assigning');checks++;
console.log('PASS '+checks+' UI smoke checks (stub DOM, no visual verification)');
