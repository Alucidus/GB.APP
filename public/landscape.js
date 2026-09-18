// Keep the diagram canvas fixed; widen table columns into the landscape margins.
const spreadOriginal=new WeakMap();
function spreadRestore(n){const old=spreadOriginal.get(n);if(old)for(const [k,v] of Object.entries(old))n.style[k]=v;}
function spreadRemember(n,props){const old=spreadOriginal.get(n)||{};for(const key of props)if(!(key in old))old[key]=n.style[key];spreadOriginal.set(n,old);}
function spreadGrow(n,factor){
 const css=getComputedStyle(n);
 if(!spreadOriginal.has(n))spreadOriginal.set(n,{width:n.style.width,maxWidth:n.style.maxWidth,fontSize:n.style.fontSize});
 if(n.style.width||n.matches('.gtargets,.eq-prompt'))n.style.width=parseFloat(css.width)*factor+'px';
 if(css.maxWidth!=='none'&&Number.isFinite(parseFloat(css.maxWidth))){const max=parseFloat(css.maxWidth)*(css.maxWidth.endsWith('%')?n.parentElement.clientWidth/100:1);n.style.maxWidth=max*factor+'px';}
 if(n.matches('.txt,.flbl,.fsec,.sw-cell,.sw-ap,.sw-cd,.sw-name,.gtargets,.eq-prompt'))n.style.fontSize=parseFloat(css.fontSize)*Math.min(1.3,1+(factor-1)*.65)+'px';
 if(n.matches('.sw-name'))for(const child of n.children){
  const font=parseFloat(getComputedStyle(child).fontSize);
  if(!spreadOriginal.has(child))spreadOriginal.set(child,{fontSize:child.style.fontSize});
  child.style.fontSize=font*Math.min(1.3,1+(factor-1)*.65)+'px';
 }
}
function spreadSheet(){
  const sheet=$('sheet');if(!sheet||!U)return;
  const width=sheet.clientWidth,full=$('s4').clientWidth||innerWidth;
  const gap=innerWidth>innerHeight?Math.max(0,(full-width)/2-12):0;
  sheet.classList.toggle('landscape-spread',gap>12);sheet.style.setProperty('--spread',gap+'px');
  const frame=$('frame'),nodes=[...sheet.children,...frame.children];
  for(const n of nodes){spreadRestore(n);for(const child of n.children)spreadRestore(child);n.style.removeProperty('--list-offset');}
  const extra=Math.max(0,Math.min(gap*.85,width*.27,gap-width*.035));
  const widen=(n,x,right=false)=>{const start=right?94.8:3.4,span=right?37.8:38.35;
    const factor=1+extra/(width*span/100);
    n.style.setProperty('--list-offset',((x-start)/span*extra)+'px');spreadGrow(n,factor);
    if(n.matches('.aptap,.sw-ap')){
      const row=sheet.clientHeight*(U.type ? .051 : (parseFloat(n.style.top)<50 ? .062 : .066));
      n.style.setProperty('--ap-cell-width',Math.max(24,width*(U.type ? .049 : x<28 ? .053 : .047)*factor-4)+'px');
      n.style.setProperty('--ap-cell-height',Math.max(9,Math.min(26,row-2))+'px');
      n.classList.add('spread-ap');
    }
  };
  nodes.forEach(n=>{
    n.classList.remove('spread-left','spread-right','spread-wide','spread-ap');
    if(gap<=12||['frame','hudfx','dead'].includes(n.id))return;
    if(n.classList.contains('sqwrap')){n.classList.add('spread-wide');return;}
    if(n.matches('.apflash,.apfloat,.fmech,.fret,.fshiplbl,.fhp,.flimb,.bhit,.bhitu,.swarn,.hp,.eq-limb-label,.eq-arm-prompt,.qa,.sqa,.sgrp,.smove,.gnote,.fstatc,.fbreath'))return;
    if(n.matches('.fgrid')){n.classList.add('spread-wide');return;}
    if(U.type&&n.id==='helpBtn'){
      if(!spreadOriginal.has(n))spreadOriginal.set(n,{left:n.style.left,right:n.style.right});
      n.style.left='calc(3.8% + 20.4cqw)';n.style.right='auto';n.classList.add('spread-left');return;
    }
    if(n.matches('.fdock.r')){n.classList.add('spread-right');return;}
    if(n.matches('.fdock.l,.fdock.c')){n.classList.add('spread-left');if(U.type&&n.matches('.fdock.l')){spreadRemember(n,['width']);n.style.width='28%';}return;}
    if(n.matches('.arcring')){n.classList.add('spread-right');return;}
    if(['baseBtn','tablesBtn','stanceBtn','equipBtn','stowBtn','rulesBtn'].includes(n.id)){n.classList.add('spread-left');return;}
    if(['helpBtn','doneBtn','rosterBtn'].includes(n.id)||n.matches('.fname,.fport,.fsub,.unitname,.dpline,.sname,.sclass')){n.classList.add('spread-right');return;}
    const css=getComputedStyle(n),x=parseFloat(css.left)/width*100;
    if(!Number.isFinite(x))return;
    // Ship/vehicle ability tables occupy the lower right; hull hit locations stay fixed.
    const vehicle=!!U.type;
    if(vehicle&&x>=55){n.classList.add('spread-right');if(n.matches('.ftbl,.fsec,.flbl,.sw-name,.sw-cell,.sw-ap,.sw-cd,.gtargets'))widen(n,x,true);return;}
    if(x<44){n.classList.add('spread-left');if(n.matches('.ftbl,.fsec,.flbl,.txt,.grp,.tog,.wpip,.wrow,.aphit,.eq-row,.eq-weapon,.eq-prompt,.sx'))widen(n,x);}
    else if(x>=75)n.classList.add('spread-right');
  });
  if(gap>12&&!U.type)spreadSuitRows(sheet,nodes);
  if(gap>12&&U.type){
    const cells=nodes.filter(n=>n.classList.contains('spread-ap'));
    for(const n of cells){const r=n.getBoundingClientRect();let step=Infinity;for(const other of cells){if(other===n)continue;const q=other.getBoundingClientRect();if(Math.abs(q.left-r.left)<3&&Math.abs(q.top-r.top)>1)step=Math.min(step,Math.abs(q.top-r.top));}
      if(Number.isFinite(step))n.style.setProperty('--ap-cell-height',Math.min(parseFloat(n.style.getPropertyValue('--ap-cell-height')),step-2)+'px');
    }
  }
}

// Use rows that actually contain equipment, rather than leaving five blank slots.
// Spend the recovered vertical space on separate, taller action targets.
function spreadSuitRows(sheet,nodes){
 const h=sheet.clientHeight,a=Math.max(1,Math.min(5,U.abilities.length)),w=Math.max(1,Math.min(5,U.weapons.filter(x=>!x.pickupId).length));
 const top=h*.126,header=16,gap=22,footer=32,row=Math.min(36,(h-top-2*header-gap-footer)/(a+w));
 if(row<h*.066)return; // Dense sheets keep their existing row spacing.
 const weaponTop=top+header+a*row+gap;
 for(const n of nodes){
  if(!n.classList.contains('spread-left')||!n.matches('.ftbl,.fsec,.flbl,.txt,.grp,.tog,.wpip,.wrow,.aphit,.eq-row,.eq-weapon'))continue;
  const y=parseFloat(n.style.top);if(!Number.isFinite(y))continue;
  spreadRemember(n,['top','height','display']);
  const weapon=y>=50,count=weapon?w:a,tableTop=weapon?weaponTop:top,oldHead=weapon?58.2:16.6,pitch=weapon?6.6:6.2;
  if(n.matches('.ftbl')){
   n.style.top=tableTop+'px';n.style.height=(header+count*row)+'px';
   let line=0;for(const child of n.children){spreadRemember(child,['height','top','display']);if(child.matches('.fhead'))child.style.height=header+'px';if(child.matches('.frow')){line++;child.style.top=(header+line*row)+'px';child.style.display=line>=count?'none':'';}}
  }else if(n.matches('.fsec')){if(weapon)n.style.top=(weaponTop-11)+'px';}
  else if(n.matches('.fth'))n.style.top=(tableTop+header/2)+'px';
  else if(y>=oldHead-3&&y<=94){
   if(n.matches('.fnum')&&Math.floor((y-oldHead)/pitch)>=count){n.style.display='none';continue;}
   n.style.top=(tableTop+header+(y-oldHead)/pitch*row)+'px';
   if(n.style.height&&n.style.height.endsWith('%'))n.style.height=(parseFloat(n.style.height)/pitch*row)+'px';
   if(n.classList.contains('spread-ap'))n.style.setProperty('--ap-cell-height',Math.min(36,row-3)+'px');
  }
 }
}
