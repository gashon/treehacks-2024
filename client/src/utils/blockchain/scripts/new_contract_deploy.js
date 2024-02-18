<<<<<<< HEAD
import { ethers } from 'ethers';
import { privateKey, calderaRPCUrl, calderaChainId } from '../secrets.json';
// import solc from 'solc';
=======
import { ethers } from "ethers";
import { privateKey, calderaRPCUrl, calderaChainId } from "../secrets.json";
import solc from "solc";
>>>>>>> 09a7551 (feat: invalidate queries)

import AudioContractABI from "../contracts/AudioContractABI.json";
import { bytecode as AudioContractBytecode } from "../contracts/AudioContractBytecode.json";

// var contract = `
//   pragma solidity >=0.7.3;

//   contract AudioContract {
//     string public userId;
//     string public createdAt;

//     constructor(string memory initUserId, string memory initCreatedAt) {
//         userId = initUserId;
//         createdAt = initCreatedAt;
//     }

//     function updateUserId(string memory newUserId) public {
//         userId = newUserId;
//     }

//     function updateCreatedAt(string memory newCreatedAt) public {
//         createdAt = newCreatedAt;
//     }

//     function get() public view returns (string memory, string memory) {
//       return (userId, createdAt);
//     }
//   }`;

// var input = {
//   language: 'Solidity',
//   sources: { 'AudioContract.sol': { content: contract } },
//   settings: { outputSelection: { '*': { '*': ['*'] } } },
// };

// var output = JSON.parse(solc.compile(JSON.stringify(input)));
// var contractName = 'AudioContract';
// var bytecode =
//   output.contracts['AudioContract.sol'][contractName].evm.bytecode.object;
// var abi = output.contracts['AudioContract.sol'][contractName].abi;

const provider = new ethers.providers.JsonRpcProvider(calderaRPCUrl);

const wallet = new ethers.Wallet(privateKey, provider);

// var contractABI = abi;
// var contractBytecode = bytecode;

var contractABI = AudioContractABI;
var contractBytecode = AudioContractBytecode;

// Pass in the userid, and createdAt
// Returns the contract address that was deployed on our chain
export async function deployContract(userid, createdAt) {
  const factory = new ethers.ContractFactory(
    contractABI,
    contractBytecode,
    wallet,
  );

  const overrides = {
<<<<<<< HEAD
    gasLimit: 1000000,
=======
    gasLimit: 2_500_000, // Example gas limit; adjust this value based on your needs
>>>>>>> 09a7551 (feat: invalidate queries)
  };

  const contract = await factory.deploy(userid, createdAt, overrides);

  await contract.deployed();

<<<<<<< HEAD
  // // TODO REMOVE
  // console.log('Your_Contract deployed to:', contract.address);

  return contract.address;
}
=======
  // TODO REMOVE
  console.log("Your_Contract deployed to:", contract.address);

  return contract.address;
}

// TODO REMOVE
deployContract("FAKE USER", "CREATED NOW");
>>>>>>> 09a7551 (feat: invalidate queries)
