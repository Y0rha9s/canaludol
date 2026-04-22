import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const CATEGORIAS = ['Regional', 'Deporte', 'Cultura', 'Política', 'Comunidad'];

async function getNoticias(categoria) {
  const now = new Date().toISOString();
  let query = supabase
    .from('noticias')
    .select('*')
    .eq('publicada', true)
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .order('created_at', { ascending: false });

  if (categoria) {
    query = query.ilike('categoria', categoria);
  }

  const { data } = await query;
  return data || [];
}

export default async function NoticiasPage({ searchParams }) {
  const categoria = searchParams?.categoria || null;
  const noticias = await getNoticias(categoria);

  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f0f]">
      <Navbar />

      {/* Header */}
      <section className="bg-[#0a0a0a] border-b border-white/10 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-extrabold text-white mb-6">Noticias</h1>

          {/* Filtros categoría */}
          <div className="flex flex-wrap gap-2">
            <Link
              href="/noticias"
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                !categoria
                  ? 'bg-red-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              Todas
            </Link>
            {CATEGORIAS.map((cat) => (
              <Link
                key={cat}
                href={`/noticias?categoria=${cat.toLowerCase()}`}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  categoria?.toLowerCase() === cat.toLowerCase()
                    ? 'bg-red-600 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <main className="flex-grow max-w-7xl mx-auto px-4 py-10 w-full">
        {noticias.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No hay noticias en esta categoría.</p>
            <Link href="/noticias" className="text-blue-400 hover:underline text-sm mt-2 inline-block">
              Ver todas las noticias
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {noticias.map((n) => (
              <Link key={n.id} href={`/noticias/${n.id}`} className="group">
                <article className="bg-[#1a1a1a] rounded-xl overflow-hidden hover:bg-[#222] transition-colors h-full flex flex-col">
                  {/* Imagen */}
                  <div className="relative h-48 bg-[#2a2a2a] overflow-hidden">
                    {n.imagen_url ? (
                      <img
                        src={n.imagen_url}
                        alt={n.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
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
                    {n.destacada && (
                      <span className="absolute top-3 right-3 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full uppercase">
                        Destacada
                      </span>
                    )}
                  </div>

                  {/* Contenido */}
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-white font-bold text-base leading-snug mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                      {n.titulo}
                    </h3>
                    {n.descripcion && (
                      <p className="text-gray-400 text-sm line-clamp-2 flex-grow">
                        {n.descripcion}
                      </p>
                    )}
                    <div className="mt-3 text-xs text-gray-500">
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
        )}
      </main>

      <Footer />
    </div>
  );
}