"use client";
/* Pre-sized WebP files are generated at import; signed URLs are served directly. */
/* eslint-disable @next/next/no-img-element */
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Search,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
} from "lucide-react";
import { coverFile, filterArtworks, shuffleArtworks } from "@/lib/art";
import type { ArtCatalog, Artwork } from "@/types/art";
import { ArtworkViewer } from "./ArtworkViewer";
import "./art.css";

type Props = {
  catalog: ArtCatalog;
  directory?: boolean;
  initialArtist?: string;
  initialCollection?: string;
  initialToken?: string;
};
export const ArtGallery = ({
  catalog,
  directory = false,
  initialArtist = "",
  initialCollection = "",
  initialToken = "",
}: Props) => {
  const [query, setQuery] = useState("");
  const [artist, setArtist] = useState(initialArtist);
  const [collection, setCollection] = useState(initialCollection);
  const [token, setToken] = useState(initialToken);
  const [visible, setVisible] = useState(24);
  const [selected, setSelected] = useState<Artwork | null>(null);
  const viewerOpen = selected !== null;
  const [filtersOpen, setFiltersOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const search = useDeferredValue(query);
  const [randomOrder, setRandomOrder] = useState(catalog.artworks);
  useEffect(() => {
    setRandomOrder(shuffleArtworks(catalog.artworks));
  }, [catalog.artworks]);
  useEffect(() => {
    setArtist(initialArtist);
    setCollection(initialCollection);
    setToken(initialToken);
    setSelected(null);
  }, [initialArtist, initialCollection, initialToken]);
  const artistMap = useMemo(
    () => new Map(catalog.artists.map((a) => [a.id, a])),
    [catalog.artists],
  );
  const works = useMemo(
    () =>
      !search.trim() && !artist && !collection && !token.trim()
        ? randomOrder
        : filterArtworks(catalog.artworks, search, artist, collection, token),
    [catalog.artworks, randomOrder, search, artist, collection, token],
  );
  const collections = Array.from(
    new Set(catalog.artworks.flatMap((a) => a.assets.map((t) => t.collection))),
  ).sort();
  const artists = catalog.artists.filter(
    (a) => !search || a.name.toLowerCase().includes(search.toLowerCase()),
  );
  useEffect(() => {
    setVisible(24);
  }, [search, artist, collection, token]);
  useEffect(() => {
    if (!viewerOpen) return;
    const modal = dialog.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modal?.showModal();
    return () => {
      modal?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [viewerOpen]);
  const navigate = (direction: number) => {
    if (!selected) return;
    const index = works.findIndex((w) => w.id === selected.id) + direction;
    if (works[index]) setSelected(works[index]);
  };
  const clear = () => {
    setQuery("");
    setArtist("");
    setCollection("");
    setToken("");
  };
  return (
    <div className="art-shell">
      <header className="art-header">
        <div>
          <p className="art-eyebrow">
            <span /> HOUSE OF WIZARDS · MINISTRY OF ART
          </p>
          <h1>
            Made of <em>magic.</em>
          </h1>
          <p className="art-intro">
            A world imagined together. Discover the artists and original works
            bringing the Runiverse to life.
          </p>
        </div>
        <div className="art-stat">
          <strong>{catalog.artworks.length}</strong>
          <span>works of imagination</span>
        </div>
      </header>
      <div className="art-toolbar">
        <nav aria-label="Art navigation">
          <Link
            aria-current={!directory ? "page" : undefined}
            className={!directory ? "active" : ""}
            href="/art"
          >
            The collection <span>{catalog.artworks.length}</span>
          </Link>
          <Link
            aria-current={directory ? "page" : undefined}
            className={directory ? "active" : ""}
            href="/art/artists"
          >
            The artists <span>{catalog.artists.length}</span>
          </Link>
        </nav>
        <label className="art-search">
          <Search size={17} />
          <span className="sr-only">
            {directory ? "Search artists" : "Search artworks"}
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={directory ? "Find an artist…" : "Find a little magic…"}
          />
          {query && (
            <button aria-label="Clear search" onClick={() => setQuery("")}>
              <X size={15} />
            </button>
          )}
        </label>
        {!directory && (
          <button
            className="art-filter-toggle"
            aria-expanded={filtersOpen}
            aria-controls="art-filters"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <SlidersHorizontal size={17} /> Filters
          </button>
        )}
      </div>
      {!directory && (
        <div
          id="art-filters"
          className={`art-filters ${filtersOpen ? "open" : ""}`}
        >
          <label>
            Artist
            <select value={artist} onChange={(e) => setArtist(e.target.value)}>
              <option value="">All artists</option>
              {catalog.artists.map((a) => (
                <option value={a.id} key={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Collection
            <select
              value={collection}
              onChange={(e) => setCollection(e.target.value)}
            >
              <option value="">All collections</option>
              {collections.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label>
            Token ID
            <input
              inputMode="numeric"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="e.g. 6318"
            />
          </label>
          <span className="art-result-count" aria-live="polite">
            {works.length} {works.length === 1 ? "artwork" : "artworks"}
          </span>
          {(artist || collection || token) && (
            <button onClick={clear} className="art-clear">
              Reset filters <X size={13} />
            </button>
          )}
        </div>
      )}
      {directory ? (
        <div className="art-artist-grid">
          {artists.map((a) => {
            const artistWorks = catalog.artworks.filter(
              (w) => w.artist_id === a.id,
            );
            return (
              <Link
                className="art-artist-card"
                key={a.id}
                href={`/art?artist=${a.id}`}
              >
                <div className="art-artist-mosaic">
                  {artistWorks.slice(0, 3).map((w) => {
                    const cover = coverFile(w);
                    return cover?.url ? (
                      <img
                        key={w.id}
                        src={cover.url}
                        alt=""
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div key={w.id} className="art-placeholder" />
                    );
                  })}
                </div>
                <div className="art-artist-info">
                  {a.avatarUrl ? (
                    <img
                      src={a.avatarUrl}
                      alt=""
                      className="art-avatar"
                      loading="lazy"
                      width={64}
                      height={64}
                    />
                  ) : (
                    <span className="art-avatar art-initials">
                      {a.name.slice(0, 2)}
                    </span>
                  )}
                  <h2>{a.name}</h2>
                  <span>
                    {artistWorks.length}{" "}
                    {artistWorks.length === 1 ? "artwork" : "artworks"}
                  </span>
                  <ArrowUpRight size={20} />
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <>
          <div className="art-grid">
            {works.slice(0, visible).map((work, index) => {
              const cover = coverFile(work);
              const credit = artistMap.get(work.artist_id);
              return (
                <article className="art-card" key={work.id}>
                  <Link
                    href={`/art/${work.id}`}
                    className="art-card-image"
                    onClick={(event) => {
                      event.preventDefault();
                      setSelected(work);
                    }}
                  >
                    {cover?.url ? (
                      <img
                        src={cover.url}
                        alt={work.title}
                        width={cover.width ?? 640}
                        height={cover.height ?? 640}
                        loading={index < 4 ? "eager" : "lazy"}
                        decoding="async"
                      />
                    ) : (
                      <div className="art-placeholder">
                        <span>WORDS OF MAGIC</span>
                        <strong>{work.title}</strong>
                      </div>
                    )}
                    <span className="art-card-open">
                      <ArrowUpRight size={19} />
                    </span>
                    {work.files.filter((f) => f.variant === "original").length >
                      1 && (
                      <span className="art-comic-label">
                        Comic ·{" "}
                        {
                          work.files.filter((f) => f.variant === "original")
                            .length
                        }{" "}
                        pages
                      </span>
                    )}
                  </Link>
                  <div className="art-card-caption">
                    <div>
                      <Link
                        href={`/art/${work.id}`}
                        onClick={(event) => {
                          event.preventDefault();
                          setSelected(work);
                        }}
                      >
                        <h2>{work.title}</h2>
                      </Link>
                      <Link
                        href={`/art?artist=${work.artist_id}`}
                        className="art-card-artist"
                      >
                        {credit?.name ?? "Artist"}
                      </Link>
                    </div>
                    {work.funded && (
                      <span
                        className="art-funded-mark"
                        title="Funded by the House of Wizards"
                        aria-label="Funded by the House of Wizards"
                      >
                        <Heart size={14} />
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
          {visible < works.length && (
            <button
              className="art-load-more"
              onClick={() => setVisible((n) => n + 24)}
            >
              Discover more <span>{works.length - visible} artworks</span>
            </button>
          )}
        </>
      )}
      {(directory ? artists.length === 0 : works.length === 0) && (
        <div className="art-empty">
          <h2>No magic here. Yet.</h2>
          <p>
            {catalog.artworks.length
              ? "Try another artist, collection, or token."
              : "The collection is being prepared. Come back soon."}
          </p>
          {catalog.artworks.length > 0 && (
            <button onClick={clear}>Clear filters</button>
          )}
        </div>
      )}
      <footer className="art-colophon">
        <span>Art makes the world real.</span>
        <p>Original works. Independent artists. One shared Runiverse.</p>
      </footer>
      {selected && (
        <dialog
          ref={dialog}
          className="art-dialog"
          aria-label={selected.title}
          onClose={() => setSelected(null)}
        >
          <div className="art-dialog-controls">
            <button
              aria-label="Previous artwork"
              disabled={works.findIndex((w) => w.id === selected.id) === 0}
              onClick={() => navigate(-1)}
            >
              <ChevronLeft />
            </button>
            <button
              aria-label="Next artwork"
              disabled={
                works.findIndex((w) => w.id === selected.id) ===
                works.length - 1
              }
              onClick={() => navigate(1)}
            >
              <ChevronRight />
            </button>
            <button
              autoFocus
              aria-label="Close artwork"
              onClick={() => setSelected(null)}
            >
              <X />
            </button>
          </div>
          <ArtworkViewer
            key={selected.id}
            artwork={selected}
            artist={artistMap.get(selected.artist_id)}
            onBack={() => setSelected(null)}
          />
        </dialog>
      )}
    </div>
  );
};
