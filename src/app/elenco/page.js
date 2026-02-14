import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';

export default function Elenco() {
  const miembros = [
    {
      nombre: "Marcelo Bermedo",
      rol: "Dueño del canal",
      descripcion: "Magister en economia y finanzas",
      imagen: "/marcelo.png",
      posicion: "object-top"
    },
    {
      nombre: "Maribel Figeroa",
      rol: "Presentadora Principal",
      descripcion: "Periodista Reconocida en investigación y reportaje",
      imagen: "/maribel.png",
      posicion: "object-center"
    },
    {
      nombre: "Maritza Gonzalez",
      rol: "Psicologa",
      descripcion: "Maestria en peritaje psicologico",
      imagen: "/maritza2.jpg",
      posicion: "object-center"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />

      {/* Fondo de imagen con overlay */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <img src="/volcan1.jpg" alt="Fondo" className="w-full h-full object-cover" />
      </div>

      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center mb-20">
            <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">Nuestro Elenco</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto drop-shadow-md">
              Conoce a los profesionales que hacen posible nuestra programación diaria.
            </p>
            <div className="mt-6 flex justify-center">
              <div className="h-1.5 w-24 bg-blue-600 rounded-full"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {miembros.map((miembro, index) => (
              <div key={index} className="group flex flex-col items-center text-center">
                <div className="relative w-64 h-64 mb-6 transition-transform duration-300 group-hover:scale-105">
                  {/* Decorative circle background */}
                  <div className="absolute inset-0 bg-blue-100 rounded-full transform -rotate-6 transition-transform group-hover:rotate-0"></div>
                  
                  <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl">
                    <Image
                      src={miembro.imagen}
                      alt={miembro.nombre}
                      fill
                      className={`object-cover ${miembro.posicion} grayscale group-hover:grayscale-0 transition-all duration-500`}
                    />
                  </div>
                </div>

                <div className="space-y-2 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-2xl w-full">
                  <h3 className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors drop-shadow-md">
                    {miembro.nombre}
                  </h3>
                  <p className="text-blue-300 font-semibold uppercase tracking-wider text-sm drop-shadow-sm">
                    {miembro.rol}
                  </p>
                  <div className="w-12 h-1 bg-blue-400/50 mx-auto my-3 group-hover:w-24 transition-all duration-300"></div>
                  <p className="text-gray-100 italic leading-relaxed max-w-xs drop-shadow-sm">
                    "{miembro.descripcion}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
