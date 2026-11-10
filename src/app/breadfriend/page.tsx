import type { Metadata } from "next";
import {
  breadfriendFallbackGifs,
  type BreadfriendGif,
} from "@/data/breadfriend";
import { fetchGiphyChannelGifs } from "@/lib/breadfriend";
import { BreadfriendContent } from "./BreadfriendContent";

export const metadata: Metadata = {
  title: "Breadfriend | House of Wizards",
  description:
    "Showcase of the House of Wizards Breadfriend GIF initiative on GIPHY and KLIPY. Browse, download, and share the GIFs.",
  openGraph: {
    title: "Breadfriend | House of Wizards",
    description:
      "Showcase of the House of Wizards Breadfriend GIF initiative on GIPHY and KLIPY.",
  },
};

// Render on every request so the GIFs can be shuffled per visit. The GIPHY
// fetch stays cached (see its own revalidate), so this does not add API calls.
export const dynamic = "force-dynamic";

/** Returns a new array with the GIFs in random order (Fisher–Yates). */
const shuffle = (gifs: readonly BreadfriendGif[]): BreadfriendGif[] => {
  const result = [...gifs];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

export default async function BreadfriendPage() {
  const liveGifs = await fetchGiphyChannelGifs();
  const source = liveGifs.length > 0 ? liveGifs : breadfriendFallbackGifs;
  const gifs = shuffle(source);

  return <BreadfriendContent gifs={gifs} />;
}
