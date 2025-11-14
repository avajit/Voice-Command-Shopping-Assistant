import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Trash2, Package, ChevronDown, ChevronUp } from 'lucide-react';
import { ShoppingItem } from '../App';
import { useState } from 'react';

interface ShoppingListManagerProps {
  items: ShoppingItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onToggleComplete: (id: string) => void;
  onClearCompleted: () => void;
}

export function ShoppingListManager({
  items,
  onRemove,
  onUpdateQuantity,
  onToggleComplete,
  onClearCompleted,
}: ShoppingListManagerProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

  const categories = Object.keys(groupedItems).sort();
  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      'Dairy': 'bg-blue-100 text-blue-700',
      'Produce': 'bg-green-100 text-green-700',
      'Meat': 'bg-red-100 text-red-700',
      'Bakery': 'bg-yellow-100 text-yellow-700',
      'Beverages': 'bg-cyan-100 text-cyan-700',
      'Snacks': 'bg-orange-100 text-orange-700',
      'Pantry': 'bg-amber-100 text-amber-700',
      'Frozen': 'bg-indigo-100 text-indigo-700',
      'Personal Care': 'bg-pink-100 text-pink-700',
      'Household': 'bg-purple-100 text-purple-700',
      'Other': 'bg-gray-100 text-gray-700',
    };
    return colors[category] || colors['Other'];
  };

  if (items.length === 0) {
    return (
      <Card className="border-2 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            Shopping List
          </CardTitle>
          <CardDescription>Your shopping list is empty</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No items yet</p>
            <p className="text-sm text-gray-400">
              Use voice commands to add items to your list
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              Shopping List
            </CardTitle>
            <CardDescription>
              {totalCount} items • {completedCount} completed
            </CardDescription>
          </div>
          {completedCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearCompleted}
              className="text-red-600 hover:text-red-700"
            >
              Clear Completed
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map(category => {
          const categoryItems = groupedItems[category];
          const isExpanded = expandedCategories.has(category);
          const completedInCategory = categoryItems.filter(item => item.completed).length;

          return (
            <div key={category} className="border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                  <Badge className={getCategoryColor(category)}>
                    {category}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {categoryItems.length} items
                    {completedInCategory > 0 && ` • ${completedInCategory} completed`}
                  </span>
                </div>
              </button>

              {isExpanded && (
                <div className="divide-y">
                  {categoryItems.map(item => (
                    <div
                      key={item.id}
                      className={`p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors ${
                        item.completed ? 'opacity-60' : ''
                      }`}
                    >
                      <Checkbox
                        checked={item.completed}
                        onCheckedChange={() => onToggleComplete(item.id)}
                      />
                      
                      <div className="flex-1">
                        <p className={`${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                          className="w-20"
                        />
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemove(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
