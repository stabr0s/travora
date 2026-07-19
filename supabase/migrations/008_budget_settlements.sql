alter table public.budget_expenses
  add column if not exists paid_by_user_id uuid null references public.profiles(id) on delete set null,
  add column if not exists split_between_user_ids uuid[] null,
  add column if not exists split_type text not null default 'equal';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'budget_expenses_split_type_check'
      and conrelid = 'public.budget_expenses'::regclass
  ) then
    alter table public.budget_expenses
      add constraint budget_expenses_split_type_check
      check (split_type in ('equal'));
  end if;
end;
$$;

create index if not exists budget_expenses_paid_by_user_id_idx
  on public.budget_expenses(paid_by_user_id);
