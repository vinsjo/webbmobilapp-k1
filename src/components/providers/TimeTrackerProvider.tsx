import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ProjectsContext,
    TasksContext,
    TimelogsContext,
    type TimeTracker,
} from '@/context/TimeTracker';
import { type Api } from '@/utils/api';
import { useApiHandler } from '@/hooks';

export default function TimeTrackerProvider(props: React.PropsWithChildren) {
    const [loaded, setLoaded] = useState(false);
    const projects = useApiHandler('projects');
    const tasks = useApiHandler('tasks');
    const timelogs = useApiHandler('timelogs');

    const endSelectedTimelog = useCallback(
        async () => {
            if (!timelogs.selected || timelogs.selected.end) return;
            await timelogs.update(timelogs.selected.id, { end: Date.now() });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [timelogs.selected, timelogs.update]
    );

    // // End active timelog before window unloads
    // useWindowEvent('beforeunload', endSelectedTimelog);
    // // End active timelogs when react router pathname changes
    // usePathChange(endSelectedTimelog);

    // End selected timelog before updating selected timelog
    const setSelectedTimelog = useCallback<TimeTracker.Select<Api.Timelog>>(
        async (id) => {
            if (timelogs.selected?.id === id) return;
            await endSelectedTimelog();
            await timelogs.setSelected(id);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [timelogs.selected, timelogs.setSelected, endSelectedTimelog]
    );

    const timelogsValue = useMemo<TimeTracker.Context<Api.Timelog>>(() => {
        return {
            ...timelogs,
            setSelected: setSelectedTimelog,
        };
    }, [timelogs, setSelectedTimelog]);

    useEffect(() => {
        if (!loaded || projects.selected?.id === tasks.selected?.projectId)
            return;
        tasks.setSelected(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loaded, projects.selected, tasks.selected, tasks.setSelected]);

    useEffect(() => {
        if (!loaded || tasks.selected?.id === timelogs.selected?.taskId) return;
        setSelectedTimelog(null);
    }, [loaded, tasks.selected, timelogs.selected, setSelectedTimelog]);

    useEffect(() => {
        (async () => {
            await projects.load();
            await tasks.load();
            await timelogs.load();
            setLoaded(true);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
