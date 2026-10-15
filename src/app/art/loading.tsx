export default function ArtLoading() {
  return (
    <div
      role="status"
      aria-label="Loading art"
      className="mx-auto max-w-7xl animate-pulse px-6 py-12"
    >
      <div className="mb-10 h-20 w-2/3 rounded-2xl bg-neutral-800" />
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="aspect-[3/4] rounded-2xl bg-neutral-900" />
        ))}
      </div>
    </div>
  );
}
