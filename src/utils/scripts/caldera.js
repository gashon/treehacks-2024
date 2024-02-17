// 1. Import ethers
const ethers = require('ethers');

// 2. Define network configurations
const providerRPC = {
  caldera: {
    name: 'Caldera',
    rpc: 'https://ameya-test.rpc.caldera.xyz/http', // Insert your RPC URL here
    chainId: 7541973, //Insert your ChainID Here
  },
};
// 3. Create ethers provider
const provider = new ethers.providers.StaticJsonRpcProvider(
  providerRPC.constellation.rpc,
  {
    chainId: providerRPC.constellation.chainId,
    name: providerRPC.constellation.name,
  }
);
