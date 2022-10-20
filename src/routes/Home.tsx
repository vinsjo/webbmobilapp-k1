import { useEffect } from 'react';
import { useTimeTracker } from '@/context/TimeTracker';
const Home = () => {
    const { projects, tasks, timelogs } = useTimeTracker();
    useEffect(() => {
        console.log('projects: ', projects);
        console.log('tasks: ', tasks);
        console.log('timelogs: ', timelogs);
    }, [projects, tasks, timelogs]);

    return <div>Home</div>;
};

export default Home;
