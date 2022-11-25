export { default as createApiHandler } from './createApiHandler';
export { default as colors, defaultColor } from './colors';
export * as validate from './validate';
import { API_URL } from './config';
import { isDbData } from './validate';
import axios from 'axios';

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

export async function getAllData(): Promise<Api.DbData | null> {
    try {
        const url = `${API_URL}/db`;
        const res = await axios.get<unknown>(url);
        const { data } = res;
        if (!isDbData(data)) throw `Invalid response from ${url}`;
        return data;
    } catch (err) {
        console.error(err instanceof Error ? err.message : err);
        return null;
    }
}
