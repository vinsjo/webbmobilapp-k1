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

export function addLeadingZeroes(num: number, length = 2, fixedLength = true) {
    const str = `${Math.round(num)}`;
    if (str.length >= length) {
        return fixedLength ? str.slice(0, length) : str;
    }
    return [...Array(length - str.length).fill(0), str].join('');
}

export function formatDuration(milliseconds: number | null) {
    return milliseconds === null
        ? '--:--:--'
        : dayjs.duration(milliseconds).format('HH:mm:ss');
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

export function objectKeyTypes<
    K extends keyof T,
    T = Record<string | number | symbol, unknown>
>(obj: T) {
    return objectKeys(obj).reduce((types, key) => {
        return { ...types, [key]: typeof obj[key] };
    }, {}) as Record<K, string>;
}
