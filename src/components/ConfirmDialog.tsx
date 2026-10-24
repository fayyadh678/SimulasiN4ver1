import { useEffect, useRef } from 'react';

type Props = {
  open: boolean;
  title: string;
  children: React.ReactNode;
  actions: React.ReactNode;
  onClose: () => void;
};

export const ConfirmDialog = ({ open, title, children, actions, onClose }: Props) => {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    panelRef.current?.querySelector<HTMLElement>('button')?.focus();
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="dialog-backdrop" role="presentation" onClick={onClose}>
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        ref={panelRef}
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="dialog-title">{title}</h2>
        <div className="muted small">{children}</div>
        <div className="dialog__actions">{actions}</div>
      </div>
    </div>
  );
};