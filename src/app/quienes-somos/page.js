import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function QuienesSomos() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-blue-600 mb-8">Quiénes Somos</h1>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <p className="text-gray-700 mb-4 leading-relaxed">
              Canal Udol es un medio de comunicación comprometido con entregar contenido de calidad 
              a nuestra audiencia. Desde nuestros inicios, hemos buscado informar, entretener y 
              conectar con nuestra comunidad.
            </p>
            
            <p className="text-gray-700 mb-4 leading-relaxed">
              Nuestro equipo está conformado por profesionales apasionados por el periodismo, 
              el entretenimiento y la comunicación. Trabajamos día a día para ofrecer la mejor 
              experiencia a nuestros seguidores.
            </p>
            
            <h2 className="text-2xl font-bold text-blue-600 mt-8 mb-4">Nuestra Misión</h2>
            <p className="text-gray-700 leading-relaxed">
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