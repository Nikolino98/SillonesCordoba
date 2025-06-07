
import { Truck, Shield, Award, HeartHandshake, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Features = () => {
  const features = [
    {
      icon: Truck,
      title: "Envío Gratis",
      description: "Entrega gratuita en Córdoba capital en compras mayores a $150.000",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Shield,
      title: "Garantía Extendida",
      description: "2 años de garantía en estructura y 1 año en tapizado",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Award,
      title: "Calidad Premium",
      description: "Materiales seleccionados y procesos de fabricación artesanal",
      color: "from-warm-500 to-warm-600"
    },
    {
      icon: HeartHandshake,
      title: "Atención Personalizada",
      description: "Asesoramiento profesional para encontrar el sillón perfecto",
      color: "from-brand-500 to-brand-600"
    },
    {
      icon: Clock,
      title: "Fabricación Rápida",
      description: "Tiempo de producción de 15 a 20 días hábiles",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: MapPin,
      title: "Showroom Local",
      description: "Visitanos en nuestro showroom en el centro de Córdoba",
      color: "from-red-500 to-red-600"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-100 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-warm-100 rounded-full filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            ¿Por qué elegir 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-warm-600 block">
              Sillones Córdoba?
            </span>
          </h2>
          <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Más de 10 años brindando comfort y calidad a las familias cordobesas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group p-8 rounded-3xl bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100"
            >
              <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center group-hover:text-brand-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-center text-lg">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-brand-600 to-warm-600 hover:from-brand-700 hover:to-warm-700 text-white px-12 py-4 text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Conocé Nuestras Ventajas
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Features;
