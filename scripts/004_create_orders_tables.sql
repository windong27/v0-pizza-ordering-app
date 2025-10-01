-- Create orders table
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  order_number text not null unique,
  status text not null default 'pending',
  order_type text not null, -- 'delivery' or 'pickup'
  
  -- Contact info (for guest checkout)
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  
  -- Delivery info
  delivery_address text,
  delivery_instructions text,
  
  -- Pricing
  subtotal decimal(10,2) not null,
  tax decimal(10,2) not null,
  delivery_fee decimal(10,2) not null default 0,
  discount decimal(10,2) not null default 0,
  total decimal(10,2) not null,
  
  -- Payment
  payment_method text not null,
  
  -- Timing
  estimated_delivery_time timestamptz,
  delivered_at timestamptz,
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create order_items table
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  pizza_id uuid not null references public.pizzas(id),
  
  -- Pizza details (snapshot at order time)
  pizza_name text not null,
  size text not null,
  crust text not null,
  sauce text not null,
  cheese text not null,
  
  quantity integer not null,
  unit_price decimal(10,2) not null,
  total_price decimal(10,2) not null,
  
  special_instructions text,
  
  created_at timestamptz default now()
);

-- Create order_item_toppings table
create table if not exists public.order_item_toppings (
  id uuid primary key default gen_random_uuid(),
  order_item_id uuid not null references public.order_items(id) on delete cascade,
  topping_name text not null,
  topping_price decimal(10,2) not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_item_toppings enable row level security;

-- RLS Policies for orders
create policy "Users can view their own orders"
  on public.orders for select
  using (auth.uid() = user_id or user_id is null);

create policy "Users can insert their own orders"
  on public.orders for insert
  with check (auth.uid() = user_id or user_id is null);

create policy "Users can update their own orders"
  on public.orders for update
  using (auth.uid() = user_id or user_id is null);

-- RLS Policies for order_items
create policy "Users can view their order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and (orders.user_id = auth.uid() or orders.user_id is null)
    )
  );

create policy "Users can insert their order items"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and (orders.user_id = auth.uid() or orders.user_id is null)
    )
  );

-- RLS Policies for order_item_toppings
create policy "Users can view their order item toppings"
  on public.order_item_toppings for select
  using (
    exists (
      select 1 from public.order_items
      join public.orders on orders.id = order_items.order_id
      where order_items.id = order_item_toppings.order_item_id
      and (orders.user_id = auth.uid() or orders.user_id is null)
    )
  );

create policy "Users can insert their order item toppings"
  on public.order_item_toppings for insert
  with check (
    exists (
      select 1 from public.order_items
      join public.orders on orders.id = order_items.order_id
      where order_items.id = order_item_toppings.order_item_id
      and (orders.user_id = auth.uid() or orders.user_id is null)
    )
  );

-- Add updated_at trigger for orders
create trigger orders_updated_at
  before update on public.orders
  for each row
  execute function public.handle_updated_at();

-- Create index for order lookups
create index orders_user_id_idx on public.orders(user_id);
create index orders_order_number_idx on public.orders(order_number);
create index order_items_order_id_idx on public.order_items(order_id);
