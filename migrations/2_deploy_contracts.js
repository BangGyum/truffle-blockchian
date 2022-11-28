var MyToken = artifacts.require("MyToken.sol");
var MyTokenSale  = artifacts.require("MyTokenSale");

module.exports = async function(deployer) {
  await deployer.deploy(MyToken,1000000);
  await deployer.deploy()
};

