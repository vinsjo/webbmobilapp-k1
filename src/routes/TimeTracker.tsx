import { useCallback } from 'react';
import { useProjects, useTasks, useTimelogs } from '@/context/TimeTracker';
import useTimer from '@/hooks/useTimer';

import { Group, Stack, Title } from '@mantine/core';
import SelectProject from '@/components/input/SelectProject';
import TimerDisplay from '@/components/TimerDisplay';

import type { Task } from '@/utils/api/types';
import { ProjectModal, TaskModal } from '@/components/modals';
import { PlayButton } from '@/components/buttons/IconButtons';
import { FaEdit } from 'react-icons/fa';

export default function TimeTracker() {
    const { selected: selectedProject } = useProjects();
    const timelogs = useTimelogs(
        useCallback(
            ({ data, selected, setSelected, add }) => {
                return {
                    data: !selectedProject
                        ? []
                        : data.filter(
                              ({ projectId }) =>
                                  projectId === selectedProject.id
                          ),
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
                        : data.filter(
                              ({ projectId }) =>
                                  projectId === selectedProject.id
                          ),

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

    return (
        <Stack spacing="lg">
            <TimerDisplay duration={duration} />
            <Stack>
                <SelectProject />
                <Group position="center" grow>
                    <ProjectModal.Add />
                    <TaskModal.Add disabled={!selectedProject} />
                </Group>
            </Stack>

            {tasks.data.map(({ id, title }) => {
                const selected = tasks.selected?.id === id;
                return (
                    <Group
                        onClick={() => tasks.setSelected(id)}
                        key={`task-${id}`}
                        p="sm"
                        spacing="sm"
                        position="apart"
                        sx={(theme) => ({
                            backgroundColor:
                                theme.colors.gray[selected ? 7 : 9],
                            borderRadius: theme.radius.sm,
                        })}
                    >
                        <Title
                            order={4}
                            sx={(theme) => ({
                                color: theme.colors.gray[selected ? 0 : 5],
                            })}
                        >
                            {title}
                        </Title>
                        <Group>
                            <TaskModal.Edit id={id} variant="subtle" p="xs">
                                <FaEdit />
                            </TaskModal.Edit>
                            <PlayButton
                                active={selected && active}
                                onClick={() => handleClick(id)}
                            />
                        </Group>
                    </Group>
                );
            })}
        </Stack>
    );
}
