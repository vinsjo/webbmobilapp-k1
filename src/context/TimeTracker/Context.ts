import { createContext, useContext } from 'react';
import type { Project, Task, Timelog } from '@/utils/api';

export interface TimeTrackerValue<T extends Project | Task | Timelog> {
    data: T[];
    error: string | null;
    selected: T | null;
    setSelected: (id: T['id'] | null) => void;
    add: (data: Omit<T, 'id'>) => Promise<boolean>;
    update: (id: T['id'], data: Partial<Omit<T, 'id'>>) => Promise<boolean>;
    delete: (id: T['id']) => Promise<boolean>;
}

export interface TimeTrackerContext {
    projects: TimeTrackerValue<Project>;
    tasks: TimeTrackerValue<Task>;
    timelogs: TimeTrackerValue<Timelog>;
}

const dummyContextValue = <
    T extends Project | Task | Timelog
>(): TimeTrackerValue<T> => {
    return {
        data: [] as T[],
        error: null,
        selected: null,
        setSelected: () => {
            return;
        },
        add: async () => false,
        update: async () => false,
        delete: async () => false,
    };
};

const initialValue: TimeTrackerContext = {
    projects: dummyContextValue<Project>(),
    tasks: dummyContextValue<Task>(),
    timelogs: dummyContextValue<Timelog>(),
};

const TimeTrackerContext = createContext<TimeTrackerContext>(initialValue);

export const useTimeTracker = () => useContext(TimeTrackerContext);

export default TimeTrackerContext;
