'use client';
import { useState, useRef } from 'react';
import { RADIO_STREAM_URL } from '@/lib/radio';

export function useRadioPlayer() {
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

  return { playing, loading, audioRef, togglePlay, streamUrl: RADIO_STREAM_URL };
}
