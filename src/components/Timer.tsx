import { useCallback, useMemo } from 'react';
import { Text, Box, Stack, Button, Group } from '@mantine/core';
import useTimer, { type Timer as UseTimer } from '@/hooks/useTimer';
import { addLeadingZeroes, convertElapsedTime } from '@/utils';

export interface TimerProps {
    onStart?: (start: ReturnType<UseTimer['start']>) => unknown;
    onStop?: (result: ReturnType<UseTimer['stop']>) => unknown;
    refreshRate?: number;
}

export default function Timer({ onStart, onStop, refreshRate }: TimerProps) {
    const { start, stop, elapsed } = useTimer(refreshRate);

    const handleStart = useCallback(() => {
        const startTime = start();
        typeof onStart === 'function' && onStart(startTime);
    }, [onStart, start]);

    const handleStop = useCallback(() => {
        const result = stop();
        typeof onStop === 'function' && onStop(result);
    }, [onStop, stop]);

    const output = useMemo(() => {
        const { h, m, s, ms } = convertElapsedTime(elapsed);
        return [h, m, s, ms].map((v) => addLeadingZeroes(v)).join(':');
    }, [elapsed]);

    return (
        <Stack
            p="md"
            sx={(theme) => ({
                backgroundColor: theme.colors.dark[5],
                maxWidth: 500,
                borderRadius: theme.radius.sm,
            })}
        >
            <Box
                px="lg"
                py="sm"
                sx={(theme) => ({
                    backgroundColor: theme.colors.dark[7],
                    borderRadius: theme.radius.sm,
                })}
            >
                <Text
                    align="center"
                    sx={(theme) => ({
                        fontFamily: theme.fontFamilyMonospace,
                        fontWeight: 500,
                        color: theme.colors.gray[0],
                    })}
                >
                    {output}
                </Text>
            </Box>
            <Group sx={{ justifyContent: 'space-between' }}>
                <Button size="md" onClick={handleStart} disabled={!!elapsed}>
                    Start
                </Button>
                <Button size="md" onClick={handleStop} disabled={!elapsed}>
                    Stop
                </Button>
            </Group>
        </Stack>
    );
}
