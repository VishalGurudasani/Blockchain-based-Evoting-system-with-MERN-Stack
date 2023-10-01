require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({path:"./scripts/.env"});
/** @type import('hardhat/config').HardhatUserConfig */
const SEPOLIA_URL = process.env.SEPOLIA_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
module.exports = {
  defaultNetwork: "sepolia",
  solidity: "0.8.9",
  networks:{
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    hardhat: {
    },
    sepolia:{
      url:SEPOLIA_URL,
      accounts:[PRIVATE_KEY],
    },
  },
  paths: {
    artifacts: "./src/artifacts",
  }
};

  
