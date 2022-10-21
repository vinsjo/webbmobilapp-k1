import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { isObj } from 'x-is-type/callbacks';
import { replaceAtIndex } from '@/utils';
import api from '@/utils/api';
import type { ApiRoute, ApiRouteType } from '@/utils/api';
import type { TimeTrackerValue } from '@/context/TimeTracker';

export default function useApiRoute<
    R extends ApiRoute,
    T extends ApiRouteType<R>
>(route: R) {
    const handler = useRef(api[route]);
    const [data, setData] = useState<T[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<null | T['id']>(null);

    const updateData = useCallback(async (signal?: AbortSignal) => {
        if (!handler.current) return;
        try {
            const data = await handler.current.get(null, signal);
            if (data) setData(data as T[]);
        } catch (err) {
            if (typeof err === 'string') setError(err);
        }
    }, []);

    const selected = useMemo(() => {
        if (!selectedId) return null;
        return data.find(({ id }) => id === selectedId) || null;
    }, [data, selectedId]);

    const add = useCallback(async (data: Omit<T, 'id'>) => {
        if (!handler.current || !isObj(data) || !Object.keys(data).length) {
            return null;
        }
        try {
            const added = await handler.current.post(data);
            if (!added) return null;
            setData((prev) => [...prev, added as T]);
            return added.id;
        } catch (err) {
            console.error(err);
            return null;
        }
    }, []);

    const update = useCallback(
        async (id: T['id'], data: Partial<Omit<T, 'id'>>) => {
            if (!handler.current || !isObj(data) || !Object.keys(data).length) {
                return null;
            }
            try {
                const updated = await handler.current.patch(id, data);
                if (!updated) return null;
                setData((prev) => {
                    const i = prev.findIndex((data) => data.id === id);
                    return replaceAtIndex(prev, i, updated as T);
                });
                return id;
            } catch (err) {
                console.error(err);
                return null;
            }
        },
        []
    );

    const remove = useCallback(async (id: T['id']) => {
        if (!handler.current) return null;
        try {
            const success = await handler.current.delete(id);
            if (!success) return null;
            setData((prev) => prev.filter((data) => data.id !== id));
            return id;
        } catch (err) {
            console.error(err);
            return null;
        }
    }, []);

    useEffect(() => {
        if (!handler.current) return;
        const controller = new AbortController();
        updateData(controller.signal);
        return () => controller.abort();
    }, []);

    return useMemo<TimeTrackerValue<T>>(
        () => ({
            data,
            error,
            add,
            update,
            delete: remove,
            selected,
            setSelected: setSelectedId,
        }),
        [data, error, add, update, remove, selected]
    );
}
