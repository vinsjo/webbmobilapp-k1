import {
    Center,
    Text,
    LoadingOverlay as MantineLoadingOverlay,
    type LoadingOverlayProps,
    createStyles,
} from '@mantine/core';
import { useEffect, useState } from 'react';

const useStyles = createStyles(
    (theme, { dotCount }: { dotCount?: number }) => ({
        label: {
            position: 'relative',
            '&:after': {
                content: `"${Array(dotCount || 0)
                    .fill('.')
                    .join('')}"`,
                position: 'absolute',
                color: 'inherit',
            },
        },
    })
);

type Props = Omit<LoadingOverlayProps, 'zIndex' | 'visible'> & {
    visible?: boolean;
    zIndex?: number;
    label?: string | null;
};

export default function LoadingOverlay({
    label = 'Loading',
    zIndex = 100,
    visible = true,
    overlayOpacity = 0.5,
    overlayColor = 'dark',
    overlayBlur = 3,
    ...props
}: Props) {
    const [dotCount, setDotCount] = useState(0);
    const { classes } = useStyles({ dotCount });
    useEffect(() => {
        if (!label) return setDotCount(0);
        const interval = setInterval(
            () => setDotCount((prev) => (prev >= 3 ? 0 : prev + 1)),
            250
        );
        return () => clearInterval(interval);
    }, [label]);
    return (
        <>
            <MantineLoadingOverlay
                visible={visible}
                zIndex={zIndex}
                loaderProps={{ color: 'white', size: 'lg' }}
                overlayBlur={overlayBlur}
                overlayOpacity={overlayOpacity}
                overlayColor={overlayColor}
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
                    <Text className={classes.label} color='white' size='lg'>
                        {label}
                    </Text>
                </Center>
            )}
        </>
    );
}
