import type { Question, ScoreSummary } from '../types';
import { CATEGORY_DETAIL_LABELS, CATEGORY_ORDER } from './data';

export const scoreAnswers = (questions: Question[], answers: Record<number, string | undefined>): ScoreSummary => {
  const total = questions.length;
  let correct = 0;
  let answered = 0;

  const perCategory = new Map<string, { correct: number; total: number }>();

  for (const question of questions) {
    const bucket = perCategory.get(question.type) ?? { correct: 0, total: 0 };
    bucket.total += 1;
    const given = answers[question.id];
    if (given != null) {
      answered += 1;
      if (given === question.answer) {
        correct += 1;
        bucket.correct += 1;
      }
    }
    perCategory.set(question.type, bucket);
  }

  return {
    total,
    correct,
    wrong: answered - correct,
    answered,
    unanswered: total - answered,
    percent: total === 0 ? 0 : Number(((correct / total) * 100).toFixed(1)),
    byCategory: CATEGORY_ORDER.filter((type) => perCategory.has(type)).map((type) => {
      const bucket = perCategory.get(type)!;
      return {
        type,
        label: CATEGORY_DETAIL_LABELS[type],
        correct: bucket.correct,
        total: bucket.total,
      };
    }),
  };
};

export const formatDuration = (milliseconds: number) => {
  const safe = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
};