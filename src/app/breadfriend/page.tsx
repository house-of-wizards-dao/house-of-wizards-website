import type { Metadata } from "next";
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

export default function BreadfriendPage() {
  return <BreadfriendContent />;
}
