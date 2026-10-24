import { useState } from 'react';
import { CATEGORY_COUNTS, CATEGORY_DETAIL_LABELS, CATEGORY_ORDER, TOTAL_QUESTIONS } from '../lib/data';
import type { SessionState } from '../types';
import { ConfirmDialog } from '../components/ConfirmDialog';

type Props = {
  session: SessionState | null;
  onStart: () => void;
  onResume: () => void;
  onReset: () => void;
  onOpenResults: () => void;
};

export const Landing = ({ session, onStart, onResume, onReset, onOpenResults }: Props) => {
  const [confirmReset, setConfirmReset] = useState(false);
  const inProgress = session?.status === 'in_progress';
  const completed = session?.status === 'completed';

  return (
    <main className="landing">
      <div className="container container--narrow">
        <div className="landing__eyebrow">
          <span className="badge badge--accent">Version 2 / Set 2</span>
          <span className="badge">Simulasi tidak resmi</span>
        </div>

        <h1 className="landing__title">Simulasi JLPT N4 — Version 2</h1>
        <p className="landing__lead">
          Latihan mandiri berisi 70 soal orisinal yang meniru alur ujian JLPT N4: kosakata, tata
          bahasa, bacaan, gambar, dan mendengarkan.
        </p>

        <div className="landing__meta">
          <span className="badge">70 Soal</span>
          <span className="badge">115 Menit</span>
          <span className="badge">4 Pilihan</span>
        </div>

        <dl className="landing__sections">
          {CATEGORY_ORDER.map((type) => (
            <div className="landing__section" key={type}>
              <dt>{CATEGORY_DETAIL_LABELS[type]}</dt>
              <dd>
                {CATEGORY_COUNTS[type]} soal
                {type === 'reading' ? ' · 5 bacaan' : ''}
                {type === 'story_image' || type === 'match_image' ? ' · ilustrasi' : ''}
                {type === 'listening' ? ' · 10 audio' : ''}
              </dd>
            </div>
          ))}
        </dl>

        {inProgress && (
          <div className="notice" style={{ marginTop: 24 }} role="status">
            Ada progres tersimpan. Waktu ujian tetap berjalan sejak Anda mulai.
          </div>
        )}

        <div className="landing__actions">
          {inProgress ? (
            <>
              <button type="button" className="btn btn--primary btn--lg" onClick={onResume}>
                Lanjutkan ujian
              </button>
              <button type="button" className="btn btn--lg" onClick={() => setConfirmReset(true)}>
                Mulai dari awal
              </button>
            </>
          ) : (
            <button type="button" className="btn btn--primary btn--lg" onClick={onStart}>
              {completed ? 'Kerjakan lagi' : 'Mulai Simulasi'}
            </button>
          )}
          {completed && (
            <button type="button" className="btn btn--lg" onClick={onOpenResults}>
              Lihat hasil terakhir
            </button>
          )}
        </div>

        <div className="landing__note">
          <strong>Sebelum mulai</strong>
          <ul>
            <li>
              Timer berjalan berdasarkan waktu nyata ({TOTAL_QUESTIONS} soal, 115 menit) dan tetap
              berlanjut meski halaman dimuat ulang.
            </li>
            <li>
              Listening memakai audio bahasa Jepang dari repo. Anda dapat memutar ulang maksimal 2
              kali per soal, dan transkrip baru muncul setelah ujian selesai.
            </li>
            <li>
              Jawaban dapat diganti kapan saja. Kunci jawaban dan pembahasan hanya tampil di halaman
              hasil.
            </li>
            <li>
              Hasil dihitung dari jumlah jawaban benar, bukan <em>scaled score</em> resmi JLPT.
            </li>
          </ul>
        </div>
      </div>

      <ConfirmDialog
        open={confirmReset}
        title="Mulai dari awal?"
        onClose={() => setConfirmReset(false)}
        actions={
          <>
            <button type="button" className="btn" onClick={() => setConfirmReset(false)}>
              Batal
            </button>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => {
                setConfirmReset(false);
                onReset();
              }}
            >
              Ya, hapus progres
            </button>
          </>
        }
      >
        Progres dan jawaban yang tersimpan akan dihapus, lalu ujian baru dimulai dari nomor 1 dengan
        waktu 115 menit.
      </ConfirmDialog>
    </main>
  );
};