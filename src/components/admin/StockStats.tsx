
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Package, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

interface StockStatsProps {
  products: any[];
}

const StockStats = ({ products }: StockStatsProps) => {
  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.in_stock).length;
  const outOfStockProducts = totalProducts - inStockProducts;
  const featuredProducts = products.filter(p => p.is_featured).length;
  const newProducts = products.filter(p => p.is_new).length;
  
  const stockPercentage = totalProducts > 0 ? (inStockProducts / totalProducts) * 100 : 0;
  
  // Categorías más populares
  const categoryStats = products.reduce((acc, product) => {
    const category = product.category || 'Sin categoría';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryStats)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProducts}</div>
          <p className="text-xs text-muted-foreground">
            {newProducts} nuevos este período
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">En Stock</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{inStockProducts}</div>
          <div className="mt-2">
            <Progress value={stockPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {stockPercentage.toFixed(1)}% del inventario
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sin Stock</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{outOfStockProducts}</div>
          {outOfStockProducts > 0 && (
            <div className="flex items-center mt-2">
              <AlertTriangle className="h-3 w-3 text-yellow-500 mr-1" />
              <p className="text-xs text-yellow-600">Requiere atención</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Productos Destacados</CardTitle>
          <Badge variant="secondary" className="bg-brand-100 text-brand-700">
            {featuredProducts}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-sm font-medium">Top Categorías:</div>
            {topCategories.map(([category, count]) => (
              <div key={category} className="flex justify-between text-sm">
                <span>{category}</span>
                <Badge variant="outline">{count as number}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockStats;
