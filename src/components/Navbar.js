'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const items = [
    { name: 'Inicio', href: '/' },
    { name: 'Noticias', href: '/noticias' },
    { name: 'Quiénes Somos', href: '/quienes-somos' },
    { name: 'Nuestro Elenco', href: '/elenco' },
    { name: 'Contáctanos', href: '/contacto' },
  ];

  return (
    <nav className="bg-[#B0E2FF] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border-b border-[#87CEFA]/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
            <img
              src="/logo.png"
              alt="Canal Udol"
              className="h-12 md:h-16 w-auto object-contain"
            />
          </Link>

          {/* Botón móvil */}
          <button
            aria-label="Abrir menú"
            onClick={() => setOpen(!open)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-blue-700 hover:text-blue-900 hover:bg-white/40 transition"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Menu desktop */}
          <div className="hidden md:flex space-x-8">
            {items.map((item) => (
              <Link key={item.name} href={item.href} className="text-blue-700 hover:text-blue-900 font-semibold transition">
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Panel móvil */}
        {open && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2 bg-white/50 rounded-lg p-3 shadow">
              {items.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 rounded-md font-semibold text-blue-700 hover:text-blue-900 hover:bg-white/70 transition"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
