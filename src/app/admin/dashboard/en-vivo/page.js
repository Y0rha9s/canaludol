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
          .select('value')
          .eq('key', 'url_senal_vivo')
          .single();
        setUrl(data?.value || '');
        setLoading(false);
      };
      load();
    }
  }, [status]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    const { error } = await supabase
      .from('site_config')
      .upsert({ key: 'url_senal_vivo', value: url });

    setSaving(false);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
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
            <p className="text-gray-500 mt-1">Configura la URL del stream que se mostrará en el sitio.</p>
          </div>
          <Link href="/admin/dashboard" className="text-blue-600 hover:text-blue-800 text-sm">
            ← Volver al Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">
        <section className="bg-white rounded-xl shadow p-6">
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL del stream (YouTube o Facebook)
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://youtube.com/live/..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              />
              <p className="text-xs text-gray-400 mt-1">
                Acepta links de YouTube (youtube.com/watch, youtu.be, youtube.com/live) y Facebook.
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
              {saved && (
                <span className="text-green-600 text-sm font-medium">✓ Guardado correctamente</span>
              )}
            </div>
          </form>

          {url && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-500 mb-1">URL actual:</p>
              {/* CORRECCIÓN: Se agregó la etiqueta <a> de apertura */}
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm break-all"
              >
                {url}
              </a>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}