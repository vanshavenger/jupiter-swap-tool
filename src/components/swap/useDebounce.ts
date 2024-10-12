import { useCallback, useRef } from "react";

export const useDebounce = <T extends unknown[]>(
  func: (...args: T) => void,
  wait: number,
) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: T) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => func(...args), wait);
    },
    [func, wait],
  );
};
