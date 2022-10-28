import { useMemo } from 'react';

import { Stack, Title } from '@mantine/core';
import TaskList from './TaskList';

import { filterData } from '@/utils';

import type { Project, Task, Timelog } from '@/utils/api/types';

type Props = {
    projects: Project[];
    tasks: Task[];
    timelogs: Timelog[];
};

export default function ProjectList({ projects, tasks, timelogs }: Props) {
    return (
        <Stack spacing="lg">
            <Title order={3}>Projects</Title>
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
    const filteredTasks = useMemo(
        () => filterData(tasks, 'projectId', id),
        [id, tasks]
    );
    const filteredTimelogs = useMemo(
        () => filterData(timelogs, 'projectId', id),
        [id, timelogs]
    );
    return (
        <Stack
            p="md"
            spacing="md"
            sx={(theme) => ({
                background: color || theme.colors.orange[6],
                color: theme.colors.gray[0],
                borderRadius: theme.radius.sm,
            })}
        >
            <Title order={4}>{name}</Title>
            <TaskList tasks={filteredTasks} timelogs={filteredTimelogs} />
        </Stack>
    );
}
