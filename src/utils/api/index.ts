import createApiHandler from './createApiHandler';
export { default as colors, defaultColor } from './colors';
export * as validate from './validate';
import { API_URL } from '@/config';
import axios from 'axios';
import { isArr, isObj } from 'x-is-type';
import { isProject, isTask, isTimelog, isUser } from './validate';
export { createApiHandler };

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
        const onError = (type: string) => {
            return new Error(`Invalid ${type} from ${url}`);
        };
        const res = await axios.get<unknown>(url);
        if (!isObj(res.data)) throw onError('response');
        const { users, projects, tasks, timelogs } = res.data;
        if (!isArr(users) || !users.every(isUser)) {
            throw onError('user data');
        }
        if (!isArr(projects) || !projects.every(isProject)) {
            throw onError('project data');
        }
        if (!isArr(tasks) || !tasks.every(isTask)) {
            throw onError('task data');
        }
        if (!isArr(timelogs) || !timelogs.every(isTimelog)) {
            throw onError('timelog data');
        }
        return { users, projects, tasks, timelogs };
    } catch (err) {
        console.error(err instanceof Error ? err.message : err);
        return null;
    }
}
