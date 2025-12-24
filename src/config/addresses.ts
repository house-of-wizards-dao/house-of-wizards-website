import { validateEnvVar } from "@/lib/env";

export const addresses = {
  wizards: "0x521f9C7505005CFA19A8E5786a9c3c9c9F5e6f42",
  warriors: "0x9690b63Eb85467BE5267A3603f770589Ab12Dc95",
  souls: "0x251b5f14a825c537ff788604ea1b58e49b70726f",
  ponies: "0xf55b615B479482440135Ebf1b907fD4c37eD9420",
  pfpMint:
    validateEnvVar("NEXT_PUBLIC_PFP_MINT_CONTRACT_ADDRESS", process.env.NEXT_PUBLIC_PFP_MINT_CONTRACT_ADDRESS),
} as const;
