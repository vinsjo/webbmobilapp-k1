import React, { useContext, useMemo } from 'react';
import { DataType } from '@/utils/api/types';

import { ProjectsContext, TasksContext, TimelogsContext } from './Context';
import { Context } from './types';

function createTimeTrackerHook<T extends DataType>(
    context: React.Context<Context<T>>
) {
    function useTimeTrackerContext(): Context<T>;
    function useTimeTrackerContext<R>(selector: (state: Context<T>) => R): R;
    function useTimeTrackerContext<R = Context<T>>(
        selector?: (state: Context<T>) => R
    ) {
        const state = useContext(context);
        return useMemo<R>(() => {
            return (
                typeof selector !== 'function' ? state : selector(state)
            ) as R;
        }, [state, selector]);
    }
    return useTimeTrackerContext;
}

const useProjects = createTimeTrackerHook(ProjectsContext);
const useTasks = createTimeTrackerHook(TasksContext);
const useTimelogs = createTimeTrackerHook(TimelogsContext);

export { useProjects, useTasks, useTimelogs };
