begin;
alter table public.commission_artists add column updated_at timestamptz not null default now();
alter table public.commission_artists add column profile_image_original_path text;
alter table public.commission_artworks add column updated_at timestamptz not null default now();
alter table public.commission_artworks alter column source_spreadsheet_id drop not null;
alter table public.commission_artworks alter column source_sheet_gid drop not null;
update public.commission_artists a set profile_image_original_path = o.name
from storage.objects o where o.bucket_id='commission-originals'
and o.name like 'artists/' || a.id::text || '/original.%';

create table public.commission_storage_cleanup (
 bucket_id text not null check (bucket_id in ('commission-originals','commission-web')),
 object_path text not null,
 created_at timestamptz not null default now(),
 primary key(bucket_id,object_path)
);
alter table public.commission_storage_cleanup enable row level security;
revoke all on public.commission_storage_cleanup from anon,authenticated;
grant all on public.commission_storage_cleanup to service_role;

create function public.cms_save_commission_artist(p_id uuid,p_data jsonb,p_links jsonb)
returns uuid language plpgsql set search_path=public,pg_temp as $$
declare old public.commission_artists;
begin
 select * into old from public.commission_artists where id=p_id for update;
 if found then
  if old.updated_at <> (p_data->>'expected_updated_at')::timestamptz or p_data->>'expected_updated_at' is null then raise exception 'CONFLICT'; end if;
  if old.profile_image_path is distinct from p_data->>'profile_image_path' then
   insert into public.commission_storage_cleanup(bucket_id,object_path)
   select bucket_id,name from storage.objects where bucket_id in ('commission-originals','commission-web')
    and name like 'artists/' || p_id::text || '/%'
    and name is distinct from p_data->>'profile_image_path'
    and name is distinct from p_data->>'profile_image_original_path'
   on conflict do nothing;
  end if;
 else
  if p_data->>'expected_updated_at' is not null then raise exception 'NOT_FOUND'; end if;
 end if;
 insert into public.commission_artists(id,name,portfolio_url,profile_image_bucket,profile_image_path,profile_image_original_path,profile_image_source_url)
 values(p_id,p_data->>'name',p_data->>'portfolio_url',p_data->>'profile_image_bucket',p_data->>'profile_image_path',p_data->>'profile_image_original_path',p_data->>'profile_image_source_url')
 on conflict(id) do update set name=excluded.name,portfolio_url=excluded.portfolio_url,
 profile_image_bucket=excluded.profile_image_bucket,profile_image_path=excluded.profile_image_path,
 profile_image_original_path=excluded.profile_image_original_path,profile_image_source_url=excluded.profile_image_source_url,updated_at=clock_timestamp();
 delete from public.commission_artist_links where artist_id=p_id;
 insert into public.commission_artist_links(artist_id,kind,value)
 select p_id,x.kind,x.value from jsonb_to_recordset(p_links) as x(kind text,value text);
 return p_id;
end $$;

create function public.cms_save_commission_artwork(p_id uuid,p_data jsonb,p_assets jsonb,p_files jsonb,p_remove_ids uuid[])
returns uuid language plpgsql set search_path=public,pg_temp as $$
declare old public.commission_artworks; asset jsonb; asset_id uuid; page jsonb;
begin
 select * into old from public.commission_artworks where id=p_id for update;
 if found then
  if old.updated_at <> (p_data->>'expected_updated_at')::timestamptz or p_data->>'expected_updated_at' is null then raise exception 'CONFLICT'; end if;
 else
  if p_data->>'expected_updated_at' is not null then raise exception 'NOT_FOUND'; end if;
 end if;
 insert into public.commission_artworks(id,artist_id,title,description,funded,medium,featured_assets_source_text,external_url)
 values(p_id,(p_data->>'artist_id')::uuid,p_data->>'title',p_data->>'description',(p_data->>'funded')::boolean,p_data->>'medium',p_data->>'featured_assets_source_text',p_data->>'external_url')
 on conflict(id) do update set artist_id=excluded.artist_id,title=excluded.title,description=excluded.description,funded=excluded.funded,medium=excluded.medium,
 featured_assets_source_text=excluded.featured_assets_source_text,external_url=excluded.external_url,updated_at=clock_timestamp();
 insert into public.commission_storage_cleanup(bucket_id,object_path)
 select bucket_id,object_path from public.commission_artwork_files where artwork_id=p_id
 and (id=any(p_remove_ids) or original_file_id=any(p_remove_ids)) on conflict do nothing;
 delete from public.commission_artwork_files where artwork_id=p_id and original_file_id=any(p_remove_ids);
 delete from public.commission_artwork_files where artwork_id=p_id and id=any(p_remove_ids) and variant='original';
 -- Insert originals before their dependent preview rows.
 insert into public.commission_artwork_files(id,artwork_id,original_filename,variant,original_file_id,page_number,bucket_id,object_path,mime_type,byte_size,sha256,width,height)
 select x.id,p_id,x.original_filename,x.variant,x.original_file_id,x.page_number,x.bucket_id,x.object_path,x.mime_type,x.byte_size,x.sha256,x.width,x.height
 from jsonb_to_recordset(p_files) as x(id uuid,original_filename text,variant text,original_file_id uuid,page_number integer,bucket_id text,object_path text,mime_type text,byte_size bigint,sha256 text,width integer,height integer)
 order by (x.variant <> 'original');
 for page in select * from jsonb_array_elements(p_data->'pages') loop
  update public.commission_artwork_files set page_number=(page->>'page_number')::integer where artwork_id=p_id
   and (id=(page->>'id')::uuid or original_file_id=(page->>'id')::uuid);
 end loop;
 if not exists(select 1 from public.commission_artwork_files where artwork_id=p_id and variant='original') and p_data->>'external_url' is null then raise exception 'ORIGINAL_REQUIRED'; end if;
 delete from public.commission_artwork_rune_assets where artwork_id=p_id;
 for asset in select * from jsonb_array_elements(p_assets) loop
  insert into public.commission_rune_assets(collection,asset_identifier,asset_url)
  values(asset->>'collection',asset->>'asset_identifier',asset->>'asset_url')
  on conflict(collection,asset_identifier) do update set asset_url=excluded.asset_url returning id into asset_id;
  insert into public.commission_artwork_rune_assets(artwork_id,rune_asset_id) values(p_id,asset_id) on conflict do nothing;
 end loop;
 return p_id;
end $$;

create function public.cms_delete_commission_art(p_id uuid,p_kind text)
returns void language plpgsql set search_path=public,pg_temp as $$
begin
 if p_kind='artist' then
  perform 1 from public.commission_artists where id=p_id for update;
  if not found then raise exception 'NOT_FOUND'; end if;
  if exists(select 1 from public.commission_artworks where artist_id=p_id) then raise exception 'ARTIST_HAS_ARTWORKS'; end if;
  insert into public.commission_storage_cleanup(bucket_id,object_path)
  select bucket_id,name from storage.objects where bucket_id in ('commission-originals','commission-web') and name like 'artists/' || p_id::text || '/%' on conflict do nothing;
  delete from public.commission_artist_links where artist_id=p_id;
  delete from public.commission_artists where id=p_id;
 elsif p_kind='artwork' then
  perform 1 from public.commission_artworks where id=p_id for update;
  if not found then raise exception 'NOT_FOUND'; end if;
  insert into public.commission_storage_cleanup(bucket_id,object_path)
  select bucket_id,object_path from public.commission_artwork_files where artwork_id=p_id on conflict do nothing;
  delete from public.commission_artwork_rune_assets where artwork_id=p_id;
  delete from public.commission_artwork_files where artwork_id=p_id and variant<>'original';
  delete from public.commission_artwork_files where artwork_id=p_id;
  delete from public.commission_artworks where id=p_id;
 else raise exception 'INVALID_KIND';
 end if;
end $$;
revoke all on function public.cms_save_commission_artist(uuid,jsonb,jsonb) from public,anon,authenticated;
revoke all on function public.cms_save_commission_artwork(uuid,jsonb,jsonb,jsonb,uuid[]) from public,anon,authenticated;
revoke all on function public.cms_delete_commission_art(uuid,text) from public,anon,authenticated;
grant execute on function public.cms_save_commission_artist(uuid,jsonb,jsonb) to service_role;
grant execute on function public.cms_save_commission_artwork(uuid,jsonb,jsonb,jsonb,uuid[]) to service_role;
grant execute on function public.cms_delete_commission_art(uuid,text) to service_role;
notify pgrst,'reload schema';
commit;
