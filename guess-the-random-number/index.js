const ethers = require("ethers");

const rpcEndpoint = process.env.RPC_ENDPOINT;
const network = process.env.NETWORK;
const provider = new ethers.providers.JsonRpcProvider(rpcEndpoint, network);

const start = async () => {
  const args = process.argv;

  if (args.length < 3) {
    console.error("Usage: node index.js <target address>");
    process.exit(1);
  }

  const target = args[2];
  const storage = args[3] || 0;

  const stored = await provider.getStorageAt(target, storage);
  console.log(stored);
}

start().catch(console.error);
