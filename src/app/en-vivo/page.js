import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function getUrlEnVivo() {
  const { data } = await supabase
    .from('site_config')
    .select('value')
    .eq('key', 'url_senal_vivo')
    .single();
  return data?.value || null;
}

function getEmbedUrl(url) {
  if (!url) return null;

  // YouTube watch
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;

  // YouTube live
  const ytLiveMatch = url.match(/youtube\.com\/live\/([a-zA-Z0-9_-]{11})/);
  if (ytLiveMatch) return `https://www.youtube.com/embed/${ytLiveMatch[1]}?autoplay=1&rel=0`;

  // Facebook página o video
  if (url.includes('facebook.com')) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&autoplay=true&width=1280`;
  }

  return null;
}

export default async function EnVivoPage() {
  const url = await getUrlEnVivo();
  const embedUrl = getEmbedUrl(url);

  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f0f]">
      <Navbar />

      {/* Header */}
      <section className="bg-[#0a0a0a] border-b border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
            <h1 className="text-2xl font-extrabold text-white">Señal en Vivo</h1>
          </div>
          <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            En Directo
          </span>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-2">
          <p className="text-gray-400 text-sm">
            Transmisión en vivo lunes, miércoles y viernes a las 8:30 hrs.
          </p>
        </div>
      </section>

      {/* Player */}
      <main className="flex-grow max-w-7xl mx-auto px-4 py-10 w-full">
        {embedUrl ? (
          <div className="w-full">
            <div className="relative w-full rounded-xl overflow-hidden bg-black" style={{ paddingTop: '56.25%' }}>
              <iframe
                src={embedUrl}
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="text-gray-500 text-xs mt-3 text-center">
              Si el video no carga, intenta recargar la página.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-white text-xl font-bold mb-2">Sin transmisión activa</h2>
            <p className="text-gray-400 text-sm max-w-md">
              En este momento no hay transmisión en vivo. Vuelve los lunes, miércoles y viernes a las 8:30 hrs.
            </p>
          </div>
        )}

        {/* Horario */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { dia: 'Lunes', hora: '8:30 hrs' },
            { dia: 'Miércoles', hora: '8:30 hrs' },
            { dia: 'Viernes', hora: '8:30 hrs' },
          ].map((item) => (
            <div key={item.dia} className="bg-[#1a1a1a] rounded-xl p-5 text-center border border-white/5">
              <div className="text-red-500 font-bold text-sm uppercase tracking-wider mb-1">{item.dia}</div>
              <div className="text-white text-2xl font-extrabold">{item.hora}</div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}