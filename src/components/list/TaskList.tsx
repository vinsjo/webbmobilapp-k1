import { NestedTask } from '@/utils/api/types';
import { List, Text, Stack, Title } from '@mantine/core';
import TimelogList from './TimelogList';

export default function TaskList({ tasks }: { tasks: NestedTask[] }) {
    return (
        <Stack>
            <Title order={5}>Tasks:</Title>
            <List spacing="sm" pl="md">
                {tasks.map(({ id, title, timelogs }) => {
                    return (
                        <List.Item key={`task-${id}`}>
                            <Stack spacing="xs">
                                <Text size="sm">{title}</Text>
                                <TimelogList timelogs={timelogs} />
                            </Stack>
                        </List.Item>
                    );
                })}
            </List>
        </Stack>
    );
}
