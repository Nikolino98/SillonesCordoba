
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Mail, MapPin } from "lucide-react";
import CartDrawer from "./CartDrawer";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Top bar */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-700 text-white py-3 text-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-600/90 to-warm-600/90"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 hover:text-warm-200 transition-colors">
                <Phone className="w-4 h-4" />
                <span className="font-medium">+54 351 123-4567</span>
              </div>
              <div className="flex items-center gap-2 hover:text-warm-200 transition-colors">
                <Mail className="w-4 h-4" />
                <span className="font-medium">info@sillonescordoba.com</span>
              </div>
              <div className="hidden lg:flex items-center gap-2 hover:text-warm-200 transition-colors">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">Córdoba Capital, Argentina</span>
              </div>
            </div>
            <div className="hidden md:block">
              <span className="bg-warm-500/20 px-4 py-1 rounded-full text-sm font-medium">
                🚚 Envío gratis en compras mayores a $150.000
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-100' 
          : 'bg-white shadow-lg'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-600 to-warm-600 bg-clip-text text-transparent">
                SillonesCórdoba
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-10">
              {[
                { label: 'Inicio', id: 'inicio' },
                { label: 'Productos', id: 'productos' },
                { label: 'Nosotros', id: 'nosotros' },
                { label: 'Contacto', id: 'contacto' }
              ].map((item) => (
                <button 
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-gray-700 hover:text-brand-600 transition-all duration-300 font-medium text-lg relative group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-600 to-warm-600 group-hover:w-full transition-all duration-300"></span>
                </button>
              ))}
              <Link 
                to="/auth" 
                className="text-gray-700 hover:text-brand-600 transition-all duration-300 font-medium text-lg relative group"
              >
                Admin
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-600 to-warm-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </nav>

            {/* Cart and Mobile Menu */}
            <div className="flex items-center gap-4">
              <CartDrawer />
              
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden p-2 hover:bg-brand-50"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? 
                  <X className="w-6 h-6 text-brand-600" /> : 
                  <Menu className="w-6 h-6 text-brand-600" />
                }
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-6 bg-white/95 backdrop-blur-md">
              <nav className="flex flex-col space-y-6">
                {[
                  { label: 'Inicio', id: 'inicio' },
                  { label: 'Productos', id: 'productos' },
                  { label: 'Nosotros', id: 'nosotros' },
                  { label: 'Contacto', id: 'contacto' }
                ].map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="text-left text-gray-700 hover:text-brand-600 transition-colors font-medium text-lg"
                  >
                    {item.label}
                  </button>
                ))}
                <Link 
                  to="/auth" 
                  className="text-left text-gray-700 hover:text-brand-600 transition-colors font-medium text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
