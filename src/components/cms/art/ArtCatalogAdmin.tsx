"use client";
/* CMS thumbnails are already resized server-side. */
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import {
  cmsArtistSchema,
  cmsArtworkSchema,
  type CMSArtist,
  type CMSArtwork,
} from "@/types/cms-art";
import { ArtistEditor } from "./ArtistEditor";
import { ArtworkEditor } from "./ArtworkEditor";

import { fetchArtEntries } from "./client";
type Kind = "artists" | "artworks";
export const ArtCatalogAdmin = ({ kind }: { kind: Kind }) => {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [artist, setArtist] = useState("");
  const [editing, setEditing] = useState<CMSArtist | CMSArtwork | "new" | null>(
    null,
  );
  const [deleting, setDeleting] = useState<{ id: string; name: string } | null>(
    null,
  );
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const artists = useQuery({
    queryKey: ["cms-art", "artists"],
    queryFn: async () =>
      z.array(cmsArtistSchema).parse(await fetchArtEntries("artists")),
  });
  const artworks = useQuery({
    queryKey: ["cms-art", "artworks"],
    queryFn: async () =>
      z.array(cmsArtworkSchema).parse(await fetchArtEntries("artworks")),
    enabled: kind === "artworks",
  });
  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["cms-art"] });
  };
  const saved = async () => {
    setEditing(null);
    setMessage("Saved. The public gallery has been updated.");
    await refresh();
  };
  const remove = async () => {
    if (!deleting) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/cms/art/${kind}/${deleting.id}`, {
        method: "DELETE",
      });
      const result = z
        .object({ error: z.string().optional() })
        .parse(await response.json());
      if (!response.ok) throw new Error(result.error ?? "Delete failed");
      setDeleting(null);
      setMessage("Entry deleted.");
      await refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  };
  const artistNames = new Map(
    (artists.data ?? []).map((entry) => [entry.id, entry.name]),
  );
  const matches = (value: string) =>
    value.toLowerCase().includes(query.trim().toLowerCase());
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-3xl text-brand-400">
            {kind === "artists" ? "Artists" : "Artworks"}
          </h2>
          <p className="mt-2 text-sm text-neutral-400">
            Manage the House collection and the artists behind it.
          </p>
        </div>
        <button
          className="rounded-lg bg-brand-500 px-4 py-2 text-black disabled:opacity-50"
          disabled={!!editing}
          onClick={() => {
            setEditing("new");
            setMessage("");
            setError("");
          }}
        >
          Add {kind === "artists" ? "artist" : "artwork"}
        </button>
      </header>
      <nav aria-label="Art catalog">
        <Link
          className="mr-5 text-brand-400 underline"
          href="/cms/art/artworks"
        >
          Artworks
        </Link>
        <Link className="text-brand-400 underline" href="/cms/art/artists">
          Artists
        </Link>
        <Link className="ml-5 text-neutral-400" href="/art" target="_blank">
          View gallery ↗
        </Link>
      </nav>
      {message && (
        <p role="status" className="text-green-400">
          {message}
        </p>
      )}
      {error && (
        <p role="alert" className="text-red-400">
          {error}
        </p>
      )}
      {editing && (
        <section className="rounded-xl border border-neutral-700 bg-neutral-900 p-5 md:p-8">
          <h3 className="mb-5 text-xl">
            {editing === "new" ? "Add" : "Edit"}{" "}
            {kind === "artists" ? "artist" : "artwork"}
          </h3>
          {kind === "artists" ? (
            <ArtistEditor
              key={editing === "new" ? "new" : editing.id}
              entry={
                editing === "new" ? undefined : cmsArtistSchema.parse(editing)
              }
              onSaved={saved}
              onCancel={() => setEditing(null)}
            />
          ) : (
            <ArtworkEditor
              key={editing === "new" ? "new" : editing.id}
              entry={
                editing === "new" ? undefined : cmsArtworkSchema.parse(editing)
              }
              artists={artists.data ?? []}
              onSaved={saved}
              onCancel={() => setEditing(null)}
            />
          )}
        </section>
      )}
      {deleting && (
        <section
          role="alertdialog"
          aria-label="Confirm deletion"
          aria-describedby="art-delete-description"
          className="rounded-xl border border-red-500/40 bg-neutral-900 p-5"
        >
          <h3 className="text-xl text-red-400">Delete {deleting.name}?</h3>
          <p
            id="art-delete-description"
            className="my-4 text-sm text-neutral-300"
          >
            {kind === "artworks"
              ? "This removes the artwork and all its original files and previews permanently."
              : "This removes the artist and their profile images. Artists with artworks must have those works reassigned or deleted first."}
          </p>
          <div className="flex gap-3">
            <button
              disabled={busy}
              className="rounded bg-red-600 px-4 py-2 disabled:opacity-50"
              onClick={remove}
            >
              {busy ? "Deleting…" : "Delete permanently"}
            </button>
            <button
              disabled={busy}
              className="rounded border border-neutral-600 px-4 py-2"
              onClick={() => setDeleting(null)}
            >
              Cancel
            </button>
          </div>
        </section>
      )}
      <div className="flex flex-wrap gap-3">
        <label className="flex-1 text-sm">
          Search
          <input
            className="mt-2 w-full rounded-lg border border-neutral-700 bg-neutral-900 p-3"
            placeholder={
              kind === "artists" ? "Artist name" : "Title, artist or token ID"
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        {kind === "artworks" && (
          <label className="text-sm">
            Artist
            <select
              className="mt-2 block rounded-lg border border-neutral-700 bg-neutral-900 p-3"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
            >
              <option value="">All artists</option>
              {artists.data?.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      {(artists.isLoading || (kind === "artworks" && artworks.isLoading)) && (
        <p role="status">Loading catalog…</p>
      )}
      {(artists.error || artworks.error) && (
        <div role="alert">
          <p className="text-red-400">Could not load the catalog.</p>
          <button onClick={refresh} className="mt-2 underline">
            Try again
          </button>
        </div>
      )}
      <div className="overflow-x-auto rounded-lg border border-neutral-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-900 text-neutral-400">
            <tr>
              <th className="p-4">
                {kind === "artists" ? "Artist" : "Artwork"}
              </th>
              <th className="p-4">
                {kind === "artists" ? "Works / portfolio" : "Artist / tokens"}
              </th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {kind === "artists"
              ? (artists.data ?? [])
                  .filter((a) => matches(a.name))
                  .map((a) => (
                    <tr key={a.id} className="border-t border-neutral-800">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {a.avatar_url && (
                            <img
                              src={a.avatar_url}
                              alt=""
                              width={48}
                              height={48}
                              className="h-12 w-12 rounded-full object-cover"
                            />
                          )}
                          <strong>{a.name}</strong>
                        </div>
                      </td>
                      <td className="p-4">
                        <p>{a.commission_artworks.length} artworks</p>
                        {a.portfolio_url && (
                          <a
                            className="text-brand-400"
                            target="_blank"
                            rel="noreferrer"
                            href={a.portfolio_url}
                          >
                            Portfolio ↗
                          </a>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-4">
                          <button
                            disabled={!!editing}
                            onClick={() => {
                              setEditing(a);
                              setMessage("");
                            }}
                            className="text-brand-400 disabled:opacity-50"
                          >
                            Edit<span className="sr-only"> {a.name}</span>
                          </button>
                          <button
                            disabled={busy || !!editing}
                            onClick={() => {
                              setDeleting({ id: a.id, name: a.name });
                              setError("");
                            }}
                            className="text-red-400 disabled:opacity-50"
                          >
                            Delete<span className="sr-only"> {a.name}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              : (artworks.data ?? [])
                  .filter(
                    (a) =>
                      (!artist || a.artist_id === artist) &&
                      matches(
                        [
                          a.title,
                          a.display_title,
                          artistNames.get(a.artist_id),
                          ...a.commission_artwork_rune_assets.map(
                            (link) =>
                              `${link.commission_rune_assets.collection} ${link.commission_rune_assets.asset_identifier}`,
                          ),
                        ].join(" "),
                      ),
                  )
                  .map((a) => (
                    <tr key={a.id} className="border-t border-neutral-800">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {a.preview_url && (
                            <img
                              src={a.preview_url}
                              alt=""
                              width={56}
                              height={64}
                              className="h-16 w-14 rounded object-cover"
                            />
                          )}
                          <div>
                            <strong>{a.display_title ?? a.title}</strong>
                            <p className="mt-1 text-xs text-neutral-500">
                              {a.funded ? "DAO funded" : "Not DAO funded"} ·{" "}
                              {
                                a.commission_artwork_files.filter(
                                  (f) => f.variant === "original",
                                ).length
                              }{" "}
                              originals
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p>{artistNames.get(a.artist_id)}</p>
                        <p className="mt-1 text-xs text-neutral-500">
                          {a.commission_artwork_rune_assets
                            .map(
                              (link) =>
                                `${link.commission_rune_assets.collection} #${link.commission_rune_assets.asset_identifier}`,
                            )
                            .join(", ")}
                        </p>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-4">
                          <button
                            disabled={!!editing}
                            onClick={() => {
                              setEditing(a);
                              setMessage("");
                            }}
                            className="text-brand-400 disabled:opacity-50"
                          >
                            Edit<span className="sr-only"> {a.title}</span>
                          </button>
                          <button
                            disabled={busy || !!editing}
                            onClick={() => {
                              setDeleting({ id: a.id, name: a.title });
                              setError("");
                            }}
                            className="text-red-400 disabled:opacity-50"
                          >
                            Delete<span className="sr-only"> {a.title}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
