import { useMemo, useState } from 'react';
import { assetUrl } from '../lib/assets';
import {
  CATEGORY_LABELS,
  TOTAL_QUESTIONS,
  getListeningScript,
  getMatchingScene,
  getPassage,
  getStoryScene,
  questions,
} from '../lib/data';
import type { Choice, ScoreSummary, SessionState } from '../types';

type Filter = 'all' | 'wrong' | 'unanswered' | 'correct';

const CHOICES: Choice[] = ['A', 'B', 'C', 'D'];

type Props = {
  session: SessionState;
  score: ScoreSummary;
  onBack: () => void;
  onRetry: () => void;
};

export const Review = ({ session, score, onBack, onRetry }: Props) => {
  const [filter, setFilter] = useState<Filter>('all');

  const rows = useMemo(
    () =>
      questions.map((question) => {
        const given = session.answers[question.id];
        const state = given == null ? 'unanswered' : given === question.answer ? 'correct' : 'wrong';
        return { question, given, state } as const;
      }),
    [session.answers]
  );

  const visible = rows.filter((row) => {
    if (filter === 'all') return true;
    if (filter === 'unanswered') return row.state === 'unanswered';
    return row.state === filter;
  });

  return (
    <main className="container" style={{ paddingTop: 28, paddingBottom: 48 }}>
      <div className="stack" style={{ gap: 18 }}>
        <div>
          <button type="button" className="btn btn--ghost" onClick={onBack}>
            ← Kembali ke hasil
          </button>
          <h1 style={{ marginTop: 8, fontSize: 'clamp(1.4rem, 4vw, 1.9rem)' }}>
            Pembahasan — Version 2
          </h1>
          <p className="muted small" style={{ marginTop: 6 }}>
            Benar {score.correct}/{TOTAL_QUESTIONS} · {score.percent.toFixed(1)}% · Kunci jawaban dan
            transkrip hanya tampil di halaman ini.
          </p>
        </div>

        <div className="review__filters" role="group" aria-label="Filter pembahasan">
          {(
            [
              ['all', `Semua (${rows.length})`],
              ['wrong', `Salah (${score.wrong})`],
              ['unanswered', `Belum dijawab (${score.unanswered})`],
              ['correct', `Benar (${score.correct})`],
            ] as [Filter, string][]
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              className="chip"
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>

        {visible.length === 0 && (
          <div className="card review-empty">Tidak ada soal pada filter ini.</div>
        )}

        {visible.map(({ question, given, state }) => {
          const passage = getPassage(question.passageId);
          const story = getStoryScene(question.sceneId);
          const matching = getMatchingScene(question.matchingId);
          const listening = getListeningScript(question.audioId);
          const stateLabel = state === 'correct' ? 'Benar' : state === 'wrong' ? 'Salah' : 'Tidak diisi';

          return (
            <article
              key={question.id}
              className={`review-card review-card--${
                state === 'correct' ? 'correct' : state === 'wrong' ? 'wrong' : 'empty'
              }`}
            >
              <div className="review-card__head">
                <span className="badge">Soal {question.id}</span>
                <span className="badge">{CATEGORY_LABELS[question.type]}</span>
                <span
                  className={`pill pill--${
                    state === 'correct' ? 'correct' : state === 'wrong' ? 'wrong' : 'empty'
                  }`}
                >
                  {stateLabel}
                </span>
                <span className="small muted">
                  Jawaban Anda: {given ?? '—'} · Kunci: {question.answer}
                </span>
              </div>

              {passage && (
                <section className="passage" style={{ marginBottom: 14 }}>
                  <h3 className="passage__title" lang="ja">{passage.title}</h3>
                  <p className="passage__text" lang="ja">{passage.text}</p>
                </section>
              )}

              {story && (
                <figure className="story-figure" style={{ marginBottom: 14 }}>
                  <img
                    src={assetUrl(story.path)}
                    alt="Ilustrasi empat panel yang menunjukkan urutan kejadian pada cerita."
                  />
                </figure>
              )}

              <h3 className="ja" style={{ fontSize: '1.0625rem' }}>
                {matching ? matching.prompt : question.prompt}
              </h3>

              {matching && (
                <div className="review-images">
                  {CHOICES.map((choice) => (
                    <figure key={choice}>
                      <img
                        src={assetUrl(`images/matching/${matching.id.toLowerCase()}-${choice.toLowerCase()}.svg`)}
                        alt={`Ilustrasi pilihan ${choice}.`}
                      />
                      <figcaption>
                        {choice}
                        {choice === question.answer ? ' · kunci' : ''}
                        {choice === given ? ' · jawaban Anda' : ''}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              )}

              <div className="review-options">
                {CHOICES.map((choice) => {
                  const classes = ['review-option'];
                  if (choice === question.answer) classes.push('review-option--correct');
                  else if (choice === given) classes.push('review-option--wrong');
                  return (
                    <div key={choice} className={classes.join(' ')}>
                      <span className="review-option__key">{choice}</span>
                      <span>
                        {matching ? `Pilihan ${choice}` : question.options[choice]}
                        {choice === question.answer ? ' ✓' : ''}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="explanation">
                <strong>Pembahasan:</strong> {question.explanation}
              </div>

              {listening && (
                <>
                  <div style={{ marginTop: 12 }}>
                    <audio controls preload="none" src={assetUrl(listening.file)} style={{ width: '100%' }}>
                      Browser Anda tidak mendukung pemutar audio.
                    </audio>
                  </div>
                  <div className="transcript">
                    <div className="transcript__label">Transkrip audio</div>
                    <p className="transcript__text" lang="ja">{listening.script}</p>
                  </div>
                </>
              )}
            </article>
          );
        })}

        <div className="row">
          <button type="button" className="btn" onClick={onBack}>
            ← Kembali ke hasil
          </button>
          <button type="button" className="btn" onClick={onRetry}>
            Ulangi latihan
          </button>
        </div>
      </div>
    </main>
  );
};