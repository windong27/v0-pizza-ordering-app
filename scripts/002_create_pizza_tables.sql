-- Create pizza sizes table
create table if not exists public.pizza_sizes (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  display_name text not null,
  price_multiplier decimal(3,2) not null,
  created_at timestamptz default now()
);

-- Create crusts table
create table if not exists public.crusts (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  display_name text not null,
  price decimal(10,2) not null default 0,
  created_at timestamptz default now()
);

-- Create sauces table
create table if not exists public.sauces (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  display_name text not null,
  price decimal(10,2) not null default 0,
  created_at timestamptz default now()
);

-- Create toppings table
create table if not exists public.toppings (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  display_name text not null,
  category text not null,
  price decimal(10,2) not null,
  available boolean default true,
  created_at timestamptz default now()
);

-- Create pizzas table
create table if not exists public.pizzas (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  category text not null,
  base_price decimal(10,2) not null,
  image_url text not null,
  popular boolean default false,
  available boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS on pizza tables (public read access)
alter table public.pizza_sizes enable row level security;
alter table public.crusts enable row level security;
alter table public.sauces enable row level security;
alter table public.toppings enable row level security;
alter table public.pizzas enable row level security;

-- Public read policies
create policy "Anyone can view pizza sizes"
  on public.pizza_sizes for select
  using (true);

create policy "Anyone can view crusts"
  on public.crusts for select
  using (true);

create policy "Anyone can view sauces"
  on public.sauces for select
  using (true);

create policy "Anyone can view toppings"
  on public.toppings for select
  using (true);

create policy "Anyone can view pizzas"
  on public.pizzas for select
  using (true);

-- Add updated_at trigger for pizzas
create trigger pizzas_updated_at
  before update on public.pizzas
  for each row
  execute function public.handle_updated_at();
