import {
    time,
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
  import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
  import { expect } from "chai";
  import hre, { ethers } from "hardhat";
  import keccak256 from "keccak256";
  import { MerkleTree } from 'merkletreejs';

  describe("SaveERC20", function () {
    const claimAddress = "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E";

    async function deployToken() {
        // Contracts are deployed using the first signer/account by default
        const [owner, account2] = await hre.ethers.getSigners();
        const erc20Token = await hre.ethers.getContractFactory("AirdropToken");
        const token = await erc20Token.deploy();
        
        return { owner,token, account2 };
      }
      
      async function deployMerkleAirdrop() {
        const [owner, account2, account3, account4, account5, account6, account7] = await hre.ethers.getSigners();
      const leafNodes = [ owner,account2,account3,account4,account5,account6,account7 ].map((addr) =>
        keccak256(ethers.solidityPacked(["address", "uint256"], [account2.address, ethers.parseUnits("110", 18)]))
      );

      const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
      const rootHash = merkleTree.getHexRoot();

      const { token } = await loadFixture(deployToken);

      const merkleRoot = rootHash;

      const MERKLEAIRDROP = await hre.ethers.getContractFactory("MerkleAirdrop")
      const merkleAirdrop = await MERKLEAIRDROP.deploy(token, merkleRoot)

      return {owner, merkleRoot, merkleTree, token, merkleAirdrop, account2, account3, account4, account5, account6, account7};
    }

    describe("Deployment", function () {
        it("Should check if owner is correct", async function () {
          const { owner, merkleAirdrop } = await loadFixture(deployMerkleAirdrop);

            expect(await merkleAirdrop.owner()).to.equal(owner)
        });
      });

      it("Should check that tokenAddress is correctly set", async function () {
        const { token, merkleAirdrop } = await loadFixture(deployMerkleAirdrop);
        
        expect(await merkleAirdrop.tokenAddress()).to.equal(token);
      });

      it("Should check if merkle root is valid", async function (){
        const { merkleRoot, merkleAirdrop } = await loadFixture(deployMerkleAirdrop);

        expect(await merkleAirdrop.merkleRoot()).to.equal(merkleRoot)
      });

      describe("Claiming", function() {
        it("Should check if claim is valid", async function (){

          const { owner, token, merkleTree,merkleAirdrop, account2  } = await loadFixture(deployMerkleAirdrop);

          const transferAmount = ethers.parseUnits("115", 18);
          await token.transfer(merkleAirdrop, transferAmount);

          const claimAmount = ethers.parseUnits("110", 18);
          const leaf = keccak256(ethers.solidityPacked(["address", "uint256"], [account2.address, claimAmount]));

          const proof = merkleTree.getHexProof(leaf);
          
          expect(await merkleAirdrop
            .connect(account2)
            .claimReward(proof, claimAmount))
          .to.emit(merkleAirdrop, "claimSuccessful")
          .withArgs(account2.address, claimAmount);
        })
      });

      // describe("Claiming", function(){
      //   it("Should check if claim is valid", async function () {
      //       const { merkleAirdropDeploy, owner } = await loadFixture(deployMerkleAirdrop);

      //       const merkleProof = [
      //         '0x092371fa30e1efc6572046bcfb2589780fac84b6c8e8c5af7ab4b36c4643e319',
      //         '0x68b32f3d18693bb03a60c725a817a115925f3bb073a09622ba60be73a28ac7bc',
      //         '0xe107ec3d6f9c5c76fb278d94b1008776e63465d4a1ec1cc12059c90ff4516b02',
      //         '0xbcdd6a7f0b0de4ae09b50da132136865fb0ca70dabcbfcf28e571a0f6f5a18e4',
      //         '0xaa57adbc5ab408575e9a33632b15e820902c2dc5ba1f6a890e6ab85e5162f6c5'
      //       ];

      //       const amount = ethers.parseUnits("903", 18);
      
      //       expect(await merkleAirdropDeploy.claimReward(merkleProof, amount))
      //       .to.emit(merkleAirdropDeploy, "claimSuccessful")
      //       .withArgs(owner.address, amount);
      //     });
      // })

  })