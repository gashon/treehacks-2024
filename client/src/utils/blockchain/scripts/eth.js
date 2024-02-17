const { ethers } = require('ethers');
const { privateKey, calderaRPCUrl, calderaChainId } = require('./secrets.json');

// Connect to the blockchain with your RPC provider
const providerRPC = {
  caldera: {
    name: 'Caldera',
    rpc: calderaRPCUrl, // Insert your RPC URL here
    chainId: calderaChainId, //Insert your ChainID Here
  },
};
const provider = new ethers.providers.StaticJsonRpcProvider(
  providerRPC.constellation.rpc,
  {
    chainId: providerRPC.constellation.chainId,
    name: providerRPC.constellation.name,
  }
);

// Wallet/Private key of the deployer
const wallet = new ethers.Wallet(privateKey, provider);

// Compiled contract ABI and Bytecode
const contractABI = 'your-contract-abi';
const contractBytecode = 'your-contract-bytecode';

async function deployContract() {
  // Create a Contract Factory
  const factory = new ethers.ContractFactory(
    contractABI,
    contractBytecode,
    wallet
  );
  const contract = await factory.deploy(); // Deploy the contract

  console.log(`Contract deployed to address: ${contract.address}`);
}

deployContract();

//

async function setAndGet(contractAddress) {
  const contract = new ethers.Contract(contractAddress, contractABI, wallet);

  // Set a value
  const tx = await contract.set(42);
  await tx.wait(); // Wait for the transaction to be mined

  // Get the stored value
  const value = await contract.get();
  console.log(`Stored value is: ${value}`);
}

setAndGet('your-contract-address');
