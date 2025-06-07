
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

const PaymentPending = () => {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('payment_id');

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-12 h-12 text-white" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Pago Pendiente
        </h1>
        
        <p className="text-gray-600 mb-6">
          Tu pago está siendo procesado. Te notificaremos por email cuando se complete.
        </p>
        
        {paymentId && (
          <div className="bg-yellow-50 rounded-2xl p-4 mb-6">
            <p className="text-sm text-yellow-600">ID de Pago:</p>
            <p className="font-mono text-lg font-bold text-yellow-700">{paymentId}</p>
          </div>
        )}

        <div className="space-y-3">
          <Link to="/" className="block">
            <Button className="w-full bg-gradient-to-r from-brand-600 to-warm-600 hover:from-brand-700 hover:to-warm-700">
              Volver al Inicio
            </Button>
          </Link>
          
          <Link to="/contact" className="block">
            <Button variant="outline" className="w-full">
              Contactar Soporte
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentPending;
