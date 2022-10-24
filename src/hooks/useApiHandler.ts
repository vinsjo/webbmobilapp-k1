import { useState, useMemo, useCallback } from 'react';
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
    const selected = useMemo(() => {
        if (!selectedId) return null;
        return data.find(({ id }) => id === selectedId) || null;
    }, [data, selectedId]);

    const validHandler = useMemo(() => {
        if (!isObj(handler)) return false;
        return (
            ['get', 'post', 'patch', 'delete', 'where'] as Array<
                keyof Api.RouteHandler<Api.DataType>
            >
        ).every((key) => {
            return key in handler && typeof handler[key] === 'function';
        });
    }, [handler]);

    const load = useCallback<TimeTracker.Load<T>>(
        async (signal?: AbortSignal) => {
            if (!validHandler) return null;
            try {
                const data = ((await handler.get(null, signal)) as T[]) || null;
                if (data) setData(data);
                return data;
            } catch (err) {
                if (typeof err === 'string') setError(err);
                return null;
            }
        },
        [handler, validHandler]
    );

    const add = useCallback<TimeTracker.Add<T>>(
        async (data: Omit<T, 'id'>) => {
            if (!validHandler || !isObj(data) || !Object.keys(data).length) {
                return null;
            }
            try {
                const added = (await handler.post(data)) as T | null;
                if (!added) return null;
                setData((prev) => [...prev, added]);
                return added;
            } catch (err) {
                console.error(err);
                return null;
            }
        },
        [handler, validHandler]
    );

    const update = useCallback<TimeTracker.Update<T>>(
        async (id: T['id'], data: Partial<T>) => {
            if (!validHandler || !isObj(data) || !Object.keys(data).length) {
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
                console.error(err);
                return null;
            }
        },
        [validHandler, handler]
    );

    const remove = useCallback<TimeTracker.Delete<T>>(
        async (id: T['id']) => {
            if (!validHandler) return null;
            try {
                const success = await handler.delete(id);
                if (!success) return null;
                setData((prev) => prev.filter((data) => data.id !== id));
                return id;
            } catch (err) {
                console.error(err);
                return null;
            }
        },
        [validHandler, handler]
    );

    return useMemo<TimeTracker.Context<T>>(
        () => ({
            data,
            error,
            load,
            add,
            update,
            delete: remove,
            selected,
            setSelected: setSelectedId,
        }),
        [data, error, add, update, remove, load, selected]
    );
}
