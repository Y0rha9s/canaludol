'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ImageCropper from '@/components/ImageCropper';

async function uploadImgbb(fileOrBlob) {
  const formData = new FormData();
  formData.append('image', fileOrBlob);
  formData.append('key', process.env.NEXT_PUBLIC_IMGBB_API_KEY);
  const res = await fetch('https://api.imgbb.com/1/upload', {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  if (!data.success) throw new Error('Error al subir imagen');
  return data.data.url;
}

const FORM_VACIO = {
  nombre: '',
  rol: '',
  especialidad: '',
  orden: 0,
  activo: true,
};

export default function AdminColaboradores() {
  const { status } = useSession();
  const router = useRouter();
  const [colaboradores, setColaboradores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState(FORM_VACIO);

  // Cropper
  const [imagenSrc, setImagenSrc] = useState(null);
  const [imagenBlob, setImagenBlob] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login');
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') cargar();
  }, [status]);

  const cargar = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('colaboradores')
      .select('*')
      .order('orden', { ascending: true });
    setColaboradores(data || []);
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImagenSrc(reader.result);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropConfirm = (blob) => {
    setImagenBlob(blob);
    setPreviewUrl(URL.createObjectURL(blob));
    setShowCropper(false);
    setImagenSrc(null);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setImagenSrc(null);
  };

  const handleEditar = (colaborador) => {
    setEditando(colaborador.id);
    setFormData({
      nombre: colaborador.nombre,
      rol: colaborador.rol,
      especialidad: colaborador.especialidad || '',
      orden: colaborador.orden || 0,
      activo: colaborador.activo,
    });
    setImagenBlob(null);
    setPreviewUrl(colaborador.imagen_url || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelar = () => {
    setEditando(null);
    setFormData(FORM_VACIO);
    setImagenBlob(null);
    setPreviewUrl(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    let imagenUrl = editando
      ? colaboradores.find((c) => c.id === editando)?.imagen_url || null
      : null;

    if (imagenBlob) {
      try {
        imagenUrl = await uploadImgbb(imagenBlob);
      } catch {
        setError('No se pudo subir la imagen');
        setSaving(false);
        return;
      }
    }

    const payload = {
      nombre: formData.nombre,
      rol: formData.rol,
      especialidad: formData.especialidad || null,
      imagen_url: imagenUrl,
      orden: Number(formData.orden) || 0,
      activo: formData.activo,
    };

    let err;
    if (editando) {
      ({ error: err } = await supabase.from('colaboradores').update(payload).eq('id', editando));
    } else {
      ({ error: err } = await supabase.from('colaboradores').insert(payload));
    }

    setSaving(false);
    if (err) { setError('No se pudo guardar'); return; }

    handleCancelar();
    await cargar();
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar este colaborador?')) return;
    await supabase.from('colaboradores').delete().eq('id', id);
    await cargar();
  };

  const handleToggleActivo = async (colaborador) => {
    await supabase.from('colaboradores').update({ activo: !colaborador.activo }).eq('id', colaborador.id);
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
      {/* Cropper modal */}
      {showCropper && imagenSrc && (
        <ImageCropper
          imageSrc={imagenSrc}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      )}

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Colaboradores</h1>
            <p className="text-gray-500 mt-1">Gestiona el equipo del canal.</p>
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
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {editando ? 'Editar colaborador' : 'Agregar colaborador'}
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rol *</label>
              <input
                type="text"
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                required
                placeholder="Ej: Reportera, Psicóloga, Director"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Especialidad / Descripción</label>
              <textarea
                name="especialidad"
                value={formData.especialidad}
                onChange={handleChange}
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>

            {/* Foto con preview */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Foto</label>
              <div className="flex items-start gap-5">
                {/* Preview */}
                <div className="w-24 h-32 rounded-xl overflow-hidden bg-blue-50 border border-gray-200 shrink-0">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-3xl font-bold text-blue-300">
                        {formData.nombre?.charAt(0).toUpperCase() || '?'}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium cursor-pointer hover:bg-blue-700">
                    {previewUrl ? 'Cambiar foto' : 'Subir foto'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-400 mt-2">
                    Al subir una foto podrás ajustar el recorte y zoom antes de guardar.
                  </p>
                  {previewUrl && (
                    <button
                      type="button"
                      onClick={() => { setPreviewUrl(null); setImagenBlob(null); }}
                      className="text-xs text-red-500 hover:text-red-700 mt-2 block"
                    >
                      Quitar foto
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Orden</label>
              <input
                type="number"
                name="orden"
                value={formData.orden}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              />
              <p className="text-xs text-gray-400 mt-1">Número menor aparece primero</p>
            </div>

            <div className="flex items-center gap-3">
              <input
                id="activo"
                type="checkbox"
                name="activo"
                checked={formData.activo}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="activo" className="text-sm text-gray-700">
                Visible en el sitio
              </label>
            </div>

            <div className="md:col-span-2 flex justify-end gap-3">
              {editando && (
                <button
                  type="button"
                  onClick={handleCancelar}
                  className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
              >
                {saving ? 'Guardando...' : editando ? 'Guardar cambios' : 'Agregar colaborador'}
              </button>
            </div>
          </form>
        </section>

        {/* Lista */}
        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Colaboradores ({colaboradores.length})
          </h2>
          {colaboradores.length === 0 ? (
            <p className="text-gray-500 text-sm">No hay colaboradores aún.</p>
          ) : (
            <div className="space-y-3">
              {colaboradores.map((c) => (
                <div key={c.id} className="flex items-center gap-4 border border-gray-200 rounded-xl px-4 py-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 shrink-0">
                    {c.imagen_url ? (
                      <img src={c.imagen_url} alt={c.nombre} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-blue-400 font-bold text-lg">{c.nombre.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-800">{c.nombre}</div>
                    <div className="text-xs text-gray-400">{c.rol} · Orden: {c.orden}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleActivo(c)}
                      className={`text-xs px-3 py-1 rounded-lg transition ${
                        c.activo ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {c.activo ? 'Visible' : 'Oculto'}
                    </button>
                    <button
                      onClick={() => handleEditar(c)}
                      className="text-xs px-3 py-1 rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(c.id)}
                      className="text-xs px-3 py-1 rounded-lg bg-red-100 text-red-800 hover:bg-red-200 transition"
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