import { isStr } from 'x-is-type/callbacks';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);
export * as TypeUtils from './types';

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

export function formatDuration(milliseconds: number, format?: string) {
    return dayjs.duration(milliseconds).format(format || 'HH:mm:ss');
}

export function getDurationValues(milliseconds: number) {
    if (!milliseconds || typeof milliseconds !== 'number')
        return {
            hours: 0,
            minutes: 0,
            seconds: 0,
        };
    const d = dayjs.duration(milliseconds);
    return {
        hours: d.hours(),
        minutes: d.minutes(),
        seconds: d.seconds(),
    };
}

export function durationString(milliseconds: number) {
    const values = getDurationValues(milliseconds);

    return objectKeys(values)
        .map((key) => {
            return !values[key] ? null : `${values[key]} ${key}s`;
        })
        .filter((v) => !v)
        .join(', ');
}

export function filterData<
    K extends keyof T,
    V extends T[K],
    T = Record<string, unknown>
>(data: T[], key: K, value: V, shouldEqual = true) {
    return data.filter((d) =>
        !shouldEqual ? d[key] !== value : d[key] === value
    );
}

export function objectKeys<
    K extends keyof T,
    T = Record<string | number | symbol, unknown>
>(obj: T) {
    if (!(obj instanceof Object)) return [];
    return Object.keys(obj) as K[];
}

export function objectEntries<
    K extends keyof T,
    T = Record<string | number | symbol, unknown>
>(obj: T) {
    if (!(obj instanceof Object)) return [];
    return Object.entries(obj) as [K, T[K]][];
}
