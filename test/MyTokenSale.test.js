const Token = artifacts.require("MyToken");
const TokenSale = artifacts.require("MyTokenSale");
const MyKycContract = artifacts.require("KycContract"); //대기자 명단에 주소를 설정하기 위해
require("dotenv").config({path: "../.env"});

const chai = require("./setupchai.js");
const BN = web3.utils.BN;
const expect = chai.expect;

contract("TokenSale Test", async (accounts) => {
    //accounts[0] 보다 더 이쁜거

    const [deployerAccount, recipient, anotherAccount] = accounts;

    //마이그레이션 파일을 통해 배포되는 스마트 계약의 '배포된 인스턴스'만을 사용한 다음, 예상대로 작동하는지 확인

    //먼저 it 테스트
    it('should not have any tokens in my deployerAccount', async() => {
        let instance = await Token.deployed();
        return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(0));
            //deployerAccount가 모든 토큰을 to 토큰판매 주소로 (2_deploy_contracts.js 15로 이동)
    })

    it("all tokens should be in the TokenSale Smart Contract by default", async() => {
        let instance = await Token.deployed();
        let balanceOfTokenSaleSmartContract = await instance.balanceOf(TokenSale.address); //balanceOf(잔액 읽으려는 주소)
        //트러플 artifact 내부에 TokenSale 주소가 해당 객체의 차일드로 저장되어 간단하게 접근

        let totalSupply = await instance.totalSupply();
        return expect(balanceOfTokenSaleSmartContract).to.be.a.bignumber.equal(totalSupply);
    })

    it("should be possible to buy tokens", async () => {
        let tokenInstance = await Token.deployed();
        let tokenSaleInstance = await TokenSale.deployed();
        let balanceBefore = await tokenInstance.balanceOf(deployerAccount);
        let KycInstance = await MyKycContract.deployed(); //계약에 접근
        await KycInstance.setKycCompleted(deployerAccount, {from : deployerAccount}); //이 계정은 화이트리스트가 됨 kyc인증
                                                //디폴로이 어카운트는토큰 구매에 사용할 계정, 스마트 게약 배포에 사용하는 계정과 같은 계정.
                                                //가나슈 계정 리스트에서 첫번째 계정
                                                //트러플 config 파일에서 덮어 쓸 수 있는 첫번쨰 계정이기도 함 (지금은 안함)

        expect(tokenSaleInstance.sendTransaction({from: deployerAccount, value : web3.utils.toWei("1","wei")})).to.be.fulfilled; //토큰 1개당 1웨이
        balanceBefore = balanceBefore.add(new BN(1));
        //밑은 buytoken
        return expect(tokenInstance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceBefore);

    })

});