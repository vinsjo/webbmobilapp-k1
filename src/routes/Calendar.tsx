import { useState, useCallback, useMemo } from 'react';
import { useProjects, useTasks, useTimelogs } from '@/context/TimeTracker';
import { getNestedProjects, getTotalDuration } from '@/utils/api';
import { filterData, formatDuration } from '@/utils';
import dayjs from 'dayjs';

import { List, Stack, ActionIcon, Text, Title } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { FaTimes } from 'react-icons/fa';

import type { Timelog, NestedTask } from '@/utils/api/types';

export default function Calendar() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const projects = useProjects();
    const tasks = useTasks();
    const timelogs = useTimelogs(
        useCallback(
            (state) => {
                return {
                    data: !selectedDate
                        ? []
                        : state.data.filter(
                              ({ start, end }) =>
                                  end &&
                                  dayjs(start).isSame(selectedDate, 'date')
                          ),
                    delete: state.delete,
                };
            },
            [selectedDate]
        )
    );

    const nestedProjects = useMemo(() => {
        return getNestedProjects(projects.data, tasks.data, timelogs.data, {
            project: ({ tasks }) => tasks.length,
            task: ({ timelogs }) => timelogs.length,
        });
    }, [projects.data, tasks.data, timelogs.data]);

    const renderTimelogs = useCallback(
        (logs: Timelog[]) => {
            return (
                <List pl="sm">
                    {filterData(logs, 'end', 0, false).map(
                        ({ id, start, end }) => {
                            const output = [start, end]
                                .map((ts) => dayjs(ts).format('HH:mm:ss'))
                                .join(' — ');
                            return (
                                <List.Item
                                    icon={
                                        <ActionIcon
                                            size="sm"
                                            onClick={() => timelogs.delete(id)}
                                        >
                                            <FaTimes />
                                        </ActionIcon>
                                    }
                                    key={`timelog-${id}`}
                                >
                                    <Text size="sm">
                                        {output} ({formatDuration(end - start)})
                                    </Text>
                                </List.Item>
                            );
                        }
                    )}
                </List>
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [timelogs.delete]
    );

    const renderTasks = useCallback(
        (tasks: NestedTask[]) => {
            return (
                <List spacing="sm">
                    {tasks.map(({ timelogs, id, title }) => {
                        const duration = getTotalDuration(timelogs);
                        return (
                            <List.Item key={`task-${id}`}>
                                <Stack spacing="sm">
                                    <Title order={5}>Task: {title}</Title>
                                    <Text>
                                        Time spent on task:{' '}
                                        {formatDuration(duration)}
                                    </Text>
                                    {renderTimelogs(timelogs)}
                                </Stack>
                            </List.Item>
                        );
                    })}
                </List>
            );
        },
        [renderTimelogs]
    );

    const renderData = useCallback(() => {
        return (
            <List spacing="md">
                {nestedProjects.map(({ tasks, id, name, color }) => {
                    return (
                        <List.Item key={`project-${id}`}>
                            <Stack>
                                <Title order={4} color={color || undefined}>
                                    Project: {name}
                                </Title>
                                {renderTasks(tasks)}
                            </Stack>
                        </List.Item>
                    );
                })}
            </List>
        );
    }, [nestedProjects, renderTasks]);

    return (
        <Stack>
            <DatePicker
                value={selectedDate}
                onChange={setSelectedDate}
                placeholder="Select date"
            />
            {!nestedProjects.length ? (
                <Text>No timelogs for selected date</Text>
            ) : (
                renderData()
            )}
        </Stack>
    );
}
