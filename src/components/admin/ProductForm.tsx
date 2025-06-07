
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Upload, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Product } from "@/types/product";

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
}

const ProductForm = ({ product, onClose }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    original_price: '',
    category: '',
    description: '',
    features: [] as string[],
    materials: [] as string[],
    width: '',
    height: '',
    depth: '',
    colors: [] as string[],
    in_stock: true,
    is_new: false,
    is_featured: false
  });

  const [newFeature, setNewFeature] = useState('');
  const [newMaterial, setNewMaterial] = useState('');
  const [newColor, setNewColor] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price?.toString() || '',
        original_price: product.originalPrice?.toString() || '',
        category: product.category || '',
        description: product.description || '',
        features: product.features || [],
        materials: product.materials || [],
        width: product.dimensions?.width?.toString() || '',
        height: product.dimensions?.height?.toString() || '',
        depth: product.dimensions?.depth?.toString() || '',
        colors: product.colors || [],
        in_stock: product.inStock ?? true,
        is_new: product.isNew ?? false,
        is_featured: product.isFeatured ?? false
      });
      
      // Cargar imágenes existentes
      loadExistingImages(product.id);
    }
  }, [product]);

  const loadExistingImages = async (productId: string) => {
    const { data, error } = await supabase
      .from('product_images')
      .select('*')
      .eq('product_id', productId)
      .order('sort_order');

    if (!error && data) {
      setExistingImages(data);
    }
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleAddMaterial = () => {
    if (newMaterial.trim()) {
      setFormData(prev => ({
        ...prev,
        materials: [...prev.materials, newMaterial.trim()]
      }));
      setNewMaterial('');
    }
  };

  const handleRemoveMaterial = (index: number) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index)
    }));
  };

  const handleAddColor = () => {
    if (newColor.trim()) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, newColor.trim()]
      }));
      setNewColor('');
    }
  };

  const handleRemoveColor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + existingImages.length + files.length > 5) {
      toast.error('Máximo 5 imágenes por producto');
      return;
    }
    setImages(prev => [...prev, ...files]);
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = async (imageId: string) => {
    const { error } = await supabase
      .from('product_images')
      .delete()
      .eq('id', imageId);

    if (error) {
      toast.error('Error al eliminar imagen');
      return;
    }

    setExistingImages(prev => prev.filter(img => img.id !== imageId));
  };

  const uploadImages = async (productId: string) => {
    const uploadPromises = images.map(async (file, index) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${productId}-${Date.now()}-${index}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      // Guardar referencia en la tabla
      const { error: dbError } = await supabase
        .from('product_images')
        .insert({
          product_id: productId,
          image_url: urlData.publicUrl,
          sort_order: existingImages.length + index,
          is_primary: existingImages.length === 0 && index === 0
        });

      if (dbError) throw dbError;
    });

    await Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        category: formData.category,
        description: formData.description,
        features: formData.features,
        materials: formData.materials,
        width: formData.width ? parseInt(formData.width) : null,
        height: formData.height ? parseInt(formData.height) : null,
        depth: formData.depth ? parseInt(formData.depth) : null,
        colors: formData.colors,
        in_stock: formData.in_stock,
        is_new: formData.is_new,
        is_featured: formData.is_featured,
        updated_at: new Date().toISOString()
      };

      let productId;

      if (product) {
        // Actualizar producto existente
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id);

        if (error) throw error;
        productId = product.id;
      } else {
        // Crear nuevo producto
        const { data, error } = await supabase
          .from('products')
          .insert(productData)
          .select()
          .single();

        if (error) throw error;
        productId = data.id;
      }

      // Subir nuevas imágenes
      if (images.length > 0) {
        await uploadImages(productId);
      }

      toast.success(product ? 'Producto actualizado' : 'Producto creado');
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{product ? 'Editar Producto' : 'Nuevo Producto'}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información básica */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre del Producto</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Precio</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="original_price">Precio Original (opcional)</Label>
                  <Input
                    id="original_price"
                    type="number"
                    value={formData.original_price}
                    onChange={(e) => setFormData(prev => ({ ...prev, original_price: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category">Categoría</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modernos">Modernos</SelectItem>
                    <SelectItem value="clasicos">Clásicos</SelectItem>
                    <SelectItem value="reclinables">Reclinables</SelectItem>
                    <SelectItem value="ejecutivos">Ejecutivos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                />
              </div>
            </div>

            {/* Dimensiones y características */}
            <div className="space-y-4">
              <div>
                <Label>Dimensiones (cm)</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    placeholder="Ancho"
                    value={formData.width}
                    onChange={(e) => setFormData(prev => ({ ...prev, width: e.target.value }))}
                  />
                  <Input
                    placeholder="Alto"
                    value={formData.height}
                    onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                  />
                  <Input
                    placeholder="Profundo"
                    value={formData.depth}
                    onChange={(e) => setFormData(prev => ({ ...prev, depth: e.target.value }))}
                  />
                </div>
              </div>

              {/* Características */}
              <div>
                <Label>Características</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Agregar característica"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                  />
                  <Button type="button" onClick={handleAddFeature}>+</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveFeature(index)}>
                      {feature} <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Materiales */}
              <div>
                <Label>Materiales</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Agregar material"
                    value={newMaterial}
                    onChange={(e) => setNewMaterial(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddMaterial())}
                  />
                  <Button type="button" onClick={handleAddMaterial}>+</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.materials.map((material, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveMaterial(index)}>
                      {material} <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Colores */}
              <div>
                <Label>Colores Disponibles</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Agregar color"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddColor())}
                  />
                  <Button type="button" onClick={handleAddColor}>+</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.colors.map((color, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveColor(index)}>
                      {color} <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Imágenes */}
          <div>
            <Label>Imágenes (máximo 5)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="mb-4"
                disabled={images.length + existingImages.length >= 5}
              />
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {/* Imágenes existentes */}
                {existingImages.map((img) => (
                  <div key={img.id} className="relative">
                    <img src={img.image_url} alt="Producto" className="w-full h-24 object-cover rounded" />
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute -top-2 -right-2 w-6 h-6 p-0"
                      onClick={() => handleRemoveExistingImage(img.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                
                {/* Nuevas imágenes */}
                {images.map((file, index) => (
                  <div key={index} className="relative">
                    <img src={URL.createObjectURL(file)} alt="Vista previa" className="w-full h-24 object-cover rounded" />
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute -top-2 -right-2 w-6 h-6 p-0"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Opciones */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="in_stock"
                checked={formData.in_stock}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, in_stock: checked }))}
              />
              <Label htmlFor="in_stock">En Stock</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="is_new"
                checked={formData.is_new}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_new: checked }))}
              />
              <Label htmlFor="is_new">Producto Nuevo</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
              />
              <Label htmlFor="is_featured">Producto Destacado</Label>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-6">
            <Button type="submit" disabled={loading} className="bg-brand-600 hover:bg-brand-700">
              {loading ? 'Guardando...' : (product ? 'Actualizar' : 'Crear')} Producto
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;
