import { MantineProvider, Box } from '@mantine/core';

const Layout = (props: React.PropsWithChildren) => {
    return (
        <MantineProvider withGlobalStyles withNormalizeCSS>
            <Box>{props.children}</Box>
        </MantineProvider>
    );
};

export default Layout;
