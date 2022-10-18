import type { TimeTracker } from './types';
import TimeTrackerContext from './Context';
import useAxios, { type UseAxiosConfig } from '@vinsjo/use-axios';
import React, { useMemo } from 'react';

const axiosConfig: UseAxiosConfig = {
    baseURL: 'http://localhost:3000',
    waitUntilMount: true,
};

export default function TimeTrackerProvider(props: {
    children: React.ReactNode;
}) {
    const projects = useAxios<TimeTracker.Project[]>({
        ...axiosConfig,
        url: '/projects',
    });
    const tasks = useAxios<TimeTracker.Task[]>({
        ...axiosConfig,
        url: '/tasks',
    });
    const timelogs = useAxios<TimeTracker.Timelog[]>({
        ...axiosConfig,
        url: '/timelogs',
    });

    const error = useMemo(() => {
        const error = [projects, tasks, timelogs].find(
            ({ error }) => error
        )?.error;
        return !error ? null : error.message || 'Failed fetching data...';
    }, [projects.error, tasks.error, timelogs.error]);

    const value = useMemo(
        () => ({
            projects: projects.data || [],
            tasks: tasks.data || [],
            timelogs: timelogs.data || [],
            error,
        }),
        [projects.data, tasks.data, timelogs.data, error]
    );
    return (
        <TimeTrackerContext.Provider value={value}>
            {props.children}
        </TimeTrackerContext.Provider>
    );
}
