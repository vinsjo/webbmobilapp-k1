import { useEffect } from 'react';
import { useTimeTracker } from '@/context/TimeTracker';
const Home = () => {
    const { projects, tasks, error } = useTimeTracker();
    useEffect(() => {
        console.log('projects: ', projects);
        console.log('tasks: ', tasks);
        console.log('error: ', error);
    }, [projects, tasks, error]);
    return <div>Home</div>;
};

export default Home;
