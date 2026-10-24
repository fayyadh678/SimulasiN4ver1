type Props = {
  current: number;
  total: number;
  remainingMs: number;
  answered: number;
};

const formatClock = (ms: number) => {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (value: number) => String(value).padStart(2, '0');
  return hours > 0
    ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`;
};

export const ExamHeader = ({ current, total, remainingMs, answered }: Props) => {
  const low = remainingMs <= 5 * 60 * 1000;
  return (
    <header className="exam__bar">
      <div className="exam__bar-inner">
        <span className="exam__logo">JLPT N4 · Version 2</span>
        <span className="exam__progress">
          {current}/{total} · {answered} dijawab
        </span>
        <span
          className={`exam__timer${low ? ' exam__timer--low' : ''}`}
          role="timer"
          aria-live={low ? 'polite' : 'off'}
          aria-label={`Sisa waktu ${formatClock(remainingMs)}`}
        >
          ⏱ {formatClock(remainingMs)}
        </span>
      </div>
    </header>
  );
};