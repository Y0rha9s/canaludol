'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HeroCarousel({ noticias }) {
  const [actual, setActual] = useState(0);

  useEffect(() => {
    if (noticias.length <= 1) return;
    const timer = setInterval(() => {
      setActual((prev) => (prev + 1) % noticias.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [noticias.length]);

  if (!noticias.length) {
    return (
      <section className="relative w-full h-[50vh] flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-950">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white mb-2">Canal Udol</h1>
          <p className="text-blue-200">Tu canal regional de noticias</p>
        </div>
      </section>
    );
  }

  const n = noticias[actual];

  return (
    <section className="relative w-full h-[70vh] min-h-[480px] overflow-hidden">
      {/* Imágenes precargadas */}
      {noticias.map((noticia, idx) => (
        <div
          key={noticia.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${idx === actual ? 'opacity-100' : 'opacity-0'}`}
        >
          {noticia.imagen_url ? (
            <img
              src={noticia.imagen_url}
              alt={noticia.titulo}
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-900 to-blue-950" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>
      ))}

      {/* Contenido */}
      <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-4 pb-12">
        {n.categoria && (
          <span className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 w-fit uppercase tracking-wider">
            {n.categoria}
          </span>
        )}
        <h1 className="text-3xl md:text-5xl font-extrabold text-white max-w-3xl leading-tight mb-4 drop-shadow-lg">
          {n.titulo}
        </h1>
        {n.descripcion && (
          <p className="text-gray-300 text-lg max-w-2xl mb-6 line-clamp-2">
            {n.descripcion}
          </p>
        )}
        <div className="flex items-center gap-6">
          <Link
            href={`/noticias/${n.id}`}
            className="inline-flex items-center gap-2 bg-white text-black font-bold px-6 py-3 rounded-full hover:bg-gray-100 transition w-fit"
          >
            Leer más
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          {/* Indicadores */}
          {noticias.length > 1 && (
            <div className="flex gap-2">
              {noticias.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActual(idx)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    idx === actual ? 'w-8 bg-white' : 'w-3 bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Flechas si hay más de 1 */}
      {noticias.length > 1 && (
        <>
          <button
            onClick={() => setActual((prev) => (prev - 1 + noticias.length) % noticias.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center transition"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setActual((prev) => (prev + 1) % noticias.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center transition"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </section>
  );
}