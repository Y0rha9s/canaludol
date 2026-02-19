import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

const formatFecha = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  const formatted = d.toLocaleDateString('es-CL', options).replace('.', '');
  const parts = formatted.split(' ');
  const day = parts[0];
  const month = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : '';
  const year = parts[2] || '';
  return `${day} ${month} ${year}`;
};

export default async function NoticiaDetalle({ params }) {
  const { id } = await params;

  const { data, error } = await supabase
    .from('noticias')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !data || !data.publicada) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />

      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <img src="/volcan1.jpg" alt="Fondo" className="w-full h-full object-cover" />
      </div>

      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <article className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
            {data.imagen_url && (
              <div className="h-64 w-full overflow-hidden">
                <img
                  src={data.imagen_url}
                  alt={data.titulo}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-6 sm:p-10">
              <p className="text-blue-200 text-sm font-medium mb-2">
                {formatFecha(data.created_at)}
                {data.categoria ? ` · ${data.categoria}` : ''}
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 drop-shadow-md">
                {data.titulo}
              </h1>
              {data.descripcion && (
                <p className="text-lg text-blue-100 mb-6 drop-shadow-sm">
                  {data.descripcion}
                </p>
              )}
              {data.contenido && (
                <div className="prose prose-invert max-w-none text-blue-50 leading-relaxed whitespace-pre-line">
                  {data.contenido}
                </div>
              )}
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
