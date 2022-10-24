import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { ProjectsContext, TasksContext, TimelogsContext } from './Context';
import api, { type Api } from '@/utils/api';
import * as TimeTracker from './types';
import useApiHandler from '@/hooks/useApiHandler';
import { useLocation } from 'react-router-dom';
import useWindowEvent from '@/hooks/useWindowEvent';

export default function TimeTrackerProvider(props: React.PropsWithChildren) {
    const projects = useApiHandler(api.projects);
    const tasks = useApiHandler(api.tasks);
    const timelogs = useApiHandler(api.timelogs);

    //#region Timelog handling (to prevent timelogs without end-value in db)

    const { pathname } = useLocation();
    const prevPath = useRef(pathname);

    const endSelectedTimelog = useCallback(
        () => {
            if (!timelogs.selected || timelogs.selected.end) return;
            timelogs.update(timelogs.selected.id, { end: Date.now() });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [timelogs.selected, timelogs.update]
    );

    // End selected timelog before page unloads
    useWindowEvent('beforeunload', endSelectedTimelog);

    // End selected timelog when pathname changes
    useEffect(() => {
        if (pathname === prevPath.current) return;
        endSelectedTimelog();
        prevPath.current = pathname;
    }, [pathname, endSelectedTimelog]);

    // End selected timelog before updating selected timelog
    const setSelectedTimelog = useCallback<TimeTracker.Select<Api.Timelog>>(
        (id) => {
            endSelectedTimelog();
            timelogs.setSelected(id);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [timelogs.setSelected, endSelectedTimelog]
    );

    const timelogsValue = useMemo(() => {
        return {
            ...timelogs,
            setSelected: setSelectedTimelog,
        } as TimeTracker.Context<Api.Timelog>;
    }, [timelogs, setSelectedTimelog]);

    //#endregion

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
    }, [projects]);

    useEffect(() => {
        tasks.setSelected(
            !projects.selected
                ? null
                : tasks.data.find(
                      (task) => task.projectId === projects.selected?.id
                  )?.id || null
        );
    }, [projects, tasks]);

    useEffect(() => {
        const controller = new AbortController();
        [projects, tasks, timelogs].forEach(({ load }) =>
            load(controller.signal)
        );
        return () => controller.abort();
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
