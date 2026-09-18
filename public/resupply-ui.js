function qrReconcileRoster(start=false) {
  if(mpTeamMode())return;
  roster.forEach(r=>{
    if(!r.st.sq)return;
    const q=r.st.sq.qr||(r.st.sq.qr={}),cs=carrierState(r.uid);
    const valid=cs?.state==='aboard'&&['car','heli','transport'].includes(cs.u.gtype)&&!isDead(cs.ship)&&!isDead(r);
    GBSupplies.reconcile(q,valid?cs.ship.uid:null,valid?cs.ship.st.gv.boardings?.[r.uid]||'legacy':null);
    if(start&&GBSupplies.start(q,turn.round))logEv(r.uid,'Resupplied: 2 Flashbangs · 2 Smoke Grenades · 2 Grenades','buff');
  });
}
function qrBoardingChanged(vehicle,uid) {
  const g=vehicle.st.gv;g.boardings=g.boardings||{};
  // A new token makes out-and-back within one sync a fresh boarding.
  g.boardings[uid]=Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,9);
}
function qrStampTransportChanges() {
  roster.forEach(r=>{
    if(!r.st.gv||!['car','heli','transport'].includes(unitById(r.id)?.gtype))return;
    const g=r.st.gv,alive=!isDead(r);
    if(g.supplyAlive!==undefined&&g.supplyAlive!==alive)gvCarry(r).forEach(uid=>qrBoardingChanged(r,uid));
    g.supplyAlive=alive;
  });
}
function qrServiceText(r) {
  const q=r.st.sq?.qr,p=q?.resupply;
  if(!p)return 'Resupply: board a transport and stay aboard for a full own-turn cycle.';
  if(p.completed!==null&&Object.values(q.items||{}).every(n=>n===2))return 'Resupplied · 2 / 2 / 2 · ready to disembark';
  if(p.firstStart===null)return 'Waiting · full turn aboard begins at your next turn start; refills at the following one.';
  return 'Resupplying · remain aboard until the start of your next turn.';
}
function qrServiceHTML(vehicle) {
  const rows=gvCarry(vehicle).map(uid=>roster.find(r=>r.uid===uid)).filter(r=>r?.st?.sq);
  if(!rows.length)return '';
  return '<section class="qr-service" aria-label="Transport resupply"><b>INFANTRY RESUPPLY · 2 / 2 / 2</b>'+rows.map(r=>'<p><strong>'+ffText(unitLabel(r.uid))+'</strong><br>'+ffText(isDead(vehicle)?'Interrupted · transport destroyed':qrServiceText(r))+'</p>').join('')+'</section>';
}
