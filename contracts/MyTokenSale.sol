// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <8.10.0;
import "./Crowdsale.sol";

    /*
    Token sales 개념은 토큰 판매 스마트 계약이 토큰을 소유한다는 것.( MyTokenSale.sol )
Token 판매 스.계로 돈을 보내면, 돈을 보내는 사람의 지갑으로 토큰을 전송
*/
    constructor(
        uint256 rate,    // rate in TKNbits
        address payable wallet,
        IERC20 token
    )
        Crowdsale(rate, wallet, token)
        public
    {

    }
}