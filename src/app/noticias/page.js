'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Noticias() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const noticiasCarrusel = [
    { titulo: "Noticia Destacada 1", descripcion: "Descripción breve de la primera noticia destacada" },
    { titulo: "Noticia Destacada 2", descripcion: "Descripción breve de la segunda noticia destacada" },
    { titulo: "Noticia Destacada 3", descripcion: "Descripción breve de la tercera noticia destacada" },
    { titulo: "Noticia Destacada 4", descripcion: "Descripción breve de la cuarta noticia destacada" },
    { titulo: "Noticia Destacada 5", descripcion: "Descripción breve de la quinta noticia destacada" }
  ];

  const noticiasGrid = [
    { titulo: "Noticia 1", fecha: "13 Feb 2024" },
    { titulo: "Noticia 2", fecha: "12 Feb 2024" },
    { titulo: "Noticia 3", fecha: "11 Feb 2024" },
    { titulo: "Noticia 4", fecha: "10 Feb 2024" },
    { titulo: "Noticia 5", fecha: "9 Feb 2024" },
    { titulo: "Noticia 6", fecha: "8 Feb 2024" }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % noticiasCarrusel.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + noticiasCarrusel.length) % noticiasCarrusel.length);
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />
      
      {/* Fondo de imagen con overlay */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <img src="/volcan1.jpg" alt="Fondo" className="w-full h-full object-cover" />
      </div>
      
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-white mb-12 text-center drop-shadow-md">Noticias</h1>
          
          {/* Carrusel */}
          <div className="relative bg-white rounded-lg shadow-lg mb-16 overflow-hidden">
            <div className="relative h-96">
              {noticiasCarrusel.map((noticia, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className="bg-gradient-to-r from-blue-500 to-blue-700 h-full flex items-center justify-center p-8">
                    <div className="text-center text-white">
                      <h2 className="text-4xl font-bold mb-4">{noticia.titulo}</h2>
                      <p className="text-xl">{noticia.descripcion}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Botones del carrusel */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-blue-600 rounded-full p-3 shadow-lg"
            >
              ❮
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-blue-600 rounded-full p-3 shadow-lg"
            >
              ❯
            </button>
            
            {/* Indicadores */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {noticiasCarrusel.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === currentSlide ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
          
          {/* Grid de noticias */}
          <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-md">Más Noticias</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {noticiasGrid.map((noticia, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all border border-white/20 group">
                <div className="bg-white/5 h-48 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <span className="text-6xl drop-shadow-lg">📰</span>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl text-white mb-3 drop-shadow-sm">{noticia.titulo}</h3>
                  <p className="text-blue-200 text-sm font-medium">{noticia.fecha}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}