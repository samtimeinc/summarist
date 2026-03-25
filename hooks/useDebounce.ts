import { useEffect, useState } from "react";

// Hook captures a value (search) and releases it after a specified delay
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Set timer to update teh debounced value after the delay
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // If the value changes before 300ms, cleanup runs and kills the old timer
        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}