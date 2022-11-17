import { useCallback, useEffect, useRef } from 'react';
import { useProjects, useTasks, useTimelogs } from '@/context/TimeTracker';
import useTimer from '@/hooks/useTimer';

import { Group, Stack, Title } from '@mantine/core';
import SelectProject from '@/components/input/SelectProject';
import TimerDisplay from '@/components/TimerDisplay';

import { ProjectModal, TaskModal } from '@/components/modals';
import { PlayButton } from '@/components/buttons/IconButtons';
import { FaEdit } from 'react-icons/fa';
import { useUsers } from '@/context/TimeTracker/hooks';

export default function TimeTracker() {
    const { current: selectedUser } = useUsers();
    const { current: selectedProject } = useProjects();
    const {
        current: selectedTimelog,
        setCurrent: setSelectedTimelog,
        add: addTimelog,
    } = useTimelogs();
    const { tasks, selectedTask, setSelectedTask } = useTasks(
        useCallback(
            ({ data, current: selected, setCurrent: setSelected }) => {
                return {
                    tasks: !selectedProject
                        ? []
                        : data.filter(
                              ({ projectId }) =>
                                  projectId === selectedProject.id
                          ),

                    selectedTask: selected,
                    setSelectedTask: setSelected,
                };
            },
            [selectedProject]
        )
    );

    const prevTask = useRef(selectedTask);

    const { start, stop, duration, active } = useTimer(selectedTimelog?.start);

    const handleClick = useCallback(
        async (id: Task['id']) => {
            if (!selectedUser || !selectedProject) return;
            if (selectedTask?.id === id && active) {
                await setSelectedTimelog(null);
                stop();
                return;
            }
            await setSelectedTask(id);
            const added = await addTimelog({
                userId: selectedUser.id,
                projectId: selectedProject.id,
                taskId: id,
                start: Date.now(),
                end: 0,
            });
            if (!added) return;
            await setSelectedTimelog(added.id);
            start();
        },

        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            selectedProject,
            active,
            start,
            stop,
            selectedTask,
            setSelectedTask,
            addTimelog,
            setSelectedTimelog,
        ]
    );

    useEffect(() => {
        if (!active || prevTask.current?.id === selectedTask?.id) return;
        stop();
        prevTask.current = selectedTask;
    }, [selectedTask, stop, active]);

    return (
        <Stack spacing='xl'>
            <TimerDisplay duration={duration} />
            <Stack spacing='md'>
                <SelectProject
                    label={<Title order={4}>Selected Project</Title>}
                />
                <Group position='center' grow>
                    <ProjectModal.Add selectAdded={!selectedProject} />
                    <TaskModal.Add
                        disabled={!selectedProject}
                        selectAdded={!active || !selectedTask}
                    />
                </Group>
            </Stack>
            {!!tasks.length && (
                <Stack>
                    <Title order={5}>Tasks</Title>
                    {tasks.map(({ id, title }) => {
                        const selected = selectedTask?.id === id;
                        return (
                            <Group
                                onClick={(ev) => {
                                    ev.stopPropagation();
                                    setSelectedTask(id);
                                }}
                                key={`task-${id}`}
                                p='sm'
                                spacing='sm'
                                position='apart'
                                sx={(theme) => ({
                                    backgroundColor:
                                        theme.colors.gray[selected ? 7 : 9],
                                    borderRadius: theme.radius.sm,
                                })}
                            >
                                <Title
                                    order={4}
                                    sx={(theme) => ({
                                        color: theme.colors.gray[
                                            selected ? 0 : 5
                                        ],
                                    })}
                                >
                                    {title}
                                </Title>
                                <Group spacing='xs'>
                                    <TaskModal.Edit
                                        id={id}
                                        variant='subtle'
                                        p='xs'
                                    >
                                        <FaEdit />
                                    </TaskModal.Edit>
                                    <PlayButton
                                        active={selected && active}
                                        onClick={() => {
                                            handleClick(id);
                                        }}
                                    />
                                </Group>
                            </Group>
                        );
                    })}
                </Stack>
            )}
        </Stack>
    );
}
