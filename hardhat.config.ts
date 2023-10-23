import fs from 'fs';
import * as dotenv from 'dotenv';
import { HardhatUserConfig, task } from 'hardhat/config';

import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'solidity-coverage';

dotenv.config();

const DEFAULT_GAS_MULTIPLIER: number = 1;

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.9',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    ethmainnet: {
      url: "https://eth-mainnet.public.blastapi.io",
      accounts: [process.env.NETWORK_MAINNET_PRIVATE_KEY],
      chainId: 1,
      live: true,
      saveDeployments: true,
      gasMultiplier: 2,
    },
    bsctestnet: {
      url: "https://bsc-testnet.public.blastapi.io",
      accounts: [process.env.NETWORK_TESTNET_PRIVATE_KEY],
      chainId: 97,
      live: true,
      saveDeployments: true,
      gasMultiplier: 2,
    },
    bscmainnet:{
      url: "https://bsc-dataseed.binance.org",
      accounts: [process.env.NETWORK_TESTNET_PRIVATE_KEY],
      chainId: 56,
      live: true,
      saveDeployments: true,
      gasMultiplier: 2,
    },
    goerli: {
      url: "https://ethereum-goerli.publicnode.com",
      accounts: [process.env.NETWORK_TESTNET_PRIVATE_KEY],
      chainId: 5,
      live: true,
      saveDeployments: true,
      gasMultiplier: 2,
    },
    polygonmainnet: {
      url: "https://polygon-bor.publicnode.com",
      accounts: [process.env.NETWORK_MAINNET_PRIVATE_KEY],
      chainId: 137,
      live: true,
      saveDeployments: true,
      gasMultiplier: 2,
    },
    polygontestnet: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [process.env.NETWORK_TESTNET_PRIVATE_KEY],
      chainId: 80001,
      live: true,
      saveDeployments: true,
      gasMultiplier: 2,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD',
    coinmarketcap: process.env.GAS_REPORTER_COIN_MARKET_CAP_API_KEY,
  },
  etherscan: {
    apiKey: {

      polygon: process.env.BLOCK_EXPLORER_API_KEY,
      polygonMumbai: process.env.BLOCK_EXPLORER_API_KEY,
    },
  },
};

// Setup "testnet" network
if (process.env.NETWORK_TESTNET_URL !== undefined) {
  config.networks!.testnet = {
    url: process.env.NETWORK_TESTNET_URL,
    accounts: [process.env.NETWORK_TESTNET_PRIVATE_KEY!],
    gasMultiplier: DEFAULT_GAS_MULTIPLIER,
  };
}

// Setup "mainnet" network
if (process.env.NETWORK_MAINNET_URL !== undefined) {
  config.networks!.mainnet = {
    url: process.env.NETWORK_MAINNET_URL,
    accounts: [process.env.NETWORK_MAINNET_PRIVATE_KEY!],
    gasMultiplier: DEFAULT_GAS_MULTIPLIER,
  };
}

export default config;

/**
 * Replaces all occurrences of a string in the given file. 
 */
function replaceInFile(file: string, search: string, replace: string): void
{
  const fileContent = fs.readFileSync(file, 'utf8').replace(new RegExp(search, 'g'), replace);

  fs.writeFileSync(file, fileContent, 'utf8');
}
