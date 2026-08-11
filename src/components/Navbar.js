'use client';
import Link from 'next/link';
import { useState } from 'react';
import RadioPlayer from './RadioPlayer';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  const items = [
    { name: 'Inicio', href: '/' },
    { name: 'Noticias', href: '/noticias' },
    { name: 'Contacto', href: '/contacto' },
  ];

  return (
    <nav className="bg-blue-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
            <img src="/logo.png" alt="Canal Udol" className="h-10 w-auto object-contain" />
          </Link>

          {/* Menu desktop */}
          <div className="hidden md:flex items-center gap-6">
            {items.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-white hover:text-blue-200 text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}

            {/* Dropdown Quiénes Somos */}
            <div
              className="relative"
              onMouseEnter={() => setDropdown(true)}
              onMouseLeave={() => setDropdown(false)}
            >
              <button className="flex items-center gap-1 text-white hover:text-blue-200 text-sm font-medium transition-colors">
                Quiénes Somos
                <svg
                  className={`w-3 h-3 transition-transform duration-200 ${dropdown ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdown && (
                <>
                  {/* Puente invisible para no perder el hover */}
                  <div className="absolute top-full left-0 w-full h-2" />
                  <div className="absolute top-full left-0 mt-2 w-44 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                    <Link
                      href="/quienes-somos"
                      onClick={() => setDropdown(false)}
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 font-medium transition-colors"
                    >
                      Nosotros
                    </Link>
                    <Link
                      href="/colaboradores"
                      onClick={() => setDropdown(false)}
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 font-medium transition-colors border-t border-gray-100"
                    >
                      Colaboradores
                    </Link>
                  </div>
                </>
              )}
            </div>

            <RadioPlayer />

            {/* Badge En Vivo */}
            <Link
              href="/en-vivo"
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-3 py-1.5 rounded-full transition-colors"
            >
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              EN VIVO
            </Link>
          </div>

          {/* Botón móvil */}
          <button
            aria-label="Abrir menú"
            onClick={() => setOpen(!open)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-800 transition"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Panel móvil */}
        {open && (
          <div className="md:hidden pb-4 border-t border-blue-600">
            <div className="flex flex-col space-y-1 pt-3">
              {items.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-blue-800 transition"
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/quienes-somos"
                onClick={() => setOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-blue-800 transition"
              >
                Nosotros
              </Link>
              <Link
                href="/colaboradores"
                onClick={() => setOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-blue-800 transition"
              >
                Colaboradores
              </Link>
              <Link
                href="/en-vivo"
                onClick={() => setOpen(false)}
                className="flex items-center gap-1.5 mx-3 mt-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-3 py-2 rounded-full transition-colors w-fit"
              >
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                EN VIVO
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}