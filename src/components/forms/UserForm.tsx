import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    TextInput,
    Space,
    Stack,
    Button,
    StackProps,
    InputWrapperBaseProps,
} from '@mantine/core';
import { useUsers } from '@/context/TimeTracker';

type Props = Omit<StackProps, 'children' | 'title'> & {
    label?: InputWrapperBaseProps['label'];
    title?: React.ReactNode;
    onSubmit?: () => unknown | Promise<unknown>;
    selectAdded?: boolean;
};

export default function UserForm({
    onSubmit,
    selectAdded,
    title,
    label,
    ...stackProps
}: Props) {
    const { data, add, setCurrent, error } = useUsers();
    const [input, setInput] = useState('');

    const [errorOutput, setErrorOutput] = useState<string | null>(error);

    const trimmed = useMemo(() => input.trim(), [input]);

    const handleSubmit = useCallback(
        async (ev: React.FormEvent<HTMLFormElement>) => {
            ev.preventDefault();
            if (!trimmed.length) return;
            const regExp = new RegExp(`^${trimmed}$`, 'i');
            if (data.some(({ name }) => regExp.test(name))) {
                return setErrorOutput('A user with that name already exists');
            }
            const added = await add({ name: trimmed });
            if (!added) {
                return setErrorOutput('Failed adding user, please try again');
            }
            if (selectAdded) await setCurrent(added.id);
            if (typeof onSubmit === 'function') await onSubmit();
            setInput('');
        },
        [data, add, setCurrent, trimmed, selectAdded, onSubmit]
    );

    useEffect(() => {
        if (!error) return;
        setErrorOutput(error);
    }, [error]);

    useEffect(() => {
        setErrorOutput(null);
    }, [input]);

    return (
        <form onSubmit={handleSubmit}>
            <Stack {...stackProps}>
                {title}
                <TextInput
                    size='sm'
                    label={label}
                    placeholder='Enter username'
                    value={input}
                    error={errorOutput}
                    minLength={2}
                    maxLength={50}
                    inputWrapperOrder={['label', 'input', 'error']}
                    onChange={({ target }) => setInput(target.value)}
                    withAsterisk={false}
                    autoComplete='off'
                    autoFocus
                    required
                />
                {!errorOutput && <Space h='xs' />}
                <Button
                    type='submit'
                    disabled={!trimmed.length}
                    sx={{ textTransform: 'uppercase' }}
                >
                    Add User
                </Button>
            </Stack>
        </form>
    );
}
