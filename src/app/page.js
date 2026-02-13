import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Contenido principal */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-blue-600 text-center mb-6">
            Bienvenidos a Canal Udol
          </h1>
          <p className="text-center text-xl text-gray-700 mb-8">
            Tu canal de entretenimiento y noticias
          </p>
          
          {/* Aquí irá tu contenido */}
          <div className="bg-blue-50 rounded-lg p-8 text-center">
            <p className="text-gray-600">
              Contenido principal del sitio próximamente...
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}