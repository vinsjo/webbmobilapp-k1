import { ActionIcon } from '@mantine/core';
import type { OmitProps } from '@/utils/types';

export type IconButtonProps = OmitProps<
    typeof ActionIcon<'button'>,
    'children' | 'component'
>;

export default function IconButton({
    icon,
    ...props
}: IconButtonProps & { icon: JSX.Element }) {
    return (
        <ActionIcon p="m" component="button" {...props}>
            {icon}
        </ActionIcon>
    );
}
