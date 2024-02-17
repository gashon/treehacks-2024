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
    string public createdAt;

    constructor(string memory initUserId, string memory initCreatedAt) {
        userId = initUserId;
        createdAt = initCreatedAt;
    }

    function updateUserId(string memory newUserId) public {
        string memory oldUserId = userId;
        userId = newUserId;
    }

    function updateCreatedAt(string memory newCreatedAt) public {
        string memory oldCreatedAt = createdAt;
        createdAt = newCreatedAt;
    }

    function get() public view returns (string memory, string memory) {
      return (userId, createdAt);
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

const provider = new ethers.providers.JsonRpcProvider(calderaRPCUrl);

const wallet = new ethers.Wallet(privateKey, provider);

var contractABI = abi;
var contractBytecode = bytecode;

// Pass in the userid, and createdAt
// Returns the contract address that was deployed on our chain
async function deployContract(userid, createdAt) {
  const factory = new ethers.ContractFactory(
    contractABI,
    contractBytecode,
    wallet
  );
  const contract = await factory.deploy(userid, createdAt);

  await contract.deployed();

  // TODO REMOVE
  console.log('Your_Contract deployed to:', contract.address);

  return contract.address;
}

// TODO REMOVE
deployContract('FAKE USER', 'CREATED NOW');
