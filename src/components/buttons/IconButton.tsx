import { ActionIcon } from '@mantine/core';
import type { IconType } from 'react-icons';
import type { OmitProps } from '@/utils/types';

export type IconButtonProps = OmitProps<
    typeof ActionIcon<'button'>,
    'children' | 'component'
>;

export default function IconButton({
    icon,
    ...props
}: IconButtonProps & { icon: IconType }) {
    return (
        <ActionIcon p="s" component="button" {...props}>
            {icon({ style: { width: '100%', height: '100%' } })}
        </ActionIcon>
    );
}
