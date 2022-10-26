import { ActionIcon, ActionIconProps } from '@mantine/core';
import { FaStop, FaPlay } from 'react-icons/fa';

interface Props extends Omit<ActionIconProps, 'children'> {
    active?: boolean;
    onClick?: () => unknown;
}

export default function PlayButton({ active, onClick, ...props }: Props) {
    return (
        <ActionIcon
            onClick={() => typeof onClick === 'function' && onClick()}
            {...props}
        >
            {active ? <FaStop /> : <FaPlay />}
        </ActionIcon>
    );
}
