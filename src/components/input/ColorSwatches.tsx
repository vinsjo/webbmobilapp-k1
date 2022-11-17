import { useEffect, useRef, useState } from 'react';
import { ColorSwatch, Group, MantineSize, Stack } from '@mantine/core';
import { objectEntries } from '@/utils';
import { colors, defaultColor } from '@/utils/api';

type Props = Omit<
    Parameters<typeof Group>[0],
    'children' | 'onChange' | 'size'
> & {
    label?: React.ReactNode;
    value?: Project['color'];
    onChange?: (color: Project['color']) => unknown;
    size?: MantineSize;
};

export default function ColorSwatches({
    label,
    onChange,
    size,
    value: controlledValue,
    ...props
}: Props) {
    const onChangeRef = useRef(onChange);
    const [selected, setSelected] = useState(controlledValue || defaultColor);

    useEffect(() => {
        typeof onChangeRef.current === 'function' &&
            onChangeRef.current(selected);
    }, [selected]);

    useEffect(() => {
        if (!controlledValue) return;
        setSelected(controlledValue);
    }, [controlledValue]);

    useEffect(() => {
        if (!onChange || onChangeRef.current === onChange) return;
        onChangeRef.current = onChange;
    }, [onChange]);

    return (
        <Stack spacing='xs'>
            {label}
            <Group position='apart' spacing='xs' {...props}>
                {objectEntries(colors).map(([name, color]) => {
                    return (
                        <ColorSwatch
                            key={name}
                            component='button'
                            type='button'
                            color={color}
                            onClick={() => setSelected(color)}
                            title={name}
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
