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
    const value = row[1].trim();
    addresses.push({address, value});

  })
  .on("error", function (error) {
    console.log(error.message);
  })
  .on("end", function () {
    addresses.slice(1);

    const leafNode = addresses.map(({address, value}) => {
        // keccak256(Buffer.concat(addr));
        const addressBuffer = Buffer.from(address.slice(2), 'hex');

        const valueBuffer = Buffer.from(value.padStart(64, '0'), 'hex');

        const concatenatedBuffer = Buffer.concat([addressBuffer, valueBuffer]);

        return keccak256(concatenatedBuffer);
    })
    const merkleTree = new MerkleTree(leafNode, keccak256, {sortPairs: true});

    const rootHash = merkleTree.getRoot();
    console.log("Merkle Tree", merkleTree.toString());
    // console.log("Root hash:", rootHash);

    const claimingAddress = leafNode[2];
   
    const hexProof = merkleTree.getHexProof(claimingAddress);
    console.log(hexProof)
    console.log(merkleTree.verify(hexProof, claimingAddress, rootHash))
    console.log(rootHash.toString("hex"))
    console.log("File read successful");
  });
