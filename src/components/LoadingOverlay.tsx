import {
    LoadingOverlay as MantineLoadingOverlay,
    LoadingOverlayProps,
} from '@mantine/core';

type Props = Omit<LoadingOverlayProps, 'loaderProps' | 'visible'> & {
    visible?: boolean;
};

export default function LoadingOverlay({
    visible = true,
    overlayBlur = 2,
    ...props
}: Props) {
    return (
        <MantineLoadingOverlay
            visible={visible}
            loaderProps={{ size: 'xl', variant: 'oval' }}
            overlayBlur={overlayBlur}
            {...props}
        />
    );
}
