create table public.packing_presets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint packing_presets_name_check check (char_length(trim(name)) > 0)
);

create table public.packing_preset_items (
  id uuid primary key default gen_random_uuid(),
  preset_id uuid not null references public.packing_presets(id) on delete cascade,
  name text not null,
  category text,
  priority text constraint packing_preset_items_priority_check check (
    priority is null or priority in ('essential', 'recommended', 'optional')
  ),
  notes text,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint packing_preset_items_name_check check (char_length(trim(name)) > 0),
  constraint packing_preset_items_sort_order_check check (sort_order is null or sort_order >= 0)
);

create index packing_presets_owner_id_idx on public.packing_presets(owner_id);
create index packing_preset_items_preset_id_idx on public.packing_preset_items(preset_id);

create trigger packing_presets_set_updated_at
before update on public.packing_presets
for each row execute function public.set_updated_at();

create trigger packing_preset_items_set_updated_at
before update on public.packing_preset_items
for each row execute function public.set_updated_at();

alter table public.packing_presets enable row level security;
alter table public.packing_preset_items enable row level security;

create policy "Users can view own packing presets"
on public.packing_presets for select to authenticated
using (owner_id = auth.uid());

create policy "Users can create own packing presets"
on public.packing_presets for insert to authenticated
with check (owner_id = auth.uid());

create policy "Users can update own packing presets"
on public.packing_presets for update to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

create policy "Users can delete own packing presets"
on public.packing_presets for delete to authenticated
using (owner_id = auth.uid());

create policy "Users can view own packing preset items"
on public.packing_preset_items for select to authenticated
using (
  exists (
    select 1 from public.packing_presets
    where public.packing_presets.id = public.packing_preset_items.preset_id
      and public.packing_presets.owner_id = auth.uid()
  )
);

create policy "Users can create own packing preset items"
on public.packing_preset_items for insert to authenticated
with check (
  exists (
    select 1 from public.packing_presets
    where public.packing_presets.id = public.packing_preset_items.preset_id
      and public.packing_presets.owner_id = auth.uid()
  )
);

create policy "Users can update own packing preset items"
on public.packing_preset_items for update to authenticated
using (
  exists (
    select 1 from public.packing_presets
    where public.packing_presets.id = public.packing_preset_items.preset_id
      and public.packing_presets.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.packing_presets
    where public.packing_presets.id = public.packing_preset_items.preset_id
      and public.packing_presets.owner_id = auth.uid()
  )
);

create policy "Users can delete own packing preset items"
on public.packing_preset_items for delete to authenticated
using (
  exists (
    select 1 from public.packing_presets
    where public.packing_presets.id = public.packing_preset_items.preset_id
      and public.packing_presets.owner_id = auth.uid()
  )
);
