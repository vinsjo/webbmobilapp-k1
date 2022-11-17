import { ActionIcon } from '@mantine/core';
import { FaPlay, FaPlus, FaStop, FaTimes } from 'react-icons/fa';

export type Props<C = 'button'> = Omit<
    Parameters<typeof ActionIcon<C>>[0],
    'children'
>;

export function AddButton({ type = 'submit', ...props }: Props) {
    return (
        <ActionIcon type={type} {...props}>
            <FaPlus />
        </ActionIcon>
    );
}

export function DeleteButton(props: Props) {
    return (
        <ActionIcon {...props}>
            <FaTimes />
        </ActionIcon>
    );
}

export function PlayButton({
    active,
    ...props
}: Props & {
    active: boolean;
}) {
    return (
        <ActionIcon p='sm' {...props}>
            {!active ? <FaPlay /> : <FaStop />}
        </ActionIcon>
    );
}
