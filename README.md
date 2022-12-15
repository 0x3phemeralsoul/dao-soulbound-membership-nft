
### Installation
        
        npm install

### Configuration

Add an `.env` file matching the variables found in `hardhat.config.js`:
* INFURA_PROJECT_ID
* PRIVATE_KEY
* PUBLIC_KEY
* CONTRACT_ADDRESS

### Usage

#### Deploy contract to Palm Testnet:
        
        npx hardhat run scripts/deploy.js --network palm_testnet

#### Deploy contract to Palm Mainnet:

        npx hardhat run scripts/deploy.js --network palm_mainnet
        
#### Mint NFT on Palm Testnet:

        npx hardhat run scripts/mint.js --network palm_testnet
        

#### Mint NFT on Palm Mainnet:

        npx hardhat run scripts/mint.js --network palm_mainnet
        


#### NFT features
 - soulbound: cannot be transfered
 - Access control: Default Admin, Burner, Uri, Minter are passed to constructor
 - Only owner or burner can burn the token. This is to allow right to be forgotten to the owner and also allow for a DAO to kick out a soulbound member.
 - Only 1 token per address is allowed.
 - Uri role is able to update the tokenURI metadata.
