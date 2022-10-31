import { useCallback, useMemo, useState } from 'react';
import { useProjects } from '@/context/TimeTracker';
import type { Project } from '@/utils/api/types';
import ProjectForm from './ProjectForm';
import { randomColor } from '@/utils/api';

export default function AddProject({ onSubmit }: { onSubmit?: () => unknown }) {
    const { data, add, setSelected, error } = useProjects();

    const [name, setName] = useState('');
    const [color, setColor] = useState<Project['color']>(randomColor());

    const nameExists = useMemo(() => {
        const trimmed = name.trim();
        return !!data.find(({ name }) =>
            new RegExp(`^${name}$`, 'i').test(trimmed)
        );
    }, [name, data]);

    const errorOutput = useMemo(() => {
        if (typeof error === 'string') return error;
        if (nameExists) {
            return 'A project already exists with that name';
        }
        return null;
    }, [error, nameExists]);

    const handleSubmit = useCallback(async () => {
        if (nameExists) return;
        const trimmed = name.trim();
        if (!trimmed.length) return setName('');
        const added = await add({ name: trimmed, color });
        if (!added) return;
        await setSelected(added.id);
        setName('');
        if (typeof onSubmit === 'function') onSubmit();
    }, [add, name, color, nameExists, setSelected, onSubmit]);

    return (
        <ProjectForm
            onSubmit={handleSubmit}
            name={name}
            color={color}
            error={errorOutput}
            onNameChange={setName}
            onColorChange={setColor}
            submitLabel="Add"
            disabled={nameExists}
        />
    );
}
