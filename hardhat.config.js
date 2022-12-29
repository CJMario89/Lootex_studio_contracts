require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const { task } = require("hardhat/config");

task("account", "returns nonce and balance for specified address on multiple networks")
  .addParam("address")
  .setAction(async address => {
    console.log(process.env.API_URL_GOERLI)
    console.log(process.env.API_URL_BSCT)
    console.log(process.env.API_URL_MUMBAI)
    console.log(process.env.API_URL_FTMT)
    console.log(process.env.API_URL_AVALANCHET)
    // console.log(process.env.API_URL_ARBITRUMGOERLI)
    const web3Goerli = createAlchemyWeb3(process.env.API_URL_GOERLI);
    const web3BSCT = createAlchemyWeb3(process.env.API_URL_BSCT);
    const web3FTMT = createAlchemyWeb3(process.env.API_URL_FTMT);
    const web3Mumbai = createAlchemyWeb3(process.env.API_URL_MUMBAI);
    const web3AvalancheT = createAlchemyWeb3(process.env.API_URL_AVALANCHET);
    const web3ArbitrumGoerli = createAlchemyWeb3(process.env.API_URL_ARBITRUMGOERLI);

    const networkIDArr = ["Ethereum Goerli:", "BSC Testnet", "Fantom Testnet:", "Polygon  Mumbai:", "Avalanche Testnet:"]
    const providerArr = [web3Goerli, web3BSCT, web3FTMT, web3Mumbai, web3AvalancheT];
    const resultArr = [];
    
    for (let i = 0; i < providerArr.length; i++) {
      const nonce = await providerArr[i].eth.getTransactionCount(address.address);
      const balance = await providerArr[i].eth.getBalance(address.address)
      resultArr.push([networkIDArr[i], nonce, parseFloat(providerArr[i].utils.fromWei(balance, "ether")).toFixed(2) + "ETH"]);
    }
    resultArr.unshift(["  |NETWORK|   |NONCE|   |BALANCE|  "])
    console.log(resultArr);
  });


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.11",
    settings: {
      optimizer: {
        enabled: true,
        runs: 300,
      },
    },
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true
    },
    // eth: {
    //   url: process.env.MAINNET_URL || '',
    //   accounts:
    //     process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    // },
    goerli: {
      url: process.env.API_URL_GOERLI || '',
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    bscTestnet: {
      url: process.env.API_URL_BSCT || '',
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    ftmTestnet: {
      url: process.env.API_URL_FTMT || '',
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    polygonMumbai: {
      url: process.env.API_URL_MUMBAI || '',
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    avalancheFujiTestnet: {
      url: process.env.API_URL_AVALANCHET || '',
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    // arbitrumGoerli: {
    //   url: process.env.API_URL_ARBITRUMGOERLI || '',
    //   accounts:
    //     process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    // }
    
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_API_KEY,
      polygonMumbai: process.env.POLYGONSCAN_API_KEY,
      bscTestnet: process.env.BSCSCAN_API_KEY,
      ftmTestnet: process.env.FANTOM_API_KEY,
      avalancheFujiTestnet: process.env.AVALANCHE_API_KEY,
      // arbitrumGoerli: process.env.ARBITRUMGOERLI_API_KEY
    }
  },
};

