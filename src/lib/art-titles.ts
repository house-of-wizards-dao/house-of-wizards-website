import { wizardsWithTraits } from "@/data/wizardsWithTraits";
import { warriorsWithTraits } from "@/data/warriorsWithTraits";
import { soulsWithTraits } from "@/data/soulsWithTraits";

type Subject = { collection: string; asset_identifier: string };
const characters = [
  ...wizardsWithTraits.map((character) => ({
    ...character,
    collection: "wizards",
  })),
  ...warriorsWithTraits.map((character) => ({
    ...character,
    collection: "warriors",
  })),
  ...soulsWithTraits.map((character) => ({
    ...character,
    collection: "souls",
  })),
];
const names = new Map(
  characters.map((character) => [
    `${character.collection}:${character.idx}`,
    character.name,
  ]),
);
const collectionOrder = ["wizards", "warriors", "souls"];

/** Resolve on the server so the full character datasets never enter the gallery bundle. */
export const artworkTitle = (
  fallback: string,
  subjects: Subject[],
  sourceText: string | null = null,
): string => {
  let known = Array.from(
    new Map(
      subjects.map((subject) => [
        `${subject.collection}:${subject.asset_identifier}`,
        subject,
      ]),
    ).values(),
  );
  if (!known.length && sourceText) {
    const source = sourceText.toLowerCase();
    const matched = characters.filter((character) => {
      if (character.name.length < 8) return false;
      const name = character.name.toLowerCase();
      const index = source.indexOf(name);
      return (
        index >= 0 &&
        !/[\p{L}\p{N}]/u.test(source[index - 1] ?? " ") &&
        !/[\p{L}\p{N}]/u.test(source[index + name.length] ?? " ")
      );
    });
    // A longer name can contain another character’s complete name. Prefer the
    // specific match rather than treating one phrase as multiple subjects.
    known = matched
      .filter(
        (character) =>
          !matched.some(
            (other) =>
              other.name.length > character.name.length &&
              other.name.toLowerCase().includes(character.name.toLowerCase()),
          ),
      )
      .map((character) => ({
        collection: character.collection,
        asset_identifier: String(character.idx),
      }));
  }
  if (known.length === 1)
    return (
      names.get(`${known[0].collection}:${known[0].asset_identifier}`) ??
      fallback
    );
  if (
    known.length > 1 &&
    known.every((subject) => collectionOrder.includes(subject.collection))
  ) {
    const collections = collectionOrder.filter((collection) =>
      known.some((subject) => subject.collection === collection),
    );
    const label =
      collections.length === 1
        ? collections[0]
        : `${collections.slice(0, -1).join(", ")} and ${collections[collections.length - 1]}`;
    return `Various ${label}`;
  }
  return fallback;
};
