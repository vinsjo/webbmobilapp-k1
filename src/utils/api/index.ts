export { createApiHandler as createRouteHandler };
import { objectEntries, objectValues } from '..';
import colors from './colors';
export { default as colors, defaultColor } from './colors';

import axios from 'axios';
import { isArr, isBool, isNum, isObj, isStr } from 'x-is-type';
import { isProject, isTask, isTimelog, isUser } from './validation';

const API_BASE_URL = 'https://ionized-lovely-copper.glitch.me/';

const validRoutes: Api.Route[] = ['users', 'projects', 'tasks', 'timelogs'];

export function createApiHandler<
    R extends Api.Route,
    T extends Api.InferTypeFromRoute<R>
>(route: R): Api.RequestHandler<T> {
    if (!validRoutes.includes(route)) {
        throw `Invalid route: ${route}, valid routes are ${validRoutes
            .map((r) => `"${r}"`)
            .join(' | ')}`;
    }
    const baseURL = `${API_BASE_URL}/${route}`;

    // temporary "handling" of errors
    const handleError = (err: unknown) => {
        if (!(err instanceof Error)) return null;
        if (!axios.isAxiosError(err)) {
            console.error(err.message);
            return null;
        }
        const status = (err.request?.status ||
            err.response?.status ||
            0) as number;
        throw `${status} - ${err.message}`;
    };

    const getQueryString = (query: Partial<T>) => {
        const values = objectEntries(query)
            .map(([key, value]) => {
                return isStr(key) &&
                    (isStr(value) || isNum(value) || isBool(value))
                    ? `${key}=${encodeURIComponent(value)}`
                    : '';
            })
            .filter((str) => !!str);
        return !values.length ? '' : `?${values.join('&')}`;
    };

    const isValid = (
        route === 'users'
            ? isUser
            : route === 'projects'
            ? isProject
            : route === 'tasks'
            ? isTask
            : isTimelog
    ) as (data: unknown) => data is T;

    const isValidArray = (data: unknown): data is T[] => {
        return isArr(data) && data.every(isValid);
    };

    return {
        async get(filter) {
            try {
                const url = `${baseURL}${
                    !isObj(filter) ? '' : getQueryString(filter)
                }`;
                const res = await axios.get<unknown>(url);
                if (!isValidArray(res.data)) {
                    throw new Error(`invalid GET response from ${url}`);
                }
                return res.data;
            } catch (err: unknown) {
                return handleError(err);
            }
        },
        async post(data: Omit<T, 'id'>) {
            try {
                const res = await axios.post<unknown>(baseURL, data);
                if (!isValid(res.data)) {
                    throw new Error(`invalid POST response from ${baseURL}`);
                }
                return res.data;
            } catch (err: unknown) {
                return handleError(err);
            }
        },
        async patch(id: T['id'], data: Partial<T>) {
            try {
                const url = `${baseURL}/${id}`;
                const res = await axios.patch<unknown>(url, data);
                if (!isValid(res.data)) {
                    throw new Error(`invalid PATCH response from ${url}`);
                }
                return res.data;
            } catch (err: unknown) {
                return handleError(err);
            }
        },
        async delete(id: T['id']) {
            try {
                const res = await axios.delete(`${baseURL}/${id}`);
                return res.status === 200;
            } catch (err: unknown) {
                handleError(err);
                return false;
            }
        },
    };
}

export function getTotalDuration(timelogs: Timelog[], onlySeconds = true) {
    if (!timelogs.length) return 0;
    return timelogs.reduce((sum, { start, end }) => {
        if (!start || !end) return sum;
        const diff = end - start;
        return (
            sum + (onlySeconds && diff ? Math.floor(diff / 1000) * 1000 : diff)
        );
    }, 0);
}

export function randomColor() {
    const values = objectValues(colors);
    return values[Math.floor(Math.random() * values.length)];
}
