import { useMemo } from 'react';
import { useMantineTheme } from '@mantine/core';
import { objectKeys } from '@/utils';

export type ColorIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export default function useThemeColors(colorIndex?: ColorIndex) {
    const theme = useMantineTheme();
    const index = useMemo(
        () => (typeof colorIndex !== 'number' ? 5 : colorIndex),
        [colorIndex]
    );
    return useMemo(
        () => objectKeys(theme.colors).map((key) => theme.colors[key][index]),
        [index, theme]
    );
}
