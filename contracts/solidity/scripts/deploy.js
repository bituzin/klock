const hre = require("hardhat");

async function main() {
    console.log("🚀 Deploying PULSE contract...\n");

    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying with account:", deployer.address);

    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("Account balance:", hre.ethers.formatEther(balance), "ETH\n");

    // Deploy PULSE contract
    const Pulse = await hre.ethers.getContractFactory("Pulse");
    const pulse = await Pulse.deploy();

    await pulse.waitForDeployment();
    const contractAddress = await pulse.getAddress();

    console.log("✅ PULSE deployed to:", contractAddress);
    console.log("\n📝 Deployment Details:");
    console.log("   Network:", hre.network.name);
    console.log("   Chain ID:", (await hre.ethers.provider.getNetwork()).chainId.toString());
    console.log("   Deployer:", deployer.address);
    console.log("   Contract:", contractAddress);

    // Wait for block confirmations for verification
    console.log("\n⏳ Waiting for block confirmations...");
    await pulse.deploymentTransaction().wait(5);

    console.log("\n🔍 Verifying contract on Basescan...");
    try {
        await hre.run("verify:verify", {
            address: contractAddress,
            constructorArguments: [],
        });
        console.log("✅ Contract verified successfully!");
    } catch (error) {
        if (error.message.includes("Already Verified")) {
            console.log("✅ Contract already verified!");
        } else {
            console.log("⚠️ Verification failed:", error.message);
        }
    }

    console.log("\n🎉 Deployment complete!");
    console.log("\n📋 Next steps:");
    console.log("   1. Save the contract address:", contractAddress);
    console.log("   2. Update your frontend with the new address");
    console.log("   3. Test the contract functions");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
