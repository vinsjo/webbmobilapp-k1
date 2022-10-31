import { Button, Group } from '@mantine/core';
import { OmitProps } from '@/utils/type-utils';
import { openModal, closeAllModals } from '@mantine/modals';
import { useCallback } from 'react';
export { closeAllModals };

type ModalSettings = Parameters<typeof openModal>[0];

export type ModalButtonProps<C = 'button'> = OmitProps<
    typeof Button<C>,
    'onClick'
> & {
    modal: ModalSettings;
    onClick?: () => unknown | boolean | Promise<unknown | boolean>;
};

export default function ModalButton({
    title,
    modal,
    children,
    onClick,
    disabled,
    ...props
}: ModalButtonProps) {
    const handleClick = useCallback(async () => {
        if (disabled) return;
        if (typeof onClick === 'function') {
            const shouldOpen = await onClick();
            if (shouldOpen === false) return;
        }
        openModal(modal);
    }, [disabled, onClick, modal]);

    return (
        <Group position="center">
            <Button
                type="button"
                title={title}
                onClick={handleClick}
                disabled={disabled}
                {...props}
            >
                {children || title || 'Open Modal'}
            </Button>
        </Group>
    );
}

ModalButton.defaultProps = {
    component: 'button',
};
