import axios from 'axios';
import { isArr, isBool, isNum, isObj, isStr } from 'x-is-type';
import { isProject, isTask, isTimelog, isUser } from './validate';
import { objectEntries } from '..';

const API_BASE_URL = 'https://ionized-lovely-copper.glitch.me';

export default function createApiHandler<
    R extends Api.Route,
    T extends Api.InferTypeFromRoute<R>
>(route: R): Api.RequestHandler<T> {
    const baseURL = `${API_BASE_URL}/${route}`;

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
    ) as Api.Validator<T>;

    return {
        async get(filter) {
            try {
                const url = `${baseURL}${
                    !isObj(filter) ? '' : getQueryString(filter)
                }`;
                const res = await axios.get<unknown>(url);
                if (!isArr(res.data)) {
                    throw new Error(`invalid GET response from ${url}`);
                }
                return res.data.filter(isValid);
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
