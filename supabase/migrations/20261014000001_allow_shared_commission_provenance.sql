-- Some known artworks belong to one of two accepted requests by the same artist.
-- Their gallery credit is certain even when a spreadsheet row is not.
alter table public.commission_artworks alter column source_row drop not null;
