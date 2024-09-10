import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const tokenAddress = "0xf3351dE1dAD6Df4E3448FBEA0Fc5dc6F156984B7";

const merkleRoot = "0xafd0af8df46f7a1492c0fda3fb904437b94af127bd766608e22dfa3308f500e8"
// const tokenAddress = "0xf3351dE1dAD6Df4E3448FBEA0Fc5dc6F156984B7";

// const merkleRoot = "0xc9bb1a7fd3875642533a3bfbbd092222a828f91e9948cb640241608c3dec48db"

const MerkleAirdropModule = buildModule("MerkleAirdrop", (m) => {

  const merkle_airdrop = m.contract("MerkleAirdrop", [tokenAddress, merkleRoot]);

  return { merkle_airdrop };
});

export default MerkleAirdropModule;

// 0xf3351dE1dAD6Df4E3448FBEA0Fc5dc6F156984B7