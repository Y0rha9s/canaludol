'use client';
import { useState, useEffect } from 'react';

export default function RedCarousel({ slides }) {
  const [actual, setActual] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setActual((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) return null;

  return (
    <section className="bg-white border-b border-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-1 h-5 bg-blue-600 rounded-full" />
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Nuestra Red</h2>
        </div>

        {/* Carrusel */}
        <div className="relative overflow-hidden rounded-xl">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${actual * 100}%)` }}
          >
            {slides.map((slide) => (
              <div
                key={slide.id}
                className="w-full shrink-0 aspect-[16/5] bg-gray-100 overflow-hidden"
              >
                <img
                  src={slide.imagen_url}
                  alt="Nuestra red"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Flechas */}
          {slides.length > 1 && (
            <>
              <button
                onClick={() => setActual((prev) => (prev - 1 + slides.length) % slides.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center transition"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setActual((prev) => (prev + 1) % slides.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center transition"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Indicadores */}
          {slides.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActual(idx)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    idx === actual ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}