(function(global){
  function fmtSeconds(seconds){
    if (!Number.isFinite(seconds)) return '—';
    const sign = seconds < 0 ? '−' : '';
    const s = Math.abs(Math.round(seconds));
    const m = Math.floor(s/60);
    const rem = s%60;
    return `${sign}${String(m).padStart(2,'0')}:${String(rem).padStart(2,'0')}`;
  }
  function fmtM(amount){
    return amount >= 1_000_000 ? `${(amount/1_000_000).toFixed(2)}M` : `${Math.round(amount/1000)}k`;
  }
  function runwaySeconds(executable, outflowPerMin){
    if(outflowPerMin <= 0) return Infinity;
    return executable / outflowPerMin * 60;
  }
  function committedRoutes(scenario){
    return scenario.routes.filter(r=>r.state==='SCHEDULED' || r.state==='CONFIRMED').sort((a,b)=>a.etaSeconds-b.etaSeconds);
  }
  function firstBindingGap(scenario, executableOverride){
    let available = executableOverride ?? scenario.operatingLiquidity;
    let elapsed = 0;
    const ratePerSec = scenario.outflowRatePerMinute/60;
    const routes = committedRoutes(scenario);
    for(const route of routes){
      const delta = route.etaSeconds - elapsed;
      const need = ratePerSec * delta;
      if(available < need){
        const exhaustion = elapsed + available/ratePerSec;
        return {binding:true, route, exhaustionSeconds:exhaustion, gapSeconds:exhaustion-route.etaSeconds, executableAtStart: executableOverride ?? scenario.operatingLiquidity};
      }
      available -= need;
      available += route.amount;
      elapsed = route.etaSeconds;
    }
    const next = routes[0] || {etaSeconds:0,name:'No committed route'};
    const horizon = runwaySeconds(executableOverride ?? scenario.operatingLiquidity, scenario.outflowRatePerMinute);
    return {binding:false, route:next, exhaustionSeconds:horizon, gapSeconds:horizon-next.etaSeconds, executableAtStart: executableOverride ?? scenario.operatingLiquidity};
  }
  function assessInterventions(scenario){
    const candidates = scenario.routes.filter(r=>r.state==='AVAILABLE');
    return candidates.map(route=>{
      const post = firstBindingGap(scenario, scenario.operatingLiquidity + route.amount);
      return {...route,post,sufficient:!post.binding || post.gapSeconds>=0,effectSeconds:post.gapSeconds};
    }).sort((a,b)=>{
      if(a.sufficient!==b.sufficient) return a.sufficient?-1:1;
      if(a.etaSeconds!==b.etaSeconds) return a.etaSeconds-b.etaSeconds;
      return a.amount-b.amount;
    });
  }
  function analyze(scenario){
    const base = firstBindingGap(scenario);
    const interventions = assessInterventions(scenario);
    const recommendation = interventions.find(x=>x.sufficient) || interventions[0] || null;
    const nominal = scenario.operatingLiquidity + scenario.routes.reduce((a,r)=>a+r.amount,0);
    return {base,interventions,recommendation,nominal,bufferSeconds:runwaySeconds(scenario.operatingLiquidity,scenario.outflowRatePerMinute)};
  }
  global.LiquidityEngine={fmtSeconds,fmtM,runwaySeconds,firstBindingGap,assessInterventions,analyze};
})(window);
