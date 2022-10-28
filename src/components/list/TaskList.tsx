import { filterData } from '@/utils';
import { Task, Timelog } from '@/utils/api/types';
import { List, Text, Stack, Title } from '@mantine/core';
import { useMemo } from 'react';
import TimelogList from './TimelogList';

type Props = {
    tasks: Task[];
    timelogs: Timelog[];
};

export default function TaskList({ tasks, timelogs }: Props) {
    return (
        <Stack>
            <Title order={5}>Tasks:</Title>
            <List spacing="sm" pl="md">
                {tasks.map((task) => {
                    return (
                        <ListItem
                            key={`task-${task.id}`}
                            timelogs={timelogs}
                            {...task}
                        />
                    );
                })}
            </List>
        </Stack>
    );
}

function ListItem({ id, title, timelogs }: Task & { timelogs: Timelog[] }) {
    const filteredTimelogs = useMemo(
        () => filterData(timelogs, 'taskId', id),
        [id, timelogs]
    );
    return (
        <List.Item>
            <Stack spacing="xs">
                <Text size="sm">{title}</Text>
                <TimelogList timelogs={filteredTimelogs} />
            </Stack>
        </List.Item>
    );
}
