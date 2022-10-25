import { useEffect, useState } from 'react';
import { useRouteError, Navigate } from 'react-router-dom';
import { Stack, Text } from '@mantine/core';
import Layout from '@/components/Layout';

export default function RouteError() {
    const error = useRouteError();
    const [countdown, setCountdown] = useState(15);

    useEffect(() => {
        console.error('Route Error: ', error);
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
        <Layout>
            <Stack>
                <Text>An error occurred...</Text>
                <Text>
                    Navigating to homepage in
                    <Text
                        align="center"
                        sx={{
                            display: 'inline-block',
                            width: '4ch',
                        }}
                    >
                        {countdown}
                    </Text>{' '}
                    seconds
                </Text>
            </Stack>
        </Layout>
    );
}
