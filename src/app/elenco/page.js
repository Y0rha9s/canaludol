import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';

const miembros = [
  {
    nombre: "Marcelo Bermedo",
    rol: "Dueño del canal",
    descripcion: "Ingeniero Comercial",
    imagen: "/marcelo.png",
    posicion: "object-top"
  },
  {
    nombre: "Maribel Figueroa Pérez",
    rol: "Presentadora y Reportera",
    descripcion: "Reportera y presentadora con 20 años de trayectoria en medios de comunicación radial y escrito. Trabajando en llevar información clara y veraz a la comunidad.",
    imagen: "/maribel.png",
    posicion: "object-center"
  },
  {
    nombre: "Maritza González",
    rol: "Psicóloga",
    descripcion: "Psicología clínica y Mediación Familiar.",
    imagen: "/maritza2.jpg",
    posicion: "object-center"
  }
];

export default function Elenco() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f0f]">
      <Navbar />

      {/* Header */}
      <section className="bg-[#0a0a0a] border-b border-white/10 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-1 h-6 bg-red-600 rounded-full" />
            <span className="text-red-500 text-sm font-bold uppercase tracking-wider">Canal Udol</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white">Nuestro Elenco</h1>
          <p className="text-gray-400 mt-2">
            Conoce a los profesionales que hacen posible nuestra programación diaria.
          </p>
        </div>
      </section>

      <main className="flex-grow max-w-6xl mx-auto px-4 py-16 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {miembros.map((miembro, index) => (
            <article key={index} className="group bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-300">

              {/* Foto */}
              <div className="relative h-72 overflow-hidden bg-[#2a2a2a]">
                <Image
                  src={miembro.imagen}
                  alt={miembro.nombre}
                  fill
                  className={`object-cover ${miembro.posicion} grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent" />
              </div>

              {/* Info */}
              <div className="p-6">
                <span className="inline-block bg-red-600/20 text-red-400 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-3">
                  {miembro.rol}
                </span>
                <h3 className="text-white font-extrabold text-xl mb-2 group-hover:text-blue-400 transition-colors">
                  {miembro.nombre}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {miembro.descripcion}
                </p>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}