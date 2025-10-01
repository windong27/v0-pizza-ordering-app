-- Create reviews table
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pizza_id uuid not null references public.pizzas(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  
  unique(user_id, pizza_id, order_id)
);

-- Enable RLS
alter table public.reviews enable row level security;

-- RLS Policies
create policy "Anyone can view reviews"
  on public.reviews for select
  using (true);

create policy "Users can insert their own reviews"
  on public.reviews for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own reviews"
  on public.reviews for update
  using (auth.uid() = user_id);

create policy "Users can delete their own reviews"
  on public.reviews for delete
  using (auth.uid() = user_id);

-- Add updated_at trigger
create trigger reviews_updated_at
  before update on public.reviews
  for each row
  execute function public.handle_updated_at();

-- Create index for pizza reviews
create index reviews_pizza_id_idx on public.reviews(pizza_id);
