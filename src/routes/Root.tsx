import { useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { TimeTrackerContext } from '@/context/TimeTracker';
import useApiRoute from '@/hooks/useApiRoute';

const Root = () => {
    const projects = useApiRoute('projects');
    const tasks = useApiRoute('tasks');
    const timelogs = useApiRoute('timelogs');

    const value = useMemo(
        () => ({
            projects,
            tasks,
            timelogs,
        }),
        [projects, tasks, timelogs]
    );

    return (
        <TimeTrackerContext.Provider value={value}>
            <Outlet />
        </TimeTrackerContext.Provider>
    );
};

export default Root;
