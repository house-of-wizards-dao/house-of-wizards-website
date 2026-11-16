import { Suspense } from "react";
import { GalleryProvider } from "@/contexts/GalleryContext";
import { Spinner } from "@/components/ui/Spinner";
import { GalleryContent } from "./GalleryContent";

export default function GalleryPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <GalleryProvider>
        <GalleryContent />
      </GalleryProvider>
    </Suspense>
  );
}
