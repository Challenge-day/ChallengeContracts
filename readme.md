# Smart Contract for Wake Up Reward Distribution

#### Files and usage
##### contracts/CHLAirdrop.sol
This is our Main Contract file which you need to deploy. You can customize contract as per your requirement.

##### src/winnerlist.csv
List of Addresses you want to pay CHL tokens to.

##### src/airdrop.js
This is a node script to interect with deployed reward distribution smart contract. it reads list of winner addresses and airdrops token in batch size you have specified. in ```init3``` function you need to specify deployed smart contract address.

##### .env
File which contains PK of your hd wallet

#### Commands to deploy and distribute rewards

##### Deploy smart contact
 - ```npm install```
 - Copiling smart contract ```npx harthat compile```
 - Deploying smart contract - ```yarn deploy --network polygontestnet``` 
 - Verify smart contract on polygonscan (API Keys are needed)- ```yarn verify --network polygontestnet 0x...```
 - Once smart contract is deployed and verified, you can interect it from polygonscan

##### Allowance
 - Set Allowance in your Token Contract, so Airdrop contract can transfer tokens.

##### CHL Token Distribution
 - Goto src directory
 - Update Contract Address in .env file.
 - Update BATCH_SIZE (how many accounts at a time you want to do airdrop) in .env
 - Run ```node airdrop.js```
 - Done Script will start airdroping tokens. Dont forget to set gas price you want and maintain balance into your wallet.


