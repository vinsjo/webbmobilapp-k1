import * as Api from './types';
import { createApiHandler } from './api';
export type { Api };
export { createApiHandler as createRouteHandler };
import { filterData } from '..';

export const colors = {
    red: '#bf4040',
    pink: '#bf406c',
    grape: '#a640bf',
    violet: '#6040bf',
    indigo: '#4059bf',
    blue: '#4082bf',
    cyan: '#40adbf',
    teal: '#40bf98',
    green: '#40bf58',
    lime: '#88bf40',
    yellow: '#bf8a40',
    orange: '#bf6c40',
};

export const defaultColor = colors.blue;

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

export function getNestedTasks(
    tasks: Api.Task[],
    timelogs: Api.Timelog[],
    filter?: ((task: Api.NestedTask) => unknown) | false
): Api.NestedTask[] {
    if (filter === false) return [];
    const nested = tasks.map((task) => {
        return {
            ...task,
            timelogs: filterData(timelogs, 'taskId', task.id),
        };
    });
    return typeof filter === 'function' ? nested.filter(filter) : nested;
}

export function getNestedProjects(
    projects: Api.Project[],
    tasks: Api.Task[],
    timelogs: Api.Timelog[],
    filters?: {
        projects?: ((project: Api.NestedProject) => unknown) | false;
        tasks?: ((task: Api.NestedTask) => unknown) | false;
        timelogs?: ((timelog: Api.Timelog) => unknown) | false;
    }
): Api.NestedProject[] {
    if (filters?.projects === false) return [];

    const logs =
        filters?.timelogs === false
            ? []
            : typeof filters?.timelogs === 'function'
            ? timelogs.filter(filters.timelogs)
            : timelogs;

    const output = projects.map((project) => {
        const projectLogs = filterData(logs, 'projectId', project.id);
        const projectTasks = filterData(tasks, 'projectId', project.id);
        return {
            ...project,
            tasks: getNestedTasks(projectTasks, projectLogs, filters?.tasks),
        };
    });

    return typeof filters?.projects === 'function'
        ? output.filter(filters.projects)
        : output;
}
