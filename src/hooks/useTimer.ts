import { useState, useMemo, useCallback, useRef } from 'react';
import { addLeadingZeroes, convertElapsedTime } from '@/utils';

export default function useTimer(refreshRate = 500) {
    const startTime = useRef(0);
    const interval = useRef(0);
    const [elapsed, setElapsed] = useState(0);

    const start = useCallback(() => {
        if (interval.current) return 0;
        if (!startTime.current) startTime.current = Date.now();
        interval.current = window.setInterval(
            () => setElapsed(Date.now() - startTime.current),
            refreshRate
        );
        return startTime.current;
    }, [refreshRate]);

    const stop = useCallback(() => {
        if (!interval.current || !startTime.current) {
            return { start: 0, end: 0 };
        }
        window.clearInterval(interval.current);
        const output = { start: startTime.current, end: Date.now() };
        interval.current = 0;
        startTime.current = 0;
        setElapsed(0);
        return output;
    }, []);

    const output = useMemo(() => {
        const { h, m, s } = convertElapsedTime(elapsed);
        return [h, m, s].map((v) => addLeadingZeroes(v, 2)).join(':');
    }, [elapsed]);

    return useMemo(() => ({ output, start, stop }), [output, start, stop]);
}
