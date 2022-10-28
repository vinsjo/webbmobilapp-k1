import { useCallback, useMemo, useState } from 'react';
import {
    Modal,
    Stack,
    Button,
    Text,
    TextInput,
    Group,
    Space,
} from '@mantine/core';
import { useProjects } from '@/context/TimeTracker';
import ColorSwatches from './ColorSwatches';

type Props = {
    buttonLabel?: React.ReactNode;
};

export default function AddProjectModal({ buttonLabel }: Props) {
    const [open, setOpen] = useState(true);
    const { data, add, error } = useProjects();
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

    const close = useCallback(() => {
        setInput('');
        setSelectedColor(null);
        setOpen(false);
    }, []);

    const handleSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(
        (ev) => {
            ev.preventDefault();
            if (!open || nameExists) return;
            if (!trimmed.length) return setInput('');
            add({ name: trimmed, color: selectedColor }).then(
                (added) => added && close()
            );
        },
        [open, close, trimmed, nameExists, add, selectedColor]
    );

    return (
        <>
            <Modal opened={open} onClose={close} title="Add a project" centered>
                <Space h="lg" />
                <form onSubmit={handleSubmit}>
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
                </form>
            </Modal>

            <Group position="center">
                <Button onClick={() => setOpen(true)}>
                    {buttonLabel || 'Add project'}
                </Button>
            </Group>
        </>
    );
}
