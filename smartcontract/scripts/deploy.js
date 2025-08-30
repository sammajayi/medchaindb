const hre = require("hardhat");
require("dotenv").config();

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying MedChainDb with account:", deployer.address);

    // Deploy MedChainDb contract
    const MedChainDb = await hre.ethers.getContractFactory("MedChainDb");
    const medChainDb = await MedChainDb.deploy(); // ethers v6 automatically waits

    console.log(" MedChainDb Contract Deployed at:", medChainDb.target); // use .target instead of .address in ethers v6

    // Optional: Verify contract on Etherscan if not local
    if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
        console.log("Verifying contract...");
        try {
            await hre.run("verify:verify", {
                address: medChainDb.target,
                constructorArguments: [], // MedChainDb has no constructor args
                contract: "contracts/MedChainDb.sol:MedChainDb",
            });
            console.log("Contract verified successfully");
        } catch (err) {
            console.log("Verification failed:", err.message);
        }
    } else {
        console.log("Skipping verification on local network");
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
