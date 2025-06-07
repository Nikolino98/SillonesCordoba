
import { Heart, ShoppingCart, Eye, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Product } from "@/types/product";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

const ProductCard = ({ product, onQuickView }: ProductCardProps) => {
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem(product);
    toast.success(`${product.name} agregado al carrito`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getColorStyle = (color: string) => {
    const colorMap: Record<string, string> = {
      'negro': '#1a1a1a',
      'blanco': '#ffffff',
      'gris': '#6b7280',
      'marrón': '#8B4513',
      'beige': '#F5F5DC',
      'azul': '#3b82f6',
      'verde': '#10b981',
      'rojo': '#ef4444',
      'rosa': '#ec4899',
      'amarillo': '#f59e0b'
    };
    return colorMap[color.toLowerCase()] || '#9ca3af';
  };

  return (
    <Card className="group hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="relative overflow-hidden">
        <div className="aspect-[4/3] overflow-hidden">
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isNew && (
            <Badge className="bg-gradient-to-r from-warm-500 to-warm-600 hover:from-warm-600 hover:to-warm-700 text-white font-bold text-xs px-3 py-1 shadow-lg">
              NUEVO
            </Badge>
          )}
          {product.originalPrice && (
            <Badge variant="destructive" className="font-bold text-xs px-3 py-1 shadow-lg bg-red-500 hover:bg-red-600">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </Badge>
          )}
          {!product.inStock && (
            <Badge variant="secondary" className="font-bold text-xs px-3 py-1 shadow-lg bg-gray-500 text-white">
              SIN STOCK
            </Badge>
          )}
        </div>

        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
          <Button
            size="icon"
            className="w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-xl text-gray-700 hover:text-brand-600 border-0"
            onClick={() => onQuickView?.(product)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            className="w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-xl text-gray-700 hover:text-red-500 border-0"
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick add to cart overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Button 
            className="w-full bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-bold shadow-xl"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {product.inStock ? 'Agregar al Carrito' : 'Sin Stock'}
          </Button>
        </div>
      </div>

      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="font-bold text-xl text-gray-900 line-clamp-2 leading-tight group-hover:text-brand-600 transition-colors">
            {product.name}
          </h3>
          
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Colors */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Colores:</span>
          <div className="flex items-center gap-2">
            {product.colors.slice(0, 4).map((color, index) => (
              <div 
                key={index}
                className="relative w-6 h-6 rounded-full shadow-md hover:scale-110 transition-transform cursor-pointer group/color"
                style={{ backgroundColor: getColorStyle(color) }}
                title={color}
              >
                <div className="absolute inset-0 rounded-full ring-2 ring-white shadow-sm" />
                {color.toLowerCase() === 'blanco' && (
                  <div className="absolute inset-0 rounded-full ring-1 ring-gray-200" />
                )}
              </div>
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-full">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex text-warm-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-current" />
            ))}
          </div>
          <span className="text-xs text-gray-500">(4.8)</span>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <div className="w-full space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-brand-600">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 font-medium bg-gray-50 px-2 py-1 rounded-full w-fit">
                {product.dimensions.width}×{product.dimensions.height}×{product.dimensions.depth}cm
              </p>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
