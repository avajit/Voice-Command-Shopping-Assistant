import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { BarChart3, Package, CheckCircle2, TrendingUp } from 'lucide-react';
import { ShoppingItem, ShoppingHistory } from '../App';

interface ShoppingStatsProps {
  items: ShoppingItem[];
  history: ShoppingHistory[];
}

export function ShoppingStats({ items, history }: ShoppingStatsProps) {
  const totalItems = items.length;
  const completedItems = items.filter(item => item.completed).length;
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  
  // Get most frequent category
  const categoryCount: Record<string, number> = {};
  items.forEach(item => {
    categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
  });
  
  const topCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0];
  
  // Get most purchased item from history
  const topItem = [...history].sort((a, b) => b.frequency - a.frequency)[0];

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Statistics
        </CardTitle>
        <CardDescription>Your shopping insights</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Package className="w-4 h-4 text-blue-600" />
              <p className="text-sm text-blue-700">Total Items</p>
            </div>
            <p className="text-2xl text-blue-900">{totalItems}</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <p className="text-sm text-green-700">Completed</p>
            </div>
            <p className="text-2xl text-green-900">{completedItems}</p>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <p className="text-sm text-purple-700">Total Quantity</p>
          </div>
          <p className="text-2xl text-purple-900">{totalQuantity}</p>
        </div>

        {topCategory && (
          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-1">Top Category</p>
            <p className="text-gray-900">{topCategory[0]}</p>
            <p className="text-sm text-gray-500">{topCategory[1]} items</p>
          </div>
        )}

        {topItem && (
          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-1">Most Purchased</p>
            <p className="text-gray-900">{topItem.itemName}</p>
            <p className="text-sm text-gray-500">Purchased {topItem.frequency} times</p>
          </div>
        )}

        {items.length === 0 && history.length === 0 && (
          <div className="text-center py-8">
            <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">
              Statistics will appear as you use the app
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
