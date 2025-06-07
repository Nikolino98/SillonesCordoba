
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ShoppingCart, Heart } from "lucide-react";
import { useState } from "react";
import { Product } from "@/types/product";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

interface ProductQuickViewProps {
  product: Product | null;
  onClose: () => void;
}

const ProductQuickView = ({ product, onClose }: ProductQuickViewProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const { addItem } = useCartStore();

  if (!product) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleAddToCart = () => {
    addItem(product);
    toast.success(`${product.name} agregado al carrito`);
    onClose();
  };

  const getColorStyle = (color: string) => {
    const colorMap: Record<string, string> = {
      'negro': '#000000',
      'blanco': '#ffffff',
      'gris': '#888888',
      'marrón': '#8B4513',
      'beige': '#F5F5DC',
      'azul': '#0066CC',
      'verde': '#00AA00',
      'rojo': '#CC0000',
      'rosa': '#FF69B4',
      'amarillo': '#FFDD00'
    };
    return colorMap[color.toLowerCase()] || '#CCCCCC';
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Galería de imágenes */}
          <div className="space-y-4">
            {product.images.length > 0 ? (
              <>
                <div className="relative">
                  <img 
                    src={product.images[currentImageIndex]} 
                    alt={product.name}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  {product.images.length > 1 && (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                        onClick={nextImage}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
                
                {product.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {product.images.map((img: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded border-2 ${
                          index === currentImageIndex ? 'border-brand-600' : 'border-gray-200'
                        }`}
                      >
                        <img 
                          src={img} 
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover rounded"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Sin imágenes</span>
              </div>
            )}
          </div>

          {/* Información del producto */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-brand-600">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline" className="font-medium">{product.category}</Badge>
              <Badge variant={product.inStock ? "default" : "secondary"} className="font-medium">
                {product.inStock ? "En Stock" : "Sin Stock"}
              </Badge>
              {product.isNew && <Badge className="bg-warm-500 font-medium">Nuevo</Badge>}
              {product.isFeatured && <Badge className="bg-brand-500 font-medium">Destacado</Badge>}
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-lg">Descripción</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 text-lg">Características</h3>
                <ul className="list-disc list-inside space-y-1">
                  {product.features.map((feature: string, index: number) => (
                    <li key={index} className="text-gray-700">{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {product.materials && product.materials.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 text-lg">Materiales</h3>
                <div className="flex flex-wrap gap-2">
                  {product.materials.map((material: string, index: number) => (
                    <Badge key={index} variant="outline" className="font-medium">{material}</Badge>
                  ))}
                </div>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 text-lg">Colores Disponibles</h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(color)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-colors ${
                        selectedColor === color ? 'border-brand-600 bg-brand-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div 
                        className="w-5 h-5 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: getColorStyle(color) }}
                        title={color}
                      />
                      <span className="text-sm font-medium capitalize">{color}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(product.dimensions.width || product.dimensions.height || product.dimensions.depth) && (
              <div>
                <h3 className="font-semibold mb-2 text-lg">Dimensiones</h3>
                <p className="text-gray-700">
                  {product.dimensions.width && `${product.dimensions.width}cm (ancho)`}
                  {product.dimensions.width && product.dimensions.height && ' × '}
                  {product.dimensions.height && `${product.dimensions.height}cm (alto)`}
                  {(product.dimensions.width || product.dimensions.height) && product.dimensions.depth && ' × '}
                  {product.dimensions.depth && `${product.dimensions.depth}cm (profundo)`}
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button 
                className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-semibold"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {product.inStock ? 'Agregar al Carrito' : 'Sin Stock'}
              </Button>
              <Button variant="outline" size="icon" className="border-gray-300 hover:bg-gray-50">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductQuickView;
