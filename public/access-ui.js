/* Cached copies can run offline. Online requests always require a server session. */
(()=>{
 let checking=false;
 async function check(){
  if(checking||!navigator.onLine||location.protocol==='file:')return;checking=true;
  try{const r=await fetch('/api/access/status',{cache:'no-store'});if(r.status===401||r.status===503){const data=await r.json();if(data.code==='SITE_LOCKED'){document.documentElement.style.visibility='hidden';location.replace('/auth/login');}}}catch{}finally{checking=false;}
 }
 addEventListener('online',check);addEventListener('pageshow',check);document.addEventListener('visibilitychange',()=>{if(!document.hidden)check();});
 setInterval(()=>{if(!document.hidden)check();},60000);check();
})();
