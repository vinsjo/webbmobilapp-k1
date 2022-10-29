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

    const pageTitle = useMemo(() => {
        switch (activePath) {
            case '/calendar':
                return 'Calendar';
            case '/overview':
                return 'Overview';
            default:
                return 'Time Tracker';
        }
    }, [activePath]);

    return (
        <AppShell
            navbarOffsetBreakpoint="sm"
            header={<Header height={50} title={pageTitle} />}
            footer={<Footer height={70} activePath={activePath} />}
        >
            {props.children}
        </AppShell>
    );
}
