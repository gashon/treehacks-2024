import { ethers } from 'ethers';
import { calderaRPCUrl } from '../secrets.json';

import AudioContractABI from '../contracts/AudioContractABI.json';

const provider = new ethers.providers.JsonRpcProvider(calderaRPCUrl);

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
//         string memory oldUserId = userId;
//         userId = newUserId;
//     }

//     function updateCreatedAt(string memory newCreatedAt) public {
//         string memory oldCreatedAt = createdAt;
//         createdAt = newCreatedAt;
//     }

//     function get() public view returns (string memory, string memory) {
//       return (userId, createdAt);
//     }
//   }`;

// var input = {
//   language: 'Solidity',
//   sources: { 'audio.sol': { content: contract } },
//   settings: { outputSelection: { '*': { '*': ['*'] } } },
// };

// var output = JSON.parse(solc.compile(JSON.stringify(input)));
// var contractName = 'AudioContract';
// var bytecode = output.contracts['audio.sol'][contractName].evm.bytecode.object;
// var abi = output.contracts['audio.sol'][contractName].abi;

async function getContractData(contractAddress) {
  const contract = new ethers.Contract(
    contractAddress,
    AudioContractABI,
    provider
  );

  const data = await contract.get();

  return { userId: data[0], createdAt: data[1] };
}

// // TODO REMOVE
// getContractData('0x4AA53095a8c2D15e90516639fa62f96AAA1fA3Bf').catch(
//   console.error
// );
