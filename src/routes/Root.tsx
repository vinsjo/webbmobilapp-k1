import { useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { TimeTrackerContext } from '@/context/TimeTracker';
import useApiRoute from '@/hooks/useApiRoute';

const Root = () => {
    const projects = useApiRoute('projects');
    const tasks = useApiRoute('tasks');
    const timelogs = useApiRoute('timelogs');

    const error = useMemo(
        () => projects.error || tasks.error || timelogs.error || null,
        [projects.error, tasks.error, timelogs.error]
    );

    const value = useMemo(
        () => ({
            projects: projects.data,
            tasks: tasks.data,
            timelogs: timelogs.data,
            error,
        }),
        [projects.data, tasks.data, timelogs.data, error]
    );

    return (
        <TimeTrackerContext.Provider value={value}>
            <Outlet />
        </TimeTrackerContext.Provider>
    );
};

export default Root;
