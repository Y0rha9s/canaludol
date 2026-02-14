'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Contacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    correo: '',
    descripcion: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Formulario enviado (esto es una demo)');
    console.log(formData);
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />
      
      {/* Fondo de imagen con overlay */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <img src="/volcan1.jpg" alt="Fondo" className="w-full h-full object-cover" />
      </div>

      <main className="flex-grow">
        <div className="max-w-3xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-white mb-8 text-center drop-shadow-md">Contáctanos</h1>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
            <p className="text-blue-100 mb-10 text-center text-lg drop-shadow-sm">
              ¿Tienes alguna consulta? Completa el formulario y nos pondremos en contacto contigo.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Nombre */}
              <div>
                <label className="block text-white font-semibold mb-3 tracking-wide">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-gray-400 backdrop-blur-sm transition-all"
                  placeholder="Tu nombre"
                />
              </div>
              
              {/* Teléfono */}
              <div>
                <label className="block text-white font-semibold mb-3 tracking-wide">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-gray-400 backdrop-blur-sm transition-all"
                  placeholder="+56 9 1234 5678"
                />
              </div>
              
              {/* Correo */}
              <div>
                <label className="block text-white font-semibold mb-3 tracking-wide">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-gray-400 backdrop-blur-sm transition-all"
                  placeholder="tu@email.com"
                />
              </div>
              
              {/* Descripción */}
              <div>
                <label className="block text-white font-semibold mb-3 tracking-wide">
                  Mensaje o Consulta *
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-gray-400 backdrop-blur-sm transition-all resize-none"
                  placeholder="Cuéntanos cómo podemos ayudarte..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl uppercase tracking-widest"
              >
                Enviar Mensaje
              </button>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}