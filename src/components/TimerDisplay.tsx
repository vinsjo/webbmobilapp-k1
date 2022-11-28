import {
    useProjects,
    useTasks,
    useTimelogs,
} from '@/context/TimeTrackerContext';
import { getTotalDuration } from '@/utils/api';
import {
    Group,
    MantineNumberSize,
    Stack,
    type CenterProps,
} from '@mantine/core';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import DurationOutput from './DurationOutput';
import TimerText from './TimerText';

interface Props extends Omit<CenterProps, 'children'> {
    duration: number;
    maxWidth?: string | number;
    textSize?: MantineNumberSize;
    active?: boolean;
}

export default function TimerDisplay({ duration, maxWidth, ...props }: Props) {
    const { current: selectedProject } = useProjects();
    const { current: selectedTask } = useTasks();
    const timelogs = useTimelogs(
        useCallback(
            ({ data }) =>
                !selectedTask
                    ? []
                    : data.filter(({ taskId }) => taskId === selectedTask.id),

            [selectedTask]
        )
    );
    const [today, setToday] = useState(dayjs().format('YYYY-MM-DD'));

    const active = useMemo(
        () => !!selectedTask && !!duration,
        [selectedTask, duration]
    );

    const storedDuration = useMemo(
        () => getTotalDuration(timelogs),
        [timelogs]
    );

    const todaysDuration = useMemo(() => {
        return getTotalDuration(
            timelogs.filter(({ start }) => dayjs(start).isSame(today, 'date'))
        );
    }, [timelogs, today]);

    useEffect(() => {
        const interval = setInterval(() => {
            setToday(dayjs().format('YYYY-MM-DD'));
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Stack
            py='lg'
            px='md'
            spacing='lg'
            sx={(theme) => ({
                backgroundColor: !selectedProject
                    ? theme.colors.dark[9]
                    : selectedProject.color,
                width: '100%',
                maxWidth,
                borderRadius: theme.radius.md,
            })}
            {...props}
        >
            <Group position='apart'>
                <TimerText active={active} hidden={!selectedProject}>
                    Project: {selectedProject?.name}
                </TimerText>
                <TimerText active={active} hidden={!selectedTask}>
                    Task: {selectedTask?.title}
                </TimerText>
            </Group>

            <TimerText size='lg' align='center' my='lg' fontWeight={800}>
                <DurationOutput duration={!active ? null : duration} />
            </TimerText>

            <Group position='apart'>
                <TimerText active={active} hidden={!selectedTask}>
                    Today:{' '}
                    <DurationOutput duration={todaysDuration + duration} />
                </TimerText>
                <TimerText active={active} hidden={!selectedTask}>
                    Total:{' '}
                    <DurationOutput duration={storedDuration + duration} />
                </TimerText>
            </Group>
        </Stack>
    );
}
