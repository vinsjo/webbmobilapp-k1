import { isStr } from 'x-is-type/callbacks';

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

export function addLeadingZeroes(num: number, length = 2) {
    const str = `${Math.round(num)}`;
    if (str.length >= length) return str;
    return [...Array(length - str.length).fill(0), str].join('');
}

export function convertElapsedTime(milliseconds: number) {
    let [s, m, h] = Array(4).fill(0) as number[];
    if (milliseconds <= 0) return { h, m, s };
    s = Math.floor(milliseconds / 1000);
    if (s >= 60) {
        m = Math.floor(s / 60);
        s -= m * 60;
    }
    if (m >= 60) {
        h = Math.floor(m / 60);
        m -= h * 60;
    }
    return { h, m, s };
}
