const { ethers } = require('ethers');
const {
  privateKey,
  calderaRPCUrl,
  calderaChainId,
} = require('../secrets.json');
var solc = require('solc');

var contract = `
  pragma solidity >=0.7.3;

  contract AudioContract {
    string public userId;
    string public songId;
    string public createdAt;

    constructor(string memory initUserId, string memory initSongId, string memory initCreatedAt) {

        userId = initUserId;
        songId = initSongId;
        createdAt = initCreatedAt;
    }

    function updateUserId(string memory newUserId) public {
        string memory oldUserId = userId;
        userId = newUserId;
    }

    function updateSongId(string memory newSongId) public {
        string memory oldSongId = songId;
        songId = newSongId;
    }

    function updateCreatedAt(string memory newCreatedAt) public {
        string memory oldCreatedAt = createdAt;
        createdAt = newCreatedAt;
    }
  }`;

var input = {
  language: 'Solidity',
  sources: { 'audio.sol': { content: contract } },
  settings: { outputSelection: { '*': { '*': ['*'] } } },
};

var output = JSON.parse(solc.compile(JSON.stringify(input)));
var contractName = 'AudioContract';
var bytecode = output.contracts['audio.sol'][contractName].evm.bytecode.object;
var abi = output.contracts['audio.sol'][contractName].abi;

// Connect to the blockchain with your RPC provider
// const providerRPC = {
//   caldera: {
//     name: 'Caldera',
//     rpc: calderaRPCUrl,
//     chainId: calderaChainId,
//   },
// };
const provider = new ethers.providers.JsonRpcProvider(calderaRPCUrl);

const wallet = new ethers.Wallet(privateKey, provider);

var contractABI = abi;
var contractBytecode = bytecode;

async function deployContract(userid, songid, createdAt) {
  // Create a Contract Factory
  const factory = new ethers.ContractFactory(
    contractABI,
    contractBytecode,
    wallet
  );
  const contract = await factory.deploy(userid, songid, createdAt); // Deploy the contract

  await contract.deployed();

  console.log('Your_Contract deployed to:', contract.address);
}

deployContract('userid', 'songid', 'createdAt');

async function setAndGet(contractAddress) {
  const contract = new ethers.Contract(contractAddress, contractABI, wallet);

  // Set a value
  const tx = await contract.set(42);
  await tx.wait(); // Wait for the transaction to be mined

  // Get the stored value
  const value = await contract.get();
  console.log(`Stored value is: ${value}`);
}

//setAndGet('0xb114516fB0E3aA01a44df82485f3729A119Ce9A9');
