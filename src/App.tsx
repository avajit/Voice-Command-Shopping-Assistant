import { useState, useEffect } from 'react';
import { ShoppingListManager } from './components/ShoppingListManager';
import { VoiceCommands } from './components/VoiceCommands';
import { VoiceSearch } from './components/VoiceSearch';
import { SmartSuggestions } from './components/SmartSuggestions';
import { ShoppingStats } from './components/ShoppingStats';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { ShoppingCart, Mic, MicOff } from 'lucide-react';

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
  addedAt: Date;
  completed: boolean;
  price?: number;
}

export interface ShoppingHistory {
  itemName: string;
  frequency: number;
  lastPurchased: Date;
  category: string;
}

export interface SearchHistory {
  query: string;
  timestamp: Date;
}

export default function App() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [history, setHistory] = useState<ShoppingHistory[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState('en-US');

  // Load data from localStorage on mount
  useEffect(() => {
    const savedItems = localStorage.getItem('shoppingItems');
    const savedHistory = localStorage.getItem('shoppingHistory');
    const savedSearchHistory = localStorage.getItem('searchHistory');

    if (savedItems) {
      setItems(JSON.parse(savedItems, (key, value) => {
        if (key === 'addedAt') return new Date(value);
        return value;
      }));
    }

    if (savedHistory) {
      setHistory(JSON.parse(savedHistory, (key, value) => {
        if (key === 'lastPurchased') return new Date(value);
        return value;
      }));
    }

    if (savedSearchHistory) {
      setSearchHistory(JSON.parse(savedSearchHistory, (key, value) => {
        if (key === 'timestamp') return new Date(value);
        return value;
      }));
    }
  }, []);

  // Save items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('shoppingItems', JSON.stringify(items));
  }, [items]);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('shoppingHistory', JSON.stringify(history));
  }, [history]);

  // Save search history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  const addItem = (name: string, quantity: number = 1, category?: string, price?: number) => {
    const itemCategory = category || categorizeItem(name);
    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name,
      quantity,
      category: itemCategory,
      addedAt: new Date(),
      completed: false,
      price: price,
    };
    
    setItems(prev => [...prev, newItem]);
    updateHistory(name, itemCategory);
    toast.success(`Added ${quantity} ${name} to your list`);
  };

  const removeItem = (id: string) => {
    const item = items.find(i => i.id === id);
    setItems(prev => prev.filter(item => item.id !== id));
    if (item) {
      toast.success(`Removed ${item.name} from your list`);
    }
  };

  const removeItemByName = (name: string) => {
    const normalizedName = name.toLowerCase().trim();
    const item = items.find(i => i.name.toLowerCase().includes(normalizedName));
    if (item) {
      removeItem(item.id);
    } else {
      toast.error(`Could not find "${name}" in your list`);
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const toggleComplete = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const clearCompleted = () => {
    const completedItems = items.filter(item => item.completed);
    setItems(prev => prev.filter(item => !item.completed));
    if (completedItems.length > 0) {
      toast.success(`Removed ${completedItems.length} completed items`);
    }
  };

  const clearAll = () => {
    setItems([]);
    toast.success('Cleared all items from your list');
  };

  const updateHistory = (itemName: string, category: string) => {
    setHistory(prev => {
      const existing = prev.find(h => h.itemName.toLowerCase() === itemName.toLowerCase());
      if (existing) {
        return prev.map(h => 
          h.itemName.toLowerCase() === itemName.toLowerCase()
            ? { ...h, frequency: h.frequency + 1, lastPurchased: new Date() }
            : h
        );
      } else {
        return [...prev, {
          itemName,
          frequency: 1,
          lastPurchased: new Date(),
          category,
        }];
      }
    });
  };

  const categorizeItem = (itemName: string): string => {
    const name = itemName.toLowerCase();
    
    const categories: { [key: string]: string[] } = {
      'Dairy': ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'eggs'],
      'Produce': ['apple', 'banana', 'orange', 'tomato', 'lettuce', 'carrot', 'potato', 'onion', 'fruit', 'vegetable'],
      'Meat': ['chicken', 'beef', 'pork', 'fish', 'turkey', 'lamb', 'salmon'],
      'Bakery': ['bread', 'bagel', 'muffin', 'cake', 'cookie', 'croissant'],
      'Beverages': ['water', 'juice', 'soda', 'coffee', 'tea', 'beer', 'wine'],
      'Snacks': ['chips', 'crackers', 'popcorn', 'nuts', 'candy', 'chocolate'],
      'Pantry': ['rice', 'pasta', 'flour', 'sugar', 'salt', 'pepper', 'oil', 'sauce'],
      'Frozen': ['ice cream', 'frozen', 'pizza'],
      'Personal Care': ['toothpaste', 'shampoo', 'soap', 'deodorant', 'tissue'],
      'Household': ['paper towel', 'cleaner', 'detergent', 'trash bag'],
    };

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => name.includes(keyword))) {
        return category;
      }
    }

    return 'Other';
  };

  const acceptSuggestion = (itemName: string) => {
    addItem(itemName, 1);
  };

  const handleSearchQuery = (query: string) => {
    setSearchHistory(prev => {
      const newEntry: SearchHistory = {
        query,
        timestamp: new Date(),
      };
      // Keep only last 20 searches
      return [newEntry, ...prev].slice(0, 20);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Toaster position="top-center" />
      
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-2xl">
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-gray-900">Voice Shopping Assistant</h1>
                <p className="text-gray-600 text-sm mt-1">Smart voice-powered shopping list</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isListening ? (
                <Mic className="w-6 h-6 text-red-500 animate-pulse" />
              ) : (
                <MicOff className="w-6 h-6 text-gray-400" />
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Shopping List */}
          <div className="lg:col-span-2 space-y-6">
            <VoiceCommands
              onAddItem={addItem}
              onRemoveItem={removeItemByName}
              onClearAll={clearAll}
              items={items}
              language={language}
              onLanguageChange={setLanguage}
              onListeningChange={setIsListening}
            />

            <VoiceSearch
              onAddToList={addItem}
              language={language}
              onSearchQuery={handleSearchQuery}
            />
            
            <ShoppingListManager
              items={items}
              onRemove={removeItem}
              onUpdateQuantity={updateQuantity}
              onToggleComplete={toggleComplete}
              onClearCompleted={clearCompleted}
            />
          </div>

          {/* Sidebar - Suggestions and Stats */}
          <div className="space-y-6">
            <SmartSuggestions
              items={items}
              history={history}
              searchHistory={searchHistory.map(s => s.query)}
              onAcceptSuggestion={acceptSuggestion}
            />
            
            <ShoppingStats items={items} history={history} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-600 text-sm">
            Voice Shopping Assistant - Technical Assessment Project
          </p>
        </div>
      </footer>
    </div>
  );
}