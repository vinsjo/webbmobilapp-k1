import type {
    Project,
    Task,
    ProjectWithTasks,
    RequestError,
} from '@/context/TimeTracker/types';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { isStr } from 'x-is-type/callbacks';

function handleError(err: AxiosError | any): { error: RequestError } | null {
    if (!axios.isAxiosError(err) || err.code === 'ERR_CANCELED') return null;
    const status = (err.request?.status || err.response?.status || 0) as number;
    const statusText = (err.request?.statusText || err.response?.statusText) as
        | string
        | undefined;
    return { error: { status, statusText, message: err.message } };
}

async function makeRequest<T = unknown, D = unknown>(
    config: AxiosRequestConfig<D>
) {
    try {
        const res = await axios<T>(config);
        return res;
    } catch (err: AxiosError | any) {
        return handleError(err);
    }
}

const baseURL = 'http://localhost:3000';

const [GET, DELETE] = ['get', 'delete'].map((method) => {
    return <T = unknown>(url: string, signal?: AbortSignal) => {
        return makeRequest<T>({ method, baseURL, url, signal });
    };
});

const [POST, PUT, PATCH] = ['post', 'put', 'patch'].map((method) => {
    return <T = unknown, D = unknown>(
        url: string,
        data: D,
        signal?: AbortSignal
    ) => {
        return makeRequest<T, D>({
            method,
            baseURL,
            url,
            data,
            signal,
        });
    };
});

const projects = (() => {
    const basePath = `/projects`;
    const getURL = <I>(id?: I, query?: string) => {
        let url = basePath;
        if (typeof id === 'string') url += `/${id}`;
        if (typeof query === 'string') url += `?${query}`;
        return url;
    };
    return {
        async get<I = unknown>(id?: I, signal?: AbortSignal) {
            const res = await GET<
                I extends Project['id'] ? Project : Project[]
            >(getURL(id), signal);
            if (!res) return null;
            if ('error' in res) {
                throw res.error;
            }
            return res.data;
        },
        async getWithTasks<I = null>(id?: I, signal?: AbortSignal) {
            const res = await GET<
                I extends Project['id'] ? ProjectWithTasks : ProjectWithTasks[]
            >(getURL(id, '_embed=tasks'), signal);
            if (!res) return null;
            if ('error' in res) {
                throw res.error;
            }
            return res.data;
        },
    };
})();

const api = {
    projects,
};

export default api;
