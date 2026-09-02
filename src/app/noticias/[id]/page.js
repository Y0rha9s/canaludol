import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function getNoticia(id) {
  const { data } = await supabase
    .from('noticias')
    .select('*')
    .eq('id', id)
    .single();
  return data || null;
}

async function getRelacionadas(id, categoria) {
  const now = new Date().toISOString();
  let query = supabase
    .from('noticias')
    .select('*')
    .eq('publicada', true)
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .neq('id', id)
    .order('created_at', { ascending: false })
    .limit(3);

  if (categoria) {
    query = query.ilike('categoria', categoria);
  }

  const { data } = await query;
  return data || [];
}

export default async function NoticiaPage({ params }) {
  const { id } = await params;
  const noticia = await getNoticia(id);
  if (!noticia) notFound();

  const relacionadas = await getRelacionadas(noticia.id, noticia.categoria);

  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f0f]">
      <Navbar />

      {/* Hero imagen */}
      <section className="relative w-full h-[50vh] min-h-[350px] overflow-hidden">
        {noticia.imagen_url ? (
          <img
            src={noticia.imagen_url}
            alt={noticia.titulo}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-blue-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

        <div className="relative z-10 h-full flex flex-col justify-end max-w-4xl mx-auto px-4 pb-10">
          {noticia.categoria && (
            <span className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 w-fit uppercase tracking-wider">
              {noticia.categoria}
            </span>
          )}
          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
            {noticia.titulo}
          </h1>
          <div className="mt-4 text-gray-400 text-sm">
            {new Date(noticia.created_at).toLocaleDateString('es-CL', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            })}
            {noticia.expires_at && (
              <span className="ml-4 text-yellow-500">
                Disponible hasta {new Date(noticia.expires_at).toLocaleDateString('es-CL', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Contenido */}
      <main className="flex-grow max-w-4xl mx-auto px-4 py-12 w-full">
        {/* Volver */}
        <Link
          href="/noticias"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Volver a noticias
        </Link>

        {/* Descripción destacada */}
        {noticia.descripcion && (
          <p className="text-gray-300 text-xl leading-relaxed border-l-4 border-red-600 pl-4 mb-8">
            {noticia.descripcion}
          </p>
        )}

        {/* Contenido completo */}
        {noticia.contenido && (
          <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed whitespace-pre-line">
            {noticia.contenido}
          </div>
        )}

        {/* Relacionadas */}
        {relacionadas.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-1 h-6 bg-red-600 rounded-full" />
              <h2 className="text-xl font-bold text-white">Noticias relacionadas</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relacionadas.map((n) => (
                <Link key={n.id} href={`/noticias/${n.id}`} className="group">
                  <article className="bg-[#1a1a1a] rounded-xl overflow-hidden hover:bg-[#222] transition-colors">
                    <div className="relative h-36 bg-[#2a2a2a] overflow-hidden">
                      {n.imagen_url ? (
                        <img
                          src={n.imagen_url}
                          alt={n.titulo}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      {n.categoria && (
                        <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full uppercase">
                          {n.categoria}
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="text-white text-sm font-bold leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors">
                        {n.titulo}
                      </h3>
                      <div className="mt-2 text-xs text-gray-500">
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
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}