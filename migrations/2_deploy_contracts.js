var MyToken = artifacts.require("MyToken");
var MyTokenSale  = artifacts.require("MyTokenSale");
require("dotenv").config({path: "../.env"}); //config 객체가 한단계 위의 상위 폴더로 경로를 지정
// dotenv 패키지를 가져오고
console.log(process.env);
//, 환경변수를 process.env(환경 프로세스)

module.exports = async function(deployer) {
  let addr = await web3.eth.getAccounts();
  await deployer.deploy(MyToken,1000000); //deployer.deploy가 MyToken.address에 주소를 씀

  await deployer.deploy(MyTokenSale, 1, addr[0], MyToken.address) //끝나길 기
  let instance = await MyToken.deployed(); //토큰의 인스턴스를 가져오게 됨
  instance.transfer(MyTokenSale.address, 1000000);

};


