import { useCallback, useMemo } from 'react';
import { useProjects, useTasks, useTimelogs } from '@/context/TimeTracker';
import { Text, Stack } from '@mantine/core';
import TaskTime from '@/components/TaskTime';
import type { Task, Timelog } from '@/utils/api/types';
import { timelogsTotalDuration } from '@/utils';
import useTimer from '@/hooks/useTimer';
import useDurationOutput from '@/hooks/useDurationOutput';

export default function ProjectTimer() {
    const { start, stop, duration, active } = useTimer();
    const selectedProject = useProjects(
        useCallback(({ selected }) => {
            return selected;
        }, [])
    );
    const tasks = useTasks(
        useCallback(
            ({ data, selected, setSelected }) => {
                return {
                    data: data.filter(
                        ({ projectId }) => projectId === selectedProject?.id
                    ),
                    selected,
                    setSelected,
                };
            },
            [selectedProject]
        )
    );
    const timelogs = useTimelogs(
        useCallback(
            ({ data, selected, setSelected, add, update }) => {
                return {
                    data: data.filter(
                        ({ projectId }) => projectId === selectedProject?.id
                    ),
                    selected,
                    setSelected,
                    add,
                    update,
                };
            },
            [selectedProject]
        )
    );

    const tasksWithTimelogs = useMemo<{ task: Task; timelogs: Timelog[] }[]>(
        () =>
            tasks.data.map((task) => {
                return {
                    task,
                    timelogs: timelogs.data.filter(
                        ({ taskId }) => taskId === task.id
                    ),
                };
            }),
        [tasks.data, timelogs.data]
    );

    const projectStoredDuration = useMemo(
        () => timelogsTotalDuration(timelogs.data),
        [timelogs.data]
    );

    const projectDurationOutput = useDurationOutput(
        projectStoredDuration + duration
    );

    const handleClick = useCallback(
        async (id: Task['id']) => {
            if (!selectedProject) return;
            console.log('tasks.selected?.id: ', tasks.selected?.id);
            console.log('id: ', id);
            const s = timelogs.selected;
            if (active && s && !s.end) {
                await timelogs.update(s.id, { end: Date.now() });
            }
            if (tasks.selected?.id === id && active) {
                console.log('stopping');
                stop();
                return;
            }
            tasks.setSelected(id);
            const added = await timelogs.add({
                projectId: selectedProject.id,
                taskId: id,
                start: Date.now(),
                end: null,
            });
            if (!added) return stop();
            timelogs.setSelected(added.id);
            start();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            selectedProject,
            active,
            start,
            stop,
            tasks.selected,
            tasks.setSelected,
            timelogs.selected,
            timelogs.update,
            timelogs.add,
        ]
    );

    return (
        <Stack spacing="md">
            <Stack>
                {!selectedProject ? (
                    <Text>No project selected...</Text>
                ) : (
                    <>
                        <Text>Selected Project: {selectedProject.name}</Text>
                        <Text>
                            Total time spent on project: {projectDurationOutput}
                        </Text>
                    </>
                )}
            </Stack>

            {tasksWithTimelogs.map(({ task, timelogs }) => {
                const selected = tasks.selected?.id === task.id;
                return (
                    <TaskTime
                        key={`task-${task.id}`}
                        task={task}
                        timelogs={timelogs}
                        selected={selected}
                        onClick={handleClick}
                        currentDuration={!selected ? 0 : duration}
                    />
                );
            })}
        </Stack>
    );
}
