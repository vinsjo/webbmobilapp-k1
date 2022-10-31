import { useCallback, useMemo, useState } from 'react';
import { Text } from '@mantine/core';
import { useTasks } from '@/context/TimeTracker';
import TaskForm from './TaskForm';

export default function EditTask({ onSubmit }: { onSubmit?: () => unknown }) {
    const { data, update, selected, error, remove } = useTasks(
        useCallback(
            ({ data, update, selected, setSelected, error, remove }) => {
                return {
                    data: !selected
                        ? []
                        : data.filter(({ id, projectId }) => {
                              projectId === selected.id && id !== selected.id;
                          }),
                    update,
                    setSelected,
                    selected,
                    error,
                    remove,
                };
            },
            []
        )
    );
    const [input, setInput] = useState(selected?.title || '');

    const titleExists = useMemo(() => {
        const trimmed = input.trim();
        return !!data.find(({ title }) =>
            new RegExp(`^${title}$`, 'i').test(trimmed)
        );
    }, [input, data]);

    const hasChanged = useMemo(() => {
        if (!selected) return false;
        return input.trim() !== selected.title;
    }, [input, selected]);

    const errorOutput = useMemo(() => {
        if (typeof error === 'string') return error;
        if (titleExists) {
            return 'A task already exists with that title';
        }
        return null;
    }, [error, titleExists]);

    const handleSubmit = useCallback(async () => {
        if (titleExists || !hasChanged || !selected) return;
        const updated = await update(selected.id, { title: input.trim() });
        if (!updated) return;
        setInput('');
        if (typeof onSubmit === 'function') onSubmit();
    }, [update, input, titleExists, selected, onSubmit, hasChanged]);

    const handleDelete = useCallback(async () => {
        if (!selected) return;
        const removed = await remove(selected.id);
        if (!removed) return;
        typeof onSubmit === 'function' && onSubmit();
    }, [selected, remove, onSubmit]);

    return !selected ? (
        <Text>Error: No task selected</Text>
    ) : (
        <TaskForm
            input={input}
            onChange={setInput}
            error={errorOutput}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            deleteLabel="Delete Task"
            submitLabel="Save"
        />
    );
}
