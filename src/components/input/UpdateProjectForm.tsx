import { useCallback, useMemo, useState } from 'react';
import { Stack, Button, Text, TextInput, Space } from '@mantine/core';
import { useProjects } from '@/context/TimeTracker';
import ColorSwatches from './ColorSwatches';
import type { Project } from '@/utils/api/types';

export default function UpdateProjectForm({
    id,
    onSubmit,
}: {
    id: Project['id'];
    onSubmit?: () => unknown;
}) {
    const { project, data, update, setSelected, error } = useProjects(
        useCallback(
            ({ data, update, setSelected, error }) => {
                return {
                    project: data.find((p) => p.id === id) || null,
                    data: data.filter((p) => p.id !== id),
                    update,
                    setSelected,
                    error,
                };
            },
            [id]
        )
    );

    const [name, setName] = useState(project?.name || '');
    const [color, setColor] = useState(project?.color || null);

    const nameExists = useMemo(() => {
        const trimmed = name.trim();
        return !!data.find(({ name }) =>
            new RegExp(`^${name}$`, 'i').test(trimmed)
        );
    }, [name, data]);

    const changedValues = useMemo(() => {
        const values: { name?: string; color?: string } = {};
        if (!project) return values;
        const trimmed = name.trim();
        if (trimmed && trimmed !== project.name) values.name = trimmed;
        if (color && color !== project.color) values.color = color;
        return values;
    }, [project, name, color]);

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

    const handleSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(
        async (ev) => {
            ev.preventDefault();
            if (nameExists || !hasChanged) return;
            const updated = await update(id, changedValues);
            if (!updated) return;
            await setSelected(updated.id);
            setName('');
            setColor(null);
            if (typeof onSubmit === 'function') onSubmit();
        },
        [
            update,
            hasChanged,
            nameExists,
            setSelected,
            onSubmit,
            id,
            changedValues,
        ]
    );

    return !project ? (
        <Text>Error: Project with id {id} not found</Text>
    ) : (
        <form onSubmit={handleSubmit}>
            <Stack spacing="md">
                <TextInput
                    size="sm"
                    label={
                        <Text size="sm" weight={500}>
                            Project name
                        </Text>
                    }
                    placeholder="Enter project name"
                    value={name}
                    error={errorOutput}
                    minLength={3}
                    maxLength={50}
                    inputWrapperOrder={['label', 'input', 'error']}
                    onChange={({ target }) => setName(target.value)}
                />
                {!errorOutput && <Space h="md" />}
                <ColorSwatches
                    label={
                        <Text size="sm" weight={500}>
                            Select Color
                        </Text>
                    }
                    onChange={(color) => setColor(color)}
                />
                <Space h="md" />
                <Button
                    type="submit"
                    style={{
                        textTransform: 'uppercase',
                    }}
                    disabled={!hasChanged || nameExists}
                >
                    Save
                </Button>
            </Stack>
        </form>
    );
}
