import { createContext, useContext } from 'react';
import type { TimeTracker } from './types';

export const defaultValue: {
    projects: TimeTracker.Project[];
    tasks: TimeTracker.Task[];
    timelogs: TimeTracker.Timelog[];
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
