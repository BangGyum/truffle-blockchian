var MyToken = artifacts.require("MyToken");
var MyTokenSale  = artifacts.require("MyTokenSale");
var MyKycContract = artifacts.require("KycContract");

require("dotenv").config({path: "../.env"}); //config 객체가 한단계 위의 상위 폴더로 경로를 지정
// dotenv 패키지를 가져오고
console.log(process.env);
//, 환경변수를 process.env(환경 프로세스)

module.exports = async function(deployer) {
  let addr = await web3.eth.getAccounts();
  await deployer.deploy(MyToken, process.env.INITIAL_TOKENS); //deployer.deploy가 MyToken.address에 주소를 씀

  await deployer.deploy(MyKycContract); //여기에는 생성자가 없으니 밑에 sale에

  await deployer.deploy(MyTokenSale, 1, addr[0], MyToken.address, MyKycContract.address) //끝나길 기
  let instance = await MyToken.deployed(); //토큰의 인스턴스를 가져오게 됨
  await instance.transfer(MyTokenSale.address, process.env.INITIAL_TOKENS);
    //d토큰판매 주소로 전송하여, 토큰이 남아있지 않음을 확인해 (그게 오기 전 거기에 BN(0))

};


