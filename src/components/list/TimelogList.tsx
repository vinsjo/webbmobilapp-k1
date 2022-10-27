import { useMemo } from 'react';
import { List, Text } from '@mantine/core';
import { useTimelogs } from '@/context/TimeTracker';
import { Timelog } from '@/utils/api/types';
import dayjs from 'dayjs';
import { DeleteButton } from '@/components/buttons';
import DurationOutput from '@/components/DurationOutput';

export default function TimelogList({ timelogs }: { timelogs: Timelog[] }) {
    const { remove } = useTimelogs();
    return (
        <List pl="sm">
            {timelogs.map((props) => {
                return (
                    <ListItem
                        key={`timelog-${props.id}`}
                        onDelete={() => remove(props.id)}
                        {...props}
                    />
                );
            })}
        </List>
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
        <List.Item icon={<DeleteButton onClick={onDelete} />}>
            <Text size="sm">
                {output} (<DurationOutput duration={duration} />)
            </Text>
        </List.Item>
    );
}
