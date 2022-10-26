import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AppShell } from '@mantine/core';
import Navbar from './Navbar';
import Header from './Header';

export default function Layout(props: React.PropsWithChildren) {
    const { pathname } = useLocation();
    const [hiddenNav, setHiddenNav] = useState(true);

    const activePath = useMemo(() => {
        const basePath = pathname.split('/').filter((p) => p)[0] || '';
        return `/${basePath}`;
    }, [pathname]);

    useEffect(() => setHiddenNav(true), [pathname]);

    return (
        <AppShell
            navbarOffsetBreakpoint="sm"
            navbar={
                <Navbar
                    activePath={activePath}
                    hidden={hiddenNav}
                    setHidden={setHiddenNav}
                />
            }
            header={
                <Header
                    openBurger={!hiddenNav}
                    toggleBurger={() => setHiddenNav(!hiddenNav)}
                />
            }
        >
            {props.children}
        </AppShell>
    );
}
