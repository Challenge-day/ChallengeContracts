// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./chlToken.sol";


contract CHLAirdrop is Ownable {
    using SafeMath for uint;

    address public tokenAddr;
    address deployer;

    event EtherTransfer(address beneficiary, uint amount);

    constructor(address _tokenAddr) public {
        tokenAddr = _tokenAddr; 
        deployer = msg.sender;
    }
    modifier onlyowner() {
        require(owner() == msg.sender || deployer == msg.sender, "Caller is not the owner");
        _;
    }

    function dropTokens(address[] memory _recipients, uint256[] memory _amount) public onlyowner returns (bool) {
       
        for (uint i = 0; i < _recipients.length; i++) {
            require(_recipients[i] != address(0));
            require(CHLToken(tokenAddr).transfer(_recipients[i], _amount[i]));
        }

        return true;
    }

    function dropEther(address[] memory _recipients, uint256[] memory _amount) public payable onlyowner returns (bool) {
        uint total = 0;

        for(uint j = 0; j < _amount.length; j++) {
            total = total.add(_amount[j]);
        }

        require(total <= msg.value);
        require(_recipients.length == _amount.length);


        for (uint i = 0; i < _recipients.length; i++) {
            require(_recipients[i] != address(0));

            payable(_recipients[i]).transfer(_amount[i]);

            emit EtherTransfer(_recipients[i], _amount[i]);
        }

        return true;
    }

    function updateTokenAddress(address newTokenAddr) public onlyowner {
        tokenAddr = newTokenAddr;
    }

    function withdrawTokens(address beneficiary) public onlyowner {
        require(CHLToken(tokenAddr).transfer(beneficiary, CHLToken(tokenAddr).balanceOf(address(this))));
    }

    function withdrawEther(address payable beneficiary) public onlyowner {
        beneficiary.transfer(address(this).balance);
    }
}