import { Button, Modal, ModalProps } from '@mantine/core';
import { useCallback, useState } from 'react';

export type ModalButtonProps<C = 'button'> = Omit<
    Parameters<typeof Button<C>>[0],
    'onClick'
> & {
    modalContent:
        | React.ReactNode
        | ((onClose: () => Promise<void>) => JSX.Element);
    modalProps?: Omit<ModalProps, 'opened' | 'onClose' | 'title'>;
    onClick?: () => unknown | boolean | Promise<unknown | boolean>;
    onClose?: () => unknown | Promise<unknown>;
};

export default function ModalButton({
    title,
    modalContent,
    modalProps,
    children,
    onClick,
    onClose,
    disabled,
    ...props
}: ModalButtonProps) {
    const [opened, setOpened] = useState(false);
    const handleClose = useCallback(async () => {
        if (typeof onClose === 'function') await onClose();
        setOpened(false);
    }, [onClose]);

    const handleClick = useCallback(async () => {
        if (disabled) return;
        if (typeof onClick === 'function') {
            const shouldOpen = await onClick();
            if (shouldOpen === false) return;
        }
        setOpened(true);
    }, [disabled, onClick]);

    return (
        <>
            <Modal
                title={title}
                opened={!disabled && opened}
                onClose={handleClose}
                centered
                {...(modalProps || {})}
            >
                {typeof modalContent === 'function'
                    ? modalContent(handleClose)
                    : modalContent}
            </Modal>
            <Button
                type='button'
                title={title}
                disabled={disabled}
                onClick={handleClick}
                {...props}
            >
                {children || title || 'Open Modal'}
            </Button>
        </>
    );
}

ModalButton.defaultProps = {
    component: 'button',
    modalProps: {},
};
