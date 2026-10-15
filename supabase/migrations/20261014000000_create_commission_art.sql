-- Commissioned art catalog; original bytes and web derivatives are stored separately.
begin;

create table public.commission_artists (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) > 0),
  portfolio_url text,
  profile_image_bucket text,
  profile_image_path text,
  profile_image_source_url text,
  created_at timestamptz not null default now()
);

-- Additional portfolio/social profiles; artists can have more than one.
create table public.commission_artist_links (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references public.commission_artists(id),
  kind text not null check (kind in ('portfolio', 'twitter', 'instagram', 'discord', 'tiktok', 'other')),
  value text not null,
  unique (artist_id, kind, value)
);

create table public.commission_artworks (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references public.commission_artists(id),
  title text not null check (length(trim(title)) > 0),
  description text,
  funded boolean not null default false,
  source_spreadsheet_id text not null,
  source_sheet_gid text not null,
  source_row integer not null check (source_row > 0),
  medium text,
  featured_assets_source_text text,
  -- For writing hosted externally, such as the character's Book of Lore page.
  external_url text,
  created_at timestamptz not null default now(),
  -- A source row can commission multiple artworks; it is not a unique artwork key.
  constraint commission_artworks_external_url_nonempty check (external_url is null or length(trim(external_url)) > 0)
);
create index commission_artworks_artist_idx on public.commission_artworks(artist_id);

-- Each separate original is a separate artwork, except grouped comic pages.
-- Smaller web/thumbnail files are derivatives of an original, not new artworks.
create table public.commission_artwork_files (
  id uuid primary key default gen_random_uuid(),
  artwork_id uuid not null references public.commission_artworks(id),
  original_filename text not null,
  variant text not null check (variant in ('original', 'web', 'thumbnail')),
  original_file_id uuid,
  page_number integer check (page_number > 0),
  bucket_id text not null default 'commission-originals',
  object_path text not null,
  mime_type text not null,
  byte_size bigint not null check (byte_size >= 0),
  sha256 text not null check (sha256 ~ '^[0-9a-f]{64}$'),
  width integer check (width > 0),
  height integer check (height > 0),
  created_at timestamptz not null default now(),
  unique (bucket_id, object_path),
  unique (id, artwork_id),
  foreign key (original_file_id, artwork_id)
    references public.commission_artwork_files(id, artwork_id),
  check ((variant = 'original' and original_file_id is null)
    or (variant <> 'original' and original_file_id is not null)),
  check (original_file_id is null or original_file_id <> id)
);
create index commission_artwork_files_artwork_idx on public.commission_artwork_files(artwork_id);

-- Asset identifiers remain text so source identifiers need no guessed conversions.
create table public.commission_rune_assets (
  id uuid primary key default gen_random_uuid(),
  collection text not null,
  asset_identifier text not null,
  asset_url text,
  unique (collection, asset_identifier)
);
create table public.commission_artwork_rune_assets (
  artwork_id uuid not null references public.commission_artworks(id),
  rune_asset_id uuid not null references public.commission_rune_assets(id),
  primary key (artwork_id, rune_asset_id)
);
create index commission_artwork_rune_assets_asset_idx on public.commission_artwork_rune_assets(rune_asset_id);

alter table public.commission_artists enable row level security;
alter table public.commission_artist_links enable row level security;
alter table public.commission_artworks enable row level security;
alter table public.commission_artwork_files enable row level security;
alter table public.commission_rune_assets enable row level security;
alter table public.commission_artwork_rune_assets enable row level security;
revoke all on public.commission_artists, public.commission_artist_links, public.commission_artworks,
  public.commission_artwork_files, public.commission_rune_assets,
  public.commission_artwork_rune_assets from anon, authenticated;
grant all on public.commission_artists, public.commission_artist_links, public.commission_artworks,
  public.commission_artwork_files, public.commission_rune_assets,
  public.commission_artwork_rune_assets to service_role;

-- Originals stay private; the server issues short-lived download links.
-- Upload actual bytes through the Storage API, never by inserting storage.objects.
insert into storage.buckets (id, name, public)
values ('commission-originals', 'commission-originals', false)
on conflict (id) do nothing;

-- Web-sized images/posters/encodes are stored separately from untouched originals.
-- The gallery signs preview URLs on the server; no anonymous database access.
insert into storage.buckets (id, name, public)
values ('commission-web', 'commission-web', false)
on conflict (id) do nothing;

commit;
