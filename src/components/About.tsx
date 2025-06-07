
import { Users, Calendar, Star, Award, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const About = () => {
  const stats = [
    { icon: Users, value: "500+", label: "Clientes Satisfechos", color: "from-blue-500 to-blue-600" },
    { icon: Calendar, value: "10+", label: "Años de Experiencia", color: "from-green-500 to-green-600" },
    { icon: Star, value: "4.9", label: "Calificación Promedio", color: "from-warm-500 to-warm-600" },
    { icon: Award, value: "100%", label: "Garantía de Calidad", color: "from-brand-500 to-brand-600" }
  ];

  return (
    <section id="sobre-nosotros" className="py-24 bg-gradient-to-br from-brand-50 via-warm-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-brand-200 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-warm-200 rounded-full filter blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8 fade-in">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-warm-500" />
                <span className="text-warm-600 font-semibold uppercase tracking-wide text-sm">Nuestra Historia</span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Tradición y Calidad en 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-warm-600 block">
                  Cada Sillón
                </span>
              </h2>
            </div>
            
            <div className="space-y-6 text-lg">
              <p className="text-gray-600 leading-relaxed">
                Somos una empresa familiar cordobesa con más de 10 años de experiencia 
                en la fabricación y venta de sillones de alta calidad. Nos especializamos 
                en crear piezas únicas que combinan <span className="font-semibold text-brand-600">diseño, comfort y durabilidad</span>.
              </p>
              
              <p className="text-gray-600 leading-relaxed">
                Cada sillón es fabricado artesanalmente en nuestro taller local, 
                utilizando materiales premium seleccionados cuidadosamente. 
                Nuestro compromiso es brindar productos que acompañen a las familias 
                cordobesas durante muchos años.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 pt-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <Button 
              size="lg" 
              className="bg-gradient-to-r from-brand-600 to-warm-600 hover:from-brand-700 hover:to-warm-700 text-white px-10 py-4 text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Conocé Nuestro Showroom
            </Button>
          </div>

          {/* Images */}
          <div className="relative fade-in animation-delay-500">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500">
                  <img 
                    src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop" 
                    alt="Taller de fabricación" 
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <div className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500">
                  <img 
                    src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=200&fit=crop" 
                    alt="Showroom" 
                    className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
              
              <div className="space-y-6 pt-12">
                <div className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500">
                  <img 
                    src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=200&fit=crop" 
                    alt="Proceso de tapizado" 
                    className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <div className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500">
                  <img 
                    src="https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop" 
                    alt="Sillones terminados" 
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            </div>

            {/* Floating testimonial */}
            <div className="absolute -bottom-8 -left-8 bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-2xl z-10 border border-white/20">
              <div className="flex items-center gap-2 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-warm-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-800 font-semibold text-lg mb-1">
                "Excelente calidad y atención"
              </p>
              <p className="text-gray-600 text-sm">
                - María González, Córdoba
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
