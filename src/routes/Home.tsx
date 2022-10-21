import { useEffect, useMemo } from 'react';
import { useTimeTracker } from '@/context/TimeTracker';
import useTimer from '@/hooks/useTimer';
import { Grid, Button, Text } from '@mantine/core';
import dayjs from 'dayjs';
const Home = () => {
    // const { projects, tasks, timelogs } = useTimeTracker();
    const timer = useTimer();
    // useEffect(() => {
    //     console.log('projects: ', projects);
    //     console.log('tasks: ', tasks);
    //     console.log('timelogs: ', timelogs);
    // }, [projects, tasks, timelogs]);

    return (
        <Grid grow gutter="lg" align="center" justify="center">
            <Grid.Col span={12}>
                <Text>{timer.output}</Text>
            </Grid.Col>
            <Grid.Col span="auto">
                <Button size="md" onClick={timer.start}>
                    Start
                </Button>
            </Grid.Col>
            <Grid.Col span="auto">
                <Button size="md" onClick={timer.stop}>
                    Stop
                </Button>
            </Grid.Col>
            <Grid.Col span="auto">
                <Button size="md" onClick={timer.toggle}>
                    Toggle
                </Button>
            </Grid.Col>
        </Grid>
    );
};

export default Home;
