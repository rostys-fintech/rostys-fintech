const E=window.LiquidityEngine;

const scenarios={
  safe:{id:'safe',name:'NOVA Exchange — Safe Treasury',operatingLiquidity:3_000_000,outflowRatePerMinute:100_000,bottleneck:'None',routes:[
    {id:'sol',name:'Solana Reserve',amount:1_000_000,etaSeconds:4,state:'AVAILABLE',provenance:'SCENARIO'},
    {id:'cex',name:'CEX Reserve',amount:2_000_000,etaSeconds:12*60,state:'SCHEDULED',provenance:'CONFIGURED'},
    {id:'token',name:'Tokenized Reserve',amount:4_000_000,etaSeconds:30*60,state:'STANDBY',provenance:'CONFIGURED'},
    {id:'bank',name:'Bank Facility',amount:5_000_000,etaSeconds:45*60,state:'STANDBY',provenance:'CONFIGURED'}]},
  stress:{id:'stress',name:'NOVA Exchange — Timing Stress',operatingLiquidity:1_500_000,outflowRatePerMinute:150_000,bottleneck:'Settlement latency',routes:[
    {id:'sol',name:'Solana Reserve',amount:3_150_000,etaSeconds:5,state:'AVAILABLE',provenance:'SCENARIO'},
    {id:'cex',name:'CEX Reserve',amount:2_000_000,etaSeconds:17*60,state:'SCHEDULED',provenance:'CONFIGURED'},
    {id:'token',name:'Tokenized Reserve',amount:4_000_000,etaSeconds:30*60,state:'STANDBY',provenance:'CONFIGURED'},
    {id:'bank',name:'Bank Facility',amount:5_000_000,etaSeconds:45*60,state:'STANDBY',provenance:'CONFIGURED'}]},
  rescue:{id:'rescue',name:'NOVA Exchange — On-chain Rescue Preview',operatingLiquidity:1_500_000,outflowRatePerMinute:150_000,bottleneck:'Settlement latency',previewRescue:true,routes:[
    {id:'sol',name:'Solana Reserve',amount:3_150_000,etaSeconds:5,state:'AVAILABLE',provenance:'SCENARIO'},
    {id:'cex',name:'CEX Reserve',amount:2_000_000,etaSeconds:17*60,state:'SCHEDULED',provenance:'CONFIGURED'},
    {id:'token',name:'Tokenized Reserve',amount:4_000_000,etaSeconds:30*60,state:'STANDBY',provenance:'CONFIGURED'},
    {id:'bank',name:'Bank Facility',amount:5_000_000,etaSeconds:45*60,state:'STANDBY',provenance:'CONFIGURED'}]},
  custom:{id:'custom',name:'Custom Treasury — User-defined Stress',operatingLiquidity:1_500_000,outflowRatePerMinute:150_000,bottleneck:'User-defined timing gap',routes:[
    {id:'sol',name:'Solana Reserve',amount:3_150_000,etaSeconds:5,state:'AVAILABLE',provenance:'SCENARIO'},
    {id:'cex',name:'Next Committed Route',amount:2_000_000,etaSeconds:17*60,state:'SCHEDULED',provenance:'CONFIGURED'}]}
};

let currentKey='stress';
let executedAmount=0;
let executedRouteId=null;
let executing=false;
let lastValues={buffer:null,next:null,gap:null};
const $=id=>document.getElementById(id);

function fmtAmount(amount){return `${E.fmtM(amount)} LQUSD`}
function shortAddr(a){return !a?'Phantom not connected':a.length>18?`${a.slice(0,7)}…${a.slice(-7)}`:a}
function cssStatus(state){return `status-${state.toLowerCase()}`}
function iconFor(id){return id==='sol'?'S':id==='cex'?'↗':id==='token'?'◫':id==='bank'?'▥':'●'}

function animateText(el,from,to,formatter,duration=550){
  if(from===null||!Number.isFinite(from)||!Number.isFinite(to)){el.textContent=formatter(to);return}
  const start=performance.now();
  function step(t){const p=Math.min(1,(t-start)/duration);const eased=1-Math.pow(1-p,3);el.textContent=formatter(from+(to-from)*eased);if(p<1)requestAnimationFrame(step)}
  requestAnimationFrame(step);
}
function bump(el){el.classList.remove('bump');void el.offsetWidth;el.classList.add('bump');setTimeout(()=>el.classList.remove('bump'),380)}
function dialAngle(seconds,maxSeconds=30*60){return Math.max(48,Math.min(278,(seconds/maxSeconds)*278))}
function updateDial(id,seconds,color){$(id).style.setProperty('--angle',`${dialAngle(seconds)}deg`);if(color)$(id).style.setProperty('--dial-color',color)}

function buildLiveScenario(){
  const s=structuredClone(scenarios[currentKey]);
  const liveOperating=s.operatingLiquidity+executedAmount;
  const engineRoutes=executedRouteId?s.routes.filter(r=>r.id!==executedRouteId):s.routes;
  return {raw:s,liveOperating,engineScenario:{...s,operatingLiquidity:liveOperating,routes:engineRoutes}};
}

function renderRoutes(s,liveOperating){
  const displayRoutes=s.routes.map(r=>r.id===executedRouteId?{...r,amount:0,state:'DEPLOYED',provenance:'ON_CHAIN'}:r);
  const rows=[{id:'operating',name:'Operating Wallet',amount:liveOperating,etaSeconds:0,state:'EXECUTABLE',provenance:'SCENARIO'},...displayRoutes];
  $('routesBody').innerHTML=rows.map(r=>{
    const arrival=r.state==='EXECUTABLE'?'Now':r.state==='AVAILABLE'?`~ ${r.etaSeconds} sec`:r.state==='DEPLOYED'?'Confirmed':`${Math.round(r.etaSeconds/60)} min`;
    const rowClass=r.id==='sol'&&!executedRouteId?'route-highlight route-pulse':r.state==='DEPLOYED'?'route-confirmed':'';
    return `<tr class="${rowClass}"><td><div class="source-cell"><span class="source-icon">${iconFor(r.id)}</span>${r.name}</div></td><td>${fmtAmount(r.amount)}</td><td>${arrival}</td><td><span class="status-pill ${cssStatus(r.state)}">${r.state[0]+r.state.slice(1).toLowerCase()}</span></td></tr>`
  }).join('');
}

function render(animate=true){
  const {raw:s,liveOperating,engineScenario}=buildLiveScenario();
  const analysis=E.analyze(engineScenario);
  const base=analysis.base;
  const next=base.route;
  const gap=base.gapSeconds;
  const initial=E.analyze(s);
  const recommendation=analysis.recommendation;

  $('scenarioName').textContent=s.name;
  $('customPanel').hidden=currentKey!=='custom';
  if(animate){
    animateText($('bufferClock'),lastValues.buffer,analysis.bufferSeconds,E.fmtSeconds);
    animateText($('nextClock'),lastValues.next,next?.etaSeconds??0,E.fmtSeconds);
    animateText($('survivalGap'),lastValues.gap,gap,E.fmtSeconds,650);
    bump($('survivalGap'));
  }else{
    $('bufferClock').textContent=E.fmtSeconds(analysis.bufferSeconds);
    $('nextClock').textContent=next?E.fmtSeconds(next.etaSeconds):'—';
    $('survivalGap').textContent=E.fmtSeconds(gap);
  }
  lastValues={buffer:analysis.bufferSeconds,next:next?.etaSeconds??0,gap};

  updateDial('bufferDial',analysis.bufferSeconds);
  updateDial('nextDial',next?.etaSeconds??0);
  $('survivalGap').className=`gap-value ${gap>=0?'positive':'negative'}`;
  $('gapCard').className=`gap-card card ${gap>=0?'positive-card':''}`;
  $('gapStatus').textContent=gap>=0?'Current plan survives.':'Liquidity arrives too late.';
  $('gapAlert').querySelector('span').textContent=gap>=0?'✓':'!';
  $('metricExecutable').textContent=fmtAmount(liveOperating);
  $('nextRouteName').textContent=next?next.name:'No committed route';
  $('nextAmount').textContent=next?fmtAmount(next.amount):'—';

  renderRoutes(s,liveOperating);

  const rec=recommendation;
  if(gap>=0){
    $('actionTitle').textContent='No intervention required';
    $('actionAmount').textContent='Current plan survives';
    $('executeBtn').disabled=true;
    $('projectedGap').textContent=E.fmtSeconds(gap);
    $('projectedGap').className='positive-text';
  }else if(rec){
    $('actionTitle').textContent=`Deploy ${rec.name}`;
    $('actionAmount').textContent=fmtAmount(rec.amount);
    $('executeBtn').disabled=executing||executedAmount>0;
    $('projectedGap').textContent=E.fmtSeconds(rec.effectSeconds);
    $('projectedGap').className=rec.effectSeconds>=0?'positive-text':'negative-text';
  }

  $('beforeGap').textContent=E.fmtSeconds(initial.base.gapSeconds);
  $('beforeExecutable').textContent=E.fmtM(s.operatingLiquidity);
  $('afterExecutable').textContent=E.fmtM(liveOperating);
  $('beforeBuffer').textContent=E.fmtSeconds(initial.bufferSeconds);
  $('afterBuffer').textContent=E.fmtSeconds(analysis.bufferSeconds);
  $('impactBeforeGap').textContent=E.fmtSeconds(initial.base.gapSeconds);
  $('afterGap').textContent=E.fmtSeconds(gap);
  $('afterGap').className=gap>=0?'positive-text':'negative-text';

  document.querySelectorAll('[data-scenario]').forEach(b=>b.classList.toggle('active',b.dataset.scenario===currentKey));
  if(s.previewRescue&&executedAmount===0){
    const preview=E.firstBindingGap(s,s.operatingLiquidity+3_150_000);
    $('projectedGap').textContent=E.fmtSeconds(preview.gapSeconds);
  }
}

function setProgress(stepIndex){
  const steps=[...document.querySelectorAll('.progress-step')];
  steps.forEach((el,i)=>{el.classList.toggle('done',i<stepIndex);el.classList.toggle('active',i===stepIndex)});
  const width=Math.max(0,Math.min(100,(stepIndex/(steps.length-1))*100));
  $('progressFill').style.width=`${width}%`;
}
function resetProgress(){setProgress(0)}
function setProofStatus(title,status='NOT SUBMITTED'){$('proofStatus').textContent=title;$('proofTxStatus').textContent=status}

async function execute(){
  const {raw:s,engineScenario}=buildLiveScenario();
  const analysis=E.analyze(engineScenario);const rec=analysis.recommendation;
  if(!rec||executing||executedAmount>0)return;
  executing=true;
  $('executeBtn').disabled=true;$('executeBtn').querySelector('span').textContent='Executing…';
  setProofStatus('Preparing Devnet transaction','PREPARING');setProgress(0);
  try{
    await updateWalletState();
    setProgress(1);setProofStatus('Approve in Phantom','AWAITING SIGNATURE');
    const proofPromise=window.SolanaAdapter.execute({amount:rec.amount,route:rec});
    await new Promise(r=>setTimeout(r,250));
    setProgress(2);setProofStatus('Submitting to Solana Devnet','SUBMITTED');
    const proof=await proofPromise;
    if(!proof.ok)throw new Error('Execution failed');
    setProgress(3);setProofStatus('Confirming on Solana','CONFIRMING');
    await new Promise(r=>setTimeout(r,280));

    executedAmount+=rec.amount;executedRouteId=rec.id;
    setProgress(4);setProofStatus('Confirmed on Solana','CONFIRMED');
    $('proofExecution').textContent=`${proof.executionSeconds.toFixed(2)} sec`;
    $('proofSignature').textContent=proof.signature;
    $('proofSignature').title=proof.signature;
    $('proofSlot').textContent=proof.slot??'—';
    if(proof.explorer){$('proofExplorer').href=proof.explorer;$('proofExplorer').hidden=false}
    $('actionPanel').classList.add('pulse-green');$('executionPanel').classList.add('pulse-green');setTimeout(()=>{$('actionPanel').classList.remove('pulse-green');$('executionPanel').classList.remove('pulse-green')},1400);
    render(true);await updateWalletState();
  }catch(err){
    setProofStatus('Transaction not completed','FAILED');$('proofExecution').textContent='—';
    $('gapCard').classList.add('shake');setTimeout(()=>$('gapCard').classList.remove('shake'),400);
    resetProgress();
    console.error(err);
  }finally{
    executing=false;$('executeBtn').querySelector('span').textContent='Execute Liquidity';render(false)
  }
}

function reset(){
  executedAmount=0;executedRouteId=null;executing=false;lastValues={buffer:null,next:null,gap:null};
  setProofStatus('Ready for Devnet execution','NOT SUBMITTED');$('proofExecution').textContent='—';$('proofSignature').textContent='—';$('proofSlot').textContent='—';$('proofExplorer').hidden=true;$('proofExplorer').href='#';resetProgress();render(true)
}

async function updateWalletState(){
  try{
    const st=await window.SolanaAdapter.getState();
    $('walletAddress').textContent=st.connected?shortAddr(st.wallet):(st.available?'Phantom available — connect':'Phantom not detected');
    $('walletAddress').title=st.wallet||'';$('walletBalance').textContent=st.connected?`${st.balanceSol.toFixed(5)} SOL`:'—';
    $('connectWalletBtn').textContent=st.connected?'Phantom connected':'Connect Phantom';$('fundWalletBtn').disabled=!st.connected;
    $('chainPill').classList.toggle('connected',!!st.connected);
  }catch(e){$('walletAddress').textContent='Wallet status unavailable';$('walletBalance').textContent='—'}
}
async function connectWallet(){
  $('connectWalletBtn').disabled=true;$('connectWalletBtn').textContent='Connecting…';
  try{await window.SolanaAdapter.connect();await updateWalletState();setProofStatus('Wallet connected — ready','READY')}
  catch(e){setProofStatus('Connect a development Phantom wallet','WALLET REQUIRED');console.error(e)}
  $('connectWalletBtn').disabled=false;
}
async function fundWallet(){
  $('fundWalletBtn').disabled=true;$('fundWalletBtn').textContent='Funding…';
  try{const r=await window.SolanaAdapter.fundDevnet(0.02);setProofStatus(r.alreadyFunded?'Devnet wallet already funded':'Devnet funding confirmed','READY');await updateWalletState()}
  catch(e){setProofStatus('Devnet funding failed','FAILED');console.error(e)}
  $('fundWalletBtn').textContent='Fund Devnet';$('fundWalletBtn').disabled=false;
}

function applyCustomScenario(){
  const operating=Math.max(100_000,Number($('customOperating').value||1.5)*1_000_000);
  const outflow=Math.max(1_000,Number($('customOutflow').value||150)*1_000);
  const nextAmount=Math.max(100_000,Number($('customNextAmount').value||2)*1_000_000);
  const nextEta=Math.max(60,Number($('customNextEta').value||17)*60);
  const reserve=Math.max(100_000,Number($('customReserve').value||3.15)*1_000_000);
  const reserveEta=Math.max(1,Number($('customReserveEta').value||5));
  scenarios.custom={id:'custom',name:'Custom Treasury — User-defined Stress',operatingLiquidity:operating,outflowRatePerMinute:outflow,bottleneck:'User-defined timing gap',routes:[
    {id:'sol',name:'Solana Reserve',amount:reserve,etaSeconds:reserveEta,state:'AVAILABLE',provenance:'SCENARIO'},
    {id:'cex',name:'Next Committed Route',amount:nextAmount,etaSeconds:nextEta,state:'SCHEDULED',provenance:'CONFIGURED'}]};
  currentKey='custom';reset();
}

document.querySelectorAll('[data-scenario]').forEach(btn=>btn.addEventListener('click',()=>{currentKey=btn.dataset.scenario;reset()}));
$('applyCustomBtn').addEventListener('click',applyCustomScenario);
$('executeBtn').addEventListener('click',execute);$('connectWalletBtn').addEventListener('click',connectWallet);$('fundWalletBtn').addEventListener('click',fundWallet);
reset();updateWalletState();
