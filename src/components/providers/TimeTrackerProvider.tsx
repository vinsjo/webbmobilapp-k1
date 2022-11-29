import React, { useCallback, useEffect, useMemo } from 'react';
import {
    UsersContext,
    ProjectsContext,
    TasksContext,
    TimelogsContext,
} from '@/context/TimeTrackerContext';
import { useApiHandler } from '@/hooks';

type Props = {
    children: React.ReactNode;
    initialData?: Api.DbData;
};

export default function TimeTrackerProvider({ children, initialData }: Props) {
    const users = useApiHandler('users', initialData?.users);
    const projects = useApiHandler('projects', initialData?.projects);
    const tasks = useApiHandler('tasks', initialData?.tasks);
    const timelogs = useApiHandler('timelogs', initialData?.timelogs);
    // End selected timelog before updating selected timelog
    const setCurrentTimelog = useCallback<TimeTracker.Select<Timelog>>(
        async (id) => {
            const { selected } = timelogs;
            if (selected?.id === id) return;
            if (selected && !selected.end) {
                await timelogs.update({
                    id: selected.id,
                    end: Date.now(),
                });
            }
            await timelogs.setSelected(id);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [timelogs.selected, timelogs.setSelected, timelogs.update]
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
            setSelected: setCurrentTimelog,
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
            users.selected?.id !== projects.selected?.userId
        ) {
            projects.setSelected(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        users.loaded,
        users.selected,
        projects.loaded,
        projects.selected,
        projects.setSelected,
    ]);

    useEffect(() => {
        if (
            projects.loaded &&
            tasks.loaded &&
            projects.selected?.id !== tasks.selected?.projectId
        ) {
            tasks.setSelected(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        projects.loaded,
        projects.selected,
        tasks.loaded,
        tasks.selected,
        tasks.setSelected,
    ]);

    useEffect(() => {
        if (initialData?.users) return;
        users.load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialData]);
    useEffect(() => {
        if (!users.selected?.id) return;
        const userId = users.selected.id;
        projects.load({ userId });
        tasks.load({ userId });
        timelogs.load({ userId });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [users.selected?.id]);

    return (
        <UsersContext.Provider value={users}>
            <ProjectsContext.Provider value={projectsValue}>
                <TasksContext.Provider value={tasksValue}>
                    <TimelogsContext.Provider value={timelogsValue}>
                        {children}
                    </TimelogsContext.Provider>
                </TasksContext.Provider>
            </ProjectsContext.Provider>
        </UsersContext.Provider>
    );
}
