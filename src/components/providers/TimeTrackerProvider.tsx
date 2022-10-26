import React, { useCallback, useEffect, useMemo } from 'react';
import {
    ProjectsContext,
    TasksContext,
    TimelogsContext,
    type TimeTracker,
} from '@/context/TimeTracker';
import { type Api } from '@/utils/api';
import { useApiHandler } from '@/hooks';
import { Center, Text } from '@mantine/core';

export default function TimeTrackerProvider(props: React.PropsWithChildren) {
    const projects = useApiHandler('projects');
    const tasks = useApiHandler('tasks');
    const timelogs = useApiHandler('timelogs');

    const loaded = useMemo(
        () => projects.loaded && tasks.loaded && timelogs.loaded,
        [projects.loaded, tasks.loaded, timelogs.loaded]
    );

    // End selected timelog before updating selected timelog
    const setSelectedTimelog = useCallback<TimeTracker.Select<Api.Timelog>>(
        async (id) => {
            if (timelogs.selected?.id === id) return;
            await (() =>
                timelogs.selected &&
                !timelogs.selected.end &&
                timelogs.update(timelogs.selected.id, {
                    end: Date.now(),
                }))();
            await timelogs.setSelected(id);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [timelogs.selected, timelogs.setSelected, timelogs.update]
    );

    const addTimelog = useCallback<TimeTracker.Add<Api.Timelog>>(
        async (data, signal) => {
            const added = await timelogs.add(data, signal);
            if (added) await setSelectedTimelog(added.id);
            return added;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [timelogs.add, setSelectedTimelog]
    );

    const timelogsValue = useMemo<TimeTracker.Context<Api.Timelog>>(
        () => ({
            ...timelogs,
            setSelected: setSelectedTimelog,
            add: addTimelog,
        }),
        [timelogs, setSelectedTimelog, addTimelog]
    );

    useEffect(() => {
        if (!loaded || projects.selected?.id === tasks.selected?.projectId) {
            return;
        }
        tasks.setSelected(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loaded, projects.selected, tasks.selected, tasks.setSelected]);

    useEffect(() => {
        if (!loaded || tasks.selected?.id === timelogs.selected?.taskId) {
            return;
        }
        setSelectedTimelog(null);
    }, [loaded, tasks.selected, timelogs.selected, setSelectedTimelog]);

    useEffect(() => {
        projects.load();
        tasks.load();
        timelogs.load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ProjectsContext.Provider value={projects}>
            <TasksContext.Provider value={tasks}>
                <TimelogsContext.Provider value={timelogsValue}>
                    {!loaded ? (
                        <Center sx={{ height: '100vh' }}>
                            <Text>Loading...</Text>
                        </Center>
                    ) : (
                        props.children
                    )}
                </TimelogsContext.Provider>
            </TasksContext.Provider>
        </ProjectsContext.Provider>
    );
}
