import { useEffect, useState } from "react";

export function useDebounce<t>(value: t, delay = 500): t{
    const [debouncedValue, setDebouncedValue] = useState(value)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value)
        }, delay);

        return ()=> clearTimeout(timer)
    }, [value, delay])
    return debouncedValue
}