import { useEffect, useRef } from 'react';

/**
 * Use window event as a hook
 *
 * @param type type of event
 * @param listener callback to be executed when event is fired,
 * preferably a memoized function to prevent unnecessary re-renders
 */
export default function useWindowEvent<T extends keyof WindowEventMap>(
    type: T,
    listener: (this: Window, ev: WindowEventMap[T]) => unknown,
    options?: boolean | EventListenerOptions
) {
    const optionsRef = useRef(options);
    useEffect(() => {
        if (typeof listener !== 'function') return;
        const options = optionsRef.current;
        window.addEventListener(type, listener, options);
        return () => window.removeEventListener(type, listener, options);
    }, [type, listener]);
}
