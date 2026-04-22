import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function QuienesSomos() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f0f]">
      <Navbar />

      {/* Header */}
      <section className="bg-[#0a0a0a] border-b border-white/10 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-1 h-6 bg-red-600 rounded-full" />
            <span className="text-red-500 text-sm font-bold uppercase tracking-wider">Canal Udol</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white">Quiénes Somos</h1>
        </div>
      </section>

      <main className="flex-grow max-w-4xl mx-auto px-4 py-12 w-full">

        {/* Imagen + texto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16">
          <div className="rounded-2xl overflow-hidden h-64 md:h-80">
            <img
              src="/volcan1.jpg"
              alt="Canal Udol"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-gray-300 leading-relaxed text-lg mb-4">
              Canal Udol es un medio de comunicación comprometido con entregar contenido de calidad
              a nuestra audiencia. Desde nuestros inicios, hemos buscado informar, entretener y
              conectar con nuestra comunidad.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Nuestro equipo está conformado por profesionales apasionados por el periodismo,
              el entretenimiento y la comunicación. Trabajamos día a día para ofrecer la mejor
              experiencia a nuestros seguidores.
            </p>
          </div>
        </div>

        {/* Misión / Visión */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          <div className="bg-[#1a1a1a] rounded-xl p-6 border border-white/5">
            <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-white font-bold text-lg mb-2">Nuestra Misión</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Ser el canal de referencia para nuestra audiencia, entregando contenido relevante,
              veraz y entretenido que genere valor en la vida de las personas.
            </p>
          </div>

          <div className="bg-[#1a1a1a] rounded-xl p-6 border border-white/5">
            <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h2 className="text-white font-bold text-lg mb-2">Nuestra Visión</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Expandir nuestra presencia regional convirtiéndonos en la principal fuente de
              información y entretenimiento de La Araucanía y sus comunidades.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { valor: '100%', label: 'Contenido local' },
            { valor: '3x', label: 'Transmisiones semanales' },
            { valor: '1', label: 'Comunidad unida' },
          ].map((s) => (
            <div key={s.label} className="bg-[#1a1a1a] rounded-xl p-5 text-center border border-white/5">
              <div className="text-red-500 font-extrabold text-3xl mb-1">{s.valor}</div>
              <div className="text-gray-400 text-xs uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}