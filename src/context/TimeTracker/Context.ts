import { createContext, useContext } from 'react';
import type { Project, Task } from './types';

export const defaultValue: {
    projects: Project[];
    tasks: Task[];
    error?: string | null;
} = {
    projects: [],
    tasks: [],
    error: null,
};

const TimeTrackerContext = createContext(defaultValue);

export const useTimeTracker = () => useContext(TimeTrackerContext);
export default TimeTrackerContext;
