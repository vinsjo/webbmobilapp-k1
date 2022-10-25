import React, { useCallback, useEffect, useMemo } from 'react';
import {
    ProjectsContext,
    TasksContext,
    TimelogsContext,
    type TimeTracker,
} from '@/context/TimeTracker';
import api, { type Api } from '@/utils/api';
import useApiHandler from '@/hooks/useApiHandler';
import useWindowEvent from '@/hooks/useWindowEvent';
import usePathChange from '@/hooks/usePathChange';

export default function TimeTrackerProvider(props: React.PropsWithChildren) {
    const projects = useApiHandler(api.projects);
    const tasks = useApiHandler(api.tasks);
    const timelogs = useApiHandler(api.timelogs);

    const endSelectedTimelog = useCallback(
        async () => {
            if (!timelogs.selected || timelogs.selected.end) return;
            await timelogs.update(timelogs.selected.id, { end: Date.now() });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [timelogs.selected, timelogs.update]
    );

    // End active timelog before window unloads
    useWindowEvent('beforeunload', endSelectedTimelog);
    // End active timelogs when react router pathname changes
    usePathChange(endSelectedTimelog);

    // End selected timelog before updating selected timelog
    const setSelectedTimelog = useCallback<TimeTracker.Select<Api.Timelog>>(
        async (id) => {
            await endSelectedTimelog();
            await timelogs.setSelected(id);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [timelogs.setSelected, endSelectedTimelog]
    );

    const timelogsValue = useMemo<TimeTracker.Context<Api.Timelog>>(() => {
        return {
            ...timelogs,
            setSelected: setSelectedTimelog,
        };
    }, [timelogs, setSelectedTimelog]);

    //#region TEMPORARY
    useEffect(() => {
        if (!projects.data.length) return;
        projects.setSelected(projects.data[0].id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projects.data, projects.setSelected]);

    useEffect(() => {
        if (!projects.selected || tasks.selected) return;
        const id = projects.selected.id;
        tasks.setSelected(
            tasks.data.find(({ projectId }) => projectId === id)?.id || null
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tasks.setSelected, tasks.selected, tasks.data, projects.selected]);
    //#endregion

    useEffect(() => {
        [projects, tasks, timelogs].forEach(({ load }) => load());
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
