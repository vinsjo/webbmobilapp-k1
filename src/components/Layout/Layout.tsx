import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { AppShell } from '@mantine/core';
import Footer from './Footer';
import Header from './Header';

export default function Layout(props: React.PropsWithChildren) {
    const { pathname } = useLocation();

    const activePath = useMemo(() => {
        const basePath = pathname.split('/').filter((p) => p)[0] || '';
        return `/${basePath}`;
    }, [pathname]);

    return (
        <AppShell
            navbarOffsetBreakpoint="sm"
            header={<Header height={50} />}
            footer={<Footer height={70} activePath={activePath} />}
        >
            {props.children}
        </AppShell>
    );
}
