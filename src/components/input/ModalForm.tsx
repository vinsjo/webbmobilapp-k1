import { useCallback, useState } from 'react';
import { Button, Group, Modal, ModalProps } from '@mantine/core';

type Props = Omit<ModalProps, 'onSubmit' | 'opened' | 'onClose'> & {
    onSubmit: React.FormEventHandler<HTMLFormElement>;
    button?: <
        P = { onClick: React.MouseEventHandler<HTMLButtonElement> } & Record<
            string,
            unknown
        >
    >(
        props: P
    ) => JSX.Element;
    buttonLabel?: React.ReactNode;
    onClose?: () => unknown;
};

export default function AddProjectModal({
    children,
    button,
    buttonLabel,
    onSubmit,
    onClose,
    ...props
}: Props) {
    const [open, setOpen] = useState(false);
    const handleClose = useCallback(() => {
        setOpen(false);
        if (typeof onClose === 'function') onClose();
    }, [onClose]);

    const handleSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(
        (ev) => {
            ev.preventDefault();
            if (!open) return;
            onSubmit(ev);
        },
        [open, onSubmit]
    );

    return (
        <>
            <Modal opened={open} onClose={handleClose} centered {...props}>
                <form onSubmit={handleSubmit}>{children}</form>
            </Modal>
            <Group position="center">
                {typeof button === 'function' ? (
                    button({ onClick: () => setOpen(true) })
                ) : (
                    <Button onClick={() => setOpen(true)}>
                        {buttonLabel || 'Open'}
                    </Button>
                )}
            </Group>
        </>
    );
}
