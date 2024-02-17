require('@nomiclabs/hardhat-ethers');
const { privateKey, calderaRPCUrl, calderaChainId } = require('./secrets.json');

module.exports = {
  solidity: '0.8.24',
  defaultNetwork: 'rinkeby',
  networks: {
    rinkeby: {
      url: 'https://eth-rinkeby.alchemyapi.io/v2/123abc123abc123abc123abc123abcde',
      accounts: [privateKey],
    },
    caldera: {
      url: calderaRPCUrl,
      accounts: [privateKey],
    },
  },
};
