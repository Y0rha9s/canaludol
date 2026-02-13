import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-lg border-b-4 border-blue-600">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo.png" 
              alt="Canal Udol" 
              width={120} 
              height={60}
              className="object-contain"
            />
          </Link>
          
          {/* Menu */}
          <div className="flex space-x-8">
            <Link href="/" className="text-blue-600 hover:text-blue-800 font-semibold transition">
              Inicio
            </Link>
            <Link href="/noticias" className="text-blue-600 hover:text-blue-800 font-semibold transition">
              Noticias
            </Link>
            <Link href="/quienes-somos" className="text-blue-600 hover:text-blue-800 font-semibold transition">
              Quiénes Somos
            </Link>
            <Link href="/elenco" className="text-blue-600 hover:text-blue-800 font-semibold transition">
              Nuestro Elenco
            </Link>
            <Link href="/contacto" className="text-blue-600 hover:text-blue-800 font-semibold transition">
              Contáctanos
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}