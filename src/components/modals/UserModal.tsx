import { useUsers } from '@/context/TimeTrackerContext';
import { Button, Modal, Space, Stack, Title } from '@mantine/core';
import { useCallback } from 'react';
import SelectUser from '@/components/input/SelectUser';
import UserForm from '@/components/forms/UserForm';

type Props = {
    opened: boolean;
    onClose: () => unknown;
};

export default function UserModal({ opened, onClose }: Props) {
    const { current } = useUsers();
    const handleClose = useCallback(async () => {
        if (!current) return;
        onClose();
    }, [current, onClose]);

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            overlayBlur={5}
            centered
            withCloseButton={false}
        >
            <Stack spacing='lg'>
                <Title order={4}>Select a user:</Title>
                <SelectUser />
                <Title order={4}>Add a new user:</Title>
                <UserForm selectAdded />
                <Space h='md' />
                <Button
                    disabled={!current}
                    type='button'
                    onClick={handleClose}
                    sx={{ textTransform: 'uppercase' }}
                >
                    Continue
                </Button>
            </Stack>
        </Modal>
    );
}
