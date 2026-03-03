export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = require("react").useState(value);

  require("react").useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
