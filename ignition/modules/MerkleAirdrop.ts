import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const tokenAddress = "0xf3351dE1dAD6Df4E3448FBEA0Fc5dc6F156984B7";

const merkleRoot = "70c0025734ec479c2b49d70a4165e04d3eac7d01bb71933a6457c663fb54f852"

const MerkleAirdropModule = buildModule("MerkleAirdrop", (m) => {

  const merkle_airdrop = m.contract("MerkleAirdrop", [tokenAddress, merkleRoot]);

  return { merkle_airdrop };
});

export default MerkleAirdropModule;

// 0xf3351dE1dAD6Df4E3448FBEA0Fc5dc6F156984B7