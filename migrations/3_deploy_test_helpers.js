const TestERC20Token = artifacts.require("./TestERC20Token.sol");

module.exports = function (deployer, network) {
    deployer.deploy(TestERC20Token)
        .then(() => console.log("[MIGRATION] [3] Deploy Test contracts: #done"))
};
