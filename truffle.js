var HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  networks: {
    test: {
      network_id: 424242,
      host: 'localhost',
      port: 8545,
      gas: 4700000
    }
  },
  migrations_directory: './migrations'
}
