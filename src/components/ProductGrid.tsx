import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Filter, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProductCard from "./ProductCard";
import ProductQuickView from "./ProductQuickView";
import { Product } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";

const ProductGrid = () => {
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images(*)
        `)
        .eq('in_stock', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.original_price,
        category: product.category,
        description: product.description,
        images: product.product_images?.map((img: any) => img.image_url) || [],
        features: product.features || [],
        materials: product.materials || [],
        dimensions: {
          width: product.width || 0,
          height: product.height || 0,
          depth: product.depth || 0
        },
        colors: product.colors || [],
        inStock: product.in_stock,
        isNew: product.is_new,
        isFeatured: product.is_featured
      }));
    }
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('category')
        .eq('in_stock', true);
      
      if (error) throw error;
      
      const categoryCount = data.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return [
        { id: "todos", name: "Todos", count: data.length },
        { id: "modernos", name: "Modernos", count: categoryCount.modernos || 0 },
        { id: "clasicos", name: "Clásicos", count: categoryCount.clasicos || 0 },
        { id: "reclinables", name: "Reclinables", count: categoryCount.reclinables || 0 },
        { id: "ejecutivos", name: "Ejecutivos", count: categoryCount.ejecutivos || 0 }
      ];
    }
  });

  const filteredProducts = products.filter(product => 
    selectedCategory === "todos" || product.category === selectedCategory
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name":
        return a.name.localeCompare(b.name);
      case "newest":
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      default: // featured
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    }
  });

  if (isLoading) {
    return (
      <section id="productos" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nuestros Sillones</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
              Descubrí nuestra amplia selección de sillones diseñados para cada estilo y necesidad
            </p>
            <div className="py-8">Cargando productos...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="productos" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nuestros Sillones
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descubrí nuestra amplia selección de sillones diseñados para cada estilo y necesidad
            </p>
          </div>

          {/* Filters and Controls */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={selectedCategory === category.id ? "bg-brand-600 hover:bg-brand-700" : ""}
                >
                  {category.name}
                  <Badge variant="secondary" className="ml-2">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>

            {/* Sort and View Controls */}
            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Destacados</SelectItem>
                  <SelectItem value="newest">Más nuevos</SelectItem>
                  <SelectItem value="price-low">Precio: menor a mayor</SelectItem>
                  <SelectItem value="price-high">Precio: mayor a menor</SelectItem>
                  <SelectItem value="name">Nombre A-Z</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="mb-6">
            <p className="text-gray-600 font-medium">
              Mostrando {sortedProducts.length} de {products.length} productos
            </p>
          </div>

          {/* Products Grid */}
          <div className={`grid gap-6 ${
            viewMode === "grid" 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1 lg:grid-cols-2"
          }`}>
            {sortedProducts.map((product) => (
              <div key={product.id} className="fade-in">
                <ProductCard 
                  product={product} 
                  onQuickView={setSelectedProduct}
                />
              </div>
            ))}
          </div>

          {/* Empty state */}
          {sortedProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="mb-4">
                  <Filter className="w-16 h-16 text-gray-400 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-gray-600">
                  Intenta cambiar los filtros o explorar otras categorías
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSelectedCategory("todos");
                    setSortBy("featured");
                  }}
                >
                  Limpiar filtros
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Product Quick View Modal */}
      {selectedProduct && (
        <ProductQuickView 
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
};

export default ProductGrid;
