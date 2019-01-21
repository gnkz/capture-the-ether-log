const ethers = require("ethers");
require("dotenv").config();

const rpcEndpoint = process.env.RPC_ENDPOINT; // https://ropsten.infura.io/v3/asdasdasd
const network = process.env.NETWORK; // ropsten
const mnemonic = process.env.MNEMONIC; // 12 word mnemonic to retrieve your metamask wallet

// Create a wallet from the mnemonic
const wallet = ethers.Wallet.fromMnemonic(mnemonic);
// Create a provider to send transactions
const provider = new ethers.providers.JsonRpcProvider(rpcEndpoint, network);

const start = async () => {
  const args = process.argv;

  if (args.length < 4) {
    console.error("Usage: node index.js <solver address> <challenge address>");
    process.exit(1);
  }

  const solver = args[2];
  const challenge = args[3];

  // Get the gas price
  const gasPrice = await provider.getGasPrice();

  // Create the transaction to call the guess function
  let tx = {
    chainId: 3,
    to: solver,
    gasPrice: gasPrice,
    gasLimit: "0x0f4240",
    data: ethers.utils.id("guess()"),
  };

  // Create a call transaction to get the answer that
  // the solver locked in
  const answerTx = {
    to: solver,
    from: wallet.address,
    data: ethers.utils.id("answer()"),
  };

  // Create a call to check if the challenge was solved
  const solvedTx = {
    to: challenge,
    from: wallet.address,
    data: ethers.utils.id("isComplete()"),
  };

  // Get the answer that the solver locked in
  const answer = await provider.call(answerTx);

  console.log(answer);
  
  // The challenge is not solved yet
  let solved = false;

  while(!solved) {
    // Create a call to get the current correct answer
    const predictTx = {
      to: solver,
      from: wallet.address,
      data: ethers.utils.id("predict()"),
    };

    // Get the correct answer
    const predicted = await provider.call(predictTx);
    console.log(predicted);

    // If the correct answer is the same as the one
    // that was locked in
    if (answer == predicted) {
      // Get the account nonce
      const nonce = await provider.getTransactionCount(wallet.address);
      tx.nonce = nonce;

      // Sign the guess transaction
      const signedTx = await wallet.sign(tx);

      // Get the transaction hash
      const { hash } = await provider.sendTransaction(signedTx);
      console.log(hash);

      // Get the transaction receipt
      const receipt = await provider.waitForTransaction(hash);
      console.log(receipt);

      // Check if the challenge was solved
      const solvedBytes = await provider.call(solvedTx);
      const solvedBN = ethers.utils.bigNumberify(solvedBytes);
      solved = solvedBN.isZero() ? false : true;
      console.log(solved);
    } else {
      await new Promise((res) => {
        setTimeout(() => res(), 3000);
      });
    }
  }
}

start().catch(console.error);
