import React, { useEffect } from 'react';
import { ProjectsContext, TasksContext, TimelogsContext } from './Context';
import useApiRoute from '@/hooks/useApiRoute';

export default function TimeTrackerProvider(props: React.PropsWithChildren) {
    const projects = useApiRoute('projects');
    const tasks = useApiRoute('tasks');
    const timelogs = useApiRoute('timelogs');

    useEffect(() => {
        if (projects.selected) return;
        tasks.setSelected(null);
    }, [projects.selected, tasks.setSelected]);

    useEffect(() => {
        if (tasks.selected) return;
        timelogs.setSelected(null);
    }, [tasks.selected, timelogs.setSelected]);

    return (
        <ProjectsContext.Provider value={projects}>
            <TasksContext.Provider value={tasks}>
                <TimelogsContext.Provider value={timelogs}>
                    {props.children}
                </TimelogsContext.Provider>
            </TasksContext.Provider>
        </ProjectsContext.Provider>
    );
}
