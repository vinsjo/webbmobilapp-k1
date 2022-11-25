declare namespace TimeTracker {
    type Load<T extends Api.Data> = (
        filter?: Api.Filter<T>
    ) => Promise<T[] | null>;

    type Add<T extends Api.Data> = (data: Omit<T, 'id'>) => Promise<T | null>;

    type Update<T extends Api.Data> = (
        id: T['id'],
        data: Partial<T>
    ) => Promise<T | null>;

    type Remove<T extends Api.Data> = (id: T['id']) => Promise<T['id'] | null>;

    type Select<T extends Api.Data> = (id: T['id'] | null) => Promise<void>;

    interface Context<T extends Api.Data> {
        data: T[];
        loaded: boolean;
        error: string | null;
        current: T | null;
        setCurrent: Select<T>;
        load: Load<T>;
        add: Add<T>;
        update: Update<T>;
        remove: Remove<T>;
    }
}
