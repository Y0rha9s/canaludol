import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { createClient } from '@supabase/supabase-js';
import { DIAS, minutosDesdeLas6 } from '@/lib/programacion';

export const revalidate = 0;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function getProgramacion() {
  const { data } = await supabase
    .from('programacion')
    .select('*')
    .eq('activo', true);
  return data || [];
}

export default async function ProgramacionPage() {
  const programas = await getProgramacion();

  const horas = [...new Set(programas.map((p) => p.hora_inicio))].sort(
    (a, b) => minutosDesdeLas6(a) - minutosDesdeLas6(b)
  );

  const celdas = {};
  for (const p of programas) {
    const key = `${p.dia}-${p.hora_inicio}`;
    if (!celdas[key]) celdas[key] = [];
    celdas[key].push(p);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f0f]">
      <Navbar />

      <section className="bg-[#0a0a0a] border-b border-white/10 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl font-extrabold text-white">Programación</h1>
          <p className="text-gray-400 text-sm mt-2">
            Horarios de nuestros programas, de 06:00 a 02:00 hrs.
          </p>
        </div>
      </section>

      <main className="flex-grow max-w-7xl mx-auto px-4 py-10 w-full">
        {horas.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-20">
            Próximamente publicaremos la programación completa.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse">
              <thead>
                <tr>
                  <th className="text-left text-gray-500 text-xs uppercase tracking-wider p-3 w-20">
                    Hora
                  </th>
                  {DIAS.map((dia) => (
                    <th
                      key={dia}
                      className="text-white text-xs font-bold uppercase tracking-wider p-3 text-center border-l border-white/5"
                    >
                      {dia}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {horas.map((hora) => (
                  <tr key={hora} className="border-t border-white/5">
                    <td className="text-red-500 font-bold text-sm p-3 align-top whitespace-nowrap">
                      {hora}
                    </td>
                    {DIAS.map((dia) => {
                      const items = celdas[`${dia}-${hora}`] || [];
                      return (
                        <td key={dia} className="p-2 align-top border-l border-white/5">
                          {items.map((p) => (
                            <div
                              key={p.id}
                              className="bg-[#1a1a1a] rounded-lg p-2.5 border border-white/5 mb-1"
                            >
                              <div className="text-white text-sm font-bold leading-tight">
                                {p.nombre}
                              </div>
                              <div className="text-gray-400 text-xs mt-1">
                                {p.hora_inicio}{p.hora_fin ? ` - ${p.hora_fin}` : ''} hrs
                              </div>
                              {p.conductor && (
                                <div className="text-gray-500 text-xs mt-0.5">Con {p.conductor}</div>
                              )}
                            </div>
                          ))}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
