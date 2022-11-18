import { useCallback, useEffect, useRef } from 'react';
import { useProjects, useTasks, useTimelogs } from '@/context/TimeTracker';
import useTimer from '@/hooks/useTimer';

import { Group, Stack, Title } from '@mantine/core';
import SelectProject from '@/components/input/SelectProject';
import TimerDisplay from '@/components/TimerDisplay';

import { ProjectModal, TaskModal } from '@/components/modals';
import { PlayButton } from '@/components/buttons/IconButtons';
import { FaEdit } from 'react-icons/fa';

export default function TimeTracker() {
    const { current: currentProject } = useProjects();
    const {
        current: currentTimelog,
        setCurrent: setCurrentTimelog,
        add: addTimelog,
    } = useTimelogs();
    const { tasks, currentTask, setCurrentTask } = useTasks(
        useCallback(
            ({ data, current, setCurrent }) => {
                return {
                    tasks: !currentProject
                        ? []
                        : data.filter(
                              ({ projectId }) => projectId === currentProject.id
                          ),

                    currentTask: current,
                    setCurrentTask: setCurrent,
                };
            },
            [currentProject]
        )
    );

    const prevTask = useRef(currentTask);

    const { start, stop, duration, active } = useTimer(currentTimelog?.start);

    const handleClick = useCallback(
        async (id: Task['id']) => {
            if (!currentProject) return;
            if (currentTask?.id === id && active) {
                await setCurrentTimelog(null);
                stop();
                return;
            }
            await setCurrentTask(id);
            const added = await addTimelog({
                userId: currentProject.userId,
                projectId: currentProject.id,
                taskId: id,
                start: Date.now(),
                end: 0,
            });
            if (!added) return;
            await setCurrentTimelog(added.id);
            start();
        },

        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            active,
            start,
            stop,
            currentProject,
            currentTask,
            setCurrentTask,
            addTimelog,
            setCurrentTimelog,
        ]
    );

    useEffect(() => {
        if (!active || prevTask.current?.id === currentTask?.id) return;
        stop();
        prevTask.current = currentTask;
    }, [currentTask, stop, active]);

    return (
        <Stack spacing='xl'>
            <TimerDisplay duration={duration} />
            <Stack spacing='md'>
                <SelectProject
                    label={<Title order={4}>Selected Project</Title>}
                />
                <Group position='center' grow>
                    <ProjectModal.Add selectAdded={!currentProject} />
                    <TaskModal.Add
                        disabled={!currentProject}
                        selectAdded={!active || !currentTask}
                    />
                </Group>
            </Stack>
            {!!tasks.length && (
                <Stack>
                    <Title order={5}>Tasks</Title>
                    {tasks.map(({ id, title }) => {
                        const selected = currentTask?.id === id;
                        return (
                            <Group
                                key={`task-${id}`}
                                p='sm'
                                spacing='sm'
                                position='apart'
                                sx={(theme) => ({
                                    backgroundColor:
                                        theme.colors.gray[selected ? 7 : 9],
                                    borderRadius: theme.radius.sm,
                                })}
                                noWrap
                            >
                                <Title
                                    order={4}
                                    sx={(theme) => ({
                                        color: theme.colors.gray[
                                            selected ? 0 : 5
                                        ],
                                        width: '100%',
                                    })}
                                    onClick={() => {
                                        console.log(`title ${id} clicked`);
                                        setCurrentTask(id);
                                    }}
                                >
                                    {title}
                                </Title>
                                <Group
                                    spacing='xs'
                                    // sx={{ minWidth: 'fit-content' }}
                                    noWrap
                                >
                                    <TaskModal.Edit
                                        id={id}
                                        variant='subtle'
                                        p='xs'
                                    >
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
            )}
        </Stack>
    );
}
