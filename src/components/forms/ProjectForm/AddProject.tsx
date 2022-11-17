import { useCallback, useMemo, useState } from 'react';
import { useProjects } from '@/context/TimeTracker';
import ProjectForm from './ProjectForm';
import { randomColor } from '@/utils/api';
import { useUsers } from '@/context/TimeTracker/hooks';

export default function AddProject({
    onSubmit,
    selectAdded,
}: {
    onSubmit?: () => unknown;
    selectAdded?: boolean;
}) {
    const { current: currentUser } = useUsers();
    const { data, add, setCurrent, error } = useProjects();

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
        if (!currentUser || nameExists) return;
        const trimmed = name.trim();
        if (!trimmed.length) return setName('');
        const added = await add({
            userId: currentUser.id,
            name: trimmed,
            color,
        });
        if (!added) return;
        if (selectAdded) await setCurrent(added.id);
        setName('');
        if (typeof onSubmit === 'function') onSubmit();
    }, [
        currentUser,
        add,
        name,
        color,
        nameExists,
        setCurrent,
        onSubmit,
        selectAdded,
    ]);
    console.log(color);
    return (
        <ProjectForm
            onSubmit={handleSubmit}
            name={name}
            color={color}
            error={errorOutput}
            onNameChange={setName}
            onColorChange={setColor}
            submitLabel='Add'
            disabled={nameExists}
        />
    );
}

AddProject.defaultProps = {
    selectAdded: true,
};
