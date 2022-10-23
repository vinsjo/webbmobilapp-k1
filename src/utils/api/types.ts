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
    start: number;
    end: number | null;
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
