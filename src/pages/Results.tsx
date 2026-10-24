import { TOTAL_QUESTIONS } from '../lib/data';
import type { ScoreSummary, SessionState } from '../types';

type Props = {
  session: SessionState;
  score: ScoreSummary;
  onReview: () => void;
  onRetry: () => void;
  onHome: () => void;
};

const formatDuration = (ms: number) => {
  const safe = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  const pad = (value: number) => String(value).padStart(2, '0');
  return hours > 0
    ? `${hours} jam ${pad(minutes)} menit`
    : `${minutes} menit ${pad(seconds)} detik`;
};

export const Results = ({ session, score, onReview, onRetry, onHome }: Props) => {
  const durationMs = (session.completedAt ?? Date.now()) - session.startedAt;

  return (
    <main className="container container--narrow" style={{ paddingTop: 32, paddingBottom: 48 }}>
      <div className="stack" style={{ gap: 20 }}>
        <div>
          <span className="badge badge--accent">Hasil latihan</span>
          <h1 style={{ marginTop: 12, fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>
            Simulasi JLPT N4 — Version 2
          </h1>
          <p className="muted small" style={{ marginTop: 6 }}>
            Simulasi tidak resmi. Hasil ini bukan <em>scaled score</em> dan tidak menyatakan
            lulus/gagal JLPT resmi.
          </p>
        </div>

        <section className="card" style={{ padding: 22 }}>
          <div className="results__head">
            <div
              className="score-ring"
              style={{ ['--value' as string]: score.percent }}
              role="img"
              aria-label={`Skor ${score.percent} persen`}
            >
              <div className="score-ring__inner">
                <div>
                  <div className="score-ring__value">
                    {score.correct}/{score.total}
                  </div>
                  <div className="score-ring__label">{score.percent.toFixed(1)}%</div>
                </div>
              </div>
            </div>
            <div>
              <h2 style={{ fontSize: '1.125rem' }}>Jawaban benar {score.correct} dari {TOTAL_QUESTIONS}</h2>
              <p className="muted small" style={{ marginTop: 6 }}>
                Benar +1, salah atau kosong +0. Persentase = benar / {TOTAL_QUESTIONS} × 100.
              </p>
              <div className="row" style={{ marginTop: 12 }}>
                <span className="badge">Durasi: {formatDuration(durationMs)}</span>
                <span className="badge">{session.status === 'completed' ? 'Selesai' : 'Berjalan'}</span>
              </div>
            </div>
          </div>

          <div className="stat-grid">
            <div className="stat">
              <div className="stat__label">Benar</div>
              <div className="stat__value" style={{ color: 'var(--correct)' }}>{score.correct}</div>
            </div>
            <div className="stat">
              <div className="stat__label">Salah</div>
              <div className="stat__value" style={{ color: 'var(--wrong)' }}>{score.wrong}</div>
            </div>
            <div className="stat">
              <div className="stat__label">Kosong</div>
              <div className="stat__value">{score.unanswered}</div>
            </div>
            <div className="stat">
              <div className="stat__label">Terjawab</div>
              <div className="stat__value">{score.answered}</div>
            </div>
          </div>

          <h3 style={{ marginTop: 24, fontSize: '0.9375rem' }}>Benar per kategori</h3>
          <div className="category-grid">
            {score.byCategory.map((category) => (
              <div className="category" key={category.type}>
                              <div className="category__label">{category.label}</div>
                <div className="category__value">
                  {category.correct}/{category.total}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="row">
          <button type="button" className="btn btn--primary btn--lg" onClick={onReview}>
            Lihat pembahasan
          </button>
          <button type="button" className="btn btn--lg" onClick={onRetry}>
            Ulangi latihan
          </button>
          <button type="button" className="btn btn--ghost btn--lg" onClick={onHome}>
            Beranda
          </button>
        </div>
      </div>
    </main>
  );
};