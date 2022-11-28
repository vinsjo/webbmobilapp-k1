import React, { Suspense, SuspenseProps } from 'react';

export default function lazyWithSuspense(
    url: string,
    props: Omit<SuspenseProps, 'children'> = { fallback: 'Loading...' }
) {
    const Component = React.lazy(() => import(url));
    console.log(Component);
    // eslint-disable-next-line react/display-name
    return () => {
        return (
            <Suspense {...(props || {})}>
                <Component />
            </Suspense>
        );
    };
}
