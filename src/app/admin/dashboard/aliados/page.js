'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

async function uploadImgbb(file) {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('key', process.env.NEXT_PUBLIC_IMGBB_API_KEY);
  const res = await fetch('https://api.imgbb.com/1/upload', {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  if (!data.success) throw new Error('Error al subir imagen');
  return data.data.url;
}

export default function AdminAliados() {
  const { status } = useSession();
  const router = useRouter();
  const [aliados, setAliados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imagenFile, setImagenFile] = useState(null);
  const [orden, setOrden] = useState(0);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login');
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') cargar();
  }, [status]);

  const cargar = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('red_aliados')
      .select('*')
      .order('orden', { ascending: true });
    setAliados(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imagenFile) { setError('Selecciona una imagen'); return; }
    setSaving(true);
    setError('');

    let imagenUrl;
    try {
      imagenUrl = await uploadImgbb(imagenFile);
    } catch {
      setError('No se pudo subir la imagen');
      setSaving(false);
      return;
    }

    const { error } = await supabase.from('red_aliados').insert({
      imagen_url: imagenUrl,
      orden: Number(orden) || 0,
      activo: true,
    });

    setSaving(false);
    if (error) { setError('No se pudo guardar'); return; }

    setImagenFile(null);
    setOrden(0);
    await cargar();
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar esta imagen?')) return;
    await supabase.from('red_aliados').delete().eq('id', id);
    await cargar();
  };

  const handleToggleActivo = async (aliado) => {
    await supabase.from('red_aliados').update({ activo: !aliado.activo }).eq('id', aliado.id);
    await cargar();
  };

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
            <h1 className="text-3xl font-bold text-gray-900">Nuestra Red</h1>
            <p className="text-gray-500 mt-1">Gestiona las imágenes del carrusel de aliados.</p>
          </div>
          <Link href="/admin/dashboard" className="text-blue-600 hover:text-blue-800 text-sm">
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

        {/* Formulario */}
        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Agregar imagen</h2>
          <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Imagen *</label>
              <label className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium cursor-pointer hover:bg-blue-700">
                Seleccionar imagen
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImagenFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-400 mt-1">
                {imagenFile ? `✓ ${imagenFile.name}` : 'Ningún archivo seleccionado'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Orden</label>
              <input
                type="number"
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
                min="0"
                className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {saving ? 'Subiendo...' : 'Agregar'}
            </button>
          </form>
        </section>

        {/* Lista */}
        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Imágenes ({aliados.length})
          </h2>
          {aliados.length === 0 ? (
            <p className="text-gray-500 text-sm">No hay imágenes aún.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {aliados.map((a) => (
                <div key={a.id} className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="aspect-[16/5] bg-gray-100 overflow-hidden">
                    <img src={a.imagen_url} alt="Aliado" className="w-full h-full object-cover" />
                  </div>
                  <div className="px-3 py-2 flex items-center justify-between">
                    <span className="text-xs text-gray-400">Orden: {a.orden}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleActivo(a)}
                        className={`text-xs px-2 py-1 rounded-lg transition ${
                          a.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {a.activo ? 'Visible' : 'Oculto'}
                      </button>
                      <button
                        onClick={() => handleEliminar(a.id)}
                        className="text-xs px-2 py-1 rounded-lg bg-red-100 text-red-800 hover:bg-red-200"
                      >
                        Eliminar
                      </button>
                    </div>
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