import { filterData } from '@/utils';
import { Task, Timelog } from '@/utils/api/types';
import { Text, Stack, Title, Group, Divider } from '@mantine/core';
import { useMemo } from 'react';
import TimelogList from './TimelogList';
import TaskModal from '@/components/modals/TaskModal';
import { FaEdit } from 'react-icons/fa';
import { getTotalDuration } from '@/utils/api';
import DurationOutput from '../DurationOutput';

type Props = {
    tasks: Task[];
    timelogs: Timelog[];
};

export default function TaskList({ tasks, timelogs }: Props) {
    return !tasks.length ? null : (
        <Stack spacing="lg">
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
    const totalDuration = useMemo(
        () => getTotalDuration(filteredTimelogs),
        [filteredTimelogs]
    );
    return (
        <Stack spacing="xs">
            <Divider color="white" my="sm" />
            <Group position="apart">
                <Title size="h5">{title}</Title>
                <TaskModal.Edit id={id} variant="subtle" p="xs">
                    <FaEdit />
                </TaskModal.Edit>
            </Group>
            <Text size="xs">
                Total time: <DurationOutput duration={totalDuration} />
            </Text>

            <TimelogList timelogs={filteredTimelogs} />
            <Divider color="white" my="sm" />
        </Stack>
    );
}
