alter table public.documents
  add column if not exists category_order integer not null default 0;

update public.documents
set category_order = case category
  when 'Introduction' then 1
  when 'Governance' then 2
  when 'Technology' then 3
  when 'Initiatives' then 4
  when 'Archives' then 5
  when 'Acknowledgements' then 6
  when 'Open Roles' then 8
  when 'Blog Posts' then 9
  else category_order
end;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'documents_category_order_check'
      and conrelid = 'public.documents'::regclass
  ) then
    alter table public.documents
      add constraint documents_category_order_check
      check (category_order >= 0);
  end if;
end
$$;

drop index if exists public.documents_public_listing_idx;

create index documents_public_listing_idx
  on public.documents (category_order, category, date desc, id desc)
  where status = 'published';

comment on column public.documents.category_order is
  'Ordinal position of the category section on the public page.';
