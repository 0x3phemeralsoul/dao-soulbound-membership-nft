async function main() {
    const NftFactory = await ethers.getContractFactory("NftFactory");
    
    // Start deployment, returning a promise that resolves to a contract object
    const nftFactory = await NftFactory.deploy();
    console.log("Contract deployed to address:", nftFactory.address);
    }
    
    main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
