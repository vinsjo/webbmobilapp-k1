// import { useEffect, useMemo } from 'react';
import { useProjects, useTasks, useTimelogs } from '@/context/TimeTracker';
import useTimer from '@/hooks/useTimer';
import { convertElapsedTime } from '@/utils';
import { Button, Text, Box } from '@mantine/core';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo } from 'react';

const Home = () => {
    const projects = useProjects();
    const tasks = useTasks();
    const timelogs = useTimelogs();
    const timer = useTimer();

    const taskTotal = useMemo(() => {
        if (!tasks.selected) return null;
        const { h, m, s } = timelogs.data
            .filter(({ taskId }) => taskId === tasks.selected?.id)
            .reduce(
                (sum, { start, end }) => {
                    if (!end) return sum;
                    const { h, m, s } = convertElapsedTime(end - start);
                    return { h: sum.h + h, m: sum.m + m, s: sum.s + s };
                },
                { h: 0, m: 0, s: 0 }
            );
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

    const handleTimerStart = useCallback(async () => {
        if (!projects.selected || !tasks.selected) return;
        const start = timer.start();
        if (!start) return;
        const id = await timelogs.add({
            projectId: projects.selected.id,
            taskId: tasks.selected.id,
            start,
            end: null,
        });
        timelogs.setSelected(id);
    }, [
        projects.selected,
        tasks.selected,
        timelogs.add,
        timelogs.setSelected,
        timelogs.selected,
    ]);
    const handleTimerStop = useCallback(() => {
        const { start, end } = timer.stop();
        if (!timelogs.selected || !start || !end) return;
        timelogs.update(timelogs.selected.id, { end });
    }, [timelogs.selected, timelogs.update]);

    useEffect(() => {
        if (!projects.data.length) return;
        projects.setSelected(projects.data[0].id);
    }, [projects.data, projects.setSelected]);
    useEffect(() => {
        if (!projects.selected || !tasks.data.length) return;
        tasks.setSelected(
            tasks.data.find((task) => task.projectId === projects.selected?.id)
                ?.id || null
        );
    }, [projects.selected, tasks.data, tasks.setSelected]);

    return (
        <Box>
            <Box>
                <Text>{timer.output}</Text>
            </Box>
            <Box>
                <Button size="md" onClick={handleTimerStart}>
                    Start
                </Button>
                <Button size="md" onClick={handleTimerStop}>
                    Stop
                </Button>
            </Box>
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

export default Home;
