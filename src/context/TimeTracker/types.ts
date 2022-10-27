import type { Api } from '@/utils/api';

export type Load<T extends Api.DataType> = (
    signal?: AbortSignal
) => Promise<T[] | null>;

export type Add<T extends Api.DataType> = (
    data: Omit<T, 'id'>,
    signal?: AbortSignal
) => Promise<T | null>;

export type Update<T extends Api.DataType> = (
    id: T['id'],
    data: Partial<T>,
    signal?: AbortSignal
) => Promise<T | null>;

export type Remove<T extends Api.DataType> = (
    id: T['id'],
    signal?: AbortSignal
) => Promise<T['id'] | null>;

export type Select<T extends Api.DataType> = (
    id: T['id'] | null
) => Promise<void>;
export interface Context<T extends Api.DataType> {
    data: T[];
    error: string | null;
    selected: T | null;
    setSelected: Select<T>;
    load: Load<T>;
    add: Add<T>;
    update: Update<T>;
    remove: Remove<T>;
    loaded: boolean;
}
