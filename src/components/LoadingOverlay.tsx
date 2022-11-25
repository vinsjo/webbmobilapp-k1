import {
    Center,
    Text,
    LoadingOverlay as MantineLoadingOverlay,
    type LoadingOverlayProps,
} from '@mantine/core';
import { isStr } from 'x-is-type';

type Props = Omit<LoadingOverlayProps, 'zIndex'> & {
    zIndex?: number;
    label?: React.ReactNode;
};

export default function LoadingOverlay({
    label,
    zIndex = 100,
    visible,
    ...props
}: Props) {
    return (
        <>
            <MantineLoadingOverlay
                visible={visible}
                zIndex={100}
                overlayBlur={3}
                overlayOpacity={0.5}
                loaderProps={{ color: 'white', size: 'lg' }}
                {...props}
            />
            {label && visible && (
                <Center
                    pos='absolute'
                    inset={0}
                    pt={125}
                    sx={{
                        zIndex: zIndex + 1,
                    }}
                >
                    {isStr(label) ? (
                        <Text color='white' size='lg'>
                            {label}
                        </Text>
                    ) : (
                        label
                    )}
                </Center>
            )}
        </>
    );
}
