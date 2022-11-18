import { isArr, isNum, isObj, isStr } from 'x-is-type';
import { objectValues } from '..';

export type TypeOf =
    | 'string'
    | 'number'
    | 'boolean'
    | 'object'
    | 'function'
    | 'symbol'
    | 'undefined';

export function isOneOfTypes(value: unknown, ...types: TypeOf[]) {
    return types.some((type) => typeof value === type);
}

export function isNumArray(values: unknown): values is number[] {
    return isArr(values) && values.every(isNum);
}

export function isStrArray(values: unknown): values is string[] {
    return isArr(values) && values.every(isStr);
}

export function isUser(data: unknown): data is User {
    if (!isObj(data)) return false;
    const { id, name } = data;
    return isNum(id) && isStr(name);
}

export function isUserArray(data: unknown): data is User[] {
    return isArr(data) && data.every(isUser);
}

export function isProject(data: unknown): data is Project {
    if (!isObj(data)) return false;
    const { id, userId, name, color, hourlyRate } = data;
    return (
        isNumArray([id, userId]) &&
        isStrArray([name, color]) &&
        isOneOfTypes(hourlyRate, 'undefined', 'number')
    );
}

export function isProjectArray(data: unknown): data is Project[] {
    return isArr(data) && data.every(isProject);
}

export function isTask(data: unknown): data is Task {
    if (!isObj(data)) return false;
    const { id, userId, projectId, title } = data;
    return isNumArray([id, userId, projectId]) && isStr(title);
}

export function isTaskArray(data: unknown): data is Task[] {
    return isArr(data) && data.every(isTask);
}

export function isTimelog(data: unknown): data is Timelog {
    if (!isObj(data)) return false;
    return isNumArray(objectValues(data));
}

export function isTimelogArray(data: unknown): data is Timelog[] {
    return isArr(data) && data.every(isTimelog);
}
