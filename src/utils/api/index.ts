import * as Api from './types';
import api from './api';
export default api;
export type { Api };
import { filterData } from '..';

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
    filter?: (task: Api.NestedTask) => unknown
): Api.NestedTask[] {
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
        project?: (project: Api.NestedProject) => unknown;
        task?: (task: Api.NestedTask) => unknown;
    }
): Api.NestedProject[] {
    const nested = projects.map((project) => {
        const projectTimelogs = filterData(timelogs, 'projectId', project.id);
        const projectTasks = filterData(tasks, 'projectId', project.id);
        return {
            ...project,
            tasks: getNestedTasks(projectTasks, projectTimelogs, filters?.task),
        };
    });
    return typeof filters?.project === 'function'
        ? nested.filter(filters.project)
        : nested;
}
