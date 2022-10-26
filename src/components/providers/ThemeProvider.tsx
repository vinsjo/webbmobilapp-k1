import React from 'react';
import {
    MantineProvider,
    DEFAULT_THEME,
    type MantineTheme,
    type MantineSizes,
} from '@mantine/core';

import { objectEntries } from '@/utils';

const mainFont = 'Roboto, sans-serif';
const monoFont = 'Roboto Mono, monospace';

const { fontSizes, headings } = (() => {
    const sizes = [8, 10, 12, 14, 18];
    const fontSizes = objectEntries(DEFAULT_THEME.fontSizes)
        .sort((a, b) => a[1] - b[1])
        .reduce((fontSizes, [key], i) => {
            return { ...fontSizes, [key]: sizes[i] };
        }, {}) as MantineSizes;

    const headings: MantineTheme['headings'] = {
        fontFamily: mainFont,
        fontWeight: 700,
        sizes: [...sizes, Math.round(sizes[sizes.length - 1] * 1.3)]
            .sort((a, b) => b - a)
            .reduce((sizes, size, i) => {
                const key = `h${
                    i + 1
                }` as keyof MantineTheme['headings']['sizes'];
                return {
                    ...sizes,
                    [key]: {
                        ...DEFAULT_THEME.headings.sizes,
                        fontSize: size,
                    },
                };
            }, {}) as typeof DEFAULT_THEME.headings.sizes,
    };

    return {
        headings,
        fontSizes,
    };
})();

const theme: Partial<MantineTheme> = {
    fontFamily: mainFont,
    fontFamilyMonospace: monoFont,
    colorScheme: 'dark',
    focusRing: 'never',
    cursorType: 'pointer',
    primaryColor: 'gray',
    components: {
        List: {
            defaultProps: {
                listStyleType: 'none',
            },
        },
    },
    fontSizes,
    headings,
};

export default function ThemeProvider({ children }: React.PropsWithChildren) {
    return (
        <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
            {children}
        </MantineProvider>
    );
}
