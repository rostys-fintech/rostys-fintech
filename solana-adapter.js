(function(global){
  const CLUSTERS={
    devnet:{id:'devnet',name:'Solana Devnet',rpc:'https://api.devnet.solana.com',explorer:'devnet'},
    testnet:{id:'testnet',name:'Solana Testnet',rpc:'https://api.testnet.solana.com',explorer:'testnet'}
  };
  const PROOF_LAMPORTS=31_500;
  const TARGET_BALANCE_SOL=0.001;
  const MIN_REQUIRED_LAMPORTS=PROOF_LAMPORTS+50_000;
  const STORAGE_KEY='liquidityClock.devnetDemoSecret.v1';
  let demoWallet=null,recipient=null,persisted=false,activeCluster='devnet';
  const connections={};

  function web3(){return global.solanaWeb3||global.SolanaWeb3||null}
  function bytesToBase64(bytes){let s='';for(const b of bytes)s+=String.fromCharCode(b);return btoa(s)}
  function base64ToBytes(value){const s=atob(value);const out=new Uint8Array(s.length);for(let i=0;i<s.length;i++)out[i]=s.charCodeAt(i);return out}
  function loadOrCreateWallet(w3){
    if(demoWallet)return demoWallet;
    try{
      const saved=global.localStorage?.getItem(STORAGE_KEY);
      if(saved){demoWallet=w3.Keypair.fromSecretKey(base64ToBytes(saved));persisted=true;return demoWallet}
    }catch(_){/* storage unavailable */}
    demoWallet=w3.Keypair.generate();
    try{global.localStorage?.setItem(STORAGE_KEY,bytesToBase64(demoWallet.secretKey));persisted=true}catch(_){persisted=false}
    return demoWallet;
  }
  function ensureCore(){
    const w3=web3();
    if(!w3)throw new Error('Solana Web3 client did not load. Check internet access and reload.');
    loadOrCreateWallet(w3);
    if(!recipient)recipient=w3.Keypair.generate();
    return w3;
  }
  function connectionFor(clusterId){
    const w3=ensureCore();
    const c=CLUSTERS[clusterId];
    if(!c)throw new Error(`Unknown Solana cluster: ${clusterId}`);
    if(!connections[clusterId])connections[clusterId]=new w3.Connection(c.rpc,'confirmed');
    return connections[clusterId];
  }
  function isRateLimit(error){
    const msg=String(error?.message||error||'').toLowerCase();
    return msg.includes('429')||msg.includes('airdrop limit')||msg.includes('faucet has run dry')||msg.includes('rate limit')||msg.includes('too many requests');
  }
  async function balanceLamports(clusterId){return connectionFor(clusterId).getBalance(demoWallet.publicKey,'confirmed')}
  async function waitForSignature(clusterId,signature){
    const c=connectionFor(clusterId);
    for(let i=0;i<24;i++){
      const status=await c.getSignatureStatuses([signature],{searchTransactionHistory:true});
      const value=status?.value?.[0];
      if(value?.err)throw new Error(`${CLUSTERS[clusterId].name} transaction failed.`);
      if(value?.confirmationStatus==='confirmed'||value?.confirmationStatus==='finalized')return value;
      await new Promise(r=>setTimeout(r,600));
    }
    throw new Error(`${CLUSTERS[clusterId].name} confirmation is taking too long.`);
  }
  async function tryAirdrop(clusterId,onPhase){
    const w3=ensureCore(),c=connectionFor(clusterId),before=await c.getBalance(demoWallet.publicKey,'confirmed');
    if(before>=MIN_REQUIRED_LAMPORTS){activeCluster=clusterId;return{ok:true,alreadyFunded:true,cluster:clusterId,balanceSol:before/w3.LAMPORTS_PER_SOL}}
    onPhase?.('fund',{cluster:clusterId,network:CLUSTERS[clusterId].name});
    const lamports=Math.max(Math.ceil(TARGET_BALANCE_SOL*w3.LAMPORTS_PER_SOL),MIN_REQUIRED_LAMPORTS);
    const sig=await c.requestAirdrop(demoWallet.publicKey,lamports);
    await waitForSignature(clusterId,sig);
    let after=await c.getBalance(demoWallet.publicKey,'confirmed');
    for(let i=0;i<8&&after<=before;i++){await new Promise(r=>setTimeout(r,500));after=await c.getBalance(demoWallet.publicKey,'confirmed')}
    if(after<MIN_REQUIRED_LAMPORTS)throw new Error(`${CLUSTERS[clusterId].name} airdrop confirmed but balance is not ready yet.`);
    activeCluster=clusterId;
    return{ok:true,alreadyFunded:false,cluster:clusterId,signature:sig,balanceSol:after/w3.LAMPORTS_PER_SOL}
  }
  async function chooseExecutionCluster(onPhase){
    ensureCore();
    for(const id of [activeCluster,'devnet','testnet']){
      if(!CLUSTERS[id])continue;
      try{const bal=await balanceLamports(id);if(bal>=MIN_REQUIRED_LAMPORTS){activeCluster=id;return{id,balance:bal}}}catch(_){/* try next */}
    }
    const failures=[];
    for(const id of ['devnet','testnet']){
      if(id==='testnet')onPhase?.('fallback',{cluster:id,network:CLUSTERS[id].name});
      try{await tryAirdrop(id,onPhase);const bal=await balanceLamports(id);if(bal>=MIN_REQUIRED_LAMPORTS){activeCluster=id;return{id,balance:bal}}}
      catch(error){failures.push({cluster:id,rateLimited:isRateLimit(error),message:String(error?.message||error)})}
    }
    const e=new Error('Automatic Solana test funding is unavailable on both Devnet and Testnet right now. The same demo address has been kept for a one-time external test-SOL top-up.');
    e.code='ALL_FAUCETS_UNAVAILABLE';e.wallet=demoWallet.publicKey.toString();e.failures=failures;throw e;
  }
  async function checkNetwork(){
    ensureCore();
    for(const id of [activeCluster,'devnet','testnet']){
      if(!CLUSTERS[id])continue;
      try{
        const c=connectionFor(id),started=performance.now();
        const health=await Promise.race([c.getLatestBlockhash('confirmed'),new Promise((_,reject)=>setTimeout(()=>reject(new Error('RPC timeout')),6500))]);
        if(health?.blockhash){activeCluster=id;return{ok:true,latencyMs:Math.round(performance.now()-started),cluster:id,network:CLUSTERS[id].name}}
      }catch(_){/* try next */}
    }
    return{ok:false,network:'Solana test clusters'};
  }
  async function getState(){
    try{
      const w3=ensureCore();let best={cluster:activeCluster,balance:-1};
      for(const id of ['devnet','testnet']){
        try{const bal=await balanceLamports(id);if(bal>best.balance)best={cluster:id,balance:bal};if(bal>=MIN_REQUIRED_LAMPORTS){best={cluster:id,balance:bal};break}}catch(_){/* ignore */}
      }
      activeCluster=best.cluster;
      return{available:true,connected:true,mode:'PERSISTENT_SOLANA_TEST_WALLET',wallet:demoWallet.publicKey.toString(),balanceSol:Math.max(0,best.balance)/w3.LAMPORTS_PER_SOL,recipient:recipient.publicKey.toString(),cluster:activeCluster,network:CLUSTERS[activeCluster].name,persisted,requiredSol:MIN_REQUIRED_LAMPORTS/w3.LAMPORTS_PER_SOL};
    }catch(error){return{available:false,connected:false,error:String(error),network:'Solana test clusters',persisted}}
  }
  async function execute({amount,onPhase}={}){
    const w3=ensureCore();
    onPhase?.('prepare',{network:CLUSTERS[activeCluster].name,cluster:activeCluster});
    const selected=await chooseExecutionCluster(onPhase),clusterId=selected.id,c=connectionFor(clusterId),meta=CLUSTERS[clusterId];
    const balance=await c.getBalance(demoWallet.publicKey,'confirmed');
    if(balance<MIN_REQUIRED_LAMPORTS){const e=new Error(`${meta.name} demo wallet still needs test SOL.`);e.code='NEEDS_TEST_SOL';e.wallet=demoWallet.publicKey.toString();throw e}
    const tx=new w3.Transaction().add(w3.SystemProgram.transfer({fromPubkey:demoWallet.publicKey,toPubkey:recipient.publicKey,lamports:PROOF_LAMPORTS}));
    const latest=await c.getLatestBlockhash('confirmed');tx.recentBlockhash=latest.blockhash;tx.feePayer=demoWallet.publicKey;
    const totalStart=performance.now();
    onPhase?.('sign',{cluster:clusterId,network:meta.name});tx.sign(demoWallet);
    onPhase?.('submit',{cluster:clusterId,network:meta.name});const sendStart=performance.now();
    const signature=await c.sendRawTransaction(tx.serialize(),{skipPreflight:false,maxRetries:3,preflightCommitment:'confirmed'});
    onPhase?.('confirm',{cluster:clusterId,network:meta.name});
    const confirmation=await c.confirmTransaction({signature,...latest},'confirmed');if(confirmation.value.err)throw new Error(`${meta.name} transaction failed during confirmation.`);
    const confirmedAt=performance.now(),status=await c.getSignatureStatus(signature,{searchTransactionHistory:true});let txInfo=null;
    for(let i=0;i<8&&!txInfo;i++){txInfo=await c.getTransaction(signature,{commitment:'confirmed',maxSupportedTransactionVersion:0});if(!txInfo)await new Promise(r=>setTimeout(r,450))}
    const postBalance=await c.getBalance(demoWallet.publicKey,'confirmed');onPhase?.('complete',{cluster:clusterId,network:meta.name});
    return{ok:true,isRealChain:true,cluster:clusterId,network:meta.name,signerMode:'PERSISTENT_BROWSER_TEST_WALLET',persisted,amount,proofTransferSol:PROOF_LAMPORTS/w3.LAMPORTS_PER_SOL,executionSeconds:(confirmedAt-totalStart)/1000,networkSeconds:(confirmedAt-sendStart)/1000,signature,slot:txInfo?.slot||status?.value?.slot||null,confirmationStatus:status?.value?.confirmationStatus||'confirmed',wallet:demoWallet.publicKey.toString(),recipient:recipient.publicKey.toString(),walletBalanceSol:postBalance/w3.LAMPORTS_PER_SOL,explorer:`https://explorer.solana.com/tx/${signature}?cluster=${meta.explorer}`,note:`A browser-stored test-only keypair signs the real ${meta.name} test-SOL proof. Scenario LQUSD amounts remain synthetic notional.`};
  }
  global.SolanaAdapter={mode:'SELF_CONTAINED_SOLANA_TEST_CLUSTER_PROOF',getState,execute,checkNetwork,proofLamports:PROOF_LAMPORTS};
})(window);
