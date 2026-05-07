'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const [linkImportar, setLinkImportar] = useState('');
const [importando, setImportando] = useState(false);
const [errorImport, setErrorImport] = useState('');

const CATEGORIAS = ['Regional', 'Deporte', 'Cultura', 'Política', 'Comunidad', 'Compartidas'];

const DURACIONES = [
  { label: '14 días', dias: 14 },
  { label: '30 días', dias: 30 },
  { label: 'Sin vencimiento', dias: null },
];

async function uploadImgbb(file) {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('key', process.env.NEXT_PUBLIC_IMGBB_API_KEY);

  const res = await fetch('https://api.imgbb.com/1/upload', {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  if (!data.success) throw new Error('Error al subir imagen a imgbb');
  return data.data.url;
}

export default function AdminNoticias() {
  const { status } = useSession();
  const router = useRouter();
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imagenFile, setImagenFile] = useState(null);
  const [duracion, setDuracion] = useState(30);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    contenido: '',
    categoria: '',
    destacada: false,
    orden: 1,
    publicada: true,
  });

  const fetchNoticias = () =>
    supabase
      .from('noticias')
      .select('*')
      .order('created_at', { ascending: false });

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login');
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      const load = async () => {
        setLoading(true);
        const { data, error } = await fetchNoticias();
        if (error) {
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
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleImportar = async () => {
    if (!linkImportar) return;
    setImportando(true);
    setErrorImport('');

    try {
      const res = await fetch('/api/og', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: linkImportar }),
      });

      const data = await res.json();

      if (data.error) {
        setErrorImport('No se pudo extraer la noticia. Intenta con otro link.');
        setImportando(false);
        return;
      }

      setFormData((prev) => ({
        ...prev,
        titulo: data.titulo || prev.titulo,
        descripcion: data.descripcion || prev.descripcion,
        categoria: 'Compartidas',
      }));

      if (data.imagen) {
        setFormData((prev) => ({ ...prev, imagen_url: data.imagen }));
      }

      setLinkImportar('');
    } catch {
      setErrorImport('Error al conectar con el servidor.');
    }

    setImportando(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    let imagenUrl = null;

    if (imagenFile) {
      try {
        imagenUrl = await uploadImgbb(imagenFile);
      } catch (err) {
        setError('No se pudo subir la imagen');
        setSaving(false);
        return;
      }
    }

    const expiresAt = duracion
      ? new Date(Date.now() + duracion * 24 * 60 * 60 * 1000).toISOString()
      : null;

    const payload = {
      titulo: formData.titulo,
      descripcion: formData.descripcion || null,
      contenido: formData.contenido || null,
      imagen_url: imagenUrl,
      categoria: formData.categoria || null,
      destacada: formData.destacada,
      orden: formData.destacada ? Number(formData.orden) || 1 : null,
      publicada: formData.publicada,
      expires_at: expiresAt,
    };

    const { error } = await supabase.from('noticias').insert(payload);

    setSaving(false);

    if (error) {
      setError('No se pudo crear la noticia');
      return;
    }

    setFormData({
      titulo: '',
      descripcion: '',
      contenido: '',
      categoria: '',
      destacada: false,
      orden: 1,
      publicada: true,
    });
    setImagenFile(null);
    setDuracion(30);

    const { data } = await fetchNoticias();
    setNoticias(data || []);
  };

  const handleToggleDestacada = async (noticia) => {
    const { error } = await supabase
      .from('noticias')
      .update({ destacada: !noticia.destacada })
      .eq('id', noticia.id);

    if (error) { alert('No se pudo actualizar'); return; }
    const { data } = await fetchNoticias();
    setNoticias(data || []);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta noticia?')) return;
    const { error } = await supabase.from('noticias').delete().eq('id', id);
    if (error) { alert('No se pudo eliminar'); return; }
    const { data } = await fetchNoticias();
    setNoticias(data || []);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  const destacadas = noticias.filter((n) => n.destacada);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Noticias</h1>
            <p className="text-gray-500 mt-1">Crea y administra las noticias del sitio.</p>
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

        {/* Formulario crear */}
        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Crear nueva noticia</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Importar desde link */}
            <div className="md:col-span-2 bg-blue-50 border border-blue-100 rounded-xl p-4">
              <label className="block text-sm font-bold text-blue-700 mb-2">
                Importar desde Facebook u otro sitio
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={linkImportar}
                  onChange={(e) => setLinkImportar(e.target.value)}
                  placeholder="https://www.facebook.com/CanalUdol/posts/..."
                  className="flex-1 px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-black text-sm"
                />
                <button
                  type="button"
                  onClick={handleImportar}
                  disabled={importando || !linkImportar}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium shrink-0"
                >
                  {importando ? 'Importando...' : 'Importar'}
                </button>
              </div>
              {errorImport && (
                <p className="text-red-500 text-xs mt-2">{errorImport}</p>
              )}
              <p className="text-blue-500 text-xs mt-1">
                Se pre-rellenará el formulario automáticamente. Puedes editarlo antes de publicar.
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción corta</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Contenido completo</label>
              <textarea
                name="contenido"
                value={formData.contenido}
                onChange={handleChange}
                rows="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>

            {/* Imagen */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
              <label className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium cursor-pointer hover:bg-blue-700">
                Subir imagen
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImagenFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
              <p className="mt-1 text-xs text-gray-500">
                {imagenFile ? `✓ ${imagenFile.name}` : 'Ningún archivo seleccionado'}
              </p>
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              >
                <option value="">Sin categoría</option>
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Duración */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duración en el sitio</label>
              <select
                value={duracion ?? 'null'}
                onChange={(e) => setDuracion(e.target.value === 'null' ? null : Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              >
                {DURACIONES.map((d) => (
                  <option key={d.label} value={d.dias ?? 'null'}>{d.label}</option>
                ))}
              </select>
            </div>

            {/* Destacada */}
            <div className="flex items-center gap-3">
              <input
                id="destacada"
                type="checkbox"
                name="destacada"
                checked={formData.destacada}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="destacada" className="text-sm text-gray-700">
                Noticia destacada (aparece en el Hero)
              </label>
            </div>

            {/* Publicada */}
            <div className="flex items-center gap-3">
              <input
                id="publicada"
                type="checkbox"
                name="publicada"
                checked={formData.publicada}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="publicada" className="text-sm text-gray-700">
                Publicar en el sitio
              </label>
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
              >
                {saving ? 'Guardando...' : 'Crear noticia'}
              </button>
            </div>
          </form>
        </section>

        {/* Lista noticias */}
        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Todas las noticias ({noticias.length})
          </h2>
          {noticias.length === 0 ? (
            <p className="text-gray-500 text-sm">Aún no hay noticias creadas.</p>
          ) : (
            <div className="space-y-2">
              {noticias.map((n) => (
                <div key={n.id} className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-800 truncate">{n.titulo}</div>
                    <div className="text-xs text-gray-400 mt-0.5 flex gap-3">
                      <span>{n.categoria || 'Sin categoría'}</span>
                      {n.destacada && <span className="text-yellow-600 font-medium">★ Destacada</span>}
                      {n.expires_at && (
                        <span className={new Date(n.expires_at) < new Date() ? 'text-red-500' : 'text-green-600'}>
                          {new Date(n.expires_at) < new Date()
                            ? '✗ Vencida'
                            : `Vence ${new Date(n.expires_at).toLocaleDateString('es-CL')}`}
                        </span>
                      )}
                      {!n.expires_at && <span className="text-gray-400">Sin vencimiento</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4 shrink-0">
                    <button
                      onClick={() => handleToggleDestacada(n)}
                      className={`text-xs px-3 py-1 rounded-lg transition ${n.destacada
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {n.destacada ? 'Quitar destacada' : 'Destacar'}
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