import {
    time,
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
  import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
  import { expect } from "chai";
  import hre, { ethers } from "hardhat";

  describe("SaveERC20", function () {
    async function deployToken() {
        // Contracts are deployed using the first signer/account by default
        const [owner] = await hre.ethers.getSigners();
    
        const erc20Token = await hre.ethers.getContractFactory("AirdropToken");
        const token = await erc20Token.deploy();
    
        return { token };
      }

    async function deployMerkleAirdrop() {
        const [owner, otherAccount] = await hre.ethers.getSigners();

        const { token } = await loadFixture(deployToken);

        const merkleRoot = "0x70c0025734ec479c2b49d70a4165e04d3eac7d01bb71933a6457c663fb54f852";

        const merkleAirdrop = await hre.ethers.getContractFactory("MerkleAirdrop")
        const merkleAirdropDeploy = await merkleAirdrop.deploy(token, merkleRoot)

        return {owner,merkleRoot, merkleAirdropDeploy};
    }

    describe("Deployment", function () {
        it("Should check if owner is correct", async function () {
          const { merkleAirdropDeploy, owner } = await loadFixture(deployMerkleAirdrop);

            expect(await merkleAirdropDeploy.owner()).to.equal(owner)
        });
    
        // it("Should check if tokenAddress is correctly set", async function () {
        //   const { saveErc20, owner, token } = await loadFixture(deploySaveERC20);
    
        //   expect(await saveErc20.tokenAddress()).to.equal(token);
        // });
      });


  })