(function(global){
  const RPC_URL='https://api.devnet.solana.com';
  const PROOF_LAMPORTS=31_500;
  const TARGET_BALANCE_SOL=0.005;
  const MIN_REQUIRED_LAMPORTS=PROOF_LAMPORTS+50_000;
  const STORAGE_KEY='liquidityClock.devnetDemoSecret.v1';
  let connection=null,demoWallet=null,recipient=null,persisted=false;

  function web3(){return global.solanaWeb3||global.SolanaWeb3||null}
  function bytesToBase64(bytes){let s='';for(const b of bytes)s+=String.fromCharCode(b);return btoa(s)}
  function base64ToBytes(value){const s=atob(value);const out=new Uint8Array(s.length);for(let i=0;i<s.length;i++)out[i]=s.charCodeAt(i);return out}
  function loadOrCreateWallet(w3){
    if(demoWallet)return demoWallet;
    try{
      const saved=global.localStorage?.getItem(STORAGE_KEY);
      if(saved){demoWallet=w3.Keypair.fromSecretKey(base64ToBytes(saved));persisted=true;return demoWallet}
    }catch(_){/* storage unavailable: fall through to in-memory wallet */}
    demoWallet=w3.Keypair.generate();
    try{global.localStorage?.setItem(STORAGE_KEY,bytesToBase64(demoWallet.secretKey));persisted=true}catch(_){persisted=false}
    return demoWallet;
  }
  function ensureClient(){
    const w3=web3();
    if(!w3)throw new Error('Solana Web3 client did not load. Check internet access and reload.');
    if(!connection)connection=new w3.Connection(RPC_URL,'confirmed');
    loadOrCreateWallet(w3);
    if(!recipient)recipient=w3.Keypair.generate();
    return w3;
  }
  function isRateLimit(error){const msg=String(error?.message||error||'').toLowerCase();return msg.includes('429')||msg.includes('airdrop limit')||msg.includes('faucet has run dry')||msg.includes('rate limit')}
  async function checkNetwork(){
    try{
      ensureClient();
      const started=performance.now();
      const health=await Promise.race([connection.getLatestBlockhash('confirmed'),new Promise((_,reject)=>setTimeout(()=>reject(new Error('RPC timeout')),6500))]);
      return{ok:!!health?.blockhash,latencyMs:Math.round(performance.now()-started),network:'Solana Devnet'};
    }catch(error){return{ok:false,error:String(error),network:'Solana Devnet'}}
  }
  async function getState(){
    try{
      const w3=ensureClient();
      const balance=await connection.getBalance(demoWallet.publicKey,'confirmed');
      return{available:true,connected:true,mode:'PERSISTENT_DEVNET_DEMO_WALLET',wallet:demoWallet.publicKey.toString(),balanceSol:balance/w3.LAMPORTS_PER_SOL,recipient:recipient.publicKey.toString(),network:'Solana Devnet',persisted,requiredSol:MIN_REQUIRED_LAMPORTS/w3.LAMPORTS_PER_SOL};
    }catch(error){return{available:false,connected:false,error:String(error),network:'Solana Devnet',persisted}}
  }
  async function waitForSignature(signature){
    for(let i=0;i<20;i++){
      const status=await connection.getSignatureStatuses([signature],{searchTransactionHistory:true});
      const value=status?.value?.[0];
      if(value?.err)throw new Error('Devnet transaction failed.');
      if(value?.confirmationStatus==='confirmed'||value?.confirmationStatus==='finalized')return value;
      await new Promise(r=>setTimeout(r,600));
    }
    throw new Error('Devnet confirmation is taking too long. Retry in a moment.');
  }
  async function fundDevnet(minSol=TARGET_BALANCE_SOL,onPhase){
    const w3=ensureClient();
    const before=await connection.getBalance(demoWallet.publicKey,'confirmed');
    if(before>=MIN_REQUIRED_LAMPORTS)return{ok:true,alreadyFunded:true,balanceSol:before/w3.LAMPORTS_PER_SOL,wallet:demoWallet.publicKey.toString(),persisted};
    onPhase?.('fund');
    const lamports=Math.max(Math.ceil(minSol*w3.LAMPORTS_PER_SOL),MIN_REQUIRED_LAMPORTS);
    let signature;
    try{
      signature=await connection.requestAirdrop(demoWallet.publicKey,lamports);
      await waitForSignature(signature);
    }catch(error){
      const wrapped=new Error(isRateLimit(error)
        ? 'Solana Devnet faucet is rate-limited. The same demo wallet has been kept. Fund the displayed demo address once with test SOL, then press Run Live Devnet Proof again.'
        : `Automatic Devnet funding failed. The same demo wallet has been kept. ${String(error?.message||error)}`);
      wrapped.code=isRateLimit(error)?'FAUCET_RATE_LIMIT':'FAUCET_ERROR';
      wrapped.wallet=demoWallet.publicKey.toString();
      throw wrapped;
    }
    let after=await connection.getBalance(demoWallet.publicKey,'confirmed');
    for(let i=0;i<6&&after<=before;i++){await new Promise(r=>setTimeout(r,500));after=await connection.getBalance(demoWallet.publicKey,'confirmed')}
    if(after<=before){const e=new Error('The airdrop confirmed but the demo-wallet balance has not updated yet. Wait a moment and retry.');e.code='BALANCE_PENDING';e.wallet=demoWallet.publicKey.toString();throw e}
    return{ok:true,alreadyFunded:false,signature,balanceSol:after/w3.LAMPORTS_PER_SOL,wallet:demoWallet.publicKey.toString(),persisted,explorer:`https://explorer.solana.com/tx/${signature}?cluster=devnet`};
  }
  async function execute({amount,onPhase}={}){
    const w3=ensureClient();
    onPhase?.('prepare');
    let balance=await connection.getBalance(demoWallet.publicKey,'confirmed');
    if(balance<MIN_REQUIRED_LAMPORTS){await fundDevnet(TARGET_BALANCE_SOL,onPhase);balance=await connection.getBalance(demoWallet.publicKey,'confirmed')}
    if(balance<MIN_REQUIRED_LAMPORTS){const e=new Error('The persistent Devnet demo wallet still needs test SOL. Fund the displayed address and retry.');e.code='NEEDS_TEST_SOL';e.wallet=demoWallet.publicKey.toString();throw e}
    const tx=new w3.Transaction().add(w3.SystemProgram.transfer({fromPubkey:demoWallet.publicKey,toPubkey:recipient.publicKey,lamports:PROOF_LAMPORTS}));
    const latest=await connection.getLatestBlockhash('confirmed');
    tx.recentBlockhash=latest.blockhash;tx.feePayer=demoWallet.publicKey;
    const totalStart=performance.now();
    onPhase?.('sign');tx.sign(demoWallet);
    onPhase?.('submit');const sendStart=performance.now();
    const signature=await connection.sendRawTransaction(tx.serialize(),{skipPreflight:false,maxRetries:3,preflightCommitment:'confirmed'});
    onPhase?.('confirm');
    const confirmation=await connection.confirmTransaction({signature,...latest},'confirmed');
    if(confirmation.value.err)throw new Error('Devnet transaction failed during confirmation.');
    const confirmedAt=performance.now();
    const status=await connection.getSignatureStatus(signature,{searchTransactionHistory:true});
    let txInfo=null;for(let i=0;i<8&&!txInfo;i++){txInfo=await connection.getTransaction(signature,{commitment:'confirmed',maxSupportedTransactionVersion:0});if(!txInfo)await new Promise(r=>setTimeout(r,450))}
    const postBalance=await connection.getBalance(demoWallet.publicKey,'confirmed');
    onPhase?.('complete');
    return{ok:true,isRealChain:true,network:'SOLANA DEVNET',signerMode:'PERSISTENT_BROWSER_DEMO_WALLET',persisted,amount,proofTransferSol:PROOF_LAMPORTS/w3.LAMPORTS_PER_SOL,executionSeconds:(confirmedAt-totalStart)/1000,networkSeconds:(confirmedAt-sendStart)/1000,signature,slot:txInfo?.slot||status?.value?.slot||null,confirmationStatus:status?.value?.confirmationStatus||'confirmed',wallet:demoWallet.publicKey.toString(),recipient:recipient.publicKey.toString(),walletBalanceSol:postBalance/w3.LAMPORTS_PER_SOL,explorer:`https://explorer.solana.com/tx/${signature}?cluster=devnet`,note:'A browser-stored Devnet-only demo keypair signs the real test-SOL proof. Scenario LQUSD amounts remain synthetic notional.'};
  }
  global.SolanaAdapter={mode:'SELF_CONTAINED_REAL_DEVNET_PROOF',getState,fundDevnet,execute,checkNetwork,proofLamports:PROOF_LAMPORTS};
})(window);
