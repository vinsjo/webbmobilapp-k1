import { useCallback, useMemo } from 'react';
import { Task, Timelog } from '@/utils/api/types';
import { ActionIcon, Group, Text, Title, useMantineTheme } from '@mantine/core';
import { FaPlay, FaStop } from 'react-icons/fa';
import { getTotalDuration } from '@/utils/api';
import useDurationOutput from '@/hooks/useDurationOutput';

export interface Props {
    task: Task;
    /** Array of Timelog objects, expected to be only the ones that belongs to this task */
    timelogs: Timelog[];
    /** Indicates if this TaskTime component represents the currently selected task */
    selected?: boolean;
    onClick?: (id: Task['id']) => unknown;
    /** Executed when start button is clicked */
    onStart?: (id: Task['id']) => unknown;
    /** Executed when stop button is clicked */
    onStop?: (id: Task['id']) => unknown;
    currentDuration?: number;
}

export default function TaskTime({
    task,
    timelogs,
    onClick,
    selected,
    currentDuration = 0,
}: Props) {
    const theme = useMantineTheme();
    const storedDuration = useMemo(
        () => getTotalDuration(timelogs),
        [timelogs]
    );

    const durationOutput = useDurationOutput(currentDuration + storedDuration);

    const colors = useMemo(
        () => ({
            background: theme.colors.gray[selected ? 7 : 9],
            text: theme.colors.gray[selected ? 0 : 5],
        }),
        [selected, theme]
    );

    const active = useMemo(() => !!currentDuration, [currentDuration]);

    const handleClick = useCallback(() => {
        typeof onClick === 'function' && onClick(task.id);
    }, [onClick, task.id]);

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
            <Title
                order={4}
                sx={{
                    color: colors.text,
                }}
            >
                {task.title}
            </Title>
            <Text
                sx={{
                    fontFamily: theme.fontFamilyMonospace,
                    marginLeft: 'auto',
                    color: colors.text,
                    fontSize: theme.fontSizes.sm,
                }}
            >
                {durationOutput}
            </Text>
            <ActionIcon onClick={handleClick}>
                {active ? <FaStop /> : <FaPlay />}
            </ActionIcon>
        </Group>
    );
}
