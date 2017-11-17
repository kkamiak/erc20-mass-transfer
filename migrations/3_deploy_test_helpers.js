var TestERC20Token = artifacts.require("./TestERC20Token.sol");
//var KrakenPriceTicker = artifacts.require("./KrakenPriceTicker.sol");

module.exports = function(deployer,network) {
  if(network === 'development' || network === 'test') {
         deployer.deploy(TestERC20Token)
        .then(() => console.log("[MIGRATION] [3] Deploy Test contracts: #done"))
    }
}
