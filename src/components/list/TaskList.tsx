import { filterData } from '@/utils';
import { Task, Timelog } from '@/utils/api/types';
import { Text, Stack, Title } from '@mantine/core';
import { useMemo } from 'react';
import TimelogList from './TimelogList';
import TaskModal from '@/components/modals/TaskModal';

type Props = {
    tasks: Task[];
    timelogs: Timelog[];
};

export default function TaskList({ tasks, timelogs }: Props) {
    return !tasks.length ? null : (
        <Stack>
            <Title order={5}>Tasks:</Title>
            <Stack spacing="xs">
                {tasks.map((task) => {
                    return (
                        <ListItem
                            key={`task-${task.id}`}
                            timelogs={timelogs}
                            {...task}
                        />
                    );
                })}
            </Stack>
        </Stack>
    );
}

function ListItem({ id, title, timelogs }: Task & { timelogs: Timelog[] }) {
    const filteredTimelogs = useMemo(
        () => filterData(timelogs, 'taskId', id),
        [id, timelogs]
    );
    return (
        <Stack spacing="xs">
            <Text size="sm">{title}</Text>
            <TaskModal.Edit id={id} />
            <TimelogList timelogs={filteredTimelogs} />
        </Stack>
    );
}
