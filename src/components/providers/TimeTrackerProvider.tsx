import React, { useCallback, useEffect, useMemo } from 'react';
import {
    UsersContext,
    ProjectsContext,
    TasksContext,
    TimelogsContext,
} from '@/context/TimeTracker';
import { useApiHandler } from '@/hooks';
import LoadingOverlay from '../LoadingOverlay';

export default function TimeTrackerProvider(props: React.PropsWithChildren) {
    const users = useApiHandler('users');
    const projects = useApiHandler('projects');
    const tasks = useApiHandler('tasks');
    const timelogs = useApiHandler('timelogs');

    // End selected timelog before updating selected timelog
    const setCurrentTimelog = useCallback<TimeTracker.Select<Timelog>>(
        async (id) => {
            if (timelogs.current?.id === id) return;
            if (timelogs.current && !timelogs.current.end) {
                await timelogs.update(timelogs.current.id, {
                    end: Date.now(),
                });
            }
            await timelogs.setCurrent(id);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [timelogs.current, timelogs.setCurrent, timelogs.update]
    );

    const addTimelog = useCallback<TimeTracker.Add<Timelog>>(
        async (data) => {
            const added = await timelogs.add(data);
            if (!added) return null;
            await setCurrentTimelog(added.id);
            return added;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [timelogs.add, setCurrentTimelog]
    );

    const timelogsValue = useMemo<TimeTracker.Context<Timelog>>(
        () => ({
            ...timelogs,
            setCurrent: setCurrentTimelog,
            add: addTimelog,
        }),
        [timelogs, setCurrentTimelog, addTimelog]
    );

    const removeProject = useCallback<TimeTracker.Remove<Project>>(
        async (id) => {
            const removed = await projects.remove(id);
            if (!removed) return null;
            await tasks.load();
            await timelogs.load();
            return removed;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [projects.remove, tasks.load, timelogs.load]
    );
    const removeTask = useCallback<TimeTracker.Remove<Task>>(
        async (id) => {
            const removed = await tasks.remove(id);
            if (!removed) return null;
            await timelogs.load();
            return removed;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [tasks.remove, timelogs.load]
    );

    const projectsValue = useMemo<TimeTracker.Context<Project>>(
        () => ({ ...projects, remove: removeProject }),
        [projects, removeProject]
    );
    const tasksValue = useMemo<TimeTracker.Context<Task>>(
        () => ({ ...tasks, remove: removeTask }),

        [tasks, removeTask]
    );

    useEffect(() => {
        if (
            users.loaded &&
            projects.loaded &&
            users.current?.id !== projects.current?.userId
        ) {
            projects.setCurrent(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        users.loaded,
        users.current,
        projects.loaded,
        projects.current,
        projects.setCurrent,
    ]);

    useEffect(() => {
        if (
            projects.loaded &&
            tasks.loaded &&
            projects.current?.id !== tasks.current?.projectId
        ) {
            tasks.setCurrent(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        projects.loaded,
        projects.current,
        tasks.loaded,
        tasks.current,
        tasks.setCurrent,
    ]);

    useEffect(() => {
        users.load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if (!users.current?.id) return;
        const userId = users.current.id;
        projects.load({ userId });
        tasks.load({ userId });
        timelogs.load({ userId });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [users.current?.id]);

    return (
        <UsersContext.Provider value={users}>
            <ProjectsContext.Provider value={projectsValue}>
                <TasksContext.Provider value={tasksValue}>
                    <TimelogsContext.Provider value={timelogsValue}>
                        {!users.loaded ? <LoadingOverlay /> : props.children}
                    </TimelogsContext.Provider>
                </TasksContext.Provider>
            </ProjectsContext.Provider>
        </UsersContext.Provider>
    );
}
