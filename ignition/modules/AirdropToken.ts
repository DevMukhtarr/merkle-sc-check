import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const AirdropTokenModule = buildModule("LockModule", (m) => {

  const airdrop_token = m.contract("AirdropToken");

  return { airdrop_token };
});

export default AirdropTokenModule;
