require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  defaultNetwork:"hardhat",
  networks:{
    hardhat:{},
    sepolia:{
      url:"https://eth-sepolia.g.alchemy.com/v2/KDLuy7Jq7o91aQ-Y_u2mUbBJ91lop7A4",
      accounts:["da01f7f0a655a0473b5ecac5a0716e5550e932694e36b1b46c97c3c9b352b6cd",],
      // chainId:11155111,

    }
  }
};
