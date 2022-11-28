import React from 'react';

type Props = { children: React.ReactNode; fallback?: React.ReactNode };

// Error boundaries currently have to be classes.
export default class ErrorBoundary extends React.Component<Props> {
    state: { error: Error | null } = { error: null };
    static getDerivedStateFromError(error: unknown) {
        return {
            error:
                error instanceof Error
                    ? error
                    : new Error(
                          typeof error === 'string'
                              ? error
                              : 'An unknown error occurred...'
                      ),
        };
    }
    render() {
        const { children, fallback } = this.props;
        const { error } = this.state;
        if (error) {
            return (
                fallback || (
                    <h3>
                        <code>Error: {error.message}</code>
                    </h3>
                )
            );
        }
        return children;
    }
}
