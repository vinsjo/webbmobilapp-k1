import { useCallback, useMemo, useState } from 'react';
import { Stack, Button, Text, TextInput, Group, Space } from '@mantine/core';
import { useProjects } from '@/context/TimeTracker';
import ColorSwatches from './ColorSwatches';
import ModalForm from './ModalForm';

type Props = {
    buttonLabel?: React.ReactNode;
};

export default function AddProjectModal({ buttonLabel }: Props) {
    const { data, add, error, setSelected } = useProjects();

    const [input, setInput] = useState('');
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const trimmed = useMemo(() => input.trim(), [input]);

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

    const handleClose = useCallback(() => {
        setInput('');
        setSelectedColor(null);
    }, []);

    const handleSubmit = useCallback(() => {
        if (!open || nameExists) return;
        if (!trimmed.length) return setInput('');
        add({ name: trimmed, color: selectedColor }).then(async (added) => {
            if (!added) return;
            await setSelected(added.id);
            handleClose();
        });
    }, [
        open,
        handleClose,
        trimmed,
        nameExists,
        add,
        selectedColor,
        setSelected,
    ]);

    return (
        <ModalForm
            onSubmit={handleSubmit}
            onClose={() => {
                setInput('');
                setSelectedColor(null);
            }}
            buttonLabel="Add Project"
        >
            <Stack spacing="lg">
                <TextInput
                    size="sm"
                    label={
                        <Text size="sm" weight={500}>
                            Project name
                        </Text>
                    }
                    placeholder="Enter project name"
                    value={input}
                    error={errorOutput}
                    minLength={3}
                    maxLength={50}
                    inputWrapperOrder={['label', 'input', 'error']}
                    onChange={({ target }) => setInput(target.value)}
                />

                <ColorSwatches
                    label={
                        <Text size="sm" weight={500}>
                            Select Color
                        </Text>
                    }
                    onChange={(c) => setSelectedColor(c)}
                />
                <Space h="lg" />
                <Button
                    type="submit"
                    disabled={!open || !trimmed.length || nameExists}
                >
                    Add
                </Button>
            </Stack>
        </ModalForm>
    );
}
