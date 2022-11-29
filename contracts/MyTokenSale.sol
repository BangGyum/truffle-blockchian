// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <8.10.0;
import "./Crowdsale.sol";
import "./KycContract.sol";

    /*
    Token sales 개념은 토큰 판매 스마트 계약이 토큰을 소유한다는 것.( MyTokenSale.sol )
Token 판매 스.계로 돈을 보내면, 돈을 보내는 사람의 지갑으로 토큰을 전송
*/

contract MyTokenSale is Crowdsale {

    KycContract kyc;

    constructor(
        uint256 rate,    // rate in TKNbits
        address payable wallet,
        IERC20 token,
        KycContract _kyc
    )
        Crowdsale(rate, wallet, token)
        public
    {
        kyc = _kyc;

    }
    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal view override {
        super._preValidatePurchase(beneficiary, weiAmount);
        require(kyc.kycCompleted(msg.sender),"KYC Not completed, purchase not allowed");
    }
        //다음으로 실제, 마이그레이션 파일에 추가, 테스트를 업데이트 = deploy contract에
}