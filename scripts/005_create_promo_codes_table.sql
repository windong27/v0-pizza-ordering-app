-- Create promo_codes table
create table if not exists public.promo_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_type text not null, -- 'percentage' or 'fixed'
  discount_value decimal(10,2) not null,
  min_order_amount decimal(10,2),
  max_discount decimal(10,2),
  valid_from timestamptz not null,
  valid_until timestamptz not null,
  usage_limit integer,
  usage_count integer default 0,
  active boolean default true,
  created_at timestamptz default now()
);

-- Enable RLS (public read for validation)
alter table public.promo_codes enable row level security;

create policy "Anyone can view active promo codes"
  on public.promo_codes for select
  using (active = true and now() between valid_from and valid_until);
