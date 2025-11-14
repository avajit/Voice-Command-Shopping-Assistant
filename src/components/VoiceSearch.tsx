import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Search, Mic, MicOff, DollarSign, Package, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { searchProducts, PRODUCT_DATABASE } from '../utils/productSearch';

interface SearchResult {
  name: string;
  category: string;
  brand?: string;
  size?: string;
  price: number;
  inStock: boolean;
}

interface VoiceSearchProps {
  onAddToList: (name: string, quantity?: number) => void;
  language: string;
  onSearchQuery?: (query: string) => void;
}

export function VoiceSearch({ onAddToList, language, onSearchQuery }: VoiceSearchProps) {
  const [isListening, setIsListening] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [priceFilter, setPriceFilter] = useState<{ min?: number; max?: number }>({});
  const [isSearching, setIsSearching] = useState(false);
  const [showProductCount, setShowProductCount] = useState(5);
  const recognitionRef = useRef<any>(null);

  // Use the centralized product search function
  const fetchProductsFromAPI = async (query: string): Promise<SearchResult[]> => {
    return await searchProducts(query);
  };

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      
      if (event.results[current].isFinal) {
        processSearchCommand(transcript);
      } else {
        setSearchQuery(transcript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Search voice error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      if (isListening) {
        recognition.start();
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language]);

  const processSearchCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();

    // Check if this is an add command
    const addPatterns = [
      /add (\d+)?\s*(.+?)(?:\s+to (?:my )?list)?$/i,
      /i (?:need|want) (?:to buy )?(\d+)?\s*(.+)$/i,
      /buy (\d+)?\s*(.+)$/i,
      /get (\d+)?\s*(.+)$/i,
      /purchase (\d+)?\s*(.+)$/i,
      /(?:please )?add (.+)$/i,
      /(?:i want|i need|i\'d like) (.+)$/i,
      /(?:can you add|could you add) (.+)$/i,
      /(?:put|include) (.+?)(?:\s+on (?:my )?list)?$/i,
    ];

    for (const pattern of addPatterns) {
      const match = lowerCommand.match(pattern);
      if (match) {
        let quantity = 1;
        let itemName = '';

        if (match[1] && match[2]) {
          quantity = match[1] ? parseInt(match[1]) : 1;
          itemName = match[2].trim();
        } else if (match[1]) {
          itemName = match[1].trim();
        }

        // Extract quantity from item name if present
        const quantityMatch = itemName.match(/^(\d+)\s+(.+)$/);
        if (quantityMatch) {
          quantity = parseInt(quantityMatch[1]);
          itemName = quantityMatch[2].trim();
        }

        if (itemName) {
          // Clean up common words
          itemName = itemName
            .replace(/\b(a|an|the|some|few|many|couple of|dozen|pack of|bottle of|can of|box of|bag of|loaf of|pound of|pounds of|ounces of|oz of)\b/gi, '')
            .trim();

          if (itemName) {
            // Search and add the item
            fetchProductsFromAPI(itemName).then(results => {
              if (results.length > 0) {
                const bestMatch = results[0];
                onAddToList(bestMatch.name, quantity);
                toast.success(`Added ${quantity} ${bestMatch.name} to your list`);
              } else {
                toast.error(`${itemName} is not available in the store.`);
              }
            }).catch(() => {
              toast.error(`${itemName} is not available in the store.`);
            });
            return;
          }
        }
      }
    }

    // Extract price range from command
    const priceMatch = lowerCommand.match(/under (\d+)|less than (\d+)|below (\d+)/i);
    if (priceMatch) {
      const maxPrice = parseInt(priceMatch[1] || priceMatch[2] || priceMatch[3]);
      setPriceFilter({ max: maxPrice });
      toast.success(`Filtering items under $${maxPrice}`);
      return;
    }

    const rangeMatch = lowerCommand.match(/between (\d+) and (\d+)/i);
    if (rangeMatch) {
      setPriceFilter({ min: parseInt(rangeMatch[1]), max: parseInt(rangeMatch[2]) });
      toast.success(`Filtering items between $${rangeMatch[1]} and $${rangeMatch[2]}`);
      return;
    }

    // If no add or filter command, treat as search query
    const cleanQuery = lowerCommand
      .replace(/find|search|show|get|look for/gi, '')
      .replace(/under \d+|less than \d+|below \d+|between \d+ and \d+/gi, '')
      .replace(/dollars?|\$/gi, '')
      .trim();

    if (cleanQuery) {
      setSearchQuery(cleanQuery);
      performSearch(cleanQuery);
    } else {
      // If just an item name without keywords, try to search and add
      const words = lowerCommand.split(/\s+/);
      const potentialItems = words.filter(word =>
        word.length > 2 &&
        !['find', 'search', 'show', 'get', 'look', 'for', 'the', 'a', 'an', 'some', 'and', 'or', 'but', 'to', 'from', 'my', 'list', 'under', 'below', 'less', 'than', 'between', 'dollars', 'dollar', '$'].includes(word.toLowerCase())
      );

      if (potentialItems.length > 0) {
        const itemName = potentialItems.join(' ');
        fetchProductsFromAPI(itemName).then(results => {
          if (results.length > 0) {
            const bestMatch = results[0];
            onAddToList(bestMatch.name, 1);
            toast.success(`Added ${bestMatch.name} to your list`);
          } else {
            toast.error(`${itemName} is not available in the store.`);
          }
        }).catch(() => {
          toast.error(`${itemName} is not available in the store.`);
        });
      } else {
        toast.error('Command not recognized. Try "add iPhone" or "find Nike shoes"');
      }
    }
  };

  const performSearch = async (query: string) => {
    setIsSearching(true);

    try {
      // Call API to get results
      let results = await fetchProductsFromAPI(query);

      // Apply price filter
      if (priceFilter.min !== undefined) {
        results = results.filter((p: SearchResult) => p.price >= priceFilter.min!);
      }
      if (priceFilter.max !== undefined) {
        results = results.filter((p: SearchResult) => p.price <= priceFilter.max!);
      }

      setSearchResults(results);

      // Track search query for NLP suggestions
      if (onSearchQuery) {
        onSearchQuery(query);
      }

      if (results.length === 0) {
        toast.error('No items found matching your search');
      } else {
        toast.success(`Found ${results.length} items`);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const toggleVoiceSearch = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
      toast.success('Listening for search query...');
    }
  };

  const handleManualSearch = () => {
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    }
  };

  const clearFilters = () => {
    setPriceFilter({});
    setSearchQuery('');
    setSearchResults([]);
  };

  const showMoreProducts = () => {
    setShowProductCount(prev => Math.min(prev + 5, PRODUCT_DATABASE.length));
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

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-600" />
          Voice-Activated Search
        </CardTitle>
        <CardDescription>
          Search for items by voice with price filtering
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Controls */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
              className="pl-10"
            />
          </div>
          <Button onClick={handleManualSearch} variant="outline">
            Search
          </Button>
          <Button
            onClick={toggleVoiceSearch}
            className={isListening ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            {isListening ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Active Filters */}
        {(priceFilter.min !== undefined || priceFilter.max !== undefined) && (
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-100 text-blue-700">
              <DollarSign className="w-3 h-3 mr-1" />
              {priceFilter.min && `$${priceFilter.min} - `}
              {priceFilter.max ? `$${priceFilter.max}` : 'Any'}
            </Badge>
            <Button size="sm" variant="ghost" onClick={clearFilters}>
              Clear
            </Button>
          </div>
        )}

        {/* Voice Examples */}
        {isListening && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-700 mb-2">Try saying:</p>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>• "Add iPhone 15"</li>
              <li>• "Find Nike Air Max"</li>
              <li>• "Show me Dyson vacuum"</li>
              <li>• "Search for Atomic Habits"</li>
            </ul>
            <p className="text-xs text-blue-500 mt-2">
              💡 Available: iPhone, MacBook Pro, Nike shoes, Dyson vacuum, Atomic Habits, organic bananas, whole milk, eggs, bread, etc.
            </p>
          </div>
        )}

        {/* Loading State */}
        {isSearching && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Searching...</p>
          </div>
        )}

        {/* Search Results */}
        {!isSearching && searchResults.length > 0 && (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            <p className="text-sm text-gray-600">{searchResults.length} results found</p>
            {searchResults.map((result, index) => (
              <div
                key={index}
                className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-gray-900">{result.name}</p>
                      {!result.inStock && (
                        <Badge variant="outline" className="text-xs text-red-600">
                          Out of Stock
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{result.brand}</span>
                      <span>•</span>
                      <span>{result.size}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="text-xs bg-purple-100 text-purple-700">
                        {result.category}
                      </Badge>
                      <span className="text-green-700">${result.price.toFixed(2)}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => onAddToList(result.name, 1)}
                    disabled={!result.inStock}
                    className="shrink-0"
                  >
                    Add
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isSearching && searchResults.length === 0 && searchQuery && (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No items found</p>
            <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Available Products Section */}
        {!isSearching && (
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Available Products in Store</h3>
            <div className="space-y-2">
              {PRODUCT_DATABASE.slice(0, showProductCount).map((product, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-2 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => onAddToList(product.name, 1)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate">{product.name}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span>{product.brand}</span>
                        <span>•</span>
                        <Badge className="text-xs bg-purple-100 text-purple-700 px-1 py-0">
                          {product.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-700">${product.price.toFixed(2)}</p>
                      <Button size="sm" variant="outline" className="text-xs h-6 px-2">
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {showProductCount < PRODUCT_DATABASE.length && (
              <div className="text-center mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={showMoreProducts}
                  className="text-xs"
                >
                  Show More Products ({PRODUCT_DATABASE.length - showProductCount} remaining)
                </Button>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2 text-center">
              Showing {showProductCount} of {PRODUCT_DATABASE.length} products • Click to add or search for more
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
