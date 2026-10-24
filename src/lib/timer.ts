import { useEffect, useRef, useState } from 'react';

/**
 * Countdown driven by an absolute deadline so refreshes and tab changes
 * cannot rewind or reset the remaining time.
 */
export const useCountdown = (deadlineAt: number | null, onExpire: () => void) => {
  const [remainingMs, setRemainingMs] = useState(() =>
    deadlineAt == null ? 0 : Math.max(0, deadlineAt - Date.now())
  );
  const expiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    expiredRef.current = false;
    if (deadlineAt == null) {
      setRemainingMs(0);
      return;
    }

    const tick = () => {
      const remaining = Math.max(0, deadlineAt - Date.now());
      setRemainingMs(remaining);
      if (remaining <= 0 && !expiredRef.current) {
        expiredRef.current = true;
        onExpireRef.current();
      }
    };

    tick();
    const interval = window.setInterval(tick, 1000);
    const handleVisibility = () => tick();
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [deadlineAt]);

  return remainingMs;
};