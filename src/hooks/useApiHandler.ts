import { useState, useMemo, useCallback, useEffect } from 'react';
import { isObj } from 'x-is-type/callbacks';
import { replaceAtIndex } from '@/utils';
import type { Api } from '@/utils/api';
import type { TimeTracker } from '@/context/TimeTracker';

export default function useApiHandler<T extends Api.DataType>(
    handler: Api.RouteHandler<T>
) {
    const [data, setData] = useState<T[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [selectedId, setSelectedId] = useState<null | T['id']>(null);

    const selected = useMemo<T | null>(() => {
        return data.find(({ id }) => id === selectedId) || null;
    }, [data, selectedId]);

    const setSelected = useCallback<TimeTracker.Select<T>>(async (id) => {
        setSelectedId(id);
    }, []);

    const load = useCallback<TimeTracker.Load<T>>(
        async (signal?: AbortSignal) => {
            try {
                const data = ((await handler.get(null, signal)) as T[]) || null;
                if (data) setData(data);
                return data;
            } catch (err) {
                if (typeof err === 'string') setError(err);
                return null;
            }
        },
        [handler]
    );

    const add = useCallback<TimeTracker.Add<T>>(
        async (data: Omit<T, 'id'>) => {
            if (!isObj(data) || !Object.keys(data).length) {
                return null;
            }
            try {
                const added = (await handler.post(data)) as T | null;
                if (!added) return null;
                setData((prev) => [...prev, added]);
                return added;
            } catch (err) {
                if (typeof err === 'string') setError(err);
                return null;
            }
        },
        [handler]
    );

    const update = useCallback<TimeTracker.Update<T>>(
        async (id: T['id'], data: Partial<T>) => {
            if (!isObj(data) || !Object.keys(data).length) {
                return null;
            }
            try {
                const updated = await handler.patch(id, data);
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
        },
        [handler]
    );

    const remove = useCallback<TimeTracker.Delete<T>>(
        async (id: T['id']) => {
            try {
                const success = await handler.delete(id);
                if (!success) return null;
                setData((prev) => prev.filter((data) => data.id !== id));
                return id;
            } catch (err) {
                if (typeof err === 'string') setError(err);
                return null;
            }
        },
        [handler]
    );

    useEffect(() => {
        if (error) console.error(error);
    }, [error]);

    useEffect(() => setError(null), [data]);

    return useMemo<TimeTracker.Context<T>>(
        () => ({
            data,
            error,
            load,
            add,
            update,
            delete: remove,
            selected,
            setSelected,
        }),
        [data, error, add, update, remove, load, selected, setSelected]
    );
}
