import { useCallback, useMemo, useState } from 'react';
import { Text } from '@mantine/core';
import { useProjects } from '@/context/TimeTrackerContext';
import ProjectForm from './ProjectForm';
import { defaultColor } from '@/utils/api';

export default function EditProject({
    onSubmit,
}: {
    onSubmit?: () => unknown;
}) {
    const { data, update, current, error, remove } = useProjects(
        useCallback(({ data, update, selected: current, error, remove }) => {
            return {
                data: !current ? [] : data.filter((p) => p.id !== current.id),
                update,
                current,
                error,
                remove,
            };
        }, [])
    );

    const [name, setName] = useState(current?.name || '');
    const [color, setColor] = useState(current?.color || defaultColor);

    const nameExists = useMemo(() => {
        const trimmed = name.trim();
        return !!data.find(({ name }) =>
            new RegExp(`^${name}$`, 'i').test(trimmed)
        );
    }, [name, data]);

    const changedValues = useMemo(() => {
        const values: { name?: string; color?: Project['color'] } = {};
        if (!current) return values;
        const trimmed = name.trim();
        if (trimmed && trimmed !== current.name) values.name = trimmed;
        if (color && color !== current.color) values.color = color;
        return values;
    }, [current, name, color]);

    const hasChanged = useMemo(
        () => !!Object.keys(changedValues).length,
        [changedValues]
    );

    const errorOutput = useMemo(() => {
        if (typeof error === 'string') return error;
        if (nameExists) {
            return 'A project already exists with that name';
        }
        return null;
    }, [error, nameExists]);

    const handleSubmit = useCallback(async () => {
        if (nameExists || !hasChanged || !current) return;
        const updated = await update({ id: current.id, ...changedValues });
        if (!updated) return;
        setName('');
        setColor(defaultColor);
        if (typeof onSubmit === 'function') onSubmit();
    }, [update, hasChanged, nameExists, current, onSubmit, changedValues]);

    const handleDelete = useCallback(() => {
        if (!current) return;
        remove(current.id).then(() => {
            typeof onSubmit === 'function' && onSubmit();
        });
    }, [current, remove, onSubmit]);

    return !current ? (
        <Text>Error: No project selected</Text>
    ) : (
        <ProjectForm
            onSubmit={handleSubmit}
            name={name}
            color={color}
            error={errorOutput}
            onNameChange={setName}
            onColorChange={setColor}
            submitLabel='Save Changes'
            onDelete={handleDelete}
            deleteLabel='Delete project'
            disabled={nameExists || !hasChanged}
        />
    );
}
