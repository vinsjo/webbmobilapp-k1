import axios, { AxiosError } from 'axios';
import * as uuid from 'uuid';
import { isStr } from 'x-is-type/callbacks';

export interface Project {
    id: string;
    name: string;
    color: string | null;
}
export interface Task {
    id: string;
    projectId: Project['id'];
    title: string;
}
export interface Timelog {
    id: string;
    taskId: Task['id'];
    projectId: Project['id'];
    start: number;
    end: number;
}

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

    const handleError = (err: AxiosError | unknown) => {
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
        get baseURL() {
            return baseURL;
        },
        get errorHandler() {
            return handleError;
        },
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
            } catch (err: AxiosError | unknown) {
                return handleError(err);
            }
        },
        async post(data: Omit<T, 'id'>, signal?: AbortSignal) {
            try {
                const res = await axios.post<T>(
                    baseURL,
                    { id: uuid.v4(), ...data } as T,
                    { signal }
                );
                return res?.data || null;
            } catch (err: AxiosError | unknown) {
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
            } catch (err: AxiosError | unknown) {
                return handleError(err);
            }
        },
        async delete(id: T['id'], signal?: AbortSignal) {
            try {
                const res = await axios.delete(`${baseURL}/${id}`, { signal });
                return res.statusText === 'OK';
            } catch (err: AxiosError | unknown) {
                handleError(err);
                return false;
            }
        },
        async where<K extends keyof T, V extends T[K]>(
            key: K,
            value: V,
            signal?: AbortSignal
        ) {
            try {
                const url = `${baseURL}?${key as string}=${value}`;
                const res = await axios.get(url, { signal });
                return res?.data || null;
            } catch (err: AxiosError | unknown) {
                return handleError(err);
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
