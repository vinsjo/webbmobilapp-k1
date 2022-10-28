import { useCallback, useMemo, useState } from 'react';
import {
    ColorSwatch,
    Group,
    MantineSize,
    Stack,
    useMantineTheme,
} from '@mantine/core';
import { objectKeys } from '@/utils';
import { OmitProps } from '@/utils/type-utils';

type Props = OmitProps<typeof Group, 'children' | 'onChange' | 'size'> & {
    label?: React.ReactNode;
    initialValue?: string;
    onChange?: (color: string) => unknown;
    size?: MantineSize;
};

export default function ColorSwatches({
    label,
    initialValue,
    onChange,
    size,
    ...props
}: Props) {
    const theme = useMantineTheme();

    const colors = useMemo(() => {
        return objectKeys(theme.colors)
            .filter((key) => !['gray', 'dark'].includes(key))
            .map((key) => ({ key, value: theme.colors[key][6] }));
    }, [theme.colors]);

    const [selected, setSelected] = useState(initialValue || null);
    const handleChange = useCallback(
        (color: string) => {
            setSelected(color);
            typeof onChange === 'function' && onChange(color);
        },
        [onChange]
    );
    return (
        <Stack spacing="xs">
            {label}
            <Group position="apart" spacing="xs" {...props}>
                {colors.map(({ key, value }) => {
                    return (
                        <ColorSwatch
                            key={key}
                            component="button"
                            color={value}
                            onClick={() => handleChange(value)}
                            title={key}
                            sx={{
                                border:
                                    selected === value
                                        ? `2px solid ${theme.colors.gray[0]}`
                                        : 'none',
                                cursor: 'pointer',
                                height: theme.fontSizes[size || 'xl'],
                                width: theme.fontSizes[size || 'xl'],
                            }}
                        />
                    );
                })}
            </Group>
        </Stack>
    );
}
