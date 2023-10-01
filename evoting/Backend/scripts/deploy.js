

const hre = require("hardhat");
async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log(deployer.address);
    //const Chai = await hre.ethers.getContractFactory("chai");
    const Chai = await hre.ethers.deployContract("EVoting");
    await Chai.waitForDeployment();
    console.log("contract deployed at:", Chai.target);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });