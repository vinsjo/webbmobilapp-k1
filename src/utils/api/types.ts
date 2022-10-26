export interface Project {
    id: number;
    name: string;
    color: string | null;
}
export interface Task {
    id: number;
    projectId: Project['id'];
    title: string;
}
export interface Timelog {
    id: number;
    taskId: Task['id'];
    projectId: Project['id'];
    /** Timelog start time as a unix timestamp */
    start: number;
    /** Timelog end time as a unix timestamp, or 0 if Timelog is not ended */
    end: number;
}

export interface NestedTask extends Task {
    timelogs: Timelog[];
}
export interface NestedProject extends Project {
    tasks: NestedTask[];
}

export type DataType = Project | Task | Timelog;
export type Route = 'projects' | 'tasks' | 'timelogs';
export type RouteType<T extends Route> = T extends 'projects'
    ? Project
    : T extends 'tasks'
    ? Task
    : Timelog;

export interface RouteHandler<T extends DataType> {
    get<ID = T['id']>(
        id?: ID,
        signal?: AbortSignal
    ): Promise<(ID extends T['id'] ? T : T[]) | null>;
    post(data: Omit<T, 'id'>, signal?: AbortSignal): Promise<T | null>;
    patch(
        id: T['id'],
        data: Partial<T>,
        signal?: AbortSignal
    ): Promise<T | null>;
    delete(id: T['id'], signal?: AbortSignal): Promise<boolean>;
    where<K extends keyof T, V extends T[K]>(
        key: K,
        value: V,
        signal?: AbortSignal
    ): Promise<T[] | null>;
}
