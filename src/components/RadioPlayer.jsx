'use client';
import { useState, useRef } from 'react';

const STREAM_URL = 'https://streaming01.xhost.cl/8064/stream';

export default function RadioPlayer() {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      setLoading(true);
      audioRef.current.play()
        .then(() => { setPlaying(true); setLoading(false); })
        .catch(() => setLoading(false));
    }
  };

  return (
    <>
      {/* Botón navbar */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-white hover:text-blue-200 text-sm font-medium transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
        </svg>
        Radio
      </button>

      {/* Reproductor flotante */}
      {open && (
        <div className="fixed bottom-4 right-4 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 w-72">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">En vivo</p>
              <h3 className="text-gray-900 font-bold text-sm">Radio Pop Music 101.9</h3>
            </div>
            <button
              onClick={() => { setOpen(false); if (playing) togglePlay(); }}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              disabled={loading}
              className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white shrink-0 transition disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : playing ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <div className="flex-1">
              <div className="flex items-center gap-1 h-6">
                {playing && (
                  <>
                    <span className="w-1 bg-blue-500 rounded-full animate-pulse" style={{ height: '60%' }} />
                    <span className="w-1 bg-blue-500 rounded-full animate-pulse" style={{ height: '100%', animationDelay: '0.2s' }} />
                    <span className="w-1 bg-blue-500 rounded-full animate-pulse" style={{ height: '40%', animationDelay: '0.4s' }} />
                    <span className="w-1 bg-blue-500 rounded-full animate-pulse" style={{ height: '80%', animationDelay: '0.1s' }} />
                  </>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {playing ? 'Reproduciendo...' : 'Toca play para escuchar'}
              </p>
            </div>
          </div>

          <audio ref={audioRef} src={STREAM_URL} preload="none" />
        </div>
      )}
    </>
  );
}