import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
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
    const initialStartTime = useRef(initialStart);
    const startTime = useRef(0);
    const interval = useRef<null | number>(null);
    const [duration, setDuration] = useState(0);

    const clearCurrentInterval = useCallback(() => {
        if (typeof interval.current !== 'number') return;
        window.clearInterval(interval.current);
        interval.current = null;
    }, []);

    const start = useCallback<Timer['start']>(
        (start?: number) => {
            clearCurrentInterval();
            startTime.current =
                typeof start === 'number' && start > 0 ? start : Date.now();
            setDuration(1);
            interval.current = window.setInterval(
                () => setDuration(Date.now() - startTime.current),
                refreshRate || 10
            );
        },
        [clearCurrentInterval, refreshRate]
    );

    const stop = useCallback<Timer['stop']>(() => {
        clearCurrentInterval();
        startTime.current = 0;
        setDuration(0);
    }, [clearCurrentInterval]);

    useEffect(() => {
        if (typeof initialStartTime.current !== 'number') return;
        start(initialStart);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return useMemo<Timer>(
        () => ({ start, stop, duration, active: !!duration }),
        [start, stop, duration]
    );
}
