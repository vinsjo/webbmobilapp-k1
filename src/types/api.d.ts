declare namespace Api {
    type Data = User | Project | Task | Timelog;

    type Route = 'users' | 'projects' | 'tasks' | 'timelogs';

    type InferTypeFromRoute<T extends Route> = T extends 'users'
        ? User
        : T extends 'projects'
        ? Project
        : T extends 'tasks'
        ? Task
        : T extends 'timelogs'
        ? Timelog
        : never;

    type RouteType<T extends Route> = T extends 'projects'
        ? Project
        : T extends 'tasks'
        ? Task
        : Timelog;

    type Filter<T extends Data> = Partial<T>;
    interface RequestHandler<T extends Data> {
        get(filter?: Filter<T>): Promise<T[] | null>;
        post(data: Omit<T, 'id'>): Promise<T | null>;
        patch(id: T['id'], data: Partial<T>): Promise<T | null>;
        delete(id: T['id']): Promise<boolean>;
    }
}
