import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useLocalStorage } from '@mantine/hooks';
import { createApiHandler } from '@/utils/api';

export default function useApiHandler<
    R extends Api.Route,
    T extends Api.RouteType<R>
>(route: R, initialData?: T[]) {
    const handler = useRef<Api.RequestHandler<T>>(createApiHandler(route));
    const [data, setData] = useState<T[]>(initialData || []);
    const [loaded, setLoaded] = useState(!!initialData);
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

    const load = useCallback<TimeTracker.Load<T>>(async (filter) => {
        try {
            const data = await handler.current.get(filter);
            if (!data) return null;
            setData(data);
            return data;
        } catch (err) {
            if (typeof err === 'string') setError(err);
            return null;
        } finally {
            setLoaded(true);
        }
    }, []);

    const add = useCallback<TimeTracker.Add<T>>(async (data) => {
        try {
            const added = await handler.current.post(data);
            if (!added) return null;
            setData((prev) => [...prev, added]);
            return added;
        } catch (err) {
            if (typeof err === 'string') setError(err);
            return null;
        }
    }, []);

    const update = useCallback<TimeTracker.Update<T>>(async (data) => {
        try {
            const updated = await handler.current.patch(data);
            if (!updated) return null;
            setData((prev) =>
                prev.map((p) => (p.id !== data.id ? p : updated))
            );
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
            setData((prev) => prev.filter((p) => p.id !== id));
            return id;
        } catch (err) {
            if (typeof err === 'string') setError(err);
            return null;
        }
    }, []);

    useEffect(() => {
        if (error) console.error(error);
    }, [error]);

    useEffect(() => {
        if (data.length) setError(null);
    }, [data]);

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
            setSelected: setSelectedId,
        }),
        [
            data,
            error,
            add,
            update,
            remove,
            load,
            selected,
            setSelectedId,
            loaded,
        ]
    );
}
