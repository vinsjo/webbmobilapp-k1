import axios, { AxiosError } from 'axios';
import { isNum } from 'x-is-type/callbacks';
import { Route, RouteType, RouteHandler } from './types';

const API_BASE_URL = 'http://localhost:4000';

const validRoutes: Route[] = ['projects', 'tasks', 'timelogs'];

export function createApiHandler<R extends Route, T extends RouteType<R>>(
    route: R
): RouteHandler<T> {
    if (!validRoutes.includes(route)) {
        throw `Invalid route: ${route}, valid routes are ${validRoutes
            .map((r) => `"${r}"`)
            .join(' | ')}`;
    }
    const baseURL = `${API_BASE_URL}/${route}`;

    const handleError = (err: AxiosError | unknown) => {
        if (!axios.isAxiosError(err) || err.code === 'ERR_CANCELED') {
            return null;
        }
        const status = (err.request?.status ||
            err.response?.status ||
            0) as number;
        throw `${status} - ${err.message}`;
    };

    return {
        async get<ID = T['id'] | null | undefined>(
            id?: ID,
            signal?: AbortSignal
        ) {
            try {
                const res = await axios.get<ID extends T['id'] ? T : T[]>(
                    isNum(id) ? `${baseURL}/${id}` : baseURL,
                    {
                        signal,
                    }
                );
                return res?.data || null;
            } catch (err: AxiosError | unknown) {
                return handleError(err);
            }
        },
        async post(data: Omit<T, 'id'>, signal?: AbortSignal) {
            try {
                const res = await axios.post<T>(baseURL, data, { signal });
                return res?.data || null;
            } catch (err: AxiosError | unknown) {
                return handleError(err);
            }
        },
        async patch(id: T['id'], data: Partial<T>, signal?: AbortSignal) {
            try {
                const res = await axios.patch<T>(`${baseURL}/${id}`, data, {
                    signal,
                });
                return res?.data || null;
            } catch (err: AxiosError | unknown) {
                return handleError(err);
            }
        },
        async delete(id: T['id'], signal?: AbortSignal) {
            try {
                const res = await axios.delete(`${baseURL}/${id}`, { signal });
                return res.status === 200;
            } catch (err: AxiosError | unknown) {
                handleError(err);
                return false;
            }
        },
    };
}
