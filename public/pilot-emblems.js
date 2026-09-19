/* Small, original line emblems: inherit the pilot faction's colour. */
window.PilotEmblems=(()=>{
 const paths={
  'marksman-s-instinct':'M32 8v10m0 28v10M8 32h10m28 0h10 M32 18a14 14 0 1 0 0 28 14 14 0 1 0 0-28 M27 32h10m-5-5v10',
  'melee-reflex':'M17 12l33 33-5 5-33-33z M37 12l-8 8m-9 9-8 8m24-1 9-9 7-15-15 7 M12 47l5 5m-8 3 8-8m30 0 8 8',
  'weapon-mastery':'M14 43l8-8 7 7-8 8z M23 34l24-24 7 1 1 7-24 24 M36 12l3 8m5 5 8 3 M9 24l6 3 3-7 3 7 6-3',
  'backup-sensors':'M13 20l19-9 19 9v22l-19 11-19-11z M19 24h26v12H19z M25 25v10m14-10v10 M25 44h14 M7 29v10m50-10v10',
  'i-field-sync':'M32 8l20 8v17c0 12-13 20-20 24-7-4-20-12-20-24V16z M32 19l11 5v9c0 6-6 11-11 14 M5 25l19 7-19 7m44-7 10-10m-10 10 10 10',
  'advanced-repair':'M21 17h22v11h11v15H43v11H21V43H10V28h11z M33 7a25 25 0 0 1 24 18 M50 22l7 3 2-8',
  'speed-boost':'M11 15l18 17-18 17m19-34 18 17-18 17 M4 24h9M4 40h9m38-27 9 19-9 19',
  'evasive-maneuvers':'M9 49c0-28 40-5 40-33 M40 20l10-8 5 11 M24 18l8-9 8 9-8 10z M21 33l8 9m-16-6 9 9m21 0 7 8',
  'charge-specialist':'M6 24h17M6 33h13M6 42h17 M21 50l23-23-8-8 22-12-12 22-8-8-23 23 M35 45l10 10',
  'dazzler':'M29 21l3-14 3 14 13-6-8 12 17 5-17 5 8 12-13-6-3 14-3-14-13 6 8-12-17-5 17-5-8-12z',
  'entangler':'M14 14l36 36M14 32l18 18M32 14l18 18M14 50l36-36M14 32l18-18M32 50l18-18 M10 10h44v44H10z',
  'quick-hands':'M21 49V28a4 4 0 0 1 8 0v9-22a4 4 0 0 1 8 0v21-16a4 4 0 0 1 8 0v21-11a4 4 0 0 1 8 0v16l-9 10H29L13 40l8-2 M6 16h12M6 23h9',
  'shock-resistant-construction':'M32 8l21 9v18L32 56 11 35V17z M36 16L23 34h10l-5 14 15-21H32z',
  'polarized-sensors':'M7 25l9-9h32l9 9-5 20H12z M17 24h12v12H17z M35 24h12v12H35z M29 28h6 M10 8l8 5m36-5-8 5 M23 28l-3 5m23-5-3 5',
  'refusal-instinct':'M22 45V23a4 4 0 0 1 8 0v10-20a4 4 0 0 1 8 0v20-14a4 4 0 0 1 8 0v17-10a4 4 0 0 1 8 0v17L43 55H30L14 39l8-3 M8 13l9 7M6 27h10',
  'extended-detection-sense':'M32 8a24 24 0 1 0 24 24 M32 18a14 14 0 1 0 14 14 M32 8v24l17-17 M27 32h10m-5-5v10 M48 9h7v7',
  'air-support-recon':'M32 8l6 18 18 10v7l-18-4-2 11 8 5H20l8-5-2-11-18 4v-7l18-10z M9 13l6 4m40-4-6 4',
  'thermal-sensor':'M8 34s9-15 24-15 24 15 24 15-9 15-24 15S8 34 8 34z M27 26c-6 10 2 8 1 15 9-1 13-8 4-16 M18 8l-3 5m17-7v7m14-5 3 5',
  'optical-camouflage':'M8 32s9-15 24-15 24 15 24 15-9 15-24 15S8 32 8 32z M26 27a8 8 0 0 0 11 11 M10 54L54 10 M6 13v-7h7m38 52h7v-7',
  'ambush-protocol':'M13 35l5-18 14-9 14 9 5 18-11-5-8 13-8-13z M24 23l5 4m11-4-5 4 M8 54l17-11m31 11L39 43 M25 52h14',
  'decoy-deployment':'M12 18l10-6 10 6v18l-10 6-10-6z M32 18l10-6 10 6v18l-10 6-10-6 M22 42v10m20-10v10 M16 54h12m8 0h12 M18 24h8m12 0h8'
 };
 function make(id,tier=0){const n=document.createElement('span');n.className='pilot-trait-emblem';n.setAttribute('aria-hidden','true');n.innerHTML='<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="'+paths[id]+'"/></svg>';n.dataset.emblem=id;const bars=document.createElement('span');bars.className='pilot-emblem-tiers';for(let i=1;i<=4;i++){const bar=document.createElement('i');bar.className=i<=tier?'filled':'';bars.append(bar);}n.append(bars);return n;}
 return {make};
})();
