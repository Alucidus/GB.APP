const C="gbcf-cf39";
const FILES=["./","index.html","manifest.json",
 "img/mech-gundam.webp","img/ship-musai.webp","img/portraits/ship-musai.webp","img/portraits/ship-salamis.webp","img/portraits/ship-rewloola.webp","img/portraits/ship-racailum.webp","img/ship-salamis.webp","img/ship-rewloola.webp","img/ship-racailum.webp","img/mech-sazabi.webp","img/mech-zaku.webp","img/mech-gm.webp",
 "img/menu-bg.webp","img/lobby-bg.webp","img/ground/fed-armor.webp","img/ground/fed-car.webp","img/ground/fed-heli.webp","img/ground/fed-jet.webp","img/ground/fed-mg.webp","img/ground/fed-recon.webp","img/ground/fed-rifleman.webp","img/ground/fed-shield.webp","img/ground/fed-sniper.webp","img/ground/fed-tank.webp","img/ground/fed-transport.webp","img/ground/spa-armor.webp","img/ground/spa-car.webp","img/ground/spa-heli.webp","img/ground/spa-jet.webp","img/ground/spa-mg.webp","img/ground/spa-recon.webp","img/ground/spa-rifleman.webp","img/ground/spa-shield.webp","img/ground/spa-sniper.webp","img/ground/spa-tank.webp","img/ground/spa-transport.webp","img/ground/wire-fed-car.webp","img/ground/wire-fed-heli.webp","img/ground/wire-fed-jet.webp","img/ground/wire-fed-tank.webp","img/ground/wire-fed-transport.webp","img/ground/wire-spa-car.webp","img/ground/wire-spa-heli.webp","img/ground/wire-spa-jet.webp","img/ground/wire-spa-tank.webp","img/ground/wire-spa-transport.webp","img/menu-fed.webp","img/menu-spa.webp","img/bg-fed.webp","img/bg-spa.webp",
 "img/portraits/ac-nightfall.webp","img/portraits/astray-red-frame.webp","img/portraits/banshee-norn.webp","img/portraits/blue-destiny.webp","img/portraits/delta-zayin.webp","img/portraits/destiny.webp","img/portraits/epyon.webp","img/portraits/exia.webp","img/portraits/f91.webp","img/portraits/geara-zulu.webp","img/portraits/gm-sniper-ii.webp","img/portraits/gm.webp","img/portraits/gouf.webp","img/portraits/gp01fb.webp","img/portraits/gp02a.webp","img/portraits/gundam-ex.webp","img/portraits/gundam-mk-ii.webp","img/portraits/gundam-pixy.webp","img/portraits/hyaku-shiki.webp","img/portraits/infinite-justice.webp","img/portraits/jesta.webp","img/portraits/jiyan-altron.webp","img/portraits/kshatriya.webp","img/portraits/legend.webp","img/portraits/luminous-crystal-body.webp","img/portraits/master-gundam.webp","img/portraits/narrative.webp","img/portraits/night-hawk.webp","img/portraits/nightingale.webp","img/portraits/nu-gundam.webp","img/portraits/pale-rider.webp","img/portraits/phenex.webp","img/portraits/rick-dom.webp","img/portraits/rising-freedom.webp","img/portraits/rozen-zulu.webp","img/portraits/rx-78-2.webp","img/portraits/sazabi.webp","img/portraits/sinanju-stein.webp","img/portraits/sinanju-zero.webp","img/portraits/sinanju.webp","img/portraits/slave-wraith.webp","img/portraits/strike-freedom.webp","img/portraits/strike-rouge.webp","img/portraits/turn-a.webp","img/portraits/vidar.webp","img/portraits/wing-zero-custom.webp","img/portraits/wing-zero.webp","img/portraits/xi.webp","img/portraits/zaku-i-sniper.webp","img/portraits/zaku-ii.webp",
 "icons/icon-192.png","icons/icon-512.png","icons/apple-touch-icon.png",
 "icons/icon-maskable-512.png","icons/logo.webp"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim();});
self.addEventListener("fetch",e=>{
  const req=e.request, url=new URL(req.url);
  // multiplayer sync must always go to the network and never be cached
  if(req.method!=="GET"||url.pathname.startsWith("/api/")||url.pathname.startsWith("/.netlify/"))return;
  const isPage=req.mode==="navigate"||url.pathname.endsWith("/")||url.pathname.endsWith("index.html");
  if(isPage){
    // try the network first so a new version appears straight away; fall back to the saved copy offline
    e.respondWith(fetch(req).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(req,cp));return r;})
      .catch(()=>caches.match(req).then(r=>r||caches.match("index.html"))));
    return;
  }
  e.respondWith(caches.match(req).then(r=>r||fetch(req)));
});
