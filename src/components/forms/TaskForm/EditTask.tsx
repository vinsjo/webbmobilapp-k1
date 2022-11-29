import { useCallback, useMemo, useState } from 'react';
import { Text } from '@mantine/core';
import { useTasks } from '@/context/TimeTrackerContext';
import TaskForm from './TaskForm';

export default function EditTask({ onSubmit }: { onSubmit?: () => unknown }) {
    const { data, update, current, error, remove } = useTasks(
        useCallback(({ data, update, selected: current, error, remove }) => {
            return {
                data: !current
                    ? []
                    : data.filter(({ id, projectId }) => {
                          projectId === current.id && id !== current.id;
                      }),
                update,
                current,
                error,
                remove,
            };
        }, [])
    );
    const [input, setInput] = useState(current?.title || '');

    const titleExists = useMemo(() => {
        const trimmed = input.trim();
        return !!data.find(({ title }) =>
            new RegExp(`^${title}$`, 'i').test(trimmed)
        );
    }, [input, data]);

    const hasChanged = useMemo(() => {
        if (!current) return false;
        return input.trim() !== current.title;
    }, [input, current]);

    const errorOutput = useMemo(() => {
        if (typeof error === 'string') return error;
        if (titleExists) {
            return 'A task already exists with that title';
        }
        return null;
    }, [error, titleExists]);

    const handleSubmit = useCallback(async () => {
        if (titleExists || !hasChanged || !current) return;
        const updated = await update({ id: current.id, title: input.trim() });
        if (!updated) return;
        setInput('');
        if (typeof onSubmit === 'function') onSubmit();
    }, [update, input, titleExists, current, onSubmit, hasChanged]);

    const handleDelete = useCallback(async () => {
        if (!current) return;
        const removed = await remove(current.id);
        if (!removed) return;
        typeof onSubmit === 'function' && onSubmit();
    }, [current, remove, onSubmit]);

    return !current ? (
        <Text>Error: No task selected</Text>
    ) : (
        <TaskForm
            input={input}
            onChange={setInput}
            error={errorOutput}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            deleteLabel='Delete Task'
            submitLabel='Save'
        />
    );
}
