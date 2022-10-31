import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useLocalStorage } from '@mantine/hooks';
import { replaceAtIndex } from '@/utils';
import { createRouteHandler, type Api } from '@/utils/api';
import type { TimeTracker } from '@/context/TimeTracker';

export default function useApiHandler<
    R extends Api.Route,
    T extends Api.RouteType<R>
>(route: R) {
    const handler = useRef<Api.RouteHandler<T>>(createRouteHandler(route));
    const [loaded, setLoaded] = useState(false);
    const [data, setData] = useState<T[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [selectedId, setSelectedId] = useLocalStorage<T['id'] | null>({
        key: `vinsjo-webbmobilapp-ks1-${route}-selected-id`,
        defaultValue: null,
    });

    const selected = useMemo<T | null>(
        () =>
            !selectedId
                ? null
                : data.find(({ id }) => id === selectedId) || null,
        [data, selectedId]
    );

    const load = useCallback<TimeTracker.Load<T>>(async () => {
        try {
            const data = ((await handler.current.get()) as T[]) || null;
            if (data) setData(data);
            setLoaded(true);
            return data;
        } catch (err) {
            if (typeof err === 'string') setError(err);
            return null;
        }
    }, []);

    const add = useCallback<TimeTracker.Add<T>>(async (data) => {
        if (!(data instanceof Object) || !Object.keys(data).length) {
            return null;
        }
        try {
            const added = (await handler.current.post(data)) as T | null;
            if (!added) return null;
            setData((prev) => [...prev, added]);
            return added;
        } catch (err) {
            if (typeof err === 'string') setError(err);
            return null;
        }
    }, []);

    const update = useCallback<TimeTracker.Update<T>>(async (id, data) => {
        if (!(data instanceof Object) || !Object.keys(data).length) {
            return null;
        }
        try {
            const updated = await handler.current.patch(id, data);
            if (!updated) return null;
            setData((prev) => {
                const i = prev.findIndex((data) => data.id === id);
                return replaceAtIndex(prev, i, updated as T);
            });
            return updated;
        } catch (err) {
            if (typeof err === 'string') setError(err);
            return null;
        }
    }, []);

    const remove = useCallback<TimeTracker.Remove<T>>(async (id) => {
        try {
            const success = await handler.current.delete(id);
            if (!success) return null;
            setData((prev) => prev.filter((data) => data.id !== id));
            return id;
        } catch (err) {
            if (typeof err === 'string') setError(err);
            return null;
        }
    }, []);

    const setSelected = useCallback<TimeTracker.Select<T>>(
        async (id) => {
            setSelectedId(id);
        },
        [setSelectedId]
    );

    useEffect(() => {
        if (error) console.error(error);
    }, [error]);

    useEffect(() => setError(null), [data]);

    return useMemo<TimeTracker.Context<T>>(
        () => ({
            data,
            error,
            loaded,
            load,
            add,
            update,
            remove,
            selected,
            setSelected,
        }),
        [data, error, add, update, remove, load, selected, setSelected, loaded]
    );
}
