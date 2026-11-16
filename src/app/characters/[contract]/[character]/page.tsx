import { notFound } from "next/navigation";
import { getCharacterPageData } from "@/lib/server/character-page";
import CharacterBackpackClient from "./CharacterBackpackClient";

export default async function CharacterPage({
  params,
}: {
  params: Promise<{ contract: string; character: string }>;
}) {
  const { contract, character } = await params;
  if (
    !/^0x[a-fA-F0-9]{40}$/.test(contract) ||
    !/^(0|[1-9]\d*)$/.test(character)
  )
    notFound();
  if (BigInt(character) >= 2n ** 256n) notFound();
  return (
    <CharacterBackpackClient
      key={`${contract}:${character}`}
      {...getCharacterPageData(contract, character)}
    />
  );
}
