import { useEffect, useState } from 'react';
import { useRouteError, Navigate } from 'react-router-dom';
import { Box, Text } from '@mantine/core';
const RouteError = () => {
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
        <Box>
            <Text>An error occurred :(</Text>
            <Text>
                Navigating to homepage in <Text>{countdown}</Text> seconds
            </Text>
        </Box>
    );
};

export default RouteError;
