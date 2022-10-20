import { createContext, useContext } from 'react';
import type { Project, Task, Timelog } from '@/utils/api';

export interface TimeTrackerValue<T extends Project | Task | Timelog> {
    data: T[];
    error: string | null;
    add: (data: Omit<T, 'id'>) => Promise<boolean>;
    update: (id: T['id'], data: Partial<Omit<T, 'id'>>) => Promise<boolean>;
    delete: (id: T['id']) => Promise<boolean>;
}

const dummyContextValue = <
    T extends Project | Task | Timelog
>(): TimeTrackerValue<T> => {
    return {
        data: [] as T[],
        error: null,
        add: async () => false,
        update: async () => false,
        delete: async () => false,
    };
};

const TimeTrackerContext = createContext<{
    projects: TimeTrackerValue<Project>;
    tasks: TimeTrackerValue<Task>;
    timelogs: TimeTrackerValue<Timelog>;
}>({
    projects: dummyContextValue<Project>(),
    tasks: dummyContextValue<Task>(),
    timelogs: dummyContextValue<Timelog>(),
});

export const useTimeTracker = () => useContext(TimeTrackerContext);

export default TimeTrackerContext;
