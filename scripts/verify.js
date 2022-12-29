/* eslint-disable camelcase */
/* eslint-disable prettier/prettier */
const hre = require("hardhat");

const forwarder = '0xA6212778f498b0Fb5e7B3A1408b19B12a0207c43'
const factory = '0x16734857eBC953860793FCcDe9B38b8dC213Ca5b'
const registry = '0xF94d09C28c0bbE54fD853978bfaA7D1222DD71b0'
const basicERC721 = '0x6EBf9acbCBe3B0b6C1A676CCa9aFDd5826a06C52';
const basicERC1155 = '0x2391F6F6d815a1D3f7D9c82F53989A9bcF3eA565';
const basicERC721LimitedEdition = '0xeC4A1aC2a48412eaE90be2b1E95E857B8C1Bee61';
const lootexCreatorCollection = '0x98CBa6bdeEB64a79283390754A30C3D0AfF2d731';


async function main() {
  await hre.run("verify:verify", {
    address: forwarder,
    constructorArguments: [],
  });
  await hre.run("verify:verify", {
    address: registry,
    constructorArguments: [
      forwarder
    ],
  });
  await hre.run("verify:verify", {
    address: factory,
    constructorArguments: [
      forwarder,
      registry
    ],
  });
  await hre.run("verify:verify", {
    address: basicERC721,
    constructorArguments: [],
  });
  await hre.run("verify:verify", {
    address: basicERC1155,
    constructorArguments: [],
  });
  await hre.run("verify:verify", {
    address: basicERC721LimitedEdition,
    constructorArguments: [],
  });
  await hre.run("verify:verify", {
    address: lootexCreatorCollection,
    constructorArguments: [],
  });
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
