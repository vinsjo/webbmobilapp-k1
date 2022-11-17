import React, { useContext, useMemo } from 'react';
import {
    UsersContext,
    ProjectsContext,
    TasksContext,
    TimelogsContext,
} from './Context';

/**
 * Create a hook TimeTracker.Context hook, with optional selector callback
 * (inspired by {@link https://github.com/pmndrs/zustand zustand})
 */
function createTimeTrackerHook<T extends Api.Data>(
    context: React.Context<TimeTracker.Context<T> | null>
) {
    function useTimeTrackerContext(): TimeTracker.Context<T>;
    function useTimeTrackerContext<R = TimeTracker.Context<T>>(
        selector: (state: TimeTracker.Context<T>) => R
    ): R;
    function useTimeTrackerContext<R = TimeTracker.Context<T>>(
        selector?: (state: TimeTracker.Context<T>) => R
    ) {
        const state = useContext(context);
        if (state === null) {
            throw new Error('useContext is outside Context Provider');
        }
        return useMemo(() => {
            return (
                typeof selector !== 'function' ? state : selector(state)
            ) as R;
        }, [selector, state]);
    }
    return useTimeTrackerContext;
}

export const useUsers = createTimeTrackerHook(UsersContext);
export const useProjects = createTimeTrackerHook(ProjectsContext);
export const useTasks = createTimeTrackerHook(TasksContext);
export const useTimelogs = createTimeTrackerHook(TimelogsContext);
