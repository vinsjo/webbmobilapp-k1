import { useCallback } from 'react';
import { Stack, Button, Space, Group } from '@mantine/core';

export type FormProps = {
    children: React.ReactNode;
    onSubmit: () => unknown;
    submitLabel?: React.ReactNode;
    deleteLabel?: React.ReactNode;
    onDelete?: () => unknown;
    deleteDisabled?: boolean;
    disabled?: boolean;
};

export default function Form({
    children,
    onSubmit,
    onDelete,
    deleteLabel,
    deleteDisabled,
    submitLabel,
    disabled,
}: FormProps) {
    const handleSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(
        (ev) => {
            ev.preventDefault();
            if (disabled) return;
            onSubmit();
        },
        [onSubmit, disabled]
    );
    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing="md">
                {children}
                <Space h="md" />
                <Group
                    position={
                        typeof onDelete === 'function' ? 'apart' : 'right'
                    }
                >
                    {typeof onDelete === 'function' && (
                        <Button
                            type="button"
                            onClick={onDelete}
                            color="red"
                            sx={{
                                textTransform: 'uppercase',
                            }}
                            disabled={deleteDisabled}
                        >
                            {deleteLabel || 'Delete'}
                        </Button>
                    )}
                    <Button
                        type="submit"
                        style={{
                            textTransform: 'uppercase',
                        }}
                        disabled={disabled}
                    >
                        {submitLabel || 'Submit'}
                    </Button>
                </Group>
            </Stack>
        </form>
    );
}
