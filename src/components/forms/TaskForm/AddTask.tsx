import { useState, useMemo, useCallback } from 'react';
import { useProjects, useTasks } from '@/context/TimeTrackerContext';
import TaskForm from './TaskForm';

export default function AddTask({
    onSubmit,
    selectAdded,
}: {
    onSubmit?: () => unknown;
    selectAdded?: boolean;
}) {
    const { current: currentProject } = useProjects();
    const { data, add, setCurrent, error } = useTasks(
        useCallback(
            ({ data, add, setCurrent, error }) => {
                return {
                    data: !currentProject
                        ? []
                        : data.filter(
                              ({ projectId }) => projectId === currentProject.id
                          ),
                    error,
                    add,
                    setCurrent,
                };
            },
            [currentProject]
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
        if (titleExists || !currentProject) return;
        const trimmed = input.trim();
        if (!trimmed.length) return setInput('');
        const added = await add({
            title: trimmed,
            userId: currentProject.userId,
            projectId: currentProject.id,
        });
        if (!added) return;
        if (selectAdded) await setCurrent(added.id);
        setInput('');
        if (typeof onSubmit === 'function') onSubmit();
    }, [
        add,
        input,
        titleExists,
        setCurrent,
        onSubmit,
        currentProject,
        selectAdded,
    ]);

    return (
        <TaskForm
            input={input}
            error={errorOutput}
            onChange={setInput}
            onSubmit={handleSubmit}
            submitLabel='Add'
        />
    );
}

AddTask.defaultProps = {
    selectAdded: true,
};
