import React, { useEffect, useMemo } from 'react';
import { ProjectsContext, TasksContext, TimelogsContext } from './Context';
import useApiRoute from '@/hooks/useApiRoute';
import { Timelog } from '@/utils/api';
import type { TimeTracker } from './types';

export default function TimeTrackerProvider(props: React.PropsWithChildren) {
    const projects = useApiRoute('projects');
    const tasks = useApiRoute('tasks');
    const timelogs = useApiRoute('timelogs');

    // useEffect(() => {
    //     if (projects.selected) return;
    //     tasks.setSelected(null);
    // }, [projects.selected]);

    // useEffect(() => {
    //     if (tasks.selected) return;
    //     timelogs.setSelected(null);
    // }, [tasks.selected]);

    useEffect(() => {
        if (!projects.data.length) return;
        projects.setSelected(projects.data[0].id);
    }, [projects.data]);

    useEffect(() => {
        tasks.setSelected(
            !projects.selected
                ? null
                : tasks.data.find(
                      (task) => task.projectId === projects.selected?.id
                  )?.id || null
        );
    }, [projects.selected, tasks.data]);

    // "Special treatment" for timelogs in order to "end" selected timelog
    // before selecting another one
    const timelogsValue = useMemo(() => {
        const { setSelected, ...value } = timelogs;
        const { selected, update } = value;
        return {
            ...value,
            setSelected: (id: Timelog['id']) => {
                if (selected && !selected.end) {
                    update(selected.id, { end: Date.now() });
                }
                setSelected(id);
            },
        } as TimeTracker.Value<Timelog>;
    }, [timelogs]);

    return (
        <ProjectsContext.Provider value={projects}>
            <TasksContext.Provider value={tasks}>
                <TimelogsContext.Provider value={timelogsValue}>
                    {props.children}
                </TimelogsContext.Provider>
            </TasksContext.Provider>
        </ProjectsContext.Provider>
    );
}
