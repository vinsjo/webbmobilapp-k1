import React, { useCallback, useMemo, useState } from 'react';
import { Box, ColorSwatch, Group, Stack, useMantineTheme } from '@mantine/core';
import AddInput from './AddInput';
import { useProjects } from '@/context/TimeTracker';
import { OmitProps } from '@/utils/types';
import { objectKeys } from '@/utils';

type Props = OmitProps<typeof AddInput, 'value' | 'onChange' | 'error'>;

export default function AddProject(props: Props) {
    const { data, add, error } = useProjects();
    const [input, setInput] = useState('');
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const trimmed = useMemo(() => input.trim(), [input]);

    const theme = useMantineTheme();
    const colors = useMemo(() => {
        return objectKeys(theme.colors)
            .filter((key) => !['gray', 'dark'].includes(key))
            .map((key) => ({ key, value: theme.colors[key][6] }));
    }, [theme]);

    const nameExists = useMemo(() => {
        return !!data.find(({ name }) =>
            new RegExp(`^${name}$`, 'gi').test(trimmed)
        );
    }, [trimmed, data]);

    const errorOutput = useMemo(() => {
        if (error && typeof error === 'string') return error;
        if (nameExists) {
            return 'A project with that name already exists';
        }
        return null;
    }, [error, nameExists]);

    const handleSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(
        async (ev) => {
            ev.preventDefault();
            if (nameExists) return;
            if (!trimmed.length) return setInput('');
            const added = await add({ name: trimmed, color: selectedColor });
            if (!added) return;
            setInput('');
        },
        [trimmed, nameExists, add, selectedColor]
    );
    return (
        <Stack spacing="md">
            <Box component="form" onSubmit={handleSubmit}>
                <AddInput
                    value={input}
                    onChange={({ target }) => setInput(target.value)}
                    label="Add Project"
                    placeholder="Enter project name"
                    error={errorOutput}
                    minLength={3}
                    maxLength={50}
                    disabled={nameExists || !input}
                    {...props}
                />
            </Box>
            <Group position="apart" spacing="xs">
                {colors.map(({ key, value }) => {
                    const selected = selectedColor === value;
                    return (
                        <ColorSwatch
                            key={key}
                            component="button"
                            color={value}
                            onClick={() => setSelectedColor(value)}
                            title={key}
                            sx={{
                                border: selected
                                    ? `2px solid ${theme.colors.gray[0]}`
                                    : 'none',
                                cursor: 'pointer',
                                height: theme.fontSizes.lg,
                                width: theme.fontSizes.lg,
                            }}
                        />
                    );
                })}
            </Group>
        </Stack>
    );
}
