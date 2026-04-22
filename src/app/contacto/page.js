'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';

export default function Contacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    correo: '',
    mensaje: ''
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');

    const { error } = await supabase.from('mensajes_contacto').insert({
      nombre: formData.nombre,
      telefono: formData.telefono || null,
      correo: formData.correo,
      mensaje: formData.mensaje,
    });

    setSending(false);

    if (error) {
      setError('No se pudo enviar el mensaje. Intenta nuevamente.');
      return;
    }

    setSent(true);
    setFormData({ nombre: '', telefono: '', correo: '', mensaje: '' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f0f]">
      <Navbar />

      {/* Header */}
      <section className="bg-[#0a0a0a] border-b border-white/10 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-1 h-6 bg-red-600 rounded-full" />
            <span className="text-red-500 text-sm font-bold uppercase tracking-wider">Canal Udol</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white">Contáctanos</h1>
          <p className="text-gray-400 mt-2">¿Tienes alguna consulta o quieres trabajar con nosotros?</p>
        </div>
      </section>

      <main className="flex-grow max-w-3xl mx-auto px-4 py-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Info lateral */}
          <div className="space-y-6">
            <div className="bg-[#1a1a1a] rounded-xl p-5 border border-white/5">
              <div className="w-8 h-8 bg-red-600/20 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-white font-bold text-sm mb-1">Ubicación</h3>
              <p className="text-gray-400 text-sm">Villarrica, La Araucanía, Chile</p>
            </div>

            <div className="bg-[#1a1a1a] rounded-xl p-5 border border-white/5">
              <div className="w-8 h-8 bg-red-600/20 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-white font-bold text-sm mb-1">Transmisiones</h3>
              <p className="text-gray-400 text-sm">Lunes, miércoles y viernes 8:30 hrs</p>
            </div>

            <div className="bg-[#1a1a1a] rounded-xl p-5 border border-white/5">
              <div className="w-8 h-8 bg-red-600/20 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </div>
              <h3 className="text-white font-bold text-sm mb-1">Facebook</h3>
              {/* CORRECCIÓN: Se agregó la etiqueta <a> de apertura */}
              <a
                href="https://www.facebook.com/CanalUdol/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
              >
                /CanalUdol
              </a>
            </div>
          </div>

          {/* Formulario */}
          <div className="md:col-span-2">
            {sent ? (
              <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-10 text-center">
                <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-white font-bold text-xl mb-2">¡Mensaje enviado!</h2>
                <p className="text-gray-400 text-sm mb-6">Nos pondremos en contacto contigo a la brevedad.</p>
                <button
                  onClick={() => setSent(false)}
                  className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-6 space-y-4">
                {error && (
                  <div className="bg-red-900/30 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Nombre completo *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    placeholder="Tu nombre"
                    className="w-full px-4 py-3 bg-[#0f0f0f] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-600 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="+56 9 1234 5678"
                    className="w-full px-4 py-3 bg-[#0f0f0f] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-600 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Correo electrónico *</label>
                  <input
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    required
                    placeholder="tu@email.com"
                    className="w-full px-4 py-3 bg-[#0f0f0f] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-600 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Mensaje *</label>
                  <textarea
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="Cuéntanos cómo podemos ayudarte..."
                    className="w-full px-4 py-3 bg-[#0f0f0f] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-600 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition-colors uppercase tracking-wider text-sm"
                >
                  {sending ? 'Enviando...' : 'Enviar mensaje'}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}