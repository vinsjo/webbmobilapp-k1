import { isStr } from 'x-is-type/callbacks';

export const classNames = (...names: unknown[]) => {
    return names.filter((name) => name && isStr(name)).join(' ');
};
