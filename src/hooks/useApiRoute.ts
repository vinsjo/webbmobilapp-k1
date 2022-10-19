import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import api, { type ApiRoute, ApiReturnType } from '@/utils/api';
import { replaceAtIndex } from '@/utils';

export default function useApiRoute<
    R extends ApiRoute,
    T extends ApiReturnType<R>
>(route: R) {
    const handler = useRef<typeof api[R]>(api[route]);
    const [data, setData] = useState<T[]>([]);
    const [error, setError] = useState<string | null>(null);

    const add = useCallback(async (data: Omit<T, 'id'>) => {
        if (!handler.current) return;
        try {
            const added = await handler.current.post(data);
            if (!added) return;
            setData((prev) => [...prev, added as T]);
        } catch (err) {
            console.error(err);
        }
    }, []);

    const update = useCallback(
        async (id: T['id'], data: Partial<Omit<T, 'id'>>) => {
            if (!handler.current) return;
            try {
                const updated = await handler.current.patch(id, data);
                if (!updated) return;
                setData((prev) => {
                    const i = prev.findIndex((data) => data.id === id);
                    return replaceAtIndex(prev, i, updated as T);
                });
            } catch (err) {
                console.error(err);
            }
        },
        []
    );

    const remove = useCallback(async (id: T['id']) => {
        if (!handler.current) return;
        try {
            const success = await handler.current.delete(id);
            if (!success) return;
            setData((prev) => prev.filter((data) => data.id !== id));
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        if (!handler.current) return;
        const controller = new AbortController();
        handler.current
            .get(null, controller.signal)
            .then((data) => {
                if (!data) return;
                setData(data as T[]);
            })
            .catch((err) => {
                if (err && typeof err === 'string') setError(err);
            });
        return () => controller.abort();
    }, []);

    return useMemo(
        () => ({ data, error, add, update, remove }),
        [data, error, add, update, remove]
    );
}
