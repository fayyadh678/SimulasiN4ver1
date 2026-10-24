import { useMemo, useState } from 'react';
import { AudioPlayer } from '../components/AudioPlayer';
import { ChoiceCard } from '../components/ChoiceCard';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { ExamHeader } from '../components/ExamHeader';
import { ImageChoiceCard } from '../components/ImageChoiceCard';
import { QuestionNavigator } from '../components/QuestionNavigator';
import { assetUrl } from '../lib/assets';
import {
  CATEGORY_LABELS,
  MAX_AUDIO_PLAYS,
  TOTAL_QUESTIONS,
  getListeningScript,
  getMatchingScene,
  getPassage,
  getStoryScene,
  questions,
} from '../lib/data';
import type { Answers, AudioPlayCounts, Choice, SessionState } from '../types';

const CHOICES: Choice[] = ['A', 'B', 'C', 'D'];

type Props = {
  session: SessionState;
  index: number;
  remainingMs: number;
  onAnswer: (questionId: number, choice: Choice) => void;
  onAudioPlay: (questionId: number) => void;
  onNavigate: (index: number) => void;
  onFinish: () => void;
  onExit: () => void;
};

export const Exam = ({
  session,
  index,
  remainingMs,
  onAnswer,
  onAudioPlay,
  onNavigate,
  onFinish,
  onExit,
}: Props) => {
  const [listOpen, setListOpen] = useState(false);
  const [confirmFinish, setConfirmFinish] = useState(false);

  const question = questions[index];
  const answers: Answers = session.answers;
  const audioPlayCount: AudioPlayCounts = session.audioPlayCount;
  const answeredCount = Object.keys(answers).length;

  const passage = question.type === 'reading' ? getPassage(question.passageId) : undefined;
  const story = question.type === 'story_image' ? getStoryScene(question.sceneId) : undefined;
  const matching = question.type === 'match_image' ? getMatchingScene(question.matchingId) : undefined;
  const listening = question.type === 'listening' ? getListeningScript(question.audioId) : undefined;

  const listeningIds = useMemo(
    () => new Set(questions.filter((item) => item.type === 'listening').map((item) => item.id)),
    []
  );

  // Listening questions whose audio never successfully played and that are still
  // unanswered — surfaced before finishing so nobody is silently scored unheard.
  const unheardIds = useMemo(
    () =>
      questions
        .filter(
          (item) =>
            item.type === 'listening' &&
            answers[item.id] == null &&
            (audioPlayCount[item.id] ?? 0) === 0
        )
        .map((item) => item.id),
    [answers, audioPlayCount]
  );

  const unanswered = questions.filter((item) => answers[item.id] == null).map((item) => item.id);

  const goTo = (nextIndex: number) => {
    const clamped = Math.min(questions.length - 1, Math.max(0, nextIndex));
    onNavigate(clamped);
    setListOpen(false);
  };

  const select = (choice: Choice) => onAnswer(question.id, choice);
  const selectImage = (choice: Choice) => onAnswer(question.id, choice);

  const categoryLabel = CATEGORY_LABELS[question.type];
  const isReadingRun = question.type === 'reading';

  return (
    <div className="exam">
      <ExamHeader
        current={index + 1}
        total={TOTAL_QUESTIONS}
        remainingMs={remainingMs}
        answered={answeredCount}
      />

      <div className="exam__body">
        <main className="exam__main">
          <div className="progress-track" role="presentation">
            <div
              className="progress-track__fill"
              style={{ width: `${((index + 1) / TOTAL_QUESTIONS) * 100}%` }}
            />
          </div>

          {passage && (
            <section className="passage" aria-labelledby="passage-title">
              <h2 className="passage__title" id="passage-title" lang="ja">
                {passage.title}
              </h2>
              <p className="passage__text" lang="ja">
                {passage.text}
              </p>
            </section>
          )}

          <article className="card question" aria-labelledby="question-prompt">
            <div className="question__meta">
              <span className="badge" aria-label={`Kategori ${categoryLabel}`}>
                {categoryLabel}
              </span>
              <span className="question__number">Soal {question.id} dari {TOTAL_QUESTIONS}</span>
            </div>

            <h2 className="question__prompt" id="question-prompt" lang="ja">
              {matching ? matching.prompt : question.prompt}
            </h2>

            {story && (
              <figure className="story-figure" style={{ marginBottom: 18 }}>
                <img
                  src={assetUrl(story.path)}
                  alt="Ilustrasi empat panel yang menunjukkan urutan kejadian pada cerita."
                />
                <figcaption>Panel 1 → 4 dibaca berurutan.</figcaption>
              </figure>
            )}

            {listening && (
              <div style={{ marginBottom: 18 }}>
                <AudioPlayer
                  src={assetUrl(listening.file)}
                  playCount={audioPlayCount[question.id] ?? 0}
                  onPlayStarted={() => onAudioPlay(question.id)}
                  title={`Audio soal ${question.id}`}
                />
                <p className="small muted" style={{ marginTop: 8 }}>
                  Batas {MAX_AUDIO_PLAYS} pemutaran per soal. Transkrip baru tersedia setelah ujian
                  selesai.
                </p>
              </div>
            )}

            {matching ? (
              <div className="image-choices">
                {CHOICES.map((choice) => (
                  <ImageChoiceCard
                    key={choice}
                    choice={choice}
                    src={assetUrl(`images/matching/${matching.id.toLowerCase()}-${choice.toLowerCase()}.svg`)}
                    alt={`Ilustrasi untuk pilihan ${choice}.`}
                    selected={answers[question.id] === choice}
                    onSelect={selectImage}
                  />
                ))}
              </div>
            ) : (
              <div className="choices" role="group" aria-labelledby="question-prompt">
                {CHOICES.map((choice) => (
                  <ChoiceCard
                    key={choice}
                    choice={choice}
                    text={question.options[choice]}
                    selected={answers[question.id] === choice}
                    onSelect={select}
                  />
                ))}
              </div>
            )}
          </article>

          <div className="card exam__nav">
            <button
              type="button"
              className="btn"
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
            >
              ← Sebelumnya
            </button>
            <button
              type="button"
              className="btn mobile-list-toggle"
              aria-expanded={listOpen}
              aria-controls="question-list"
              onClick={() => setListOpen((open) => !open)}
            >
              Daftar soal
            </button>
            <span className="exam__nav-spacer" />
            <button
                          type="button"
                          className="btn"
                          onClick={() => setConfirmFinish(true)}
                          aria-label="Selesaikan ujian"
                        >
                          Selesaikan
                        </button>
                        {index < questions.length - 1 && (
                          <button type="button" className="btn btn--primary" onClick={() => goTo(index + 1)}>
                            Berikutnya →
                          </button>
                        )}
          </div>

          <div>
            <button type="button" className="btn btn--ghost" onClick={onExit}>
              Simpan &amp; kembali ke beranda
            </button>
          </div>
        </main>

        <QuestionNavigator
                  total={TOTAL_QUESTIONS}
                  current={question.id}
                  answers={answers}
                  audioQuestions={listeningIds}
                  onSelect={goTo}
                  open={listOpen}
                />
      </div>

      <ConfirmDialog
        open={confirmFinish}
        title="Selesaikan ujian?"
        onClose={() => setConfirmFinish(false)}
        actions={
          <>
            <button type="button" className="btn" onClick={() => setConfirmFinish(false)}>
              Kembali
            </button>
            {unheardIds.length > 0 && (
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setConfirmFinish(false);
                  goTo(unheardIds[0] - 1);
                }}
              >
                Periksa soal audio
              </button>
            )}
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => {
                setConfirmFinish(false);
                onFinish();
              }}
            >
              Tetap selesaikan
            </button>
          </>
        }
      >
        <p>
          {unanswered.length > 0
            ? `Masih ada ${unanswered.length} soal belum dijawab.`
            : 'Semua soal sudah dijawab.'}{' '}
          Setelah diselesaikan, jawaban tidak dapat diubah dan kunci jawaban akan ditampilkan.
        </p>
        {unheardIds.length > 0 && (
          <p style={{ marginTop: 10, color: '#b91c1c' }}>
            {unheardIds.length} soal listening belum pernah diputar dan belum dijawab. Jika
            diselesaikan sekarang, soal tersebut dihitung kosong.
          </p>
        )}
        {isReadingRun && (
          <p style={{ marginTop: 10 }} className="small">
            Bacaan pada soal ini dipakai bersama tiga soal berurutan.
          </p>
        )}
      </ConfirmDialog>
    </div>
  );
};