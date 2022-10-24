import { useCallback, useMemo } from 'react';
import { useProjects, useTasks, useTimelogs } from '@/context/TimeTracker';
import { Text, Stack } from '@mantine/core';
import TaskTime from '@/components/TaskTime';
import type { Task } from '@/utils/api/types';

export default function Timer() {
    const projects = useProjects();
    const tasks = useTasks();
    const timelogs = useTimelogs();

    const filteredTasks = useMemo(
        () =>
            tasks.data
                .filter(({ projectId }) => projectId === projects.selected?.id)
                .map((task) => {
                    return {
                        task,
                        timelogs: timelogs.data.filter(
                            ({ taskId }) => taskId === task.id
                        ),
                    };
                }),
        [projects.selected?.id, tasks.data, timelogs.data]
    );

    const handleStart = useCallback(
        (id: Task['id']) => {
            if (!projects.selected) return;
            if (tasks.selected?.id !== id) tasks.setSelected(id);
            timelogs
                .add({
                    projectId: projects.selected.id,
                    taskId: id,
                    start: Date.now(),
                    end: null,
                })
                .then((added) => {
                    if (!added) return;
                    timelogs.setSelected(added.id);
                });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            tasks.setSelected,
            tasks.selected,
            timelogs.setSelected,
            projects.selected,
        ]
    );

    const handleStop = useCallback(() => {
        if (!timelogs.selected || timelogs.selected.end) return;
        timelogs.update(timelogs.selected.id, { end: Date.now() });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timelogs.selected, timelogs.update]);

    return (
        <Stack sx={(theme) => ({ gap: theme.spacing.md })}>
            <Text>
                {!projects.selected
                    ? 'No project selected...'
                    : `Selected project: ${projects.selected.name}`}
            </Text>

            {filteredTasks.map(({ task, timelogs }) => {
                return (
                    <TaskTime
                        key={`task-${task.id}`}
                        task={task}
                        timelogs={timelogs}
                        selected={tasks.selected?.id === task.id}
                        onStart={handleStart}
                        onStop={handleStop}
                    />
                );
            })}
        </Stack>
    );
}
