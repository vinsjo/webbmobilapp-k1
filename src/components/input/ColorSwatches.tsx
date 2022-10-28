import { useEffect, useState } from 'react';
import { ColorSwatch, Group, MantineSize, Stack } from '@mantine/core';
import { OmitProps } from '@/utils/type-utils';
import { objectEntries } from '@/utils';
import { colors, defaultColor } from '@/utils/api';

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
    const [selected, setSelected] = useState(initialValue || defaultColor);

    useEffect(() => {
        typeof onChange === 'function' && onChange(selected);
    }, [onChange, selected]);

    return (
        <Stack spacing="xs">
            {label}
            <Group position="apart" spacing="xs" {...props}>
                {objectEntries(colors).map(([key, color]) => {
                    return (
                        <ColorSwatch
                            key={key}
                            component="button"
                            color={color}
                            onClick={() => setSelected(color)}
                            title={key}
                            sx={(theme) => ({
                                border:
                                    selected === color
                                        ? `2px solid ${theme.colors.gray[0]}`
                                        : 'none',
                                cursor: 'pointer',
                                height: theme.fontSizes[size || 'xl'],
                                width: theme.fontSizes[size || 'xl'],
                            })}
                        />
                    );
                })}
            </Group>
        </Stack>
    );
}
