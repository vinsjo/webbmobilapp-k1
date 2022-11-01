import React, { useContext, useMemo } from 'react';
import { DataType } from '@/utils/api/types';

import { ProjectsContext, TasksContext, TimelogsContext } from './Context';
import { Context } from './types';

/**
 * Create a hook TimeTracker.Context hook, with optional selector callback
 * (inspired by {@link https://github.com/pmndrs/zustand zustand})
 */
function createTimeTrackerHook<T extends DataType>(
    context: React.Context<Context<T>>
) {
    function useTimeTrackerContext(): Context<T>;
    function useTimeTrackerContext<R = Context<T>>(
        selector: (state: Context<T>) => R
    ): R;
    function useTimeTrackerContext<R = Context<T>>(
        selector?: (state: Context<T>) => R
    ) {
        const state = useContext(context);

        return useMemo(() => {
            return (
                typeof selector !== 'function' ? state : selector(state)
            ) as R;
        }, [selector, state]);
    }
    return useTimeTrackerContext;
}

export const useProjects = createTimeTrackerHook(ProjectsContext);
export const useTasks = createTimeTrackerHook(TasksContext);
export const useTimelogs = createTimeTrackerHook(TimelogsContext);
