import React, { useCallback, useMemo, useState } from 'react';
import { TextInput, TextInputProps } from '@mantine/core';
import { AddButton } from './buttons';
import { useProjects } from '@/context/TimeTracker';

type Props = Omit<TextInputProps, 'value' | 'onChange' | 'error'>;

export default function AddProject(props: Props) {
    const { data, add, error } = useProjects();
    const [input, setInput] = useState('');
    const nameExists = useMemo(
        () => !!data.find(({ name }) => name === input),
        [input, data]
    );
    const errorOutput = useMemo<string | null>(() => {
        if (error && typeof error === 'string') return error;
        if (nameExists) {
            return 'A project already exists with that name';
        }
        return '';
    }, [nameExists, error]);

    const handleSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(
        async (ev) => {
            ev.preventDefault();
            if (nameExists) return;
            if (!input.trim().length) return setInput('');
            const added = await add({ name: input.trim(), color: null });
            if (!added) return;
            setInput('');
        },
        [input, nameExists, add]
    );
    return (
        <form onSubmit={handleSubmit}>
            <TextInput
                size="sm"
                value={input}
                onChange={({ target }) => setInput(target.value)}
                // label="Add Project"
                placeholder="Enter project name"
                error={errorOutput}
                inputWrapperOrder={['label', 'input', 'error']}
                minLength={2}
                maxLength={50}
                rightSection={<AddButton disabled={nameExists || !input} />}
                {...props}
            />
        </form>
    );
}
