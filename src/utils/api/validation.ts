import { isNum, isObj, isStr, isUndef } from 'x-is-type';

export function isUser(data: unknown): data is User {
    if (!isObj(data)) return false;
    const { id, name } = data;
    return isNum(id) && isStr(name);
}

export function isProject(data: unknown): data is Project {
    if (!isObj(data)) return false;
    const { id, userId, name, color, hourlyRate } = data;
    return (
        [id, userId].every(isNum) &&
        [name, color].every(isStr) &&
        (isUndef(hourlyRate) || isNum(hourlyRate))
    );
}

export function isTask(data: unknown): data is Task {
    if (!isObj(data)) return false;
    const { id, userId, projectId, title } = data;
    return [id, userId, projectId].every(isNum) && isStr(title);
}

export function isTimelog(data: unknown): data is Timelog {
    if (!isObj(data)) return false;
    return Object.values(data).every(isNum);
}
