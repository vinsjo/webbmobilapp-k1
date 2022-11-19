import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { isNum } from 'x-is-type';
export interface Timer {
    /**
     * Returns false if timer is already active, otherwise true
     */
    start: (startTime?: number) => void;
    /**
     * Returns false if timer is not active, otherwise true
     */
    stop: () => void;
    /**
     * Elapsed time in milliseconds
     */
    duration: number;
    /**
     * Indicates if timer is active or not (by converting elapsed time to a boolean)
     */
    active: boolean;
}

export default function useTimer(initialStart?: number, refreshRate = 10) {
    const startTime = useRef(0);
    const interval = useRef<null | number>(null);
    const [duration, setDuration] = useState(0);

    const start = useCallback<Timer['start']>(
        (start?: number) => {
            if (isNum(interval.current)) {
                window.clearInterval(interval.current);
                interval.current = null;
            }
            const now = Date.now();
            startTime.current = start || now;
            setDuration(now - startTime.current + 1);
            interval.current = window.setInterval(
                () => setDuration(Date.now() - startTime.current),
                refreshRate || 10
            );
        },
        [refreshRate]
    );

    const stop = useCallback<Timer['stop']>(() => {
        if (isNum(interval.current)) {
            window.clearInterval(interval.current);
            interval.current = null;
        }
        startTime.current = 0;
        setDuration(0);
    }, []);

    useEffect(() => {
        if (initialStart) start(initialStart);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return useMemo<Timer>(
        () => ({ start, stop, duration, active: !!duration }),
        [start, stop, duration]
    );
}
