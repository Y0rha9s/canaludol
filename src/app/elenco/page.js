import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';

export default function Elenco() {
  const miembros = [
    {
      nombre: "Marcelo Bermedo",
      rol: "Dueño del canal",
      descripcion: "Magister en economia y finanzas",
      imagen: "/marcelo.png"
    },
    {
      nombre: "Maribel Figeroa",
      rol: "Presentadora Principal",
      descripcion: "Periodista Reconocida en investigación y reportaje",
      imagen: "/maribel.png"
    },
    {
      nombre: "Maritza Gonzalez",
      rol: "Psicologa",
      descripcion: "Maestria en peritaje psicologico",
      imagen: "/maritza.png"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-blue-600 mb-12 text-center">Nuestro Elenco</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {miembros.map((miembro, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Imagen placeholder */}
                <div className="relative h-64 bg-gray-200">
                  <Image
                    src={miembro.imagen}
                    alt={miembro.nombre}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-blue-600 mb-2">{miembro.nombre}</h3>
                  <p className="text-blue-500 font-semibold mb-3">{miembro.rol}</p>
                  <p className="text-gray-600">{miembro.descripcion}</p>
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