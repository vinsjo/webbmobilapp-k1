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

// const fontSizes = {
//     xs: 10,
//     sm: 12,
//     md: 14,
//     lg: 16,
//     xl: 20,
// };

// const headings: MantineTheme['headings'] = {
//     fontFamily: mainFont,
//     fontWeight: 700,
//     sizes: (
//         Object.keys(DEFAULT_THEME.headings.sizes) as Array<
//             keyof typeof DEFAULT_THEME.headings.sizes
//         >
//     ).reduce((sizes, key) => {
//         const { fontSize, ...defaults } = DEFAULT_THEME.headings.sizes[key];
//         return {
//             ...sizes,
//             [key]: {
//                 ...defaults,
//                 fontSize:
//                     typeof fontSize === 'number'
//                         ? Math.floor(fontSize * 0.8)
//                         : fontSize,
//             },
//         };
//     }, {}) as typeof DEFAULT_THEME.headings.sizes,
// };

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

console.log('DEFAULT_THEME: ', DEFAULT_THEME);

export default function ThemeProvider({ children }: React.PropsWithChildren) {
    return (
        <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
            {children}
        </MantineProvider>
    );
}
