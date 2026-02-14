'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselImages = [
    {
      url: "/marcelo.png",
      titulo: "Bienvenidos a Canal Udol",
      subtitulo: "Tu conexión directa con la actualidad y el entretenimiento"
    },
    {
      url: "/maribel.png",
      titulo: "Información Veraz",
      subtitulo: "Periodismo de investigación con compromiso y rigor"
    },
    {
      url: "/maritza2.jpg",
      titulo: "Creciendo Juntos",
      subtitulo: "Un espacio pensado para la comunidad y el desarrollo"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselImages.length]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Carrusel de Texto */}
      <section className="relative h-[450px] w-full overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
        {/* Patrón de fondo decorativo */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        
        {carouselImages.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out flex flex-col items-center justify-center text-white text-center p-6 ${
              idx === currentSlide 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-8 scale-95 pointer-events-none'
            }`}
          >
            <div className="max-w-4xl">
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight drop-shadow-lg">
                {img.titulo}
              </h1>
              <div className="h-1.5 w-24 bg-blue-400 mx-auto mb-8 rounded-full"></div>
              <p className="text-xl md:text-3xl font-light tracking-wide leading-relaxed drop-shadow-md">
                {img.subtitulo}
              </p>
            </div>
          </div>
        ))}
        
        {/* Indicadores Minimalistas */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-6">
          {carouselImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className="group relative py-4"
            >
              <span className={`block w-12 h-1 rounded-full transition-all duration-500 ${
                idx === currentSlide ? 'bg-white' : 'bg-white/30 group-hover:bg-white/50'
              }`} />
            </button>
          ))}
        </div>
      </section>

      {/* Contenido principal breve */}
      <main className="flex-grow bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="p-8 rounded-2xl bg-blue-50 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Últimas Noticias</h3>
              <p className="text-gray-600 leading-relaxed">Mantente al día con los acontecimientos más relevantes de nuestra región y el mundo.</p>
            </div>
            
            <div className="p-8 rounded-2xl bg-blue-50 hover:shadow-lg transition-shadow border-t-4 border-blue-600">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">En Vivo</h3>
              <p className="text-gray-600 leading-relaxed">No te pierdas nuestra señal en directo con contenido exclusivo para ti.</p>
            </div>

            <div className="p-8 rounded-2xl bg-blue-50 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Nuestro Elenco</h3>
              <p className="text-gray-600 leading-relaxed">Conoce a las caras que acompañan tus tardes y mañanas en Canal Udol.</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
