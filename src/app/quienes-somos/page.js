import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function QuienesSomos() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />
      
      {/* Fondo de imagen con overlay */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <img src="/volcan1.jpg" alt="Fondo" className="w-full h-full object-cover" />
      </div>

      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-white mb-8 drop-shadow-md">Quiénes Somos</h1>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
            <p className="text-gray-100 mb-6 leading-relaxed text-lg drop-shadow-sm">
              Canal Udol es un medio de comunicación comprometido con entregar contenido de calidad 
              a nuestra audiencia. Desde nuestros inicios, hemos buscado informar, entretener y 
              conectar con nuestra comunidad.
            </p>
            
            <p className="text-gray-100 mb-6 leading-relaxed text-lg drop-shadow-sm">
              Nuestro equipo está conformado por profesionales apasionados por el periodismo, 
              el entretenimiento y la comunicación. Trabajamos día a día para ofrecer la mejor 
              experiencia a nuestros seguidores.
            </p>
            
            <h2 className="text-2xl font-bold text-blue-300 mt-10 mb-6 drop-shadow-md uppercase tracking-wide">Nuestra Misión</h2>
            <p className="text-gray-100 leading-relaxed text-lg drop-shadow-sm">
              Ser el canal de referencia para nuestra audiencia, entregando contenido relevante, 
              veraz y entretenido que genere valor en la vida de las personas.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}