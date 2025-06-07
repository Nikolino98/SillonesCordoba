
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-brand-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              Sillones<span className="text-warm-400">Córdoba</span>
            </h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Más de 10 años creando sillones de calidad premium para las familias cordobesas. 
              Tradición, diseño y comfort en cada pieza.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-warm-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-warm-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-warm-400 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#inicio" className="hover:text-warm-400 transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#productos" className="hover:text-warm-400 transition-colors">
                  Productos
                </a>
              </li>
              <li>
                <a href="#sobre-nosotros" className="hover:text-warm-400 transition-colors">
                  Sobre Nosotros
                </a>
              </li>
              <li>
                <a href="#contacto" className="hover:text-warm-400 transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Categorías</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#productos" className="hover:text-warm-400 transition-colors">
                  Sillones Modernos
                </a>
              </li>
              <li>
                <a href="#productos" className="hover:text-warm-400 transition-colors">
                  Sillones Clásicos
                </a>
              </li>
              <li>
                <a href="#productos" className="hover:text-warm-400 transition-colors">
                  Sillones Reclinables
                </a>
              </li>
              <li>
                <a href="#productos" className="hover:text-warm-400 transition-colors">
                  Sillones Ejecutivos
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto</h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 text-warm-400" />
                <div>
                  <p>Av. Colón 1234</p>
                  <p>Centro, Córdoba Capital</p>
                  <p>Córdoba, Argentina</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-warm-400" />
                <p>+54 351 XXX-XXXX</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-warm-400" />
                <p>info@sillonescordoba.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-brand-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-300 text-sm">
              © 2024 Sillones Córdoba. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 text-sm text-gray-300">
              <a href="#" className="hover:text-warm-400 transition-colors">
                Política de Privacidad
              </a>
              <a href="#" className="hover:text-warm-400 transition-colors">
                Términos y Condiciones
              </a>
              <a href="#" className="hover:text-warm-400 transition-colors">
                Garantías
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
