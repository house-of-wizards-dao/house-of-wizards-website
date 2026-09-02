alter table public.documents
  add column if not exists parent_id bigint,
  add column if not exists source_url text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'documents_parent_id_fkey'
      and conrelid = 'public.documents'::regclass
  ) then
    alter table public.documents
      add constraint documents_parent_id_fkey
      foreign key (parent_id)
      references public.documents(id)
      on delete set null;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'documents_parent_not_self_check'
      and conrelid = 'public.documents'::regclass
  ) then
    alter table public.documents
      add constraint documents_parent_not_self_check
      check (parent_id is null or parent_id <> id);
  end if;
end
$$;

create index if not exists documents_parent_id_idx
  on public.documents (parent_id);

create unique index if not exists documents_source_url_unique_idx
  on public.documents (source_url)
  where source_url is not null;

drop index if exists public.documents_public_listing_idx;

create index documents_public_listing_idx
  on public.documents (category_order, category, date desc, id desc)
  where status = 'published' and parent_id is null;

comment on column public.documents.parent_id is
  'Parent document for Notion-style subpage navigation; null for Documents index entries.';
comment on column public.documents.source_url is
  'Canonical source URL used to identify imported documents idempotently.';
