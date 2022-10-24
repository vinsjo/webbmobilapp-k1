import { useCallback, useEffect, useMemo, useState } from 'react';
import useTimer from '@/hooks/useTimer';
import { Task, Timelog } from '@/utils/api/types';
import { ActionIcon, Group, Text, useMantineTheme } from '@mantine/core';
import { FaPlay, FaStop } from 'react-icons/fa';
import { addLeadingZeroes, convertElapsedTime } from '@/utils';

export interface Props {
    task: Task;
    timelogs: Timelog[];
    selected?: boolean;
    onStart?: (id: Task['id']) => void;
    onStop?: (id: Task['id']) => void;
}

export default function TaskTime({
    task,
    timelogs,
    onStart,
    onStop,
    selected,
}: Props) {
    const theme = useMantineTheme();
    const { start, stop, elapsed, active } = useTimer();
    const [output, setOutput] = useState('');

    const timelogsElapsed = useMemo(
        () =>
            timelogs
                .filter(({ taskId, end }) => taskId === task.id && end)
                .reduce((sum, { start, end }) => {
                    return !start || !end ? sum : sum + (end - start);
                }, 0),
        [timelogs, task.id]
    );

    const colors = useMemo(
        () => ({
            background: theme.colors.gray[selected ? 7 : 9],
            text: theme.colors.gray[selected ? 0 : 5],
        }),
        [selected, theme]
    );

    const handleStart = useCallback(() => {
        if (typeof onStart !== 'function') return;
        start();
        onStart(task.id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [start, onStart, task.id]);

    const handleStop = useCallback(() => {
        if (typeof onStop !== 'function') return;
        stop();
        onStop(task.id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stop, onStop, task.id]);

    useEffect(() => {
        if (!selected) stop();
    }, [selected, stop]);

    useEffect(() => {
        const { h, m, s } = convertElapsedTime(
            Math.round(timelogsElapsed + elapsed)
        );
        setOutput([h, m, s].map((v) => addLeadingZeroes(v)).join(':'));
    }, [timelogsElapsed, elapsed]);

    return (
        <Group
            p="sm"
            spacing="sm"
            sx={{
                backgroundColor: colors.background,
                borderRadius: theme.radius.sm,
                justifyContent: 'space-between',
            }}
        >
            <Text
                sx={{
                    color: colors.text,
                }}
            >
                {task.title}
            </Text>
            <Text
                sx={{
                    fontFamily: theme.fontFamilyMonospace,
                    marginLeft: 'auto',
                    color: colors.text,
                }}
            >
                {output}
            </Text>
            <ActionIcon onClick={active ? handleStop : handleStart}>
                {active ? <FaStop /> : <FaPlay />}
            </ActionIcon>
        </Group>
    );
}
