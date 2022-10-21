/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useContext } from 'react';
import type { ApiType, Project, Task, Timelog } from '@/utils/api';
import type { TimeTrackerValue } from './types';

const createTimeTrackerContext = <T extends ApiType>(): [
    React.Context<TimeTrackerValue<T>>,
    () => TimeTrackerValue<T>
] => {
    const initialValue: TimeTrackerValue<T> = {
        data: [],
        error: null,
        selected: null,
        setSelected: function (id: T['id'] | null): void {
            throw new Error('Function not implemented.');
        },
        add: function (data: Omit<T, 'id'>): Promise<T['id'] | null> {
            throw new Error('Function not implemented.');
        },
        update: function (
            id: T['id'],
            data: Partial<Omit<T, 'id'>>
        ): Promise<T['id'] | null> {
            throw new Error('Function not implemented.');
        },
        delete: function (id: T['id']): Promise<T['id'] | null> {
            throw new Error('Function not implemented.');
        },
    };
    const context = createContext(initialValue);
    return [context, () => useContext(context)];
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
