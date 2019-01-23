const ethers = require("ethers");
require("dotenv").config();

const rpcEndpoint = process.env.RPC_ENDPOINT; // https://ropsten.infura.io/v3/asdasdasd
const network = process.env.NETWORK; // ropsten

// Create a provider to send transactions
const provider = new ethers.providers.JsonRpcProvider(rpcEndpoint, network);

const start = async () => {
  const txHash = "0xabc467bedd1d17462fcc7942d0af7874d6f8bdefee2b299c9168a216d3ff0edb";

  const tx = await provider.getTransaction(txHash);

  const r = tx.r.slice(2);
  const s = tx.s.slice(2);
  const v = (tx.v - tx.networkId*2 - 8).toString(16);

  const signature = `0x${r}${s}${v}`;

  console.log("Signature:", signature);

  const txParams = {
    nonce: tx.nonce,
    gasPrice: tx.gasPrice,
    gasLimit: tx.gasLimit,
    to: tx.to,
    value: tx.value,
    data: tx.data,
    chainId: tx.networkId,
  };

  console.log(txParams);
  const serializedTx = ethers.utils.serializeTransaction(txParams);
  console.log(serializedTx);
  const txDigest = ethers.utils.keccak256(serializedTx);
  console.log(txDigest);
  const address = ethers.utils.recoverAddress(txDigest, signature);
  const pubKey = ethers.utils.recoverPublicKey(txDigest, signature);
  
  console.log("Address:", address);
  console.log("Publick key:", pubKey);
};

start().catch(console.error);
