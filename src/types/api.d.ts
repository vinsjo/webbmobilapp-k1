declare namespace Api {
    type Data = User | Project | Task | Timelog;
    interface Routes {
        users: User;
        projects: Project;
        tasks: Task;
        timelogs: Timelog;
    }

    type Route = keyof Routes;

    type RouteType<T extends Route> = Routes[T];

    type Filter<T extends Data> = Partial<T>;

    type Validator<T extends Data> = (data: unknown) => data is T;
    interface RequestHandler<T extends Data> {
        get(filter?: Filter<T>): Promise<T[] | null>;
        post(data: Omit<T, 'id'>): Promise<T | null>;
        patch(
            data: { id: T['id'] } & Partial<Omit<T, 'id'>>
        ): Promise<T | null>;
        delete(id: T['id']): Promise<boolean>;
    }

    interface DbData {
        users: User[];
        projects: Project[];
        tasks: Task[];
        timelogs: Timelog[];
    }
}
