import React, { useContext, useMemo } from 'react';
import { DataType } from '@/utils/api/types';

import { ProjectsContext, TasksContext, TimelogsContext } from './Context';
import { Context } from './types';

function createTimeTrackerHook<T extends DataType>(
    context: React.Context<Context<T>>
) {
    function useTimeTrackerContext<R = Context<T>>(): R;
    function useTimeTrackerContext<R = Context<T>>(
        selector: (state: Context<T>) => R
    ): R;
    /**
     * use TimeTrackerContext as a hook
     *
     * selector and equalityChecker inspired by zustand
     *
     * @param selector optional callback function accepting state as a value and returning any value.
     *  Preferably a memoized function to prevent unnessecary re-renders
     */
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
