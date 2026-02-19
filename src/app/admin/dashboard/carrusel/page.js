'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function GestionCarrusel() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    subtitulo: '',
    imagen_url: '',
    orden: 1
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('carrusel_principal')
        .select('*')
        .order('orden', { ascending: true });
      
      if (!error) {
        setSlides(data || []);
      }
      setLoading(false);
    };

    load();
  }, []);

  const handleEdit = (slide) => {
    setEditingSlide(slide.id);
    setFormData({
      titulo: slide.titulo,
      subtitulo: slide.subtitulo,
      imagen_url: slide.imagen_url,
      orden: slide.orden
    });
  };

  const handleCancel = () => {
    setEditingSlide(null);
    setFormData({
      titulo: '',
      subtitulo: '',
      imagen_url: '',
      orden: 1
    });
  };

  const handleSave = async (slideId) => {
    const { error } = await supabase
      .from('carrusel_principal')
      .update(formData)
      .eq('id', slideId);

    if (!error) {
      alert('Slide actualizado correctamente');
      setEditingSlide(null);
      fetchSlides();
    } else {
      alert('Error al actualizar: ' + error.message);
    }
  };

  const handleToggleActive = async (slide) => {
    const { error } = await supabase
      .from('carrusel_principal')
      .update({ activo: !slide.activo })
      .eq('id', slide.id);

    if (!error) {
      fetchSlides();
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-2">
            <Link href="/admin/dashboard" className="text-blue-600 hover:text-blue-800">
              ← Volver al Dashboard
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión del Carrusel Principal</h1>
          <p className="text-gray-600 mt-1">Edita las 3 slides que aparecen en la página de inicio</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {slides.map((slide) => (
            <div key={slide.id} className="bg-white rounded-xl shadow p-6">
              {editingSlide === slide.id ? (
                // Modo edición
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título
                    </label>
                    <input
                      type="text"
                      value={formData.titulo}
                      onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subtítulo
                    </label>
                    <input
                      type="text"
                      value={formData.subtitulo}
                      onChange={(e) => setFormData({...formData, subtitulo: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL de Imagen
                    </label>
                    <input
                      type="text"
                      value={formData.imagen_url}
                      onChange={(e) => setFormData({...formData, imagen_url: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="/imagen.png"
                    />
                    <p className="text-xs text-gray-500 mt-1">Ejemplo: /marcelo.png</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Orden (1, 2, 3)
                    </label>
                    <input
                      type="number"
                      value={formData.orden}
                      onChange={(e) => setFormData({...formData, orden: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="1"
                      max="3"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleSave(slide.id)}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                    >
                      Guardar Cambios
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                // Modo vista
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-bold text-gray-800">Slide #{slide.orden}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        slide.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {slide.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{slide.titulo}</h3>
                    <p className="text-gray-600 mb-2">{slide.subtitulo}</p>
                    <p className="text-sm text-gray-500">Imagen: {slide.imagen_url}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(slide)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleToggleActive(slide)}
                      className={`px-4 py-2 rounded-lg ${
                        slide.activo 
                          ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {slide.activo ? 'Desactivar' : 'Activar'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-blue-900 mb-2">💡 Consejos:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Las imágenes deben estar en la carpeta <code className="bg-blue-100 px-1 rounded">public/</code></li>
            <li>• Usa rutas como: <code className="bg-blue-100 px-1 rounded">/imagen.png</code></li>
            <li>• El orden determina en qué posición aparece cada slide</li>
            <li>• Los cambios se ven inmediatamente en la página principal</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
