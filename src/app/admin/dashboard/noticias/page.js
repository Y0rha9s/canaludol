'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminNoticias() {
  const { status } = useSession();
  const router = useRouter();
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    es_destacada: false,
    orden_destacada: 1,
    fecha: ''
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      const load = async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from('noticias')
          .select('*')
          .order('fecha', { ascending: false });

        if (error) {
          console.error(error);
          setError('No se pudieron cargar las noticias');
        } else {
          setNoticias(data || []);
          setError('');
        }
        setLoading(false);
      };

      load();
    }
  }, [status]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      titulo: formData.titulo,
      descripcion: formData.descripcion || null,
      es_destacada: formData.es_destacada,
      orden_destacada: formData.es_destacada ? Number(formData.orden_destacada) || 1 : null,
      fecha: formData.fecha || new Date().toISOString()
    };

    const { error } = await supabase.from('noticias').insert(payload);

    setSaving(false);

    if (error) {
      console.error(error);
      setError('No se pudo crear la noticia');
      return;
    }

    setFormData({
      titulo: '',
      descripcion: '',
      es_destacada: false,
      orden_destacada: 1,
      fecha: ''
    });

    fetchNoticias();
  };

  const handleToggleDestacada = async (noticia) => {
    const { error } = await supabase
      .from('noticias')
      .update({
        es_destacada: !noticia.es_destacada
      })
      .eq('id', noticia.id);

    if (error) {
      console.error(error);
      alert('No se pudo actualizar la noticia');
      return;
    }

    fetchNoticias();
  };

  const handleOrdenChange = async (noticia, orden) => {
    const value = Number(orden) || null;
    const { error } = await supabase
      .from('noticias')
      .update({
        orden_destacada: value
      })
      .eq('id', noticia.id);

    if (error) {
      console.error(error);
      alert('No se pudo actualizar el orden');
      return;
    }

    fetchNoticias();
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta noticia?')) return;

    const { error } = await supabase
      .from('noticias')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(error);
      alert('No se pudo eliminar la noticia');
      return;
    }

    fetchNoticias();
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Cargando...</div>
      </div>
    );
  }

  const destacadas = noticias.filter((n) => n.es_destacada);
  const normales = noticias.filter((n) => !n.es_destacada);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Noticias</h1>
            <p className="text-black mt-1">Administra el carrusel y las noticias de la página pública.</p>
          </div>
          <Link
            href="/admin/dashboard"
            className="text-blue-600 hover:text-blue-800"
          >
            ← Volver al Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Crear nueva noticia</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción (para carrusel)</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                id="es_destacada"
                type="checkbox"
                name="es_destacada"
                checked={formData.es_destacada}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="es_destacada" className="text-sm text-gray-700">
                Mostrar en carrusel de noticias destacadas
              </label>
            </div>

            {formData.es_destacada && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Orden en carrusel</label>
                <input
                  type="number"
                  name="orden_destacada"
                  value={formData.orden_destacada}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                  min="1"
                />
              </div>
            )}

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Guardando...' : 'Crear noticia'}
              </button>
            </div>
          </form>
        </section>

        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Noticias destacadas (carrusel)</h2>
          {destacadas.length === 0 ? (
            <p className="text-black text-sm">No hay noticias destacadas.</p>
          ) : (
            <div className="space-y-3">
              {destacadas.map((n) => (
                <div key={n.id} className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3">
                  <div>
                    <div className="font-semibold text-gray-800">{n.titulo}</div>
                    <div className="text-sm text-black">Orden: {n.orden_destacada ?? '-'}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      defaultValue={n.orden_destacada ?? ''}
                      onBlur={(e) => handleOrdenChange(n, e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-sm text-black"
                    />
                    <button
                      onClick={() => handleToggleDestacada(n)}
                      className="text-xs px-3 py-1 rounded-lg bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                    >
                      Quitar de carrusel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Todas las noticias</h2>
          {noticias.length === 0 ? (
            <p className="text-black text-sm">Aún no hay noticias creadas.</p>
          ) : (
            <div className="space-y-2">
              {noticias.map((n) => (
                <div key={n.id} className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3">
                  <div>
                    <div className="font-semibold text-gray-800">{n.titulo}</div>
                    <div className="text-xs text-black">
                      {n.es_destacada ? 'Destacada' : 'Normal'}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleDestacada(n)}
                      className="text-xs px-3 py-1 rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200"
                    >
                      {n.es_destacada ? 'Marcar como normal' : 'Marcar como destacada'}
                    </button>
                    <button
                      onClick={() => handleDelete(n.id)}
                      className="text-xs px-3 py-1 rounded-lg bg-red-100 text-red-800 hover:bg-red-200"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
