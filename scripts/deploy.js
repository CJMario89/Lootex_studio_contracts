/* eslint-disable prettier/prettier */
const hre = require("hardhat");
const { ethers } = hre;
const ether = require("ethers")
const { utils } = ether
const helpers = require("@nomicfoundation/hardhat-network-helpers");

  // todo: how to set fee info
  async function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
  }


// let nonceOffset = 0;
// function getNonce() {
//   return baseNonce.then((nonce) => (nonce + (nonceOffset++)));
// }

async function main() {
  const [deployer] = await ethers.getSigners();

  const [
    Factory,
    BasicERC721,
    BasicERC1155,
    BasicERC721LimitedEdition,
    Registry,
    Forwarder,
    LootexCreatorCollection
  ] = await Promise.all([
    ethers.getContractFactory("Factory"),
    ethers.getContractFactory("BasicERC721"),
    ethers.getContractFactory("BasicERC1155"),
    ethers.getContractFactory("BasicERC721LimitedEdition"),
    ethers.getContractFactory("contracts/Registry.sol:Registry"),
    ethers.getContractFactory("Forwarder"),
    ethers.getContractFactory("LootexCreatorCollection"),
  ]);



  // const forwarder = await ethers.getContractAt('Forwarder', '0x9284b81dAE53048C73D0f7a0745B6C9502A87604', deployer)
  // const registry = await ethers.getContractAt('contracts/Registry.sol:Registry', '0xb372c06d411B8f018B824C4e955286e534E92C9f', deployer)
  // const factory = await ethers.getContractAt('Factory', '0x9A59a5518aD64E4bD54953eE0FD153DF21DDE517', deployer)

  // 1. deploy
  const forwarder = await Forwarder.deploy();
  await forwarder.deployed();
  console.log("forwarder deployed to:", forwarder.address);
  await delay(2000)

  const registry = await Registry.deploy(forwarder.address);
  await registry.deployed();
  console.log("Registry deployed to:", registry.address);
  await delay(2000)

  const factory = await Factory.deploy(forwarder.address, registry.address);
  await factory.deployed();
  console.log("Factory deployed to:", factory.address);
  await delay(2000)


  const basicERC721 = await BasicERC721.deploy();
  await basicERC721.deployed();
  console.log("basicERC721 deployed to:", basicERC721.address);
  await delay(2000)

  const basicERC1155 = await BasicERC1155.deploy();
  await basicERC1155.deployed();
  console.log("basicERC1155 deployed to:", basicERC1155.address);
  await delay(2000)

  const basicERC721LimitedEdition = await BasicERC721LimitedEdition.deploy();
  await basicERC721LimitedEdition.deployed();
  console.log("basicERC721LimitedEdition deployed to:", basicERC721LimitedEdition.address);
  await delay(2000)


  const lootexCreatorCollection = await LootexCreatorCollection.deploy()
  await lootexCreatorCollection.deployed()
  console.log("LootexCreatorCollection deployed to:", lootexCreatorCollection.address);

  await delay(2000)

  


  // 2. add BasicERC721 implementation to run EIP1167
  const addImplementation1 = await factory.addImplementation(basicERC721.address);
  await addImplementation1.wait()
  console.log("basicERC721 implementation added")
  await delay(2000)

  const addImplementation2 = await factory.addImplementation(basicERC1155.address);
  await addImplementation2.wait()
  console.log("basicERC1155 implementation added")
  await delay(2000)

  const addImplementation3 = await factory.addImplementation(basicERC721LimitedEdition.address);
  await addImplementation3.wait()
  console.log("basicERC721LimitedEdition implementation added")
  await delay(2000)

  const addImplementation4 = await factory.addImplementation(lootexCreatorCollection.address);
  await addImplementation4.wait()
  console.log("basicERC721LimitedEdition implementation added")
  await delay(2000)
 
  // add Factory as role to Registry
  const grantRole = await registry.grantRole(
    "0x97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b929",//keccak(OPERATOR_ROLE)
    factory.address
  )
  await grantRole.wait()
  console.log("role added to Registry")
  await delay(2000)
  
  // 3. deploy BasicERC721 by Factory

  // const factory = await Factory.attach("0xD9157F990b4097e045f1b90D107C3Cc78AbcF396")
  // const registry = await Registry.attach("0xBC15b04b92308b40A0fBc33410ffA6BdB42C5CeD")
  // const forwarder = await Forwarder.attach("0x080D2F1e911e19356c397a841Dfeea179c72c01e")

  const defaultAdmin = deployer.address
  const admin = deployer.address
  const name = "LootexCreatorCollection"
  const symbol = "LCC"
  const contractURI = "ipfs://bafkreifjmoalozcmsbncqmcscechfehyxxgvwku2ja33svs4vcsdzvzoc4"
  const trustedForwarders = [forwarder.address]
  // const trustedForwarders = ["0xc82bbe41f2cf04e3a8efa18f7032bdd7f6d98a81"]
  const saleRecipient = deployer.address
  const royaltyRecipient = deployer.address
  const royaltyBps = "500" // 5%
  const platformFeeBps = "1000" // 10%
  const platformFeeRecipient = deployer.address
  const maxSupply = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
  const extraParam = {
    baseURI_: "baseuri",
    _price: 100,
    _SALE_TIME_START: 0,
    _SALE_TIME_END: 0,
  }


 

  //ERC721 deployProxy (clone)
 //ERC721LimitedEdition deployProxy (clone)
  const _dataForDeployProxy1 = BasicERC721.interface.getSighash("initialize").concat(
    ethers.utils.defaultAbiCoder.encode(
      ["address", "string", "string", "string", "address[]", "address", "uint128", "string"],
      [
        defaultAdmin,
        name,
        symbol,
        contractURI,
        trustedForwarders,
        royaltyRecipient,
        royaltyBps,
        extraParam.baseURI_
      ]
    ).replace("0x", "")
  )
  const deployProxy1 = await factory.deployProxy(
    utils.formatBytes32String('BasicERC721'),
    _dataForDeployProxy1
  );
  await deployProxy1.wait()
  const deployedBasicERC721ContractAddress = (await registry.getAll(deployer.address))[0]
  console.log("BasicERC721 deployed by Factory: ", deployedBasicERC721ContractAddress)
  await delay(2000)

  //ERC1155 deployProxy (clone)
  const _dataForDeployProxy2 = BasicERC1155.interface.getSighash("initialize").concat(
    ethers.utils.defaultAbiCoder.encode(
      ["address", "string", "string", "string", "address[]", "address", "uint128", "string"],
      [
        defaultAdmin,
        name,
        symbol,
        contractURI,
        trustedForwarders,
        royaltyRecipient,
        royaltyBps,
        extraParam.baseURI_
      ]
    ).replace("0x", "")
  )
  const deployProxy2 = await factory.deployProxy(
    utils.formatBytes32String('BasicERC1155'),
    _dataForDeployProxy2
  );
  await deployProxy2.wait()

  const deployedBasicERC1155ContractAddress = (await registry.getAll(deployer.address))[1]
  console.log("BasicERC1155 deployed by Factory: ", deployedBasicERC1155ContractAddress)
  await delay(2000)


  //ERC721LimitedEdition deployProxy (clone)
  const _dataForDeployProxy3 = BasicERC721LimitedEdition.interface.getSighash('initialize').concat(
    ethers.utils.defaultAbiCoder.encode(
      ["address", "string", "string", "string", "address[]", "address", "uint128", "string", "uint256"],
      [
        defaultAdmin,
        name,
        symbol,
        contractURI,
        trustedForwarders,
        royaltyRecipient,
        royaltyBps,
        extraParam.baseURI_,
        maxSupply
      ]
    ).replace("0x", "")
  )
  const deployProxy3 = await factory.deployProxy(
    utils.formatBytes32String('BasicERC721LimitedEdition'),
    _dataForDeployProxy3
  );
  await deployProxy3.wait()

  const deployedBasicERC721LimitedEditionContractAddress = (await registry.getAll(deployer.address))[2]
  console.log("BasicERC721LimitedEdition deployed by Factory: ", deployedBasicERC721LimitedEditionContractAddress)

  await delay(2000)

  //4 LootexCreatorCollection


  const _dataForDeployProxy4 = LootexCreatorCollection.interface.getSighash('initialize').concat(
    ethers.utils.defaultAbiCoder.encode(
      ["address", "string", "string", "string", "address[]", "address", "uint128", "string"],
      [
        defaultAdmin,
        name,
        symbol,
        contractURI,
        trustedForwarders,
        royaltyRecipient,
        royaltyBps,
        extraParam.baseURI_
      ]
    ).replace("0x", "")
  )

  const deployProxy4 = await factory.deployProxy(
    utils.formatBytes32String('LootexCreatorCollection'),
    _dataForDeployProxy4
  );
  await deployProxy4.wait()

  const LootexCreatorCollectionContractAddress = (await registry.getAll(deployer.address))[3]
  console.log("LootexCreatorCollection deployed by Factory: ", LootexCreatorCollectionContractAddress)





  // 4. lazy mint
  // const dp = new ethers.Contract(deployedDropERC1155ContractAddress, DropERC1155ABI, deployer)
  // const mint = await dp.mint(
  //   "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",{
  //     value: 100
  //   }
  // )
  // await mint.wait()
  // console.log("minted")

  // 5. multicall (setContractURI & setClaimConditions)

  // const setContractURISelector = "0x938e3d7b"
  // const setClaimConditionsSelector = "0xab073c22" // 1155

  // const tokenId = 0

  // const _dataForSetClaimConditions = setClaimConditionsSelector.concat(
  //   ethers.utils.defaultAbiCoder.encode(
  //     [
  //       "uint256", 
  //       "tuple(uint256 startTimestamp, uint256 maxClaimableSupply, uint256 supplyClaimed, uint256 quantityLimitPerTransaction, uint256 waitTimeInSecondsBetweenClaims, bytes32 merkleRoot, uint256 pricePerToken, address currency)[]",
  //       "bool"
  //     ],
  //     [
  //       tokenId,
  //       [
  //         {
  //           startTimestamp: Math.floor(Date.now() / 1000),
  //           maxClaimableSupply: 100,
  //           supplyClaimed: 0,
  //           quantityLimitPerTransaction: ethers.BigNumber.from("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"),
  //           waitTimeInSecondsBetweenClaims: 100, // 100 seconds
  //           merkleRoot: "0x0000000000000000000000000000000000000000000000000000000000000000",
  //           pricePerToken: ethers.utils.parseEther("0.1"),
  //           currency: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", // NATIVE
  //         }
  //       ],
  //       false
  //     ]
  //   ).replace("0x", "")
  // )
  // const multicall = await dp.multicall(
  //   [_dataForSetClaimConditions]
  // );
  // await multicall.wait()
  // const getClaimConditionById = await dp.getClaimConditionById(0, 0)
  // console.log(getClaimConditionById)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
