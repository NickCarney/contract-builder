import { Hex, http } from "viem";
import { Account, privateKeyToAccount, Address } from "viem/accounts";
import { StoryClient, StoryConfig } from "@story-protocol/core-sdk";

//will not work with proccess ): using special empty wallet funded for faucet 
const privateKey: Address = `0x67f1b9742fd79720c0ab7617eac49fc904c0100cbb7ffdbfd66b79e98069750b`//${process.env.WALLET_PRIVATE_KEY}`;
const account: Account = privateKeyToAccount(privateKey as Hex);
export const SPGNFTContractAddress: Address =
    (process.env.SPG_NFT_CONTRACT_ADDRESS as Address) || '0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc'

const config: StoryConfig = {
  account: account,
  transport: http(process.env.RPC_PROVIDER_URL),
  chainId: "aeneid",
};
export const client = StoryClient.newClient(config);