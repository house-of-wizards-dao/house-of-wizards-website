import { Suspense } from "react";
import { GalleryProvider } from "@/contexts/GalleryContext";
import { PageLoader } from "@/components/PageLoader";
import { GalleryContent } from "./GalleryContent";

export default function GalleryPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <GalleryProvider>
        <GalleryContent />
      </GalleryProvider>
    </Suspense>
  );
}
