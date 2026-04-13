import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { merkleData } from "./shieldProofsTree";

const tree = StandardMerkleTree.load(merkleData);

export const getShieldProof = (
  tokenId?: number,
): { included: false } | { included: true; proof: string[] } => {
  if (tokenId == null) {
    return { included: false };
  }

  for (const [i, v] of tree.entries()) {
    if (v[0] === tokenId.toString()) {
      const proof = tree.getProof(i);
      return { proof, included: true };
    }
  }

  return { included: false };
};
