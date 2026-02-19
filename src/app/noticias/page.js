'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';

export default function Noticias() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [noticiasCarrusel, setNoticiasCarrusel] = useState([]);
  const [noticiasGrid, setNoticiasGrid] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
 
  const formatFecha = (date = new Date()) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    const formatted = date.toLocaleDateString('es-CL', options).replace('.', '');
    const parts = formatted.split(' ');
    const day = parts[0];
    const month = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : '';
    const year = parts[2] || '';
    return `${day} ${month} ${year}`;
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const ahora = new Date();
        const cincoDiasMs = 5 * 24 * 60 * 60 * 1000;
        const limite = new Date(ahora.getTime() - cincoDiasMs).toISOString();
        const { data, error } = await supabase
          .from('noticias')
          .select('*')
          .eq('publicada', true)
          .gte('created_at', limite)
          .order('created_at', { ascending: false });

        if (error) {
          console.error(error);
          setError('No se pudieron cargar las noticias');
          setNoticiasCarrusel([]);
          setNoticiasGrid([]);
          return;
        }

        const todas = data || [];
        const destacadas = todas
          .filter((n) => n.destacada)
          .sort((a, b) => (a.orden ?? 999) - (b.orden ?? 999));
        const normales = todas.filter((n) => !n.destacada);

        setNoticiasCarrusel(destacadas);

        const grid = normales.slice(0, 6).map((n) => ({
          ...n,
          fecha_mostrar: n.created_at ? formatFecha(new Date(n.created_at)) : formatFecha()
        }));
        setNoticiasGrid(grid);
        setError('');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (noticiasCarrusel.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % noticiasCarrusel.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [noticiasCarrusel.length]);

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
          
          {loading ? (
            <p className="text-center text-blue-100">Cargando noticias...</p>
          ) : error ? (
            <p className="text-center text-red-200">{error}</p>
          ) : (
            <>
              {noticiasCarrusel.length > 0 && (
                <div className="relative bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl mb-16 overflow-hidden border border-white/20">
                  <div className="relative h-72 sm:h-80 md:h-96">
                    {noticiasCarrusel.map((noticia, index) => (
                      <div
                        key={noticia.id}
                        className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                          index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                        }`}
                      >
                        <Link href={`/noticias/${noticia.id}`}>
                          <div className="bg-gradient-to-r from-blue-600/40 to-blue-900/40 h-full flex items-center justify-center p-8 cursor-pointer">
                            <div className="text-center text-white max-w-2xl px-4">
                              <h2 className="text-3xl sm:text-4xl font-bold mb-4 drop-shadow-lg">{noticia.titulo}</h2>
                              <p className="text-lg sm:text-xl text-blue-100 drop-shadow-md leading-relaxed">
                                {noticia.descripcion}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                  
                  {noticiasCarrusel.length > 1 && (
                    <>
                      <button
                        onClick={prevSlide}
                        className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 md:p-4 shadow-lg backdrop-blur-sm border border-white/30 transition-all active:scale-90"
                      >
                        ❮
                      </button>
                      <button
                        onClick={nextSlide}
                        className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 md:p-4 shadow-lg backdrop-blur-sm border border-white/30 transition-all active:scale-90"
                      >
                        ❯
                      </button>
                    </>
                  )}
                  
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {noticiasCarrusel.map((n, index) => (
                      <button
                        key={n.id}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full ${
                          index === currentSlide ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-md">Más Noticias</h2>
              {noticiasGrid.length === 0 ? (
                <p className="text-blue-100 text-sm">Aún no hay noticias publicadas.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {noticiasGrid.map((noticia) => (
                    <Link
                      key={noticia.id}
                      href={`/noticias/${noticia.id}`}
                      className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all border border-white/20 group"
                    >
                      <div className="bg-white/5 h-48 flex items-center justify-center group-hover:bg-white/10 transition-colors overflow-hidden">
                        {noticia.imagen_url ? (
                          <img
                            src={noticia.imagen_url}
                            alt={noticia.titulo}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-6xl drop-shadow-lg">📰</span>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="font-bold text-xl text-white mb-3 drop-shadow-sm">{noticia.titulo}</h3>
                        <p className="text-blue-200 text-sm font-medium">{noticia.fecha_mostrar}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
