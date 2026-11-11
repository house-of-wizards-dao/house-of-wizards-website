// Channel metadata for the Breadfriend GIF showcase (`/breadfriend`).
// Media URLs come only from the current GIPHY response and are not persisted.

export type BreadfriendPlatform = "giphy" | "klipy";

export type BreadfriendGif = {
  /** Stable unique key (e.g. the GIPHY id or a short slug). */
  readonly id: string;
  /** Human-friendly title, used as the preview's alt text and download filename. */
  readonly title: string;
  /** Which platform hosts this GIF. */
  readonly platform: BreadfriendPlatform;
  /** Direct image URL used to render the preview (a .gif or animated .webp). */
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
