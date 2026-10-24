import type { Choice } from '../types';

type Props = {
  choice: Choice;
  text: string;
  selected: boolean;
  onSelect: (choice: Choice) => void;
  disabled?: boolean;
};

export const ChoiceCard = ({ choice, text, selected, onSelect, disabled }: Props) => (
  <button
    type="button"
    className="choice"
    aria-pressed={selected}
    aria-disabled={disabled}
    onClick={() => !disabled && onSelect(choice)}
  >
    <span className="choice__key" aria-hidden="true">
      {choice}
    </span>
    <span className="choice__text" lang="ja">
      {text}
    </span>
  </button>
);