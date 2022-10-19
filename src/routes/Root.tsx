import { useCallback, useMemo, useState, useEffect, useReducer } from 'react';
import useAxios from '@vinsjo/use-axios';
import {
    TimeTrackerContext,
    defaultValue,
    type TimeTracker,
} from '@/context/TimeTracker';
import { Outlet } from 'react-router-dom';

import api from '@/utils/api';

type Action =
    | {
          type: 'projects';
          data: TimeTracker.Project[];
      }
    | { type: 'tasks'; data: TimeTracker.Task[] }
    | { type: 'timelogs'; data: TimeTracker.Timelog[] }
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
            case 'timelogs':
                return { ...prevState, timelogs: data };
            case 'error':
                return { ...prevState, error: data };
            default:
                return prevState;
        }
    }, defaultValue);

    useEffect(() => {
        const controller = new AbortController();
        api.get<TimeTracker.Project[]>('/projects', controller).then((res) => {
            if (!res) return;
            dispatch({ type: 'projects', data: res.data });
        });
        return () => controller.abort();
    }, []);
    useEffect(() => {
        const controller = new AbortController();
        api.get<TimeTracker.Task[]>('/tasks', controller).then((res) => {
            if (!res) return;
            dispatch({ type: 'tasks', data: res.data });
        });
        return () => controller.abort();
    }, []);
    useEffect(() => {
        const controller = new AbortController();
        api.get<TimeTracker.Timelog[]>('/timelog', controller).then((res) => {
            if (!res) return;
            dispatch({ type: 'timelogs', data: res.data });
        });
        return () => controller.abort();
    }, []);

    return (
        <TimeTrackerContext.Provider value={state}>
            <Outlet />
        </TimeTrackerContext.Provider>
    );
};

export default Root;
