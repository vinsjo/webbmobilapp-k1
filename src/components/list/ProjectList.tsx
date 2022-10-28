import { useMemo } from 'react';

import { List, Stack, Title, Divider } from '@mantine/core';
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
        <Stack spacing="lg" sx={{ width: '100%' }}>
            <Title order={3}>Projects</Title>
            <List spacing="md" size="xl">
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
            </List>
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
        <List.Item style={{ display: 'block', width: '100%' }}>
            <Divider />
            <Stack p="md">
                <Title order={4} color={color || undefined}>
                    {name}
                </Title>
                <TaskList tasks={filteredTasks} timelogs={filteredTimelogs} />
            </Stack>
            <Divider />
        </List.Item>
    );
}
