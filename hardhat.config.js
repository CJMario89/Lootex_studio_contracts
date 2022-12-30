require('@nomicfoundation/hardhat-toolbox')
require('@nomiclabs/hardhat-ethers')
require('dotenv').config()
const { createAlchemyWeb3 } = require('@alch/alchemy-web3')
const { task } = require('hardhat/config')

task(
  'account',
  'returns nonce and balance for specified address on multiple networks',
)
  .addParam('address')
  .setAction(async (address) => {
    console.log(process.env.API_URL_ETHEREUM)
    console.log(process.env.API_URL_BSC)
    console.log(process.env.API_URL_POLYGON)
    console.log(process.env.API_URL_FTM)
    console.log(process.env.API_URL_AVALANCHE)
    console.log(process.env.API_URL_GOERLI)
    console.log(process.env.API_URL_BSCTESTNET)
    console.log(process.env.API_URL_POLYGONMUMBAI)
    console.log(process.env.API_URL_FTMTESTNET)
    console.log(process.env.API_URL_AVALANCHEFUJITESTNET)
    const web3Ethereum = createAlchemyWeb3(process.env.API_URL_ETHEREUM)
    const web3BSC = createAlchemyWeb3(process.env.API_URL_BSC)
    const web3Polygon = createAlchemyWeb3(process.env.API_URL_POLYGON)
    const web3FTM = createAlchemyWeb3(process.env.API_URL_FTM)
    const web3Avalanche = createAlchemyWeb3(process.env.API_URL_AVALANCHE)
    const web3Goerli = createAlchemyWeb3(process.env.API_URL_GOERLI)
    const web3BSCTestnet = createAlchemyWeb3(process.env.API_URL_BSCTESTNET)
    const web3PolygonMumbai = createAlchemyWeb3(process.env.API_URL_POLYGONMUMBAI)
    const web3FTMTestnet = createAlchemyWeb3(process.env.API_URL_FTMTESTNET)
    const web3AvalancheFujiTestnet = createAlchemyWeb3(process.env.API_URL_AVALANCHEFUJITESTNET)


    const networkIDArr = [
      'Ethereum:',
      'BSC:',
      'Fantom:',
      'Polygon:',
      'Avalanche:',
      'Ethereum Goerli:',
      'BSC Testnet',
      'Fantom Testnet:',
      'Polygon Mumbai:',
      'Avalanche Testnet:',
    ]
    const providerArr = [
      web3Ethereum,
      web3BSC,
      web3Polygon,
      web3FTM,
      web3Avalanche,
      web3Goerli,
      web3BSCTestnet,
      web3PolygonMumbai,
      web3FTMTestnet,
      web3AvalancheFujiTestnet,
    ]
    const resultArr = []

    for (let i = 0; i < providerArr.length; i++) {
      const nonce = await providerArr[i].eth.getTransactionCount(
        address.address,
      )
      const balance = await providerArr[i].eth.getBalance(address.address)
      resultArr.push([
        networkIDArr[i],
        nonce,
        parseFloat(providerArr[i].utils.fromWei(balance, 'ether')).toFixed(3) +
          'ETH',
      ])
    }
    resultArr.unshift(['  |NETWORK|   |NONCE|   |BALANCE|  '])
    console.log(resultArr)
  })

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.11',
    settings: {
      optimizer: {
        enabled: true,
        runs: 300,
      },
    },
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },
    Ethereum: {
      url: process.env.API_URL_ETHEREUM || '',
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    BSC: {
      url: process.env.API_URL_BSC || '',
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    Polgon: {
      url: process.env.API_URL_POLYGON || '',
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    FTM: {
      url: process.env.API_URL_FTM || '',
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    Avalanche: {
      url: process.env.API_URL_AVALANCHE || '',
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
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
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD',
  },
  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_API_KEY,
      polygonMumbai: process.env.POLYGONSCAN_API_KEY,
      bscTestnet: process.env.BSCSCAN_API_KEY,
      ftmTestnet: process.env.FANTOM_API_KEY,
      avalancheFujiTestnet: process.env.AVALANCHE_API_KEY,
      // arbitrumGoerli: process.env.ARBITRUMGOERLI_API_KEY
    },
  },
}
