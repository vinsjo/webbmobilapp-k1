import { useEffect } from 'react';
import { useTimeTracker } from './context/TimeTracker';

const App = () => {
    const { projects, tasks, timelogs } = useTimeTracker();
    useEffect(() => {
        console.log('projects: ', projects);
        console.log('tasks: ', tasks);
        console.log('timelogs: ', timelogs);
    }, [projects, tasks, timelogs]);
    return <>Vite React Template App</>;
};

export default App;
