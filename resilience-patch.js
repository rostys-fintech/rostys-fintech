(function(){
  function $(id){return document.getElementById(id)}
  function applySignedFallbackUI(proof){
    if(!proof||proof.isRealChain)return;
    const panel=$('executionPanel');
    const fallback=$('faucetFallback');
    if(fallback)fallback.hidden=true;
    if($('proofStatus'))$('proofStatus').textContent='Signed Solana proof ready';
    if($('proofTxStatus'))$('proofTxStatus').textContent='SIGNED / NOT BROADCAST';
    if($('proofExecution'))$('proofExecution').textContent=`${Number(proof.executionSeconds||0).toFixed(2)} sec`;
    if($('proofSlot'))$('proofSlot').textContent='—';
    if($('proofSignature')){$('proofSignature').textContent=proof.signature||'—';$('proofSignature').title=proof.signature||''}
    if($('proofExplorer')){$('proofExplorer').hidden=true;$('proofExplorer').removeAttribute('href')}
    if($('copySignatureBtn'))$('copySignatureBtn').hidden=!proof.signature;
    if($('interactionNotice')){
      $('interactionNotice').hidden=false;
      $('interactionNotice').dataset.tone='info';
      $('interactionNotice').textContent=`Public test-SOL funding is temporarily rate-limited. A fresh ${proof.network||'Solana test-cluster'} transaction was signed locally and bound to a current network blockhash. It was not broadcast, so no on-chain confirmation is claimed.`;
    }
    if($('actionHint'))$('actionHint').textContent='The synthetic rescue scenario was applied in the decision engine. The cryptographic transaction proof is signed but not broadcast; retry later for a live Explorer-confirmed proof.';
    if($('executeBtn')){$('executeBtn').disabled=true;const span=$('executeBtn').querySelector('span');if(span)span.textContent='Signed Proof Ready'}
    const steps=[...document.querySelectorAll('.progress-step')];
    steps.forEach((el,i)=>{el.classList.toggle('done',i<2);el.classList.toggle('active',i===1)});
    if($('progressFill'))$('progressFill').style.width='25%';
    if(panel)panel.dataset.proofMode='signed-fallback';
  }

  function install(){
    if(!window.SolanaAdapter||typeof window.SolanaAdapter.execute!=='function'){setTimeout(install,50);return}
    if(window.SolanaAdapter.__resiliencePatched)return;
    const original=window.SolanaAdapter.execute.bind(window.SolanaAdapter);
    window.SolanaAdapter.execute=async function(args){
      const proof=await original(args);
      if(proof&&!proof.isRealChain)setTimeout(()=>applySignedFallbackUI(proof),0);
      return proof;
    };
    window.SolanaAdapter.__resiliencePatched=true;
  }
  install();
})();
