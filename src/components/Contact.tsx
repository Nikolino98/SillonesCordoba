
import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("¡Mensaje enviado correctamente! Nos pondremos en contacto pronto.");
    setFormData({ name: "", email: "", phone: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Dirección",
      details: ["Av. Colón 1234", "Centro, Córdoba Capital", "Córdoba, Argentina"],
      color: "from-brand-500 to-brand-600"
    },
    {
      icon: Phone,
      title: "Teléfono",
      details: ["+54 351 XXX-XXXX", "WhatsApp: +54 9 351 XXX-XXXX"],
      color: "from-green-500 to-green-600"
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@sillonescordoba.com", "ventas@sillonescordoba.com"],
      color: "from-warm-500 to-warm-600"
    },
    {
      icon: Clock,
      title: "Horarios",
      details: ["Lun - Vie: 9:00 - 18:00", "Sáb: 9:00 - 13:00", "Dom: Cerrado"],
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <section id="contacto" className="py-24 bg-gradient-to-br from-gray-50 via-white to-brand-50/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-gradient-to-r from-brand-200 to-warm-200 rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-warm-200 to-brand-200 rounded-full filter blur-3xl animate-float animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-brand-500 to-warm-500 rounded-2xl shadow-xl mb-6 animate-float">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-brand-700 to-warm-700 bg-clip-text text-transparent mb-6">
            Contactanos
          </h2>
          <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            ¿Tenés alguna consulta? Estamos aquí para ayudarte a encontrar el sillón perfecto
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-brand-500 to-warm-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="fade-in">
              <h3 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <div className="w-2 h-8 bg-gradient-to-b from-brand-500 to-warm-500 rounded-full"></div>
                Información de Contacto
              </h3>
              
              <div className="grid gap-6">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden">
                    <CardContent className="p-8">
                      <div className="flex items-start gap-6">
                        <div className={`w-16 h-16 bg-gradient-to-br ${info.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                          <info.icon className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-600 transition-colors">
                            {info.title}
                          </h4>
                          {info.details.map((detail, idx) => (
                            <p key={idx} className="text-gray-600 mb-2 text-lg leading-relaxed">
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <Card className="overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="h-72 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 to-warm-500/10"></div>
                <div className="text-center relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-r from-brand-500 to-warm-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                    <MapPin className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-700 mb-2">Nuestra Ubicación</h4>
                  <p className="text-gray-600 text-lg">Av. Colón 1234, Centro</p>
                  <p className="text-sm text-gray-500">Córdoba Capital, Argentina</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="fade-in">
            <Card className="shadow-2xl hover:shadow-3xl transition-all duration-500 bg-white/90 backdrop-blur-sm border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-brand-50 to-warm-50 pb-8">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-brand-700 to-warm-700 bg-clip-text text-transparent">
                  Envianos tu Consulta
                </CardTitle>
                <p className="text-gray-600 text-lg">Completá el formulario y te responderemos a la brevedad</p>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-3">
                        Nombre Completo *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Tu nombre completo"
                        className="h-12 border-2 border-gray-200 focus:border-brand-500 transition-colors rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-3">
                        Teléfono
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+54 351 XXX-XXXX"
                        className="h-12 border-2 border-gray-200 focus:border-brand-500 transition-colors rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-3">
                      Email *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      className="h-12 border-2 border-gray-200 focus:border-brand-500 transition-colors rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-3">
                      Mensaje *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Contanos qué tipo de sillón estás buscando, medidas necesarias, colores preferidos, etc."
                      rows={6}
                      className="border-2 border-gray-200 focus:border-brand-500 transition-colors resize-none rounded-xl"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full h-14 bg-gradient-to-r from-brand-600 to-warm-600 hover:from-brand-700 hover:to-warm-700 text-white font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-xl"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Enviando...
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Send className="w-5 h-5" />
                        Enviar Mensaje
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
