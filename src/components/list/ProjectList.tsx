import { useCallback, useMemo } from 'react';

import { Group, Stack, Title } from '@mantine/core';
import TaskList from './TaskList';

import { ProjectModal } from '@/components/modals';
import { useProjects } from '@/context/TimeTrackerContext';
import { FaEdit } from 'react-icons/fa';

type Props = {
    projects: Project[];
    tasks: Task[];
    timelogs: Timelog[];
};

export default function ProjectList({ projects, tasks, timelogs }: Props) {
    return (
        <Stack spacing='lg'>
            <Title order={3}>Projects</Title>
            <ProjectModal.Add />
            <Stack spacing='md'>
                {projects.map((project) => {
                    return (
                        <ListItem
                            key={`project-${project.id}`}
                            tasks={tasks}
                            timelogs={timelogs}
                            {...project}
                        />
                    );
                })}
            </Stack>
        </Stack>
    );
}

function ListItem({
    id,
    name,
    color,
    tasks,
    timelogs,
}: Project & { tasks: Task[]; timelogs: Timelog[] }) {
    const { setCurrent: setSelected } = useProjects();
    const filteredTasks = useMemo(
        () => tasks.filter(({ projectId }) => projectId === id),
        [id, tasks]
    );
    const filteredTimelogs = useMemo(
        () => timelogs.filter(({ projectId }) => projectId === id),
        [id, timelogs]
    );
    const handleClick = useCallback(() => {
        setSelected(id);
    }, [id, setSelected]);
    return (
        <Stack
            p='md'
            spacing='md'
            sx={(theme) => ({
                background: color || theme.colors.gray[8],
                borderRadius: theme.radius.sm,
            })}
        >
            <Group position='apart' onClick={handleClick}>
                <Title order={4}>{name}</Title>
                <ProjectModal.Edit id={id} variant='subtle' p='xs'>
                    <FaEdit />
                </ProjectModal.Edit>
            </Group>
            <TaskList tasks={filteredTasks} timelogs={filteredTimelogs} />
        </Stack>
    );
}
