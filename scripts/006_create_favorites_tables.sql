-- Create favorites table
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pizza_id uuid not null references public.pizzas(id) on delete cascade,
  
  -- Customization
  size text not null,
  crust text not null,
  sauce text not null,
  cheese text not null,
  
  name text not null, -- User's custom name for this favorite
  
  created_at timestamptz default now(),
  
  unique(user_id, pizza_id, size, crust, sauce, cheese)
);

-- Create favorite_toppings table
create table if not exists public.favorite_toppings (
  id uuid primary key default gen_random_uuid(),
  favorite_id uuid not null references public.favorites(id) on delete cascade,
  topping_name text not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.favorites enable row level security;
alter table public.favorite_toppings enable row level security;

-- RLS Policies
create policy "Users can view their own favorites"
  on public.favorites for select
  using (auth.uid() = user_id);

create policy "Users can insert their own favorites"
  on public.favorites for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own favorites"
  on public.favorites for update
  using (auth.uid() = user_id);

create policy "Users can delete their own favorites"
  on public.favorites for delete
  using (auth.uid() = user_id);

create policy "Users can view their favorite toppings"
  on public.favorite_toppings for select
  using (
    exists (
      select 1 from public.favorites
      where favorites.id = favorite_toppings.favorite_id
      and favorites.user_id = auth.uid()
    )
  );

create policy "Users can insert their favorite toppings"
  on public.favorite_toppings for insert
  with check (
    exists (
      select 1 from public.favorites
      where favorites.id = favorite_toppings.favorite_id
      and favorites.user_id = auth.uid()
    )
  );

create policy "Users can delete their favorite toppings"
  on public.favorite_toppings for delete
  using (
    exists (
      select 1 from public.favorites
      where favorites.id = favorite_toppings.favorite_id
      and favorites.user_id = auth.uid()
    )
  );
