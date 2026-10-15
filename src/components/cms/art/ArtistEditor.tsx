"use client";
/* Stored avatars are already resized WebP files. */
/* eslint-disable @next/next/no-img-element */
import { useState, type FormEvent } from "react";
import type { CMSArtist } from "@/types/cms-art";
import { saveEntry } from "./client";
export const fieldClass =
  "mt-2 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2.5 text-neutral-100";
export const ArtistEditor = ({
  entry,
  onSaved,
  onCancel,
}: {
  entry?: CMSArtist;
  onSaved: () => Promise<void>;
  onCancel: () => void;
}) => {
  const [name, setName] = useState(entry?.name ?? "");
  const [portfolio, setPortfolio] = useState(entry?.portfolio_url ?? "");
  const [source, setSource] = useState(entry?.profile_image_source_url ?? "");
  const [links, setLinks] = useState(
    entry?.commission_artist_links.map(({ kind, value }) => ({
      kind,
      value,
    })) ?? [],
  );
  const [photo, setPhoto] = useState<File | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const form = new FormData();
      form.set(
        "data",
        JSON.stringify({
          name,
          portfolio_url: portfolio,
          profile_image_source_url: source,
          remove_photo: removePhoto,
          links,
          expected_updated_at: entry?.updated_at,
        }),
      );
      if (photo) form.set("photo", photo);
      await saveEntry("artists", entry?.id, form);
      await onSaved();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Save failed");
    } finally {
      setBusy(false);
    }
  };
  return (
    <form onSubmit={save} className="space-y-5">
      <fieldset disabled={busy} className="space-y-5 disabled:opacity-60">
        <label className="block text-sm">
          Artist name
          <input
            className={fieldClass}
            required
            maxLength={200}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          Main portfolio URL
          <input
            className={fieldClass}
            type="url"
            value={portfolio}
            onChange={(e) => setPortfolio(e.target.value)}
            placeholder="https://…"
          />
        </label>
        {entry?.avatar_url && (
          <img
            src={entry.avatar_url}
            alt={`${entry.name} current profile`}
            width={80}
            height={80}
            className="h-20 w-20 rounded-full object-cover"
          />
        )}
        <label className="block text-sm">
          Profile photo
          <input
            className={fieldClass}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp,image/avif,image/tiff"
            onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
          />
          <span className="mt-2 block text-xs text-neutral-400">
            The original is kept; a small square avatar is generated
            automatically.
          </span>
        </label>
        {entry?.profile_image_path && (
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={removePhoto}
              onChange={(e) => setRemovePhoto(e.target.checked)}
            />
            Remove current profile photo
          </label>
        )}
        <label className="block text-sm">
          Photo source URL (optional)
          <input
            className={fieldClass}
            type="url"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
        </label>
        <div>
          <h4 className="mb-3 text-sm">
            Additional portfolio and social links
          </h4>
          {links.map((link, index) => (
            <div key={index} className="mb-3 flex flex-wrap items-end gap-2">
              <label className="text-xs">
                Type
                <select
                  className={fieldClass}
                  value={link.kind}
                  onChange={(e) =>
                    setLinks(
                      links.map((item, i) =>
                        i === index
                          ? {
                              ...item,
                              kind: e.target.value as typeof link.kind,
                            }
                          : item,
                      ),
                    )
                  }
                >
                  {[
                    "portfolio",
                    "twitter",
                    "instagram",
                    "discord",
                    "tiktok",
                    "other",
                  ].map((kind) => (
                    <option key={kind}>{kind}</option>
                  ))}
                </select>
              </label>
              <label className="min-w-[180px] flex-1 text-xs">
                URL
                <input
                  className={fieldClass}
                  type="url"
                  required
                  value={link.value}
                  onChange={(e) =>
                    setLinks(
                      links.map((item, i) =>
                        i === index ? { ...item, value: e.target.value } : item,
                      ),
                    )
                  }
                />
              </label>
              <button
                type="button"
                className="px-2 py-3 text-red-400"
                aria-label={`Remove link ${index + 1}`}
                onClick={() => setLinks(links.filter((_, i) => i !== index))}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="text-sm text-brand-400 underline"
            onClick={() =>
              setLinks([...links, { kind: "portfolio", value: "" }])
            }
          >
            Add link
          </button>
        </div>
      </fieldset>
      {error && (
        <p role="alert" className="text-red-400">
          {error}
        </p>
      )}
      <div className="flex gap-3">
        <button
          disabled={busy}
          className="rounded-lg bg-brand-500 px-5 py-2 text-black disabled:opacity-50"
          type="submit"
        >
          {busy ? "Saving…" : "Save artist"}
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
