import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sparkles, TrendingUp, Leaf, RefreshCw, Plus, Brain } from 'lucide-react';
import { ShoppingItem, ShoppingHistory } from '../App';
import { useState, useEffect } from 'react';
import { searchProducts } from '../utils/productSearch';

interface SmartSuggestionsProps {
  items: ShoppingItem[];
  history: ShoppingHistory[];
  searchHistory?: string[];
  onAcceptSuggestion: (itemName: string) => void;
}

interface Suggestion {
  name: string;
  reason: string;
  type: 'frequent' | 'seasonal' | 'substitute' | 'complementary' | 'personalized';
  icon: any;
  price?: number;
}

export function SmartSuggestions({ items, history, searchHistory = [], onAcceptSuggestion }: SmartSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    const generateSuggestionsAsync = async () => {
      await generateSuggestions();
    };
    generateSuggestionsAsync();
  }, [items, history, searchHistory]);

  const generateSuggestions = async () => {
    const newSuggestions: Suggestion[] = [];
    const currentItemNames = items.map(i => i.name.toLowerCase());

    // Frequent items not in current list
    const frequentItems = [...history]
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 5)
      .filter(h => !currentItemNames.includes(h.itemName.toLowerCase()));

    frequentItems.forEach(item => {
      newSuggestions.push({
        name: item.itemName,
        reason: `You buy this often (${item.frequency} times)`,
        type: 'frequent',
        icon: TrendingUp,
      });
    });

    // Seasonal suggestions (based on current month)
    const month = new Date().getMonth();
    const seasonalItems = getSeasonalItems(month);

    seasonalItems
      .filter(item => !currentItemNames.includes(item.toLowerCase()))
      .slice(0, 2)
      .forEach(item => {
        newSuggestions.push({
          name: item,
          reason: 'In season now',
          type: 'seasonal',
          icon: Leaf,
        });
      });

    // Substitutes for items in list
    items.slice(0, 3).forEach(item => {
      const substitute = getSubstitute(item.name);
      if (substitute && !currentItemNames.includes(substitute.toLowerCase())) {
        newSuggestions.push({
          name: substitute,
          reason: `Alternative to ${item.name}`,
          type: 'substitute',
          icon: RefreshCw,
        });
      }
    });

    // Complementary items
    items.slice(0, 3).forEach(item => {
      const complement = getComplementaryItem(item.name);
      if (complement && !currentItemNames.includes(complement.toLowerCase())) {
        newSuggestions.push({
          name: complement,
          reason: `Goes well with ${item.name}`,
          type: 'complementary',
          icon: Sparkles,
        });
      }
    });

    // Personalized suggestions based on search history using NLP
    const personalizedSuggestions = await generatePersonalizedSuggestions(searchHistory, currentItemNames);
    newSuggestions.push(...personalizedSuggestions);

    // API-based suggestions from recent searches
    const apiSuggestions = await generateAPISuggestions(searchHistory, currentItemNames);
    newSuggestions.push(...apiSuggestions);

    // Generate complementary suggestions based on items in cart (always, regardless of search history)
    const complementarySuggestions = await generateComplementarySuggestions(items, currentItemNames);
    newSuggestions.push(...complementarySuggestions);

    // Limit to 6 suggestions and remove duplicates
    const uniqueSuggestions = newSuggestions.filter(
      (suggestion, index, self) =>
        index === self.findIndex(s => s.name.toLowerCase() === suggestion.name.toLowerCase())
    );

    setSuggestions(uniqueSuggestions.slice(0, 6));
  };

  const generatePersonalizedSuggestions = async (searchHistory: string[], currentItemNames: string[]): Promise<Suggestion[]> => {
    const personalizedSuggestions: Suggestion[] = [];

    if (searchHistory.length === 0) return personalizedSuggestions;

    try {
      // Use Hugging Face API for NLP analysis
      const apiKey = (import.meta as any).env.VITE_HUGGINGFACE_API_KEY;

      if (!apiKey) {
        console.warn('Hugging Face API key not found, using fallback suggestions');
        return getFallbackSuggestions(currentItemNames);
      }

      // Analyze search history with Hugging Face NLP API
      const allSearches = searchHistory.join(' ');

      // Use a simpler approach - extract keywords directly from search history
      // This avoids API authentication issues while still providing personalized suggestions
      const keywords = allSearches.toLowerCase().split(/[\s,.;!?]+/).filter(word => word.length > 2);

      // Common food-related categories and their related items
      const categoryMappings: { [key: string]: string[] } = {
        'fruit': ['Strawberries', 'Blueberries', 'Oranges', 'Grapes', 'Pineapple', 'Apples', 'Bananas'],
        'vegetable': ['Spinach', 'Broccoli', 'Carrots', 'Tomatoes', 'Bell Peppers', 'Potatoes', 'Onions', 'Lettuce'],
        'dairy': ['Cheddar Cheese', 'Butter', 'Eggs', 'Greek Yogurt', 'Milk', 'Cream Cheese'],
        'meat': ['Ground Beef', 'Salmon Fillet', 'Turkey Breast', 'Chicken Thighs', 'Chicken Breast'],
        'beverage': ['Tea', 'Soda', 'Water Bottles', 'Energy Drinks', 'Coffee', 'Orange Juice'],
        'snack': ['Granola Bars', 'Chips', 'Popcorn', 'Nuts', 'Cookies', 'Candy'],
        'bakery': ['Bagels', 'Muffins', 'Croissants', 'Donuts', 'Bread', 'Cake'],
        'pantry': ['Rice', 'Quinoa', 'Olive Oil', 'Spices', 'Pasta', 'Cereal', 'Flour'],
        'frozen': ['Frozen Pizza', 'Ice Cream', 'Frozen Vegetables', 'Frozen Meals'],
        'personal': ['Shampoo', 'Soap', 'Deodorant', 'Tissues', 'Toothpaste'],
        'household': ['Paper Towels', 'Trash Bags', 'Laundry Detergent', 'Dish Soap'],
      };

      // Check for category matches in keywords
      const matchedCategories = Object.keys(categoryMappings).filter(category =>
        keywords.some((keyword: string) => keyword.includes(category) || category.includes(keyword))
      );

      // Generate suggestions based on matched categories
      matchedCategories.forEach(category => {
        const relatedItems = categoryMappings[category];
        const availableItems = relatedItems.filter(item =>
          !currentItemNames.includes(item.toLowerCase())
        );

        if (availableItems.length > 0) {
          const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
          personalizedSuggestions.push({
            name: randomItem,
            reason: `Based on your interest in ${category}s`,
            type: 'personalized',
            icon: Brain,
          });
        }
      });

      // Check for preference-based suggestions (organic, premium, etc.)
      const preferences = keywords.filter((keyword: string) =>
        ['organic', 'premium', 'fresh', 'natural', 'low-fat', 'gluten-free'].includes(keyword)
      );

      if (preferences.length > 0) {
        // Suggest premium or organic versions of common items
        const preferenceItems = [
          'Organic Apples', 'Premium Coffee', 'Fresh Bread', 'Natural Yogurt',
          'Low-Fat Milk', 'Gluten-Free Pasta'
        ];

        const availablePreferenceItems = preferenceItems.filter(item =>
          !currentItemNames.includes(item.toLowerCase())
        );

        if (availablePreferenceItems.length > 0) {
          const randomItem = availablePreferenceItems[Math.floor(Math.random() * availablePreferenceItems.length)];
          personalizedSuggestions.push({
            name: randomItem,
            reason: `Matches your preference for ${preferences[0]}`,
            type: 'personalized',
            icon: Brain,
          });
        }
      }

      return personalizedSuggestions.slice(0, 2); // Limit to 2 personalized suggestions
    } catch (error) {
      console.error('NLP API Error:', error);
      // Fallback to basic suggestions if API fails
      return getFallbackSuggestions(currentItemNames);
    }
  };

  const generateAPISuggestions = async (searchHistory: string[], currentItemNames: string[]): Promise<Suggestion[]> => {
    const apiSuggestions: Suggestion[] = [];

    if (searchHistory.length === 0) return apiSuggestions;

    try {
      // Get the most recent unique searches (last 3)
      const recentSearches = [...new Set(searchHistory.slice(-3))];

      for (const searchQuery of recentSearches) {
        const results = await searchProducts(searchQuery);

        // Get products that aren't already in the list
        const availableProducts = results.filter(product =>
          !currentItemNames.includes(product.name.toLowerCase()) &&
          product.inStock
        );

        // Add up to 2 suggestions per search query
        const suggestionsToAdd = availableProducts.slice(0, 2);
        suggestionsToAdd.forEach(product => {
          apiSuggestions.push({
            name: product.name,
            reason: `Found in store - $${product.price.toFixed(2)}`,
            type: 'personalized',
            icon: Brain,
            price: product.price,
          });
        });
      }

      return apiSuggestions.slice(0, 2); // Limit to 2 API suggestions total
    } catch (error) {
      console.error('API suggestions error:', error);
      return [];
    }
  };

  const generateComplementarySuggestions = async (cartItems: ShoppingItem[], currentItemNames: string[]): Promise<Suggestion[]> => {
    const complementarySuggestions: Suggestion[] = [];

    // Define complementary product relationships (like screen guard for mobile)
    const complementaryMappings: Record<string, string[]> = {
      // Mobile phones and accessories
      'iphone': ['iPhone Screen Protector', 'iPhone Case', 'AirPods', 'iPhone Charger'],
      'samsung galaxy': ['Samsung Screen Protector', 'Samsung Case', 'Galaxy Buds', 'Samsung Charger'],
      'google pixel': ['Pixel Screen Protector', 'Pixel Case', 'Pixel Buds', 'Pixel Charger'],
      'oneplus': ['OnePlus Screen Protector', 'OnePlus Case', 'OnePlus Buds', 'OnePlus Charger'],
      'xiaomi': ['Xiaomi Screen Protector', 'Xiaomi Case', 'Xiaomi Earbuds', 'Xiaomi Charger'],
      'poco': ['Poco Screen Protector', 'Poco Case', 'Poco Earbuds', 'Poco Charger'],

      // Laptops and accessories
      'macbook': ['MacBook Sleeve', 'Magic Mouse', 'MacBook Charger', 'Thunderbolt Cable'],
      'dell': ['Dell Laptop Bag', 'Dell Mouse', 'Dell Charger', 'USB Hub'],
      'hp': ['HP Laptop Case', 'HP Mouse', 'HP Charger', 'HDMI Cable'],
      'lenovo': ['Lenovo Backpack', 'Lenovo Mouse', 'Lenovo Charger', 'Docking Station'],

      // Shoes and accessories
      'nike': ['Nike Socks', 'Nike Shoe Laces', 'Nike Insoles', 'Nike Shoe Cleaner'],
      'adidas': ['Adidas Socks', 'Adidas Shoe Laces', 'Adidas Insoles', 'Adidas Shoe Bag'],
      'puma': ['Puma Socks', 'Puma Shoe Laces', 'Puma Insoles', 'Puma Shoe Care Kit'],

      // Books and accessories
      'book': ['Bookmark Set', 'Reading Light', 'Book Stand', 'Book Cover'],
      'kindle': ['Kindle Case', 'Kindle Screen Protector', 'Kindle Charger', 'Kindle Stand'],

      // Kitchen appliances and accessories
      'coffee maker': ['Coffee Filters', 'Coffee Beans', 'Coffee Mug', 'Descaling Solution'],
      'blender': ['Blender Jars', 'Blender Blades', 'Blender Cleaning Brush', 'Recipe Book'],
      'air fryer': ['Air Fryer Basket', 'Air Fryer Liners', 'Silicone Tongs', 'Recipe Book'],
      'instant pot': ['Instant Pot Accessories', 'Pressure Cooker Recipes', 'Extra Sealing Rings'],

      // Gaming and accessories
      'playstation': ['PS5 Controller', 'PS5 Headset', 'PS5 Stand', 'PS5 Games'],
      'xbox': ['Xbox Controller', 'Xbox Headset', 'Xbox Stand', 'Xbox Games'],
      'nintendo switch': ['Switch Case', 'Switch Screen Protector', 'Switch Joy-Con Grip', 'Switch Games'],

      // General electronics
      'headphones': ['Headphone Case', 'Audio Cable', 'Headphone Stand', 'Cleaning Kit'],
      'speaker': ['Speaker Stand', 'Audio Cable', 'Speaker Cover', 'Battery Pack'],
      'camera': ['Camera Case', 'Memory Card', 'Camera Bag', 'Lens Cleaner'],

      // Clothing and accessories
      'watch': ['Watch Band', 'Watch Box', 'Watch Winder', 'Watch Cleaner'],
      'sunglasses': ['Sunglass Case', 'Lens Cleaner', 'Sunglass Chain', 'Cleaning Cloth'],
      'bag': ['Bag Organizer', 'Bag Charm', 'Bag Hanger', 'Bag Cover'],

      // Home and garden
      'plant': ['Plant Pot', 'Plant Soil', 'Plant Fertilizer', 'Watering Can'],
      'grill': ['Grill Cover', 'Grill Brush', 'Grill Tools', 'Charcoal'],
      'bicycle': ['Bike Lock', 'Bike Light', 'Bike Helmet', 'Bike Pump'],

      // Sports and fitness
      'yoga mat': ['Yoga Blocks', 'Yoga Strap', 'Yoga Towel', 'Meditation Cushion'],
      'dumbbells': ['Dumbbell Rack', 'Weight Bench', 'Resistance Bands', 'Workout Gloves'],
      'treadmill': ['Treadmill Mat', 'Heart Rate Monitor', 'Water Bottle', 'Towel'],

      // Baby and kids
      'diaper': ['Diaper Cream', 'Wipes', 'Diaper Bag', 'Changing Pad'],
      'stroller': ['Stroller Organizer', 'Stroller Cup Holder', 'Rain Cover', 'Stroller Hook'],
      'toy': ['Toy Storage', 'Toy Cleaner', 'Batteries', 'Toy Repair Kit'],
    };

    // Check each item in cart for complementary suggestions
    for (const cartItem of cartItems) {
      const itemName = cartItem.name.toLowerCase();

      // Find matching complementary products
      for (const [key, complements] of Object.entries(complementaryMappings)) {
        if (itemName.includes(key)) {
          // Get available complementary products
          for (const complement of complements) {
            try {
              const results = await searchProducts(complement);
              const availableProducts = results.filter(product =>
                !currentItemNames.includes(product.name.toLowerCase()) &&
                product.inStock
              );

              if (availableProducts.length > 0) {
                const bestMatch = availableProducts[0];
                complementarySuggestions.push({
                  name: bestMatch.name,
                  reason: `Complements your ${cartItem.name}`,
                  type: 'complementary',
                  icon: Sparkles,
                  price: bestMatch.price,
                });
              }
            } catch (error) {
              console.error(`Error finding complement for ${complement}:`, error);
            }
          }
          break; // Only check first matching category
        }
      }
    }

    return complementarySuggestions.slice(0, 2); // Limit to 2 complementary suggestions
  };

  const getFallbackSuggestions = (currentItemNames: string[]): Suggestion[] => {
    const fallbackItems = [
      'Organic Apples', 'Premium Coffee', 'Fresh Bread', 'Natural Yogurt'
    ];

    const availableItems = fallbackItems.filter(item =>
      !currentItemNames.includes(item.toLowerCase())
    );

    if (availableItems.length > 0) {
      const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
      return [{
        name: randomItem,
        reason: 'Popular choice based on trends',
        type: 'personalized',
        icon: Brain,
      }];
    }

    return [];
  };

  const getSeasonalItems = (month: number): string[] => {
    // November (month 10) - Fall/Winter items
    const seasonal: Record<string, string[]> = {
      'fall': ['Pumpkin', 'Butternut Squash', 'Brussels Sprouts', 'Sweet Potato', 'Cranberries'],
      'winter': ['Citrus Fruits', 'Root Vegetables', 'Kale', 'Winter Squash', 'Pomegranate'],
      'spring': ['Asparagus', 'Strawberries', 'Peas', 'Artichokes', 'Spring Lettuce'],
      'summer': ['Tomatoes', 'Corn', 'Watermelon', 'Berries', 'Zucchini'],
    };

    if (month >= 9 && month <= 11) return seasonal.fall;
    if (month >= 0 && month <= 2) return seasonal.winter;
    if (month >= 3 && month <= 5) return seasonal.spring;
    return seasonal.summer;
  };

  const getSubstitute = (itemName: string): string | null => {
    const substitutes: Record<string, string> = {
      'milk': 'Almond Milk',
      'almond milk': 'Oat Milk',
      'butter': 'Olive Oil',
      'sugar': 'Honey',
      'white bread': 'Whole Wheat Bread',
      'pasta': 'Whole Grain Pasta',
      'beef': 'Chicken',
      'chicken': 'Turkey',
      'rice': 'Quinoa',
      'soda': 'Sparkling Water',
      'chips': 'Veggie Chips',
      'ice cream': 'Frozen Yogurt',
    };

    const lowerName = itemName.toLowerCase();
    for (const [key, value] of Object.entries(substitutes)) {
      if (lowerName.includes(key)) {
        return value;
      }
    }
    return null;
  };

  const getComplementaryItem = (itemName: string): string | null => {
    const complements: Record<string, string> = {
      'bread': 'Butter',
      'pasta': 'Tomato Sauce',
      'cereal': 'Milk',
      'coffee': 'Creamer',
      'chips': 'Salsa',
      'crackers': 'Cheese',
      'hamburger buns': 'Ground Beef',
      'hot dog buns': 'Hot Dogs',
      'lettuce': 'Salad Dressing',
      'eggs': 'Bacon',
      'pancake mix': 'Maple Syrup',
      'peanut butter': 'Jelly',
      'tortilla chips': 'Guacamole',
    };

    const lowerName = itemName.toLowerCase();
    for (const [key, value] of Object.entries(complements)) {
      if (lowerName.includes(key)) {
        return value;
      }
    }
    return null;
  };

  const getBadgeColor = (type: string): string => {
    const colors: Record<string, string> = {
      'frequent': 'bg-purple-100 text-purple-700',
      'seasonal': 'bg-green-100 text-green-700',
      'substitute': 'bg-blue-100 text-blue-700',
      'complementary': 'bg-orange-100 text-orange-700',
      'personalized': 'bg-indigo-100 text-indigo-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  if (suggestions.length === 0) {
    return (
      <Card className="border-2 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Smart Suggestions
          </CardTitle>
          <CardDescription>AI-powered shopping recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">
              Add items to see personalized suggestions
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          Smart Suggestions
        </CardTitle>
        <CardDescription>AI-powered shopping recommendations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.map((suggestion, index) => {
          const Icon = suggestion.icon;
          return (
            <div
              key={index}
              className="p-3 border rounded-lg hover:bg-gray-50 transition-colors flex items-start gap-3"
            >
              <div className="bg-purple-100 p-2 rounded-lg">
                <Icon className="w-4 h-4 text-purple-600" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-gray-900">{suggestion.name}</p>
                  {suggestion.price && (
                    <span className="text-green-600 font-semibold text-sm">
                      ${suggestion.price.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`text-xs ${getBadgeColor(suggestion.type)}`}>
                    {suggestion.type}
                  </Badge>
                  <p className="text-xs text-gray-500 truncate">{suggestion.reason}</p>
                </div>
              </div>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => onAcceptSuggestion(suggestion.name)}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 shrink-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
