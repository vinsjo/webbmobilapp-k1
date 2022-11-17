import { Text } from '@mantine/core';

type Props = Omit<Parameters<typeof Text<'div'>>[0], 'sx'> & {
    fontWeight?: number;
    hidden?: boolean;
    active?: boolean;
    textColor?: string;
};

export default function TimerText({
    children,
    fontWeight,
    size,
    hidden,
    active,
    textColor,
    ...props
}: Props) {
    return (
        <Text
            size={size || 'xs'}
            sx={(theme) => ({
                fontFamily: theme.fontFamilyMonospace,
                fontWeight: fontWeight || 500,
                color: textColor || (active ? 'white' : theme.colors.gray[2]),
                transition: 'color 0.1s ease',
                minHeight: theme.fontSizes.xs,
                userSelect: 'none',
                visibility: hidden ? 'hidden' : 'visible',
            })}
            {...props}
        >
            {children}
        </Text>
    );
}
