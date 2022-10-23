import { useCallback } from 'react';
import { Text, Box, Button } from '@mantine/core';
import useTimer, { type Timer as UseTimer } from '@/hooks/useTimer';

export interface TimerProps {
    onStart?: (start: ReturnType<UseTimer['start']>) => unknown;
    onStop?: (result: ReturnType<UseTimer['stop']>) => unknown;
    refreshRate?: number;
}

const Timer = ({ onStart, onStop, refreshRate }: TimerProps) => {
    const { start, stop, output } = useTimer(refreshRate);

    const handleStart = useCallback(() => {
        const startTime = start();
        typeof onStart === 'function' && onStart(startTime);
    }, [onStart, start]);

    const handleStop = useCallback(() => {
        const result = stop();
        typeof onStop === 'function' && onStop(result);
    }, [onStop, stop]);

    return (
        <Box>
            <Box>
                <Text>{output}</Text>
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
