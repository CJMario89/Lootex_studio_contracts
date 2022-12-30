/* eslint-disable prettier/prettier */
const hre = require('hardhat')
const { ethers } = hre
const ether = require('ethers')
const { utils } = ether
require('dotenv').config()
const { createAlchemyWeb3 } = require('@alch/alchemy-web3')


// nonce completition even after await tx.wait()
async function delay(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds)
  })
}


async function main() {
  const [deployer] = await ethers.getSigners()

  const [
    Factory,
    BasicERC721,
    BasicERC1155,
    BasicERC721LimitedEdition,
    Registry,
    Forwarder,
    LootexCreatorCollection,
  ] = await Promise.all([
    ethers.getContractFactory('Factory'),
    ethers.getContractFactory('BasicERC721'),
    ethers.getContractFactory('BasicERC1155'),
    ethers.getContractFactory('BasicERC721LimitedEdition'),
    ethers.getContractFactory('contracts/Registry.sol:Registry'),
    ethers.getContractFactory('Forwarder'),
    ethers.getContractFactory('LootexCreatorCollection'),
  ])


  // 1. deploy
  const forwarder = await Forwarder.deploy()
  await forwarder.deployed()
  console.log('forwarder deployed to:', forwarder.address)
  await delay(2000)

  const registry = await Registry.deploy(forwarder.address)
  await registry.deployed()
  console.log('Registry deployed to:', registry.address)
  await delay(2000)

  const factory = await Factory.deploy(forwarder.address, registry.address)
  await factory.deployed()
  console.log('Factory deployed to:', factory.address)
  await delay(2000)

  const basicERC721 = await BasicERC721.deploy()
  await basicERC721.deployed()
  console.log('basicERC721 deployed to:', basicERC721.address)
  await delay(2000)

  const basicERC1155 = await BasicERC1155.deploy()
  await basicERC1155.deployed()
  console.log('basicERC1155 deployed to:', basicERC1155.address)
  await delay(2000)

  const basicERC721LimitedEdition = await BasicERC721LimitedEdition.deploy()
  await basicERC721LimitedEdition.deployed()
  console.log(
    'basicERC721LimitedEdition deployed to:',
    basicERC721LimitedEdition.address,
  )
  await delay(2000)

  const lootexCreatorCollection = await LootexCreatorCollection.deploy()
  await lootexCreatorCollection.deployed()
  console.log(
    'LootexCreatorCollection deployed to:',
    lootexCreatorCollection.address,
  )
  await delay(2000)


  // 2. add implementation to run EIP1167
  const addImplementation1 = await factory.addImplementation(
    basicERC721.address,
  )
  await addImplementation1.wait()
  console.log('basicERC721 implementation added')
  await delay(2000)

  const addImplementation2 = await factory.addImplementation(
    basicERC1155.address,
  )
  await addImplementation2.wait()
  console.log('basicERC1155 implementation added')
  await delay(2000)

  const addImplementation3 = await factory.addImplementation(
    basicERC721LimitedEdition.address,
  )
  await addImplementation3.wait()
  console.log('basicERC721LimitedEdition implementation added')
  await delay(2000)

  const addImplementation4 = await factory.addImplementation(
    lootexCreatorCollection.address,
  )
  await addImplementation4.wait()
  console.log('lootexCreatorCollection implementation added')
  await delay(2000)

  // add Factory as role to Registry
  const grantRole = await registry.grantRole(
    '0x97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b929', //keccak(OPERATOR_ROLE)
    factory.address,
  )
  await grantRole.wait()
  console.log('role added to Registry')
  await delay(2000)

  // 3. deploy LootexCreatorCollection by Factory

  const defaultAdmin = deployer.address
  const name = 'LootexCreatorCollection'
  const symbol = 'LCC'
  const contractURI =
    'ipfs://bafkreifjmoalozcmsbncqmcscechfehyxxgvwku2ja33svs4vcsdzvzoc4'
  const trustedForwarders = [forwarder.address]
  const royaltyRecipient = deployer.address
  const royaltyBps = '500' // 5%
  const baseURI = ''

  const _dataForDeployProxy = LootexCreatorCollection.interface
    .getSighash('initialize')
    .concat(
      ethers.utils.defaultAbiCoder
        .encode(
          [
            'address',
            'string',
            'string',
            'string',
            'address[]',
            'address',
            'uint128',
            'string'
          ],
          [
            defaultAdmin,
            name,
            symbol,
            contractURI,
            trustedForwarders,
            royaltyRecipient,
            royaltyBps,
            baseURI
          ],
        )
        .replace('0x', ''),
    )

  const deployProxy = await factory.deployProxy(
    utils.formatBytes32String('LootexCreatorCollection'),
    _dataForDeployProxy,
  )
  await deployProxy.wait()

  const LootexCreatorCollectionContractAddress = (
    await registry.getAll(deployer.address)
  )[0]
  console.log(
    'LootexCreatorCollection deployed by Factory: ',
    LootexCreatorCollectionContractAddress,
  )



  await hre.run("verify:verify", {
    address: forwarder.address,
    constructorArguments: [],
  });
  await hre.run("verify:verify", {
    address: registry.address,
    constructorArguments: [
      forwarder
    ],
  });
  await hre.run("verify:verify", {
    address: factory.address,
    constructorArguments: [
      forwarder,
      registry
    ],
  });
  await hre.run("verify:verify", {
    address: basicERC721.address,
    constructorArguments: [],
  });
  await hre.run("verify:verify", {
    address: basicERC1155.address,
    constructorArguments: [],
  });
  await hre.run("verify:verify", {
    address: basicERC721LimitedEdition.address,
    constructorArguments: [],
  });
  await hre.run('verify:verify', {
    address: lootexCreatorCollection.address,
    constructorArguments: [],
  })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
