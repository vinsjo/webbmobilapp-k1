import {
    Header as MantineHeader,
    Group,
    Title,
    Button,
    Modal,
    Stack,
} from '@mantine/core';
import SelectUser from '@/components/input/SelectUser';
import { useCallback, useState } from 'react';
import UserForm from '../forms/UserForm';

type Props = Omit<Parameters<typeof MantineHeader>[0], 'children'> & {
    title?: string;
};

function Header({ title, ...props }: Props) {
    const [openModal, setOpenModal] = useState(false);
    const closeModal = useCallback(() => {
        setOpenModal(false);
    }, []);
    return (
        <>
            <Modal opened={openModal} onClose={closeModal}>
                <Stack spacing='md'>
                    <Title order={4}>Add User</Title>
                    <UserForm onSubmit={closeModal} selectAdded={true} />
                </Stack>
            </Modal>
            <MantineHeader {...props}>
                <Group
                    style={{ width: '100%', height: '100%' }}
                    position='apart'
                    px='md'
                >
                    <Title size='h1'>{title || 'Time Tracker'}</Title>
                    <Group spacing='xs'>
                        <SelectUser size='sm' />
                        <Button size='sm' onClick={() => setOpenModal(true)}>
                            Add User
                        </Button>
                    </Group>
                </Group>
            </MantineHeader>
        </>
    );
}

export default Header;
