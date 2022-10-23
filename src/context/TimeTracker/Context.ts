/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useContext, useMemo } from 'react';
import type { DataType, Project, Task, Timelog } from '@/utils/api/types';
import * as TimeTracker from './types';

const createTimeTrackerContext = <T extends DataType>() => {
    const initialValue: TimeTracker.Value<T> = {
        data: [],
        error: null,
        selected: null,
        setSelected: function (id: T['id'] | null): void {
            throw new Error('Function not implemented.');
        },
        add: function (data: Omit<T, 'id'>): Promise<T | null> {
            throw new Error('Function not implemented.');
        },
        update: function (id: T['id'], data: Partial<T>): Promise<T | null> {
            throw new Error('Function not implemented.');
        },
        delete: function (id: T['id']): Promise<T['id'] | null> {
            throw new Error('Function not implemented.');
        },
    };
    const TimeTrackerContext = createContext(initialValue);
    const useTimeTrackerContext = <R = TimeTracker.Value<T>>(
        selector?: (state: TimeTracker.Value<T>) => R
    ) => {
        const state = useContext(TimeTrackerContext);
        return useMemo(() => {
            return (
                typeof selector !== 'function' ? state : selector(state)
            ) as R;
        }, [state, selector]);
    };
    return [TimeTrackerContext, useTimeTrackerContext] as [
        typeof TimeTrackerContext,
        typeof useTimeTrackerContext
    ];
};

const [ProjectsContext, useProjects] = createTimeTrackerContext<Project>();
const [TasksContext, useTasks] = createTimeTrackerContext<Task>();
const [TimelogsContext, useTimelogs] = createTimeTrackerContext<Timelog>();

export {
    ProjectsContext,
    TasksContext,
    TimelogsContext,
    useProjects,
    useTasks,
    useTimelogs,
};
