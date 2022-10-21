import { useCallback } from 'react';
import { Text, Box, Button } from '@mantine/core';
import useTimer from '@/hooks/useTimer';

interface TimerProps {
    onStart?: (start: number | null) => unknown;
    onStop?: (stop: { start: number; end: number }) => unknown;
}

const Timer = ({ onStart, onStop }: TimerProps) => {
    const timer = useTimer();

    const handleStart = useCallback(() => {
        const start = timer.start();
        if (typeof onStart !== 'function') return;
        onStart(start);
    }, [onStart, timer.start]);

    const handleStop = useCallback(() => {
        const stop = timer.stop();
        if (typeof onStop !== 'function') return;
        onStop(stop);
    }, [onStop, timer.stop]);

    return (
        <Box>
            <Box>
                <Text>{timer.output}</Text>
            </Box>
            <Box>
                <Button size="md" onClick={handleStart}>
                    Start
                </Button>
                <Button size="md" onClick={handleStop}>
                    Stop
                </Button>
            </Box>
        </Box>
    );
};

export default Timer;
