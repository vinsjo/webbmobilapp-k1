import { useEffect } from 'react';
import { useTimeTracker } from '@/context/TimeTracker';
const Home = () => {
    const { projects, tasks, timelogs, error } = useTimeTracker();
    useEffect(() => {
        console.log('projects: ', projects);
        console.log('tasks: ', tasks);
        console.log('timelogs: ', timelogs);
        console.log('error: ', error);
    }, [projects, tasks, timelogs, error]);
    return <div>Home</div>;
};

export default Home;
