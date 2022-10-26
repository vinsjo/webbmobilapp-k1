import { useCallback, useMemo } from 'react';
import { useProjects, useTasks, useTimelogs } from '@/context/TimeTracker';
import useTimer from '@/hooks/useTimer';

import { Stack } from '@mantine/core';
import TaskTime from '@/components/TaskTime';
import ProjectSelect from '@/components/ProjectSelect';
import TimerDisplay from '@/components/TimerDisplay';

import { getNestedTasks } from '@/utils/api';

import type { Task } from '@/utils/api/types';
import { filterData } from '@/utils';

export default function TimeTracker() {
    const selectedProject = useProjects(
        useCallback(({ selected }) => {
            return selected;
        }, [])
    );
    const tasks = useTasks(
        useCallback(
            ({ data, selected, setSelected }) => {
                return {
                    data: !selectedProject
                        ? []
                        : filterData(data, 'projectId', selectedProject.id),
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
                    data: !selectedProject
                        ? []
                        : filterData(data, 'projectId', selectedProject.id),
                    selected,
                    setSelected,
                    add,
                    update,
                };
            },
            [selectedProject]
        )
    );

    const { start, stop, duration, active } = useTimer(
        timelogs.selected?.start
    );

    const nestedTasks = useMemo(
        () => getNestedTasks(tasks.data, timelogs.data),
        [tasks.data, timelogs.data]
    );

    const handleClick = useCallback(
        async (id: Task['id']) => {
            if (!selectedProject) return;
            if (tasks.selected?.id === id && active) {
                await timelogs.setSelected(null);
                stop();
                return;
            }
            await tasks.setSelected(id);
            const added = await timelogs.add({
                projectId: selectedProject.id,
                taskId: id,
                start: Date.now(),
                end: 0,
            });
            if (!added) return;
            await timelogs.setSelected(added.id);
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
            timelogs.setSelected,
            timelogs.update,
            timelogs.add,
        ]
    );

    return (
        <Stack spacing="md">
            <Stack>
                <ProjectSelect />
            </Stack>
            <TimerDisplay mx="auto" duration={duration} />
            {nestedTasks.map(({ timelogs, ...task }) => {
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
