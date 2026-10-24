import { describe, expect, it, vi } from 'vitest';
import {
  SESSION_SCHEMA_VERSION,
  SESSION_STORAGE_KEY,
  createSession,
  loadSession,
  parseStoredSession,
  saveSession,
} from './persistence';
import { scoreAnswers } from './score';
import { EXAM_DURATION_SECONDS, questions } from './data';
import type { Answers, SessionState } from '../types';

const createMemoryStorage = () => {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, value),
    removeItem: (key: string) => void store.delete(key),
    clear: () => store.clear(),
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    get length() {
      return store.size;
    },
  } as Storage;
};

describe('session persistence', () => {
  it('uses the V2-specific storage key and schema version', () => {
    expect(SESSION_STORAGE_KEY).toBe('jlpt_n4_simulation_v2_session');
    expect(createSession().schemaVersion).toBe(SESSION_SCHEMA_VERSION);
  });

  it('sets a 115 minute absolute deadline', () => {
    const now = 1_700_000_000_000;
    const session = createSession(now);
    expect(session.deadlineAt - session.startedAt).toBe(EXAM_DURATION_SECONDS * 1000);
    expect(session.deadlineAt).toBe(now + 115 * 60 * 1000);
    expect(session.status).toBe('in_progress');
    expect(session.completedAt).toBeNull();
  });

  it('round-trips a session through storage', () => {
    const storage = createMemoryStorage();
    const session: SessionState = {
      ...createSession(1000),
      answers: { 1: 'B', 70: 'D' },
      audioPlayCount: { 61: 2 },
    };
    saveSession(session, storage);
    expect(loadSession(storage)).toEqual(session);
  });

  it('rejects corrupted JSON and mismatched schema versions', () => {
    expect(parseStoredSession('{not json')).toBeNull();
    expect(parseStoredSession(JSON.stringify({ ...createSession(), schemaVersion: 1 }))).toBeNull();
    expect(parseStoredSession(null)).toBeNull();
  });

  it('drops invalid answers and play counts', () => {
    const stored = JSON.stringify({
      ...createSession(1000),
      answers: { 1: 'B', 2: 'Z', 999: 'A', 71: 'C' },
      audioPlayCount: { 61: 1, 62: -3, 63: 'x' },
    });
    const parsed = parseStoredSession(stored)!;
    expect(parsed.answers).toEqual({ 1: 'B' });
    expect(parsed.audioPlayCount).toEqual({ 61: 1 });
  });

  it('keeps the deadline stable across reloads', () => {
    const storage = createMemoryStorage();
    const session = createSession(Date.now());
    saveSession(session, storage);
    const reloaded = loadSession(storage)!;
    expect(reloaded.deadlineAt).toBe(session.deadlineAt);
  });
});

describe('score calculation', () => {
  it('scores correct, wrong and unanswered answers', () => {
    const answers: Answers = {};
    const correctIds = questions.slice(0, 40).map((question) => question.id);
    for (const id of correctIds) {
      answers[id] = questions.find((question) => question.id === id)!.answer;
    }
    const wrongQuestion = questions[40];
    answers[wrongQuestion.id] = wrongQuestion.answer === 'A' ? 'B' : 'A';

    const score = scoreAnswers(questions, answers);
    expect(score.total).toBe(70);
    expect(score.correct).toBe(40);
    expect(score.answered).toBe(41);
    expect(score.wrong).toBe(1);
    expect(score.unanswered).toBe(29);
    expect(score.percent).toBe(57.1);
  });

  it('reports category totals that add up to 70', () => {
    const empty = scoreAnswers(questions, {});
    expect(empty.byCategory.map((category) => category.total)).toEqual([20, 15, 15, 5, 5, 10]);
    expect(empty.byCategory.reduce((sum, category) => sum + category.correct, 0)).toBe(0);
    expect(empty.percent).toBe(0);
  });

  it('never exceeds 100 percent when every answer is correct', () => {
    const answers: Answers = {};
    for (const question of questions) answers[question.id] = question.answer;
    const score = scoreAnswers(questions, answers);
    expect(score.correct).toBe(70);
    expect(score.percent).toBe(100);
    expect(score.wrong).toBe(0);
    expect(score.unanswered).toBe(0);
  });

  it('does not count unknown ids', () => {
    const score = scoreAnswers(questions, { 999: 'A' });
    expect(score.answered).toBe(0);
    expect(score.correct).toBe(0);
  });
});

describe('timer expiry behaviour', () => {
  it('treats a past deadline as expired', () => {
    const now = Date.now();
    const session = { ...createSession(now - 2 * 60 * 60 * 1000) };
    expect(session.deadlineAt <= now).toBe(true);
  });

  it('auto-submits a stored expired session on load', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-24T12:00:00Z'));
    const expired = createSession(Date.now() - EXAM_DURATION_SECONDS * 1000 - 1000);
    expect(expired.deadlineAt <= Date.now()).toBe(true);
    vi.useRealTimers();
  });
});