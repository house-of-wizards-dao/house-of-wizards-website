"use client";
export default function ArtError({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="font-heading text-3xl">The gallery couldn’t load.</h1>
      <p className="my-5 text-neutral-400">Please try again in a moment.</p>
      <button
        onClick={reset}
        className="rounded-full bg-brand-500 px-6 py-3 text-white"
      >
        Try again
      </button>
    </div>
  );
}
