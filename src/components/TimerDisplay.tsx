import {
    Center,
    MantineNumberSize,
    Text,
    type CenterProps,
} from '@mantine/core';
import DurationOutput from './DurationOutput';

interface Props extends Omit<CenterProps, 'children'> {
    duration: number;
    maxWidth?: string | number;
    textSize?: MantineNumberSize;
}

export default function TimerDisplay({
    duration,
    maxWidth,
    textSize,
    ...props
}: Props) {
    return (
        <Center
            p="md"
            sx={(theme) => ({
                backgroundColor: theme.colors.dark[9],
                width: '100%',
                maxWidth,
                borderRadius: theme.radius.md,
            })}
            {...props}
        >
            <Text
                size={textSize || 'lg'}
                sx={(theme) => ({
                    fontFamily: theme.fontFamilyMonospace,
                    fontWeight: 800,
                    color: theme.colors.gray[!duration ? 8 : 0],
                    transition: 'color 0.1s ease',
                })}
            >
                <DurationOutput duration={duration} />
            </Text>
        </Center>
    );
}
