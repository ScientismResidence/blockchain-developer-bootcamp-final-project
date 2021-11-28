const dotenv = require("dotenv");
dotenv.config();

const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  contracts_build_directory: "./client/src/contracts",
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    rinkeby: {
      provider: () =>
        new HDWalletProvider(
          process.env.MNEMONIC,
          `https://rinkeby.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
        ),
      network_id: 4,
      gas: 5500000, 
      confirmations: 0,
      timeoutBlocks: 200,
      skipDryRun: true,
      from: "0x69bcD2652D734F3D611029EaE15bdD3a60989e48",
    },
  },
  mocha: {
  },
  compilers: {
    solc: {
      version: "0.8.10"
    }
  },
};
