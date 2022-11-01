import { useEffect, useMemo, useState } from 'react';
import {
    useRouteError,
    isRouteErrorResponse,
    Navigate,
    Link,
} from 'react-router-dom';
import { Button, Stack, Text, Title } from '@mantine/core';
import Layout from '@/components/Layout';
import { ThemeProvider } from '@/components/providers';

export default function RouteError({
    redirectCountdown = 15,
}: {
    redirectCountdown?: number;
}) {
    const error = useRouteError();
    const [countdown, setCountdown] = useState(redirectCountdown);

    const errorOutput = useMemo(() => {
        return !isRouteErrorResponse(error)
            ? 'An error occurred...'
            : `${error.status} - ${error.statusText}`;
    }, [error]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return countdown <= 0 ? (
        <Navigate to="/" replace />
    ) : (
        <ThemeProvider>
            <Layout>
                <Stack spacing="xl" py="xl" align="center">
                    <Title order={2}>Oh no!</Title>
                    <Text
                        size="lg"
                        py="sm"
                        px="md"
                        align="center"
                        sx={(theme) => ({
                            fontFamily: theme.fontFamilyMonospace,
                            background: theme.colors.gray[9],
                            borderRadius: theme.radius.md,
                        })}
                    >
                        {errorOutput}
                    </Text>

                    <Text>
                        Navigating to homepage in
                        <Text
                            align="center"
                            style={{
                                display: 'inline-block',
                                width: `${
                                    redirectCountdown.toString().length + 1.5
                                }ch`,
                            }}
                        >
                            {countdown}
                        </Text>
                        seconds
                    </Text>
                    <Button component={Link} to="/" title="Home">
                        Go back now
                    </Button>
                </Stack>
            </Layout>
        </ThemeProvider>
    );
}
