import type { DataType } from '@/utils/api/types';

export type Add<T extends DataType> = (
    data: Omit<T, 'id'>
) => Promise<T | null>;

export type Update<T extends DataType> = (
    id: T['id'],
    data: Partial<T>
) => Promise<T | null>;

export type Delete<T extends DataType> = (
    id: T['id']
) => Promise<T['id'] | null>;

export type Select<T extends DataType> = (id: T['id'] | null) => void;
export interface Value<T extends DataType> {
    data: T[];
    error: string | null;
    selected: T | null;
    setSelected: Select<T>;
    add: Add<T>;
    update: Update<T>;
    delete: Delete<T>;
}
