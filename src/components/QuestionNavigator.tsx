import type { Answers } from '../types';

type Props = {
  total: number;
  current: number;
  answers: Answers;
  audioQuestions: Set<number>;
  onSelect: (index: number) => void;
  open: boolean;
};

export const QuestionNavigator = ({
  total,
  current,
  answers,
  audioQuestions,
  onSelect,
  open,
}: Props) => (
  <nav
    id="question-list"
    className={`exam__sidebar${open ? ' exam__sidebar--open' : ''}`}
    aria-label="Navigasi nomor soal"
  >
      <h2>Daftar soal</h2>
      <div className="number-grid">
        {Array.from({ length: total }, (_, index) => {
          const id = index + 1;
          const isAnswered = answers[id] != null;
          const isCurrent = id === current;
          return (
            <button
              key={id}
              type="button"
              className={[
                'number-btn',
                isAnswered ? 'number-btn--answered' : '',
                isCurrent ? 'number-btn--current' : '',
                audioQuestions.has(id) ? 'number-btn--audio-pending' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-current={isCurrent ? 'true' : undefined}
              aria-label={`Soal ${id}${isAnswered ? ', sudah dijawab' : ', belum dijawab'}`}
              onClick={() => onSelect(index)}
            >
              {id}
            </button>
          );
        })}
      </div>
      <div className="number-legend">
        <span>
          <span className="swatch swatch--answered" aria-hidden="true" /> Dijawab
        </span>
        <span>
                  <span className="swatch" aria-hidden="true" /> Belum
                </span>
              </div>
            </nav>
        );