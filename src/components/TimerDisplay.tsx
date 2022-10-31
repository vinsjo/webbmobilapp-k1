import { useTasks, useTimelogs } from '@/context/TimeTracker';
import { getTotalDuration } from '@/utils/api';
import {
    Center,
    MantineNumberSize,
    Stack,
    Text,
    type CenterProps,
} from '@mantine/core';
import dayjs from 'dayjs';
import { useCallback, useMemo } from 'react';
import DurationOutput from './DurationOutput';

interface Props extends Omit<CenterProps, 'children'> {
    duration: number;
    maxWidth?: string | number;
    textSize?: MantineNumberSize;
    active?: boolean;
}

export default function TimerDisplay({ duration, maxWidth, ...props }: Props) {
    const { selected } = useTasks();
    const timelogs = useTimelogs(
        useCallback(
            ({ data }) =>
                !selected
                    ? []
                    : data.filter(({ taskId }) => taskId === selected.id),

            [selected]
        )
    );
    const active = useMemo(
        () => !!selected && !!duration,
        [selected, duration]
    );

    const storedDuration = useMemo(
        () => getTotalDuration(timelogs),
        [timelogs]
    );

    const todaysDuration = useMemo(() => {
        const today = dayjs();
        return getTotalDuration(
            timelogs.filter(({ start }) => dayjs(start).isSame(today, 'date'))
        );
    }, [timelogs]);

    return (
        <Stack
            p="md"
            sx={(theme) => ({
                backgroundColor: theme.colors.dark[9],
                width: '100%',
                maxWidth,
                borderRadius: theme.radius.md,
            })}
            {...props}
        >
            <Text
                size={'lg'}
                sx={(theme) => ({
                    fontFamily: theme.fontFamilyMonospace,
                    fontWeight: 800,
                    color: theme.colors.gray[!active ? 8 : 0],
                    transition: 'color 0.1s ease',
                })}
            >
                <DurationOutput duration={!active ? null : duration} />
            </Text>
        </Stack>
    );
}
