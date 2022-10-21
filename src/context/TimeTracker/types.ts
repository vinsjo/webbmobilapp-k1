import type { ApiType } from '@/utils/api';

export interface TimeTrackerValue<T extends ApiType> {
    data: T[];
    error: string | null;
    selected: T | null;
    setSelected: (id: T['id'] | null) => void;
    add: (data: Omit<T, 'id'>) => Promise<T['id'] | null>;
    update: (
        id: T['id'],
        data: Partial<Omit<T, 'id'>>
    ) => Promise<T['id'] | null>;
    delete: (id: T['id']) => Promise<T['id'] | null>;
}
