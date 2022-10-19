import type { Project, Task, Timelog } from '@/context/TimeTracker/types';
import axios, { AxiosError } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { isStr } from 'x-is-type/callbacks';

export type ApiRoute = 'projects' | 'tasks' | 'timelogs';
export type ApiReturnType<T extends ApiRoute> = T extends 'projects'
    ? Project
    : T extends 'tasks'
    ? Task
    : Timelog;

export type ApiRouteHandler = ReturnType<typeof createRouteHandler>;

const API_BASE_URL = 'http://localhost:3000';

function createRouteHandler<R extends ApiRoute, T extends ApiReturnType<R>>(
    route: R
) {
    const baseURL = `${API_BASE_URL}/${route}`;

    const handleError = <D>(err: AxiosError<T, D> | unknown) => {
        if (!axios.isAxiosError(err) || err.code === 'ERR_CANCELED') {
            return null;
        }
        console.log(err);
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
                    isStr(id) ? `${baseURL}/${id}` : baseURL,
                    {
                        signal,
                    }
                );
                return res?.data || null;
            } catch (err: AxiosError<T> | unknown) {
                return handleError(err);
            }
        },
        async post(data: Omit<T, 'id'>, signal?: AbortSignal) {
            try {
                const res = await axios.post<T>(
                    baseURL,
                    { id: uuidv4(), ...data } as T,
                    { signal }
                );
                return res?.data || null;
            } catch (err: AxiosError<T, T> | unknown) {
                return handleError(err);
            }
        },
        async patch(
            id: T['id'],
            data: Partial<Omit<T, 'id'>>,
            signal?: AbortSignal
        ) {
            try {
                const res = await axios.patch<T>(`${baseURL}/${id}`, data, {
                    signal,
                });
                return res?.data || null;
            } catch (err: AxiosError<T, T> | unknown) {
                return handleError(err);
            }
        },
        async delete(id: T['id'], signal?: AbortSignal) {
            try {
                const res = await axios.delete(`${baseURL}/${id}`, { signal });
                return res.statusText === 'OK';
            } catch (err: AxiosError<T> | unknown) {
                return !!handleError(err);
            }
        },
    };
}

const api: Record<ApiRoute, ApiRouteHandler> = {
    projects: createRouteHandler('projects'),
    tasks: createRouteHandler('tasks'),
    timelogs: createRouteHandler('timelogs'),
};

export default api;
