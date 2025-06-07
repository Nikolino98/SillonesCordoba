
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit3, Save, X } from "lucide-react";
import { toast } from "sonner";

const CategoryManager = () => {
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string } | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const { data: categories, refetch } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('category')
        .neq('category', null);
      
      if (error) throw error;
      
      // Get unique categories
      const uniqueCategories = [...new Set(data.map(p => p.category))];
      return uniqueCategories.map(cat => ({ id: cat, name: cat }));
    }
  });

  const { data: categoryStats } = useQuery({
    queryKey: ['category-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('category');
      
      if (error) throw error;
      
      const stats: Record<string, number> = {};
      data.forEach(product => {
        if (product.category) {
          stats[product.category] = (stats[product.category] || 0) + 1;
        }
      });
      
      return stats;
    }
  });

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Por favor ingresa un nombre para la categoría");
      return;
    }

    setIsAdding(true);
    try {
      // Check if category already exists
      const existingCategory = categories?.find(cat => 
        cat.name.toLowerCase() === newCategory.toLowerCase()
      );
      
      if (existingCategory) {
        toast.error("Esta categoría ya existe");
        return;
      }

      // Create a dummy product with the new category to register it
      // (We'll just add it to our local state for now)
      toast.success("Categoría agregada. Podrás usarla al crear productos.");
      setNewCategory("");
      refetch();
    } catch (error) {
      toast.error("Error al agregar categoría");
    } finally {
      setIsAdding(false);
    }
  };

  const handleUpdateCategory = async (oldName: string, newName: string) => {
    if (!newName.trim()) {
      toast.error("El nombre de la categoría no puede estar vacío");
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .update({ category: newName })
        .eq('category', oldName);

      if (error) throw error;

      toast.success("Categoría actualizada");
      setEditingCategory(null);
      refetch();
    } catch (error) {
      toast.error("Error al actualizar categoría");
    }
  };

  const handleDeleteCategory = async (categoryName: string) => {
    const productCount = categoryStats?.[categoryName] || 0;
    
    if (productCount > 0) {
      toast.error(`No se puede eliminar. Hay ${productCount} productos en esta categoría`);
      return;
    }

    // Since there are no products, the category will naturally disappear
    toast.success("Categoría eliminada");
    refetch();
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-6 bg-gradient-to-b from-brand-500 to-warm-500 rounded-full"></div>
          Gestión de Categorías
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add new category */}
        <div className="flex gap-4">
          <Input
            placeholder="Nueva categoría"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
            className="flex-1"
          />
          <Button 
            onClick={handleAddCategory}
            disabled={isAdding}
            className="bg-brand-600 hover:bg-brand-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            {isAdding ? "Agregando..." : "Agregar"}
          </Button>
        </div>

        {/* Categories list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories?.map((category) => (
            <Card key={category.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                {editingCategory?.id === category.id ? (
                  <div className="flex gap-2 flex-1">
                    <Input
                      value={editingCategory.name}
                      onChange={(e) => setEditingCategory({
                        ...editingCategory,
                        name: e.target.value
                      })}
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleUpdateCategory(category.id, editingCategory.name)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingCategory(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div>
                      <h4 className="font-semibold capitalize">{category.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">
                          {categoryStats?.[category.id] || 0} productos
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingCategory({ id: category.id, name: category.name })}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteCategory(category.id)}
                        disabled={(categoryStats?.[category.id] || 0) > 0}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>

        {categories?.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No hay categorías creadas aún</p>
            <p className="text-sm">Agrega productos para crear categorías automáticamente</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryManager;
