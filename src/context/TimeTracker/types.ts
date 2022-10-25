import type { DataType } from '@/utils/api/types';

export type Load<T extends DataType> = (
    signal?: AbortSignal
) => Promise<T[] | null>;

export type Add<T extends DataType> = (
    data: Omit<T, 'id'>,
    signal?: AbortSignal
) => Promise<T | null>;

export type Update<T extends DataType> = (
    id: T['id'],
    data: Partial<T>,
    signal?: AbortSignal
) => Promise<T | null>;

export type Delete<T extends DataType> = (
    id: T['id'],
    signal?: AbortSignal
) => Promise<T['id'] | null>;

export type Select<T extends DataType> = (id: T['id'] | null) => Promise<void>;
export interface Context<T extends DataType> {
    data: T[];
    error: string | null;
    selected: T | null;
    setSelected: Select<T>;
    load: Load<T>;
    add: Add<T>;
    update: Update<T>;
    delete: Delete<T>;
}
