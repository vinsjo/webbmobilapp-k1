import React from 'react';
import { MantineProvider, type MantineTheme } from '@mantine/core';

const theme: Partial<MantineTheme> = {
    fontFamily: 'Roboto, sans-serif',
    fontFamilyMonospace: 'Roboto Mono, monospace',
    colorScheme: 'dark',
    focusRing: 'never',
    cursorType: 'pointer',
    primaryColor: 'gray',
};

export default function ThemeProvider({ children }: React.PropsWithChildren) {
    return (
        <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
            {children}
        </MantineProvider>
    );
}
