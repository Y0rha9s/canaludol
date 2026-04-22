'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminMensajes() {
  const { status } = useSession();
  const router = useRouter();
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seleccionado, setSeleccionado] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login');
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      const load = async () => {
        const { data } = await supabase
          .from('mensajes_contacto')
          .select('*')
          .order('created_at', { ascending: false });
        setMensajes(data || []);
        setLoading(false);
      };
      load();
    }
  }, [status]);

  const handleLeer = async (mensaje) => {
    setSeleccionado(mensaje);
    if (!mensaje.leido) {
      await supabase
        .from('mensajes_contacto')
        .update({ leido: true })
        .eq('id', mensaje.id);
      setMensajes((prev) =>
        prev.map((m) => (m.id === mensaje.id ? { ...m, leido: true } : m))
      );
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar este mensaje?')) return;
    await supabase.from('mensajes_contacto').delete().eq('id', id);
    setMensajes((prev) => prev.filter((m) => m.id !== id));
    if (seleccionado?.id === id) setSeleccionado(null);
  };

  const noLeidos = mensajes.filter((m) => !m.leido).length;

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mensajes de Contacto</h1>
            <p className="text-gray-500 mt-1">
              {noLeidos > 0 ? (
                <span className="text-blue-600 font-medium">{noLeidos} mensaje{noLeidos > 1 ? 's' : ''} sin leer</span>
              ) : (
                'Todos los mensajes leídos'
              )}
            </p>
          </div>
          <Link href="/admin/dashboard" className="text-blue-600 hover:text-blue-800 text-sm">
            ← Volver al Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {mensajes.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center">
            <p className="text-gray-400">Aún no hay mensajes recibidos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Lista */}
            <div className="md:col-span-1 space-y-2">
              {mensajes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleLeer(m)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                    seleccionado?.id === m.id
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-semibold text-sm ${!m.leido ? 'text-gray-900' : 'text-gray-500'}`}>
                      {m.nombre}
                    </span>
                    {!m.leido && (
                      <span className="w-2 h-2 bg-blue-600 rounded-full shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate">{m.mensaje}</p>
                  <p className="text-xs text-gray-300 mt-1">
                    {new Date(m.created_at).toLocaleDateString('es-CL', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </button>
              ))}
            </div>

            {/* Detalle */}
            <div className="md:col-span-2">
              {seleccionado ? (
                <div className="bg-white rounded-xl shadow p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{seleccionado.nombre}</h2>
                      <p className="text-sm text-gray-400 mt-0.5">
                        {new Date(seleccionado.created_at).toLocaleDateString('es-CL', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => handleEliminar(seleccionado.id)}
                      className="text-xs px-3 py-1 rounded-lg bg-red-100 text-red-800 hover:bg-red-200 transition"
                    >
                      Eliminar
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Correo</p>
                        <a
                          href={`mailto:${seleccionado.correo}`}
                          className="text-blue-600 hover:underline text-sm font-medium"
                        >
                          {seleccionado.correo}
                        </a>
                      </div>
                      {seleccionado.telefono && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-400 mb-1">Teléfono</p>
                          <a
                            href={`tel:${seleccionado.telefono}`}
                            className="text-blue-600 hover:underline text-sm font-medium"
                          >
                            {seleccionado.telefono}
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-400 mb-2">Mensaje</p>
                      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                        {seleccionado.mensaje}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <a
                        href={`mailto:${seleccionado.correo}`}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                      >
                        Responder por correo
                      </a>
                      
                      {seleccionado.telefono && (
                        <a
                          href={`https://wa.me/${seleccionado.telefono.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                        >
                          WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow p-10 text-center text-gray-400">
                  Selecciona un mensaje para leerlo
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}