import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RedCarousel from '@/components/RedCarousel';
import RadioHeroPlayer from '@/components/RadioHeroPlayer';
import { createClient } from '@supabase/supabase-js';

export const revalidate = 60;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function getAliados() {
  const { data } = await supabase
    .from('red_aliados')
    .select('*')
    .eq('activo', true)
    .order('orden', { ascending: true });
  return data || [];
}

export default async function RadioPage() {
  const aliados = await getAliados();

  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f0f]">
      <Navbar />

      <section className="bg-[#0a0a0a] border-b border-white/10 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl font-extrabold text-white">Radio en Vivo</h1>
          <p className="text-gray-400 text-sm mt-2">
            Escucha Canal Udol Radio las 24 horas del día.
          </p>
        </div>
      </section>

      <main className="flex-grow max-w-7xl mx-auto px-4 py-10 w-full">
        <RadioHeroPlayer />
      </main>

      <RedCarousel slides={aliados} dark />

      <Footer />
    </div>
  );
}
