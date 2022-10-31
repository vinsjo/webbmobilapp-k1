import { useState, useMemo, useCallback } from 'react';
import { useProjects, useTasks } from '@/context/TimeTracker';
import TaskForm from './TaskForm';

export default function AddTask({ onSubmit }: { onSubmit?: () => unknown }) {
    const { selected: selectedProject } = useProjects();
    const { data, add, setSelected, error } = useTasks(
        useCallback(
            ({ data, add, setSelected, error }) => {
                return {
                    data: !selectedProject
                        ? []
                        : data.filter(
                              ({ projectId }) =>
                                  projectId === selectedProject.id
                          ),
                    error,
                    add,
                    setSelected,
                };
            },
            [selectedProject]
        )
    );

    const [input, setInput] = useState('');

    const titleExists = useMemo(() => {
        const trimmed = input.trim();
        return !!data.find(({ title }) =>
            new RegExp(`^${title}$`, 'i').test(trimmed)
        );
    }, [input, data]);

    const errorOutput = useMemo(() => {
        if (typeof error === 'string') return error;
        if (titleExists) {
            return 'A task already exists with that title';
        }
        return null;
    }, [error, titleExists]);

    const handleSubmit = useCallback(async () => {
        if (titleExists || !selectedProject) return;
        const trimmed = input.trim();
        if (!trimmed.length) return setInput('');
        const added = await add({
            title: trimmed,
            projectId: selectedProject.id,
        });
        if (!added) return;
        await setSelected(added.id);
        setInput('');
        if (typeof onSubmit === 'function') onSubmit();
    }, [add, input, titleExists, setSelected, onSubmit, selectedProject]);

    return (
        <TaskForm
            input={input}
            error={errorOutput}
            onChange={setInput}
            onSubmit={handleSubmit}
            submitLabel="Add"
        />
    );
}
