const { parse } = require("csv-parse");
const keccak256 = require('keccak256');
const { MerkleTree } = require("merkletreejs")
const ether = require("ethers");

const fs = require("fs");

const path = "scripts/eth_addresses.csv";
const addresses = [];

fs.createReadStream(path)
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", function (row) {
    const address  = row[0].trim();

    const amountFromCSV = row[1].trim();
    const amount = ether.parseUnits(amountFromCSV, 18);

    const leaf = keccak256(
      ether.solidityPacked(["address", "uint256"], [address, amount])
  )
    addresses.push(leaf);
  })
  .on("error", function (error) {
    console.log(error.message);
  })
  .on("end", function () {

    // const leafNode = addresses.map(({address, parsedValue}) => {
    //     // keccak256(Buffer.concat(addr));
    //     const addressBuffer = Buffer.from(address.slice(2), 'hex');

    //     const valueBuffer = Buffer.from(parsedValue.toString(16).padStart(64, '0'));

    //     const concatenatedBuffer = Buffer.concat([addressBuffer, valueBuffer]);

    //     return keccak256(concatenatedBuffer);
    // })

    const merkleTree = new MerkleTree(addresses, keccak256, {sortPairs: true});

    const rootHash = merkleTree.getHexRoot();
    console.log("Root hash:", rootHash);

    const targetEntry = {
      address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      amount: ether.parseUnits("110", 18)
  }

    // const claimingAddress = leafNode[2];
    const leaf = keccak256(
      ether.solidityPacked(["address", "uint256"], [targetEntry.address, targetEntry.amount])
  );

   
    const hexProof = merkleTree.getHexProof(leaf);
    console.log(hexProof)
    console.log(merkleTree.verify(hexProof, leaf, rootHash))
    console.log(rootHash.toString("hex"))
  });
