

const hre = require("hardhat");
async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log(deployer.address);
    const EVote = await hre.ethers.deployContract("EVoting");
    await EVote.waitForDeployment();
    console.log("contract deployed at:", EVote.target);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });