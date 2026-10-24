import { useCallback, useEffect, useState } from 'react';
import { Exam } from './pages/Exam';
import { Landing } from './pages/Landing';
import { Results } from './pages/Results';
import { Review } from './pages/Review';
import { clearSession, createSession, loadSession, saveSession } from './lib/persistence';
import { scoreAnswers } from './lib/score';
import { useCountdown } from './lib/timer';
import { questions } from './lib/data';
import type { Choice, SessionState } from './types';

type Route = 'home' | 'exam' | 'results' | 'review';

type Boot = { session: SessionState | null; expired: boolean };

let bootCache: Boot | null = null;

/** Loads the stored session once and auto-completes it if the deadline passed. */
const loadBoot = (): Boot => {
  if (bootCache) return bootCache;
  const stored = loadSession();
  if (stored && stored.status === 'in_progress' && stored.deadlineAt <= Date.now()) {
    const completed: SessionState = {
      ...stored,
      status: 'completed',
      completedAt: stored.deadlineAt,
    };
    saveSession(completed);
    bootCache = { session: completed, expired: true };
    return bootCache;
  }
  bootCache = { session: stored, expired: false };
  return bootCache;
};

export default function App() {
  const [session, setSession] = useState<SessionState | null>(() => loadBoot().session);
  const [route, setRoute] = useState<Route>(() => (loadBoot().expired ? 'results' : 'home'));
  const [index, setIndex] = useState(0);

  const persist = useCallback((next: SessionState) => {
    saveSession(next);
    setSession(next);
  }, []);

  const finish = useCallback(
    (reason: 'manual' | 'timeout') => {
      setSession((current) => {
        if (!current || current.status === 'completed') return current;
        const completed: SessionState = {
          ...current,
          status: 'completed',
          completedAt: reason === 'timeout' ? current.deadlineAt : Date.now(),
        };
        saveSession(completed);
        return completed;
      });
      setRoute('results');
        window.scrollTo({ top: 0 });
      },
      []
    );

  const remainingMs = useCountdown(session?.status === 'in_progress' ? session.deadlineAt : null, () => {
    finish('timeout');
  });

  // If the tab was away long enough for the deadline to pass, finish on return.
  useEffect(() => {
    if (session?.status !== 'in_progress') return;
    if (session.deadlineAt > Date.now()) return;
    finish('timeout');
  }, [session, finish]);

  const start = () => {
    const fresh = createSession();
    persist(fresh);
    setIndex(0);
    setRoute('exam');
    window.scrollTo({ top: 0 });
  };

  const reset = () => {
    clearSession();
    start();
  };

  const answer = (questionId: number, choice: Choice) => {
    if (!session || session.status !== 'in_progress') return;
    persist({ ...session, answers: { ...session.answers, [questionId]: choice } });
  };

  const audioPlay = (questionId: number) => {
    if (!session || session.status !== 'in_progress') return;
    const current = session.audioPlayCount[questionId] ?? 0;
    persist({
      ...session,
      audioPlayCount: { ...session.audioPlayCount, [questionId]: current + 1 },
    });
  };

  const examine = () => {
    if (!session) {
      start();
      return;
    }
    if (session.status === 'completed') {
      setRoute('results');
      return;
    }
    setRoute('exam');
    setIndex((current) => Math.min(current, questions.length - 1));
    window.scrollTo({ top: 0 });
  };

  const retry = () => {
    clearSession();
    const fresh = createSession();
    persist(fresh);
    setIndex(0);
    setRoute('exam');
    window.scrollTo({ top: 0 });
  };

  const score = scoreAnswers(questions, session?.answers ?? {});
    const examIndex = Math.min(index, questions.length - 1);

    useEffect(() => {
      // A finished session should never be reachable through the exam screen.
      if (route === 'exam' && session?.status === 'completed') setRoute('results');
    }, [route, session?.status]);

  if (route === 'exam' && session) {
    return (
      <Exam
        session={session}
        index={examIndex}
        remainingMs={remainingMs}
        onAnswer={answer}
        onAudioPlay={audioPlay}
        onNavigate={setIndex}
        onFinish={() => finish('manual')}
        onExit={() => {
          setRoute('home');
          window.scrollTo({ top: 0 });
        }}
      />
    );
  }

  if (route === 'results' && session) {
    return (
      <Results
        session={session}
        score={score}
        onReview={() => setRoute('review')}
        onRetry={retry}
        onHome={() => setRoute('home')}
      />
    );
  }

  if (route === 'review' && session) {
    return <Review session={session} score={score} onBack={() => setRoute('results')} onRetry={retry} />;
  }

  return (
    <Landing
      session={session}
      onStart={start}
      onResume={examine}
      onReset={reset}
      onOpenResults={() => setRoute('results')}
    />
  );
}