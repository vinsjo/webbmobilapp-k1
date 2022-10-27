import React from 'react';
import {
    MantineProvider,
    DEFAULT_THEME,
    type MantineTheme,
    type MantineSizes,
} from '@mantine/core';

const mainFont = 'Roboto, sans-serif';
const monoFont = 'Roboto Mono, monospace';

const spacing: MantineSizes = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
};

const fontSizes: MantineSizes = {
    ...DEFAULT_THEME.fontSizes,
};

const headings = (() => {
    const { h1, h2, h3, h4, h5, h6 } = DEFAULT_THEME.headings.sizes;
    console.log(DEFAULT_THEME.headings.sizes);
    const headings: MantineTheme['headings'] = {
        fontFamily: mainFont,
        fontWeight: 700,
        sizes: {
            h1: { ...h1, fontSize: Math.round(fontSizes.xl * 1.3) },
            h2: { ...h2, fontSize: fontSizes.xl },
            h3: { ...h3, fontSize: fontSizes.lg },
            h4: { ...h4, fontSize: fontSizes.md },
            h5: { ...h5, fontSize: fontSizes.sm },
            h6: { ...h6, fontSize: fontSizes.xs },
        },
    };
    return headings;
})();

console.log(headings);

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
    spacing,
    headings,
};

export default function ThemeProvider({ children }: React.PropsWithChildren) {
    return (
        <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
            {children}
        </MantineProvider>
    );
}
