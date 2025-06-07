import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, MessageCircle } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CartDrawer = () => {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice, getTotalItems } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: '',
    notes: ''
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleQuantityChange = (productId: string, newQuantity: number, selectedColor?: string) => {
    if (newQuantity < 1) {
      removeItem(productId, selectedColor);
    } else {
      updateQuantity(productId, newQuantity, selectedColor);
    }
  };

  const handleMercadoPagoPayment = async () => {
    if (!customerData.name || !customerData.phone) {
      toast.error('Por favor completa nombre y teléfono');
      return;
    }

    setIsProcessingPayment(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-mercadopago-preference', {
        body: {
          items,
          customerData
        }
      });

      if (error) {
        console.error('Error creating preference:', error);
        toast.error('Error al procesar el pago');
        return;
      }

      // Guardar datos de la compra en localStorage para la página de éxito
      localStorage.setItem('lastPurchaseData', JSON.stringify({
        customerData,
        items,
        totalPrice: getTotalPrice(),
        timestamp: new Date().toISOString()
      }));

      // Redirigir a Mercado Pago
      window.location.href = data.init_point;
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al procesar el pago');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleWhatsAppOrder = async () => {
    if (!customerData.name || !customerData.phone || !customerData.paymentMethod) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    // Crear mensaje para WhatsApp con color incluido
    const orderDetails = items.map(item => {
      const colorText = item.selectedColor ? ` - Color: ${item.selectedColor}` : '';
      return `• ${item.product.name}${colorText} - Cantidad: ${item.quantity} - ${formatPrice(item.product.price * item.quantity)}`;
    }).join('\n');

    const message = `¡Hola! Quiero realizar el siguiente pedido:

📋 *DETALLES DEL PEDIDO*
${orderDetails}

💰 *TOTAL: ${formatPrice(getTotalPrice())}*

👤 *DATOS DEL CLIENTE*
Nombre: ${customerData.name}
Email: ${customerData.email}
Teléfono: ${customerData.phone}
Dirección: ${customerData.address}

💳 *MÉTODO DE PAGO*
${customerData.paymentMethod}

${customerData.notes ? `📝 *NOTAS ADICIONALES*\n${customerData.notes}` : ''}

¡Gracias!`;

    // Generar enlace de WhatsApp
    const whatsappNumber = "5493517716373"; // Reemplaza con tu número de WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Abrir WhatsApp
    window.open(whatsappUrl, '_blank');

    // Limpiar carrito
    clearCart();
    setCustomerData({
      name: '',
      email: '',
      phone: '',
      address: '',
      paymentMethod: '',
      notes: ''
    });
    setIsCheckingOut(false);
    
    toast.success('Pedido enviado a WhatsApp');
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative hover:scale-105 transition-transform">
          <ShoppingCart className="w-4 h-4" />
          {getTotalItems() > 0 && (
            <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center bg-gradient-to-r from-brand-600 to-warm-600 border-0">
              {getTotalItems()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg overflow-y-auto bg-white/95 backdrop-blur-sm">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-brand-700 to-warm-700 bg-clip-text text-transparent">
            Carrito de Compras
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">Tu carrito está vacío</p>
              <p className="text-gray-400 text-sm">Agrega productos para comenzar</p>
            </div>
          ) : (
            <>
              {!isCheckingOut ? (
                <>
                  {/* Items del carrito */}
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={`${item.product.id}-${item.selectedColor}`} className="flex gap-4 p-6 border rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-xl shadow-md"
                        />
                        
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-1">{item.product.name}</h3>
                          {item.selectedColor && (
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm text-gray-600">Color:</span>
                              <Badge variant="outline" className="text-xs">
                                {item.selectedColor}
                              </Badge>
                            </div>
                          )}
                          <p className="text-brand-600 font-bold text-lg">
                            {formatPrice(item.product.price)}
                          </p>
                          
                          <div className="flex items-center gap-3 mt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleQuantityChange(item.product.id, item.quantity - 1, item.selectedColor)}
                              className="w-8 h-8 p-0 rounded-lg"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center font-bold">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleQuantityChange(item.product.id, item.quantity + 1, item.selectedColor)}
                              className="w-8 h-8 p-0 rounded-lg"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => removeItem(item.product.id, item.selectedColor)}
                              className="ml-auto rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="border-t-2 pt-6">
                    <div className="flex justify-between items-center text-2xl font-bold">
                      <span>Total:</span>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-warm-600">
                        {formatPrice(getTotalPrice())}
                      </span>
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="space-y-3">
                    <Button 
                      className="w-full h-12 bg-gradient-to-r from-brand-600 to-warm-600 hover:from-brand-700 hover:to-warm-700 font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                      onClick={() => setIsCheckingOut(true)}
                    >
                      Finalizar Pedido
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full h-12 rounded-xl"
                      onClick={clearCart}
                    >
                      Limpiar Carrito
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* Formulario de checkout */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Datos del Cliente</h3>
                    
                    <div>
                      <Label htmlFor="name">Nombre Completo *</Label>
                      <Input
                        id="name"
                        value={customerData.name}
                        onChange={(e) => setCustomerData(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerData.email}
                        onChange={(e) => setCustomerData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Teléfono *</Label>
                      <Input
                        id="phone"
                        value={customerData.phone}
                        onChange={(e) => setCustomerData(prev => ({ ...prev, phone: e.target.value }))}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Dirección de Entrega</Label>
                      <Textarea
                        id="address"
                        value={customerData.address}
                        onChange={(e) => setCustomerData(prev => ({ ...prev, address: e.target.value }))}
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="paymentMethod">Método de Pago *</Label>
                      <Select value={customerData.paymentMethod} onValueChange={(value) => setCustomerData(prev => ({ ...prev, paymentMethod: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar método de pago" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mercadopago">Mercado Pago</SelectItem>
                          <SelectItem value="efectivo">Efectivo</SelectItem>
                          <SelectItem value="transferencia">Transferencia Bancaria</SelectItem>
                          <SelectItem value="tarjeta_debito">Tarjeta de Débito</SelectItem>
                          <SelectItem value="tarjeta_credito">Tarjeta de Crédito</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="notes">Notas Adicionales</Label>
                      <Textarea
                        id="notes"
                        value={customerData.notes}
                        onChange={(e) => setCustomerData(prev => ({ ...prev, notes: e.target.value }))}
                        rows={3}
                        placeholder="Horario de entrega, instrucciones especiales, etc."
                      />
                    </div>

                    {/* Resumen del pedido */}
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Resumen del Pedido</h4>
                      <div className="space-y-1 text-sm">
                        {items.map((item) => (
                          <div key={`${item.product.id}-${item.selectedColor}`} className="flex justify-between">
                            <span>
                              {item.product.name} 
                              {item.selectedColor && ` (${item.selectedColor})`} 
                              x{item.quantity}
                            </span>
                            <span>{formatPrice(item.product.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t mt-2 pt-2 flex justify-between font-bold">
                        <span>Total:</span>
                        <span className="text-brand-600">{formatPrice(getTotalPrice())}</span>
                      </div>
                    </div>

                    {/* Botones de pago */}
                    <div className="space-y-2">
                      {customerData.paymentMethod === 'mercadopago' && (
                        <Button 
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
                          onClick={handleMercadoPagoPayment}
                          disabled={isProcessingPayment}
                        >
                          <CreditCard className="w-4 h-4" />
                          {isProcessingPayment ? 'Procesando...' : 'Pagar con Mercado Pago'}
                        </Button>
                      )}
                      
                      {customerData.paymentMethod && customerData.paymentMethod !== 'mercadopago' && (
                        <Button 
                          className="w-full bg-green-600 hover:bg-green-700 flex items-center gap-2"
                          onClick={handleWhatsAppOrder}
                        >
                          <MessageCircle className="w-4 h-4" />
                          Enviar Pedido por WhatsApp
                        </Button>
                      )}
                      
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setIsCheckingOut(false)}
                      >
                        Volver al Carrito
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
