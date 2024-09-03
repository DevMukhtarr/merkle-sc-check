const { parse } = require("csv-parse");
const keccak256 = require('keccak256');
const { MerkleTree } = require("merkletreejs")

const fs = require("fs");

const path = "scripts/eth_addresses.csv";
const addresses = [];

fs.createReadStream(path)
  .pipe(parse({ delimiter: ",", from_line: 1 }))
  .on("data", function (row) {
    const address  = row[0].trim();
    addresses.push(address);
    // const value = row[1].trim();

  })
  .on("error", function (error) {
    console.log(error.message);
  })
  .on("end", function () {
    addresses.slice(1);

    const leafNode = addresses.map((addr) => keccak256(addr));
    const merkleTree = new MerkleTree(leafNode, keccak256, {sortPairs: true});

    const rootHash = merkleTree.getRoot();
    console.log("Merkle Tree", merkleTree.toString());
    // console.log("Root hash:", rootHash);

    // console.log(leafNode)
    const claimingAddress = leafNode[0];
   
    const hexProof = merkleTree.getHexProof(claimingAddress);
    console.log(hexProof)
    console.log(merkleTree.verify(hexProof, claimingAddress, rootHash))
    console.log("File read successful");
  });
