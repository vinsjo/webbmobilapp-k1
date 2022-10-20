import { createContext, useContext } from 'react';
import type { Project, Task, Timelog } from '@/utils/api';
import type { UseApiReturnType } from '@/hooks/useApiRoute';

export interface DefaultValue {
    projects: UseApiReturnType<Project> | { data: Timelog[] };
    tasks: UseApiReturnType<Task> | { data: Timelog[] };
    timelogs: UseApiReturnType<Timelog> | { data: Timelog[] };
}

const TimeTrackerContext = createContext<DefaultValue>({
    projects: { data: [] },
    tasks: { data: [] },
    timelogs: { data: [] },
});

export const useTimeTracker = () => useContext(TimeTrackerContext);
export default TimeTrackerContext;
