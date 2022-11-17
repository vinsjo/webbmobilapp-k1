import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export function rand_int(max: number, min = 0) {
    if (typeof max !== 'number') return 0;
    return Math.floor(Math.random() * (max + 1 - min)) + min;
}
export function replaceAtIndex<T = unknown>(arr: T[], index: number, value: T) {
    if (index < 0) return arr;
    return [...arr.slice(0, index), value, ...arr.slice(index + 1)];
}

export function formatDuration(milliseconds: number | null) {
    return typeof milliseconds !== 'number'
        ? '--:--:--'
        : dayjs.duration(milliseconds).format('HH:mm:ss');
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

export function objectValues<
    K extends keyof T,
    T = Record<string | number | symbol, unknown>
>(obj: T) {
    if (!(obj instanceof Object)) return [];
    return Object.values(obj) as T[K][];
}
