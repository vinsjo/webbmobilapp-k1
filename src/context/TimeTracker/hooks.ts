import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { DataType } from '@/utils/api/types';

import { ProjectsContext, TasksContext, TimelogsContext } from './Context';
import { Context } from './types';

function createTimeTrackerHook<T extends DataType>(
    context: React.Context<Context<T>>
) {
    function useTimeTrackerContext(): Context<T>;
    function useTimeTrackerContext<R>(selector: (state: Context<T>) => R): R;
    function useTimeTrackerContext<R = Context<T>>(
        selector: (state: Context<T>) => R,
        equalityChecker: (prev: Context<T>, current: Context<T>) => boolean
    ): R;
    /**
     * use TimeTrackerContext as a hook
     * 
     * selector and equalityChecker inspired by zustand
     *
     * @param selector optional callback function accepting state as a value and returning any value.
     *  Preferably a memoized function to prevent unnessecary re-renders
     * @param equalityChecker optional callback accepting previous state and current state.
        should return false if output should be updated
     */
    function useTimeTrackerContext<R = Context<T>>(
        selector?: ((state: Context<T>) => R) | null,
        equalityChecker?: (prev: Context<T>, current: Context<T>) => boolean
    ) {
        const checker = useRef(equalityChecker);
        const state = useContext(context);
        const prevState = useRef(state);

        const getOutput = useCallback(
            () =>
                (typeof selector !== 'function' ? state : selector(state)) as R,
            [state, selector]
        );

        const [output, setOutput] = useState(getOutput);

        useEffect(() => {
            if (state === prevState.current) return;
            const prev = prevState.current;
            prevState.current = state;
            if (
                typeof checker.current === 'function' &&
                checker.current(prev, state)
            ) {
                return;
            }
            setOutput(getOutput());
        }, [getOutput, state, prevState]);

        return output;
    }
    return useTimeTrackerContext;
}

export const useProjects = createTimeTrackerHook(ProjectsContext);
export const useTasks = createTimeTrackerHook(TasksContext);
export const useTimelogs = createTimeTrackerHook(TimelogsContext);
