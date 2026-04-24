'use client';
import { useState, useEffect } from 'react';

export default function RedCarousel({ slides }) {
  const [actual, setActual] = useState(0);
  const visibles = 3;

  // Duplicamos para loop infinito
  const items = slides.length > 0 ? [...slides, ...slides, ...slides] : [];
  const offset = slides.length;

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setActual((prev) => prev + 1);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Cuando llega al final del segundo bloque, salta silenciosamente al primero
  useEffect(() => {
    if (actual >= slides.length * 2) {
      const timer = setTimeout(() => {
        setActual(slides.length);
      }, 0);
      return () => clearTimeout(timer);
    }
    if (actual < slides.length) {
      const timer = setTimeout(() => {
        setActual(slides.length + actual);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [actual, slides.length]);

  if (!slides.length) return null;

  const anterior = () => setActual((prev) => prev - 1);
  const siguiente = () => setActual((prev) => prev + 1);

  return (
    <section className="bg-white border-b border-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-1 h-5 bg-blue-600 rounded-full" />
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Nuestra Red</h2>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-xl">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${actual * (100 / visibles)}%)` }}
            >
              {items.map((slide, idx) => (
                <div
                  key={`${slide.id}-${idx}`}
                  className="shrink-0 px-2"
                  style={{ width: `${100 / visibles}%` }}
                >
                  <div className="aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden">
                    <img
                      src={slide.imagen_url}
                      alt="Nuestra red"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Flechas */}
          <button
            onClick={anterior}
            className="absolute -left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white border border-gray-200 shadow rounded-full flex items-center justify-center hover:bg-gray-50 transition"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={siguiente}
            className="absolute -right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white border border-gray-200 shadow rounded-full flex items-center justify-center hover:bg-gray-50 transition"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}