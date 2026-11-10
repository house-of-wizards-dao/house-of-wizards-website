// Data for the Breadfriend GIF showcase page (`/breadfriend`).
//
// The GIFs themselves are hosted on GIPHY and KLIPY. Each entry below drives one
// card on the page: a preview, a "View on <platform>" link, and a download button.
//
// HOW TO ADD A GIF
// ----------------
// GIPHY: open the GIF, copy its id from the URL
//   https://giphy.com/gifs/<slug>-<ID>  ->  the trailing <ID>
//   - previewUrl / downloadUrl: https://media.giphy.com/media/<ID>/giphy.gif
//   - pageUrl:                  https://giphy.com/gifs/<ID>
//
// KLIPY: open the GIF and copy the direct media URL and the share/page URL from
// the platform (KLIPY exposes a direct .gif/.mp4 media link per clip).
//   - previewUrl / downloadUrl: the direct .gif media URL
//   - pageUrl:                  the KLIPY page/share URL
//
// Downloads are cross-origin, so the page fetches the file to a blob and saves it,
// falling back to opening `downloadUrl` in a new tab if the host blocks CORS.

export type BreadfriendPlatform = "giphy" | "klipy";

export type BreadfriendGif = {
  /** Stable unique key (e.g. the GIPHY id or a short slug). */
  readonly id: string;
  /** Human-friendly title shown on the card. */
  readonly title: string;
  /** Which platform hosts this GIF. */
  readonly platform: BreadfriendPlatform;
  /** Direct image URL used to render the preview (usually the raw .gif). */
  readonly previewUrl: string;
  /** Direct media URL used for the download (usually the same raw .gif). */
  readonly downloadUrl: string;
  /** Link to the GIF's page on the hosting platform. */
  readonly pageUrl: string;
};

/**
 * GIPHY username whose uploads are shown on the page. A `@<username>` search
 * against the GIPHY API returns exactly this channel's GIFs (see lib/breadfriend).
 */
export const giphyUsername = "thehouseofwizards";

/**
 * All-time channel views. GIPHY's API does not expose this number, so it is
 * maintained by hand — update it periodically from the GIPHY channel dashboard.
 */
export const channelViewsLabel = "57M+";

export type BreadfriendChannel = {
  readonly platform: BreadfriendPlatform;
  readonly label: string;
  /** The channel / profile URL on the platform. */
  readonly url: string;
};

/**
 * Links to the official Breadfriend channels on each platform.
 */
export const breadfriendChannels: readonly BreadfriendChannel[] = [
  {
    platform: "giphy",
    label: "GIPHY",
    url: "https://giphy.com/thehouseofwizards",
  },
  {
    platform: "klipy",
    label: "KLIPY",
    url: "https://klipy.com/profile/thehouseofwizards",
  },
];

/**
 * Curated fallback GIFs, used only if the GIPHY API is unavailable (missing key
 * or failed request). The live page is normally populated dynamically from the
 * GIPHY channel via `fetchGiphyChannelGifs()`.
 */
export const breadfriendFallbackGifs: readonly BreadfriendGif[] = [
  {
    id: "qYoFNPwjeBMvS4rW9A",
    title: "Burning On Fire",
    platform: "giphy",
    previewUrl: "https://media.giphy.com/media/qYoFNPwjeBMvS4rW9A/giphy.gif",
    downloadUrl: "https://media.giphy.com/media/qYoFNPwjeBMvS4rW9A/giphy.gif",
    pageUrl:
      "https://giphy.com/gifs/thehouseofwizards-this-is-fine-im-everything-qYoFNPwjeBMvS4rW9A",
  },
  {
    id: "mNQkwpFEHJTg8k0Tgn",
    title: "Awkward Oh No",
    platform: "giphy",
    previewUrl: "https://media.giphy.com/media/mNQkwpFEHJTg8k0Tgn/giphy.gif",
    downloadUrl: "https://media.giphy.com/media/mNQkwpFEHJTg8k0Tgn/giphy.gif",
    pageUrl:
      "https://giphy.com/gifs/thehouseofwizards-disappointed-facepalm-face-palm-mNQkwpFEHJTg8k0Tgn",
  },
  {
    id: "6bqC5dagbCEiTG63rr",
    title: "Excuse Me What",
    platform: "giphy",
    previewUrl: "https://media.giphy.com/media/6bqC5dagbCEiTG63rr/giphy.gif",
    downloadUrl: "https://media.giphy.com/media/6bqC5dagbCEiTG63rr/giphy.gif",
    pageUrl:
      "https://giphy.com/gifs/thehouseofwizards-what-huh-the-6bqC5dagbCEiTG63rr",
  },
  {
    id: "JB7M9N9YiIra9gXpAW",
    title: "Confused No Idea",
    platform: "giphy",
    previewUrl: "https://media.giphy.com/media/JB7M9N9YiIra9gXpAW/giphy.gif",
    downloadUrl: "https://media.giphy.com/media/JB7M9N9YiIra9gXpAW/giphy.gif",
    pageUrl:
      "https://giphy.com/gifs/thehouseofwizards-idk-shrug-i-dont-know-JB7M9N9YiIra9gXpAW",
  },
  {
    id: "GgLftYVTEpXRn9BQQ2",
    title: "Excited Lets Go",
    platform: "giphy",
    previewUrl: "https://media.giphy.com/media/GgLftYVTEpXRn9BQQ2/giphy.gif",
    downloadUrl: "https://media.giphy.com/media/GgLftYVTEpXRn9BQQ2/giphy.gif",
    pageUrl:
      "https://giphy.com/gifs/thehouseofwizards-lets-go-winner-gooo-GgLftYVTEpXRn9BQQ2",
  },
  {
    id: "V9faW9LmrNKICOs2Hu",
    title: "Trick Or Treat Candy",
    platform: "giphy",
    previewUrl: "https://media.giphy.com/media/V9faW9LmrNKICOs2Hu/giphy.gif",
    downloadUrl: "https://media.giphy.com/media/V9faW9LmrNKICOs2Hu/giphy.gif",
    pageUrl:
      "https://giphy.com/gifs/thehouseofwizards-happy-halloween-trick-or-treat-alloween-V9faW9LmrNKICOs2Hu",
  },
  {
    id: "9NV2IJMxZAZ09ulYSo",
    title: "Tired Worn Out",
    platform: "giphy",
    previewUrl: "https://media.giphy.com/media/9NV2IJMxZAZ09ulYSo/giphy.gif",
    downloadUrl: "https://media.giphy.com/media/9NV2IJMxZAZ09ulYSo/giphy.gif",
    pageUrl:
      "https://giphy.com/gifs/thehouseofwizards-tired-sleepy-exhausted-9NV2IJMxZAZ09ulYSo",
  },
  {
    id: "HG8Klrz9rKAGPjqc4R",
    title: "Sexy Blue Steel",
    platform: "giphy",
    previewUrl: "https://media.giphy.com/media/HG8Klrz9rKAGPjqc4R/giphy.gif",
    downloadUrl: "https://media.giphy.com/media/HG8Klrz9rKAGPjqc4R/giphy.gif",
    pageUrl:
      "https://giphy.com/gifs/thehouseofwizards-zoolander-smolder-blue-steel-HG8Klrz9rKAGPjqc4R",
  },
  {
    id: "tOBtlgkmS1gJxfCVxs",
    title: "Scared Trick Or Treat",
    platform: "giphy",
    previewUrl: "https://media.giphy.com/media/tOBtlgkmS1gJxfCVxs/giphy.gif",
    downloadUrl: "https://media.giphy.com/media/tOBtlgkmS1gJxfCVxs/giphy.gif",
    pageUrl:
      "https://giphy.com/gifs/thehouseofwizards-halloween-spooky-happy-tOBtlgkmS1gJxfCVxs",
  },
  {
    id: "cw7lU1UAqXK8GuCblT",
    title: "Awkward Side Eye",
    platform: "giphy",
    previewUrl: "https://media.giphy.com/media/cw7lU1UAqXK8GuCblT/giphy.gif",
    downloadUrl: "https://media.giphy.com/media/cw7lU1UAqXK8GuCblT/giphy.gif",
    pageUrl:
      "https://giphy.com/gifs/thehouseofwizards-side-eye-suspicious-skeptical-cw7lU1UAqXK8GuCblT",
  },
];
