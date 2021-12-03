require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
const contract = require("../artifacts/contracts/NFT.sol/NFT.json");
const contractInterface = contract.abi;

// https://hardhat.org/plugins/nomiclabs-hardhat-ethers.html#provider-object

let provider = ethers.provider;

const addressArray = [
  "0xE8D858A05631879C3089f1F5d8b5A288138B7E8B",
  "0xE4747303F9a12F5B13a4Ba6dbf55d651844Da02F",
  "0x84682175EF15bEB1741Afb4D7c01223dA1A6AB02",
  "0xa6111182bFF41d0EfecADF11Da0289D1c3f120ba",
  "0x78dCcE1ca3841755177B56F647728Cd65D5Ca9Eb",
];

const tokenURIArray = [
  "https://bafkreid62y6ghstiw45ri6lckw3wvcjyfj6ufggt7xrkumf4mnv7zd5lki.ipfs.dweb.link/",
  "https://bafkreigylhn633yfubfz7t3inovnvfzjuaol26xxrpsguefopa4gj5gx3a.ipfs.dweb.link/",
  "https://bafkreidi3ezidml4i4dioqrcd5lbe7hl6luwc75lyr6xtizmrv3fgryfne.ipfs.dweb.link/",
  "https://bafkreia5663fduzot2jolhvno64sv2kc2p2gb4pgbecu53hh2wi3dvyksu.ipfs.dweb.link/",
  "https://bafkreihwlxv4vsh7inkoriaunzbgzxe54dn7psx7po6dwv5ulqvwt4jieq.ipfs.dweb.link/",
  "https://bafkreiad7wbdtg2ukv6lepcrs2igntbsosf4cfks6ndnv2hgawbiilm32u.ipfs.dweb.link/",
  "https://bafkreiav2o2gzi6e6izfvyblaabvuhq5jgm66g3gabhlihnnmlhu7rs72y.ipfs.dweb.link/",
  "https://bafkreigebhwnyl7pygdhd2x3sk26bmq5ohpwbw22vfwhx4kcytfalcrdbq.ipfs.dweb.link/",
  "https://bafkreicd2a4uiogaymvvrbdgdz23bnxnvi6f6xudeko3nbh4p2f7r4v5dm.ipfs.dweb.link/",
  "https://bafkreigpkgdadv3xjdlfelgi2mjf7ot5wwxal5kr3meqjrubwegou56sga.ipfs.dweb.link/",
  "https://bafkreify6o56j7qttf7bkaslvntouiodrcgiglw2or5e7snnbjhfnjurla.ipfs.dweb.link/",
  "https://bafkreid3oepq77u7cfv2vlap64axlmmokq6lwtmb7f44blso4w6dq2qcjm.ipfs.dweb.link/",
  "https://bafkreiepy3qyo6ydc5duuwj3oownlr47xzn7iojjmuvq3todfukx2wlllq.ipfs.dweb.link/",
  "https://bafkreiezl3nmxnxrfhb5jlap7hju4a673clecpjse4fm375kr257qhpcj4.ipfs.dweb.link/",
  "https://bafkreifkupbmxozavwdukqjkqjy7ht26wnmggdnf4mvrlq7hwg4odibdti.ipfs.dweb.link/",
];

const privateKey = `0x${process.env.PRIVATE_KEY}`;
const wallet = new ethers.Wallet(privateKey);

wallet.provider = provider;
const signer = wallet.connect(provider);

// https://docs.ethers.io/v5/api/contract/contract
const nft = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  contractInterface,
  signer
);
const mint = nft.mintNFT;
const random = function () {
  return Math.floor(Math.random() * addressArray.length);
};

function txSender(tokenURIArray, mint) {
  let i = 0;
  let nextTx = function () {
    if (i >= tokenURIArray.length) {
      return;
    }
    let newTx = Promise.resolve(mint(addressArray[random()], tokenURIArray[i]));
    i++;
    return newTx
      .then((tx) => tx.wait(1))
      .then((receipt) =>
        console.log(
          `Mint transaction ${i} out of ${tokenURIArray.length} is confirmed, its receipt is: ${receipt.transactionHash}`
        )
      )
      .then(nextTx);
  };
  return Promise.resolve().then(nextTx);
}

const main = () => {
  console.log("Waiting 1 block for each mint confirmation...");
  txSender(tokenURIArray, mint).catch((e) =>
    console.log("something went wrong", e)
  );
};

main();
