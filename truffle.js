const wallet = require('fs').readFileSync("./wallet.json", "utf8").trim();
const HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
    networks: {
        test: {
            network_id: 424242,
            host: 'localhost',
            port: 8545,
            gas: 4700000
        },
        main: {
            network_id: 1,
            provider: new HDWalletProvider(wallet, 'QWEpoi123', 'https://rinkeby.infura.io/'),
            gas: 4700000
        }
    },

    migrations_directory: './migrations'
};