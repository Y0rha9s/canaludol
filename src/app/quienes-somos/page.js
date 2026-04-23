import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function QuienesSomos() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Header */}
      <section className="bg-blue-700 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-1 h-6 bg-white rounded-full" />
            <span className="text-blue-200 text-sm font-bold uppercase tracking-wider">Canal Udol</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white">Nosotros</h1>
        </div>
      </section>

      <main className="flex-grow max-w-5xl mx-auto px-4 py-12 w-full">

        {/* Imagen + texto lado a lado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16">
          <div className="rounded-2xl overflow-hidden h-64 md:h-80 shadow-lg">
            <img
              src="/volcan1.jpg"
              alt="Canal Udol"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-gray-600 leading-relaxed text-lg mb-4">
              Canal Udol es un medio de comunicación comprometido con entregar contenido de calidad
              a nuestra audiencia. Desde nuestros inicios, hemos buscado informar, entretener y
              conectar con nuestra comunidad.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Nuestro equipo está conformado por profesionales apasionados por el periodismo,
              el entretenimiento y la comunicación. Trabajamos día a día para ofrecer la mejor
              experiencia a nuestros seguidores.
            </p>
          </div>
        </div>

        {/* Misión y Visión abajo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          <div className="bg-blue-50 border-l-4 border-blue-600 rounded-xl p-6">
            <h2 className="text-blue-700 font-bold text-base mb-2 uppercase tracking-wider">Nuestra Misión</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Ser el canal de referencia para nuestra audiencia, entregando contenido relevante,
              veraz y entretenido que genere valor en la vida de las personas.
            </p>
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-600 rounded-xl p-6">
            <h2 className="text-blue-700 font-bold text-base mb-2 uppercase tracking-wider">Nuestra Visión</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
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
            <div key={s.label} className="bg-blue-50 border border-blue-100 rounded-xl p-5 text-center">
              <div className="text-blue-600 font-extrabold text-3xl mb-1">{s.valor}</div>
              <div className="text-gray-500 text-xs uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}