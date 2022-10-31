import { useCallback, useMemo } from 'react';

import { Group, Stack, Title } from '@mantine/core';
import TaskList from './TaskList';

import { filterData } from '@/utils';

import type { Project, Task, Timelog } from '@/utils/api/types';
import { ProjectModal, TaskModal } from '@/components/modals';
import { useProjects } from '@/context/TimeTracker';
import { defaultColor } from '@/utils/api';

type Props = {
    projects: Project[];
    tasks: Task[];
    timelogs: Timelog[];
};

export default function ProjectList({ projects, tasks, timelogs }: Props) {
    return (
        <Stack spacing="lg">
            <Title order={3}>
                {!projects.length ? 'No projects exists' : 'Projects'}
            </Title>
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
        return setSelected(id);
    }, [id, setSelected]);
    return (
        <Stack
            p="md"
            spacing="md"
            sx={(theme) => ({
                background: color || defaultColor,
                color: theme.colors.gray[0],
                borderRadius: theme.radius.sm,
            })}
        >
            <Title order={4}>{name}</Title>
            <Group position="left" spacing="md">
                <ProjectModal.Edit id={id} />
                <TaskModal.Add onClick={handleClick} />
            </Group>
            <TaskList tasks={filteredTasks} timelogs={filteredTimelogs} />
        </Stack>
    );
}
