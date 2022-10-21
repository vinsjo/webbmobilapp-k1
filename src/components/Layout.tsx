import { MantineProvider, Box } from '@mantine/core';
import type { MantineTheme } from '@mantine/core';

const theme: Partial<MantineTheme> = {
    colorScheme: 'dark',
    focusRing: 'never',
    primaryColor: 'gray',
};

const Layout = (props: React.PropsWithChildren) => {
    return (
        <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
            <Box>{props.children}</Box>
        </MantineProvider>
    );
};

export default Layout;
