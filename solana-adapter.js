(function(global){
  const RPC_URL='https://api.devnet.solana.com';
  const PROOF_LAMPORTS=3_150_000;
  const TARGET_BALANCE_SOL=0.01;
  let connection=null,demoWallet=null,recipient=null;

  function web3(){return global.solanaWeb3||global.SolanaWeb3||null}
  function ensureClient(){
    const w3=web3();
    if(!w3)throw new Error('Solana Web3 client did not load. Check internet access and reload.');
    if(!connection)connection=new w3.Connection(RPC_URL,'confirmed');
    if(!demoWallet)demoWallet=w3.Keypair.generate();
    if(!recipient)recipient=w3.Keypair.generate();
    return w3;
  }
  async function checkNetwork(){
    try{
      ensureClient();
      const started=performance.now();
      const health=await Promise.race([
        connection.getLatestBlockhash('confirmed'),
        new Promise((_,reject)=>setTimeout(()=>reject(new Error('RPC timeout')),6500))
      ]);
      return{ok:!!health?.blockhash,latencyMs:Math.round(performance.now()-started),network:'Solana Devnet'};
    }catch(error){return{ok:false,error:String(error),network:'Solana Devnet'}}
  }
  async function getState(){
    try{
      const w3=ensureClient();
      const balance=await connection.getBalance(demoWallet.publicKey,'confirmed');
      return{available:true,connected:true,mode:'EPHEMERAL_BROWSER_WALLET',wallet:demoWallet.publicKey.toString(),balanceSol:balance/w3.LAMPORTS_PER_SOL,recipient:recipient.publicKey.toString(),network:'Solana Devnet',persisted:false};
    }catch(error){return{available:false,connected:false,error:String(error),network:'Solana Devnet'}}
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
    if(before>=minSol*w3.LAMPORTS_PER_SOL)return{ok:true,alreadyFunded:true,balanceSol:before/w3.LAMPORTS_PER_SOL,wallet:demoWallet.publicKey.toString()};
    onPhase?.('fund');
    const lamports=Math.ceil(minSol*w3.LAMPORTS_PER_SOL);
    let lastError=null,signature=null;
    for(let attempt=0;attempt<2;attempt++){
      try{signature=await connection.requestAirdrop(demoWallet.publicKey,lamports);await waitForSignature(signature);break}
      catch(error){lastError=error;if(attempt===0)await new Promise(r=>setTimeout(r,1200))}
    }
    if(!signature)throw new Error(`Devnet faucet is rate-limited. Retry the live proof in a moment. ${lastError?String(lastError.message||lastError):''}`.trim());
    let after=await connection.getBalance(demoWallet.publicKey,'confirmed');
    for(let i=0;i<6&&after<=before;i++){await new Promise(r=>setTimeout(r,500));after=await connection.getBalance(demoWallet.publicKey,'confirmed')}
    if(after<=before)throw new Error('The airdrop confirmed but the demo-wallet balance has not updated yet. Retry the live proof.');
    return{ok:true,alreadyFunded:false,signature,balanceSol:after/w3.LAMPORTS_PER_SOL,wallet:demoWallet.publicKey.toString(),explorer:`https://explorer.solana.com/tx/${signature}?cluster=devnet`};
  }
  async function execute({amount,onPhase}={}){
    const w3=ensureClient();
    onPhase?.('prepare');
    let balance=await connection.getBalance(demoWallet.publicKey,'confirmed');
    const required=PROOF_LAMPORTS+1_000_000;
    if(balance<required){await fundDevnet(TARGET_BALANCE_SOL,onPhase);balance=await connection.getBalance(demoWallet.publicKey,'confirmed')}
    if(balance<required)throw new Error('The temporary Devnet wallet does not have enough test SOL. Retry the live proof.');
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
    return{ok:true,isRealChain:true,network:'SOLANA DEVNET',signerMode:'EPHEMERAL_BROWSER_WALLET',persisted:false,amount,proofTransferSol:PROOF_LAMPORTS/w3.LAMPORTS_PER_SOL,executionSeconds:(confirmedAt-totalStart)/1000,networkSeconds:(confirmedAt-sendStart)/1000,signature,slot:txInfo?.slot||status?.value?.slot||null,confirmationStatus:status?.value?.confirmationStatus||'confirmed',wallet:demoWallet.publicKey.toString(),recipient:recipient.publicKey.toString(),walletBalanceSol:postBalance/w3.LAMPORTS_PER_SOL,explorer:`https://explorer.solana.com/tx/${signature}?cluster=devnet`,note:'A temporary in-memory Devnet keypair signs the real test-SOL proof. Scenario LQUSD amounts remain synthetic notional.'};
  }
  global.SolanaAdapter={mode:'SELF_CONTAINED_REAL_DEVNET_PROOF',getState,fundDevnet,execute,checkNetwork,proofLamports:PROOF_LAMPORTS};
})(window);
