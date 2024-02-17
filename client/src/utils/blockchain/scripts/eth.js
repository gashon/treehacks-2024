const { ethers } = require('ethers');

// Connect to the blockchain with your RPC provider
const provider = new ethers.providers.JsonRpcProvider('your-rpc-url');

// Wallet/Private key of the deployer
const deployerPrivateKey = 'your-private-key';
const wallet = new ethers.Wallet(deployerPrivateKey, provider);

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
