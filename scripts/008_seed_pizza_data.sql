-- Seed pizza sizes
insert into public.pizza_sizes (name, display_name, price_multiplier) values
  ('small', 'Small (10")', 0.75),
  ('medium', 'Medium (12")', 1.00),
  ('large', 'Large (14")', 1.35),
  ('xlarge', 'X-Large (16")', 1.65)
on conflict (name) do nothing;

-- Seed crusts
insert into public.crusts (name, display_name, price) values
  ('regular', 'Regular', 0.00),
  ('thin', 'Thin Crust', 0.00),
  ('thick', 'Thick Crust', 1.50),
  ('stuffed', 'Stuffed Crust', 3.00),
  ('gluten-free', 'Gluten-Free', 2.50)
on conflict (name) do nothing;

-- Seed sauces
insert into public.sauces (name, display_name, price) values
  ('tomato', 'Classic Tomato', 0.00),
  ('white', 'White Sauce', 0.50),
  ('bbq', 'BBQ Sauce', 0.50),
  ('pesto', 'Pesto', 1.00),
  ('buffalo', 'Buffalo Sauce', 0.50)
on conflict (name) do nothing;

-- Seed toppings
insert into public.toppings (name, display_name, category, price) values
  -- Meats
  ('pepperoni', 'Pepperoni', 'meats', 1.50),
  ('sausage', 'Italian Sausage', 'meats', 1.50),
  ('bacon', 'Bacon', 'meats', 1.50),
  ('ham', 'Ham', 'meats', 1.50),
  ('chicken', 'Grilled Chicken', 'meats', 2.00),
  ('beef', 'Ground Beef', 'meats', 1.50),
  ('anchovies', 'Anchovies', 'meats', 2.00),
  
  -- Vegetables
  ('mushrooms', 'Mushrooms', 'vegetables', 1.00),
  ('onions', 'Red Onions', 'vegetables', 1.00),
  ('peppers', 'Bell Peppers', 'vegetables', 1.00),
  ('olives', 'Black Olives', 'vegetables', 1.00),
  ('tomatoes', 'Fresh Tomatoes', 'vegetables', 1.00),
  ('spinach', 'Spinach', 'vegetables', 1.00),
  ('jalapenos', 'Jalapeños', 'vegetables', 1.00),
  ('pineapple', 'Pineapple', 'vegetables', 1.00),
  ('artichokes', 'Artichoke Hearts', 'vegetables', 1.50),
  ('basil', 'Fresh Basil', 'vegetables', 1.00),
  
  -- Premium
  ('feta', 'Feta Cheese', 'premium', 2.00),
  ('goat-cheese', 'Goat Cheese', 'premium', 2.50),
  ('prosciutto', 'Prosciutto', 'premium', 3.00),
  ('truffle-oil', 'Truffle Oil', 'premium', 3.50)
on conflict (name) do nothing;

-- Seed pizzas (using the image URLs from the existing data)
insert into public.pizzas (name, description, category, base_price, image_url, popular) values
  ('Margherita', 'Classic pizza with fresh mozzarella, tomatoes, and basil', 'vegetarian', 12.99, '/margherita-pizza-with-fresh-basil.jpg', true),
  ('Pepperoni', 'Traditional pepperoni with mozzarella cheese', 'meat', 13.99, '/pizza-pepperoni.png', true),
  ('Hawaiian', 'Ham and pineapple with mozzarella', 'specialty', 14.99, '/hawaiian-pizza.png', false),
  ('BBQ Chicken', 'Grilled chicken with BBQ sauce and red onions', 'specialty', 15.99, '/bbq-chicken-pizza-with-red-onions.jpg', true),
  ('Veggie Supreme', 'Loaded with fresh vegetables', 'vegetarian', 14.99, '/veggie-supreme-pizza.jpg', false),
  ('Meat Lovers', 'Pepperoni, sausage, bacon, and ham', 'meat', 16.99, '/meat-lovers-pizza.jpg', true),
  ('Four Cheese', 'Mozzarella, parmesan, gorgonzola, and fontina', 'vegetarian', 15.99, '/four-cheese-pizza.jpg', false),
  ('Buffalo Chicken', 'Spicy buffalo chicken with ranch drizzle', 'specialty', 15.99, '/buffalo-chicken-pizza.jpg', false),
  ('Mediterranean', 'Feta, olives, tomatoes, and spinach', 'vegetarian', 15.99, '/mediterranean-pizza.jpg', false),
  ('Supreme', 'Pepperoni, sausage, peppers, onions, and mushrooms', 'specialty', 16.99, '/supreme-pizza.jpg', true),
  ('White Pizza', 'Ricotta, mozzarella, and garlic', 'vegetarian', 13.99, '/white-pizza.jpg', false),
  ('Mushroom Truffle', 'Wild mushrooms with truffle oil', 'specialty', 17.99, '/mushroom-truffle-pizza.jpg', false),
  ('Spicy Italian', 'Spicy sausage, jalapeños, and hot peppers', 'meat', 15.99, '/spicy-italian-pizza.jpg', false),
  ('Pesto Chicken', 'Grilled chicken with pesto sauce', 'specialty', 16.99, '/pesto-chicken-pizza.jpg', false),
  ('Prosciutto Arugula', 'Prosciutto with fresh arugula and parmesan', 'specialty', 17.99, '/prosciutto-arugula-pizza.jpg', false)
on conflict do nothing;
