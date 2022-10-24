/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
} from 'react';
import type { DataType, Project, Task, Timelog } from '@/utils/api/types';
import { Context } from './types';
import { pick } from '@/utils';

const createTimeTrackerContext = <T extends DataType>() => {
    const initialValue: Context<T> = {
        data: [],
        error: null,
        selected: null,
        setSelected: function (id: T['id'] | null): void {
            throw new Error('Function not implemented.');
        },
        load: function (signal?: AbortSignal | undefined): Promise<T[] | null> {
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
        filter: function (callback: (data: T) => boolean): T[] {
            throw new Error('Function not implemented.');
        },
    };
    return createContext(initialValue);
};

export const ProjectsContext = createTimeTrackerContext<Project>();
export const TasksContext = createTimeTrackerContext<Task>();
export const TimelogsContext = createTimeTrackerContext<Timelog>();
