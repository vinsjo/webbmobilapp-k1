import React, { useCallback, useEffect, useMemo } from 'react';
import {
    UsersContext,
    ProjectsContext,
    TasksContext,
    TimelogsContext,
} from '@/context/TimeTracker';
import { useApiHandler } from '@/hooks';
import { LoadingOverlay } from '@mantine/core';

export default function TimeTrackerProvider(props: React.PropsWithChildren) {
    const users = useApiHandler('users');
    const projects = useApiHandler('projects');
    const tasks = useApiHandler('tasks');
    const timelogs = useApiHandler('timelogs');

    const loaded = useMemo(
        () =>
            users.loaded && projects.loaded && tasks.loaded && timelogs.loaded,
        [users.loaded, projects.loaded, tasks.loaded, timelogs.loaded]
    );

    // End selected timelog before updating selected timelog
    const setSelectedTimelog = useCallback<TimeTracker.Select<Timelog>>(
        async (id) => {
            if (timelogs.current?.id === id) return;
            await (() =>
                timelogs.current &&
                !timelogs.current.end &&
                timelogs.update(timelogs.current.id, {
                    end: Date.now(),
                }))();
            await timelogs.setCurrent(id);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [timelogs.current, timelogs.setCurrent, timelogs.update]
    );

    const addTimelog = useCallback<TimeTracker.Add<Timelog>>(
        async (data) => {
            const added = await timelogs.add(data);
            if (!added) return null;
            await setSelectedTimelog(added.id);
            return added;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [timelogs.add, setSelectedTimelog]
    );

    const timelogsValue = useMemo<TimeTracker.Context<Timelog>>(
        () => ({
            ...timelogs,
            setCurrent: setSelectedTimelog,
            add: addTimelog,
        }),
        [timelogs, setSelectedTimelog, addTimelog]
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
        if (!loaded || users.current?.id === projects.current?.userId) {
            return;
        }
        tasks.setCurrent(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loaded, users.current, projects.current, projects.setCurrent]);

    useEffect(() => {
        if (!loaded || projects.current?.id === tasks.current?.projectId) {
            return;
        }
        tasks.setCurrent(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loaded, projects.current, tasks.current, tasks.setCurrent]);

    useEffect(() => {
        if (!loaded || tasks.current?.id === timelogs.current?.taskId) {
            return;
        }
        setSelectedTimelog(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loaded, tasks.current, timelogs.current, setSelectedTimelog]);

    useEffect(() => {
        users.load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if (!users.current?.id) return;
        const userId = users.current.id;
        projects.load((project) => project.userId === userId);
        tasks.load((task) => task.userId === userId);
        timelogs.load((timelog) => timelog.userId === userId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [users.current?.id]);

    return (
        <UsersContext.Provider value={users}>
            <ProjectsContext.Provider value={projectsValue}>
                <TasksContext.Provider value={tasksValue}>
                    <TimelogsContext.Provider value={timelogsValue}>
                        <LoadingOverlay
                            visible={!users.loaded}
                            overlayBlur={2}
                        />
                        {props.children}
                    </TimelogsContext.Provider>
                </TasksContext.Provider>
            </ProjectsContext.Provider>
        </UsersContext.Provider>
    );
}
