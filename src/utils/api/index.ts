import * as Api from './types';
import { createApiHandler } from './api';
export type { Api };
export { createApiHandler as createRouteHandler };
import { objectKeys } from '..';
import Colors from './colors';
export { default as Colors, defaultColor } from './colors';

export function getTotalDuration(timelogs: Api.Timelog[], onlySeconds = true) {
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
    const keys = objectKeys(Colors);
    return keys[Math.floor(Math.random() * keys.length)];
}
