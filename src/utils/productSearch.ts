export interface SearchResult {
  name: string;
  category: string;
  brand: string;
  size: string;
  price: number;
  inStock: boolean;
}

// Comprehensive product database simulating Amazon/Flipkart-like inventory
const PRODUCT_DATABASE: SearchResult[] = [
  // Electronics
  { name: 'iPhone 15 Pro Max', category: 'electronics', brand: 'Apple', size: '256GB', price: 1199.99, inStock: true },
  { name: 'Samsung Galaxy S24 Ultra', category: 'electronics', brand: 'Samsung', size: '512GB', price: 1299.99, inStock: true },
  { name: 'MacBook Pro 16-inch', category: 'electronics', brand: 'Apple', size: 'M3 Max', price: 3499.99, inStock: true },
  { name: 'Dell XPS 13 Laptop', category: 'electronics', brand: 'Dell', size: 'Intel i7', price: 1299.99, inStock: true },
  { name: 'Sony WH-1000XM5 Headphones', category: 'electronics', brand: 'Sony', size: 'Wireless', price: 349.99, inStock: true },
  { name: 'AirPods Pro 2nd Gen', category: 'electronics', brand: 'Apple', size: 'Wireless', price: 249.99, inStock: true },
  { name: 'iPad Air 5th Gen', category: 'electronics', brand: 'Apple', size: '64GB', price: 599.99, inStock: true },
  { name: 'Samsung 55" 4K Smart TV', category: 'electronics', brand: 'Samsung', size: '55 inch', price: 699.99, inStock: true },
  { name: 'Nintendo Switch OLED', category: 'electronics', brand: 'Nintendo', size: 'White', price: 349.99, inStock: true },
  { name: 'GoPro HERO11 Silver', category: 'electronics', brand: 'GoPro', size: 'Action Camera', price: 299.99, inStock: true },

  // Fashion & Clothing
  { name: 'Levi\'s 511 Slim Fit Jeans', category: 'clothing', brand: 'Levi\'s', size: '32x32', price: 69.99, inStock: true },
  { name: 'Nike Air Max 270', category: 'clothing', brand: 'Nike', size: '10', price: 129.99, inStock: true },
  { name: 'Adidas Ultraboost 23', category: 'clothing', brand: 'Adidas', size: '9.5', price: 189.99, inStock: true },
  { name: 'H&M Cotton T-Shirt', category: 'clothing', brand: 'H&M', size: 'Large', price: 12.99, inStock: true },
  { name: 'Zara Wool Coat', category: 'clothing', brand: 'Zara', size: 'Medium', price: 149.99, inStock: true },
  { name: 'Uniqlo Down Jacket', category: 'clothing', brand: 'Uniqlo', size: 'Large', price: 89.99, inStock: true },
  { name: 'Supreme Box Logo Hoodie', category: 'clothing', brand: 'Supreme', size: 'Large', price: 299.99, inStock: true },
  { name: 'Gucci GG Marmont Bag', category: 'clothing', brand: 'Gucci', size: 'Small', price: 1890.00, inStock: true },

  // Home & Kitchen
  { name: 'KitchenAid Stand Mixer', category: 'home', brand: 'KitchenAid', size: '5 Quart', price: 379.99, inStock: true },
  { name: 'Dyson V15 Detect Vacuum', category: 'home', brand: 'Dyson', size: 'Cordless', price: 749.99, inStock: true },
  { name: 'Instant Pot Duo 7-in-1', category: 'home', brand: 'Instant Pot', size: '6 Quart', price: 79.99, inStock: true },
  { name: 'Ninja Food Processor', category: 'home', brand: 'Ninja', size: '8 Cup', price: 149.99, inStock: true },
  { name: 'Cuisinart Coffee Maker', category: 'home', brand: 'Cuisinart', size: '12 Cup', price: 59.99, inStock: true },
  { name: 'Breville Espresso Machine', category: 'home', brand: 'Breville', size: 'Stainless Steel', price: 699.99, inStock: true },

  // Books
  { name: 'Atomic Habits', category: 'books', brand: 'James Clear', size: 'Paperback', price: 16.99, inStock: true },
  { name: 'The Psychology of Money', category: 'books', brand: 'Morgan Housel', size: 'Hardcover', price: 19.99, inStock: true },
  { name: 'Sapiens: A Brief History of Humankind', category: 'books', brand: 'Yuval Noah Harari', size: 'Paperback', price: 24.99, inStock: true },
  { name: 'Educated', category: 'books', brand: 'Tara Westover', size: 'Paperback', price: 15.99, inStock: true },
  { name: 'The Midnight Library', category: 'books', brand: 'Matt Haig', size: 'Hardcover', price: 26.99, inStock: true },

  // Sports & Outdoors
  { name: 'Peloton Bike', category: 'sports', brand: 'Peloton', size: 'Standard', price: 2495.00, inStock: true },
  { name: 'Bowflex SelectTech Dumbbells', category: 'sports', brand: 'Bowflex', size: '5-52.5 lbs', price: 499.99, inStock: true },
  { name: 'Yeti Tundra 65 Cooler', category: 'sports', brand: 'Yeti', size: '65 Quart', price: 399.99, inStock: true },
  { name: 'Garmin Forerunner 265', category: 'sports', brand: 'Garmin', size: 'Running Watch', price: 449.99, inStock: true },
  { name: 'Wilson Pro Staff Tennis Racket', category: 'sports', brand: 'Wilson', size: '4 3/8"', price: 249.99, inStock: true },

  // Beauty & Personal Care
  { name: 'Dyson Airwrap Complete', category: 'beauty', brand: 'Dyson', size: 'Multi-styler', price: 599.99, inStock: true },
  { name: 'The Ordinary Hyaluronic Acid', category: 'beauty', brand: 'The Ordinary', size: '30ml', price: 6.99, inStock: true },
  { name: 'CeraVe Moisturizing Cream', category: 'beauty', brand: 'CeraVe', size: '16 oz', price: 16.99, inStock: true },
  { name: 'Fenty Beauty Pro Filt\'r Soft Matte Longwear Foundation', category: 'beauty', brand: 'Fenty Beauty', size: '30ml', price: 35.00, inStock: true },
  { name: 'Drunk Elephant Protini Polypeptide Cream', category: 'beauty', brand: 'Drunk Elephant', size: '50ml', price: 68.00, inStock: true },

  // Toys & Games
  { name: 'LEGO Star Wars Millennium Falcon', category: 'toys', brand: 'LEGO', size: '1351 pieces', price: 159.99, inStock: true },
  { name: 'Nintendo Switch OLED', category: 'toys', brand: 'Nintendo', size: 'White', price: 349.99, inStock: true },
  { name: 'Hasbro Monopoly Classic', category: 'toys', brand: 'Hasbro', size: 'Board Game', price: 19.99, inStock: true },
  { name: 'Fisher-Price Little People Wheelies', category: 'toys', brand: 'Fisher-Price', size: 'Stand & Play Ramp', price: 24.99, inStock: true },

  // Grocery & Food
  { name: 'Organic Bananas', category: 'grocery', brand: 'Fresh Farms', size: '1 lb', price: 0.59, inStock: true },
  { name: 'Whole Milk', category: 'grocery', brand: 'Organic Valley', size: '1 gallon', price: 5.99, inStock: true },
  { name: 'Free Range Eggs', category: 'grocery', brand: 'Vital Farms', size: '12 count', price: 7.99, inStock: true },
  { name: 'Whole Wheat Bread', category: 'grocery', brand: 'Dave\'s Killer Bread', size: '24 oz', price: 6.99, inStock: true },
  { name: 'Organic Strawberries', category: 'grocery', brand: 'Driscoll\'s', size: '1 lb', price: 4.99, inStock: true },
  { name: 'Greek Yogurt', category: 'grocery', brand: 'Chobani', size: '32 oz', price: 5.49, inStock: true },
  { name: 'Almond Butter', category: 'grocery', brand: 'Justin\'s', size: '16 oz', price: 4.99, inStock: true },
  { name: 'Organic Chicken Breast', category: 'grocery', brand: 'Perdue', size: '1 lb', price: 8.99, inStock: true },
  { name: 'Brown Rice', category: 'grocery', brand: 'Lundberg', size: '2 lb', price: 4.99, inStock: true },
  { name: 'Extra Virgin Olive Oil', category: 'grocery', brand: 'California Olive Ranch', size: '16.9 oz', price: 9.99, inStock: true },

  // More Electronics
  { name: 'iPhone 15', category: 'electronics', brand: 'Apple', size: '128GB', price: 799.99, inStock: true },
  { name: 'Google Pixel 8 Pro', category: 'electronics', brand: 'Google', size: '256GB', price: 999.99, inStock: true },
  { name: 'Surface Pro 9', category: 'electronics', brand: 'Microsoft', size: 'Intel i7', price: 1299.99, inStock: true },
  { name: 'AirPods Max', category: 'electronics', brand: 'Apple', size: 'Space Gray', price: 549.99, inStock: true },
  { name: 'Ring Video Doorbell', category: 'electronics', brand: 'Ring', size: 'Wired', price: 59.99, inStock: true },
  { name: 'Echo Dot 5th Gen', category: 'electronics', brand: 'Amazon', size: 'Smart Speaker', price: 39.99, inStock: true },

  // More Fashion
  { name: 'Ray-Ban Aviator Sunglasses', category: 'clothing', brand: 'Ray-Ban', size: 'Medium', price: 149.99, inStock: true },
  { name: 'Timberland 6-Inch Boot', category: 'clothing', brand: 'Timberland', size: '10', price: 189.99, inStock: true },
  { name: 'Patagonia Better Sweater', category: 'clothing', brand: 'Patagonia', size: 'Large', price: 139.00, inStock: true },
  { name: 'Allbirds Wool Runners', category: 'clothing', brand: 'Allbirds', size: '9', price: 95.00, inStock: true },

  // Complementary Products
  { name: 'iPhone Screen Protector', category: 'electronics', brand: 'Generic', size: 'Standard', price: 9.99, inStock: true },
  { name: 'iPhone Case', category: 'electronics', brand: 'Generic', size: 'Clear', price: 14.99, inStock: true },
  { name: 'MacBook Sleeve', category: 'electronics', brand: 'Generic', size: '13-inch', price: 24.99, inStock: true },
  { name: 'Nike Socks', category: 'clothing', brand: 'Nike', size: 'Medium', price: 12.99, inStock: true },
  { name: 'Nike Shoe Laces', category: 'clothing', brand: 'Nike', size: 'Standard', price: 4.99, inStock: true },
  { name: 'Coffee Filters', category: 'home', brand: 'Generic', size: 'Pack of 100', price: 3.99, inStock: true },
  { name: 'Coffee Beans', category: 'grocery', brand: 'Starbucks', size: '1 lb', price: 12.99, inStock: true },
  { name: 'PS5 Controller', category: 'electronics', brand: 'Sony', size: 'Wireless', price: 69.99, inStock: true },
  { name: 'Headphone Case', category: 'electronics', brand: 'Generic', size: 'Standard', price: 8.99, inStock: true },
  { name: 'Watch Band', category: 'clothing', brand: 'Generic', size: '22mm', price: 19.99, inStock: true },
  { name: 'Plant Pot', category: 'home', brand: 'Generic', size: '6-inch', price: 7.99, inStock: true },
  { name: 'Bike Lock', category: 'sports', brand: 'Generic', size: 'Standard', price: 15.99, inStock: true },
  { name: 'Yoga Blocks', category: 'sports', brand: 'Generic', size: 'Set of 2', price: 12.99, inStock: true },
  { name: 'Diaper Cream', category: 'baby', brand: 'Generic', size: '4 oz', price: 4.99, inStock: true },

  // More Home
  { name: 'Blue Apron Meal Kit', category: 'home', brand: 'Blue Apron', size: 'Serves 2', price: 59.94, inStock: true },
  { name: 'Casper Hybrid Mattress', category: 'home', brand: 'Casper', size: 'Queen', price: 1099.00, inStock: true },
  { name: 'Anker Power Bank', category: 'home', brand: 'Anker', size: '20000mAh', price: 39.99, inStock: true },

  // More Books
  { name: 'The Seven Husbands of Evelyn Hugo', category: 'books', brand: 'Taylor Jenkins Reid', size: 'Paperback', price: 16.99, inStock: true },
  { name: 'Where the Crawdads Sing', category: 'books', brand: 'Delia Owens', size: 'Paperback', price: 18.99, inStock: true },
  { name: 'The Thursday Murder Club', category: 'books', brand: 'Richard Osman', size: 'Hardcover', price: 27.99, inStock: true },

  // More Sports
  { name: 'Fitbit Charge 6', category: 'sports', brand: 'Fitbit', size: 'Fitness Tracker', price: 149.99, inStock: true },
  { name: 'Titleist TruFeel Golf Balls', category: 'sports', brand: 'Titleist', size: '12 pack', price: 29.99, inStock: true },
  { name: 'Manduka PRO Yoga Mat', category: 'sports', brand: 'Manduka', size: '68" x 24"', price: 119.00, inStock: true },

  // More Beauty
  { name: 'Oribe Shampoo', category: 'beauty', brand: 'Oribe', size: '8.5 oz', price: 58.00, inStock: true },
  { name: 'Glossier Boy Brow', category: 'beauty', brand: 'Glossier', size: '0.12 oz', price: 16.00, inStock: true },
  { name: 'Laneige Water Sleeping Mask', category: 'beauty', brand: 'Laneige', size: '70ml', price: 29.00, inStock: true },

  // More Toys
  { name: 'Codenames Board Game', category: 'toys', brand: 'Czech Games', size: '2-8 players', price: 14.99, inStock: true },
  { name: 'Roku Streaming Stick 4K', category: 'toys', brand: 'Roku', size: 'Voice Remote', price: 49.99, inStock: true },
];

export { PRODUCT_DATABASE };

export const searchProducts = async (query: string): Promise<SearchResult[]> => {
  try {
    // Simulate API delay for realism
    await new Promise(resolve => setTimeout(resolve, 100));

    const lowerQuery = query.toLowerCase().trim();

    if (!lowerQuery) {
      return [];
    }

    // Split query into individual words for flexible matching
    const queryWords = lowerQuery.split(/\s+/);

    // Filter products using flexible word matching
    const filtered = PRODUCT_DATABASE.filter((product) => {
      const productName = product.name.toLowerCase();
      const productCategory = product.category.toLowerCase();
      const productBrand = product.brand.toLowerCase();

      // Check if any query word matches any part of product name, category, or brand
      return queryWords.some(queryWord => {
        // For short queries (1-2 chars), require exact start of word
        if (queryWord.length <= 2) {
          const nameWords = productName.split(/\s+/);
          const brandWords = productBrand.split(/\s+/);
          return nameWords.some(word => word.startsWith(queryWord)) ||
                 brandWords.some(word => word.startsWith(queryWord)) ||
                 productCategory.startsWith(queryWord);
        }

        // For longer queries, allow substring matching
        return productName.includes(queryWord) ||
               productCategory.includes(queryWord) ||
               productBrand.includes(queryWord);
      });
    });

    // Sort results by relevance (products with more matching words first)
    const sorted = filtered.sort((a, b) => {
      const aMatches = queryWords.filter(word =>
        a.name.toLowerCase().includes(word) ||
        a.brand.toLowerCase().includes(word) ||
        a.category.toLowerCase().includes(word)
      ).length;

      const bMatches = queryWords.filter(word =>
        b.name.toLowerCase().includes(word) ||
        b.brand.toLowerCase().includes(word) ||
        b.category.toLowerCase().includes(word)
      ).length;

      return bMatches - aMatches;
    });

    return sorted;
  } catch (error) {
    console.error('Search failed:', error);
    // Return empty array on failure (no fallback)
    return [];
  }
};

// Dynamic fallback grocery items - prices vary based on current market simulation
const getFallbackGroceryItems = (query: string): SearchResult[] => {
  // Simulate dynamic pricing with slight variations
  const getDynamicPrice = (basePrice: number) => {
    const variation = (Math.random() - 0.5) * 0.4; // ±20% variation
    return Math.round((basePrice * (1 + variation)) * 100) / 100;
  };

  const fallbackTemplates: Record<string, Array<{name: string, category: string, brand: string, size: string, basePrice: number}>> = {
    'potato': [
      { name: 'Potatoes', category: 'vegetables', brand: 'Fresh Farms', size: '5 lb bag', basePrice: 4.99 },
      { name: 'Sweet Potatoes', category: 'vegetables', brand: 'Fresh Farms', size: '2 lb bag', basePrice: 3.49 },
      { name: 'Organic Potatoes', category: 'vegetables', brand: 'Organic Valley', size: '3 lb bag', basePrice: 6.99 },
    ],
    'potatoes': [
      { name: 'Potatoes', category: 'vegetables', brand: 'Fresh Farms', size: '5 lb bag', basePrice: 4.99 },
      { name: 'Sweet Potatoes', category: 'vegetables', brand: 'Fresh Farms', size: '2 lb bag', basePrice: 3.49 },
      { name: 'Organic Potatoes', category: 'vegetables', brand: 'Organic Valley', size: '3 lb bag', basePrice: 6.99 },
    ],
    'apple': [
      { name: 'Red Apples', category: 'fruits', brand: 'Fresh Farms', size: '3 lb bag', basePrice: 5.99 },
      { name: 'Green Apples', category: 'fruits', brand: 'Fresh Farms', size: '3 lb bag', basePrice: 5.49 },
      { name: 'Organic Apples', category: 'fruits', brand: 'Organic Valley', size: '2 lb bag', basePrice: 7.99 },
    ],
    'apples': [
      { name: 'Red Apples', category: 'fruits', brand: 'Fresh Farms', size: '3 lb bag', basePrice: 5.99 },
      { name: 'Green Apples', category: 'fruits', brand: 'Fresh Farms', size: '3 lb bag', basePrice: 5.49 },
      { name: 'Organic Apples', category: 'fruits', brand: 'Organic Valley', size: '2 lb bag', basePrice: 7.99 },
    ],
    'milk': [
      { name: 'Whole Milk', category: 'dairy', brand: 'Dairy Fresh', size: '1 gallon', basePrice: 3.99 },
      { name: '2% Milk', category: 'dairy', brand: 'Dairy Fresh', size: '1 gallon', basePrice: 3.89 },
      { name: 'Organic Milk', category: 'dairy', brand: 'Organic Valley', size: '1 gallon', basePrice: 5.49 },
    ],
    'bread': [
      { name: 'Whole Wheat Bread', category: 'bakery', brand: 'Bakery Best', size: '24 oz loaf', basePrice: 2.99 },
      { name: 'White Bread', category: 'bakery', brand: 'Bakery Best', size: '20 oz loaf', basePrice: 2.49 },
      { name: 'Sourdough Bread', category: 'bakery', brand: 'Artisan Bakery', size: '18 oz loaf', basePrice: 4.99 },
    ],
    'eggs': [
      { name: 'Large Eggs', category: 'dairy', brand: 'Farm Fresh', size: '12 count', basePrice: 4.99 },
      { name: 'Organic Eggs', category: 'dairy', brand: 'Farm Fresh', size: '12 count', basePrice: 6.99 },
      { name: 'Free Range Eggs', category: 'dairy', brand: 'Happy Farms', size: '12 count', basePrice: 5.99 },
    ],
    'cheese': [
      { name: 'Cheddar Cheese', category: 'dairy', brand: 'Dairy Fresh', size: '8 oz block', basePrice: 3.49 },
      { name: 'Mozzarella Cheese', category: 'dairy', brand: 'Dairy Fresh', size: '8 oz block', basePrice: 3.29 },
      { name: 'Parmesan Cheese', category: 'dairy', brand: 'Italian Imports', size: '8 oz wedge', basePrice: 5.99 },
    ],
    'chicken': [
      { name: 'Chicken Breast', category: 'meat', brand: 'Farm Fresh', size: '1 lb', basePrice: 7.99 },
      { name: 'Whole Chicken', category: 'meat', brand: 'Farm Fresh', size: '4-5 lb', basePrice: 12.99 },
      { name: 'Organic Chicken Breast', category: 'meat', brand: 'Organic Valley', size: '1 lb', basePrice: 9.99 },
    ],
    'rice': [
      { name: 'White Rice', category: 'pantry', brand: 'Pantry Plus', size: '2 lb bag', basePrice: 2.99 },
      { name: 'Brown Rice', category: 'pantry', brand: 'Pantry Plus', size: '2 lb bag', basePrice: 3.49 },
      { name: 'Basmati Rice', category: 'pantry', brand: 'International Foods', size: '2 lb bag', basePrice: 4.99 },
    ],
    'pasta': [
      { name: 'Spaghetti Pasta', category: 'pantry', brand: 'Pantry Plus', size: '16 oz box', basePrice: 1.99 },
      { name: 'Penne Pasta', category: 'pantry', brand: 'Pantry Plus', size: '16 oz box', basePrice: 1.99 },
      { name: 'Whole Wheat Pasta', category: 'pantry', brand: 'Healthy Choice', size: '16 oz box', basePrice: 2.49 },
    ],
  };

  const lowerQuery = query.toLowerCase();
  for (const [key, templates] of Object.entries(fallbackTemplates)) {
    if (lowerQuery.includes(key)) {
      // Generate dynamic items with varying prices
      return templates.map(template => ({
        name: template.name,
        category: template.category,
        brand: template.brand,
        size: template.size,
        price: getDynamicPrice(template.basePrice),
        inStock: Math.random() > 0.1, // 90% in stock
      }));
    }
  }

  // Dynamic generic fallback for unrecognized items
  const genericBrands = ['Generic', 'Store Brand', 'Value Line', 'Premium Choice'];
  const genericSizes = ['Standard', 'Regular', 'Medium', 'Large'];
  const randomBrand = genericBrands[Math.floor(Math.random() * genericBrands.length)];
  const randomSize = genericSizes[Math.floor(Math.random() * genericSizes.length)];
  const randomPrice = Math.round((Math.random() * 10 + 1) * 100) / 100; // $1-11 range

  return [
    {
      name: query.charAt(0).toUpperCase() + query.slice(1),
      category: 'grocery',
      brand: randomBrand,
      size: randomSize,
      price: randomPrice,
      inStock: Math.random() > 0.05, // 95% in stock
    },
  ];
};
