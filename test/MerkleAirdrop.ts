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

        const merkleRoot = "0xc9bb1a7fd3875642533a3bfbbd092222a828f91e9948cb640241608c3dec48db";

        const merkleAirdrop = await hre.ethers.getContractFactory("MerkleAirdrop")
        const merkleAirdropDeploy = await merkleAirdrop.deploy(token, merkleRoot)

        return {owner,merkleRoot, merkleAirdropDeploy};
    }

    describe("Deployment", function () {
        it("Should check if owner is correct", async function () {
          const { owner, merkleAirdropDeploy } = await loadFixture(deployMerkleAirdrop);

            expect(await merkleAirdropDeploy.owner()).to.equal(owner)
        });
      });

      describe("Claiming", function(){
        it("Should check if claim is valid", async function () {
            const { merkleAirdropDeploy, owner } = await loadFixture(deployMerkleAirdrop);

            const merkleProof = [
                '0xd33990ad49f353b457191f329ab02360cdfd2d34e8730764735d9b9f94796be3',
                '0xb024823f3257f94046f186fc87ca4f58ac28bb30503805fefe22ad1afc344f0b',
                '0x8312a8e5abf1caf81ca0039283aaa69bb67c9b3fe37d0e34e17bd6965d1ec92d',
                '0x3fb5155dd6787f8204eaf5eb765486c127257771cf769be97755a033444ed9b4',
                '0x2825bfe9f73da3a667a3fe1ab3eb20fa5acf6db3f202100d6323d0d055c8aa26'
              ];

            const amount = ethers.parseUnits("916", 18);
      
            expect(await merkleAirdropDeploy.claimReward(merkleProof, amount))
            .to.emit(merkleAirdropDeploy, "claimSuccessful")
            .withArgs(owner.address, amount);
          });
      })


  })