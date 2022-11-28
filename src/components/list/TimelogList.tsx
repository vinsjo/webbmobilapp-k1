import { useMemo } from 'react';
import { Group, Stack, Text } from '@mantine/core';
import { useTimelogs } from '@/context/TimeTrackerContext';
import dayjs from 'dayjs';
import { DeleteButton } from '@/components/buttons/IconButtons';
import DurationOutput from '@/components/DurationOutput';

type Props = {
    timelogs: Timelog[];
};

export default function TimelogList({ timelogs }: Props) {
    const { remove } = useTimelogs();
    return (
        <Stack spacing='xs'>
            {timelogs.map((props) => {
                return (
                    <ListItem
                        key={`timelog-${props.id}`}
                        onDelete={() => remove(props.id)}
                        {...props}
                    />
                );
            })}
        </Stack>
    );
}

function ListItem({
    start,
    end,
    onDelete,
}: Timelog & {
    onDelete: () => unknown;
}) {
    const { duration, output } = useMemo(() => {
        return {
            output: [start, end]
                .map((time) =>
                    !time ? '--:--:--' : dayjs(time).format('HH:mm:ss')
                )
                .join(' — '),
            duration: !start || !end ? 0 : end - start,
        };
    }, [start, end]);
    return (
        <Group>
            <DeleteButton onClick={onDelete} title='Delete Timelog' size='lg' />
            <Text size='sm'>
                {output} (<DurationOutput duration={duration} />)
            </Text>
        </Group>
    );
}
