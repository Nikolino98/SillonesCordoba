
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Sparkles, Award } from "lucide-react";

const Hero = () => {
  return (
    <section id="inicio" className="relative min-h-screen bg-gradient-to-br from-brand-50 via-warm-50 to-brand-100 flex items-center overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-brand-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-warm-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-brand-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-20 right-20 animate-float">
        <div className="w-16 h-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-brand-600" />
        </div>
      </div>
      
      <div className="absolute bottom-32 right-32 animate-float animation-delay-2000">
        <div className="w-12 h-12 bg-warm-500/10 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-center">
          <Award className="w-6 h-6 text-warm-600" />
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-full w-fit shadow-lg">
              <div className="flex text-warm-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700 pr-2">+500 clientes satisfechos</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Los Mejores 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-warm-600 block">
                  Sillones
                </span>
                <span className="text-3xl lg:text-5xl text-gray-700">de Córdoba</span>
              </h1>
            </div>
            
            <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl">
              Descubrí nuestra colección exclusiva de sillones de diseño. 
              <span className="font-semibold text-brand-700">Calidad premium</span>, comfort excepcional y entrega a domicilio.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white px-10 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group"
                onClick={() => document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Ver Catálogo
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-brand-600 text-brand-600 hover:bg-brand-50 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Consultar Medidas
              </Button>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-2 gap-8 pt-8">
              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <h3 className="font-bold text-lg text-gray-900 mb-2">Entrega Gratis</h3>
                <p className="text-gray-600">En compras mayores a $150.000</p>
              </div>
              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <h3 className="font-bold text-lg text-gray-900 mb-2">Garantía 2 Años</h3>
                <p className="text-gray-600">En estructura y tapizado</p>
              </div>
            </div>
          </div>
          
          {/* Image */}
          <div className="relative animate-fade-in animation-delay-500">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 group">
              <img 
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop" 
                alt="Sillón moderno en living elegante" 
                className="w-full h-[600px] object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-8 -right-8 bg-gradient-to-r from-warm-500 to-warm-600 text-white p-6 rounded-2xl shadow-2xl z-20 animate-bounce">
              <span className="text-lg font-bold">¡Oferta!</span>
              <br />
              <span className="text-sm">Hasta 30% OFF</span>
            </div>
            
            <div className="absolute -bottom-8 -left-8 bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-2xl z-20">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-100 to-brand-200 rounded-2xl flex items-center justify-center">
                  <Star className="w-8 h-8 text-brand-600 fill-current" />
                </div>
                <div>
                  <p className="font-bold text-lg text-gray-900">Calidad Premium</p>
                  <p className="text-gray-600">Materiales seleccionados</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
