const chai = require('chai')
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { solidity } =  require('ethereum-waffle');
const { execute } = require('graphql');
const { expect } = chai
chai.use(solidity);

describe("NFT Token contract", function () {
  async function deployTokenFixture() {
    const [minter, burner, uri, admin, deployer, anyone] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("NFT", deployer);

    console.log( "Minter", minter.address);
    console.log( "Burner", burner.address);
    console.log( "Uri", uri.address);
    console.log( "Deployer", deployer.address);
    console.log( "Anyone", anyone.address);



    const hardhatToken = await Token.deploy(minter.address, burner.address, uri.address, admin.address, '');

    await hardhatToken.deployed();
    console.log("Deployed", hardhatToken.address);

    // Fixtures can return anything you consider useful for your tests
    return { Token, hardhatToken, minter, burner, uri, admin, deployer, anyone };
  }

  it("Should assign the total supply of tokens to the owner", async function () {
    const { hardhatToken, admin } = await loadFixture(deployTokenFixture);

    const adminBalance = await hardhatToken.balanceOf(admin.address);
    expect(await hardhatToken.totalSupply()).to.equal(adminBalance);
    
  });

  it("Should not transfer tokens between accounts", async function () {
    const { hardhatToken, minter, anyone } = await loadFixture(deployTokenFixture);

    await hardhatToken.connect(minter).mintNFT(anyone.address);


    expect(await hardhatToken.totalSupply()).to.equal(1);
    expect(await hardhatToken.balanceOf(anyone.address)).to.equal(1);

    // Transfer NFT reverting
    
    await expect(
      hardhatToken.connect(anyone).transferFrom(anyone.address, minter.address, 1)
    ).to.revertedWith("Err: token transfer is BLOCKED");

  });

  it("Should not mint a second token to the same account", async function () {
    const { hardhatToken, minter, anyone } = await loadFixture(deployTokenFixture);

    await hardhatToken.connect(minter).mintNFT(anyone.address);

    // Minting a second NFT to the same address

    await expect(
      hardhatToken.connect(minter).mintNFT(anyone.address)
    ).to.revertedWith("Err: you already own a token");

  });

  it("Only minter can mint", async function () {
    const { hardhatToken, anyone } = await loadFixture(deployTokenFixture);


    await expect(
      hardhatToken.connect(anyone).mintNFT(anyone.address)
    ).to.revertedWith("AccessControl: account 0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc is missing role 0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6");

  });


  it("Only uri can change uri", async function () {
    const { hardhatToken, uri, minter, anyone } = await loadFixture(deployTokenFixture);
    await hardhatToken.connect(minter).mintNFT(anyone.address);

    expect(
      await  hardhatToken.tokenURI(1)
    ).to.equal("");

    //Update URI
    await hardhatToken.connect(uri)._setTokenURI("TEST")
    expect(
      await  hardhatToken.tokenURI(1)
    ).to.equal("TEST");

  //cannot update URI
  await expect(
       hardhatToken.connect(minter)._setTokenURI("TEST")
    ).to.revertedWith("AccessControl: account 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 is missing role 0x8e6595ef9afb2a8f70320f393f567bb7a0e6c4ed483caee30f90cc5fcd6659b4");
});

it("Granting minting rights", async function () {
  const { hardhatToken, admin, anyone } = await loadFixture(deployTokenFixture);
  await hardhatToken.connect(admin).grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE")), anyone.address);
  await hardhatToken.connect(anyone).mintNFT(anyone.address);

  expect(await hardhatToken.totalSupply()).to.equal(1);
  expect(await hardhatToken.balanceOf(anyone.address)).to.equal(1);
  expect(await hardhatToken.hasRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE")), anyone.address))
  .to.be.true;
});

it("Only burner and owner can burn", async function () {
  const { hardhatToken, minter, burner, anyone } = await loadFixture(deployTokenFixture);
  
  await hardhatToken.connect(minter).mintNFT(anyone.address);

  //check that it has been minted to the right receiver.
  expect(await hardhatToken.totalSupply()).to.equal(1);
  expect(await hardhatToken.balanceOf(anyone.address)).to.equal(1);
  expect(await hardhatToken.ownerOf(1)).to.equal(anyone.address);

  //owner burns and check it has been burned
  await hardhatToken.connect(burner).burn(1);
  expect(await hardhatToken.totalSupply()).to.equal(0);
  expect(await hardhatToken.balanceOf(anyone.address)).to.equal(0);

  // mint a new one
  await hardhatToken.connect(minter).mintNFT(anyone.address);

  // check minting happened correctly
  expect(await hardhatToken.totalSupply()).to.equal(1);
  expect(await hardhatToken.balanceOf(anyone.address)).to.equal(1);
 
  // burner role burns the NFT for receiver
  await hardhatToken.connect(burner).burn(await hardhatToken.tokenOfOwnerByIndex(anyone.address,0));

  // check that receiver's NFT is now burned
  expect(await hardhatToken.totalSupply()).to.equal(0);
  expect(await hardhatToken.balanceOf(anyone.address)).to.equal(0);

  // mint a new one
  await hardhatToken.connect(minter).mintNFT(anyone.address);

  // minter role tries to burn the NFT for receiver
  await expect(
    hardhatToken.connect(minter).burn(await hardhatToken.tokenOfOwnerByIndex(anyone.address,0))
  ).to.revertedWith("Caller cannot burn");


});

});
