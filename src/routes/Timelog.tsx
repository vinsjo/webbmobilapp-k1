// import { useEffect, useMemo } from 'react';
import { useCallback, useEffect, useMemo } from 'react';
import { useProjects, useTasks, useTimelogs } from '@/context/TimeTracker';
import { Text, Box } from '@mantine/core';
import dayjs from 'dayjs';
import { convertElapsedTime } from '@/utils';
import Timer from '@/components/Timer';

const Timelog = () => {
    const projects = useProjects();
    const tasks = useTasks();
    const timelogs = useTimelogs();

    const taskTotal = useMemo(() => {
        if (!tasks.selected) return null;
        const totalElapsed = timelogs.data
            .filter(({ taskId }) => taskId === tasks.selected?.id)
            .reduce((sum, { start, end }) => {
                if (!start || !end) return sum;
                return sum + (end - start);
            }, 0);
        const { h, m, s } = convertElapsedTime(totalElapsed);
        return `${h} hours, ${m} minutes, ${s} seconds`;
    }, [tasks.selected, timelogs.data]);

    const selectedTimelog = useMemo(() => {
        if (!timelogs.selected) return null;
        const { start, end } = timelogs.selected;
        const elapsed = !end ? null : end - start;
        const total = !elapsed ? null : convertElapsedTime(elapsed);
        return {
            start: dayjs(Math.floor(start / 1000) * 1000).format(
                'YYYY-MM-DD HH:mm:ss'
            ),
            end: !end
                ? null
                : dayjs(Math.floor(end / 1000) * 1000).format(
                      'YYYY-MM-DD HH:mm:ss'
                  ),
            total: !total
                ? null
                : `${total.h} hours, ${total.m} minutes, ${total.s} seconds`,
        };
    }, [timelogs.selected]);

    const handleStart = useCallback(
        (startTime: number) => {
            if (!projects.selected?.id || !tasks.selected?.id || !startTime)
                return;
            timelogs
                .add({
                    projectId: projects.selected.id,
                    taskId: tasks.selected.id,
                    start: startTime,
                    end: null,
                })
                .then((added) => {
                    if (!added) return;
                    timelogs.setSelected(added.id);
                });
            // eslint-disable-next-line react-hooks/exhaustive-deps
        },
        [projects.selected?.id, tasks.selected?.id, timelogs]
    );
    const handleStop = useCallback(
        (result: { start: number; end: number }) => {
            const { end } = result;
            if (!timelogs.selected?.id || !end) return;
            timelogs.update(timelogs.selected.id, { end });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [timelogs.selected?.id, timelogs.update]
    );

    useEffect(() => {
        if (!projects.data.length) return;
        projects.setSelected(projects.data[0].id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projects.data, projects.setSelected]);
    useEffect(() => {
        if (!projects.selected || !tasks.data.length) return;
        tasks.setSelected(
            tasks.data.find((task) => task.projectId === projects.selected?.id)
                ?.id || null
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projects.selected, tasks.data, tasks.setSelected]);

    return (
        <Box>
            <Timer onStart={handleStart} onStop={handleStop} />
            <Box>
                {projects.selected && (
                    <Box
                        sx={() => ({
                            padding: '1rem 0',
                        })}
                    >
                        <Text>Selected Project: {projects.selected.name}</Text>
                    </Box>
                )}
                {tasks.selected && (
                    <Box
                        sx={() => ({
                            padding: '1rem 0',
                        })}
                    >
                        <Text>Selected Task: {tasks.selected.title}</Text>
                        <Text>Time spent on task: {taskTotal}</Text>
                    </Box>
                )}
                {selectedTimelog && (
                    <Box
                        sx={() => ({
                            padding: '1rem 0',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem',
                        })}
                    >
                        <Text size="lg">Selected Timelog: </Text>
                        <Text>{selectedTimelog.start}</Text>
                        <Text>-</Text>
                        <Text>{selectedTimelog.end}</Text>
                        <Text>-</Text>
                        <Text>{selectedTimelog.total}</Text>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default Timelog;
