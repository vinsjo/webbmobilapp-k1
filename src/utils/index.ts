import { isStr } from 'x-is-type/callbacks';
import { Timelog } from './api/types';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export const classNames = (...names: unknown[]) => {
    return names.filter((name) => name && isStr(name)).join(' ');
};

export function pick<
    T extends Record<string | number | symbol, unknown>,
    K extends keyof T
>(obj: T, ...keys: K[]) {
    return (
        !(obj instanceof Object)
            ? {}
            : keys.reduce((output, key) => {
                  if (!(key in obj)) return output;
                  return { ...output, [key]: obj[key] };
              }, {})
    ) as Pick<T, typeof keys[number]>;
}

export function replaceAtIndex<T = unknown>(arr: T[], index: number, value: T) {
    if (index < 0) return arr;
    return [...arr.slice(0, index), value, ...arr.slice(index + 1)];
}

export function omit<
    T extends Record<string | number | symbol, unknown>,
    K extends keyof T
>(obj: T, ...keys: K[]) {
    return (
        !(obj instanceof Object)
            ? {}
            : keys.reduce((output, key) => {
                  if (!(key in obj)) return output;
                  return { ...output, [key]: obj[key] };
              }, {})
    ) as Omit<T, typeof keys[number]>;
}

export function addLeadingZeroes(num: number, length = 2, fixedLength = true) {
    const str = `${Math.round(num)}`;
    if (str.length >= length) {
        return fixedLength ? str.slice(0, length) : str;
    }
    return [...Array(length - str.length).fill(0), str].join('');
}

export function convertElapsedTime(milliseconds: number) {
    let [ms, s, m, h] = Array(4).fill(0) as number[];
    if (milliseconds <= 0) return { h, m, s, ms };
    ms = milliseconds;
    if (ms >= 1000) {
        s = Math.floor(ms / 1000);
        ms -= s * 1000;
    }
    if (s >= 60) {
        m = Math.floor(s / 60);
        s -= m * 60;
    }
    if (m >= 60) {
        h = Math.floor(m / 60);
        m -= h * 60;
    }
    return { h, m, s, ms };
}

export function formatElapsedTime(
    milliseconds: number,
    includeMilliseconds = false
) {
    const { h, m, s, ms } = convertElapsedTime(milliseconds);
    const values = [h, m, s];
    if (includeMilliseconds) values.push(ms);
    return values.map((v) => addLeadingZeroes(v, 2)).join(':');
}

export function timelogsTotalDuration(
    timelogs: Timelog[],
    ignoreMilliseconds = true
) {
    if (!timelogs.length) return 0;
    return timelogs.reduce((sum, { start, end }) => {
        if (!start || !end) return sum;
        const diff = end - start;
        return (
            sum +
            (ignoreMilliseconds && diff ? Math.floor(diff / 1000) * 1000 : diff)
        );
    }, 0);
}

export function formatDuration(milliseconds: number, format?: string) {
    return dayjs.duration(milliseconds).format(format || 'HH:mm:ss');
}
