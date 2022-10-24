import { useState, useMemo, useCallback, useRef } from 'react';

export interface TimerResult {
    /**
     * unix timestamp from when timer is started, or 0 if timer is not active
     */
    start: number;
    /**
     * unix timestamp from when timer is stopped, or 0 if timer is not active
     */
    end: number;
}
export interface Timer {
    /**
     * Returns 0 if timer is already active, otherwise unix timestamp at time of
     * execution
     */
    start: () => number;
    stop: () => TimerResult;
    /** Elapsed time in milliseconds */
    elapsed: number;
    active: boolean;
}

export default function useTimer(refreshRate = 10) {
    const startTime = useRef(0);
    const interval = useRef(0);
    const [elapsed, setElapsed] = useState(0);

    const start = useCallback<Timer['start']>(() => {
        if (interval.current) return 0;
        startTime.current = Date.now();
        setElapsed(1);
        interval.current = window.setInterval(
            () => setElapsed(Date.now() - startTime.current),
            refreshRate || 10
        );
        return startTime.current;
    }, [refreshRate]);

    const stop = useCallback<Timer['stop']>(() => {
        if (!interval.current || !startTime.current) {
            return { start: 0, end: 0, elapsed: 0 };
        }
        const start = startTime.current;
        const end = Date.now();
        window.clearInterval(interval.current);
        interval.current = 0;
        startTime.current = 0;
        setElapsed(0);
        return { start, end };
    }, []);

    return useMemo<Timer>(
        () => ({ start, stop, elapsed, active: !!elapsed }),
        [start, stop, elapsed]
    );
}
