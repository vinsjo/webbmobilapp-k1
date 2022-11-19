import { isNum, isObj, isStr, isUndef } from 'x-is-type';

export const isUser: Api.Validator<User> = (data): data is User => {
    if (!isObj(data)) return false;
    const { id, name } = data;
    return isNum(id) && isStr(name);
};

export const isProject: Api.Validator<Project> = (data): data is Project => {
    if (!isObj(data)) return false;
    const { id, userId, name, color, hourlyRate } = data;
    return (
        [id, userId].every(isNum) &&
        [name, color].every(isStr) &&
        (isUndef(hourlyRate) || isNum(hourlyRate))
    );
};

export const isTask: Api.Validator<Task> = (data): data is Task => {
    if (!isObj(data)) return false;
    const { id, userId, projectId, title } = data;
    return [id, userId, projectId].every(isNum) && isStr(title);
};

export const isTimelog: Api.Validator<Timelog> = (data): data is Timelog => {
    if (!isObj(data)) return false;
    const { id, userId, projectId, taskId, start, end } = data;
    return [id, userId, projectId, taskId, start, end].every(isNum);
};
