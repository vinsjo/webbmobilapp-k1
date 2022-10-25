import { useState, useEffect, useMemo } from 'react';
import { formatDuration } from '@/utils';

export default function useDurationOutput(
    milliseconds: number,
    format = 'HH:mm:ss',
    ignoreMilliseconds = true
) {
    const ms = useMemo(() => {
        return ignoreMilliseconds && milliseconds
            ? Math.floor(milliseconds / 1000) * 1000
            : milliseconds;
    }, [milliseconds, ignoreMilliseconds]);

    const [output, setOutput] = useState(formatDuration(ms));

    useEffect(() => {
        setOutput(formatDuration(ms, format));
    }, [ms, format]);

    return output;
}
