import type { Answers, Choice, SessionState } from '../types';
import { EXAM_DURATION_SECONDS, TOTAL_QUESTIONS } from './data';

export const SESSION_STORAGE_KEY = 'jlpt_n4_simulation_v2_session';
export const SESSION_SCHEMA_VERSION = 2;

const CHOICES: Choice[] = ['A', 'B', 'C', 'D'];

const isChoice = (value: unknown): value is Choice =>
  typeof value === 'string' && (CHOICES as string[]).includes(value);

export const createSession = (now = Date.now()): SessionState => ({
  schemaVersion: SESSION_SCHEMA_VERSION,
  status: 'in_progress',
  answers: {},
  startedAt: now,
  deadlineAt: now + EXAM_DURATION_SECONDS * 1000,
  audioPlayCount: {},
  completedAt: null,
});

const sanitizeAnswers = (value: unknown): Answers => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const answers: Answers = {};
  for (const [key, choice] of Object.entries(value as Record<string, unknown>)) {
    const id = Number(key);
    if (Number.isInteger(id) && id >= 1 && id <= TOTAL_QUESTIONS && isChoice(choice)) {
      answers[id] = choice;
    }
  }
  return answers;
};

const sanitizePlayCounts = (value: unknown) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const counts: Record<number, number> = {};
  for (const [key, count] of Object.entries(value as Record<string, unknown>)) {
    const id = Number(key);
    if (Number.isInteger(id) && id >= 1 && id <= TOTAL_QUESTIONS && typeof count === 'number' && count >= 0) {
      counts[id] = Math.floor(count);
    }
  }
  return counts;
};

/**
 * Parses stored session data defensively: corrupted JSON, older schema versions
 * and out-of-range values are rejected instead of breaking the app.
 */
export const parseStoredSession = (raw: string | null): SessionState | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed || typeof parsed !== 'object') return null;
    if (parsed.schemaVersion !== SESSION_SCHEMA_VERSION) return null;
    if (parsed.status !== 'in_progress' && parsed.status !== 'completed') return null;
    if (typeof parsed.startedAt !== 'number' || typeof parsed.deadlineAt !== 'number') return null;
    if (parsed.status === 'in_progress' && parsed.deadlineAt <= parsed.startedAt) return null;

    return {
      schemaVersion: SESSION_SCHEMA_VERSION,
      status: parsed.status,
      answers: sanitizeAnswers(parsed.answers),
      startedAt: parsed.startedAt,
      deadlineAt: parsed.deadlineAt,
      audioPlayCount: sanitizePlayCounts(parsed.audioPlayCount),
      completedAt: typeof parsed.completedAt === 'number' ? parsed.completedAt : null,
    };
  } catch {
    return null;
  }
};

export const loadSession = (storage: Storage | undefined = globalThis.localStorage): SessionState | null => {
  if (!storage) return null;
  try {
    return parseStoredSession(storage.getItem(SESSION_STORAGE_KEY));
  } catch {
    return null;
  }
};

export const saveSession = (
  session: SessionState,
  storage: Storage | undefined = globalThis.localStorage
) => {
  if (!storage) return;
  try {
    storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Storage may be unavailable (private mode, quota). The exam still works in memory.
  }
};

export const clearSession = (storage: Storage | undefined = globalThis.localStorage) => {
  if (!storage) return;
  try {
    storage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // Ignore.
  }
};