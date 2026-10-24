import { useEffect, useRef, useState } from 'react';
import { MAX_AUDIO_PLAYS } from '../lib/data';

type Props = {
  src: string;
  playCount: number;
  onPlayStarted: () => void;
  title?: string;
};

export const AudioPlayer = ({ src, playCount, onPlayStarted, title }: Props) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const countRef = useRef(playCount);
    // Guards against counting a pause/resume as a brand-new playback.
    const countedRef = useRef(false);

    countRef.current = playCount;

    const remaining = Math.max(0, MAX_AUDIO_PLAYS - playCount);
    const exhausted = remaining === 0;

    useEffect(() => {
      setPlaying(false);
      setError(null);
      countedRef.current = false;
    }, [src, reloadKey]);

  const startPlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (countRef.current >= MAX_AUDIO_PLAYS) return;
    setError(null);
    const promise = audio.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(() => {
        setError('Audio tidak dapat diputar. Periksa koneksi lalu coba lagi.');
        setPlaying(false);
      });
    }
  };

  const stopPlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setPlaying(false);
  };

  return (
    <div className="audio-box">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <strong className="small">{title ?? 'Audio pertanyaan'}</strong>
        <span className="audio-box__remaining" aria-live="polite">
          Sisa pemutaran: {remaining} dari {MAX_AUDIO_PLAYS}
        </span>
      </div>

      <audio
        key={reloadKey}
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlaying={() => {
          setPlaying(true);
          setError(null);
                  if (!countedRef.current) {
                    countedRef.current = true;
                    onPlayStarted();
                  }
                }}
                onPause={() => setPlaying(false)}
                onEnded={() => {
                  setPlaying(false);
                  countedRef.current = false;
                }}
                onError={() => {
                  setPlaying(false);
                  setError('Audio gagal dimuat. Coba muat ulang audio di bawah.');
                }}
      >
        Browser Anda tidak mendukung pemutar audio.
      </audio>

      <div className="audio-box__row">
        {playing ? (
          <button type="button" className="btn" onClick={stopPlayback}>
            ⏸ Jeda
          </button>
        ) : (
          <button
            type="button"
            className="btn btn--primary"
            onClick={startPlayback}
            disabled={exhausted}
          >
            ▶ Putar audio
          </button>
        )}
        <span className="small muted">
          {exhausted
            ? 'Batas pemutaran untuk soal ini sudah tercapai. Pilih jawaban terbaik Anda.'
            : 'Dengarkan dengan saksama. Transkrip tersedia setelah ujian selesai.'}
        </span>
      </div>

      {error && (
        <div className="audio-error" role="alert">
          {error}
          <div style={{ marginTop: 8 }}>
            <button
              type="button"
              className="btn"
              onClick={() => {
                setError(null);
                setReloadKey((key) => key + 1);
              }}
            >
              Muat ulang audio
            </button>
          </div>
        </div>
      )}
    </div>
  );
};