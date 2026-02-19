import Link from 'next/link';
import { Facebook, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-blue-600 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Información */}
          <div>
            <h3 className="text-xl font-bold mb-4">Canal Udol</h3>
            <p className="text-blue-100">
              Tu canal de entretenimiento y noticias
            </p>
          </div>
          
          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-xl font-bold mb-4">Enlaces</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/quienes-somos" className="text-blue-100 hover:text-white">
                  Quiénes Somos
                </Link>
              </li>
              <li>
                <Link href="/elenco" className="text-blue-100 hover:text-white">
                  Nuestro Elenco
                </Link>
              </li>
              <li>
                <Link href="/noticias" className="text-blue-100 hover:text-white">
                  Noticias
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-blue-100 hover:text-white">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Redes sociales */}
          <div>
            <h3 className="text-xl font-bold mb-4">Síguenos</h3>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/CanalUdol" target="_blank" rel="noopener noreferrer" className="text-blue-100 hover:text-white transition-colors">
                <Facebook size={24} />
              </a>
              <a href="https://www.instagram.com/canal_udol/" target="_blank" rel="noopener noreferrer" className="text-blue-100 hover:text-white transition-colors">
                <Instagram size={24} />
              </a>
              <a href="https://www.youtube.com/@canaludolaraucania8811" target="_blank" rel="noopener noreferrer" className="text-blue-100 hover:text-white transition-colors">
                <Youtube size={24} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-blue-500 mt-8 pt-4 text-center text-blue-100">
          <p>© 2026 Canal Udol. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
