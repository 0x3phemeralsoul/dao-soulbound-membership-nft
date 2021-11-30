# Training material: How to mint an NFT on Palm

Training code for Palm documentation. This repo aims at supporting those learning how to mint an NFT on Palm using `Hardhat` and `Ethers.js`

This repo contains all the finished code explained at: https://docs.palm.io/HowTo/Mint-NFT-using-Hardhat

### Installation

        
        npm install
        

### Configuration

Add an `.env` file matching the variables found in `hardhat.config.js`

### Usage

#### Deploy contract to Palm Testnet:

        
        npx hardhat run scripts/deploy.js --network palm_testnet
        

#### Deploy contract to Palm Mainnet:

        
        npx hardhat run scripts/deploy.js --network palm_mainnet
        

#### Mint NFT on Palm Testnet:

        
        npx hardhat run scripts/mint.js --network palm_testnet
        

#### Mint NFT on Palm Mainnet:

        
        npx hardhat run scripts/mint.js --network palm_mainnet
        
