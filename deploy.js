const {ethers} = require("hardhat");

async function main() {
    const Crowdfunding = await ethers.getContractFactory("Crowdfunding");

    const crowdfunding = await Crowdfunding.deploy();
    
    await crowdfunding.waitForDeployment();

    console.log("Crowdfunding Deployed at:", await crowdfunding.getAddress());
}

main().catch((error)=>{
    console.log(error);
    process.exitCode = 1;
});