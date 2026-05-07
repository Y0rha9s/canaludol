'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminEnVivo() {
  const { status } = useSession();
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [activa, setActiva] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login');
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      const load = async () => {
        const { data } = await supabase
          .from('site_config')
          .select('key, value')
          .in('key', ['url_senal_vivo', 'senal_activa']);

        data?.forEach((row) => {
          if (row.key === 'url_senal_vivo') setUrl(row.value || '');
          if (row.key === 'senal_activa') setActiva(row.value === 'true');
        });

        setLoading(false);
      };
      load();
    }
  }, [status]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    await supabase.from('site_config').upsert({ key: 'url_senal_vivo', value: url });
    await supabase.from('site_config').upsert({ key: 'senal_activa', value: String(activa) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleToggle = async () => {
    const nuevoEstado = !activa;
    setActiva(nuevoEstado);
    await supabase.from('site_config').upsert({ key: 'senal_activa', value: String(nuevoEstado) });
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
            <h1 className="text-3xl font-bold text-gray-900">Señal en Vivo</h1>
            <p className="text-gray-500 mt-1">Configura y activa la transmisión en vivo.</p>
          </div>
          <Link href="/admin/dashboard" className="text-blue-600 hover:text-blue-800 text-sm">
            ← Volver al Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10 space-y-6">

        {/* Toggle */}
        <section className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Estado de la transmisión</h2>
              <p className="text-gray-500 text-sm mt-1">
                {activa ? '🔴 Transmisión activa — el embed se muestra en el sitio' : '⚫ Sin transmisión — se muestra el horario'}
              </p>
            </div>
            <button
              onClick={handleToggle}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none ${
                activa ? 'bg-red-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 ${
                  activa ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </section>

        {/* URL */}
        <section className="bg-white rounded-xl shadow p-6">
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL del stream (YouTube)
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              />
              <p className="text-xs text-gray-400 mt-1">
                Pega la URL del live de YouTube antes de activar la transmisión.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
              >
                {saving ? 'Guardando...' : 'Guardar URL'}
              </button>
              {saved && <span className="text-green-600 text-sm font-medium">✓ Guardado</span>}
            </div>
          </form>
          {url && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-1">URL actual:</p>
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm break-all">
                {url}
              </a>
            </div>
          )}
        </section>

        {/* Instrucciones */}
        <section className="bg-blue-50 border border-blue-100 rounded-xl p-5">
          <h3 className="text-blue-700 font-bold text-sm mb-2 uppercase tracking-wider">Cómo usar</h3>
          <ol className="text-blue-600 text-sm space-y-1 list-decimal list-inside">
            <li>Crea el live en YouTube Studio y copia la URL</li>
            <li>Pega la URL arriba y guarda</li>
            <li>Activa el switch "Transmisión activa"</li>
            <li>Inicia la transmisión en OBS</li>
            <li>Al terminar desactiva el switch</li>
          </ol>
        </section>
      </main>
    </div>
  );
}