import { useCallback, useEffect, useRef } from 'react';

export const useDebounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300,
) => {
  const timerRef = useRef<NodeJS.Timeout>();

  const debouncedFn = useCallback(
    (...args: Parameters<T>) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        fn(...args);
      }, delay);
    },
    [fn, delay],
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return debouncedFn;
};
