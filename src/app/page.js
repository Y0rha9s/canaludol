import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroCarousel from '@/components/HeroCarousel';
import RedCarousel from '@/components/RedCarousel';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const revalidate = 0;

async function getNoticias() {
  const now = new Date().toISOString();
  const { data } = await supabase
    .from('noticias')
    .select('*')
    .eq('publicada', true)
    .not('categoria', 'ilike', 'compartidas')
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .order('created_at', { ascending: false })
    .limit(20);
  return data || [];
}

async function getAliados() {
  const { data } = await supabase
    .from('red_aliados')
    .select('*')
    .eq('activo', true)
    .order('orden', { ascending: true });
  return data || [];
}

async function getCompartidas() {
  const now = new Date().toISOString();
  const { data } = await supabase
    .from('noticias')
    .select('*')
    .eq('publicada', true)
    .ilike('categoria', 'compartidas')
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .order('created_at', { ascending: false })
    .limit(5);
  return data || [];
}

export default async function Home() {
  const [noticias, aliados, compartidas] = await Promise.all([
    getNoticias(),
    getAliados(),
    getCompartidas()
  ]);

  const destacadas = noticias.filter((n) => n.destacada).slice(0, 5);
  const heroNoticias = destacadas.length > 0 ? destacadas : noticias.slice(0, 1);
  const secundarias = noticias
    .filter((n) => !heroNoticias.find((h) => h.id === n.id))
    .slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <RedCarousel slides={aliados} />

      {/* Banner Radio */}
      <a
        href="https://noticiasaraucania.cl/senal-online-radio-popmusic-101-9-villarrica/"
        target="_blank"
        rel="noopener noreferrer"
        className="block max-w-7xl mx-auto px-4 pt-4"
      >
        <img
          src="https://i.ibb.co/whBgp4Y1/radio-POPmusic.jpg"
          alt="Radio Pop Music 101.9"
          className="w-full max-h-40 object-cover rounded-xl hover:opacity-90 transition-opacity"
        />
      </a>

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
                  <article className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all h-full flex flex-col">
                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                      {n.imagen_url ? (
                        <img
                          src={n.imagen_url}
                          alt={n.titulo}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      <h3 className="text-gray-900 font-bold text-base leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
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

        {/* Noticias Compartidas */}
        {compartidas.length > 0 && (
          <section className="mt-12 pt-10 border-t border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="w-1 h-6 bg-blue-600 rounded-full" />
                <h2 className="text-xl font-bold text-gray-900">Noticias Compartidas</h2>
              </div>
              <Link
                href="/noticias?categoria=compartidas"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                Ver todas →
              </Link>
            </div>

            <div className="space-y-3">
              {compartidas.map((n) => (
                <Link key={n.id} href={`/noticias/${n.id}`} className="group">
                  <article className="flex items-start gap-4 bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all">
                    {n.imagen_url && (
                      <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={n.imagen_url}
                          alt={n.titulo}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-gray-900 font-bold text-sm leading-snug mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {n.titulo}
                      </h3>
                      {n.descripcion && (
                        <p className="text-gray-500 text-xs line-clamp-2 mb-1">
                          {n.descripcion}
                        </p>
                      )}
                      <span className="text-xs text-gray-400">
                        {new Date(n.created_at).toLocaleDateString('es-CL', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}