import { useState, useEffect, useMemo } from 'react';
import { formatDuration } from '@/utils';

interface Props {
    duration: number | null;
}

export default function DurationOutput({ duration }: Props) {
    const ms = useMemo(() => {
        if (typeof duration !== 'number') return null;
        if (duration <= 0) return 0;
        return Math.floor(duration / 1000) * 1000;
    }, [duration]);

    const [output, setOutput] = useState(formatDuration(ms));

    useEffect(() => {
        setOutput(formatDuration(ms));
    }, [ms]);

    return <>{output}</>;
}
