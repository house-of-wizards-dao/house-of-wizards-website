"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import type { CMSArtist, CMSArtwork } from "@/types/cms-art";
import { fieldClass } from "./ArtistEditor";
import { saveEntry } from "./client";
export const ArtworkEditor = ({
  entry,
  artists,
  onSaved,
  onCancel,
}: {
  entry?: CMSArtwork;
  artists: CMSArtist[];
  onSaved: () => Promise<void>;
  onCancel: () => void;
}) => {
  const originals =
    entry?.commission_artwork_files
      .filter((f) => f.variant === "original")
      .sort((a, b) => (a.page_number ?? 0) - (b.page_number ?? 0)) ?? [];
  const [artist, setArtist] = useState(entry?.artist_id ?? "");
  const [title, setTitle] = useState(entry?.title ?? "");
  const [description, setDescription] = useState(entry?.description ?? "");
  const [medium, setMedium] = useState(entry?.medium ?? "");
  const [funded, setFunded] = useState(entry?.funded ?? true);
  const [external, setExternal] = useState(entry?.external_url ?? "");
  const [notes, setNotes] = useState(entry?.featured_assets_source_text ?? "");
  const [tokens, setTokens] = useState(
    entry?.commission_artwork_rune_assets
      .map(
        ({ commission_rune_assets: asset }) =>
          `${asset.collection}:${asset.asset_identifier}`,
      )
      .join("\n") ?? "",
  );
  const [comic, setComic] = useState(originals.length > 1);
  const [removed, setRemoved] = useState<string[]>([]);
  const [pages, setPages] = useState(
    originals.map((file, index) => ({
      id: file.id,
      page_number: file.page_number ?? index + 1,
    })),
  );
  const [files, setFiles] = useState<File[]>([]);
  const [poster, setPoster] = useState<File | null>(null);
  const [preview, setPreview] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const assets = tokens
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const parts = line.split(":");
          if (parts.length !== 2)
            throw new Error(
              "Enter each token as collection:ID, for example wizards:6318",
            );
          return {
            collection: parts[0].trim().toLowerCase(),
            asset_identifier: parts[1].trim(),
          };
        });
      const form = new FormData();
      form.set(
        "data",
        JSON.stringify({
          artist_id: artist,
          title,
          description,
          medium,
          funded,
          external_url: external,
          featured_assets_source_text: notes,
          assets,
          comic,
          remove_file_ids: removed,
          pages: comic
            ? pages.filter((page) => !removed.includes(page.id))
            : [],
          expected_updated_at: entry?.updated_at,
        }),
      );
      for (const file of files) form.append("originals", file);
      if (poster) form.set("poster", poster);
      if (preview) form.set("web_preview", preview);
      await saveEntry("artworks", entry?.id, form);
      await onSaved();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Save failed");
    } finally {
      setBusy(false);
    }
  };
  return (
    <form className="space-y-5" onSubmit={save}>
      <fieldset disabled={busy} className="space-y-5 disabled:opacity-60">
        <label className="block text-sm">
          Artist
          <select
            required
            className={fieldClass}
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
          >
            <option value="">Select artist</option>
            {artists.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </label>
        {!artists.length && (
          <p className="text-sm text-neutral-400">
            Add an artist in the Artists section first.
          </p>
        )}
        <label className="block text-sm">
          Fallback title
          <input
            className={fieldClass}
            maxLength={300}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <span className="mt-2 block text-xs text-neutral-400">
            Linked characters supply the gallery title automatically. This title
            is used when no character can be identified.
          </span>
        </label>
        <label className="block text-sm">
          Description
          <textarea
            rows={3}
            className={fieldClass}
            maxLength={10000}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="block text-sm">
            Medium
            <input
              className={fieldClass}
              maxLength={200}
              placeholder="Illustration, comic, animation…"
              value={medium}
              onChange={(e) => setMedium(e.target.value)}
            />
          </label>
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={funded}
              onChange={(e) => setFunded(e.target.checked)}
            />
            Funded by the DAO
          </label>
        </div>
        <label className="block text-sm">
          Featured tokens
          <textarea
            className={fieldClass}
            rows={4}
            placeholder={"wizards:6318\nwarriors:9380"}
            value={tokens}
            onChange={(e) => setTokens(e.target.value)}
          />
          <span className="mt-2 block text-xs text-neutral-400">
            One collection:ID per line. Collections: wizards, warriors, souls,
            ponies, beasts, athenaeum, shadows.
          </span>
        </label>
        <details>
          <summary className="cursor-pointer text-sm text-neutral-400">
            Original subject notes
          </summary>
          <textarea
            aria-label="Original subject notes"
            className={fieldClass}
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <p className="mt-2 text-xs text-neutral-500">
            Exact character names here may supply a title when no tokens are
            linked. Clear outdated notes when changing the subjects.
          </p>
        </details>
        <label className="block text-sm">
          External artwork or Book of Lore URL
          <input
            type="url"
            className={fieldClass}
            placeholder="https://…"
            value={external}
            onChange={(e) => setExternal(e.target.value)}
          />
        </label>
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={comic}
            onChange={(e) => setComic(e.target.checked)}
          />
          This artwork is a comic with ordered pages
        </label>
        {originals.length > 0 && (
          <div>
            <h4 className="mb-3 text-sm">Current originals</h4>
            <p className="mb-3 text-xs text-neutral-400">
              Remove an original to replace it. Its generated previews are
              removed with it when saved.
            </p>
            <ul className="space-y-3">
              {originals.map((file, index) => (
                <li
                  key={file.id}
                  className="flex flex-wrap items-center gap-3 rounded border border-neutral-700 p-3"
                >
                  <label className="flex min-w-0 flex-1 items-center gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={removed.includes(file.id)}
                      onChange={(e) =>
                        setRemoved(
                          e.target.checked
                            ? [...removed, file.id]
                            : removed.filter((id) => id !== file.id),
                        )
                      }
                    />
                    <span
                      className={
                        removed.includes(file.id)
                          ? "line-through text-neutral-500"
                          : ""
                      }
                    >
                      Remove {file.original_filename}
                    </span>
                  </label>
                  {comic && (
                    <label className="text-xs">
                      Page
                      <input
                        aria-label={`Page for ${file.original_filename}`}
                        className="ml-2 w-20 rounded bg-neutral-800 p-2"
                        type="number"
                        min={1}
                        max={1000}
                        required={!removed.includes(file.id)}
                        disabled={removed.includes(file.id)}
                        value={pages[index]?.page_number ?? index + 1}
                        onChange={(e) =>
                          setPages(
                            pages.map((page) =>
                              page.id === file.id
                                ? {
                                    ...page,
                                    page_number: Number(e.target.value),
                                  }
                                : page,
                            ),
                          )
                        }
                      />
                    </label>
                  )}
                  <Link
                    target="_blank"
                    className="text-xs text-brand-400 underline"
                    href={`/api/art/${entry?.id}/download?file=${file.id}`}
                  >
                    Download
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        <label className="block text-sm">
          {comic
            ? "Add original comic pages (in file order)"
            : "Original artwork file"}
          <input
            className={fieldClass}
            type="file"
            multiple={comic}
            accept="image/jpeg,image/png,image/gif,image/webp,image/avif,image/tiff,video/mp4,video/webm,video/quicktime,audio/*,application/pdf"
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          />
          <span className="mt-2 block text-xs text-neutral-400">
            Images up to 50 MB; video, audio and PDF up to 100 MB. Images get
            web previews automatically. Separate files are separate artworks,
            except comic pages.
          </span>
        </label>
        <details>
          <summary className="cursor-pointer text-sm text-neutral-300">
            Video, audio and PDF previews
          </summary>
          <p className="my-3 text-xs text-neutral-400">
            For a new non-image original, you can add a cover image. Videos and
            audio can also have a smaller web encode; otherwise playback loads
            the original only when opened.
          </p>
          <label className="block text-sm">
            Cover image
            <input
              className={fieldClass}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setPoster(e.target.files?.[0] ?? null)}
            />
          </label>
          <label className="mt-3 block text-sm">
            Web video or audio
            <input
              className={fieldClass}
              type="file"
              accept="video/mp4,video/webm,audio/mpeg,audio/ogg,audio/mp4"
              onChange={(e) => setPreview(e.target.files?.[0] ?? null)}
            />
          </label>
        </details>
      </fieldset>
      {error && (
        <p role="alert" className="text-red-400">
          {error}
        </p>
      )}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={busy || !artists.length}
          className="rounded-lg bg-brand-500 px-5 py-2 text-black disabled:opacity-50"
        >
          {busy ? "Uploading and saving…" : "Save artwork"}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={onCancel}
          className="rounded-lg border border-neutral-600 px-5 py-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
