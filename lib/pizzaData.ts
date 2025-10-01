import type { Pizza, Topping } from "@/types"

export const pizzas: Pizza[] = [
  {
    id: "1",
    name: "Margherita",
    description: "Classic tomato sauce, fresh mozzarella, and basil",
    category: "classic",
    basePrice: 12.99,
    image: "/margherita-pizza-with-fresh-basil.jpg",
    popular: true,
  },
  {
    id: "2",
    name: "Pepperoni",
    description: "Loaded with pepperoni and mozzarella cheese",
    category: "classic",
    basePrice: 14.99,
    image: "/pizza-pepperoni.png",
    popular: true,
  },
  {
    id: "3",
    name: "Hawaiian",
    description: "Ham, pineapple, and mozzarella cheese",
    category: "classic",
    basePrice: 15.99,
    image: "/hawaiian-pizza.png",
  },
  {
    id: "4",
    name: "BBQ Chicken",
    description: "Grilled chicken, BBQ sauce, red onions, and cilantro",
    category: "specialty",
    basePrice: 16.99,
    image: "/bbq-chicken-pizza-with-red-onions.jpg",
    popular: true,
  },
  {
    id: "5",
    name: "Veggie Supreme",
    description: "Mushrooms, peppers, onions, olives, and tomatoes",
    category: "vegetarian",
    basePrice: 15.99,
    image: "/colorful-vegetarian-pizza.png",
  },
  {
    id: "6",
    name: "Meat Lovers",
    description: "Pepperoni, sausage, bacon, and ham",
    category: "specialty",
    basePrice: 18.99,
    image: "/meat-lovers-pizza-with-multiple-meats.jpg",
  },
  {
    id: "7",
    name: "Four Cheese",
    description: "Mozzarella, parmesan, gorgonzola, and fontina",
    category: "premium",
    basePrice: 17.99,
    image: "/four-cheese-pizza-with-melted-cheese.jpg",
  },
  {
    id: "8",
    name: "Buffalo Chicken",
    description: "Spicy buffalo chicken, ranch drizzle, and mozzarella",
    category: "specialty",
    basePrice: 16.99,
    image: "/buffalo-chicken-pizza-with-ranch.jpg",
  },
  {
    id: "9",
    name: "Mediterranean",
    description: "Feta cheese, olives, tomatoes, and spinach",
    category: "vegetarian",
    basePrice: 16.99,
    image: "/mediterranean-pizza-with-feta-and-olives.jpg",
  },
  {
    id: "10",
    name: "Pesto Chicken",
    description: "Grilled chicken, pesto sauce, sun-dried tomatoes",
    category: "premium",
    basePrice: 17.99,
    image: "/pesto-chicken-pizza-with-sun-dried-tomatoes.jpg",
  },
  {
    id: "11",
    name: "Truffle Mushroom",
    description: "Wild mushrooms, truffle oil, and parmesan",
    category: "premium",
    basePrice: 19.99,
    image: "/truffle-mushroom-pizza-gourmet.jpg",
  },
  {
    id: "12",
    name: "Supreme",
    description: "Pepperoni, sausage, peppers, onions, and mushrooms",
    category: "specialty",
    basePrice: 17.99,
    image: "/supreme-pizza-with-all-toppings.jpg",
  },
  {
    id: "13",
    name: "White Pizza",
    description: "Ricotta, mozzarella, garlic, and olive oil",
    category: "classic",
    basePrice: 15.99,
    image: "/white-pizza-with-ricotta-cheese.jpg",
  },
  {
    id: "14",
    name: "Mexican Fiesta",
    description: "Seasoned beef, jalapeños, tomatoes, and cheddar",
    category: "specialty",
    basePrice: 16.99,
    image: "/mexican-pizza-with-jalapenos.jpg",
  },
  {
    id: "15",
    name: "Bacon Cheeseburger",
    description: "Ground beef, bacon, cheddar, pickles, and special sauce",
    category: "specialty",
    basePrice: 17.99,
    image: "/bacon-cheeseburger-pizza.jpg",
  },
]

export const toppings: Topping[] = [
  // Meats
  { id: "t1", name: "Pepperoni", category: "meat", price: 1.5 },
  { id: "t2", name: "Sausage", category: "meat", price: 1.5 },
  { id: "t3", name: "Bacon", category: "meat", price: 2.0 },
  { id: "t4", name: "Ham", category: "meat", price: 1.5 },
  { id: "t5", name: "Chicken", category: "meat", price: 2.0 },

  // Vegetables
  { id: "t6", name: "Mushrooms", category: "vegetable", price: 1.0 },
  { id: "t7", name: "Onions", category: "vegetable", price: 0.75 },
  { id: "t8", name: "Bell Peppers", category: "vegetable", price: 1.0 },
  { id: "t9", name: "Black Olives", category: "vegetable", price: 1.0 },
  { id: "t10", name: "Tomatoes", category: "vegetable", price: 1.0 },
  { id: "t11", name: "Spinach", category: "vegetable", price: 1.0 },
  { id: "t12", name: "Jalapeños", category: "vegetable", price: 0.75 },

  // Premium
  { id: "t13", name: "Feta Cheese", category: "premium", price: 2.5 },
  { id: "t14", name: "Goat Cheese", category: "premium", price: 2.5 },
  { id: "t15", name: "Prosciutto", category: "premium", price: 3.0 },
  { id: "t16", name: "Truffle Oil", category: "premium", price: 3.5 },
]

export const sizeMultipliers = {
  small: 0.8,
  medium: 1.0,
  large: 1.3,
  xl: 1.6,
}

export const crustPrices = {
  thin: 0,
  regular: 0,
  thick: 1.5,
  stuffed: 3.0,
}
