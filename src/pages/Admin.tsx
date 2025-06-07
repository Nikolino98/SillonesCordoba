import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, LogOut, Package, Tags } from "lucide-react";
import ProductList from "@/components/admin/ProductList";
import ProductForm from "@/components/admin/ProductForm";
import AdminFilters from "@/components/admin/AdminFilters";
import StockStats from "@/components/admin/StockStats";
import CategoryManager from "@/components/admin/CategoryManager";
import { Product } from "@/types/product";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Admin = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    stock: '',
    featured: '',
    new: ''
  });
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const { data: products, isLoading, refetch } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Filtrar productos
  const filteredProducts = products?.filter(product => {
    if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.category && filters.category !== 'all' && product.category !== filters.category) {
      return false;
    }
    if (filters.stock === 'in_stock' && !product.in_stock) {
      return false;
    }
    if (filters.stock === 'out_of_stock' && product.in_stock) {
      return false;
    }
    if (filters.featured === 'true' && !product.is_featured) {
      return false;
    }
    if (filters.featured === 'false' && product.is_featured) {
      return false;
    }
    if (filters.new === 'true' && !product.is_new) {
      return false;
    }
    if (filters.new === 'false' && product.is_new) {
      return false;
    }
    return true;
  }) || [];

  // Obtener categorías únicas
  const categories = [...new Set(products?.map(p => p.category) || [])];

  const handleNewProduct = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
    refetch();
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Sesión cerrada");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-brand-50/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-brand-700 bg-clip-text text-transparent">
              Panel de Administrador
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Bienvenido, {user?.email}</p>
          </div>
          <div className="flex gap-4">
            <Button onClick={handleNewProduct} className="bg-gradient-to-r from-brand-600 to-warm-600 hover:from-brand-700 hover:to-warm-700 shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Producto
            </Button>
            <Button onClick={handleSignOut} variant="outline" className="shadow-lg">
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* Estadísticas de stock */}
        {products && <StockStats products={products} />}

        {isFormOpen ? (
          <ProductForm 
            product={editingProduct}
            onClose={handleCloseForm}
          />
        ) : (
          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2">
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Productos
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex items-center gap-2">
                <Tags className="w-4 h-4" />
                Categorías
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-6">
              {/* Filtros */}
              <AdminFilters 
                onFiltersChange={setFilters}
                categories={categories}
              />

              {/* Lista de productos */}
              <ProductList 
                products={filteredProducts}
                isLoading={isLoading}
                onEdit={handleEditProduct}
                onRefresh={refetch}
              />
            </TabsContent>

            <TabsContent value="categories">
              <CategoryManager />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Admin;
