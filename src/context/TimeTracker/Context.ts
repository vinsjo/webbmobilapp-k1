import { createContext, useContext } from 'react';
import type { Project, Task, Timelog } from './types';

export const defaultValue: {
    projects: Project[];
    tasks: Task[];
    timelogs: Timelog[];
    error?: string | null;
} = {
    projects: [],
    tasks: [],
    timelogs: [],
    error: null,
};

const TimeTrackerContext = createContext(defaultValue);
const useTimeTracker = () => useContext(TimeTrackerContext);
export default TimeTrackerContext;
export { useTimeTracker };
