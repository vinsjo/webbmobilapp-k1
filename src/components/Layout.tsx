import { useMemo } from 'react';
import { MantineProvider, Box, type MantineTheme } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';

const Layout = (props: React.PropsWithChildren) => {
    const colorScheme = useColorScheme();
    const theme = useMemo<Partial<MantineTheme>>(() => {
        return {
            colorScheme,
            focusRing: 'never',
            primaryColor: 'gray',
        };
    }, [colorScheme]);

    return (
        <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
            <Box>{props.children}</Box>
        </MantineProvider>
    );
};

export default Layout;
