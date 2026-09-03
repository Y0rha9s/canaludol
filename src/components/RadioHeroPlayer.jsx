'use client';
import { useEffect, useState } from 'react';
import { useRadioPlayer } from '@/lib/useRadioPlayer';
import { RADIO_NOMBRE, RADIO_STATUS_URL } from '@/lib/radio';

export default function RadioHeroPlayer() {
  const { playing, loading, audioRef, togglePlay, streamUrl } = useRadioPlayer();
  const [estado, setEstado] = useState('verificando'); // 'verificando' | 'en-vivo' | 'fuera-de-linea'
  const [oyentes, setOyentes] = useState(null);

  useEffect(() => {
    let cancelado = false;

    const verificar = async () => {
      try {
        const res = await fetch(RADIO_STATUS_URL, { cache: 'no-store' });
        const data = await res.json();
        const source = data?.icestats?.source;
        const activo = Array.isArray(source) ? source.length > 0 : Boolean(source);
        const listeners = Array.isArray(source) ? source[0]?.listeners : source?.listeners;

        if (!cancelado) {
          setEstado(activo ? 'en-vivo' : 'fuera-de-linea');
          setOyentes(typeof listeners === 'number' ? listeners : null);
        }
      } catch {
        if (!cancelado) setEstado('fuera-de-linea');
      }
    };

    verificar();
    const interval = setInterval(verificar, 30000);
    return () => { cancelado = true; clearInterval(interval); };
  }, []);

  return (
    <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-8 flex flex-col sm:flex-row items-center gap-8">
      <button
        onClick={togglePlay}
        disabled={loading}
        className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white shrink-0 transition disabled:opacity-50"
      >
        {loading ? (
          <div className="w-7 h-7 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : playing ? (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
          </svg>
        ) : (
          <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      <div className="flex-1 text-center sm:text-left">
        <h2 className="text-white text-xl font-extrabold">{RADIO_NOMBRE}</h2>
        <p className="text-gray-400 text-sm mt-1">
          {playing ? 'Reproduciendo ahora...' : 'Toca play para escuchar'}
        </p>
      </div>

      <div className="flex items-center gap-2 bg-[#0f0f0f] border border-white/5 rounded-full px-4 py-2 shrink-0">
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            estado === 'en-vivo' ? 'bg-green-500 animate-pulse' : estado === 'verificando' ? 'bg-gray-500 animate-pulse' : 'bg-gray-600'
          }`}
        />
        <span className="text-xs font-bold uppercase tracking-wider text-white">
          {estado === 'en-vivo' ? 'Al aire' : estado === 'verificando' ? 'Verificando...' : 'Fuera de línea'}
        </span>
        {estado === 'en-vivo' && oyentes !== null && (
          <span className="text-xs text-gray-400 ml-1">· {oyentes} oyente{oyentes !== 1 ? 's' : ''}</span>
        )}
      </div>

      <audio ref={audioRef} src={streamUrl} preload="none" />
    </div>
  );
}
