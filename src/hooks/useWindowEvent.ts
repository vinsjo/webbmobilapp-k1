import { useEffect } from 'react';

/**
 * Use window event as a hook
 *
 * @param {keyof WindowEventMap} type type of event
 * @param listener callback to be executed when event is fired,
 * preferably a memoized function to prevent unnecessary re-renders
 */
export default function useWindowEvent<T extends keyof WindowEventMap>(
    type: T,
    listener: (this: Window, ev: WindowEventMap[T]) => unknown
) {
    useEffect(() => {
        if (typeof listener !== 'function') return;
        window.addEventListener(type, listener);
        return () => window.removeEventListener(type, listener);
    }, [type, listener]);
}
