import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroCarousel from '@/components/HeroCarousel';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function getNoticias() {
  const now = new Date().toISOString();
  const { data } = await supabase
    .from('noticias')
    .select('*')
    .eq('publicada', true)
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .order('created_at', { ascending: false })
    .limit(20);
  return data || [];
}

export default async function Home() {
  const noticias = await getNoticias();

  const destacadas = noticias.filter((n) => n.destacada).slice(0, 5);
  const heroNoticias = destacadas.length > 0 ? destacadas : noticias.slice(0, 1);
  const secundarias = noticias
    .filter((n) => !heroNoticias.find((h) => h.id === n.id))
    .slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <HeroCarousel noticias={heroNoticias} />

      <main className="flex-grow max-w-7xl mx-auto px-4 py-12 w-full">
        {secundarias.length > 0 ? (
          <>
            <div className="flex items-center gap-3 mb-8">
              <span className="w-1 h-6 bg-red-600 rounded-full" />
              <h2 className="text-xl font-bold text-gray-900">Últimas Noticias</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {secundarias.map((n) => (
                <Link key={n.id} href={`/noticias/${n.id}`} className="group">
                  <article >
                    <div className="relative h-48 bg-[#2a2a2a] overflow-hidden">
                      {n.imagen_url ? (
                        <img
                          src={n.imagen_url}
                          alt={n.titulo}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all h-full flex flex-col"
                          <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      {n.categoria && (
                        <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full uppercase">
                          {n.categoria}
                        </span>
                      )}
                    </div>

                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="text-gray-900 font-bold text-base leading-snug mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                        {n.titulo}
                      </h3>
                      {n.descripcion && (
                        <p className="text-gray-500 text-sm line-clamp-2 flex-grow">
                          {n.descripcion}
                        </p>
                      )}
                      <div className="mt-3 text-xs text-gray-400">
                        {new Date(n.created_at).toLocaleDateString('es-CL', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/noticias"
                className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-100 transition font-medium"
              >
                Ver todas las noticias
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Aún no hay noticias publicadas.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}