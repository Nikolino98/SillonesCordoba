
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface ProductPreviewProps {
  product: any;
  onClose: () => void;
}

const ProductPreview = ({ product, onClose }: ProductPreviewProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = product.product_images || [];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>
            Vista previa completa del producto
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Galería de imágenes */}
          <div className="space-y-4">
            {images.length > 0 ? (
              <>
                <div className="relative">
                  <img 
                    src={images[currentImageIndex]?.image_url} 
                    alt={product.name}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  {images.length > 1 && (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute left-2 top-1/2 transform -translate-y-1/2"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={nextImage}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
                
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {images.map((img: any, index: number) => (
                      <button
                        key={img.id}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded border-2 ${
                          index === currentImageIndex ? 'border-brand-600' : 'border-gray-200'
                        }`}
                      >
                        <img 
                          src={img.image_url} 
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
              {product.original_price && (
                <span className="text-lg text-gray-500 line-through">
                  {formatPrice(product.original_price)}
                </span>
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline">{product.category}</Badge>
              <Badge variant={product.in_stock ? "default" : "secondary"}>
                {product.in_stock ? "En Stock" : "Sin Stock"}
              </Badge>
              {product.is_new && <Badge className="bg-warm-500">Nuevo</Badge>}
              {product.is_featured && <Badge className="bg-brand-500">Destacado</Badge>}
            </div>

            <div>
              <h3 className="font-semibold mb-2">Descripción</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>

            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Características</h3>
                <ul className="list-disc list-inside space-y-1">
                  {product.features.map((feature: string, index: number) => (
                    <li key={index} className="text-gray-600">{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {product.materials && product.materials.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Materiales</h3>
                <div className="flex flex-wrap gap-2">
                  {product.materials.map((material: string, index: number) => (
                    <Badge key={index} variant="outline">{material}</Badge>
                  ))}
                </div>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Colores Disponibles</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color: string, index: number) => (
                    <Badge key={index} variant="outline">{color}</Badge>
                  ))}
                </div>
              </div>
            )}

            {(product.width || product.height || product.depth) && (
              <div>
                <h3 className="font-semibold mb-2">Dimensiones</h3>
                <p className="text-gray-600">
                  {product.width && `${product.width}cm (ancho)`}
                  {product.width && product.height && ' × '}
                  {product.height && `${product.height}cm (alto)`}
                  {(product.width || product.height) && product.depth && ' × '}
                  {product.depth && `${product.depth}cm (profundo)`}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductPreview;
