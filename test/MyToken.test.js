const Token = artifacts.require("MyToken");

// var chai = require("chai"); //여길로 노드 모듈  폴더에 요청
// // require('../configure')();
// // const web3 = require('./config/web3').getWeb3();
// const BN = web3.utils.BN;
// const chaiBN = require("chai-bn")(BN);
// chai.use(chaiBN);
// var chaiAsPromised = require("chai-as-promised");
// chai.use(chaiAsPromised);
// const expect = chai.expect;

require("dotenv").config({path: "../.env"});
const chai = require("./setupchai.js");
const BN = web3.utils.BN;
const expect = chai.expect;

contract("Token Test", async (accounts) => {
    //accounts[0] 보다 더 이쁜거

    const [deployerAccount, recipient, anotherAccount] = accounts;

    beforeEach(async() => {
        this.myToken = await Token.new(process.env.INITIAL_TOKENS);

    })


    it("all tokens should be in my account", async () => {
        //let instance = await Token.deployed(); //여기가 마이그레이션 파일에서 배포된 버전을 가져오는건데, 위에 beforeEach에서 배포된걸 가져오게 할 것
        let instance = this.myToken;
        let totalSupply = await instance.totalSupply(); //
        //let balance = await instance.balanceof(accounts[0]); //스계을 배포하는 계정
        //assert.equal(balance.valueOf(),  initialSupply.valueOf(), "The balance was not the same" );
        //위 대신 아래를 선호함
        //일반적으로 밸랜스를 사용하면 항상 await 키워드가 있음.
        return expect(await instance.balanceOf(deployerAccount)).to.be.a.bignumber.equal(totalSupply);
    })
    //it 두번째 매개변수로는 async 콜백함수

    it("is possible to send tokens between accounts", async() =>{
        const sendTokens = 1;
        //let instance = await Token.deployed();
        let instance = this.myToken;
        let totalSupply = await instance.totalSupply();
        expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
        expect(instance.transfer(recipient, sendTokens)).to.eventually.be.fulfilled; //토큰 1개 전송이 이루어지길. 
        expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendTokens))); 
                                                        //sendTokens를 여기에 못넣음, 빅넘버에서 빅넘버 빼는거니깐(totalsupply도 빅넘버)
        return expect(instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(sendTokens)+1); //전송되는 토큰의 양이 새로은 빅넘버와 같음

    })

    it("is not possible to send more tokens than available in total", async () => {
        //let instance = await Token.deployed();
        let instance = this.myToken;
        let balanceOfDeployer = await instance.balanceOf(deployerAccount); //초기 인스턴스

        expect(instance.transfer(recipient, new BN(balanceOfDeployer)).to.eventually.be.a.rejected); //거부당할 것을 기대하고 +1
        
        return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceOfDeployer);
        //밸런스가 같거나 or DeployerAccount의 밸런스가 결과적으로 빅넘버가 되어, balanceOfDeployer
    })

}); 

//깃허브 openzeppelin 에  test에 token 에 20에 여러 테스트들중 하나
//https://github.com/OpenZeppelin/openzeppelin-contracts/tree/release-v3.0.0/contracts/token/ERC20





