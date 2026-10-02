(function(global){
  function fmtSeconds(seconds){if(!Number.isFinite(seconds))return'—';const sign=seconds<0?'−':'';const s=Math.abs(Math.round(seconds));const m=Math.floor(s/60);const rem=s%60;return `${sign}${String(m).padStart(2,'0')}:${String(rem).padStart(2,'0')}`}
  function fmtM(amount){return amount>=1_000_000?`${(amount/1_000_000).toFixed(2)}M`:`${Math.round(amount/1000)}k`}
  function runwaySeconds(executable,outflowPerMin){if(outflowPerMin<=0)return Infinity;return executable/outflowPerMin*60}
  function committedRoutes(scenario){return scenario.routes.filter(r=>r.state==='SCHEDULED'||r.state==='CONFIRMED').sort((a,b)=>a.etaSeconds-b.etaSeconds)}
  function firstBindingGap(scenario,executableOverride){let available=executableOverride??scenario.operatingLiquidity;let elapsed=0;const ratePerSec=scenario.outflowRatePerMinute/60;const routes=committedRoutes(scenario);for(const route of routes){const delta=route.etaSeconds-elapsed;const need=ratePerSec*delta;if(available<need){const exhaustion=elapsed+available/ratePerSec;return{binding:true,route,exhaustionSeconds:exhaustion,gapSeconds:exhaustion-route.etaSeconds,executableAtStart:executableOverride??scenario.operatingLiquidity}}available-=need;available+=route.amount;elapsed=route.etaSeconds}const next=routes[0]||{etaSeconds:0,name:'No committed route'};const horizon=runwaySeconds(executableOverride??scenario.operatingLiquidity,scenario.outflowRatePerMinute);return{binding:false,route:next,exhaustionSeconds:horizon,gapSeconds:horizon-next.etaSeconds,executableAtStart:executableOverride??scenario.operatingLiquidity}}
  function evaluateIntervention(scenario,intervention){
    const ratePerSec=scenario.outflowRatePerMinute/60;
    const base=firstBindingGap(scenario);
    if(!base.binding||!base.route)return{binding:false,route:base.route,exhaustionSeconds:base.exhaustionSeconds,gapSeconds:base.gapSeconds,interventionApplied:false};
    const target=base.route;
    if(intervention.etaSeconds>base.exhaustionSeconds){
      return{binding:true,route:intervention,exhaustionSeconds:base.exhaustionSeconds,gapSeconds:base.exhaustionSeconds-intervention.etaSeconds,interventionApplied:false};
    }
    let available=scenario.operatingLiquidity;
    let elapsed=0;
    let interventionApplied=false;
    const events=[
      ...committedRoutes(scenario).filter(r=>r.etaSeconds<target.etaSeconds).map(route=>({type:'COMMITTED',time:route.etaSeconds,route})),
      {type:'INTERVENTION',time:intervention.etaSeconds,route:intervention}
    ].sort((a,b)=>a.time-b.time||(a.type==='INTERVENTION'?-1:1));
    for(const event of events){
      const delta=Math.max(0,event.time-elapsed);
      const need=ratePerSec*delta;
      if(available<need){
        const exhaustion=elapsed+available/ratePerSec;
        return{binding:true,route:event.route,exhaustionSeconds:exhaustion,gapSeconds:exhaustion-event.time,interventionApplied};
      }
      available-=need;
      elapsed=event.time;
      available+=event.route.amount;
      if(event.type==='INTERVENTION')interventionApplied=true;
    }
    const toTarget=target.etaSeconds-elapsed;
    const needToTarget=ratePerSec*toTarget;
    if(available<needToTarget){
      const exhaustion=elapsed+available/ratePerSec;
      return{binding:true,route:target,exhaustionSeconds:exhaustion,gapSeconds:exhaustion-target.etaSeconds,interventionApplied};
    }
    const remainingAtTarget=available-needToTarget;
    const marginSeconds=remainingAtTarget/ratePerSec;
    return{binding:false,route:target,exhaustionSeconds:target.etaSeconds+marginSeconds,gapSeconds:marginSeconds,interventionApplied};
  }
  function assessInterventions(scenario){return scenario.routes.filter(r=>r.state==='AVAILABLE').map(route=>{const post=evaluateIntervention(scenario,route);return{...route,post,sufficient:post.interventionApplied&&!post.binding,effectSeconds:post.gapSeconds}}).sort((a,b)=>a.sufficient!==b.sufficient?(a.sufficient?-1:1):a.etaSeconds!==b.etaSeconds?a.etaSeconds-b.etaSeconds:a.amount-b.amount)}
  function analyze(scenario){const base=firstBindingGap(scenario);const interventions=assessInterventions(scenario);const recommendation=interventions.find(x=>x.sufficient)||interventions[0]||null;const nominal=scenario.operatingLiquidity+scenario.routes.reduce((a,r)=>a+r.amount,0);return{base,interventions,recommendation,nominal,bufferSeconds:runwaySeconds(scenario.operatingLiquidity,scenario.outflowRatePerMinute)}}
  global.LiquidityEngine={fmtSeconds,fmtM,runwaySeconds,firstBindingGap,evaluateIntervention,assessInterventions,analyze};
})(window);
