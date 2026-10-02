const E=window.LiquidityEngine;
const scenarios={
  safe:{id:'safe',name:'NOVA Exchange — Safe Treasury',operatingLiquidity:3_000_000,outflowRatePerMinute:100_000,routes:[{id:'sol',name:'Solana Reserve',amount:1_000_000,etaSeconds:4,state:'AVAILABLE'},{id:'cex',name:'CEX Reserve',amount:2_000_000,etaSeconds:720,state:'SCHEDULED'},{id:'token',name:'Tokenized Reserve',amount:4_000_000,etaSeconds:1800,state:'STANDBY'},{id:'bank',name:'Bank Facility',amount:5_000_000,etaSeconds:2700,state:'STANDBY'}]},
  stress:{id:'stress',name:'NOVA Exchange — Timing Stress',operatingLiquidity:1_500_000,outflowRatePerMinute:150_000,routes:[{id:'sol',name:'Solana Reserve',amount:3_150_000,etaSeconds:5,state:'AVAILABLE'},{id:'cex',name:'CEX Reserve',amount:2_000_000,etaSeconds:1020,state:'SCHEDULED'},{id:'token',name:'Tokenized Reserve',amount:4_000_000,etaSeconds:1800,state:'STANDBY'},{id:'bank',name:'Bank Facility',amount:5_000_000,etaSeconds:2700,state:'STANDBY'}]},
  rescue:{id:'rescue',name:'NOVA Exchange — On-chain Rescue Preview',operatingLiquidity:1_500_000,outflowRatePerMinute:150_000,routes:[{id:'sol',name:'Solana Reserve',amount:3_150_000,etaSeconds:5,state:'AVAILABLE'},{id:'cex',name:'CEX Reserve',amount:2_000_000,etaSeconds:1020,state:'SCHEDULED'}]},
  custom:{id:'custom',name:'Custom Treasury — User-defined Stress',operatingLiquidity:1_500_000,outflowRatePerMinute:150_000,routes:[{id:'sol',name:'Solana Reserve',amount:3_150_000,etaSeconds:5,state:'AVAILABLE'},{id:'cex',name:'Next Committed Route',amount:2_000_000,etaSeconds:1020,state:'SCHEDULED'}]}
};

let currentKey='stress';
let executedAmount=0;
let executedRouteId=null;
let executing=false;
let proofMode='NONE';
let lastValues={buffer:null,next:null,gap:null};
let lastSignature='';
let lastNetwork='Solana Devnet';
let runToken=0;

const $=id=>document.getElementById(id);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const fmtAmount=a=>`${E.fmtM(a)} LQUSD`;
const fmtGap=s=>!Number.isFinite(s)?'—':`${s>0?'+':''}${E.fmtSeconds(s)}`;
const cssStatus=s=>`status-${s.toLowerCase()}`;
const iconFor=id=>id==='sol'?'S':id==='cex'?'↗':id==='token'?'◫':id==='bank'?'▥':'●';

function notice(message,tone='info'){
  const el=$('interactionNotice');if(!el)return;
  el.textContent=message;el.dataset.tone=tone;el.hidden=!message;
  el.classList.toggle('is-loading',tone==='loading');
}
function setActionHint(text){if($('actionHint'))$('actionHint').textContent=text}
function setChainName(name){if(!name)return;lastNetwork=name;const label=document.querySelector('#chainPill > span:nth-child(2)');if(label)label.textContent=name}
function setNetworkState(state,label,name){
  setChainName(name);
  if($('networkStatusText'))$('networkStatusText').textContent=label;
  if($('networkStatusDot'))$('networkStatusDot').className=`status-dot ${state}`;
  if($('chainPill')){$('chainPill').dataset.network=state;$('chainPill').classList.toggle('is-loading',state==='checking')}
}
function setButtonLoading(button,on,label){if(!button)return;button.classList.toggle('is-loading',on);if(label&&button.querySelector('span'))button.querySelector('span').textContent=label}
function animateText(el,from,to,formatter,duration=450){if(!el)return;if(from===null||!Number.isFinite(from)||!Number.isFinite(to)){el.textContent=formatter(to);return}const start=performance.now();function step(t){const p=Math.min(1,(t-start)/duration),eased=1-Math.pow(1-p,3);el.textContent=formatter(from+(to-from)*eased);if(p<1)requestAnimationFrame(step)}requestAnimationFrame(step)}
function bump(el){if(!el)return;el.classList.remove('bump');void el.offsetWidth;el.classList.add('bump');setTimeout(()=>el.classList.remove('bump'),380)}
function dialAngle(seconds,maxSeconds=1800){return Math.max(48,Math.min(278,(seconds/maxSeconds)*278))}
function updateDial(id,seconds){if($(id))$(id).style.setProperty('--angle',`${dialAngle(seconds)}deg`)}

function buildLiveScenario(){const raw=structuredClone(scenarios[currentKey]);const liveOperating=raw.operatingLiquidity+executedAmount;const engineRoutes=executedRouteId?raw.routes.filter(r=>r.id!==executedRouteId):raw.routes;return{raw,liveOperating,engineScenario:{...raw,operatingLiquidity:liveOperating,routes:engineRoutes}}}
function renderedRouteState(route){if(route.id!==executedRouteId)return route;if(proofMode==='LIVE_CONFIRMED')return{...route,amount:0,state:'VERIFIED'};return{...route,amount:0,state:'SIMULATED'}}
function renderRoutes(s,liveOperating){
  const displayRoutes=s.routes.map(renderedRouteState);const rows=[{id:'operating',name:'Operating Wallet',amount:liveOperating,etaSeconds:0,state:'EXECUTABLE'},...displayRoutes];
  $('routesBody').innerHTML=rows.map(r=>{const arrival=r.state==='EXECUTABLE'?'Now':r.state==='AVAILABLE'?`~ ${r.etaSeconds} sec`:r.state==='VERIFIED'?'Verified':r.state==='SIMULATED'?'Scenario applied':`${Math.round(r.etaSeconds/60)} min`;const rowClass=r.id==='sol'&&!executedRouteId?'route-highlight route-pulse':r.state==='VERIFIED'?'route-confirmed':r.state==='SIMULATED'?'route-simulated':'';const stateLabel=r.state[0]+r.state.slice(1).toLowerCase();return `<tr class="${rowClass}"><td><div class="source-cell"><span class="source-icon">${iconFor(r.id)}</span>${r.name}</div></td><td>${fmtAmount(r.amount)}</td><td>${arrival}</td><td><span class="status-pill ${cssStatus(r.state)}">${stateLabel}</span></td></tr>`}).join('')
}
function render(animate=true){
  const {raw:s,liveOperating,engineScenario}=buildLiveScenario();const analysis=E.analyze(engineScenario),base=analysis.base,next=base.route,gap=base.gapSeconds,initial=E.analyze(s),rec=analysis.recommendation;$('scenarioName').textContent=s.name;$('customPanel').hidden=currentKey!=='custom';
  if(animate){animateText($('bufferClock'),lastValues.buffer,analysis.bufferSeconds,E.fmtSeconds);animateText($('nextClock'),lastValues.next,next?.etaSeconds??0,E.fmtSeconds);animateText($('survivalGap'),lastValues.gap,gap,fmtGap,550);bump($('survivalGap'))}else{$('bufferClock').textContent=E.fmtSeconds(analysis.bufferSeconds);$('nextClock').textContent=next?E.fmtSeconds(next.etaSeconds):'—';$('survivalGap').textContent=fmtGap(gap)}
  lastValues={buffer:analysis.bufferSeconds,next:next?.etaSeconds??0,gap};updateDial('bufferDial',analysis.bufferSeconds);updateDial('nextDial',next?.etaSeconds??0);$('survivalGap').className=`gap-value ${gap>=0?'positive':'negative'}`;$('gapCard').className=`gap-card card ${gap>=0?'positive-card':''}`;$('gapStatus').textContent=gap>=0?'Current plan survives.':'Liquidity arrives too late.';$('gapAlert').querySelector('span').textContent=gap>=0?'✓':'!';$('metricExecutable').textContent=fmtAmount(liveOperating);$('nextRouteName').textContent=next?next.name:'No committed route';$('nextAmount').textContent=next?fmtAmount(next.amount):'—';renderRoutes(s,liveOperating);
  const btn=$('executeBtn');
  if(gap>=0){
    $('actionTitle').textContent=executedAmount>0?'Liquidity rescue applied':'No intervention required';$('actionAmount').textContent=executedAmount>0?(proofMode==='LIVE_CONFIRMED'?'Live verified':'Simulation complete'):'Current plan survives';btn.disabled=true;btn.querySelector('span').textContent=proofMode==='LIVE_CONFIRMED'?'Live Verified':executedAmount>0?'Demo Complete':'No Execution Required';$('projectedGap').textContent=fmtGap(gap);$('projectedGap').className='positive-text';
    if(proofMode==='LIVE_CONFIRMED')setActionHint(`Solana verification confirmed on ${lastNetwork}. The scenario result is now Explorer-verifiable.`);else if(executedAmount>0)setActionHint('The rescue simulation is complete. Solana verification runs separately in the background and never blocks the product demo.');else setActionHint('This scenario already survives. Choose Timing Stress, On-chain Rescue, or Custom Stress to test a rescue.');
  }else if(rec){
    $('actionTitle').textContent=`Deploy ${rec.name}`;$('actionAmount').textContent=fmtAmount(rec.amount);$('projectedGap').textContent=fmtGap(rec.effectSeconds);$('projectedGap').className=rec.effectSeconds>=0?'positive-text':'negative-text';btn.disabled=executing||executedAmount>0;btn.querySelector('span').textContent=executing?'Running Rescue…':'Run Liquidity Rescue';setActionHint('One click runs the rescue scenario immediately. Live Solana verification happens in the background and does not block the demo.');
  }else{
    $('actionTitle').textContent='No executable route available';$('actionAmount').textContent='Adjust the scenario inputs';btn.disabled=true;btn.querySelector('span').textContent='Execution Unavailable';$('projectedGap').textContent='—';$('projectedGap').className='negative-text';setActionHint('No AVAILABLE route can close this timing gap. Adjust the scenario or add an executable route.');
  }
  $('beforeGap').textContent=fmtGap(initial.base.gapSeconds);$('beforeExecutable').textContent=E.fmtM(s.operatingLiquidity);$('afterExecutable').textContent=E.fmtM(liveOperating);$('beforeBuffer').textContent=E.fmtSeconds(initial.bufferSeconds);$('afterBuffer').textContent=E.fmtSeconds(analysis.bufferSeconds);$('impactBeforeGap').textContent=fmtGap(initial.base.gapSeconds);$('afterGap').textContent=fmtGap(gap);$('afterGap').className=gap>=0?'positive-text':'negative-text';const impactLabel=document.querySelector('#impactPanel .micro-label');if(impactLabel)impactLabel.textContent=executedAmount>0?(proofMode==='LIVE_CONFIRMED'?'BEFORE → LIVE VERIFIED':'BEFORE → SIMULATED OUTCOME'):'CURRENT STATE';document.querySelectorAll('[data-scenario]').forEach(b=>{const active=b.dataset.scenario===currentKey;b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active));b.setAttribute('tabindex',active?'0':'-1')})
}
function setProgressByPhase(phase){const map={analyze:0,prepare:1,apply:2,recalculate:3,complete:4,verify:3};const stepIndex=map[phase]??0;const steps=[...document.querySelectorAll('.progress-step')];steps.forEach((el,i)=>{el.classList.toggle('done',i<stepIndex);el.classList.toggle('active',i===stepIndex);el.classList.toggle('is-loading',i===stepIndex&&phase!=='complete')});$('progressFill').style.width=`${Math.max(0,Math.min(100,(stepIndex/(steps.length-1))*100))}%`}
function resetProgress(){setProgressByPhase('analyze')}
function setProofStatus(title,status='READY'){$('proofStatus').textContent=title;$('proofTxStatus').textContent=status}
function setExecutionLoading(on){$('executionPanel')?.classList.toggle('is-loading',on);$('proofStatus')?.classList.toggle('is-loading',on)}
async function checkNetwork(scroll=false){
  setNetworkState('checking','checking');if(scroll){$('executionPanel').scrollIntoView({behavior:'smooth',block:'center'});notice('Checking Solana verification network…','loading')}
  try{const r=await window.SolanaAdapter.checkNetwork();if(r.ok){setNetworkState('online',`${r.latencyMs}ms`,r.network);$('chainPill').title=`${r.network} RPC online • ${r.latencyMs} ms • click to refresh`;if(scroll)notice(`${r.network} is reachable. Live verification is available when test funding is available.`,'success')}else{setNetworkState('offline','optional','Solana verification');$('chainPill').title='Live verification is optional; click to retry';if(scroll)notice('Live Solana verification is temporarily unavailable. The product demo still works normally.','info')}}catch(_){setNetworkState('offline','optional','Solana verification');if(scroll)notice('Live verification is temporarily unavailable. The product demo still works normally.','info')}
}
async function updateDemoState(){const mini=document.querySelector('.wallet-mini');mini?.classList.add('is-loading');try{const st=await window.SolanaAdapter.getState();setChainName(st.network);$('walletAddress').textContent='Background verifier';$('walletAddress').title=st.wallet||'';$('walletBalance').textContent=st.balanceSol>0?`${st.balanceSol.toFixed(6)} test SOL`:'Automatic';return st}catch(_){$('walletAddress').textContent='Background verifier';$('walletBalance').textContent='Automatic';return{available:false,connected:false}}finally{mini?.classList.remove('is-loading')}}
function applyLiveProof(proof){if(!proof?.isRealChain)return;proofMode='LIVE_CONFIRMED';lastNetwork=proof.network||lastNetwork;setChainName(lastNetwork);lastSignature=proof.signature||'';setProofStatus('Demo complete · live Solana verified','LIVE VERIFIED');$('proofExecution').textContent=`${Number(proof.executionSeconds||0).toFixed(2)} sec`;$('proofSignature').textContent=lastSignature||'—';$('proofSignature').title=lastSignature;$('proofSlot').textContent=proof.slot??'—';$('proofExplorer').href=proof.explorer||'#';$('proofExplorer').hidden=!proof.explorer;$('copySignatureBtn').hidden=!lastSignature;notice(`Live verification confirmed on ${lastNetwork}. The chain transaction is real; the LQUSD treasury scenario remains synthetic.`,'success');render(false)}
function applyBackgroundPending(proof){proofMode='DEMO_COMPLETE';lastNetwork=proof?.network||lastNetwork;setChainName(lastNetwork);lastSignature=proof?.signature||'';setProofStatus('Demo complete · live verification pending','DEMO COMPLETE');$('proofExecution').textContent=proof?.executionSeconds?`${Number(proof.executionSeconds).toFixed(2)} sec`:'—';$('proofSignature').textContent=lastSignature||'—';$('proofSignature').title=lastSignature;$('proofSlot').textContent='—';$('proofExplorer').hidden=true;$('proofExplorer').removeAttribute('href');$('copySignatureBtn').hidden=!lastSignature;notice('The product demo completed successfully. Live Solana verification is optional and currently pending because public test funding is unavailable.','info');render(false)}
async function runDemoAnimation(rec,token){
  const phases=[['analyze','Analyzing timing gap…','ANALYZING',320],['prepare','Preparing rescue route…','PREPARING',420],['apply','Applying scenario rescue…','APPLYING',520],['recalculate','Recalculating liquidity clocks…','RECALCULATING',520]];
  for(const [phase,title,status,delay] of phases){if(token!==runToken)return false;setProgressByPhase(phase);setProofStatus(title,status);notice(title,'loading');await sleep(delay)}
  if(token!==runToken)return false;executedAmount+=rec.amount;executedRouteId=rec.id;proofMode='DEMO_COMPLETE';setProgressByPhase('complete');setProofStatus('Demo complete · checking live verification','DEMO COMPLETE');notice('Rescue simulation complete. Checking optional live Solana verification in the background…','loading');render(true);return true
}
function runBackgroundVerification(rec,token){return window.SolanaAdapter.execute({amount:rec.amount,route:rec,onPhase:(phase,meta={})=>{if(token!==runToken)return;if(meta.network)setChainName(meta.network)}}).catch(()=>null)}
async function execute(){
  const {engineScenario}=buildLiveScenario();const analysis=E.analyze(engineScenario),rec=analysis.recommendation;if(!rec||executing||executedAmount>0)return;executing=true;const token=++runToken;$('faucetFallback').hidden=true;$('executeBtn').disabled=true;setButtonLoading($('executeBtn'),true,'Running Rescue…');setExecutionLoading(true);notice('Starting liquidity rescue…','loading');resetProgress();
  const verification=runBackgroundVerification(rec,token);const completed=await runDemoAnimation(rec,token);if(!completed)return;executing=false;setButtonLoading($('executeBtn'),false,'Demo Complete');render(false);
  let verificationSettled=false;const softTimeout=setTimeout(()=>{if(token!==runToken||verificationSettled)return;applyBackgroundPending(null);setExecutionLoading(false);updateDemoState()},8000);
  verification.then(proof=>{if(token!==runToken)return;verificationSettled=true;clearTimeout(softTimeout);if(proof?.isRealChain)applyLiveProof(proof);else applyBackgroundPending(proof);setExecutionLoading(false);updateDemoState()});
}
function reset(){runToken++;executedAmount=0;executedRouteId=null;executing=false;proofMode='NONE';lastSignature='';lastValues={buffer:null,next:null,gap:null};setProofStatus('Ready to run','READY');$('proofExecution').textContent='—';$('proofSignature').textContent='—';$('proofSlot').textContent='—';$('proofExplorer').hidden=true;$('proofExplorer').removeAttribute('href');$('copySignatureBtn').hidden=true;$('copySignatureBtn').textContent='Copy signature';$('faucetFallback').hidden=true;notice('');setExecutionLoading(false);resetProgress();render(true);updateDemoState()}
async function applyCustomScenario(){
  const inputs=[...$('customPanel').querySelectorAll('input')];if(inputs.some(i=>!i.checkValidity())){inputs.find(i=>!i.checkValidity())?.reportValidity();notice('Check the custom scenario values before recalculating.','error');return}
  const btn=$('applyCustomBtn');btn.disabled=true;btn.classList.add('is-loading');const old=btn.textContent;btn.textContent='Recalculating…';await sleep(420);const operating=Number($('customOperating').value)*1e6,outflow=Number($('customOutflow').value)*1e3,nextAmount=Number($('customNextAmount').value)*1e6,nextEta=Number($('customNextEta').value)*60,reserve=Number($('customReserve').value)*1e6,reserveEta=Number($('customReserveEta').value);
  if([operating,outflow,nextAmount,nextEta,reserve,reserveEta].some(v=>!Number.isFinite(v)||v<=0)){btn.disabled=false;btn.classList.remove('is-loading');btn.textContent=old;notice('All custom values must be positive numbers.','error');return}
  scenarios.custom={id:'custom',name:'Custom Treasury — User-defined Stress',operatingLiquidity:operating,outflowRatePerMinute:outflow,routes:[{id:'sol',name:'Solana Reserve',amount:reserve,etaSeconds:reserveEta,state:'AVAILABLE'},{id:'cex',name:'Next Committed Route',amount:nextAmount,etaSeconds:nextEta,state:'SCHEDULED'}]};currentKey='custom';reset();notice('Custom scenario recalculated.','success');btn.disabled=false;btn.classList.remove('is-loading');btn.textContent=old
}
function toggleSyntheticInfo(){const panel=$('syntheticInfoPanel'),btn=$('syntheticInfoBtn'),open=panel.hidden;panel.hidden=!open;btn.setAttribute('aria-expanded',String(open))}
async function copyText(value,button,done='Copied ✓'){if(!value)return;try{await navigator.clipboard.writeText(value);const old=button.textContent;button.textContent=done;setTimeout(()=>button.textContent=old,1300)}catch{notice('Could not copy automatically. Select the text manually.','error')}}
function copySignature(){return copyText(lastSignature,$('copySignatureBtn'))}
function injectUXStyles(){
  if(document.getElementById('liquidity-ux-loading-styles'))return;const style=document.createElement('style');style.id='liquidity-ux-loading-styles';style.textContent=`
    @keyframes lcSpin{to{transform:rotate(360deg)}}
    @keyframes lcPulse{0%,100%{box-shadow:0 0 0 0 rgba(73,171,255,.08)}50%{box-shadow:0 0 0 8px rgba(73,171,255,.08)}}
    @keyframes lcShimmer{0%{background-position:-180% 0}100%{background-position:180% 0}}
    .execute-btn.is-loading,.custom-apply.is-loading{position:relative;pointer-events:none}
    .execute-btn.is-loading:before,.custom-apply.is-loading:before{content:"";width:15px;height:15px;border:2px solid rgba(5,15,26,.28);border-top-color:#07111d;border-radius:50%;animation:lcSpin .7s linear infinite;flex:0 0 auto}
    .execute-btn.is-loading:after{display:none!important}.chain-pill.is-loading{pointer-events:none}.chain-pill.is-loading:after{content:"";width:12px;height:12px;border:2px solid rgba(126,197,255,.25);border-top-color:#7ec5ff;border-radius:50%;animation:lcSpin .7s linear infinite;margin-left:2px}
    .wallet-mini.is-loading{opacity:.68}.wallet-mini.is-loading:after{content:"";display:inline-block;width:10px;height:10px;border:2px solid rgba(126,197,255,.22);border-top-color:#7ec5ff;border-radius:50%;animation:lcSpin .7s linear infinite;margin-left:7px;vertical-align:-1px}
    .execution-panel.is-loading{border-color:#28547d;box-shadow:0 24px 80px rgba(0,0,0,.34),0 0 0 1px rgba(67,164,255,.05),0 0 34px rgba(67,164,255,.06)}
    #proofStatus.is-loading:before{content:"";display:inline-block;width:13px;height:13px;border:2px solid rgba(126,197,255,.25);border-top-color:#7ec5ff;border-radius:50%;animation:lcSpin .7s linear infinite;margin-right:9px;vertical-align:-1px}
    .interaction-notice[data-tone="loading"]{border-color:#315d85;color:#a8cae8;background:linear-gradient(90deg,rgba(20,48,76,.20),rgba(37,82,121,.32),rgba(20,48,76,.20));background-size:220% 100%;animation:lcShimmer 1.4s linear infinite}
    .progress-step.active i{animation:lcPulse 1.05s ease-in-out infinite}.progress-step.is-loading i:after{content:"";position:absolute;inset:-4px;border:2px solid transparent;border-top-color:#64bdff;border-radius:50%;animation:lcSpin .75s linear infinite}.progress-step i{position:relative}
    tr.route-simulated td{background:rgba(92,118,255,.055)}.status-simulated{background:rgba(112,98,255,.13);color:#b9afff;border:1px solid rgba(112,98,255,.25)}.status-verified{background:rgba(43,227,162,.13);color:var(--green);border:1px solid rgba(43,227,162,.25)}
    .action-panel .execute-btn:not(:disabled){min-height:48px}
    @media (prefers-reduced-motion:reduce){.execute-btn.is-loading:before,.custom-apply.is-loading:before,.chain-pill.is-loading:after,.wallet-mini.is-loading:after,#proofStatus.is-loading:before,.progress-step.is-loading i:after{animation-duration:1.6s}.progress-step.active i{animation:none}.interaction-notice[data-tone="loading"]{animation:none}}
  `;document.head.appendChild(style)
}
function initUI(){
  if($('faucetFallback'))$('faucetFallback').hidden=true;const pop=$('syntheticInfoPanel');if(pop)pop.innerHTML='<b>Public-safe demo.</b><br>The treasury amounts and outcomes are synthetic. One click runs the full rescue scenario immediately. A real Solana test-cluster verification is attempted in the background and is shown separately only when actually confirmed.';const actionBtn=$('executeBtn')?.querySelector('span');if(actionBtn)actionBtn.textContent='Run Liquidity Rescue';if($('walletAddress'))$('walletAddress').textContent='Background verifier';if($('walletBalance'))$('walletBalance').textContent='Automatic';const sectionLabel=$('executionPanel')?.querySelector('.micro-label');if(sectionLabel)sectionLabel.textContent='EXECUTION & VERIFICATION';const labels=['Analyze','Prepare','Apply','Recalculate','Complete'];document.querySelectorAll('.progress-step span').forEach((el,i)=>{if(labels[i])el.textContent=labels[i]})
}
document.querySelectorAll('[data-scenario]').forEach(btn=>{btn.addEventListener('click',()=>{currentKey=btn.dataset.scenario;reset()});btn.addEventListener('keydown',e=>{const tabs=[...document.querySelectorAll('[data-scenario]')],i=tabs.indexOf(btn);if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();const next=tabs[(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length];next.focus();next.click()}})});
$('applyCustomBtn').addEventListener('click',applyCustomScenario);$('executeBtn').addEventListener('click',execute);$('chainPill').addEventListener('click',()=>checkNetwork(true));$('syntheticInfoBtn').addEventListener('click',toggleSyntheticInfo);$('copySignatureBtn').addEventListener('click',copySignature);document.addEventListener('click',e=>{if(!$('syntheticInfoPanel').hidden&&!$('syntheticInfoBtn').contains(e.target)&&!$('syntheticInfoPanel').contains(e.target)){$('syntheticInfoPanel').hidden=true;$('syntheticInfoBtn').setAttribute('aria-expanded','false')}});
injectUXStyles();initUI();reset();checkNetwork(false);
