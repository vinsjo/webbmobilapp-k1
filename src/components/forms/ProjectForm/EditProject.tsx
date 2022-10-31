import { useCallback, useMemo, useState } from 'react';
import { Text } from '@mantine/core';
import { useProjects } from '@/context/TimeTracker';
import ProjectForm from './ProjectForm';
import { Project } from '@/utils/api/types';
import { defaultColor } from '@/utils/api';

export default function EditProject({
    onSubmit,
}: {
    onSubmit?: () => unknown;
}) {
    const { data, update, selected, error, remove } = useProjects(
        useCallback(
            ({ data, update, selected, setSelected, error, remove }) => {
                return {
                    data: !selected
                        ? []
                        : data.filter((p) => p.id !== selected.id),
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

    const [name, setName] = useState(selected?.name || '');
    const [color, setColor] = useState(selected?.color || defaultColor);

    const nameExists = useMemo(() => {
        const trimmed = name.trim();
        return !!data.find(({ name }) =>
            new RegExp(`^${name}$`, 'i').test(trimmed)
        );
    }, [name, data]);

    const changedValues = useMemo(() => {
        const values: { name?: string; color?: Project['color'] } = {};
        if (!selected) return values;
        const trimmed = name.trim();
        if (trimmed && trimmed !== selected.name) values.name = trimmed;
        if (color && color !== selected.color) values.color = color;
        return values;
    }, [selected, name, color]);

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
        if (nameExists || !hasChanged || !selected) return;
        const updated = await update(selected.id, changedValues);
        if (!updated) return;
        setName('');
        setColor(defaultColor);
        if (typeof onSubmit === 'function') onSubmit();
    }, [update, hasChanged, nameExists, selected, onSubmit, changedValues]);

    const handleDelete = useCallback(() => {
        if (!selected) return;
        remove(selected.id).then(() => {
            typeof onSubmit === 'function' && onSubmit();
        });
    }, [selected, remove, onSubmit]);

    return !selected ? (
        <Text>Error: No project selected</Text>
    ) : (
        <ProjectForm
            onSubmit={handleSubmit}
            name={name}
            color={color}
            error={errorOutput}
            onNameChange={setName}
            onColorChange={setColor}
            submitLabel="Save Changes"
            onDelete={handleDelete}
            deleteLabel="Delete project"
            disabled={nameExists || !hasChanged}
        />
    );
}
