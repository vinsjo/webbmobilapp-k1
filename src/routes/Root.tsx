import { useCallback, useMemo, useState, useEffect, useReducer } from 'react';
import { TimeTrackerContext, defaultValue } from '@/context/TimeTracker';
import type { Project, Task } from '@/context/TimeTracker/types';
import { Outlet } from 'react-router-dom';

import api from '@/utils/api';

type Action =
    | {
          type: 'projects';
          data: Project[];
      }
    | { type: 'tasks'; data: Task[] }
    | { type: 'error'; data: string | null };

type State = typeof defaultValue;

const Root = () => {
    const [state, dispatch] = useReducer((prevState: State, action: Action) => {
        const { type, data } = action;
        switch (type) {
            case 'projects':
                return { ...prevState, projects: data };
            case 'tasks':
                return { ...prevState, tasks: data };
            case 'error':
                return { ...prevState, error: data };
            default:
                return prevState;
        }
    }, defaultValue);

    useEffect(() => {
        const controller = new AbortController();
        api.projects
            .getWithTasks('1', controller.signal)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.error(err);
            });
        return () => controller.abort();
    }, []);

    // useEffect(() => {
    //     const controller = new AbortController();
    //     api.get<Project[]>('/projects', controller).then((res) => {
    //         if (!res) return;
    //         dispatch({ type: 'projects', data: res.data });
    //     });
    //     return () => controller.abort();
    // }, []);
    // useEffect(() => {
    //     const controller = new AbortController();
    //     api.get<Task[]>('/tasks', controller).then((res) => {
    //         if (!res) return;
    //         dispatch({ type: 'tasks', data: res.data });
    //     });
    //     return () => controller.abort();
    // }, []);
    // useEffect(() => {
    //     const controller = new AbortController();
    //     api.get<Timelog[]>('/timelog', controller).then((res) => {
    //         if (!res) return;
    //         dispatch({ type: 'timelogs', data: res.data });
    //     });
    //     return () => controller.abort();
    // }, []);

    return (
        <TimeTrackerContext.Provider value={state}>
            <Outlet />
        </TimeTrackerContext.Provider>
    );
};

export default Root;
