// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <8.10.0;
import "@openzeppelin/contracts/ownership/Ownable.sol";

contract KycContract is Ownable{
    mapping(address => bool) allowed;

    function setKycCompleted(address _addr) public onlyOwner { //이 함수가 불리면, 해당 주소로 토큰 구매가 가능
        allowed[_addr] = true;
    }
    
    function setKycRevoked(address _addr) public onlyOwner { 
        allowed[_addr] = false;
    }

    function kycCompleted(address _addr) public view returns(bool){
        return allowed[_addr];
    }
    // 끝낸 사람이 잇는지 확인
}