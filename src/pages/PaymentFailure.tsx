
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

const PaymentFailure = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');
  const statusDetail = searchParams.get('status_detail');

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-12 h-12 text-white" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Pago Fallido
        </h1>
        
        <p className="text-gray-600 mb-6">
          No pudimos procesar tu pago. Por favor, intenta nuevamente o contacta a nuestro soporte.
        </p>
        
        {statusDetail && (
          <div className="bg-red-50 rounded-2xl p-4 mb-6">
            <p className="text-sm text-red-600">Motivo:</p>
            <p className="font-medium text-red-700">{statusDetail}</p>
          </div>
        )}

        <div className="space-y-3">
          <Link to="/" className="block">
            <Button className="w-full bg-gradient-to-r from-brand-600 to-warm-600 hover:from-brand-700 hover:to-warm-700">
              Intentar Nuevamente
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

export default PaymentFailure;
