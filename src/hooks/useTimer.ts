import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import dayjs, { type Dayjs } from 'dayjs';
import { isNum } from 'x-is-type/callbacks';

export default function useTimer(refreshRate = 200) {
    const [startTime, setStartTime] = useState<Dayjs | null>(null);
    const [currentTime, setCurrentTime] = useState<Dayjs | null>(null);

    const elapsed = useMemo(() => {
        return dayjs.isDayjs(startTime) && dayjs.isDayjs(currentTime)
            ? currentTime.diff(startTime)
            : 0;
    }, [startTime, currentTime]);

    const interval = useRef<number>(0);

    const stop = useCallback(() => {
        if (!interval.current) return;
        window.clearInterval(interval.current);
        interval.current = 0;
    }, []);

    const start = useCallback(() => {
        if (interval.current) return;
        setStartTime(dayjs());
        interval.current = window.setInterval(
            () => setCurrentTime(dayjs()),
            refreshRate
        );
    }, [refreshRate]);

    const toggle = useCallback(() => {
        interval.current ? stop() : start();
    }, []);

    const output = useMemo(() => {
        if (!elapsed) return '00:00:00';
        return dayjs(elapsed).format('HH:mm:ss');
    }, [elapsed]);

    return useMemo(
        () => ({ output, start, stop, toggle }),
        [output, start, stop, toggle]
    );
}
