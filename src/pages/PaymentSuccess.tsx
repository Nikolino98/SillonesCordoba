
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const clearCart = useCartStore((state) => state.clearCart);
  const [purchaseData, setPurchaseData] = useState<any>(null);
  
  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');
  const externalReference = searchParams.get('external_reference');

  useEffect(() => {
    // Limpiar el carrito cuando el pago es exitoso
    if (status === 'approved') {
      clearCart();
      
      // Recuperar datos de la compra del localStorage
      const savedData = localStorage.getItem('lastPurchaseData');
      if (savedData) {
        setPurchaseData(JSON.parse(savedData));
      }
    }
  }, [status, clearCart]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleContactSupport = () => {
    if (!purchaseData) {
      // Contacto básico sin datos de compra
      const basicMessage = `Hola, necesito ayuda con mi pago. ID de pago: ${paymentId || 'No disponible'}`;
      const whatsappNumber = "5493517716373";
      const encodedMessage = encodeURIComponent(basicMessage);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
      return;
    }

    // Crear mensaje detallado con datos de la compra
    const orderDetails = purchaseData.items.map((item: any) => {
      const colorText = item.selectedColor ? ` - Color: ${item.selectedColor}` : '';
      return `• ${item.product.name}${colorText} - Cantidad: ${item.quantity} - ${formatPrice(item.product.price * item.quantity)}`;
    }).join('\n');

    const supportMessage = `Hola, necesito soporte para mi compra:

🧾 *INFORMACIÓN DEL PAGO*
ID de Pago: ${paymentId || 'No disponible'}
Estado: ${status || 'No disponible'}
Referencia: ${externalReference || 'No disponible'}

📋 *PRODUCTOS COMPRADOS*
${orderDetails}

💰 *TOTAL PAGADO: ${formatPrice(purchaseData.totalPrice)}*

👤 *DATOS DEL CLIENTE*
Nombre: ${purchaseData.customerData.name}
Email: ${purchaseData.customerData.email}
Teléfono: ${purchaseData.customerData.phone}
Dirección: ${purchaseData.customerData.address || 'No especificada'}

💳 *MÉTODO DE PAGO*
Mercado Pago

📅 *FECHA DE COMPRA*
${new Date(purchaseData.timestamp).toLocaleString('es-AR')}

Por favor, ayúdenme con mi consulta.
¡Gracias!`;

    const whatsappNumber = "5493516123456";
    const encodedMessage = encodeURIComponent(supportMessage);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          ¡Pago Exitoso!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Tu pago ha sido procesado correctamente. Recibirás un email de confirmación en breve.
        </p>
        
        {paymentId && (
          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <p className="text-sm text-gray-600">ID de Pago:</p>
            <p className="font-mono text-lg font-bold text-gray-900">{paymentId}</p>
          </div>
        )}

        <div className="space-y-3">
          <Link to="/" className="block">
            <Button className="w-full bg-gradient-to-r from-brand-600 to-warm-600 hover:from-brand-700 hover:to-warm-700">
              Volver al Inicio
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleContactSupport}
          >
            Contactar Soporte
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
