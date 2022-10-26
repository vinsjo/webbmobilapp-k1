import { useState, useEffect, useMemo } from 'react';
import { formatDuration } from '@/utils';

interface Props {
    duration: number;
    format?: string;
}

export default function DurationOutput({ duration, format }: Props) {
    const ignoreMilliseconds = useMemo(
        () => typeof format === 'string' && !/SS/.test(format),
        [format]
    );
    const ms = useMemo(() => {
        if (!duration) return 0;
        return !ignoreMilliseconds
            ? duration
            : Math.floor(duration / 1000) * 1000;
    }, [duration, ignoreMilliseconds]);

    const [output, setOutput] = useState(formatDuration(ms, format));

    useEffect(() => {
        setOutput(formatDuration(ms, format));
    }, [ms, format]);

    return <>{output}</>;
}
