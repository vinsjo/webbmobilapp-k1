import { useContext as useReactContext, useMemo } from 'react';

/**
 * Create a hook TimeTracker.Context hook, with optional selector callback
 * (inspired by {@link https://github.com/pmndrs/zustand zustand})
 */
export default function createContextHook<T>(
    context: React.Context<T | null>,
    name?: string
) {
    function useContext(): T;
    function useContext<R = T>(selector: (state: T) => R): R;
    function useContext<R = T>(selector?: (state: T) => R) {
        const state = useReactContext(context);
        if (state === null) {
            throw new Error(
                name
                    ? `use${name} is being used outside of ${name}Context Provider`
                    : 'Context hook is being used outside of corresponding Context Provider'
            );
        }
        return useMemo(() => {
            return (
                typeof selector !== 'function' ? state : selector(state)
            ) as R;
        }, [selector, state]);
    }
    return useContext;
}
