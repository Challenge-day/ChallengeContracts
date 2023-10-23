require('dotenv').config()
const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');

const MyContract = require('../artifacts/contracts/CHLAirdrop.sol/CHLAirdrop.json');

const fs = require('fs');
const csv = require('@fast-csv/parse');
//const mnemonicPhrase = process.env.SEED_PHRASE.toString().trim();

let BATCH_SIZE = process.env.BATCH_SIZE;
let distribAddressData = new Array();
let distribAmountData = new Array();
let allocAddressData = new Array();
let allocAmountData = new Array();

async function readFile() {
  var stream = fs.createReadStream(__dirname +'/winnerlist.csv');
  let index = 0;
  let batch = 0;

  let web3 = new Web3();

  csv.parseStream(stream)
    .on('error', error => {
      
    })
    .on('data', row => {
      let isAddress = web3.utils.isAddress(row[0]);
      if (isAddress && row[0] != null && row[0] != '') {

        allocAddressData.push(row[0]);
        allocAmountData.push(web3.utils.toWei( row[1]));

        index++;
        if (index >= BATCH_SIZE) {
          distribAddressData.push(allocAddressData);
          distribAmountData.push(allocAmountData);
          allocAmountData = [];
          allocAddressData = [];
          index = 0;
        }
      }  
    })
    .on('end', rowCount => {
      //Add last remainder batch
      distribAddressData.push(allocAddressData);
      distribAmountData.push(allocAmountData);
      allocAmountData = [];
      allocAddressData = [];
      const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
      //withdrawTokens();
      rewardDistribute();
    });

}

let myContract;

const init3 = async () => {
  /*
  const [deployer] = await ethers.getSigners();
  console.log("Owner address :", deployer.address);
  myContract = await ethers.getContractFactory("Airdrop");
*/
  let provider = new HDWalletProvider(
    "Private Key", //pk of owner wallet
    "https://rpc-mumbai.maticvigil.com");

  /*
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  web3.eth.defaultAccount = web3.eth.accounts[0];
*/
  
  web3 = new Web3(provider);
  //const networkId = await web3.eth.net.getId();
  myContract = new web3.eth.Contract(
    MyContract.abi,
    process.env.AIRDROP_CONTRACT
  );

}

const withdrawTokens = async () => {
  let gPrice = process.env.GAS_PRICE;
  let gas = process.env.GAS;
  await init3();
  let accounts = await web3.eth.getAccounts();
  console.log(accounts[0]);
  try{
    await myContract.methods.withdrawTokens(process.env.AIRDROP_CONTRACT).send({ from: accounts[0], gas: gas, gasPrice: gPrice });
  }catch (err) {
    console.log(err);
  }
  
}

const rewardDistribute = async () => {

  await init3();
  let accounts = await web3.eth.getAccounts();
  console.log('From ...', await myContract.methods.owner().call());
  for (var i = 0; i < distribAddressData.length; i++) {
    let gPrice = process.env.GAS_PRICE;
    let gas = process.env.GAS;
    try {
      console.log('== Wake Up Challange ==')
      console.log('Reward Distribution started')
      let r = await myContract.methods.dropTokens(distribAddressData[i], distribAmountData[i]).send({ from: accounts[0], gas: gas, gasPrice: gPrice });
      console.log('------------------------')
      console.log("Allocation + transfer was successful.", r.gasUsed, "gas used. Spent:", r.gasUsed * gPrice, "wei");
      
    } catch (err) {
      console.log(err);
    }
  }
  console.log('Reward Distribution finished.')
  return;
}

readFile();
