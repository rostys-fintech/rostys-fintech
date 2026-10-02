(function(global){
  const RPC_URL='https://api.devnet.solana.com';
  const PROOF_LAMPORTS=3_150_000;
  let connection=null;
  let provider=null;
  let recipient=null;

  function web3(){ return global.solanaWeb3 || global.SolanaWeb3 || null; }
  function walletProvider(){ return global.phantom?.solana || (global.solana?.isPhantom ? global.solana : null) || null; }
  function ensureClient(){
    const w3=web3();
    if(!w3) throw new Error('Solana Web3 client did not load. Check internet access and reload.');
    if(!connection) connection=new w3.Connection(RPC_URL,'confirmed');
    if(!recipient) recipient=w3.Keypair.generate();
    return w3;
  }
  async function connect(){
    ensureClient();
    provider=walletProvider();
    if(!provider) throw new Error('Phantom wallet not detected. Install/enable Phantom and use a development wallet only.');
    const res=await provider.connect();
    const wallet=(res?.publicKey || provider.publicKey).toString();
    const balance=await connection.getBalance(provider.publicKey,'confirmed');
    return {wallet,balanceSol:balance/web3().LAMPORTS_PER_SOL,recipient:recipient.publicKey.toString()};
  }
  async function getState(){
    try{
      ensureClient();
      provider=walletProvider();
      if(!provider?.isConnected || !provider.publicKey) return {available:!!provider,connected:false,network:'Solana Devnet'};
      const balance=await connection.getBalance(provider.publicKey,'confirmed');
      return {available:true,connected:true,wallet:provider.publicKey.toString(),balanceSol:balance/web3().LAMPORTS_PER_SOL,recipient:recipient.publicKey.toString(),network:'Solana Devnet'};
    }catch(e){ return {available:false,connected:false,error:String(e),network:'Solana Devnet'}; }
  }
  async function fundDevnet(minSol=0.02){
    const w3=ensureClient();
    if(!provider?.publicKey) await connect();
    const before=await connection.getBalance(provider.publicKey,'confirmed');
    if(before >= minSol*w3.LAMPORTS_PER_SOL) return {ok:true,alreadyFunded:true,balanceSol:before/w3.LAMPORTS_PER_SOL};
    const sig=await connection.requestAirdrop(provider.publicKey, Math.ceil(minSol*w3.LAMPORTS_PER_SOL));
    const latest=await connection.getLatestBlockhash('confirmed');
    await connection.confirmTransaction({signature:sig,...latest},'confirmed');
    const after=await connection.getBalance(provider.publicKey,'confirmed');
    return {ok:true,signature:sig,balanceSol:after/w3.LAMPORTS_PER_SOL,explorer:`https://explorer.solana.com/tx/${sig}?cluster=devnet`};
  }
  async function execute({amount}){
    const w3=ensureClient();
    if(!provider?.publicKey) await connect();
    const balance=await connection.getBalance(provider.publicKey,'confirmed');
    const feeBuffer=5_000_000;
    if(balance < PROOF_LAMPORTS + feeBuffer){
      try{ await fundDevnet(0.02); }
      catch(e){ throw new Error(`Devnet wallet needs test SOL. Use FUND DEVNET and retry. Faucet error: ${String(e)}`); }
    }
    const tx=new w3.Transaction().add(w3.SystemProgram.transfer({fromPubkey:provider.publicKey,toPubkey:recipient.publicKey,lamports:PROOF_LAMPORTS}));
    const latest=await connection.getLatestBlockhash('confirmed');
    tx.recentBlockhash=latest.blockhash;
    tx.feePayer=provider.publicKey;
    const totalStart=performance.now();
    const signed=await provider.signTransaction(tx);
    const sendStart=performance.now();
    const signature=await connection.sendRawTransaction(signed.serialize(),{skipPreflight:false,maxRetries:3,preflightCommitment:'confirmed'});
    await connection.confirmTransaction({signature,...latest},'confirmed');
    const confirmedAt=performance.now();
    const status=await connection.getSignatureStatus(signature,{searchTransactionHistory:true});
    const txInfo=await connection.getTransaction(signature,{commitment:'confirmed',maxSupportedTransactionVersion:0});
    const postBalance=await connection.getBalance(provider.publicKey,'confirmed');
    return {ok:true,isRealChain:true,network:'SOLANA DEVNET',amount,proofTransferSol:PROOF_LAMPORTS/w3.LAMPORTS_PER_SOL,executionSeconds:(confirmedAt-totalStart)/1000,networkSeconds:(confirmedAt-sendStart)/1000,signature,slot:txInfo?.slot || status?.context?.slot || null,confirmationStatus:status?.value?.confirmationStatus || 'confirmed',wallet:provider.publicKey.toString(),recipient:recipient.publicKey.toString(),walletBalanceSol:postBalance/w3.LAMPORTS_PER_SOL,explorer:`https://explorer.solana.com/tx/${signature}?cluster=devnet`,note:'The on-chain transfer is a Devnet execution proof. The 3.15M LQUSD scenario amount is synthetic notional and is not represented as a real-valued token.'};
  }
  global.SolanaAdapter={mode:'REAL_DEVNET_SOL_PROOF',connect,getState,fundDevnet,execute,proofLamports:PROOF_LAMPORTS};
})(window);
