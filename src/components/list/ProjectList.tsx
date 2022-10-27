import { List, Stack, Title, Divider } from '@mantine/core';
import TaskList from './TaskList';
import { NestedProject } from '@/utils/api/types';

type Props = { projects: NestedProject[] };

export default function ProjectList({ projects }: Props) {
    return (
        <Stack spacing="lg" sx={{ width: '100%' }}>
            <Title order={3}>Projects</Title>
            <List spacing="md" size="xl">
                {projects.map(({ id, name, color, tasks }) => {
                    return (
                        <List.Item
                            key={`project-${id}`}
                            style={{ display: 'block', width: '100%' }}
                        >
                            <Divider />
                            <Stack p="md">
                                <Title order={4} color={color || undefined}>
                                    {name}
                                </Title>
                                <TaskList tasks={tasks} />
                            </Stack>
                            <Divider />
                        </List.Item>
                    );
                })}
            </List>
        </Stack>
    );
}
