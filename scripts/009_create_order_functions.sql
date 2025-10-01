-- Function to generate order number
create or replace function public.generate_order_number()
returns text
language plpgsql
as $$
declare
  new_order_number text;
  order_exists boolean;
begin
  loop
    -- Generate a random 8-character order number
    new_order_number := 'ORD-' || upper(substring(md5(random()::text) from 1 for 8));
    
    -- Check if it exists
    select exists(select 1 from public.orders where order_number = new_order_number) into order_exists;
    
    -- If it doesn't exist, we're done
    exit when not order_exists;
  end loop;
  
  return new_order_number;
end;
$$;

-- Function to calculate order total
create or replace function public.calculate_order_total(
  p_subtotal decimal,
  p_delivery_fee decimal,
  p_discount decimal
)
returns table(tax decimal, total decimal)
language plpgsql
as $$
declare
  tax_rate decimal := 0.08; -- 8% tax rate
  calculated_tax decimal;
  calculated_total decimal;
begin
  calculated_tax := round((p_subtotal * tax_rate)::numeric, 2);
  calculated_total := round((p_subtotal + calculated_tax + p_delivery_fee - p_discount)::numeric, 2);
  
  return query select calculated_tax, calculated_total;
end;
$$;
