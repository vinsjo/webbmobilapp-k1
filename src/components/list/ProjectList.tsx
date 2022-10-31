import { useCallback, useMemo } from 'react';

import { Group, Stack, Title } from '@mantine/core';
import TaskList from './TaskList';

import { filterData } from '@/utils';

import type { Project, Task, Timelog } from '@/utils/api/types';
import { ProjectModal } from '@/components/modals';
import { useProjects } from '@/context/TimeTracker';
import { Colors } from '@/utils/api';
import { FaEdit } from 'react-icons/fa';

type Props = {
    projects: Project[];
    tasks: Task[];
    timelogs: Timelog[];
};

export default function ProjectList({ projects, tasks, timelogs }: Props) {
    return (
        <Stack spacing="lg">
            <Title order={3}>Projects</Title>
            <ProjectModal.Add />
            <Stack spacing="md">
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
    const { setSelected } = useProjects();
    const filteredTasks = useMemo(
        () => filterData(tasks, 'projectId', id),
        [id, tasks]
    );
    const filteredTimelogs = useMemo(
        () => filterData(timelogs, 'projectId', id),
        [id, timelogs]
    );
    const handleClick = useCallback(() => {
        setSelected(id);
    }, [id, setSelected]);
    return (
        <Stack
            p="md"
            spacing="md"
            sx={(theme) => ({
                background: !color ? theme.colors.gray[8] : Colors[color],
                borderRadius: theme.radius.sm,
            })}
        >
            <Group position="apart" onClick={handleClick}>
                <Title order={4}>{name}</Title>
                <ProjectModal.Edit id={id} variant="subtle" p="xs">
                    <FaEdit />
                </ProjectModal.Edit>
            </Group>
            <TaskList tasks={filteredTasks} timelogs={filteredTimelogs} />
        </Stack>
    );
}
