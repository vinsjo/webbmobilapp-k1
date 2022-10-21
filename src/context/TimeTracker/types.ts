import type { ApiType } from '@/utils/api';

export declare namespace TimeTracker {
    export type Add<T extends ApiType> = (
        data: Omit<T, 'id'>
    ) => Promise<T | null>;

    export type Update<T extends ApiType> = (
        id: T['id'],
        data: Partial<T>
    ) => Promise<T | null>;

    export type Delete<T extends ApiType> = (
        id: T['id']
    ) => Promise<T['id'] | null>;

    export type Select<T extends ApiType> = (id: T['id'] | null) => void;
    export interface Value<T extends ApiType> {
        data: T[];
        error: string | null;
        selected: T | null;
        setSelected: Select<T>;
        add: Add<T>;
        update: Update<T>;
        delete: Delete<T>;
    }
}

export interface TimeTrackerValue<T extends ApiType> {
    data: T[];
    error: string | null;
    selected: T | null;
    setSelected: (id: T['id'] | null) => void;
    add: (data: Omit<T, 'id'>) => Promise<T['id'] | null>;
    update: (data: Pick<T, 'id'> & Partial<T>) => Promise<T['id'] | null>;
    delete: (id: T['id']) => Promise<T['id'] | null>;
}
