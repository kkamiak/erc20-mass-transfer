/**
 * Created by haria on 09.11.17.
 */
var SafeMath = artifacts.require("./SafeMath.sol");

module.exports = function(deployer,network) {
    deployer.deploy(SafeMath)
        .then(() => console.log("[MIGRATION] [3] SafeMath: #done"))
};
