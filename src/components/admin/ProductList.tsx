
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ProductPreview from "./ProductPreview";
import { Product } from "@/types/product";

interface ProductListProps {
  products: any[];
  isLoading: boolean;
  onEdit: (product: Product) => void;
  onRefresh: () => void;
}

const ProductList = ({ products, isLoading, onEdit, onRefresh }: ProductListProps) => {
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Error al eliminar producto');
      return;
    }

    toast.success('Producto eliminado exitosamente');
    onRefresh();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (isLoading) {
    return <div className="text-center py-8">Cargando productos...</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPreviewProduct(product)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(product)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {product.product_images?.[0] && (
                <img 
                  src={product.product_images[0].image_url} 
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              
              <div className="flex justify-between items-center mb-2">
                <span className="text-xl font-bold text-brand-600">
                  {formatPrice(product.price)}
                </span>
                <Badge variant={product.in_stock ? "default" : "secondary"}>
                  {product.in_stock ? "En Stock" : "Sin Stock"}
                </Badge>
              </div>
              
              <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                {product.description}
              </p>
              
              <div className="flex gap-2 flex-wrap">
                <Badge variant="outline">{product.category}</Badge>
                {product.is_new && <Badge className="bg-warm-500">Nuevo</Badge>}
                {product.is_featured && <Badge className="bg-brand-500">Destacado</Badge>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {previewProduct && (
        <ProductPreview 
          product={previewProduct}
          onClose={() => setPreviewProduct(null)}
        />
      )}
    </>
  );
};

export default ProductList;
