import type { Choice } from '../types';

type Props = {
  choice: Choice;
  src: string;
  selected: boolean;
  onSelect: (choice: Choice) => void;
  alt: string;
};

export const ImageChoiceCard = ({ choice, src, selected, onSelect, alt }: Props) => (
  <button
    type="button"
    className="image-choice"
    aria-pressed={selected}
    aria-label={`Pilihan ${choice}`}
    onClick={() => onSelect(choice)}
  >
    <img src={src} alt={alt} loading="lazy" />
    <span className="image-choice__label">
      <span className="image-choice__key" aria-hidden="true">
        {choice}
      </span>
      Pilihan {choice}
    </span>
  </button>
);