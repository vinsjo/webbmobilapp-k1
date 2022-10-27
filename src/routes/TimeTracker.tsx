import { useCallback, useMemo } from 'react';
import { useProjects, useTasks, useTimelogs } from '@/context/TimeTracker';
import useTimer from '@/hooks/useTimer';

import { Stack } from '@mantine/core';
import TaskTime from '@/components/TaskTime';
import SelectProject from '@/components/input/SelectProject';
import TimerDisplay from '@/components/TimerDisplay';

import { getNestedTasks } from '@/utils/api';

import type { Task } from '@/utils/api/types';
import { filterData } from '@/utils';

export default function TimeTracker() {
    const selectedProject = useProjects(
        useCallback(({ selected }) => selected, [])
    );
    const timelogs = useTimelogs(
        useCallback(
            ({ data, selected, setSelected, add }) => {
                return {
                    data: !selectedProject
                        ? []
                        : filterData(data, 'projectId', selectedProject.id),
                    selected,
                    setSelected,
                    add,
                };
            },
            [selectedProject]
        )
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

    const { start, stop, duration, active } = useTimer(
        timelogs.selected?.start
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
            timelogs.add,
            timelogs.setSelected,
        ]
    );

    const nestedTasks = useMemo(
        () => getNestedTasks(tasks.data, timelogs.data),
        [tasks, timelogs]
    );

    return (
        <Stack spacing="md">
            <Stack>
                <SelectProject />
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
                        duration={!selected ? 0 : duration}
                    />
                );
            })}
        </Stack>
    );
}
