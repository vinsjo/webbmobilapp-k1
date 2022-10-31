import { useProjects, useTasks, useTimelogs } from '@/context/TimeTracker';
import { getTotalDuration, Colors } from '@/utils/api';
import { OmitProps } from '@/utils/type-utils';
import {
    Group,
    MantineNumberSize,
    Stack,
    CSSObject,
    Text,
    type CenterProps,
} from '@mantine/core';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import DurationOutput from './DurationOutput';

function TimerText({
    children,
    sx,
    size,
    hidden,
    active,
    ...props
}: OmitProps<typeof Text<'div'>, 'sx'> & {
    sx?: CSSObject;
    hidden?: boolean;
    active?: boolean;
}) {
    return (
        <Text
            size={size || 'xs'}
            sx={(theme) => ({
                fontFamily: theme.fontFamilyMonospace,
                color: active ? 'white' : theme.colors.gray[4],
                transition: 'color 0.1s ease',
                minHeight: theme.fontSizes.xs,
                userSelect: 'none',
                visibility: hidden ? 'hidden' : 'visible',
                ...(sx || {}),
            })}
            {...props}
        >
            {children}
        </Text>
    );
}

interface Props extends Omit<CenterProps, 'children'> {
    duration: number;
    maxWidth?: string | number;
    textSize?: MantineNumberSize;
    active?: boolean;
}

export default function TimerDisplay({ duration, maxWidth, ...props }: Props) {
    const { selected: selectedProject } = useProjects();
    const { selected: selectedTask } = useTasks();
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
            py="lg"
            px="md"
            spacing="lg"
            sx={(theme) => ({
                backgroundColor: !selectedProject?.color
                    ? theme.colors.dark[9]
                    : Colors[selectedProject.color],
                width: '100%',
                maxWidth,
                borderRadius: theme.radius.md,
            })}
            {...props}
        >
            <Group position="apart">
                <TimerText active={active} hidden={!selectedTask}>
                    Task: {selectedTask?.title}
                </TimerText>
                <TimerText active={active} hidden={!selectedProject}>
                    Project: {selectedProject?.name}
                </TimerText>
            </Group>

            <TimerText
                size="lg"
                align="center"
                my="lg"
                sx={{ fontWeight: 800 }}
            >
                <DurationOutput duration={!active ? null : duration} />
            </TimerText>

            <Group position="apart">
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
