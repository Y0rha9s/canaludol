import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function getColaboradores() {
  const { data } = await supabase
    .from('colaboradores')
    .select('*')
    .eq('activo', true)
    .order('orden', { ascending: true });
  return data || [];
}

function AvatarPlaceholder({ nombre }) {
  const inicial = nombre?.charAt(0).toUpperCase() || '?';
  return (
    <div className="w-full h-full flex items-center justify-center bg-blue-100">
      <span className="text-5xl font-extrabold text-blue-400">{inicial}</span>
    </div>
  );
}

export default async function Colaboradores() {
  const colaboradores = await getColaboradores();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <section className="bg-blue-700 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-1 h-6 bg-white rounded-full" />
            <span className="text-blue-200 text-sm font-bold uppercase tracking-wider">Canal Udol</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white">Colaboradores</h1>
          <p className="text-blue-200 mt-2">El equipo multidisciplinario detrás de Canal Udol.</p>
        </div>
      </section>

      <main className="flex-grow max-w-6xl mx-auto px-4 py-12 w-full">
        {colaboradores.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400">No hay colaboradores aún.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {colaboradores.map((persona) => (
              <article
                key={persona.id}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all group"
              >
                <div className="relative h-56 bg-gray-100 overflow-hidden">
                  {persona.imagen_url ? (
                    <img
                      src={persona.imagen_url}
                      alt={persona.nombre}
                      className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${persona.foto_posicion || 'object-center'}`}
                    />
                  ) : (
                    <AvatarPlaceholder nombre={persona.nombre} />
                  )}
                </div>
                <div className="p-5">
                  <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-2">
                    {persona.rol}
                  </span>
                  <h3 className="text-gray-900 font-extrabold text-lg mb-1 group-hover:text-blue-600 transition-colors">
                    {persona.nombre}
                  </h3>
                  {persona.especialidad && (
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {persona.especialidad}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}