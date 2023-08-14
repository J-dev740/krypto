// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const {ethers}= require("hardhat");

async function main() {
//create a contract factory that creates instances of some contract defined in the contracts folder
const TransactionsFactory= await ethers.getContractFactory("Transaction")
const Transaction= await TransactionsFactory.deploy()
await Transaction.waitForDeployment()
const address = await Transaction.getAddress()
console.log(address)
console.log(`\n-------------------------------------->`)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
const runMain = async ()=>{
 try {
   await main()
  process.exit(0)
 } catch (error) {
  console.error(error)
  process.exit(1)
 }
 
 
}

runMain();
