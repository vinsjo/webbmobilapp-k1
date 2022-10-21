// import { useEffect, useMemo } from 'react';
import { useProjects, useTasks, useTimelogs } from '@/context/TimeTracker';
import useTimer from '@/hooks/useTimer';
import { Button, Text, Box } from '@mantine/core';
import { useEffect } from 'react';

const Home = () => {
    const projects = useProjects();
    const tasks = useTasks();
    const timelogs = useTimelogs();

    const timer = useTimer();
    useEffect(() => {
        if (!projects.data.length) return;
        projects.setSelected(projects.data[0].id);
    }, [projects.data, projects.setSelected]);
    useEffect(() => {
        if (!projects.selected || !tasks.data.length) return;
        const selected = tasks.data.find(
            (task) => task.projectId === projects.selected?.id
        );
        tasks.setSelected(selected?.id || null);
    }, [projects.selected, tasks.data, tasks.setSelected]);

    // useEffect(() => {
    //     if (!tasks.selected || !timelogs.data.length) return;
    //     const selected =
    // }, [tasks.selected, timelogs.data, timelogs.setSelected])

    return (
        <Box>
            <Box>
                <Text>{timer.output}</Text>
            </Box>
            <Box>
                <Button size="md" onClick={timer.start}>
                    Start
                </Button>
                <Button
                    size="md"
                    onClick={() => {
                        console.log(timer.stop());
                    }}
                >
                    Stop
                </Button>
            </Box>
        </Box>
    );
};

export default Home;
